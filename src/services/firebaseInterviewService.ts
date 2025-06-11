import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { InterviewAnalysis } from './interviewAIService';

export interface InterviewResult {
  id?: string;
  sessionId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  recruiterId: string;
  recruiterName: string;
  startTime: Timestamp;
  endTime?: Timestamp;
  duration: number; // en minutes
  status: 'in_progress' | 'completed' | 'cancelled';
  recordingUrl?: string;
  aiAnalysis?: InterviewAnalysis;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export class FirebaseInterviewService {
  private static readonly COLLECTION_NAME = 'interview_results';

  /**
   * Créer un nouveau résultat d'entretien
   */
  static async createInterviewResult(data: Omit<InterviewResult, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const interviewData = {
        ...data,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), interviewData);
      console.log('✅ Résultat d\'entretien créé avec ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Erreur lors de la création du résultat d\'entretien:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un résultat d'entretien existant
   */
  static async updateInterviewResult(id: string, updates: Partial<InterviewResult>): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now()
      };

      await updateDoc(docRef, updateData);
      console.log('✅ Résultat d\'entretien mis à jour:', id);
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du résultat d\'entretien:', error);
      throw error;
    }
  }

  /**
   * Terminer un entretien avec l'analyse IA
   */
  static async completeInterview(
    id: string, 
    aiAnalysis: InterviewAnalysis, 
    endTime: Date,
    notes?: string
  ): Promise<void> {
    try {
      const updates: Partial<InterviewResult> = {
        status: 'completed',
        endTime: Timestamp.fromDate(endTime),
        aiAnalysis,
        notes
      };

      await this.updateInterviewResult(id, updates);
      console.log('✅ Entretien terminé et analyse IA sauvegardée:', id);
    } catch (error) {
      console.error('❌ Erreur lors de la finalisation de l\'entretien:', error);
      throw error;
    }
  }

  /**
   * Récupérer un résultat d'entretien par ID
   */
  static async getInterviewResult(id: string): Promise<InterviewResult | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as InterviewResult;
      } else {
        console.log('❌ Aucun résultat d\'entretien trouvé avec l\'ID:', id);
        return null;
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du résultat d\'entretien:', error);
      throw error;
    }
  }

  /**
   * Récupérer tous les résultats d'entretien pour un recruteur
   */
  static async getInterviewResultsByRecruiter(recruiterId: string): Promise<InterviewResult[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('recruiterId', '==', recruiterId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const results: InterviewResult[] = [];

      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as InterviewResult);
      });

      console.log(`✅ ${results.length} résultats d'entretien récupérés pour le recruteur:`, recruiterId);
      return results;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des résultats d\'entretien:', error);
      throw error;
    }
  }

  /**
   * Récupérer tous les résultats d'entretien pour un candidat
   */
  static async getInterviewResultsByCandidate(candidateEmail: string): Promise<InterviewResult[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('candidateEmail', '==', candidateEmail),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const results: InterviewResult[] = [];

      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as InterviewResult);
      });

      console.log(`✅ ${results.length} résultats d'entretien récupérés pour le candidat:`, candidateEmail);
      return results;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des résultats d\'entretien:', error);
      throw error;
    }
  }

  /**
   * Supprimer un résultat d'entretien
   */
  static async deleteInterviewResult(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      await updateDoc(docRef, {
        status: 'cancelled',
        updatedAt: Timestamp.now()
      });
      console.log('✅ Résultat d\'entretien marqué comme annulé:', id);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du résultat d\'entretien:', error);
      throw error;
    }
  }

  /**
   * Obtenir les statistiques d'entretien pour un recruteur
   */
  static async getInterviewStats(recruiterId: string): Promise<{
    total: number;
    completed: number;
    inProgress: number;
    averageScore: number;
    topSkills: string[];
  }> {
    try {
      const results = await this.getInterviewResultsByRecruiter(recruiterId);
      
      const completed = results.filter(r => r.status === 'completed');
      const inProgress = results.filter(r => r.status === 'in_progress');
      
      const scores = completed
        .filter(r => r.aiAnalysis?.overallScore)
        .map(r => r.aiAnalysis!.overallScore);
      
      const averageScore = scores.length > 0 
        ? scores.reduce((a, b) => a + b, 0) / scores.length 
        : 0;

      // Analyser les compétences les plus fréquentes
      const skillsMap = new Map<string, number>();
      completed.forEach(result => {
        if (result.aiAnalysis?.keyInsights) {
          result.aiAnalysis.keyInsights.forEach(insight => {
            const words = insight.toLowerCase().split(' ');
            words.forEach(word => {
              if (word.length > 3) {
                skillsMap.set(word, (skillsMap.get(word) || 0) + 1);
              }
            });
          });
        }
      });

      const topSkills = Array.from(skillsMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([skill]) => skill);

      return {
        total: results.length,
        completed: completed.length,
        inProgress: inProgress.length,
        averageScore: Math.round(averageScore),
        topSkills
      };
    } catch (error) {
      console.error('❌ Erreur lors du calcul des statistiques:', error);
      throw error;
    }
  }
}