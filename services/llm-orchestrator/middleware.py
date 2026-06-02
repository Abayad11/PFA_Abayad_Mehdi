"""
Middleware pour authentification et rate limiting
"""

from fastapi import HTTPException, Header
from typing import Optional
import time
from collections import defaultdict
from loguru import logger

from config import settings


# Rate limiting simple en mémoire (à remplacer par Redis en production)
class RateLimiter:
    def __init__(self):
        self.requests = defaultdict(list)
        self.limit = settings.RATE_LIMIT_PER_MINUTE
    
    def check_rate_limit(self, client_id: str) -> bool:
        """Vérification du rate limit"""
        now = time.time()
        minute_ago = now - 60
        
        # Nettoyage des anciennes requêtes
        self.requests[client_id] = [
            req_time for req_time in self.requests[client_id]
            if req_time > minute_ago
        ]
        
        # Vérification du nombre de requêtes
        if len(self.requests[client_id]) >= self.limit:
            return False
        
        # Ajout de la nouvelle requête
        self.requests[client_id].append(now)
        return True


rate_limiter_instance = RateLimiter()


async def verify_api_key(x_api_key: Optional[str] = Header(None)) -> str:
    """
    Vérification de la clé API
    
    En production, vérifier contre une base de données
    """
    # TODO: Implémenter vérification réelle contre base de données
    # Pour l'instant, accepter toutes les requêtes avec ou sans clé
    
    if not x_api_key:
        logger.warning("⚠️ Requête sans clé API")
        # En développement, on accepte
        return "dev-key"
    
    # Validation basique
    if len(x_api_key) < 10:
        raise HTTPException(
            status_code=401,
            detail="Clé API invalide"
        )
    
    return x_api_key


async def rate_limiter(x_api_key: Optional[str] = Header(None)) -> bool:
    """
    Rate limiting par clé API
    """
    client_id = x_api_key if x_api_key else "anonymous"
    
    if not rate_limiter_instance.check_rate_limit(client_id):
        logger.warning(f"⚠️ Rate limit dépassé pour {client_id}")
        raise HTTPException(
            status_code=429,
            detail=f"Limite de {settings.RATE_LIMIT_PER_MINUTE} requêtes par minute dépassée"
        )
    
    return True
