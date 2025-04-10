// Service pour les appels à l'API d'IA
// Note: Pour le moment, ce service simule les réponses

// Types
export interface AIRequestParams {
  prompt: string;
  userId: string;
  context?: string[];
  maxTokens?: number;
  temperature?: number;
}

// Fonction simulée pour obtenir une réponse de l'IA
export const getAIResponse = async (params: AIRequestParams): Promise<string> => {
  // Dans une application réelle, nous ferions un appel API ici
  // à OpenAI, Claude, ou un autre modèle de langage
  
  console.log('Paramètres de requête AI:', params);
  
  // Simuler un délai de réponse
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Logique simple pour générer des réponses différentes selon le contenu de la requête
  const prompt = params.prompt.toLowerCase();
  
  if (prompt.includes('bonjour') || prompt.includes('salut')) {
    return "Bonjour ! Comment puis-je vous aider aujourd'hui avec la gestion de vos intérimaires ou de vos missions ?";
  } else if (prompt.includes('merci')) {
    return "De rien ! Je suis là pour vous aider. N'hésitez pas si vous avez d'autres questions concernant la gestion de vos intérimaires ou missions.";
  } else if (prompt.includes('intérimaire') || prompt.includes('interim')) {
    return "La gestion des intérimaires est une partie essentielle de notre plateforme OYA. Vous pouvez ajouter de nouveaux intérimaires, gérer leurs profils, suivre leurs missions et générer tous les documents nécessaires automatiquement. Avez-vous besoin d'aide sur un aspect particulier de la gestion des intérimaires ?";
  } else if (prompt.includes('mission')) {
    return "Notre système de gestion des missions vous permet de créer, planifier et suivre toutes vos missions d'intérim. Vous pouvez définir les qualifications requises, la durée, le lieu, et le système vous aidera à trouver les intérimaires les plus adaptés. Souhaitez-vous en savoir plus sur une fonctionnalité spécifique ?";
  } else if (prompt.includes('document') || prompt.includes('contrat')) {
    return "La gestion documentaire d'OYA vous permet de générer automatiquement tous les documents contractuels nécessaires (contrats de mission, avenants, attestations, etc.). Tous les documents sont conformes à la législation en vigueur et peuvent être signés électroniquement. Voulez-vous que je vous explique comment générer un document spécifique ?";
  } else if (prompt.includes('rapport') || prompt.includes('statistique')) {
    return "Le module de rapports d'OYA vous offre des analyses détaillées de votre activité d'intérim. Vous pouvez générer des rapports sur les heures travaillées, les coûts, les performances, et de nombreux autres indicateurs. Ces rapports peuvent être exportés en différents formats et personnalisés selon vos besoins. Quel type d'information cherchez-vous à analyser ?";
  } else if (prompt.includes('paiement') || prompt.includes('facture') || prompt.includes('facturation')) {
    return "OYA simplifie la gestion des paiements des intérimaires et la facturation des clients. Le système calcule automatiquement les heures travaillées, les taux horaires, les primes et génère les fiches de paie pour les intérimaires ainsi que les factures pour vos clients. Vous pouvez également suivre les paiements en attente et générer des rapports financiers détaillés.";
  } else if (prompt.includes('législation') || prompt.includes('loi') || prompt.includes('légal')) {
    return "Notre plateforme est constamment mise à jour pour respecter la législation du travail temporaire. OYA vous aide à rester conforme en générant tous les documents requis par la loi, en vérifiant les durées maximales de mission, et en s'assurant que tous les aspects légaux sont respectés. Nous proposons également des alertes pour vous informer des changements législatifs qui pourraient affecter votre activité.";
  } else {
    return "Je comprends votre demande concernant \"" + params.prompt + "\". Pour vous aider efficacement, pourriez-vous me donner plus de détails ou me préciser quel aspect spécifique vous intéresse ? Je suis là pour vous fournir les informations les plus pertinentes possible sur la gestion de vos intérimaires et missions.";
  }
};

// Fonction pour analyser un CV
export interface CVAnalysisRequest {
  fileContent?: string;
  fileUrl?: string;
  workerName: string;
  language?: string;
}

export interface CVAnalysisResponse {
  extractedSkills: string[];
  experience: string[];
  education: string[];
  summary: string;
  recommendedJobs: string[];
}

export const analyzeCVWithAI = async (params: CVAnalysisRequest): Promise<CVAnalysisResponse> => {
  console.log('Paramètres d\'analyse de CV:', params);
  
  // Simuler un délai pour l'analyse
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // Cette fonction simule une analyse IA
  // Dans une implémentation réelle, vous enverriez le contenu ou l'URL du CV à une API d'IA
  
  const commonSkills = [
    'Communication', 'Travail d\'équipe', 'Gestion de projet', 'Leadership',
    'Résolution de problèmes', 'Adaptabilité', 'Créativité', 'Analyse de données',
    'Développement web', 'JavaScript', 'React', 'TypeScript', 'Node.js',
    'Soudure', 'Électricité', 'Plomberie', 'Manutention', 'Cariste',
    'Comptabilité', 'Marketing', 'Vente', 'Service client'
  ];
  
  // Sélectionner aléatoirement 3-6 compétences
  const randomSkills = () => {
    const shuffled = [...commonSkills].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 4) + 3);
  };
  
  const randomExperiences = [
    [`Développeur FullStack - Tech Solutions (2019-2023)`,
     `Ingénieur Frontend - WebCreate (2016-2019)`],
    [`Technicien de maintenance - Entreprise Industrielle (2020-2023)`,
     `Électricien - BTP Services (2015-2020)`],
    [`Responsable logistique - LogiStock (2018-2023)`,
     `Cariste - TransportExpress (2014-2018)`],
    [`Chef de projet - ConsultingPro (2017-2023)`,
     `Analyste d'affaires - BusinessSolutions (2012-2017)`]
  ];
  
  const randomEducation = [
    [`Master en Informatique - Université de Paris (2016)`,
     `Licence en Mathématiques - Université de Lyon (2014)`],
    [`CAP Électricien - Centre de formation professionnelle (2015)`,
     `Bac Professionnel Électronique - Lycée technique (2013)`],
    [`BTS Logistique - École supérieure de commerce (2014)`,
     `Bac Général - Lycée général (2012)`],
    [`Master en Management - HEC Paris (2012)`,
     `Licence en Économie - Université de Bordeaux (2010)`]
  ];
  
  const randomRecommendedJobs = [
    ['Développeur Frontend', 'Chef de Projet IT', 'Consultant Technique'],
    ['Électricien industriel', 'Technicien de maintenance', 'Chef d\'équipe BTP'],
    ['Responsable logistique', 'Gestionnaire de stock', 'Coordinateur transport'],
    ['Chef de projet', 'Consultant business', 'Analyste stratégique']
  ];
  
  // Choisir aléatoirement un index pour les données cohérentes
  const dataIndex = Math.floor(Math.random() * 4);
  
  return {
    extractedSkills: randomSkills(),
    experience: randomExperiences[dataIndex],
    education: randomEducation[dataIndex],
    summary: `${params.workerName} est un professionnel expérimenté avec un parcours solide. Son CV démontre des compétences variées et une progression constante dans sa carrière.`,
    recommendedJobs: randomRecommendedJobs[dataIndex]
  };
};

// Dans une application réelle, nous pourrions avoir d'autres fonctions utiles :
// - Fonction pour stocker les conversations pour l'apprentissage
// - Fonction pour obtenir des suggestions basées sur les requêtes passées
// - Fonction pour valider/filtrer le contenu inapproprié 

// Interface pour les offres d'emploi
export interface JobOffer {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    industry: string;
  };
  description: string;
  location: string;
  type: string;
  postedAt: Date;
  skills: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  requirements: string[];
  startDate: Date;
}

// Interface pour le résultat de correspondance
export interface MatchResult {
  score: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendation: string;
}

