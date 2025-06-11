import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Star, 
  Trash2, 
  RefreshCw, 
  Calendar, 
  Users, 
  Target, 
  TrendingUp,
  Filter,
  Tag,
  Clock,
  BarChart3,
  Eye,
  Heart,
  MessageSquare,
  ExternalLink,
  Download,
  Plus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { sourcingHistoryService, SourcingSearch } from '../../services/sourcingHistoryService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SourcingHistoryProps {
  onRerunSearch?: (criteria: any) => void;
  onClose?: () => void;
}

const SourcingHistory: React.FC<SourcingHistoryProps> = ({ onRerunSearch, onClose }) => {
  const { currentUser } = useAuth();
  const [searches, setSearches] = useState<SourcingSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [selectedSearch, setSelectedSearch] = useState<SourcingSearch | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = sourcingHistoryService.subscribeToUserSearches(
      currentUser.uid,
      (newSearches) => {
        setSearches(newSearches);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  const filteredSearches = searches.filter(search => {
    // Filtre par statut
    if (filter !== 'all') {
      if (filter === 'favorites' && !search.favorite) return false;
      if (filter === 'successful' && search.status !== 'completed') return false;
      if (filter === 'failed' && search.status !== 'failed') return false;
    }

    // Filtre par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesPosition = search.searchCriteria.position?.toLowerCase().includes(term);
      const matchesLocation = search.searchCriteria.location?.toLowerCase().includes(term);
      const matchesSkills = search.searchCriteria.skills?.toLowerCase().includes(term);
      if (!matchesPosition && !matchesLocation && !matchesSkills) return false;
    }

    // Filtre par tags
    if (selectedTags.length > 0) {
      const hasSelectedTag = selectedTags.some(tag => search.tags.includes(tag));
      if (!hasSelectedTag) return false;
    }

    return true;
  });

  const allTags = Array.from(new Set(searches.flatMap(s => s.tags)));
  const stats = sourcingHistoryService.getSearchStats(searches);

  const handleToggleFavorite = async (searchId: string, currentFavorite: boolean) => {
    try {
      await sourcingHistoryService.toggleFavorite(searchId, !currentFavorite);
    } catch (error) {
      console.error('Erreur toggle favori:', error);
    }
  };

  const handleDeleteSearch = async (searchId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette recherche ?')) {
      try {
        await sourcingHistoryService.deleteSearch(searchId);
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  const handleSaveNotes = async (searchId: string) => {
    try {
      await sourcingHistoryService.addNotes(searchId, newNotes);
      setEditingNotes(null);
      setNewNotes('');
    } catch (error) {
      console.error('Erreur sauvegarde notes:', error);
    }
  };

  const handleRerunSearch = (search: SourcingSearch) => {
    if (onRerunSearch) {
      onRerunSearch(search.searchCriteria);
      if (onClose) onClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'failed': return 'Échouée';
      case 'in_progress': return 'En cours';
      default: return 'Inconnue';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6a3d]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <History className="mr-3" size={32} />
              Historique des recherches IA
            </h1>
            <p className="text-gray-200">
              Consultez, analysez et relancez vos recherches de candidats précédentes
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{searches.length}</div>
            <div className="text-sm text-gray-200">Recherches effectuées</div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#223049]">Statistiques de performance</h2>
          <button
            onClick={() => setShowStats(!showStats)}
            className="text-[#ff6a3d] hover:text-[#ff6a3d]/80 flex items-center space-x-2"
          >
            <BarChart3 size={16} />
            <span>{showStats ? 'Masquer' : 'Voir détails'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#ff6a3d]">{stats.successRate}%</div>
            <div className="text-sm text-gray-600">Taux de succès</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#9b6bff]">{stats.averageCandidates}</div>
            <div className="text-sm text-gray-600">Candidats/recherche</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.averageScore}%</div>
            <div className="text-sm text-gray-600">Score moyen</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalSearches}</div>
            <div className="text-sm text-gray-600">Total recherches</div>
          </div>
        </div>

        {showStats && (
          <div className="mt-6 grid lg:grid-cols-3 gap-6">
            {/* Sources les plus utilisées */}
            <div>
              <h3 className="font-medium text-[#223049] mb-3">Sources populaires</h3>
              <div className="space-y-2">
                {stats.mostUsedSources.slice(0, 5).map((source, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{source.source}</span>
                    <span className="font-medium">{source.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Postes les plus recherchés */}
            <div>
              <h3 className="font-medium text-[#223049] mb-3">Postes populaires</h3>
              <div className="space-y-2">
                {stats.topPositions.slice(0, 5).map((position, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 truncate">{position.position}</span>
                    <span className="font-medium">{position.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tendances */}
            <div>
              <h3 className="font-medium text-[#223049] mb-3">Tendances récentes</h3>
              <div className="space-y-2">
                {stats.searchTrends.slice(-5).map((trend, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{trend.month}</span>
                    <span className="font-medium">{trend.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Poste, compétences, lieu..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
            >
              <option value="all">Toutes</option>
              <option value="favorites">Favoris</option>
              <option value="successful">Réussies</option>
              <option value="failed">Échouées</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value && !selectedTags.includes(e.target.value)) {
                  setSelectedTags([...selectedTags, e.target.value]);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
            >
              <option value="">Ajouter un tag</option>
              {allTags.filter(tag => !selectedTags.includes(tag)).map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilter('all');
                setSearchTerm('');
                setSelectedTags([]);
              }}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Tags sélectionnés */}
        {selectedTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 bg-[#ff6a3d]/10 text-[#ff6a3d] rounded-full text-sm"
              >
                {tag}
                <button
                  onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                  className="ml-2 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Liste des recherches */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#223049]">
            Historique ({filteredSearches.length})
          </h2>
        </div>

        {filteredSearches.length === 0 ? (
          <div className="p-12 text-center">
            <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune recherche trouvée</h3>
            <p className="text-gray-500">
              {searches.length === 0 
                ? "Vous n'avez pas encore effectué de recherche."
                : "Aucune recherche ne correspond à vos filtres."
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredSearches.map((search) => (
              <div key={search.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-[#223049] truncate">
                        {search.metadata.searchQuery}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(search.status)}`}>
                        {getStatusLabel(search.status)}
                      </span>
                      {search.favorite && (
                        <Heart className="text-red-500 fill-current" size={16} />
                      )}
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>
                          {search.createdAt && search.createdAt.toDate 
                            ? format(search.createdAt.toDate(), 'dd MMM yyyy', { locale: fr })
                            : 'Date inconnue'
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users size={14} />
                        <span>{search.results.totalCandidates} candidats</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target size={14} />
                        <span>Score: {search.results.averageScore}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{search.performance.totalSearchTime}ms</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {search.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {search.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Sources utilisées */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {search.results.sources.map(source => (
                        <span
                          key={source}
                          className="px-2 py-1 bg-[#9b6bff]/10 text-[#9b6bff] text-xs rounded"
                        >
                          {source}
                        </span>
                      ))}
                    </div>

                    {/* Notes */}
                    {search.notes && (
                      <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center space-x-2 text-yellow-800 text-sm">
                          <MessageSquare size={14} />
                          <span className="font-medium">Notes:</span>
                        </div>
                        <p className="text-yellow-700 text-sm mt-1">{search.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleToggleFavorite(search.id, search.favorite)}
                      className={`p-2 rounded-lg transition-colors ${
                        search.favorite 
                          ? 'text-red-500 hover:bg-red-50' 
                          : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
                      }`}
                      title={search.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      <Heart size={16} className={search.favorite ? 'fill-current' : ''} />
                    </button>

                    <button
                      onClick={() => setSelectedSearch(search)}
                      className="p-2 text-gray-400 hover:text-[#9b6bff] hover:bg-gray-100 rounded-lg transition-colors"
                      title="Voir détails"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => handleRerunSearch(search)}
                      className="p-2 text-gray-400 hover:text-[#ff6a3d] hover:bg-gray-100 rounded-lg transition-colors"
                      title="Relancer cette recherche"
                    >
                      <RefreshCw size={16} />
                    </button>

                    <button
                      onClick={() => {
                        setEditingNotes(search.id);
                        setNewNotes(search.notes);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Ajouter des notes"
                    >
                      <MessageSquare size={16} />
                    </button>

                    <button
                      onClick={() => handleDeleteSearch(search.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Édition des notes */}
                {editingNotes === search.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <textarea
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="Ajouter des notes sur cette recherche..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() => setEditingNotes(null)}
                        className="px-3 py-1 text-gray-600 hover:text-gray-800"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => handleSaveNotes(search.id)}
                        className="px-3 py-1 bg-[#ff6a3d] text-white rounded hover:bg-[#ff6a3d]/90"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal détails */}
      {selectedSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#223049]">Détails de la recherche</h2>
                <button
                  onClick={() => setSelectedSearch(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Critères de recherche */}
              <div>
                <h3 className="font-semibold text-[#223049] mb-3">Critères de recherche</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Poste:</span>
                    <span className="ml-2">{selectedSearch.searchCriteria.position}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Localisation:</span>
                    <span className="ml-2">{selectedSearch.searchCriteria.location || 'Non spécifiée'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Compétences:</span>
                    <span className="ml-2">{selectedSearch.searchCriteria.skills || 'Non spécifiées'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Expérience:</span>
                    <span className="ml-2">{selectedSearch.searchCriteria.experience || 'Non spécifiée'}</span>
                  </div>
                </div>
              </div>

              {/* Résultats */}
              <div>
                <h3 className="font-semibold text-[#223049] mb-3">Résultats</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedSearch.results.totalCandidates}</div>
                    <div className="text-sm text-blue-700">Candidats trouvés</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedSearch.results.realProfiles}</div>
                    <div className="text-sm text-green-700">Profils vérifiés</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{selectedSearch.results.averageScore}%</div>
                    <div className="text-sm text-purple-700">Score moyen</div>
                  </div>
                </div>
              </div>

              {/* Top candidats */}
              {selectedSearch.results.topCandidates.length > 0 && (
                <div>
                  <h3 className="font-semibold text-[#223049] mb-3">Meilleurs candidats</h3>
                  <div className="space-y-2">
                    {selectedSearch.results.topCandidates.map((candidate, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{candidate.name}</div>
                          <div className="text-sm text-gray-600">{candidate.position}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#ff6a3d]">{candidate.score}%</div>
                          <div className="text-xs text-gray-500">{candidate.source}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedSearch(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    handleRerunSearch(selectedSearch);
                    setSelectedSearch(null);
                  }}
                  className="px-4 py-2 bg-[#ff6a3d] text-white rounded-lg hover:bg-[#ff6a3d]/90 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw size={16} />
                  <span>Relancer cette recherche</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourcingHistory;