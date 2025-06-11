import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Users, Clock, Target, Award, Calendar, Euro } from 'lucide-react';
import { useCandidates } from '../../hooks/useCandidates';

const Analytics: React.FC = () => {
  const { candidates, loading } = useCandidates();

  const analytics = useMemo(() => {
    if (candidates.length === 0) {
      return {
        totalCandidates: 0,
        averageScore: 0,
        conversionRate: 0,
        topSources: [],
        statusDistribution: [],
        scoreDistribution: [],
        monthlyTrends: [],
        topSkills: [],
        locationStats: [],
        salaryRanges: []
      };
    }

    // Statistiques de base
    const totalCandidates = candidates.length;
    const averageScore = Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / totalCandidates);
    const hiredCount = candidates.filter(c => c.status === 'Hired').length;
    const conversionRate = Math.round((hiredCount / totalCandidates) * 100);

    // Sources principales
    const sourceCount = candidates.reduce((acc, c) => {
      acc[c.source] = (acc[c.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topSources = Object.entries(sourceCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([source, count]) => ({
        source,
        count,
        percentage: Math.round((count / totalCandidates) * 100)
      }));

    // Distribution par statut
    const statusCount = candidates.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusDistribution = Object.entries(statusCount).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / totalCandidates) * 100)
    }));

    // Distribution des scores
    const scoreRanges = [
      { range: '90-100%', min: 90, max: 100, color: 'bg-green-500' },
      { range: '80-89%', min: 80, max: 89, color: 'bg-[#ff6a3d]' },
      { range: '70-79%', min: 70, max: 79, color: 'bg-yellow-500' },
      { range: '60-69%', min: 60, max: 69, color: 'bg-orange-500' },
      { range: '<60%', min: 0, max: 59, color: 'bg-red-500' }
    ];

    const scoreDistribution = scoreRanges.map(range => {
      const count = candidates.filter(c => c.score >= range.min && c.score <= range.max).length;
      return {
        ...range,
        count,
        percentage: Math.round((count / totalCandidates) * 100)
      };
    });

    // Compétences les plus recherchées
    const skillCount = candidates.reduce((acc, c) => {
      c.skills.forEach(skill => {
        acc[skill] = (acc[skill] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const topSkills = Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));

    // Statistiques géographiques
    const locationCount = candidates.reduce((acc, c) => {
      if (c.location) {
        acc[c.location] = (acc[c.location] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const locationStats = Object.entries(locationCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([location, count]) => ({
        location,
        count,
        percentage: Math.round((count / totalCandidates) * 100)
      }));

    // Analyse des salaires
    const salariesWithValues = candidates
      .filter(c => c.salary && c.salary.includes('k€'))
      .map(c => parseInt(c.salary.replace('k€', '')))
      .filter(s => !isNaN(s));

    const salaryRanges = [
      { range: '30-40k€', min: 30, max: 40 },
      { range: '40-50k€', min: 40, max: 50 },
      { range: '50-60k€', min: 50, max: 60 },
      { range: '60-70k€', min: 60, max: 70 },
      { range: '70k€+', min: 70, max: 999 }
    ].map(range => {
      const count = salariesWithValues.filter(s => s >= range.min && s < range.max).length;
      return {
        ...range,
        count,
        percentage: salariesWithValues.length > 0 ? Math.round((count / salariesWithValues.length) * 100) : 0
      };
    });

    return {
      totalCandidates,
      averageScore,
      conversionRate,
      topSources,
      statusDistribution,
      scoreDistribution,
      topSkills,
      locationStats,
      salaryRanges
    };
  }, [candidates]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6a3d]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-400 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <BarChart3 className="mr-3" size={32} />
              Analytics RH
            </h1>
            <p className="text-gray-100">
              Tableaux de bord et métriques de performance de vos recrutements
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{analytics.totalCandidates}</div>
            <div className="text-sm text-gray-100">Candidats analysés</div>
          </div>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#ff6a3d]/10 rounded-lg">
              <Users className="text-[#ff6a3d]" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-[#223049] mb-1">{analytics.totalCandidates}</h3>
          <p className="text-gray-600 text-sm">Total candidats</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#9b6bff]/10 rounded-lg">
              <Award className="text-[#9b6bff]" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-[#223049] mb-1">{analytics.averageScore}%</h3>
          <p className="text-gray-600 text-sm">Score moyen IA</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="text-green-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-[#223049] mb-1">{analytics.conversionRate}%</h3>
          <p className="text-gray-600 text-sm">Taux de conversion</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="text-blue-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-[#223049] mb-1">
            {candidates.filter(c => ['Contacted', 'Interview', 'Qualified'].includes(c.status)).length}
          </h3>
          <p className="text-gray-600 text-sm">En cours</p>
        </div>
      </div>

      {/* Graphiques et analyses */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Distribution par statut */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-[#223049] mb-6">Répartition par statut</h3>
          <div className="space-y-4">
            {analytics.statusDistribution.map((item, index) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.status}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#ff6a3d] h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12">{item.count}</span>
                  <span className="text-xs text-gray-500 w-10">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution des scores */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-[#223049] mb-6">Distribution des scores IA</h3>
          <div className="space-y-4">
            {analytics.scoreDistribution.map((item, index) => (
              <div key={item.range} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.range}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12">{item.count}</span>
                  <span className="text-xs text-gray-500 w-10">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sources de candidats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-[#223049] mb-6">Sources principales</h3>
          <div className="space-y-4">
            {analytics.topSources.map((source, index) => (
              <div key={source.source} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{source.source}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#9b6bff] h-2 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12">{source.count}</span>
                  <span className="text-xs text-gray-500 w-10">{source.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compétences populaires */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-[#223049] mb-6">Compétences les plus demandées</h3>
          <div className="space-y-3">
            {analytics.topSkills.slice(0, 8).map((skill, index) => (
              <div key={skill.skill} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{skill.skill}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, (skill.count / analytics.totalCandidates) * 100 * 3)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-8">{skill.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analyses avancées */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Répartition géographique */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-[#223049] mb-6">Répartition géographique</h3>
          <div className="space-y-3">
            {analytics.locationStats.map((location, index) => (
              <div key={location.location} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{location.location}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${location.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-8">{location.count}</span>
                  <span className="text-xs text-gray-500 w-10">{location.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tranches salariales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-[#223049] mb-6">Répartition salariale</h3>
          <div className="space-y-3">
            {analytics.salaryRanges.map((range, index) => (
              <div key={range.range} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{range.range}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#ff6a3d] h-2 rounded-full"
                      style={{ width: `${range.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-8">{range.count}</span>
                  <span className="text-xs text-gray-500 w-10">{range.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommandations IA */}
      <div className="bg-gradient-to-br from-[#f4f0ec] to-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#223049] mb-4 flex items-center">
          <Award className="text-[#ff6a3d] mr-2" size={20} />
          Recommandations IA
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-[#223049]">Points forts détectés:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Score IA moyen élevé ({analytics.averageScore}%)
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Diversité des sources de candidats
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Pipeline bien alimenté
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-[#223049]">Optimisations suggérées:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#ff6a3d] rounded-full mr-2"></span>
                Améliorer le taux de conversion
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#ff6a3d] rounded-full mr-2"></span>
                Suivre plus régulièrement les candidats
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#ff6a3d] rounded-full mr-2"></span>
                Enrichir les profils candidats
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;