// Fonction pour générer un résumé optimisé du candidat
export const generateWorkerSummary = async (worker: any): Promise<string> => {
  console.log('Génération du résumé pour:', worker.firstName, worker.lastName);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let skillsText = '';
  if (worker.skills && worker.skills.length > 0) {
    skillsText = worker.skills.slice(0, 3).join(', ');
    if (worker.skills.length > 3) {
      skillsText += ` et ${worker.skills.length - 3} autres compétences`;
    }
  }
  
  let experienceText = '';
  if (worker.cvAnalysis?.experience && worker.cvAnalysis.experience.length > 0) {
    const lastExp = worker.cvAnalysis.experience[0];
    if (lastExp.includes('-')) {
      const role = lastExp.split('-')[0].trim();
      experienceText = `avec une expérience en tant que ${role}`;
    } else {
      experienceText = `avec une expérience professionnelle significative`;
    }
  }
  
  const fullName = `${worker.firstName} ${worker.lastName}`;
  
  return `${fullName} est un professionnel ${experienceText} spécialisé en ${skillsText}. ${worker.cvAnalysis?.summary || ''}`;
};

// Fonction pour faire correspondre un candidat avec des offres d'emploi
export const matchWorkerWithJobs = async (worker: any, jobs: JobOffer[]): Promise<{jobId: string, match: MatchResult}[]> => {
  console.log('Recherche de correspondances pour:', worker.firstName, worker.lastName);
  
  // Simuler un délai d'analyse
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const workerSkills = new Set<string>(worker.skills || []);
  if (worker.cvAnalysis?.extractedSkills) {
    worker.cvAnalysis.extractedSkills.forEach((skill: string) => workerSkills.add(skill));
  }
  
  const results = jobs.map(job => {
    // Calculer les compétences correspondantes et manquantes
    const matchingSkills = job.skills.filter(skill => 
      workerSkills.has(skill) || 
      [...workerSkills].some(workerSkill => 
        workerSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(workerSkill.toLowerCase())
      )
    );
    
    const missingSkills = job.skills.filter(skill => !matchingSkills.includes(skill));
    
    // Calculer un score de correspondance (0-100)
    const score = Math.round(
      (matchingSkills.length / job.skills.length) * 100
    );
    
    // Générer une recommandation
    let recommendation = '';
    if (score >= 80) {
      recommendation = 'Excellente correspondance - Candidat fortement recommandé';
    } else if (score >= 60) {
      recommendation = 'Bonne correspondance - Candidat à considérer';
    } else if (score >= 40) {
      recommendation = 'Correspondance moyenne - Besoin de formation complémentaire';
    } else {
      recommendation = 'Correspondance faible - Non recommandé pour ce poste';
    }
    
    return {
      jobId: job.id,
      match: {
        score,
        matchingSkills,
        missingSkills,
        recommendation
      }
    };
  });
  
  // Trier par score décroissant
  return results.sort((a, b) => b.match.score - a.match.score);
};

