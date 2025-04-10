import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit, 
  getDocs,
  getDoc,
  doc,
  Timestamp,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { getMissions } from './missionsService';
import { getAuth } from 'firebase/auth';

// Types des données du tableau de bord
export interface DashboardStats {
  activeWorkers: number;
  activeMissions: number;
  hoursWorked: number;
  pendingDocuments: number;
  trends: {
    workers: string;
    missions: string;
    hours: string;
    documents: string;
  };
}

export interface Activity {
  id?: string;
  type: 'mission' | 'worker' | 'document' | 'payment';
  title: string;
  description: string;
  timestamp: Date | Timestamp;
  status: 'success' | 'warning' | 'error';
  userId: string;
  createdBy?: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

export interface Mission {
  id?: string;
  title: string;
  client: string;
  date: Date | Timestamp;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  workersCount: number;
  workers: string[]; // IDs des travailleurs assignés
  createdBy: string;
  createdAt: Date | Timestamp;
}

export interface JobCategory {
  name: string;
  percentage: number;
  count: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

// Collection references
const STATS_COLLECTION = 'dashboardStats';
const ACTIVITIES_COLLECTION = 'activities';
const MISSIONS_COLLECTION = 'missions';
const WORKERS_COLLECTION = 'workers';
const DOCUMENTS_COLLECTION = 'documents';

// Récupérer les statistiques du tableau de bord
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');

    // Dans une implémentation réelle, vous pourriez stocker les statistiques dans un document
    // ou les calculer à partir des collections existantes

    // Pour l'exemple, nous allons simuler un calcul basé sur les données des collections
    const workersQuery = query(
      collection(db, WORKERS_COLLECTION),
      where('status', '==', 'active')
    );
    const workersSnapshot = await getDocs(workersQuery);
    const activeWorkers = workersSnapshot.size;

    const missionsQuery = query(
      collection(db, MISSIONS_COLLECTION),
      where('status', 'in', ['confirmed', 'pending']),
      where('date', '>=', new Date())
    );
    const missionsSnapshot = await getDocs(missionsQuery);
    const activeMissions = missionsSnapshot.size;

    // Calculer les heures travaillées (à adapter selon votre modèle de données)
    let hoursWorked = 0;
    const completedMissionsQuery = query(
      collection(db, MISSIONS_COLLECTION),
      where('status', '==', 'completed')
    );
    const completedMissionsSnapshot = await getDocs(completedMissionsQuery);
    // Dans cet exemple, on simule un calcul - à adapter à votre modèle de données réel
    hoursWorked = completedMissionsSnapshot.size * 8; // 8 heures par mission en moyenne

    // Documents en attente
    const pendingDocsQuery = query(
      collection(db, DOCUMENTS_COLLECTION),
      where('status', '==', 'pending')
    );
    const pendingDocsSnapshot = await getDocs(pendingDocsQuery);
    const pendingDocuments = pendingDocsSnapshot.size;

    // Calculer les tendances (à adapter selon votre logique métier)
    // Dans cet exemple, nous simulons des tendances
    const trends = {
      workers: activeWorkers > 120 ? '+4,75%' : '-2,30%',
      missions: activeMissions > 10 ? '+1,25%' : '-0,75%',
      hours: hoursWorked > 1000 ? '+2,35%' : '-1,40%',
      documents: pendingDocuments > 3 ? '+3,15%' : '-1,75%'
    };

    return {
      activeWorkers,
      activeMissions,
      hoursWorked,
      pendingDocuments,
      trends
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
};

// Récupérer les activités récentes
export const getRecentActivities = async (limitCount: number = 5): Promise<Activity[]> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');

    const activitiesQuery = query(
      collection(db, ACTIVITIES_COLLECTION),
      orderBy('timestamp', 'desc'),
      firestoreLimit(limitCount)
    );

    const snapshot = await getDocs(activitiesQuery);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp instanceof Timestamp 
          ? data.timestamp.toDate() 
          : new Date(data.timestamp)
      } as Activity;
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des activités récentes:', error);
    throw error;
  }
};

