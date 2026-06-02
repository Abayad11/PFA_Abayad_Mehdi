import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  allowedRoles?: Array<'patient' | 'medecin' | 'chercheur' | 'admin'>;
}

/**
 * Composant pour protéger les routes
 * Redirige vers /login si l'utilisateur n'est pas authentifié
 * Supporte la restriction par rôle
 */
export default function ProtectedRoute({ 
  children, 
  redirectTo = '/login',
  allowedRoles
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Vérifier l'authentification
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Vérifier le rôle si spécifié
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Rediriger vers le dashboard approprié
        const dashboardRoutes: Record<string, string> = {
          patient: '/patient/dashboard',
          medecin: '/medecin/dashboard',
          chercheur: '/chercheur/dashboard',
          admin: '/admin/dashboard',
        };
        router.push(dashboardRoutes[user.role] || '/');
      }
    }
  }, [loading, isAuthenticated, user, router, redirectTo, allowedRoles]);

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification...</p>
        </div>
      </div>
    );
  }

  // Ne rien afficher si pas authentifié (la redirection est en cours)
  if (!isAuthenticated) {
    return null;
  }

  // Vérifier le rôle
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
