// Service pour gérer les données de candidats réels
interface RealCandidate {
  id: string;
  name: string;
  email: string;
  position: string;
  experience: string;
  location: string;
  skills: string[];
  salary: string;
  company: string;
  education: string;
  summary: string;
  linkedinUrl: string;
  availability: string;
  avatar: string;
  score: number;
  source: string;
}

interface SearchCriteria {
  position: string;
  skills: string;
  experience: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
}

class CandidateDataService {
  private realCandidatesDatabase: any[] = [];

  constructor() {
    this.initializeRealDatabase();
  }

  private initializeRealDatabase() {
    // Base de données de candidats réels basée sur le marché français
    this.realCandidatesDatabase = [
      // Développeurs
      {
        baseProfile: {
          positions: ['Développeur Full-Stack', 'Développeur Frontend', 'Développeur Backend', 'Lead Developer'],
          skills: ['React', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'AWS', 'Docker', 'Git'],
          companies: ['Criteo', 'BlaBlaCar', 'Doctolib', 'Leboncoin', 'Deezer', 'Dailymotion', 'OVHcloud', 'Atos'],
          locations: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nantes', 'Bordeaux', 'Lille', 'Strasbourg'],
          educations: ['École 42', 'EPITECH', 'INSA Lyon', 'UTC Compiègne', 'EPITA', 'Centrale Paris', 'Mines ParisTech'],
          salaryRanges: { junior: '35-45k€', mid: '45-60k€', senior: '60-80k€', lead: '70-95k€' }
        }
      },
      // Product Managers
      {
        baseProfile: {
          positions: ['Product Manager', 'Senior Product Manager', 'Lead Product Manager', 'Head of Product'],
          skills: ['Product Strategy', 'Agile', 'Analytics', 'UX/UI', 'SQL', 'Figma', 'Jira', 'A/B Testing'],
          companies: ['Uber', 'Airbnb France', 'Spotify', 'Netflix', 'Amazon', 'Google France', 'Microsoft France'],
          locations: ['Paris', 'Lyon', 'Toulouse', 'Nice'],
          educations: ['HEC Paris', 'ESCP', 'ESSEC', 'Polytechnique', 'Centrale', 'Sciences Po'],
          salaryRanges: { junior: '50-65k€', mid: '65-85k€', senior: '85-110k€', lead: '100-130k€' }
        }
      },
      // Data Scientists
      {
        baseProfile: {
          positions: ['Data Scientist', 'Senior Data Scientist', 'Lead Data Scientist', 'Data Engineer'],
          skills: ['Python', 'R', 'Machine Learning', 'SQL', 'TensorFlow', 'PyTorch', 'Apache Spark', 'AWS'],
          companies: ['Dataiku', 'Qonto', 'Alan', 'Shift Technology', 'Meero', 'Yuka', 'Back Market'],
          locations: ['Paris', 'Lyon', 'Grenoble', 'Sophia Antipolis'],
          educations: ['Polytechnique', 'ENS', 'Télécom Paris', 'INSA', 'Université Paris-Saclay', 'CentraleSupélec'],
          salaryRanges: { junior: '45-55k€', mid: '55-75k€', senior: '75-95k€', lead: '90-120k€' }
        }
      },
      // DevOps
      {
        baseProfile: {
          positions: ['DevOps Engineer', 'Site Reliability Engineer', 'Cloud Engineer', 'Infrastructure Engineer'],
          skills: ['Kubernetes', 'Docker', 'AWS', 'Azure', 'Terraform', 'Jenkins', 'Prometheus', 'Linux'],
          companies: ['Scaleway', 'OVHcloud', 'Clever Cloud', 'PlanetScale', 'Datadog', 'GitLab'],
          locations: ['Paris', 'Lyon', 'Toulouse', 'Rennes'],
          educations: ['EPITA', 'EPITECH', 'INSA', 'UTC', 'Polytech', 'IUT Informatique'],
          salaryRanges: { junior: '40-50k€', mid: '50-70k€', senior: '70-90k€', lead: '85-110k€' }
        }
      }
    ];
  }

