"""
Permissions pour les dossiers médicaux
"""
from rest_framework import permissions


class DossierMedicalPermission(permissions.BasePermission):
    """
    Permissions pour les dossiers médicaux:
    - Patient: Lecture uniquement de ses propres dossiers
    - Médecin: CRUD complet sur tous les dossiers de l'établissement
    - Chercheur: Lecture uniquement (données anonymisées)
    - Admin: Accès complet
    """
    
    def has_permission(self, request, view):
        """Vérifier les permissions au niveau de la vue"""
        if not request.user.is_authenticated:
            return False
        
        # Les chercheurs peuvent uniquement lire
        if request.user.role == 'chercheur':
            return request.method in permissions.SAFE_METHODS
        
        # Les patients peuvent uniquement lire leurs propres dossiers
        if request.user.role == 'patient':
            return request.method in permissions.SAFE_METHODS
        
        # Les médecins et admins ont accès complet
        if request.user.role in ['medecin', 'admin']:
            return True
        
        return False
    
    def has_object_permission(self, request, view, obj):
        """Vérifier les permissions au niveau de l'objet"""
        # Les admins ont tous les droits
        if request.user.role == 'admin':
            return True
        
        # Vérifier que l'objet appartient au bon tenant
        if obj.tenant_id != request.user.tenant_id:
            return False
        
        # Les patients ne peuvent voir que leurs propres dossiers
        if request.user.role == 'patient':
            return obj.patient == request.user and request.method in permissions.SAFE_METHODS
        
        # Les médecins ont tous les droits sur les dossiers de leur établissement
        if request.user.role == 'medecin':
            return True
        
        # Les chercheurs peuvent uniquement lire
        if request.user.role == 'chercheur':
            return request.method in permissions.SAFE_METHODS
        
        return False


class ConsultationPermission(permissions.BasePermission):
    """
    Permissions pour les consultations:
    - Patient: Lecture uniquement de ses propres consultations
    - Médecin: CRUD complet sur ses consultations
    - Chercheur: Lecture uniquement
    - Admin: Accès complet
    """
    
    def has_permission(self, request, view):
        """Vérifier les permissions au niveau de la vue"""
        if not request.user.is_authenticated:
            return False
        
        # Les chercheurs peuvent uniquement lire
        if request.user.role == 'chercheur':
            return request.method in permissions.SAFE_METHODS
        
        # Les patients peuvent uniquement lire
        if request.user.role == 'patient':
            return request.method in permissions.SAFE_METHODS
        
        # Les médecins et admins ont accès complet
        if request.user.role in ['medecin', 'admin']:
            return True
        
        return False
    
    def has_object_permission(self, request, view, obj):
        """Vérifier les permissions au niveau de l'objet"""
        # Les admins ont tous les droits
        if request.user.role == 'admin':
            return True
        
        # Vérifier que l'objet appartient au bon tenant
        if obj.tenant_id != request.user.tenant_id:
            return False
        
        # Les patients peuvent voir leurs propres consultations
        if request.user.role == 'patient':
            return obj.dossier.patient == request.user and request.method in permissions.SAFE_METHODS
        
        # Les médecins peuvent modifier leurs propres consultations
        if request.user.role == 'medecin':
            if request.method in permissions.SAFE_METHODS:
                return True
            return obj.medecin == request.user
        
        # Les chercheurs peuvent uniquement lire
        if request.user.role == 'chercheur':
            return request.method in permissions.SAFE_METHODS
        
        return False


class DocumentMedicalPermission(permissions.BasePermission):
    """
    Permissions pour les documents médicaux:
    - Patient: Lecture uniquement de ses propres documents
    - Médecin: Upload et lecture de tous les documents de l'établissement
    - Chercheur: Lecture uniquement
    - Admin: Accès complet
    """
    
    def has_permission(self, request, view):
        """Vérifier les permissions au niveau de la vue"""
        if not request.user.is_authenticated:
            return False
        
        # Les chercheurs peuvent uniquement lire
        if request.user.role == 'chercheur':
            return request.method in permissions.SAFE_METHODS
        
        # Les patients peuvent lire et uploader leurs propres documents
        if request.user.role == 'patient':
            return True  # La restriction se fait au niveau de l'objet
        
        # Les médecins et admins ont accès complet
        if request.user.role in ['medecin', 'admin']:
            return True
        
        return False
    
    def has_object_permission(self, request, view, obj):
        """Vérifier les permissions au niveau de l'objet"""
        # Les admins ont tous les droits
        if request.user.role == 'admin':
            return True
        
        # Vérifier que l'objet appartient au bon tenant
        if obj.tenant_id != request.user.tenant_id:
            return False
        
        # Les patients peuvent voir leurs propres documents
        if request.user.role == 'patient':
            return obj.dossier.patient == request.user
        
        # Les médecins ont tous les droits
        if request.user.role == 'medecin':
            return True
        
        # Les chercheurs peuvent uniquement lire
        if request.user.role == 'chercheur':
            return request.method in permissions.SAFE_METHODS
        
        return False
