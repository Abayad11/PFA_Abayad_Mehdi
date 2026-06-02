import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ParticipateChallengeePage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    modelName: '',
    description: '',
    githubUrl: '',
    file: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Votre soumission a été enregistrée avec succès ! Vous recevrez les résultats sous 24-48h.');
      router.push('/chercheur/soumissions');
    } catch (error) {
      alert('Erreur lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/back_chercheur2.jpg)' }}>
        <div className="absolute inset-0 bg-cyan-900/40"></div>
      </div>
      <div className="relative z-10">
        <div className="bg-white/10 backdrop-blur-sm shadow-lg border-b border-cyan-300/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-3">
              <Link href="/chercheur/challenges" className="p-2 hover:bg-white/20 rounded-lg transition">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">Participer au Challenge</h1>
                <p className="mt-1 text-sm text-cyan-100">Soumettez votre modèle pour évaluation</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl p-8">
            <div className="mb-6 p-4 bg-cyan-600/20 border border-cyan-400/30 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">📋 Instructions</h3>
              <ul className="text-sm text-cyan-100 space-y-1 list-disc list-inside">
                <li>Votre modèle doit respecter le format spécifié dans la documentation</li>
                <li>Le fichier de soumission doit être au format .zip ou .tar.gz</li>
                <li>Incluez un fichier README avec les instructions d'exécution</li>
                <li>Les résultats seront disponibles sous 24-48h</li>
              </ul>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-cyan-200 mb-2">Nom du modèle *</label>
                <input
                  type="text"
                  required
                  value={formData.modelName}
                  onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                  placeholder="Ex: ResNet50-Custom"
                  className="w-full px-4 py-3 bg-white/10 border border-cyan-300/30 rounded-lg text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-200 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Décrivez votre approche, les techniques utilisées..."
                  className="w-full px-4 py-3 bg-white/10 border border-cyan-300/30 rounded-lg text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-200 mb-2">URL GitHub (optionnel)</label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-4 py-3 bg-white/10 border border-cyan-300/30 rounded-lg text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-200 mb-2">Fichier de soumission *</label>
                <div className="border-2 border-dashed border-cyan-300/30 rounded-lg p-8 text-center hover:border-cyan-400/50 transition">
                  <input
                    type="file"
                    required
                    accept=".zip,.tar.gz"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <svg className="mx-auto h-12 w-12 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2 text-sm text-white">
                      {formData.file ? formData.file.name : 'Cliquez pour sélectionner un fichier'}
                    </p>
                    <p className="text-xs text-cyan-200 mt-1">ZIP ou TAR.GZ (max 500MB)</p>
                  </label>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 bg-white/10 border border-cyan-300/30 text-white rounded-lg hover:bg-white/20 transition font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Envoi en cours...' : 'Soumettre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
