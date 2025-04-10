import { db } from '../config/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { CandidateProfile, JobOffer } from './aiService';
import { getWorkerById } from './workersService';
import { auth } from '../config/firebase';
import { Worker } from '../types/Worker';

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  requiredSkills: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  startDate?: string;
  endDate?: string;
  type: 'CDI' | 'CDD' | 'Intérim' | 'Freelance' | 'Stage';
  sector: string;
  createdAt: Date;
}

export interface CandidateMatch {
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  company: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  notes?: string;
}

export interface JobMatch {
  job: JobOffer;
  worker: Worker;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

/**
 * Calcule la correspondance entre un candidat et une offre d'emploi
 * @param candidate Profil du candidat
 * @param job Offre d'emploi
 * @returns Score de correspondance et détails
 */
export const calculateMatchScore = (candidate: CandidateProfile, job: Job): CandidateMatch => {
  // Convertir les compétences en minuscules pour la comparaison insensible à la casse
  const candidateSkills = candidate.skills.map(skill => skill.toLowerCase());
  const jobSkills = job.requiredSkills.map(skill => skill.toLowerCase());
  
  // Identifier les compétences correspondantes
  const matchedSkills = jobSkills.filter(jobSkill => 
    candidateSkills.some(candidateSkill => 
      candidateSkill.toLowerCase().includes(jobSkill) || 
      jobSkill.includes(candidateSkill.toLowerCase())
    )
  );
  
  // Identifier les compétences manquantes
  const missingSkills = jobSkills.filter(jobSkill => 
    !matchedSkills.includes(jobSkill)
  );
  
  // Calculer le score de correspondance (0-100)
  let matchScore = 0;
  if (jobSkills.length > 0) {
    matchScore = Math.round((matchedSkills.length / jobSkills.length) * 100);
  }
  
  // Ajuster le score en fonction de facteurs supplémentaires (simulé)
  const bonusScore = Math.floor(Math.random() * 15); // Bonus aléatoire pour la démo
  matchScore = Math.min(100, matchScore + bonusScore);
  
  return {
    candidateId: candidate.id,
    candidateName: candidate.name,
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    matchScore,
    matchedSkills: matchedSkills.map(skill => skill.charAt(0).toUpperCase() + skill.slice(1)),
    missingSkills: missingSkills.map(skill => skill.charAt(0).toUpperCase() + skill.slice(1)),
    notes: generateMatchNotes(candidate, job, matchScore)
  };
};

/**
 * Trouve les meilleures correspondances pour un candidat
 * @param candidate Profil du candidat
 * @param availableJobs Liste des offres d'emploi disponibles
 * @param topN Nombre de résultats à retourner (défaut: 5)
 * @returns Liste des meilleures correspondances
 */
export const findBestJobMatches = (
  candidate: CandidateProfile, 
  availableJobs: Job[], 
  topN: number = 5
): CandidateMatch[] => {
  // Calculer le score pour chaque offre d'emploi
  const matches = availableJobs.map(job => calculateMatchScore(candidate, job));
  
  // Trier par score de correspondance décroissant
  const sortedMatches = matches.sort((a, b) => b.matchScore - a.matchScore);
  
  // Retourner les N meilleures correspondances
  return sortedMatches.slice(0, topN);
};

/**
 * Trouve les meilleurs candidats pour une offre d'emploi
 * @param job Offre d'emploi
 * @param availableCandidates Liste des candidats disponibles
 * @param topN Nombre de résultats à retourner (défaut: 5)
 * @returns Liste des meilleurs candidats
 */
export const findBestCandidates = (
  job: Job, 
  availableCandidates: CandidateProfile[], 
  topN: number = 5
): CandidateMatch[] => {
  // Calculer le score pour chaque candidat
  const matches = availableCandidates.map(candidate => calculateMatchScore(candidate, job));
  
  // Trier par score de correspondance décroissant
  const sortedMatches = matches.sort((a, b) => b.matchScore - a.matchScore);
  
  // Retourner les N meilleurs candidats
  return sortedMatches.slice(0, topN);
};

/**
 * Récupère les offres d'emploi depuis Firestore ou utilise des données de démonstration
 * @param limit Nombre maximum d'offres à récupérer
 * @returns Liste des offres d'emploi
 */
export const getAvailableJobs = async (limitCount: number = 20): Promise<Job[]> => {
  try {
    // Tenter de récupérer depuis Firestore
    const jobsRef = collection(db, 'jobs');
    const q = query(
      jobsRef,
      where('active', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          company: data.company,
          description: data.description,
          location: data.location,
          requiredSkills: data.requiredSkills || [],
          salary: data.salary,
          startDate: data.startDate,
          endDate: data.endDate,
          type: data.type,
          sector: data.sector,
          createdAt: data.createdAt.toDate()
        } as Job;
      });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des offres d\'emploi:', error);
  }
  
  // Retourner des données de démonstration si Firestore échoue ou est vide
  return generateDemoJobs(limitCount);
};

