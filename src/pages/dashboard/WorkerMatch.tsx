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
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/dashboard/workers" className="flex items-center text-gray-400 hover:text-white mr-4 transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              Retour au CRM des talents
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">
              IA Matching Stratégique
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
                  <h3 className="text-lg font-semibold mb-2">Compétences analysées par IA</h3>
                  <p className="text-sm text-gray-400 mb-3">Compétences identifiées et évaluées automatiquement par notre moteur d'IA</p>
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
            
            {/* Analyse IA et Matching Stratégique */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Analyse IA Stratégique</h3>
              <p className="text-gray-300">OYA centralise et analyse automatiquement les données de ce profil pour identifier les meilleures opportunités professionnelles, sans intermédiaires coûteux.</p>
            </div>
            
            {/* Résultats de correspondance */}
            {candidateProfile && (
              <>
                <div className="bg-blue-900/30 p-4 rounded-lg mb-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a8 8 0 0 1 8 8v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a8 8 0 0 1 8-8z"></path><path d="M9 22v-4h6v4"></path><path d="M15 22V10a3 3 0 0 0-6 0v12"></path></svg>
                    </div>
                    <h3 className="text-lg font-semibold">Plateforme IA RH Intelligente</h3>
                  </div>
                  <p className="text-gray-300 pl-11">Notre moteur d'IA analyse en temps réel les compétences, l'expérience et les préférences pour identifier les meilleures correspondances sur le marché.</p>
                </div>
                <MatchingResults candidate={candidateProfile} limit={20} />
              </>
            )}
          </div>
        ) : (
          <div className="bg-gray-900 p-8 rounded-lg text-center">
            <p className="text-xl mb-2">Profil non trouvé</p>
            <p className="text-gray-400 mb-4">La plateforme IA OYA n'a pas pu localiser ce profil dans la base de données centralisée.</p>
            <Link
              to="/dashboard/workers"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-block transition-colors"
            >
              Retour au CRM des talents
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerMatch;