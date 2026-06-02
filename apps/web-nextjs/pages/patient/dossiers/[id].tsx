import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface DossierDetail {
  id: string;
  title: string;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
  patient: {
    id: string;
    userId: string | null;
    firstName: string;
    lastName: string;
    birthDate: string | null;
  };
}

export default function DossierDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [dossier, setDossier] = useState<DossierDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchDossier();
    }
  }, [id]);

  const fetchDossier = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const tenantId = localStorage.getItem('tenant_id') || 'chu-casablanca';
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/dossiers/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant-Id': tenantId,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        if (response.status === 403) {
          throw new Error('Vous n\'avez pas accès à ce dossier');
        }
        throw new Error('Erreur lors du chargement du dossier');
      }

      const data = await response.json();
      setDossier(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatBirthDate = (dateString: string | null) => {
    if (!dateString) return 'Non renseigné';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dossier...</p>
        </div>
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold text-lg mb-2">Erreur</h2>
          <p className="text-red-600">{error || 'Dossier introuvable'}</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={fetchDossier}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Réessayer
            </button>
            <Link
              href="/patient/dossiers"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Retour
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link
                href="/patient/dossiers"
                className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
              >
                ← Retour aux dossiers
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{dossier.title}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Dossier médical #{dossier.id.slice(0, 8)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Résumé */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Résumé</h2>
              {dossier.summary ? (
                <p className="text-gray-700 whitespace-pre-wrap">{dossier.summary}</p>
              ) : (
                <p className="text-gray-500 italic">Aucun résumé disponible</p>
              )}
            </div>

            {/* Placeholder pour contenu futur */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
              <div className="text-center py-8 text-gray-500">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-2">Aucun document attaché</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations Patient */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="text-gray-900 font-medium">
                    {dossier.patient.firstName} {dossier.patient.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de naissance</p>
                  <p className="text-gray-900">{formatBirthDate(dossier.patient.birthDate)}</p>
                </div>
              </div>
            </div>

            {/* Métadonnées */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Créé le</p>
                  <p className="text-gray-900 text-sm">{formatDate(dossier.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dernière modification</p>
                  <p className="text-gray-900 text-sm">{formatDate(dossier.updatedAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ID du dossier</p>
                  <p className="text-gray-900 text-xs font-mono">{dossier.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
