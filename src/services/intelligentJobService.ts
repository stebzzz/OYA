// Service pour la gestion intelligente des offres d'emploi
interface JobData {
  title: string;
  department: string;
  location: string;
  experience: string;
  salary: string;
}

class IntelligentJobService {
  async generateJobDescription(jobData: JobData): Promise<{
    description: string;
    requirements: string[];
    benefits: string[];
    skills: string[];
    marketAnalysis: string;
  }> {
    // Simulation d'un appel IA réel
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { title, department, location, experience, salary } = jobData;

    // Génération basée sur le type de poste
    const jobType = this.determineJobType(title);
    
    return {
      description: this.generateDescription(title, department, jobType),
      requirements: this.generateRequirements(jobType, experience),
      benefits: this.generateBenefits(location, salary),
      skills: this.generateSkills(jobType),
      marketAnalysis: this.generateMarketAnalysis(title, location, salary)
    };
  }

  async scoreJobPosting(jobData: any): Promise<number> {
    let score = 70;

    // Score basé sur la complétude
    if (jobData.description?.length > 200) score += 10;
    if (jobData.requirements?.length >= 3) score += 10;
    if (jobData.benefits?.length >= 3) score += 10;
    if (jobData.skills?.length >= 4) score += 5;
    if (jobData.salary) score += 5;
    
    // Score basé sur l'attractivité
    if (jobData.benefits?.some((b: string) => b.toLowerCase().includes('télétravail'))) score += 5;
    if (jobData.benefits?.some((b: string) => b.toLowerCase().includes('formation'))) score += 3;
    
    // Variation aléatoire pour simuler l'IA
    score += Math.floor(Math.random() * 10) - 5;
    
    return Math.min(100, Math.max(60, score));
  }

  private determineJobType(title: string): string {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('développeur') || titleLower.includes('developer') || titleLower.includes('dev')) {
      return 'developer';
    }
    if (titleLower.includes('product') || titleLower.includes('pm')) {
      return 'product';
    }
    if (titleLower.includes('data') || titleLower.includes('scientist') || titleLower.includes('analyst')) {
      return 'data';
    }
    if (titleLower.includes('design') || titleLower.includes('ux') || titleLower.includes('ui')) {
      return 'design';
    }
    if (titleLower.includes('devops') || titleLower.includes('sre') || titleLower.includes('infrastructure')) {
      return 'devops';
    }
    if (titleLower.includes('marketing') || titleLower.includes('growth')) {
      return 'marketing';
    }
    
