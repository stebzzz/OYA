import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Star, Building } from 'lucide-react';
import MatchingResults from '../../components/matching/MatchingResults';
import { getWorkerById } from '../../services/workersService';
import { CandidateProfile } from '../../services/aiService';

const WorkerMatch: React.FC = () => {
  const { workerId } = useParams<{ workerId: string }>();
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);

  useEffect(() => {
    const fetchWorker = async () => {
      if (!workerId) return;
      
      setLoading(true);
      try {
        const workerData = await getWorkerById(workerId);
        setWorker(workerData);
        
        // Convertir les données du travailleur en profil de candidat
        const profile: CandidateProfile = {
          id: workerData.id,
          name: `${workerData.firstName} ${workerData.lastName}`,
          skills: workerData.skills || [],
          experience: workerData.experience || [],
          education: workerData.education || [],
          summary: workerData.summary || '',
          jobTitles: workerData.jobTitles || [],
          availableFrom: workerData.availableFrom || new Date(),
          preferredLocations: workerData.preferredLocations || [],
          sectorExperience: workerData.sectorExperience || []
        };
        
        setCandidateProfile(profile);
      } catch (error) {
        console.error('Erreur lors de la récupération du travailleur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorker();
  }, [workerId]);

  return (
    <div className="bg-gray-950 text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/dashboard/workers" className="flex items-center text-gray-400 hover:text-white mr-4 transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              Retour à la liste
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">
              Correspondances d'emploi
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : worker ? (
          <div className="space-y-6">
            {/* Profil du travailleur */}
            <div className="bg-gray-900 rounded-lg shadow-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  {worker.profilePicture ? (
                    <img 
                      src={worker.profilePicture} 
                      alt={`${worker.firstName} ${worker.lastName}`}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white">
                      {worker.firstName.charAt(0)}{worker.lastName.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{worker.firstName} {worker.lastName}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <FileText size={18} className="mr-2 text-blue-400" />
                      <span>{worker.jobTitles?.[0] || 'Non spécifié'}</span>
                    </div>
                    <div className="flex items-center">
                      <Star size={18} className="mr-2 text-yellow-400" />
                      <span>{worker.experience?.length || 0} expérience(s)</span>
                    </div>
                    <div className="flex items-center">
                      <Building size={18} className="mr-2 text-green-400" />
                      <span>{worker.preferredLocations?.[0] || 'Non spécifié'}</span>
                    </div>
                  </div>
                  
                  {worker.summary && (
                    <div className="mt-4 text-gray-300">
                      <p>{worker.summary}</p>
                    </div>
                  )}
                </div>
              </div>

              {worker.skills && worker.skills.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Compétences</h3>
                  <div className="flex flex-wrap gap-2">
                    {worker.skills.map((skill: string, index: number) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-blue-900 text-blue-100 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Résultats de correspondance */}
            {candidateProfile && (
              <MatchingResults candidate={candidateProfile} limit={20} />
            )}
          </div>
        ) : (
          <div className="bg-gray-900 p-8 rounded-lg text-center">
            <p className="text-xl mb-2">Travailleur non trouvé</p>
            <p className="text-gray-400 mb-4">Le travailleur demandé n'existe pas ou a été supprimé.</p>
            <Link
              to="/dashboard/workers"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-block transition-colors"
            >
              Retour à la liste des travailleurs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerMatch; 