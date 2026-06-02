import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

type PeriodType = 'jour' | 'semaine' | 'mois' | 'annee';

interface LogAudit {
  id: string;
  timestamp: string;
  utilisateur: string;
  action: string;
  details: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export default function TransparenceRapports() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('mois');

  const [logsAudit] = useState<LogAudit[]>([
    {
      id: '1',
      timestamp: '2024-10-27 14:30:25',
      utilisateur: 'Dr. Ahmed Bennani',
      action: 'Consultation créée',
      details: 'Nouvelle consultation pour patient #1234',
      type: 'success'
    },
    {
      id: '2',
      timestamp: '2024-10-27 13:15:10',
      utilisateur: 'Admin Sara Alaoui',
      action: 'Utilisateur modifié',
      details: 'Modification du profil de Fatima El Amrani',
      type: 'info'
    },
    {
      id: '3',
      timestamp: '2024-10-27 12:45:00',
      utilisateur: 'Système',
      action: 'Sauvegarde automatique',
      details: 'Sauvegarde de la base de données effectuée',
      type: 'success'
    },
    {
      id: '4',
      timestamp: '2024-10-27 11:20:33',
      utilisateur: 'Dr. Karim Tazi',
      action: 'Tentative de connexion échouée',
      details: 'Mot de passe incorrect',
      type: 'warning'
    },
    {
      id: '5',
      timestamp: '2024-10-27 10:05:15',
      utilisateur: 'Patient Mohammed Idrissi',
      action: 'Rendez-vous annulé',
      details: 'Annulation du RDV du 28/10/2024',
      type: 'info'
    }
  ]);

  const statistiques = {
    consultations: {
      total: 1247,
      evolution: '+12%',
      periode: selectedPeriod
    },
    patients: {
      nouveaux: 89,
      evolution: '+8%',
      periode: selectedPeriod
    },
    revenus: {
      total: '245,000 MAD',
      evolution: '+15%',
      periode: selectedPeriod
    },
    satisfaction: {
      score: 4.7,
      evolution: '+0.3',
      periode: selectedPeriod
    }
  };

