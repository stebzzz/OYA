import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Calendar,
  Star,
  Target,
  Zap
} from 'lucide-react';
import { useCandidates } from '../../hooks/useCandidates';

const DashboardOverview: React.FC = () => {
  const { candidates, loading } = useCandidates();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6a3d]"></div>
      </div>
    );
  }

  const stats = {
    totalCandidates: candidates.length,
    interviews: candidates.filter(c => c.status === 'Interview').length,
    qualified: candidates.filter(c => c.status === 'Qualified').length,
    hired: candidates.filter(c => c.status === 'Hired').length,
    averageScore: candidates.length > 0 ? Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / candidates.length) : 0
  };

  const recentCandidates = candidates
    .sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis())
    .slice(0, 5);

  const topCandidates = candidates
    .filter(c => c.score >= 85)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#223049] to-[#223049]/90 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Tableau de bord OYA</h1>
            <p className="text-gray-300">
              Gérez vos recrutements avec l'intelligence artificielle
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#ff6a3d]">{stats.averageScore}%</div>
            <div className="text-sm text-gray-300">Score moyen IA</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#ff6a3d]/10 rounded-lg">
              <Users className="text-[#ff6a3d]" size={24} />
            </div>
            <span className="text-sm text-green-600 font-medium">
              +{Math.round((stats.totalCandidates / 30) * 100)}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-[#223049] mb-1">{stats.totalCandidates}</h3>
          <p className="text-gray-600 text-sm">Candidats actifs</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#9b6bff]/10 rounded-lg">
              <Calendar className="text-[#9b6bff]" size={24} />
            </div>
            <span className="text-sm text-green-600 font-medium">+15%</span>
          </div>
          <h3 className="text-2xl font-bold text-[#223049] mb-1">{stats.interviews}</h3>
          <p className="text-gray-600 text-sm">Entretiens planifiés</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <span className="text-sm text-green-600 font-medium">+25%</span>
          </div>
          <h3 className="text-2xl font-bold text-[#223049] mb-1">{stats.qualified}</h3>
          <p className="text-gray-600 text-sm">Candidats qualifiés</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="text-blue-600" size={24} />
            </div>
            <span className="text-sm text-green-600 font-medium">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-[#223049] mb-1">{stats.hired}</h3>
          <p className="text-gray-600 text-sm">Embauches réussies</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Candidates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-[#223049]">Candidats récents</h2>
          </div>
          <div className="p-6">
            {recentCandidates.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Aucun candidat récent</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCandidates.map((candidate) => (
                  <div key={candidate.id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#ff6a3d] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {candidate.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#223049] truncate">{candidate.name}</p>
                      <p className="text-sm text-gray-500 truncate">{candidate.position}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star size={14} className="text-[#ff6a3d]" />
                        <span className="text-sm font-medium">{candidate.score}%</span>
                      </div>
                      <span className="text-xs text-gray-500">{candidate.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Candidates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-[#223049]">Top candidats IA</h2>
          </div>
          <div className="p-6">
            {topCandidates.length === 0 ? (
              <div className="text-center py-8">
                <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Aucun candidat avec score élevé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topCandidates.map((candidate, index) => (
                  <div key={candidate.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#ff6a3d] to-[#9b6bff] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {candidate.name.charAt(0)}
                        </span>
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-xs">👑</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#223049] truncate">{candidate.name}</p>
                      <p className="text-sm text-gray-500 truncate">{candidate.position}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <div className="w-12 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-gradient-to-r from-[#ff6a3d] to-[#9b6bff] rounded-full"
                            style={{ width: `${candidate.score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-green-600">{candidate.score}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-[#223049] mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#ff6a3d] hover:bg-[#ff6a3d]/5 transition-colors">
            <div className="p-2 bg-[#ff6a3d]/10 rounded-lg">
              <Users size={20} className="text-[#ff6a3d]" />
            </div>
            <div>
              <p className="font-medium text-[#223049]">Nouveau candidat</p>
              <p className="text-sm text-gray-500">Ajouter manuellement</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#9b6bff] hover:bg-[#9b6bff]/5 transition-colors">
            <div className="p-2 bg-[#9b6bff]/10 rounded-lg">
              <Zap size={20} className="text-[#9b6bff]" />
            </div>
            <div>
              <p className="font-medium text-[#223049]">Sourcing IA</p>
              <p className="text-sm text-gray-500">Recherche automatique</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar size={20} className="text-green-600" />
            </div>
            <div>
              <p className="font-medium text-[#223049]">Planifier entretien</p>
              <p className="text-sm text-gray-500">Agenda automatique</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;