// Fonction helper pour générer des notes de correspondance
function generateMatchNotes(candidate: CandidateProfile, job: Job, score: number): string {
  if (score >= 90) {
    return `Correspondance exceptionnelle! ${candidate.name} possède toutes les compétences essentielles pour ce poste.`;
  } else if (score >= 75) {
    return `Très bonne correspondance. ${candidate.name} a la majorité des compétences requises.`;
  } else if (score >= 60) {
    return `Bonne correspondance. Quelques compétences manquantes pourraient être acquises rapidement.`;
  } else if (score >= 40) {
    return `Correspondance moyenne. Formation nécessaire sur plusieurs compétences clés.`;
  } else {
    return `Correspondance faible. Profil différent des exigences du poste.`;
  }
}

// Fonction helper pour générer des offres d'emploi de démonstration
function generateDemoJobs(count: number): Job[] {
  const jobTitles = [
    "Développeur Frontend React",
    "Ingénieur Full Stack JavaScript",
    "Développeur Backend Node.js",
    "Ingénieur DevOps",
    "Architecte Cloud AWS",
    "Data Engineer",
    "Développeur Mobile React Native",
    "UX/UI Designer",
    "Product Owner",
    "Chef de Projet Digital",
    "Développeur Python",
    "Administrateur Système Linux",
    "Ingénieur QA Automatisation",
    "Développeur Blockchain",
    "Spécialiste CyberSécurité",
    "Développeur Java Spring Boot",
    "Architecte Solution",
    "Data Scientist",
    "Ingénieur Intelligence Artificielle",
    "Consultant ERP"
  ];
  
  const companies = [
    "TechSolutions", "InnovateCorp", "DigitalEdge", "DataSphere",
    "CloudNine Systems", "NextGen Technologies", "FutureTech",
    "GlobalSoft", "SmartSystems", "CodeCrafters", "DevStream",
    "TechNova", "ByteWorks", "InfinityCode", "QuantumLeap"
  ];
  
  const locations = [
    "Paris", "Lyon", "Marseille", "Bordeaux", "Lille", "Toulouse",
    "Nantes", "Strasbourg", "Montpellier", "Nice"
  ];
  
  const sectors = [
    "Finance", "Santé", "E-commerce", "Éducation", "Transport",
    "Énergie", "Médias", "Télécommunications", "Industrie", "Consulting"
  ];
  
  const skillsPool = [
    "JavaScript", "TypeScript", "React", "Angular", "Vue.js", "Node.js",
    "Express", "Python", "Django", "Flask", "Java", "Spring Boot",
    "C#", ".NET", "PHP", "Laravel", "SQL", "MySQL", "PostgreSQL",
    "MongoDB", "Redis", "AWS", "Azure", "GCP", "Docker", "Kubernetes",
    "CI/CD", "Git", "DevOps", "Linux", "Agile", "Scrum", "REST API",
    "GraphQL", "React Native", "Flutter", "Swift", "Kotlin", "HTML", "CSS",
    "SASS", "Webpack", "Jest", "Cypress", "TDD", "Microservices"
  ];
  
  const jobs: Job[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomSkillsCount = Math.floor(Math.random() * 6) + 3; // 3-8 compétences
    const randomSkills: string[] = [];
    
    for (let j = 0; j < randomSkillsCount; j++) {
      const randomSkill = skillsPool[Math.floor(Math.random() * skillsPool.length)];
      if (!randomSkills.includes(randomSkill)) {
        randomSkills.push(randomSkill);
      }
    }
    
    const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const sector = sectors[Math.floor(Math.random() * sectors.length)];
    
    const minSalary = Math.floor(Math.random() * 20000) + 30000;
    
    const today = new Date();
    const createdAtDaysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date(today);
    createdAt.setDate(today.getDate() - createdAtDaysAgo);
    
    const jobTypes: Array<'CDI' | 'CDD' | 'Intérim' | 'Freelance' | 'Stage'> = ['CDI', 'CDD', 'Intérim', 'Freelance', 'Stage'];
    const type = jobTypes[Math.floor(Math.random() * jobTypes.length)];
    
    jobs.push({
      id: `job-${i + 1}`,
      title: jobTitle,
      company: company,
      description: `Nous recherchons un ${jobTitle} passionné pour rejoindre notre équipe dynamique. Vous travaillerez sur des projets innovants dans un environnement stimulant.`,
      location: location,
      requiredSkills: randomSkills,
      salary: {
        min: minSalary,
        max: minSalary + Math.floor(Math.random() * 20000),
        currency: "EUR"
      },
      type: type,
      sector: sector,
      createdAt: createdAt
    });
  }
  
  return jobs;
}

/**
 * Trouve les correspondances d'emploi pour un travailleur spécifique
 */
