from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from users.models import CustomUser


class ConversationViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les conversations
    """
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        tenant_id = self.request.headers.get('X-Tenant-Id', user.tenant_id)
        
        # Filtrer les conversations où l'utilisateur est participant
        return Conversation.objects.filter(
            tenant_id=tenant_id,
            participants=user
        )
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def perform_create(self, serializer):
        tenant_id = self.request.headers.get('X-Tenant-Id', self.request.user.tenant_id)
        conversation = serializer.save(tenant_id=tenant_id)
        
        # Ajouter les participants
        participant_ids = self.request.data.get('participant_ids', [])
        participants = CustomUser.objects.filter(
            id__in=participant_ids,
            tenant_id=tenant_id
        )
        conversation.participants.set(participants)
        
        # Ajouter l'utilisateur courant s'il n'est pas déjà dans la liste
        if self.request.user not in conversation.participants.all():
            conversation.participants.add(self.request.user)
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """Récupérer tous les messages d'une conversation"""
        conversation = self.get_object()
        messages = conversation.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def marquer_lu(self, request, pk=None):
        """Marquer tous les messages d'une conversation comme lus"""
        conversation = self.get_object()
        messages_non_lus = conversation.messages.filter(
            lu=False
        ).exclude(expediteur=request.user)
        
        messages_non_lus.update(lu=True, date_lecture=timezone.now())
        
        return Response({
            'message': f'{messages_non_lus.count()} messages marqués comme lus'
        })


class MessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les messages
    """
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        tenant_id = self.request.headers.get('X-Tenant-Id', user.tenant_id)
        
        # Filtrer les messages des conversations de l'utilisateur
        return Message.objects.filter(
            tenant_id=tenant_id,
            conversation__participants=user
        )
    
    def perform_create(self, serializer):
        tenant_id = self.request.headers.get('X-Tenant-Id', self.request.user.tenant_id)
        serializer.save(
            tenant_id=tenant_id,
            expediteur=self.request.user
        )