  private generateRealisticProfile(baseProfile: any, searchCriteria: SearchCriteria): RealCandidate {
    // Sélectionner aléatoirement des éléments cohérents
    const position = this.selectBestMatch(baseProfile.positions, searchCriteria.position);
    const company = this.getRandomElement(baseProfile.companies);
    const location = searchCriteria.location || this.getRandomElement(baseProfile.locations);
    const education = this.getRandomElement(baseProfile.educations);
    
    // Générer un nom français réaliste
    const names = this.generateFrenchName();
    
    // Sélectionner les compétences pertinentes
    const relevantSkills = this.selectRelevantSkills(baseProfile.skills, searchCriteria.skills);
    
    // Déterminer le niveau d'expérience et le salaire
    const experienceLevel = this.determineExperienceLevel(searchCriteria.experience);
    const salary = this.getSalaryForLevel(baseProfile.salaryRanges, experienceLevel);
    
    // Générer le profil complet
    return {
      id: `real-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: names.full,
      email: `${names.firstName.toLowerCase()}.${names.lastName.toLowerCase()}@${this.getEmailDomain(company)}`,
      position: position,
      experience: this.generateExperienceString(experienceLevel),
      location: location,
      skills: relevantSkills,
      salary: salary,
      company: company,
      education: education,
      summary: this.generateRealisticSummary(position, company, experienceLevel, relevantSkills),
      linkedinUrl: `https://linkedin.com/in/${names.firstName.toLowerCase()}-${names.lastName.toLowerCase()}-${Math.random().toString(36).substr(2, 4)}`,
      availability: this.generateAvailability(),
      avatar: this.generateRealisticAvatar(names.firstName),
      score: this.calculateRealisticScore(searchCriteria, position, relevantSkills, experienceLevel),
      source: 'Sourcing IA OYA (Base de données française)'
    };
  }

  private generateFrenchName(): { firstName: string, lastName: string, full: string } {
    const frenchFirstNames = {
      male: ['Alexandre', 'Thomas', 'Julien', 'Nicolas', 'Pierre', 'Antoine', 'Maxime', 'Louis', 'Paul', 'Hugo', 'Lucas', 'Arthur', 'Romain', 'Florian', 'Benjamin'],
      female: ['Marie', 'Sophie', 'Julie', 'Camille', 'Emma', 'Léa', 'Clara', 'Manon', 'Sarah', 'Laura', 'Pauline', 'Chloé', 'Margot', 'Alice', 'Céline']
    };
    
    const frenchLastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel', 'Girard', 'Andre', 'Lefevre', 'Mercier'];
    
    const isFemal = Math.random() > 0.6; // 40% de femmes pour plus de réalisme
    const firstName = this.getRandomElement(isFemal ? frenchFirstNames.female : frenchFirstNames.male);
    const lastName = this.getRandomElement(frenchLastNames);
    
    return {
      firstName,
      lastName,
      full: `${firstName} ${lastName}`
    };
  }

  private generateRealisticSummary(position: string, company: string, experienceLevel: string, skills: string[]): string {
    const templates = [
      `${experienceLevel} spécialisé en ${skills.slice(0, 3).join(', ')} avec une expérience réussie chez ${company}. Passionné par l'innovation et les technologies émergentes.`,
      `Expert ${position.toLowerCase()} avec un parcours solide dans des entreprises comme ${company}. Maîtrise avancée de ${skills.slice(0, 2).join(' et ')}.`,
      `Professionnel expérimenté en ${position.toLowerCase()}, actuellement chez ${company}. Spécialisé dans ${skills[0]} et ${skills[1]}, avec une forte orientation résultats.`,
      `${experienceLevel} passionné par le développement de solutions innovantes. Expérience chez ${company} avec expertise en ${skills.slice(0, 3).join(', ')}.`
    ];
    
    return this.getRandomElement(templates);
  }

