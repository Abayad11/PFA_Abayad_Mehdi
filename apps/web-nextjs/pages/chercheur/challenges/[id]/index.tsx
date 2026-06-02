import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ChallengeDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const challenge = {
    id: id as string,
    title: 'Détection COVID-19 sur Radiographies Thorax',
    description: 'Développez un modèle de classification pour détecter le COVID-19 à partir de radiographies thoraciques.',
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
    rules: [
      'Chaque participant peut soumettre jusqu\'à 5 modèles par jour',
      'Le dataset d\'entraînement contient 5000 images annotées',
      'Le dataset de test contient 1000 images non annotées',
      'L\'évaluation se fait sur le dataset de test',
      'Les soumissions doivent respecter le format spécifié',
    ],
    evaluation: 'Les modèles sont évalués sur la base de l\'accuracy, du F1-Score et de l\'AUC-ROC. Le classement final est basé sur une moyenne pondérée de ces métriques.',
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/back_chercheur2.jpg)' }}>
        <div className="absolute inset-0 bg-cyan-900/40"></div>
      </div>
      <div className="relative z-10">
        <div className="bg-white/10 backdrop-blur-sm shadow-lg border-b border-cyan-300/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Link href="/chercheur/challenges" className="p-2 hover:bg-white/20 rounded-lg transition">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-white">{challenge.title}</h1>
                  <p className="mt-1 text-sm text-cyan-100">Par {challenge.organizer}</p>
                </div>
              </div>
              {challenge.status === 'active' && (
                <Link
                  href={`/chercheur/challenges/${id}/participate`}
                  className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-medium"
                >
                  🚀 Participer
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">📝 Description</h2>
                <p className="text-cyan-100 leading-relaxed">{challenge.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {challenge.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-cyan-600/30 border border-cyan-400/30 text-cyan-100 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">📋 Règles</h2>
                <ul className="space-y-2">
                  {challenge.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-cyan-100">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">📊 Évaluation</h2>
                <p className="text-cyan-100 mb-4">{challenge.evaluation}</p>
                <div className="grid gap-2 md:grid-cols-3">
                  {challenge.metrics.map((metric) => (
                    <div key={metric} className="px-4 py-2 bg-cyan-600/20 border border-cyan-400/30 rounded-lg text-center">
                      <span className="text-white font-semibold">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">ℹ️ Informations</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-cyan-200">Catégorie</p>
                    <p className="text-white font-semibold">{challenge.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-cyan-200">Difficulté</p>
                    <p className="text-white font-semibold">{challenge.difficulty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-cyan-200">Prix</p>
                    <p className="text-white font-semibold">{challenge.prize}</p>
                  </div>
                  <div>
                    <p className="text-sm text-cyan-200">Dataset</p>
                    <p className="text-white font-semibold">{challenge.dataset}</p>
                  </div>
                  <div>
                    <p className="text-sm text-cyan-200">Dates</p>
                    <p className="text-white font-semibold">
                      {new Date(challenge.startDate).toLocaleDateString('fr-FR')} - {new Date(challenge.endDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">📈 Statistiques</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-200">Participants</span>
                    <span className="text-white font-bold text-xl">{challenge.participants}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-200">Soumissions</span>
                    <span className="text-white font-bold text-xl">{challenge.submissions}</span>
                  </div>
                </div>
              </div>
              <div className="bg-cyan-600/20 border border-cyan-400/30 rounded-lg p-4">
                <p className="text-sm text-cyan-100">
                  💡 <strong>Astuce:</strong> Consultez le forum de discussion pour échanger avec d'autres participants
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