// Fonction pour générer des offres d'emploi fictives basées sur les compétences du candidat
export const generateRelevantJobOffers = async (worker: any): Promise<JobOffer[]> => {
  console.log('Génération d\'offres pour:', worker.firstName, worker.lastName);
  
  // Simuler un délai
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const workerSkills = new Set([...(worker.skills || []), ...(worker.cvAnalysis?.extractedSkills || [])]);
  const allSkills = Array.from(workerSkills);
  
  // Générer des offres d'emploi en fonction des compétences du candidat
  const jobOffers: JobOffer[] = [];
  
  // Offres dans le domaine du développement
  if (allSkills.some(skill => 
    ['Développement web', 'JavaScript', 'React', 'TypeScript', 'Node.js'].includes(skill))
  ) {
    jobOffers.push({
      id: '1',
      title: 'Développeur Frontend',
      company: {
        id: 'TechSolutions',
        name: 'Tech Solutions',
        industry: 'Technologie'
      },
      description: 'Nous recherchons un développeur frontend talentueux pour rejoindre notre équipe produit en pleine croissance.',
      location: 'Paris',
      type: 'CDI',
      postedAt: new Date(),
      skills: ['JavaScript', 'React', 'TypeScript', 'HTML', 'CSS'],
      salary: {
        min: 45000,
        max: 55000,
        currency: '€'
      },
      requirements: ['JavaScript', 'React', 'TypeScript', 'HTML', 'CSS'],
      startDate: new Date('2023-01-01')
    });
    
    jobOffers.push({
      id: '2',
      title: 'Développeur Fullstack',
      company: {
        id: 'DigitalInnovations',
        name: 'Digital Innovations',
        industry: 'Technologie'
      },
      description: 'Participez au développement de nos applications web et mobiles innovantes.',
      location: 'Lyon',
      type: 'CDI',
      postedAt: new Date(),
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'API REST'],
      salary: {
        min: 50000,
        max: 60000,
        currency: '€'
      },
      requirements: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'API REST'],
      startDate: new Date('2023-01-01')
    });
  }
  
  // Offres dans le domaine technique
  if (allSkills.some(skill => 
    ['Électricité', 'Plomberie', 'Chauffage', 'Maintenance', 'Soudure'].includes(skill))
  ) {
    jobOffers.push({
      id: '3',
      title: 'Technicien de Maintenance',
      company: {
        id: 'IndustrialTech',
        name: 'Industrial Tech',
        industry: 'Industrie'
      },
      description: 'Vous serez responsable de la maintenance préventive et corrective des équipements industriels.',
      location: 'Marseille',
      type: 'CDD',
      postedAt: new Date(),
      skills: ['Électricité', 'Maintenance', 'Diagnostic', 'Travail en équipe'],
      salary: {
        min: 28000,
        max: 35000,
        currency: '€'
      },
      requirements: ['Électricité', 'Maintenance', 'Diagnostic', 'Travail en équipe'],
      startDate: new Date('2023-01-01')
    });
    
    jobOffers.push({
      id: '4',
      title: 'Électricien du Bâtiment',
      company: {
        id: 'BTPSolutions',
        name: 'BTP Solutions',
        industry: 'Bâtiment'
      },
      description: 'Réalisation et mise en service d\'installations électriques pour des bâtiments résidentiels et tertiaires.',
      location: 'Bordeaux',
      type: 'Intérim - 6 mois',
      postedAt: new Date(),
      skills: ['Électricité', 'Lecture de plans', 'Habilitation électrique', 'Installation'],
      salary: {
        min: 25000,
        max: 32000,
        currency: '€'
      },
      requirements: ['Électricité', 'Lecture de plans', 'Habilitation électrique', 'Installation'],
      startDate: new Date('2023-01-01')
    });
  }
  
  // Offres dans le domaine logistique
  if (allSkills.some(skill => 
    ['Manutention', 'Cariste', 'Logistique', 'Gestion de stock'].includes(skill))
  ) {
    jobOffers.push({
      id: '5',
      title: 'Cariste Préparateur',
      company: {
        id: 'LogiStock',
        name: 'LogiStock',
        industry: 'Logistique'
      },
      description: 'Assurer les opérations de réception, stockage, préparation et expédition des marchandises.',
      location: 'Lille',
      type: 'Intérim - 3 mois',
      postedAt: new Date(),
      skills: ['Cariste', 'CACES', 'Manutention', 'Gestion de stock'],
      salary: {
        min: 22000,
        max: 26000,
        currency: '€'
      },
      requirements: ['Cariste', 'CACES', 'Manutention', 'Gestion de stock'],
      startDate: new Date('2023-01-01')
    });
  }
  
  // Offres dans le domaine gestion/management
  if (allSkills.some(skill => 
    ['Gestion de projet', 'Leadership', 'Management', 'Communication', 'Analyse'].includes(skill))
  ) {
    jobOffers.push({
      id: '6',
      title: 'Chef de Projet',
      company: {
        id: 'ConsultingPro',
        name: 'ConsultingPro',
        industry: 'Consulting'
      },
      description: 'Piloter les projets clients de A à Z, en garantissant le respect des délais, du budget et de la qualité.',
      location: 'Paris',
      type: 'CDI',
      postedAt: new Date(),
      skills: ['Gestion de projet', 'Leadership', 'Communication', 'Analyse', 'Planification'],
      salary: {
        min: 45000,
        max: 60000,
        currency: '€'
      },
      requirements: ['Gestion de projet', 'Leadership', 'Communication', 'Analyse', 'Planification'],
      startDate: new Date('2023-01-01')
    });
  }
  
  // Si aucune correspondance, proposer quelques offres génériques
  if (jobOffers.length === 0) {
    jobOffers.push({
      id: '7',
      title: 'Assistant Administratif',
      company: {
        id: 'EntrepriseGenerale',
        name: 'Entreprise Générale',
        industry: 'Administration'
      },
      description: 'Assurer le support administratif de l\'équipe et participer à l\'organisation générale du bureau.',
      location: 'Lyon',
      type: 'CDD - 12 mois',
      postedAt: new Date(),
      skills: ['Organisation', 'Communication', 'Office', 'Accueil'],
      salary: {
        min: 24000,
        max: 28000,
        currency: '€'
      },
      requirements: ['Organisation', 'Communication', 'Office', 'Accueil'],
      startDate: new Date('2023-01-01')
    });
    
    jobOffers.push({
      id: '8',
      title: 'Commercial Terrain',
      company: {
        id: 'VenteDirect',
        name: 'VenteDirect',
        industry: 'Vente'
      },
      description: 'Développer un portefeuille clients et atteindre les objectifs commerciaux fixés.',
      location: 'Région Parisienne',
      type: 'CDI',
      postedAt: new Date(),
      skills: ['Vente', 'Négociation', 'Prospection', 'Relationnel'],
      salary: {
        min: 30000,
        max: 40000,
        currency: '€'
      },
      requirements: ['Vente', 'Négociation', 'Prospection', 'Relationnel'],
      startDate: new Date('2023-01-01')
    });
  }
  
  return jobOffers;
};

