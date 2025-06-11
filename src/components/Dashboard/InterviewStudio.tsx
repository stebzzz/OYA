import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Camera, 
  Calendar,
  Clock,
  User,
  Brain,
  Star,
  Play,
  Pause,
  Square,
  FileText,
  Download,
  Share2,
  Target,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Zap,
  Plus,
  Mail,
  Send,
  ExternalLink,
  Copy
} from 'lucide-react';
import { useCandidates } from '../../hooks/useCandidates';
import { EmailService } from '../../services/emailService';
import { InterviewLinkService } from '../../services/interviewLinkService';
import { interviewAIService, InterviewAnalysis, TranscriptionSegment } from '../../services/interviewAIService';
import { FirebaseInterviewService, InterviewResult } from '../../services/firebaseInterviewService';
import { WebRTCService, WebRTCCallbacks } from '../../services/webRTCService';
import { Timestamp } from 'firebase/firestore';

interface InterviewSession {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  date: Date;
  time: string;
  duration: number;
  type: 'phone' | 'video' | 'onsite';
  location?: string;
  notes?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  invitationSent?: boolean;
  invitationLink?: string;
  aiAnalysis?: InterviewAnalysis;
}

const InterviewStudio: React.FC = () => {
  const { candidates } = useCandidates();
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [newSession, setNewSession] = useState({
    candidateId: '',
    scheduledDate: '',
    duration: 60
  });
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [sendingInvitation, setSendingInvitation] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionSegments, setTranscriptionSegments] = useState<TranscriptionSegment[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<'interviewer' | 'candidate'>('candidate');
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState('');
  const [currentInterviewResultId, setCurrentInterviewResultId] = useState<string | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [webRTCConnected, setWebRTCConnected] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingRef = useRef<MediaRecorder | null>(null);
  const webRTCRef = useRef<WebRTCService | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Nettoyage des ressources WebRTC lors du démontage
  useEffect(() => {
    return () => {
      if (webRTCRef.current) {
        webRTCRef.current.close();
      }
    };
  }, []);

  const checkMediaDevices = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        const audioDevices = devices.filter(device => device.kind === 'audioinput');
        
        console.log('📹 Caméras disponibles:', videoDevices.length);
        console.log('🎤 Microphones disponibles:', audioDevices.length);
        console.log('🔍 Appareils détectés:', devices);
        
        if (videoDevices.length === 0 && videoEnabled) {
          console.warn('⚠️ Aucune caméra détectée');
          setStreamError('Aucune caméra détectée. Vérifiez qu\'une caméra est connectée.');
        }
        if (audioDevices.length === 0 && audioEnabled) {
          console.warn('⚠️ Aucun microphone détecté');
          setStreamError('Aucun microphone détecté. Vérifiez qu\'un microphone est connecté.');
        }
      }
    } catch (error) {
      console.error('❌ Erreur énumération appareils:', error);
    }
  };

  const startVideoStream = async () => {
    try {
      setStreamError(null);
      console.log('🎥 Démarrage du stream vidéo...');
      
      // Vérifier si les API sont disponibles
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Les API de média ne sont pas supportées par ce navigateur');
      }
      
      // Vérifier les appareils disponibles
      await checkMediaDevices();
      
      const constraints = {
        video: videoEnabled ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } : false,
        audio: audioEnabled ? {
          echoCancellation: true,
          noiseSuppression: true
        } : false
      };

      console.log('📋 Contraintes média:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('✅ Stream obtenu:', stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
          console.log('▶️ Lecture vidéo démarrée');
        } catch (playError) {
          console.warn('Avertissement lecture vidéo:', playError);
          // La lecture peut échouer mais le stream reste valide
        }
      }
      
      streamRef.current = stream;
      console.log('✅ Accès caméra/micro réussi');
      
    } catch (error) {
      console.error('❌ Erreur accès caméra/micro:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      if (errorMessage.includes('not found') || errorMessage.includes('NotFoundError')) {
        setStreamError('Aucune caméra ou microphone détecté. Vérifiez que vos appareils sont connectés.');
      } else if (errorMessage.includes('denied') || errorMessage.includes('NotAllowedError')) {
        setStreamError('Accès refusé. Veuillez autoriser l\'accès à la caméra et au microphone dans votre navigateur.');
      } else if (errorMessage.includes('not supported')) {
        setStreamError('Votre navigateur ne supporte pas l\'accès aux médias. Utilisez un navigateur moderne.');
      } else {
        setStreamError(`Erreur d'accès aux médias: ${errorMessage}`);
      }
    }
  };

  const stopVideoStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setStreamError(null);
  };

  const startRecording = async () => {
    if (!streamRef.current) {
      await startVideoStream();
    }

    if (streamRef.current) {
      try {
        const mediaRecorder = new MediaRecorder(streamRef.current);
        recordingRef.current = mediaRecorder;
        
        mediaRecorder.start();
        setIsRecording(true);
        setRecordingTime(0);
        
        // Démarrer la transcription automatiquement
        startTranscription();
        
        if (currentSession) {
          const updatedSession = { ...currentSession, status: 'in_progress' as const };
          setSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));
          setCurrentSession(updatedSession);
        }
        
        console.log('🔴 Enregistrement et transcription démarrés');
      } catch (error) {
        console.error('Erreur démarrage enregistrement:', error);
        alert('Impossible de démarrer l\'enregistrement');
      }
    }
  };

  const pauseRecording = () => {
    if (recordingRef.current && isRecording) {
      recordingRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (recordingRef.current && isPaused) {
      recordingRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = async () => {
    if (recordingRef.current) {
      recordingRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      // Arrêter la transcription
      stopTranscription();
      
      if (currentSession) {
        // Lancer l'analyse IA avec les vraies données
        const analysis = await performAIAnalysis();
        
        if (analysis) {
          const updatedSession = {
            ...currentSession,
            status: 'completed' as const,
            aiAnalysis: analysis
          };
          
          setSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));
          setCurrentSession(updatedSession);
          
          // Sauvegarder l'analyse dans Firebase
          if (currentInterviewResultId) {
            try {
              await FirebaseInterviewService.completeInterview(
                currentInterviewResultId,
                analysis,
                new Date(),
                'Entretien terminé avec analyse IA'
              );
              console.log('✅ Analyse IA sauvegardée dans Firebase');
            } catch (error) {
              console.error('❌ Erreur sauvegarde Firebase:', error);
            }
          }
          
          setShowAIAnalysis(true);
        }
      }
      
      console.log('⏹️ Enregistrement et transcription arrêtés');
    }
    
    stopVideoStream();
  };

  const startTranscription = () => {
    try {
      interviewAIService.startTranscription((segment) => {
        setTranscriptionSegments(prev => [...prev, segment]);
        setLiveTranscription(segment.text);
        setTimeout(() => setLiveTranscription(''), 3000);
      });
      setIsTranscribing(true);
      console.log('🎤 Transcription démarrée');
    } catch (error) {
      console.error('Erreur démarrage transcription:', error);
      alert('Erreur: ' + error.message);
    }
  };

  const stopTranscription = () => {
    interviewAIService.stopTranscription();
    setIsTranscribing(false);
    setLiveTranscription('');
    console.log('🛑 Transcription arrêtée');
  };

  const switchSpeaker = (speaker: 'interviewer' | 'candidate') => {
    setCurrentSpeaker(speaker);
    interviewAIService.setSpeaker(speaker);
  };

  const performAIAnalysis = async (): Promise<InterviewAnalysis | undefined> => {
    if (!currentSession) return;
    
    setAiAnalysisLoading(true);
    try {
      const analysis = await interviewAIService.analyzeInterview({
        candidateName: currentSession.candidateName,
        position: currentSession.position,
        transcriptionSegments: transcriptionSegments,
        duration: Math.floor(recordingTime / 60)
      });
      
      console.log('✅ Analyse IA terminée:', analysis);
      return analysis;
    } catch (error) {
      console.error('Erreur analyse IA:', error);
      alert('Erreur lors de l\'analyse IA: ' + error.message);
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  const toggleVideo = () => {
    const newVideoState = !videoEnabled;
    setVideoEnabled(newVideoState);
    
    if (webRTCRef.current) {
      webRTCRef.current.toggleVideo(newVideoState);
    } else if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = newVideoState;
      }
    }
  };

  const toggleAudio = () => {
    const newAudioState = !audioEnabled;
    setAudioEnabled(newAudioState);
    
    if (webRTCRef.current) {
      webRTCRef.current.toggleAudio(newAudioState);
    } else if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = newAudioState;
      }
    }
  };

  const initializeWebRTC = () => {
    const callbacks: WebRTCCallbacks = {
      onRemoteStream: (stream) => {
        console.log('📺 Stream distant reçu dans InterviewStudio');
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      },
      onConnectionStateChange: (state) => {
        console.log('🔗 État connexion WebRTC:', state);
        setWebRTCConnected(state === 'connected');
      },
      onError: (error) => {
        console.error('❌ Erreur WebRTC:', error);
        setStreamError(`Erreur de connexion: ${error.message}`);
      }
    };
    
    webRTCRef.current = new WebRTCService(callbacks);
  };

  const startSession = async (session: InterviewSession) => {
    try {
      setCurrentSession(session);
      
      // Initialiser WebRTC en tant qu'initiateur (recruteur)
      if (!webRTCRef.current) {
        initializeWebRTC();
      }
      
      if (webRTCRef.current) {
        await webRTCRef.current.initialize(true);
        
        // Ajouter le stream local
        const constraints = {
          video: videoEnabled,
          audio: audioEnabled
        };
        
        const localStream = await webRTCRef.current.addLocalStream(constraints);
        streamRef.current = localStream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }
        
        // Pour la démo, simuler la connexion WebRTC
        // En production, ceci serait géré par un serveur de signalisation
        await webRTCRef.current.simulateConnection();
      } else {
        // Fallback vers le stream vidéo classique
        await startVideoStream();
      }
      
      // Créer un enregistrement Firebase pour cet entretien
      const interviewData: Omit<InterviewResult, 'id' | 'createdAt' | 'updatedAt'> = {
        sessionId: session.id,
        candidateId: session.candidateId,
        candidateName: session.candidateName,
        candidateEmail: session.candidateEmail,
        position: session.position,
        recruiterId: 'current-user-id', // TODO: Récupérer l'ID du recruteur connecté
        recruiterName: 'Recruteur', // TODO: Récupérer le nom du recruteur connecté
        startTime: Timestamp.now(),
        duration: session.duration,
        status: 'in_progress'
      };
      
      const resultId = await FirebaseInterviewService.createInterviewResult(interviewData);
      setCurrentInterviewResultId(resultId);
      console.log('✅ Entretien enregistré dans Firebase avec ID:', resultId);
    } catch (error) {
      console.error('❌ Erreur lors du démarrage de l\'entretien:', error);
      setStreamError('Erreur lors du démarrage de l\'entretien');
      // Continuer même si Firebase échoue
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const createNewSession = () => {
    if (!newSession.candidateId || !newSession.scheduledDate) {
      alert('Veuillez sélectionner un candidat et une date');
      return;
    }

    const candidate = candidates.find(c => c.id === newSession.candidateId);
    if (!candidate) {
      alert('Candidat introuvable');
      return;
    }

    const session: InterviewSession = {
      id: Date.now().toString(),
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      position: candidate.position,
      date: new Date(newSession.scheduledDate),
      time: new Date(newSession.scheduledDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      duration: newSession.duration,
      type: 'video',
      status: 'scheduled',
      notes: '',
      invitationSent: false
    };

    setSessions([session, ...sessions]);
    setShowSessionForm(false);
    setNewSession({
      candidateId: '',
      scheduledDate: '',
      duration: 60
    });
  };

  const sendInvitation = async (session: InterviewSession) => {
    setSendingInvitation(session.id);
    
    try {
      // Générer le lien d'invitation
      const { link, token } = InterviewLinkService.generateInvitationLink(session.id, session.candidateId);
      
      // Envoyer l'email d'invitation
      const result = await EmailService.sendInterviewInvitation({
        candidateEmail: session.candidateEmail,
        candidateName: session.candidateName,
        position: session.position,
        interviewDate: session.date.toLocaleDateString('fr-FR', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        interviewTime: session.time,
        duration: session.duration,
        joinLink: link,
        recruiterName: 'Équipe RH',
        companyName: 'Mon Entreprise'
      });

      if (result.success) {
        // Mettre à jour la session
        const updatedSession = { 
          ...session, 
          invitationSent: true, 
          invitationLink: link 
        };
        setSessions(prev => prev.map(s => s.id === session.id ? updatedSession : s));
        
        alert('Invitation envoyée avec succès !');
      } else {
        alert(`Erreur lors de l'envoi: ${result.error}`);
      }
    } catch (error) {
      console.error('Erreur envoi invitation:', error);
      alert('Erreur lors de l\'envoi de l\'invitation');
    } finally {
      setSendingInvitation(null);
    }
  };

  const copyInvitationLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert('Lien copié dans le presse-papiers !');
  };

  const eligibleCandidates = candidates.filter(c => 
    ['Contacted', 'Interview', 'Qualified'].includes(c.status)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <Video className="mr-3" size={32} />
              Studio d'entretiens IA
            </h1>
            <p className="text-gray-200">
              Menez vos entretiens avec analyse IA en temps réel et invitations automatiques
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{sessions.length}</div>
            <div className="text-sm text-gray-200">Entretiens planifiés</div>
          </div>
        </div>
      </div>

      {!currentSession ? (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#223049]">Entretiens programmés</h2>
                  <button
                    onClick={() => setShowSessionForm(true)}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
                  >
                    <Calendar size={16} />
                    <span>Planifier entretien</span>
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {sessions.length === 0 ? (
                  <div className="p-12 text-center">
                    <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun entretien planifié</h3>
                    <p className="text-gray-500 mb-4">Planifiez votre premier entretien pour commencer.</p>
                    {eligibleCandidates.length === 0 && (
                      <p className="text-sm text-gray-400">
                        Aucun candidat éligible. Ajoutez d'abord des candidats avec le statut "Contacté" ou "Entretien".
                      </p>
                    )}
                  </div>
                ) : (
                  sessions.map((session) => (
                    <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-[#223049]">{session.candidateName}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              session.status === 'completed' ? 'bg-green-100 text-green-800' :
                              session.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              session.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {session.status === 'completed' ? 'Terminé' :
                               session.status === 'in_progress' ? 'En cours' :
                               session.status === 'scheduled' ? 'Planifié' : 'Annulé'}
                            </span>
                            {session.invitationSent && (
                              <CheckCircle size={14} className="text-green-500" title="Invitation envoyée" />
                            )}
                            {session.aiAnalysis && (
                              <div className="flex items-center space-x-1">
                                <Brain size={14} className="text-purple-500" />
                                <span className="text-sm font-medium text-purple-500">
                                  {session.aiAnalysis.overallScore}%
                                </span>
                              </div>
                            )}
                          </div>

                          <p className="text-gray-600 mb-2">{session.position}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar size={14} />
                              <span>{session.date.toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{session.time} ({session.duration}min)</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User size={14} />
                              <span>{session.candidateEmail}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {/* Bouton d'accès direct à la réunion */}
                          {session.status === 'scheduled' && (
                            <button
                              onClick={() => startSession(session)}
                              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
                              title="Accéder directement à la réunion"
                            >
                              <Video size={16} />
                              <span>Accéder à la réunion</span>
                            </button>
                          )}

                          {session.status === 'scheduled' && !session.invitationSent && (
                            <button
                              onClick={() => sendInvitation(session)}
                              disabled={sendingInvitation === session.id}
                              className="bg-[#ff6a3d] text-white px-3 py-1 rounded text-sm hover:bg-[#ff6a3d]/90 transition-colors flex items-center space-x-1 disabled:opacity-50"
                            >
                              {sendingInvitation === session.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              ) : (
                                <Send size={12} />
                              )}
                              <span>Inviter</span>
                            </button>
                          )}

                          {session.invitationLink && (
                            <button
                              onClick={() => copyInvitationLink(session.invitationLink!)}
                              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Copier le lien d'invitation"
                            >
                              <Copy size={14} />
                            </button>
                          )}

                          {session.invitationLink && (
                            <a
                              href={session.invitationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-400 hover:text-green-500 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Ouvrir le lien d'invitation"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}

                          {session.aiAnalysis && (
                            <button
                              onClick={() => {
                                setCurrentSession(session);
                                setShowAIAnalysis(true);
                              }}
                              className="text-purple-500 hover:text-purple-600 p-2 rounded-lg hover:bg-gray-100"
                              title="Voir l'analyse IA"
                            >
                              <Brain size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-[#223049] mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total entretiens</span>
                  <span className="font-semibold">{sessions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Invitations envoyées</span>
                  <span className="font-semibold text-green-600">
                    {sessions.filter(s => s.invitationSent).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Terminés</span>
                  <span className="font-semibold text-blue-600">
                    {sessions.filter(s => s.status === 'completed').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Candidats éligibles</span>
                  <span className="font-semibold text-purple-600">
                    {eligibleCandidates.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
              <h3 className="font-semibold text-[#223049] mb-4">Fonctionnalités IA</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Invitations automatiques par email</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Liens sécurisés uniques</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Analyse comportementale temps réel</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Transcription automatique</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Scoring multi-critères</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Interface d'entretien */
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-black rounded-xl overflow-hidden aspect-video relative">
              {streamError ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white p-8">
                  <div className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Problème d'accès aux médias</h3>
                    <p className="text-sm text-gray-300 mb-4">{streamError}</p>
                    <button
                      onClick={startVideoStream}
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      Réessayer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex relative">
                  {/* Vidéo principale (candidat/distant) */}
                  <div className="flex-1 flex items-center justify-center bg-gray-900">
                    {remoteStream ? (
                      <video
                        ref={remoteVideoRef}
                        autoPlay
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <User size={48} className="mx-auto mb-4 opacity-50" />
                        <p>En attente du candidat...</p>
                        {webRTCConnected && (
                          <div className="flex items-center justify-center mt-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                            <span className="text-sm">Connecté</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Vidéo locale (recruteur) - Picture in Picture */}
                  <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden border-2 border-gray-600">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                      Vous (Recruteur)
                    </div>
                  </div>
                </div>
              )}
              
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <User size={16} />
                  <span>{currentSession.candidateName}</span>
                  {webRTCConnected && (
                    <div className="flex items-center ml-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                      <span className="text-xs">En ligne</span>
                    </div>
                  )}
                </div>
              </div>

              {isRecording && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>{formatTime(recordingTime)}</span>
                </div>
              )}

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full transition-colors ${
                    audioEnabled ? 'bg-gray-700 text-white' : 'bg-red-500 text-white'
                  }`}
                >
                  {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                </button>

                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full transition-colors ${
                    videoEnabled ? 'bg-gray-700 text-white' : 'bg-red-500 text-white'
                  }`}
                >
                  {videoEnabled ? <Camera size={20} /> : <VideoOff size={20} />}
                </button>

                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    disabled={!!streamError}
                  >
                    <Play size={20} />
                  </button>
                ) : (
                  <>
                    {!isPaused ? (
                      <button
                        onClick={pauseRecording}
                        className="p-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                      >
                        <Pause size={20} />
                      </button>
                    ) : (
                      <button
                        onClick={resumeRecording}
                        className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                      >
                        <Play size={20} />
                      </button>
                    )}
                    
                    <button
                      onClick={stopRecording}
                      className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Square size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-[#223049] mb-4">Informations</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Candidat:</span>
                  <div className="font-medium">{currentSession.candidateName}</div>
                </div>
                <div>
                  <span className="text-gray-600">Poste:</span>
                  <div className="font-medium">{currentSession.position}</div>
                </div>
                <div>
                  <span className="text-gray-600">Durée prévue:</span>
                  <div className="font-medium">{currentSession.duration} minutes</div>
                </div>
                {currentSession.invitationLink && (
                  <div>
                    <span className="text-gray-600">Lien candidat:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <button
                        onClick={() => copyInvitationLink(currentSession.invitationLink!)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded flex items-center space-x-1"
                      >
                        <Copy size={12} />
                        <span>Copier</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isRecording && (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-[#223049] mb-4 flex items-center">
                  <Brain className="text-purple-500 mr-2" size={20} />
                  IA en temps réel
                </h3>
                
                {/* Contrôles de transcription */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Transcription</span>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        isTranscribing ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
                      }`}></div>
                      <span className="text-xs text-gray-600">
                        {isTranscribing ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Sélecteur de speaker */}
                  <div className="flex space-x-2 mb-3">
                    <button
                      onClick={() => switchSpeaker('interviewer')}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        currentSpeaker === 'interviewer'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Recruteur
                    </button>
                    <button
                      onClick={() => switchSpeaker('candidate')}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        currentSpeaker === 'candidate'
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Candidat
                    </button>
                  </div>
                  
                  {/* Transcription en temps réel */}
                  {liveTranscription && (
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">
                        {currentSpeaker === 'interviewer' ? '🎤 Recruteur' : '👤 Candidat'}
                      </div>
                      <div className="text-sm text-gray-800">{liveTranscription}</div>
                    </div>
                  )}
                  
                  {/* Historique de transcription */}
                  {transcriptionSegments.length > 0 && (
                    <div className="max-h-32 overflow-y-auto bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-2">
                        Historique ({transcriptionSegments.length} segments)
                      </div>
                      <div className="space-y-1">
                        {transcriptionSegments.slice(-3).map((segment, index) => (
                          <div key={index} className="text-xs">
                            <span className={`font-medium ${
                              segment.speaker === 'interviewer' ? 'text-blue-600' : 'text-purple-600'
                            }`}>
                              {segment.speaker === 'interviewer' ? 'Recruteur' : 'Candidat'}:
                            </span>
                            <span className="text-gray-700 ml-1">{segment.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Durée d'enregistrement</span>
                    <span className="font-semibold text-purple-600">{formatTime(recordingTime)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Segments transcrits</span>
                    <span className="font-semibold text-green-600">{transcriptionSegments.length}</span>
                  </div>
                  {aiAnalysisLoading && (
                    <div className="flex items-center justify-center py-4">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                        <span className="text-sm text-gray-600">Analyse IA en cours...</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Communication:</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full w-4/5"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Confiance:</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Engagement:</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full w-4/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-[#223049] mb-4">Notes d'entretien</h3>
              <textarea
                rows={4}
                placeholder="Prenez vos notes ici..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setCurrentSession(null)}
                className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Quitter l'entretien
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal planification */}
      {showSessionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-[#223049] mb-6">Planifier un entretien</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Candidat *
                </label>
                <select
                  value={newSession.candidateId}
                  onChange={(e) => setNewSession({ ...newSession, candidateId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un candidat</option>
                  {eligibleCandidates.map(candidate => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.name} - {candidate.position}
                    </option>
                  ))}
                </select>
                {eligibleCandidates.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Aucun candidat éligible. Ajoutez des candidats avec le statut "Contacté" ou "Entretien".
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date et heure *
                </label>
                <input
                  type="datetime-local"
                  value={newSession.scheduledDate}
                  onChange={(e) => setNewSession({ ...newSession, scheduledDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée (minutes)
                </label>
                <select
                  value={newSession.duration}
                  onChange={(e) => setNewSession({ ...newSession, duration: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 heure</option>
                  <option value={90}>1h30</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowSessionForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={createNewSession}
                disabled={!newSession.candidateId || !newSession.scheduledDate}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Planifier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal analyse IA */}
      {showAIAnalysis && currentSession?.aiAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#223049] flex items-center">
                  <Brain className="text-purple-500 mr-2" size={24} />
                  Analyse IA - {currentSession.candidateName}
                </h2>
                <button
                  onClick={() => setShowAIAnalysis(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {currentSession.aiAnalysis.overallScore}%
                </div>
                <div className="text-gray-600">Score global</div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentSession.aiAnalysis.communication}%
                  </div>
                  <div className="text-sm text-gray-600">Communication</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {currentSession.aiAnalysis.technicalSkills}%
                  </div>
                  <div className="text-sm text-gray-600">Compétences</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {currentSession.aiAnalysis.motivation}%
                  </div>
                  <div className="text-sm text-gray-600">Motivation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {currentSession.aiAnalysis.culturalFit}%
                  </div>
                  <div className="text-sm text-gray-600">Fit culturel</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#223049] mb-3">Insights clés</h3>
                <ul className="space-y-2">
                  {currentSession.aiAnalysis.keyInsights.map((insight, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#223049] mb-3">Recommandations</h3>
                <ul className="space-y-2">
                  {currentSession.aiAnalysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Target size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Résumé IA */}
              {currentSession.aiAnalysis.summary && (
                <div>
                  <h3 className="font-semibold text-[#223049] mb-3 flex items-center">
                    <FileText size={16} className="mr-2" />
                    Résumé de l'entretien
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">{currentSession.aiAnalysis.summary}</p>
                  </div>
                </div>
              )}

              {/* Analyse des émotions */}
              {currentSession.aiAnalysis.emotions && currentSession.aiAnalysis.emotions.length > 0 && (
                <div>
                  <h3 className="font-semibold text-[#223049] mb-3 flex items-center">
                    <TrendingUp size={16} className="mr-2" />
                    Analyse émotionnelle
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentSession.aiAnalysis.emotions.slice(0, 6).map((emotion, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{emotion.emotion}</span>
                          <span className="text-xs text-gray-500">
                            {Math.round(emotion.confidence * 100)}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(emotion.timestamp).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Évaluation des compétences */}
              {currentSession.aiAnalysis.skillsAssessment && currentSession.aiAnalysis.skillsAssessment.length > 0 && (
                <div>
                  <h3 className="font-semibold text-[#223049] mb-3 flex items-center">
                    <Star size={16} className="mr-2" />
                    Évaluation des compétences
                  </h3>
                  <div className="space-y-3">
                    {currentSession.aiAnalysis.skillsAssessment.map((skill, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-700">{skill.skill}</span>
                          <span className="text-sm font-bold text-purple-600">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                        {skill.evidence && skill.evidence.length > 0 && (
                          <div className="text-xs text-gray-600">
                            <strong>Preuves:</strong> {skill.evidence.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transcription complète */}
              <div>
                <h3 className="font-semibold text-[#223049] mb-3 flex items-center">
                  <MessageSquare size={16} className="mr-2" />
                  Transcription complète
                  {transcriptionSegments.length > 0 && (
                    <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {transcriptionSegments.length} segments
                    </span>
                  )}
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  {transcriptionSegments.length > 0 ? (
                    <div className="space-y-2">
                      {transcriptionSegments.map((segment, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
                            segment.speaker === 'interviewer' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {segment.speaker === 'interviewer' ? 'Recruteur' : 'Candidat'}
                          </div>
                          <div className="text-sm text-gray-700 leading-relaxed">
                            {segment.text}
                          </div>
                          <div className="text-xs text-gray-400 flex-shrink-0">
                            {new Date(segment.timestamp).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">
                      {currentSession.aiAnalysis.transcription || 'Aucune transcription disponible'}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Analyse générée le {new Date().toLocaleString('fr-FR')}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      const analysisData = {
                        candidat: currentSession.candidateName,
                        poste: currentSession.position,
                        date: new Date().toLocaleDateString('fr-FR'),
                        scores: {
                          global: currentSession.aiAnalysis.overallScore,
                          communication: currentSession.aiAnalysis.communication,
                          technique: currentSession.aiAnalysis.technicalSkills,
                          motivation: currentSession.aiAnalysis.motivation,
                          culture: currentSession.aiAnalysis.culturalFit
                        },
                        insights: currentSession.aiAnalysis.keyInsights,
                        recommandations: currentSession.aiAnalysis.recommendations,
                        resume: currentSession.aiAnalysis.summary,
                        transcription: transcriptionSegments.length > 0 
                          ? transcriptionSegments.map(s => `[${s.speaker}]: ${s.text}`).join('\n')
                          : currentSession.aiAnalysis.transcription
                      };
                      
                      const dataStr = JSON.stringify(analysisData, null, 2);
                      const dataBlob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `analyse-entretien-${currentSession.candidateName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <Download size={16} />
                    <span>Exporter</span>
                  </button>
                  <button
                    onClick={() => setShowAIAnalysis(false)}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewStudio;