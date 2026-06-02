import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';

interface PatientProfile {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  telephone: string;
  address: string;
  bloodType?: string;
  allergies?: string[];
  chronicDiseases?: string[];
}

export default function PatientProfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<PatientProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const tenantId = localStorage.getItem('tenant_id') || 'chu-casablanca';
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant-Id': tenantId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const profileData: PatientProfile = {
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          email: data.user.email || '',
          dateOfBirth: data.user.dateOfBirth || '',
          telephone: data.user.telephone || '',
          address: data.user.address || '',
          bloodType: data.user.bloodType,
          allergies: data.user.allergies || [],
          chronicDiseases: data.user.chronicDiseases || [],
        };
        setProfile(profileData);
        setEditedProfile(profileData);
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const tenantId = localStorage.getItem('tenant_id') || 'chu-casablanca';
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant-Id': tenantId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProfile),
      });

      if (response.ok) {
        setProfile(editedProfile);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Erreur sauvegarde profil:', error);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen relative">
          <div 
            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/back_patient.jpg)' }}
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
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen relative">
        {/* Background Image */}
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/back_patient.jpg)' }}
        >
          <div className="absolute inset-0 bg-cyan-900/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-sm shadow-lg border-b border-cyan-300/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-white">Mon Profil</h1>
                  <p className="mt-1 text-sm text-cyan-100">
                    Gérez vos informations personnelles et médicales
                  </p>
                </div>
                <Link
                  href="/patient/dashboard"
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white border border-cyan-300/30 rounded-lg hover:bg-white/20 transition"
                >
                  ← Retour au tableau de bord
                </Link>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-6">
              {/* Actions */}
              <div className="flex justify-end mb-6">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
                  >
                    Modifier
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditedProfile(profile);
                        setIsEditing(false);
                      }}
                      className="px-4 py-2 bg-white/10 border border-cyan-300/30 text-white rounded-lg hover:bg-white/20 transition"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
                    >
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>

              {/* Informations Personnelles */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Informations Personnelles</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-cyan-200 mb-1">Prénom</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile?.firstName || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile!, firstName: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-cyan-300/30 rounded-lg text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    ) : (
                      <p className="text-white">{profile?.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cyan-200 mb-1">Nom</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile?.lastName || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile!, lastName: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-cyan-300/30 rounded-lg text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    ) : (
                      <p className="text-white">{profile?.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cyan-200 mb-1">Email</label>
                    <p className="text-white">{profile?.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cyan-200 mb-1">Date de naissance</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedProfile?.dateOfBirth || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile!, dateOfBirth: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-cyan-300/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    ) : (
                      <p className="text-white">{profile?.dateOfBirth}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cyan-200 mb-1">Téléphone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedProfile?.telephone || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile!, telephone: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-cyan-300/30 rounded-lg text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    ) : (
                      <p className="text-white">{profile?.telephone}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-cyan-200 mb-1">Adresse</label>
                    {isEditing ? (
                      <textarea
                        value={editedProfile?.address || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile!, address: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2 bg-white/10 border border-cyan-300/30 rounded-lg text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    ) : (
                      <p className="text-white">{profile?.address}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Informations Médicales */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Informations Médicales</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-cyan-200 mb-1">Groupe sanguin</label>
                    {isEditing ? (
                      <select
                        value={editedProfile?.bloodType || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile!, bloodType: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-cyan-300/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="">Sélectionner</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    ) : (
                      <p className="text-white">{profile?.bloodType || 'Non renseigné'}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-cyan-200 mb-1">Allergies</label>
                    {profile?.allergies && profile.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.allergies.map((allergy, index) => (
                          <span key={index} className="px-3 py-1 bg-cyan-600 text-white rounded-full text-sm">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-cyan-100">Aucune allergie renseignée</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-cyan-200 mb-1">Maladies chroniques</label>
                    {profile?.chronicDiseases && profile.chronicDiseases.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.chronicDiseases.map((disease, index) => (
                          <span key={index} className="px-3 py-1 bg-cyan-600 text-white rounded-full text-sm">
                            {disease}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-cyan-100">Aucune maladie chronique renseignée</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

