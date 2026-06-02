import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Dossier {
  id: string;
  title: string;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export default function DossiersPatientPage() {
  const router = useRouter();
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDossiers();
  }, []);

  const fetchDossiers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const tenantId = localStorage.getItem('tenant_id') || 'chu-casablanca';
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/dossiers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant-Id': tenantId,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        throw new Error('Erreur lors du chargement des dossiers');
      }

      const data = await response.json();
      setDossiers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/back_patient.jpg)' }}
        >
          <div className="absolute inset-0 bg-cyan-900/40"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-4 text-white font-semibold">Chargement des dossiers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative">
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/back_patient.jpg)' }}
        >
          <div className="absolute inset-0 bg-cyan-900/40"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="bg-white/10 backdrop-blur-sm border-2 border-red-400/50 rounded-lg p-6 max-w-md">
            <h2 className="text-white font-semibold text-lg mb-2">Erreur</h2>
            <p className="text-cyan-100">{error}</p>
            <button
              onClick={fetchDossiers}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/back_patient.jpg)' }}
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
                <h1 className="text-3xl font-bold text-white">Mes Dossiers Médicaux</h1>
                <p className="mt-1 text-sm text-cyan-100">
                  Consultez l'historique de vos dossiers médicaux
                </p>
              </div>
              <Link
                href="/patient/dashboard"
                className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white border border-cyan-300/30 rounded-lg hover:bg-white/20 transition"
              >
                ← Retour au tableau de bord
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {dossiers.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-cyan-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-white">Aucun dossier</h3>
              <p className="mt-1 text-sm text-cyan-100">
                Vous n'avez pas encore de dossiers médicaux enregistrés.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {dossiers.map((dossier) => (
                <Link
                  key={dossier.id}
                  href={`/patient/dossiers/${dossier.id}`}
                  className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl hover:shadow-2xl hover:border-cyan-400/50 transition-all p-6 cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-200 transition">
                        {dossier.title}
                      </h3>
                      {dossier.summary && (
                        <p className="text-sm text-cyan-100 mb-4 line-clamp-2">
                          {dossier.summary}
                        </p>
                      )}
                    </div>
                    <svg
                      className="h-5 w-5 text-cyan-300 group-hover:text-cyan-200 transition"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>

                  <div className="mt-4 pt-4 border-t border-cyan-300/30">
                    <div className="flex items-center text-sm text-cyan-200">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Créé le {formatDate(dossier.createdAt)}
                    </div>
                    {dossier.updatedAt !== dossier.createdAt && (
                      <div className="flex items-center text-sm text-cyan-200 mt-1">
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Mis à jour le {formatDate(dossier.updatedAt)}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

