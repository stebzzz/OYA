import React, { useState } from 'react';
import { Search, Zap, Brain, MapPin, Euro, Calendar, Plus, Star, Target, Filter, Building2, GraduationCap, ExternalLink } from 'lucide-react';
import { perplexityService } from '../../services/perplexityService';
import { useCandidates } from '../../hooks/useCandidates';

const SourcingAI: React.FC = () => {
  const { addCandidate } = useCandidates();
  const [searchCriteria, setSearchCriteria] = useState({
    position: '',
    skills: '',
    experience: '',
    location: '',
    salaryMin: '',
    salaryMax: ''
  });
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  const handleAISearch = async () => {
    if (!searchCriteria.position) {
      alert('Veuillez spécifier au moins un poste à rechercher');
      return;
    }

    setIsSearching(true);
    
    try {
      // Utiliser la vraie recherche IA avec Perplexity
      const candidates = await perplexityService.searchRealCandidates(searchCriteria);
      setSearchResults(candidates);
    } catch (error) {
      console.error('Erreur lors de la recherche IA:', error);
      alert('Erreur lors de la recherche. Veuillez réessayer.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleImportSelected = async () => {
    const candidatesToImport = searchResults.filter(c => selectedCandidates.includes(c.id));
    
    try {
      for (const candidate of candidatesToImport) {
        await addCandidate({
          name: candidate.name,
          email: candidate.email,
          position: candidate.position,
          experience: candidate.experience,
          location: candidate.location,
          skills: candidate.skills,
          salary: candidate.salary,
          score: candidate.score,
          status: 'To Contact',
          source: candidate.source,
          avatar: candidate.avatar,
          notes: `${candidate.summary}\n\nEntreprise actuelle: ${candidate.company || 'N/A'}\nFormation: ${candidate.education || 'N/A'}`,
          phone: ''
        });
      }
      
      alert(`${candidatesToImport.length} candidats importés avec succès !`);
      setSelectedCandidates([]);
      setSearchResults([]);
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      alert('Erreur lors de l\'importation. Veuillez réessayer.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#9b6bff] to-[#9b6bff]/80 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <Brain className="mr-3" size={32} />
              Sourcing IA OYA
            </h1>
            <p className="text-gray-200">
              Recherche automatique de vrais candidats avec intelligence artificielle
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{searchResults.length}</div>
            <div className="text-sm text-gray-200">Candidats trouvés</div>
          </div>
        </div>
      </div>

      {/* Critères de recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-[#223049] mb-6 flex items-center">
          <Target className="text-[#ff6a3d] mr-2" size={20} />
          Critères de recherche intelligente
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Poste recherché *
            </label>
            <input
              type="text"
              value={searchCriteria.position}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, position: e.target.value })}
              placeholder="ex: Développeur Full-Stack Senior"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9b6bff] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compétences clés (séparées par virgules)
            </label>
            <input
              type="text"
              value={searchCriteria.skills}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, skills: e.target.value })}
              placeholder="React, Node.js, TypeScript, AWS"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9b6bff] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expérience minimum
            </label>
            <select
              value={searchCriteria.experience}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, experience: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9b6bff] focus:border-transparent"
            >
              <option value="">Indifférent</option>
              <option value="1-2 ans">1-2 ans minimum</option>
              <option value="3-5 ans">3-5 ans minimum</option>
              <option value="5-8 ans">5-8 ans minimum</option>
              <option value="8+ ans">8+ ans (Senior/Expert)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localisation préférée
            </label>
            <input
              type="text"
              value={searchCriteria.location}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, location: e.target.value })}
              placeholder="Paris, Lyon, Remote, France..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9b6bff] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salaire minimum
            </label>
            <input
              type="text"
              value={searchCriteria.salaryMin}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, salaryMin: e.target.value })}
              placeholder="45k€"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9b6bff] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salaire maximum
            </label>
            <input
              type="text"
              value={searchCriteria.salaryMax}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, salaryMax: e.target.value })}
              placeholder="80k€"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9b6bff] focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAISearch}
            disabled={isSearching || !searchCriteria.position}
            className="bg-[#9b6bff] text-white px-8 py-3 rounded-lg hover:bg-[#9b6bff]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Recherche IA en cours...</span>
              </>
            ) : (
              <>
                <Zap size={20} />
                <span>Lancer la recherche IA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Résultats de recherche */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#223049] flex items-center">
                <Search className="text-[#ff6a3d] mr-2" size={20} />
                Candidats réels trouvés ({searchResults.length})
              </h2>
              {selectedCandidates.length > 0 && (
                <button
                  onClick={handleImportSelected}
                  className="bg-[#ff6a3d] text-white px-6 py-2 rounded-lg hover:bg-[#ff6a3d]/90 transition-colors flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Importer sélectionnés ({selectedCandidates.length})</span>
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {searchResults.map((candidate) => (
              <div key={candidate.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedCandidates.includes(candidate.id)}
                    onChange={() => handleSelectCandidate(candidate.id)}
                    className="w-4 h-4 text-[#9b6bff] border-gray-300 rounded focus:ring-[#9b6bff] mt-1"
                  />

                  <div className="relative">
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <div className={`w-4 h-4 rounded-full ${candidate.score >= 90 ? 'bg-green-500' : candidate.score >= 80 ? 'bg-[#ff6a3d]' : 'bg-yellow-500'}`}></div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-[#223049] text-lg">{candidate.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star size={16} className="text-[#9b6bff]" />
                        <span className="text-sm font-medium text-[#9b6bff]">{candidate.score}% match</span>
                      </div>
                      {candidate.linkedinUrl && (
                        <a 
                          href={candidate.linkedinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    
                    <p className="text-gray-900 font-medium mb-2">{candidate.position}</p>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">{candidate.summary}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin size={14} />
                          <span>{candidate.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{candidate.experience}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Euro size={14} />
                          <span>{candidate.salary}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {candidate.company && (
                          <div className="flex items-center space-x-1">
                            <Building2 size={14} />
                            <span>{candidate.company}</span>
                          </div>
                        )}
                        {candidate.education && (
                          <div className="flex items-center space-x-1">
                            <GraduationCap size={14} />
                            <span>{candidate.education}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {candidate.skills.slice(0, 6).map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#9b6bff]/10 text-[#9b6bff] text-sm rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 6 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          +{candidate.skills.length - 6} autres
                        </span>
                      )}
                    </div>

                    {candidate.availability && (
                      <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {candidate.availability}
                      </div>
                    )}
                  </div>
                </div>

                {/* Points forts IA (si disponibles) */}
                {candidate.strengths && candidate.strengths.length > 0 && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-[#f4f0ec] to-white rounded-lg">
                    <h4 className="text-sm font-medium text-[#223049] mb-2 flex items-center">
                      <Brain size={16} className="text-[#9b6bff] mr-1" />
                      Points forts détectés par l'IA :
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.strengths.slice(0, 3).map((strength: string, index: number) => (
                        <span key={index} className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                          ✓ {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message initial */}
      {searchResults.length === 0 && !isSearching && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-[#9b6bff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain size={32} className="text-[#9b6bff]" />
            </div>
            <h3 className="text-xl font-semibold text-[#223049] mb-4">Sourcing IA automatique</h3>
            <p className="text-gray-600 mb-6">
              Définissez vos critères de recherche et laissez l'IA OYA trouver de vrais candidats 
              sur le marché français avec scoring automatique et données réelles.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Recherche de profils réels</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Scoring IA précis</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Données du marché français</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Import direct</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourcingAI;