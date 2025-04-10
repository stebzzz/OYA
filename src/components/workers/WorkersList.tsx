import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Filter, MoreHorizontal, ChevronDown, Check, User, Eye, Loader2, FileText, AlertTriangle, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AddWorkerModal } from './AddWorkerModal';
import { ImportCVModal } from './ImportCVModal';
import { getAllWorkers, Worker } from '../../services/workersService';

const statusColors = {
  active: { bg: 'bg-emerald-400/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  busy: { bg: 'bg-amber-400/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  inactive: { bg: 'bg-gray-400/10', text: 'text-gray-400', dot: 'bg-gray-400' }
};

export const WorkersList = () => {
  // États pour les données et le chargement
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  // État pour les modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  const navigate = useNavigate();
  
  // Charger les intérimaires
  useEffect(() => {
    const loadWorkers = async () => {
      try {
        setLoading(true);
        const data = await getAllWorkers();
        setWorkers(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des intérimaires:', err);
        setError('Impossible de charger les intérimaires. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    loadWorkers();
  }, []);
  
  // Extraire toutes les compétences uniques
  const allSkills = Array.from(new Set(workers.flatMap(worker => worker.skills)));
  
  // Filtrer les travailleurs 
  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = searchTerm === '' || 
      `${worker.firstName} ${worker.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkill = filterSkill === null || 
      worker.skills.includes(filterSkill);
      
    const matchesStatus = filterStatus === null || 
      worker.status === filterStatus;
      
    return matchesSearch && matchesSkill && matchesStatus;
  });

  // Gérer l'ajout d'un nouvel intérimaire
  const handleWorkerAdded = (workerId: string) => {
    // Recharger les données
    getAllWorkers().then(data => {
      setWorkers(data);
    }).catch(err => {
      console.error('Erreur lors du rechargement des intérimaires:', err);
    });
    
    // Rediriger vers la page de détail du nouvel intérimaire
    setTimeout(() => {
      navigate(`/dashboard/workers/${workerId}`);
    }, 500);
  };

  // Rendu pour l'état de chargement
  if (loading && workers.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Intérimaires</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Upload className="h-5 w-5" />
            <span>Importer CV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <UserPlus className="h-5 w-5" />
            <span>Ajouter</span>
          </button>
        </div>
      </div>
      
      {/* Afficher l'erreur s'il y en a une */}
      {error && (
        <div className="bg-red-500/10 border border-red-400/20 p-4 rounded-xl text-red-300 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p>{error}</p>
            <button 
              className="mt-2 px-3 py-1 bg-red-600/30 hover:bg-red-600/50 rounded text-sm transition-colors"
              onClick={() => {
                setLoading(true);
                getAllWorkers().then(data => {
                  setWorkers(data);
                  setError(null);
                }).catch(err => {
                  console.error('Erreur lors du rechargement:', err);
                  setError('Impossible de charger les intérimaires. Veuillez réessayer.');
                }).finally(() => {
                  setLoading(false);
                });
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      )}
      
      {/* Filtres */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un intérimaire..."
              className="pl-10 pr-4 py-2 w-full bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <button
                className="flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 text-gray-200"
                onClick={() => document.getElementById('skill-dropdown')?.classList.toggle('hidden')}
              >
                <Filter className="h-4 w-4 mr-2" />
                <span>{filterSkill || 'Compétences'}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              
              <div id="skill-dropdown" className="absolute mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg overflow-hidden z-10 hidden">
                <div className="p-2">
                  <button
                    className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                    onClick={() => {
                      setFilterSkill(null);
                      document.getElementById('skill-dropdown')?.classList.add('hidden');
                    }}
                  >
                    <span>Toutes les compétences</span>
                    {filterSkill === null && <Check className="h-4 w-4 ml-auto" />}
                  </button>
                  
                  {allSkills.map(skill => (
                    <button
                      key={skill}
                      className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                      onClick={() => {
                        setFilterSkill(skill);
                        document.getElementById('skill-dropdown')?.classList.add('hidden');
                      }}
                    >
                      <span>{skill}</span>
                      {filterSkill === skill && <Check className="h-4 w-4 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative">
              <button
                className="flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 text-gray-200"
                onClick={() => document.getElementById('status-dropdown')?.classList.toggle('hidden')}
              >
                <span>{filterStatus === null ? 'Statut' : 
                       filterStatus === 'active' ? 'Disponible' : 
                       filterStatus === 'busy' ? 'En mission' : 'Inactif'}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              
              <div id="status-dropdown" className="absolute mt-2 w-36 bg-gray-700 border border-gray-600 rounded-lg shadow-lg overflow-hidden z-10 hidden">
                <div className="p-2">
                  <button
                    className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                    onClick={() => {
                      setFilterStatus(null);
                      document.getElementById('status-dropdown')?.classList.add('hidden');
                    }}
                  >
                    <span>Tous</span>
                    {filterStatus === null && <Check className="h-4 w-4 ml-auto" />}
                  </button>
                  
                  <button
                    className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                    onClick={() => {
                      setFilterStatus('active');
                      document.getElementById('status-dropdown')?.classList.add('hidden');
                    }}
                  >
                    <span>Disponible</span>
                    {filterStatus === 'active' && <Check className="h-4 w-4 ml-auto" />}
                  </button>
                  
                  <button
                    className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                    onClick={() => {
                      setFilterStatus('busy');
                      document.getElementById('status-dropdown')?.classList.add('hidden');
                    }}
                  >
                    <span>En mission</span>
                    {filterStatus === 'busy' && <Check className="h-4 w-4 ml-auto" />}
                  </button>
                  
                  <button
                    className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                    onClick={() => {
                      setFilterStatus('inactive');
                      document.getElementById('status-dropdown')?.classList.add('hidden');
                    }}
                  >
                    <span>Inactif</span>
                    {filterStatus === 'inactive' && <Check className="h-4 w-4 ml-auto" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Liste des intérimaires */}
      <div className="overflow-hidden rounded-xl bg-gray-800/50 border border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Intérimaire</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Compétences</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">CV</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredWorkers.length > 0 ? (
                filteredWorkers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-700 rounded-full flex items-center justify-center">
                          {worker.avatar ? (
                            <img className="h-10 w-10 rounded-full" src={worker.avatar} alt="" />
                          ) : (
                            <User className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{worker.firstName} {worker.lastName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{worker.email}</div>
                      <div className="text-sm text-gray-400">{worker.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-2">
                        {worker.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center ${statusColors[worker.status as keyof typeof statusColors].bg} ${statusColors[worker.status as keyof typeof statusColors].text} px-2.5 py-1 rounded-full text-xs font-medium`}>
                        <div className={`w-2 h-2 ${statusColors[worker.status as keyof typeof statusColors].dot} rounded-full mr-2`}></div>
                        {worker.status === 'active' ? 'Disponible' : 
                         worker.status === 'busy' ? 'En mission' : 'Inactif'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {worker.cvUrl ? (
                        <div className="flex items-center text-primary-400">
                          <FileText className="h-4 w-4 mr-1" />
                          <span className="text-xs">Disponible</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Non disponible</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          to={`/dashboard/workers/${worker.id}`}
                          className="p-1.5 rounded-full hover:bg-gray-600 text-gray-400 hover:text-white transition-colors"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <button className="p-1.5 rounded-full hover:bg-gray-600 text-gray-400 hover:text-white transition-colors">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    {loading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-6 w-6 text-primary-500 animate-spin mb-2" />
                        <p>Chargement des intérimaires...</p>
                      </div>
                    ) : (
                      <p>Aucun intérimaire ne correspond à votre recherche</p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal d'ajout d'intérimaire */}
      <AddWorkerModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onWorkerAdded={handleWorkerAdded}
      />
      
      {/* Modal d'import de CV */}
      <ImportCVModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onWorkerAdded={handleWorkerAdded}
      />
    </div>
  );
};