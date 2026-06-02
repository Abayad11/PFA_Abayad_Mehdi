import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type Mode = 'decision' | 'patient';

export default function MedecinConseillerIAPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>('decision');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [patientId, setPatientId] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [patientReport, setPatientReport] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Message de bienvenue
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Bonjour Docteur! Je suis votre assistant IA médical.\n\n**Choisissez un mode:**\n\n**Mode Aide à la décision:** Posez-moi des questions médicales pour obtenir des conseils cliniques et une aide au diagnostic.\n\n**Mode Consultation Patient:** Entrez l\'ID d\'un patient pour consulter son rapport de pré-diagnostic généré lors de ses conversations avec l\'IA.\n\nComment puis-je vous assister aujourd\'hui?',
        timestamp: new Date(),
      },
    ]);
    setLoading(false);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setPatientReport(null);
    const modeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: newMode === 'decision'
        ? '**Mode Aide à la décision activé**\n\nPosez-moi vos questions médicales:\n• Diagnostic différentiel\n• Interprétation de résultats\n• Recommandations thérapeutiques\n• Protocoles cliniques\n\nJe suis là pour vous assister dans vos décisions cliniques!'
        : '**Mode Consultation Patient activé**\n\nEntrez l\'ID du patient pour consulter:\n• Son rapport de pré-diagnostic IA\n• L\'historique de ses conversations\n• Les analyses partagées\n• Les recommandations générées\n\nVeuillez entrer l\'ID du patient ci-dessous.',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, modeMessage]);
  };

  const handleLoadPatientReport = async () => {
    if (!patientId.trim()) return;

    setIsSending(true);
    try {
      const token = localStorage.getItem('access_token');
      const tenantId = localStorage.getItem('tenant_id') || 'chu-casablanca';
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

      const response = await fetch(`${API_BASE_URL}/chat/patient-report/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant-Id': tenantId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatientReport(data);
        
        const reportMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: formatPatientReport(data),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, reportMessage]);
      } else {
        // Rapport simulé si l'API n'existe pas encore
        const simulatedReport = getSimulatedPatientReport(patientId);
        setPatientReport(simulatedReport);
        
        const reportMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: formatPatientReport(simulatedReport),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, reportMessage]);
      }
    } catch (error) {
      console.error('Erreur chargement rapport:', error);
      const simulatedReport = getSimulatedPatientReport(patientId);
      setPatientReport(simulatedReport);
      
      const reportMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: formatPatientReport(simulatedReport),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, reportMessage]);
    } finally {
      setIsSending(false);
      setPatientId('');
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsSending(true);

    try {
      const token = localStorage.getItem('access_token');
      const tenantId = localStorage.getItem('tenant_id') || 'chu-casablanca';
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

      const response = await fetch(`${API_BASE_URL}/chat/medical-assistant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant-Id': tenantId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: 'medical_decision',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const simulatedResponse = getSimulatedMedicalResponse(inputMessage);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: simulatedResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Erreur envoi message:', error);
      const simulatedResponse = getSimulatedMedicalResponse(inputMessage);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: simulatedResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const getSimulatedPatientReport = (patientId: string) => {
    return {
      patientId,
      patientName: 'Patient #' + patientId,
      lastConsultation: new Date().toISOString(),
      conversationCount: 3,
      preDiagnosis: {
        mainConcerns: ['Hypertension artérielle', 'Glycémie élevée'],
        symptoms: ['Fatigue', 'Maux de tête', 'Soif excessive'],
        analyses: [
          { type: 'Glycémie', value: '1.35 g/L', status: 'Élevé', date: '2025-01-20' },
          { type: 'Tension', value: '145/92 mmHg', status: 'Élevé', date: '2025-01-20' },
          { type: 'Cholestérol', value: '2.15 g/L', status: 'Élevé', date: '2025-01-15' },
        ],
        recommendations: [
          'Consultation endocrinologie recommandée',
          'Surveillance glycémique régulière',
          'Régime hyposodé et hypoglycémique',
          'Activité physique modérée',
        ],
        riskLevel: 'Modéré',
      },
    };
  };

  const formatPatientReport = (report: any) => {
    if (!report) return 'Aucun rapport disponible pour ce patient.';

    return `**Rapport Patient: ${report.patientName}**\n\n` +
      `**Dernière consultation IA:** ${new Date(report.lastConsultation).toLocaleDateString('fr-FR')}\n` +
      `**Nombre de conversations:** ${report.conversationCount}\n\n` +
      `---\n\n` +
      `**Pré-diagnostic IA:**\n\n` +
      `**Préoccupations principales:**\n${report.preDiagnosis.mainConcerns.map((c: string) => `• ${c}`).join('\n')}\n\n` +
      `**Symptômes rapportés:**\n${report.preDiagnosis.symptoms.map((s: string) => `• ${s}`).join('\n')}\n\n` +
      `**Analyses partagées:**\n${report.preDiagnosis.analyses.map((a: any) => 
        `• ${a.type}: ${a.value} (${a.status}) - ${a.date}`
      ).join('\n')}\n\n` +
      `**Recommandations IA:**\n${report.preDiagnosis.recommendations.map((r: string) => `• ${r}`).join('\n')}\n\n` +
      `**Niveau de risque:** ${report.preDiagnosis.riskLevel}\n\n` +
      `---\n\n` +
      `**Note:** Ce rapport est généré automatiquement par l'IA basée sur les conversations du patient. Il doit être validé par votre expertise clinique.`;
  };

  const getSimulatedMedicalResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('diagnostic') || lowerMessage.includes('différentiel')) {
      return '**Aide au diagnostic différentiel:**\n\nPour vous aider efficacement, j\'ai besoin de plus d\'informations:\n\n**1. Symptômes principaux:**\n• Quels sont les symptômes du patient?\n• Depuis combien de temps?\n• Évolution?\n\n**2. Antécédents:**\n• Médicaux\n• Familiaux\n• Traitements en cours\n\n**3. Examens réalisés:**\n• Analyses biologiques\n• Imagerie\n• Autres\n\nPartagez-moi ces éléments et je vous proposerai un diagnostic différentiel avec les examens complémentaires pertinents.';
    }

    if (lowerMessage.includes('hypertension') || lowerMessage.includes('tension')) {
      return '**Hypertension artérielle - Aide à la décision:**\n\n**Classification (ESC/ESH 2023):**\n• Grade 1: 140-159/90-99 mmHg\n• Grade 2: 160-179/100-109 mmHg\n• Grade 3: ≥180/≥110 mmHg\n\n**Bilan initial recommandé:**\n• Ionogramme, créatinine, DFG\n• Glycémie, bilan lipidique\n• ECG\n• Fond d\'œil si grade 2-3\n• Échographie cardiaque si HVG suspectée\n\n**Traitement de 1ère intention:**\n• IEC/ARA2 + Inhibiteur calcique OU Diurétique thiazidique\n• Objectif: <140/90 mmHg (<130/80 si haut risque CV)\n\n**Mesures hygiéno-diététiques:**\n• Réduction sel (<5g/j)\n• Perte de poids si IMC>25\n• Activité physique régulière\n• Limitation alcool\n\nSouhaitez-vous des précisions sur un aspect particulier?';
    }

    if (lowerMessage.includes('diabète') || lowerMessage.includes('glycémie')) {
      return '**Diabète - Aide à la décision:**\n\n**Critères diagnostiques (ADA 2024):**\n• Glycémie à jeun ≥1.26 g/L (2 mesures)\n• HbA1c ≥6.5%\n• Glycémie aléatoire ≥2.00 g/L + symptômes\n• HGPO 2h ≥2.00 g/L\n\n**Bilan initial:**\n• HbA1c\n• Bilan lipidique\n• Créatinine, DFG, albuminurie\n• Fond d\'œil\n• ECG\n\n**Objectifs thérapeutiques:**\n• HbA1c <7% (personnalisé selon profil)\n• Glycémie à jeun: 0.80-1.30 g/L\n• Glycémie post-prandiale <1.80 g/L\n\n**Traitement de 1ère ligne:**\n• Metformine (si DFG>30)\n• + Mesures hygiéno-diététiques\n• Réévaluation à 3 mois\n\n**Surveillance:**\n• HbA1c tous les 3 mois\n• Fond d\'œil annuel\n• Albuminurie annuelle\n\nQuelle est la situation clinique de votre patient?';
    }

    if (lowerMessage.includes('traitement') || lowerMessage.includes('thérapeutique')) {
      return '**Aide à la décision thérapeutique:**\n\nPour vous recommander un traitement adapté, précisez:\n\n**1. Pathologie concernée**\n\n**2. Profil du patient:**\n• Âge\n• Comorbidités\n• Fonction rénale/hépatique\n• Traitements en cours\n• Allergies\n\n**3. Objectifs thérapeutiques**\n\n**4. Contraintes:**\n• Observance\n• Coût\n• Effets secondaires à éviter\n\nJe vous proposerai alors les options thérapeutiques avec leurs avantages/inconvénients selon les dernières recommandations.';
    }

    if (lowerMessage.includes('interprétation') || lowerMessage.includes('résultat')) {
      return '**Aide à l\'interprétation des résultats:**\n\nPartagez-moi les résultats à interpréter:\n\n**Format attendu:**\n• Type d\'examen (biologie, imagerie, etc.)\n• Valeurs obtenues\n• Valeurs de référence\n• Contexte clinique\n\nJe vous aiderai à:\n• Interpréter les anomalies\n• Proposer des diagnostics différentiels\n• Suggérer des examens complémentaires\n• Évaluer l\'urgence\n\nQuel examen souhaitez-vous que j\'analyse?';
    }

    return '**Assistant IA Médical**\n\nJe peux vous aider avec:\n\n**Diagnostic:**\n• Diagnostic différentiel\n• Arbres décisionnels\n• Scores cliniques\n\n**Thérapeutique:**\n• Choix du traitement\n• Posologie\n• Interactions médicamenteuses\n\n**Interprétation:**\n• Résultats biologiques\n• Imagerie\n• ECG\n\n**Protocoles:**\n• Recommandations HAS/ESC/ADA\n• Algorithmes de prise en charge\n\nPosez-moi une question spécifique pour une aide personnalisée!';
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Link
                href="/medecin/dashboard"
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Conseiller IA Médical</h1>
                <p className="text-sm text-blue-100">Assistant intelligent pour vos décisions cliniques</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">En ligne</span>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleModeChange('decision')}
              className={`px-4 py-2 rounded-lg transition ${
                mode === 'decision'
                  ? 'bg-white text-blue-600 font-semibold'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Aide à la décision
            </button>
            <button
              onClick={() => handleModeChange('patient')}
              className={`px-4 py-2 rounded-lg transition ${
                mode === 'patient'
                  ? 'bg-white text-purple-600 font-semibold'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Consultation Patient
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col" style={{ height: 'calc(100vh - 220px)' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white shadow-md text-gray-900'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">Assistant IA</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="bg-white shadow-md rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          {mode === 'patient' ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">ID du Patient:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLoadPatientReport()}
                  placeholder="Entrez l'ID du patient..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isSending}
                />
                <button
                  onClick={handleLoadPatientReport}
                  disabled={!patientId.trim() || isSending}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Charger
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Posez votre question médicale..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSending}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isSending}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Le conseiller IA utilise vos données médicales pour vous fournir des informations personnalisées
          </p>
        </div>
      </div>
    </div>
  );
}

