import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Filter, ChevronDown, Check, MoreHorizontal, MapPin, Clock, Users, Upload, CheckSquare } from 'lucide-react';
import { ImportMissionModal } from './ImportMissionModal';
import { ApproveMissionModal } from './ApproveMissionModal';
import { Mission, getMissions } from '../../services/missionsService';
import { useAuthStore } from '../../store/authStore';

// Garder mockMissions pour le fallback si nécessaire
const mockMissions = [
  {
    id: '1',
    title: 'Soudeur TIG',
    client: 'Industrie Métallique SA',
    location: 'Lyon',
    startDate: '2024-03-15',
    endDate: '2024-04-15',
    status: 'open',
    workers: 3,
    requiredWorkers: 5
  },
  {
    id: '2',
    title: 'Manutentionnaire',
    client: 'Logistique Express',
    location: 'Paris',
    startDate: '2024-03-20',
    endDate: '2024-03-25',
    status: 'in_progress',
    workers: 5,
    requiredWorkers: 5
  },
  {
    id: '3',
    title: 'Plombier',
    client: 'SantéPlus',
    location: 'Marseille',
    startDate: '2024-04-01',
    endDate: '2024-04-30',
    status: 'open',
    workers: 1,
    requiredWorkers: 3
  },
  {
    id: '4',
    title: 'Électricien industriel',
    client: 'Électro Solutions',
    location: 'Bordeaux',
    startDate: '2024-03-28',
    endDate: '2024-05-15',
    status: 'in_progress',
    workers: 2,
    requiredWorkers: 2
  },
  {
    id: '5',
    title: 'Cariste',
    client: 'Entrepôts Nationaux',
    location: 'Lille',
    startDate: '2024-04-10',
    endDate: '2024-04-25',
    status: 'open',
    workers: 0,
    requiredWorkers: 4
  }
];

const statusColors = {
  open: { bg: 'bg-emerald-400/10', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'À pourvoir' },
  in_progress: { bg: 'bg-blue-400/10', text: 'text-blue-400', dot: 'bg-blue-400', label: 'En cours' },
  completed: { bg: 'bg-gray-400/10', text: 'text-gray-400', dot: 'bg-gray-400', label: 'Terminée' },
  cancelled: { bg: 'bg-red-400/10', text: 'text-red-400', dot: 'bg-red-400', label: 'Annulée' }
};

