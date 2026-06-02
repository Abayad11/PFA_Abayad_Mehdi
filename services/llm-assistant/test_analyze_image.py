#!/usr/bin/env python3
"""
Script de test pour l'endpoint /analyze-image du LLM Assistant
Usage: python test_analyze_image.py <chemin_image.jpg> [prompt_optionnel]
"""
import sys
import requests

def test_analyze_image(image_path: str, prompt: str = None, llm_url: str = "http://localhost:8000"):
    """Teste l'analyse d'image via le LLM Assistant"""
    
    # Health check
    print(f"🔍 Health check LLM: {llm_url}/health")
    try:
        health = requests.get(f"{llm_url}/health")
        print(f"✓ Status: {health.json()}")
    except Exception as e:
        print(f"✗ Erreur health check: {e}")
        return
    
    # Analyse d'image
    print(f"\n📤 Analyse image: {image_path}")
    if prompt:
        print(f"📝 Prompt: {prompt}")
    
    try:
        with open(image_path, 'rb') as f:
            files = {'file': (image_path, f, 'image/jpeg')}
            data = {}
            if prompt:
                data['prompt'] = prompt
            
            response = requests.post(
                f"{llm_url}/analyze-image",
                files=files,
                data=data
            )
        
        if response.status_code == 200:
            result = response.json()
            print(f"\n✓ Analyse réussie:\n")
            print("=" * 60)
            print(result['response'])
            print("=" * 60)
            print(f"\n📊 Détails techniques:")
            analysis = result.get('analysis', {})
            print(f"  - Classe: {analysis.get('class_label')} (index: {analysis.get('class_index')})")
            print(f"  - Confiance: {analysis.get('confidence', 0):.2%}")
            print(f"  - Prédiction brute: {analysis.get('raw_prediction', 0):.4f}")
        else:
            print(f"✗ Erreur {response.status_code}: {response.text}")
    except FileNotFoundError:
        print(f"✗ Fichier introuvable: {image_path}")
    except Exception as e:
        print(f"✗ Erreur: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_analyze_image.py <chemin_image.jpg> [prompt_optionnel]")
        print("\nExemple:")
        print("  python test_analyze_image.py radiographie.jpg")
        print("  python test_analyze_image.py scanner.jpg 'Patient de 45 ans, douleurs thoraciques'")
        sys.exit(1)
    
    image_path = sys.argv[1]
    prompt = sys.argv[2] if len(sys.argv) > 2 else None
    test_analyze_image(image_path, prompt)
