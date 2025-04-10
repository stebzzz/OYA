import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export interface ChatMessage {
  id?: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date | Timestamp;
  userId: string;
  sessionId: string;
  isLoading?: boolean;
}

export interface ChatSession {
  id?: string;
  title: string;
  date: Date | Timestamp;
  preview: string;
  userId: string;
  lastUpdated: Date | Timestamp;
}

// Collection references
const MESSAGES_COLLECTION = 'messages';
const SESSIONS_COLLECTION = 'chatSessions';

// Message functions
export const createMessage = async (message: Omit<ChatMessage, 'id'>) => {
  try {
    // S'assurer que l'utilisateur est connecté
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');

    const messageData = {
      ...message,
      timestamp: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), messageData);
    return { id: docRef.id, ...messageData };
  } catch (error) {
    console.error('Erreur lors de la création du message:', error);
    throw error;
  }
};

export const getMessages = async (sessionId: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');

    const messagesQuery = query(
      collection(db, MESSAGES_COLLECTION),
      where('sessionId', '==', sessionId),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'asc')
    );

    const snapshot = await getDocs(messagesQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[];
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    throw error;
  }
};

// Session functions
export const createChatSession = async (session: Omit<ChatSession, 'id'>) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');

    const sessionData = {
      ...session,
      userId: user.uid,
      date: serverTimestamp(),
      lastUpdated: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), sessionData);
    return { id: docRef.id, ...sessionData };
  } catch (error) {
    console.error('Erreur lors de la création de la session:', error);
    throw error;
  }
};

export const getChatSessions = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');

    const sessionsQuery = query(
      collection(db, SESSIONS_COLLECTION),
      where('userId', '==', user.uid),
      orderBy('lastUpdated', 'desc')
    );

    const snapshot = await getDocs(sessionsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatSession[];
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions:', error);
    throw error;
  }
};

export const updateChatSession = async (sessionId: string, data: Partial<ChatSession>) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');

    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    
    await updateDoc(sessionRef, {
      ...data,
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la session:', error);
    throw error;
  }
};

export const deleteChatSession = async (sessionId: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');

    // Supprimer la session
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await deleteDoc(sessionRef);

    // Supprimer tous les messages associés à cette session
    const messagesQuery = query(
      collection(db, MESSAGES_COLLECTION),
      where('sessionId', '==', sessionId),
      where('userId', '==', user.uid)
    );

    const snapshot = await getDocs(messagesQuery);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Erreur lors de la suppression de la session:', error);
    throw error;
  }
}; 