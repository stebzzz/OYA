import React, { useState } from 'react';
import {
  BarChart4,
  Download,
  Filter,
  Search,
  Calendar,
  TrendingUp,
  PieChart,
  Users,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Check,
  FileBarChart
} from 'lucide-react';

type ReportType = 'financial' | 'performance' | 'activity';
type TimeFrame = 'week' | 'month' | 'quarter' | 'year';

interface Report {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  date: Date;
  timeFrame: TimeFrame;
}

// Données fictives pour les graphiques
const performanceData = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
  datasets: [
    {
      label: 'Missions',
      data: [28, 32, 36, 30, 40, 48],
      color: '#3b82f6'
    },
    {
      label: 'Intérimaires',
      data: [45, 52, 49, 60, 72, 80],
      color: '#8b5cf6'
    }
  ]
};

// Données pour les statistiques
const statsData = [
  {
    title: 'Missions complétées',
    value: 87,
    change: 12.3,
    increasingIsGood: true
  },
  {
    title: 'Taux de remplissage',
    value: 92.5,
    unit: '%',
    change: 2.6,
    increasingIsGood: true
  },
  {
    title: 'Heures facturées',
    value: 4850,
    change: -5.4,
    increasingIsGood: false
  },
  {
    title: 'Satisfaction client',
    value: 4.8,
    unit: '/5',
    change: 0.2,
    increasingIsGood: true
  }
];

// Données pour la répartition par métier
const distributionByJob = [
  { name: 'Industrie', value: 35, color: 'bg-indigo-500' },
  { name: 'BTP', value: 28, color: 'bg-blue-500' },
  { name: 'Logistique', value: 18, color: 'bg-cyan-500' },
  { name: 'Tertiaire', value: 12, color: 'bg-emerald-500' },
  { name: 'Autres', value: 7, color: 'bg-orange-500' }
];

// Liste fictive des rapports
const mockReports: Report[] = [
  {
    id: '1',
    title: 'Rapport de performance mensuel',
    description: 'Analyse des performances des missions et des intérimaires',
    type: 'performance',
    date: new Date('2024-03-01'),
    timeFrame: 'month'
  },
  {
    id: '2',
    title: 'Rapport financier Q1 2024',
    description: 'Analyse financière du premier trimestre',
    type: 'financial',
    date: new Date('2024-03-31'),
    timeFrame: 'quarter'
  },
  {
    id: '3',
    title: 'Rapport d\'activité hebdomadaire',
    description: 'Suivi de l\'activité de la semaine dernière',
    type: 'activity',
    date: new Date('2024-03-10'),
    timeFrame: 'week'
  },
  {
    id: '4',
    title: 'Performance des intérimaires',
    description: 'Analyse des performances par intérimaire et par secteur',
    type: 'performance',
    date: new Date('2024-02-15'),
    timeFrame: 'month'
  },
  {
    id: '5',
    title: 'Rapport annuel 2023',
    description: 'Bilan complet de l\'année 2023',
    type: 'financial',
    date: new Date('2024-01-31'),
    timeFrame: 'year'
  }
];

export const ReportsList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'list'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<ReportType | 'all'>('all');
  const [timeFrameFilter, setTimeFrameFilter] = useState<TimeFrame | 'all'>('all');

  // Filtrer les rapports
  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesTimeFrame = timeFrameFilter === 'all' || report.timeFrame === timeFrameFilter;
    
    return matchesSearch && matchesType && matchesTimeFrame;
  });

  // Formater la date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // Obtenir le label pour le type de rapport
  const getReportTypeLabel = (type: ReportType) => {
    switch (type) {
      case 'financial':
        return 'Financier';
      case 'performance':
        return 'Performance';
      case 'activity':
        return 'Activité';
      default:
        return type;
    }
  };

  // Obtenir le label pour la période
  const getTimeFrameLabel = (timeFrame: TimeFrame) => {
    switch (timeFrame) {
      case 'week':
        return 'Hebdomadaire';
      case 'month':
        return 'Mensuel';
      case 'quarter':
        return 'Trimestriel';
      case 'year':
        return 'Annuel';
      default:
        return timeFrame;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Rapports et analyses</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900">
          <BarChart4 className="w-4 h-4 mr-2" />
          Générer un rapport
        </button>
      </div>

      {/* Onglets de navigation */}
      <div className="border-b border-gray-700">
        <div className="flex space-x-4">
          <button
            className={`pb-3 px-1 text-sm font-medium ${
              activeTab === 'overview'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Vue d'ensemble
          </button>
          <button
            className={`pb-3 px-1 text-sm font-medium ${
              activeTab === 'list'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('list')}
          >
            Liste des rapports
          </button>
        </div>
      </div>
      
      {activeTab === 'overview' ? (
        <div className="space-y-6">
          {/* Statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <p className="text-sm text-gray-400">{stat.title}</p>
                <div className="mt-2 flex justify-between items-baseline">
                  <p className="text-2xl font-semibold text-white">
                    {stat.value}{stat.unit || ''}
                  </p>
                  <div className={`flex items-center text-xs px-2 py-1 rounded-full ${
                    stat.change > 0 
                      ? stat.increasingIsGood ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      : stat.increasingIsGood ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                  }`}>
                    {stat.change > 0 ? (
                      <>
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        +{stat.change}%
                      </>
                    ) : (
                      <>
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                        {stat.change}%
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Graphique de performance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-white">Performance</h2>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-gray-400">Missions</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-xs text-gray-400">Intérimaires</span>
                  </div>
                </div>
              </div>
              
              {/* Simuler un graphique avec CSS */}
              <div className="mt-4 h-64 flex items-end">
                <div className="flex-1 flex items-end justify-around">
                  {performanceData.labels.map((label, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2 w-10">
                      <div className="flex flex-col items-center space-y-1 w-full">
                        <div 
                          className="w-5 bg-purple-500 rounded-t"
                          style={{ height: `${performanceData.datasets[1].data[index]}px` }}
                        />
                        <div 
                          className="w-5 bg-blue-500 rounded-t"
                          style={{ height: `${performanceData.datasets[0].data[index]}px` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Distribution par métier */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-6">Répartition par secteur</h2>
              
              <div className="space-y-4">
                {distributionByJob.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-300">{item.name}</span>
                      <span className="text-sm text-gray-400">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Rapports récents */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Rapports récents</h2>
            </div>
            <div>
              {mockReports.slice(0, 3).map((report) => (
                <div key={report.id} className="p-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-700/30 transition-colors">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-white">{report.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">{report.description}</p>
                    </div>
                    <button className="p-1.5 text-gray-400 hover:text-primary-400 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300 mr-2">
                      {getReportTypeLabel(report.type)}
                    </span>
                    <span className="text-xs text-gray-500">Généré le {formatDate(report.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filtres et recherche */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 bg-gray-800/50 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-200 placeholder-gray-400"
                placeholder="Rechercher un rapport..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <button
                  className="flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 text-gray-200"
                  onClick={() => document.getElementById('type-dropdown')?.classList.toggle('hidden')}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  <span>{typeFilter === 'all' ? 'Type de rapport' : getReportTypeLabel(typeFilter)}</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
                
                <div id="type-dropdown" className="absolute mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg overflow-hidden z-10 hidden">
                  <div className="p-2">
                    <button
                      className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                      onClick={() => {
                        setTypeFilter('all');
                        document.getElementById('type-dropdown')?.classList.add('hidden');
                      }}
                    >
                      <span>Tous les types</span>
                      {typeFilter === 'all' && <Check className="h-4 w-4 ml-auto" />}
                    </button>
                    
                    {(['financial', 'performance', 'activity'] as ReportType[]).map(type => (
                      <button
                        key={type}
                        className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                        onClick={() => {
                          setTypeFilter(type);
                          document.getElementById('type-dropdown')?.classList.add('hidden');
                        }}
                      >
                        <span>{getReportTypeLabel(type)}</span>
                        {typeFilter === type && <Check className="h-4 w-4 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <button
                  className="flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 text-gray-200"
                  onClick={() => document.getElementById('timeframe-dropdown')?.classList.toggle('hidden')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{timeFrameFilter === 'all' ? 'Période' : getTimeFrameLabel(timeFrameFilter)}</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
                
                <div id="timeframe-dropdown" className="absolute mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg overflow-hidden z-10 hidden">
                  <div className="p-2">
                    <button
                      className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                      onClick={() => {
                        setTimeFrameFilter('all');
                        document.getElementById('timeframe-dropdown')?.classList.add('hidden');
                      }}
                    >
                      <span>Toutes les périodes</span>
                      {timeFrameFilter === 'all' && <Check className="h-4 w-4 ml-auto" />}
                    </button>
                    
                    {(['week', 'month', 'quarter', 'year'] as TimeFrame[]).map(timeFrame => (
                      <button
                        key={timeFrame}
                        className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-600 text-gray-200"
                        onClick={() => {
                          setTimeFrameFilter(timeFrame);
                          document.getElementById('timeframe-dropdown')?.classList.add('hidden');
                        }}
                      >
                        <span>{getTimeFrameLabel(timeFrame)}</span>
                        {timeFrameFilter === timeFrame && <Check className="h-4 w-4 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Liste des rapports */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
            {filteredReports.length > 0 ? (
              <div className="divide-y divide-gray-700">
                {filteredReports.map((report) => (
                  <div key={report.id} className="p-4 hover:bg-gray-700/30 transition-colors">
                    <div className="sm:flex sm:justify-between sm:items-center">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-gray-700 rounded-lg">
                          <FileBarChart className="h-6 w-6 text-primary-400" />
                        </div>
                        <div>
                          <h3 className="text-md font-medium text-white">{report.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">{report.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                              {getReportTypeLabel(report.type)}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                              {getTimeFrameLabel(report.timeFrame)}
                            </span>
                            <span className="text-xs text-gray-500">
                              Généré le {formatDate(report.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-6 flex">
                        <button className="ml-auto flex items-center px-3 py-1.5 border border-gray-600 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:border-gray-500 transition-colors">
                          <Download className="h-4 w-4 mr-1.5" />
                          Télécharger
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <FileBarChart className="mx-auto h-12 w-12 text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-300">Aucun rapport trouvé</h3>
                <p className="mt-1 text-sm text-gray-500">Aucun rapport ne correspond à vos critères de recherche.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 