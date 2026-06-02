import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminRapportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    totalConsultations: 3456,
    totalDatasets: 45,
    totalChallenges: 12,
    avgResponseTime: '2.3h',
    satisfactionRate: 94,
    systemUptime: 99.8,
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-900 via-cyan-900 to-gray-900">
          <div className="absolute inset-0 bg-cyan-900/20"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-900 via-cyan-900 to-gray-900">
        <div className="absolute inset-0 bg-cyan-900/20"></div>
      </div>
      <div className="relative z-10">
        <div className="bg-white/10 backdrop-blur-sm shadow-lg border-b border-cyan-300/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Link href="/admin/dashboard" className="p-2 hover:bg-white/20 rounded-lg transition">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-white">Rapports & Analytics</h1>
                  <p className="mt-1 text-sm text-cyan-100">Vue d'ensemble de la plateforme</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition">
                📊 Exporter PDF
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-200">Utilisateurs totaux</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.totalUsers}</p>
                  <p className="text-xs text-green-400 mt-1">↑ +12% ce mois</p>
                </div>
                <div className="h-12 w-12 bg-cyan-600 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-200">Utilisateurs actifs</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.activeUsers}</p>
                  <p className="text-xs text-green-400 mt-1">↑ +8% ce mois</p>
                </div>
                <div className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-200">Consultations</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.totalConsultations}</p>
                  <p className="text-xs text-green-400 mt-1">↑ +23% ce mois</p>
                </div>
                <div className="h-12 w-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-200">Taux satisfaction</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.satisfactionRate}%</p>
                  <p className="text-xs text-green-400 mt-1">↑ +2% ce mois</p>
                </div>
                <div className="h-12 w-12 bg-yellow-600 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Activité par Rôle</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-cyan-200">Patients</span>
                    <span className="text-white">65%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-cyan-200">Médecins</span>
                    <span className="text-white">25%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-cyan-200">Chercheurs</span>
                    <span className="text-white">10%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Performance Système</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-200">Temps de réponse moyen</span>
                  <span className="text-white font-semibold">{stats.avgResponseTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-200">Uptime</span>
                  <span className="text-green-400 font-semibold">{stats.systemUptime}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-200">Datasets actifs</span>
                  <span className="text-white font-semibold">{stats.totalDatasets}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-200">Challenges en cours</span>
                  <span className="text-white font-semibold">{stats.totalChallenges}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Actions Récentes</h2>
            <div className="space-y-3">
              {[
                { action: 'Nouvel utilisateur inscrit', user: 'Ahmed Bennani', time: 'Il y a 5 min', type: 'success' },
                { action: 'Consultation terminée', user: 'Dr. Amina Benali', time: 'Il y a 12 min', type: 'info' },
                { action: 'Dataset publié', user: 'Dr. Youssef Alami', time: 'Il y a 1h', type: 'success' },
                { action: 'Erreur système détectée', user: 'Système', time: 'Il y a 2h', type: 'warning' },
              ].map((log, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${log.type === 'success' ? 'bg-green-400' : log.type === 'warning' ? 'bg-yellow-400' : 'bg-cyan-400'}`}></div>
                    <div>
                      <p className="text-white text-sm font-medium">{log.action}</p>
                      <p className="text-cyan-200 text-xs">{log.user}</p>
                    </div>
                  </div>
                  <span className="text-cyan-200 text-xs">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

