import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const tenantId = localStorage.getItem('tenant_id') || 'chu-casablanca';
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}`, 'X-Tenant-Id': tenantId }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Erreur:', error);
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
      {/* Video Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-30">
          <source src="/dashboardadmin_background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/50 to-gray-900/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="shadow-lg backdrop-blur-sm bg-white/10 border-b-4 border-cyan-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-extrabold text-white">🏥 Administration Établissement</h1>
                <p className="mt-1 text-sm font-bold text-cyan-100">Centre Hospitalier Universitaire de Casablanca</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">3</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{user?.email || 'Administrateur'}</p>
                  <p className="text-xs font-bold text-cyan-200">Administrateur</p>
                </div>
                <button
                  onClick={() => { localStorage.clear(); router.push('/auth/login'); }}
                  className="px-4 py-2 text-sm font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* KPIs */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <div className="rounded-lg shadow-xl p-6 backdrop-blur-sm bg-white/10 border-2 border-cyan-300/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-cyan-200">Total Utilisateurs</p>
                  <p className="text-4xl font-extrabold text-white mt-2">1,456</p>
                  <p className="text-xs text-cyan-100 mt-1">1,234 patients · 87 médecins</p>
                </div>
                <div className="p-3 bg-cyan-600 rounded-lg">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow-xl p-6 backdrop-blur-sm bg-white/10 border-2 border-cyan-300/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-cyan-200">Consultations</p>
                  <p className="text-4xl font-extrabold text-white mt-2">56</p>
                  <p className="text-xs text-cyan-300 mt-1 font-bold">↑ +12% vs hier</p>
                </div>
                <div className="p-3 bg-cyan-600 rounded-lg">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow-xl p-6 backdrop-blur-sm bg-white/10 border-2 border-cyan-300/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-cyan-200">Prédictions IA</p>
                  <p className="text-4xl font-extrabold text-white mt-2">892</p>
                  <p className="text-xs text-cyan-300 mt-1 font-bold">Ce mois-ci</p>
                </div>
                <div className="p-3 bg-cyan-600 rounded-lg">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow-xl p-6 backdrop-blur-sm bg-white/10 border-2 border-cyan-300/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-cyan-200">Stockage</p>
                  <p className="text-4xl font-extrabold text-white mt-2">2.4 TB</p>
                  <div className="w-full bg-cyan-900/30 rounded-full h-2 mt-2">
                    <div className="bg-cyan-400 h-2 rounded-full" style={{ width: '48%' }}></div>
                  </div>
                  <p className="text-xs text-cyan-100 mt-1">sur 5 TB (48%)</p>
                </div>
                <div className="p-3 bg-cyan-600 rounded-lg">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Modules d'administration */}
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-white mb-6">🏥 Modules de Gestion Hospitalière</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Link href="/admin/gestion-centralisee" className="group rounded-lg shadow-xl p-6 backdrop-blur-sm bg-gradient-to-br from-cyan-500 to-cyan-700 hover:from-cyan-600 hover:to-cyan-800 transition-all transform hover:scale-105">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 backdrop-blur rounded-lg">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-extrabold text-white mb-2">Gestion Centralisée</h3>
                    <p className="text-sm text-cyan-100 mb-3">Vue d'ensemble: services, lits, équipements, personnel</p>
                    <div className="flex items-center text-white font-bold text-sm">
                      Accéder →
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/admin/disponibilite-medecins" className="group rounded-lg shadow-xl p-6 backdrop-blur-sm bg-gradient-to-br from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 transition-all transform hover:scale-105">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 backdrop-blur rounded-lg">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-extrabold text-white mb-2">Disponibilité Médecins</h3>
                    <p className="text-sm text-cyan-100 mb-3">Plannings, gardes, congés et disponibilités</p>
                    <div className="flex items-center text-white font-bold text-sm">
                      Accéder →
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/admin/transparence-rapports" className="group rounded-lg shadow-xl p-6 backdrop-blur-sm bg-gradient-to-br from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 transition-all transform hover:scale-105">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 backdrop-blur rounded-lg">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-extrabold text-white mb-2">Transparence & Rapports</h3>
                    <p className="text-sm text-cyan-100 mb-3">Performance, qualité, analytics et exports</p>
                    <div className="flex items-center text-white font-bold text-sm">
                      Accéder →
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg shadow-xl p-6 backdrop-blur-sm bg-white/10 border-2 border-cyan-300/30">
              <h3 className="text-lg font-extrabold text-white mb-4">Gestion Utilisateurs</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 bg-cyan-600/50 hover:bg-cyan-600/70 rounded-lg transition text-sm font-medium text-white">
                  Patients (1,234)
                </button>
                <button className="w-full text-left px-4 py-2 bg-cyan-600/50 hover:bg-cyan-600/70 rounded-lg transition text-sm font-medium text-white">
                  Médecins (87)
                </button>
                <button className="w-full text-left px-4 py-2 bg-cyan-600/50 hover:bg-cyan-600/70 rounded-lg transition text-sm font-medium text-white">
                  Chercheurs (135)
                </button>
              </div>
            </div>

            <div className="rounded-lg shadow-xl p-6 backdrop-blur-sm bg-white/10 border-2 border-cyan-300/30">
              <h3 className="text-lg font-extrabold text-white mb-4">Sécurité & Système</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 bg-red-600/50 hover:bg-red-600/70 rounded-lg transition text-sm font-medium text-white">
                  Alertes (3)
                </button>
                <button className="w-full text-left px-4 py-2 bg-cyan-600/50 hover:bg-cyan-600/70 rounded-lg transition text-sm font-medium text-white">
                  Logs d'audit
                </button>
                <button className="w-full text-left px-4 py-2 bg-cyan-600/50 hover:bg-cyan-600/70 rounded-lg transition text-sm font-medium text-white">
                  État services
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}

