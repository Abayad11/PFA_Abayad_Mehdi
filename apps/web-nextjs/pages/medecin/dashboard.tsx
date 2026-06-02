import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function MedecinDashboard() {
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
      <div className="min-h-screen bg-gray-50 relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/back_chercheur.jpg)' }}
      >
        <div className="absolute inset-0 bg-cyan-900/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="shadow backdrop-blur-sm border-b-4 border-blue-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Espace Médecin</h1>
              <p className="mt-1 text-sm font-bold text-white">
                Gérez vos patients et bénéficiez de l'aide à la décision IA
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-white">{user?.email || 'Médecin'}</p>
                <p className="text-xs font-bold text-white">Médecin</p>
              </div>
              <button
                onClick={() => {
                  localStorage.clear();
                  router.push('/auth/login');
                }}
                className="px-4 py-2 text-sm font-bold text-red-600 hover:text-red-800"
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
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Link
            href="/medecin/patients"
            className="rounded-lg shadow hover:shadow-xl transition p-6 block group backdrop-blur-sm border-2 border-blue-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-extrabold text-white">Mes Patients</h3>
                <p className="text-sm font-bold text-white">Gérer et communiquer avec vos patients</p>
              </div>
            </div>
          </Link>

          <Link
            href="/medecin/conseiller-ia"
            className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg shadow hover:shadow-xl transition p-6 block group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 bg-white/10 rounded-full"></div>
            <div className="relative flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur rounded-lg group-hover:bg-white/30 transition">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-extrabold text-white">Conseiller IA Médical</h3>
                <p className="text-sm font-bold text-purple-100">Aide à la décision & Rapports patients</p>
              </div>
            </div>
            <div className="relative mt-4 flex items-center gap-2 text-white/90 text-xs">
              <span className="inline-flex items-center gap-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Aide décision
              </span>
              <span className="inline-flex items-center gap-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Rapports patients
              </span>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-gray-200">
            <p className="text-sm font-bold text-white">Patients suivis</p>
            <p className="text-3xl font-extrabold text-white mt-2">24</p>
          </div>
          <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-gray-200">
            <p className="text-sm font-bold text-white">Consultations aujourd'hui</p>
            <p className="text-3xl font-extrabold text-white mt-2">5</p>
          </div>
          <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-gray-200">
            <p className="text-sm font-bold text-white">Messages non lus</p>
            <p className="text-3xl font-extrabold text-white mt-2">3</p>
          </div>
          <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-gray-200">
            <p className="text-sm font-bold text-white">Consultations IA</p>
            <p className="text-3xl font-extrabold text-white mt-2">12</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-gray-200">
          <h2 className="text-xl font-extrabold text-white mb-4">Activité Récente</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <div className="p-2 bg-blue-100 rounded">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-white">Nouvelle consultation</p>
                <p className="text-sm font-bold text-white">Patient: Ahmed Bennani - Cardiologie</p>
                <p className="text-xs font-bold text-white mt-1">Il y a 1 heure</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <div className="p-2 bg-purple-100 rounded">
                <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-white">Rapport IA généré</p>
                <p className="text-sm font-bold text-white">Pré-diagnostic pour Fatima El Amrani</p>
                <p className="text-xs font-bold text-white mt-1">Il y a 2 heures</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-100 rounded">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-white">Message reçu</p>
                <p className="text-sm font-bold text-white">Karim Tazi - Question sur traitement</p>
                <p className="text-xs font-bold text-white mt-1">Il y a 3 heures</p>
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

