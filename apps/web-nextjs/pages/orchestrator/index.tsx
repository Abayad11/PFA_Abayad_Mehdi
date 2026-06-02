import { useState } from 'react';
import { Brain, Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function OrchestratorPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orchestrator/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query,
          includeRag: true,
        }),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la requête');
      }

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-blue-500 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                LLM Orchestrateur IA
              </h1>
              <p className="text-gray-600">
                Orchestration intelligente avec DeepSeek R1
              </p>
            </div>
          </div>
        </div>

        {/* Query Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre requête médicale
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Ex: Analyser cette IRM cérébrale pour détecter d'éventuelles anomalies..."
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-violet-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Envoyer la requête
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900">Erreur</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div className="space-y-6">
            {/* Main Response */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-900">Réponse</h2>
              </div>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700">
                  {response.response}
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-sm text-gray-600 mb-1">Type de requête</div>
                <div className="font-semibold text-gray-900">
                  {response.query_type}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-sm text-gray-600 mb-1">Confiance</div>
                <div className="font-semibold text-gray-900">
                  {(response.confidence * 100).toFixed(1)}%
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-sm text-gray-600 mb-1">Temps de traitement</div>
                <div className="font-semibold text-gray-900">
                  {response.processing_time_seconds?.toFixed(2)}s
                </div>
              </div>
            </div>

            {/* LLMs Used */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                LLMs utilisés
              </h3>
              <div className="flex flex-wrap gap-2">
                {response.llms_used?.map((llm: string) => (
                  <span
                    key={llm}
                    className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium"
                  >
                    {llm}
                  </span>
                ))}
              </div>
            </div>

            {/* Warnings */}
            {response.warnings && response.warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Avertissements
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {response.warnings.map((warning: string, idx: number) => (
                    <li key={idx} className="text-yellow-700 text-sm">
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* RAG Results */}
            {response.rag_results && response.rag_results.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Contexte médical pertinent (RAG)
                </h3>
                <div className="space-y-3">
                  {response.rag_results.map((result: any, idx: number) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {result.source}
                        </span>
                        <span className="text-sm text-gray-500">
                          Score: {(result.relevance_score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{result.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

