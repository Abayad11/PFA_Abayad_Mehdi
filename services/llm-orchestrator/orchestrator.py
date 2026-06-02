"""
LLM Orchestrator - Logique d'orchestration principale
"""

import asyncio
import httpx
from typing import List, Dict, Any, Optional
from loguru import logger
from datetime import datetime

from config import settings
from models import (
    OrchestratorRequest,
    OrchestratorResponse,
    LLMResponse,
    RoutingDecision,
    RAGResult,
    QueryType,
    LLMType,
    ValidationResult
)
from rag_engine import RAGEngine
from guardrails import MedicalGuardrails


class LLMOrchestrator:
    """Orchestrateur principal des LLMs spécialisés"""
    
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.rag_engine: Optional[RAGEngine] = None
        self.guardrails: Optional[MedicalGuardrails] = None
        self.http_client: Optional[httpx.AsyncClient] = None
        self.llm_services = {
            LLMType.VISION: settings.LLM_VISION_URL,
            LLMType.TEXT: settings.LLM_TEXT_URL,
            LLMType.FHIR: settings.LLM_FHIR_URL,
            LLMType.RESEARCH: settings.LLM_RESEARCH_URL
        }
    
    async def initialize(self):
        """Initialisation de l'orchestrateur"""
        logger.info("🔧 Initialisation de l'orchestrateur...")
        
        # Initialisation du client HTTP
        self.http_client = httpx.AsyncClient(timeout=30.0)
        
        # Initialisation du RAG Engine
        logger.info("📚 Initialisation du RAG Engine...")
        self.rag_engine = RAGEngine()
        await self.rag_engine.initialize()
        
        # Initialisation des guardrails
        logger.info("🛡️ Initialisation des guardrails médicaux...")
        self.guardrails = MedicalGuardrails()
        await self.guardrails.initialize()
        
        # Chargement du modèle DeepSeek R1 (simulé pour l'instant)
        logger.info(f"🤖 Chargement du modèle {settings.MODEL_NAME}...")
        await self._load_model()
        
        logger.success("✅ Orchestrateur initialisé avec succès")
    
    async def _load_model(self):
        """Chargement du modèle DeepSeek R1"""
        # TODO: Implémenter le chargement réel du modèle
        # Pour l'instant, simulation
        logger.info("⚠️ Mode simulation - modèle non chargé (à implémenter)")
        self.model = "simulated"
        self.tokenizer = "simulated"
    
    async def cleanup(self):
        """Nettoyage des ressources"""
        if self.http_client:
            await self.http_client.aclose()
        if self.rag_engine:
            await self.rag_engine.cleanup()
    
    async def check_health(self) -> Dict[str, Any]:
        """Vérification de l'état de santé"""
        llm_services_status = {}
        
        # Vérification des services LLM
        for llm_type, url in self.llm_services.items():
            try:
                response = await self.http_client.get(f"{url}/health", timeout=5.0)
                llm_services_status[llm_type.value] = response.status_code == 200
            except:
                llm_services_status[llm_type.value] = False
        
        return {
            "status": "healthy" if self.model else "degraded",
            "model_loaded": self.model is not None,
            "llm_services_status": llm_services_status,
            "database_connected": await self.rag_engine.check_db_connection() if self.rag_engine else False,
            "redis_connected": True  # TODO: Implémenter vérification Redis
        }
    
    async def process_request(self, request: OrchestratorRequest) -> OrchestratorResponse:
        """
        Traitement principal d'une requête
        
        Pipeline:
        1. Analyse de la requête
        2. Recherche RAG (si activée)
        3. Décision de routage
        4. Appel des LLMs spécialisés
        5. Agrégation des réponses
        6. Validation médicale
        7. Génération de la réponse finale
        """
        start_time = datetime.utcnow()
        
        # 1. Analyse de la requête
        logger.info("🔍 Analyse de la requête...")
        query_analysis = await self.analyze_query(request.query, request.context)
        
        # 2. Recherche RAG
        rag_results = None
        if request.include_rag:
            logger.info("📚 Recherche RAG...")
            rag_results = await self.rag_search(
                query=request.query,
                patient_id=request.context.patient_id if request.context else None,
                top_k=settings.TOP_K_RETRIEVAL
            )
        
        # 3. Décision de routage
        logger.info("🧭 Décision de routage...")
        routing_decision = await self._make_routing_decision(
            query=request.query,
            analysis=query_analysis,
            rag_results=rag_results
        )
        
        # 4. Appel des LLMs spécialisés
        logger.info(f"🚀 Appel des LLMs: {[llm.value for llm in routing_decision.llms_to_use]}")
        individual_responses = await self._call_specialized_llms(
            query=request.query,
            llms_to_use=routing_decision.llms_to_use,
            context=request.context,
            rag_results=rag_results,
            parallel=routing_decision.parallel_execution
        )
        
        # 5. Agrégation des réponses
        logger.info("🔄 Agrégation des réponses...")
        aggregated_response = await self._aggregate_responses(
            query=request.query,
            individual_responses=individual_responses,
            rag_results=rag_results
        )
        
        # 6. Validation médicale
        logger.info("🛡️ Validation médicale...")
        validation = await self.validate_response(
            response_text=aggregated_response,
            context=request.context
        )
        
        warnings = []
        if not validation["is_valid"]:
            warnings.append("⚠️ La réponse nécessite une validation médicale supplémentaire")
            warnings.extend(validation.get("warnings", []))
        
        # 7. Génération de la réponse finale
        processing_time = (datetime.utcnow() - start_time).total_seconds()
        
        return OrchestratorResponse(
            query=request.query,
            response=aggregated_response,
            query_type=routing_decision.query_type,
            llms_used=routing_decision.llms_to_use,
            routing_decision=routing_decision,
            individual_responses=individual_responses,
            rag_results=rag_results,
            confidence=validation["confidence"],
            processing_time_seconds=processing_time,
            warnings=warnings if warnings else None
        )
    
    async def analyze_query(self, query: str, context: Optional[Any] = None) -> Dict[str, Any]:
        """Analyse d'une requête médicale"""
        # TODO: Implémenter l'analyse avec DeepSeek R1
        # Pour l'instant, analyse basique
        
        query_lower = query.lower()
        
        # Détection du type de requête
        if any(word in query_lower for word in ["irm", "scanner", "radio", "image", "échographie"]):
            query_type = QueryType.RADIOLOGY
        elif any(word in query_lower for word in ["fhir", "hl7", "interopérabilité"]):
            query_type = QueryType.FHIR_EXTRACTION
        elif any(word in query_lower for word in ["étude", "recherche", "littérature", "pubmed"]):
            query_type = QueryType.LITERATURE_SEARCH
        elif any(word in query_lower for word in ["diagnostic", "symptômes", "maladie"]):
            query_type = QueryType.DIAGNOSTIC
        elif any(word in query_lower for word in ["prescription", "médicament", "traitement"]):
            query_type = QueryType.PRESCRIPTION
        else:
            query_type = QueryType.GENERAL
        
        return {
            "query_type": query_type,
            "complexity": "medium",  # TODO: Calculer la complexité
            "requires_images": "image" in query_lower or "irm" in query_lower,
            "requires_rag": True,
            "medical_entities": [],  # TODO: Extraire les entités médicales
            "confidence": 0.85
        }
    
    async def _make_routing_decision(
        self,
        query: str,
        analysis: Dict[str, Any],
        rag_results: Optional[List[RAGResult]]
    ) -> RoutingDecision:
        """Décision de routage vers les LLMs spécialisés"""
        query_type = analysis["query_type"]
        llms_to_use = []
        
        # Logique de routage basée sur le type de requête
        if query_type == QueryType.RADIOLOGY:
            llms_to_use = [LLMType.VISION, LLMType.TEXT]
        elif query_type == QueryType.FHIR_EXTRACTION:
            llms_to_use = [LLMType.FHIR]
        elif query_type == QueryType.LITERATURE_SEARCH:
            llms_to_use = [LLMType.RESEARCH]
        elif query_type in [QueryType.DIAGNOSTIC, QueryType.PRESCRIPTION]:
            llms_to_use = [LLMType.TEXT]
        else:
            llms_to_use = [LLMType.TEXT]
        
        return RoutingDecision(
            query_type=query_type,
            llms_to_use=llms_to_use,
            reasoning=f"Requête de type {query_type.value}, routage vers {[llm.value for llm in llms_to_use]}",
            confidence=analysis.get("confidence", 0.85),
            parallel_execution=len(llms_to_use) > 1
        )
    
    async def _call_specialized_llms(
        self,
        query: str,
        llms_to_use: List[LLMType],
        context: Optional[Any],
        rag_results: Optional[List[RAGResult]],
        parallel: bool = True
    ) -> List[LLMResponse]:
        """Appel des LLMs spécialisés"""
        
        async def call_llm(llm_type: LLMType) -> LLMResponse:
            """Appel d'un LLM spécifique"""
            start_time = datetime.utcnow()
            
            try:
                url = self.llm_services[llm_type]
                payload = {
                    "query": query,
                    "context": context.dict() if context else None,
                    "rag_results": [r.dict() for r in rag_results] if rag_results else None
                }
                
                response = await self.http_client.post(
                    f"{url}/process",
                    json=payload,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    processing_time = (datetime.utcnow() - start_time).total_seconds()
                    
                    return LLMResponse(
                        llm_type=llm_type,
                        response=data.get("response", ""),
                        confidence=data.get("confidence", 0.8),
                        processing_time=processing_time,
                        metadata=data.get("metadata")
                    )
                else:
                    logger.warning(f"⚠️ LLM {llm_type.value} a retourné le code {response.status_code}")
                    return LLMResponse(
                        llm_type=llm_type,
                        response=f"Service {llm_type.value} temporairement indisponible",
                        confidence=0.0,
                        processing_time=0.0
                    )
                    
            except Exception as e:
                logger.error(f"❌ Erreur lors de l'appel à {llm_type.value}: {e}")
                return LLMResponse(
                    llm_type=llm_type,
                    response=f"Erreur: {str(e)}",
                    confidence=0.0,
                    processing_time=0.0
                )
        
        # Exécution parallèle ou séquentielle
        if parallel:
            responses = await asyncio.gather(*[call_llm(llm) for llm in llms_to_use])
        else:
            responses = []
            for llm in llms_to_use:
                response = await call_llm(llm)
                responses.append(response)
        
        return responses
    
    async def _aggregate_responses(
        self,
        query: str,
        individual_responses: List[LLMResponse],
        rag_results: Optional[List[RAGResult]]
    ) -> str:
        """Agrégation des réponses des LLMs spécialisés"""
        # TODO: Implémenter l'agrégation avec DeepSeek R1
        # Pour l'instant, agrégation simple
        
        if not individual_responses:
            return "Aucune réponse disponible."
        
        # Filtrer les réponses valides
        valid_responses = [r for r in individual_responses if r.confidence > 0.5]
        
        if not valid_responses:
            return "Les services spécialisés sont temporairement indisponibles."
        
        # Agrégation simple (à améliorer avec DeepSeek R1)
        aggregated = "**Synthèse médicale:**\n\n"
        
        for response in valid_responses:
            aggregated += f"**{response.llm_type.value.upper()}:**\n{response.response}\n\n"
        
        if rag_results:
            aggregated += "\n**Contexte médical pertinent:**\n"
            for result in rag_results[:3]:
                aggregated += f"- {result.content[:200]}...\n"
        
        return aggregated
    
    async def rag_search(
        self,
        query: str,
        patient_id: Optional[str] = None,
        top_k: int = 5
    ) -> List[RAGResult]:
        """Recherche RAG dans la base de connaissances"""
        if not self.rag_engine:
            return []
        
        return await self.rag_engine.search(query, patient_id, top_k)
    
    async def validate_response(
        self,
        response_text: str,
        context: Optional[Any] = None
    ) -> Dict[str, Any]:
        """Validation médicale d'une réponse"""
        if not self.guardrails:
            return {
                "is_valid": True,
                "confidence": 0.8,
                "warnings": [],
                "errors": []
            }
        
        return await self.guardrails.validate(response_text, context)
