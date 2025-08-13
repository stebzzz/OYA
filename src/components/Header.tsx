import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoLight from '../assets/logo-oya-light.svg';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200 translate-y-0 opacity-100' 
        : '-translate-y-full opacity-0'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src={logoLight} alt="OYA Intelligence" className="h-8" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#why-oya" className="text-[#223049] hover:text-[#ff6a3d] transition-colors">Fonctionnalités</a>
            

            <a href="#contact" className="text-[#223049] hover:text-[#ff6a3d] transition-colors">Contact</a>
            <Link 
              to="/auth"
              className="bg-[#ff6a3d] text-white px-6 py-2 rounded-lg hover:bg-[#ff6a3d]/90 transition-colors"
            >
              Connexion
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <a href="#why-oya" className="block px-3 py-2 text-[#223049] hover:text-[#ff6a3d]">Fonctionnalités</a>


              <a href="#contact" className="block px-3 py-2 text-[#223049] hover:text-[#ff6a3d]">Contact</a>
              <Link 
                to="/auth"
                className="block mx-3 mt-2 bg-[#ff6a3d] text-white px-6 py-2 rounded-lg text-center hover:bg-[#ff6a3d]/90 transition-colors"
              >
                Connexion
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;