export const MissionsList = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterLocation, setFilterLocation] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isNewMissionModalOpen, setIsNewMissionModalOpen] = useState(false);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Charger les missions depuis Firebase
  useEffect(() => {
    const loadMissions = async () => {
      if (!user?.uid) return;
      
      try {
        setIsLoading(true);
        const fetchedMissions = await getMissions(user.uid);
        setMissions(fetchedMissions);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des missions:', err);
        setError('Impossible de charger les missions. Veuillez réessayer.');
        // Fallback aux données mockées en cas d'erreur
        setMissions(mockMissions as unknown as Mission[]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMissions();
  }, [user?.uid]);
  
  // Extraire toutes les localisations uniques
  const allLocations = Array.from(new Set(missions.map(mission => mission.location)));
  
  // Filtrer les missions
  const filteredMissions = missions.filter(mission => {
    const matchesSearch = searchTerm === '' || 
      mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === null || 
      mission.status === filterStatus;
      
    const matchesLocation = filterLocation === null || 
      mission.location === filterLocation;
      
    return matchesSearch && matchesStatus && matchesLocation;
  });

  // Formater la date pour l'affichage
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  // Recharger les missions après une mise à jour
  const refreshMissions = async () => {
    if (!user?.uid) return;
    try {
      const fetchedMissions = await getMissions(user.uid);
      setMissions(fetchedMissions);
    } catch (err) {
      console.error('Erreur lors du rechargement des missions:', err);
    }
  };

  // Gérer l'ajout d'une nouvelle mission
  const handleMissionAdded = () => {
    refreshMissions();
    setIsImportModalOpen(false);
    setIsNewMissionModalOpen(false);
  };
  
  // Gérer l'approbation d'une mission
  const handleMissionApproved = () => {
    refreshMissions();
    setIsApproveModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Missions</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsApproveModalOpen(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <CheckSquare className="h-5 w-5" />
            <span>Approbation Rapide</span>
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Upload className="h-5 w-5" />
            <span>Importer</span>
          </button>
          <button 
            onClick={() => setIsNewMissionModalOpen(true)}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Nouvelle mission</span>
          </button>
        </div>
      </div>
      
      {/* Filtres */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une mission..."
              className="pl-10 pr-4 py-2 w-full bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <button
                className="flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 text-gray-200"
                onClick={() => document.getElementById('status-dropdown')?.classList.toggle('hidden')}
              >
                <Filter className="h-4 w-4 mr-2" />
                <span>{filterStatus ? statusColors[filterStatus as keyof typeof statusColors].label : 'Statut'}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              
              <div id="status-dropdown" className="absolute mt-2 w-40 bg-gray-700 border border-gray-600 rounded-lg shadow-lg overflow-hidden z-10 hidden">
                <div className="p-2">
                  <button
                    className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                    onClick={() => {
                      setFilterStatus(null);
                      document.getElementById('status-dropdown')?.classList.add('hidden');
                    }}
                  >
                    <span>Tous les statuts</span>
                    {filterStatus === null && <Check className="h-4 w-4 ml-auto" />}
                  </button>
                  
                  {Object.entries(statusColors).map(([status, { label }]) => (
                    <button
                      key={status}
                      className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                      onClick={() => {
                        setFilterStatus(status);
                        document.getElementById('status-dropdown')?.classList.add('hidden');
                      }}
                    >
                      <span>{label}</span>
                      {filterStatus === status && <Check className="h-4 w-4 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative">
              <button
                className="flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 text-gray-200"
                onClick={() => document.getElementById('location-dropdown')?.classList.toggle('hidden')}
              >
                <MapPin className="h-4 w-4 mr-2" />
                <span>{filterLocation || 'Lieu'}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              
              <div id="location-dropdown" className="absolute mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg overflow-hidden z-10 hidden">
                <div className="p-2">
                  <button
                    className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                    onClick={() => {
                      setFilterLocation(null);
                      document.getElementById('location-dropdown')?.classList.add('hidden');
                    }}
                  >
                    <span>Tous les lieux</span>
                    {filterLocation === null && <Check className="h-4 w-4 ml-auto" />}
                  </button>
                  
                  {allLocations.map(location => (
                    <button
                      key={location}
                      className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                      onClick={() => {
                        setFilterLocation(location);
                        document.getElementById('location-dropdown')?.classList.add('hidden');
                      }}
                    >
                      <span>{location}</span>
                      {filterLocation === location && <Check className="h-4 w-4 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* État de chargement */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
          <span className="ml-3 text-gray-300">Chargement des missions...</span>
        </div>
      )}
      
      {/* Message d'erreur */}
      {error && !isLoading && (
        <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-300 mb-4">
          {error}
        </div>
      )}
      
      {/* Liste des missions */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMissions.length > 0 ? (
            filteredMissions.map((mission) => (
              <div key={mission.id} className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-primary-500/50 transition-colors group">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      {mission.title}
                    </h3>
                    <div className={`flex items-center ${statusColors[mission.status as keyof typeof statusColors]?.bg || 'bg-gray-400/10'} ${statusColors[mission.status as keyof typeof statusColors]?.text || 'text-gray-400'} px-2.5 py-1 rounded-full text-xs font-medium`}>
                      <div className={`w-2 h-2 ${statusColors[mission.status as keyof typeof statusColors]?.dot || 'bg-gray-400'} rounded-full mr-2`}></div>
                      {statusColors[mission.status as keyof typeof statusColors]?.label || mission.status}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-4">
                    {mission.company}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">{mission.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">
                        {formatDate(mission.startDate)} - {formatDate(mission.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex border-t border-gray-700">
                  <button className="flex-1 py-3 text-center text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                    Voir détails
                  </button>
                  <button className="flex-1 py-3 text-center text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors border-l border-gray-700">
                    Attribuer
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full p-12 text-center text-gray-400 bg-gray-800/30 rounded-xl border border-gray-700">
              {filterStatus || filterLocation || searchTerm ? 
                'Aucune mission ne correspond à votre recherche' : 
                'Aucune mission disponible. Créez votre première mission !'}
            </div>
          )}
        </div>
      )}
      
      {/* Modal d'importation de mission */}
      <ImportMissionModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onMissionAdded={handleMissionAdded}
      />
      
      {/* Modal d'approbation rapide */}
      <ApproveMissionModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onMissionApproved={handleMissionApproved}
      />

      {/* Réutiliser ImportMissionModal comme modal de nouvelle mission */}
      <ImportMissionModal 
        isOpen={isNewMissionModalOpen}
        onClose={() => setIsNewMissionModalOpen(false)}
        onMissionAdded={handleMissionAdded}
        isNew={true}
      />
    </div>
  );
};