    return 'general';
  }

  private generateDescription(title: string, department: string, jobType: string): string {
    const baseTemplates = {
      developer: `Nous recherchons un ${title} passionné pour rejoindre notre équipe ${department || 'Engineering'}. Vous contribuerez au développement de solutions innovantes et scalables qui impactent directement nos utilisateurs.

Au quotidien, vous serez amené(e) à :
• Concevoir et développer de nouvelles fonctionnalités
• Collaborer étroitement avec les équipes produit et design
• Participer à l'architecture technique et aux choix technologiques
• Assurer la qualité du code et les bonnes pratiques
• Mentorer les développeurs junior
• Contribuer à l'amélioration continue de nos processus

Rejoignez une équipe dynamique où votre expertise technique sera valorisée et où vous aurez l'opportunité de faire évoluer vos compétences sur des projets à fort impact.`,

      product: `Nous recherchons un ${title} expérimenté pour piloter la stratégie produit et l'innovation au sein de notre équipe ${department || 'Product'}.

Vos missions principales :
• Définir et exécuter la roadmap produit en cohérence avec la vision entreprise
• Analyser les besoins utilisateurs et identifier les opportunités de croissance
• Collaborer avec les équipes engineering, design et data pour livrer des fonctionnalités à impact
• Piloter les métriques produit et optimiser les parcours utilisateurs
• Gérer le backlog et prioriser les développements
• Animer les rituels agiles et faciliter la prise de décision

Poste clé pour façonner l'avenir de nos produits et maximiser la satisfaction utilisateur.`,

      data: `Rejoignez notre équipe Data en tant que ${title} et contribuez à transformer les données en insights actionnables pour accélérer la croissance de l'entreprise.

Responsabilités :
• Développer et déployer des modèles de machine learning en production
• Analyser de larges volumes de données pour identifier des patterns et opportunités
• Collaborer avec les équipes métier pour traduire les besoins en solutions data
• Construire et maintenir des pipelines de données robustes et scalables
• Créer des dashboards et rapports pour le pilotage business
• Veiller à la qualité et à la gouvernance des données

Opportunité unique de travailler sur des problématiques data variées avec un impact direct sur le business.`,

      design: `Nous recherchons un ${title} créatif et orienté utilisateur pour concevoir des expériences exceptionnelles et faire évoluer notre design system.

Missions :
• Concevoir des interfaces utilisateur intuitives et esthétiques
• Mener des recherches utilisateurs et des tests d'usabilité
• Collaborer étroitement avec les équipes produit et development
• Faire évoluer et maintenir notre design system
• Prototyper et itérer sur les concepts design
• Assurer la cohérence de l'expérience utilisateur sur tous nos produits

Rejoignez une équipe où le design thinking est au cœur de notre approche produit.`,

      marketing: `Rejoignez notre équipe Marketing en tant que ${title} et contribuez à accélérer notre croissance et renforcer notre présence sur le marché.

Vos responsabilités :
• Développer et exécuter les stratégies d'acquisition et de rétention
• Gérer les campagnes multi-canaux (digital, content, events)
• Analyser les performances et optimiser les conversions
• Collaborer avec les équipes produit pour le go-to-market
• Créer du contenu engageant et développer la brand awareness
• Piloter les partenariats et relations influenceurs

Poste stratégique pour faire rayonner notre marque et nos produits.`,

      general: `Nous recherchons un ${title} motivé pour rejoindre notre équipe ${department || ''} et contribuer au développement de notre entreprise en pleine croissance.

Missions principales :
• Contribuer activement aux projets stratégiques de l'équipe
• Collaborer avec les différentes parties prenantes internes
• Apporter votre expertise pour optimiser nos processus
• Participer à l'innovation et à l'amélioration continue
• Développer vos compétences dans un environnement stimulant

Opportunité de rejoindre une équipe dynamique avec de réelles perspectives d'évolution.`
    };

    return baseTemplates[jobType as keyof typeof baseTemplates] || baseTemplates.general;
  }

  private generateRequirements(jobType: string, experience: string): string[] {
    const baseRequirements = {
      developer: [
        'Maîtrise des langages de programmation modernes',
        'Expérience avec les frameworks front-end et/ou back-end',
        'Connaissance des bonnes pratiques de développement',
        'Expérience avec Git et les outils de CI/CD',
        'Capacité à travailler en équipe agile',
        'Anglais technique courant'
      ],
      product: [
        'Expérience en gestion de produit digital',
        'Maîtrise des méthodologies agiles (Scrum, Kanban)',
        'Compétences analytiques et data-driven',
        'Excellente communication et leadership',
        'Connaissance des outils de product management',
        'Vision business et orienté utilisateur'
      ],
      data: [
        'Maîtrise de Python, R ou SQL',
        'Expérience en machine learning et statistiques',
        'Connaissance des outils Big Data',
        'Capacité à communiquer des insights complexes',
        'Expérience avec les plateformes cloud',
        'Rigueur et méthode scientifique'
      ],
      design: [
        'Maîtrise des outils de design (Figma, Sketch)',
        'Expérience en UX research et testing',
        'Connaissance des principes de design système',
        'Portfolio démontrant votre expertise',
        'Capacité à collaborer avec les développeurs',
        'Vision utilisateur et empathie'
      ],
      marketing: [
        'Expérience en marketing digital',
        'Maîtrise des outils d\'analytics et CRM',
        'Compétences en content marketing',
        'Connaissance du growth hacking',
        'Excellente communication écrite et orale',
        'Créativité et orientation résultats'
      ],
      general: [
        'Formation supérieure pertinente',
        'Excellentes capacités de communication',
        'Capacité d\'adaptation et d\'apprentissage',
        'Esprit d\'équipe et autonomie',
        'Orientation résultats et client'
      ]
    };

    let requirements = [...(baseRequirements[jobType as keyof typeof baseRequirements] || baseRequirements.general)];

    // Adapter selon l'expérience
    if (experience?.includes('Senior') || experience?.includes('5+') || experience?.includes('Lead')) {
      requirements.push('Leadership et mentoring d\'équipe');
      requirements.push('Vision stratégique et capacité d\'influence');
    }

    return requirements.slice(0, 6);
  }

  private generateBenefits(location: string, salary: string): string[] {
    const baseBenefits = [
      'Télétravail flexible (2-3 jours/semaine)',
      'Mutuelle premium prise en charge à 100%',
      'Tickets restaurant ou carte repas',
      'Budget formation et conférences (2000€/an)',
      'Équipement informatique au choix',
      'RTT et congés flexibles'
    ];

    const additionalBenefits = [
      'Stock options ou intéressement',
      'Salle de sport ou abonnement fitness',
      'Crèche d\'entreprise ou aide garde d\'enfants',
      'Vélo ou transport en commun pris en charge',
      'Team building et événements d\'équipe',
      'Espace de travail moderne et ergonomique',
      'Café, snacks et fruits à volonté',
      'Horaires flexibles et aménagés',
      'Programme de mobilité internationale',
      'Accompagnement carrière et coaching'
    ];

    // Ajouter des avantages spécifiques selon la localisation
    if (location?.toLowerCase().includes('paris')) {
      additionalBenefits.push('Prime transport Paris');
      additionalBenefits.push('Navette entreprise');
    }

    // Ajouter des avantages selon le niveau de salaire
    if (salary && parseInt(salary) > 70) {
      additionalBenefits.push('Package de rémunération attractif');
      additionalBenefits.push('Bonus performance');
    }

    // Sélectionner aléatoirement 3-4 avantages additionnels
    const selectedAdditional = additionalBenefits
      .sort(() => 0.5 - Math.random())
      .slice(0, 3 + Math.floor(Math.random() * 2));

    return [...baseBenefits.slice(0, 4), ...selectedAdditional].slice(0, 7);
  }

  private generateSkills(jobType: string): string[] {
    const skillSets = {
      developer: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Git', 'SQL', 'API REST'],
      product: ['Product Management', 'Analytics', 'Agile', 'Scrum', 'UX/UI', 'SQL', 'Figma', 'Jira', 'A/B Testing', 'Growth'],
      data: ['Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas', 'Spark', 'AWS', 'Statistics', 'Visualization'],
      design: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'Design Thinking', 'Wireframing', 'Design System'],
      marketing: ['Google Analytics', 'Facebook Ads', 'SEO', 'Content Marketing', 'CRM', 'A/B Testing', 'Email Marketing', 'Social Media'],
      devops: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins', 'Monitoring', 'Linux', 'CI/CD'],
      general: ['Communication', 'Project Management', 'Problem Solving', 'Teamwork', 'Adaptability']
    };

    return skillSets[jobType as keyof typeof skillSets] || skillSets.general;
  }

  private generateMarketAnalysis(title: string, location: string, salary: string): string {
    const analyses = [
      `Le marché pour les ${title} est très dynamique en France, avec une demande forte et des opportunités en croissance.`,
      `Position très recherchée sur le marché français, particulièrement dans la région ${location || 'Île-de-France'}.`,
      `Profil en tension avec une compétitivité salariale importante. Fourchette ${salary || '45-65k€'} alignée sur le marché.`,
      `Secteur en pleine expansion avec de nombreuses opportunités d'évolution pour ce type de poste.`
    ];

    return analyses[Math.floor(Math.random() * analyses.length)];
  }
}

export const intelligentJobService = new IntelligentJobService();