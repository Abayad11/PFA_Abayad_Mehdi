from rest_framework import serializers
from .models import Conversation, Message
from users.serializers import UserSerializer


class MessageSerializer(serializers.ModelSerializer):
    expediteur = UserSerializer(read_only=True)
    expediteur_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Message
        fields = [
            'id', 'conversation', 'expediteur', 'expediteur_id', 'tenant_id',
            'contenu', 'fichier_joint', 'date_envoi', 'lu', 'date_lecture'
        ]
        read_only_fields = ['id', 'date_envoi', 'date_lecture']


class ConversationSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    participant_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True
    )
    dernier_message = serializers.SerializerMethodField()
    messages_non_lus = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = [
            'id', 'tenant_id', 'participants', 'participant_ids', 'sujet',
            'date_creation', 'date_derniere_activite', 'dernier_message',
            'messages_non_lus'
        ]
        read_only_fields = ['id', 'date_creation', 'date_derniere_activite']
    
    def get_dernier_message(self, obj):
        dernier = obj.messages.last()
        if dernier:
            return MessageSerializer(dernier).data
        return None
    
    def get_messages_non_lus(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user:
            return obj.messages.filter(lu=False).exclude(expediteur=user).count()
        return 0
