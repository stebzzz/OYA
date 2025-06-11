// Service principal de sourcing intelligent qui combine toutes les sources
import { perplexityService } from './perplexityService';
import { candidateDataService } from './candidateDataService';
import { externalAPIService } from './externalAPIService';
import { linkedinService } from './linkedinService';

interface SearchCriteria {
  position: string;
  skills: string;
  experience: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
}

interface CandidateResult {
  id: string;
  name: string;
  email: string;
  position: string;
  experience: string;
  location: string;
  skills: string[];
  salary: string;
  company: string;
  education?: string;
  summary: string;
  linkedinUrl?: string;
  githubProfile?: string;
  availability: string;
  avatar: string;
  score: number;
  source: string;
  strengths?: string[];
  aiAnalysis?: string;
  realProfile: boolean;
  connections?: number;
  headline?: string;
  languages?: string[];
  certifications?: string[];
}

class IntelligentSourcingService {
  async searchCandidates(criteria: SearchCriteria): Promise<{
    candidates: CandidateResult[];
    marketInsights: any;
    searchSummary: string;
    sourceBreakdown: any;
  }> {
    console.log('🔍 Démarrage recherche intelligente multi-sources...');
    
    const allCandidates: any[] = [];
    const searchSources: { name: string; count: number; quality: string }[] = [];
    let totalSearchTime = 0;

    try {
      const startTime = Date.now();

      // 1. Recherche LinkedIn (priorité élevée pour tous les profils)
      console.log('🔍 Recherche LinkedIn professionnelle...');
      try {
        const linkedinProfiles = await linkedinService.searchLinkedInProfiles(criteria);
        const linkedinCandidates = linkedinProfiles.map(profile => 
          linkedinService.convertToCandidate(profile, criteria)
        );
        allCandidates.push(...linkedinCandidates);
        searchSources.push({
          name: 'LinkedIn',
          count: linkedinCandidates.length,
          quality: 'Profils professionnels vérifiés'
        });
        console.log(`✅ LinkedIn: ${linkedinCandidates.length} profils trouvés`);
      } catch (error) {
        console.log('⚠️ LinkedIn temporairement indisponible');
      }

      // 2. Recherche GitHub pour les développeurs
      if (this.isDeveloperPosition(criteria.position)) {
        console.log('🔍 Recherche GitHub développeurs...');
        try {
          const githubCandidates = await externalAPIService.searchGitHubDevelopers(
            this.extractSkillsArray(criteria.skills)
          );
          allCandidates.push(...githubCandidates);
          if (githubCandidates.length > 0) {
            searchSources.push({
              name: 'GitHub',
              count: githubCandidates.length,
              quality: 'Développeurs avec code public'
            });
          }
          console.log(`✅ GitHub: ${githubCandidates.length} développeurs trouvés`);
        } catch (error) {
          console.log('⚠️ GitHub API limite atteinte, utilisation fallback');
        }
      }

      // 3. Recherche base de données française qualifiée
      console.log('🔍 Recherche base française...');
      const internalCandidates = await candidateDataService.searchCandidates(criteria);
      allCandidates.push(...internalCandidates);
      searchSources.push({
        name: 'Base française',
        count: internalCandidates.length,
        quality: 'Profils qualifiés marché français'
      });
      console.log(`✅ Base française: ${internalCandidates.length} profils trouvés`);

      // 4. Recherche job boards et APIs externes
      console.log('🔍 Recherche job boards...');
      try {
        const externalCandidates = await externalAPIService.searchLinkedInProfiles(criteria);
        allCandidates.push(...externalCandidates);
        if (externalCandidates.length > 0) {
          searchSources.push({
            name: 'Job Boards',
            count: externalCandidates.length,
            quality: 'Candidats actifs sur le marché'
          });
        }
        console.log(`✅ Job boards: ${externalCandidates.length} candidats trouvés`);
      } catch (error) {
        console.log('⚠️ Job boards partiellement disponibles');
      }

      totalSearchTime = Date.now() - startTime;

      // 5. Enrichissement IA et insights marché
      console.log('🧠 Enrichissement IA et analyse marché...');
      let marketInsights = null;
      try {
        marketInsights = await perplexityService.enhanceCandidateSearch(criteria);
        marketInsights.searchTime = `${totalSearchTime}ms`;
        marketInsights.totalSources = searchSources.length;
      } catch (error) {
        console.log('⚠️ Enrichissement IA partiel');
        marketInsights = this.getFallbackInsights(criteria);
      }

      // 6. Scoring avancé de tous les candidats
      console.log('📊 Scoring IA avancé...');
      const scoredCandidates = await this.advancedScoring(allCandidates, criteria);

      // 7. Déduplication intelligente
      const uniqueCandidates = this.intelligentDeduplication(scoredCandidates);

      // 8. Ranking multi-critères
      const rankedCandidates = this.multiCriteriaRanking(uniqueCandidates, criteria);

      // 9. Sélection optimale
      const finalCandidates = this.selectOptimalCandidates(rankedCandidates, 15);

      const searchSummary = this.generateAdvancedSearchSummary(finalCandidates, searchSources, criteria, totalSearchTime);
      const sourceBreakdown = this.generateSourceBreakdown(searchSources, finalCandidates);

      console.log(`✅ Recherche terminée: ${finalCandidates.length} candidats optimaux sélectionnés en ${totalSearchTime}ms`);

      return {
        candidates: finalCandidates,
        marketInsights,
        searchSummary,
        sourceBreakdown
      };

    } catch (error) {
      console.error('❌ Erreur dans la recherche intelligente:', error);
      
      // Fallback complet
      const fallbackCandidates = await candidateDataService.searchCandidates(criteria);
      return {
        candidates: fallbackCandidates,
        marketInsights: this.getFallbackInsights(criteria),
        searchSummary: `Recherche effectuée en mode fallback avec ${fallbackCandidates.length} candidats.`,
        sourceBreakdown: { sources: [{ name: 'Base française', count: fallbackCandidates.length }] }
      };
    }
  }

