"""
Pipeline de preprocessing des datasets médicaux
"""

import json
import pandas as pd
from typing import List, Dict, Any
from pathlib import Path
from loguru import logger
import re


class MedicalDatasetPreprocessor:
    """Preprocessing des datasets médicaux pour le fine-tuning"""
    
    def __init__(self, output_dir: str = "./processed"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def clean_text(self, text: str) -> str:
        """Nettoyage du texte médical"""
        # Suppression des caractères spéciaux excessifs
        text = re.sub(r'\s+', ' ', text)
        text = text.strip()
        return text
    
    def create_orchestration_dataset(
        self,
        medical_queries: List[Dict[str, Any]],
        output_file: str = "orchestration_dataset.jsonl"
    ):
        """
        Création du dataset d'orchestration
        
        Format attendu:
        {
            "query": "Analyser cette IRM cérébrale",
            "context": {...},
            "routing_decision": {
                "query_type": "radiology",
                "llms_to_use": ["vision", "text"],
                "reasoning": "..."
            },
            "response": "..."
        }
        """
        logger.info("📝 Création du dataset d'orchestration...")
        
        processed_data = []
        
        for item in medical_queries:
            processed_item = {
                "query": self.clean_text(item.get("query", "")),
                "context": item.get("context", {}),
                "routing_decision": item.get("routing_decision", {}),
                "response": self.clean_text(item.get("response", ""))
            }
            processed_data.append(processed_item)
        
        # Sauvegarde en JSONL
        output_path = self.output_dir / output_file
        with open(output_path, 'w', encoding='utf-8') as f:
            for item in processed_data:
                f.write(json.dumps(item, ensure_ascii=False) + '\n')
        
        logger.success(f"✅ Dataset sauvegardé: {output_path} ({len(processed_data)} exemples)")
        return output_path
    
    def create_medical_french_dataset(
        self,
        medical_texts: List[Dict[str, Any]],
        output_file: str = "medical_french_dataset.jsonl"
    ):
        """
        Création du dataset médical français
        
        Format attendu:
        {
            "text": "Texte médical en français",
            "source": "CHU Casablanca / HAS / etc.",
            "category": "diagnostic / traitement / etc.",
            "metadata": {...}
        }
        """
        logger.info("📝 Création du dataset médical français...")
        
        processed_data = []
        
        for item in medical_texts:
            processed_item = {
                "text": self.clean_text(item.get("text", "")),
                "source": item.get("source", "unknown"),
                "category": item.get("category", "general"),
                "metadata": item.get("metadata", {})
            }
            processed_data.append(processed_item)
        
        # Sauvegarde
        output_path = self.output_dir / output_file
        with open(output_path, 'w', encoding='utf-8') as f:
            for item in processed_data:
                f.write(json.dumps(item, ensure_ascii=False) + '\n')
        
        logger.success(f"✅ Dataset sauvegardé: {output_path} ({len(processed_data)} exemples)")
        return output_path
    
    def create_guardrails_dataset(
        self,
        examples: List[Dict[str, Any]],
        output_file: str = "guardrails_dataset.jsonl"
    ):
        """
        Création du dataset de garde-fous
        
        Format attendu:
        {
            "text": "Réponse médicale",
            "is_safe": true/false,
            "is_emergency": true/false,
            "has_hallucinations": true/false,
            "warnings": [...],
            "errors": [...]
        }
        """
        logger.info("📝 Création du dataset de garde-fous...")
        
        processed_data = []
        
        for item in examples:
            processed_item = {
                "text": self.clean_text(item.get("text", "")),
                "is_safe": item.get("is_safe", True),
                "is_emergency": item.get("is_emergency", False),
                "has_hallucinations": item.get("has_hallucinations", False),
                "warnings": item.get("warnings", []),
                "errors": item.get("errors", [])
            }
            processed_data.append(processed_item)
        
        # Sauvegarde
        output_path = self.output_dir / output_file
        with open(output_path, 'w', encoding='utf-8') as f:
            for item in processed_data:
                f.write(json.dumps(item, ensure_ascii=False) + '\n')
        
        logger.success(f"✅ Dataset sauvegardé: {output_path} ({len(processed_data)} exemples)")
        return output_path
    
    def split_dataset(
        self,
        input_file: str,
        train_ratio: float = 0.8,
        val_ratio: float = 0.1,
        test_ratio: float = 0.1
    ):
        """Division du dataset en train/val/test"""
        logger.info(f"📊 Division du dataset: {input_file}")
        
        # Chargement
        data = []
        with open(input_file, 'r', encoding='utf-8') as f:
            for line in f:
                data.append(json.loads(line))
        
        total = len(data)
        train_size = int(total * train_ratio)
        val_size = int(total * val_ratio)
        
        # Division
        train_data = data[:train_size]
        val_data = data[train_size:train_size + val_size]
        test_data = data[train_size + val_size:]
        
        # Sauvegarde
        base_name = Path(input_file).stem
        
        splits = {
            "train": train_data,
            "val": val_data,
            "test": test_data
        }
        
        for split_name, split_data in splits.items():
            output_path = self.output_dir / f"{base_name}_{split_name}.jsonl"
            with open(output_path, 'w', encoding='utf-8') as f:
                for item in split_data:
                    f.write(json.dumps(item, ensure_ascii=False) + '\n')
            logger.info(f"  {split_name}: {len(split_data)} exemples → {output_path}")
        
        logger.success("✅ Division terminée")
    
    def anonymize_patient_data(self, text: str) -> str:
        """Anonymisation des données patients"""
        # Suppression des noms (pattern simple)
        text = re.sub(r'\b[A-Z][a-z]+ [A-Z][a-z]+\b', '[NOM]', text)
        
        # Suppression des numéros de téléphone
        text = re.sub(r'\b\d{10}\b', '[TELEPHONE]', text)
        
        # Suppression des emails
        text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[EMAIL]', text)
        
        # Suppression des dates de naissance
        text = re.sub(r'\b\d{2}/\d{2}/\d{4}\b', '[DATE]', text)
        
        return text


def main():
    """Exemple d'utilisation"""
    preprocessor = MedicalDatasetPreprocessor()
    
    # Exemple de données
    orchestration_examples = [
        {
            "query": "Analyser cette IRM cérébrale pour détecter des anomalies",
            "context": {"patient_id": "12345", "age": 45},
            "routing_decision": {
                "query_type": "radiology",
                "llms_to_use": ["vision", "text"],
                "reasoning": "Requête d'analyse d'image médicale"
            },
            "response": "Analyse de l'IRM en cours..."
        }
    ]
    
    # Création des datasets
    preprocessor.create_orchestration_dataset(orchestration_examples)
    
    logger.success("🎉 Preprocessing terminé!")


if __name__ == "__main__":
    main()
