import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Sparkles, Zap, Users, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    {
      label: 'Solutions',
      href: '#features',
      icon: Sparkles,
      dropdown: [
        { label: 'Matching IA', href: '#matching', icon: Zap },
        { label: 'Gestion candidats', href: '#candidates', icon: Users },
        { label: 'Analytics', href: '#analytics', icon: BarChart3 }
      ]
    },
    { label: 'ROI Calculator', href: '#roi', icon: BarChart3 },
    { label: 'Tarifs', href: '#pricing', icon: null },
    { label: 'À propos', href: '#about', icon: null }
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg shadow-black/5' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Enhanced */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ff6a3d] via-[#ff8a5d] to-[#9b6bff] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="w-4 h-4 bg-white rounded-full relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ff6a3d]/20 to-[#9b6bff]/20 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-[#ff6a3d] to-[#9b6bff] rounded-full opacity-75 animate-ping"></div>
              </div>
              <div className="group-hover:scale-105 transition-transform duration-300">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#223049] to-[#ff6a3d] bg-clip-text text-transparent">oya</h1>
                <p className="text-xs text-gray-600 -mt-1 font-medium tracking-wider">AI INTELLIGENCE</p>
              </div>
            </Link>

            {/* Desktop Navigation Enhanced */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item, index) => (
                <div key={index} className="relative group">
                  {item.dropdown ? (
                    <div 
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button className="flex items-center space-x-2 px-4 py-3 text-[#223049] hover:text-[#ff6a3d] transition-all duration-300 rounded-xl hover:bg-gray-50/80 group">
                        {item.icon && <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                        <span className="font-medium">{item.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                          activeDropdown === item.label ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className={`absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden transition-all duration-300 ${
                        activeDropdown === item.label 
                          ? 'opacity-100 visible translate-y-0' 
                          : 'opacity-0 invisible -translate-y-2'
                      }`}>
                        <div className="p-2">
                          {item.dropdown.map((dropItem, dropIndex) => (
                            <a
                              key={dropIndex}
                              href={dropItem.href}
                              className="flex items-center space-x-3 px-4 py-3 text-[#223049] hover:text-[#ff6a3d] hover:bg-gradient-to-r hover:from-[#ff6a3d]/5 hover:to-[#9b6bff]/5 rounded-xl transition-all duration-300 group"
                            >
                              <dropItem.icon className="w-5 h-5 text-[#ff6a3d] group-hover:scale-110 transition-transform" />
                              <span className="font-medium">{dropItem.label}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <a 
                      href={item.href} 
                      className="flex items-center space-x-2 px-4 py-3 text-[#223049] hover:text-[#ff6a3d] transition-all duration-300 rounded-xl hover:bg-gray-50/80 group"
                    >
                      {item.icon && <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                      <span className="font-medium">{item.label}</span>
                    </a>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link 
                to="/auth"
                className="px-4 py-2 text-[#223049] hover:text-[#ff6a3d] transition-all duration-300 rounded-xl hover:bg-gray-50/80 font-medium"
              >
                Connexion
              </Link>
              <Link 
                to="/auth"
                className="relative px-6 py-3 bg-gradient-to-r from-[#ff6a3d] to-[#ff8a5d] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff8a5d] to-[#9b6bff] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center space-x-2">
                  <span>Démarrer gratuitement</span>
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Mobile menu button Enhanced */}
            <button
              className="md:hidden relative p-2 rounded-xl hover:bg-gray-50/80 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="relative w-6 h-6">
                <span className={`absolute block w-6 h-0.5 bg-[#223049] transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 top-3' : 'top-1'
                }`}></span>
                <span className={`absolute block w-6 h-0.5 bg-[#223049] top-3 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`absolute block w-6 h-0.5 bg-[#223049] transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 top-3' : 'top-5'
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Enhanced */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white/95 backdrop-blur-md border-t border-gray-200/50 mx-4 mb-4 rounded-2xl shadow-xl">
            <div className="p-6 space-y-4">
              {navigationItems.map((item, index) => (
                <div key={index}>
                  <a 
                    href={item.href} 
                    className="flex items-center space-x-3 px-4 py-3 text-[#223049] hover:text-[#ff6a3d] hover:bg-gradient-to-r hover:from-[#ff6a3d]/5 hover:to-[#9b6bff]/5 rounded-xl transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span className="font-medium">{item.label}</span>
                  </a>
                  {item.dropdown && (
                    <div className="ml-8 mt-2 space-y-2">
                      {item.dropdown.map((dropItem, dropIndex) => (
                        <a
                          key={dropIndex}
                          href={dropItem.href}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:text-[#ff6a3d] rounded-lg transition-all duration-300"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <dropItem.icon className="w-4 h-4" />
                          <span>{dropItem.label}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-200/50 space-y-3">
                <Link 
                  to="/auth"
                  className="block px-4 py-3 text-[#223049] hover:text-[#ff6a3d] hover:bg-gray-50/80 rounded-xl transition-all duration-300 font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link 
                  to="/auth"
                  className="block px-6 py-3 bg-gradient-to-r from-[#ff6a3d] to-[#ff8a5d] text-white rounded-xl font-semibold text-center shadow-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Démarrer gratuitement
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-20"></div>
    </>
  );
};

export default Header;