import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { getAllWorkers, Worker } from '../../services/workersService';
import WorkerMatching from '../../components/workers/WorkerMatching';

const Matching: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setIsLoading(true);
        const data = await getAllWorkers();
        setWorkers(data);
        if (data.length > 0) {
          setSelectedWorker(data[0]);
        }
      } catch (err) {
        setError("Erreur lors du chargement des intérimaires");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const filteredWorkers = workers.filter((worker) =>
    `${worker.firstName} ${worker.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Matching Intérimaires-Missions
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Trouvez les meilleures correspondances entre vos intérimaires et les missions disponibles
        </p>
      </div>

      <div className="flex flex-1 gap-4 h-full overflow-hidden">
        {/* Sidebar with workers list */}
        <div className="w-72 bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 flex flex-col h-full">
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un intérimaire..."
              className="pl-10 w-full h-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center p-4">{error}</div>
            ) : filteredWorkers.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                Aucun intérimaire trouvé
              </div>
            ) : (
              <ul className="space-y-2">
                {filteredWorkers.map((worker) => (
                  <li key={worker.id}>
                    <button
                      onClick={() => setSelectedWorker(worker)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedWorker?.id === worker.id
                          ? 'bg-primary text-white'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                      }`}
                    >
                      <div className="font-medium">
                        {worker.firstName} {worker.lastName}
                      </div>
                      <div className="text-sm opacity-80 truncate">
                        {worker.skills.slice(0, 3).join(', ')}
                        {worker.skills.length > 3 && '...'}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Main content with worker matching */}
        <div className="flex-1 overflow-y-auto">
          {selectedWorker ? (
            <WorkerMatching 
              workerId={selectedWorker.id || ''} 
              workerName={`${selectedWorker.firstName} ${selectedWorker.lastName}`} 
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-slate-800 rounded-lg shadow-md p-8">
              <div className="text-slate-500 dark:text-slate-400 text-center">
                <p className="text-lg mb-2">Sélectionnez un intérimaire pour voir les missions correspondantes</p>
                <p>Les résultats de matching vous aideront à identifier les meilleures opportunités pour vos intérimaires</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Matching; 