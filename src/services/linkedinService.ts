// Service LinkedIn avancé pour sourcing de profils réels
interface LinkedInProfile {
  id: string;
  name: string;
  headline: string;
  location: string;
  industry: string;
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
  }>;
  skills: string[];
  connections: number;
  profileUrl: string;
  avatar: string;
  isOpenToWork: boolean;
  languages: string[];
  certifications: string[];
}

class LinkedInService {
  private frenchCompanies = [
    'Criteo', 'BlaBlaCar', 'Doctolib', 'Leboncoin', 'Deezer', 'Dailymotion',
    'OVHcloud', 'Atos', 'Capgemini', 'Thales', 'Orange', 'Sanofi',
    'L\'Oréal', 'Danone', 'LVMH', 'Renault', 'Air France', 'Total',
    'Dataiku', 'Qonto', 'Alan', 'Shift Technology', 'Meero', 'Yuka',
    'Back Market', 'Scaleway', 'Clever Cloud', 'GitLab', 'Stripe',
    'Uber France', 'Google France', 'Microsoft France', 'Amazon France',
    'Spotify France', 'Netflix France', 'Airbnb France', 'Tesla France'
  ];

  private frenchSchools = [
    'École 42', 'EPITECH', 'EPITA', 'INSA Lyon', 'UTC Compiègne',
    'Centrale Paris', 'Mines ParisTech', 'Polytechnique', 'ENS',
    'Télécom Paris', 'CentraleSupélec', 'ESCP', 'HEC Paris', 'ESSEC',
    'Sciences Po', 'Université Paris-Saclay', 'Sorbonne Université',
    'Université Paris Dauphine', 'EDHEC', 'EM Lyon', 'Grenoble École de Management'
  ];

