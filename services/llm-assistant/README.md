# Service LLM Assistant (FastAPI)

Assistant médical intelligent qui analyse les images médicales en communiquant avec le service d'inférence IA.

## Architecture

```
User → LLM Assistant (/analyze-image) → AI Inference (/infer-image) → Modèle Keras
                ↓
        Réponse médicale contextuelle
```

## Fonctionnalités

- **Analyse d'images médicales**: upload d'image → inférence → réponse médicale en français
- **Chat textuel**: endpoint `/chat` pour questions sans image
- **Intégration transparente**: communique automatiquement avec le service d'inférence
- **Garde-fous**: validation des types de fichiers, timeouts, gestion d'erreurs

## Endpoints

### `POST /analyze-image`
Analyse une image médicale et génère une réponse contextuelle.

**Paramètres:**
- `file`: fichier image (JPEG/PNG)
- `prompt` (optionnel): contexte additionnel (ex: "Patient de 45 ans, douleurs thoraciques")

**Réponse:**
```json
{
  "ok": true,
  "response": "Analyse de l'image médicale:\n\n📊 Résultat: Normal\n🎯 Confiance: 92.3% (haute confiance)\n\n✅ Aucune anomalie majeure détectée...",
  "analysis": {
    "class_index": 0,
    "class_label": "Normal",
    "confidence": 0.923,
    "raw_prediction": 0.077
  }
}
```

### `POST /chat`
Chat textuel simple (sans image).

**Body:**
```json
{
  "message": "Quels sont les symptômes de...",
  "context": "optionnel"
}
```

## Lancer en local

### Option 1: Docker Compose (recommandé)
Lance LLM + AI ensemble:
```powershell
cd c:\Users\XPS\Downloads\projet-federateur
docker compose up --build llm-assistant ai-infer-example
```
- LLM: http://localhost:8000
- AI: http://localhost:8001

### Option 2: Docker standalone
```powershell
# 1. Lancer le service d'inférence d'abord
cd services/ai-infer-example
docker build -t abhar/ai-infer:0.1.0 .
docker run -d --name ai-infer -p 8001:8001 abhar/ai-infer:0.1.0

# 2. Lancer le LLM
cd ../llm-assistant
docker build -t abhar/llm-assistant:0.1.0 .
docker run --rm -p 8000:8000 -e AI_INFER_URL=http://host.docker.internal:8001 abhar/llm-assistant:0.1.0
```

### Option 3: Local (Python 3.11)
```powershell
# Terminal 1: AI Inference
cd services/ai-infer-example
py -3.11 -m venv .venv
.\.venv\Scripts\Activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8001

# Terminal 2: LLM Assistant
cd services/llm-assistant
py -3.11 -m venv .venv
.\.venv\Scripts\Activate
pip install -r requirements.txt
$env:AI_INFER_URL="http://localhost:8001"
python -m uvicorn main:app --reload --port 8000
```

## Tester

### Via script Python
```powershell
cd services/llm-assistant
python test_analyze_image.py C:\chemin\vers\image.jpg
python test_analyze_image.py radiographie.jpg "Patient de 45 ans"
```

### Via curl
```powershell
curl.exe -X POST http://localhost:8000/analyze-image -F "file=@C:\chemin\vers\image.jpg" -F "prompt=Contexte médical"
```

### Via Swagger UI
Ouvre http://localhost:8000/docs et teste `/analyze-image` interactivement.

## Configuration

**Variables d'environnement:**
- `AI_INFER_URL`: URL du service d'inférence (défaut: `http://localhost:8001`)

## Personnalisation

Pour adapter les réponses médicales à ton modèle, modifie dans `main.py`:

```python
# Ligne 66-70: Mapping des classes
class_names = {
    0: "Normal",
    1: "Anomalie détectée",
    2: "Autre classe..."  # Ajoute tes classes
}
```

## Prochaines étapes

- [ ] Intégrer un vrai LLM (OpenAI API, Llama local, etc.)
- [ ] RAG avec historique patient (pgvector/OpenSearch)
- [ ] Garde-fous anti-hallucination
- [ ] Multi-modal: texte + image dans le même prompts sécurisés, logs/audit
