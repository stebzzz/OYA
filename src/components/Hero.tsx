import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const scrollToContent = () => {
    const nextSection = document.getElementById('why-oya');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#f4f0ec] via-white to-[#f4f0ec]">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#ff6a3d]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#9b6bff]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Main content */}
      <div className="text-center px-4 z-10 relative max-w-6xl mx-auto">
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Main title */}
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black leading-tight mb-8">
            <span className="block text-[#223049] mb-4">
              Un poste de pilotage.
            </span>
            <span className="block text-[#223049] mb-4">
              Pas un outil en plus.
            </span>
          </h1>
          
          {/* Subtitle */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-xl lg:text-2xl text-gray-700 mb-4 leading-relaxed">
              <span className="font-bold text-[#ff6a3d]">OYA Intelligence™️</span> centralise tout votre cycle de recrutement :
            </p>
            <p className="text-xl lg:text-2xl text-gray-700 mb-8 leading-relaxed">
              IA, scoring visio, CRM, KPI.
            </p>
            <p className="text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto">
              Enfin une solution pensée pour le terrain, pas pour les reporting.
            </p>
          </div>
        </div>
        
        {/* Call to action */}
        <div className={`mt-12 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button className="group bg-[#ff6a3d] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#ff6a3d]/90 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl">
            <span className="flex items-center space-x-3">
              <span>Planifier un rendez-vous</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </span>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <button 
          onClick={scrollToContent}
          className="flex flex-col items-center space-y-2 text-gray-600 hover:text-[#ff6a3d] transition-all group cursor-pointer"
        >
          <span className="text-sm font-medium">Découvrir</span>
          <div className="animate-bounce">
            <ChevronDown size={24} className="group-hover:scale-110 transition-transform" />
          </div>
        </button>
      </div>

    </section>
  );
};

export default Hero;