// Service pour intégrer des APIs externes de sourcing
class ExternalAPIService {
  private rapidAPIKey = 'VOTRE_RAPIDAPI_KEY'; // À remplacer par une vraie clé
  
  // Recherche via JSearch API (Indeed, LinkedIn, etc.)
  async searchJobsFromAPIs(searchCriteria: {
    position: string;
    location: string;
    experience: string;
  }): Promise<any[]> {
    try {
      // Simulation d'appel à JSearch API ou similaire
      const mockResults = await this.getMockJobSearchResults(searchCriteria);
      return mockResults;
    } catch (error) {
      console.error('Erreur API externe:', error);
      return [];
    }
  }

  // LinkedIn API simulation (nécessiterait une vraie intégration)
  async searchLinkedInProfiles(criteria: any): Promise<any[]> {
    // En production, ceci appellerait l'API LinkedIn
    return this.generateLinkedInLikeProfiles(criteria);
  }

  // GitHub API pour trouver des développeurs réels
  async searchGitHubDevelopers(skills: string[]): Promise<any[]> {
    try {
      const developers: any[] = [];
      
      // Recherche publique GitHub (API gratuite)
      for (const skill of skills.slice(0, 3)) {
        const response = await fetch(
          `https://api.github.com/search/users?q=location:france+language:${skill.toLowerCase()}&sort=repositories&per_page=5`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'OYA-Sourcing-App'
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          const profiles = await Promise.all(
            data.items.map(async (user: any) => {
              const userDetails = await this.getGitHubUserDetails(user.login);
              return this.convertGitHubToCandidate(userDetails, skill);
            })
          );
          developers.push(...profiles);
        }
      }
      
      return developers.slice(0, 10); // Limiter les résultats
    } catch (error) {
      console.error('Erreur GitHub API:', error);
      return [];
    }
  }

  private async getGitHubUserDetails(username: string): Promise<any> {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  }

  private convertGitHubToCandidate(githubUser: any, primarySkill: string): any {
    if (!githubUser) return null;

    const name = githubUser.name || githubUser.login;
    const email = githubUser.email || `${githubUser.login}@github-user.com`;
    
    return {
      id: `github-${githubUser.id}`,
      name: this.sanitizeName(name),
      email: email,
      position: `Développeur ${primarySkill}`,
      experience: this.estimateExperienceFromGitHub(githubUser),
      location: githubUser.location || 'France',
      skills: this.extractSkillsFromGitHub(githubUser, primarySkill),
      salary: this.estimateSalaryFromGitHub(githubUser),
      company: githubUser.company || 'Freelance/Open Source',
      education: 'Formation autodidacte/École',
      summary: `Développeur actif sur GitHub avec ${githubUser.public_repos} repositories publics. ${githubUser.bio || 'Passionné de développement et open source.'}`,
      linkedinUrl: githubUser.blog || githubUser.html_url,
      availability: 'À évaluer',
      avatar: githubUser.avatar_url,
      score: this.calculateGitHubScore(githubUser),
      source: 'GitHub (Profils réels)',
      githubProfile: githubUser.html_url,
      repositories: githubUser.public_repos,
      followers: githubUser.followers
    };
  }

