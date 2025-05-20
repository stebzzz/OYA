import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Filter, MoreHorizontal, ChevronDown, Check, User, Eye, Loader2, FileText, AlertTriangle, Upload, Briefcase, Clock, Calendar, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AddCandidateModal } from './AddCandidateModal';
import { ImportCVModal } from './ImportCVModal';
import { getAllCandidates, Candidate, searchLinkedInProfiles } from '../../services/candidatesService';

const statusColors = {
  available: { bg: 'bg-emerald-400/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  interviewing: { bg: 'bg-amber-400/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  hired: { bg: 'bg-blue-400/10', text: 'text-blue-400', dot: 'bg-blue-400' },
  inactive: { bg: 'bg-gray-400/10', text: 'text-gray-400', dot: 'bg-gray-400' }
};

export const CandidatesList = () => {
  // États pour les données et le chargement
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  // État pour les modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isLinkedInSearching, setIsLinkedInSearching] = useState(false);
  const [linkedInProfiles, setLinkedInProfiles] = useState<Partial<Candidate>[]>([]);
  
  const navigate = useNavigate();
  
  // Charger les candidats
  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setLoading(true);
        const data = await getAllCandidates();
        setCandidates(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des candidats:', err);
        setError('Impossible de charger les candidats. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    loadCandidates();
  }, []);
  
  // Extraire toutes les compétences uniques
  const allSkills = Array.from(new Set(candidates.flatMap(candidate => candidate.skills)));
  
  // Filtrer les candidats 
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = searchTerm === '' || 
      `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkill = filterSkill === null || 
      candidate.skills.includes(filterSkill);
      
    const matchesStatus = filterStatus === null || 
      candidate.status === filterStatus;
      
    return matchesSearch && matchesSkill && matchesStatus;
  });

  // Rechercher des candidats sur LinkedIn
  const searchOnLinkedIn = async () => {
    try {
      setIsLinkedInSearching(true);
      const searchCriteria = {
        skills: filterSkill ? [filterSkill] : allSkills.slice(0, 3),
        jobTitle: 'Developer' // Exemple
      };
      
      const profiles = await searchLinkedInProfiles(searchCriteria);
      setLinkedInProfiles(profiles);
    } catch (err) {
      console.error('Erreur lors de la recherche LinkedIn:', err);
    } finally {
      setIsLinkedInSearching(false);
    }
  };

  // Gérer l'ajout d'un nouveau candidat
  const handleCandidateAdded = (candidateId: string) => {
    // Recharger les données
    getAllCandidates().then(data => {
      setCandidates(data);
    }).catch(err => {
      console.error('Erreur lors du rechargement des candidats:', err);
    });
    
    // Rediriger vers la page de détail du nouveau candidat
    setTimeout(() => {
      navigate(`/dashboard/candidates/${candidateId}`);
    }, 500);
  };

  // Rendu pour l'état de chargement
  if (loading && candidates.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Base de Talents</h1>
        <div className="flex space-x-3">
          <button
            onClick={searchOnLinkedIn}
            disabled={isLinkedInSearching}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLinkedInSearching ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Briefcase className="h-5 w-5" />
            )}
            <span>Rechercher sur LinkedIn</span>
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Upload className="h-5 w-5" />
            <span>Importer CV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <UserPlus className="h-5 w-5" />
            <span>Ajouter un candidat</span>
          </button>
        </div>
      </div>
      
      {/* Afficher l'erreur s'il y en a une */}
      {error && (
        <div className="bg-red-500/10 border border-red-400/20 p-4 rounded-xl text-red-300 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p>{error}</p>
            <button 
              className="mt-2 px-3 py-1 bg-red-600/30 hover:bg-red-600/50 rounded text-sm transition-colors"
              onClick={() => {
                setLoading(true);
                getAllCandidates().then(data => {
                  setCandidates(data);
                  setError(null);
                }).catch(err => {
                  console.error('Erreur lors du rechargement:', err);
                  setError('Impossible de charger les candidats. Veuillez réessayer.');
                }).finally(() => {
                  setLoading(false);
                });
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      )}
      
      {/* Profils LinkedIn trouvés */}
      {linkedInProfiles.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-400/20 p-4 rounded-xl">
          <h3 className="text-white text-lg font-semibold mb-3">Profils LinkedIn correspondants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {linkedInProfiles.map((profile, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h4 className="font-medium text-white">{profile.firstName} {profile.lastName}</h4>
                <div className="mt-2 text-sm text-gray-300">
                  {profile.skills && profile.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {profile.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-3 flex justify-between">
                  <a 
                    href={profile.linkedinProfile} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 text-sm hover:underline flex items-center"
                  >
                    Voir profil <Eye className="h-3 w-3 ml-1" />
                  </a>
                  <button className="text-primary-400 text-sm hover:underline">Importer</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Filtres */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un candidat..."
              className="pl-10 pr-4 py-2 w-full bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <button
                className="flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 text-gray-200"
                onClick={() => document.getElementById('skill-dropdown')?.classList.toggle('hidden')}
              >
                <Filter className="h-4 w-4 mr-2" />
                <span>{filterSkill || 'Compétences'}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              
              <div id="skill-dropdown" className="absolute mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg overflow-hidden z-10 hidden">
                <div className="p-2">
                  <button
                    className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                    onClick={() => {
                      setFilterSkill(null);
                      document.getElementById('skill-dropdown')?.classList.add('hidden');
                    }}
                  >
                    <span>Toutes les compétences</span>
                    {filterSkill === null && <Check className="h-4 w-4 ml-auto" />}
                  </button>
                  
                  {allSkills.map(skill => (
                    <button
                      key={skill}
                      className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                      onClick={() => {
                        setFilterSkill(skill);
                        document.getElementById('skill-dropdown')?.classList.add('hidden');
                      }}
                    >
                      <span>{skill}</span>
                      {filterSkill === skill && <Check className="h-4 w-4 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative">
              <button
                className="flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 text-gray-200"
                onClick={() => document.getElementById('status-dropdown')?.classList.toggle('hidden')}
              >
                <div className="h-4 w-4 mr-2 rounded-full bg-gray-500"></div>
                <span>{filterStatus ? (
                    filterStatus === 'available' ? 'Disponible' : 
                    filterStatus === 'interviewing' ? 'En entretien' :
                    filterStatus === 'hired' ? 'Recruté' : 'Inactif'
                  ) : 'Statut'}
                </span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              
              <div id="status-dropdown" className="absolute mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg overflow-hidden z-10 hidden">
                <div className="p-2">
                  <button
                    className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                    onClick={() => {
                      setFilterStatus(null);
                      document.getElementById('status-dropdown')?.classList.add('hidden');
                    }}
                  >
                    <span>Tous les statuts</span>
                    {filterStatus === null && <Check className="h-4 w-4 ml-auto" />}
                  </button>
                  
                  <button
                    className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                    onClick={() => {
                      setFilterStatus('available');
                      document.getElementById('status-dropdown')?.classList.add('hidden');
                    }}
                  >
                    <div className={`h-3 w-3 mr-2 rounded-full ${statusColors.available.dot}`}></div>
                    <span>Disponible</span>
                    {filterStatus === 'available' && <Check className="h-4 w-4 ml-auto" />}
                  </button>
                  
                  <button
                    className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                    onClick={() => {
                      setFilterStatus('interviewing');
                      document.getElementById('status-dropdown')?.classList.add('hidden');
                    }}
                  >
                    <div className={`h-3 w-3 mr-2 rounded-full ${statusColors.interviewing.dot}`}></div>
                    <span>En entretien</span>
                    {filterStatus === 'interviewing' && <Check className="h-4 w-4 ml-auto" />}
                  </button>
                  
                  <button
                    className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                    onClick={() => {
                      setFilterStatus('hired');
                      document.getElementById('status-dropdown')?.classList.add('hidden');
                    }}
                  >
                    <div className={`h-3 w-3 mr-2 rounded-full ${statusColors.hired.dot}`}></div>
                    <span>Recruté</span>
                    {filterStatus === 'hired' && <Check className="h-4 w-4 ml-auto" />}
                  </button>
                  
                  <button
                    className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                    onClick={() => {
                      setFilterStatus('inactive');
                      document.getElementById('status-dropdown')?.classList.add('hidden');
                    }}
                  >
                    <div className={`h-3 w-3 mr-2 rounded-full ${statusColors.inactive.dot}`}></div>
                    <span>Inactif</span>
                    {filterStatus === 'inactive' && <Check className="h-4 w-4 ml-auto" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Liste des candidats */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Candidat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Compétences</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Disponibilité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Matching Score</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <User className="h-10 w-10 mb-2 text-gray-500" />
                      <p className="mb-1">Aucun candidat ne correspond à votre recherche</p>
                      <p className="text-sm">Essayez de modifier vos filtres ou d'ajouter de nouveaux candidats</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCandidates.map(candidate => {
                  const statusColor = statusColors[candidate.status];
                  const statusText = candidate.status === 'available' ? 'Disponible' : 
                                    candidate.status === 'interviewing' ? 'En entretien' :
                                    candidate.status === 'hired' ? 'Recruté' : 'Inactif';
                  
                  // Calcul d'un score fictif pour la démo
                  const matchScore = Math.floor(Math.random() * 60) + 40;
                  const scoreColorClass = matchScore >= 80 ? 'text-emerald-400' : 
                                        matchScore >= 65 ? 'text-blue-400' :
                                        matchScore >= 50 ? 'text-amber-400' : 'text-gray-400';
                  
                  return (
                    <tr key={candidate.id} className="hover:bg-gray-700/25">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {candidate.avatar ? (
                              <img className="h-10 w-10 rounded-full" src={candidate.avatar} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-primary-700/30 flex items-center justify-center text-primary-300">
                                {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{candidate.firstName} {candidate.lastName}</div>
                            <div className="text-sm text-gray-400">{candidate.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-gray-700 rounded-full text-gray-300">
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-700 rounded-full text-gray-300">
                              +{candidate.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center ${statusColor.bg} ${statusColor.text} px-2.5 py-1 rounded-full text-xs font-medium`}>
                          <div className={`w-2 h-2 ${statusColor.dot} rounded-full mr-2`}></div>
                          {statusText}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-gray-300">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="text-sm">{candidate.availability}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center ${scoreColorClass} font-bold`}>
                          <Award className="h-4 w-4 mr-1" />
                          {matchScore}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/dashboard/candidates/${candidate.id}`}
                            className="rounded-md p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/dashboard/candidates/${candidate.id}/interview`}
                            className="rounded-md p-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 transition-colors"
                          >
                            <Calendar className="h-4 w-4" />
                          </Link>
                          {candidate.cvUrl && (
                            <a
                              href={candidate.cvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-md p-1.5 bg-primary-600/20 hover:bg-primary-600/30 text-primary-400 transition-colors"
                            >
                              <FileText className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal pour ajouter un candidat */}
      {isAddModalOpen && (
        <AddCandidateModal
          onClose={() => setIsAddModalOpen(false)}
          onCandidateAdded={handleCandidateAdded}
        />
      )}
      
      {/* Modal pour importer un CV */}
      {isImportModalOpen && (
        <ImportCVModal
          onClose={() => setIsImportModalOpen(false)}
          onCVImported={handleCandidateAdded}
        />
      )}
    </div>
  );
};