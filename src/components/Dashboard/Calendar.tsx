import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, User, MapPin, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCandidates } from '../../hooks/useCandidates';

interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  position: string;
  date: Date;
  time: string;
  duration: number;
  type: 'phone' | 'video' | 'onsite';
  location?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
}

const Calendar: React.FC = () => {
  const { candidates } = useCandidates();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNewInterview, setShowNewInterview] = useState(false);

  // Simulation d'entretiens pour la démo
  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: '1',
      candidateId: 'demo1',
      candidateName: 'Marie Dubois',
      candidateEmail: 'marie.dubois@email.com',
      candidatePhone: '06 12 34 56 78',
      position: 'Développeur Full-Stack',
      date: new Date(2024, 11, 15, 14, 30),
      time: '14:30',
      duration: 60,
      type: 'video',
      notes: 'Entretien technique avec l\'équipe dev',
      status: 'scheduled'
    },
    {
      id: '2',
      candidateId: 'demo2',
      candidateName: 'Thomas Martin',
      candidateEmail: 'thomas.martin@email.com',
      candidatePhone: '06 98 76 54 32',
      position: 'Lead Developer',
      date: new Date(2024, 11, 16, 10, 0),
      time: '10:00',
      duration: 90,
      type: 'onsite',
      location: 'Bureau Paris',
      notes: 'Entretien final avec la direction',
      status: 'scheduled'
    },
    {
      id: '3',
      candidateId: 'demo3',
      candidateName: 'Sarah Johnson',
      candidateEmail: 'sarah.johnson@email.com',
      candidatePhone: '06 11 22 33 44',
      position: 'Product Manager',
      date: new Date(2024, 11, 17, 15, 0),
      time: '15:00',
      duration: 45,
      type: 'phone',
      notes: 'Premier contact téléphonique',
      status: 'scheduled'
    }
  ]);

  const [newInterview, setNewInterview] = useState({
    candidateId: '',
    date: '',
    time: '',
    duration: 60,
    type: 'video' as const,
    location: '',
    notes: ''
  });

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Jours du mois précédent
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false });
    }
    
    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Compléter la grille avec les jours du mois suivant
    const remainingCells = 42 - days.length; // 6 semaines × 7 jours
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false });
    }
    
    return days;
  };

  const getInterviewsForDate = (date: Date) => {
    return interviews.filter(interview => 
      interview.date.toDateString() === date.toDateString()
    );
  };

  const getTodayInterviews = () => {
    const today = new Date();
    return getInterviewsForDate(today);
  };

  const getUpcomingInterviews = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return interviews.filter(interview => 
      interview.date >= today && interview.date <= nextWeek && interview.status === 'scheduled'
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const handleCreateInterview = () => {
    if (!newInterview.candidateId || !newInterview.date || !newInterview.time) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const candidate = candidates.find(c => c.id === newInterview.candidateId);
    if (!candidate) return;

    const [hours, minutes] = newInterview.time.split(':').map(Number);
    const interviewDate = new Date(newInterview.date);
    interviewDate.setHours(hours, minutes);

    const interview: Interview = {
      id: Date.now().toString(),
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      candidatePhone: candidate.phone || '',
      position: candidate.position,
      date: interviewDate,
      time: newInterview.time,
      duration: newInterview.duration,
      type: newInterview.type,
      location: newInterview.location,
      notes: newInterview.notes,
      status: 'scheduled'
    };

    setInterviews([...interviews, interview]);
    setShowNewInterview(false);
    setNewInterview({
      candidateId: '',
      date: '',
      time: '',
      duration: 60,
      type: 'video',
      location: '',
      notes: ''
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'phone': return <Phone size={16} className="text-blue-500" />;
      case 'video': return <CalendarIcon size={16} className="text-green-500" />;
      case 'onsite': return <MapPin size={16} className="text-purple-500" />;
      default: return <CalendarIcon size={16} className="text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'phone': return 'Téléphone';
      case 'video': return 'Visio';
      case 'onsite': return 'Présentiel';
      default: return 'Entretien';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <CalendarIcon className="mr-3" size={32} />
              Agenda intelligent
            </h1>
            <p className="text-gray-100">
              Planification automatique et gestion des entretiens candidats
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{interviews.length}</div>
            <div className="text-sm text-gray-100">Entretiens programmés</div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-[#223049] mb-4">Aujourd'hui</h3>
          <div className="space-y-3">
            {getTodayInterviews().length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun entretien aujourd'hui</p>
            ) : (
              getTodayInterviews().map(interview => (
                <div key={interview.id} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  {getTypeIcon(interview.type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{interview.candidateName}</p>
                    <p className="text-xs text-gray-500">{interview.time} • {interview.duration}min</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-[#223049] mb-4">Cette semaine</h3>
          <div className="space-y-3">
            {getUpcomingInterviews().slice(0, 3).map(interview => (
              <div key={interview.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                {getTypeIcon(interview.type)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{interview.candidateName}</p>
                  <p className="text-xs text-gray-500">
                    {interview.date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} • {interview.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-[#223049] mb-4">Actions rapides</h3>
          <div className="space-y-3">
            <button
              onClick={() => setShowNewInterview(true)}
              className="w-full bg-[#ff6a3d] text-white px-4 py-3 rounded-lg hover:bg-[#ff6a3d]/90 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus size={16} />
              <span>Nouvel entretien</span>
            </button>
            <button className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Synchroniser calendrier
            </button>
            <button className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Envoyer rappels
            </button>
          </div>
        </div>
      </div>

      {/* Calendrier */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#223049]">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm bg-[#ff6a3d] text-white rounded-lg hover:bg-[#ff6a3d]/90 transition-colors"
              >
                Aujourd'hui
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-1">
          {/* En-têtes des jours */}
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 bg-gray-50">
              {day}
            </div>
          ))}

          {/* Jours du calendrier */}
          {getCalendarDays().map(({ date, isCurrentMonth }, index) => {
            const dayInterviews = getInterviewsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border border-gray-100 ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isToday ? 'bg-blue-50 border-blue-200' : ''} hover:bg-gray-50 transition-colors cursor-pointer`}
                onClick={() => setSelectedDate(date)}
              >
                <div className={`text-sm ${
                  isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                } ${isToday ? 'font-bold text-blue-600' : ''}`}>
                  {date.getDate()}
                </div>

                <div className="mt-1 space-y-1">
                  {dayInterviews.slice(0, 3).map(interview => (
                    <div
                      key={interview.id}
                      className={`text-xs p-1 rounded truncate ${
                        interview.type === 'phone' ? 'bg-blue-100 text-blue-800' :
                        interview.type === 'video' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}
                      title={`${interview.candidateName} - ${interview.time}`}
                    >
                      {interview.time} {interview.candidateName}
                    </div>
                  ))}
                  {dayInterviews.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayInterviews.length - 3} autres
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Liste des entretiens */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-[#223049] mb-6">Prochains entretiens</h3>
        <div className="space-y-4">
          {getUpcomingInterviews().map(interview => (
            <div key={interview.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getTypeIcon(interview.type)}
                </div>
                <div>
                  <h4 className="font-medium text-[#223049]">{interview.candidateName}</h4>
                  <p className="text-sm text-gray-600">{interview.position}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center">
                      <CalendarIcon size={14} className="mr-1" />
                      {interview.date.toLocaleDateString('fr-FR')}
                    </span>
                    <span className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {interview.time} ({interview.duration}min)
                    </span>
                    <span>{getTypeLabel(interview.type)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.open(`mailto:${interview.candidateEmail}`)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Envoyer un email"
                >
                  <Mail size={16} />
                </button>
                <button
                  onClick={() => window.open(`tel:${interview.candidatePhone}`)}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                  title="Appeler"
                >
                  <Phone size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal nouvel entretien */}
      {showNewInterview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-[#223049] mb-6">Planifier un entretien</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Candidat</label>
                <select
                  value={newInterview.candidateId}
                  onChange={(e) => setNewInterview({ ...newInterview, candidateId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un candidat</option>
                  {candidates.filter(c => ['Contacted', 'Interview', 'Qualified'].includes(c.status)).map(candidate => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.name} - {candidate.position}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newInterview.date}
                    onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heure</label>
                  <input
                    type="time"
                    value={newInterview.time}
                    onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newInterview.type}
                    onChange={(e) => setNewInterview({ ...newInterview, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="video">Visioconférence</option>
                    <option value="phone">Téléphone</option>
                    <option value="onsite">Présentiel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durée (min)</label>
                  <select
                    value={newInterview.duration}
                    onChange={(e) => setNewInterview({ ...newInterview, duration: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 heure</option>
                    <option value={90}>1h30</option>
                    <option value={120}>2 heures</option>
                  </select>
                </div>
              </div>

              {newInterview.type === 'onsite' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lieu</label>
                  <input
                    type="text"
                    value={newInterview.location}
                    onChange={(e) => setNewInterview({ ...newInterview, location: e.target.value })}
                    placeholder="Adresse du rendez-vous"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={newInterview.notes}
                  onChange={(e) => setNewInterview({ ...newInterview, notes: e.target.value })}
                  rows={3}
                  placeholder="Notes sur l'entretien..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowNewInterview(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateInterview}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Planifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;