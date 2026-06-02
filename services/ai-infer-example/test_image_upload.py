#!/usr/bin/env python3
"""
Script de test pour l'endpoint /infer-image
Usage: python test_image_upload.py <chemin_image.jpg>
"""
import sys
import requests

def test_image_inference(image_path: str, api_url: str = "http://localhost:8001"):
    """Teste l'inférence avec upload d'image"""
    
    # Health check
    print(f"🔍 Health check: {api_url}/health")
    try:
        health = requests.get(f"{api_url}/health")
        print(f"✓ Status: {health.json()}")
    except Exception as e:
        print(f"✗ Erreur health check: {e}")
        return
    
    # Upload et inférence
    print(f"\n📤 Upload image: {image_path}")
    try:
        with open(image_path, 'rb') as f:
            files = {'file': (image_path, f, 'image/jpeg')}
            response = requests.post(f"{api_url}/infer-image", files=files)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✓ Prédiction réussie:")
            print(f"  - Classe prédite: {result['class_index']}")
            print(f"  - Confiance: {result['confidence']:.2%}")
            print(f"  - Valeur brute: {result['prediction']:.4f}")
        else:
            print(f"✗ Erreur {response.status_code}: {response.text}")
    except FileNotFoundError:
        print(f"✗ Fichier introuvable: {image_path}")
    except Exception as e:
        print(f"✗ Erreur: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_image_upload.py <chemin_image.jpg>")
        sys.exit(1)
    
    test_image_inference(sys.argv[1])