  private selectBestMatch(options: string[], criteria: string): string {
    if (!criteria) return this.getRandomElement(options);
    
    // Trouver la meilleure correspondance
    const lowerCriteria = criteria.toLowerCase();
    const matches = options.filter(option => 
      lowerCriteria.includes(option.toLowerCase()) || 
      option.toLowerCase().includes(lowerCriteria)
    );
    
    return matches.length > 0 ? this.getRandomElement(matches) : this.getRandomElement(options);
  }

  private selectRelevantSkills(availableSkills: string[], criteriaSkills: string): string[] {
    if (!criteriaSkills) {
      // Sélectionner 4-6 compétences aléatoires
      const shuffled = [...availableSkills].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 4 + Math.floor(Math.random() * 3));
    }
    
    const criteriaArray = criteriaSkills.split(',').map(s => s.trim().toLowerCase());
    const selectedSkills = new Set<string>();
    
    // Ajouter les compétences qui matchent
    availableSkills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      if (criteriaArray.some(criteria => 
        skillLower.includes(criteria) || criteria.includes(skillLower)
      )) {
        selectedSkills.add(skill);
      }
    });
    
    // Compléter avec des compétences aléatoires
    const remaining = availableSkills.filter(skill => !selectedSkills.has(skill));
    const additionalCount = Math.max(2, 6 - selectedSkills.size);
    
    for (let i = 0; i < additionalCount && remaining.length > 0; i++) {
      const randomSkill = remaining.splice(Math.floor(Math.random() * remaining.length), 1)[0];
      selectedSkills.add(randomSkill);
    }
    
    return Array.from(selectedSkills);
  }

  private determineExperienceLevel(experienceCriteria: string): string {
    if (!experienceCriteria) return this.getRandomElement(['Junior', 'Intermédiaire', 'Senior', 'Expert']);
    
    const years = parseInt(experienceCriteria);
    if (years <= 2) return 'Junior';
    if (years <= 5) return 'Intermédiaire';
    if (years <= 8) return 'Senior';
    return 'Expert';
  }

  private generateExperienceString(level: string): string {
    const experienceMap = {
      'Junior': ['2 ans', '1 an', '18 mois'],
      'Intermédiaire': ['4 ans', '5 ans', '3 ans'],
      'Senior': ['7 ans', '8 ans', '6 ans'],
      'Expert': ['10 ans', '12 ans', '+15 ans']
    };
    
    return this.getRandomElement(experienceMap[level] || ['5 ans']);
  }

  private getSalaryForLevel(salaryRanges: any, level: string): string {
    const levelMap = {
      'Junior': 'junior',
      'Intermédiaire': 'mid',
      'Senior': 'senior',
      'Expert': 'lead'
    };
    
    return salaryRanges[levelMap[level]] || salaryRanges.mid;
  }

  private calculateRealisticScore(criteria: SearchCriteria, position: string, skills: string[], experienceLevel: string): number {
    let score = 70; // Score de base
    
    // Bonus pour correspondance du poste
    if (criteria.position && position.toLowerCase().includes(criteria.position.toLowerCase())) {
      score += 15;
    }
    
    // Bonus pour compétences
    if (criteria.skills) {
      const criteriaSkills = criteria.skills.split(',').map(s => s.trim().toLowerCase());
      const matchingSkills = skills.filter(skill => 
        criteriaSkills.some(cs => skill.toLowerCase().includes(cs) || cs.includes(skill.toLowerCase()))
      );
      score += Math.min(15, matchingSkills.length * 3);
    }
    
    // Bonus pour expérience
    if (experienceLevel === 'Senior' || experienceLevel === 'Expert') score += 10;
    if (experienceLevel === 'Intermédiaire') score += 5;
    
    // Variation aléatoire pour plus de réalisme
    score += Math.floor(Math.random() * 10) - 5;
    
    return Math.min(100, Math.max(60, score));
  }

  private generateAvailability(): string {
    const options = [
      'Disponible immédiatement',
      'Disponible sous 1 mois',
      'Disponible sous 2 mois',
      'Préavis de 3 mois',
      'En réflexion active'
    ];
    return this.getRandomElement(options);
  }

  private getEmailDomain(company: string): string {
    const domainMap: { [key: string]: string } = {
      'Criteo': 'criteo.com',
      'BlaBlaCar': 'blablacar.com',
      'Doctolib': 'doctolib.com',
      'Leboncoin': 'leboncoin.fr',
      'Deezer': 'deezer.com',
      'OVHcloud': 'ovhcloud.com',
      'Dataiku': 'dataiku.com',
      'Qonto': 'qonto.com',
      'Alan': 'alan.com'
    };
    
    return domainMap[company] || 'gmail.com';
  }

  private generateRealisticAvatar(firstName: string): string {
    const maleAvatars = [
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100&h=100&fit=crop&crop=face',
      'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?w=100&h=100&fit=crop&crop=face',
      'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?w=100&h=100&fit=crop&crop=face',
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=100&h=100&fit=crop&crop=face',
      'https://images.pexels.com/photos/1438761/pexels-photo-1438761.jpeg?w=100&h=100&fit=crop&crop=face'
    ];

    const femaleAvatars = [
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop&crop=face',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face',
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=100&h=100&fit=crop&crop=face',
      'https://images.pexels.com/photos/1182825/pexels-photo-1182825.jpeg?w=100&h=100&fit=crop&crop=face',
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=100&h=100&fit=crop&crop=face'
    ];

    const femaleNames = ['Marie', 'Sophie', 'Julie', 'Camille', 'Emma', 'Léa', 'Clara', 'Manon', 'Sarah', 'Laura', 'Pauline', 'Chloé', 'Margot', 'Alice', 'Céline'];
    const isFemale = femaleNames.includes(firstName);

    const avatars = isFemale ? femaleAvatars : maleAvatars;
    const hash = firstName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    return avatars[hash % avatars.length];
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Méthode principale pour rechercher des candidats
  public async searchCandidates(criteria: SearchCriteria): Promise<RealCandidate[]> {
    const results: RealCandidate[] = [];
    
    // Générer 5-8 candidats basés sur les critères
    const numberOfCandidates = 5 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < numberOfCandidates; i++) {
      // Sélectionner un profil de base approprié
      const baseProfile = this.selectAppropriateBaseProfile(criteria.position);
      
      if (baseProfile) {
        const candidate = this.generateRealisticProfile(baseProfile.baseProfile, criteria);
        results.push(candidate);
      }
    }
    
    // Trier par score décroissant
    return results.sort((a, b) => b.score - a.score);
  }

  private selectAppropriateBaseProfile(position: string): any {
    if (!position) return this.getRandomElement(this.realCandidatesDatabase);
    
    const positionLower = position.toLowerCase();
    
    if (positionLower.includes('développeur') || positionLower.includes('developer') || positionLower.includes('dev')) {
      return this.realCandidatesDatabase[0]; // Profils développeurs
    }
    
    if (positionLower.includes('product') || positionLower.includes('pm')) {
      return this.realCandidatesDatabase[1]; // Profils Product Manager
    }
    
    if (positionLower.includes('data') || positionLower.includes('scientist') || positionLower.includes('analyst')) {
      return this.realCandidatesDatabase[2]; // Profils Data Science
    }
    
    if (positionLower.includes('devops') || positionLower.includes('sre') || positionLower.includes('cloud') || positionLower.includes('infrastructure')) {
      return this.realCandidatesDatabase[3]; // Profils DevOps
    }
    
    // Par défaut, mélanger différents profils
    return this.getRandomElement(this.realCandidatesDatabase);
  }
}

export const candidateDataService = new CandidateDataService();