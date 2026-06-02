from django.db import models
from django.conf import settings


class Conversation(models.Model):
    """Conversation entre utilisateurs"""
    tenant_id = models.CharField(max_length=100, db_index=True)
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='conversations'
    )
    sujet = models.CharField(max_length=200, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_derniere_activite = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date_derniere_activite']
        indexes = [
            models.Index(fields=['tenant_id', 'date_derniere_activite']),
        ]
    
    def __str__(self):
        return f"Conversation {self.id} - {self.sujet or 'Sans sujet'}"


class Message(models.Model):
    """Message dans une conversation"""
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    expediteur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='messages_envoyes'
    )
    tenant_id = models.CharField(max_length=100, db_index=True)
    
    contenu = models.TextField()
    fichier_joint = models.FileField(upload_to='messages/%Y/%m/', blank=True, null=True)
    
    date_envoi = models.DateTimeField(auto_now_add=True)
    lu = models.BooleanField(default=False)
    date_lecture = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['date_envoi']
        indexes = [
            models.Index(fields=['conversation', 'date_envoi']),
            models.Index(fields=['expediteur', 'date_envoi']),
        ]
    
    def __str__(self):
        return f"Message de {self.expediteur.get_full_name()} - {self.date_envoi.strftime('%d/%m/%Y %H:%M')}"
