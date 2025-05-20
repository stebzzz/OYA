import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, DollarSign, TrendingUp, Briefcase, BarChart2, Target, Loader2, Award, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCandidateById, Candidate, estimateCandidateValue } from '../../services/candidatesService';

export const CandidateValue = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [estimating, setEstimating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valueEstimation, setValueEstimation] = useState<{
    min: number;
    max: number;
    currency: string;
    marketAnalysis: string;
  } | null>(null);

  // Charger les données du candidat
  useEffect(() => {
    const loadCandidate = async () => {
      if (!id) {
        setError('ID du candidat non spécifié');
        setLoading(false);
        return;
      }

      try {
        const data = await getCandidateById(id);
        if (data) {
          setCandidate(data);
        } else {
          setError('Candidat non trouvé');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadCandidate();
  }, [id]);

  // Estimer la valeur du candidat
  const handleEstimateValue = async () => {
    if (!candidate) return;

    try {
      setEstimating(true);
      const estimation = await estimateCandidateValue(candidate);
      setValueEstimation(estimation);
    } catch (err) {
      console.error('Erreur lors de l\'estimation:', err);
      setError('Erreur lors de l\'estimation de la valeur salariale');
    } finally {
      setEstimating(false);
    }
  };

  // Formater un montant avec séparateur de milliers
  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency,
      maximumFractionDigits: 0 
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="bg-red-500/10 border border-red-400/20 p-6 rounded-xl text-red-300 flex flex-col items-center justify-center">
        <p className="text-lg">{error || 'Candidat introuvable'}</p>
        <Link 
          to="/dashboard/candidates" 
          className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Retour à la liste</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link 
            to={`/dashboard/candidates/${id}`}
            className="mr-4 p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Estimation Salariale</h1>
            <p className="text-gray-400">
              {candidate.firstName} {candidate.lastName}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleEstimateValue}
          disabled={estimating}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center disabled:opacity-50"
        >
          {estimating ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              <span>Analyse en cours...</span>
            </>
          ) : valueEstimation ? (
            <>
              <BarChart2 className="h-5 w-5 mr-2" />
              <span>Actualiser l'estimation</span>
            </>
          ) : (
            <>
              <Target className="h-5 w-5 mr-2" />
              <span>Estimer la valeur</span>
            </>
          )}
        </button>
      </div>

      {/* Informations du candidat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-gray-800/50 rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Profil du candidat</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-primary-700/30 flex items-center justify-center text-primary-300 mr-4">
                {candidate.avatar ? (
                  <img className="h-12 w-12 rounded-full" src={candidate.avatar} alt="" />
                ) : (
                  <User className="h-6 w-6" />
                )}
              </div>
              <div>
                <h4 className="text-white font-medium">{candidate.firstName} {candidate.lastName}</h4>
                <p className="text-gray-400 text-sm">{candidate.email}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-400 mb-1">Compétences clés</p>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary-500/10 text-primary-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-400 mb-1">Expérience</p>
              <ul className="space-y-2 text-gray-300">
                {candidate.cvAnalysis?.experience?.slice(0, 3).map((exp, index) => (
                  <li key={index} className="text-sm">• {exp}</li>
                )) || <li className="text-sm text-gray-500">Aucune expérience disponible</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* Estimation de la valeur */}
        <div className="lg:col-span-2 bg-gray-800/50 rounded-xl border border-gray-700 p-6">
          {valueEstimation ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Valeur sur le marché</h3>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                  Analyse IA
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-grow p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                  <p className="text-gray-400 text-sm mb-1">Fourchette salariale estimée</p>
                  <div className="flex items-center text-white font-bold text-2xl">
                    <DollarSign className="h-6 w-6 text-primary-400 mr-2" />
                    <span>
                      {formatCurrency(valueEstimation.min)} - {formatCurrency(valueEstimation.max)}
                    </span>
                  </div>
                  <div className="mt-1 text-gray-400 text-sm">Salaire annuel brut</div>
                </div>

                <div className="flex-grow p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                  <p className="text-gray-400 text-sm mb-1">Positionnement marché</p>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-600 rounded-full h-2.5">
                      <div 
                        className="bg-primary-600 h-2.5 rounded-full" 
                        style={{ width: '65%' }}
                      ></div>
                    </div>
                    <span className="ml-2 text-primary-400 font-semibold">65%</span>
                  </div>
                  <div className="mt-1 text-gray-400 text-sm">Par rapport aux profils similaires</div>
                </div>
              </div>
              
              <div className="p-5 bg-gray-700/30 rounded-xl border border-gray-700">
                <h4 className="text-white font-medium mb-2 flex items-center">
                  <TrendingUp className="h-5 w-5 text-primary-400 mr-2" /> 
                  Analyse du marché
                </h4>
                <p className="text-gray-300">
                  {valueEstimation.marketAnalysis}
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <Award className="h-5 w-5 text-primary-400 mr-2" /> 
                  Atouts valorisés
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-500/20 flex items-center justify-center mr-3">
                      <Briefcase className="h-4 w-4 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Expérience pertinente</p>
                      <p className="text-gray-400 text-xs">+15% sur la valeur salariale</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
                      <Target className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Compétences techniques</p>
                      <p className="text-gray-400 text-xs">+12% sur la valeur salariale</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center px-6">
              <DollarSign className="h-12 w-12 text-gray-500 mb-4" />
              <h3 className="text-white text-xl font-medium mb-2">Estimation salariale</h3>
              <p className="text-gray-400 mb-6">
                Cliquez sur "Estimer la valeur" pour analyser le profil du candidat et calculer sa valeur sur le marché.
              </p>
              <button
                onClick={handleEstimateValue}
                disabled={estimating}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center disabled:opacity-50"
              >
                {estimating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    <span>Analyse en cours...</span>
                  </>
                ) : (
                  <>
                    <Target className="h-5 w-5 mr-2" />
                    <span>Estimer la valeur</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 