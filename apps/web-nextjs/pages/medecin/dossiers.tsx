import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../../components/ToastContainer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

interface Patient {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface DossierMedical {
  id: number;
  numero_dossier: string;
  patient: Patient;
  groupe_sanguin: string | null;
  allergies: string | null;
  antecedents_medicaux: string | null;
  traitements_en_cours: string | null;
  statut: 'actif' | 'archive';
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DossierMedical[];
}

export default function DossiersPage() {
  const router = useRouter();
  const { toasts, showToast, removeToast } = useToast();
  
  const [dossiers, setDossiers] = useState<DossierMedical[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('');

  useEffect(() => {
    fetchDossiers();
  }, [currentPage, searchQuery, filterStatut]);

  const fetchDossiers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const tenantId = localStorage.getItem('tenant_id') || 'chu-casablanca';
      
      if (!token) {
        router.push('/auth/login');
        return;
      }
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: pageSize.toString(),
      });
      
      if (searchQuery) params.append('search', searchQuery);
      if (filterStatut) params.append('statut', filterStatut);
      
      const response = await fetch(`${API_BASE_URL}/api/dossiers/?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant-Id': tenantId,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        throw new Error('Erreur lors du chargement');
      }
      
      const data: PaginatedResponse = await response.json();
      setDossiers(data.results);
      setTotalCount(data.count);
    } catch (error) {
      showToast('Erreur lors du chargement des dossiers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const archiver = async (id: number) => {
    if (!confirm('Voulez-vous vraiment archiver ce dossier ?')) return;
    
    try {
      const token = localStorage.getItem('access_token');
      const tenantId = localStorage.getItem('tenant_id');
      
      const response = await fetch(`${API_BASE_URL}/api/dossiers/${id}/archiver/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant-Id': tenantId!,
        },
      });
      
      if (response.ok) {
        showToast('Dossier archivé avec succès', 'success');
        fetchDossiers();
      } else {
        showToast('Erreur lors de l\'archivage', 'error');
      }
    } catch (error) {
      showToast('Erreur lors de l\'archivage', 'error');
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dossiers Médicaux</h1>
            <p className="text-gray-600">Gérez les dossiers médicaux de vos patients</p>
          </div>
          
          {/* Filtres et Recherche */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Rechercher par nom, prénom, numéro de dossier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les statuts</option>
                <option value="actif">Actifs</option>
                <option value="archive">Archivés</option>
              </select>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{totalCount}</p>
                <p className="text-sm text-gray-600 mt-1">Total dossiers</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {dossiers.filter(d => d.statut === 'actif').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Actifs</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-600">
                  {dossiers.filter(d => d.statut === 'archive').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Archivés</p>
              </div>
            </div>
          </div>
          
          {/* Résultats */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {totalCount} dossier{totalCount > 1 ? 's' : ''}
              </h2>
              <Link
                href="/medecin/dossiers/nouveau"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                + Nouveau dossier
              </Link>
            </div>
            
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement...</p>
              </div>
            ) : dossiers.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">Aucun dossier trouvé</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-200">
                  {dossiers.map((dossier) => (
                    <div key={dossier.id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {dossier.patient.first_name} {dossier.patient.last_name}
                            </h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              dossier.statut === 'actif' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {dossier.statut === 'actif' ? 'Actif' : 'Archivé'}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>N° Dossier: <span className="font-mono">{dossier.numero_dossier}</span></p>
                            <p>Email: {dossier.patient.email}</p>
                            {dossier.groupe_sanguin && <p>Groupe sanguin: {dossier.groupe_sanguin}</p>}
                            {dossier.allergies && <p>Allergies: {dossier.allergies}</p>}
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-2">
                            Créé le {new Date(dossier.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Link
                            href={`/medecin/dossiers/${dossier.id}`}
                            className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                          >
                            Voir
                          </Link>
                          {dossier.statut === 'actif' && (
                            <button
                              onClick={() => archiver(dossier.id)}
                              className="px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                            >
                              Archiver
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Précédent
                    </button>
                    
                    <span className="text-sm text-gray-600">
                      Page {currentPage} sur {totalPages}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