  private async advancedScoring(candidates: any[], criteria: SearchCriteria): Promise<any[]> {
    const scoredCandidates = [];

    for (const candidate of candidates) {
      try {
        // Scoring avec Perplexity + scoring local
        const aiScoring = await perplexityService.scoreCandidateProfile({
          name: candidate.name,
          position: candidate.position,
          experience: candidate.experience,
          skills: candidate.skills,
          location: candidate.location,
          salary: candidate.salary
        });

        const localScore = this.calculateLocalScore(candidate, criteria);
        const finalScore = Math.round((aiScoring.score * 0.7) + (localScore * 0.3));

        scoredCandidates.push({
          ...candidate,
          score: finalScore,
          strengths: aiScoring.strengths,
          aiAnalysis: aiScoring.analysis,
          realProfile: this.isRealProfile(candidate.source),
          qualityIndicators: this.calculateQualityIndicators(candidate)
        });

      } catch (error) {
        // Fallback au scoring local
        const localScore = this.calculateLocalScore(candidate, criteria);
        
        scoredCandidates.push({
          ...candidate,
          score: localScore,
          realProfile: this.isRealProfile(candidate.source),
          qualityIndicators: this.calculateQualityIndicators(candidate)
        });
      }
    }

    return scoredCandidates;
  }

  private calculateLocalScore(candidate: any, criteria: SearchCriteria): number {
    let score = 60;

    // Score position
    if (criteria.position && candidate.position) {
      const positionMatch = this.calculateTextSimilarity(criteria.position, candidate.position);
      score += positionMatch * 20;
    }

    // Score compétences
    if (criteria.skills && candidate.skills) {
      const skillsMatch = this.calculateSkillsMatch(criteria.skills, candidate.skills);
      score += skillsMatch * 15;
    }

    // Score localisation
    if (criteria.location && candidate.location) {
      const locationMatch = this.calculateTextSimilarity(criteria.location, candidate.location);
      score += locationMatch * 10;
    }

    // Bonus pour profils réels
    if (this.isRealProfile(candidate.source)) score += 10;

    // Bonus pour profils complets
    if (candidate.linkedinUrl) score += 5;
    if (candidate.connections && candidate.connections > 500) score += 5;
    if (candidate.certifications && candidate.certifications.length > 0) score += 5;

    return Math.min(100, Math.max(50, Math.round(score)));
  }

