import React, { useState } from 'react';
import { Search, Zap, Brain, MapPin, Euro, Calendar, Plus, Star, Target, Filter, Building2, GraduationCap, ExternalLink, TrendingUp, Users, Lightbulb, Activity, Globe, Github, Linkedin, Award, Clock, CheckCircle, AlertCircle, History } from 'lucide-react';
import { intelligentSourcingService } from '../../services/intelligentSourcingService';
import { sourcingHistoryService } from '../../services/sourcingHistoryService';
import { useCandidates } from '../../hooks/useCandidates';
import { useAuth } from '../../contexts/AuthContext';
import SourcingHistory from './SourcingHistory';

const SourcingAI: React.FC = () => {
  const { addCandidate } = useCandidates();
  const { currentUser } = useAuth();
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
  const [marketInsights, setMarketInsights] = useState<any>(null);
  const [searchSummary, setSearchSummary] = useState<string>('');
  const [searchProgress, setSearchProgress] = useState<string>('');
  const [sourceBreakdown, setSourceBreakdown] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleAISearch = async () => {
    if (!searchCriteria.position) {
      alert('Veuillez spécifier au moins un poste à rechercher');
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    setMarketInsights(null);
    setSearchSummary('');
    setSelectedCandidates([]);
    setSourceBreakdown(null);
    
    const startTime = Date.now();
    
    try {
      setSearchProgress('🔍 Initialisation recherche multi-sources...');
      
      // Utiliser le service de sourcing intelligent amélioré
      const result = await intelligentSourcingService.searchCandidates(searchCriteria);
      
      setSearchResults(result.candidates);
      setMarketInsights(result.marketInsights);
      setSearchSummary(result.searchSummary);
      setSourceBreakdown(result.sourceBreakdown);
      setSearchProgress('✅ Recherche terminée avec succès');

      // Sauvegarder dans l'historique
      if (currentUser && result.candidates.length > 0) {
        const searchTime = Date.now() - startTime;
        try {
          await sourcingHistoryService.saveSearch(
            currentUser.uid,
            searchCriteria,
            result,
            {
              searchTime: `${searchTime}ms`,
              sourcesUsed: result.sourceBreakdown?.sources?.length || 0
            },
            {
              totalSearchTime: searchTime,
              candidatesPerSecond: Math.round((result.candidates.length / searchTime) * 1000),
              successRate: 100,
              qualityScore: result.sourceBreakdown?.qualityMetrics?.averageScore || 0
            }
          );
          console.log('✅ Recherche sauvegardée dans l\'historique');
        } catch (error) {
          console.error('⚠️ Erreur sauvegarde historique:', error);
        }
      }
      
    } catch (error) {
      console.error('Erreur lors de la recherche IA:', error);
      setSearchProgress('❌ Erreur lors de la recherche');
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
          notes: `${candidate.summary}\n\nSource: ${candidate.source}\nEntreprise: ${candidate.company}\n${candidate.education ? `Formation: ${candidate.education}` : ''}\n${candidate.headline ? `Titre: ${candidate.headline}` : ''}\n${candidate.aiAnalysis ? `\nAnalyse IA: ${candidate.aiAnalysis}` : ''}`,
          phone: ''
        });
      }
      
      alert(`${candidatesToImport.length} candidats importés avec succès !`);
      setSelectedCandidates([]);
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      alert('Erreur lors de l\'importation. Veuillez réessayer.');
    }
  };

  const handleRerunSearch = (criteria: any) => {
    setSearchCriteria(criteria);
    setShowHistory(false);
  };

  const getSourceIcon = (source: string) => {
    if (source.includes('GitHub')) return <Github size={16} className="text-gray-700" />;
    if (source.includes('LinkedIn')) return <Linkedin size={16} className="text-blue-600" />;
    if (source.includes('externe') || source.includes('Job')) return <Globe size={16} className="text-green-600" />;
    return <Activity size={16} className="text-[#9b6bff]" />;
  };

  const getQualityBadge = (candidate: any) => {
    if (candidate.realProfile) {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
        <CheckCircle size={12} />
        <span>Profil vérifié</span>
      </span>;
    }
    
    if (candidate.score >= 85) {
      return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
        <Star size={12} />
        <span>Score élevé</span>
      </span>;
    }
    
    return null;
  };

  const getAvailabilityBadge = (availability: string) => {
    if (availability?.includes('Ouvert')) {
      return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
        🚀 Ouvert aux opportunités
      </span>;
    }
    return null;
  };

  if (showHistory) {
    return (
      <SourcingHistory 
        onRerunSearch={handleRerunSearch}
        onClose={() => setShowHistory(false)}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header amélioré */}
      <div className="bg-gradient-to-r from-[#9b6bff] to-[#9b6bff]/80 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <Brain className="mr-3" size={32} />
              Sourcing IA Multi-Sources Pro
            </h1>
            <p className="text-gray-200 mb-4">
              Recherche intelligente : LinkedIn, GitHub, base française + enrichissement IA
            </p>
            
            {/* Sources disponibles avec stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Linkedin size={16} />
                <span>LinkedIn Pro</span>
              </div>
              <div className="flex items-center space-x-2">
                <Github size={16} />
                <span>GitHub Devs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity size={16} />
                <span>Base française</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain size={16} />
                <span>IA Perplexity</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{searchResults.length}</div>
            <div className="text-sm text-gray-200">Candidats trouvés</div>
            {sourceBreakdown && (
              <div className="text-xs text-gray-300 mt-1">
                {sourceBreakdown.qualityMetrics.realProfilesPercentage}% profils vérifiés
              </div>
            )}
            <button
              onClick={() => setShowHistory(true)}
              className="mt-2 flex items-center space-x-1 text-gray-200 hover:text-white transition-colors text-sm"
            >
              <History size={14} />
              <span>Historique</span>
            </button>
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

        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {isSearching && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#9b6bff]"></div>
                <span>{searchProgress}</span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <History size={16} />
              <span>Historique</span>
            </button>
            
            <button
              onClick={handleAISearch}
              disabled={isSearching || !searchCriteria.position}
              className="bg-[#9b6bff] text-white px-8 py-3 rounded-lg hover:bg-[#9b6bff]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Recherche en cours...</span>
                </>
              ) : (
                <>
                  <Zap size={20} />
                  <span>Recherche Multi-Sources</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Breakdown des sources */}
      {sourceBreakdown && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-[#223049] mb-4 flex items-center">
            <TrendingUp className="text-[#ff6a3d] mr-2" size={20} />
            Analyse des sources
          </h3>
          
          <div className="grid lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-[#223049] mb-3">Sources utilisées :</h4>
              <div className="space-y-2">
                {sourceBreakdown.sources.map((source: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      {getSourceIcon(source.name)}
                      <span className="text-sm font-medium">{source.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{source.count} profils</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-[#223049] mb-3">Métriques qualité :</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Score moyen :</span>
                  <span className="text-sm font-medium">{sourceBreakdown.qualityMetrics.averageScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Profils vérifiés :</span>
                  <span className="text-sm font-medium">{sourceBreakdown.qualityMetrics.realProfilesPercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Profils complets :</span>
                  <span className="text-sm font-medium">{sourceBreakdown.qualityMetrics.completeProfilesPercentage}%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-[#223049] mb-3">Performance :</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Temps de recherche :</span>
                  <span className="text-sm font-medium">{marketInsights?.searchTime || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sources interrogées :</span>
                  <span className="text-sm font-medium">{marketInsights?.totalSources || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insights du marché */}
      {marketInsights && (
        <div className="bg-gradient-to-br from-[#f4f0ec] to-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-[#223049] mb-4 flex items-center">
            <Lightbulb className="text-[#ff6a3d] mr-2" size={20} />
            Insights du marché français
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-[#223049] mb-2">Analyse du marché :</h4>
              <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border">
                {marketInsights.marketInsights}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-[#223049] mb-2">Benchmark salarial :</h4>
              <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border">
                {marketInsights.salaryBenchmark}
              </p>
            </div>
          </div>
          
          {marketInsights.suggestedSkills?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-[#223049] mb-2">Compétences tendance :</h4>
              <div className="flex flex-wrap gap-2">
                {marketInsights.suggestedSkills.map((skill: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-[#9b6bff]/10 text-[#9b6bff] text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Résumé de recherche */}
      {searchSummary && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-blue-800">
            <Search size={16} />
            <span className="font-medium">Résumé de la recherche :</span>
          </div>
          <p className="text-blue-700 mt-1 text-sm">{searchSummary}</p>
        </div>
      )}

      {/* Résultats de recherche */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#223049] flex items-center">
                <Users className="text-[#ff6a3d] mr-2" size={20} />
                Candidats trouvés ({searchResults.length})
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
                      {getQualityBadge(candidate)}
                    </div>
                    
                    {/* Headline LinkedIn si disponible */}
                    {candidate.headline && (
                      <p className="text-gray-700 font-medium mb-1">{candidate.headline}</p>
                    )}
                    
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
                        {candidate.connections && (
                          <div className="flex items-center space-x-1">
                            <Users size={14} />
                            <span>{candidate.connections}+ connexions</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Compétences */}
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

                    {/* Badges disponibilité et certifications */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {getAvailabilityBadge(candidate.availability)}
                      {candidate.certifications && candidate.certifications.length > 0 && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                          <Award size={12} />
                          <span>{candidate.certifications.length} certification{candidate.certifications.length > 1 ? 's' : ''}</span>
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      {candidate.linkedinUrl && (
                        <a 
                          href={candidate.linkedinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <Linkedin size={14} />
                          <span>Voir LinkedIn</span>
                        </a>
                      )}
                      {candidate.githubProfile && (
                        <a 
                          href={candidate.githubProfile} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 text-sm"
                        >
                          <Github size={14} />
                          <span>GitHub</span>
                        </a>
                      )}
                      <div className="flex items-center space-x-1 text-gray-500 text-sm">
                        {getSourceIcon(candidate.source)}
                        <span>{candidate.source}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analyse IA détaillée */}
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

                {/* Indicateurs de qualité */}
                {candidate.qualityIndicators && (
                  <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                    <span>Complétude: {candidate.qualityIndicators.profileCompleteness}%</span>
                    <span>Fiabilité: {candidate.qualityIndicators.sourceReliability}</span>
                    <span>Contactabilité: {candidate.qualityIndicators.contactability}</span>
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
            <h3 className="text-xl font-semibold text-[#223049] mb-4">Sourcing IA Multi-Sources Pro</h3>
            <p className="text-gray-600 mb-6">
              Recherchez de vrais candidats sur LinkedIn, GitHub, réseaux professionnels et notre base française 
              avec scoring IA avancé et enrichissement automatique.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle size={16} />
                <span>Profils LinkedIn vérifiés</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle size={16} />
                <span>Développeurs GitHub réels</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle size={16} />
                <span>Scoring IA Perplexity</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle size={16} />
                <span>Données marché français</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourcingAI;