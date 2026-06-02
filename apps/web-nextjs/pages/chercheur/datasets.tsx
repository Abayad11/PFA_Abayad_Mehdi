import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Dataset {
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
}

export default function DatasetsPage() {
  const router = useRouter();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const tenantId = localStorage.getItem('tenant_id') || 'chu-casablanca';
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

      const response = await fetch(`${API_BASE_URL}/datasets`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant-Id': tenantId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDatasets(data);
      } else {
        // Fallback sur mock data
        const mockDatasets: Dataset[] = [
          {
            id: 'ds-1',
            name: 'Radiographies Thorax COVID-19',
            description: 'Collection de 5000+ radiographies thoraciques annotées pour la détection du COVID-19',
            category: 'Radiologie',
            imageCount: 5243,
            size: '2.3 GB',
            format: ['DICOM', 'PNG'],
            createdAt: '2024-01-15',
            lastUpdated: '2025-01-20',
            accessLevel: 'public',
            tags: ['COVID-19', 'Thorax', 'Radiographie', 'Classification'],
          },
          {
            id: 'ds-2',
            name: 'IRM Cérébrales - Tumeurs',
            description: 'Dataset d\'IRM cérébrales avec segmentation de tumeurs (gliomes, méningiomes)',
            category: 'Neurologie',
            imageCount: 1850,
            size: '8.7 GB',
            format: ['DICOM', 'NIfTI'],
            createdAt: '2023-11-20',
            lastUpdated: '2025-01-10',
            accessLevel: 'restricted',
            tags: ['IRM', 'Cerveau', 'Tumeur', 'Segmentation'],
          },
          {
            id: 'ds-3',
            name: 'ECG Arythmies Cardiaques',
            description: 'Signaux ECG annotés pour la détection d\'arythmies (10000+ enregistrements)',
            category: 'Cardiologie',
            imageCount: 10500,
            size: '1.2 GB',
            format: ['CSV', 'EDF'],
            createdAt: '2024-03-10',
            lastUpdated: '2025-01-18',
            accessLevel: 'public',
            tags: ['ECG', 'Cardiologie', 'Arythmie', 'Série temporelle'],
          },
          {
            id: 'ds-4',
            name: 'Rétinopathie Diabétique',
            description: 'Images de fond d\'œil pour la détection de la rétinopathie diabétique',
            category: 'Ophtalmologie',
            imageCount: 3500,
            size: '4.1 GB',
            format: ['JPEG', 'TIFF'],
            createdAt: '2024-06-05',
            lastUpdated: '2025-01-15',
            accessLevel: 'public',
            tags: ['Rétine', 'Diabète', 'Ophtalmologie', 'Classification'],
          },
          {
            id: 'ds-5',
            name: 'Histopathologie Cancer du Sein',
            description: 'Images histopathologiques annotées pour la classification du cancer du sein',
            category: 'Anatomopathologie',
            imageCount: 7800,
            size: '12.5 GB',
            format: ['SVS', 'PNG'],
            createdAt: '2023-09-12',
            lastUpdated: '2024-12-20',
            accessLevel: 'restricted',
            tags: ['Histopathologie', 'Cancer', 'Sein', 'Classification'],
          },
        ];
        setDatasets(mockDatasets);
      }
    } catch (error) {
      console.error('Erreur chargement datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Radiologie', 'Neurologie', 'Cardiologie', 'Ophtalmologie', 'Anatomopathologie'];

  const filteredDatasets = datasets.filter((ds) => {
    const matchesSearch = ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ds.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ds.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || ds.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getAccessBadge = (level: Dataset['accessLevel']) => {
    switch (level) {
      case 'public':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Public</span>;
      case 'restricted':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">Accès restreint</span>;
      case 'private':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">Privé</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des datasets...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Datasets Médicaux</h1>
              <p className="mt-1 text-sm text-gray-500">
                Accédez aux données anonymisées pour vos recherches
              </p>
            </div>
            <Link
              href="/chercheur/dashboard"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              ← Retour au tableau de bord
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom, description, tags..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Toutes les catégories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{filteredDatasets.length}</p>
            <p className="text-sm text-gray-600 mt-1">Datasets disponibles</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-green-600">
              {filteredDatasets.reduce((sum, ds) => sum + ds.imageCount, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">Images totales</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">
              {filteredDatasets.filter(ds => ds.accessLevel === 'public').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Accès public</p>
          </div>
        </div>

        {/* Datasets Grid */}
        {filteredDatasets.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun dataset trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredDatasets.map((dataset) => (
              <div key={dataset.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{dataset.name}</h3>
                    {getAccessBadge(dataset.accessLevel)}
                  </div>
                  <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {dataset.category}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{dataset.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-500">Images</p>
                    <p className="font-semibold text-gray-900">{dataset.imageCount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Taille</p>
                    <p className="font-semibold text-gray-900">{dataset.size}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Formats</p>
                    <p className="font-semibold text-gray-900">{dataset.format.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Mis à jour</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(dataset.lastUpdated).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {dataset.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      // Télécharger ou accéder au dataset
                      alert(`Accès au dataset: ${dataset.name}\n\nFonctionnalité en cours de développement.\nVous pourrez bientôt télécharger ce dataset.`);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    Accéder au dataset
                  </button>
                  <button 
                    onClick={() => {
                      // Afficher les détails du dataset
                      router.push(`/chercheur/datasets/${dataset.id}`);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                  >
                    Détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info RGPD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 text-blue-600 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900">Utilisation éthique des données</h4>
              <p className="text-sm text-blue-700 mt-1">
                Tous les datasets sont anonymisés et conformes au RGPD. L'utilisation est strictement
                limitée à la recherche médicale. Toute publication doit citer la source et respecter
                les conditions d'utilisation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

