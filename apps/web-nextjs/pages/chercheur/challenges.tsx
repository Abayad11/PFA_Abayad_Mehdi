import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Challenge {
  id: string;
  title: string;
  description: string;
  organizer: string;
  category: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  prize: string;
  startDate: string;
  endDate: string;
  participants: number;
  submissions: number;
  status: 'upcoming' | 'active' | 'ended';
  metrics: string[];
  dataset: string;
  tags: string[];
}

export default function ChallengesPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'ended'>('active');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadChallenges();
  }, []);

  const handleParticipate = (challengeId: string) => {
    router.push(`/chercheur/challenges/${challengeId}/participate`);
  };

  const handleViewDetails = (challengeId: string) => {
    router.push(`/chercheur/challenges/${challengeId}`);
  };

  const handleViewResults = (challengeId: string) => {
    router.push(`/chercheur/challenges/${challengeId}/results`);
  };

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const tenantId = localStorage.getItem('tenant_id') || 'chu-casablanca';
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

      const response = await fetch(`${API_BASE_URL}/challenges`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant-Id': tenantId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChallenges(data);
      } else {
        // Fallback sur mock data
        const mockChallenges: Challenge[] = [
          {
            id: 'ch-1',
            title: 'Détection COVID-19 sur Radiographies Thorax',
            description: 'Développez un modèle de classification pour détecter le COVID-19 à partir de radiographies thoraciques. Dataset de 5000+ images annotées.',
            organizer: 'CHU Casablanca',
            category: 'Classification',
            difficulty: 'Intermédiaire',
            prize: '50 000 MAD + Publication',
            startDate: '2025-01-01',
            endDate: '2025-03-31',
            participants: 127,
            submissions: 342,
            status: 'active',
            metrics: ['Accuracy', 'F1-Score', 'AUC-ROC'],
            dataset: 'Radiographies Thorax COVID-19',
            tags: ['COVID-19', 'Classification', 'Deep Learning', 'Radiologie'],
          },
          {
            id: 'ch-2',
            title: 'Segmentation de Tumeurs Cérébrales',
            description: 'Challenge de segmentation 3D de tumeurs sur IRM cérébrales. Utilisez des architectures U-Net ou Transformer pour obtenir les meilleures performances.',
            organizer: 'Institut National de Recherche',
            category: 'Segmentation',
            difficulty: 'Avancé',
            prize: '100 000 MAD + Stage de recherche',
            startDate: '2025-02-01',
            endDate: '2025-05-31',
            participants: 89,
            submissions: 156,
            status: 'active',
            metrics: ['Dice Score', 'IoU', 'Hausdorff Distance'],
            dataset: 'IRM Cérébrales - Tumeurs',
            tags: ['Segmentation', 'IRM', 'Tumeur', '3D', 'U-Net'],
          },
          {
            id: 'ch-3',
            title: 'Prédiction d\'Arythmies Cardiaques',
            description: 'Développez un système de détection précoce d\'arythmies à partir de signaux ECG. Challenge de série temporelle avec 10000+ enregistrements.',
            organizer: 'Société Marocaine de Cardiologie',
            category: 'Série Temporelle',
            difficulty: 'Intermédiaire',
            prize: '30 000 MAD',
            startDate: '2025-03-01',
            endDate: '2025-06-30',
            participants: 0,
            submissions: 0,
            status: 'upcoming',
            metrics: ['Accuracy', 'Precision', 'Recall'],
            dataset: 'ECG Arythmies Cardiaques',
            tags: ['ECG', 'Cardiologie', 'Série temporelle', 'LSTM'],
          },
          {
            id: 'ch-4',
            title: 'Classification Rétinopathie Diabétique',
            description: 'Classifiez les stades de rétinopathie diabétique (0-4) à partir d\'images de fond d\'œil. Dataset de 3500 images annotées par des ophtalmologues.',
            organizer: 'Association des Diabétiques du Maroc',
            category: 'Classification',
            difficulty: 'Débutant',
            prize: '20 000 MAD',
            startDate: '2025-01-15',
            endDate: '2025-04-15',
            participants: 203,
            submissions: 567,
            status: 'active',
            metrics: ['Quadratic Weighted Kappa', 'Accuracy'],
            dataset: 'Rétinopathie Diabétique',
            tags: ['Ophtalmologie', 'Classification', 'Diabète', 'CNN'],
          },
          {
            id: 'ch-5',
            title: 'Analyse Histopathologique Cancer du Sein',
            description: 'Challenge de classification d\'images histopathologiques pour le diagnostic du cancer du sein. Distinguez entre bénin et malin.',
            organizer: 'Ligue Marocaine de Lutte contre le Cancer',
            category: 'Classification',
            difficulty: 'Avancé',
            prize: '75 000 MAD + Collaboration recherche',
            startDate: '2024-11-01',
            endDate: '2025-01-31',
            participants: 156,
            submissions: 423,
            status: 'active',
            metrics: ['Accuracy', 'Sensitivity', 'Specificity'],
            dataset: 'Histopathologie Cancer du Sein',
            tags: ['Histopathologie', 'Cancer', 'Classification', 'Vision Transformer'],
          },
          {
            id: 'ch-6',
            title: 'Détection de Pneumonie Pédiatrique',
            description: 'Challenge terminé. Développement d\'un système de détection automatique de pneumonie chez les enfants.',
            organizer: 'Hôpital d\'Enfants Rabat',
            category: 'Classification',
            difficulty: 'Intermédiaire',
            prize: '40 000 MAD',
            startDate: '2024-09-01',
            endDate: '2024-12-31',
            participants: 178,
            submissions: 512,
            status: 'ended',
            metrics: ['Accuracy', 'F1-Score'],
            dataset: 'Radiographies Thorax Pédiatriques',
            tags: ['Pédiatrie', 'Pneumonie', 'Classification'],
          },
        ];
        setChallenges(mockChallenges);
      }
    } catch (error) {
      console.error('Erreur chargement challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChallenges = challenges.filter((ch) => {
    if (filter === 'all') return true;
    return ch.status === filter;
  });

  const getStatusBadge = (status: Challenge['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">En cours</span>;
      case 'upcoming':
        return <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">À venir</span>;
      case 'ended':
        return <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Terminé</span>;
    }
  };

  const getDifficultyBadge = (difficulty: Challenge['difficulty']) => {
    const colors = {
      'Débutant': 'bg-green-100 text-green-800',
      'Intermédiaire': 'bg-yellow-100 text-yellow-800',
      'Avancé': 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded ${colors[difficulty]}`}>{difficulty}</span>;
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Terminé';
    if (diff === 0) return 'Dernier jour';
    if (diff === 1) return '1 jour restant';
    return `${diff} jours restants`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">Challenges IA Médicale</h1>
              <p className="mt-2 text-blue-100">
                Participez aux compétitions et contribuez à l'avancement de la recherche médicale
              </p>
            </div>
            <Link
              href="/chercheur/dashboard"
              className="px-4 py-2 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30 transition"
            >
              ← Retour
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex gap-2">
            {(['all', 'active', 'upcoming', 'ended'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' && 'Tous'}
                {status === 'active' && `En cours (${challenges.filter(c => c.status === 'active').length})`}
                {status === 'upcoming' && `À venir (${challenges.filter(c => c.status === 'upcoming').length})`}
                {status === 'ended' && `Terminés (${challenges.filter(c => c.status === 'ended').length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredChallenges.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun challenge</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucun challenge ne correspond à ce filtre
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredChallenges.map((challenge) => (
              <div key={challenge.id} className="bg-white rounded-lg shadow hover:shadow-xl transition p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">{challenge.title}</h2>
                      {getStatusBadge(challenge.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Organisé par <span className="font-semibold">{challenge.organizer}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{challenge.prize}</p>
                    <p className="text-xs text-gray-500">Prix</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{challenge.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-xs text-gray-500">Participants</p>
                    <p className="text-lg font-bold text-gray-900">{challenge.participants}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-xs text-gray-500">Soumissions</p>
                    <p className="text-lg font-bold text-gray-900">{challenge.submissions}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-xs text-gray-500">Catégorie</p>
                    <p className="text-sm font-semibold text-gray-900">{challenge.category}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-xs text-gray-500">Difficulté</p>
                    <div className="mt-1">{getDifficultyBadge(challenge.difficulty)}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Métriques d'évaluation:</p>
                  <div className="flex flex-wrap gap-2">
                    {challenge.metrics.map((metric) => (
                      <span key={metric} className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {challenge.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Début:</span>{' '}
                      {new Date(challenge.startDate).toLocaleDateString('fr-FR')}
                    </div>
                    <div>
                      <span className="font-medium">Fin:</span>{' '}
                      {new Date(challenge.endDate).toLocaleDateString('fr-FR')}
                    </div>
                    {challenge.status === 'active' && (
                      <div className="font-semibold text-orange-600">
                        {getDaysRemaining(challenge.endDate)}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {challenge.status === 'active' && (
                      <button 
                        onClick={() => handleParticipate(challenge.id)}
                        className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-medium"
                      >
                        Participer
                      </button>
                    )}
                    {challenge.status === 'upcoming' && (
                      <button 
                        onClick={() => handleParticipate(challenge.id)}
                        className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-medium"
                      >
                        S'inscrire
                      </button>
                    )}
                    {challenge.status === 'ended' && (
                      <button 
                        onClick={() => handleViewResults(challenge.id)}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                      >
                        Voir les résultats
                      </button>
                    )}
                    <button 
                      onClick={() => handleViewDetails(challenge.id)}
                      className="px-4 py-2 border border-cyan-300/30 text-white rounded-lg hover:bg-white/10 transition"
                    >
                      Détails
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

