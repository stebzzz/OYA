import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Bell, Settings, Search, Menu, X, User, ChevronDown } from 'lucide-react';

export const TopBar = () => {
  const { user, signOut } = useAuthStore();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Notifications fictives pour la démo
  const notifications = [
    { id: 1, text: 'Nouvelle offre disponible', time: 'Il y a 5 min', read: false },
    { id: 2, text: 'Document validé avec succès', time: 'Il y a 2h', read: false },
    { id: 3, text: 'Rappel: Réunion à 14h', time: 'Il y a 5h', read: true },
  ];

  return (
    <header className="bg-ivoire shadow-sm sticky top-0 z-10 transition-colors duration-200 w-full">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Recherche */}
          <div className="flex-1 min-w-0 max-w-xs">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-orange" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 rounded-lg text-bleu placeholder-gray-500 bg-white border border-gray-300 focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet sm:text-sm"
                placeholder="Rechercher..."
              />
            </div>
          </div>
          
          {/* Menu central pour grand écran */}
          <div className="hidden lg:flex lg:space-x-8 mx-auto">
            <a href="#" className="px-3 py-2 text-sm font-medium text-bleu hover:text-orange transition-colors">
              Tableau de bord
            </a>
            <a href="#" className="px-3 py-2 text-sm font-medium text-bleu hover:text-orange transition-colors">
              Candidats
            </a>
            <a href="#" className="px-3 py-2 text-sm font-medium text-bleu hover:text-orange transition-colors">
              Offres
            </a>
            <a href="#" className="px-3 py-2 text-sm font-medium text-bleu hover:text-orange transition-colors">
              Matching IA
            </a>
          </div>
          
          {/* Droite */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1 rounded-full text-bleu hover:text-orange focus:outline-none"
              >
                <span className="sr-only">Voir les notifications</span>
                <div className="relative">
                  <Bell className="h-6 w-6" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-orange transform translate-x-1/2 -translate-y-1/2"></span>
                  )}
                </div>
              </button>
              
              {showNotifications && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-bleu">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(notification => (
                        <a
                          key={notification.id}
                          href="#"
                          className={`block px-4 py-3 hover:bg-gray-100 ${!notification.read ? 'bg-violet/5' : ''}`}
                        >
                          <div className="flex justify-between">
                            <p className={`text-sm ${!notification.read ? 'font-medium text-bleu' : 'text-gray-600'}`}>
                              {notification.text}
                            </p>
                            {!notification.read && (
                              <span className="bg-violet w-2 h-2 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </a>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200">
                      <a href="#" className="text-sm font-medium text-violet hover:text-violet/80">
                        Voir toutes les notifications
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Menu utilisateur */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-bleu hover:text-orange transition-colors focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-orange/10 flex items-center justify-center text-orange">
                  <User className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium hidden md:block">{user?.displayName || 'Utilisateur'}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showUserMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-bleu hover:bg-gray-100"
                    >
                      Votre profil
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-bleu hover:bg-gray-100"
                    >
                      Paramètres
                    </a>
                    <button
                      onClick={() => { 
                        setShowUserMenu(false); 
                        signOut(); 
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Bouton menu mobile */}
            <div className="flex lg:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-bleu hover:text-orange focus:outline-none"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <span className="sr-only">Ouvrir le menu</span>
                {showMobileMenu ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Menu mobile */}
        {showMobileMenu && (
          <div className="lg:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-bleu hover:bg-gray-100">Accueil</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-bleu hover:bg-gray-100">Candidats</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-bleu hover:bg-gray-100">Offres</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-bleu hover:bg-gray-100">Documents</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-bleu hover:bg-gray-100">Assistant IA</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};