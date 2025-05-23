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

export interface Candidate {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string;
  status: 'available' | 'interviewing' | 'hired' | 'inactive';
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
    marketValue?: {
      min: number;
      max: number;
      currency: string;
    }
  } | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  linkedinProfile?: string;
}

export interface Worker {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string;
  status: 'available' | 'working' | 'unavailable';
  avatar: string | null;
  address?: string;
  birthDate?: Date | null;
  hourlyRate?: number;
  preferredDistance?: number;
  experience: string[];
  rating?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Collection references
const CANDIDATES_COLLECTION = 'candidates';
const WORKERS_COLLECTION = 'workers';

// Récupérer tous les candidats
export const getAllCandidates = async (): Promise<Candidate[]> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');
    
    const candidatesQuery = query(
      collection(db, CANDIDATES_COLLECTION),
      where('userId', '==', user.uid)
    );
    
    const snapshot = await getDocs(candidatesQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Candidate
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des candidats:', error);
    throw error;
  }
};

// Obtenir un candidat par son ID
export const getCandidateById = async (candidateId: string): Promise<Candidate | null> => {
  try {
    const docRef = doc(db, CANDIDATES_COLLECTION, candidateId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data() as Candidate
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du candidat:', error);
    throw error;
  }
};

// Créer un nouveau candidat
export const createCandidate = async (candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');
    
    const docRef = await addDoc(collection(db, CANDIDATES_COLLECTION), {
      ...candidate,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création du candidat:', error);
    throw error;
  }
};

// Mettre à jour un candidat
export const updateCandidate = async (candidateId: string, updates: Partial<Candidate>): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');
    
    const docRef = doc(db, CANDIDATES_COLLECTION, candidateId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du candidat:', error);
    throw error;
  }
};

// Supprimer un candidat
export const deleteCandidate = async (candidateId: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');
    
    // Récupérer le candidat pour vérifier s'il a un CV
    const candidate = await getCandidateById(candidateId);
    
    // Supprimer le CV du storage si existant
    if (candidate?.cvUrl) {
      const cvRef = ref(storage, candidate.cvUrl);
      await deleteObject(cvRef);
    }
    
    // Supprimer le candidat de Firestore
    const docRef = doc(db, CANDIDATES_COLLECTION, candidateId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Erreur lors de la suppression du candidat:', error);
    throw error;
  }
};

// Uploader un CV
export const uploadCV = async (candidateId: string, file: File): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');
    
    // Référence à l'emplacement où sera stocké le CV
    const cvRef = ref(storage, `cvs/${user.uid}/${candidateId}/${file.name}`);
    
    // Upload du fichier
    await uploadBytes(cvRef, file);
    
    // Récupération de l'URL de téléchargement
    const downloadURL = await getDownloadURL(cvRef);
    
    // Mise à jour du candidat avec l'URL du CV
    await updateCandidate(candidateId, { cvUrl: downloadURL });
    
    return downloadURL;
  } catch (error) {
    console.error('Erreur lors de l\'upload du CV:', error);
    throw error;
  }
};

// Analyser un CV avec l'IA
export const analyzeCV = async (fileUrl: string, candidateName: string): Promise<Candidate['cvAnalysis']> => {
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
      summary: `${candidateName} est un professionnel expérimenté avec une solide formation en informatique. Son parcours démontre une progression constante et des compétences diversifiées.`,
      recommendedJobs: ['Développeur Frontend', 'Chef de Projet IT', 'Consultant Technique'],
      marketValue: {
        min: 45000,
        max: 60000,
        currency: 'EUR'
      }
    };
  } catch (error) {
    console.error('Erreur lors de l\'analyse du CV:', error);
    throw error;
  }
};

