import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

type TabType = 'utilisateurs' | 'ressources' | 'configurations';

interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  role: 'patient' | 'medecin' | 'admin';
  statut: 'actif' | 'inactif';
  dateInscription: string;
}

interface Ressource {
  id: string;
  nom: string;
  type: 'salle' | 'equipement' | 'materiel';
  disponibilite: 'disponible' | 'occupe' | 'maintenance';
  localisation: string;
}

export default function GestionCentralisee() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('utilisateurs');

  const [utilisateurs] = useState<Utilisateur[]>([
    { id: '1', nom: 'Ahmed Bennani', email: 'ahmed.b@example.com', role: 'medecin', statut: 'actif', dateInscription: '2024-01-15' },
    { id: '2', nom: 'Fatima El Amrani', email: 'fatima.e@example.com', role: 'patient', statut: 'actif', dateInscription: '2024-02-20' },
    { id: '3', nom: 'Karim Tazi', email: 'karim.t@example.com', role: 'medecin', statut: 'actif', dateInscription: '2024-01-10' },
    { id: '4', nom: 'Sara Alaoui', email: 'sara.a@example.com', role: 'admin', statut: 'actif', dateInscription: '2023-12-01' },
    { id: '5', nom: 'Mohammed Idrissi', email: 'mohammed.i@example.com', role: 'patient', statut: 'inactif', dateInscription: '2024-03-05' }
  ]);

  const [ressources] = useState<Ressource[]>([
    { id: '1', nom: 'Salle de consultation 1', type: 'salle', disponibilite: 'disponible', localisation: 'Étage 1' },
    { id: '2', nom: 'Échographe', type: 'equipement', disponibilite: 'occupe', localisation: 'Étage 2' },
    { id: '3', nom: 'Scanner IRM', type: 'equipement', disponibilite: 'maintenance', localisation: 'Étage 3' },
    { id: '4', nom: 'Salle d\'opération A', type: 'salle', disponibilite: 'disponible', localisation: 'Étage 2' },
    { id: '5', nom: 'Kit de premiers soins', type: 'materiel', disponibilite: 'disponible', localisation: 'Étage 1' }
  ]);

  const stats = {
    utilisateurs: {
      total: utilisateurs.length,
      actifs: utilisateurs.filter(u => u.statut === 'actif').length,
      medecins: utilisateurs.filter(u => u.role === 'medecin').length,
      patients: utilisateurs.filter(u => u.role === 'patient').length
    },
    ressources: {
      total: ressources.length,
      disponibles: ressources.filter(r => r.disponibilite === 'disponible').length,
      occupees: ressources.filter(r => r.disponibilite === 'occupe').length,
      maintenance: ressources.filter(r => r.disponibilite === 'maintenance').length
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500';
      case 'medecin': return 'bg-blue-500';
      case 'patient': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getDisponibiliteBadgeColor = (disponibilite: string) => {
    switch (disponibilite) {
      case 'disponible': return 'bg-green-500';
      case 'occupe': return 'bg-red-500';
      case 'maintenance': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAddUser = () => {
    alert('Fonctionnalité "Ajouter un utilisateur" - Ouverture du formulaire d\'ajout');
    // TODO: Ouvrir un modal ou rediriger vers une page de création
  };

  const handleModifyUser = (userId: string) => {
    alert(`Modification de l'utilisateur ${userId}`);
    // TODO: Ouvrir un modal de modification avec les données de l'utilisateur
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      alert(`Utilisateur ${userId} supprimé`);
      // TODO: Appel API pour supprimer l'utilisateur
    }
  };

  const handleAddResource = () => {
    alert('Fonctionnalité "Ajouter une ressource" - Ouverture du formulaire d\'ajout');
    // TODO: Ouvrir un modal ou rediriger vers une page de création
  };

  const handleModifyResource = (resourceId: string) => {
    alert(`Modification de la ressource ${resourceId}`);
    // TODO: Ouvrir un modal de modification
  };

  const handleDeleteResource = (resourceId: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette ressource ?')) {
      alert(`Ressource ${resourceId} supprimée`);
      // TODO: Appel API pour supprimer la ressource
    }
  };

  return (
    <>
      <Head>
        <title>Gestion Centralisée - Abhar Santé Maroc</title>
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
                  <h1 className="text-3xl font-extrabold text-white">Gestion Centralisée</h1>
                  <p className="mt-1 text-sm font-bold text-white">
                    Gérez utilisateurs, ressources et configurations
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Tabs */}
            <div className="flex gap-2 mb-8">
              <button
                onClick={() => setActiveTab('utilisateurs')}
                className={`px-6 py-3 rounded-lg font-bold transition ${
                  activeTab === 'utilisateurs'
                    ? 'bg-purple-600 text-white'
                    : 'backdrop-blur-sm border-2 border-gray-200 text-white hover:border-purple-400'
                }`}
              >
                Utilisateurs
              </button>
              <button
                onClick={() => setActiveTab('ressources')}
                className={`px-6 py-3 rounded-lg font-bold transition ${
                  activeTab === 'ressources'
                    ? 'bg-purple-600 text-white'
                    : 'backdrop-blur-sm border-2 border-gray-200 text-white hover:border-purple-400'
                }`}
              >
                Ressources
              </button>
              <button
                onClick={() => setActiveTab('configurations')}
                className={`px-6 py-3 rounded-lg font-bold transition ${
                  activeTab === 'configurations'
                    ? 'bg-purple-600 text-white'
                    : 'backdrop-blur-sm border-2 border-gray-200 text-white hover:border-purple-400'
                }`}
              >
                Configurations
              </button>
            </div>

            {/* Utilisateurs Tab */}
            {activeTab === 'utilisateurs' && (
              <>
                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4 mb-8">
                  <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-purple-200">
                    <p className="text-sm font-bold text-white">Total Utilisateurs</p>
                    <p className="text-3xl font-extrabold text-white mt-2">{stats.utilisateurs.total}</p>
                  </div>
                  <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-green-200">
                    <p className="text-sm font-bold text-white">Actifs</p>
                    <p className="text-3xl font-extrabold text-white mt-2">{stats.utilisateurs.actifs}</p>
                  </div>
                  <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-blue-200">
                    <p className="text-sm font-bold text-white">Médecins</p>
                    <p className="text-3xl font-extrabold text-white mt-2">{stats.utilisateurs.medecins}</p>
                  </div>
                  <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-green-200">
                    <p className="text-sm font-bold text-white">Patients</p>
                    <p className="text-3xl font-extrabold text-white mt-2">{stats.utilisateurs.patients}</p>
                  </div>
                </div>

                {/* Add Button */}
                <div className="mb-6">
                  <button 
                    onClick={handleAddUser}
                    className="px-6 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition"
                  >
                    + Ajouter un utilisateur
                  </button>
                </div>

                {/* Users List */}
                <div className="rounded-lg shadow backdrop-blur-sm border-2 border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-purple-600/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-extrabold text-white uppercase tracking-wider">Nom</th>
                          <th className="px-6 py-3 text-left text-xs font-extrabold text-white uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-extrabold text-white uppercase tracking-wider">Rôle</th>
                          <th className="px-6 py-3 text-left text-xs font-extrabold text-white uppercase tracking-wider">Statut</th>
                          <th className="px-6 py-3 text-left text-xs font-extrabold text-white uppercase tracking-wider">Inscription</th>
                          <th className="px-6 py-3 text-left text-xs font-extrabold text-white uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {utilisateurs.map((user) => (
                          <tr key={user.id} className="hover:bg-white/10 transition">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{user.nom}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${getRoleBadgeColor(user.role)}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${user.statut === 'actif' ? 'bg-green-500' : 'bg-red-500'}`}>
                                {user.statut}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{user.dateInscription}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                              <button 
                                onClick={() => handleModifyUser(user.id)}
                                className="text-cyan-300 hover:text-cyan-100 mr-3"
                              >
                                Modifier
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-300 hover:text-red-100"
                              >
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Ressources Tab */}
            {activeTab === 'ressources' && (
              <>
                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4 mb-8">
                  <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-purple-200">
                    <p className="text-sm font-bold text-white">Total Ressources</p>
                    <p className="text-3xl font-extrabold text-white mt-2">{stats.ressources.total}</p>
                  </div>
                  <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-green-200">
                    <p className="text-sm font-bold text-white">Disponibles</p>
                    <p className="text-3xl font-extrabold text-white mt-2">{stats.ressources.disponibles}</p>
                  </div>
                  <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-red-200">
                    <p className="text-sm font-bold text-white">Occupées</p>
                    <p className="text-3xl font-extrabold text-white mt-2">{stats.ressources.occupees}</p>
                  </div>
                  <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-orange-200">
                    <p className="text-sm font-bold text-white">Maintenance</p>
                    <p className="text-3xl font-extrabold text-white mt-2">{stats.ressources.maintenance}</p>
                  </div>
                </div>

                {/* Add Button */}
                <div className="mb-6">
                  <button 
                    onClick={handleAddResource}
                    className="px-6 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition"
                  >
                    + Ajouter une ressource
                  </button>
                </div>

                {/* Resources Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {ressources.map((ressource) => (
                    <div
                      key={ressource.id}
                      className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-gray-200 hover:border-purple-400 transition"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-extrabold text-white">{ressource.nom}</h3>
                          <p className="text-sm font-bold text-white">{ressource.type}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getDisponibiliteBadgeColor(ressource.disponibilite)}`}>
                          {ressource.disponibilite}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-sm font-bold text-white">{ressource.localisation}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleModifyResource(ressource.id)}
                          className="flex-1 px-4 py-2 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition text-sm"
                        >
                          Modifier
                        </button>
                        <button 
                          onClick={() => handleDeleteResource(ressource.id)}
                          className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Configurations Tab */}
            {activeTab === 'configurations' && (
              <div className="rounded-lg shadow p-8 backdrop-blur-sm border-2 border-gray-200">
                <h2 className="text-2xl font-extrabold text-white mb-6">Paramètres de l'établissement</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Nom de l'établissement</label>
                    <input
                      type="text"
                      defaultValue="CHU Casablanca"
                      className="w-full px-4 py-2 rounded-lg border-2 border-purple-200 bg-white/90 backdrop-blur-sm font-bold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Adresse</label>
                    <input
                      type="text"
                      defaultValue="Rue des Hôpitaux, Casablanca"
                      className="w-full px-4 py-2 rounded-lg border-2 border-purple-200 bg-white/90 backdrop-blur-sm font-bold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Téléphone</label>
                    <input
                      type="tel"
                      defaultValue="+212 5 22 XX XX XX"
                      className="w-full px-4 py-2 rounded-lg border-2 border-purple-200 bg-white/90 backdrop-blur-sm font-bold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="contact@chu-casablanca.ma"
                      className="w-full px-4 py-2 rounded-lg border-2 border-purple-200 bg-white/90 backdrop-blur-sm font-bold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Horaires d'ouverture</label>
                    <textarea
                      rows={3}
                      defaultValue="Lundi - Vendredi: 8h00 - 18h00&#10;Samedi: 9h00 - 13h00&#10;Dimanche: Fermé"
                      className="w-full px-4 py-2 rounded-lg border-2 border-purple-200 bg-white/90 backdrop-blur-sm font-bold text-gray-900"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition">
                      Enregistrer les modifications
                    </button>
                    <button className="px-6 py-3 backdrop-blur-sm border-2 border-gray-200 text-white font-bold rounded-lg hover:border-purple-400 transition">
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

