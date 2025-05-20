import React, { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  FileText,
  Languages,
  HelpCircle,
  Save,
  Lock,
  AtSign,
  Building,
  MapPin,
  Phone,
  Globe,
  ToggleLeft,
  ToggleRight,
  Clock,
  ChevronRight,
} from 'lucide-react';

export const SettingsList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('fr');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSave = () => {
    setLoading(true);
    // Simulation d'une sauvegarde
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'billing', label: 'Facturation', icon: CreditCard },
    { id: 'company', label: 'Entreprise', icon: Building },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'language', label: 'Langue', icon: Languages },
    { id: 'help', label: 'Aide', icon: HelpCircle },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-bleu">Paramètres</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation des paramètres */}
        <div className="lg:col-span-1">
          <div className="bg-ivoire rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <nav className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-left mb-1 ${
                    activeTab === tab.id
                      ? 'bg-violet/10 text-violet font-medium'
                      : 'text-bleu hover:bg-gray-100 hover:text-orange'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="h-5 w-5 mr-3" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenu des paramètres */}
        <div className="lg:col-span-3">
          <div className="bg-ivoire rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-bleu">Informations personnelles</h2>
                  <p className="text-sm text-gray-600">
                    Mettez à jour vos informations personnelles et vos coordonnées.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Prénom</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-violet focus:border-violet text-bleu"
                        defaultValue="Stéphane"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Nom</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-violet focus:border-violet text-bleu"
                        defaultValue="Martin"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <AtSign className="h-5 w-5 text-orange" />
                        </div>
                        <input
                          type="email"
                          className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-violet focus:border-violet text-bleu"
                          defaultValue="stephane.martin@oya.fr"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Téléphone</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-orange" />
                        </div>
                        <input
                          type="tel"
                          className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-violet focus:border-violet text-bleu"
                          defaultValue="+33 6 12 34 56 78"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-ivoire bg-orange hover:bg-orange/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange"
                      onClick={handleSave}
                    >
                      {loading ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-ivoire" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Enregistrer
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-bleu">Paramètres de notifications</h2>
                  <p className="text-sm text-gray-600">
                    Configurez les notifications que vous souhaitez recevoir.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                      <div>
                        <h3 className="text-sm font-medium text-bleu">Notifications</h3>
                        <p className="text-xs text-gray-600 mt-1">Activer ou désactiver toutes les notifications</p>
                      </div>
                      <button
                        className="text-gray-500"
                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                      >
                        {notificationsEnabled ? (
                          <ToggleRight className="h-6 w-6 text-violet" />
                        ) : (
                          <ToggleLeft className="h-6 w-6" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                      <div>
                        <h3 className="text-sm font-medium text-bleu">Notifications par email</h3>
                        <p className="text-xs text-gray-600 mt-1">Recevoir des notifications par email</p>
                      </div>
                      <button
                        className={`text-gray-500 ${!notificationsEnabled && 'opacity-50 cursor-not-allowed'}`}
                        onClick={() => notificationsEnabled && setEmailNotifications(!emailNotifications)}
                        disabled={!notificationsEnabled}
                      >
                        {emailNotifications && notificationsEnabled ? (
                          <ToggleRight className="h-6 w-6 text-violet" />
                        ) : (
                          <ToggleLeft className="h-6 w-6" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                      <div>
                        <h3 className="text-sm font-medium text-bleu">Notifications push</h3>
                        <p className="text-xs text-gray-600 mt-1">Recevoir des notifications push dans le navigateur</p>
                      </div>
                      <button
                        className={`text-gray-500 ${!notificationsEnabled && 'opacity-50 cursor-not-allowed'}`}
                        onClick={() => notificationsEnabled && setPushNotifications(!pushNotifications)}
                        disabled={!notificationsEnabled}
                      >
                        {pushNotifications && notificationsEnabled ? (
                          <ToggleRight className="h-6 w-6 text-violet" />
                        ) : (
                          <ToggleLeft className="h-6 w-6" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-5">
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-ivoire bg-orange hover:bg-orange/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange"
                      onClick={handleSave}
                    >
                      {loading ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-ivoire" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Enregistrer
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-bleu">Paramètres de sécurité</h2>
                  <p className="text-sm text-gray-600">
                    Mettez à jour vos paramètres de sécurité et de confidentialité.
                  </p>

                  <div>
                    <h3 className="text-md font-medium text-bleu mb-4">Changer le mot de passe</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Mot de passe actuel</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-orange" />
                          </div>
                          <input
                            type="password"
                            className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-violet focus:border-violet text-bleu"
                            placeholder="••••••••••"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Nouveau mot de passe</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-orange" />
                          </div>
                          <input
                            type="password"
                            className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-violet focus:border-violet text-bleu"
                            placeholder="••••••••••"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Confirmer le nouveau mot de passe</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-orange" />
                          </div>
                          <input
                            type="password"
                            className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-violet focus:border-violet text-bleu"
                            placeholder="••••••••••"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-ivoire bg-orange hover:bg-orange/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange"
                      onClick={handleSave}
                    >
                      {loading ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-ivoire" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Enregistrer
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'company' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-bleu">Informations de l'entreprise</h2>
                  <p className="text-sm text-gray-600">
                    Mettez à jour les informations concernant votre entreprise.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Nom de l'entreprise</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-violet focus:border-violet text-bleu"
                        defaultValue="OYA Solutions"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Numéro SIRET</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-violet focus:border-violet text-bleu"
                        defaultValue="12345678901234"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Adresse</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-orange" />
                        </div>
                        <input
                          type="text"
                          className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-violet focus:border-violet text-bleu"
                          defaultValue="123 Avenue des Champs-Élysées"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Site web</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-orange" />
                        </div>
                        <input
                          type="url"
                          className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-violet focus:border-violet text-bleu"
                          defaultValue="https://oya-solutions.fr"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-ivoire bg-orange hover:bg-orange/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange"
                      onClick={handleSave}
                    >
                      {loading ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-ivoire" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Enregistrer
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'language' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-bleu">Paramètres de langue et d'affichage</h2>
                  <p className="text-sm text-gray-600">
                    Personnalisez l'affichage et la langue de l'interface.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Langue</label>
                      <select
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-violet focus:border-violet text-bleu"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                      <div>
                        <h3 className="text-sm font-medium text-bleu">Mode sombre</h3>
                        <p className="text-xs text-gray-600 mt-1">Activer le mode sombre pour l'interface</p>
                      </div>
                      <button
                        className="text-gray-500"
                        onClick={() => setDarkMode(!darkMode)}
                      >
                        {darkMode ? (
                          <ToggleRight className="h-6 w-6 text-violet" />
                        ) : (
                          <ToggleLeft className="h-6 w-6" />
                        )}
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Fuseau horaire</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock className="h-5 w-5 text-orange" />
                        </div>
                        <select
                          className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-violet focus:border-violet text-bleu"
                        >
                          <option value="Europe/Paris">Europe/Paris (UTC+01:00)</option>
                          <option value="Europe/London">Europe/London (UTC+00:00)</option>
                          <option value="America/New_York">America/New_York (UTC-05:00)</option>
                          <option value="Asia/Tokyo">Asia/Tokyo (UTC+09:00)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-ivoire bg-orange hover:bg-orange/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange"
                      onClick={handleSave}
                    >
                      {loading ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-ivoire" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Enregistrer
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'help' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-bleu">Centre d'aide</h2>
                  <p className="text-sm text-gray-600">
                    Retrouvez de l'aide et des ressources pour utiliser notre plateforme.
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-violet mr-3" />
                          <div>
                            <h3 className="text-sm font-medium text-bleu">Documentation</h3>
                            <p className="text-xs text-gray-600 mt-1">Consulter la documentation complète</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <HelpCircle className="h-5 w-5 text-violet mr-3" />
                          <div>
                            <h3 className="text-sm font-medium text-bleu">FAQ</h3>
                            <p className="text-xs text-gray-600 mt-1">Questions fréquemment posées</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <AtSign className="h-5 w-5 text-violet mr-3" />
                          <div>
                            <h3 className="text-sm font-medium text-bleu">Contacter le support</h3>
                            <p className="text-xs text-gray-600 mt-1">Obtenir de l'aide personnalisée</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeTab === 'billing' || activeTab === 'documents') && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-bleu">{activeTab === 'billing' ? 'Facturation' : 'Documents'}</h2>
                  <p className="text-sm text-gray-600">
                    {activeTab === 'billing' 
                      ? 'Gérez vos paramètres de facturation et votre abonnement.'
                      : 'Gérez vos modèles de documents et vos paramètres de documents.'}
                  </p>

                  <div className="p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
                      {activeTab === 'billing' ? (
                        <CreditCard className="h-8 w-8 text-gray-400" />
                      ) : (
                        <FileText className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <h3 className="mt-3 text-sm font-medium text-bleu">
                      {activeTab === 'billing' 
                        ? 'Paramètres de facturation'
                        : 'Paramètres de documents'}
                    </h3>
                    <p className="mt-2 text-xs text-gray-600">
                      {activeTab === 'billing' 
                        ? 'Cette fonctionnalité sera disponible prochainement.'
                        : 'Cette fonctionnalité sera disponible prochainement.'}
                    </p>
                    <div className="mt-4">
                      <button
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-bleu hover:bg-gray-100 focus:outline-none"
                      >
                        En savoir plus
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 