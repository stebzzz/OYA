import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Phone, 
  Mail,
  MapPin,
  Star,
  Calendar,
  Users
} from 'lucide-react';
import { useCandidates, Candidate } from '../../hooks/useCandidates';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CandidatesListProps {
  onSelectCandidate: (candidate: Candidate | null) => void;
  onEditCandidate: (candidate: Candidate) => void;
}

const CandidatesList: React.FC<CandidatesListProps> = ({ onSelectCandidate, onEditCandidate }) => {
  const { candidates, loading, deleteCandidate, updateCandidate } = useCandidates();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    const colors = {
      'To Contact': 'bg-blue-100 text-blue-800',
      'Contacted': 'bg-yellow-100 text-yellow-800',
      'Interview': 'bg-[#ff6a3d] text-white',
      'Qualified': 'bg-[#9b6bff] text-white',
      'Rejected': 'bg-red-100 text-red-800',
      'Hired': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-[#ff6a3d]';
    if (score >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteCandidate = async (id: string) => {
    try {
      await deleteCandidate(id);
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleUpdateStatus = async (candidate: Candidate, newStatus: Candidate['status']) => {
    try {
      await updateCandidate(candidate.id, { status: newStatus });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
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
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#223049]">
            Candidats ({filteredCandidates.length})
          </h2>
          <button 
            onClick={() => onSelectCandidate(null)}
            className="bg-[#ff6a3d] text-white px-4 py-2 rounded-lg hover:bg-[#ff6a3d]/90 transition-colors flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Nouveau candidat</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Rechercher un candidat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="To Contact">À contacter</option>
            <option value="Contacted">Contacté</option>
            <option value="Interview">Entretien</option>
            <option value="Qualified">Qualifié</option>
            <option value="Rejected">Rejeté</option>
            <option value="Hired">Embauché</option>
          </select>
        </div>
      </div>

      {/* Candidates List */}
      <div className="divide-y divide-gray-100">
        {filteredCandidates.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun candidat trouvé</h3>
            <p className="text-gray-500">Commencez par ajouter votre premier candidat.</p>
          </div>
        ) : (
          filteredCandidates.map((candidate) => (
            <div key={candidate.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative">
                    {candidate.avatar ? (
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-[#ff6a3d] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {candidate.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <div className={`w-3 h-3 rounded-full ${candidate.score >= 90 ? 'bg-green-500' : candidate.score >= 80 ? 'bg-[#ff6a3d]' : 'bg-yellow-500'}`}></div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-semibold text-[#223049] truncate">{candidate.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{candidate.position}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>{candidate.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star size={14} />
                        <span>{candidate.experience}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className={`font-medium ${getScoreColor(candidate.score)}`}>
                          Score: {candidate.score}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-right mr-4">
                    <p className="font-semibold text-[#223049]">{candidate.salary}</p>
                    <p className="text-sm text-gray-500">
                      {candidate.createdAt && format(candidate.createdAt.toDate(), 'dd MMM', { locale: fr })}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => window.open(`tel:${candidate.phone}`)}
                      className="p-2 text-gray-400 hover:text-[#ff6a3d] transition-colors rounded-lg hover:bg-gray-100"
                      title="Appeler"
                    >
                      <Phone size={16} />
                    </button>
                    <button
                      onClick={() => window.open(`mailto:${candidate.email}`)}
                      className="p-2 text-gray-400 hover:text-[#ff6a3d] transition-colors rounded-lg hover:bg-gray-100"
                      title="Envoyer un email"
                    >
                      <Mail size={16} />
                    </button>
                    <button
                      onClick={() => onEditCandidate(candidate)}
                      className="p-2 text-gray-400 hover:text-[#ff6a3d] transition-colors rounded-lg hover:bg-gray-100"
                      title="Modifier"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(candidate.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                {['To Contact', 'Contacted', 'Interview', 'Qualified'].map((status) => (
                  candidate.status !== status && (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(candidate, status as Candidate['status'])}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-[#ff6a3d] hover:text-white transition-colors"
                    >
                      → {status}
                    </button>
                  )
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Modal */}
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

export default CandidatesList;