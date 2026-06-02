import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/nav/Navbar';

export default function MfaPage() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const [tenantId, setTenantId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [useEmailMfa, setUseEmailMfa] = useState(false);
  const [lastDevCode, setLastDevCode] = useState<string | null>(null);

  useEffect(() => {
    const t = sessionStorage.getItem('auth:tenantId') || '';
    const e = sessionStorage.getItem('auth:email') || '';
    const p = sessionStorage.getItem('auth:password') || '';
    setTenantId(t);
    setEmail(e);
    setPassword(p);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const url = useEmailMfa ? `${API_BASE_URL}/auth/mfa/email/verify` : `${API_BASE_URL}/auth/mfa/verify`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Id': tenantId || 'chu-casablanca',
        },
        body: JSON.stringify({ email, password, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.message || 'Code MFA invalide');
        return;
      }
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('tenant_id', tenantId);
        setMessage('MFA vérifié. Redirection...');
        // Déterminer la destination selon le rôle
        try {
          const meRes = await fetch(`${API_BASE_URL}/me`, {
            headers: {
              'Authorization': `Bearer ${data.access_token}`,
              'X-Tenant-Id': tenantId,
            },
          });
          const me = await meRes.json();
          const role = me?.user?.role || me?.role;
          let dest = '/profile';
          if (role === 'ADMIN_TENANT') dest = '/admin/dashboard';
          else if (role === 'MEDECIN') dest = '/medecin/dashboard';
          else if (role === 'PATIENT') dest = '/patient/dashboard';
          else if (role === 'CHERCHEUR') dest = '/chercheur/dashboard';
          setTimeout(() => { window.location.href = dest; }, 300);
        } catch {
          setTimeout(() => { window.location.href = '/profile'; }, 300);
        }
      } else {
        setMessage('Réponse inattendue du serveur');
      }
    } catch (err: any) {
      setMessage(err?.message || 'Erreur réseau');
    }
  };

  const requestEmailCode = async () => {
    setMessage(null); setLastDevCode(null);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/mfa/email/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Id': tenantId || 'chu-casablanca',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.message || 'Impossible d\'envoyer le code');
        return;
      }
      setMessage('Code envoyé (DEV). Vérifiez vos logs / ci-dessous.');
      if (data.code) setLastDevCode(data.code);
    } catch (err: any) {
      setMessage(err?.message || 'Erreur réseau');
    }
  };

  return (
    <>
      <Head>
        <title>MFA - Abhar Santé Maroc</title>
      </Head>
      <Navbar />
      <div className="relative min-h-screen">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/vid_background.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="card-transparent w-full max-w-md">
            <h1 className="text-2xl font-semibold mb-1">MFA</h1>
            <p className="text-sm text-gray-600 mb-4">
              {useEmailMfa ? 'Entrez le code reçu par email (DEV).' : 'Entrez le code TOTP de votre application d\'authentification.'}
            </p>
            <form onSubmit={onSubmit} className="grid gap-3">
              <label className="grid gap-1">
                <span className="text-sm text-gray-600">Établissement (tenant)</span>
                <input className="input" value={tenantId} onChange={(e) => setTenantId(e.target.value)} placeholder="chu-casablanca" required />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-gray-600">Email</span>
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-gray-600">Code MFA</span>
                <input className="input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" required />
              </label>
              <button className="btn" type="submit">Vérifier</button>
            </form>
            <div className="mt-4 flex items-center gap-2">
              <input id="useEmailMfa" type="checkbox" checked={useEmailMfa} onChange={(e) => setUseEmailMfa(e.target.checked)} />
              <label htmlFor="useEmailMfa" className="text-sm">Utiliser le MFA par email (DEV)</label>
            </div>
            {useEmailMfa && (
              <div className="mt-2">
                <button className="btn" onClick={requestEmailCode} type="button">Recevoir le code par email</button>
                {lastDevCode && (
                  <p className="mt-2 text-xs text-gray-500">Code DEV: {lastDevCode}</p>
                )}
              </div>
            )}
            {message && (
              <p className="mt-4 text-sm text-gray-700">{message}</p>
            )}
            <p className="mt-6 text-xs text-gray-500">
              Dev: l'en-tête X-Tenant-Id est utilisé côté web en attendant le routage par sous-domaine.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

