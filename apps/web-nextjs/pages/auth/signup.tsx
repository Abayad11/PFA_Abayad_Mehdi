import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AuthSignupPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: 'PATIENT',
      title: 'Patient',
      description: 'Créez votre dossier médical personnel',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'from-cyan-400 to-cyan-600',
      available: true
    },
    {
      id: 'MEDECIN',
      title: 'Médecin',
      description: 'Rejoignez notre réseau de professionnels',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'from-cyan-500 to-cyan-700',
      available: true
    },
    {
      id: 'CHERCHEUR',
      title: 'Chercheur',
      description: 'Participez à la recherche médicale',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: 'from-cyan-600 to-cyan-800',
      available: true
    },
    {
      id: 'ADMIN_TENANT',
      title: 'Administrateur d\'Établissement',
      description: 'Gérez votre établissement de santé',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'from-cyan-700 to-cyan-900',
      available: true
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    // Rediriger vers la page d'inscription avec le rôle sélectionné
    router.push(`/auth/signup/${roleId.toLowerCase()}`);
  };

  return (
    <>
      <Head>
        <title>Inscription - Abhar Santé Maroc</title>
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
          <main className="flex-1 flex items-center justify-center px-6">
            <div className="max-w-4xl w-full">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Inscription
                </h1>
                <p className="text-xl text-gray-200">
                  Choisissez votre profil pour créer votre compte
                </p>
              </div>

              {/* Role Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    disabled={!role.available}
                    className={`group bg-white/10 backdrop-blur-sm border border-cyan-300/30 rounded-2xl p-8 transition-all duration-300 transform text-left ${
                      role.available 
                        ? 'hover:bg-white/20 hover:scale-105 hover:shadow-2xl cursor-pointer' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`text-4xl p-3 rounded-xl bg-gradient-to-r ${role.color} shadow-lg`}>
                        {role.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold text-white mb-2 transition-colors ${
                          role.available ? 'group-hover:text-cyan-300' : ''
                        }`}>
                          {role.title}
                        </h3>
                        <p className="text-gray-200 text-sm leading-relaxed">
                          {role.description}
                        </p>
                        {!role.available && (
                          <p className="text-yellow-300 text-xs mt-2 font-medium">
                            Bientôt disponible
                          </p>
                        )}
                      </div>
                      <div className={`text-gray-300 transition-colors ${
                        role.available ? 'group-hover:text-cyan-200' : ''
                      }`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer Links */}
              <div className="text-center mt-12">
                <p className="text-gray-300 mb-4">
                  Vous avez déjà un compte ?
                </p>
                <Link 
                  href="/auth/login" 
                  className="inline-flex items-center text-gray-300 hover:text-cyan-300 font-medium transition-colors"
                >
                  Se connecter
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

