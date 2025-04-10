import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Loader2, 
  Bot, 
  RefreshCw, 
  Download, 
  Trash2, 
  ChevronDown, 
  Zap, 
  FileText, 
  Code, 
  Search, 
  Smile, 
  Calendar, 
  BarChart2, 
  X,
  PanelLeft,
  Clipboard,
  Check,
  AlertCircle
} from 'lucide-react';
import { auth } from '../../config/firebase';
import { useAuthStore } from '../../store/authStore';
import { 
  getMessages, 
  getChatSessions, 
  createMessage, 
  createChatSession,
  updateChatSession,
  deleteChatSession,
  ChatMessage,
  ChatSession as ChatSessionType
} from '../../services/chatService';
import { getAIResponse } from '../../services/aiService';
import { Timestamp, serverTimestamp } from 'firebase/firestore';

type MessageState = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isLoading?: boolean;
};

type SuggestionCategory = {
  id: string;
  name: string;
  icon: React.ElementType;
  suggestions: string[];
};

export const AIChat = () => {
  const { user } = useAuthStore();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<MessageState[]>([
    {
      id: '1',
      text: "Bonjour ! Je suis l'assistant IA d'OYA. Je peux vous aider avec la gestion des intérimaires, la création de missions, les questions juridiques, et bien plus encore. Comment puis-je vous aider aujourd'hui ?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string>('current');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSessionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Suggestions prédéfinies par catégorie
  const suggestionCategories: SuggestionCategory[] = [
    {
      id: 'general',
      name: 'Général',
      icon: Zap,
      suggestions: [
        "Comment puis-je optimiser le recrutement d'intérimaires ?",
        "Quelles sont les meilleures pratiques pour la gestion des missions ?",
        "Comment réduire le taux d'absentéisme des intérimaires ?",
        "Quel est le processus pour ajouter un nouvel intérimaire ?"
      ]
    },
    {
      id: 'legal',
      name: 'Juridique',
      icon: FileText,
      suggestions: [
        "Quelles sont les obligations légales pour l'embauche d'intérimaires ?",
        "Comment rédiger un contrat de mission conforme à la législation ?",
        "Quels documents sont obligatoires pour un intérimaire ?",
        "Quelles sont les règles de temps de travail pour les intérimaires ?"
      ]
    },
    {
      id: 'tech',
      name: 'Technique',
      icon: Code,
      suggestions: [
        "Comment exporter les données des missions au format CSV ?",
        "Comment configurer les notifications automatiques ?",
        "Comment générer un rapport personnalisé ?",
        "Comment synchroniser les données avec notre SIRH ?"
      ]
    }
  ];
  
  // Charger les sessions de chat de l'utilisateur
  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          setLoading(true);
          setError(null);
          
          // Charger les sessions de chat de l'utilisateur
          const sessions = await getChatSessions();
          
          if (sessions.length > 0) {
            // Convertir les Timestamps Firestore en Date
            const formattedSessions = sessions.map(session => ({
              ...session,
              date: session.date instanceof Timestamp ? session.date.toDate() : session.date,
              lastUpdated: session.lastUpdated instanceof Timestamp 
                ? session.lastUpdated.toDate() 
                : session.lastUpdated
            }));
            
            setChatSessions(formattedSessions);
            
            // Initialiser avec une session active
            if (!activeChatId || activeChatId === 'current') {
              setActiveChatId(formattedSessions[0].id || 'current');
              
              // Charger les messages de cette session
              await loadMessages(formattedSessions[0].id || 'current');
            }
          } else {
            // Créer une nouvelle session si aucune n'existe
            const newSession = await createChatSession({
              title: 'Nouvelle conversation',
              preview: "Bonjour ! Je suis l'assistant IA d'OYA...",
              date: new Date(),
              userId: user.uid,
              lastUpdated: new Date()
            });
            
            setChatSessions([{
              ...newSession,
              date: newSession.date instanceof Timestamp ? newSession.date.toDate() : new Date(),
              lastUpdated: newSession.lastUpdated instanceof Timestamp 
                ? newSession.lastUpdated.toDate() 
                : new Date()
            }]);
            
            setActiveChatId(newSession.id || 'current');
            
            // Sauvegarder le message de bienvenue
            await createMessage({
              text: "Bonjour ! Je suis l'assistant IA d'OYA. Je peux vous aider avec la gestion des intérimaires, la création de missions, les questions juridiques, et bien plus encore. Comment puis-je vous aider aujourd'hui ?",
              sender: 'ai',
              timestamp: new Date(),
              userId: user.uid,
              sessionId: newSession.id || 'current'
            });
          }
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger les conversations. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  // Charger les messages d'une session spécifique
  const loadMessages = async (sessionId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedMessages = await getMessages(sessionId);
      
      if (fetchedMessages.length > 0) {
        // Convertir les Timestamps Firestore en Date
        const formattedMessages = fetchedMessages.map(msg => ({
          id: msg.id || Date.now().toString(),
          text: msg.text,
          sender: msg.sender,
          timestamp: msg.timestamp instanceof Timestamp ? msg.timestamp.toDate() : new Date(msg.timestamp as Date),
          isLoading: false
        }));
        
        setMessages(formattedMessages);
      } else {
        // Si pas de messages, réinitialiser avec un message de bienvenue
        setMessages([{
          id: '1',
          text: "Bonjour ! Je suis l'assistant IA d'OYA. Je peux vous aider avec la gestion des intérimaires, la création de missions, les questions juridiques, et bien plus encore. Comment puis-je vous aider aujourd'hui ?",
          sender: 'ai',
          timestamp: new Date()
        }]);
        
        // Sauvegarder ce message dans Firestore
        if (user) {
          await createMessage({
            text: "Bonjour ! Je suis l'assistant IA d'OYA. Je peux vous aider avec la gestion des intérimaires, la création de missions, les questions juridiques, et bien plus encore. Comment puis-je vous aider aujourd'hui ?",
            sender: 'ai',
            timestamp: new Date(),
            userId: user.uid,
            sessionId: sessionId
          });
        }
      }
    } catch (err) {
      console.error('Erreur lors du chargement des messages:', err);
      setError('Impossible de charger les messages. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  // Faire défiler jusqu'au dernier message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !user) return;

    try {
      // Créer un message utilisateur
      const userMessageData: MessageState = {
        id: Date.now().toString(),
        text: query,
        sender: 'user',
        timestamp: new Date()
      };

      // Ajouter le message de l'utilisateur dans l'état local
      setMessages(prev => [...prev, userMessageData]);
      setQuery('');
      setIsProcessing(true);

      // Réinitialiser la hauteur du textarea
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }

      // Mettre à jour le titre de la session active
      if (activeChatId !== 'current') {
        await updateChatSession(activeChatId, {
          title: truncateText(query, 30),
          preview: truncateText(query, 40),
          lastUpdated: new Date()
        });
        
        // Mettre à jour l'état local des sessions
        setChatSessions(prev => prev.map(session => 
          session.id === activeChatId 
            ? { 
                ...session, 
                title: truncateText(query, 30), 
                preview: truncateText(query, 40),
                lastUpdated: new Date()
              } 
            : session
        ));
      }

      // Sauvegarder le message utilisateur dans Firestore
      await createMessage({
        text: query,
        sender: 'user',
        timestamp: new Date(),
        userId: user.uid,
        sessionId: activeChatId
      });

      // Ajouter un message "en attente" de l'IA
      const loadingMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: loadingMessageId,
        text: '',
        sender: 'ai',
        timestamp: new Date(),
        isLoading: true
      }]);

      // Obtenir la réponse de l'IA
      const aiResponse = await getAIResponse({
        prompt: query,
        userId: user.uid,
        context: messages.map(msg => `${msg.sender}: ${msg.text}`).slice(-5) // Utiliser les 5 derniers messages comme contexte
      });
      
      // Remplacer le message "en attente" par la réponse réelle
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessageId ? {
          ...msg,
          text: aiResponse,
          isLoading: false
        } : msg
      ));
      
      // Sauvegarder la réponse de l'IA dans Firestore
      await createMessage({
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        userId: user.uid,
        sessionId: activeChatId
      });
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      setError('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
      
      // Supprimer le message "en attente" en cas d'erreur
      setMessages(prev => prev.filter(msg => !msg.isLoading));
    } finally {
      setIsProcessing(false);
    }
  };

  const clearConversation = async () => {
    try {
      if (!user) return;
      
      // Vérifier si c'est une session existante
      if (activeChatId !== 'current' && activeChatId) {
        // Supprimer la session et ses messages
        await deleteChatSession(activeChatId);
        
        // Créer une nouvelle session
        const newSession = await createChatSession({
          title: 'Nouvelle conversation',
          preview: "Bonjour ! Je suis l'assistant IA d'OYA...",
          date: new Date(),
          userId: user.uid,
          lastUpdated: new Date()
        });
        
        // Mettre à jour l'état local
        setChatSessions(prev => {
          const newSessionFormatted = {
            ...newSession,
            date: newSession.date instanceof Timestamp ? newSession.date.toDate() : new Date(),
            lastUpdated: newSession.lastUpdated instanceof Timestamp 
              ? newSession.lastUpdated.toDate() 
              : new Date()
          };
          
          return [newSessionFormatted, ...prev.filter(s => s.id !== activeChatId)];
        });
        
        setActiveChatId(newSession.id || 'current');
        
        // Message de bienvenue pour la nouvelle session
        const welcomeMessage = {
          id: Date.now().toString(),
          text: "Bonjour ! Je suis l'assistant IA d'OYA. Je peux vous aider avec la gestion des intérimaires, la création de missions, les questions juridiques, et bien plus encore. Comment puis-je vous aider aujourd'hui ?",
          sender: 'ai' as const,
          timestamp: new Date()
        };
        
        setMessages([welcomeMessage]);
        
        // Sauvegarder le message dans Firestore
        await createMessage({
          text: welcomeMessage.text,
          sender: welcomeMessage.sender,
          timestamp: welcomeMessage.timestamp,
          userId: user.uid,
          sessionId: newSession.id || 'current'
        });
      } else {
        // Réinitialiser les messages locaux
        setMessages([{
          id: Date.now().toString(),
          text: "Bonjour ! Je suis l'assistant IA d'OYA. Je peux vous aider avec la gestion des intérimaires, la création de missions, les questions juridiques, et bien plus encore. Comment puis-je vous aider aujourd'hui ?",
          sender: 'ai',
          timestamp: new Date()
        }]);
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de la conversation:', err);
      setError('Une erreur est survenue lors de la suppression de la conversation. Veuillez réessayer.');
    }
  };

  const downloadConversation = () => {
    // Formater la conversation
    const formattedConversation = messages
      .filter(msg => !msg.isLoading)
      .map(msg => `${msg.sender === 'user' ? 'Vous' : 'Assistant'} (${formatDateTime(msg.timestamp)}):\n${msg.text}`)
      .join('\n\n');
    
    // Créer un blob et télécharger
    const blob = new Blob([formattedConversation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Utiliser le titre de la session active comme nom de fichier
    const activeSession = chatSessions.find(session => session.id === activeChatId);
    const fileName = activeSession 
      ? `OYA-Chat-${activeSession.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.txt`
      : `OYA-Chat-${new Date().toISOString().slice(0, 10)}.txt`;
    
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const regenerateResponse = async () => {
    if (messages.length < 2 || !user) return;
    
    try {
      // Trouver le dernier message de l'IA
      const lastAiMessageIndex = [...messages].reverse().findIndex(msg => msg.sender === 'ai');
      if (lastAiMessageIndex >= 0) {
        const actualIndex = messages.length - 1 - lastAiMessageIndex;
        
        // Supprimer le dernier message de l'IA pour l'interface
        setMessages(prev => [...prev.slice(0, actualIndex), {
          id: Date.now().toString(),
          text: '',
          sender: 'ai',
          timestamp: new Date(),
          isLoading: true
        }]);
        
        setIsProcessing(true);
        
        // Trouver le dernier message de l'utilisateur
        const lastUserMessage = [...messages].reverse().find(msg => msg.sender === 'user');
        
        if (!lastUserMessage) {
          throw new Error('Aucun message utilisateur trouvé pour régénérer une réponse');
        }
        
        // Obtenir une nouvelle réponse de l'IA
        const aiResponse = await getAIResponse({
          prompt: lastUserMessage.text + " (merci de reformuler)",
          userId: user.uid,
          context: messages.map(msg => `${msg.sender}: ${msg.text}`).slice(-5)
        });
        
        // Mettre à jour l'interface
        setMessages(prev => [...prev.slice(0, prev.length - 1), {
          id: Date.now().toString(),
          text: aiResponse,
          sender: 'ai',
          timestamp: new Date()
        }]);
        
        // Sauvegarder la nouvelle réponse dans Firestore
        await createMessage({
          text: aiResponse,
          sender: 'ai',
          timestamp: new Date(),
          userId: user.uid,
          sessionId: activeChatId
        });
      }
    } catch (err) {
      console.error('Erreur lors de la régénération de la réponse:', err);
      setError('Une erreur est survenue lors de la régénération de la réponse. Veuillez réessayer.');
      
      // Supprimer le message "en attente" en cas d'erreur
      setMessages(prev => prev.filter(msg => !msg.isLoading));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChatSessionClick = async (sessionId: string) => {
    try {
      if (sessionId === activeChatId) return;
      
      setActiveChatId(sessionId);
      setLoading(true);
      
      // Charger les messages de cette session
      await loadMessages(sessionId);
    } catch (err) {
      console.error('Erreur lors du changement de session:', err);
      setError('Une erreur est survenue lors du chargement de la conversation. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const copyToClipboard = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    });
  };

  // Formater la date et l'heure
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatChatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier";
    } else {
      return date.toLocaleDateString([], { 
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Affichage pour l'état de chargement initial
  if (loading && messages.length <= 1 && chatSessions.length === 0) {
    return (
      <div className="h-[calc(100vh-6rem)] flex items-center justify-center bg-gray-900 rounded-xl border border-gray-700">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 text-primary-500 animate-spin mx-auto" />
          <p className="text-gray-300">Chargement de vos conversations...</p>
        </div>
      </div>
    );
  }

  // Affichage pour l'état d'erreur
  if (error && !loading && messages.length <= 1 && chatSessions.length === 0) {
    return (
      <div className="h-[calc(100vh-6rem)] flex items-center justify-center bg-gray-900 rounded-xl border border-gray-700">
        <div className="text-center space-y-4 p-6 max-w-md">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
          <h3 className="text-lg font-semibold text-white">Une erreur est survenue</h3>
          <p className="text-gray-300">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] overflow-hidden rounded-xl border border-gray-700 bg-gray-900 text-white">
      {/* Sidebar/Historique */}
      <div 
        className={`flex flex-col transition-all duration-300 border-r border-gray-700 bg-gray-800/50 ${
          showSidebar ? 'w-80' : 'w-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="font-semibold text-lg">Historique</h2>
          <button 
            onClick={() => setShowSidebar(false)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
          {loading && chatSessions.length === 0 ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
            </div>
          ) : chatSessions.length > 0 ? (
            chatSessions.map(session => {
              // S'assurer que date est toujours un objet Date
              const sessionDate = session.date instanceof Date 
                ? session.date 
                : (session.date instanceof Timestamp 
                  ? session.date.toDate() 
                  : new Date());
              
              return (
                <button
                  key={session.id}
                  onClick={() => handleChatSessionClick(session.id || 'current')}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    activeChatId === session.id
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                      : 'hover:bg-gray-700/50 text-gray-300 border border-transparent'
                  }`}
                >
                  <div className="font-medium">{session.title}</div>
                  <div className="text-xs mt-1 flex justify-between items-center">
                    <span className={`${activeChatId === session.id ? 'text-primary-300/70' : 'text-gray-500'}`}>
                      {formatChatDate(sessionDate)}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      activeChatId === session.id ? 'bg-primary-500/20' : 'bg-gray-700'
                    }`}>
                      {session.id === activeChatId ? 'Actuel' : ''}
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center p-4 text-gray-400 text-sm">
              Aucune conversation trouvée
            </div>
          )}
        </div>

        <div className="p-3 border-t border-gray-700">
          <button 
            onClick={clearConversation}
            className="flex items-center w-full p-2 text-sm rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span>Nouvelle conversation</span>
          </button>
        </div>
      </div>
      
      {/* Zone principale de chat */}
      <div className="flex-1 flex flex-col relative">
        {/* En-tête du chat */}
        <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/30 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {!showSidebar && (
              <button
                onClick={() => setShowSidebar(true)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors mr-2"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            )}
            <div className="flex items-center">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg mr-3">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-white">Assistant OYA</h2>
                <p className="text-xs text-gray-400">Propulsé par IA</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <button 
              onClick={regenerateResponse} 
              disabled={isProcessing || messages.length < 2}
              className="p-2 text-gray-400 hover:text-primary-400 hover:bg-gray-700/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Régénérer la dernière réponse"
              title="Régénérer la dernière réponse"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button 
              onClick={downloadConversation}
              className="p-2 text-gray-400 hover:text-primary-400 hover:bg-gray-700/50 rounded-lg transition-colors"
              aria-label="Télécharger la conversation"
              title="Télécharger la conversation"
            >
              <Download className="h-4 w-4" />
            </button>
            <button 
              onClick={clearConversation}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700/50 rounded-lg transition-colors"
              aria-label="Nouvelle conversation"
              title="Nouvelle conversation"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Afficher l'erreur s'il y en a une */}
        {error && (
          <div className="bg-red-500/10 border border-red-400/20 m-4 p-3 rounded-lg flex items-center text-sm">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
            <p className="text-red-300">{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="ml-auto text-red-400 hover:text-red-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="p-6 bg-gray-800/20">
            <h3 className="text-lg font-medium text-white mb-4">Suggestions pour démarrer</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suggestionCategories.map(category => (
                <div key={category.id} className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                  <div className="flex items-center space-x-3 p-3 border-b border-gray-700">
                    <div className="p-1.5 rounded-lg bg-gray-700 text-primary-400">
                      <category.icon className="h-4 w-4" />
                    </div>
                    <h4 className="font-medium text-gray-300">{category.name}</h4>
                  </div>
                  <div className="p-2">
                    {category.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left p-2 rounded-lg hover:bg-gray-700/50 text-sm text-gray-300 transition-colors mb-1 last:mb-0"
                      >
                        {truncateText(suggestion, 60)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Zone des messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" aria-live="polite">
          {loading && messages.length <= 1 ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          ) : (
            messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.sender === 'user'
                      ? 'bg-primary-600/80 text-white backdrop-blur-sm border border-primary-500/30'
                      : 'bg-gray-800/80 border border-gray-700/80 text-gray-200 backdrop-blur-sm'
                  }`}
                >
                  {message.isLoading ? (
                    <div className="flex items-center space-x-3 px-2">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                      <span className="text-gray-400">L'assistant réfléchit...</span>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <div className="whitespace-pre-wrap">{message.text}</div>
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-3 -right-3 transition-opacity">
                          <button
                            onClick={() => copyToClipboard(message.text, message.id)}
                            className={`p-1.5 rounded-lg ${
                              message.sender === 'user' 
                                ? 'bg-primary-700 hover:bg-primary-800' 
                                : 'bg-gray-700 hover:bg-gray-600'
                            } transition-colors shadow-lg`}
                            title="Copier le message"
                          >
                            {copiedMessageId === message.id ? (
                              <Check className="h-3.5 w-3.5 text-green-400" />
                            ) : (
                              <Clipboard className="h-3.5 w-3.5 text-gray-300" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-primary-200' : 'text-gray-500'} text-right`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Formulaire d'envoi de message */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gray-800/30">
          <div className="flex flex-col space-y-2">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (query.trim()) handleSubmit(e);
                  }
                }}
                placeholder="Posez votre question..."
                className="w-full bg-gray-800 border border-gray-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl pl-4 pr-10 py-3 text-white placeholder-gray-500 resize-none overflow-hidden"
                disabled={isProcessing || loading}
                rows={1}
                style={{ minHeight: '2.5rem', maxHeight: '8rem' }}
              />
              <button
                type="submit"
                className="absolute right-3 bottom-3 p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isProcessing || !query.trim() || loading || !user}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
            
            <div className="text-xs text-gray-500 flex justify-between items-center px-1">
              <span>Appuyez sur Entrée pour envoyer, Maj+Entrée pour un saut de ligne</span>
              <div className="flex items-center space-x-1">
                <Search className="h-3 w-3" />
                <Smile className="h-3 w-3" />
                <Calendar className="h-3 w-3" />
                <BarChart2 className="h-3 w-3" />
                <span>et plus encore...</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};