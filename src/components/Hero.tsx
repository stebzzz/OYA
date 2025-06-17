import React, { useEffect, useState } from 'react';
import { Play, ArrowRight, CheckCircle, ChevronDown, Sparkles, Zap } from 'lucide-react';

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    // Cascade animation steps
    const steps = [
      () => setAnimationStep(1), // Title
      () => setAnimationStep(2), // Subtitle
      () => setAnimationStep(3), // Description
      () => setAnimationStep(4), // Buttons
      () => setAnimationStep(5), // Scroll indicator
    ];
    
    steps.forEach((step, index) => {
      setTimeout(step, 500 + index * 200);
    });
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-amber-50 via-stone-50 to-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 via-stone-100/20 to-white/50">
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r from-amber-400 via-[#ff6a3d] to-[#9b6bff] rounded-full opacity-25 animate-float-${i % 3}`}
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 2)}s`
            }}
          />
        ))}
        
        {/* Geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 border-2 border-amber-300/30 rounded-full animate-spin-slow" />
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-gradient-to-br from-amber-200/20 to-[#9b6bff]/10 rotate-45 animate-pulse" />
        <div className="absolute top-1/3 right-20 w-12 h-12 border-2 border-stone-300/40 animate-bounce-slow" />
        <div className="absolute top-10 right-1/4 w-8 h-8 bg-amber-100/30 rounded-full animate-float-1" />
        <div className="absolute bottom-20 left-1/4 w-6 h-6 border border-amber-200/50 rotate-12 animate-bounce-gentle" />
      </div>

      {/* Main content */}
      <div className="text-center px-4 z-10 relative max-w-6xl mx-auto">
        {/* Title with dramatic entrance */}
        <div className={`transform transition-all duration-1000 ${animationStep >= 1 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'}`}>
          <div className="relative inline-block">
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black leading-tight text-[#223049] mb-8 relative z-10">
              <span className="inline-block animate-gradient-shift bg-gradient-to-r from-amber-600 via-[#ff6a3d] via-[#223049] to-[#9b6bff] bg-clip-text text-transparent bg-300% hover:scale-110 transition-transform duration-300">
                OYA
              </span>
            </h1>
            {/* Sparkle effects */}
            <Sparkles className="absolute -top-4 -right-4 text-[#ff6a3d] animate-pulse" size={24} />
            <Zap className="absolute -bottom-2 -left-6 text-[#9b6bff] animate-bounce" size={20} />
          </div>
        </div>
        
        {/* Subtitle with typewriter effect */}
        <div className={`mb-8 transform transition-all duration-1000 delay-200 ${animationStep >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <p className="text-2xl lg:text-4xl font-bold text-[#223049] mb-4 animate-slide-up">
            LA RÉVOLUTION DU RECRUTEMENT
          </p>
          <p className={`text-xl lg:text-2xl font-semibold bg-gradient-to-r from-amber-600 via-[#ff6a3d] to-[#9b6bff] bg-clip-text text-transparent animate-gradient-shift ${animationStep >= 2 ? 'animate-typewriter' : ''}`}>
            Intelligence Artificielle • Automatisation • Résultats
          </p>
        </div>
        
        {/* Description with fade-in */}
        <div className={`mb-12 transform transition-all duration-1000 delay-400 ${animationStep >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <p className="text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed animate-fade-in-up">
            La première plateforme de recrutement 100% autonome qui transforme votre processus de A à Z.
            <br />
            Créez, diffusez, sourcez, interviewez et recrutez en quelques clics.
          </p>
        </div>
        
        {/* Call to action with bounce effect */}
        <div className={`transition-all duration-1000 delay-600 ${animationStep >= 4 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="group bg-[#ff6a3d] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#ff6a3d]/90 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl animate-pulse-glow">
              <span className="flex items-center justify-center space-x-2">
                <span>Demander une démo</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </span>
            </button>
            <button className="bg-white text-[#223049] px-8 py-4 rounded-lg font-semibold border-2 border-[#223049] hover:bg-[#223049] hover:text-white transition-all transform hover:scale-105 hover:shadow-lg">
              <span className="flex items-center justify-center space-x-2">
                <Play size={20} />
                <span>Voir en action</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-800 ${animationStep >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <button 
          onClick={scrollToContent}
          className="flex flex-col items-center space-y-2 text-gray-600 hover:text-[#ff6a3d] transition-all group cursor-pointer animate-bounce-gentle"
        >
          <span className="text-sm font-medium group-hover:scale-110 transition-transform">Découvrir</span>
          <div className="relative">
            <ChevronDown size={24} className="animate-bounce group-hover:animate-pulse" />
            <div className="absolute inset-0 bg-[#ff6a3d]/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300" />
          </div>
        </button>
      </div>
      
      {/* Custom animations */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(90deg); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 106, 61, 0.3); }
          50% { box-shadow: 0 0 30px rgba(255, 106, 61, 0.5); }
        }
        
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }
        
        .animate-gradient-shift {
          animation: gradient-shift 3s ease-in-out infinite;
          background-size: 300% 300%;
        }
        
        .animate-float-0 {
          animation: float-0 4s ease-in-out infinite;
        }
        
        .animate-float-1 {
          animation: float-1 3s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float-2 5s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        
        .animate-typewriter {
          overflow: hidden;
          white-space: nowrap;
          animation: typewriter 2s steps(40, end);
        }
        
        .bg-300% {
          background-size: 300% 300%;
        }
      `}</style>
    </section>
  );
};

export default Hero;