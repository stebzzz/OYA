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
  job: {
    id: string;
    title: string;
    company: {
      id: string;
      name: string;
    };
    location: string;
    description: string;
    postedAt: string;
    salary: {
      min: number;
      max: number;
      currency: string;
    };
    type: string;
    skills: string[];
  };
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
 * Trouve des correspondances d'emploi pour un intérimaire donné
 * @param workerId - L'ID de l'intérimaire
 * @returns Une promesse résolvant vers un tableau de correspondances d'emploi
 */
export const findJobMatches = async (workerId: string): Promise<JobMatch[]> => {
  try {
    // Récupérer les informations de l'intérimaire
    const worker = await getWorkerById(workerId);
    if (!worker) {
      throw new Error("Intérimaire non trouvé");
    }

    // Données de test pour les emplois
    const jobs = [
      {
        id: "job1",
        title: "Développeur Frontend React",
        company: {
          id: "company1",
          name: "TechSolutions"
        },
        location: "Paris",
        description: "Nous recherchons un développeur frontend pour travailler sur des projets React innovants.",
        postedAt: new Date().toISOString(),
        salary: {
          min: 40000,
          max: 50000,
          currency: "EUR"
        },
        type: "CDI",
        skills: ["React", "JavaScript", "TypeScript", "CSS", "HTML"]
      },
      {
        id: "job2",
        title: "Développeur FullStack JavaScript",
        company: {
          id: "company2",
          name: "WebInnovate"
        },
        location: "Lyon",
        description: "Poste de développeur fullstack avec une forte emphase sur Node.js et React.",
        postedAt: new Date().toISOString(),
        salary: {
          min: 45000,
          max: 55000,
          currency: "EUR"
        },
        type: "CDD - 12 mois",
        skills: ["JavaScript", "Node.js", "Express", "React", "MongoDB"]
      },
      {
        id: "job3",
        title: "Développeur Backend Java",
        company: {
          id: "company3",
          name: "SoftwareEnterprise"
        },
        location: "Bordeaux",
        description: "Développement d'APIs et de services backend avec Java et Spring Boot.",
        postedAt: new Date().toISOString(),
        salary: {
          min: 42000,
          max: 52000,
          currency: "EUR"
        },
        type: "CDI",
        skills: ["Java", "Spring Boot", "JPA", "SQL", "REST API"]
      },
      {
        id: "job4",
        title: "Développeur PHP Symfony",
        company: {
          id: "company4",
          name: "AgenceDigitale"
        },
        location: "Marseille",
        description: "Développement d'applications web avec PHP et Symfony.",
        postedAt: new Date().toISOString(),
        salary: {
          min: 35000,
          max: 45000,
          currency: "EUR"
        },
        type: "CDI",
        skills: ["PHP", "Symfony", "MySQL", "JavaScript", "HTML", "CSS"]
      },
      {
        id: "job5",
        title: "Intégrateur Web",
        company: {
          id: "company5",
          name: "DesignAgency"
        },
        location: "Lille",
        description: "Intégration de maquettes et développement frontend.",
        postedAt: new Date().toISOString(),
        salary: {
          min: 30000,
          max: 38000,
          currency: "EUR"
        },
        type: "Freelance",
        skills: ["HTML", "CSS", "JavaScript", "Responsive Design", "SASS"]
      },
      {
        id: "job6",
        title: "Développeur .NET",
        company: {
          id: "company6",
          name: "EnterpriseSoft"
        },
        location: "Nantes",
        description: "Développement d'applications d'entreprise avec .NET Core.",
        postedAt: new Date().toISOString(),
        salary: {
          min: 40000,
          max: 50000,
          currency: "EUR"
        },
        type: "CDI",
        skills: ["C#", ".NET Core", "SQL Server", "Azure", "REST API"]
      }
    ];

    // Calculer les correspondances
    const matches: JobMatch[] = jobs.map(job => {
      const workerSkills = worker.skills;
      const jobSkills = job.skills;
      
      // Compétences correspondantes et manquantes
      const matchedSkills = workerSkills.filter(skill => 
        jobSkills.some(jobSkill => jobSkill.toLowerCase() === skill.toLowerCase())
      );
      
      const missingSkills = jobSkills.filter(skill => 
        !workerSkills.some(workerSkill => workerSkill.toLowerCase() === skill.toLowerCase())
      );
      
      // Calculer le score de correspondance
      // 70% basé sur le pourcentage de compétences requises possédées par l'intérimaire
      // 30% basé sur le pourcentage de compétences de l'intérimaire utilisées dans ce poste
      const skillsMatchPercentage = jobSkills.length > 0 
        ? (matchedSkills.length / jobSkills.length) * 100 
        : 0;
        
      const skillsUtilizationPercentage = workerSkills.length > 0 
        ? (matchedSkills.length / workerSkills.length) * 100 
        : 0;
        
      const matchScore = Math.round((skillsMatchPercentage * 0.7) + (skillsUtilizationPercentage * 0.3));
      
      return {
        job,
        matchScore,
        matchedSkills,
        missingSkills
      };
    });

    // Trier par score de correspondance (décroissant)
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    console.error("Erreur lors de la recherche des correspondances d'emploi:", error);
    throw error;
  }
}; 