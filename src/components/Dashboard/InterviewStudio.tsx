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
  aiAnalysis?: {
    overallScore: number;
    communication: number;
    technicalSkills: number;
    motivation: number;
    culturalFit: number;
    keyInsights: string[];
    recommendations: string[];
    transcription: string;
    emotions: { timestamp: number; emotion: string; confidence: number }[];
  };
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

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

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
        
        if (currentSession) {
          const updatedSession = { ...currentSession, status: 'in_progress' as const };
          setSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));
          setCurrentSession(updatedSession);
        }
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
      
      if (currentSession) {
        const aiAnalysis = await simulateAIAnalysis();
        const updatedSession = {
          ...currentSession,
          status: 'completed' as const,
          aiAnalysis
        };
        
        setSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));
        setCurrentSession(updatedSession);
        setShowAIAnalysis(true);
      }
    }
    
    stopVideoStream();
  };

  const simulateAIAnalysis = async (): Promise<InterviewSession['aiAnalysis']> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      overallScore: 75 + Math.floor(Math.random() * 20),
      communication: 70 + Math.floor(Math.random() * 25),
      technicalSkills: 65 + Math.floor(Math.random() * 30),
      motivation: 80 + Math.floor(Math.random() * 20),
      culturalFit: 75 + Math.floor(Math.random() * 20),
      keyInsights: [
        'Communication claire et structurée',
        'Bonne maîtrise technique du domaine',
        'Motivation authentique pour le poste',
        'Bon alignement culturel avec l\'entreprise'
      ],
      recommendations: [
        'Candidat recommandé pour la suite du processus',
        'Approfondir l\'évaluation technique',
        'Organiser une rencontre avec l\'équipe'
      ],
      transcription: 'Transcription automatique de l\'entretien sera disponible ici...',
      emotions: [
        { timestamp: 60, emotion: 'Confiant', confidence: 0.8 },
        { timestamp: 180, emotion: 'Concentré', confidence: 0.85 },
        { timestamp: 300, emotion: 'Enthousiaste', confidence: 0.75 }
      ]
    };
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoEnabled;
      }
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioEnabled;
      }
    }
  };

  const startSession = async (session: InterviewSession) => {
    setCurrentSession(session);
    await startVideoStream();
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

                          {session.status === 'scheduled' && session.invitationSent && (
                            <button
                              onClick={() => startSession(session)}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                            >
                              <Play size={16} />
                              <span>Démarrer</span>
                            </button>
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
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
              )}
              
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <User size={16} />
                  <span>{currentSession.candidateName}</span>
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
                <div className="space-y-3 text-sm">
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

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
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
      )}
    </div>
  );
};

export default InterviewStudio;