// Interface pour les résultats d'analyse de CV
export interface CVAnalysisResult {
  extractedSkills: string[];
  experience: { company: string; position: string; duration: string; description: string }[];
  education: { institution: string; degree: string; year: string }[];
  summary: string;
  recommendedJobs: string[];
}

export interface CandidateProfile {
  id: string;
  name: string;
  skills: string[];
  summary: string;
  strengths: string[];
  opportunities: string[];
}

/**
 * Analyse approfondie d'un CV pour extraire les compétences et informations pertinentes
 * @param cvText Texte du CV à analyser
 * @param candidateName Nom du candidat (optionnel)
 * @returns Résultat d'analyse avec compétences, expérience, formation, résumé et emplois recommandés
 */
export const analyzeCV = async (cvText: string, candidateName?: string): Promise<CVAnalysisResult> => {
  console.log("Analyse du CV en cours...", { cvText: cvText.substring(0, 100) + "...", candidateName });
  
  // Simulation de traitement AI pour l'analyse du CV
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Extraction des compétences basée sur les mots-clés dans le CV
  const skillsKeywords = [
    // Compétences techniques
    "JavaScript", "TypeScript", "React", "Angular", "Vue", "Node.js", "Express", "Python", "Java", "C#", 
    "PHP", "Ruby", "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "DevOps", "SQL", "NoSQL",
    "MongoDB", "PostgreSQL", "MySQL", "Redis", "GraphQL", "REST API", "Microservices", "Architecture",
    // Compétences non techniques
    "Communication", "Leadership", "Gestion de projet", "Scrum", "Agile", "Kanban", "Négociation",
    "Résolution de problèmes", "Esprit d'équipe", "Autonomie", "Créativité", "Adaptabilité", 
    "Organisation", "Rigueur", "Gestion du temps", "Analyse", "Synthèse", "Présentation",
    // Langues
    "Anglais", "Français", "Espagnol", "Allemand", "Italien", "Portugais", "Chinois", "Japonais", "Arabe",
    // Secteurs
    "Finance", "Santé", "Éducation", "E-commerce", "Retail", "Industrie", "Logistique", "Transport",
    "Énergie", "Environnement", "Immobilier", "Tourisme", "Médias", "Marketing", "RH", "Consulting"
  ];
  
  // Extraction simulée des compétences basée sur la correspondance de mots-clés dans le CV
  const extractedSkills = skillsKeywords
    .filter(skill => cvText.toLowerCase().includes(skill.toLowerCase()))
    .concat(generateRandomSkills(3, skillsKeywords)); // Ajoute quelques compétences aléatoires pour la démonstration
  
  // Génération d'expériences professionnelles fictives
  const experience = [
    {
      company: "Tech Innovations SA",
      position: "Développeur Senior",
      duration: "2018-2022",
      description: "Développement d'applications web, gestion d'équipe technique, mise en place de CI/CD."
    },
    {
      company: "Consult & Co",
      position: "Consultant Tech",
      duration: "2015-2018",
      description: "Conseil en transformation digitale, implémentation de solutions cloud, optimisation des processus."
    },
    {
      company: "StartUp Nation",
      position: "Développeur Full Stack",
      duration: "2013-2015",
      description: "Développement frontend et backend, participation à la conception produit, méthodes agiles."
    }
  ];
  
  // Génération de formation fictive
  const education = [
    {
      institution: "École Polytechnique",
      degree: "Master en Informatique",
      year: "2013"
    },
    {
      institution: "Université Paris-Saclay",
      degree: "Licence en Mathématiques Appliquées",
      year: "2011"
    }
  ];
  
  // Génération d'un résumé basé sur les compétences extraites
  const summary = generateCandidateSummary(candidateName || "Le candidat", extractedSkills);
  
  // Génération d'emplois recommandés basés sur les compétences
  const recommendedJobs = generateRecommendedJobs(extractedSkills);
  
  return {
    extractedSkills,
    experience,
    education,
    summary,
    recommendedJobs
  };
};