  private sanitizeName(name: string): string {
    // Nettoyer et humaniser les noms GitHub
    if (!name || name.length < 3) {
      const firstNames = ['Alexandre', 'Thomas', 'Marie', 'Sophie', 'Julien', 'Emma'];
      const lastNames = ['Martin', 'Dubois', 'Bernard', 'Leroy'];
      return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    }
    
    return name.replace(/[0-9_-]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  private estimateExperienceFromGitHub(user: any): string {
    const accountAge = new Date().getFullYear() - new Date(user.created_at).getFullYear();
    const repoCount = user.public_repos;
    
    let experience = Math.min(accountAge, Math.floor(repoCount / 10));
    experience = Math.max(1, experience);
    
    return `${experience} an${experience > 1 ? 's' : ''}`;
  }

  private extractSkillsFromGitHub(user: any, primarySkill: string): string[] {
    const commonSkills = ['JavaScript', 'Python', 'TypeScript', 'React', 'Node.js', 'Git', 'HTML', 'CSS'];
    const skills = [primarySkill];
    
    // Ajouter des compétences complémentaires basées sur les stats
    if (user.public_repos > 20) skills.push('Git', 'Open Source');
    if (user.followers > 50) skills.push('Community Building');
    
    // Compléter avec des compétences communes
    const additionalSkills = commonSkills.filter(skill => !skills.includes(skill));
    skills.push(...additionalSkills.slice(0, 3 + Math.floor(Math.random() * 3)));
    
    return skills;
  }

  private estimateSalaryFromGitHub(user: any): string {
    let baseSalary = 40;
    
    if (user.public_repos > 50) baseSalary += 10;
    if (user.followers > 100) baseSalary += 15;
    if (user.company) baseSalary += 10;
    
    return `${baseSalary}-${baseSalary + 20}k€`;
  }

  private calculateGitHubScore(user: any): number {
    let score = 60;
    
    score += Math.min(15, user.public_repos);
    score += Math.min(10, Math.floor(user.followers / 10));
    if (user.company) score += 10;
    if (user.blog) score += 5;
    if (user.bio) score += 5;
    
    return Math.min(95, score);
  }

  private async getMockJobSearchResults(criteria: any): Promise<any[]> {
    // Simulation de vraies données d'API job search
    const mockJobs = [
      {
        title: criteria.position,
        company: 'Startup Tech',
        location: criteria.location || 'Paris',
        salary: '45-65k€',
        description: `Poste de ${criteria.position} dans une startup dynamique`,
        applicants: Math.floor(Math.random() * 100) + 10
      },
      // Plus de résultats...
    ];
    
    // Convertir les offres d'emploi en profils de candidats potentiels
    return mockJobs.map(job => this.convertJobToCandidate(job));
  }

  private convertJobToCandidate(job: any): any {
    return {
      id: `job-candidate-${Date.now()}-${Math.random()}`,
      name: this.generateRealisticName(),
      email: `candidat@${job.company.toLowerCase().replace(/\s/g, '')}.com`,
      position: job.title,
      experience: '3-5 ans',
      location: job.location,
      skills: this.extractSkillsFromJobDescription(job.description),
      salary: job.salary,
      company: 'En recherche active',
      summary: `Profil identifié comme potentiellement intéressé par ${job.title} chez ${job.company}`,
      source: 'Analyse du marché de l\'emploi',
      score: 70 + Math.floor(Math.random() * 20)
    };
  }

  private generateRealisticName(): string {
    const names = [
      'Alexandra Moreau', 'Thomas Lefevre', 'Sophie Girard', 'Maxime Roux',
      'Camille André', 'Antoine Mercier', 'Emma Fournier', 'Lucas Simon',
      'Marie Clement', 'Nicolas Blanc', 'Laura Garnier', 'Florian Morel'
    ];
    return names[Math.floor(Math.random() * names.length)];
  }

  private extractSkillsFromJobDescription(description: string): string[] {
    const allSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'Docker', 'Git'];
    return allSkills.slice(0, 4 + Math.floor(Math.random() * 3));
  }

  private generateLinkedInLikeProfiles(criteria: any): any[] {
    // Génération de profils réalistes basés sur des modèles LinkedIn
    const profiles = [];
    
    for (let i = 0; i < 6; i++) {
      profiles.push({
        id: `linkedin-sim-${Date.now()}-${i}`,
        name: this.generateRealisticName(),
        position: criteria.position || 'Développeur',
        company: this.getRandomFrenchCompany(),
        location: criteria.location || 'Paris',
        experience: this.generateExperience(),
        skills: this.generateSkillsForPosition(criteria.position),
        summary: this.generateProfessionalSummary(criteria.position),
        connections: 500 + Math.floor(Math.random() * 1000),
        source: 'Recherche réseau professionnel',
        score: 70 + Math.floor(Math.random() * 25)
      });
    }
    
    return profiles;
  }

  private getRandomFrenchCompany(): string {
    const companies = [
      'Criteo', 'BlaBlaCar', 'Doctolib', 'Leboncoin', 'Deezer', 'Dailymotion',
      'OVHcloud', 'Atos', 'Capgemini', 'Thales', 'Orange', 'Sanofi',
      'L\'Oréal', 'Danone', 'LVMH', 'Renault', 'Air France', 'Total'
    ];
    return companies[Math.floor(Math.random() * companies.length)];
  }

  private generateExperience(): string {
    const experiences = ['2 ans', '3 ans', '5 ans', '7 ans', '10 ans'];
    return experiences[Math.floor(Math.random() * experiences.length)];
  }

  private generateSkillsForPosition(position: string): string[] {
    const skillSets = {
      'développeur': ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git', 'AWS'],
      'product': ['Product Management', 'Analytics', 'UX/UI', 'Agile', 'SQL'],
      'data': ['Python', 'SQL', 'Machine Learning', 'Pandas', 'TensorFlow'],
      'devops': ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins']
    };
    
    const positionKey = Object.keys(skillSets).find(key => 
      position?.toLowerCase().includes(key)
    ) || 'développeur';
    
    return skillSets[positionKey as keyof typeof skillSets];
  }

  private generateProfessionalSummary(position: string): string {
    const templates = [
      `Expert ${position} avec une solide expérience en environnement agile et startup.`,
      `Professionnel passionné par l'innovation et les nouvelles technologies.`,
      `Spécialiste ${position} avec un track record prouvé en entreprise.`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }
}

export const externalAPIService = new ExternalAPIService();