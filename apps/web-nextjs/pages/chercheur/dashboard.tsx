import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function ChercheurDashboard() {
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
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/back_chercheur2.jpg)' }}
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
                  <h1 className="text-3xl font-bold text-white">Dashboard Chercheur</h1>
                  <p className="mt-1 text-sm text-cyan-100">
                    Accédez aux données et participez à la recherche médicale
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{user?.email || 'Chercheur'}</p>
                    <p className="text-xs text-cyan-200">Chercheur</p>
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
            {/* Mes Outils de Recherche */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Mes Outils de Recherche</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Accès aux datasets */}
                <Link
                  href="/chercheur/datasets"
                  className="bg-white/10 backdrop-blur-sm rounded-lg shadow hover:shadow-xl transition p-6 block group border-2 border-cyan-300/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-lg group-hover:from-cyan-500 group-hover:to-cyan-700 transition">
                      <svg
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">Accès aux datasets</h3>
                      <p className="text-sm text-cyan-100 mb-4">
                        Explorez des datasets anonymisés pour vos recherches : images médicales, résultats d'analyses, données cliniques
                      </p>
                      <div className="flex items-center text-cyan-300 font-medium text-sm group-hover:text-cyan-200">
                        Accéder aux datasets
                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Challenges & Compétitions */}
                <Link
                  href="/chercheur/challenges"
                  className="bg-white/10 backdrop-blur-sm rounded-lg shadow hover:shadow-xl transition p-6 block group border-2 border-cyan-300/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-r from-cyan-500 to-cyan-700 rounded-lg group-hover:from-cyan-600 group-hover:to-cyan-800 transition">
                      <svg
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">Challenges & Compétitions</h3>
                      <p className="text-sm text-cyan-100 mb-4">
                        Participez à des challenges pour développer des solutions IA innovantes et aider les hôpitaux
                      </p>
                      <div className="flex items-center text-cyan-300 font-medium text-sm group-hover:text-cyan-200">
                        Voir les challenges
                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Statistiques */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Mes Statistiques</h2>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow p-6 border-2 border-cyan-300/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-cyan-200">Datasets accédés</p>
                      <p className="text-3xl font-bold text-white mt-2">12</p>
                    </div>
                    <div className="p-3 bg-cyan-600 rounded-lg">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow p-6 border-2 border-cyan-300/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-cyan-200">Challenges actifs</p>
                      <p className="text-3xl font-bold text-white mt-2">3</p>
                    </div>
                    <div className="p-3 bg-cyan-600 rounded-lg">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow p-6 border-2 border-cyan-300/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-cyan-200">Soumissions</p>
                      <p className="text-3xl font-bold text-white mt-2">27</p>
                    </div>
                    <div className="p-3 bg-cyan-600 rounded-lg">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow p-6 border-2 border-cyan-300/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-cyan-200">Classement moyen</p>
                      <p className="text-3xl font-bold text-white mt-2">#8</p>
                    </div>
                    <div className="p-3 bg-cyan-600 rounded-lg">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activité récente */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Activité Récente</h2>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow border-2 border-cyan-300/30">
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b border-cyan-300/30">
                    <div className="p-2 bg-cyan-600 rounded">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">Soumission acceptée</p>
                      <p className="text-sm text-cyan-100">Challenge "Détection COVID-19" - Score: 0.94</p>
                      <p className="text-xs text-cyan-200 mt-1">Il y a 2 heures</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pb-4 border-b border-cyan-300/30">
                    <div className="p-2 bg-cyan-600 rounded">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">Dataset téléchargé</p>
                      <p className="text-sm text-cyan-100">IRM Cérébrales - Tumeurs (8.7 GB)</p>
                      <p className="text-xs text-cyan-200 mt-1">Il y a 1 jour</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-cyan-600 rounded">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">Nouveau challenge disponible</p>
                      <p className="text-sm text-cyan-100">Prédiction d'Arythmies Cardiaques - 30 000 MAD</p>
                      <p className="text-xs text-cyan-200 mt-1">Il y a 3 jours</p>
                    </div>
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

