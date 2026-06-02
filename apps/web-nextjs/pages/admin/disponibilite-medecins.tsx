import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Medecin {
  id: string;
  nom: string;
  prenom: string;
  specialite: string;
  email: string;
  disponible: boolean;
  prochainRdv: string | null;
  nombrePatientsAujourdhui: number;
}

export default function DisponibiliteMedecins() {
  const router = useRouter();
  const [medecins, setMedecins] = useState<Medecin[]>([
    {
      id: '1',
      nom: 'Bennani',
      prenom: 'Ahmed',
      specialite: 'Cardiologie',
      email: 'ahmed.bennani@abhar.ma',
      disponible: true,
      prochainRdv: '14:30',
      nombrePatientsAujourdhui: 8
    },
    {
      id: '2',
      nom: 'El Amrani',
      prenom: 'Fatima',
      specialite: 'Pédiatrie',
      email: 'fatima.elamrani@abhar.ma',
      disponible: false,
      prochainRdv: '10:00',
      nombrePatientsAujourdhui: 12
    },
    {
      id: '3',
      nom: 'Tazi',
      prenom: 'Karim',
      specialite: 'Dermatologie',
      email: 'karim.tazi@abhar.ma',
      disponible: true,
      prochainRdv: null,
      nombrePatientsAujourdhui: 5
    },
    {
      id: '4',
      nom: 'Alaoui',
      prenom: 'Sara',
      specialite: 'Gynécologie',
      email: 'sara.alaoui@abhar.ma',
      disponible: true,
      prochainRdv: '15:45',
      nombrePatientsAujourdhui: 10
    },
    {
      id: '5',
      nom: 'Idrissi',
      prenom: 'Mohammed',
      specialite: 'Orthopédie',
      email: 'mohammed.idrissi@abhar.ma',
      disponible: false,
      prochainRdv: '09:30',
      nombrePatientsAujourdhui: 15
    }
  ]);

  const [filter, setFilter] = useState<'tous' | 'disponibles' | 'occupes'>('tous');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMedecins = medecins.filter(medecin => {
    const matchesFilter = 
      filter === 'tous' ? true :
      filter === 'disponibles' ? medecin.disponible :
      !medecin.disponible;
    
    const matchesSearch = 
      medecin.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medecin.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medecin.specialite.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const statsDisponibilite = {
    total: medecins.length,
    disponibles: medecins.filter(m => m.disponible).length,
    occupes: medecins.filter(m => !m.disponible).length,
    totalPatientsAujourdhui: medecins.reduce((sum, m) => sum + m.nombrePatientsAujourdhui, 0)
  };

  return (
    <>
      <Head>
        <title>Disponibilité Médecins - Abhar Santé Maroc</title>
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
                  <h1 className="text-3xl font-extrabold text-white">Disponibilité des Médecins</h1>
                  <p className="mt-1 text-sm font-bold text-white">
                    Planning et disponibilités en temps réel
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4 mb-8">
              <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-purple-200">
                <p className="text-sm font-bold text-white">Total Médecins</p>
                <p className="text-3xl font-extrabold text-white mt-2">{statsDisponibilite.total}</p>
              </div>
              <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-green-200">
                <p className="text-sm font-bold text-white">Disponibles</p>
                <p className="text-3xl font-extrabold text-white mt-2">{statsDisponibilite.disponibles}</p>
              </div>
              <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-red-200">
                <p className="text-sm font-bold text-white">Occupés</p>
                <p className="text-3xl font-extrabold text-white mt-2">{statsDisponibilite.occupes}</p>
              </div>
              <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-blue-200">
                <p className="text-sm font-bold text-white">Patients Aujourd'hui</p>
                <p className="text-3xl font-extrabold text-white mt-2">{statsDisponibilite.totalPatientsAujourdhui}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-gray-200 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Rechercher un médecin..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-purple-200 bg-white/90 backdrop-blur-sm font-bold text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('tous')}
                    className={`px-4 py-2 rounded-lg font-bold transition ${
                      filter === 'tous'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/90 text-gray-900 hover:bg-purple-100'
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setFilter('disponibles')}
                    className={`px-4 py-2 rounded-lg font-bold transition ${
                      filter === 'disponibles'
                        ? 'bg-green-600 text-white'
                        : 'bg-white/90 text-gray-900 hover:bg-green-100'
                    }`}
                  >
                    Disponibles
                  </button>
                  <button
                    onClick={() => setFilter('occupes')}
                    className={`px-4 py-2 rounded-lg font-bold transition ${
                      filter === 'occupes'
                        ? 'bg-red-600 text-white'
                        : 'bg-white/90 text-gray-900 hover:bg-red-100'
                    }`}
                  >
                    Occupés
                  </button>
                </div>
              </div>
            </div>

            {/* Medecins List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMedecins.map((medecin) => (
                <div
                  key={medecin.id}
                  className="rounded-lg shadow p-6 backdrop-blur-sm border-2 border-gray-200 hover:border-purple-400 transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-extrabold text-white">
                        Dr. {medecin.prenom} {medecin.nom}
                      </h3>
                      <p className="text-sm font-bold text-white">{medecin.specialite}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        medecin.disponible
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {medecin.disponible ? '✓ Disponible' : '✗ Occupé'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm font-bold text-white">{medecin.email}</p>
                    </div>

                    {medecin.prochainRdv && (
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-bold text-white">Prochain RDV: {medecin.prochainRdv}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-sm font-bold text-white">
                        {medecin.nombrePatientsAujourdhui} patients aujourd'hui
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredMedecins.length === 0 && (
              <div className="text-center py-12 rounded-lg backdrop-blur-sm border-2 border-gray-200">
                <p className="text-white font-bold text-lg">Aucun médecin trouvé</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

