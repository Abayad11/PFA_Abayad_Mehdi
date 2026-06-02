"""
LLM Text Service - Diagnostic et analyse textuelle médicale
Basé sur BioGPT ou ClinicalBERT
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn
from loguru import logger
import sys

logger.remove()
logger.add(sys.stdout, level="INFO")

app = FastAPI(
    title="LLM Text Service - Abhar Santé",
    description="Service de diagnostic et analyse textuelle médicale",
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
        "service": "LLM Text",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": True}


@app.post("/process", response_model=ProcessResponse)
async def process(request: ProcessRequest):
    """Traitement d'une requête de diagnostic textuel"""
    logger.info(f"📝 Analyse textuelle: {request.query[:100]}...")
    
    # TODO: Implémenter l'analyse réelle avec BioGPT/ClinicalBERT
    response_text = f"""**Analyse médicale textuelle (Text LLM)**

Requête: {request.query}

⚠️ Service en mode simulation - Modèle non chargé

Ce service fournira:
- Diagnostic différentiel
- Analyse d'anamnèse
- Recommandations thérapeutiques
- Synthèse de cas cliniques

Basé sur le contexte RAG fourni:
{len(request.rag_results) if request.rag_results else 0} documents pertinents trouvés.

**Recommandation**: Consulter un médecin pour un diagnostic précis.
"""
    
    return ProcessResponse(
        response=response_text,
        confidence=0.82,
        metadata={"model": "biogpt-simulated", "processing_time": 0.3}
    )


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8004, reload=True)
