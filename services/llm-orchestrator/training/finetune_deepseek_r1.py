"""
Script de fine-tuning DeepSeek R1 avec LoRA
Auteurs: Mehdi Abayad, Zahra Zhar
"""

import os
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from datasets import load_dataset
import wandb
from loguru import logger


class DeepSeekR1FineTuner:
    """Fine-tuning de DeepSeek R1 pour l'orchestration médicale"""
    
    def __init__(self, config_path: str = "config/lora_config.yaml"):
        self.config = self._load_config(config_path)
        self.model = None
        self.tokenizer = None
        self.trainer = None
    
    def _load_config(self, config_path: str):
        """Chargement de la configuration"""
        # TODO: Charger depuis YAML
        return {
            "model_name": "deepseek-ai/deepseek-r1",
            "lora_r": 16,
            "lora_alpha": 32,
            "lora_dropout": 0.1,
            "target_modules": ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
            "num_epochs": 3,
            "batch_size": 4,
            "gradient_accumulation_steps": 8,
            "learning_rate": 2e-4,
            "max_length": 4096,
            "output_dir": "./deepseek-r1-medical-orchestrator",
            "use_8bit": True,
        }
    
    def load_model(self):
        """Chargement du modèle et tokenizer"""
        logger.info(f"🤖 Chargement du modèle {self.config['model_name']}...")
        
        # Chargement du tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.config["model_name"],
            trust_remote_code=True
        )
        
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
        
        # Chargement du modèle avec quantization 8-bit
        self.model = AutoModelForCausalLM.from_pretrained(
            self.config["model_name"],
            load_in_8bit=self.config["use_8bit"],
            device_map="auto",
            trust_remote_code=True,
            torch_dtype=torch.float16
        )
        
        # Préparation pour LoRA
        self.model = prepare_model_for_kbit_training(self.model)
        
        # Configuration LoRA
        lora_config = LoraConfig(
            r=self.config["lora_r"],
            lora_alpha=self.config["lora_alpha"],
            target_modules=self.config["target_modules"],
            lora_dropout=self.config["lora_dropout"],
            bias="none",
            task_type="CAUSAL_LM"
        )
        
        # Application de LoRA
        self.model = get_peft_model(self.model, lora_config)
        self.model.print_trainable_parameters()
        
        logger.success("✅ Modèle chargé avec succès")
    
    def load_datasets(self):
        """Chargement des datasets d'entraînement"""
        logger.info("📚 Chargement des datasets...")
        
        # Chargement des datasets
        # TODO: Remplacer par vos datasets réels
        train_dataset = load_dataset(
            "json",
            data_files="../data/orchestration_dataset.jsonl",
            split="train"
        )
        
        eval_dataset = load_dataset(
            "json",
            data_files="../data/orchestration_dataset.jsonl",
            split="test"
        )
        
        # Preprocessing
        def preprocess_function(examples):
            """Preprocessing des exemples"""
            inputs = [
                f"### Requête médicale:\n{query}\n\n### Contexte:\n{context}\n\n### Réponse:\n{response}"
                for query, context, response in zip(
                    examples["query"],
                    examples["context"],
                    examples["response"]
                )
            ]
            
            model_inputs = self.tokenizer(
                inputs,
                max_length=self.config["max_length"],
                truncation=True,
                padding="max_length"
            )
            
            model_inputs["labels"] = model_inputs["input_ids"].copy()
            return model_inputs
        
        train_dataset = train_dataset.map(
            preprocess_function,
            batched=True,
            remove_columns=train_dataset.column_names
        )
        
        eval_dataset = eval_dataset.map(
            preprocess_function,
            batched=True,
            remove_columns=eval_dataset.column_names
        )
        
        logger.success(f"✅ Datasets chargés: {len(train_dataset)} train, {len(eval_dataset)} eval")
        return train_dataset, eval_dataset
    
    def train(self):
        """Entraînement du modèle"""
        logger.info("🚀 Démarrage de l'entraînement...")
        
        # Chargement du modèle
        self.load_model()
        
        # Chargement des datasets
        train_dataset, eval_dataset = self.load_datasets()
        
        # Configuration de l'entraînement
        training_args = TrainingArguments(
            output_dir=self.config["output_dir"],
            num_train_epochs=self.config["num_epochs"],
            per_device_train_batch_size=self.config["batch_size"],
            per_device_eval_batch_size=self.config["batch_size"],
            gradient_accumulation_steps=self.config["gradient_accumulation_steps"],
            learning_rate=self.config["learning_rate"],
            fp16=True,
            logging_steps=10,
            save_strategy="epoch",
            evaluation_strategy="steps",
            eval_steps=500,
            save_total_limit=3,
            load_best_model_at_end=True,
            warmup_steps=100,
            report_to="wandb",
            deepspeed="config/deepspeed_config.json" if os.path.exists("config/deepspeed_config.json") else None
        )
        
        # Data collator
        data_collator = DataCollatorForLanguageModeling(
            tokenizer=self.tokenizer,
            mlm=False
        )
        
        # Trainer
        self.trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=train_dataset,
            eval_dataset=eval_dataset,
            data_collator=data_collator
        )
        
        # Entraînement
        logger.info("🔥 Entraînement en cours...")
        self.trainer.train()
        
        # Sauvegarde du modèle final
        logger.info("💾 Sauvegarde du modèle...")
        self.trainer.save_model(self.config["output_dir"])
        self.tokenizer.save_pretrained(self.config["output_dir"])
        
        logger.success("✅ Entraînement terminé avec succès!")
    
    def evaluate(self):
        """Évaluation du modèle"""
        if not self.trainer:
            raise RuntimeError("Le modèle doit être entraîné avant l'évaluation")
        
        logger.info("📊 Évaluation du modèle...")
        metrics = self.trainer.evaluate()
        
        logger.info(f"Métriques d'évaluation: {metrics}")
        return metrics


def main():
    """Fonction principale"""
    # Initialisation de Weights & Biases
    wandb.init(
        project="abhar-sante-deepseek-r1",
        name="medical-orchestrator-lora",
        config={
            "architecture": "DeepSeek R1",
            "task": "Medical Orchestration",
            "method": "LoRA Fine-tuning"
        }
    )
    
    # Fine-tuning
    finetuner = DeepSeekR1FineTuner()
    finetuner.train()
    
    # Évaluation
    metrics = finetuner.evaluate()
    
    # Log des métriques finales
    wandb.log(metrics)
    wandb.finish()
    
    logger.success("🎉 Fine-tuning terminé!")


if __name__ == "__main__":
    main()
