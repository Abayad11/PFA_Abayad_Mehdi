from django.contrib import admin
from .models import DossierMedical, Consultation, DocumentMedical


@admin.register(DossierMedical)
class DossierMedicalAdmin(admin.ModelAdmin):
    list_display = ['numero_dossier', 'patient', 'tenant_id', 'statut', 'date_creation']
    list_filter = ['statut', 'tenant_id', 'date_creation']
    search_fields = ['numero_dossier', 'patient__username', 'patient__email']
    readonly_fields = ['numero_dossier', 'date_creation', 'date_modification']
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('patient', 'tenant_id', 'numero_dossier', 'statut')
        }),
        ('Informations médicales', {
            'fields': ('groupe_sanguin', 'allergies', 'antecedents_medicaux', 
                      'antecedents_chirurgicaux', 'traitements_en_cours')
        }),
        ('Métadonnées', {
            'fields': ('date_creation', 'date_modification'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ['dossier', 'medecin', 'date_consultation', 'tenant_id']
    list_filter = ['date_consultation', 'tenant_id']
    search_fields = ['dossier__numero_dossier', 'medecin__username', 'motif']
    readonly_fields = ['date_creation', 'date_modification']
    date_hierarchy = 'date_consultation'


@admin.register(DocumentMedical)
class DocumentMedicalAdmin(admin.ModelAdmin):
    list_display = ['titre', 'type_document', 'dossier', 'date_document', 'tenant_id']
    list_filter = ['type_document', 'date_document', 'tenant_id']
    search_fields = ['titre', 'dossier__numero_dossier', 'tags']
    readonly_fields = ['date_upload']
    date_hierarchy = 'date_document'
