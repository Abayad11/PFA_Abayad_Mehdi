"""
Configuration du service LLM Orchestrator
"""

from pydantic_settings import BaseSettings
from typing import Optional
from functools import lru_cache


class Settings(BaseSettings):
    """Configuration du service"""
    
    # Service Configuration
    SERVICE_NAME: str = "llm-orchestrator"
    SERVICE_PORT: int = 8002
    SERVICE_HOST: str = "0.0.0.0"
    LOG_LEVEL: str = "INFO"
    
    # DeepSeek R1 Model Configuration
    MODEL_NAME: str = "deepseek-ai/deepseek-r1"
    MODEL_PATH: Optional[str] = None
    USE_LORA: bool = True
    LORA_ADAPTER_PATH: Optional[str] = None
    QUANTIZATION: str = "int8"  # none, int8, int4
    MAX_LENGTH: int = 4096
    TEMPERATURE: float = 0.7
    TOP_P: float = 0.9
    TOP_K: int = 50
    
    # Specialized LLM Services
    LLM_VISION_URL: str = "http://llm-vision:8003"
    LLM_TEXT_URL: str = "http://llm-text:8004"
    LLM_FHIR_URL: str = "http://llm-fhir:8005"
    LLM_RESEARCH_URL: str = "http://llm-research:8006"
    
    # Database Configuration
    DATABASE_URL: str = "postgresql://postgres:postgres@postgres:5432/abhar_sante"
    VECTOR_DIMENSION: int = 768
    
    # Redis Configuration
    REDIS_URL: str = "redis://redis:6379/0"
    CACHE_TTL: int = 3600
    
    # RAG Configuration
    EMBEDDING_MODEL: str = "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"
    CHUNK_SIZE: int = 512
    CHUNK_OVERLAP: int = 50
    TOP_K_RETRIEVAL: int = 5
    
    # Security
    JWT_SECRET: str = "your-secret-key-change-in-production"
    API_KEY_HEADER: str = "X-API-Key"
    
    # Monitoring
    PROMETHEUS_PORT: int = 9090
    ENABLE_METRICS: bool = True
    
    # Guardrails
    MAX_TOKENS_PER_REQUEST: int = 2048
    RATE_LIMIT_PER_MINUTE: int = 60
    ENABLE_CONTENT_FILTER: bool = True
    ENABLE_MEDICAL_VALIDATION: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Récupération des paramètres (avec cache)"""
    return Settings()


settings = get_settings()
