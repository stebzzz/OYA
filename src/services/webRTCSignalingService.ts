import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface SignalingData {
  id?: string;
  sessionId: string;
  type: 'offer' | 'answer' | 'ice-candidate';
  data: any;
  from: 'recruiter' | 'candidate';
  to: 'recruiter' | 'candidate';
  timestamp: Timestamp;
  processed?: boolean;
}

export class WebRTCSignalingService {
  private static readonly COLLECTION_NAME = 'webrtc_signaling';
  private unsubscribes: (() => void)[] = [];

  /**
   * Envoyer des données de signalisation
   */
  static async sendSignalingData(data: Omit<SignalingData, 'id' | 'timestamp'>): Promise<void> {
    try {
      const signalingData: Omit<SignalingData, 'id'> = {
        ...data,
        timestamp: Timestamp.now()
      };

      const docRef = doc(collection(db, this.COLLECTION_NAME));
      await setDoc(docRef, signalingData);
      
      console.log('📡 Données de signalisation envoyées:', data.type, 'de', data.from, 'vers', data.to);
    } catch (error) {
      console.error('❌ Erreur envoi signalisation:', error);
      throw error;
    }
  }

  /**
   * Écouter les données de signalisation pour une session
   */
  static listenForSignalingData(
    sessionId: string, 
    userType: 'recruiter' | 'candidate',
    onData: (data: SignalingData) => void
  ): () => void {
    console.log('👂 Démarrage écoute signalisation pour session:', sessionId, 'en tant que:', userType);
    
    const q = collection(db, this.COLLECTION_NAME);
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('📬 Changements détectés dans la signalisation:', snapshot.docChanges().length, 'changements');
      
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = { id: change.doc.id, ...change.doc.data() } as SignalingData;
          
          console.log('🔍 Message reçu:', {
            id: data.id,
            sessionId: data.sessionId,
            type: data.type,
            from: data.from,
            to: data.to,
            processed: data.processed,
            targetSession: sessionId,
            targetUser: userType
          });
          
          // Filtrer les messages pour cette session et destinés à cet utilisateur
          if (data.sessionId === sessionId && data.to === userType && !data.processed) {
            console.log('✅ Message valide reçu:', data.type, 'de', data.from, 'vers', data.to);
            onData(data);
            
            // Marquer comme traité
            this.markAsProcessed(data.id!);
          } else {
            console.log('❌ Message filtré:', {
              messageSessionId: data.sessionId,
              targetSessionId: sessionId,
              sessionMatch: data.sessionId === sessionId,
              messageTo: data.to,
              targetUserType: userType,
              userMatch: data.to === userType,
              messageProcessed: data.processed,
              notProcessed: !data.processed,
              reason: data.sessionId !== sessionId ? 'Session mismatch' : 
                     data.to !== userType ? 'User type mismatch' : 
                     data.processed ? 'Already processed' : 'Unknown'
            });
          }
        }
      });
    }, (error) => {
      console.error('❌ Erreur écoute signalisation:', error);
    });

    return unsubscribe;
  }

  /**
   * Marquer un message de signalisation comme traité
   */
  private static async markAsProcessed(messageId: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, messageId);
      await updateDoc(docRef, { processed: true });
    } catch (error) {
      console.error('❌ Erreur marquage message traité:', error);
    }
  }

  /**
   * Nettoyer les anciens messages de signalisation
   */
  static async cleanupOldMessages(sessionId: string): Promise<void> {
    try {
      // Cette méthode pourrait être appelée à la fin d'un entretien
      // pour nettoyer les messages de signalisation
      console.log('🧹 Nettoyage des messages de signalisation pour la session:', sessionId);
    } catch (error) {
      console.error('❌ Erreur nettoyage messages:', error);
    }
  }

  /**
   * Envoyer une offre WebRTC
   */
  static async sendOffer(sessionId: string, offer: RTCSessionDescriptionInit, from: 'recruiter' | 'candidate' = 'recruiter'): Promise<void> {
    const to = from === 'recruiter' ? 'candidate' : 'recruiter';
    await this.sendSignalingData({
      sessionId,
      type: 'offer',
      data: offer,
      from,
      to
    });
  }

  /**
   * Envoyer une réponse WebRTC
   */
  static async sendAnswer(sessionId: string, answer: RTCSessionDescriptionInit, from: 'recruiter' | 'candidate'): Promise<void> {
    const to = from === 'recruiter' ? 'candidate' : 'recruiter';
    await this.sendSignalingData({
      sessionId,
      type: 'answer',
      data: answer,
      from,
      to
    });
  }

  /**
   * Envoyer un candidat ICE
   */
  static async sendIceCandidate(
    sessionId: string, 
    candidate: RTCIceCandidate, 
    from: 'recruiter' | 'candidate'
  ): Promise<void> {
    await this.sendSignalingData({
      sessionId,
      type: 'ice-candidate',
      data: {
        candidate: candidate.candidate,
        sdpMLineIndex: candidate.sdpMLineIndex,
        sdpMid: candidate.sdpMid
      },
      from,
      to: from === 'recruiter' ? 'candidate' : 'recruiter'
    });
  }
}