// Exporter des candidats au format CSV
export const exportCandidatesToCSV = (candidates: Candidate[]): string => {
  const headers = ['Prénom', 'Nom', 'Email', 'Téléphone', 'Compétences', 'Disponibilité', 'Statut'];
  
  const rows = candidates.map(candidate => [
    candidate.firstName,
    candidate.lastName,
    candidate.email,
    candidate.phone,
    candidate.skills.join(', '),
    candidate.availability,
    candidate.status === 'available' ? 'Disponible' : 
      candidate.status === 'interviewing' ? 'En entretien' :
      candidate.status === 'hired' ? 'Recruté' : 'Inactif'
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
};

// Rechercher des candidats sur LinkedIn (simulation)
export const searchLinkedInProfiles = async (criteria: {
  skills: string[];
  location?: string;
  jobTitle?: string;
}): Promise<Partial<Candidate>[]> => {
  // Simulation d'une recherche LinkedIn - à remplacer par une API LinkedIn réelle
  console.log('Recherche de profils LinkedIn avec critères:', criteria);
  
  // Simuler un délai pour la recherche
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Générer des profils fictifs basés sur les critères
  return Array(5).fill(0).map((_, index) => ({
    firstName: `Prénom${index+1}`,
    lastName: `Nom${index+1}`,
    linkedinProfile: `https://linkedin.com/in/profile${index+1}`,
    skills: [...criteria.skills, 'Compétence additionnelle'],
    status: 'available' as const
  }));
};

// Estimer la valeur salariale d'un candidat
export const estimateCandidateValue = async (candidate: Candidate): Promise<{
  min: number;
  max: number;
  currency: string;
  marketAnalysis: string;
}> => {
  // Simulation d'une estimation par IA - à remplacer par un appel d'API
  const skills = candidate.skills || [];
  const experience = candidate.cvAnalysis?.experience || [];
  
  // Simuler un délai pour l'analyse
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Calcul fictif basé sur les compétences et l'expérience
  const baseValue = 40000;
  const skillBonus = skills.length * 1000;
  const expBonus = experience.length * 5000;
  
  return {
    min: baseValue + skillBonus,
    max: baseValue + skillBonus + expBonus,
    currency: 'EUR',
    marketAnalysis: `Basé sur le profil de ${candidate.firstName}, l'analyse du marché indique une valorisation entre ${baseValue + skillBonus}€ et ${baseValue + skillBonus + expBonus}€ annuels. Ce candidat possède des compétences recherchées comme ${skills.slice(0, 3).join(', ')} qui sont très demandées sur le marché actuel.`
  };
};

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
    
    const docRef = doc(db, WORKERS_COLLECTION, workerId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'intérimaire:', error);
    throw error;
  }
};

// Trouver des missions qui correspondent aux compétences d'un intérimaire
export const findMatchingMissions = async (workerId: string): Promise<any[]> => {
  try {
    const worker = await getWorkerById(workerId);
    if (!worker) throw new Error('Intérimaire non trouvé');
    
    // Simulation de missions correspondantes
    return [
      {
        id: 'mission1',
        title: 'Développeur Frontend React',
        company: 'TechCorp',
        location: 'Paris',
        duration: '3 mois',
        hourlyRate: 35,
        skills: ['React', 'JavaScript', 'CSS'],
        matchScore: 92
      },
      {
        id: 'mission2',
        title: 'Développeur FullStack Node.js',
        company: 'StartupInno',
        location: 'Lyon',
        duration: '6 mois',
        hourlyRate: 40,
        skills: ['Node.js', 'Express', 'MongoDB'],
        matchScore: 85
      },
      {
        id: 'mission3',
        title: 'Intégrateur Web',
        company: 'DesignStudio',
        location: 'Bordeaux',
        duration: '2 mois',
        hourlyRate: 30,
        skills: ['HTML', 'CSS', 'JavaScript'],
        matchScore: 78
      }
    ];
  } catch (error) {
    console.error('Erreur lors de la recherche de missions correspondantes:', error);
    throw error;
  }
};

// Générer des données de test pour les intérimaires
export const generateSampleWorkers = async (count: number = 5): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');
    
    const firstNames = ['Jean', 'Marie', 'Thomas', 'Sophie', 'Lucas', 'Julie', 'Pierre', 'Camille'];
    const lastNames = ['Martin', 'Dubois', 'Robert', 'Petit', 'Richard', 'Durand', 'Leroy', 'Moreau'];
    const skillsSets = [
      ['JavaScript', 'React', 'CSS'],
      ['PHP', 'Laravel', 'MySQL'],
      ['Java', 'Spring', 'Hibernate'],
      ['Python', 'Django', 'PostgreSQL'],
      ['C#', '.NET', 'Azure'],
      ['Ruby', 'Rails', 'Redis']
    ];
    
    const statuses: Worker['status'][] = ['available', 'working', 'unavailable'];
    
    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const skills = skillsSets[Math.floor(Math.random() * skillsSets.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      await createWorker({
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phone: `0${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
        skills,
        availability: status === 'available' ? 'Immédiate' : status === 'working' ? 'Dans 3 mois' : 'À déterminer',
        status,
        avatar: null,
        hourlyRate: 25 + Math.floor(Math.random() * 20),
        preferredDistance: 20 + Math.floor(Math.random() * 30),
        experience: [
          `${Math.floor(Math.random() * 3) + 1} ans - Développeur chez TechCorp`,
          `${Math.floor(Math.random() * 2) + 1} ans - Ingénieur chez InnoSoft`
        ],
        rating: 3 + Math.random() * 2
      });
    }
  } catch (error) {
    console.error('Erreur lors de la génération des intérimaires de test:', error);
    throw error;
  }
}; 