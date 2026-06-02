import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';

export default function AssistantPatientPage() {
  const { apiFetch, token } = useAuth();
  const router = useRouter();
  const { jobId } = router.query;
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }
    if (jobId) {
      analyseJob(jobId as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, jobId]);

  const analyseJob = async (jId: string) => {
    setMessage(null);
    try {
      const res = await apiFetch('/assistant/analyse-inference', {
        method: 'POST',
        body: JSON.stringify({ jobId: jId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.message || 'Erreur analyse');
        return;
      }
      setMessages([{ sender: 'ASSISTANT', content: data.summary || 'Analyse terminée.' }]);
    } catch (e: any) {
      setMessage(e?.message || 'Erreur réseau');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessage(null);
    setSending(true);

    const userMsg = { sender: 'USER', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const res = await apiFetch('/assistant/patient/message', {
        method: 'POST',
        body: JSON.stringify({ content: input }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.message || 'Erreur envoi');
        setSending(false);
        return;
      }
      const assistantMsg = { sender: 'ASSISTANT', content: data.reply || 'Réponse reçue.' };
      setMessages((prev) => [...prev, assistantMsg]);
      setSending(false);
    } catch (e: any) {
      setMessage(e?.message || 'Erreur réseau');
      setSending(false);
    }
  };

  return (
    <>
      <Head>
        <title>Conseiller LLM (Patient) - Abhar Santé Maroc</title>
      </Head>
      <AppLayout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold">💬 Conseiller LLM (Patient)</h1>
            <button className="btn" onClick={() => router.back()}>
              Retour
            </button>
          </div>

          {message && <p className="text-red-600 mb-4">{message}</p>}

          <div className="card mb-4" style={{ minHeight: '400px', maxHeight: '500px', overflowY: 'auto' }}>
            {messages.length === 0 && (
              <p className="text-gray-500">Posez vos questions ou analysez un résultat d'inférence.</p>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-4 p-3 rounded-lg ${
                  msg.sender === 'USER' ? 'bg-blue-100 text-right' : 'bg-gray-100'
                }`}
              >
                <p className="text-sm font-semibold mb-1">{msg.sender === 'USER' ? 'Vous' : 'Assistant'}</p>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              className="input flex-1"
              placeholder="Votre message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
            />
            <button className="btn" type="submit" disabled={sending}>
              {sending ? 'Envoi...' : 'Envoyer'}
            </button>
          </form>
        </div>
      </AppLayout>
    </>
  );
}

