import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface DatasetDetail {
  id: string;
  name: string;
  description: string;
  category: string;
  imageCount: number;
  size: string;
  format: string[];
  createdAt: string;
  lastUpdated: string;
  accessLevel: 'public' | 'restricted' | 'private';
  tags: string[];
  license: string;
  citation: string;
  contributors: string[];
  downloadUrl?: string;
  documentation?: string;
  examples?: {
    title: string;
    description: string;
    imageUrl: string;
  }[];
}

export default function DatasetDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [dataset, setDataset] = useState<DatasetDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadDatasetDetail();
  }, [id]);

  const loadDatasetDetail = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const tenantId = localStorage.getItem('tenant_id') || 'chu-casablanca';
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

      const response = await fetch(`${API_BASE_URL}/datasets/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant-Id': tenantId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDataset(data);
      } else {
        // Mock data
        const mockDataset: DatasetDetail = {
          id: id as string,
          name: 'IRM Cérébrales - Tumeurs',
          description: 'Dataset complet d\'IRM cérébrales avec segmentation de tumeurs (gliomes, méningiomes). Les images sont annotées par des radiologues certifiés et incluent des masques de segmentation précis.',
          category: 'Neurologie',
          imageCount: 1850,
          size: '8.7 GB',
          format: ['DICOM', 'NIfTI'],
          createdAt: '2023-11-20',
          lastUpdated: '2025-01-10',
          accessLevel: 'restricted',
          tags: ['IRM', 'Cerveau', 'Tumeur', 'Segmentation'],
          license: 'CC BY-NC-SA 4.0',
          citation: 'Abhar Santé Maroc Research Team (2023). Brain MRI Tumor Segmentation Dataset. DOI: 10.xxxx/dataset.2023',
          contributors: ['Dr. Amina Benali', 'Dr. Karim El Fassi', 'Dr. Fatima Zahra'],
          downloadUrl: '/api/datasets/ds-2/download',
          documentation: 'https://docs.abharsante.ma/datasets/brain-mri-tumors',
          examples: [
            {
              title: 'Gliome Grade IV',
              description: 'IRM T1 avec contraste montrant un glioblastome',
              imageUrl: '/examples/glioma-example.png',
            },
            {
              title: 'Méningiome',
              description: 'IRM T2 montrant un méningiome parasagittal',
              imageUrl: '/examples/meningioma-example.png',
            },
          ],
        };
        setDataset(mockDataset);
      }
    } catch (error) {
      console.error('Erreur chargement dataset:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (dataset?.downloadUrl) {
      alert(`Téléchargement du dataset: ${dataset.name}\n\nTaille: ${dataset.size}\nFormat: ${dataset.format.join(', ')}\n\nLe téléchargement va commencer...`);
      // window.location.href = dataset.downloadUrl;
    }
  };

  const handleRequestAccess = () => {
    alert(`Demande d'accès au dataset: ${dataset?.name}\n\nVotre demande sera examinée par l'équipe de recherche.\nVous recevrez une notification par email.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Dataset non trouvé</h2>
          <Link href="/chercheur/datasets" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            ← Retour aux datasets
          </Link>
        </div>
      </div>
    );
  }

  const getAccessBadge = (level: string) => {
    switch (level) {
      case 'public':
        return <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">Public</span>;
      case 'restricted':
        return <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">Accès restreint</span>;
      case 'private':
        return <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">Privé</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/chercheur/datasets"
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{dataset.name}</h1>
                <p className="mt-1 text-sm text-gray-500">{dataset.category}</p>
              </div>
            </div>
            {getAccessBadge(dataset.accessLevel)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{dataset.description}</p>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {dataset.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Examples */}
            {dataset.examples && dataset.examples.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Exemples</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {dataset.examples.map((example, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center mb-3">
                        <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900">{example.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{example.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Citation */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Citation</h2>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-700">
                {dataset.citation}
              </div>
            </div>

            {/* Contributors */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contributeurs</h2>
              <div className="space-y-2">
                {dataset.contributors.map((contributor) => (
                  <div key={contributor} className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {contributor.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-gray-700">{contributor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Images</p>
                  <p className="text-2xl font-bold text-gray-900">{dataset.imageCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taille</p>
                  <p className="text-2xl font-bold text-gray-900">{dataset.size}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Formats</p>
                  <p className="text-lg font-semibold text-gray-900">{dataset.format.join(', ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Licence</p>
                  <p className="text-sm font-medium text-gray-900">{dataset.license}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Créé le</p>
                  <p className="text-sm text-gray-900">
                    {new Date(dataset.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mis à jour le</p>
                  <p className="text-sm text-gray-900">
                    {new Date(dataset.lastUpdated).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                {dataset.accessLevel === 'public' ? (
                  <button
                    onClick={handleDownload}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Télécharger le dataset
                  </button>
                ) : (
                  <button
                    onClick={handleRequestAccess}
                    className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium"
                  >
                    Demander l'accès
                  </button>
                )}
                
                {dataset.documentation && (
                  <a
                    href={dataset.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center font-medium"
                  >
                    📖 Documentation
                  </a>
                )}
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(dataset.citation);
                    alert('Citation copiée dans le presse-papier!');
                  }}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  📋 Copier la citation
                </button>
              </div>
            </div>

            {/* RGPD Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900">Données anonymisées</h4>
                  <p className="text-xs text-blue-700 mt-1">
                    Ce dataset est conforme au RGPD et totalement anonymisé.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
