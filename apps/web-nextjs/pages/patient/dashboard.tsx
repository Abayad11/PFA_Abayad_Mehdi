import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const tenantId = localStorage.getItem('tenant_id') || 'chu-casablanca';
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant-Id': tenantId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Erreur chargement user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/back_patient.jpg)',
          }}
        >
          <div className="absolute inset-0 bg-cyan-900/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-sm shadow-lg border-b border-cyan-300/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-white">Mon Espace Patient</h1>
                  <p className="mt-1 text-sm text-cyan-100">
                    Gérez votre santé et communiquez avec vos médecins
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{user?.email || 'Patient'}</p>
                    <p className="text-xs text-cyan-200">Patient</p>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      router.push('/auth/login');
                    }}
                    className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Link
            href="/patient/dossiers"
            className="bg-white/10 backdrop-blur-sm rounded-lg shadow hover:shadow-xl transition p-6 block group border-2 border-cyan-300/30"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-lg group-hover:from-cyan-500 group-hover:to-cyan-700 transition">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Mes Dossiers</h3>
                <p className="text-sm text-cyan-100">Consultez vos dossiers médicaux</p>
              </div>
            </div>
          </Link>

          <Link
            href="/patient/messagerie"
            className="bg-white/10 backdrop-blur-sm rounded-lg shadow hover:shadow-xl transition p-6 block group border-2 border-cyan-300/30"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-cyan-700 rounded-lg group-hover:from-cyan-600 group-hover:to-cyan-800 transition">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Messagerie</h3>
                <p className="text-sm text-cyan-100">Contactez votre médecin</p>
              </div>
            </div>
          </Link>

          <Link
            href="/patient/conseiller-ia"
            className="bg-white/10 backdrop-blur-sm rounded-lg shadow hover:shadow-xl transition p-6 block group border-2 border-cyan-300/30"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-cyan-600 to-cyan-800 rounded-lg group-hover:from-cyan-700 group-hover:to-cyan-900 transition">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Conseiller IA</h3>
                <p className="text-sm text-cyan-100">Parlez avec votre conseiller pour connaître votre statut médical et obtenir une réclamation</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow p-6 border-2 border-cyan-300/30">
            <p className="text-sm text-cyan-200">Dossiers médicaux</p>
            <p className="text-3xl font-bold text-white mt-2">2</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow p-6 border-2 border-cyan-300/30">
            <p className="text-sm text-cyan-200">Messages non lus</p>
            <p className="text-3xl font-bold text-white mt-2">1</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow p-6 border-2 border-cyan-300/30">
            <p className="text-sm text-cyan-200">Consultations IA</p>
            <p className="text-3xl font-bold text-white mt-2">0</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow p-6 border-2 border-cyan-300/30">
          <h2 className="text-xl font-semibold text-white mb-4">Activité Récente</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-cyan-300/30">
              <div className="p-2 bg-cyan-600 rounded">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Nouveau dossier créé</p>
                <p className="text-sm text-cyan-100">Consultation Cardiologie - Janvier 2025</p>
                <p className="text-xs text-cyan-200 mt-1">Il y a 2 jours</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-cyan-600 rounded">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Message reçu</p>
                <p className="text-sm text-cyan-100">Dr. Amina Benali - Votre prochain rendez-vous...</p>
                <p className="text-xs text-cyan-200 mt-1">Il y a 3 heures</p>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

