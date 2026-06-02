import { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Phone, Mail, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

interface RendezVous {
  id: string;
  patientNom: string;
  patientPrenom: string;
  date: string;
  heure: string;
  type: string;
  statut: 'confirme' | 'en_attente' | 'annule' | 'termine';
  motif: string;
  telephone?: string;
  email?: string;
}

export default function RendezVousPage() {
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRdv, setSelectedRdv] = useState<RendezVous | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'tous' | 'aujourdhui' | 'semaine'>('tous');

  useEffect(() => {
    fetchRendezVous();
  }, []);

  const fetchRendezVous = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/rendez-vous', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setRendezVous(data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatutBadge = (statut: string) => {
    const variants: Record<string, any> = {
      confirme: { variant: 'success', label: 'Confirmé' },
      en_attente: { variant: 'warning', label: 'En attente' },
      annule: { variant: 'danger', label: 'Annulé' },
      termine: { variant: 'info', label: 'Terminé' },
    };

    const config = variants[statut] || variants.en_attente;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const confirmerRendezVous = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/rendez-vous/${id}/confirmer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchRendezVous();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const annulerRendezVous = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/rendez-vous/${id}/annuler`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchRendezVous();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const rdvFiltres = rendezVous.filter((rdv) => {
    if (filter === 'tous') return true;
    
    const rdvDate = new Date(rdv.date);
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);

    if (filter === 'aujourdhui') {
      return rdvDate.toDateString() === aujourdhui.toDateString();
    }

    if (filter === 'semaine') {
      const finSemaine = new Date(aujourdhui);
      finSemaine.setDate(finSemaine.getDate() + 7);
      return rdvDate >= aujourdhui && rdvDate <= finSemaine;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gestion des Rendez-vous
          </h1>
          <p className="text-gray-600">
            Gérez vos consultations et rendez-vous patients
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <Button
            variant={filter === 'tous' ? 'primary' : 'outline'}
            onClick={() => setFilter('tous')}
          >
            Tous
          </Button>
          <Button
            variant={filter === 'aujourdhui' ? 'primary' : 'outline'}
            onClick={() => setFilter('aujourdhui')}
          >
            Aujourd'hui
          </Button>
          <Button
            variant={filter === 'semaine' ? 'primary' : 'outline'}
            onClick={() => setFilter('semaine')}
          >
            Cette semaine
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{rendezVous.length}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Confirmés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {rendezVous.filter((r) => r.statut === 'confirme').length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {rendezVous.filter((r) => r.statut === 'en_attente').length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Annulés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {rendezVous.filter((r) => r.statut === 'annule').length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Liste des rendez-vous */}
        {loading ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500">Chargement...</p>
            </div>
          </Card>
        ) : rdvFiltres.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun rendez-vous trouvé</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {rdvFiltres.map((rdv) => (
              <Card
                key={rdv.id}
                hover
                onClick={() => {
                  setSelectedRdv(rdv);
                  setShowModal(true);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-violet-100 rounded-lg">
                      <User className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {rdv.patientPrenom} {rdv.patientNom}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(rdv.date).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {rdv.heure}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {rdv.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>{getStatutBadge(rdv.statut)}</div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal détails */}
        {selectedRdv && (
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Détails du rendez-vous"
            footer={
              <>
                {selectedRdv.statut === 'en_attente' && (
                  <>
                    <Button
                      variant="danger"
                      onClick={() => annulerRendezVous(selectedRdv.id)}
                    >
                      Annuler
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => confirmerRendezVous(selectedRdv.id)}
                    >
                      Confirmer
                    </Button>
                  </>
                )}
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Fermer
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Patient</h4>
                <p className="text-gray-700">
                  {selectedRdv.patientPrenom} {selectedRdv.patientNom}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Date et heure</h4>
                <p className="text-gray-700">
                  {new Date(selectedRdv.date).toLocaleDateString('fr-FR')} à {selectedRdv.heure}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Type de consultation</h4>
                <Badge variant="info">{selectedRdv.type}</Badge>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Motif</h4>
                <p className="text-gray-700">{selectedRdv.motif}</p>
              </div>

              {selectedRdv.telephone && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4" />
                    {selectedRdv.telephone}
                  </div>
                </div>
              )}

              {selectedRdv.email && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4" />
                  {selectedRdv.email}
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Statut</h4>
                {getStatutBadge(selectedRdv.statut)}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

