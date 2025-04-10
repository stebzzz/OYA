import { CreateMissionData } from './missionsService';

/**
 * Service pour l'analyse de documents
 * Ce service simule l'analyse d'un document pour en extraire des informations structurées.
 * Dans une application réelle, il appellerait une API d'IA pour l'analyse des documents.
 */

/**
 * Types de documents supportés
 */
export enum DocumentType {
  RESUME = 'resume',
  MISSION = 'mission',
  CONTRACT = 'contract',
  INVOICE = 'invoice',
}

/**
 * Résultat de l'analyse d'un document
 */
export interface DocumentAnalysisResult {
  documentType: DocumentType;
  confidence: number;
  extractedData: any;
  rawText?: string;
}

/**
 * Analyse un document pour en extraire des informations
 * @param file Le fichier à analyser
 * @returns Le résultat de l'analyse
 */
export const analyzeDocument = async (file: File): Promise<DocumentAnalysisResult> => {
  // Simuler un délai pour l'analyse
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Dans une application réelle, nous enverrions le fichier à un service d'IA
  // pour analyser son contenu et déterminer automatiquement son type
  
  // Analyse basée sur le nom du fichier (simulation)
  const fileName = file.name.toLowerCase();
  
  if (fileName.includes('mission') || fileName.includes('job') || fileName.includes('offre')) {
    // C'est une mission
    const missionData: Partial<CreateMissionData> = extractMissionData(fileName, file.type);
    
    return {
      documentType: DocumentType.MISSION,
      confidence: 0.85,
      extractedData: missionData,
    };
  } else if (fileName.includes('cv') || fileName.includes('resume')) {
    // C'est un CV
    return {
      documentType: DocumentType.RESUME,
      confidence: 0.9,
      extractedData: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        skills: ['Développement Web', 'React', 'Node.js'],
        experience: '5 ans',
      },
    };
  } else if (fileName.includes('contrat') || fileName.includes('contract')) {
    // C'est un contrat
    return {
      documentType: DocumentType.CONTRACT,
      confidence: 0.78,
      extractedData: {
        parties: ['Entreprise A', 'Entreprise B'],
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        value: 15000,
      },
    };
  } else {
    // Document inconnu, on extrait quand même des informations de base
    return {
      documentType: DocumentType.MISSION,
      confidence: 0.6,
      extractedData: extractMissionData(fileName, file.type),
    };
  }
};

/**
 * Extrait des données de mission à partir d'un nom de fichier (simulation)
 */
const extractMissionData = (fileName: string, fileType: string): Partial<CreateMissionData> => {
  // Dans une application réelle, nous analyserions le contenu du fichier
  
  // Simuler l'extraction de la ville à partir du nom de fichier
  let location = 'Paris';
  if (fileName.includes('lyon')) location = 'Lyon';
  if (fileName.includes('marseille')) location = 'Marseille';
  if (fileName.includes('bordeaux')) location = 'Bordeaux';
  
  // Simuler l'extraction de la profession
  let title = 'Développeur Web';
  if (fileName.includes('soudeur')) title = 'Soudeur';
  if (fileName.includes('plombier')) title = 'Plombier';
  if (fileName.includes('electricien')) title = 'Électricien';
  if (fileName.includes('cariste')) title = 'Cariste';
  
  // Simuler l'extraction de l'entreprise
  let company = 'Entreprise Non Identifiée';
  if (fileName.includes('acme')) company = 'ACME Corp';
  if (fileName.includes('tech')) company = 'TechSolutions';
  if (fileName.includes('build')) company = 'BuildMaster';
  
  // Générer une description en fonction du titre
  const descriptions = {
    'Développeur Web': 'Développeur web full-stack maîtrisant React, Node.js et les bases de données. Le candidat travaillera sur des projets innovants dans un environnement agile.',
    'Soudeur': 'Soudeur expérimenté maîtrisant les techniques TIG et MIG. Le candidat travaillera sur des structures métalliques complexes dans un environnement industriel.',
    'Plombier': 'Plombier qualifié pour installation et maintenance de systèmes sanitaires. Le candidat interviendra sur des chantiers résidentiels et commerciaux.',
    'Électricien': 'Électricien industriel pour installation et maintenance de systèmes électriques. Le candidat travaillera sur des installations industrielles complexes.',
    'Cariste': 'Cariste expérimenté pour la gestion d\'entrepôt. Le candidat aura pour mission la manipulation de charges lourdes et la gestion des stocks.',
  };
  
  const description = descriptions[title as keyof typeof descriptions] || 
    'Description extraite du document. Cette mission nécessite une expertise technique et une bonne capacité d\'adaptation.';
  
  // Générer des compétences en fonction du titre
  const skillsMap = {
    'Développeur Web': ['JavaScript', 'React', 'Node.js', 'CSS'],
    'Soudeur': ['Soudure TIG', 'Soudure MIG', 'Lecture de plans'],
    'Plombier': ['Sanitaire', 'Chauffage', 'Dépannage'],
    'Électricien': ['Courant fort', 'Courant faible', 'Habilitation électrique'],
    'Cariste': ['CACES 3', 'Gestion de stock', 'Préparation de commandes'],
  };
  
  const skills = skillsMap[title as keyof typeof skillsMap] || ['Compétence technique', 'Communication', 'Travail en équipe'];
  
  // Générer un taux journalier en fonction du titre
  const rateMap = {
    'Développeur Web': 450,
    'Soudeur': 280,
    'Plombier': 250,
    'Électricien': 280,
    'Cariste': 200,
  };
  
  const dailyRate = rateMap[title as keyof typeof rateMap] || 300;
  
  return {
    title,
    company,
    location,
    description,
    skills,
    dailyRate,
    startDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 37)),
    contactPerson: 'Contact extrait du document',
    contactEmail: 'contact@entreprise.com',
  };
}; 