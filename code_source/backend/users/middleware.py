"""
Middleware pour gérer le multi-tenant
Vérifie que l'utilisateur appartient au bon tenant_id
"""
from django.http import JsonResponse
from rest_framework import status


class TenantMiddleware:
    """
    Middleware pour vérifier l'isolation multi-tenant
    Vérifie le header X-Tenant-Id et s'assure que l'utilisateur appartient au bon tenant
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Ignorer les routes publiques
        public_paths = ['/api/auth/register/', '/api/auth/login/', '/admin/']
        if any(request.path.startswith(path) for path in public_paths):
            return self.get_response(request)

        # Vérifier si l'utilisateur est authentifié
        if request.user.is_authenticated:
            # Récupérer le tenant_id du header
            tenant_id = request.headers.get('X-Tenant-Id', 'chu-casablanca')
            
            # Vérifier que l'utilisateur appartient au bon tenant
            if request.user.tenant_id != tenant_id:
                return JsonResponse({
                    'error': 'Accès refusé',
                    'detail': 'Vous n\'avez pas accès à cet établissement'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Ajouter le tenant_id à la requête pour un accès facile
            request.tenant_id = tenant_id

        response = self.get_response(request)
        return response


class RolePermissionMiddleware:
    """
    Middleware pour vérifier les permissions basées sur les rôles
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Routes protégées par rôle
        role_paths = {
            'patient': ['/api/patient/'],
            'medecin': ['/api/medecin/'],
            'chercheur': ['/api/chercheur/'],
            'admin': ['/api/admin/'],
        }

        if request.user.is_authenticated:
            user_role = request.user.role
            
            # Vérifier si l'utilisateur accède à une route de son rôle
            for role, paths in role_paths.items():
                if any(request.path.startswith(path) for path in paths):
                    if user_role != role and user_role != 'admin':
                        return JsonResponse({
                            'error': 'Accès refusé',
                            'detail': f'Cette ressource est réservée aux {role}s'
                        }, status=status.HTTP_403_FORBIDDEN)

        response = self.get_response(request)
        return response
