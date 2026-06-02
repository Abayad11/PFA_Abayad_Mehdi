import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '../../../components/layout/AppLayout';
import { useAuth } from '../../../context/AuthContext';

export default function InferenceJobDetailPage() {
  const { apiFetch, token } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }
    if (id) loadJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, id]);

  const loadJob = async () => {
    setMessage(null);
    try {
      const res = await apiFetch(`/inference/jobs/${id}`);
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMessage(data?.message || 'Job introuvable');
        return;
      }
      setJob(data.job);
    } catch (e: any) {
      setMessage(e?.message || 'Erreur réseau');
    }
  };

  const analyseResult = () => {
    if (!job) return;
    const path = job.patientId
      ? `/assistant/medecin?patientId=${job.patientId}&jobId=${job.id}`
      : `/assistant?jobId=${job.id}`;
    router.push(path);
  };

  return (
    <>
      <Head>
        <title>Détail Job - Abhar Santé Maroc</title>
      </Head>
      <AppLayout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold">Détail du Job</h1>
            <button className="btn" onClick={() => router.back()}>
              Retour
            </button>
          </div>

          {message && <p className="text-red-600 mb-4">{message}</p>}

          {job && (
            <div className="card">
              <div className="grid gap-4">
                <div>
                  <span className="text-sm text-gray-600">ID:</span>
                  <p className="font-mono text-sm">{job.id}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Modèle:</span>
                  <p className="font-semibold">{job.modelId}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Statut:</span>
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded ${
                      job.status === 'DONE'
                        ? 'bg-green-100 text-green-800'
                        : job.status === 'ERROR'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                {job.patientId && (
                  <div>
                    <span className="text-sm text-gray-600">Patient ID:</span>
                    <p className="font-mono text-sm">{job.patientId}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-600">Créé le:</span>
                  <p>{new Date(job.createdAt).toLocaleString('fr-FR')}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Entrées:</span>
                  <pre className="bg-gray-100 p-3 rounded-md overflow-auto text-xs">
                    {JSON.stringify(job.inputsJson, null, 2)}
                  </pre>
                </div>
                {job.outputJson && (
                  <div>
                    <span className="text-sm text-gray-600">Sorties:</span>
                    <pre className="bg-gray-100 p-3 rounded-md overflow-auto text-xs">
                      {JSON.stringify(job.outputJson, null, 2)}
                    </pre>
                  </div>
                )}
                {job.error && (
                  <div>
                    <span className="text-sm text-red-600">Erreur:</span>
                    <p className="text-red-600">{job.error}</p>
                  </div>
                )}
              </div>

              {job.status === 'DONE' && (
                <div className="mt-6">
                  <button className="btn" onClick={analyseResult}>
                    Analyser le résultat avec le LLM
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </AppLayout>
    </>
  );
}
