import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#ff6a3d] to-[#9b6bff] rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#223049]">oya</h1>
              <p className="text-xs text-gray-600 -mt-1">intelligence</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-[#223049] hover:text-[#ff6a3d] transition-colors">Fonctionnalités</a>
            <a href="#roi" className="text-[#223049] hover:text-[#ff6a3d] transition-colors">ROI</a>

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
              <a href="#features" className="block px-3 py-2 text-[#223049] hover:text-[#ff6a3d]">Fonctionnalités</a>
              <a href="#roi" className="block px-3 py-2 text-[#223049] hover:text-[#ff6a3d]">ROI</a>

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