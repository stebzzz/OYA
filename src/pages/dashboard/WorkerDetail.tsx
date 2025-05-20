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
  Brain,
  Star
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
        setError('ID du candidat non spécifié');
        setLoading(false);
        return;
      }

      try {
        const data = await getWorkerById(id);
        if (data) {
          setWorker(data);
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

  // Fonction pour supprimer le candidat
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      await deleteWorker(id);
      navigate('/dashboard/workers');
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

  if (error || !worker) {
    return (
      <div className="bg-primary-500/10 border border-primary-400/20 p-6 rounded-xl text-primary-300 flex flex-col items-center justify-center">
        <AlertTriangle className="h-12 w-12 text-primary-400 mb-4" />
        <p className="text-lg">{error || 'Candidat introuvable'}</p>
        <Link 
          to="/dashboard/workers" 
          className="mt-4 px-4 py-2 bg-dark hover:bg-dark/80 rounded-lg flex items-center text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Retour à la liste</span>
        </Link>
      </div>
    );
  }

  // Déterminer les couleurs de statut
  const statusColors = {
    active: { bg: 'bg-emerald-400/10', text: 'text-emerald-600', dot: 'bg-emerald-400' },
    busy: { bg: 'bg-primary-500/10', text: 'text-primary-500', dot: 'bg-primary-500' },
    inactive: { bg: 'bg-dark/10', text: 'text-dark/60', dot: 'bg-dark/40' }
  };
  
  const statusColor = statusColors[worker.status];
  const statusText = worker.status === 'active' ? 'Disponible' : 
                      worker.status === 'busy' ? 'En entretien' : 'Inactif';

  return (
    <div className="space-y-6 animate-fade-in bg-light text-dark p-6 rounded-xl">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <Link 
            to="/dashboard/workers"
            className="mr-4 p-2 rounded-lg hover:bg-dark/5 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-dark/60" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-dark">{worker.firstName} {worker.lastName}</h1>
            <div className="flex items-center mt-1 text-dark/60">
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
            className="px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg transition-colors flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            <span>Modifier</span>
          </Link>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-600 rounded-lg transition-colors flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span>Supprimer</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Informations de base */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-dark/10 overflow-hidden shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-dark mb-6 border-b border-dark/10 pb-2">
              Informations personnelles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
              <div className="space-y-1">
                <p className="text-sm text-dark/60">Nom complet</p>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-primary-500 mr-2" />
                  <p className="text-dark">{worker.firstName} {worker.lastName}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-dark/60">Email</p>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-primary-500 mr-2" />
                  <a href={`mailto:${worker.email}`} className="text-dark hover:text-primary-500 transition-colors">
                    {worker.email}
                  </a>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-dark/60">Téléphone</p>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-primary-500 mr-2" />
                  <a href={`tel:${worker.phone}`} className="text-dark hover:text-primary-500 transition-colors">
                    {worker.phone}
                  </a>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-dark/60">Date de naissance</p>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary-500 mr-2" />
                  <p className="text-dark">{formatDate(worker.birthDate as Date | null)}</p>
                </div>
              </div>
              
              {worker.address && (
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm text-dark/60">Adresse</p>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
                    <p className="text-dark">{worker.address}</p>
                  </div>
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-bold text-dark mt-10 mb-6 border-b border-dark/10 pb-2">
              Compétences
            </h2>
            
            <div className="flex flex-wrap gap-2">
              {worker.skills && worker.skills.length > 0 ? (
                worker.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-secondary-500/20 text-secondary-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-dark/60">Aucune compétence spécifiée</p>
              )}
            </div>
            
            {worker.cvAnalysis && (
              <>
                <h2 className="text-xl font-bold text-dark mt-10 mb-6 border-b border-dark/10 pb-2">
                  Analyse du CV par IA
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-semibold text-dark mb-3 flex items-center">
                      <Brain className="h-5 w-5 text-secondary-500 mr-2" />
                      Résumé
                    </h3>
                    <p className="text-dark/80">{worker.cvAnalysis.summary}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-semibold text-dark mb-3 flex items-center">
                      <Briefcase className="h-5 w-5 text-secondary-500 mr-2" />
                      Expérience professionnelle
                    </h3>
                    <ul className="space-y-2 text-dark/80">
                      {worker.cvAnalysis.experience.map((exp, idx) => (
                        <li key={idx} className="flex items-start">
                          <Star className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{exp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-semibold text-dark mb-3 flex items-center">
                      <FileText className="h-5 w-5 text-secondary-500 mr-2" />
                      Formation
                    </h3>
                    <ul className="space-y-2 text-dark/80">
                      {worker.cvAnalysis.education.map((edu, idx) => (
                        <li key={idx} className="flex items-start">
                          <Star className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-semibold text-dark mb-3 flex items-center">
                      <Brain className="h-5 w-5 text-secondary-500 mr-2" />
                      Postes recommandés
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {worker.cvAnalysis.recommendedJobs.map((job, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-primary-500/20 text-primary-700 rounded-full text-sm"
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
          <div className="bg-white rounded-xl border border-dark/10 overflow-hidden shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold text-dark mb-6 border-b border-dark/10 pb-2">
                CV
              </h2>
              
              {worker.cvUrl ? (
                <div>
                  <div className="rounded-lg overflow-hidden bg-light mb-4">
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
                      className="flex-1 px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      <span>Voir</span>
                    </a>
                    
                    <a
                      href={worker.cvUrl}
                      download
                      className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      <span>Télécharger</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 px-4 border-2 border-dashed border-dark/10 rounded-lg">
                  <FileText className="h-10 w-10 text-dark/40 mx-auto mb-2" />
                  <p className="text-dark/60">Aucun CV disponible</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Disponibilité / Entretiens */}
          <div className="bg-white rounded-xl border border-dark/10 overflow-hidden shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold text-dark mb-6 border-b border-dark/10 pb-2">
                Statut actuel
              </h2>
              
              <div className="flex items-center mb-4">
                <div className={`w-4 h-4 ${statusColor.dot} rounded-full mr-2`}></div>
                <span className={`font-medium ${statusColor.text}`}>{statusText}</span>
              </div>
              
              {worker.status === 'busy' && (
                <div className="p-4 rounded-lg bg-light border border-dark/10">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary-500/20 p-2 rounded-lg">
                      <Calendar className="h-6 w-6 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-dark">Entretien programmé</h3>
                      <p className="text-sm text-dark/60 mt-1">Développeur Full-Stack - Tech Solutions</p>
                      <div className="flex items-center mt-2 text-xs text-dark/50">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>15 décembre 2023 à 14h30</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Score de matching */}
          <div className="bg-white rounded-xl border border-dark/10 overflow-hidden shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold text-dark mb-6 border-b border-dark/10 pb-2">
                Matching IA
              </h2>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-primary-500/10 text-primary-600 text-2xl font-bold mb-2">
                  92%
                </div>
                <p className="text-dark/70 text-sm">Score de compatibilité avec le poste</p>
                <button className="mt-4 px-4 py-2 w-full bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg transition-colors flex items-center justify-center">
                  <Brain className="h-4 w-4 mr-2" />
                  <span>Détails du matching</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-dark/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-dark mb-4">Confirmer la suppression</h3>
            <p className="text-dark/80 mb-6">
              Êtes-vous sûr de vouloir supprimer le candidat {worker.firstName} {worker.lastName} ? Cette action est irréversible.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-dark/10 hover:bg-dark/20 text-dark rounded-lg transition-colors"
                disabled={isDeleting}
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center"
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