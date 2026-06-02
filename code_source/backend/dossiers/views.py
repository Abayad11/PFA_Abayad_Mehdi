from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from .models import DossierMedical, Consultation, DocumentMedical
from .serializers import (
    DossierMedicalSerializer,
    ConsultationSerializer,
    DocumentMedicalSerializer
)
from .permissions import DossierMedicalPermission, ConsultationPermission
import uuid


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class DossierMedicalViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les dossiers médicaux avec pagination, filtres et recherche
    
    Endpoints:
    - GET /api/dossiers/ - Liste paginée
    - GET /api/dossiers/{id}/ - Détail
    - POST /api/dossiers/ - Créer (médecin uniquement)
    - PUT/PATCH /api/dossiers/{id}/ - Modifier (médecin uniquement)
    - DELETE /api/dossiers/{id}/ - Soft delete (médecin uniquement)
    
    Filtres disponibles:
    - statut: actif, archive
    - patient: ID du patient
    - date_creation: date (format YYYY-MM-DD)
    
    Recherche:
    - numero_dossier
    - patient__first_name
    - patient__last_name
    - patient__email
    """
    serializer_class = DossierMedicalSerializer
    permission_classes = [IsAuthenticated, DossierMedicalPermission]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['statut', 'patient', 'groupe_sanguin']
    search_fields = ['numero_dossier', 'patient__first_name', 'patient__last_name', 'patient__email']
    ordering_fields = ['created_at', 'numero_dossier']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        tenant_id = self.request.headers.get('X-Tenant-Id', user.tenant_id)
        
        # Filtrer par tenant_id pour isolation multi-tenant
        queryset = DossierMedical.objects.filter(tenant_id=tenant_id).select_related('patient')
        
        # Les patients ne voient que leurs propres dossiers
        if user.role == 'patient':
            queryset = queryset.filter(patient=user)
        # Les médecins voient tous les dossiers de leur établissement
        elif user.role == 'medecin':
            pass  # Déjà filtré par tenant_id
        # Les chercheurs ont accès en lecture seule (données anonymisées)
        elif user.role == 'chercheur':
            pass
        
        # Filtres personnalisés via query params
        date_debut = self.request.query_params.get('date_debut', None)
        date_fin = self.request.query_params.get('date_fin', None)
        
        if date_debut:
            queryset = queryset.filter(created_at__gte=date_debut)
        if date_fin:
            queryset = queryset.filter(created_at__lte=date_fin)
        
        return queryset
    
    def perform_create(self, serializer):
        tenant_id = self.request.headers.get('X-Tenant-Id', self.request.user.tenant_id)
        # Générer un numéro de dossier unique
        numero_dossier = f"DOS-{tenant_id.upper()}-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(tenant_id=tenant_id, numero_dossier=numero_dossier)
    
    def perform_destroy(self, instance):
        """Soft delete: marquer comme archivé au lieu de supprimer"""
        instance.statut = 'archive'
        instance.save()
    
    @action(detail=True, methods=['post'])
    def archiver(self, request, pk=None):
        """Archiver un dossier médical"""
        dossier = self.get_object()
        dossier.statut = 'archive'
        dossier.save()
        return Response({'status': 'dossier archivé'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def reactiver(self, request, pk=None):
        """Réactiver un dossier archivé"""
        dossier = self.get_object()
        dossier.statut = 'actif'
        dossier.save()
        return Response({'status': 'dossier réactivé'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['get'])
    def consultations(self, request, pk=None):
        """Récupérer toutes les consultations d'un dossier avec pagination"""
        dossier = self.get_object()
        consultations = dossier.consultations.all().order_by('-date_consultation')
        
        # Pagination
        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(consultations, request)
        if page is not None:
            serializer = ConsultationSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = ConsultationSerializer(consultations, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def documents(self, request, pk=None):
        """Récupérer tous les documents d'un dossier avec pagination"""
        dossier = self.get_object()
        documents = dossier.documents.all().order_by('-date_upload')
        
        # Pagination
        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(documents, request)
        if page is not None:
            serializer = DocumentMedicalSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = DocumentMedicalSerializer(documents, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistiques(self, request):
        """Statistiques des dossiers médicaux"""
        queryset = self.get_queryset()
        total = queryset.count()
        actifs = queryset.filter(statut='actif').count()
        archives = queryset.filter(statut='archive').count()
        
        return Response({
            'total': total,
            'actifs': actifs,
            'archives': archives
        })


class ConsultationViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les consultations
    """
    serializer_class = ConsultationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        tenant_id = self.request.headers.get('X-Tenant-Id', user.tenant_id)
        
        queryset = Consultation.objects.filter(tenant_id=tenant_id)
        
        # Les patients voient leurs propres consultations
        if user.role == 'patient':
            queryset = queryset.filter(dossier__patient=user)
        # Les médecins voient leurs consultations
        elif user.role == 'medecin':
            queryset = queryset.filter(medecin=user)
        
        return queryset
    
    def perform_create(self, serializer):
        tenant_id = self.request.headers.get('X-Tenant-Id', self.request.user.tenant_id)
        medecin = self.request.user if self.request.user.role == 'medecin' else None
        serializer.save(tenant_id=tenant_id, medecin=medecin)


class DocumentMedicalViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les documents médicaux
    """
    serializer_class = DocumentMedicalSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        tenant_id = self.request.headers.get('X-Tenant-Id', user.tenant_id)
        
        queryset = DocumentMedical.objects.filter(tenant_id=tenant_id)
        
        # Les patients voient leurs propres documents
        if user.role == 'patient':
            queryset = queryset.filter(dossier__patient=user)
        
        return queryset
    
    def perform_create(self, serializer):
        tenant_id = self.request.headers.get('X-Tenant-Id', self.request.user.tenant_id)
        serializer.save(tenant_id=tenant_id)
