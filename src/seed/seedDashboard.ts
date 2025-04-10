// Script pour générer des données de test pour le dashboard
// À exécuter manuellement en environnement de développement

import { 
  collection, 
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Types
interface Worker {
  name: string;
  email: string;
  phone: string;
  position: string;
  status: 'active' | 'inactive';
  skills: string[];
  userId: string;
}

interface Mission {
  title: string;
  client: string;
  date: Date;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  workersCount: number;
  workers: string[];
  createdBy: string;
  description: string;
  location: string;
}

interface Document {
  title: string;
  type: 'contract' | 'payslip' | 'certificate' | 'invoice';
  status: 'pending' | 'approved' | 'rejected';
  relatedTo: string;
  createdBy: string;
  description: string;
}

interface Activity {
  type: 'mission' | 'worker' | 'document' | 'payment';
  title: string;
  description: string;
  status: 'success' | 'warning' | 'error';
  userId: string;
  createdBy: {
    id: string;
    name: string;
  };
}

// Collection references
const ACTIVITIES_COLLECTION = 'activities';
const MISSIONS_COLLECTION = 'missions';
const WORKERS_COLLECTION = 'workers';
const DOCUMENTS_COLLECTION = 'documents';

// Créer un travailleur
const createWorker = async (worker: Worker): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, WORKERS_COLLECTION), {
      ...worker,
      createdAt: serverTimestamp()
    });
    console.log(`Travailleur créé avec ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création du travailleur:', error);
    throw error;
  }
};

// Créer une mission
const createMission = async (mission: Mission): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, MISSIONS_COLLECTION), {
      ...mission,
      createdAt: serverTimestamp()
    });
    console.log(`Mission créée avec ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création de la mission:', error);
    throw error;
  }
};

// Créer un document
const createDocument = async (document: Document): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, DOCUMENTS_COLLECTION), {
      ...document,
      createdAt: serverTimestamp()
    });
    console.log(`Document créé avec ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création du document:', error);
    throw error;
  }
};

// Créer une activité
const createActivity = async (activity: Activity): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, ACTIVITIES_COLLECTION), {
      ...activity,
      timestamp: serverTimestamp()
    });
    console.log(`Activité créée avec ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création de l\'activité:', error);
    throw error;
  }
};

