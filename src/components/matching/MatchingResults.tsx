import React, { useState, useEffect } from 'react';
import { Search, MapPin, Buildings, ChevronsUpDown, Clock, Briefcase, CalendarDays, Award, CheckCircle2 } from 'lucide-react';
import { findJobMatches } from '../../services/matchingService';
import { CandidateProfile, JobOffer, JobMatch } from '../../services/aiService';

interface MatchingResultsProps {
  candidate: CandidateProfile;
  limit?: number;
}

const MatchingResults: React.FC<MatchingResultsProps> = ({ candidate, limit = 10 }) => {
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'score' | 'date' | 'title'>('score');
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [filterJobType, setFilterJobType] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const matchResults = await findJobMatches(candidate.id, limit);
        setMatches(matchResults);
        if (matchResults.length > 0) {
          setSelectedJob(matchResults[0].job);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des correspondances:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [candidate.id, limit]);

  const filteredMatches = matches.filter(match => {
    const job = match.job;
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesLocation = filterLocation === '' || 
      job.location.toLowerCase().includes(filterLocation.toLowerCase());
      
    const matchesJobType = filterJobType === '' || 
      job.type.toLowerCase() === filterJobType.toLowerCase();
      
    return matchesSearch && matchesLocation && matchesJobType;
  });

  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (sortOrder === 'score') {
      return b.matchScore - a.matchScore;
    } else if (sortOrder === 'date') {
      return new Date(b.job.postedAt).getTime() - new Date(a.job.postedAt).getTime();
    } else {
      return a.job.title.localeCompare(b.job.title);
    }
  });

  const locations = Array.from(new Set(matches.map(match => match.job.location)));
  const jobTypes = Array.from(new Set(matches.map(match => match.job.type)));

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Correspondances d'emploi</h2>
        
        {/* Filtres et recherche */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <div className="relative">
            <select
              className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              <option value="">Toutes les localisations</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>{location}</option>
              ))}
            </select>
            <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <ChevronsUpDown className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <div className="relative">
            <select
              className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterJobType}
              onChange={(e) => setFilterJobType(e.target.value)}
            >
              <option value="">Tous les types</option>
              {jobTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
            <Briefcase className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <ChevronsUpDown className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <div className="relative">
            <select
              className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'score' | 'date' | 'title')}
            >
              <option value="score">Tri par score</option>
              <option value="date">Tri par date</option>
              <option value="title">Tri par titre</option>
            </select>
            <Award className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <ChevronsUpDown className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : sortedMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Liste des correspondances */}
            <div className="md:col-span-5 lg:col-span-4 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {sortedMatches.map((match, index) => (
                <div 
                  key={match.job.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all hover:bg-gray-800 ${selectedJob?.id === match.job.id ? 'bg-gray-800 border border-blue-500' : 'bg-gray-850'}`}
                  onClick={() => setSelectedJob(match.job)}
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-semibold text-md">{match.job.title}</h3>
                    <div className="flex items-center">
                      <span className={`text-sm px-2 py-0.5 rounded-md ${
                        match.matchScore >= 80 ? 'bg-green-900 text-green-100' : 
                        match.matchScore >= 60 ? 'bg-blue-900 text-blue-100' : 
                        'bg-yellow-900 text-yellow-100'}`
                      }>
                        {match.matchScore}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-300 mb-2 flex items-center">
                    <Buildings size={14} className="mr-1 text-gray-400" />
                    {match.job.company.name}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-xs">
                    <div className="flex items-center bg-gray-700 px-2 py-1 rounded">
                      <MapPin size={12} className="mr-1" />
                      {match.job.location}
                    </div>
                    <div className="flex items-center bg-gray-700 px-2 py-1 rounded">
                      <Briefcase size={12} className="mr-1" />
                      {match.job.type}
                    </div>
                    <div className="flex items-center bg-gray-700 px-2 py-1 rounded">
                      <Clock size={12} className="mr-1" />
                      {new Date(match.job.postedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Détails de l'offre sélectionnée */}
            <div className="md:col-span-7 lg:col-span-8 bg-gray-850 rounded-lg p-6">
              {selectedJob ? (
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold mb-2">{selectedJob.title}</h2>
                      <div className="flex items-center mb-4">
                        <Buildings size={18} className="mr-2 text-blue-400" />
                        <span className="text-gray-200 font-medium mr-4">{selectedJob.company.name}</span>
                      </div>
                    </div>
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">
                      Postuler
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center bg-gray-800 p-3 rounded-lg">
                      <MapPin size={18} className="mr-2 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Localisation</p>
                        <p className="text-sm font-medium">{selectedJob.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-gray-800 p-3 rounded-lg">
                      <Briefcase size={18} className="mr-2 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Type</p>
                        <p className="text-sm font-medium">{selectedJob.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-gray-800 p-3 rounded-lg">
                      <CalendarDays size={18} className="mr-2 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Date de début</p>
                        <p className="text-sm font-medium">{new Date(selectedJob.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <p className="text-gray-300 whitespace-pre-line">{selectedJob.description}</p>
                  </div>
                  
                  {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">Requis</h3>
                      <ul className="space-y-2">
                        {selectedJob.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle2 size={18} className="mr-2 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedJob.skills && selectedJob.skills.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Compétences</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skills.map((skill, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm ${
                              candidate.skills.includes(skill) 
                                ? 'bg-green-900 text-green-100' 
                                : 'bg-gray-700 text-gray-200'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-gray-400 mb-2">Sélectionnez une offre pour voir les détails</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-850 rounded-lg p-8 text-center">
            <p className="text-xl mb-2">Aucune correspondance trouvée</p>
            <p className="text-gray-400">Nous n'avons pas trouvé d'offres d'emploi correspondant au profil de compétences de ce candidat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingResults; 