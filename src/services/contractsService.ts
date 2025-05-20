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
import { Candidate } from './candidatesService';

export interface Contract {
  id?: string;
  candidateId: string;
  candidateName: string;
  type: 'CDI' | 'CDD' | 'Stage' | 'Freelance';
  status: 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled';
  position: string;
  department: string;
  startDate: Date;
  endDate?: Date;
  salary: {
    amount: number;
    currency: string;
    period: 'monthly' | 'yearly' | 'daily' | 'hourly';
  };
  contractUrl?: string;
  signatureUrl?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  createdBy?: string;
}

// Collection references
const CONTRACTS_COLLECTION = 'contracts';

// Récupérer tous les contrats
export const getAllContracts = async (): Promise<Contract[]> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');
    
    const contractsQuery = query(
      collection(db, CONTRACTS_COLLECTION),
      where('createdBy', '==', user.uid)
    );
    
    const snapshot = await getDocs(contractsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Contract
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des contrats:', error);
    throw error;
  }
};

// Obtenir un contrat par son ID
export const getContractById = async (contractId: string): Promise<Contract | null> => {
  try {
    const docRef = doc(db, CONTRACTS_COLLECTION, contractId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data() as Contract
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du contrat:', error);
    throw error;
  }
};

// Créer un nouveau contrat
export const createContract = async (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');
    
    const docRef = await addDoc(collection(db, CONTRACTS_COLLECTION), {
      ...contract,
      createdBy: user.uid,
      status: 'draft',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création du contrat:', error);
    throw error;
  }
};

// Mettre à jour un contrat
export const updateContract = async (contractId: string, updates: Partial<Contract>): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');
    
    const docRef = doc(db, CONTRACTS_COLLECTION, contractId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du contrat:', error);
    throw error;
  }
};

// Supprimer un contrat
export const deleteContract = async (contractId: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');
    
    // Récupérer le contrat pour vérifier s'il a des fichiers associés
    const contract = await getContractById(contractId);
    
    // Supprimer les fichiers du storage si existants
    if (contract?.contractUrl) {
      const contractFileRef = ref(storage, contract.contractUrl);
      await deleteObject(contractFileRef);
    }
    
    if (contract?.signatureUrl) {
      const signatureFileRef = ref(storage, contract.signatureUrl);
      await deleteObject(signatureFileRef);
    }
    
    // Supprimer le contrat de Firestore
    const docRef = doc(db, CONTRACTS_COLLECTION, contractId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Erreur lors de la suppression du contrat:', error);
    throw error;
  }
};

// Uploader un fichier de contrat
export const uploadContractFile = async (contractId: string, file: File): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');
    
    // Référence à l'emplacement où sera stocké le fichier
    const contractRef = ref(storage, `contracts/${user.uid}/${contractId}/${file.name}`);
    
    // Upload du fichier
    await uploadBytes(contractRef, file);
    
    // Récupération de l'URL de téléchargement
    const downloadURL = await getDownloadURL(contractRef);
    
    // Mise à jour du contrat avec l'URL du fichier
    await updateContract(contractId, { contractUrl: downloadURL });
    
    return downloadURL;
  } catch (error) {
    console.error('Erreur lors de l\'upload du fichier de contrat:', error);
    throw error;
  }
};

// Générer un contrat à partir d'un modèle
export const generateContract = async (
  candidate: Candidate, 
  position: string,
  contractType: 'CDI' | 'CDD' | 'Stage' | 'Freelance',
  startDate: Date,
  endDate: Date | null,
  salary: {
    amount: number;
    currency: string;
    period: 'monthly' | 'yearly' | 'daily' | 'hourly';
  },
  department: string
): Promise<string> => {
  try {
    // Simulation de génération de contrat
    console.log(`Génération d'un contrat pour ${candidate.firstName} ${candidate.lastName}`);
    
    // Simuler un délai pour la génération
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Créer un nouveau contrat dans Firestore
    const contractData = {
      candidateId: candidate.id || '',
      candidateName: `${candidate.firstName} ${candidate.lastName}`,
      type: contractType,
      position,
      department,
      startDate,
      endDate: endDate || undefined,
      salary,
      status: 'draft' as const
    };
    
    const contractId = await createContract(contractData);
    
    // Dans une version réelle, ici on appellerait un service externe pour générer un PDF
    // puis on l'uploaderait vers Firebase Storage
    
    return contractId;
  } catch (error) {
    console.error('Erreur lors de la génération du contrat:', error);
    throw error;
  }
};

// Envoyer un contrat pour signature
export const sendContractForSignature = async (contractId: string): Promise<void> => {
  try {
    // Simulation d'envoi de contrat
    console.log(`Envoi du contrat ${contractId} pour signature`);
    
    // Simuler un délai pour l'envoi
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mettre à jour le statut du contrat
    await updateContract(contractId, { status: 'sent' });
    
    // Dans une version réelle, ici on enverrait un email ou une notification
  } catch (error) {
    console.error('Erreur lors de l\'envoi du contrat pour signature:', error);
    throw error;
  }
};

// Marquer un contrat comme signé
export const markContractAsSigned = async (contractId: string, signatureFile?: File): Promise<void> => {
  try {
    // Si un fichier de signature est fourni, l'uploader
    let signatureUrl;
    if (signatureFile) {
      const user = auth.currentUser;
      if (!user) throw new Error('Utilisateur non authentifié');
      
      const signatureRef = ref(storage, `signatures/${user.uid}/${contractId}/${signatureFile.name}`);
      await uploadBytes(signatureRef, signatureFile);
      signatureUrl = await getDownloadURL(signatureRef);
    }
    
    // Mettre à jour le statut du contrat
    await updateContract(contractId, { 
      status: 'signed',
      signatureUrl
    });
  } catch (error) {
    console.error('Erreur lors du marquage du contrat comme signé:', error);
    throw error;
  }
}; 