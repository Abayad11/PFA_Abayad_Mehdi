import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  lastConsultation: string;
  status: 'active' | 'pending' | 'archived';
  unreadMessages: number;
  hasAIReport: boolean;
}

export default function MedecinPatientsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const tenantId = localStorage.getItem('tenant_id') || 'chu-casablanca';
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

      const response = await fetch(`${API_BASE_URL}/medecin/patients`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant-Id': tenantId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      } else {
        // Données simulées
        setPatients([
          {
            id: 'P001',
            firstName: 'Ahmed',
            lastName: 'Bennani',
            lastConsultation: '2025-01-24',
            status: 'active',
            unreadMessages: 2,
            hasAIReport: true,
          },
          {
            id: 'P002',
            firstName: 'Fatima',
            lastName: 'El Amrani',
            lastConsultation: '2025-01-23',
            status: 'active',
            unreadMessages: 0,
            hasAIReport: true,
          },
          {
            id: 'P003',
            firstName: 'Karim',
            lastName: 'Tazi',
            lastConsultation: '2025-01-22',
            status: 'active',
            unreadMessages: 1,
            hasAIReport: false,
          },
          {
            id: 'P004',
            firstName: 'Samira',
            lastName: 'Alaoui',
            lastConsultation: '2025-01-20',
            status: 'pending',
            unreadMessages: 0,
            hasAIReport: true,
          },
          {
            id: 'P005',
            firstName: 'Youssef',
            lastName: 'Idrissi',
            lastConsultation: '2025-01-18',
            status: 'active',
            unreadMessages: 0,
            hasAIReport: false,
          },
        ]);
      }
    } catch (error) {
      console.error('Erreur chargement patients:', error);
      // Données simulées en cas d'erreur
      setPatients([
        {
          id: 'P001',
          firstName: 'Ahmed',
          lastName: 'Bennani',
          lastConsultation: '2025-01-24',
          status: 'active',
          unreadMessages: 2,
          hasAIReport: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' || patient.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Actif</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">En attente</span>;
      case 'archived':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Archivé</span>;
      default:
        return null;
    }
  };

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
                  <h1 className="text-3xl font-bold text-white">Mes Patients</h1>
                  <p className="mt-1 text-sm text-cyan-100">
                    Gérez et communiquez avec vos patients
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-4 mb-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-cyan-200 mb-2">
                Rechercher
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom, prénom ou ID..."
                className="w-full px-4 py-2 bg-white/10 border border-cyan-300/30 rounded-lg text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-200 mb-2">
                Statut
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-cyan-300/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">Tous</option>
                <option value="active">Actifs</option>
                <option value="pending">En attente</option>
                <option value="archived">Archivés</option>
              </select>
            </div>
          </div>
        </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-4">
              <p className="text-sm text-cyan-200">Total patients</p>
              <p className="text-2xl font-bold text-white mt-1">{patients.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-4">
              <p className="text-sm text-cyan-200">Patients actifs</p>
              <p className="text-2xl font-bold text-green-400 mt-1">
                {patients.filter((p) => p.status === 'active').length}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-4">
              <p className="text-sm text-cyan-200">Messages non lus</p>
              <p className="text-2xl font-bold text-cyan-400 mt-1">
                {patients.reduce((sum, p) => sum + p.unreadMessages, 0)}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-4">
              <p className="text-sm text-cyan-200">Rapports IA</p>
              <p className="text-2xl font-bold text-cyan-400 mt-1">
                {patients.filter((p) => p.hasAIReport).length}
              </p>
            </div>
          </div>

          {/* Patients List */}
          <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-cyan-300/30">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">
                      Dernière consultation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">
                      Messages
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-300/30">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-white/10 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-cyan-600 flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {patient.firstName[0]}{patient.lastName[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {patient.firstName} {patient.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-cyan-100">{patient.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-cyan-100">
                          {new Date(patient.lastConsultation).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(patient.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {patient.unreadMessages > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-600 text-white">
                            {patient.unreadMessages} nouveau{patient.unreadMessages > 1 ? 'x' : ''}
                          </span>
                        ) : (
                          <span className="text-sm text-cyan-200">Aucun</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          href={`/medecin/messagerie/${patient.id}`}
                          className="text-cyan-300 hover:text-cyan-100"
                        >
                          💬 Message
                        </Link>
                        {patient.hasAIReport && (
                          <Link
                            href={`/medecin/conseiller-ia?patientId=${patient.id}`}
                            className="text-cyan-300 hover:text-cyan-100"
                          >
                            🤖 Rapport IA
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

            {filteredPatients.length === 0 && (
              <div className="text-center py-12">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-white">Aucun patient trouvé</h3>
                <p className="mt-1 text-sm text-cyan-100">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

