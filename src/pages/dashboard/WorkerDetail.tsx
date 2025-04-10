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
  Clock
} from 'lucide-react';
import { getWorkerById, Worker, deleteWorker } from '../../services/workersService';

export const WorkerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadWorker = async () => {
      if (!id) {
        setError('ID de l\'intérimaire non spécifié');
        setLoading(false);
        return;
      }

      try {
        const data = await getWorkerById(id);
        if (data) {
          setWorker(data);
        } else {
          setError('Intérimaire non trouvé');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadWorker();
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

  // Fonction pour supprimer l'intérimaire
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      await deleteWorker(id);
      navigate('/dashboard/workers');
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression de l\'intérimaire');
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

  if (error || !worker) {
    return (
      <div className="bg-red-500/10 border border-red-400/20 p-6 rounded-xl text-red-300 flex flex-col items-center justify-center">
        <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
        <p className="text-lg">{error || 'Intérimaire introuvable'}</p>
        <Link 
          to="/dashboard/workers" 
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
    active: { bg: 'bg-emerald-400/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    busy: { bg: 'bg-amber-400/10', text: 'text-amber-400', dot: 'bg-amber-400' },
    inactive: { bg: 'bg-gray-400/10', text: 'text-gray-400', dot: 'bg-gray-400' }
  };
  
  const statusColor = statusColors[worker.status];
  const statusText = worker.status === 'active' ? 'Disponible' : 
                      worker.status === 'busy' ? 'En mission' : 'Inactif';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <Link 
            to="/dashboard/workers"
            className="mr-4 p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">{worker.firstName} {worker.lastName}</h1>
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
            to={`/dashboard/workers/edit/${id}`}
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
                  <p className="text-white">{worker.firstName} {worker.lastName}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Email</p>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-primary-400 mr-2" />
                  <a href={`mailto:${worker.email}`} className="text-white hover:text-primary-400 transition-colors">
                    {worker.email}
                  </a>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Téléphone</p>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-primary-400 mr-2" />
                  <a href={`tel:${worker.phone}`} className="text-white hover:text-primary-400 transition-colors">
                    {worker.phone}
                  </a>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Date de naissance</p>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary-400 mr-2" />
                  <p className="text-white">{formatDate(worker.birthDate as Date | null)}</p>
                </div>
              </div>
              
              {worker.address && (
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm text-gray-400">Adresse</p>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary-400 mr-2 mt-0.5" />
                    <p className="text-white">{worker.address}</p>
                  </div>
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-bold text-white mt-10 mb-6 border-b border-gray-700 pb-2">
              Compétences
            </h2>
            
            <div className="flex flex-wrap gap-2">
              {worker.skills && worker.skills.length > 0 ? (
                worker.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-primary-500/20 text-primary-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-400">Aucune compétence spécifiée</p>
              )}
            </div>
            
            {worker.cvAnalysis && (
              <>
                <h2 className="text-xl font-bold text-white mt-10 mb-6 border-b border-gray-700 pb-2">
                  Analyse du CV
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-semibold text-white mb-3">Résumé</h3>
                    <p className="text-gray-300">{worker.cvAnalysis.summary}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-semibold text-white mb-3">Expérience professionnelle</h3>
                    <ul className="space-y-2 text-gray-300">
                      {worker.cvAnalysis.experience.map((exp, idx) => (
                        <li key={idx} className="flex items-start">
                          <Briefcase className="h-5 w-5 text-primary-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{exp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-semibold text-white mb-3">Formation</h3>
                    <ul className="space-y-2 text-gray-300">
                      {worker.cvAnalysis.education.map((edu, idx) => (
                        <li key={idx} className="flex items-start">
                          <FileText className="h-5 w-5 text-primary-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-semibold text-white mb-3">Postes recommandés</h3>
                    <div className="flex flex-wrap gap-2">
                      {worker.cvAnalysis.recommendedJobs.map((job, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-full text-sm"
                        >
                          {job}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Panneau latéral */}
        <div className="space-y-6">
          {/* CV */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
                CV
              </h2>
              
              {worker.cvUrl ? (
                <div>
                  <div className="rounded-lg overflow-hidden bg-gray-900 mb-4">
                    <iframe 
                      src={worker.cvUrl} 
                      className="w-full h-48 pointer-events-none" 
                      title="CV Preview"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <a
                      href={worker.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      <span>Voir</span>
                    </a>
                    
                    <a
                      href={worker.cvUrl}
                      download
                      className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      <span>Télécharger</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 px-4 border-2 border-dashed border-gray-700 rounded-lg">
                  <FileText className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400">Aucun CV disponible</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Disponibilité / Missions */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
                Statut actuel
              </h2>
              
              <div className="flex items-center mb-4">
                <div className={`w-4 h-4 ${statusColor.dot} rounded-full mr-2`}></div>
                <span className={`font-medium ${statusColor.text}`}>{statusText}</span>
              </div>
              
              {worker.status === 'busy' && (
                <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
                  <div className="flex items-start space-x-3">
                    <div className="bg-amber-500/20 p-2 rounded-lg">
                      <Briefcase className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Mission actuelle</h3>
                      <p className="text-sm text-gray-400 mt-1">Électricien - BTP Solutions</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>Jusqu'au 15 décembre 2023</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Confirmer la suppression</h3>
            <p className="text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer l'intérimaire {worker.firstName} {worker.lastName} ? Cette action est irréversible.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
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