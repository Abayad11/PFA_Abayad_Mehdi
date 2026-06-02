import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'medecin' | 'chercheur' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

export default function AdminUtilisateursPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Mock data
      setUsers([
        { id: 'U001', name: 'Ahmed Bennani', email: 'ahmed.b@email.com', role: 'patient', status: 'active', createdAt: '2025-01-15' },
        { id: 'U002', name: 'Dr. Amina Benali', email: 'a.benali@chu.ma', role: 'medecin', status: 'active', createdAt: '2025-01-10' },
        { id: 'U003', name: 'Dr. Youssef Alami', email: 'y.alami@um6p.ma', role: 'chercheur', status: 'active', createdAt: '2025-01-12' },
        { id: 'U004', name: 'Fatima El Amrani', email: 'fatima.e@email.com', role: 'patient', status: 'active', createdAt: '2025-01-18' },
        { id: 'U005', name: 'Dr. Karim Tazi', email: 'k.tazi@chu.ma', role: 'medecin', status: 'pending', createdAt: '2025-01-24' },
      ]);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      patient: 'bg-blue-600',
      medecin: 'bg-green-600',
      chercheur: 'bg-purple-600',
      admin: 'bg-red-600',
    };
    const labels = {
      patient: 'Patient',
      medecin: 'Médecin',
      chercheur: 'Chercheur',
      admin: 'Admin',
    };
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colors[role as keyof typeof colors]} text-white`}>{labels[role as keyof typeof labels]}</span>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-600 text-white">Actif</span>;
      case 'inactive':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-600 text-white">Inactif</span>;
      case 'pending':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-600 text-white">En attente</span>;
      default:
        return null;
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchRole = filterRole === 'all' || u.role === filterRole;
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRole && matchSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/dashboardadmin_background.mp4)' }}>
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
                  <h1 className="text-3xl font-bold text-white">Gestion des Utilisateurs</h1>
                  <p className="mt-1 text-sm text-cyan-100">Gérez tous les utilisateurs de la plateforme</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-4 mb-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-cyan-200 mb-2">Rechercher</label>
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Nom ou email..." className="w-full px-4 py-2 bg-white/10 border border-cyan-300/30 rounded-lg text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-200 mb-2">Rôle</label>
                <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-full px-4 py-2 bg-white/10 border border-cyan-300/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option value="all">Tous</option>
                  <option value="patient">Patients</option>
                  <option value="medecin">Médecins</option>
                  <option value="chercheur">Chercheurs</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-4">
              <p className="text-sm text-cyan-200">Total utilisateurs</p>
              <p className="text-2xl font-bold text-white mt-1">{users.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-4">
              <p className="text-sm text-cyan-200">Patients</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">{users.filter(u => u.role === 'patient').length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-4">
              <p className="text-sm text-cyan-200">Médecins</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{users.filter(u => u.role === 'medecin').length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-4">
              <p className="text-sm text-cyan-200">Chercheurs</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">{users.filter(u => u.role === 'chercheur').length}</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl overflow-hidden">
            <table className="min-w-full divide-y divide-cyan-300/30">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase">Rôle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase">Date création</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-200 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-300/30">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/10 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-100">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-100">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button className="text-cyan-300 hover:text-cyan-100">Voir</button>
                      {user.status === 'pending' && (
                        <button className="text-green-400 hover:text-green-200">Approuver</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

