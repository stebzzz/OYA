import React, { useState } from 'react';
import { Calendar, Clock, Users, Video, Building, ChevronDown, Check, X, Loader2, Send, Phone } from 'lucide-react';
import { Candidate } from '../../services/candidatesService';

interface InterviewSchedulerProps {
  candidate: Candidate;
  onScheduled: (date: Date, type: string) => void;
}

export const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({ candidate, onScheduled }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [interviewType, setInterviewType] = useState<'video' | 'inperson' | 'phone'>('video');
  const [participants, setParticipants] = useState<string[]>(['Responsable RH']);
  const [currentParticipant, setCurrentParticipant] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Dates disponibles (7 prochains jours ouvrables)
  const availableDates = Array(14).fill(0).map((_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() + idx + 1);
    return date;
  }).filter(date => date.getDay() !== 0 && date.getDay() !== 6); // Filtrer weekend

  // Créneaux horaires disponibles
  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  // Formater la date en français
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  // Ajouter un participant
  const addParticipant = () => {
    if (currentParticipant.trim() && !participants.includes(currentParticipant.trim())) {
      setParticipants([...participants, currentParticipant.trim()]);
      setCurrentParticipant('');
    }
  };

  // Supprimer un participant
  const removeParticipant = (participantToRemove: string) => {
    setParticipants(participants.filter(p => p !== participantToRemove));
  };

  // Gérer la planification de l'entretien
  const handleScheduleInterview = async () => {
    if (!selectedDate || !selectedTime) {
      return; // Validation
    }

    try {
      setLoading(true);

      // Créer la date et l'heure de l'entretien
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const interviewDate = new Date(selectedDate);
      interviewDate.setHours(hours, minutes, 0, 0);

      // Simuler l'envoi d'un email (à remplacer par un appel d'API réel)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mettre à jour l'interface
      setSuccess(true);
      onScheduled(interviewDate, interviewType);
    } catch (err) {
      console.error('Erreur lors de la planification:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Planifier un entretien</h3>
        {success && (
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium flex items-center">
            <Check className="h-3 w-3 mr-1" /> Entretien planifié
          </span>
        )}
      </div>

      {success ? (
        <div className="py-6 text-center">
          <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Check className="h-8 w-8 text-emerald-400" />
          </div>
          <h4 className="text-xl font-medium text-white mb-2">Entretien planifié !</h4>
          <p className="text-gray-400 mb-4">
            Un email de confirmation a été envoyé à {candidate.firstName} {candidate.lastName}.
          </p>
          <div className="bg-gray-700/50 p-4 rounded-lg max-w-md mx-auto">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-primary-400 mr-2" />
              <span className="text-white">{selectedDate && formatDate(selectedDate)}</span>
            </div>
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-primary-400 mr-2" />
              <span className="text-white">{selectedTime}</span>
            </div>
            <div className="flex items-center">
              {interviewType === 'video' && <Video className="h-5 w-5 text-primary-400 mr-2" />}
              {interviewType === 'inperson' && <Building className="h-5 w-5 text-primary-400 mr-2" />}
              {interviewType === 'phone' && <Phone className="h-5 w-5 text-primary-400 mr-2" />}
              <span className="text-white">
                {interviewType === 'video' ? 'Entretien vidéo' : 
                 interviewType === 'inperson' ? 'Entretien en personne' : 'Entretien téléphonique'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setSuccess(false)}
            className="mt-6 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Planifier un autre entretien
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Type d'entretien */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type d'entretien</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                className={`p-3 rounded-lg border ${
                  interviewType === 'video' 
                    ? 'bg-primary-500/20 border-primary-500/30 text-primary-300' 
                    : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700'
                } flex flex-col items-center justify-center`}
                onClick={() => setInterviewType('video')}
              >
                <Video className="h-5 w-5 mb-1" />
                <span className="text-sm">Vidéo</span>
              </button>
              <button
                className={`p-3 rounded-lg border ${
                  interviewType === 'inperson' 
                    ? 'bg-primary-500/20 border-primary-500/30 text-primary-300' 
                    : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700'
                } flex flex-col items-center justify-center`}
                onClick={() => setInterviewType('inperson')}
              >
                <Building className="h-5 w-5 mb-1" />
                <span className="text-sm">En personne</span>
              </button>
              <button
                className={`p-3 rounded-lg border ${
                  interviewType === 'phone' 
                    ? 'bg-primary-500/20 border-primary-500/30 text-primary-300' 
                    : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700'
                } flex flex-col items-center justify-center`}
                onClick={() => setInterviewType('phone')}
              >
                <Phone className="h-5 w-5 mb-1" />
                <span className="text-sm">Téléphone</span>
              </button>
            </div>
          </div>

          {/* Date de l'entretien */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableDates.slice(0, 4).map((date, index) => (
                <button
                  key={index}
                  className={`p-3 rounded-lg border ${
                    selectedDate && date.toDateString() === selectedDate.toDateString()
                      ? 'bg-primary-500/20 border-primary-500/30 text-primary-300' 
                      : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700'
                  } flex flex-col items-center justify-center`}
                  onClick={() => setSelectedDate(date)}
                >
                  <span className="text-xs uppercase mb-1">
                    {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                  </span>
                  <span className="text-lg font-medium">{date.getDate()}</span>
                  <span className="text-xs">
                    {date.toLocaleDateString('fr-FR', { month: 'short' })}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Heure de l'entretien */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Heure</label>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {availableTimes.map((time, index) => (
                  <button
                    key={index}
                    className={`py-2 px-3 rounded-lg border ${
                      selectedTime === time
                        ? 'bg-primary-500/20 border-primary-500/30 text-primary-300' 
                        : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700'
                    } text-center`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Participants</label>
            <div className="flex space-x-2 mb-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Nom du participant..."
                  className="pl-10 pr-3 py-2 w-full bg-gray-700 border border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-white"
                  value={currentParticipant}
                  onChange={(e) => setCurrentParticipant(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                />
              </div>
              <button
                onClick={addParticipant}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg border border-gray-600"
              >
                Ajouter
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-full flex items-center"
                >
                  <span className="text-gray-300 text-sm">{participant}</span>
                  <button
                    onClick={() => removeParticipant(participant)}
                    className="ml-2 text-gray-400 hover:text-gray-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bouton de planification */}
          <button
            onClick={handleScheduleInterview}
            disabled={!selectedDate || !selectedTime || loading}
            className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Envoyer l'invitation
              </>
            )}
          </button>

          <p className="text-sm text-gray-400 italic">
            Une invitation sera automatiquement envoyée à {candidate.firstName} {candidate.lastName} à l'adresse {candidate.email}
          </p>
        </div>
      )}
    </div>
  );
}; 