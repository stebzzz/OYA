import { WebRTCSignalingService } from './webRTCSignalingService';

export interface WebRTCConnection {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
  isConnected: boolean;
}

export interface WebRTCCallbacks {
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
  onIceCandidate?: (candidate: RTCIceCandidate) => void;
  onError?: (error: Error) => void;
}

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private callbacks: WebRTCCallbacks = {};
  private isInitiator = false;
  private sessionId: string | null = null;
  private signalingUnsubscribe: (() => void) | null = null;

  // Configuration STUN/TURN pour la connexion WebRTC
  private readonly rtcConfiguration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ],
    iceCandidatePoolSize: 10
  };

  constructor(callbacks: WebRTCCallbacks = {}) {
    this.callbacks = callbacks;
  }

  /**
   * Initialiser la connexion WebRTC avec signalisation
   */
  async initialize(isInitiator: boolean = false, sessionId?: string): Promise<void> {
    try {
      this.isInitiator = isInitiator;
      this.sessionId = sessionId || Date.now().toString();
      this.peerConnection = new RTCPeerConnection(this.rtcConfiguration);
      
      // Configurer les événements
      this.setupPeerConnectionEvents();
      
      // Démarrer l'écoute de la signalisation si on a un sessionId
      if (this.sessionId) {
        this.startSignalingListener();
      }
      
      console.log('✅ WebRTC initialisé', { isInitiator, sessionId: this.sessionId });
    } catch (error) {
      console.error('❌ Erreur initialisation WebRTC:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Configurer les événements de la connexion peer
   */
  private setupPeerConnectionEvents(): void {
    if (!this.peerConnection) return;

    // Réception du stream distant
    this.peerConnection.ontrack = (event) => {
      console.log('📺 Stream distant reçu:', {
        streamId: event.streams[0]?.id,
        tracks: event.streams[0]?.getTracks().length,
        videoTracks: event.streams[0]?.getVideoTracks().length,
        audioTracks: event.streams[0]?.getAudioTracks().length,
        trackKind: event.track.kind,
        trackEnabled: event.track.enabled,
        trackReadyState: event.track.readyState
      });
      
      // Vérifier les receivers
      const receivers = this.peerConnection?.getReceivers() || [];
      console.log('📥 Receivers actifs:', receivers.length);
      receivers.forEach((receiver, index) => {
        console.log(`📥 Receiver ${index}:`, {
          track: receiver.track?.kind,
          enabled: receiver.track?.enabled,
          readyState: receiver.track?.readyState
        });
      });
      
      this.callbacks.onRemoteStream?.(event.streams[0]);
    };

    // Changement d'état de connexion
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection?.connectionState;
      console.log('🔗 État connexion WebRTC:', state);
      this.callbacks.onConnectionStateChange?.(state!);
    };

    // Candidats ICE
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.sessionId) {
        console.log('🧊 Nouveau candidat ICE:', event.candidate);
        this.callbacks.onIceCandidate?.(event.candidate);
        
        // Envoyer le candidat ICE via la signalisation
        this.sendIceCandidateViaSignaling(event.candidate);
      }
    };

    // Changement d'état ICE
    this.peerConnection.oniceconnectionstatechange = () => {
      console.log('❄️ État ICE:', this.peerConnection?.iceConnectionState);
    };
  }

  /**
   * Ajouter le stream local à la connexion
   */
  async addLocalStream(constraints: MediaStreamConstraints = { video: true, audio: true }): Promise<MediaStream> {
    try {
      console.log('🎬 Demande d\'accès média avec contraintes:', constraints);
      
      // Vérifier la disponibilité des médias
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia non supporté par ce navigateur');
      }
      
      // Essayer d'abord avec les contraintes demandées
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (error) {
        console.warn('⚠️ Échec avec contraintes complètes, essai avec contraintes réduites:', error);
        // Fallback: essayer avec des contraintes plus simples
        this.localStream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 }, 
          audio: true 
        });
      }
      
      if (!this.localStream) {
        throw new Error('Impossible d\'obtenir le stream média');
      }
      
      console.log('✅ Stream média obtenu:', {
        streamId: this.localStream.id,
        tracks: this.localStream.getTracks().length,
        videoTracks: this.localStream.getVideoTracks().length,
        audioTracks: this.localStream.getAudioTracks().length,
        active: this.localStream.active
      });
      
      // Vérifier chaque track individuellement
      this.localStream.getTracks().forEach((track, index) => {
        console.log(`🎵 Track ${index}:`, {
          kind: track.kind,
          enabled: track.enabled,
          readyState: track.readyState,
          label: track.label,
          muted: track.muted,
          settings: track.getSettings()
        });
      });
      
      if (this.peerConnection) {
        // Vérifier l'état de la peer connection avant d'ajouter les tracks
        console.log('🔗 État PeerConnection avant ajout tracks:', this.peerConnection.connectionState);
        
        // Ajouter chaque track du stream local
        this.localStream.getTracks().forEach(track => {
          console.log('➕ Ajout track à PeerConnection:', {
            kind: track.kind,
            enabled: track.enabled,
            readyState: track.readyState
          });
          
          const sender = this.peerConnection!.addTrack(track, this.localStream!);
          console.log('📡 Sender créé:', {
            track: sender.track?.kind,
            dtmf: sender.dtmf !== null
          });
        });
        
        // Vérifier les senders après ajout
        const senders = this.peerConnection.getSenders();
        console.log('📡 Total senders actifs:', senders.length);
        senders.forEach((sender, index) => {
          console.log(`📡 Sender ${index}:`, {
            track: sender.track?.kind,
            enabled: sender.track?.enabled,
            readyState: sender.track?.readyState
          });
        });
        
        // Vérifier les transceivers
        const transceivers = this.peerConnection.getTransceivers();
        console.log('🔄 Transceivers:', transceivers.length);
        transceivers.forEach((transceiver, index) => {
          console.log(`🔄 Transceiver ${index}:`, {
            direction: transceiver.direction,
            currentDirection: transceiver.currentDirection,
            sender: transceiver.sender.track?.kind,
            receiver: transceiver.receiver.track?.kind
          });
        });
      }
      
      return this.localStream;
    } catch (error) {
      console.error('❌ Erreur ajout stream local:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Créer une offre (côté initiateur)
   */
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('PeerConnection non initialisée');
    }

    try {
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      await this.peerConnection.setLocalDescription(offer);
      console.log('📤 Offre créée:', offer);
      return offer;
    } catch (error) {
      console.error('❌ Erreur création offre:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Créer une réponse (côté récepteur)
   */
  async createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('PeerConnection non initialisée');
    }

    try {
      await this.peerConnection.setRemoteDescription(offer);
      
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      
      console.log('📥 Réponse créée:', answer);
      return answer;
    } catch (error) {
      console.error('❌ Erreur création réponse:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Définir la description distante
   */
  async setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('PeerConnection non initialisée');
    }

    try {
      await this.peerConnection.setRemoteDescription(description);
      console.log('✅ Description distante définie:', description.type);
    } catch (error) {
      console.error('❌ Erreur définition description distante:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Ajouter un candidat ICE
   */
  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('PeerConnection non initialisée');
    }

    try {
      await this.peerConnection.addIceCandidate(candidate);
      console.log('✅ Candidat ICE ajouté');
    } catch (error) {
      console.error('❌ Erreur ajout candidat ICE:', error);
      this.callbacks.onError?.(error as Error);
    }
  }

  /**
   * Activer/désactiver la vidéo
   */
  toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = enabled;
        console.log('📹 Vidéo:', enabled ? 'activée' : 'désactivée');
      }
    }
  }

  /**
   * Activer/désactiver l'audio
   */
  toggleAudio(enabled: boolean): void {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = enabled;
        console.log('🎤 Audio:', enabled ? 'activé' : 'désactivé');
      }
    }
  }

  /**
   * Obtenir l'état de la connexion
   */
  getConnectionState(): WebRTCConnection {
    return {
      localStream: this.localStream,
      remoteStream: null, // Sera mis à jour via le callback
      peerConnection: this.peerConnection,
      isConnected: this.peerConnection?.connectionState === 'connected'
    };
  }

  /**
   * Fermer la connexion
   */
  close(): void {
    // Arrêter l'écoute de la signalisation
    if (this.signalingUnsubscribe) {
      this.signalingUnsubscribe();
      this.signalingUnsubscribe = null;
    }

    // Arrêter le stream local
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Fermer la connexion peer
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    console.log('🔌 Connexion WebRTC fermée');
  }

  /**
   * Démarrer l'écoute de la signalisation Firebase
   */
  private startSignalingListener(): void {
    if (!this.sessionId) return;
    
    // Service de signalisation déjà importé
    const userType = this.isInitiator ? 'recruiter' : 'candidate';
    
    this.signalingUnsubscribe = WebRTCSignalingService.listenForSignalingData(
      this.sessionId,
      userType,
      this.handleSignalingData.bind(this)
    );
  }

  /**
   * Gérer les données de signalisation reçues
   */
  private async handleSignalingData(data: any): Promise<void> {
    try {
      switch (data.type) {
        case 'offer':
          if (!this.isInitiator) {
            await this.handleOffer(data.data);
          }
          break;
        case 'answer':
          if (this.isInitiator) {
            await this.handleAnswer(data.data);
          }
          break;
        case 'ice-candidate':
          await this.handleIceCandidate(data.data);
          break;
      }
    } catch (error) {
      console.error('❌ Erreur traitement signalisation:', error);
      this.callbacks.onError?.(error as Error);
    }
  }

  /**
   * Gérer une offre reçue (côté candidat)
   */
  private async handleOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('PeerConnection non initialisée');
    }

    try {
      console.log('📥 Réception offre:', {
        type: offer.type,
        sdpLength: offer.sdp?.length,
        hasVideo: offer.sdp?.includes('m=video'),
        hasAudio: offer.sdp?.includes('m=audio'),
        peerConnectionState: this.peerConnection.connectionState,
        signalingState: this.peerConnection.signalingState
      });
      
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      console.log('✅ Offre définie comme description distante');
      
      // Vérifier l'état après avoir défini la description distante
      console.log('🔍 État après setRemoteDescription:', {
        signalingState: this.peerConnection.signalingState,
        connectionState: this.peerConnection.connectionState,
        iceConnectionState: this.peerConnection.iceConnectionState
      });
      
      // Vérifier les transceivers créés
      const transceivers = this.peerConnection.getTransceivers();
      console.log('🔄 Transceivers après offre:', transceivers.length);
      transceivers.forEach((transceiver, index) => {
        console.log(`🔄 Transceiver ${index}:`, {
          direction: transceiver.direction,
          currentDirection: transceiver.currentDirection,
          mid: transceiver.mid,
          sender: {
            track: transceiver.sender.track?.kind,
            hasTrack: !!transceiver.sender.track
          },
          receiver: {
            track: transceiver.receiver.track?.kind,
            hasTrack: !!transceiver.receiver.track
          }
        });
      });

      // Créer la réponse sans refaire setRemoteDescription
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      
      console.log('📤 Réponse créée:', {
        type: answer.type,
        sdpLength: answer.sdp?.length,
        hasVideo: answer.sdp?.includes('m=video'),
        hasAudio: answer.sdp?.includes('m=audio')
      });
       
       // Envoyer la réponse via la signalisation
       const userType = this.callbacks.getUserType?.() || 'candidate';
       console.log('📨 Envoi réponse avec userType:', userType);
       await WebRTCSignalingService.sendAnswer(this.sessionId!, answer, userType);
      
      console.log('✅ Réponse WebRTC envoyée');
    } catch (error) {
      console.error('❌ Erreur traitement offre:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Gérer une réponse reçue
   */
  private async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) return;
    
    await this.peerConnection.setRemoteDescription(answer);
  }

  /**
   * Gérer un candidat ICE reçu
   */
  private async handleIceCandidate(candidateData: any): Promise<void> {
    if (!this.peerConnection) return;
    
    const candidate = new RTCIceCandidate(candidateData);
    await this.peerConnection.addIceCandidate(candidate);
  }

  /**
   * Envoyer un candidat ICE via la signalisation
   */
  private async sendIceCandidateViaSignaling(candidate: RTCIceCandidate): Promise<void> {
    if (!this.sessionId) return;
    
    const userType = this.isInitiator ? 'recruiter' : 'candidate';
    await WebRTCSignalingService.sendIceCandidate(this.sessionId, candidate, userType);
  }

  /**
   * Démarrer une connexion WebRTC réelle (remplace simulateConnection)
   */
  async startRealConnection(): Promise<void> {
    try {
      if (!this.sessionId || !this.peerConnection) {
        throw new Error('WebRTC non initialisé correctement');
      }

      if (this.isInitiator) {
        console.log('🚀 Démarrage connexion en tant qu\'initiateur (recruteur)');
        
        // Vérifier que les tracks sont bien ajoutés avant de créer l'offre
        const senders = this.peerConnection.getSenders();
        const transceivers = this.peerConnection.getTransceivers();
        
        console.log('🔍 Vérification avant création offre:', {
          senders: senders.length,
          transceivers: transceivers.length,
          localStreamTracks: this.localStream?.getTracks().length || 0,
          hasVideo: this.localStream?.getVideoTracks().length || 0,
          hasAudio: this.localStream?.getAudioTracks().length || 0,
          peerConnectionState: this.peerConnection.connectionState,
          signalingState: this.peerConnection.signalingState
        });
        
        // Vérifier chaque sender
        senders.forEach((sender, index) => {
          console.log(`📡 Sender ${index} avant offre:`, {
            hasTrack: !!sender.track,
            trackKind: sender.track?.kind,
            trackEnabled: sender.track?.enabled,
            trackReadyState: sender.track?.readyState
          });
        });
        
        if (senders.length === 0) {
          console.warn('⚠️ Aucun sender trouvé! Les tracks n\'ont peut-être pas été ajoutés correctement.');
        }
        
        const offer = await this.peerConnection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        });
        
        await this.peerConnection.setLocalDescription(offer);
        
        console.log('📤 Offre créée et définie:', {
          type: offer.type,
          sdpLength: offer.sdp?.length,
          hasVideo: offer.sdp?.includes('m=video'),
          hasAudio: offer.sdp?.includes('m=audio'),
          sdpPreview: offer.sdp?.substring(0, 200) + '...'
        });
        
        // Envoyer l'offre via la signalisation
      const userType = this.callbacks.getUserType?.() || 'recruiter';
      console.log('📨 Envoi offre via signalisation avec userType:', userType);
      await WebRTCSignalingService.sendOffer(this.sessionId!, offer, userType);
      } else {
        // Le candidat attend l'offre
        console.log('⏳ En attente de l\'offre WebRTC...');
      }
    } catch (error) {
      console.error('❌ Erreur démarrage connexion réelle:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Obtenir l'ID de session
   */
  getSessionId(): string | null {
    return this.sessionId;
  }
}

// Service singleton pour gérer la connexion WebRTC globale
export const webRTCService = new WebRTCService();