// Générer les données de test
const seedDashboardData = async (userId: string): Promise<void> => {
  if (!userId) {
    console.error('ID utilisateur requis pour générer les données de test');
    return;
  }

  console.log('Génération des données de test pour le dashboard...');

  // 1. Créer des travailleurs
  const workers: Worker[] = [
    {
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      phone: '0123456789',
      position: 'Soudeur',
      status: 'active',
      skills: ['Soudure TIG', 'Soudure MIG'],
      userId: userId
    },
    {
      name: 'Marie Martin',
      email: 'marie.martin@example.com',
      phone: '0987654321',
      position: 'Électricienne',
      status: 'active',
      skills: ['Installation électrique', 'Dépannage'],
      userId: userId
    },
    {
      name: 'Paul Bernard',
      email: 'paul.bernard@example.com',
      phone: '0678912345',
      position: 'Manutentionnaire',
      status: 'active',
      skills: ['Conduite de chariot élévateur', 'Gestion de stock'],
      userId: userId
    },
    {
      name: 'Sophie Legrand',
      email: 'sophie.legrand@example.com',
      phone: '0654321987',
      position: 'Développeuse Web',
      status: 'active',
      skills: ['React', 'TypeScript', 'Node.js'],
      userId: userId
    },
    {
      name: 'Thomas Petit',
      email: 'thomas.petit@example.com',
      phone: '0612345678',
      position: 'Plombier',
      status: 'inactive',
      skills: ['Installation sanitaire', 'Réparation'],
      userId: userId
    }
  ];

  const workerIds: string[] = [];
  for (const worker of workers) {
    const id = await createWorker(worker);
    workerIds.push(id);
  }

  // 2. Créer des missions
  const currentDate = new Date();
  const missions: Mission[] = [
    {
      title: 'Soudeur TIG',
      client: 'Industrie Métallique SA',
      date: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000), // dans 7 jours
      status: 'confirmed',
      workersCount: 3,
      workers: workerIds.slice(0, 3),
      createdBy: userId,
      description: 'Soudure de pièces métalliques pour un projet industriel',
      location: 'Lyon, France'
    },
    {
      title: 'Manutentionnaire',
      client: 'Logistique Express',
      date: new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000), // dans 14 jours
      status: 'pending',
      workersCount: 5,
      workers: workerIds,
      createdBy: userId,
      description: 'Chargement et déchargement de marchandises',
      location: 'Paris, France'
    },
    {
      title: 'Électricien',
      client: 'BTP Solutions',
      date: new Date(currentDate.getTime() + 21 * 24 * 60 * 60 * 1000), // dans 21 jours
      status: 'confirmed',
      workersCount: 2,
      workers: workerIds.slice(1, 3),
      createdBy: userId,
      description: 'Installation électrique sur un chantier de construction',
      location: 'Marseille, France'
    },
    {
      title: 'Développeur Web',
      client: 'Tech Innovations',
      date: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000), // dans 30 jours
      status: 'pending',
      workersCount: 1,
      workers: [workerIds[3]],
      createdBy: userId,
      description: 'Développement d\'une application web pour un client',
      location: 'Nantes, France'
    },
    {
      title: 'Plombier',
      client: 'Habitat Confort',
      date: new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000), // il y a 14 jours
      status: 'completed',
      workersCount: 1,
      workers: [workerIds[4]],
      createdBy: userId,
      description: 'Rénovation complète de salle de bain',
      location: 'Bordeaux, France'
    }
  ];

  const missionIds: string[] = [];
  for (const mission of missions) {
    const id = await createMission(mission);
    missionIds.push(id);
  }

  // 3. Créer des documents
  const documents: Document[] = [
    {
      title: 'Contrat de mission #12345',
      type: 'contract',
      status: 'pending',
      relatedTo: missionIds[0],
      createdBy: userId,
      description: 'Contrat de mission pour le poste de soudeur TIG'
    },
    {
      title: 'Fiche de paie - Mars 2024',
      type: 'payslip',
      status: 'approved',
      relatedTo: workerIds[0],
      createdBy: userId,
      description: 'Fiche de paie pour Jean Dupont'
    },
    {
      title: 'Attestation Pôle Emploi',
      type: 'certificate',
      status: 'pending',
      relatedTo: workerIds[1],
      createdBy: userId,
      description: 'Attestation pour Marie Martin'
    },
    {
      title: 'Facture client #789',
      type: 'invoice',
      status: 'pending',
      relatedTo: missionIds[2],
      createdBy: userId,
      description: 'Facture pour BTP Solutions'
    },
    {
      title: 'Avenant au contrat',
      type: 'contract',
      status: 'pending',
      relatedTo: missionIds[1],
      createdBy: userId,
      description: 'Avenant au contrat pour la mission de manutention'
    }
  ];

  for (const document of documents) {
    await createDocument(document);
  }

  // 4. Créer des activités
  const activities: Activity[] = [
    {
      type: 'mission',
      title: 'Nouvelle mission créée',
      description: 'Soudeur TIG - Industrie Métallique SA',
      status: 'success',
      userId: userId,
      createdBy: {
        id: userId,
        name: 'Sophie Martin'
      }
    },
    {
      type: 'worker',
      title: 'Nouvel intérimaire inscrit',
      description: 'Jean Dupont - Soudeur',
      status: 'success',
      userId: userId,
      createdBy: {
        id: userId,
        name: 'Marc Lefebvre'
      }
    },
    {
      type: 'document',
      title: 'Document en attente',
      description: 'Contrat de mission #12345',
      status: 'warning',
      userId: userId,
      createdBy: {
        id: userId,
        name: 'Léa Dubois'
      }
    },
    {
      type: 'mission',
      title: 'Mission terminée',
      description: 'Électricien - BTP Solutions',
      status: 'success',
      userId: userId,
      createdBy: {
        id: userId,
        name: 'Thomas Bernard'
      }
    },
    {
      type: 'payment',
      title: 'Paiement effectué',
      description: 'Facture #456 - 1250€',
      status: 'success',
      userId: userId,
      createdBy: {
        id: userId,
        name: 'Julie Moreau'
      }
    }
  ];

  for (const activity of activities) {
    await createActivity(activity);
  }

  console.log('Génération des données de test terminée !');
};

// Exemple d'utilisation:
// seedDashboardData('votre_user_id');

export default seedDashboardData; 