"""
Modèles de données pour le service LLM Orchestrator
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class QueryType(str, Enum):
    """Types de requêtes médicales"""
    DIAGNOSTIC = "diagnostic"
    RADIOLOGY = "radiology"
    PRESCRIPTION = "prescription"
    ANAMNESIS = "anamnesis"
    FHIR_EXTRACTION = "fhir_extraction"
    LITERATURE_SEARCH = "literature_search"
    GENERAL = "general"


class LLMType(str, Enum):
    """Types de LLMs spécialisés"""
    VISION = "vision"
    TEXT = "text"
    FHIR = "fhir"
    RESEARCH = "research"
    ORCHESTRATOR = "orchestrator"


class PatientContext(BaseModel):
    """Contexte patient pour RAG"""
    patient_id: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    medical_history: Optional[List[str]] = None
    current_medications: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    recent_exams: Optional[List[Dict[str, Any]]] = None


class OrchestratorRequest(BaseModel):
    """Requête d'orchestration"""
    query: str = Field(..., description="Requête médicale de l'utilisateur")
    context: Optional[PatientContext] = Field(None, description="Contexte patient")
    query_type: Optional[QueryType] = Field(None, description="Type de requête (auto-détecté si non fourni)")
    include_rag: bool = Field(True, description="Inclure la recherche RAG")
    max_tokens: Optional[int] = Field(None, description="Nombre maximum de tokens dans la réponse")
    temperature: Optional[float] = Field(None, description="Température pour la génération")
    user_id: Optional[str] = Field(None, description="ID de l'utilisateur")
    session_id: Optional[str] = Field(None, description="ID de session")
    image_urls: Optional[List[str]] = Field(None, description="URLs d'images médicales à analyser")


class LLMResponse(BaseModel):
    """Réponse d'un LLM spécialisé"""
    llm_type: LLMType
    response: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    processing_time: float
    metadata: Optional[Dict[str, Any]] = None


class RoutingDecision(BaseModel):
    """Décision de routage"""
    query_type: QueryType
    llms_to_use: List[LLMType]
    reasoning: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    parallel_execution: bool = True


class RAGResult(BaseModel):
    """Résultat de recherche RAG"""
    content: str
    source: str
    relevance_score: float = Field(..., ge=0.0, le=1.0)
    metadata: Optional[Dict[str, Any]] = None


class OrchestratorResponse(BaseModel):
    """Réponse de l'orchestrateur"""
    query: str
    response: str
    query_type: QueryType
    llms_used: List[LLMType]
    routing_decision: RoutingDecision
    individual_responses: List[LLMResponse]
    rag_results: Optional[List[RAGResult]] = None
    confidence: float = Field(..., ge=0.0, le=1.0)
    processing_time_seconds: float
    warnings: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class HealthResponse(BaseModel):
    """Réponse de health check"""
    status: str
    model_loaded: bool
    llm_services_status: Dict[str, bool]
    database_connected: bool
    redis_connected: bool
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class MetricsResponse(BaseModel):
    """Métriques du service"""
    total_requests: int
    successful_requests: int
    failed_requests: int
    average_processing_time: float
    requests_per_minute: float
    llm_usage_stats: Dict[str, int]
    cache_hit_rate: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ValidationResult(BaseModel):
    """Résultat de validation médicale"""
    is_valid: bool
    confidence: float = Field(..., ge=0.0, le=1.0)
    warnings: List[str] = []
    errors: List[str] = []
    suggestions: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None
