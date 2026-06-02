import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ChercheurSignupPage() {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    laboratoire: '',
    codeINPE: '',
    domaineRecherche: '',
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
          institution: formData.laboratoire,
          domaine_recherche: formData.domaineRecherche,
          role: 'chercheur',
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
        router.push('/auth/login/chercheur');
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
        <title>Inscription Chercheur - Abhar Santé Maroc</title>
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
                <div className="inline-flex items-center bg-purple-500/20 backdrop-blur-sm border border-purple-300/30 rounded-full px-6 py-3 mb-4">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span className="text-white font-medium">Inscription Chercheur</span>
                </div>
                <h1 className="text-3xl font-bold text-white">
                  Rejoindre la recherche
                </h1>
              </div>

              {/* Signup Form */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Établissement
                    </label>
                    <input
                      type="text"
                      name="tenantId"
                      value={formData.tenantId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      placeholder="chu-casablanca"
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
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        placeholder="Zahra"
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
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        placeholder="Zhar"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Laboratoire de recherche
                    </label>
                    <input
                      type="text"
                      name="laboratoire"
                      value={formData.laboratoire}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      placeholder="Lab Recherche Médicale"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Code INPE (optionnel)
                    </label>
                    <input
                      type="text"
                      name="codeINPE"
                      value={formData.codeINPE}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      placeholder="INPE2025"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Domaine de recherche
                    </label>
                    <select
                      name="domaineRecherche"
                      value={formData.domaineRecherche}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      required
                    >
                      <option value="" className="text-gray-900">Sélectionnez un domaine</option>
                      <option value="Intelligence Artificielle Médicale" className="text-gray-900">Intelligence Artificielle Médicale</option>
                      <option value="Imagerie Médicale" className="text-gray-900">Imagerie Médicale</option>
                      <option value="Génomique" className="text-gray-900">Génomique</option>
                      <option value="Épidémiologie" className="text-gray-900">Épidémiologie</option>
                      <option value="Pharmacologie" className="text-gray-900">Pharmacologie</option>
                      <option value="Biostatistiques" className="text-gray-900">Biostatistiques</option>
                      <option value="Oncologie" className="text-gray-900">Oncologie</option>
                      <option value="Neurologie" className="text-gray-900">Neurologie</option>
                      <option value="Cardiologie" className="text-gray-900">Cardiologie</option>
                      <option value="Autre" className="text-gray-900">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Email recherche
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      placeholder="chercheur@chu-casablanca.ma"
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
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
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
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                  >
                    {loading ? 'Création du compte...' : 'Rejoindre la recherche'}
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
                    href="/auth/login/chercheur" 
                    className="text-purple-300 hover:text-purple-200 text-sm transition-colors"
                  >
                    Déjà inscrit ? Se connecter
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