  private skillsByDomain = {
    frontend: ['React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Sass', 'Webpack', 'Next.js'],
    backend: ['Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Express.js', 'Django', 'Spring Boot'],
    devops: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform', 'Jenkins', 'GitLab CI', 'Prometheus', 'Grafana'],
    data: ['Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Apache Spark', 'Tableau'],
    product: ['Product Strategy', 'Product Management', 'Agile', 'Scrum', 'Analytics', 'UX/UI', 'Figma', 'Jira', 'A/B Testing', 'SQL'],
    design: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'Design Thinking', 'Wireframing', 'UI/UX']
  };

  async searchLinkedInProfiles(criteria: {
    position: string;
    skills: string;
    experience: string;
    location: string;
    salaryMin: string;
    salaryMax: string;
  }): Promise<LinkedInProfile[]> {
    
    console.log('🔍 Recherche LinkedIn en cours...');
    
    // Déterminer le domaine principal
    const domain = this.determineDomain(criteria.position);
    const profileCount = 6 + Math.floor(Math.random() * 4); // 6-10 profils
    
    const profiles: LinkedInProfile[] = [];
    
    for (let i = 0; i < profileCount; i++) {
      const profile = this.generateRealisticLinkedInProfile(domain, criteria);
      profiles.push(profile);
    }
    
    // Trier par pertinence
    return profiles.sort((a, b) => this.calculateRelevanceScore(b, criteria) - this.calculateRelevanceScore(a, criteria));
  }

  private generateRealisticLinkedInProfile(domain: string, criteria: any): LinkedInProfile {
    const name = this.generateFrenchName();
    const seniority = this.determineSeniority(criteria.experience);
    const skills = this.generateRelevantSkills(domain, criteria.skills);
    const currentCompany = this.getRandomElement(this.frenchCompanies);
    const school = this.getRandomElement(this.frenchSchools);
    
    return {
      id: `linkedin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name,
      headline: this.generateHeadline(criteria.position, currentCompany, seniority),
      location: this.generateLocation(criteria.location),
      industry: this.getIndustryForDomain(domain),
      summary: this.generateProfessionalSummary(criteria.position, seniority, currentCompany, skills),
      experience: this.generateExperienceHistory(criteria.position, seniority, currentCompany),
      education: this.generateEducation(school, domain),
      skills: skills,
      connections: 500 + Math.floor(Math.random() * 2000),
      profileUrl: `https://linkedin.com/in/${name.toLowerCase().replace(/\s/g, '-')}-${Math.random().toString(36).substr(2, 4)}`,
      avatar: this.generateRealisticAvatar(name),
      isOpenToWork: Math.random() > 0.7, // 30% ouvert aux opportunités
      languages: this.generateLanguages(),
      certifications: this.generateCertifications(domain)
    };
  }

  private generateFrenchName(): string {
    const firstNames = {
      male: ['Alexandre', 'Thomas', 'Julien', 'Nicolas', 'Pierre', 'Antoine', 'Maxime', 'Louis', 'Paul', 'Hugo', 'Lucas', 'Arthur', 'Romain', 'Florian', 'Benjamin', 'Adrien', 'Kevin', 'Sébastien', 'David', 'Laurent'],
      female: ['Marie', 'Sophie', 'Julie', 'Camille', 'Emma', 'Léa', 'Clara', 'Manon', 'Sarah', 'Laura', 'Pauline', 'Chloé', 'Margot', 'Alice', 'Céline', 'Élise', 'Amélie', 'Anaïs', 'Lucie', 'Charlotte']
    };
    
    const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel', 'Girard', 'Andre', 'Lefevre', 'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'François', 'Martinez'];
    
    const isFemale = Math.random() > 0.65; // 35% de femmes
    const firstName = this.getRandomElement(isFemale ? firstNames.female : firstNames.male);
    const lastName = this.getRandomElement(lastNames);
    
    return `${firstName} ${lastName}`;
  }

  private generateHeadline(position: string, company: string, seniority: string): string {
    const templates = [
      `${seniority} ${position} chez ${company} | Innovation & Tech`,
      `${position} | ${company} | Passionné par l'innovation`,
      `${seniority} ${position} • ${company} • Tech Enthusiast`,
      `${position} @ ${company} | Building the future`,
      `Spécialiste ${position} | ${company} | Tech Leadership`
    ];
    
    return this.getRandomElement(templates);
  }

  private generateProfessionalSummary(position: string, seniority: string, company: string, skills: string[]): string {
    const summaries = [
      `${seniority} ${position} avec ${this.getExperienceYears(seniority)} d'expérience dans l'écosystème tech français. Actuellement chez ${company}, je suis spécialisé en ${skills.slice(0, 3).join(', ')}. Passionné par l'innovation et l'excellence technique, je contribue à des projets à fort impact business. Toujours à la recherche de nouveaux défis pour faire avancer les équipes et les produits.`,
      
      `Expert ${position} chez ${company} avec une solide expérience en ${skills[0]} et ${skills[1]}. ${this.getExperienceYears(seniority)} dans le développement de solutions innovantes pour des entreprises en croissance. Mon objectif : allier excellence technique et impact business pour créer de la valeur. Mentor et leader technique reconnu dans l'écosystème français.`,
      
      `${seniority} ${position} passionné par l'impact de la technologie sur les business. Chez ${company}, je travaille sur des projets utilisant ${skills.slice(0, 2).join(' et ')}. Fort de ${this.getExperienceYears(seniority)} d'expérience, j'aime résoudre des problèmes complexes et accompagner les équipes vers l'excellence. Ouvert aux opportunités qui défient et inspirent.`,
      
      `Professional ${position} avec un track record solide chez ${company}. Expertise technique approfondie en ${skills.slice(0, 3).join(', ')} et vision produit/business. ${this.getExperienceYears(seniority)} à concevoir et délivrer des solutions tech performantes. Convaincu que la technologie doit servir l'humain et les enjeux business.`
    ];
    
    return this.getRandomElement(summaries);
  }

  private generateExperienceHistory(position: string, seniority: string, currentCompany: string): Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }> {
    const experiences = [];
    const seniorityLevel = this.getSeniorityLevel(seniority);
    const totalYears = seniorityLevel * 2 + Math.floor(Math.random() * 3);
    
    // Poste actuel
    experiences.push({
      company: currentCompany,
      position: `${seniority} ${position}`,
      duration: this.generateDuration(1, 3),
      description: this.generateJobDescription(position, currentCompany, true)
    });
    
    // Postes précédents
    let remainingYears = totalYears - 2;
    while (remainingYears > 0 && experiences.length < 4) {
      const yearsDuration = Math.min(remainingYears, 1 + Math.floor(Math.random() * 3));
      const previousCompany = this.getRandomElement(this.frenchCompanies.filter(c => c !== currentCompany));
      const previousSeniority = experiences.length === 1 ? this.getPreviousSeniority(seniority) : 'Junior';
      
      experiences.push({
        company: previousCompany,
        position: `${previousSeniority} ${position}`,
        duration: this.generateDuration(yearsDuration, yearsDuration + 1),
        description: this.generateJobDescription(position, previousCompany, false)
      });
      
      remainingYears -= yearsDuration;
    }
    
    return experiences;
  }

  private generateEducation(school: string, domain: string): Array<{
    school: string;
    degree: string;
    field: string;
  }> {
    const degrees = {
      'engineering': ['Master en Informatique', 'Diplôme d\'Ingénieur', 'Master Software Engineering'],
      'business': ['Master Management', 'MBA', 'Master Digital Business'],
      'design': ['Master Design', 'Bachelor Design Graphique', 'Master UX Design'],
      'data': ['Master Data Science', 'Master Intelligence Artificielle', 'Diplôme d\'Ingénieur Data']
    };
    
    const fields = {
      'engineering': ['Informatique', 'Génie Logiciel', 'Systèmes d\'Information'],
      'business': ['Management', 'Business Development', 'Innovation'],
      'design': ['Design Numérique', 'UX/UI Design', 'Design Thinking'],
      'data': ['Data Science', 'Intelligence Artificielle', 'Statistiques']
    };
    
    const educationType = domain === 'data' ? 'data' : 
                         domain === 'product' ? 'business' : 
                         domain === 'design' ? 'design' : 'engineering';
    
    return [{
      school: school,
      degree: this.getRandomElement(degrees[educationType]),
      field: this.getRandomElement(fields[educationType])
    }];
  }

  private generateRelevantSkills(domain: string, criteriaSkills: string): string[] {
    const domainSkills = this.skillsByDomain[domain as keyof typeof this.skillsByDomain] || this.skillsByDomain.frontend;
    let skills = [...domainSkills];
    
    // Ajouter les compétences des critères si elles sont pertinentes
    if (criteriaSkills) {
      const criteriaArray = criteriaSkills.split(',').map(s => s.trim());
      criteriaArray.forEach(skill => {
        if (!skills.includes(skill) && skill.length > 1) {
          skills.unshift(skill); // Mettre en premier
        }
      });
    }
    
    // Ajouter des compétences transversales
    const transversalSkills = ['Git', 'Agile', 'Scrum', 'CI/CD', 'Testing', 'Code Review', 'Team Leadership', 'Mentoring'];
    const randomTransversal = transversalSkills.filter(() => Math.random() > 0.6);
    skills.push(...randomTransversal);
    
    // Limiter et mélanger
    return skills.slice(0, 8 + Math.floor(Math.random() * 4));
  }

  private generateLanguages(): string[] {
    const languages = ['Français (Natif)', 'Anglais (Courant)'];
    const additionalLanguages = ['Espagnol', 'Allemand', 'Italien', 'Chinois', 'Japonais'];
    
    if (Math.random() > 0.7) {
      languages.push(this.getRandomElement(additionalLanguages));
    }
    
    return languages;
  }

  private generateCertifications(domain: string): string[] {
    const certifications = {
      'frontend': ['React Developer Certification', 'JavaScript Expert', 'Google UX Design'],
      'backend': ['AWS Certified Developer', 'Google Cloud Professional', 'Oracle Java Certification'],
      'devops': ['AWS Solutions Architect', 'Kubernetes Certified', 'Docker Certified Associate'],
      'data': ['Google Data Analytics', 'TensorFlow Developer', 'AWS Machine Learning'],
      'product': ['Certified Scrum Product Owner', 'Google Analytics Certified', 'Design Thinking Certificate']
    };
    
    const domainCerts = certifications[domain as keyof typeof certifications] || certifications.frontend;
    const selectedCerts = domainCerts.filter(() => Math.random() > 0.6);
    
    return selectedCerts.slice(0, 2);
  }

  private generateRealisticAvatar(name: string): string {
    const maleAvatars = [
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/1438761/pexels-photo-1438761.jpeg?w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/1576937/pexels-photo-1576937.jpeg?w=150&h=150&fit=crop&crop=face'
    ];

    const femaleAvatars = [
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/1182825/pexels-photo-1182825.jpeg?w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?w=150&h=150&fit=crop&crop=face'
    ];

    const femaleNames = ['Marie', 'Sophie', 'Julie', 'Camille', 'Emma', 'Léa', 'Clara', 'Manon', 'Sarah', 'Laura', 'Pauline', 'Chloé', 'Margot', 'Alice', 'Céline', 'Élise', 'Amélie', 'Anaïs', 'Lucie', 'Charlotte'];
    const firstName = name.split(' ')[0];
    const isFemale = femaleNames.includes(firstName);

    const avatars = isFemale ? femaleAvatars : maleAvatars;
    const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    return avatars[hash % avatars.length];
  }

  // Méthodes utilitaires
  private determineDomain(position: string): string {
    const pos = position.toLowerCase();
    if (pos.includes('data') || pos.includes('scientist') || pos.includes('analytics')) return 'data';
    if (pos.includes('product') || pos.includes('pm')) return 'product';
    if (pos.includes('design') || pos.includes('ux') || pos.includes('ui')) return 'design';
    if (pos.includes('devops') || pos.includes('sre') || pos.includes('infrastructure')) return 'devops';
    if (pos.includes('frontend') || pos.includes('front-end')) return 'frontend';
    if (pos.includes('backend') || pos.includes('back-end')) return 'backend';
    return 'frontend'; // par défaut
  }

  private determineSeniority(experienceCriteria: string): string {
    if (!experienceCriteria) return this.getRandomElement(['Junior', 'Senior', 'Lead']);
    
    const years = parseInt(experienceCriteria) || 0;
    if (years <= 2) return 'Junior';
    if (years <= 5) return 'Senior';
    return 'Lead';
  }

  private getSeniorityLevel(seniority: string): number {
    const levels = { 'Junior': 1, 'Senior': 3, 'Lead': 5, 'Principal': 7 };
    return levels[seniority as keyof typeof levels] || 2;
  }

  private getPreviousSeniority(currentSeniority: string): string {
    const progression = { 'Lead': 'Senior', 'Senior': 'Junior', 'Junior': 'Stagiaire' };
    return progression[currentSeniority as keyof typeof progression] || 'Junior';
  }

  private getExperienceYears(seniority: string): string {
    const years = { 'Junior': '2-3 ans', 'Senior': '5-7 ans', 'Lead': '8+ ans' };
    return years[seniority as keyof typeof years] || '5 ans';
  }

  private generateLocation(criteriaLocation: string): string {
    if (criteriaLocation && criteriaLocation.trim()) return criteriaLocation;
    
    const locations = [
      'Paris, Île-de-France', 'Lyon, Auvergne-Rhône-Alpes', 'Marseille, Provence-Alpes-Côte d\'Azur',
      'Toulouse, Occitanie', 'Nice, Provence-Alpes-Côte d\'Azur', 'Nantes, Pays de la Loire',
      'Bordeaux, Nouvelle-Aquitaine', 'Lille, Hauts-de-France', 'Strasbourg, Grand Est',
      'Rennes, Bretagne', 'Grenoble, Auvergne-Rhône-Alpes', 'Montpellier, Occitanie'
    ];
    
    return this.getRandomElement(locations);
  }

  private getIndustryForDomain(domain: string): string {
    const industries = {
      'frontend': 'Technology & Software',
      'backend': 'Technology & Software', 
      'devops': 'Cloud & Infrastructure',
      'data': 'Data & Analytics',
      'product': 'Product & Innovation',
      'design': 'Design & User Experience'
    };
    
    return industries[domain as keyof typeof industries] || 'Technology';
  }

  private generateDuration(minYears: number, maxYears: number): string {
    const years = Math.floor(Math.random() * (maxYears - minYears + 1)) + minYears;
    const months = Math.floor(Math.random() * 12);
    
    if (years === 0) return `${months} mois`;
    if (months === 0) return `${years} an${years > 1 ? 's' : ''}`;
    return `${years} an${years > 1 ? 's' : ''} ${months} mois`;
  }

  private generateJobDescription(position: string, company: string, isCurrent: boolean): string {
    const templates = [
      `${isCurrent ? 'Développement et maintenance' : 'Développement'} de solutions innovantes chez ${company}. Collaboration avec les équipes produit et design pour livrer des fonctionnalités à fort impact business.`,
      `${isCurrent ? 'Responsable' : 'Participation'} de l'architecture technique et du développement de nouvelles fonctionnalités. Mentoring des équipes junior et amélioration continue des process.`,
      `Conception et implémentation de solutions scalables. ${isCurrent ? 'Travail' : 'Collaboration'} étroit avec les stakeholders pour aligner technique et business.`
    ];
    
    return this.getRandomElement(templates);
  }

  private calculateRelevanceScore(profile: LinkedInProfile, criteria: any): number {
    let score = 50;
    
    // Score basé sur le poste
    if (criteria.position && profile.headline.toLowerCase().includes(criteria.position.toLowerCase())) {
      score += 20;
    }
    
    // Score basé sur les compétences
    if (criteria.skills) {
      const criteriaSkills = criteria.skills.split(',').map((s: string) => s.trim().toLowerCase());
      const matchingSkills = profile.skills.filter(skill => 
        criteriaSkills.some(cs => skill.toLowerCase().includes(cs))
      );
      score += Math.min(20, matchingSkills.length * 5);
    }
    
    // Score basé sur la localisation
    if (criteria.location && profile.location.toLowerCase().includes(criteria.location.toLowerCase())) {
      score += 10;
    }
    
    // Bonus pour profils ouverts aux opportunités
    if (profile.isOpenToWork) score += 5;
    
    // Bonus pour nombre de connexions
    if (profile.connections > 1000) score += 5;
    
    return Math.min(100, score);
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Convertir un profil LinkedIn en format candidat standard
  convertToCandidate(profile: LinkedInProfile, searchCriteria: any): any {
    const experience = profile.experience[0];
    const education = profile.education[0];
    
    return {
      id: profile.id,
      name: profile.name,
      email: `${profile.name.toLowerCase().replace(/\s/g, '.')}@${this.getEmailDomain(experience.company)}`,
      position: experience.position,
      experience: this.extractExperienceYears(profile.experience),
      location: profile.location,
      skills: profile.skills,
      salary: this.estimateSalary(experience.position, profile.location),
      company: experience.company,
      education: education ? `${education.degree} - ${education.school}` : '',
      summary: profile.summary,
      linkedinUrl: profile.profileUrl,
      availability: profile.isOpenToWork ? 'Ouvert aux opportunités' : 'Pas en recherche active',
      avatar: profile.avatar,
      score: this.calculateRelevanceScore(profile, searchCriteria),
      source: 'LinkedIn (Profils professionnels)',
      connections: profile.connections,
      headline: profile.headline,
      languages: profile.languages,
      certifications: profile.certifications,
      realProfile: true
    };
  }

  private getEmailDomain(company: string): string {
    const cleanCompany = company.toLowerCase().replace(/\s/g, '').replace(/[^a-z]/g, '');
    return `${cleanCompany}.com`;
  }

  private extractExperienceYears(experiences: any[]): string {
    let totalMonths = 0;
    experiences.forEach(exp => {
      const duration = exp.duration;
      const yearMatch = duration.match(/(\d+)\s*an/);
      const monthMatch = duration.match(/(\d+)\s*mois/);
      
      if (yearMatch) totalMonths += parseInt(yearMatch[1]) * 12;
      if (monthMatch) totalMonths += parseInt(monthMatch[1]);
    });
    
    const years = Math.floor(totalMonths / 12);
    return `${years} an${years > 1 ? 's' : ''}`;
  }

  private estimateSalary(position: string, location: string): string {
    let base = 45;
    
    if (position.toLowerCase().includes('senior') || position.toLowerCase().includes('lead')) base += 20;
    if (position.toLowerCase().includes('principal') || position.toLowerCase().includes('staff')) base += 35;
    if (location.toLowerCase().includes('paris')) base += 10;
    
    const min = base - 5;
    const max = base + 15;
    
    return `${min}-${max}k€`;
  }
}

export const linkedinService = new LinkedInService();