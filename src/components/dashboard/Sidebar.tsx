import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Users,
  Briefcase,
  FileText,
  MessageSquare,
  BarChart,
  Settings,
  ChevronRight,
  LogOut,
  ChevronLeft,
  Menu,
  Link
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Logo } from './Logo';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { signOut } = useAuthStore();

  const navItems = [
    { icon: Home, label: 'Accueil', path: '/dashboard' },
    { icon: Users, label: 'Intérimaires', path: '/dashboard/workers' },
    { icon: Briefcase, label: 'Missions', path: '/dashboard/missions' },
    { icon: FileText, label: 'Documents', path: '/dashboard/documents' },
    { icon: Link, label: 'Matching', path: '/dashboard/matching' },
    { icon: MessageSquare, label: 'Assistant IA', path: '/dashboard/ai-chat' },
    { icon: BarChart, label: 'Rapports', path: '/dashboard/reports' },
    { icon: Settings, label: 'Paramètres', path: '/dashboard/settings' }
  ];

  // Groupes de navigation
  const navGroups = [
    {
      id: 'main',
      label: 'Principal',
      items: navItems.slice(0, 3) // Accueil, Intérimaires, Missions
    },
    {
      id: 'management',
      label: 'Gestion',
      items: navItems.slice(3, 6) // Documents, Matching, Assistant IA
    },
    {
      id: 'analytics',
      label: 'Analyses',
      items: navItems.slice(6) // Rapports, Paramètres
    }
  ];

  return (
    <aside 
      className={`h-full z-30 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-72' : 'w-20 overflow-hidden'
      }`}
      style={{
        background: 'linear-gradient(to bottom, rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.98))',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.3), inset 1px 0 0 rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* Menu mobile trigger */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          className="p-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      
      {/* Logo et bouton de toggle */}
      <div className="p-5 flex items-center justify-between border-b border-white/[0.06] h-16">
        <div className={`transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 hidden'}`}>
          <Logo size="sm" variant="light" />
        </div>
        <div className={`transition-all duration-300 ${!isOpen ? 'opacity-100 scale-100 block' : 'opacity-0 scale-95 hidden'} mx-auto`}>
          <div className="relative h-10 w-10 rounded-full flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 opacity-70 blur-[2px]"></div>
            <div className="relative h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg">
              O
            </div>
          </div>
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-full text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/5"
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto h-[calc(100vh-8rem)]">
        {navGroups.map((group) => (
          <div key={group.id} className="mb-8">
            {isOpen && (
              <h3 className="text-xs font-semibold text-gray-400/80 uppercase tracking-wider px-3 mb-3">
                {group.label}
              </h3>
            )}
            <div className="space-y-1.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center ${isOpen ? 'px-3' : 'px-0 justify-center'} py-2.5 text-sm rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary-500/10 text-primary-400 font-medium' 
                        : 'text-gray-300 hover:bg-white/[0.04] hover:text-white'
                    }`
                  }
                  title={!isOpen ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <div className={`relative ${!isOpen ? 'p-2' : ''}`}>
                        <item.icon className={`h-5 w-5 ${isOpen ? 'mr-3' : ''} ${
                          isActive 
                            ? 'text-primary-400' 
                            : 'text-gray-400'
                          } transition-colors duration-200`} 
                        />
                        {isActive && !isOpen && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-400 rounded-l-md"></div>
                        )}
                      </div>
                      {isOpen && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary-400 ml-2"></div>}
                        </>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/[0.06] h-16">
        <button
          onClick={() => signOut()}
          className={`flex items-center ${isOpen ? 'w-full px-3' : 'mx-auto p-2'} py-2 text-sm rounded-md transition-all duration-200 text-gray-400 hover:text-red-400 hover:bg-white/[0.03] group`}
          title={!isOpen ? 'Déconnexion' : undefined}
        >
          <LogOut className="h-5 w-5 group-hover:text-red-400 transition-colors duration-200" />
          {isOpen && <span className="ml-3">Déconnexion</span>}
        </button>
      </div>
      
      {/* Overlay pour fermer sur mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
          onClick={toggleSidebar}
        />
      )}
    </aside>
  );
};