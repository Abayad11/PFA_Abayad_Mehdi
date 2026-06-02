"""
Service LLM Orchestrateur - DeepSeek R1
Orchestration intelligente des LLMs spécialisés pour Abhar Santé Maroc
Auteurs: Mehdi Abayad, Zahra Zhar
"""

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uvicorn
from loguru import logger
import sys

from config import settings
from orchestrator import LLMOrchestrator
from models import (
    OrchestratorRequest,
    OrchestratorResponse,
    HealthResponse,
    MetricsResponse
)
from middleware import rate_limiter, verify_api_key
from monitoring import metrics_collector

# Configuration du logger
logger.remove()
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan> - <level>{message}</level>",
    level=settings.LOG_LEVEL
)

# Initialisation de l'application FastAPI
app = FastAPI(
    title="LLM Orchestrator - Abhar Santé Maroc",
    description="Service d'orchestration intelligente des LLMs médicaux avec DeepSeek R1",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À restreindre en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialisation de l'orchestrateur
orchestrator: Optional[LLMOrchestrator] = None


@app.on_event("startup")
async def startup_event():
    """Initialisation au démarrage du service"""
    global orchestrator
    logger.info("🚀 Démarrage du service LLM Orchestrator...")
    
    try:
        orchestrator = LLMOrchestrator()
        await orchestrator.initialize()
        logger.success("✅ LLM Orchestrator initialisé avec succès")
    except Exception as e:
        logger.error(f"❌ Erreur lors de l'initialisation: {e}")
        raise


@app.on_event("shutdown")
async def shutdown_event():
    """Nettoyage à l'arrêt du service"""
    logger.info("🛑 Arrêt du service LLM Orchestrator...")
    if orchestrator:
        await orchestrator.cleanup()
    logger.info("👋 Service arrêté proprement")


@app.get("/", response_model=Dict[str, str])
async def root():
    """Endpoint racine"""
    return {
        "service": "LLM Orchestrator",
        "version": "1.0.0",
        "status": "operational",
        "model": settings.MODEL_NAME,
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Vérification de l'état de santé du service"""
    try:
        if not orchestrator:
            raise HTTPException(status_code=503, detail="Orchestrator not initialized")
        
        health_status = await orchestrator.check_health()
        return HealthResponse(**health_status)
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail=str(e))


@app.get("/metrics", response_model=MetricsResponse)
async def get_metrics():
    """Récupération des métriques du service"""
    try:
        metrics = metrics_collector.get_metrics()
        return MetricsResponse(**metrics)
    except Exception as e:
        logger.error(f"Metrics retrieval failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/orchestrate", response_model=OrchestratorResponse)
async def orchestrate_request(
    request: OrchestratorRequest,
    api_key: str = Depends(verify_api_key),
    rate_limit: bool = Depends(rate_limiter)
):
    """
    Endpoint principal d'orchestration
    
    Analyse la requête médicale et route intelligemment vers les LLMs spécialisés
    """
    start_time = datetime.utcnow()
    
    try:
        logger.info(f"📥 Nouvelle requête d'orchestration: {request.query[:100]}...")
        
        # Validation de la requête
        if not request.query or len(request.query.strip()) < 3:
            raise HTTPException(
                status_code=400,
                detail="La requête doit contenir au moins 3 caractères"
            )
        
        # Orchestration
        response = await orchestrator.process_request(request)
        
        # Calcul du temps de traitement
        processing_time = (datetime.utcnow() - start_time).total_seconds()
        response.processing_time_seconds = processing_time
        
        # Enregistrement des métriques
        metrics_collector.record_request(
            success=True,
            processing_time=processing_time,
            llms_used=response.llms_used
        )
        
        logger.success(f"✅ Requête traitée en {processing_time:.2f}s")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erreur lors de l'orchestration: {e}")
        metrics_collector.record_request(success=False)
        raise HTTPException(status_code=500, detail=f"Erreur interne: {str(e)}")


@app.post("/analyze-medical-query")
async def analyze_medical_query(
    request: OrchestratorRequest,
    api_key: str = Depends(verify_api_key)
):
    """
    Analyse une requête médicale sans orchestration complète
    Retourne l'analyse et le plan de routage
    """
    try:
        logger.info(f"🔍 Analyse de requête médicale: {request.query[:100]}...")
        
        analysis = await orchestrator.analyze_query(request.query, request.context)
        
        return {
            "query": request.query,
            "analysis": analysis,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"❌ Erreur lors de l'analyse: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/rag-search")
async def rag_search(
    query: str,
    patient_id: Optional[str] = None,
    top_k: int = 5,
    api_key: str = Depends(verify_api_key)
):
    """
    Recherche RAG dans la base de connaissances médicales
    """
    try:
        logger.info(f"🔍 Recherche RAG: {query[:100]}...")
        
        results = await orchestrator.rag_search(
            query=query,
            patient_id=patient_id,
            top_k=top_k
        )
        
        return {
            "query": query,
            "results": results,
            "count": len(results),
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"❌ Erreur lors de la recherche RAG: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/validate-medical-response")
async def validate_medical_response(
    response_text: str,
    context: Optional[Dict[str, Any]] = None,
    api_key: str = Depends(verify_api_key)
):
    """
    Validation médicale d'une réponse générée
    Détecte les hallucinations et erreurs médicales
    """
    try:
        logger.info("🛡️ Validation de réponse médicale...")
        
        validation = await orchestrator.validate_response(response_text, context)
        
        return {
            "is_valid": validation["is_valid"],
            "confidence": validation["confidence"],
            "warnings": validation.get("warnings", []),
            "errors": validation.get("errors", []),
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"❌ Erreur lors de la validation: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.SERVICE_HOST,
        port=settings.SERVICE_PORT,
        reload=True,
        log_level=settings.LOG_LEVEL.lower()
    )
