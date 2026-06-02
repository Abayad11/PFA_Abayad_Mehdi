import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Soumission {
  id: string;
  challengeName: string;
  modelName: string;
  score: number;
  rank: number;
  date: string;
  status: 'pending' | 'evaluated' | 'rejected';
}

export default function ChercheurSoumissionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [soumissions, setSoumissions] = useState<Soumission[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    loadSoumissions();
  }, []);

  const loadSoumissions = async () => {
    try {
      // Mock data
      setSoumissions([
        { id: 'S001', challengeName: 'Détection COVID-19', modelName: 'ResNet50-v2', score: 0.94, rank: 3, date: '2025-01-20', status: 'evaluated' },
        { id: 'S002', challengeName: 'Classification Tumeurs', modelName: 'EfficientNet-B7', score: 0.89, rank: 7, date: '2025-01-18', status: 'evaluated' },
        { id: 'S003', challengeName: 'Prédiction Diabète', modelName: 'XGBoost-Custom', score: 0.0, rank: 0, date: '2025-01-24', status: 'pending' },
      ]);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'evaluated':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-600 text-white">Évaluée</span>;
      case 'pending':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-600 text-white">En attente</span>;
      case 'rejected':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-600 text-white">Rejetée</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/back_chercheur2.jpg)' }}>
          <div className="absolute inset-0 bg-cyan-900/40"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/back_chercheur2.jpg)' }}>
        <div className="absolute inset-0 bg-cyan-900/40"></div>
      </div>
      <div className="relative z-10">
        <div className="bg-white/10 backdrop-blur-sm shadow-lg border-b border-cyan-300/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Link href="/chercheur/dashboard" className="p-2 hover:bg-white/20 rounded-lg transition">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-white">Mes Soumissions</h1>
                  <p className="mt-1 text-sm text-cyan-100">Suivez vos participations aux challenges</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-4">
              <p className="text-sm text-cyan-200">Total soumissions</p>
              <p className="text-2xl font-bold text-white mt-1">{soumissions.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-4">
              <p className="text-sm text-cyan-200">Évaluées</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{soumissions.filter(s => s.status === 'evaluated').length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-4">
              <p className="text-sm text-cyan-200">En attente</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">{soumissions.filter(s => s.status === 'pending').length}</p>
            </div>
          </div>
          <div className="grid gap-4">
            {soumissions.map((soumission) => (
              <div key={soumission.id} className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-6 hover:border-cyan-400/50 transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{soumission.challengeName}</h3>
                      {getStatusBadge(soumission.status)}
                    </div>
                    <div className="grid gap-2 md:grid-cols-4 text-sm mt-3">
                      <div className="text-cyan-100">
                        <span className="font-medium">Modèle:</span> {soumission.modelName}
                      </div>
                      {soumission.status === 'evaluated' && (
                        <>
                          <div className="text-cyan-100">
                            <span className="font-medium">Score:</span> {(soumission.score * 100).toFixed(1)}%
                          </div>
                          <div className="text-cyan-100">
                            <span className="font-medium">Rang:</span> #{soumission.rank}
                          </div>
                        </>
                      )}
                      <div className="text-cyan-100">
                        <span className="font-medium">Date:</span> {new Date(soumission.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  {soumission.status === 'evaluated' && (
                    <Link href={`/chercheur/soumissions/${soumission.id}`} className="ml-4 px-4 py-2 bg-cyan-600 text-white text-sm rounded-lg hover:bg-cyan-700 transition">
                      Détails
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
          {soumissions.length === 0 && (
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-white">Aucune soumission</h3>
              <p className="mt-1 text-sm text-cyan-100">Participez à un challenge pour commencer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

