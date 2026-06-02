"""
Monitoring et métriques pour le service LLM Orchestrator
"""

from typing import Dict, List
from datetime import datetime, timedelta
from collections import defaultdict
import threading


class MetricsCollector:
    """Collecteur de métriques pour monitoring"""
    
    def __init__(self):
        self.lock = threading.Lock()
        self.total_requests = 0
        self.successful_requests = 0
        self.failed_requests = 0
        self.processing_times: List[float] = []
        self.llm_usage_stats = defaultdict(int)
        self.cache_hits = 0
        self.cache_misses = 0
        self.start_time = datetime.utcnow()
        self.recent_requests: List[Dict] = []
        self.max_recent = 1000
    
    def record_request(
        self,
        success: bool,
        processing_time: float = 0.0,
        llms_used: List[str] = None
    ):
        """Enregistrement d'une requête"""
        with self.lock:
            self.total_requests += 1
            
            if success:
                self.successful_requests += 1
                self.processing_times.append(processing_time)
                
                # Limiter la taille de l'historique
                if len(self.processing_times) > 10000:
                    self.processing_times = self.processing_times[-5000:]
                
                # Statistiques d'utilisation des LLMs
                if llms_used:
                    for llm in llms_used:
                        self.llm_usage_stats[llm] += 1
            else:
                self.failed_requests += 1
            
            # Enregistrement des requêtes récentes
            self.recent_requests.append({
                "timestamp": datetime.utcnow().isoformat(),
                "success": success,
                "processing_time": processing_time,
                "llms_used": llms_used
            })
            
            if len(self.recent_requests) > self.max_recent:
                self.recent_requests = self.recent_requests[-self.max_recent:]
    
    def record_cache_hit(self):
        """Enregistrement d'un cache hit"""
        with self.lock:
            self.cache_hits += 1
    
    def record_cache_miss(self):
        """Enregistrement d'un cache miss"""
        with self.lock:
            self.cache_misses += 1
    
    def get_metrics(self) -> Dict:
        """Récupération des métriques"""
        with self.lock:
            uptime = (datetime.utcnow() - self.start_time).total_seconds()
            requests_per_minute = (self.total_requests / uptime) * 60 if uptime > 0 else 0
            
            avg_processing_time = (
                sum(self.processing_times) / len(self.processing_times)
                if self.processing_times else 0.0
            )
            
            total_cache_requests = self.cache_hits + self.cache_misses
            cache_hit_rate = (
                self.cache_hits / total_cache_requests
                if total_cache_requests > 0 else 0.0
            )
            
            return {
                "total_requests": self.total_requests,
                "successful_requests": self.successful_requests,
                "failed_requests": self.failed_requests,
                "average_processing_time": round(avg_processing_time, 3),
                "requests_per_minute": round(requests_per_minute, 2),
                "llm_usage_stats": dict(self.llm_usage_stats),
                "cache_hit_rate": round(cache_hit_rate, 3),
                "uptime_seconds": round(uptime, 0)
            }
    
    def get_recent_requests(self, limit: int = 100) -> List[Dict]:
        """Récupération des requêtes récentes"""
        with self.lock:
            return self.recent_requests[-limit:]
    
    def reset_metrics(self):
        """Réinitialisation des métriques"""
        with self.lock:
            self.total_requests = 0
            self.successful_requests = 0
            self.failed_requests = 0
            self.processing_times = []
            self.llm_usage_stats = defaultdict(int)
            self.cache_hits = 0
            self.cache_misses = 0
            self.start_time = datetime.utcnow()
            self.recent_requests = []


# Instance globale
metrics_collector = MetricsCollector()
