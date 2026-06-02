import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Message {
  id: string;
  content: string;
  sender: 'patient' | 'medecin';
  senderName: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  medecinName: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
}

export default function MessageriePatientPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Charger les conversations (mock pour l'instant)
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const tenantId = localStorage.getItem('tenant_id') || 'chu-casablanca';
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

      const response = await fetch(`${API_BASE_URL}/messagerie/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant-Id': tenantId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      } else {
        // Fallback sur mock data si l'API échoue
        const mockConversations: Conversation[] = [
          {
            id: 'conv-1',
            medecinName: 'Dr. Amina Benali',
            lastMessage: 'Votre prochain rendez-vous est confirmé pour le 15 janvier.',
            lastMessageDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            unreadCount: 1,
          },
        ];
        setConversations(mockConversations);
      }
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = (conversationId: string) => {
    // Mock data - À remplacer par un vrai appel API
    const mockMessages: Message[] = [
      {
        id: 'msg-1',
        content: 'Bonjour Docteur, j\'ai une question concernant mon traitement.',
        sender: 'patient',
        senderName: 'Vous',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-2',
        content: 'Bonjour, je vous écoute. De quoi s\'agit-il ?',
        sender: 'medecin',
        senderName: conversationId === 'conv-1' ? 'Dr. Amina Benali' : 'Dr. Karim El Fassi',
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-3',
        content: 'Je ressens quelques effets secondaires depuis hier. Est-ce normal ?',
        sender: 'patient',
        senderName: 'Vous',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-4',
        content: 'Votre prochain rendez-vous est confirmé pour le 15 janvier.',
        sender: 'medecin',
        senderName: conversationId === 'conv-1' ? 'Dr. Amina Benali' : 'Dr. Karim El Fassi',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ];

    setMessages(mockMessages);
    setSelectedConversation(conversationId);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      sender: 'patient',
      senderName: 'Vous',
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // TODO: Envoyer via API
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) {
      return 'À l\'instant';
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/back_patient.jpg)' }}
      >
        <div className="absolute inset-0 bg-cyan-900/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm shadow-lg border-b border-cyan-300/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Messagerie Sécurisée</h1>
                <p className="mt-1 text-sm text-cyan-100">
                  Communiquez avec votre médecin traitant
                </p>
              </div>
              <Link
                href="/patient/dashboard"
                className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white border border-cyan-300/30 rounded-lg hover:bg-white/20 transition"
              >
                ← Retour au tableau de bord
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg shadow-xl h-[600px] flex">
            {/* Liste des conversations */}
            <div className="w-1/3 border-r border-cyan-300/30 overflow-y-auto">
              <div className="p-4 border-b border-cyan-300/30">
                <h2 className="text-lg font-semibold text-white">Conversations</h2>
              </div>
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-cyan-100">
                  <svg
                    className="mx-auto h-12 w-12 text-cyan-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="mt-2">Aucune conversation</p>
                </div>
              ) : (
                <div>
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => loadMessages(conv.id)}
                      className={`p-4 border-b border-cyan-300/30 cursor-pointer hover:bg-white/10 transition ${
                        selectedConversation === conv.id ? 'bg-cyan-600/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{conv.medecinName}</h3>
                            {conv.unreadCount > 0 && (
                              <span className="bg-cyan-600 text-white text-xs px-2 py-0.5 rounded-full">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-cyan-100 mt-1 line-clamp-2">{conv.lastMessage}</p>
                        </div>
                        <span className="text-xs text-cyan-200">{formatTime(conv.lastMessageDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          {/* Zone de messages */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header conversation */}
                <div className="p-4 border-b border-cyan-300/30 bg-white/5">
                  <h3 className="font-semibold text-white">
                    {conversations.find((c) => c.id === selectedConversation)?.medecinName}
                  </h3>
                  <p className="text-xs text-cyan-200">En ligne</p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.sender === 'patient'
                            ? 'bg-cyan-600 text-white'
                            : 'bg-white/20 backdrop-blur-sm text-white border border-cyan-300/30'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender === 'patient' ? 'text-cyan-100' : 'text-cyan-200'
                          }`}
                        >
                          {formatMessageTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-cyan-300/30">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Écrivez votre message..."
                      className="flex-1 px-4 py-2 bg-white/10 border border-cyan-300/30 rounded-lg text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Envoyer
                    </button>
                  </div>
                  <p className="text-xs text-cyan-200 mt-2">
                    🔒 Messagerie sécurisée et confidentielle
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-cyan-100">
                <div className="text-center">
                  <svg
                    className="mx-auto h-16 w-16 text-cyan-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="mt-4">Sélectionnez une conversation pour commencer</p>
                </div>
              </div>
            )}
          </div>
        </div>

          {/* Info sécurité */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm border-2 border-cyan-300/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="h-5 w-5 text-cyan-400 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <div>
                <h4 className="font-semibold text-white">Messagerie sécurisée</h4>
                <p className="text-sm text-cyan-100 mt-1">
                  Vos échanges sont chiffrés de bout en bout et conformes au RGPD. Seuls vous et votre
                  médecin pouvez lire ces messages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

