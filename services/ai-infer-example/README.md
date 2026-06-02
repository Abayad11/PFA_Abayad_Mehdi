# Service d'inférence IA (FastAPI + TensorFlow)

Service d'inférence pour `best_model.keras` (modèle Keras/TensorFlow).

## Fonctionnalités
- Chargement automatique du modèle au démarrage
- Endpoint `/infer` pour prédictions batch
- Health check avec statut du modèle
- Support GPU optionnel (via TensorFlow-GPU)

## Lancer en local (avec Python 3.11 + Docker Desktop installé)

### Option 1: Docker (recommandé)
```powershell
cd services/ai-infer-example
docker build -t abhar/ai-infer:0.1.0 .
docker run --rm -p 8001:8001 abhar/ai-infer:0.1.0
```
Health: http://localhost:8001/health

### Option 2: Local (si Python 3.11 installé)
```powershell
cd services/ai-infer-example
py -3.11 -m venv .venv
.\.venv\Scripts\Activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8001
```

## Utilisation

### Health check
```bash
curl http://localhost:8001/health
```
Retourne:
```json
{
  "status": "ok",
  "model_loaded": true,
  "model_path": "best_model.keras"
}
```

### Inférence
```bash
curl -X POST http://localhost:8001/infer \
  -H "Content-Type: application/json" \
  -d '{"data": [[0.1, 0.2, ...], [0.3, 0.4, ...]]}'
```
Retourne:
```json
{
  "ok": true,
  "predictions": [0.85, 0.12],
  "model_loaded": true
}
```

## Structure attendue des données
- `data`: liste de listes (batch d'exemples)
- Chaque sous-liste doit correspondre à l'input shape du modèle
- Exemple: si le modèle attend (None, 224, 224, 3), envoyer des images aplaties ou prétraitées

## Variables d'environnement
- `MODEL_PATH`: chemin vers le fichier .keras (défaut: `best_model.keras`)

## GPU (optionnel)
Pour utiliser un GPU:
1. Installer TensorFlow-GPU: `pip install tensorflow[and-cuda]`
2. Vérifier CUDA/cuDNN compatibles
3. Ou utiliser l'image Docker NVIDIA TensorFlow
