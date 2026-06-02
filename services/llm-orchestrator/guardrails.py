"""
Medical Guardrails - Validation et sécurité des réponses médicales
"""

from typing import Dict, Any, List, Optional
from loguru import logger
import re


class MedicalGuardrails:
    """Garde-fous médicaux pour validation des réponses"""
    
    def __init__(self):
        self.dangerous_keywords = [
            "suicide", "automédication dangereuse", "arrêter traitement vital",
            "ignorer symptômes graves", "ne pas consulter"
        ]
        
        self.warning_keywords = [
            "urgence", "douleur thoracique", "difficulté respiratoire",
            "perte de conscience", "hémorragie", "trauma crânien"
        ]
        
        self.prohibited_actions = [
            "prescrire", "diagnostic définitif sans examen",
            "remplacer avis médical", "automédication"
        ]
    
    async def initialize(self):
        """Initialisation des guardrails"""
        logger.info("🛡️ Guardrails médicaux initialisés")
    
    async def validate(
        self,
        response_text: str,
        context: Optional[Any] = None
    ) -> Dict[str, Any]:
        """
        Validation complète d'une réponse médicale
        
        Vérifie:
        - Absence de contenu dangereux
        - Détection de situations d'urgence
        - Cohérence médicale
        - Hallucinations potentielles
        - Conformité réglementaire
        """
        warnings = []
        errors = []
        
        # 1. Vérification du contenu dangereux
        dangerous_check = self._check_dangerous_content(response_text)
        if not dangerous_check["is_safe"]:
            errors.extend(dangerous_check["errors"])
        
        # 2. Détection de situations d'urgence
        emergency_check = self._check_emergency_situations(response_text)
        if emergency_check["is_emergency"]:
            warnings.append("⚠️ URGENCE DÉTECTÉE - Recommander consultation immédiate")
        
        # 3. Vérification des actions prohibées
        prohibited_check = self._check_prohibited_actions(response_text)
        if not prohibited_check["is_compliant"]:
            errors.extend(prohibited_check["errors"])
        
        # 4. Détection d'hallucinations médicales
        hallucination_check = self._check_hallucinations(response_text)
        if hallucination_check["has_hallucinations"]:
            warnings.extend(hallucination_check["warnings"])
        
        # 5. Vérification de la structure de la réponse
        structure_check = self._check_response_structure(response_text)
        if not structure_check["is_valid"]:
            warnings.extend(structure_check["warnings"])
        
        # Calcul de la confiance globale
        confidence = self._calculate_confidence(
            dangerous_check,
            emergency_check,
            prohibited_check,
            hallucination_check,
            structure_check
        )
        
        is_valid = len(errors) == 0 and confidence > 0.6
        
        return {
            "is_valid": is_valid,
            "confidence": confidence,
            "warnings": warnings,
            "errors": errors,
            "checks": {
                "dangerous_content": dangerous_check,
                "emergency": emergency_check,
                "prohibited_actions": prohibited_check,
                "hallucinations": hallucination_check,
                "structure": structure_check
            }
        }
    
    def _check_dangerous_content(self, text: str) -> Dict[str, Any]:
        """Vérification du contenu dangereux"""
        text_lower = text.lower()
        errors = []
        
        for keyword in self.dangerous_keywords:
            if keyword in text_lower:
                errors.append(f"⛔ Contenu dangereux détecté: {keyword}")
        
        return {
            "is_safe": len(errors) == 0,
            "errors": errors
        }
    
    def _check_emergency_situations(self, text: str) -> Dict[str, Any]:
        """Détection de situations d'urgence"""
        text_lower = text.lower()
        emergency_detected = False
        
        for keyword in self.warning_keywords:
            if keyword in text_lower:
                emergency_detected = True
                break
        
        return {
            "is_emergency": emergency_detected
        }
    
    def _check_prohibited_actions(self, text: str) -> Dict[str, Any]:
        """Vérification des actions prohibées"""
        text_lower = text.lower()
        errors = []
        
        # Vérification de tentatives de prescription
        if re.search(r"je (prescris|recommande de prendre) \d+mg", text_lower):
            errors.append("⛔ Tentative de prescription détectée")
        
        # Vérification de diagnostic définitif sans examen
        if re.search(r"vous (avez|souffrez de) (certainement|définitivement)", text_lower):
            errors.append("⛔ Diagnostic définitif sans examen physique")
        
        for action in self.prohibited_actions:
            if action in text_lower:
                errors.append(f"⛔ Action prohibée: {action}")
        
        return {
            "is_compliant": len(errors) == 0,
            "errors": errors
        }
    
    def _check_hallucinations(self, text: str) -> Dict[str, Any]:
        """Détection d'hallucinations médicales potentielles"""
        warnings = []
        has_hallucinations = False
        
        # Vérification de chiffres/statistiques non sourcées
        if re.search(r"\d+%", text) and "étude" not in text.lower() and "source" not in text.lower():
            warnings.append("⚠️ Statistiques non sourcées détectées")
            has_hallucinations = True
        
        # Vérification de noms de médicaments inventés
        # TODO: Implémenter vérification contre base de données médicaments
        
        # Vérification de contradictions internes
        if "toujours" in text.lower() and "jamais" in text.lower():
            warnings.append("⚠️ Contradiction potentielle détectée")
        
        return {
            "has_hallucinations": has_hallucinations,
            "warnings": warnings
        }
    
    def _check_response_structure(self, text: str) -> Dict[str, Any]:
        """Vérification de la structure de la réponse"""
        warnings = []
        
        # Vérification de la longueur minimale
        if len(text) < 50:
            warnings.append("⚠️ Réponse trop courte")
        
        # Vérification de la présence de disclaimers
        disclaimers = [
            "consulter un médecin",
            "avis médical",
            "professionnel de santé"
        ]
        
        has_disclaimer = any(d in text.lower() for d in disclaimers)
        if not has_disclaimer and len(text) > 200:
            warnings.append("⚠️ Absence de disclaimer médical")
        
        return {
            "is_valid": len(warnings) < 2,
            "warnings": warnings
        }
    
    def _calculate_confidence(self, *checks) -> float:
        """Calcul de la confiance globale"""
        confidence = 1.0
        
        for check in checks:
            if isinstance(check, dict):
                # Pénalités basées sur les erreurs et warnings
                if "errors" in check:
                    confidence -= len(check["errors"]) * 0.2
                if "warnings" in check:
                    confidence -= len(check["warnings"]) * 0.05
                if "is_safe" in check and not check["is_safe"]:
                    confidence -= 0.3
                if "has_hallucinations" in check and check["has_hallucinations"]:
                    confidence -= 0.15
        
        return max(0.0, min(1.0, confidence))
    
    def add_medical_disclaimer(self, response: str) -> str:
        """Ajout d'un disclaimer médical à la réponse"""
        disclaimer = (
            "\n\n---\n"
            "⚕️ **Avertissement médical**: Cette réponse est fournie à titre informatif uniquement "
            "et ne remplace pas une consultation médicale. En cas de doute ou de symptômes persistants, "
            "veuillez consulter un professionnel de santé qualifié."
        )
        
        return response + disclaimer
