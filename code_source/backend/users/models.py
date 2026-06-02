from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.utils.translation import gettext_lazy as _

class CustomUser(AbstractUser):
    """
    Modèle utilisateur personnalisé pour Abhar Santé Maroc
    Supporte multi-tenant et 4 rôles: patient, medecin, chercheur, admin
    """
    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('medecin', 'Médecin'),
        ('chercheur', 'Chercheur'),
        ('admin', 'Administrateur'),
    )
    
    # Champs obligatoires
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')
    tenant_id = models.CharField(max_length=100, default='chu-casablanca', db_index=True)
    
    # Champs communs
    telephone = models.CharField(max_length=20, blank=True, null=True)
    adresse = models.TextField(blank=True, null=True)
    date_naissance = models.DateField(blank=True, null=True)
    
    # Champs spécifiques médecin
    specialite = models.CharField(max_length=100, blank=True, null=True)
    inpe = models.CharField(max_length=50, blank=True, null=True, unique=True)  # Numéro INPE
    
    # Champs spécifiques patient
    groupe_sanguin = models.CharField(max_length=5, blank=True, null=True)
    allergies = models.TextField(blank=True, null=True)
    maladies_chroniques = models.TextField(blank=True, null=True)
    
    # Champs spécifiques chercheur
    institution = models.CharField(max_length=200, blank=True, null=True)
    domaine_recherche = models.CharField(max_length=200, blank=True, null=True)
    
    # Métadonnées
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Add the following to resolve the SystemCheckError
    groups = models.ManyToManyField(
        Group,
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name="customuser_set",  # Unique related_name
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name="customuser_permissions_set",  # Unique related_name
        related_query_name="user",
    )


    def __str__(self):
        return self.username
