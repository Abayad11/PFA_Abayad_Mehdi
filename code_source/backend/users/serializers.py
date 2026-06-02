# backend/users/serializers.py
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser


class UserRegisterSerializer(serializers.ModelSerializer):
    """Serializer pour l'inscription d'un nouvel utilisateur"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirmer le mot de passe")
    
    class Meta:
        model = CustomUser
        fields = (
            'username', 'password', 'password2', 'email', 'first_name', 'last_name',
            'role', 'tenant_id', 'telephone', 'adresse', 'date_naissance',
            # Champs spécifiques selon le rôle
            'specialite', 'inpe',  # Médecin
            'groupe_sanguin', 'allergies', 'maladies_chroniques',  # Patient
            'institution', 'domaine_recherche',  # Chercheur
        )
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer pour la connexion"""
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    tenant_id = serializers.CharField(required=False, default='chu-casablanca')


class UserSerializer(serializers.ModelSerializer):
    """Serializer pour les informations utilisateur"""
    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 'role', 'tenant_id',
            'telephone', 'adresse', 'date_naissance', 'is_verified',
            'specialite', 'inpe',
            'groupe_sanguin', 'allergies', 'maladies_chroniques',
            'institution', 'domaine_recherche',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'is_verified')


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour la mise à jour du profil"""
    class Meta:
        model = CustomUser
        fields = (
            'first_name', 'last_name', 'email', 'telephone', 'adresse', 'date_naissance',
            'specialite', 'groupe_sanguin', 'allergies', 'maladies_chroniques',
            'institution', 'domaine_recherche',
        )


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer pour changer le mot de passe"""
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Les mots de passe ne correspondent pas."})
        return attrs