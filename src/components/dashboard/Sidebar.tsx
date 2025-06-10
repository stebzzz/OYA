import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Star, 
  Settings, 
  LogOut, 
  Home,
  Search,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { logout, currentUser } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'candidates', label: 'Candidats', icon: Users },
    { id: 'sourcing', label: 'Sourcing IA', icon: Search },
    { id: 'pipeline', label: 'Pipeline', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'calendar', label: 'Agenda', icon: Calendar },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="fixed left-0 top-0 w-64 h-full bg-[#223049] text-white z-50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#ff6a3d] to-[#9b6bff] rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold">oya</h1>
            <p className="text-sm opacity-75">intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-[#ff6a3d] text-white' 
                  : 'hover:bg-white/10 text-gray-300 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-[#ff6a3d] rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {currentUser?.displayName || 'Utilisateur'}
            </p>
            <p className="text-xs text-gray-300 truncate">
              {currentUser?.email}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'settings' 
                ? 'bg-[#ff6a3d] text-white' 
                : 'hover:bg-white/10 text-gray-300 hover:text-white'
            }`}
          >
            <Settings size={16} />
            <span className="text-sm">Paramètres</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors hover:bg-red-500/20 text-gray-300 hover:text-red-300"
          >
            <LogOut size={16} />
            <span className="text-sm">Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;