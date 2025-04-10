import React, { useState, useEffect } from 'react';
import { Loader2, Search, FileDown, Info, Briefcase, MapPin, Clock, CreditCard, AlertCircle, CheckCircle, BarChart2 } from 'lucide-react';
import { JobMatch, findJobMatches } from '../../services/matchingService';

interface WorkerMatchingProps {
  workerId: string;
  workerName: string;
}

const WorkerMatching: React.FC<WorkerMatchingProps> = ({ workerId, workerName }) => {
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<JobMatch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [minimumScore, setMinimumScore] = useState<number>(0);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const jobMatches = await findJobMatches(workerId);
        setMatches(jobMatches);
        setFilteredMatches(jobMatches);
      } catch (err) {
        setError("Erreur lors du chargement des correspondances d'emploi");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMatches();
  }, [workerId]);

  // Filtrer les correspondances lorsque les critères de filtrage changent
  useEffect(() => {
    const filtered = matches.filter(match => {
      const searchTermMatch = 
        match.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.job.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const scoreMatch = match.matchScore >= minimumScore;
      
      return searchTermMatch && scoreMatch;
    });
    
    setFilteredMatches(filtered);
  }, [searchTerm, minimumScore, matches]);

  // Exporter les correspondances au format CSV
  const exportToCSV = () => {
    // Créer les en-têtes
    const headers = ["Titre du poste", "Entreprise", "Lieu", "Score", "Compétences correspondantes", "Compétences manquantes", "Salaire", "Type de contrat", "Date de publication"];
    
    // Créer les lignes de données
    const rows = filteredMatches.map(match => [
      match.job.title,
      match.job.company.name,
      match.job.location,
      `${match.matchScore}%`,
      match.matchedSkills.join(", "),
      match.missingSkills.join(", "),
      `${match.job.salary.min} - ${match.job.salary.max} €`,
      match.job.type,
      new Date(match.job.postedAt).toLocaleDateString('fr-FR')
    ]);
    
    // Combiner les en-têtes et les lignes
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Créer un blob et un lien de téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `correspondances_${workerName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-slate-600 dark:text-slate-400">Recherche des correspondances d'emploi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Correspondances d'emploi pour {workerName}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {filteredMatches.length} offre(s) d'emploi correspondant au profil
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher par titre, entreprise, lieu..."
            className="pl-10 w-full h-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="min-score" className="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
            Score minimum :
          </label>
          <input
            id="min-score"
            type="range"
            min="0"
            max="100"
            step="5"
            value={minimumScore}
            onChange={(e) => setMinimumScore(parseInt(e.target.value))}
            className="w-32 h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm font-medium text-slate-900 dark:text-white w-10 text-center">
            {minimumScore}%
          </span>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <FileDown className="h-5 w-5 mr-2" />
          Exporter
        </button>
      </div>

      {/* Liste des correspondances */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-10">
          <Info className="h-12 w-12 mx-auto text-slate-400" />
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Aucune correspondance trouvée avec ces critères de filtrage.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMatches.map((match) => (
            <div 
              key={match.job.id} 
              className="bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 p-5 relative"
            >
              {/* Badge de score */}
              <div 
                className={`absolute top-5 right-5 px-3 py-1 rounded-full flex items-center ${
                  match.matchScore >= 80 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                    : match.matchScore >= 50 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                }`}
              >
                <BarChart2 className="h-4 w-4 mr-1" />
                <span className="font-medium">{match.matchScore}%</span>
              </div>

              {/* Informations sur l'emploi */}
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 pr-16">
                {match.job.title}
              </h3>
              <div className="flex items-center text-slate-600 dark:text-slate-400 mb-2">
                <Briefcase className="h-4 w-4 mr-2" />
                <span>{match.job.company.name}</span>
              </div>
              <div className="flex items-center text-slate-600 dark:text-slate-400 mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{match.job.location}</span>
              </div>

              {/* Détails du poste */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span>{match.job.salary.min} - {match.job.salary.max} €</span>
                </div>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{match.job.type}</span>
                </div>
              </div>

              {/* Compétences */}
              <div className="mb-3">
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  Compétences correspondantes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {match.matchedSkills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {match.matchedSkills.length === 0 && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                      Aucune compétence correspondante
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
                  Compétences manquantes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {match.missingSkills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {match.missingSkills.length === 0 && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                      Toutes les compétences requises sont présentes
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                Publié le {new Date(match.job.postedAt).toLocaleDateString('fr-FR')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkerMatching; 