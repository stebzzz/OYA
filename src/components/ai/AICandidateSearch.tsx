import React, { useState } from 'react';
import { Search, Briefcase, Award, Target, Loader2, ChevronRight, User, Download, Filter, Calendar } from 'lucide-react';
import { Candidate } from '../../services/candidatesService';
import { getAIResponse } from '../../services/aiService';

interface AISearchProps {
  onCandidatesFound: (candidates: Partial<Candidate>[]) => void;
}

export const AICandidateSearch: React.FC<AISearchProps> = ({ onCandidatesFound }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<'guided' | 'ai'>('guided');

  // Fonction pour ajouter une compétence
  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  // Fonction pour supprimer une compétence
  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  // Recherche guidée
  const handleGuidedSearch = async () => {
    if (!jobTitle && skills.length === 0) {
      setError("Veuillez spécifier au moins un titre de poste ou une compétence");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Simulation d'une recherche (à remplacer par un appel API réel)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Générer des profils fictifs pour la démonstration
      const mockCandidates = Array(5).fill(0).map((_, index) => ({
        id: `candidate-${index}`,
        firstName: `Prénom${index + 1}`,
        lastName: `Nom${index + 1}`,
        email: `email${index + 1}@example.com`,
        phone: `0${6 + Math.floor(Math.random() * 4)}${Array(8).fill(0).map(() => Math.floor(Math.random() * 10)).join('')}`,
        skills: [...skills, 'Compétence supplémentaire', 'Autre compétence'],
        status: 'available' as const,
        availability: 'Immédiate',
        avatar: null,
        linkedinProfile: `https://linkedin.com/in/profile${index + 1}`,
        matchScore: Math.floor(Math.random() * 30) + 70
      }));

      onCandidatesFound(mockCandidates);
    } catch (err) {
      console.error('Erreur lors de la recherche de candidats:', err);
      setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Recherche par IA
  const handleAISearch = async () => {
    if (!searchQuery.trim()) {
      setError("Veuillez entrer une description du profil recherché");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Construire le prompt pour l'IA
      const prompt = `
        En tant qu'assistant RH, aide-moi à trouver des candidats qui correspondent à cette description:
        "${searchQuery}"
        
        Analyse la requête et extrais:
        1. Le titre du poste
        2. Les compétences requises
        3. L'expérience nécessaire
        4. Tout autre critère important
      `;

      // Appeler l'API d'IA (simulé ici)
      // const aiResponse = await getAIResponse({ prompt, userId: 'user123' });
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Simuler l'analyse de l'IA et générer des candidats fictifs
      const extractedJobTitle = searchQuery.includes('développeur') ? 'Développeur Frontend' : 'Chef de Projet';
      const extractedSkills = ['React', 'JavaScript', 'UI/UX', 'Communication'];
      
      const mockCandidates = Array(3).fill(0).map((_, index) => ({
        id: `ai-candidate-${index}`,
        firstName: `AI-Prénom${index + 1}`,
        lastName: `AI-Nom${index + 1}`,
        email: `ai-email${index + 1}@example.com`,
        phone: `0${6 + Math.floor(Math.random() * 4)}${Array(8).fill(0).map(() => Math.floor(Math.random() * 10)).join('')}`,
        skills: [...extractedSkills, 'Compétence IA'],
        status: 'available' as const,
        availability: 'Immédiate',
        avatar: null,
        linkedinProfile: `https://linkedin.com/in/ai-profile${index + 1}`,
        matchScore: Math.floor(Math.random() * 25) + 75
      }));

      onCandidatesFound(mockCandidates);
    } catch (err) {
      console.error('Erreur lors de la recherche IA:', err);
      setError('Une erreur est survenue lors de la recherche IA. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Recherche IA de Candidats</h2>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1.5 rounded-lg ${searchMode === 'guided' ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            onClick={() => setSearchMode('guided')}
          >
            <Filter className="h-4 w-4 inline mr-1" /> Guidée
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg ${searchMode === 'ai' ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            onClick={() => setSearchMode('ai')}
          >
            <Target className="h-4 w-4 inline mr-1" /> IA
          </button>
        </div>
      </div>

      {searchMode === 'guided' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Titre du poste</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="ex: Développeur Frontend, Chef de projet..."
                  className="pl-10 pr-3 py-2 w-full bg-gray-700 border border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-white"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Localisation</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="ex: Paris, Lyon, Remote..."
                  className="pl-10 pr-3 py-2 w-full bg-gray-700 border border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-white"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Compétences requises</label>
            <div className="flex space-x-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Award className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Ajouter une compétence..."
                  className="pl-10 pr-3 py-2 w-full bg-gray-700 border border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-white"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
              </div>
              <button
                onClick={addSkill}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
              >
                Ajouter
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center"
                >
                  <span className="text-primary-300 text-sm">{skill}</span>
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-primary-300 hover:text-primary-100"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleGuidedSearch}
            disabled={loading}
            className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Recherche en cours...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Rechercher des candidats
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Décrivez le profil idéal</label>
            <div className="relative">
              <textarea
                placeholder="ex: Je recherche un développeur frontend avec 3 ans d'expérience en React et des compétences en UI/UX. La personne doit être disponible immédiatement et avoir une bonne communication..."
                className="p-3 w-full h-32 bg-gray-700 border border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleAISearch}
            disabled={loading}
            className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Analyse IA en cours...
              </>
            ) : (
              <>
                <Target className="h-5 w-5 mr-2" />
                Recherche intelligente
              </>
            )}
          </button>

          <div className="text-sm text-gray-400 italic">
            Notre IA analysera votre description pour trouver les candidats les plus pertinents en fonction du contexte.
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-400/20 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}; 