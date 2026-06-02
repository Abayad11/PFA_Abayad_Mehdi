from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DossierMedicalViewSet, ConsultationViewSet, DocumentMedicalViewSet

router = DefaultRouter()
router.register(r'dossiers', DossierMedicalViewSet, basename='dossier')
router.register(r'consultations', ConsultationViewSet, basename='consultation')
router.register(r'documents', DocumentMedicalViewSet, basename='document')

urlpatterns = [
    path('', include(router.urls)),
]
