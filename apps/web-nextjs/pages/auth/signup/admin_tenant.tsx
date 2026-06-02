import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminTenantSignupPage() {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    etablissement: '',
    poste: '',
    telephone: '',
    tenantId: 'chu-casablanca'
  });
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    if (formData.password !== formData.confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setMessage('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);
    
    try {
      // Générer un username à partir de l'email
      const username = formData.email.split('@')[0];
      
      const res = await fetch(`${API_BASE_URL}/api/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Id': formData.tenantId,
        },
        body: JSON.stringify({
          username: username,
          email: formData.email,
          password: formData.password,
          password2: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          institution: formData.etablissement,
          role: 'admin',
          tenant_id: formData.tenantId
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setMessage(data?.message || 'Erreur lors de l\'inscription');
        return;
      }
      
      setMessage('Inscription réussie! Redirection vers la connexion...');
      setTimeout(() => {
        router.push('/auth/login/admin_tenant');
      }, 2000);
      
    } catch (err: any) {
      setMessage(err?.message || 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Inscription Administrateur - Abhar Santé Maroc</title>
      </Head>
      
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/authentification.jpg)',
          }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <header className="p-6">
            <Link href="/auth/signup" className="inline-flex items-center text-white hover:text-blue-300 transition-colors">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour
            </Link>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex items-center justify-center px-6 py-8">
            <div className="w-full max-w-md">
              {/* Role Badge */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-full px-6 py-3 mb-4">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white font-medium">Administration Établissement</span>
                </div>
                <h1 className="text-3xl font-bold text-white">
                  Enregistrer votre établissement
                </h1>
              </div>

              {/* Signup Form */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Code établissement
                    </label>
                    <input
                      type="text"
                      name="tenantId"
                      value={formData.tenantId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      placeholder="chu-casablanca"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Nom de l'établissement
                    </label>
                    <input
                      type="text"
                      name="etablissement"
                      value={formData.etablissement}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      placeholder="Centre Hospitalier Universitaire de Casablanca"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                        placeholder="Ahmed"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                        placeholder="Benali"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Poste/Fonction
                    </label>
                    <select
                      name="poste"
                      value={formData.poste}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      required
                    >
                      <option value="" className="text-gray-900">Sélectionnez votre fonction</option>
                      <option value="Directeur Général" className="text-gray-900">Directeur Général</option>
                      <option value="Directeur Médical" className="text-gray-900">Directeur Médical</option>
                      <option value="Directeur des Soins" className="text-gray-900">Directeur des Soins</option>
                      <option value="Directeur Administratif" className="text-gray-900">Directeur Administratif</option>
                      <option value="Responsable IT" className="text-gray-900">Responsable IT</option>
                      <option value="Chef de Service" className="text-gray-900">Chef de Service</option>
                      <option value="Administrateur Système" className="text-gray-900">Administrateur Système</option>
                      <option value="Autre" className="text-gray-900">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Téléphone professionnel
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      placeholder="+212 5 22 XX XX XX"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Email administrateur
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      placeholder="admin@chu-casablanca.demo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                  >
                    {loading ? 'Création du compte...' : 'Enregistrer l\'établissement'}
                  </button>
                </form>

                {message && (
                  <div className={`mt-4 p-3 rounded-lg text-sm ${
                    message.includes('réussie') || message.includes('Redirection') 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {message}
                  </div>
                )}

                <div className="mt-6 text-center">
                  <Link 
                    href="/auth/login/admin_tenant" 
                    className="text-red-300 hover:text-red-200 text-sm transition-colors"
                  >
                    Déjà enregistré ? Se connecter
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

