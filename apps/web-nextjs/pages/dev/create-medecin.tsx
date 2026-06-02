import { useState } from 'react';
import Head from 'next/head';
import AppLayout from '../../components/layout/AppLayout';

export default function DevCreateMedecinPage() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const [tenantId, setTenantId] = useState('chu-casablanca');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/dev/create-medecin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Tenant-Id': tenantId },
        body: JSON.stringify({ email, password, tenantId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.message || 'Erreur de création');
        return;
      }
      setMessage('Compte médecin créé. Vous pouvez vous connecter avec MFA email.');
      sessionStorage.setItem('auth:tenantId', tenantId);
      sessionStorage.setItem('auth:email', email);
      sessionStorage.setItem('auth:password', password);
    } catch (err: any) {
      setMessage(err?.message || 'Erreur réseau');
    }
  };

  return (
    <>
      <Head>
        <title>DEV: Créer compte Médecin</title>
      </Head>
      <AppLayout>
        <div className="max-w-md mx-auto py-12">
          <div className="card">
            <h1 className="text-xl font-semibold mb-3">DEV: Créer compte Médecin</h1>
            <form onSubmit={onSubmit} className="grid gap-3">
              <label className="grid gap-1">
                <span className="text-sm text-gray-600">Établissement (tenant)</span>
                <input className="input" value={tenantId} onChange={(e) => setTenantId(e.target.value)} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-gray-600">Email</span>
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-gray-600">Mot de passe</span>
                <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </label>
              <button className="btn" type="submit">Créer</button>
            </form>
            {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
            <p className="mt-6 text-xs text-gray-500">Usage dev uniquement. En prod, utilisez un provider email réel.</p>
          </div>
        </div>
      </AppLayout>
    </>
  );
}

