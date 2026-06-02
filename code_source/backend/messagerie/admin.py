from django.contrib import admin
from .models import Conversation, Message


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['id', 'sujet', 'tenant_id', 'date_creation', 'date_derniere_activite']
    list_filter = ['tenant_id', 'date_creation']
    search_fields = ['sujet']
    filter_horizontal = ['participants']
    readonly_fields = ['date_creation', 'date_derniere_activite']
    date_hierarchy = 'date_creation'


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'conversation', 'expediteur', 'date_envoi', 'lu', 'tenant_id']
    list_filter = ['lu', 'date_envoi', 'tenant_id']
    search_fields = ['contenu', 'expediteur__username']
    readonly_fields = ['date_envoi', 'date_lecture']
    date_hierarchy = 'date_envoi'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('conversation', 'expediteur')
