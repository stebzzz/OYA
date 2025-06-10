import React, { useState, useRef, useEffect } from 'react';
import { Plus, MoreHorizontal, Eye, Edit, Trash2, Phone, Mail, Calendar, Star, TrendingUp } from 'lucide-react';
import { useCandidates, Candidate } from '../../hooks/useCandidates';

const Pipeline: React.FC = () => {
  const { candidates, loading, updateCandidate, deleteCandidate } = useCandidates();
  const [draggedCandidate, setDraggedCandidate] = useState<Candidate | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const statusColumns = [
    { id: 'To Contact', title: 'À contacter', color: 'bg-blue-100 border-blue-200', textColor: 'text-blue-800' },
    { id: 'Contacted', title: 'Contacté', color: 'bg-yellow-100 border-yellow-200', textColor: 'text-yellow-800' },
    { id: 'Interview', title: 'Entretien', color: 'bg-orange-100 border-orange-200', textColor: 'text-orange-800' },
    { id: 'Qualified', title: 'Qualifié', color: 'bg-purple-100 border-purple-200', textColor: 'text-purple-800' },
    { id: 'Hired', title: 'Embauché', color: 'bg-green-100 border-green-200', textColor: 'text-green-800' },
    { id: 'Rejected', title: 'Rejeté', color: 'bg-red-100 border-red-200', textColor: 'text-red-800' }
  ];

  const getCandidatesByStatus = (status: string) => {
    return candidates.filter(candidate => candidate.status === status);
  };

  const getStatusStats = () => {
    return statusColumns.map(column => ({
      ...column,
      count: getCandidatesByStatus(column.id).length,
      averageScore: getCandidatesByStatus(column.id).reduce((acc, c) => acc + c.score, 0) / Math.max(1, getCandidatesByStatus(column.id).length)
    }));
  };

  const handleDragStart = (e: React.DragEvent, candidate: Candidate) => {
    setDraggedCandidate(candidate);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    
    if (draggedCandidate && draggedCandidate.status !== newStatus) {
      try {
        await updateCandidate(draggedCandidate.id, { status: newStatus as Candidate['status'] });
      } catch (error) {
        console.error('Erreur lors du déplacement:', error);
      }
    }
    
    setDraggedCandidate(null);
  };

  const handleDeleteCandidate = async (id: string) => {
    try {
      await deleteCandidate(id);
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const totalCandidates = candidates.length;
  const averageScore = totalCandidates > 0 ? Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / totalCandidates) : 0;
  const inProgressCount = candidates.filter(c => ['Contacted', 'Interview', 'Qualified'].includes(c.status)).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6a3d]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header avec statistiques */}
      <div className="bg-gradient-to-r from-[#ff6a3d] to-[#ff6a3d]/80 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <TrendingUp className="mr-3" size={32} />
              Pipeline de recrutement
            </h1>
            <p className="text-gray-200">
              Suivez et gérez vos candidats à travers le processus de recrutement
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{totalCandidates}</div>
            <div className="text-sm opacity-90">Total candidats</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <div className="text-sm opacity-90">En cours de traitement</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{averageScore}%</div>
            <div className="text-sm opacity-90">Score moyen IA</div>
          </div>
        </div>
      </div>

      {/* Pipeline Kanban */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-[#223049] mb-6">Vue pipeline</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 min-h-[600px]">
          {statusColumns.map((column) => {
            const columnCandidates = getCandidatesByStatus(column.id);
            const columnStats = getStatusStats().find(s => s.id === column.id);
            
            return (
              <div
                key={column.id}
                className={`${column.color} border-2 border-dashed rounded-lg p-4`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* En-tête de colonne */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-medium ${column.textColor}`}>{column.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${column.textColor} bg-white`}>
                      {columnCandidates.length}
                    </span>
                  </div>
                  {columnCandidates.length > 0 && (
                    <div className="text-xs text-gray-600">
                      Score moyen: {Math.round(columnStats?.averageScore || 0)}%
                    </div>
                  )}
                </div>

                {/* Candidats */}
                <div className="space-y-3">
                  {columnCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, candidate)}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-[#223049] truncate">{candidate.name}</h4>
                          <p className="text-sm text-gray-600 truncate">{candidate.position}</p>
                        </div>
                        
                        {/* Menu actions */}
                        <div className="relative">
                          <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal size={16} className="text-gray-400" />
                          </button>
                        </div>
                      </div>

                      {/* Score et infos */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-1">
                          <Star size={12} className="text-[#ff6a3d]" />
                          <span className="text-xs font-medium">{candidate.score}%</span>
                        </div>
                        <span className="text-xs text-gray-500">{candidate.experience}</span>
                      </div>

                      {/* Compétences */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {candidate.skills.slice(0, 2).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{candidate.skills.length - 2}
                          </span>
                        )}
                      </div>

                      {/* Actions rapides */}
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => window.open(`tel:${candidate.phone}`)}
                          className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                          title="Appeler"
                        >
                          <Phone size={12} />
                        </button>
                        <button
                          onClick={() => window.open(`mailto:${candidate.email}`)}
                          className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                          title="Email"
                        >
                          <Mail size={12} />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(candidate.id)}
                          className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Zone de drop vide */}
                  {columnCandidates.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-sm">Aucun candidat</div>
                      <div className="text-xs">Glissez un candidat ici</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-[#223049] mb-4">Répartition par étape</h3>
          <div className="space-y-3">
            {getStatusStats().map((stat) => (
              <div key={stat.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{stat.title}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#ff6a3d] h-2 rounded-full"
                      style={{ width: `${totalCandidates > 0 ? (stat.count / totalCandidates) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-8">{stat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-[#223049] mb-4">Métriques de performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Taux de conversion</span>
              <span className="text-lg font-semibold text-green-600">
                {totalCandidates > 0 ? Math.round((candidates.filter(c => c.status === 'Hired').length / totalCandidates) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Candidats qualifiés</span>
              <span className="text-lg font-semibold text-[#9b6bff]">
                {candidates.filter(c => c.status === 'Qualified').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">En attente de contact</span>
              <span className="text-lg font-semibold text-blue-600">
                {candidates.filter(c => c.status === 'To Contact').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Score moyen IA</span>
              <span className="text-lg font-semibold text-[#ff6a3d]">{averageScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-[#223049] mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer ce candidat ? Cette action est irréversible.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteCandidate(showDeleteModal)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pipeline;