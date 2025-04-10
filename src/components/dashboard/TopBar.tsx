import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Bell, Settings, Search, Menu, X, User, ChevronDown } from 'lucide-react';

export const TopBar = () => {
  const { user } = useAuthStore();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Notifications fictives pour la démo
  const notifications = [
    { id: 1, text: 'Nouvelle mission disponible', time: 'Il y a 5 min', read: false },
    { id: 2, text: 'Document validé avec succès', time: 'Il y a 2h', read: false },
    { id: 3, text: 'Rappel: Réunion à 14h', time: 'Il y a 5h', read: true },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 transition-colors duration-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo - visible uniquement sur mobile */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400 ml-2 lg:hidden font-heading">Oya</h1>
          </div>

          {/* Barre de recherche */}
          <div className="hidden md:flex flex-1 max-w-md ml-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                className="input pl-10 py-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:border-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-200"
              />
            </div>
          </div>

          {/* Actions et profil */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none relative transition-colors duration-200"
              >
                <Bell className="h-6 w-6" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-error dark:bg-red-400 animate-pulse"></span>
                )}
              </button>

              {/* Dropdown notifications */}
              {showNotifications && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-xl shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black/5 dark:ring-gray-700 focus:outline-none animate-fade-in overflow-hidden">
                  <div className="py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                    <h3 className="text-sm font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notification => (
                      <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.read ? 'border-l-4 border-primary-500 dark:border-primary-400 bg-primary-50/50 dark:bg-gray-700/60' : ''} transition-all duration-200`}>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{notification.text}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="py-2 px-4 border-t border-gray-100 dark:border-gray-700 text-center bg-gray-50 dark:bg-gray-800">
                    <button className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200">
                      Voir toutes les notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Menu utilisateur */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-full text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white">
                  {user?.email?.[0].toUpperCase() || 'U'}
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Dropdown menu utilisateur */}
              {showUserMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none animate-fade-in">
                  <div className="py-1">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                      <User className="inline-block h-4 w-4 mr-2" />
                      Mon profil
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                      <Settings className="inline-block h-4 w-4 mr-2" />
                      Paramètres
                    </a>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={() => useAuthStore.getState().signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <LogOut className="inline-block h-4 w-4 mr-2" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {showMobileMenu && (
          <div className="lg:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Accueil</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Intérimaires</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Missions</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Documents</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Assistant IA</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};