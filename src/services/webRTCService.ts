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
      console.log('📺 Stream distant reçu:', event.streams[0]);
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
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (this.peerConnection) {
        // Ajouter chaque track du stream local
        this.localStream.getTracks().forEach(track => {
          this.peerConnection!.addTrack(track, this.localStream!);
        });
      }
      
      console.log('✅ Stream local ajouté:', this.localStream);
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
   * Gérer une offre reçue
   */
  private async handleOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) return;
    
    await this.peerConnection.setRemoteDescription(offer);
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    
    // Envoyer la réponse via la signalisation
    await WebRTCSignalingService.sendAnswer(this.sessionId!, answer);
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
        // Le recruteur crée l'offre
        const offer = await this.peerConnection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        });
        
        await this.peerConnection.setLocalDescription(offer);
        
        // Envoyer l'offre via la signalisation
        await WebRTCSignalingService.sendOffer(this.sessionId, offer);
        
        console.log('📤 Offre WebRTC envoyée');
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