  const rapportsDisponibles = [
    {
      id: '1',
      titre: 'Rapport mensuel d\'activité',
      description: 'Vue d\'ensemble des activités du mois',
      date: '2024-10-01',
      type: 'PDF',
      taille: '2.4 MB'
    },
    {
      id: '2',
      titre: 'Statistiques de consultation',
      description: 'Analyse détaillée des consultations',
      date: '2024-10-15',
      type: 'Excel',
      taille: '1.8 MB'
    },
    {
      id: '3',
      titre: 'Rapport financier',
      description: 'Bilan financier trimestriel',
      date: '2024-09-30',
      type: 'PDF',
      taille: '3.2 MB'
    },
    {
      id: '4',
      titre: 'Audit de sécurité',
      description: 'Rapport d\'audit système',
      date: '2024-10-20',
      type: 'PDF',
      taille: '1.5 MB'
    }
  ];

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'info': return 'bg-blue-500';
      case 'warning': return 'bg-orange-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getLogTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✓';
      case 'info': return 'ℹ';
      case 'warning': return '⚠';
      case 'error': return '✗';
      default: return '•';
    }
  };

  return (
    <>
      <Head>
        <title>Transparence & Rapports - Abhar Santé Maroc</title>
      </Head>

      <div className="min-h-screen relative">
        {/* Video Background */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-100"
          >
            <source src="/dashboardadmin_background.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="shadow backdrop-blur-sm border-b-4 border-purple-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex justify-between items-center">
                <div>
                  <button
                    onClick={() => router.push('/admin/dashboard')}
                    className="text-white hover:text-purple-200 mb-2 flex items-center gap-2 font-bold"
                  >
                    ← Retour au dashboard
                  </button>
                  <h1 className="text-3xl font-extrabold text-white">Transparence & Rapports</h1>
                  <p className="mt-1 text-sm font-bold text-white">
                    Statistiques détaillées, logs d'audit et rapports d'activité
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Period Selector */}
            <div className="flex gap-2 mb-8">
              {(['jour', 'semaine', 'mois', 'annee'] as PeriodType[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-6 py-3 rounded-lg font-bold transition ${
                    selectedPeriod === period
                      ? 'bg-purple-600 text-white'
                      : 'backdrop-blur-sm border-2 border-gray-200 text-white hover:border-purple-400'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-4 mb-8">
              <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-white">Consultations</p>
                  <span className="text-xs font-bold text-green-400">{statistiques.consultations.evolution}</span>
                </div>
                <p className="text-3xl font-extrabold text-white">{statistiques.consultations.total}</p>
              </div>

              <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-white">Nouveaux Patients</p>
                  <span className="text-xs font-bold text-green-400">{statistiques.patients.evolution}</span>
                </div>
                <p className="text-3xl font-extrabold text-white">{statistiques.patients.nouveaux}</p>
              </div>

              <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-white">Revenus</p>
                  <span className="text-xs font-bold text-green-400">{statistiques.revenus.evolution}</span>
                </div>
                <p className="text-2xl font-extrabold text-white">{statistiques.revenus.total}</p>
              </div>

              <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-white">Satisfaction</p>
                  <span className="text-xs font-bold text-green-400">{statistiques.satisfaction.evolution}</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-extrabold text-white">{statistiques.satisfaction.score}</p>
                  <span className="text-yellow-400 text-2xl">★</span>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Logs d'audit */}
              <div className="rounded-lg shadow backdrop-blur-sm border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-extrabold text-white">Logs d'Audit</h2>
                  <button className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition text-sm">
                    Exporter
                  </button>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {logsAudit.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-lg backdrop-blur-sm border-2 border-gray-200 hover:border-purple-400 transition"
                    >
                      <div className="flex items-start gap-3">
                        <span className={`px-2 py-1 rounded-full text-white font-bold text-xs ${getLogTypeColor(log.type)}`}>
                          {getLogTypeIcon(log.type)}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <p className="font-extrabold text-white">{log.action}</p>
                            <span className="text-xs font-bold text-white">{log.timestamp}</span>
                          </div>
                          <p className="text-sm font-bold text-white mb-1">{log.utilisateur}</p>
                          <p className="text-xs font-bold text-white opacity-80">{log.details}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rapports disponibles */}
              <div className="rounded-lg shadow backdrop-blur-sm border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-extrabold text-white">Rapports Disponibles</h2>
                  <button className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition text-sm">
                    + Nouveau
                  </button>
                </div>

                <div className="space-y-4">
                  {rapportsDisponibles.map((rapport) => (
                    <div
                      key={rapport.id}
                      className="p-4 rounded-lg backdrop-blur-sm border-2 border-gray-200 hover:border-purple-400 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-extrabold text-white mb-1">{rapport.titre}</h3>
                          <p className="text-sm font-bold text-white opacity-80">{rapport.description}</p>
                        </div>
                        <span className="px-3 py-1 bg-purple-600 text-white font-bold rounded-lg text-xs">
                          {rapport.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-4 text-xs font-bold text-white">
                          <span>📅 {rapport.date}</span>
                          <span>📦 {rapport.taille}</span>
                        </div>
                        <button className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition text-sm">
                          Télécharger
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="mt-8 rounded-lg shadow backdrop-blur-sm border-2 border-gray-200 p-6">
              <h2 className="text-xl font-extrabold text-white mb-6">Graphiques d'Activité</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                {/* Placeholder for charts */}
                <div className="h-64 rounded-lg backdrop-blur-sm border-2 border-gray-200 flex items-center justify-center">
                  <p className="text-white font-bold">📊 Graphique des consultations</p>
                </div>
                <div className="h-64 rounded-lg backdrop-blur-sm border-2 border-gray-200 flex items-center justify-center">
                  <p className="text-white font-bold">📈 Évolution des revenus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

