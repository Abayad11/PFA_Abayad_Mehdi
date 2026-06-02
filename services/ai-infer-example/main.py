import os
import io
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import numpy as np
from PIL import Image
import tensorflow as tf

# Variables globales
model = None
MODEL_PATH = os.getenv("MODEL_PATH", "best_model.keras")
TARGET_SIZE = (224, 224)

# Charger le modèle immédiatement au démarrage du module
print(f"🔄 Chargement du modèle depuis {MODEL_PATH}...")
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"✓ Modèle chargé avec succès!")
    print(f"  Input shape: {model.input_shape}")
    print(f"  Output shape: {model.output_shape}")
    
    # Extraire la taille d'image attendue (ex: (None, 224, 224, 3))
    if len(model.input_shape) >= 3:
        TARGET_SIZE = (model.input_shape[1], model.input_shape[2])
        print(f"  Target image size: {TARGET_SIZE}")
except Exception as e:
    print(f"✗ Erreur chargement modèle: {e}")
    import traceback
    traceback.print_exc()
    model = None

app = FastAPI(
    title="Abhar Santé Maroc - AI Inference",
    version="0.1.0"
)

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Prétraite une image pour le modèle"""
    try:
        # Charger l'image depuis les bytes
        img = Image.open(io.BytesIO(image_bytes))
        
        # Convertir en RGB si nécessaire
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Redimensionner à la taille attendue
        img = img.resize(TARGET_SIZE)
        
        # Convertir en array numpy et normaliser [0, 1]
        img_array = np.array(img, dtype=np.float32) / 255.0
        
        # Ajouter dimension batch
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        raise ValueError(f"Erreur preprocessing image: {str(e)}")

class InferRequest(BaseModel):
    data: list[list[float]]  # Batch d'images/features (ex: [[...], [...]])

class InferResponse(BaseModel):
    ok: bool
    predictions: list[float]
    model_loaded: bool

class ImageInferResponse(BaseModel):
    ok: bool
    prediction: float
    class_index: int
    confidence: float
    model_loaded: bool

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH,
        "target_size": TARGET_SIZE
    }

@app.post("/infer", response_model=InferResponse)
def infer(req: InferRequest):
    """Inférence avec données brutes (array de features)"""
    if model is None:
        raise HTTPException(status_code=503, detail="Modèle non chargé")
    
    try:
        # Convertir en array numpy et prédire
        input_array = np.array(req.data, dtype=np.float32)
        predictions = model.predict(input_array)
        
        # Convertir en liste Python (si classification: argmax, si régression: valeurs brutes)
        preds_list = predictions.flatten().tolist()
        
        return InferResponse(
            ok=True,
            predictions=preds_list,
            model_loaded=True
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erreur inférence: {str(e)}")

@app.post("/infer-image", response_model=ImageInferResponse)
async def infer_image(file: UploadFile = File(...)):
    """Inférence avec upload d'image (JPEG/PNG)"""
    if model is None:
        raise HTTPException(status_code=503, detail="Modèle non chargé")
    
    # Vérifier le type de fichier
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Le fichier doit être une image (JPEG/PNG)")
    
    try:
        # Lire les bytes de l'image
        image_bytes = await file.read()
        
        # Prétraiter l'image
        img_array = preprocess_image(image_bytes)
        
        # Prédiction
        predictions = model.predict(img_array, verbose=0)
        
        # Extraire la prédiction (classification binaire ou multi-classe)
        if predictions.shape[-1] == 1:
            # Régression ou classification binaire
            pred_value = float(predictions[0][0])
            class_idx = int(pred_value > 0.5)
            confidence = pred_value if class_idx == 1 else (1 - pred_value)
        else:
            # Classification multi-classe
            class_idx = int(np.argmax(predictions[0]))
            confidence = float(predictions[0][class_idx])
            pred_value = confidence
        
        return ImageInferResponse(
            ok=True,
            prediction=pred_value,
            class_index=class_idx,
            confidence=confidence,
            model_loaded=True
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur inférence: {str(e)}")
