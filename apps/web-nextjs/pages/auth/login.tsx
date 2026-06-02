import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function AuthLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantId] = useState('chu-casablanca');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Id': tenantId,
        },
        body: JSON.stringify({ username, password, tenant_id: tenantId }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setMessage(data?.error || data?.message || 'Erreur de connexion');
        return;
      }
      
      // Vérifier si le login a réussi (Django retourne data.tokens)
      if (data.tokens && data.tokens.access) {
        // Sauvegarder les tokens et les infos utilisateur
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
        localStorage.setItem('tenant_id', tenantId);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setMessage('Connexion réussie. Redirection...');
        
        // Rediriger vers le dashboard selon le rôle
        const role = data.user?.role;
        const dashboardRoutes: Record<string, string> = {
          patient: '/patient/dashboard',
          medecin: '/medecin/dashboard',
          chercheur: '/chercheur/dashboard',
          admin: '/admin/dashboard',
        };
        
        const redirectTo = dashboardRoutes[role] || '/';
        setTimeout(() => router.push(redirectTo), 500);
      } else {
        setMessage('Erreur de connexion');
      }
    } catch (err: any) {
      setMessage(err?.message || 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Connexion - Abhar Santé Maroc</title>
      </Head>
      
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/authentification.jpg)',
          }}
        >
          <div className="absolute inset-0 bg-gray-700/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <header className="p-6">
            <Link href="/" className="inline-flex items-center text-white hover:text-cyan-300 transition-colors">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour à l'accueil
            </Link>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex items-center justify-center px-6 py-12">
            <div className="max-w-md w-full">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Abhar Santé Maroc
                  </h1>
                  <p className="text-gray-200">
                    Connexion
                  </p>
                  <p className="text-sm text-gray-300 mt-2">
                    Accédez à votre espace personnel
                  </p>
                </div>

                {/* Message */}
                {message && (
                  <div className={`mb-6 p-4 rounded-lg ${
                    message.includes('réussie') || message.includes('Redirection')
                      ? 'bg-green-500/20 border border-green-400 text-green-100'
                      : 'bg-red-500/20 border border-red-400 text-red-100'
                  }`}>
                    <p className="text-sm">{message}</p>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={onSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-2">
                      Nom d'utilisateur
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      placeholder="Entrez votre nom d'utilisateur"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                      Mot de passe
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label htmlFor="tenantId" className="block text-sm font-medium text-gray-200 mb-2">
                      Établissement
                    </label>
                    <select
                      id="tenantId"
                      value={tenantId}
                      onChange={(e) => setTenantId(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    >
                      <option value="chu-casablanca" className="bg-gray-800">CHU Casablanca</option>
                      <option value="chu-rabat" className="bg-gray-800">CHU Rabat</option>
                      <option value="chu-fes" className="bg-gray-800">CHU Fès</option>
                      <option value="chu-marrakech" className="bg-gray-800">CHU Marrakech</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {loading ? 'Connexion en cours...' : 'Se connecter'}
                  </button>
                </form>

                {/* Comptes de test */}
                <div className="mt-8 p-4 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
                  <p className="text-xs text-cyan-200 font-semibold mb-2">🔑 Comptes de test :</p>
                  <div className="space-y-1 text-xs text-gray-300">
                    <p><strong>Admin:</strong> admin / admin123</p>
                    <p><strong>Patient:</strong> patient / patient123</p>
                    <p><strong>Médecin:</strong> medecin / medecin123</p>
                    <p><strong>Chercheur:</strong> chercheur / chercheur123</p>
                  </div>
                </div>

                {/* Footer Links */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-300">
                    Pas encore de compte ?{' '}
                    <Link href="/auth/signup" className="text-cyan-300 hover:text-cyan-200 font-medium">
                      S'inscrire
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

