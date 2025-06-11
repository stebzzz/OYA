import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Play, 
  Pause, 
  Settings, 
  Plus, 
  Edit, 
  Trash2,
  Mail,
  MessageSquare,
  Calendar,
  Users,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Filter,
  TrendingUp,
  Bell,
  ArrowRight,
  Copy,
  Eye
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'candidate_added' | 'status_changed' | 'interview_scheduled' | 'deadline_approaching' | 'score_threshold';
    conditions: any;
  };
  actions: Array<{
    type: 'send_email' | 'send_sms' | 'create_task' | 'schedule_meeting' | 'update_status' | 'notify_team';
    config: any;
  }>;
  isActive: boolean;
  category: 'communication' | 'workflow' | 'notifications' | 'scoring';
  createdAt: Date;
  lastRun?: Date;
  runsCount: number;
  successRate: number;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  category: string;
  usage: number;
}

const AutomationHub: React.FC = () => {
  const [automations, setAutomations] = useState<AutomationRule[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [activeTab, setActiveTab] = useState<'rules' | 'templates' | 'analytics'>('rules');
  const [filterCategory, setFilterCategory] = useState('all');

  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    triggerType: 'candidate_added',
    triggerConditions: {},
    actions: [],
    category: 'workflow'
  });

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    content: '',
    category: 'general'
  });

  const toggleAutomation = async (id: string) => {
    setAutomations(prev => prev.map(automation => 
      automation.id === id 
        ? { ...automation, isActive: !automation.isActive }
        : automation
    ));
  };

  const deleteAutomation = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette automatisation ?')) {
      setAutomations(prev => prev.filter(automation => automation.id !== id));
    }
  };

  const createAutomation = () => {
    if (!newRule.name.trim()) {
      alert('Veuillez saisir un nom pour la règle');
      return;
    }

    const rule: AutomationRule = {
      id: Date.now().toString(),
      name: newRule.name,
      description: newRule.description,
      trigger: {
        type: newRule.triggerType as any,
        conditions: newRule.triggerConditions
      },
      actions: [],
      isActive: true,
      category: newRule.category as any,
      createdAt: new Date(),
      runsCount: 0,
      successRate: 100
    };

    setAutomations([rule, ...automations]);
    setShowRuleForm(false);
    setNewRule({
      name: '',
      description: '',
      triggerType: 'candidate_added',
      triggerConditions: {},
      actions: [],
      category: 'workflow'
    });
  };

  const createTemplate = () => {
    if (!newTemplate.name.trim() || !newTemplate.subject.trim()) {
      alert('Veuillez remplir le nom et le sujet du template');
      return;
    }

    const template: EmailTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      subject: newTemplate.subject,
      content: newTemplate.content,
      variables: extractVariables(newTemplate.content + ' ' + newTemplate.subject),
      category: newTemplate.category,
      usage: 0
    };

    setTemplates([template, ...templates]);
    setShowTemplateForm(false);
    setNewTemplate({
      name: '',
      subject: '',
      content: '',
      category: 'general'
    });
  };

  const extractVariables = (text: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g;
    const variables: string[] = [];
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    
    return variables;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication': return <Mail size={16} className="text-blue-500" />;
      case 'workflow': return <Target size={16} className="text-green-500" />;
      case 'notifications': return <Bell size={16} className="text-yellow-500" />;
      case 'scoring': return <BarChart3 size={16} className="text-purple-500" />;
      default: return <Zap size={16} className="text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'communication': return 'bg-blue-100 text-blue-800';
      case 'workflow': return 'bg-green-100 text-green-800';
      case 'notifications': return 'bg-yellow-100 text-yellow-800';
      case 'scoring': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAutomations = automations.filter(automation => 
    filterCategory === 'all' || automation.category === filterCategory
  );

  const stats = {
    totalRules: automations.length,
    activeRules: automations.filter(a => a.isActive).length,
    totalRuns: automations.reduce((acc, a) => acc + a.runsCount, 0),
    averageSuccessRate: automations.length > 0 
      ? Math.round(automations.reduce((acc, a) => acc + a.successRate, 0) / automations.length)
      : 0
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#9b6bff] to-purple-400 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <Zap className="mr-3" size={32} />
              Hub d'automatisation RH
            </h1>
            <p className="text-gray-200">
              Automatisez vos tâches répétitives et optimisez votre workflow de recrutement
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{stats.activeRules}</div>
            <div className="text-sm text-gray-200">Règles actives</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#9b6bff]/10 rounded-lg">
              <Zap className="text-[#9b6bff]" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-[#223049] mb-1">{stats.totalRules}</h3>
          <p className="text-gray-600 text-sm">Règles créées</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-[#223049] mb-1">{stats.totalRuns}</h3>
          <p className="text-gray-600 text-sm">Exécutions totales</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="text-blue-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-[#223049] mb-1">{stats.averageSuccessRate}%</h3>
          <p className="text-gray-600 text-sm">Taux de succès</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#ff6a3d]/10 rounded-lg">
              <Mail className="text-[#ff6a3d]" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-2xl font-bold text-[#223049] mb-1">{templates.length}</h3>
          <p className="text-gray-600 text-sm">Templates email</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('rules')}
              className={`py-4 border-b-2 font-medium text-sm ${
                activeTab === 'rules'
                  ? 'border-[#9b6bff] text-[#9b6bff]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Règles d'automatisation
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-[#9b6bff] text-[#9b6bff]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Templates d'emails
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-[#9b6bff] text-[#9b6bff]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Contenu des tabs */}
        <div className="p-6">
          {activeTab === 'rules' && (
            <div className="space-y-6">
              {/* Actions et filtres */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold text-[#223049]">Règles d'automatisation</h2>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9b6bff] focus:border-transparent"
                  >
                    <option value="all">Toutes les catégories</option>
                    <option value="communication">Communication</option>
                    <option value="workflow">Workflow</option>
                    <option value="notifications">Notifications</option>
                    <option value="scoring">Scoring</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowRuleForm(true)}
                  className="bg-[#9b6bff] text-white px-4 py-2 rounded-lg hover:bg-[#9b6bff]/90 transition-colors flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Nouvelle règle</span>
                </button>
              </div>

              {/* Liste des règles */}
              <div className="space-y-4">
                {filteredAutomations.length === 0 ? (
                  <div className="text-center py-12">
                    <Zap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune règle trouvée</h3>
                    <p className="text-gray-500">
                      {filterCategory === 'all' 
                        ? "Créez votre première règle d'automatisation."
                        : "Aucune règle dans cette catégorie."
                      }
                    </p>
                  </div>
                ) : (
                  filteredAutomations.map((automation) => (
                    <div key={automation.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-[#223049]">{automation.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(automation.category)}`}>
                              {automation.category}
                            </span>
                            <div className="flex items-center space-x-1">
                              {automation.isActive ? (
                                <CheckCircle size={16} className="text-green-500" />
                              ) : (
                                <AlertCircle size={16} className="text-gray-400" />
                              )}
                              <span className={`text-sm ${automation.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                                {automation.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-3">{automation.description}</p>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Play size={14} />
                              <span>{automation.runsCount} exécutions</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Target size={14} />
                              <span>{automation.successRate}% succès</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>
                                {automation.lastRun 
                                  ? `Dernière: ${automation.lastRun.toLocaleDateString('fr-FR')}`
                                  : 'Jamais exécutée'
                                }
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar size={14} />
                              <span>Créée: {automation.createdAt.toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => toggleAutomation(automation.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              automation.isActive
                                ? 'text-green-600 hover:bg-green-100'
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={automation.isActive ? 'Désactiver' : 'Activer'}
                          >
                            {automation.isActive ? <Pause size={16} /> : <Play size={16} />}
                          </button>

                          <button
                            onClick={() => setSelectedRule(automation)}
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

                          <button
                            onClick={() => deleteAutomation(automation.id)}
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
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6">
              {/* Actions */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#223049]">Templates d'emails</h2>
                <button
                  onClick={() => setShowTemplateForm(true)}
                  className="bg-[#ff6a3d] text-white px-4 py-2 rounded-lg hover:bg-[#ff6a3d]/90 transition-colors flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Nouveau template</span>
                </button>
              </div>

              {/* Liste des templates */}
              <div className="grid md:grid-cols-2 gap-6">
                {templates.length === 0 ? (
                  <div className="md:col-span-2 text-center py-12">
                    <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun template</h3>
                    <p className="text-gray-500">Créez votre premier template d'email.</p>
                  </div>
                ) : (
                  templates.map((template) => (
                    <div key={template.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#223049] mb-1">{template.name}</h3>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {template.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Dupliquer"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">Sujet:</div>
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                          {template.subject}
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">Aperçu:</div>
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border line-clamp-3">
                          {template.content.substring(0, 150)}...
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>Variables: {template.variables.length}</span>
                          <span>Utilisé: {template.usage} fois</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[#223049]">Analytics d'automatisation</h2>
              
              {automations.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune donnée</h3>
                  <p className="text-gray-500">Créez des règles d'automatisation pour voir les analytics.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-2">Règles actives</h3>
                    <div className="text-2xl font-bold text-green-600 mb-1">{stats.activeRules}</div>
                    <div className="text-sm text-green-700">sur {stats.totalRules} créées</div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Exécutions totales</h3>
                    <div className="text-2xl font-bold text-blue-600 mb-1">{stats.totalRuns}</div>
                    <div className="text-sm text-blue-700">depuis la création</div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="font-medium text-purple-800 mb-2">Taux de succès</h3>
                    <div className="text-2xl font-bold text-purple-600 mb-1">{stats.averageSuccessRate}%</div>
                    <div className="text-sm text-purple-700">moyenne globale</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal nouvelle règle */}
      {showRuleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#223049]">Créer une règle d'automatisation</h2>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la règle *
                </label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9b6bff] focus:border-transparent"
                  placeholder="ex: Notification nouveaux candidats"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9b6bff] focus:border-transparent"
                  placeholder="Décrivez ce que fait cette règle..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Déclencheur
                  </label>
                  <select
                    value={newRule.triggerType}
                    onChange={(e) => setNewRule({ ...newRule, triggerType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9b6bff] focus:border-transparent"
                  >
                    <option value="candidate_added">Nouveau candidat ajouté</option>
                    <option value="status_changed">Changement de statut</option>
                    <option value="interview_scheduled">Entretien planifié</option>
                    <option value="score_threshold">Seuil de score atteint</option>
                    <option value="deadline_approaching">Échéance approche</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={newRule.category}
                    onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9b6bff] focus:border-transparent"
                  >
                    <option value="communication">Communication</option>
                    <option value="workflow">Workflow</option>
                    <option value="notifications">Notifications</option>
                    <option value="scoring">Scoring</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowRuleForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={createAutomation}
                className="px-4 py-2 bg-[#9b6bff] text-white rounded-lg hover:bg-[#9b6bff]/90 transition-colors"
              >
                Créer la règle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal nouveau template */}
      {showTemplateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#223049]">Créer un template d'email</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du template *
                  </label>
                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                    placeholder="ex: Confirmation entretien"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                  >
                    <option value="candidature">Candidature</option>
                    <option value="entretien">Entretien</option>
                    <option value="relance">Relance</option>
                    <option value="refus">Refus</option>
                    <option value="general">Général</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet de l'email *
                </label>
                <input
                  type="text"
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                  placeholder="ex: Votre candidature chez {{company_name}}"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu de l'email
                </label>
                <textarea
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                  placeholder="Bonjour {{candidate_name}},

Nous avons bien reçu votre candidature...

Utilisez {{variable_name}} pour insérer des variables dynamiques."
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Variables disponibles</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>{{candidate_name}} - Nom du candidat</div>
                  <div>{{position}} - Poste</div>
                  <div>{{company_name}} - Nom de l'entreprise</div>
                  <div>{{recruiter_name}} - Nom du recruteur</div>
                  <div>{{interview_date}} - Date d'entretien</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowTemplateForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={createTemplate}
                className="px-4 py-2 bg-[#ff6a3d] text-white rounded-lg hover:bg-[#ff6a3d]/90 transition-colors"
              >
                Créer le template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomationHub;