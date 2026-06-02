"""
RAG Engine - Retrieval Augmented Generation
Recherche sémantique dans la base de connaissances médicales avec pgvector
"""

import asyncio
from typing import List, Optional, Dict, Any
from loguru import logger
import asyncpg
from sentence_transformers import SentenceTransformer

from config import settings
from models import RAGResult


class RAGEngine:
    """Moteur de recherche RAG avec pgvector"""
    
    def __init__(self):
        self.embedding_model: Optional[SentenceTransformer] = None
        self.db_pool: Optional[asyncpg.Pool] = None
    
    async def initialize(self):
        """Initialisation du RAG Engine"""
        logger.info("📚 Initialisation du RAG Engine...")
        
        # Chargement du modèle d'embeddings
        logger.info(f"🔤 Chargement du modèle d'embeddings: {settings.EMBEDDING_MODEL}")
        try:
            self.embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)
            logger.success("✅ Modèle d'embeddings chargé")
        except Exception as e:
            logger.error(f"❌ Erreur lors du chargement du modèle: {e}")
            raise
        
        # Connexion à la base de données
        logger.info("🔌 Connexion à PostgreSQL...")
        try:
            self.db_pool = await asyncpg.create_pool(
                settings.DATABASE_URL,
                min_size=2,
                max_size=10
            )
            logger.success("✅ Connexion PostgreSQL établie")
            
            # Vérification de l'extension pgvector
            await self._ensure_pgvector_extension()
            
        except Exception as e:
            logger.error(f"❌ Erreur de connexion PostgreSQL: {e}")
            raise
    
    async def _ensure_pgvector_extension(self):
        """Vérification et création de l'extension pgvector"""
        async with self.db_pool.acquire() as conn:
            try:
                await conn.execute("CREATE EXTENSION IF NOT EXISTS vector;")
                logger.info("✅ Extension pgvector activée")
            except Exception as e:
                logger.warning(f"⚠️ Impossible d'activer pgvector: {e}")
    
    async def cleanup(self):
        """Nettoyage des ressources"""
        if self.db_pool:
            await self.db_pool.close()
    
    async def check_db_connection(self) -> bool:
        """Vérification de la connexion à la base de données"""
        if not self.db_pool:
            return False
        
        try:
            async with self.db_pool.acquire() as conn:
                await conn.fetchval("SELECT 1")
            return True
        except:
            return False
    
    def _generate_embedding(self, text: str) -> List[float]:
        """Génération d'un embedding pour un texte"""
        if not self.embedding_model:
            raise RuntimeError("Modèle d'embeddings non initialisé")
        
        embedding = self.embedding_model.encode(text, convert_to_numpy=True)
        return embedding.tolist()
    
    async def search(
        self,
        query: str,
        patient_id: Optional[str] = None,
        top_k: int = 5
    ) -> List[RAGResult]:
        """
        Recherche sémantique dans la base de connaissances
        
        Args:
            query: Requête de recherche
            patient_id: ID du patient (pour filtrer sur son historique)
            top_k: Nombre de résultats à retourner
        
        Returns:
            Liste de résultats RAG
        """
        if not self.db_pool:
            logger.warning("⚠️ Base de données non connectée")
            return []
        
        try:
            # Génération de l'embedding de la requête
            query_embedding = self._generate_embedding(query)
            
            # Recherche dans la base de données
            async with self.db_pool.acquire() as conn:
                # Recherche dans les documents médicaux généraux
                general_results = await self._search_general_knowledge(
                    conn, query_embedding, top_k
                )
                
                # Recherche dans l'historique patient si patient_id fourni
                patient_results = []
                if patient_id:
                    patient_results = await self._search_patient_history(
                        conn, patient_id, query_embedding, top_k
                    )
                
                # Fusion et tri des résultats
                all_results = general_results + patient_results
                all_results.sort(key=lambda x: x.relevance_score, reverse=True)
                
                return all_results[:top_k]
                
        except Exception as e:
            logger.error(f"❌ Erreur lors de la recherche RAG: {e}")
            return []
    
    async def _search_general_knowledge(
        self,
        conn: asyncpg.Connection,
        query_embedding: List[float],
        top_k: int
    ) -> List[RAGResult]:
        """Recherche dans la base de connaissances générale"""
        try:
            # Requête de similarité cosinus avec pgvector
            query = """
                SELECT 
                    content,
                    source,
                    metadata,
                    1 - (embedding <=> $1::vector) as similarity
                FROM medical_knowledge
                WHERE 1 - (embedding <=> $1::vector) > 0.5
                ORDER BY embedding <=> $1::vector
                LIMIT $2
            """
            
            rows = await conn.fetch(query, query_embedding, top_k)
            
            results = []
            for row in rows:
                results.append(RAGResult(
                    content=row['content'],
                    source=row['source'],
                    relevance_score=float(row['similarity']),
                    metadata=row['metadata'] if row['metadata'] else None
                ))
            
            return results
            
        except Exception as e:
            logger.error(f"❌ Erreur recherche connaissances générales: {e}")
            return []
    
    async def _search_patient_history(
        self,
        conn: asyncpg.Connection,
        patient_id: str,
        query_embedding: List[float],
        top_k: int
    ) -> List[RAGResult]:
        """Recherche dans l'historique d'un patient spécifique"""
        try:
            query = """
                SELECT 
                    content,
                    'patient_history' as source,
                    metadata,
                    1 - (embedding <=> $1::vector) as similarity
                FROM patient_documents
                WHERE patient_id = $2
                  AND 1 - (embedding <=> $1::vector) > 0.5
                ORDER BY embedding <=> $1::vector
                LIMIT $3
            """
            
            rows = await conn.fetch(query, query_embedding, patient_id, top_k)
            
            results = []
            for row in rows:
                results.append(RAGResult(
                    content=row['content'],
                    source=f"Historique patient",
                    relevance_score=float(row['similarity']),
                    metadata={
                        **(row['metadata'] if row['metadata'] else {}),
                        'patient_id': patient_id
                    }
                ))
            
            return results
            
        except Exception as e:
            logger.error(f"❌ Erreur recherche historique patient: {e}")
            return []
    
    async def index_document(
        self,
        content: str,
        source: str,
        metadata: Optional[Dict[str, Any]] = None,
        patient_id: Optional[str] = None
    ) -> bool:
        """
        Indexation d'un document dans la base de connaissances
        
        Args:
            content: Contenu du document
            source: Source du document
            metadata: Métadonnées additionnelles
            patient_id: ID patient si document spécifique à un patient
        
        Returns:
            True si succès, False sinon
        """
        if not self.db_pool:
            logger.warning("⚠️ Base de données non connectée")
            return False
        
        try:
            # Génération de l'embedding
            embedding = self._generate_embedding(content)
            
            async with self.db_pool.acquire() as conn:
                if patient_id:
                    # Insertion dans patient_documents
                    await conn.execute("""
                        INSERT INTO patient_documents (patient_id, content, source, embedding, metadata)
                        VALUES ($1, $2, $3, $4::vector, $5)
                    """, patient_id, content, source, embedding, metadata)
                else:
                    # Insertion dans medical_knowledge
                    await conn.execute("""
                        INSERT INTO medical_knowledge (content, source, embedding, metadata)
                        VALUES ($1, $2, $3::vector, $4)
                    """, content, source, embedding, metadata)
            
            logger.info(f"✅ Document indexé: {source}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'indexation: {e}")
            return False
    
    async def create_tables_if_not_exist(self):
        """Création des tables nécessaires si elles n'existent pas"""
        if not self.db_pool:
            return
        
        async with self.db_pool.acquire() as conn:
            # Table de connaissances médicales générales
            await conn.execute(f"""
                CREATE TABLE IF NOT EXISTS medical_knowledge (
                    id SERIAL PRIMARY KEY,
                    content TEXT NOT NULL,
                    source TEXT NOT NULL,
                    embedding vector({settings.VECTOR_DIMENSION}),
                    metadata JSONB,
                    created_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS medical_knowledge_embedding_idx 
                ON medical_knowledge USING ivfflat (embedding vector_cosine_ops);
            """)
            
            # Table des documents patients
            await conn.execute(f"""
                CREATE TABLE IF NOT EXISTS patient_documents (
                    id SERIAL PRIMARY KEY,
                    patient_id TEXT NOT NULL,
                    content TEXT NOT NULL,
                    source TEXT NOT NULL,
                    embedding vector({settings.VECTOR_DIMENSION}),
                    metadata JSONB,
                    created_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS patient_documents_embedding_idx 
                ON patient_documents USING ivfflat (embedding vector_cosine_ops);
                
                CREATE INDEX IF NOT EXISTS patient_documents_patient_id_idx 
                ON patient_documents (patient_id);
            """)
            
            logger.info("✅ Tables RAG créées/vérifiées")
