import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Video, 
  MapPin, 
  Save, 
  Plus, 
  Trash2, 
  Loader2, 
  AlertTriangle,
  User
} from 'lucide-react';
import { getCandidateById, Candidate } from '../../services/candidatesService';

export const CandidateInterview = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // État local pour le formulaire d'entretien
  const [interviewForm, setInterviewForm] = useState({
    date: '',
    time: '',
    duration: 60,
    type: 'remote', // 'remote' ou 'in-person'
    location: '',
    participants: '',
    notes: '',
  });

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

  // Gérer les changements dans le formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInterviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Enregistrer l'entretien
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSaving(true);
    
    // Simuler une requête API
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Ici, vous intégreriez l'API réelle pour enregistrer l'entretien
      
      alert('Entretien planifié avec succès!');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
    } finally {
      setSaving(false);
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
            <h1 className="text-3xl font-bold text-white">Planifier un entretien</h1>
            <p className="text-gray-400">
              {candidate.firstName} {candidate.lastName}
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Informations du candidat */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
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
                {candidate.skills.slice(0, 5).map((skill, index) => (
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
              <p className="text-sm text-gray-400 mb-1">Disponibilité</p>
              <p className="text-white">{candidate.availability || 'Non spécifiée'}</p>
            </div>
          </div>
        </div>
        
        {/* Formulaire d'entretien */}
        <div className="md:col-span-2 bg-gray-800/50 rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Détails de l'entretien</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-400 mb-1">
                  Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={interviewForm.date}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-400 mb-1">
                  Heure
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={interviewForm.time}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-400 mb-1">
                  Durée (minutes)
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={interviewForm.duration}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                  <option value={120}>120 minutes</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-400 mb-1">
                  Type d'entretien
                </label>
                <select
                  id="type"
                  name="type"
                  value={interviewForm.type}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="remote">Entretien à distance</option>
                  <option value="in-person">Entretien en personne</option>
                </select>
              </div>
              
              {interviewForm.type === 'in-person' && (
                <div className="md:col-span-2">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-400 mb-1">
                    Lieu
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={interviewForm.location}
                      onChange={handleInputChange}
                      placeholder="Adresse de l'entretien"
                      className="block w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
              )}
              
              <div className="md:col-span-2">
                <label htmlFor="participants" className="block text-sm font-medium text-gray-400 mb-1">
                  Participants (séparés par des virgules)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="participants"
                    name="participants"
                    value={interviewForm.participants}
                    onChange={handleInputChange}
                    placeholder="Ex: Marie Dupont, Jean Martin"
                    className="block w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-400 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={interviewForm.notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Informations complémentaires, sujets à aborder..."
                  className="block w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    <span>Planifier l'entretien</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Section entretiens précédents */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Entretiens précédents</h3>
        </div>
        
        <div className="text-center py-8 text-gray-400">
          <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-600" />
          <p>Aucun entretien précédent</p>
        </div>
      </div>
    </div>
  );
}; 