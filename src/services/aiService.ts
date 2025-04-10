// Service pour les appels à l'API de Gemini
// Utilisation de l'API Google Gemini

// Types
export interface AIRequestParams {
  prompt: string;
  userId: string;
  context?: string[];
  maxTokens?: number;
  temperature?: number;
}

// Configuration de l'API Gemini
const GEMINI_API_KEY = 'AIzaSyCZs6SFd1914inMW4IzTRrBw7AwDL8eqgI';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Fonction pour obtenir une réponse de l'IA Gemini
export const getAIResponse = async (params: AIRequestParams): Promise<string> => {
  try {
    console.log('Paramètres de requête Gemini:', params);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: params.prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: params.temperature || 0.7,
          maxOutputTokens: params.maxTokens || 800,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur API Gemini:', errorData);
      return `Erreur lors de la communication avec l'IA. Veuillez réessayer.`;
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Erreur lors de l\'appel à Gemini:', error);
    return `Erreur lors de la communication avec l'IA. Veuillez réessayer.`;
  }
};

// Interface pour les demandes d'analyse de CV
export interface CVAnalysisRequest {
  fileContent?: string;
  fileUrl?: string;
  workerName: string;
  language?: string;
}

// Interface pour les résultats d'analyse de CV
export interface CVAnalysisResponse {
  extractedSkills: string[];
  experience: string[];
  education: string[];
  summary: string;
  recommendedJobs: string[];
}

// Fonction pour analyser un CV avec Gemini
export const analyzeCVWithAI = async (params: CVAnalysisRequest): Promise<CVAnalysisResponse> => {
  try {
    console.log('Paramètres d\'analyse de CV:', params);
    
    const prompt = `Analyse ce CV pour le candidat ${params.workerName}. 
    Identifie ses compétences, expérience, formation, et suggère des emplois pertinents.
    Format de réponse JSON avec les clés: extractedSkills, experience, education, summary, recommendedJobs.
    ${params.fileContent || 'Pas de contenu fourni'}`;
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    
    try {
      // Essayer d'extraire le JSON de la réponse
      const jsonMatch = resultText.match(/```json\s*([\s\S]*?)\s*```/) || 
                        resultText.match(/{[\s\S]*}/);
                        
      const jsonStr = jsonMatch ? jsonMatch[0] : resultText;
      const result = JSON.parse(jsonStr.replace(/```json|```/g, ''));
      
      return {
        extractedSkills: result.extractedSkills || [],
        experience: result.experience || [],
        education: result.education || [],
        summary: result.summary || '',
        recommendedJobs: result.recommendedJobs || []
      };
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      // Retourner une réponse par défaut en cas d'erreur
      return {
        extractedSkills: ['Communication', 'Travail d\'équipe', 'Analyse'],
        experience: [`Expérience professionnelle de ${params.workerName}`],
        education: ['Formation'],
        summary: `Profil de ${params.workerName}`,
        recommendedJobs: ['Poste recommandé']
      };
    }
  } catch (error) {
    console.error('Erreur lors de l\'analyse du CV:', error);
    throw error;
  }
};

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

// Fonction pour générer un résumé optimisé du candidat avec Gemini
export const generateWorkerSummary = async (worker: any): Promise<string> => {
  try {
    console.log('Génération du résumé pour:', worker.firstName, worker.lastName);
    
    const skills = worker.skills?.join(', ') || '';
    const experience = worker.cvAnalysis?.experience?.[0] || '';
    
    const prompt = `Génère un résumé professionnel concis pour ${worker.firstName} ${worker.lastName}.
    Compétences: ${skills}
    Expérience: ${experience}
    Format: Un paragraphe mettant en valeur les qualités professionnelles.`;
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 250,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Erreur lors de la génération du résumé:', error);
    return `${worker.firstName} ${worker.lastName} est un professionnel avec diverses compétences.`;
  }
};

// Fonction pour faire correspondre un candidat avec des offres d'emploi
export const matchWorkerWithJobs = async (worker: any, jobs: JobOffer[]): Promise<{jobId: string, match: MatchResult}[]> => {
  try {
    console.log('Recherche de correspondances pour:', worker.firstName, worker.lastName);
    
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
  } catch (error) {
    console.error('Erreur lors du matching:', error);
    throw error;
  }
};

