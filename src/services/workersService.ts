import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage, auth } from '../config/firebase';

export interface Worker {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string;
  status: 'active' | 'busy' | 'inactive';
  avatar: string | null;
  address?: string;
  birthDate?: Date | null;
  cvUrl?: string | null;
  cvAnalysis?: {
    extractedSkills: string[];
    experience: string[];
    education: string[];
    summary: string;
    recommendedJobs: string[];
  } | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Collection references
const WORKERS_COLLECTION = 'workers';

// Récupérer tous les intérimaires
export const getAllWorkers = async (): Promise<Worker[]> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');
    
    const workersQuery = query(
      collection(db, WORKERS_COLLECTION),
      where('userId', '==', user.uid)
    );
    
    const snapshot = await getDocs(workersQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Worker
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des intérimaires:', error);
    throw error;
  }
};

// Obtenir un intérimaire par son ID
export const getWorkerById = async (workerId: string): Promise<Worker | null> => {
  try {
    const docRef = doc(db, WORKERS_COLLECTION, workerId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data() as Worker
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'intérimaire:', error);
    throw error;
  }
};

// Créer un nouvel intérimaire
export const createWorker = async (worker: Omit<Worker, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');
    
    const docRef = await addDoc(collection(db, WORKERS_COLLECTION), {
      ...worker,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création de l\'intérimaire:', error);
    throw error;
  }
};

// Mettre à jour un intérimaire
export const updateWorker = async (workerId: string, updates: Partial<Worker>): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');
    
    const docRef = doc(db, WORKERS_COLLECTION, workerId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'intérimaire:', error);
    throw error;
  }
};

// Supprimer un intérimaire
export const deleteWorker = async (workerId: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');
    
    // Récupérer l'intérimaire pour vérifier s'il a un CV
    const worker = await getWorkerById(workerId);
    
    // Supprimer le CV du storage si existant
    if (worker?.cvUrl) {
      const cvRef = ref(storage, worker.cvUrl);
      await deleteObject(cvRef);
    }
    
    // Supprimer l'intérimaire de Firestore
    const docRef = doc(db, WORKERS_COLLECTION, workerId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'intérimaire:', error);
    throw error;
  }
};

// Uploader un CV
export const uploadCV = async (workerId: string, file: File): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');
    
    // Référence à l'emplacement où sera stocké le CV
    const cvRef = ref(storage, `cvs/${user.uid}/${workerId}/${file.name}`);
    
    // Upload du fichier
    await uploadBytes(cvRef, file);
    
    // Récupération de l'URL de téléchargement
    const downloadURL = await getDownloadURL(cvRef);
    
    // Mise à jour de l'intérimaire avec l'URL du CV
    await updateWorker(workerId, { cvUrl: downloadURL });
    
    return downloadURL;
  } catch (error) {
    console.error('Erreur lors de l\'upload du CV:', error);
    throw error;
  }
};

// Analyser un CV avec l'IA
export const analyzeCV = async (fileUrl: string, workerName: string): Promise<Worker['cvAnalysis']> => {
  try {
    // Simulation d'une analyse IA (à remplacer par un appel à une API d'IA réelle)
    // Dans une implémentation réelle, vous appelleriez une API comme GPT-4 ou Claude
    
    // Simuler un délai pour l'analyse
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      extractedSkills: ['Communication', 'Gestion de projet', 'Leadership'],
      experience: [
        'Développeur FullStack - Tech Solutions (2019-2023)',
        'Ingénieur Frontend - WebCreate (2016-2019)'
      ],
      education: [
        'Master en Informatique - Université de Paris (2016)',
        'Licence en Mathématiques - Université de Lyon (2014)'
      ],
      summary: `${workerName} est un professionnel expérimenté avec une solide formation en informatique. Son parcours démontre une progression constante et des compétences diversifiées.`,
      recommendedJobs: ['Développeur Frontend', 'Chef de Projet IT', 'Consultant Technique']
    };
  } catch (error) {
    console.error('Erreur lors de l\'analyse du CV:', error);
    throw error;
  }
};

// Exporter des intérimaires au format CSV
export const exportWorkersToCSV = (workers: Worker[]): string => {
  const headers = ['Prénom', 'Nom', 'Email', 'Téléphone', 'Compétences', 'Disponibilité', 'Statut'];
  
  const rows = workers.map(worker => [
    worker.firstName,
    worker.lastName,
    worker.email,
    worker.phone,
    worker.skills.join(', '),
    worker.availability,
    worker.status === 'active' ? 'Disponible' : 
      worker.status === 'busy' ? 'En mission' : 'Inactif'
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
}; 