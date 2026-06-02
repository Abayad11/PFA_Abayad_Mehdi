import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  // Rediriger vers le dashboard approprié si connecté
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const dashboardRoutes: Record<string, string> = {
        patient: '/patient/dashboard',
        medecin: '/medecin/dashboard',
        chercheur: '/chercheur/dashboard',
        admin: '/admin/dashboard',
      };
      router.push(dashboardRoutes[user.role] || '/patient/dashboard');
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Abhar Santé Maroc - Plateforme Médicale Intelligente</title>
        <meta name="description" content="Plateforme de santé digitale pour les établissements médicaux au Maroc" />
      </Head>
      
      <div className="min-h-screen relative overflow-hidden flex flex-col">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/vid_background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gray-700/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-wide">
              ABHAR SANTÉ MAROC
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-300 to-cyan-500 mx-auto"></div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col justify-center px-8">
          <div className="max-w-4xl mx-auto text-center">
            
            {/* À propos section */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-8">
                À Propos de Nous
              </h2>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-cyan-300/30 shadow-lg">
                <p className="text-xl md:text-2xl text-gray-100 leading-relaxed mb-6">
                  <strong>Abhar Santé Maroc</strong> est une plateforme médicale intelligente qui révolutionne 
                  la gestion des soins de santé au Maroc.
                </p>
                <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-6">
                  Nous connectons <strong>patients</strong>, <strong>médecins</strong>, <strong>chercheurs</strong> et 
                  <strong> administrateurs d'établissements</strong> dans un écosystème numérique sécurisé et innovant.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Avec l'intelligence artificielle au cœur de notre solution, nous facilitons le diagnostic, 
                  optimisons les traitements et accélérons la recherche médicale pour un avenir plus sain.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-8">
                Accédez à votre espace
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  href="/auth/login" 
                  className="group bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Se Connecter
                  </span>
                </Link>
                
                <Link 
                  href="/auth/signup" 
                  className="group bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-600 hover:to-cyan-800 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    S'Inscrire
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-8 text-center">
          <p className="text-gray-300 text-sm">
            © 2025 Abhar Santé Maroc - Mehdi Abayad & Zahra Zhar
          </p>
        </footer>
        </div>
      </div>
    </>
  );
}