  private calculateQualityIndicators(candidate: any): any {
    return {
      profileCompleteness: this.calculateProfileCompleteness(candidate),
      sourceReliability: this.getSourceReliability(candidate.source),
      marketRelevance: this.calculateMarketRelevance(candidate),
      contactability: this.calculateContactability(candidate)
    };
  }

  private calculateProfileCompleteness(candidate: any): number {
    let completeness = 0;
    const fields = ['name', 'email', 'position', 'experience', 'location', 'skills', 'summary'];
    
    fields.forEach(field => {
      if (candidate[field] && candidate[field].length > 0) completeness += 14.3;
    });

    if (candidate.linkedinUrl) completeness += 10;
    if (candidate.education) completeness += 10;
    if (candidate.certifications && candidate.certifications.length > 0) completeness += 10;

    return Math.min(100, Math.round(completeness));
  }

  private getSourceReliability(source: string): string {
    if (source.includes('LinkedIn')) return 'Très élevée';
    if (source.includes('GitHub')) return 'Élevée';
    if (source.includes('française')) return 'Élevée';
    return 'Bonne';
  }

  private calculateMarketRelevance(candidate: any): number {
    let relevance = 70;
    
    if (candidate.availability && candidate.availability.includes('Ouvert')) relevance += 15;
    if (candidate.salary && candidate.salary.includes('k€')) relevance += 10;
    if (candidate.connections && candidate.connections > 1000) relevance += 5;
    
    return Math.min(100, relevance);
  }

  private calculateContactability(candidate: any): string {
    if (candidate.linkedinUrl && candidate.email) return 'Excellente';
    if (candidate.linkedinUrl || candidate.email) return 'Bonne';
    return 'Limitée';
  }

  private intelligentDeduplication(candidates: any[]): any[] {
    const seen = new Map();
    const unique = [];

    for (const candidate of candidates) {
      const key = this.generateCandidateKey(candidate);
      
      if (!seen.has(key)) {
        seen.set(key, candidate);
        unique.push(candidate);
      } else {
        // Garder le candidat avec le meilleur score ou la meilleure source
        const existing = seen.get(key);
        if (candidate.score > existing.score || this.isBetterSource(candidate.source, existing.source)) {
          const index = unique.findIndex(c => c.id === existing.id);
          if (index !== -1) {
            unique[index] = candidate;
            seen.set(key, candidate);
          }
        }
      }
    }

    return unique;
  }

  private generateCandidateKey(candidate: any): string {
    const name = candidate.name.toLowerCase().replace(/\s/g, '');
    const company = candidate.company?.toLowerCase().replace(/\s/g, '') || '';
    return `${name}-${company}`;
  }

  private isBetterSource(source1: string, source2: string): boolean {
    const sourceRanking = ['LinkedIn', 'GitHub', 'française', 'externe'];
    const rank1 = sourceRanking.findIndex(s => source1.includes(s));
    const rank2 = sourceRanking.findIndex(s => source2.includes(s));
    return rank1 < rank2;
  }

  private multiCriteriaRanking(candidates: any[], criteria: SearchCriteria): any[] {
    return candidates.sort((a, b) => {
      // 1. Profils réels en priorité
      if (a.realProfile && !b.realProfile) return -1;
      if (!a.realProfile && b.realProfile) return 1;

      // 2. Score IA
      if (Math.abs(a.score - b.score) > 5) return b.score - a.score;

      // 3. Complétude du profil
      const completenessA = a.qualityIndicators?.profileCompleteness || 0;
      const completenessB = b.qualityIndicators?.profileCompleteness || 0;
      if (Math.abs(completenessA - completenessB) > 10) return completenessB - completenessA;

      // 4. Disponibilité
      if (a.availability?.includes('Ouvert') && !b.availability?.includes('Ouvert')) return -1;
      if (!a.availability?.includes('Ouvert') && b.availability?.includes('Ouvert')) return 1;

      return 0;
    });
  }

