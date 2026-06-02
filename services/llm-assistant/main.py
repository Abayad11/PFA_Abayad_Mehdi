import os
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import httpx
from typing import Optional

app = FastAPI(title="Abhar Santé Maroc - LLM Assistant", version="0.1.0")

# Configuration du service d'inférence
AI_INFER_URL = os.getenv("AI_INFER_URL", "http://localhost:8001")

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    analysis: Optional[dict] = None

@app.get("/health")
def health():
    return {"status": "ok", "ai_infer_url": AI_INFER_URL}

@app.get("/")
def root():
    return {"name": "LLM Assistant", "version": "0.1.0"}

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """Chat textuel simple (sans image)"""
    # Placeholder: réponse basique
    response_text = f"Vous avez dit: '{req.message}'. Analyse en cours..."
    return ChatResponse(response=response_text, analysis=None)

@app.post("/analyze-image")
async def analyze_image(
    file: UploadFile = File(...),
    prompt: Optional[str] = None
):
    """
    Reçoit une image médicale, l'envoie au service d'inférence,
    puis génère une réponse médicale contextuelle.
    """
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Le fichier doit être une image")
    
    try:
        # 1. Lire l'image
        image_bytes = await file.read()
        
        # 2. Envoyer au service d'inférence
        async with httpx.AsyncClient(timeout=30.0) as client:
            files = {'file': (file.filename, image_bytes, file.content_type)}
            infer_response = await client.post(
                f"{AI_INFER_URL}/infer-image",
                files=files
            )
            infer_response.raise_for_status()
            infer_result = infer_response.json()
        
        # 3. Interpréter le résultat
        class_idx = infer_result.get("class_index", 0)
        confidence = infer_result.get("confidence", 0.0)
        
        # Mapping des classes (à adapter selon ton modèle)
        class_names = {
            0: "Normal",
            1: "Anomalie détectée"
        }
        class_label = class_names.get(class_idx, f"Classe {class_idx}")
        
        # 4. Générer une réponse médicale contextuelle
        if confidence > 0.8:
            confidence_text = "haute confiance"
        elif confidence > 0.6:
            confidence_text = "confiance modérée"
        else:
            confidence_text = "faible confiance"
        
        medical_response = f"""
Analyse de l'image médicale:

📊 Résultat: {class_label}
🎯 Confiance: {confidence:.1%} ({confidence_text})

{"⚠️ Une anomalie a été détectée. Il est recommandé de consulter un spécialiste pour un diagnostic approfondi." if class_idx == 1 else "✅ Aucune anomalie majeure détectée. Cependant, seul un professionnel de santé peut établir un diagnostic définitif."}

Note: Cette analyse est basée sur un modèle d'IA et ne remplace pas l'avis d'un médecin.
        """.strip()
        
        if prompt:
            medical_response += f"\n\nContexte fourni: {prompt}"
        
        return {
            "ok": True,
            "response": medical_response,
            "analysis": {
                "class_index": class_idx,
                "class_label": class_label,
                "confidence": confidence,
                "raw_prediction": infer_result.get("prediction")
            }
        }
    
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Erreur communication avec le service d'inférence: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur analyse: {str(e)}")
