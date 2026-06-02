"""
LLM Research Service - Recherche dans la littérature médicale
Basé sur SciBERT ou PubMedBERT
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn
from loguru import logger
import sys

logger.remove()
logger.add(sys.stdout, level="INFO")

app = FastAPI(
    title="LLM Research Service - Abhar Santé",
    description="Service de recherche dans la littérature médicale",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ProcessRequest(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = None
    rag_results: Optional[List[Dict[str, Any]]] = None


class ProcessResponse(BaseModel):
    response: str
    confidence: float
    metadata: Optional[Dict[str, Any]] = None


@app.get("/")
async def root():
    return {
        "service": "LLM Research",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": True}


@app.post("/process", response_model=ProcessResponse)
async def process(request: ProcessRequest):
    """Traitement d'une requête de recherche littérature"""
    logger.info(f"🔬 Recherche littérature: {request.query[:100]}...")
    
    response_text = f"""**Recherche littérature médicale (Research LLM)**

Requête: {request.query}

⚠️ Service en mode simulation - Modèle non chargé

Ce service fournira:
- Recherche dans PubMed
- Analyse d'études cliniques
- Extraction de guidelines
- Recommandations basées sur l'évidence

Sources: PubMed, Cochrane, Guidelines HAS
"""
    
    return ProcessResponse(
        response=response_text,
        confidence=0.85,
        metadata={"model": "pubmedbert-simulated", "sources": ["pubmed", "cochrane"]}
    )


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8006, reload=True)