export const findJobMatches = async (workerId: string): Promise<JobMatch[]> => {
  try {
    // Récupérer les informations du travailleur
    const workerDoc = await db.collection('workers').doc(workerId).get();
    if (!workerDoc.exists) {
      throw new Error('Travailleur non trouvé');
    }
    
    const worker = { id: workerDoc.id, ...workerDoc.data() } as Worker;
    
    // Récupérer toutes les offres d'emploi actives
    const jobsSnapshot = await getDocs(query(
      collection(db, 'jobs'),
      where('active', '==', true)
    ));
    
    // Simuler des offres d'emploi si la collection est vide
    let jobs: JobOffer[] = [];
    
    if (jobsSnapshot.empty) {
      // Créer des offres d'emploi simulées
      jobs = generateMockJobs();
    } else {
      jobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobOffer));
    }
    
    // Calculer les correspondances
    const matches: JobMatch[] = calculateJobMatches(worker, jobs);
    
    // Trier par score de correspondance (décroissant)
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    console.error('Erreur lors de la recherche de correspondances:', error);
    throw error;
  }
};

/**
 * Calcule les correspondances entre un travailleur et une liste d'offres d'emploi
 */
const calculateJobMatches = (worker: Worker, jobs: JobOffer[]): JobMatch[] => {
  const workerSkills = worker.skills || [];
  
  return jobs.map(job => {
    const jobSkills = job.requiredSkills || [];
    
    // Identifier les compétences correspondantes
    const matchedSkills = workerSkills.filter(skill => 
      jobSkills.some(jobSkill => 
        jobSkill.toLowerCase() === skill.toLowerCase()
      )
    );
    
    // Identifier les compétences manquantes
    const missingSkills = jobSkills.filter(skill => 
      !workerSkills.some(workerSkill => 
        workerSkill.toLowerCase() === skill.toLowerCase()
      )
    );
    
    // Calculer le score de correspondance (pourcentage de compétences requises que possède le travailleur)
    const matchScore = jobSkills.length > 0 
      ? Math.round((matchedSkills.length / jobSkills.length) * 100) 
      : 0;
    
    return {
      job,
      worker,
      matchScore,
      matchedSkills,
      missingSkills
    };
  });
};

/**
 * Génère des offres d'emploi fictives pour la démonstration
 */
const generateMockJobs = (): JobOffer[] => {
  return [
    {
      id: '1',
      title: 'Soudeur TIG/MIG',
      company: { 
        id: 'comp1', 
        name: 'Métallerie Dupont', 
        logoUrl: 'https://randomuser.me/api/portraits/men/1.jpg' 
      },
      location: 'Lyon, France',
      description: 'Nous recherchons un soudeur expérimenté pour des travaux de précision.',
      requiredSkills: ['Soudure TIG', 'Soudure MIG', 'Lecture de plans'],
      salary: { min: 2800, max: 3500 },
      type: 'Intérim',
      duration: '3 mois',
      postedAt: Date.now() - 86400000 * 5, // 5 jours avant
      active: true
    },
    {
      id: '2',
      title: 'Développeur Full Stack',
      company: { 
        id: 'comp2', 
        name: 'Tech Solutions', 
        logoUrl: 'https://randomuser.me/api/portraits/women/2.jpg' 
      },
      location: 'Paris, France',
      description: 'Développement d\'applications web modernes utilisant React et Node.js.',
      requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL'],
      salary: { min: 3800, max: 4500 },
      type: 'Intérim',
      duration: '6 mois',
      postedAt: Date.now() - 86400000 * 2, // 2 jours avant
      active: true
    },
    {
      id: '3',
      title: 'Assistant(e) Administratif(ve)',
      company: { 
        id: 'comp3', 
        name: 'Bureau & Co', 
        logoUrl: 'https://randomuser.me/api/portraits/women/3.jpg' 
      },
      location: 'Marseille, France',
      description: 'Gestion administrative et support à l\'équipe de direction.',
      requiredSkills: ['Pack Office', 'Organisation', 'Communication'],
      salary: { min: 2200, max: 2600 },
      type: 'Intérim',
      duration: '1 mois',
      postedAt: Date.now() - 86400000 * 10, // 10 jours avant
      active: true
    },
    {
      id: '4',
      title: 'Infirmier(e) Diplômé(e)',
      company: { 
        id: 'comp4', 
        name: 'Clinique Saint-Martin', 
        logoUrl: 'https://randomuser.me/api/portraits/men/4.jpg' 
      },
      location: 'Nantes, France',
      description: 'Soins aux patients dans un service de médecine générale.',
      requiredSkills: ['Soins infirmiers', 'Gestion médicale', 'Empathie'],
      salary: { min: 2600, max: 3200 },
      type: 'Intérim',
      duration: '2 mois',
      postedAt: Date.now() - 86400000 * 1, // 1 jour avant
      active: true
    },
    {
      id: '5',
      title: 'Manutentionnaire',
      company: { 
        id: 'comp5', 
        name: 'Logistique Express', 
        logoUrl: 'https://randomuser.me/api/portraits/men/5.jpg' 
      },
      location: 'Lille, France',
      description: 'Chargement, déchargement et tri de marchandises.',
      requiredSkills: ['Port de charges', 'CACES 1', 'Travail d\'équipe'],
      salary: { min: 1800, max: 2200 },
      type: 'Intérim',
      duration: '2 semaines',
      postedAt: Date.now() - 86400000 * 3, // 3 jours avant
      active: true
    }
  ];
}; 