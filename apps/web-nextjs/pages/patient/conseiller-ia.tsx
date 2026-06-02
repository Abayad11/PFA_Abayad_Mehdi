import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ConseillerIAPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
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
        content: 'Bonjour! Je suis votre conseiller IA médical personnel.\n\nJe suis là pour:\n• Discuter de votre état de santé\n• Analyser vos résultats d\'examens\n• Expliquer vos analyses et échographies\n• Vous conseiller sur les prochaines étapes\n\n**Partagez-moi vos résultats d\'analyses ou échographies, et je vous aiderai à les comprendre!**\n\nComment vous sentez-vous aujourd\'hui?',
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

      // Appel API au conseiller IA
      const response = await fetch(`${API_BASE_URL}/chat/assistant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant-Id': tenantId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: 'medical_advisor',
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
        // Fallback: réponse simulée
        const simulatedResponse = getSimulatedResponse(inputMessage);
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
      // Réponse simulée en cas d'erreur
      const simulatedResponse = getSimulatedResponse(inputMessage);
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

  const getSimulatedResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Réponses sur l'état de santé général
    if (lowerMessage.includes('comment') && (lowerMessage.includes('sens') || lowerMessage.includes('va'))) {
      return 'Je suis content de prendre de vos nouvelles!\n\nPour mieux vous conseiller, pouvez-vous me dire:\n\n• Avez-vous des symptômes particuliers?\n• Avez-vous fait des analyses récemment?\n• Y a-t-il quelque chose qui vous préoccupe?\n\nN\'hésitez pas à partager vos résultats d\'examens, je peux vous aider à les comprendre.';
    }

    // Analyse de résultats
    if (lowerMessage.includes('analyse') || lowerMessage.includes('résultat') || lowerMessage.includes('bilan') || lowerMessage.includes('examen')) {
      return 'Excellent! Je peux vous aider à comprendre vos résultats d\'analyses.\n\n**Pour une analyse précise, partagez-moi:**\n\n**Type d\'examen:**\n   - Prise de sang (glycémie, cholestérol, etc.)\n   - Radiographie\n   - Échographie\n   - Scanner/IRM\n   - Autre\n\n**Les valeurs obtenues:**\n   Par exemple: "Glycémie: 1.2 g/L"\n\n**Les valeurs de référence** (si indiquées)\n\nJe vous expliquerai ce que signifient ces résultats et ce qu\'il faut surveiller!';
    }

    // Échographie
    if (lowerMessage.includes('échographie') || lowerMessage.includes('echographie') || lowerMessage.includes('écho')) {
      return 'Les échographies sont très utiles pour visualiser les organes!\n\n**Partagez-moi les informations de votre échographie:**\n\n• Quelle partie du corps? (abdomen, thyroïde, cardiaque, etc.)\n• Quelles sont les observations notées?\n• Y a-t-il des mesures spécifiques?\n• Le compte-rendu mentionne-t-il des anomalies?\n\nJe vous aiderai à comprendre ce que cela signifie et si des actions sont nécessaires.';
    }

    // Symptômes et conseils
    if (lowerMessage.includes('douleur') || lowerMessage.includes('mal') || lowerMessage.includes('symptôme')) {
      return 'Je comprends que vous avez des symptômes.\n\n**Pour vous conseiller au mieux, dites-moi:**\n\n• Où se situe la douleur/gêne?\n• Depuis combien de temps?\n• Est-ce constant ou par moments?\n• Y a-t-il d\'autres symptômes associés?\n\n**Important:** Si la douleur est intense ou s\'aggrave rapidement, consultez immédiatement un médecin ou les urgences.\n\nJe peux vous donner des conseils généraux, mais seul un médecin peut établir un diagnostic précis.';
    }

    // Glycémie / Diabète
    if (lowerMessage.includes('glycémie') || lowerMessage.includes('diabète') || lowerMessage.includes('sucre')) {
      return '**Analyse de la glycémie:**\n\n**Valeurs de référence (à jeun):**\n• Normal: 0.70 - 1.10 g/L\n• Pré-diabète: 1.10 - 1.26 g/L\n• Diabète: ≥ 1.26 g/L\n\n**Quelle est votre valeur?** Partagez-moi votre résultat et je vous expliquerai ce qu\'il signifie.\n\n**Conseils généraux:**\n• Mesurer à jeun (8h sans manger)\n• Éviter les aliments sucrés la veille\n• Bien s\'hydrater';
    }

    // Cholestérol
    if (lowerMessage.includes('cholestérol') || lowerMessage.includes('lipide')) {
      return '**Analyse du cholestérol:**\n\n**Valeurs de référence:**\n• Cholestérol total: < 2.00 g/L\n• LDL (mauvais): < 1.60 g/L\n• HDL (bon): > 0.40 g/L (homme), > 0.50 g/L (femme)\n• Triglycérides: < 1.50 g/L\n\n**Partagez-moi vos valeurs** et je vous dirai si elles sont dans les normes.\n\n**Pour améliorer votre profil lipidique:**\n• Alimentation équilibrée (moins de graisses saturées)\n• Activité physique régulière\n• Limiter l\'alcool';
    }

    // Tension artérielle
    if (lowerMessage.includes('tension') || lowerMessage.includes('pression') || lowerMessage.includes('hypertension')) {
      return '**Tension artérielle:**\n\n**Valeurs normales:**\n• Systolique (max): 120-129 mmHg\n• Diastolique (min): 80-84 mmHg\n\n**Hypertension si:**\n• Systolique ≥ 140 mmHg\n• Diastolique ≥ 90 mmHg\n\n**Quelle est votre tension?** (ex: 130/85)\n\n**Conseils pour une tension saine:**\n• Réduire le sel\n• Gérer le stress\n• Faire de l\'exercice\n• Maintenir un poids santé';
    }

    // Conseils généraux
    if (lowerMessage.includes('que faire') || lowerMessage.includes('conseil') || lowerMessage.includes('recommandation')) {
      return '**Mes conseils dépendent de votre situation!**\n\nPour vous donner des recommandations personnalisées:\n\n1️⃣ **Partagez-moi vos résultats d\'examens**\n   (analyses de sang, échographies, etc.)\n\n2️⃣ **Décrivez vos symptômes** si vous en avez\n\n3️⃣ **Mentionnez vos antécédents** si pertinent\n\nJe pourrai alors vous conseiller sur:\n• Les valeurs à surveiller\n• Les habitudes à adopter\n• Quand consulter un médecin\n• Les examens complémentaires éventuels';
    }

    // Réponse par défaut - encourager à partager des infos
    return 'Je suis là pour vous écouter et vous conseiller!\n\n**Comment puis-je vous aider?**\n\nVous pouvez me parler de:\n• Vos résultats d\'analyses ou d\'échographies\n• Vos symptômes ou préoccupations\n• Des questions sur votre santé\n\n**Astuce:** Plus vous me donnez de détails (valeurs, dates, symptômes), plus je pourrai vous donner des conseils précis!\n\nN\'hésitez pas, je suis là pour vous aider à comprendre votre état de santé.';
  };

  const quickActions = [
    { label: 'J\'ai des résultats d\'analyses à partager', icon: '' },
    { label: 'J\'ai fait une échographie', icon: '' },
    { label: 'J\'ai des symptômes', icon: '' },
    { label: 'Questions sur ma glycémie/cholestérol', icon: '' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/back_patient.jpg)' }}
        >
          <div className="absolute inset-0 bg-cyan-900/40"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-4 text-white font-semibold">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/back_patient.jpg)' }}
      >
        <div className="absolute inset-0 bg-cyan-900/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm shadow-lg border-b border-cyan-300/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Link
                  href="/patient/dashboard"
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-white">Conseiller IA Médical</h1>
                  <p className="text-sm text-cyan-100">Assistant intelligent pour votre santé</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white">En ligne</span>
              </div>
            </div>
          </div>
        </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
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
                    ? 'bg-cyan-600 text-white'
                    : 'bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 text-white shadow-xl'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 bg-cyan-500 rounded-full flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-cyan-200">Conseiller IA</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-cyan-100' : 'text-cyan-200'
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
              <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg p-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="px-4 pb-4">
            <p className="text-sm text-cyan-200 mb-2">Actions rapides:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => setInputMessage(action.label)}
                  className="p-3 bg-white/10 backdrop-blur-sm border border-cyan-300/30 rounded-lg shadow-xl hover:bg-white/20 transition text-left"
                >
                  <span className="mr-2">{action.icon}</span>
                  <span className="text-sm font-medium text-white">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="bg-white/10 backdrop-blur-sm border-t border-cyan-300/30 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Posez votre question..."
              className="flex-1 px-4 py-3 bg-white/10 border border-cyan-300/30 rounded-lg text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              disabled={isSending}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isSending}
              className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-cyan-200 mt-2">
            Le conseiller IA utilise vos données médicales pour vous fournir des informations personnalisées
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

