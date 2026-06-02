from django.db import models
from django.conf import settings


class DossierMedical(models.Model):
    """Dossier médical d'un patient"""
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='dossiers_medicaux',
        limit_choices_to={'role': 'patient'}
    )
    tenant_id = models.CharField(max_length=100, db_index=True)
    numero_dossier = models.CharField(max_length=50, unique=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    # Informations médicales
    groupe_sanguin = models.CharField(max_length=10, blank=True)
    allergies = models.TextField(blank=True)
    antecedents_medicaux = models.TextField(blank=True)
    antecedents_chirurgicaux = models.TextField(blank=True)
    traitements_en_cours = models.TextField(blank=True)
    
    # Métadonnées
    statut = models.CharField(
        max_length=20,
        choices=[
            ('actif', 'Actif'),
            ('archive', 'Archivé'),
            ('suspendu', 'Suspendu')
        ],
        default='actif'
    )
    
    class Meta:
        ordering = ['-date_creation']
        indexes = [
            models.Index(fields=['tenant_id', 'patient']),
            models.Index(fields=['numero_dossier']),
        ]
    
    def __str__(self):
        return f"Dossier {self.numero_dossier} - {self.patient.get_full_name()}"


class Consultation(models.Model):
    """Consultation médicale"""
    dossier = models.ForeignKey(
        DossierMedical,
        on_delete=models.CASCADE,
        related_name='consultations'
    )
    medecin = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='consultations_effectuees',
        limit_choices_to={'role': 'medecin'}
    )
    tenant_id = models.CharField(max_length=100, db_index=True)
    
    date_consultation = models.DateTimeField()
    motif = models.TextField()
    diagnostic = models.TextField(blank=True)
    traitement_prescrit = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    
    # Examens et résultats
    examens_demandes = models.TextField(blank=True)
    resultats_examens = models.TextField(blank=True)
    
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date_consultation']
        indexes = [
            models.Index(fields=['tenant_id', 'dossier']),
            models.Index(fields=['medecin', 'date_consultation']),
        ]
    
    def __str__(self):
        return f"Consultation du {self.date_consultation.strftime('%d/%m/%Y')} - {self.dossier.patient.get_full_name()}"


class DocumentMedical(models.Model):
    """Document médical (ordonnance, résultat d'examen, etc.)"""
    dossier = models.ForeignKey(
        DossierMedical,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    consultation = models.ForeignKey(
        Consultation,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='documents'
    )
    tenant_id = models.CharField(max_length=100, db_index=True)
    
    titre = models.CharField(max_length=200)
    type_document = models.CharField(
        max_length=50,
        choices=[
            ('ordonnance', 'Ordonnance'),
            ('resultat_examen', 'Résultat d\'examen'),
            ('compte_rendu', 'Compte rendu'),
            ('imagerie', 'Imagerie médicale'),
            ('autre', 'Autre')
        ]
    )
    fichier = models.FileField(upload_to='documents_medicaux/%Y/%m/')
    description = models.TextField(blank=True)
    
    date_document = models.DateField()
    date_upload = models.DateTimeField(auto_now_add=True)
    
    # Métadonnées pour la recherche
    tags = models.CharField(max_length=500, blank=True)
    
    class Meta:
        ordering = ['-date_document']
        indexes = [
            models.Index(fields=['tenant_id', 'dossier']),
            models.Index(fields=['type_document']),
        ]
    
    def __str__(self):
        return f"{self.titre} - {self.dossier.patient.get_full_name()}"
