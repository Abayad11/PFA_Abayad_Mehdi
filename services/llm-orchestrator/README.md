# LLM Orchestrator - Abhar Santé Maroc

Service d'orchestration intelligente des LLMs médicaux avec DeepSeek R1.

## 🎯 Fonctionnalités

- **Orchestration intelligente**: Routage automatique vers les LLMs spécialisés
- **RAG (Retrieval Augmented Generation)**: Recherche sémantique avec pgvector
- **Guardrails médicaux**: Validation et sécurité des réponses
- **Multi-LLM**: Support de plusieurs LLMs spécialisés (Vision, Texte, FHIR, Recherche)
- **Monitoring**: Métriques et observabilité complètes

## 🚀 Démarrage rapide

### Prérequis

- Python 3.11+
- PostgreSQL 16+ avec extension pgvector
- Redis (optionnel, pour le caching)
- GPU (recommandé pour DeepSeek R1)

### Installation

```bash
# Installation des dépendances
pip install -r requirements.txt

# Configuration
cp env.example .env
# Éditer .env avec vos paramètres

# Démarrage du service
python main.py
```

### Avec Docker

```bash
docker build -t llm-orchestrator .
docker run -p 8002:8002 llm-orchestrator
```

## 📡 API Endpoints

### POST /orchestrate
Endpoint principal d'orchestration

```json
{
  "query": "Analyser cette IRM cérébrale",
  "context": {
    "patient_id": "12345",
    "age": 45,
    "gender": "M"
  },
  "include_rag": true
}
```

### POST /analyze-medical-query
Analyse d'une requête sans orchestration complète

### POST /rag-search
Recherche RAG dans la base de connaissances

### POST /validate-medical-response
Validation médicale d'une réponse

### GET /health
Vérification de l'état de santé

### GET /metrics
Récupération des métriques

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│     LLM Orchestrator (DeepSeek R1)  │
├─────────────────────────────────────┤
│  • Analyse de requête               │
│  • Routage intelligent              │
│  • Agrégation de réponses           │
│  • Validation médicale              │
└────────┬────────┬────────┬──────────┘
         │        │        │
         ▼        ▼        ▼
    ┌────────┐ ┌────────┐ ┌────────┐
    │ Vision │ │  Text  │ │  FHIR  │
    │  LLM   │ │  LLM   │ │  LLM   │
    └────────┘ └────────┘ └────────┘
```

## 🔧 Configuration

Variables d'environnement principales:

- `MODEL_NAME`: Nom du modèle DeepSeek R1
- `DATABASE_URL`: URL PostgreSQL avec pgvector
- `REDIS_URL`: URL Redis pour caching
- `LLM_*_URL`: URLs des services LLM spécialisés

## 📊 Monitoring

Le service expose des métriques sur `/metrics`:

- Nombre total de requêtes
- Temps de traitement moyen
- Taux de succès/échec
- Utilisation des LLMs
- Cache hit rate

## 🛡️ Sécurité

- Authentification par clé API
- Rate limiting
- Validation médicale des réponses
- Détection d'hallucinations
- Conformité RGPD/HIPAA

## 📝 TODO

- [ ] Implémenter le chargement réel de DeepSeek R1
- [ ] Ajouter le fine-tuning LoRA
- [ ] Intégrer Redis pour le caching
- [ ] Ajouter Prometheus pour les métriques
- [ ] Tests unitaires et d'intégration
- [ ] Documentation API complète

## 👥 Auteurs

- Mehdi Abayad
- Zahra Zhar

## 📄 Licence

Propriétaire - Abhar Santé Maroc
