import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Calendar
} from 'lucide-react';
import { InterviewLinkService } from '../services/interviewLinkService';

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

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (token) {
      validateInvitationLink();
    }
  }, [token]);

  useEffect(() => {
    if (linkValid && candidateInfo.name) {
      initializeMedia();
    }
  }, [linkValid, candidateInfo]);

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

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      streamRef.current = stream;
      setMediaReady(true);
      
    } catch (error) {
      console.error('Erreur accès média:', error);
      setErrorMessage('Impossible d\'accéder à la caméra ou au microphone. Vérifiez les permissions de votre navigateur.');
    }
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

  const joinInterview = async () => {
    if (!token) return;
    
    setIsJoining(true);
    
    try {
      // Marquer le lien comme utilisé
      InterviewLinkService.markAsUsed(token);
      
      // Simuler l'attente de connexion
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setHasJoined(true);
      setIsJoining(false);
      
    } catch (error) {
      setIsJoining(false);
      setErrorMessage('Erreur lors de la connexion à l\'entretien');
    }
  };

  const leaveInterview = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    navigate('/');
  };

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
        <div className="flex-1 flex items-center justify-center relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="max-w-full max-h-full object-cover rounded-lg"
          />
          
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

        {/* Chat area could be added here */}
        <div className="bg-gray-900 p-4 text-center">
          <p className="text-gray-400 text-sm">
            Entretien en cours • Le recruteur vous rejoindra sous peu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#ff6a3d] to-[#9b6bff] rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#223049]">OYA Intelligence</h1>
              <p className="text-sm text-gray-600">Studio d'entretien</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-[#223049]">Aperçu vidéo</h2>
                <p className="text-sm text-gray-600">Vérifiez votre caméra et microphone avant de rejoindre</p>
              </div>
              
              <div className="relative bg-black aspect-video">
                {mediaReady ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
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
                </div>
              </div>
            </div>
          </div>

          {/* Info Panel */}
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
                    <CheckCircle className="text-green-500\" size={16} />
                  ) : (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#ff6a3d]"></div>
                  )}
                  <span className="text-sm text-gray-700">
                    {mediaReady ? 'Média prêt' : 'Configuration média...'}
                  </span>
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
        </div>
      </div>
    </div>
  );
};

export default InterviewJoin;