import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface ChercheurProfile {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  institution: string;
  domaine: string;
  biographie?: string;
  publications?: number;
}

export default function ChercheurProfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ChercheurProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<ChercheurProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/auth/login');
        return;
      }
      const profileData: ChercheurProfile = {
        firstName: 'Dr. Youssef',
        lastName: 'Alami',
        email: 'y.alami@um6p.ma',
        telephone: '+212 6 98 76 54 32',
        institution: 'Université Mohammed VI Polytechnique',
        domaine: 'Intelligence Artificielle en Santé',
        biographie: 'Chercheur spécialisé en deep learning appliqué au diagnostic médical',
        publications: 15,
      };
      setProfile(profileData);
      setEditedProfile(profileData);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/back_chercheur2.jpg)' }}>
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
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/back_chercheur2.jpg)' }}>
        <div className="absolute inset-0 bg-cyan-900/40"></div>
      </div>
      <div className="relative z-10">
        <div className="bg-white/10 backdrop-blur-sm shadow-lg border-b border-cyan-300/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Mon Profil</h1>
                <p className="mt-1 text-sm text-cyan-100">Gérez vos informations de recherche</p>
              </div>
              <Link href="/chercheur/dashboard" className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white border border-cyan-300/30 rounded-lg hover:bg-white/20 transition">
                ← Retour
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-6">
            <div className="flex justify-end mb-6">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition">Modifier</button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-white/10 border border-cyan-300/30 text-white rounded-lg hover:bg-white/20 transition">Annuler</button>
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition">Enregistrer</button>
                </div>
              )}
            </div>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Informations Académiques</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-cyan-200 mb-1">Prénom</label>
                  {isEditing ? (
                    <input type="text" value={editedProfile?.firstName || ''} onChange={(e) => setEditedProfile({ ...editedProfile!, firstName: e.target.value })} className="w-full px-4 py-2 bg-white/10 border border-cyan-300/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                  ) : (
                    <p className="text-white">{profile?.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-200 mb-1">Nom</label>
                  {isEditing ? (
                    <input type="text" value={editedProfile?.lastName || ''} onChange={(e) => setEditedProfile({ ...editedProfile!, lastName: e.target.value })} className="w-full px-4 py-2 bg-white/10 border border-cyan-300/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                  ) : (
                    <p className="text-white">{profile?.lastName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-200 mb-1">Email</label>
                  <p className="text-white">{profile?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-200 mb-1">Téléphone</label>
                  {isEditing ? (
                    <input type="tel" value={editedProfile?.telephone || ''} onChange={(e) => setEditedProfile({ ...editedProfile!, telephone: e.target.value })} className="w-full px-4 py-2 bg-white/10 border border-cyan-300/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                  ) : (
                    <p className="text-white">{profile?.telephone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-200 mb-1">Institution</label>
                  {isEditing ? (
                    <input type="text" value={editedProfile?.institution || ''} onChange={(e) => setEditedProfile({ ...editedProfile!, institution: e.target.value })} className="w-full px-4 py-2 bg-white/10 border border-cyan-300/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                  ) : (
                    <p className="text-white">{profile?.institution}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-200 mb-1">Domaine de recherche</label>
                  {isEditing ? (
                    <input type="text" value={editedProfile?.domaine || ''} onChange={(e) => setEditedProfile({ ...editedProfile!, domaine: e.target.value })} className="w-full px-4 py-2 bg-white/10 border border-cyan-300/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                  ) : (
                    <p className="text-white">{profile?.domaine}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-cyan-200 mb-1">Biographie</label>
                  {isEditing ? (
                    <textarea value={editedProfile?.biographie || ''} onChange={(e) => setEditedProfile({ ...editedProfile!, biographie: e.target.value })} rows={3} className="w-full px-4 py-2 bg-white/10 border border-cyan-300/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                  ) : (
                    <p className="text-white">{profile?.biographie}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Statistiques</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-cyan-200">Publications</p>
                  <p className="text-xl font-bold text-white">{profile?.publications || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-cyan-200">Datasets partagés</p>
                  <p className="text-xl font-bold text-white">8</p>
                </div>
                <div>
                  <p className="text-sm text-cyan-200">Challenges participés</p>
                  <p className="text-xl font-bold text-white">5</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

