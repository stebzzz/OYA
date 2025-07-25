import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  Camera,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Calendar
} from 'lucide-react';
import { InterviewLinkService } from '../services/interviewLinkService';
import { WebRTCService, WebRTCCallbacks } from '../services/webRTCService';

const InterviewJoin: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [linkValid, setLinkValid] = useState<boolean | null>(null);
  const [linkData, setLinkData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [candidateInfo, setCandidateInfo] = useState({
    name: '',
    email: ''
  });
  const [mediaReady, setMediaReady] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [webRTCConnected, setWebRTCConnected] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const webRTCRef = useRef<WebRTCService | null>(null);

  useEffect(() => {
    if (token) {
      validateInvitationLink();
    }
    initializeWebRTC();
    
    return () => {
      // Nettoyage lors du démontage
      if (webRTCRef.current) {
        webRTCRef.current.close();
      }
    };
  }, [token]);

  const initializeWebRTC = () => {
    const callbacks: WebRTCCallbacks = {
      onRemoteStream: (stream) => {
        console.log('📺 Stream distant reçu dans InterviewJoin:', {
          streamId: stream.id,
          tracks: stream.getTracks().length,
          videoTracks: stream.getVideoTracks().length,
          audioTracks: stream.getAudioTracks().length
        });
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          
          // Forcer la lecture
          remoteVideoRef.current.play().catch(error => {
            console.error('❌ Erreur lecture vidéo distante:', error);
          });
          
          // Vérifier les tracks
          stream.getTracks().forEach((track, index) => {
            console.log(`🎵 Track distant ${index}:`, {
              kind: track.kind,
              enabled: track.enabled,
              readyState: track.readyState,
              muted: track.muted
            });
          });
        }
      },
      onConnectionStateChange: (state) => {
        console.log('🔗 État connexion WebRTC:', state);
        setWebRTCConnected(state === 'connected');
      },
      onError: (error) => {
        console.error('❌ Erreur WebRTC:', error);
        setErrorMessage(`Erreur de connexion: ${error.message}`);
      }
    };
    
    webRTCRef.current = new WebRTCService(callbacks);
  };

  useEffect(() => {
    if (linkValid && candidateInfo.name) {
      checkMediaDevices();
      initializeMedia();
    }
  }, [linkValid, candidateInfo]);

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
        }
        if (audioDevices.length === 0 && audioEnabled) {
          console.warn('⚠️ Aucun microphone détecté');
        }
      }
    } catch (error) {
      console.error('❌ Erreur énumération appareils:', error);
    }
  };

  const validateInvitationLink = () => {
    if (!token) {
      setLinkValid(false);
      setErrorMessage('Lien d\'invitation manquant');
      return;
    }

    const validation = InterviewLinkService.validateToken(token);
    
    if (!validation.valid) {
      setLinkValid(false);
      setErrorMessage(validation.error || 'Lien invalide');
      return;
    }

    setLinkValid(true);
    setLinkData(validation.linkData);
    
    // Simuler la récupération des infos candidat
    // En production, ces données viendraient de la base de données
    setCandidateInfo({
      name: 'Candidat Test',
      email: 'candidat@example.com'
    });
  };

  const initializeMedia = async () => {
    try {
      console.log('🎥 Initialisation des médias...');
      
      // Vérifier si les API sont disponibles
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Les API de média ne sont pas supportées par ce navigateur');
      }
      
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
        
        // Forcer les attributs vidéo
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        
        try {
          await videoRef.current.play();
          console.log('▶️ Lecture vidéo démarrée');
        } catch (playError) {
          console.warn('Avertissement lecture vidéo:', playError);
          // Essayer de forcer la lecture après un délai
          setTimeout(async () => {
            try {
              if (videoRef.current) {
                await videoRef.current.play();
                console.log('▶️ Lecture vidéo forcée réussie');
              }
            } catch (retryError) {
              console.error('❌ Échec lecture vidéo forcée:', retryError);
            }
          }, 500);
        }
      }
      
      streamRef.current = stream;
      setMediaReady(true);
      console.log('✅ Médias initialisés avec succès');
      
    } catch (error) {
      console.error('❌ Erreur accès média:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      if (errorMessage.includes('not found') || errorMessage.includes('NotFoundError')) {
        setErrorMessage('Aucune caméra ou microphone détecté. Vérifiez que vos appareils sont connectés.');
      } else if (errorMessage.includes('denied') || errorMessage.includes('NotAllowedError')) {
        setErrorMessage('Accès refusé. Veuillez autoriser l\'accès à la caméra et au microphone dans votre navigateur.');
      } else if (errorMessage.includes('not supported')) {
        setErrorMessage('Votre navigateur ne supporte pas l\'accès aux médias. Utilisez un navigateur moderne.');
      } else {
        setErrorMessage(`Erreur d'accès aux médias: ${errorMessage}`);
      }
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
    
    // Forcer la mise à jour de l'affichage vidéo
    if (videoRef.current && streamRef.current) {
      if (!newVideoState) {
        // Si la vidéo est désactivée, on peut garder le stream mais masquer l'affichage
        console.log('📹 Vidéo désactivée');
      } else {
        // Si la vidéo est réactivée, s'assurer que le stream est bien affiché
        videoRef.current.srcObject = streamRef.current;
        console.log('📹 Vidéo réactivée');
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

  const joinInterview = async () => {
    if (!token || !webRTCRef.current) return;
    
    setIsJoining(true);
    
    try {
      // Marquer le lien comme utilisé
      InterviewLinkService.markAsUsed(token);
      
      // Initialiser WebRTC en tant que récepteur (candidat)
      // Utiliser le sessionId du linkData ou le token comme fallback
      const sessionId = linkData?.sessionId || token;
      console.log('🔑 Utilisation du sessionId:', sessionId, 'extrait du token');
      
      await webRTCRef.current.initialize(false, sessionId);
      
      // Ajouter le stream local
      const constraints = {
        video: videoEnabled,
        audio: audioEnabled
      };
      
      const localStream = await webRTCRef.current.addLocalStream(constraints);
      streamRef.current = localStream;
      
      // Mettre à jour l'élément vidéo local avec le nouveau stream
      if (videoRef.current && localStream) {
        videoRef.current.srcObject = localStream;
        try {
          await videoRef.current.play();
          console.log('▶️ Vidéo locale démarrée après connexion WebRTC');
        } catch (playError) {
          console.warn('Avertissement lecture vidéo locale:', playError);
        }
      }
      
      // Démarrer la vraie connexion WebRTC avec signalisation Firebase
      await webRTCRef.current.startRealConnection();
      
      console.log('🚀 Connexion WebRTC réelle démarrée côté candidat pour sessionId:', sessionId);
      
      setHasJoined(true);
      setIsJoining(false);
      
    } catch (error) {
      console.error('❌ Erreur joinInterview:', error);
      setIsJoining(false);
      setErrorMessage('Erreur lors de la connexion à l\'entretien');
    }
  };

  const leaveInterview = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (webRTCRef.current) {
      webRTCRef.current.close();
    }
    
    navigate('/');
  };

  const testMedia = async () => {
    console.log('🧪 Test manuel des médias...');
    
    // Arrêter le stream existant
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setMediaReady(false);
    setErrorMessage('');
    
    try {
      await checkMediaDevices();
      await initializeMedia();
      console.log('✅ Test média réussi');
    } catch (error) {
      console.error('❌ Échec test média:', error);
      setErrorMessage('Échec du test média. Vérifiez vos permissions.');
    }
  };

  const stopMedia = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setMediaReady(false);
    console.log('🛑 Médias arrêtés');
  };

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        setIsFullscreen(true);
        console.log('📺 Mode plein écran activé');
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
        console.log('📺 Mode plein écran désactivé');
      }
    } catch (error) {
      console.error('❌ Erreur plein écran:', error);
    }
  };

  const generateAIInsights = async () => {
    try {
      // Simuler l'analyse IA
      const insights = [
        {
          type: 'behavior',
          title: 'Contact visuel',
          score: 85,
          description: 'Bon contact visuel avec la caméra'
        },
        {
          type: 'communication',
          title: 'Clarté d\'expression',
          score: 78,
          description: 'Expression claire et structurée'
        },
        {
          type: 'confidence',
          title: 'Niveau de confiance',
          score: 82,
          description: 'Posture confiante et assurée'
        }
      ];
      
      setAiInsights(insights);
      setShowAIInsights(true);
      console.log('🧠 Insights IA générés');
    } catch (error) {
      console.error('Erreur génération insights IA:', error);
    }
  };

  // Fonction de test pour simuler une offre WebRTC
  const testWebRTCOffer = async () => {
    if (!linkData?.sessionId) {
      console.error('❌ Pas de sessionId disponible pour le test');
      return;
    }

    try {
      console.log('🧪 Test: Simulation d\'une offre WebRTC pour session:', linkData.sessionId);
      
      // Simuler une offre WebRTC basique
      const mockOffer = {
        type: 'offer' as RTCSdpType,
        sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0 1\r\na=msid-semantic: WMS\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:test\r\na=ice-pwd:test\r\na=fingerprint:sha-256 00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00\r\na=setup:actpass\r\na=mid:0\r\na=sendrecv\r\na=rtcp-mux\r\na=rtpmap:111 opus/48000/2\r\nm=video 9 UDP/TLS/RTP/SAVPF 96\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:test\r\na=ice-pwd:test\r\na=fingerprint:sha-256 00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00\r\na=setup:actpass\r\na=mid:1\r\na=sendrecv\r\na=rtcp-mux\r\na=rtpmap:96 VP8/90000\r\n'
      };

      // Importer le service de signalisation
      const { WebRTCSignalingService } = await import('../services/webRTCSignalingService');
      
      // Envoyer l'offre simulée (simuler un recruteur)
      await WebRTCSignalingService.sendOffer(linkData.sessionId, mockOffer, 'recruiter');
      
      console.log('✅ Test: Offre WebRTC simulée envoyée');
    } catch (error) {
      console.error('❌ Test: Erreur envoi offre simulée:', error);
    }
  };

  // Écouter les changements de plein écran
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (linkValid === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lien invalide</h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#ff6a3d] text-white px-6 py-3 rounded-lg hover:bg-[#ff6a3d]/90 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (linkValid === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6a3d]"></div>
      </div>
    );
  }

  if (hasJoined) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm">En direct</span>
            </div>
            <div className="text-white">
              <span className="font-medium">{candidateInfo.name}</span>
              <span className="text-gray-400 ml-2">• Entretien en cours</span>
            </div>
          </div>
          
          <button
            onClick={leaveInterview}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
          >
            <Phone size={16} />
            <span>Quitter</span>
          </button>
        </div>

        {/* Video Area */}
        <div className="flex-1 flex relative">
          {/* Video principal (recruteur/distant) */}
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                muted={false}
                className="max-w-full max-h-full object-cover"
              />
            ) : (
              <div className="text-center text-gray-400">
                <Camera size={48} className="mx-auto mb-4 opacity-50" />
                <p>En attente du recruteur...</p>
                {webRTCConnected && (
                  <div className="flex items-center justify-center mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm">Connecté</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Vidéo locale (candidat) - Picture in Picture */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden border-2 border-gray-600">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
              Vous
            </div>
          </div>
          
          {/* Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
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
              {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div className="bg-gray-900 p-4 text-center">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                webRTCConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
              }`}></div>
              <span className="text-gray-400 text-sm">
                {webRTCConnected ? 'Connexion établie' : 'Connexion en cours...'}
              </span>
            </div>
            {remoteStream && (
              <span className="text-gray-400 text-sm">•</span>
            )}
            <span className="text-gray-400 text-sm">
              {remoteStream ? 'Entretien en cours' : 'En attente du recruteur'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isFullscreen ? 'p-0' : ''}`}>
      {/* Panneau Insights IA */}
      {showAIInsights && (
        <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 border-l border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">🧠 Insights IA</h3>
              <button
                onClick={() => setShowAIInsights(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-green-100 mt-1">Analyse en temps réel</p>
          </div>
          <div className="p-4 space-y-3 max-h-full overflow-y-auto">
            {aiInsights.map((insight, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 border-l-4 border-green-500">
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">📊 Score global</h4>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-4/5"></div>
              </div>
              <p className="text-xs text-blue-600 mt-1">85% - Très bon candidat</p>
            </div>
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">💡 Recommandations</h4>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>• Approfondir les compétences techniques</li>
                <li>• Explorer les projets passés</li>
                <li>• Discuter des objectifs de carrière</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#ff6a3d] to-[#9b6bff] rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#223049]">OYA Intelligence</h1>
                <p className="text-sm text-gray-600">Studio d'entretien</p>
              </div>
            </div>
            {isFullscreen && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowAIInsights(!showAIInsights)}
                  className="px-3 py-1 bg-[#ff6a3d] text-white rounded-lg hover:bg-[#ff6a3d]/90 transition-colors text-sm"
                >
                  🧠 IA
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  📱 Quitter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`${isFullscreen ? 'h-screen flex' : 'max-w-4xl mx-auto px-4 py-8'}`}>
        <div className={`${isFullscreen ? 'flex-1 flex' : 'grid lg:grid-cols-3 gap-8'}`}>
          {/* Video Preview */}
          <div className={`${isFullscreen ? 'flex-1' : 'lg:col-span-2'}`}>
            <div className={`bg-white ${isFullscreen ? 'h-full' : 'rounded-xl shadow-sm border border-gray-200'} overflow-hidden`}>
              {!isFullscreen && (
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-[#223049]">Aperçu vidéo</h2>
                  <p className="text-sm text-gray-600">Vérifiez votre caméra et microphone avant de rejoindre</p>
                </div>
              )}
              
              <div className={`relative bg-black ${isFullscreen ? 'h-full' : 'aspect-video'}`}>
                {mediaReady ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    onLoadedMetadata={() => console.log('📹 Métadonnées vidéo chargées')}
                    onCanPlay={() => console.log('📹 Vidéo prête à être lue')}
                    onError={(e) => console.error('❌ Erreur vidéo:', e)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-white">Chargement de la caméra...</p>
                    </div>
                  </div>
                )}
                
                {/* Controls */}
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
                    {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                  </button>
                  
                  <button
                    onClick={() => setShowAIInsights(!showAIInsights)}
                    className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                  >
                    🧠
                  </button>
                  
                  <button
                    onClick={toggleFullscreen}
                    className="p-3 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                  >
                    {isFullscreen ? '📱' : '📺'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          {!isFullscreen && (
            <div className="space-y-6">
              {/* Interview Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-[#223049] mb-4">Détails de l'entretien</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <User size={16} className="text-gray-400" />
                    <span className="text-gray-600">Candidat:</span>
                    <span className="font-medium">{candidateInfo.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">Aujourd'hui</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-600">Durée:</span>
                    <span className="font-medium">60 minutes</span>
                  </div>
                </div>
              </div>

            {/* Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-[#223049] mb-4">État de préparation</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm text-gray-700">Lien d'invitation valide</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  {mediaReady ? (
                    <CheckCircle className="text-green-500" size={16} />
                  ) : (
                    <AlertCircle className="text-yellow-500" size={16} />
                  )}
                  <span className="text-sm text-gray-700">
                    {mediaReady ? 'Caméra et microphone prêts' : 'Configuration des médias en cours...'}
                  </span>
                </div>
                
                {/* Boutons de test */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={testMedia}
                      className="flex-1 px-3 py-2 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      🧪 Tester les médias
                    </button>
                    <button
                      onClick={stopMedia}
                      className="flex-1 px-3 py-2 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      🛑 Arrêter
                    </button>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={toggleFullscreen}
                      className="flex-1 px-3 py-2 text-xs bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      {isFullscreen ? '📱 Quitter' : '📺 Plein écran'}
                    </button>
                    <button
                      onClick={generateAIInsights}
                      className="flex-1 px-3 py-2 text-xs bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      🧠 Insights IA
                    </button>
                  </div>
                  <button
                    onClick={testWebRTCOffer}
                    className="w-full mt-2 px-3 py-2 text-xs bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    🧪 Test Offre WebRTC
                  </button>
                  <button
                    onClick={() => {
                      console.log('📊 État actuel:');
                      console.log('- mediaReady:', mediaReady);
                      console.log('- videoEnabled:', videoEnabled);
                      console.log('- audioEnabled:', audioEnabled);
                      console.log('- streamRef.current:', streamRef.current);
                      console.log('- videoRef.current:', videoRef.current);
                      console.log('- linkData:', linkData);
                      console.log('- connectionState:', connectionState);
                    }}
                    className="w-full mt-2 px-3 py-2 text-xs bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    📊 Diagnostic console
                  </button>
                </div>
              </div>
            </div>

            {/* Join Button */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <button
                onClick={joinInterview}
                disabled={!mediaReady || isJoining}
                className="w-full bg-[#ff6a3d] text-white py-4 px-6 rounded-lg hover:bg-[#ff6a3d]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-semibold"
              >
                {isJoining ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Connexion...</span>
                  </>
                ) : (
                  <>
                    <Video size={20} />
                    <span>Rejoindre l'entretien</span>
                  </>
                )}
              </button>
              
              {!mediaReady && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Veuillez autoriser l'accès à votre caméra et microphone
                </p>
              )}
            </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <h4 className="font-medium text-blue-900 mb-3">Instructions</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Assurez-vous d'être dans un endroit calme</li>
                  <li>• Vérifiez votre connexion internet</li>
                  <li>• Préparez vos questions sur le poste</li>
                  <li>• Ayez votre CV à portée de main</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewJoin;