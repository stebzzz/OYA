import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, Clock, AlertTriangle, TrendingUp, TrendingDown, 
  Calendar, CheckCircle, BarChart4, Activity, ArrowRight, 
  Menu, MoreHorizontal, ChevronDown, User, FilePlus, 
  FileText, Wallet, PlusCircle, Settings, Search, MessageSquare,
  Loader2, X, Brain, Bot, Zap, LineChart
} from 'lucide-react';
import { 
  getDashboardStats, 
  getRecentActivities, 
  getUpcomingMissions, 
  getPerformanceChartData, 
  getJobCategories,
  DashboardStats,
  Activity as ActivityType,
  Mission,
  ChartData,
  JobCategory
} from '../services/dashboardService';

// Définition des types
type ColorKey = 'primary' | 'secondary' | 'success' | 'warning';
type StatusKey = 'success' | 'warning' | 'error';
type MissionStatusKey = 'confirmed' | 'pending' | 'completed' | 'cancelled';
type TabKey = 'overview' | 'workers' | 'missions' | 'analytics';

export const Dashboard = () => {
  // État pour les filtres et navigation locale
  const [timeFilter, setTimeFilter] = useState('today');
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  
  // États pour les données dynamiques
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<ActivityType[]>([]);
  const [upcomingMissions, setUpcomingMissions] = useState<Mission[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  
  // États pour le chargement et les erreurs
  const [loading, setLoading] = useState({
    stats: true,
    activities: true,
    missions: true,
    chart: true,
    categories: true
  });
  const [error, setError] = useState({
    stats: null as string | null,
    activities: null as string | null,
    missions: null as string | null,
    chart: null as string | null,
    categories: null as string | null
  });
  
  // Charger les statistiques
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
        setError(prev => ({ ...prev, stats: null }));
      } catch (err) {
        console.error('Erreur lors du chargement des statistiques:', err);
        setError(prev => ({ ...prev, stats: "Impossible de charger les statistiques" }));
      } finally {
        setLoading(prev => ({ ...prev, stats: false }));
      }
    };
    
    loadStats();
  }, []);
  
  // Charger les activités récentes
  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await getRecentActivities(4);
        setRecentActivities(data);
        setError(prev => ({ ...prev, activities: null }));
      } catch (err) {
        console.error('Erreur lors du chargement des activités:', err);
        setError(prev => ({ ...prev, activities: "Impossible de charger les activités récentes" }));
      } finally {
        setLoading(prev => ({ ...prev, activities: false }));
      }
    };
    
    loadActivities();
  }, []);
  
  // Charger les missions à venir
  useEffect(() => {
    const loadMissions = async () => {
      try {
        const data = await getUpcomingMissions(4);
        setUpcomingMissions(data);
        setError(prev => ({ ...prev, missions: null }));
      } catch (err) {
        console.error('Erreur lors du chargement des missions:', err);
        setError(prev => ({ ...prev, missions: "Impossible de charger les missions à venir" }));
      } finally {
        setLoading(prev => ({ ...prev, missions: false }));
      }
    };
    
    loadMissions();
  }, []);
  
  // Charger les données du graphique
  useEffect(() => {
    const loadChartData = async () => {
      try {
        const data = await getPerformanceChartData();
        setChartData(data);
        setError(prev => ({ ...prev, chart: null }));
      } catch (err) {
        console.error('Erreur lors du chargement des données du graphique:', err);
        setError(prev => ({ ...prev, chart: "Impossible de charger les données du graphique" }));
      } finally {
        setLoading(prev => ({ ...prev, chart: false }));
      }
    };
    
    loadChartData();
  }, []);
  
  // Charger les catégories d'emploi
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getJobCategories();
        setJobCategories(data);
        setError(prev => ({ ...prev, categories: null }));
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        setError(prev => ({ ...prev, categories: "Impossible de charger les catégories d'emploi" }));
      } finally {
        setLoading(prev => ({ ...prev, categories: false }));
      }
    };
    
    loadCategories();
  }, []);

  // Rendu des statistiques
  const renderStats = () => {
    const colorMappings = {
      primary: {
        bg: 'from-primary-500 to-secondary-500',
        glow: 'from-primary-500/30 to-secondary-500/20',
        light: 'text-primary-500'
      },
      secondary: {
        bg: 'from-primary-500 to-primary-600',
        glow: 'from-primary-600/30 to-primary-500/20',
        light: 'text-primary-400'
      },
      success: {
        bg: 'from-secondary-500 to-secondary-600',
        glow: 'from-secondary-600/30 to-secondary-500/20',
        light: 'text-secondary-400'
      },
      warning: {
        bg: 'from-secondary-500 to-primary-500',
        glow: 'from-secondary-500/30 to-primary-500/20',
        light: 'text-secondary-300'
      }
    };
    
    if (loading.stats) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((_, index) => (
            <div 
              key={index} 
              className="relative overflow-hidden rounded-xl backdrop-blur-md group transition-all duration-300 h-32"
            >
              <div className="absolute inset-0 bg-dark/50"></div>
              <div className="absolute inset-0 rounded-xl border border-white/10"></div>
              <div className="relative p-5 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (error.stats) {
      return (
        <div className="bg-primary-500/10 border border-primary-400/20 p-4 rounded-xl text-primary-300">
          <p>{error.stats}</p>
          <button 
            className="mt-2 px-3 py-1 bg-primary-600/30 hover:bg-primary-600/50 rounded text-sm transition-colors"
            onClick={() => {
              setLoading(prev => ({ ...prev, stats: true }));
              getDashboardStats().then(data => {
                setStats(data);
                setError(prev => ({ ...prev, stats: null }));
              }).catch(err => {
                setError(prev => ({ ...prev, stats: "Impossible de charger les statistiques" }));
              }).finally(() => {
                setLoading(prev => ({ ...prev, stats: false }));
              });
            }}
          >
            Réessayer
          </button>
        </div>
      );
    }
    
    if (!stats) {
      return null;
    }

    const statItems = [
      {
        title: 'Candidats identifiés',
        value: stats.activeWorkers.toString(),
        trend: stats.trends.workers,
        trendDirection: stats.trends.workers.startsWith('+') ? 'up' : 'down',
        icon: Users,
        color: 'primary' as ColorKey
      },
      {
        title: 'Entretiens programmés',
        value: stats.activeMissions.toString(),
        trend: stats.trends.missions,
        trendDirection: stats.trends.missions.startsWith('+') ? 'up' : 'down',
        icon: Calendar,
        color: 'secondary' as ColorKey
      },
      {
        title: 'Score de matching',
        value: stats.hoursWorked.toString() + '%',
        trend: stats.trends.hours,
        trendDirection: stats.trends.hours.startsWith('+') ? 'up' : 'down',
        icon: Brain,
        color: 'success' as ColorKey
      },
      {
        title: 'Offres envoyées',
        value: stats.pendingDocuments.toString(),
        trend: stats.trends.documents,
        trendDirection: stats.trends.documents.startsWith('+') ? 'up' : 'down',
        icon: FileText,
        color: 'warning' as ColorKey
      }
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, index) => {
          const colors = colorMappings[stat.color];
          
          return (
            <div 
              key={index} 
              className="relative overflow-hidden rounded-xl backdrop-blur-md group transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Background gradient and glow */}
              <div className="absolute inset-0 bg-white"></div>
              <div className={`absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-gradient-radial ${colors.glow} opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl`}></div>
              
              {/* Glass border effect */}
              <div className="absolute inset-0 rounded-xl border border-dark/10"></div>
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colors.bg}`}></div>
              
              <div className="relative p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg} shadow-lg`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="ml-3 text-sm font-medium text-dark">
                      {stat.title}
                    </h3>
                  </div>
                  <button className="p-0.5 rounded-md hover:bg-dark/5">
                    <MoreHorizontal className="h-4 w-4 text-dark/60" />
                  </button>
                </div>
                
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-dark">
                    {stat.value}
                  </span>
                  <div className={`flex items-center text-xs px-2 py-1 rounded-full ${
                    stat.trendDirection === 'up' 
                      ? 'text-emerald-700 bg-emerald-500/10' 
                      : 'text-primary-700 bg-primary-500/10'
                  }`}>
                    {stat.trendDirection === 'up' 
                      ? <TrendingUp className="h-3 w-3 mr-1" /> 
                      : <TrendingDown className="h-3 w-3 mr-1" />
                    }
                    {stat.trend}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Rendu du graphique simplifié
  const renderChart = () => {
    if (loading.chart) {
      return (
        <div className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all h-96">
          <div className="absolute inset-0 bg-white"></div>
          <div className="absolute inset-0 rounded-xl border border-dark/10"></div>
          <div className="relative p-6 h-full flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
          </div>
        </div>
      );
    }
    
    if (error.chart) {
      return (
        <div className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all">
          <div className="absolute inset-0 bg-white"></div>
          <div className="absolute inset-0 rounded-xl border border-dark/10"></div>
          <div className="relative p-6">
            <div className="text-primary-500 flex flex-col items-center justify-center p-10">
              <AlertTriangle className="h-10 w-10 text-primary-500 mb-4" />
              <p>{error.chart}</p>
              <button 
                className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition-colors"
                onClick={() => {
                  setLoading(prev => ({ ...prev, chart: true }));
                  getPerformanceChartData().then(data => {
                    setChartData(data);
                    setError(prev => ({ ...prev, chart: null }));
                  }).catch(err => {
                    setError(prev => ({ ...prev, chart: "Impossible de charger les données du graphique" }));
                  }).finally(() => {
                    setLoading(prev => ({ ...prev, chart: false }));
                  });
                }}
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    if (!chartData) {
      return null;
    }

    // Calculer la valeur maximale pour normaliser
    const datasets = chartData.datasets;
    const allValues = datasets.flatMap(dataset => dataset.data);
    const maxValue = Math.max(...allValues);

    return (
      <div className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all">
        {/* Background and glow */}
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute -top-20 left-20 w-[500px] h-64 bg-secondary-500/5 rotate-45 filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-20 right-20 w-[300px] h-64 bg-primary-500/5 -rotate-45 filter blur-3xl opacity-20"></div>
        
        {/* Glass border effect */}
        <div className="absolute inset-0 rounded-xl border border-dark/10"></div>
        
        <div className="relative p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-dark">Matching IA</h2>
              <div className="h-0.5 w-12 bg-primary-500/40 mt-1 rounded-full"></div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-dark/5 rounded-lg border border-dark/5">
                <span className="text-xs text-dark/70">2024</span>
                <ChevronDown className="h-3.5 w-3.5 text-dark/40" />
              </div>
              
              <button className="p-1.5 rounded-lg hover:bg-dark/5 transition">
                <MoreHorizontal className="h-4 w-4 text-dark/40" />
              </button>
            </div>
          </div>
          
          <div className="mb-3 flex items-center space-x-3">
            {chartData.datasets.map((dataset, idx) => (
              <div key={idx} className="flex items-center space-x-1">
                <div className={`h-3 w-3 rounded-full ${
                  idx === 0 ? 'bg-primary-500/80' : 'bg-secondary-500/80'
                }`}></div>
                <span className="text-xs text-dark/60">{dataset.label}</span>
              </div>
            ))}
          </div>
          
          <div className="h-[260px] flex items-end space-x-2">
            {chartData.labels.map((label, idx) => {
              // Calculer les hauteurs normalisées pour cet index
              const heights = datasets.map(dataset => {
                const value = dataset.data[idx];
                return Math.round((value / maxValue) * 100);
              });
              
              return (
                <div key={idx} className="flex-1 space-y-1">
                  <div className="relative h-64 flex">
                    {heights.map((height, datasetIdx) => (
                      <div
                        key={datasetIdx}
                        className={`absolute bottom-0 w-full rounded-t-sm transform transition-all duration-500 
                          ${datasetIdx === 0 ? 
                            'bg-gradient-to-t from-primary-500/50 to-primary-500/80 z-10' : 
                            'bg-gradient-to-t from-secondary-500/50 to-secondary-500/80 z-0 left-0'
                          } 
                          ${datasetIdx === 0 ? 'hover:translate-y-[-5px]' : 'hover:translate-y-[-3px]'}
                        `}
                        style={{ 
                          height: `${height}%`,
                          width: datasetIdx === 0 ? '65%' : '100%',
                          left: datasetIdx === 0 ? '17.5%' : '0'
                        }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-dark text-white text-xs py-1 px-2 rounded pointer-events-none">
                          {datasets[datasetIdx].data[idx]}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-center text-dark/60">{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Rendu du bloc des actions rapides
  const renderQuickActions = () => {
    const actions = [
      { icon: User, label: 'Nouveau candidat', color: 'from-primary-500 to-primary-600' },
      { icon: Brain, label: 'Lancer recherche IA', color: 'from-secondary-500 to-secondary-600' },
      { icon: FileText, label: 'Créer offre', color: 'from-primary-400 to-secondary-500' },
      { icon: Bot, label: 'Assistant IA', color: 'from-secondary-400 to-primary-500' }
    ];
    
    return (
      <div className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all">
        {/* Background and glow */}
        <div className="absolute inset-0 bg-white"></div>
        
        {/* Glass border effect */}
        <div className="absolute inset-0 rounded-xl border border-dark/10"></div>
        
        <div className="relative p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-dark">
              Actions rapides
            </h2>
            <button className="p-1.5 rounded-lg hover:bg-dark/5 transition">
              <PlusCircle className="h-4 w-4 text-dark/40" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {actions.map((action, index) => (
              <button 
                key={index}
                className="group flex flex-col items-center justify-center p-4 rounded-lg border border-dark/5 bg-dark/[0.02] hover:bg-dark/[0.05] transition-all duration-300"
              >
                <div className="relative">
                  <div className={`absolute inset-0 blur-md opacity-40 rounded-full bg-gradient-to-r ${action.color}`}></div>
                  <div className={`relative p-3 rounded-full bg-gradient-to-br ${action.color} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                </div>
                <span className="mt-3 text-sm text-dark/80">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in text-dark bg-light min-h-screen p-6">
      {/* En-tête avec filtres */}
      <div className="relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-500/10 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary-500/10 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-dark">
              Tableau de bord <span className="text-primary-500">IA</span>
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-secondary-500 mt-2 rounded-full"></div>
            <p className="mt-3 text-dark/60 max-w-2xl">
              Bienvenue sur votre plateforme de recrutement IA. Consultez vos statistiques en temps réel et gérez vos candidats efficacement.
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-dark/40" />
              </div>
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 pr-4 py-2 bg-dark/5 border border-dark/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-dark text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-2 bg-dark/5 rounded-xl border border-dark/10">
              <Calendar className="h-4 w-4 text-dark/40" />
              <select className="bg-transparent border-none text-dark/80 text-sm focus:outline-none focus:ring-0">
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois-ci</option>
                <option value="year">Cette année</option>
              </select>
            </div>
            
            <button className="p-2 bg-dark/5 rounded-xl border border-dark/10 text-dark/40 hover:text-dark transition">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Onglets de navigation locale */}
        <div className="mt-8 flex space-x-1 overflow-x-auto scrollbar-none">
          {(['overview', 'workers', 'missions', 'analytics'] as const).map((tab) => {
            const labels = {
              overview: 'Vue d\'ensemble',
              workers: 'Candidats',
              missions: 'Offres',
              analytics: 'Analyses'
            };
            
            return (
              <button 
                key={tab}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  activeTab === tab 
                    ? 'bg-primary-500 text-white' 
                    : 'text-dark/60 hover:bg-dark/5 hover:text-dark/80'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Statistiques */}
      {renderStats()}

      {/* Sections principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          {renderChart()}
        </div>
        <div>
          {/* Card for job categories with updated style */}
          <div className="relative overflow-hidden rounded-xl backdrop-blur-md h-full transition-all">
            <div className="absolute inset-0 bg-white"></div>
            <div className="absolute inset-0 rounded-xl border border-dark/10"></div>
            <div className="relative p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-dark">Postes recherchés</h2>
                  <div className="h-0.5 w-12 bg-secondary-500 mt-1 rounded-full"></div>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-dark/5 transition">
                  <MoreHorizontal className="h-4 w-4 text-dark/40" />
                </button>
              </div>
              
              <div className="space-y-4">
                {!loading.categories && !error.categories && jobCategories.length > 0 ? (
                  jobCategories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-sm text-dark">{category.name}</span>
                        </div>
                        <span className="text-sm text-dark/60">{category.percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-dark/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                          style={{ width: `${category.percentage}%` }}>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-dark/40">Chargement des catégories...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simplified recent activities and upcoming missions */}
        <div className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all">
          <div className="absolute inset-0 bg-white"></div>
          <div className="absolute inset-0 rounded-xl border border-dark/10"></div>
          <div className="relative p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-dark">Derniers candidats matchés</h2>
                <div className="h-0.5 w-12 bg-primary-500 mt-1 rounded-full"></div>
              </div>
              <div className="text-xs text-primary-500 flex items-center">
                Voir tous <ArrowRight className="ml-1 h-3 w-3" />
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Simplified content - just placeholders */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 rounded-lg bg-dark/5 hover:bg-dark/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-primary-500/10">
                        <Brain className="h-4 w-4 text-primary-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-dark">Développeur Full-Stack</div>
                        <div className="text-xs text-dark/60">Score de matching : 95%</div>
                      </div>
                    </div>
                    <span className="text-xs text-primary-500 px-2 py-1 rounded-full bg-primary-500/10">
                      Contacté
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all">
          <div className="absolute inset-0 bg-white"></div>
          <div className="absolute inset-0 rounded-xl border border-dark/10"></div>
          <div className="relative p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-dark">Entretiens programmés</h2>
                <div className="h-0.5 w-12 bg-secondary-500 mt-1 rounded-full"></div>
              </div>
              <div className="text-xs text-secondary-500 flex items-center">
                Voir tous <ArrowRight className="ml-1 h-3 w-3" />
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Simplified content - just placeholders */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 rounded-lg bg-dark/5 hover:bg-dark/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-secondary-500/10">
                        <Calendar className="h-4 w-4 text-secondary-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-dark">Data Scientist</div>
                        <div className="text-xs text-dark/60">Demain à 14:00</div>
                      </div>
                    </div>
                    <button className="text-xs bg-secondary-500 text-white px-2 py-1 rounded-full">
                      Préparer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {renderQuickActions()}
        </div>
        <div>
          <div className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all h-full">
            <div className="absolute inset-0 bg-white"></div>
            <div className="absolute inset-0 rounded-xl border border-dark/10"></div>
            <div className="relative p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-dark">
                  Assistant IA
                </h2>
              </div>
              
              <div className="space-y-3">
                <div className="bg-primary-500/10 rounded-lg p-4 text-center">
                  <Zap className="h-10 w-10 text-primary-500 mx-auto mb-2" /> 
                  <p className="text-sm text-dark/80">Votre assistant IA est prêt à vous aider dans votre recrutement</p>
                  <button className="mt-3 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm transition-colors">
                    Poser une question
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};