// Récupérer les missions à venir
export const getUpcomingMissions = async (limit = 5): Promise<Mission[]> => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    
    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }
    
    // Récupérer les missions depuis Firebase
    const missions = await getMissions(userId);
    
    // Filtrer les missions ouvertes et les trier par date de début
    const upcomingMissions = missions
      .filter(mission => mission.status === 'open')
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .slice(0, limit);
    
    // Mapper les missions au format attendu par le tableau de bord
    return upcomingMissions.map(mission => ({
      id: mission.id,
      title: mission.title,
      client: mission.company,
      date: mission.startDate,
      status: mission.status === 'open' ? 'pending' : 
              mission.status === 'in-progress' ? 'confirmed' : 
              mission.status === 'completed' ? 'completed' : 'cancelled',
      workersCount: 0, // Placeholder pour le nombre de travailleurs
      workers: [], // Placeholder pour les IDs des travailleurs
      createdBy: '', // Placeholder pour le créateur de la mission
      createdAt: new Date() // Placeholder pour la date de création
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des missions à venir:', error);
    
    // Données mockées pour le fallback
    return [
      {
        id: '1',
        title: 'Soudeur TIG',
        client: 'Industrie Métallique SA',
        date: new Date(Date.now() + 86400000), // demain
        status: 'pending' as 'pending',
        workersCount: 2,
        workers: ['worker1', 'worker2'],
        createdBy: 'admin',
        createdAt: new Date()
      },
      {
        id: '2',
        title: 'Manutentionnaire',
        client: 'Logistique Express',
        date: new Date(Date.now() + 172800000), // après-demain
        status: 'confirmed' as 'confirmed',
        workersCount: 5,
        workers: ['worker3', 'worker4', 'worker5', 'worker6', 'worker7'],
        createdBy: 'admin',
        createdAt: new Date()
      },
      {
        id: '3',
        title: 'Plombier',
        client: 'SantéPlus',
        date: new Date(Date.now() + 259200000), // dans 3 jours
        status: 'pending' as 'pending',
        workersCount: 1,
        workers: ['worker8'],
        createdBy: 'admin',
        createdAt: new Date()
      }
    ].slice(0, limit);
  }
};

// Récupérer les données pour le graphique de performance
export const getPerformanceChartData = async (): Promise<ChartData> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');

    // Dans une implémentation réelle, vous récupéreriez ces données depuis Firestore
    // Ici nous simulons des données de graphique pour l'exemple

    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    // Simuler des données de missions
    const missionsData = [35, 45, 55, 48, 65, 80, 87, 92, 98, 110, 105, 120];
    
    // Simuler des données de travailleurs
    const workersData = [40, 52, 60, 70, 75, 85, 95, 100, 105, 115, 120, 130];

    return {
      labels: months,
      datasets: [
        {
          label: 'Missions',
          data: missionsData
        },
        {
          label: 'Intérimaires',
          data: workersData
        }
      ]
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données de performance:', error);
    throw error;
  }
};

// Récupérer les catégories d'emploi
export const getJobCategories = async (): Promise<JobCategory[]> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');

    // Dans une application réelle, vous calculeriez cela à partir des données de mission
    // Ici nous simulons les données

    const categories = [
      { name: 'Industrie', percentage: 35, count: 42 },
      { name: 'BTP', percentage: 28, count: 33 },
      { name: 'Logistique', percentage: 18, count: 22 },
      { name: 'Tertiaire', percentage: 12, count: 14 },
      { name: 'Autres', percentage: 7, count: 8 }
    ];

    return categories;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories d\'emploi:', error);
    throw error;
  }
};

// Créer une nouvelle activité
export const createActivity = async (activity: Omit<Activity, 'id' | 'timestamp'>) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');

    const activityData = {
      ...activity,
      userId: user.uid,
      timestamp: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, ACTIVITIES_COLLECTION), activityData);
    return { id: docRef.id, ...activityData };
  } catch (error) {
    console.error('Erreur lors de la création de l\'activité:', error);
    throw error;
  }
}; 