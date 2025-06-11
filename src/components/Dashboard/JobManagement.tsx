import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Share2, 
  Copy, 
  TrendingUp,
  Users,
  Clock,
  MapPin,
  Euro,
  Zap,
  FileText,
  Target,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  BarChart3
} from 'lucide-react';
import { intelligentJobService } from '../../services/intelligentJobService';

interface JobPosting {
  id: string;
  title: string;
  company: string;
  department: string;
  location: string;
  type: 'CDI' | 'CDD' | 'Stage' | 'Freelance' | 'Alternance';
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  status: 'draft' | 'published' | 'closed' | 'paused';
  aiScore: number;
  applications: number;
  views: number;
  createdAt: Date;
  publishedAt?: Date;
  closingDate?: Date;
  recruiterNotes: string;
  tags: string[];
}

const JobManagement: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);

  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    location: '',
    type: 'CDI' as const,
    experience: '',
    salary: '',
    description: '',
    requirements: '',
    benefits: '',
    skills: '',
    closingDate: '',
    recruiterNotes: '',
    tags: ''
  });

  const handleGenerateJobWithAI = async () => {
    if (!newJob.title) {
      alert('Veuillez spécifier au moins un titre de poste');
      return;
    }

    setIsGeneratingWithAI(true);
    
    try {
      const aiGenerated = await intelligentJobService.generateJobDescription({
        title: newJob.title,
        department: newJob.department,
        location: newJob.location,
        experience: newJob.experience,
        salary: newJob.salary
      });

      setNewJob({
        ...newJob,
        description: aiGenerated.description,
        requirements: aiGenerated.requirements.join('\n'),
        benefits: aiGenerated.benefits.join('\n'),
        skills: aiGenerated.skills.join(', ')
      });

    } catch (error) {
      console.error('Erreur génération IA:', error);
      alert('Erreur lors de la génération IA. Veuillez réessayer.');
    } finally {
      setIsGeneratingWithAI(false);
    }
  };

  const handleSaveJob = async () => {
    if (!newJob.title.trim()) {
      alert('Veuillez saisir un titre de poste');
      return;
    }

    const jobData: Omit<JobPosting, 'id' | 'aiScore' | 'applications' | 'views' | 'createdAt'> = {
      title: newJob.title,
      company: 'Mon Entreprise',
      department: newJob.department,
      location: newJob.location,
      type: newJob.type,
      experience: newJob.experience,
      salary: newJob.salary,
      description: newJob.description,
      requirements: newJob.requirements.split('\n').filter(r => r.trim()),
      benefits: newJob.benefits.split('\n').filter(b => b.trim()),
      skills: newJob.skills.split(',').map(s => s.trim()).filter(s => s),
      status: 'draft',
      closingDate: newJob.closingDate ? new Date(newJob.closingDate) : undefined,
      recruiterNotes: newJob.recruiterNotes,
      tags: newJob.tags.split(',').map(t => t.trim()).filter(t => t),
      publishedAt: undefined
    };

    // Scoring IA automatique
    const aiScore = await intelligentJobService.scoreJobPosting(jobData);

    const finalJob: JobPosting = {
      ...jobData,
      id: Date.now().toString(),
      aiScore,
      applications: 0,
      views: 0,
      createdAt: new Date()
    };

    setJobs([finalJob, ...jobs]);
    setShowJobForm(false);
    
    // Reset form
    setNewJob({
      title: '',
      department: '',
      location: '',
      type: 'CDI',
      experience: '',
      salary: '',
      description: '',
      requirements: '',
      benefits: '',
      skills: '',
      closingDate: '',
      recruiterNotes: '',
      tags: ''
    });
  };

  const handlePublishJob = async (jobId: string) => {
    const updatedJobs = jobs.map(job => 
      job.id === jobId 
        ? { ...job, status: 'published' as const, publishedAt: new Date() }
        : job
    );
    setJobs(updatedJobs);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      setJobs(jobs.filter(job => job.id !== jobId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publiée';
      case 'draft': return 'Brouillon';
      case 'closed': return 'Fermée';
      case 'paused': return 'En pause';
      default: return status;
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalJobs: jobs.length,
    published: jobs.filter(j => j.status === 'published').length,
    totalApplications: jobs.reduce((acc, j) => acc + j.applications, 0),
    averageScore: jobs.length > 0 ? Math.round(jobs.reduce((acc, j) => acc + j.aiScore, 0) / jobs.length) : 0
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ff6a3d] to-[#ff6a3d]/80 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <Briefcase className="mr-3" size={32} />
              Gestion des offres d'emploi
            </h1>
            <p className="text-gray-200">
              Créez et gérez vos offres avec l'assistance IA pour optimiser l'attractivité
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{stats.totalJobs}</div>
            <div className="text-sm text-gray-200">Offres créées</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-[#223049] mb-1">{stats.published}</h3>
          <p className="text-gray-600 text-sm">Offres publiées</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-[#223049] mb-1">{stats.totalApplications}</h3>
          <p className="text-gray-600 text-sm">Candidatures reçues</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#9b6bff]/10 rounded-lg">
              <Target className="text-[#9b6bff]" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-[#223049] mb-1">{stats.averageScore}%</h3>
          <p className="text-gray-600 text-sm">Score IA moyen</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#ff6a3d]/10 rounded-lg">
              <Eye className="text-[#ff6a3d]" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-[#223049] mb-1">
            {jobs.reduce((acc, j) => acc + j.views, 0)}
          </h3>
          <p className="text-gray-600 text-sm">Vues totales</p>
        </div>
      </div>

      {/* Actions et filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#223049]">Mes offres d'emploi</h2>
          <button
            onClick={() => setShowJobForm(true)}
            className="bg-[#ff6a3d] text-white px-6 py-2 rounded-lg hover:bg-[#ff6a3d]/90 transition-colors flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Nouvelle offre IA</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Rechercher une offre..."
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
            <option value="published">Publiées</option>
            <option value="draft">Brouillons</option>
            <option value="closed">Fermées</option>
            <option value="paused">En pause</option>
          </select>
        </div>
      </div>

      {/* Liste des offres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="divide-y divide-gray-100">
          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {jobs.length === 0 ? 'Aucune offre créée' : 'Aucune offre trouvée'}
              </h3>
              <p className="text-gray-500">
                {jobs.length === 0 
                  ? 'Commencez par créer votre première offre d\'emploi.'
                  : 'Aucune offre ne correspond à vos critères de recherche.'
                }
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-[#223049] text-lg">{job.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {getStatusLabel(job.status)}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Target size={14} className="text-[#9b6bff]" />
                        <span className="text-sm font-medium text-[#9b6bff]">{job.aiScore}% IA</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>{job.location || 'Non spécifiée'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Euro size={14} />
                        <span>{job.salary || 'Non spécifié'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{job.experience || 'Non spécifiée'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users size={14} />
                        <span>{job.applications} candidatures</span>
                      </div>
                    </div>

                    {job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.skills.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-[#ff6a3d]/10 text-[#ff6a3d] text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{job.skills.length - 4} autres
                          </span>
                        )}
                      </div>
                    )}

                    {job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {job.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="p-2 text-gray-400 hover:text-[#9b6bff] hover:bg-gray-100 rounded-lg transition-colors"
                      title="Voir détails"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit size={16} />
                    </button>

                    {job.status === 'draft' && (
                      <button
                        onClick={() => handlePublishJob(job.id)}
                        className="p-2 text-gray-400 hover:text-green-500 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Publier"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}

                    <button
                      className="p-2 text-gray-400 hover:text-[#ff6a3d] hover:bg-gray-100 rounded-lg transition-colors"
                      title="Partager"
                    >
                      <Share2 size={16} />
                    </button>

                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal création d'offre */}
      {showJobForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#223049]">Créer une nouvelle offre</h2>
                <button
                  onClick={() => setShowJobForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations de base */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre du poste *
                  </label>
                  <input
                    type="text"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                    placeholder="ex: Développeur Full-Stack Senior"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Département
                  </label>
                  <input
                    type="text"
                    value={newJob.department}
                    onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                    placeholder="ex: Engineering"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                    placeholder="ex: Paris, Remote"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de contrat
                  </label>
                  <select
                    value={newJob.type}
                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                  >
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Stage">Stage</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Alternance">Alternance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expérience requise
                  </label>
                  <input
                    type="text"
                    value={newJob.experience}
                    onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                    placeholder="ex: 3-5 ans"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fourchette salariale
                  </label>
                  <input
                    type="text"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                    placeholder="ex: 55-70k€"
                  />
                </div>
              </div>

              {/* Génération IA */}
              <div className="bg-gradient-to-r from-[#9b6bff]/10 to-[#ff6a3d]/10 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-[#223049] flex items-center">
                    <Zap className="text-[#9b6bff] mr-2" size={20} />
                    Génération automatique par IA
                  </h3>
                  <button
                    onClick={handleGenerateJobWithAI}
                    disabled={isGeneratingWithAI || !newJob.title}
                    className="bg-[#9b6bff] text-white px-4 py-2 rounded-lg hover:bg-[#9b6bff]/90 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isGeneratingWithAI ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Génération...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={16} />
                        <span>Générer avec l'IA</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  L'IA va générer automatiquement la description, les prérequis et les avantages basés sur les informations saisies.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description du poste
                </label>
                <textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                  placeholder="Description détaillée du poste..."
                />
              </div>

              {/* Prérequis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prérequis (un par ligne)
                </label>
                <textarea
                  value={newJob.requirements}
                  onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                  placeholder="Maîtrise de React
Node.js et TypeScript
Expérience AWS"
                />
              </div>

              {/* Avantages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avantages (un par ligne)
                </label>
                <textarea
                  value={newJob.benefits}
                  onChange={(e) => setNewJob({ ...newJob, benefits: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                  placeholder="Télétravail flexible
Mutuelle premium
Budget formation"
                />
              </div>

              {/* Compétences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compétences recherchées (séparées par des virgules)
                </label>
                <input
                  type="text"
                  value={newJob.skills}
                  onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                  placeholder="React, Node.js, TypeScript, AWS"
                />
              </div>

              {/* Date de clôture et notes */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de clôture
                  </label>
                  <input
                    type="date"
                    value={newJob.closingDate}
                    onChange={(e) => setNewJob({ ...newJob, closingDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={newJob.tags}
                    onChange={(e) => setNewJob({ ...newJob, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                    placeholder="Tech, Senior, Remote"
                  />
                </div>
              </div>

              {/* Notes recruteur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes recruteur (privées)
                </label>
                <textarea
                  value={newJob.recruiterNotes}
                  onChange={(e) => setNewJob({ ...newJob, recruiterNotes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                  placeholder="Notes internes sur le poste..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowJobForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveJob}
                  className="px-6 py-2 bg-[#ff6a3d] text-white rounded-lg hover:bg-[#ff6a3d]/90 transition-colors flex items-center space-x-2"
                >
                  <FileText size={16} />
                  <span>Enregistrer en brouillon</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal détails offre */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#223049]">{selectedJob.title}</h2>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Métriques */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedJob.applications}</div>
                  <div className="text-sm text-blue-700">Candidatures</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedJob.views}</div>
                  <div className="text-sm text-green-700">Vues</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{selectedJob.aiScore}%</div>
                  <div className="text-sm text-purple-700">Score IA</div>
                </div>
              </div>

              {/* Détails */}
              <div className="prose max-w-none">
                <h3>Description</h3>
                <p className="whitespace-pre-wrap">{selectedJob.description || 'Aucune description disponible.'}</p>

                <h3>Prérequis</h3>
                {selectedJob.requirements.length > 0 ? (
                  <ul>
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucun prérequis spécifié.</p>
                )}

                <h3>Avantages</h3>
                {selectedJob.benefits.length > 0 ? (
                  <ul>
                    {selectedJob.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucun avantage spécifié.</p>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
                <button className="px-4 py-2 bg-[#ff6a3d] text-white rounded-lg hover:bg-[#ff6a3d]/90 transition-colors">
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;