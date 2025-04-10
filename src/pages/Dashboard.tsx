import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, Clock, AlertTriangle, TrendingUp, TrendingDown, 
  Calendar, CheckCircle, BarChart4, Activity, ArrowRight, 
  Menu, MoreHorizontal, ChevronDown, User, FilePlus, 
  FileText, Wallet, PlusCircle, Settings, Search, MessageSquare,
  Loader2, X
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
        bg: 'from-violet-500 to-indigo-600',
        glow: 'from-violet-600/30 via-indigo-600/20 to-transparent',
        light: 'text-violet-300'
      },
      secondary: {
        bg: 'from-sky-500 to-cyan-600',
        glow: 'from-sky-600/30 via-cyan-600/20 to-transparent',
        light: 'text-sky-300'
      },
      success: {
        bg: 'from-emerald-500 to-teal-600',
        glow: 'from-emerald-600/30 via-teal-600/20 to-transparent',
        light: 'text-emerald-300'
      },
      warning: {
        bg: 'from-amber-500 to-yellow-600',
        glow: 'from-amber-600/30 via-yellow-600/20 to-transparent',
        light: 'text-amber-300'
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
              <div className="absolute inset-0 bg-gray-950/40"></div>
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
        <div className="bg-red-500/10 border border-red-400/20 p-4 rounded-xl text-red-300">
          <p>{error.stats}</p>
          <button 
            className="mt-2 px-3 py-1 bg-red-600/30 hover:bg-red-600/50 rounded text-sm transition-colors"
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
        title: 'Intérimaires actifs',
        value: stats.activeWorkers.toString(),
        trend: stats.trends.workers,
        trendDirection: stats.trends.workers.startsWith('+') ? 'up' : 'down',
        icon: Users,
        color: 'primary' as ColorKey
      },
      {
        title: 'Missions en cours',
        value: stats.activeMissions.toString(),
        trend: stats.trends.missions,
        trendDirection: stats.trends.missions.startsWith('+') ? 'up' : 'down',
        icon: Briefcase,
        color: 'secondary' as ColorKey
      },
      {
        title: 'Heures travaillées',
        value: stats.hoursWorked.toString(),
        trend: stats.trends.hours,
        trendDirection: stats.trends.hours.startsWith('+') ? 'up' : 'down',
        icon: Clock,
        color: 'success' as ColorKey
      },
      {
        title: 'Documents à valider',
        value: stats.pendingDocuments.toString(),
        trend: stats.trends.documents,
        trendDirection: stats.trends.documents.startsWith('+') ? 'up' : 'down',
        icon: AlertTriangle,
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
              <div className="absolute inset-0 bg-gray-950/40"></div>
              <div className={`absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-gradient-radial ${colors.glow} opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl`}></div>
              
              {/* Glass border effect */}
              <div className="absolute inset-0 rounded-xl border border-white/10"></div>
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colors.bg}`}></div>
              
              <div className="relative p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg} shadow-lg`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="ml-3 text-sm font-medium text-gray-300">
                      {stat.title}
                    </h3>
                  </div>
                  <button className="p-0.5 rounded-md hover:bg-white/5">
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
                
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">
                    {stat.value}
                  </span>
                  <div className={`flex items-center text-xs px-2 py-1 rounded-full ${
                    stat.trendDirection === 'up' 
                      ? 'text-emerald-300 bg-emerald-500/10' 
                      : 'text-rose-300 bg-rose-500/10'
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
          <div className="absolute inset-0 bg-gray-950/40"></div>
          <div className="absolute inset-0 rounded-xl border border-white/10"></div>
          <div className="relative p-6 h-full flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
          </div>
        </div>
      );
    }
    
    if (error.chart) {
      return (
        <div className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all">
          <div className="absolute inset-0 bg-gray-950/40"></div>
          <div className="absolute inset-0 rounded-xl border border-white/10"></div>
          <div className="relative p-6">
            <div className="text-red-300 flex flex-col items-center justify-center p-10">
              <AlertTriangle className="h-10 w-10 text-red-400 mb-4" />
              <p>{error.chart}</p>
              <button 
                className="mt-4 px-4 py-2 bg-primary-600/30 hover:bg-primary-600/50 rounded-lg text-white transition-colors"
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
        <div className="absolute inset-0 bg-gray-950/40"></div>
        <div className="absolute -top-20 left-20 w-[500px] h-64 bg-sky-600/5 rotate-45 filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-20 right-20 w-[300px] h-64 bg-violet-600/5 -rotate-45 filter blur-3xl opacity-20"></div>
        
        {/* Glass border effect */}
        <div className="absolute inset-0 rounded-xl border border-white/10"></div>
        
        <div className="relative p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Performance annuelle</h2>
              <div className="h-0.5 w-12 bg-sky-500/40 mt-1 rounded-full"></div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                <span className="text-xs text-gray-300">2024</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </div>
              
              <button className="p-1.5 rounded-lg hover:bg-white/5 transition">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="mb-3 flex items-center space-x-3">
            {chartData.datasets.map((dataset, idx) => (
              <div key={idx} className="flex items-center space-x-1">
                <div className={`h-3 w-3 rounded-full ${
                  idx === 0 ? 'bg-sky-500/80' : 'bg-violet-500/80'
                }`}></div>
                <span className="text-xs text-gray-400">{dataset.label}</span>
              </div>
            ))}
          </div>
          
          <div className="h-56 flex items-end justify-between pt-5 pb-1">
            {chartData.labels.map((label, i) => {
              // Calculer les hauteurs normalisées pour chaque ensemble de données
              const heights = chartData.datasets.map(ds => 
                Math.round((ds.data[i] / maxValue) * 100)
              );
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  {/* Pour chaque dataset, afficher une barre */}
                  {chartData.datasets.map((dataset, datasetIndex) => (
                    <div 
                      key={`${i}-${datasetIndex}`}
                      className={`w-full max-w-[24px] ${
                        datasetIndex === 0 
                          ? 'bg-gradient-to-t from-sky-600/80 to-sky-400/80 z-10'
                          : 'bg-gradient-to-t from-violet-600/80 to-violet-400/80 z-20 -mt-1'
                      } rounded-t-sm relative group`}
                      style={{ 
                        height: `${heights[datasetIndex]}%`,
                        marginLeft: datasetIndex === 1 ? '2px' : '0'
                      }}
                    >
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
                        {dataset.data[i]}
                      </div>
                    </div>
                  ))}
                  <span className="text-xs text-gray-500 mt-2">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Rendu de la section des activités récentes
  const renderRecentActivities = () => {
    if (loading.activities) {
      return (
        <div className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all">
          <div className="absolute inset-0 bg-gray-950/40"></div>
          <div className="absolute inset-0 rounded-xl border border-white/10"></div>
          <div className="relative p-6 h-80 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
          </div>
        </div>
      );
    }
    
    if (error.activities) {
      return (
        <div className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all">
          <div className="absolute inset-0 bg-gray-950/40"></div>
          <div className="absolute inset-0 rounded-xl border border-white/10"></div>
          <div className="relative p-6">
            <div className="text-red-300 flex flex-col items-center justify-center p-10">
              <AlertTriangle className="h-10 w-10 text-red-400 mb-4" />
              <p>{error.activities}</p>
              <button 
                className="mt-4 px-4 py-2 bg-primary-600/30 hover:bg-primary-600/50 rounded-lg text-white transition-colors"
                onClick={() => {
                  setLoading(prev => ({ ...prev, activities: true }));
                  getRecentActivities(4).then(data => {
                    setRecentActivities(data);
                    setError(prev => ({ ...prev, activities: null }));
                  }).catch(err => {
                    setError(prev => ({ ...prev, activities: "Impossible de charger les activités récentes" }));
                  }).finally(() => {
                    setLoading(prev => ({ ...prev, activities: false }));
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

    // Mapper les icônes selon le type d'activité
    const activityIcons = {
      mission: Briefcase,
      worker: Users,
      document: FileText,
      payment: Wallet
    };

    // Formater l'heure relative
    const formatRelativeTime = (date: Date) => {
      const now = new Date();
      const diffInMinutes = Math.round((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return "À l'instant";
      if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `Il y a ${diffInHours}h`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return "Hier";
      
      return `Il y a ${diffInDays} jours`;
    };

    return (
      <div className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all">
        {/* Background and glow */}
        <div className="absolute inset-0 bg-gray-950/40"></div>
        <div className="absolute -top-20 left-20 w-[300px] h-64 bg-primary-600/5 rotate-45 filter blur-3xl opacity-20"></div>
        
        {/* Glass border effect */}
        <div className="absolute inset-0 rounded-xl border border-white/10"></div>
        
        <div className="relative p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-600/20 rounded-xl blur-md"></div>
                <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-xl">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Activités récentes
                </h2>
                <div className="h-0.5 w-12 bg-violet-500/40 mt-1 rounded-full"></div>
              </div>
            </div>
            <button className="flex items-center space-x-1.5 text-sm text-gray-400 hover:text-violet-400 transition-colors duration-300 group">
              <span>Voir tout</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => {
                const IconComponent = activityIcons[activity.type] || AlertTriangle;
                const statusColors = {
                  success: {
                    bg: 'from-emerald-500 to-emerald-600',
                    border: 'rgba(52, 211, 153, 0.5)',
                    glow: 'rgba(52, 211, 153, 0.3)'
                  },
                  warning: {
                    bg: 'from-amber-500 to-amber-600',
                    border: 'rgba(251, 191, 36, 0.5)',
                    glow: 'rgba(251, 191, 36, 0.3)'
                  },
                  error: {
                    bg: 'from-rose-500 to-rose-600',
                    border: 'rgba(244, 63, 94, 0.5)',
                    glow: 'rgba(244, 63, 94, 0.3)'
                  }
                };
                
                const colors = statusColors[activity.status as StatusKey];
                
                return (
                  <div 
                    key={activity.id} 
                    className="group relative overflow-hidden p-4 rounded-lg hover:bg-white/[0.03] transition-all duration-300 backdrop-blur-sm"
                    style={{ 
                      borderLeft: `2px solid ${colors.border}`,
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <div className="absolute inset-0 blur-sm opacity-50 rounded-lg" 
                          style={{ background: colors.glow }}
                        ></div>
                        <div className={`relative flex-shrink-0 p-2 rounded-lg shadow-lg bg-gradient-to-br ${colors.bg} text-white`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-semibold text-white truncate">
                            {activity.title}
                          </p>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {formatRelativeTime(activity.timestamp instanceof Date 
                              ? activity.timestamp 
                              : (activity.timestamp as any).toDate())}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-400">
                          {activity.description}
                        </p>
                        {activity.createdBy && (
                          <div className="mt-2 flex items-center">
                            <div className="h-5 w-5 rounded-full bg-gray-700 text-[9px] flex items-center justify-center text-white">
                              {activity.createdBy.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="ml-1.5 text-xs text-gray-500">{activity.createdBy.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-400">Aucune activité récente</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Rendu des missions à venir
  const renderUpcomingMissions = () => {
    if (loading.missions) {
      return (
        <div className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all">
          <div className="absolute inset-0 bg-gray-950/40"></div>
          <div className="absolute inset-0 rounded-xl border border-white/10"></div>
          <div className="relative p-6 h-80 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
          </div>
        </div>
      );
    }
    
    if (error.missions) {
      return (
        <div className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all">
          <div className="absolute inset-0 bg-gray-950/40"></div>
          <div className="absolute inset-0 rounded-xl border border-white/10"></div>
          <div className="relative p-6">
            <div className="text-red-300 flex flex-col items-center justify-center p-10">
              <AlertTriangle className="h-10 w-10 text-red-400 mb-4" />
              <p>{error.missions}</p>
              <button 
                className="mt-4 px-4 py-2 bg-primary-600/30 hover:bg-primary-600/50 rounded-lg text-white transition-colors"
                onClick={() => {
                  setLoading(prev => ({ ...prev, missions: true }));
                  getUpcomingMissions(4).then(data => {
                    setUpcomingMissions(data);
                    setError(prev => ({ ...prev, missions: null }));
                  }).catch(err => {
                    setError(prev => ({ ...prev, missions: "Impossible de charger les missions à venir" }));
                  }).finally(() => {
                    setLoading(prev => ({ ...prev, missions: false }));
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

    // Formater la date
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('fr-FR', { 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
      }).format(date);
    };

    return (
      <div className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all">
        {/* Background and glow */}
        <div className="absolute inset-0 bg-gray-950/40"></div>
        <div className="absolute -bottom-20 right-20 w-[300px] h-64 bg-secondary-600/5 -rotate-45 filter blur-3xl opacity-20"></div>
        
        {/* Glass border effect */}
        <div className="absolute inset-0 rounded-xl border border-white/10"></div>
        
        <div className="relative p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-sky-600/20 rounded-xl blur-md"></div>
                <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-xl">
                  <Calendar className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Prochaines missions
                </h2>
                <div className="h-0.5 w-12 bg-sky-500/40 mt-1 rounded-full"></div>
              </div>
            </div>
            <button className="flex items-center space-x-1.5 text-sm text-gray-400 hover:text-sky-400 transition-colors duration-300 group">
              <span>Voir tout</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          <div className="space-y-4">
            {upcomingMissions.length > 0 ? (
              upcomingMissions.map((mission) => {
                const statusColors = {
                  confirmed: {
                    bg: 'from-emerald-500 to-emerald-600',
                    border: 'rgba(52, 211, 153, 0.5)',
                    text: 'text-emerald-400',
                    badgeBg: 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                  },
                  pending: {
                    bg: 'from-amber-500 to-amber-600',
                    border: 'rgba(251, 191, 36, 0.5)',
                    text: 'text-amber-400',
                    badgeBg: 'bg-gradient-to-r from-amber-500 to-amber-600'
                  },
                  completed: {
                    bg: 'from-blue-500 to-blue-600',
                    border: 'rgba(59, 130, 246, 0.5)',
                    text: 'text-blue-400',
                    badgeBg: 'bg-gradient-to-r from-blue-500 to-blue-600'
                  },
                  cancelled: {
                    bg: 'from-rose-500 to-rose-600',
                    border: 'rgba(244, 63, 94, 0.5)',
                    text: 'text-rose-400',
                    badgeBg: 'bg-gradient-to-r from-rose-500 to-rose-600'
                  }
                };
                
                const colors = statusColors[mission.status as MissionStatusKey];
                const missionDate = mission.date instanceof Date 
                  ? mission.date 
                  : (mission.date as any).toDate();
                
                return (
                  <div 
                    key={mission.id}
                    className="group relative overflow-hidden p-4 rounded-lg hover:bg-white/[0.03] transition-all duration-300 backdrop-blur-sm"
                    style={{ 
                      borderLeft: `2px solid ${colors.border}`,
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="absolute inset-0 blur-sm opacity-50 rounded-lg bg-blue-500/30"></div>
                        <div className="relative flex-shrink-0 p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                          <Briefcase className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {mission.title}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-400">
                              {mission.client}
                            </p>
                          </div>
                          <div className="flex flex-col items-end ml-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${colors.badgeBg} text-white shadow-lg`}>
                              {mission.status === 'confirmed' ? (
                                <>
                                  <CheckCircle className="h-2.5 w-2.5 mr-1" />
                                  Confirmée
                                </>
                              ) : mission.status === 'pending' ? (
                                <>
                                  <Clock className="h-2.5 w-2.5 mr-1" />
                                  En attente
                                </>
                              ) : mission.status === 'completed' ? (
                                <>
                                  <CheckCircle className="h-2.5 w-2.5 mr-1" />
                                  Terminée
                                </>
                              ) : (
                                <>
                                  <X className="h-2.5 w-2.5 mr-1" />
                                  Annulée
                                </>
                              )}
                            </span>
                            <span className="mt-1 text-xs text-gray-500">
                              {formatDate(missionDate)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex -space-x-2">
                              {Array(Math.min(mission.workersCount, 3)).fill(0).map((_, i) => (
                                <div key={i} className="h-6 w-6 rounded-full bg-gray-700 border border-gray-800 text-[9px] flex items-center justify-center text-white">
                                  {String.fromCharCode(65 + i)}
                                </div>
                              ))}
                              {mission.workersCount > 3 && (
                                <div className="h-6 w-6 rounded-full bg-gray-800 border border-gray-700 text-[9px] flex items-center justify-center text-white">
                                  +{mission.workersCount - 3}
                                </div>
                              )}
                            </div>
                            <span className="ml-2 text-xs text-gray-500">{mission.workersCount} intérimaires</span>
                          </div>
                          
                          <button className="p-1 rounded-md hover:bg-white/5 transition">
                            <MoreHorizontal className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-400">Aucune mission à venir</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Rendu des catégories d'emploi
  const renderJobCategories = () => {
    if (loading.categories) {
      return (
        <div className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all">
          <div className="absolute inset-0 bg-gray-950/40"></div>
          <div className="absolute inset-0 rounded-xl border border-white/10"></div>
          <div className="relative p-6 h-80 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
          </div>
        </div>
      );
    }
    
    if (error.categories) {
      return (
        <div className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all">
          <div className="absolute inset-0 bg-gray-950/40"></div>
          <div className="absolute inset-0 rounded-xl border border-white/10"></div>
          <div className="relative p-6">
            <div className="text-red-300 flex flex-col items-center justify-center p-10">
              <AlertTriangle className="h-10 w-10 text-red-400 mb-4" />
              <p>{error.categories}</p>
              <button 
                className="mt-4 px-4 py-2 bg-primary-600/30 hover:bg-primary-600/50 rounded-lg text-white transition-colors"
                onClick={() => {
                  setLoading(prev => ({ ...prev, categories: true }));
                  getJobCategories().then(data => {
                    setJobCategories(data);
                    setError(prev => ({ ...prev, categories: null }));
                  }).catch(err => {
                    setError(prev => ({ ...prev, categories: "Impossible de charger les catégories d'emploi" }));
                  }).finally(() => {
                    setLoading(prev => ({ ...prev, categories: false }));
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

    // Mapping des couleurs pour les catégories
    const colorMapping = [
      'from-violet-500 to-indigo-600',
      'from-sky-500 to-cyan-600',
      'from-emerald-500 to-teal-600',
      'from-amber-500 to-yellow-600',
      'from-rose-500 to-pink-600'
    ];

    return (
      <div className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all">
        {/* Background and glow */}
        <div className="absolute inset-0 bg-gray-950/40"></div>
        <div className="absolute -top-20 right-20 w-[300px] h-64 bg-emerald-600/5 -rotate-45 filter blur-3xl opacity-20"></div>
        
        {/* Glass border effect */}
        <div className="absolute inset-0 rounded-xl border border-white/10"></div>
        
        <div className="relative p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-600/20 rounded-xl blur-md"></div>
                <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
                  <BarChart4 className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Répartition des missions
                </h2>
                <div className="h-0.5 w-12 bg-emerald-500/40 mt-1 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-5">
            {jobCategories.length > 0 ? (
              jobCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${colorMapping[index % colorMapping.length]}`}></div>
                      <span className="text-sm text-white">{category.name}</span>
                    </div>
                    <span className="text-sm text-gray-400">{category.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${colorMapping[index % colorMapping.length]}`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-400">Aucune catégorie disponible</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Rendu du bloc des actions rapides
  const renderQuickActions = () => {
    const actions = [
      { icon: User, label: 'Nouvel intérimaire', color: 'from-violet-500 to-indigo-600' },
      { icon: FilePlus, label: 'Nouvelle mission', color: 'from-sky-500 to-cyan-600' },
      { icon: FileText, label: 'Nouveau document', color: 'from-emerald-500 to-teal-600' },
      { icon: Wallet, label: 'Facturation', color: 'from-amber-500 to-yellow-600' }
    ];
    
    return (
      <div className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all">
        {/* Background and glow */}
        <div className="absolute inset-0 bg-gray-950/40"></div>
        
        {/* Glass border effect */}
        <div className="absolute inset-0 rounded-xl border border-white/10"></div>
        
        <div className="relative p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">
              Actions rapides
            </h2>
            <button className="p-1.5 rounded-lg hover:bg-white/5 transition">
              <PlusCircle className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {actions.map((action, index) => (
              <button 
                key={index}
                className="group flex flex-col items-center justify-center p-4 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="relative">
                  <div className={`absolute inset-0 blur-md opacity-40 rounded-full bg-gradient-to-r ${action.color}`}></div>
                  <div className={`relative p-3 rounded-full bg-gradient-to-br ${action.color} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                </div>
                <span className="mt-3 text-sm text-gray-300">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in text-white">
      {/* En-tête avec filtres */}
      <div className="relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-600/20 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary-600/20 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-transparent bg-gradient-to-r from-primary-400 via-blue-400 to-secondary-400 bg-clip-text">
              Tableau de bord
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-secondary-500 mt-2 rounded-full"></div>
            <p className="mt-3 text-gray-400 max-w-2xl">
              Bienvenue sur votre espace de gestion. Consultez vos statistiques en temps réel et gérez vos ressources efficacement.
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-white text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
              <Calendar className="h-4 w-4 text-gray-400" />
              <select className="bg-transparent border-none text-gray-300 text-sm focus:outline-none focus:ring-0">
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois-ci</option>
                <option value="year">Cette année</option>
              </select>
            </div>
            
            <button className="p-2 bg-white/5 rounded-xl border border-white/10 text-gray-400 hover:text-white transition">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Onglets de navigation locale */}
        <div className="mt-8 flex space-x-1 overflow-x-auto scrollbar-none">
          {(['overview', 'workers', 'missions', 'analytics'] as const).map((tab) => {
            const labels = {
              overview: 'Vue d\'ensemble',
              workers: 'Intérimaires',
              missions: 'Missions',
              analytics: 'Analyses'
            };
            
            return (
              <button 
                key={tab}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  activeTab === tab 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-300'
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
          {renderJobCategories()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderRecentActivities()}
        {renderUpcomingMissions()}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {renderQuickActions()}
        </div>
        <div>
          <div className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all h-full bg-gray-950/40 border border-white/10">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white">
                  Ressources
                </h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { title: 'Guide de démarrage', icon: FileText },
                  { title: 'Formation en ligne', icon: Calendar },
                  { title: 'Support technique', icon: MessageSquare }
                ].map((resource, index) => (
                  <a 
                    key={index}
                    href="#"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition"
                  >
                    <div className="p-2 rounded-lg bg-white/5">
                      <resource.icon className="h-4 w-4 text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-300">{resource.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};