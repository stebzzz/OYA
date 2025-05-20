import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Briefcase,
  FileText, 
  Download, 
  Edit, 
  Trash2, 
  ArrowLeft,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Clock,
  DollarSign,
  Calendar as CalendarIcon
} from 'lucide-react';
import { getCandidateById, Candidate, deleteCandidate } from '../../services/candidatesService';

export const CandidateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Fonction pour formater la date
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'Non spécifiée';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Fonction pour supprimer le candidat
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      await deleteCandidate(id);
      navigate('/dashboard/candidates');
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression du candidat');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
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
        <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
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

  // Déterminer les couleurs de statut
  const statusColors = {
    available: { bg: 'bg-emerald-400/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    interviewing: { bg: 'bg-amber-400/10', text: 'text-amber-400', dot: 'bg-amber-400' },
    hired: { bg: 'bg-blue-400/10', text: 'text-blue-400', dot: 'bg-blue-400' },
    inactive: { bg: 'bg-gray-400/10', text: 'text-gray-400', dot: 'bg-gray-400' }
  };
  
  const statusColor = statusColors[candidate.status];
  const statusText = candidate.status === 'available' ? 'Disponible' : 
                    candidate.status === 'interviewing' ? 'En entretien' :
                    candidate.status === 'hired' ? 'Recruté' : 'Inactif';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <Link 
            to="/dashboard/candidates"
            className="mr-4 p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">{candidate.firstName} {candidate.lastName}</h1>
            <div className="flex items-center mt-1 text-gray-400">
              <div className={`flex items-center ${statusColor.bg} ${statusColor.text} px-2.5 py-1 rounded-full text-xs font-medium`}>
                <div className={`w-2 h-2 ${statusColor.dot} rounded-full mr-2`}></div>
                {statusText}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Link
            to={`/dashboard/candidates/${id}/interview`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>Planifier un entretien</span>
          </Link>
        
          <Link
            to={`/dashboard/candidates/${id}/value`}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            <span>Estimer la valeur</span>
          </Link>
        
          <Link
            to={`/dashboard/candidates/edit/${id}`}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            <span>Modifier</span>
          </Link>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span>Supprimer</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Informations de base */}
        <div className="xl:col-span-2 bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
              Informations personnelles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Nom complet</p>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-primary-400 mr-2" />
                  <p className="text-white">{candidate.firstName} {candidate.lastName}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Email</p>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-primary-400 mr-2" />
                  <a href={`mailto:${candidate.email}`} className="text-white hover:text-primary-400 transition-colors">
                    {candidate.email}
                  </a>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Téléphone</p>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-primary-400 mr-2" />
                  <a href={`tel:${candidate.phone}`} className="text-white hover:text-primary-400 transition-colors">
                    {candidate.phone}
                  </a>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Date de naissance</p>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary-400 mr-2" />
                  <p className="text-white">{formatDate(candidate.birthDate as Date | null)}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Adresse</p>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-primary-400 mr-2" />
                  <p className="text-white">{candidate.address || 'Non spécifiée'}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Disponibilité</p>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary-400 mr-2" />
                  <p className="text-white">{candidate.availability}</p>
                </div>
              </div>
              
              {candidate.linkedinProfile && (
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">LinkedIn</p>
                  <div className="flex items-center">
                    <ExternalLink className="h-5 w-5 text-primary-400 mr-2" />
                    <a 
                      href={candidate.linkedinProfile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white hover:text-primary-400 transition-colors"
                    >
                      Voir profil LinkedIn
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* CV et Documents */}
        <div className="xl:col-span-1 bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-700">
              CV et Documents
            </h2>
            
            {candidate.cvUrl ? (
              <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                <div className="flex items-center mb-3">
                  <FileText className="h-6 w-6 text-primary-400 mr-2" />
                  <span className="text-white font-medium">CV</span>
                </div>
                
                <a 
                  href={candidate.cvUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-primary-600/20 hover:bg-primary-600/30 rounded-lg text-primary-400 transition-colors w-full mt-2"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span>Télécharger le CV</span>
                </a>
              </div>
            ) : (
              <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-700 text-center">
                <FileText className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400">Aucun CV disponible</p>
              </div>
            )}
            
            {/* Bouton d'upload */}
            <label className="flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors cursor-pointer mt-4">
              <Upload className="h-4 w-4 mr-2" />
              <span>Ajouter un document</span>
              <input type="file" className="hidden" />
            </label>
          </div>
        </div>
      </div>
      
      {/* Compétences et expérience */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
              Profil professionnel
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Briefcase className="h-5 w-5 text-primary-400 mr-2" />
                  Compétences
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Calendar className="h-5 w-5 text-primary-400 mr-2" />
                  Expérience
                </h3>
                
                {candidate.cvAnalysis?.experience && candidate.cvAnalysis.experience.length > 0 ? (
                  <ul className="space-y-2 text-gray-300">
                    {candidate.cvAnalysis.experience.map((exp, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-primary-400 mt-1.5 mr-2 flex-shrink-0"></div>
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 italic">Aucune expérience disponible</p>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-white font-semibold mb-3">Formation</h3>
              
              {candidate.cvAnalysis?.education && candidate.cvAnalysis.education.length > 0 ? (
                <ul className="space-y-2 text-gray-300">
                  {candidate.cvAnalysis.education.map((edu, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-primary-400 mt-1.5 mr-2 flex-shrink-0"></div>
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic">Aucune formation disponible</p>
              )}
            </div>
            
            {candidate.cvAnalysis?.summary && (
              <div className="mt-6 bg-gray-700/30 p-4 rounded-xl border border-gray-700">
                <h3 className="text-white font-semibold mb-2">Résumé</h3>
                <p className="text-gray-300">
                  {candidate.cvAnalysis.summary}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="xl:col-span-1 space-y-6">
          {/* Postes recommandés */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-700">
                Postes recommandés
              </h2>
              
              {candidate.cvAnalysis?.recommendedJobs && candidate.cvAnalysis.recommendedJobs.length > 0 ? (
                <ul className="space-y-3">
                  {candidate.cvAnalysis.recommendedJobs.map((job, index) => (
                    <li key={index} className="bg-gray-700/30 p-3 rounded-lg border border-gray-700">
                      <p className="text-white font-medium">{job}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-400 text-sm">Score de compatibilité</span>
                        <span className="text-primary-400 font-semibold">{90 - index * 7}%</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic">Aucun poste recommandé</p>
              )}
            </div>
          </div>
          
          {/* Estimation de valeur */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-700">
                Estimation de valeur
              </h2>
              
              {candidate.cvAnalysis?.marketValue ? (
                <div>
                  <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-700">
                    <p className="text-gray-400 text-sm mb-1">Fourchette salariale estimée</p>
                    <div className="flex items-center text-white font-bold text-xl">
                      <DollarSign className="h-5 w-5 text-primary-400 mr-1" />
                      <span>
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: candidate.cvAnalysis.marketValue.currency,
                          maximumFractionDigits: 0
                        }).format(candidate.cvAnalysis.marketValue.min)} - 
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: candidate.cvAnalysis.marketValue.currency,
                          maximumFractionDigits: 0
                        }).format(candidate.cvAnalysis.marketValue.max)}
                      </span>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/dashboard/candidates/${id}/value`}
                    className="flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors mt-4"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>Analyse détaillée</span>
                  </Link>
                </div>
              ) : (
                <div className="text-center">
                  <DollarSign className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 mb-4">Aucune estimation disponible</p>
                  
                  <Link 
                    to={`/dashboard/candidates/${id}/value`}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>Estimer la valeur</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-white mb-4">Confirmer la suppression</h3>
            
            <p className="text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer le profil de {candidate.firstName} {candidate.lastName} ? Cette action est irréversible.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                disabled={isDeleting}
              >
                Annuler
              </button>
              
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Suppression...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span>Supprimer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 