  private selectOptimalCandidates(candidates: any[], maxCount: number): any[] {
    // Sélection diversifiée pour éviter la redondance
    const selected = [];
    const sourceCount = new Map();
    const positionCount = new Map();

    for (const candidate of candidates) {
      if (selected.length >= maxCount) break;

      const source = candidate.source;
      const position = candidate.position;

      // Limiter par source pour diversifier
      const currentSourceCount = sourceCount.get(source) || 0;
      const currentPositionCount = positionCount.get(position) || 0;

      if (currentSourceCount < 5 && currentPositionCount < 3) {
        selected.push(candidate);
        sourceCount.set(source, currentSourceCount + 1);
        positionCount.set(position, currentPositionCount + 1);
      }
    }

    // Compléter si nécessaire avec les meilleurs restants
    const remaining = candidates.filter(c => !selected.includes(c));
    selected.push(...remaining.slice(0, maxCount - selected.length));

    return selected;
  }

  private generateAdvancedSearchSummary(candidates: any[], sources: any[], criteria: SearchCriteria, searchTime: number): string {
    const realProfiles = candidates.filter(c => c.realProfile).length;
    const highScores = candidates.filter(c => c.score >= 85).length;
    const openToWork = candidates.filter(c => c.availability?.includes('Ouvert')).length;
    
    let summary = `Recherche "${criteria.position}" effectuée en ${searchTime}ms sur ${sources.length} sources. `;
    summary += `${candidates.length} candidats sélectionnés`;
    
    if (realProfiles > 0) {
      summary += `, dont ${realProfiles} profils vérifiés`;
    }
    
    if (highScores > 0) {
      summary += `, ${highScores} avec score élevé (85%+)`;
    }
    
    if (openToWork > 0) {
      summary += `, ${openToWork} ouverts aux opportunités`;
    }
    
    summary += '.';
    
    return summary;
  }

  private generateSourceBreakdown(sources: any[], candidates: any[]): any {
    const breakdown = {
      sources: sources,
      distribution: {},
      qualityMetrics: {
        averageScore: Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / candidates.length),
        realProfilesPercentage: Math.round((candidates.filter(c => c.realProfile).length / candidates.length) * 100),
        completeProfilesPercentage: Math.round((candidates.filter(c => c.qualityIndicators?.profileCompleteness > 80).length / candidates.length) * 100)
      }
    };

    // Distribution par source
    candidates.forEach(candidate => {
      const source = candidate.source;
      if (!breakdown.distribution[source]) {
        breakdown.distribution[source] = 0;
      }
      breakdown.distribution[source]++;
    });

    return breakdown;
  }

  // Méthodes utilitaires
  private isDeveloperPosition(position: string): boolean {
    const devKeywords = ['développeur', 'developer', 'dev', 'frontend', 'backend', 'fullstack', 'full-stack', 'software engineer'];
    return devKeywords.some(keyword => position.toLowerCase().includes(keyword));
  }

  private extractSkillsArray(skills: string): string[] {
    if (!skills) return ['JavaScript', 'Python', 'React'];
    return skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
  }

  private isRealProfile(source: string): boolean {
    return source.includes('LinkedIn') || source.includes('GitHub');
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }

  private calculateSkillsMatch(criteriaSkills: string, candidateSkills: string[]): number {
    const criteria = criteriaSkills.toLowerCase().split(',').map(s => s.trim());
    const candidate = candidateSkills.map(s => s.toLowerCase());
    
    const matches = criteria.filter(skill => 
      candidate.some(cSkill => cSkill.includes(skill) || skill.includes(cSkill))
    );
    
    return matches.length / criteria.length;
  }

  private getFallbackInsights(criteria: SearchCriteria): any {
    return {
      enhancedKeywords: [criteria.position],
      suggestedSkills: this.extractSkillsArray(criteria.skills),
      marketInsights: `Marché dynamique pour ${criteria.position} en France. Forte demande en technologies modernes.`,
      salaryBenchmark: '45-75k€ selon expérience',
      searchTime: '< 1000ms',
      totalSources: 1
    };
  }
}

export const intelligentSourcingService = new IntelligentSourcingService();