import { useEffect, useState } from 'react';
import Head from 'next/head';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

export default function ProfilePage() {
  const { tenantId, setTenantId, apiFetch, token } = useAuth();
  const [me, setMe] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadProfile = async () => {
    setMessage(null);
    setMe(null);
    try {
      if (!token) {
        setMessage('Aucun token. Connectez-vous.');
        return;
      }
      const res = await apiFetch('/me');
      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.message || 'Erreur /me');
        return;
      }
      setMe(data);
      
      // Redirection automatique vers le dashboard selon le rôle
      if (data.role === 'MEDECIN') {
        window.location.href = '/dashboard/medecin';
      } else if (data.role === 'PATIENT') {
        window.location.href = '/dashboard/patient';
      } else if (data.role === 'CHERCHEUR') {
        window.location.href = '/dashboard/chercheur';
      }
      // ADMIN_TENANT reste sur /profile
    } catch (e: any) {
      setMessage(e?.message || 'Erreur réseau');
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, tenantId]);

  const logout = () => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('auth:email');
    sessionStorage.removeItem('auth:password');
    sessionStorage.removeItem('auth:tenantId');
    window.location.href = '/login';
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Profil - Abhar Santé Maroc</title>
      </Head>
      <AppLayout>
        <div className="max-w-3xl mx-auto">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-2xl font-semibold flex-1">Profil</h1>
              <label className="text-sm text-gray-600 flex items-center gap-2">
                <span>Tenant</span>
                <input className="input h-9" value={tenantId} onChange={(e) => setTenantId(e.target.value)} />
              </label>
              <button className="btn h-9" onClick={loadProfile}>Recharger</button>
              <button className="btn h-9" onClick={logout}>Déconnexion</button>
            </div>
            {message && <p className="text-danger mb-3">{message}</p>}
            {me && (
              <pre className="bg-gray-100 p-3 rounded-md overflow-auto">
{JSON.stringify(me, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}