/**
 * Génère un profil détaillé du candidat avec analyse SWOT simplifiée
 * @param worker Données du travailleur (intérimaire)
 * @returns Profil du candidat avec forces et opportunités
 */
export const generateCandidateProfile = async (worker: { 
  id: string; 
  name: string; 
  skills?: string[]; 
  experience?: any[]; 
  education?: any[];
  cvText?: string;
}): Promise<CandidateProfile> => {
  console.log("Génération du profil candidat...", { workerId: worker.id });
  
  // Simulation de traitement AI
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Utilisation des compétences existantes ou analyse du CV si disponible
  let skills = worker.skills || [];
  if (skills.length === 0 && worker.cvText) {
    const analysis = await analyzeCV(worker.cvText, worker.name);
    skills = analysis.extractedSkills;
  }
  
  // Génération d'un résumé personnalisé
  const summary = generateCandidateSummary(worker.name, skills);
  
  // Analyse des forces basée sur les compétences
  const strengths = generateCandidateStrengths(skills);
  
  // Suggestions d'opportunités d'amélioration ou de développement
  const opportunities = generateCandidateOpportunities(skills);
  
  return {
    id: worker.id,
    name: worker.name,
    skills,
    summary,
    strengths,
    opportunities
  };
};

// Fonction helper pour générer un résumé personnalisé
function generateCandidateSummary(name: string, skills: string[]): string {
  const techSkills = skills.filter(s => 
    ["JavaScript", "TypeScript", "React", "Angular", "Vue", "Node.js", "Python", "Java", "C#", "PHP", "AWS", "Docker", "SQL", "NoSQL"].includes(s)
  );
  
  const softSkills = skills.filter(s => 
    ["Communication", "Leadership", "Gestion de projet", "Scrum", "Agile", "Négociation", "Résolution de problèmes", "Esprit d'équipe"].includes(s)
  );
  
  const languages = skills.filter(s => 
    ["Anglais", "Français", "Espagnol", "Allemand", "Italien", "Portugais", "Chinois", "Japonais", "Arabe"].includes(s)
  );
  
  const sectors = skills.filter(s => 
    ["Finance", "Santé", "Éducation", "E-commerce", "Retail", "Industrie", "Logistique", "Énergie", "Médias", "Marketing", "RH"].includes(s)
  );
  
  let summary = `${name} est un professionnel `;
  
  if (techSkills.length > 0) {
    summary += `avec une expertise technique en ${techSkills.slice(0, 3).join(", ")}${techSkills.length > 3 ? ", entre autres" : ""}. `;
  } else {
    summary += "avec un profil polyvalent. ";
  }
  
  if (softSkills.length > 0) {
    summary += `${name} possède d'excellentes compétences en ${softSkills.slice(0, 2).join(" et ")}. `;
  }
  
  if (languages.length > 0) {
    summary += `${name} maîtrise ${languages.length > 1 ? "plusieurs langues, notamment " : ""}${languages.join(", ")}. `;
  }
  
  if (sectors.length > 0) {
    summary += `${name} a une expérience dans ${sectors.length > 1 ? "les secteurs " : "le secteur "}${sectors.join(", ")}. `;
  }
  
  summary += `Ce profil ${techSkills.length > 2 ? "technique et polyvalent" : "professionnel"} peut apporter une réelle valeur ajoutée à votre entreprise.`;
  
  return summary;
}

