import { db } from '../config/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';

export interface Mission {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  skills: string[];
  dailyRate: number;
  contactPerson: string;
  contactEmail: string;
  createdAt: Date;
}

export interface CreateMissionData {
  title: string;
  company: string;
  location: string;
  description: string;
  startDate: Date;
  endDate: Date;
  skills: string[];
  dailyRate: number;
  contactPerson: string;
  contactEmail: string;
}

const missionsCollection = collection(db, 'missions');

/**
 * Crée une nouvelle mission dans Firestore
 */
export const createMission = async (missionData: CreateMissionData, userId: string): Promise<string> => {
  if (!userId) {
    throw new Error('Utilisateur non authentifié');
  }

  try {
    const newMission = {
      ...missionData,
      status: 'open' as const,
      createdBy: userId,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(missionsCollection, newMission);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création de la mission:', error);
    throw error;
  }
};

/**
 * Récupère toutes les missions
 */
export const getMissions = async (userId: string): Promise<Mission[]> => {
  if (!userId) {
    throw new Error('Utilisateur non authentifié');
  }

  try {
    const q = query(missionsCollection, where('createdBy', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: data.startDate?.toDate(),
        endDate: data.endDate?.toDate(),
        createdAt: data.createdAt?.toDate(),
      } as Mission;
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des missions:', error);
    throw error;
  }
};

/**
 * Met à jour une mission existante
 */
export const updateMission = async (missionId: string, missionData: Partial<CreateMissionData>, userId: string): Promise<void> => {
  if (!userId) {
    throw new Error('Utilisateur non authentifié');
  }

  try {
    const missionRef = doc(db, 'missions', missionId);
    await updateDoc(missionRef, {
      ...missionData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la mission:', error);
    throw error;
  }
};

/**
 * Supprime une mission
 */
export const deleteMission = async (missionId: string, userId: string): Promise<void> => {
  if (!userId) {
    throw new Error('Utilisateur non authentifié');
  }

  try {
    const missionRef = doc(db, 'missions', missionId);
    await deleteDoc(missionRef);
  } catch (error) {
    console.error('Erreur lors de la suppression de la mission:', error);
    throw error;
  }
};

/**
 * Analyse un fichier de mission et extrait les informations
 */
export const analyzeMissionFile = async (file: File): Promise<Partial<CreateMissionData>> => {
  // Dans une application réelle, nous enverrions le fichier à un service d'IA 
  // pour extraire les informations pertinentes
  
  // Pour le moment, on simule une analyse avec un délai
  return new Promise((resolve) => {
    setTimeout(() => {
      // Extraction simulée basée sur le nom du fichier
      const fileName = file.name.toLowerCase();
      
      const extractedData: Partial<CreateMissionData> = {
        title: 'Mission extraite du fichier',
        company: fileName.includes('acme') ? 'ACME Corp' : 'Entreprise Non Identifiée',
        location: fileName.includes('paris') ? 'Paris' : 'Lyon',
        description: 'Description extraite du document. Cette mission nécessite une expertise en développement et en gestion de projet. Le candidat idéal possède une expérience significative dans le secteur.',
        skills: ['Développement', 'Gestion de projet', 'Communication'],
        dailyRate: 500,
      };
      
      resolve(extractedData);
    }, 1500);
  });
}; 