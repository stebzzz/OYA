import React, { useEffect, useState } from 'react';
import { Play, ArrowRight, CheckCircle, ChevronDown, Zap, Star, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, color: string, speed: number}>>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    const scrollTimer = setTimeout(() => {
      setShowScrollIndicator(true);
    }, 3000);
    
    // Generate random particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      color: Math.random() > 0.5 ? '#ff6a3d' : '#9b6bff',
      speed: Math.random() * 2 + 1
    }));
    setParticles(newParticles);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(scrollTimer);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
<<<<<<< HEAD
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-amber-50 via-stone-50 to-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 via-stone-100/20 to-white/50">
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r from-amber-400 via-[#ff6a3d] to-[#9b6bff] rounded-full opacity-25 animate-float-${i % 3}`}
=======
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black">
      {/* Dynamic background with 3D effect */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated mesh gradient */}
        <div 
          className="absolute inset-0 opacity-80"
          style={{
            background: `
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, #ff6a3d 0%, transparent 50%),
              radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, #9b6bff 0%, transparent 50%),
              linear-gradient(45deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)
            `
          }}
        />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 border border-[#ff6a3d]/30 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute top-20 right-20 w-24 h-24 border border-[#9b6bff]/30 rotate-12 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 border border-[#ff6a3d]/20 rounded-full animate-ping" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 border border-[#9b6bff]/20 rotate-45 animate-bounce" style={{animationDuration: '3s'}}></div>
        
        {/* Particle system */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-float"
>>>>>>> parent of 9cac95e (push edit)
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              animationDuration: `${particle.speed}s`,
              animationDelay: `${particle.id * 0.1}s`,
              filter: 'blur(0.5px)',
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
            }}
          />
        ))}
        
<<<<<<< HEAD
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
=======
        {/* Lightning effects */}
        <div className="absolute top-1/4 left-1/4 animate-flash">
          <Zap size={32} className="text-[#ff6a3d] drop-shadow-lg" />
        </div>
        <div className="absolute top-3/4 right-1/4 animate-flash" style={{animationDelay: '1s'}}>
          <Star size={28} className="text-[#9b6bff] drop-shadow-lg" />
        </div>
        <div className="absolute top-1/2 left-1/6 animate-flash" style={{animationDelay: '2s'}}>
          <Sparkles size={24} className="text-[#ff6a3d] drop-shadow-lg" />
        </div>
      </div>

      {/* Main content with 3D transform */}
      <div className="text-center px-4 z-10 relative">
        <div className={`transform transition-all duration-2000 ${isVisible ? 'translate-y-0 scale-100 rotate-0' : 'translate-y-20 scale-75 rotate-3'}`}>
          {/* Glowing title */}
          <h1 className={`text-5xl lg:text-7xl xl:text-9xl font-black leading-tight transition-all duration-2000 transform perspective-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a3d] via-[#ffffff] to-[#9b6bff] animate-gradient-shift drop-shadow-2xl transform hover:scale-105 transition-transform duration-300">
              OYA
            </span>
          </h1>
          
          {/* Subtitle with typewriter effect */}
          <div className={`mt-8 transition-all duration-1500 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-2xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 animate-typewriter">
              LA RÉVOLUTION
            </p>
            <p className="text-xl lg:text-3xl xl:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a3d] to-[#9b6bff] animate-pulse">
              DU RECRUTEMENT
            </p>
          </div>
          
          {/* Glowing subtitle */}
          <div className={`mt-12 transition-all duration-1500 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              <span className="text-[#ff6a3d] font-semibold">Intelligence Artificielle</span> • 
              <span className="text-[#9b6bff] font-semibold">Automatisation Complète</span> • 
              <span className="text-white font-semibold">Résultats Exceptionnels</span>
            </p>
          </div>
        </div>
        
        {/* Call to action with neon effect */}
        <div className={`mt-16 transition-all duration-1500 delay-1500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button className="group relative px-12 py-6 bg-gradient-to-r from-[#ff6a3d] to-[#9b6bff] rounded-full text-white font-bold text-xl hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-[#ff6a3d]/50 animate-pulse-slow">
            <span className="relative z-10 flex items-center space-x-3">
              <span>DÉCOUVRIR LA MAGIE</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff6a3d] to-[#9b6bff] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          </button>
>>>>>>> parent of 9cac95e (push edit)
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-2000 delay-2000 ${showScrollIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <button 
          onClick={scrollToContent}
          className="flex flex-col items-center space-y-4 text-white hover:text-[#ff6a3d] transition-all group cursor-pointer transform hover:scale-110"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff6a3d] to-[#9b6bff] rounded-full blur-lg opacity-50 animate-pulse"></div>
            <div className="relative bg-black/50 backdrop-blur-sm rounded-full p-4 border border-white/20">
              <span className="text-sm font-bold tracking-wider">EXPLORER</span>
            </div>
          </div>
          <div className="animate-bounce-slow">
            <ChevronDown size={32} className="group-hover:scale-125 transition-transform drop-shadow-lg" />
          </div>
        </button>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-size: 300% 300%;
            background-position: 0% 50%;
          }
          25% {
            background-size: 300% 300%;
            background-position: 100% 50%;
          }
          50% {
            background-size: 300% 300%;
            background-position: 50% 100%;
          }
          75% {
            background-size: 300% 300%;
            background-position: 50% 0%;
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(90deg); }
          50% { transform: translateY(-40px) rotate(180deg); }
          75% { transform: translateY(-20px) rotate(270deg); }
        }
        
        @keyframes flash {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes typewriter {
          0% { width: 0; }
          100% { width: 100%; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-gradient-shift {
          animation: gradient-shift 4s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-flash {
          animation: flash 2s ease-in-out infinite;
        }
        
        .animate-typewriter {
          overflow: hidden;
          white-space: nowrap;
          animation: typewriter 2s steps(20) 1s both;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
};

export default Hero;