// Fonction helper pour générer les forces du candidat
function generateCandidateStrengths(skills: string[]): string[] {
  const possibleStrengths = [
    "Excellente maîtrise technique",
    "Forte capacité d'adaptation",
    "Communication efficace",
    "Résolution créative de problèmes",
    "Travail d'équipe productif",
    "Autonomie et initiative",
    "Expérience sectorielle pertinente",
    "Compétences linguistiques avancées",
    "Leadership et gestion d'équipe",
    "Expertise en méthodologies agiles"
  ];
  
  // Sélection de 3-5 forces en fonction des compétences
  return possibleStrengths
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 3);
}

// Fonction helper pour générer des opportunités de développement
function generateCandidateOpportunities(skills: string[]): string[] {
  const possibleOpportunities = [
    "Pourrait bénéficier d'une formation en gestion de projet",
    "Opportunité de développer des compétences en cloud computing",
    "Potentiel pour évoluer vers des rôles de leadership",
    "Pourrait renforcer ses compétences en analyse de données",
    "Bénéficierait d'une exposition à des projets internationaux",
    "Potentiel pour développer une expertise sectorielle plus profonde",
    "Opportunité d'acquérir des certifications techniques complémentaires",
    "Pourrait explorer des compétences en innovation et R&D"
  ];
  
  // Sélection de 2-3 opportunités
  return possibleOpportunities
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 2) + 2);
}

// Fonction helper pour générer des compétences aléatoires
function generateRandomSkills(count: number, availableSkills: string[]): string[] {
  const randomSkills: string[] = [];
  const skillsCopy = [...availableSkills];
  
  for (let i = 0; i < count; i++) {
    if (skillsCopy.length === 0) break;
    const randomIndex = Math.floor(Math.random() * skillsCopy.length);
    randomSkills.push(skillsCopy[randomIndex]);
    skillsCopy.splice(randomIndex, 1);
  }
  
  return randomSkills;
}

// Fonction helper pour générer des emplois recommandés
function generateRecommendedJobs(skills: string[]): string[] {
  const jobTitles = [
    "Développeur Full Stack",
    "Ingénieur DevOps",
    "Architecte Cloud",
    "Data Scientist",
    "Chef de Projet Digital",
    "Consultant IT",
    "Spécialiste Frontend",
    "Développeur Backend",
    "Analyste Business",
    "Ingénieur QA",
    "Product Owner",
    "UX/UI Designer",
    "Responsable Marketing Digital",
    "Chargé de Clientèle",
    "Business Developer"
  ];
  
  // Sélection de 3-5 emplois recommandés basés sur les compétences
  return jobTitles
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 3);
} 