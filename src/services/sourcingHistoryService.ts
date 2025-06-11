import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  deleteDoc, 
  updateDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface SourcingSearch {
  id: string;
  userId: string;
  searchCriteria: {
    position: string;
    skills: string;
    experience: string;
    location: string;
    salaryMin: string;
    salaryMax: string;
  };
  results: {
    totalCandidates: number;
    realProfiles: number;
    averageScore: number;
    sources: string[];
    topCandidates: Array<{
      name: string;
      position: string;
      score: number;
      source: string;
    }>;
  };
  metadata: {
    searchTime: number;
    sourcesUsed: number;
    searchQuery: string;
    filters: string[];
  };
  performance: {
    totalSearchTime: number;
    candidatesPerSecond: number;
    successRate: number;
    qualityScore: number;
  };
  tags: string[];
  notes: string;
  favorite: boolean;
  status: 'completed' | 'in_progress' | 'failed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

class SourcingHistoryService {
  private readonly COLLECTION_NAME = 'sourcing_searches';

  async saveSearch(
    userId: string,
    searchCriteria: any,
    results: any,
    metadata: any,
    performance: any
  ): Promise<string> {
    try {
      const searchData: Omit<SourcingSearch, 'id'> = {
        userId,
        searchCriteria,
        results: {
          totalCandidates: results.candidates?.length || 0,
          realProfiles: results.candidates?.filter((c: any) => c.realProfile).length || 0,
          averageScore: results.candidates?.length > 0 
            ? Math.round(results.candidates.reduce((acc: number, c: any) => acc + c.score, 0) / results.candidates.length)
            : 0,
          sources: Array.from(new Set(results.candidates?.map((c: any) => c.source) || [])),
          topCandidates: results.candidates
            ?.filter((c: any) => c.score >= 85)
            ?.slice(0, 5)
            ?.map((c: any) => ({
              name: c.name,
              position: c.position,
              score: c.score,
              source: c.source
            })) || []
        },
        metadata: {
          searchTime: metadata.searchTime || 0,
          sourcesUsed: metadata.sourcesUsed || 0,
          searchQuery: this.generateSearchQuery(searchCriteria),
          filters: this.extractFilters(searchCriteria)
        },
        performance: {
          totalSearchTime: performance.totalSearchTime || 0,
          candidatesPerSecond: performance.candidatesPerSecond || 0,
          successRate: performance.successRate || 100,
          qualityScore: this.calculateQualityScore(results)
        },
        tags: this.generateTags(searchCriteria, results),
        notes: '',
        favorite: false,
        status: results.candidates?.length > 0 ? 'completed' : 'failed',
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), searchData);
      return docRef.id;
    } catch (error) {
      console.error('Erreur sauvegarde historique:', error);
      throw error;
    }
  }

  subscribeToUserSearches(userId: string, callback: (searches: SourcingSearch[]) => void) {
    const q = query(
      collection(db, this.COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const searches = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SourcingSearch[];
      callback(searches);
    });
  }

  async deleteSearch(searchId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTION_NAME, searchId));
    } catch (error) {
      console.error('Erreur suppression recherche:', error);
      throw error;
    }
  }

  async toggleFavorite(searchId: string, favorite: boolean): Promise<void> {
    try {
      await updateDoc(doc(db, this.COLLECTION_NAME, searchId), {
        favorite,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erreur mise à jour favori:', error);
      throw error;
    }
  }

  async addNotes(searchId: string, notes: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.COLLECTION_NAME, searchId), {
        notes,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erreur ajout notes:', error);
      throw error;
    }
  }

  async addTags(searchId: string, tags: string[]): Promise<void> {
    try {
      await updateDoc(doc(db, this.COLLECTION_NAME, searchId), {
        tags,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erreur ajout tags:', error);
      throw error;
    }
  }

  // Méthodes d'analyse et statistiques
  getSearchStats(searches: SourcingSearch[]): {
    totalSearches: number;
    successRate: number;
    averageCandidates: number;
    averageScore: number;
    mostUsedSources: Array<{ source: string; count: number }>;
    searchTrends: Array<{ month: string; count: number }>;
    topPositions: Array<{ position: string; count: number }>;
  } {
    if (searches.length === 0) {
      return {
        totalSearches: 0,
        successRate: 0,
        averageCandidates: 0,
        averageScore: 0,
        mostUsedSources: [],
        searchTrends: [],
        topPositions: []
      };
    }

    const successfulSearches = searches.filter(s => s.status === 'completed');
    const successRate = Math.round((successfulSearches.length / searches.length) * 100);
    
    const averageCandidates = Math.round(
      successfulSearches.reduce((acc, s) => acc + s.results.totalCandidates, 0) / successfulSearches.length
    );
    
    const averageScore = Math.round(
      successfulSearches.reduce((acc, s) => acc + s.results.averageScore, 0) / successfulSearches.length
    );

    // Sources les plus utilisées
    const sourceCount = new Map<string, number>();
    successfulSearches.forEach(search => {
      search.results.sources.forEach(source => {
        sourceCount.set(source, (sourceCount.get(source) || 0) + 1);
      });
    });
    
    const mostUsedSources = Array.from(sourceCount.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Tendances de recherche par mois
    const monthCount = new Map<string, number>();
    searches.forEach(search => {
      if (search.createdAt && search.createdAt.toDate) {
        const month = search.createdAt.toDate().toLocaleDateString('fr-FR', { 
          year: 'numeric', 
          month: 'short' 
        });
        monthCount.set(month, (monthCount.get(month) || 0) + 1);
      }
    });
    
    const searchTrends = Array.from(monthCount.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // 6 derniers mois

    // Postes les plus recherchés
    const positionCount = new Map<string, number>();
    searches.forEach(search => {
      const position = search.searchCriteria.position;
      if (position) {
        positionCount.set(position, (positionCount.get(position) || 0) + 1);
      }
    });
    
    const topPositions = Array.from(positionCount.entries())
      .map(([position, count]) => ({ position, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalSearches: searches.length,
      successRate,
      averageCandidates,
      averageScore,
      mostUsedSources,
      searchTrends,
      topPositions
    };
  }

  private generateSearchQuery(criteria: any): string {
    const parts = [];
    if (criteria.position) parts.push(criteria.position);
    if (criteria.location) parts.push(criteria.location);
    if (criteria.experience) parts.push(`${criteria.experience} expérience`);
    return parts.join(' • ');
  }

  private extractFilters(criteria: any): string[] {
    const filters = [];
    if (criteria.skills) filters.push('Compétences spécifiques');
    if (criteria.salaryMin || criteria.salaryMax) filters.push('Fourchette salariale');
    if (criteria.location) filters.push('Localisation');
    if (criteria.experience) filters.push('Expérience');
    return filters;
  }

  private generateTags(criteria: any, results: any): string[] {
    const tags = [];
    
    // Tags basés sur les critères
    if (criteria.position) {
      if (criteria.position.toLowerCase().includes('senior')) tags.push('Senior');
      if (criteria.position.toLowerCase().includes('lead')) tags.push('Lead');
      if (criteria.position.toLowerCase().includes('développeur')) tags.push('Développement');
      if (criteria.position.toLowerCase().includes('product')) tags.push('Product');
      if (criteria.position.toLowerCase().includes('data')) tags.push('Data');
    }
    
    // Tags basés sur les résultats
    if (results.candidates?.length > 10) tags.push('Recherche large');
    if (results.candidates?.filter((c: any) => c.score >= 90).length > 3) tags.push('Profils excellents');
    if (results.candidates?.filter((c: any) => c.realProfile).length > 5) tags.push('Profils vérifiés');
    
    // Tags basés sur la localisation
    if (criteria.location?.toLowerCase().includes('paris')) tags.push('Paris');
    if (criteria.location?.toLowerCase().includes('lyon')) tags.push('Lyon');
    if (criteria.location?.toLowerCase().includes('remote')) tags.push('Remote');
    
    return Array.from(new Set(tags));
  }

  private calculateQualityScore(results: any): number {
    if (!results.candidates || results.candidates.length === 0) return 0;
    
    let qualityScore = 0;
    const candidates = results.candidates;
    
    // Score basé sur le score moyen
    const averageScore = candidates.reduce((acc: number, c: any) => acc + c.score, 0) / candidates.length;
    qualityScore += averageScore * 0.4;
    
    // Score basé sur le pourcentage de profils réels
    const realProfilesPercentage = (candidates.filter((c: any) => c.realProfile).length / candidates.length) * 100;
    qualityScore += realProfilesPercentage * 0.3;
    
    // Score basé sur la diversité des sources
    const uniqueSources = new Set(candidates.map((c: any) => c.source)).size;
    const diversityScore = Math.min(100, uniqueSources * 25);
    qualityScore += diversityScore * 0.2;
    
    // Score basé sur les profils de haute qualité (score >= 85)
    const highQualityPercentage = (candidates.filter((c: any) => c.score >= 85).length / candidates.length) * 100;
    qualityScore += highQualityPercentage * 0.1;
    
    return Math.round(Math.min(100, qualityScore));
  }
}

export const sourcingHistoryService = new SourcingHistoryService();