import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Consultation {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: 'Consultation' | 'Suivi' | 'Urgence';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export default function MedecinConsultationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const tenantId = localStorage.getItem('tenant_id') || 'chu-casablanca';
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

      const response = await fetch(`${API_BASE_URL}/medecin/consultations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant-Id': tenantId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConsultations(data);
      } else {
        // Mock data
        setConsultations([
          {
            id: 'C001',
            patientName: 'Ahmed Bennani',
            date: '2025-01-25',
            time: '09:00',
            type: 'Consultation',
            status: 'scheduled',
            notes: 'Contrôle de routine',
          },
          {
            id: 'C002',
            patientName: 'Fatima El Amrani',
            date: '2025-01-25',
            time: '10:30',
            type: 'Suivi',
            status: 'scheduled',
          },
          {
            id: 'C003',
            patientName: 'Karim Tazi',
            date: '2025-01-24',
            time: '14:00',
            type: 'Consultation',
            status: 'completed',
            notes: 'Résultats analyses OK',
          },
        ]);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-600 text-white">Planifiée</span>;
      case 'completed':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-600 text-white">Terminée</span>;
      case 'cancelled':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-600 text-white">Annulée</span>;
      default:
        return null;
    }
  };

  const filteredConsultations = consultations.filter((c) =>
    filterStatus === 'all' ? true : c.status === filterStatus
  );

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/back_chercheur.jpg)' }}
        >
          <div className="absolute inset-0 bg-cyan-900/40"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-4 text-white font-semibold">Chargement...</p>
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
        style={{ backgroundImage: 'url(/back_chercheur.jpg)' }}
      >
        <div className="absolute inset-0 bg-cyan-900/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm shadow-lg border-b border-cyan-300/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Link
                  href="/medecin/dashboard"
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-white">Mes Consultations</h1>
                  <p className="mt-1 text-sm text-cyan-100">
                    Gérez votre planning et vos rendez-vous
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filter */}
          <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-4 mb-6">
            <label className="block text-sm font-medium text-cyan-200 mb-2">
              Filtrer par statut
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full md:w-64 px-4 py-2 bg-white/10 border border-cyan-300/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">Toutes</option>
              <option value="scheduled">Planifiées</option>
              <option value="completed">Terminées</option>
              <option value="cancelled">Annulées</option>
            </select>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-4">
              <p className="text-sm text-cyan-200">Aujourd'hui</p>
              <p className="text-2xl font-bold text-white mt-1">
                {consultations.filter((c) => c.date === new Date().toISOString().split('T')[0] && c.status === 'scheduled').length}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-4">
              <p className="text-sm text-cyan-200">Cette semaine</p>
              <p className="text-2xl font-bold text-cyan-400 mt-1">
                {consultations.filter((c) => c.status === 'scheduled').length}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-4">
              <p className="text-sm text-cyan-200">Terminées</p>
              <p className="text-2xl font-bold text-green-400 mt-1">
                {consultations.filter((c) => c.status === 'completed').length}
              </p>
            </div>
          </div>

          {/* Consultations List */}
          <div className="grid gap-4">
            {filteredConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-6 hover:border-cyan-400/50 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{consultation.patientName}</h3>
                      {getStatusBadge(consultation.status)}
                    </div>
                    <div className="grid gap-2 md:grid-cols-3 text-sm">
                      <div className="flex items-center gap-2 text-cyan-100">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(consultation.date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center gap-2 text-cyan-100">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {consultation.time}
                      </div>
                      <div className="flex items-center gap-2 text-cyan-100">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {consultation.type}
                      </div>
                    </div>
                    {consultation.notes && (
                      <p className="mt-3 text-sm text-cyan-200">
                        📝 {consultation.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    {consultation.status === 'scheduled' && (
                      <>
                        <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition">
                          ✓ Terminer
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition">
                          ✗ Annuler
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredConsultations.length === 0 && (
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-white">Aucune consultation</h3>
              <p className="mt-1 text-sm text-cyan-100">
                Aucune consultation ne correspond à vos critères
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

