#!/usr/bin/env python3
"""
Service d'inférence Alzheimer - Version locale simplifiée
Lance ce script, puis ouvre http://localhost:8000 dans ton navigateur
"""
import os
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import uvicorn
import tensorflow as tf
import numpy as np
from PIL import Image
import io

# Configuration
MODEL_PATH = "services/ai-infer-example/best_model.keras"
app = FastAPI(title="Abhar Santé - Alzheimer Prediction")

# CORS pour permettre les requêtes depuis le navigateur
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Charger le modèle au démarrage
print(f"🔄 Chargement du modèle depuis {MODEL_PATH}...")
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"✅ Modèle chargé avec succès!")
    print(f"   Input shape: {model.input_shape}")
    print(f"   Output shape: {model.output_shape}")
    TARGET_SIZE = (model.input_shape[1], model.input_shape[2])
    print(f"   Target size: {TARGET_SIZE}")
except Exception as e:
    print(f"❌ Erreur: {e}")
    model = None
    TARGET_SIZE = (224, 224)

# Classes Alzheimer (à adapter selon ton modèle)
ALZHEIMER_CLASSES = {
    0: "Pas de démence",
    1: "Démence très légère", 
    2: "Démence légère",
    3: "Démence modérée"
}

@app.get("/", response_class=HTMLResponse)
def home():
    """Interface web simple"""
    return """
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Abhar Santé - Détection Alzheimer</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
            }
            .header {
                background: white;
                padding: 30px;
                border-radius: 15px;
                margin-bottom: 20px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            h1 {
                color: #667eea;
                margin-bottom: 10px;
            }
            .card {
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .upload-zone {
                border: 3px dashed #667eea;
                border-radius: 10px;
                padding: 40px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s;
                background: #f8f9ff;
            }
            .upload-zone:hover {
                border-color: #764ba2;
                background: #f0f1ff;
            }
            #imagePreview {
                max-width: 100%;
                max-height: 400px;
                margin: 20px 0;
                border-radius: 10px;
                display: none;
            }
            button {
                width: 100%;
                padding: 15px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                margin-top: 20px;
                transition: transform 0.2s;
            }
            button:hover:not(:disabled) {
                transform: translateY(-2px);
            }
            button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            #result {
                margin-top: 20px;
                padding: 20px;
                border-radius: 10px;
                display: none;
            }
            .success {
                background: #d4edda;
                border: 2px solid #28a745;
                color: #155724;
            }
            .warning {
                background: #fff3cd;
                border: 2px solid #ffc107;
                color: #856404;
            }
            .error {
                background: #f8d7da;
                border: 2px solid #dc3545;
                color: #721c24;
            }
            .result-title {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .confidence {
                font-size: 14px;
                margin-top: 10px;
                opacity: 0.8;
            }
            .loading {
                display: none;
                text-align: center;
                padding: 20px;
            }
            .spinner {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #667eea;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🧠 Abhar Santé Maroc</h1>
                <p>Détection des phases d'Alzheimer par IRM cérébrale</p>
            </div>
            
            <div class="card">
                <div class="upload-zone" onclick="document.getElementById('fileInput').click()">
                    <p style="font-size: 18px; color: #667eea; margin-bottom: 10px;">📤 Cliquez pour télécharger une IRM</p>
                    <p style="color: #666; font-size: 14px;">Formats acceptés: JPG, PNG</p>
                    <input type="file" id="fileInput" accept="image/*" style="display:none" onchange="handleFileSelect(event)">
                </div>
                
                <img id="imagePreview" alt="Preview">
                
                <button id="analyzeBtn" onclick="analyzeImage()" disabled>🔍 Analyser l'IRM</button>
                
                <div class="loading" id="loading">
                    <div class="spinner"></div>
                    <p style="margin-top: 10px;">Analyse en cours...</p>
                </div>
                
                <div id="result"></div>
            </div>
        </div>

        <script>
            let selectedFile = null;

            function handleFileSelect(event) {
                const file = event.target.files[0];
                if (file) {
                    selectedFile = file;
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const preview = document.getElementById('imagePreview');
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                        document.getElementById('analyzeBtn').disabled = false;
                    };
                    reader.readAsDataURL(file);
                }
            }

            async function analyzeImage() {
                if (!selectedFile) return;

                const formData = new FormData();
                formData.append('file', selectedFile);

                document.getElementById('analyzeBtn').disabled = true;
                document.getElementById('loading').style.display = 'block';
                document.getElementById('result').style.display = 'none';

                try {
                    const response = await fetch('/predict', {
                        method: 'POST',
                        body: formData
                    });

                    const data = await response.json();
                    
                    document.getElementById('loading').style.display = 'none';
                    
                    if (data.success) {
                        showResult(data);
                    } else {
                        showError(data.error || 'Erreur lors de l\'analyse');
                    }
                } catch (error) {
                    document.getElementById('loading').style.display = 'none';
                    showError('Impossible de contacter le serveur: ' + error.message);
                }

                document.getElementById('analyzeBtn').disabled = false;
            }

            function showResult(data) {
                const resultDiv = document.getElementById('result');
                const className = data.class_name;
                const confidence = (data.confidence * 100).toFixed(1);
                
                let cssClass = 'success';
                let emoji = '✅';
                if (data.class_index >= 2) {
                    cssClass = 'warning';
                    emoji = '⚠️';
                }
                
                resultDiv.className = cssClass;
                resultDiv.innerHTML = `
                    <div class="result-title">${emoji} Résultat de l'analyse</div>
                    <p style="font-size: 18px; margin: 10px 0;"><strong>Diagnostic: ${className}</strong></p>
                    <p>Cette prédiction est basée sur l'analyse automatique de l'IRM par intelligence artificielle.</p>
                    <div class="confidence">Confiance du modèle: ${confidence}%</div>
                    <p style="margin-top: 15px; font-size: 13px; border-top: 1px solid #ccc; padding-top: 15px;">
                        ⚕️ <strong>Important:</strong> Ce résultat est indicatif et ne remplace pas un diagnostic médical professionnel. 
                        Consultez un neurologue pour une évaluation complète.
                    </p>
                `;
                resultDiv.style.display = 'block';
            }

            function showError(message) {
                const resultDiv = document.getElementById('result');
                resultDiv.className = 'error';
                resultDiv.innerHTML = `
                    <div class="result-title">❌ Erreur</div>
                    <p>${message}</p>
                `;
                resultDiv.style.display = 'block';
            }
        </script>
    </body>
    </html>
    """

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """Prédiction de la phase d'Alzheimer"""
    if model is None:
        raise HTTPException(status_code=503, detail="Modèle non chargé")
    
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Le fichier doit être une image")
    
    try:
        # Lire et prétraiter l'image
        image_bytes = await file.read()
        img = Image.open(io.BytesIO(image_bytes))
        
        # Convertir en RGB
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Redimensionner
        img = img.resize(TARGET_SIZE)
        
        # Normaliser [0, 1]
        img_array = np.array(img, dtype=np.float32) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Prédiction
        predictions = model.predict(img_array, verbose=0)
        
        # Extraire le résultat
        class_idx = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][class_idx])
        class_name = ALZHEIMER_CLASSES.get(class_idx, f"Classe {class_idx}")
        
        return {
            "success": True,
            "class_index": class_idx,
            "class_name": class_name,
            "confidence": confidence,
            "all_probabilities": predictions[0].tolist()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH
    }

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🚀 Serveur de détection Alzheimer démarré!")
    print("📍 Ouvre ton navigateur sur: http://localhost:8000")
    print("="*60 + "\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
