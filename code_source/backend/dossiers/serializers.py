from rest_framework import serializers
from .models import DossierMedical, Consultation, DocumentMedical
from users.serializers import UserSerializer


class DossierMedicalSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    patient_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = DossierMedical
        fields = [
            'id', 'patient', 'patient_id', 'tenant_id', 'numero_dossier',
            'date_creation', 'date_modification', 'groupe_sanguin',
            'allergies', 'antecedents_medicaux', 'antecedents_chirurgicaux',
            'traitements_en_cours', 'statut'
        ]
        read_only_fields = ['id', 'date_creation', 'date_modification', 'numero_dossier']


class ConsultationSerializer(serializers.ModelSerializer):
    medecin = UserSerializer(read_only=True)
    medecin_id = serializers.IntegerField(write_only=True, required=False)
    dossier_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Consultation
        fields = [
            'id', 'dossier', 'dossier_id', 'medecin', 'medecin_id', 'tenant_id',
            'date_consultation', 'motif', 'diagnostic', 'traitement_prescrit',
            'notes', 'examens_demandes', 'resultats_examens',
            'date_creation', 'date_modification'
        ]
        read_only_fields = ['id', 'date_creation', 'date_modification']


class DocumentMedicalSerializer(serializers.ModelSerializer):
    dossier_id = serializers.IntegerField(write_only=True)
    consultation_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = DocumentMedical
        fields = [
            'id', 'dossier', 'dossier_id', 'consultation', 'consultation_id',
            'tenant_id', 'titre', 'type_document', 'fichier', 'description',
            'date_document', 'date_upload', 'tags'
        ]
        read_only_fields = ['id', 'date_upload']
