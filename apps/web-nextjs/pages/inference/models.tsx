import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';

export default function InferenceModelsPage() {
  const { apiFetch, token } = useAuth();
  const router = useRouter();
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [patientId, setPatientId] = useState('');
  const [inputs, setInputs] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }
    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadModels = async () => {
    setMessage(null);
    try {
      const res = await apiFetch('/inference/models');
      const data = await res.json();
      if (res.ok && data.models) {
        setModels(data.models);
      } else {
        setMessage(data?.message || 'Erreur de chargement des modèles');
      }
    } catch (e: any) {
      setMessage(e?.message || 'Erreur réseau');
    }
  };

  const submitJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    try {
      const body: any = {
        modelId: selectedModel.id,
        inputs: inputs ? JSON.parse(inputs) : {},
      };
      if (patientId.trim()) body.patientId = patientId.trim();

      const res = await apiFetch('/inference/jobs', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.message || 'Erreur de soumission');
        setSubmitting(false);
        return;
      }
      setMessage(`Job créé: ${data.jobId}`);
      setTimeout(() => {
        router.push(`/inference/job/${data.jobId}`);
      }, 1000);
    } catch (e: any) {
      setMessage(e?.message || 'Erreur réseau');
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Modèles d'inférence - Abhar Santé Maroc</title>
      </Head>
      <AppLayout>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6">Modèles d'inférence</h1>
          {message && <p className="text-sm text-gray-700 mb-4">{message}</p>}

          {!selectedModel && (
            <div className="grid md:grid-cols-2 gap-6">
              {models.map((model) => {
                const logoMap: Record<string, string> = {
                  'alz-resnet50': '/alzheimer.jpeg',
                  'fetal-segmentation': '/foetale.jpeg',
                  'cancer-detection': '/concer.jpeg',
                  'diabetes-prediction': '/Diabete.jpeg',
                };
                const gradientMap: Record<string, string> = {
                  'alz-resnet50': 'from-brand-100 to-brand-50',
                  'fetal-segmentation': 'from-gray-100 to-gray-50',
                  'cancer-detection': 'from-brand-50 to-gray-100',
                  'diabetes-prediction': 'from-gray-50 to-brand-100',
                };
                const logo = logoMap[model.id] || '/logo-abhar.png';
                const gradient = gradientMap[model.id] || 'from-gray-50 to-brand-50';

                return (
                  <button
                    key={model.id}
                    className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br ${gradient} hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 p-6 text-left`}
                    onClick={() => setSelectedModel(model)}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                        <Image src={logo} alt={model.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-brand-700 transition-colors">{model.name}</h2>
                        <p className="text-sm font-medium text-brand-600">{model.pathology}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><span className="font-semibold text-gray-900">Entrée:</span> {model.input}</p>
                      <p><span className="font-semibold text-gray-900">Sortie:</span> {model.output}</p>
                    </div>
                    <div className="absolute bottom-4 right-4 text-brand-500 group-hover:text-brand-700 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {selectedModel && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">{selectedModel.name}</h2>
                <button className="btn" onClick={() => setSelectedModel(null)}>
                  Retour
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Pathologie:</strong> {selectedModel.pathology} | <strong>Entrée:</strong>{' '}
                {selectedModel.input} | <strong>Sortie:</strong> {selectedModel.output}
              </p>

              <form onSubmit={submitJob} className="grid gap-4">
                <label className="grid gap-1">
                  <span className="text-sm text-gray-600">ID Patient (optionnel)</span>
                  <input
                    className="input"
                    placeholder="Laisser vide si vous êtes le patient"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-sm text-gray-600">
                    Entrées (JSON) – ex: {`{"note":"demo", "file":"url..."}`}
                  </span>
                  <textarea
                    className="input"
                    rows={6}
                    placeholder='{"note":"demo"}'
                    value={inputs}
                    onChange={(e) => setInputs(e.target.value)}
                  />
                </label>

                <button className="btn" type="submit" disabled={submitting}>
                  {submitting ? 'Soumission...' : 'Soumettre le job'}
                </button>
              </form>
            </div>
          )}
        </div>
      </AppLayout>
    </>
  );
}