// Fonction pour générer des offres d'emploi pertinentes avec Gemini
export const generateRelevantJobOffers = async (worker: any): Promise<JobOffer[]> => {
  try {
    console.log('Génération d\'offres pour:', worker.firstName, worker.lastName);
    
    const workerSkills = Array.from(new Set([...(worker.skills || []), ...(worker.cvAnalysis?.extractedSkills || [])]));
    
    const prompt = `Génère deux offres d'emploi pertinentes pour un candidat avec ces compétences: ${workerSkills.join(', ')}.
    Format: JSON array with JobOffer objects containing: id, title, company (id, name, industry), description, location, type, skills, salary (min, max, currency), requirements.`;
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    
    try {
      // Essayer d'extraire le JSON de la réponse
      const jsonMatch = resultText.match(/```json\s*([\s\S]*?)\s*```/) || 
                        resultText.match(/\[\s*{\s*"id"/);
                        
      const jsonStr = jsonMatch ? jsonMatch[0] : resultText;
      const cleanedJsonStr = jsonStr.replace(/```json|```/g, '');
      const jobsData = JSON.parse(cleanedJsonStr);
      
      // Convertir en JobOffer et ajouter les dates
      return jobsData.map((job: any) => ({
        ...job,
        postedAt: new Date(),
        startDate: new Date()
      }));
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      // Retourner des offres par défaut
      return [
        {
          id: '1',
          title: 'Poste basé sur vos compétences',
          company: {
            id: 'company1',
            name: 'Entreprise Exemple',
            industry: 'Secteur pertinent'
          },
          description: 'Description du poste adapté à votre profil.',
          location: 'Paris',
          type: 'CDI',
          postedAt: new Date(),
          skills: workerSkills.slice(0, 3),
          salary: {
            min: 30000,
            max: 45000,
            currency: '€'
          },
          requirements: workerSkills.slice(0, 2),
          startDate: new Date()
        }
      ];
    }
  } catch (error) {
    console.error('Erreur lors de la génération d\'offres:', error);
    return [];
  }
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
 * Analyse approfondie d'un CV avec Gemini
 * @param cvText Texte du CV à analyser
 * @param candidateName Nom du candidat (optionnel)
 * @returns Résultat d'analyse avec compétences, expérience, formation, résumé et emplois recommandés
 */
export const analyzeCV = async (cvText: string, candidateName?: string): Promise<CVAnalysisResult> => {
  try {
    console.log("Analyse du CV en cours...", { cvText: cvText.substring(0, 100) + "...", candidateName });
    
    const prompt = `Analyse ce CV pour ${candidateName || 'un candidat'} et extrait les informations clés:
    
    CV: ${cvText}
    
    Réponds avec un JSON contenant:
    - extractedSkills: liste des compétences identifiées
    - experience: liste des expériences professionnelles (company, position, duration, description)
    - education: liste des formations (institution, degree, year)
    - summary: résumé professionnel du candidat
    - recommendedJobs: liste de postes recommandés`;
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    
    try {
      // Extraire le JSON de la réponse
      const jsonMatch = resultText.match(/```json\s*([\s\S]*?)\s*```/) || 
                        resultText.match(/{[\s\S]*}/);
                        
      const jsonStr = jsonMatch ? jsonMatch[0] : resultText;
      const result = JSON.parse(jsonStr.replace(/```json|```/g, ''));
      
      return {
        extractedSkills: result.extractedSkills || [],
        experience: result.experience || [],
        education: result.education || [],
        summary: result.summary || '',
        recommendedJobs: result.recommendedJobs || []
      };
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      // Réponse par défaut
      return {
        extractedSkills: ['Communication', 'Analyse'],
        experience: [
          {
            company: 'Entreprise',
            position: 'Poste',
            duration: '2020-2023',
            description: 'Description du poste'
          }
        ],
        education: [
          {
            institution: 'Université',
            degree: 'Diplôme',
            year: '2020'
          }
        ],
        summary: `Profil professionnel de ${candidateName || 'candidat'}`,
        recommendedJobs: ['Poste recommandé']
      };
    }
  } catch (error) {
    console.error('Erreur lors de l\'analyse du CV:', error);
    throw error;
  }
};

/**
 * Génère un profil détaillé du candidat avec Gemini
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
  try {
    console.log("Génération du profil candidat...", { workerId: worker.id });
    
    // Si des compétences n'existent pas et qu'un CV est disponible, analyser le CV
    let skills = worker.skills || [];
    if (skills.length === 0 && worker.cvText) {
      const analysis = await analyzeCV(worker.cvText, worker.name);
      skills = analysis.extractedSkills;
    }
    
    const prompt = `Génère un profil professionnel pour ${worker.name} avec les compétences suivantes: ${skills.join(', ')}.
    
    Réponds avec un JSON contenant:
    - summary: résumé professionnel (1 paragraphe)
    - strengths: liste de 3-5 forces professionnelles
    - opportunities: liste de 2-3 opportunités de développement`;
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 800,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    
    try {
      // Extraire le JSON de la réponse
      const jsonMatch = resultText.match(/```json\s*([\s\S]*?)\s*```/) || 
                        resultText.match(/{[\s\S]*}/);
                        
      const jsonStr = jsonMatch ? jsonMatch[0] : resultText;
      const result = JSON.parse(jsonStr.replace(/```json|```/g, ''));
      
      return {
        id: worker.id,
        name: worker.name,
        skills,
        summary: result.summary || `Profil de ${worker.name}`,
        strengths: result.strengths || ['Force professionnelle'],
        opportunities: result.opportunities || ['Opportunité de développement']
      };
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      // Réponse par défaut
      return {
        id: worker.id,
        name: worker.name,
        skills,
        summary: `${worker.name} est un professionnel avec diverses compétences.`,
        strengths: ['Adaptabilité', 'Communication', 'Expertise technique'],
        opportunities: ['Formation continue', 'Développement de leadership']
      };
    }
  } catch (error) {
    console.error('Erreur lors de la génération du profil:', error);
    return {
      id: worker.id,
      name: worker.name,
      skills: worker.skills || [],
      summary: `Profil de ${worker.name}`,
      strengths: ['Force professionnelle'],
      opportunities: ['Opportunité de développement']
    };
  }
}; 