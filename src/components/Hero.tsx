import React, { useState, useEffect } from 'react';
import { Play, ArrowRight, CheckCircle, ChevronDown, Zap, Star, Sparkles, Users, TrendingUp, Calendar, Target } from 'lucide-react';

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [showDashboardPreview, setShowDashboardPreview] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, color: string, speed: number}>>([]);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  const showDashboardAnimation = () => {
    setShowDashboardPreview(true);
    setTimeout(() => setShowDashboardPreview(false), 8000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    const scrollTimer = setTimeout(() => {
      setShowScrollIndicator(true);
    }, 3000);
    
    // Animation steps
    const animationTimers = [
      setTimeout(() => setAnimationStep(1), 800),
      setTimeout(() => setAnimationStep(2), 1200),
      setTimeout(() => setAnimationStep(3), 1600),
      setTimeout(() => setAnimationStep(4), 2000)
    ];
    
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
      animationTimers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-gray-25/20 to-white/50">
        {/* Floating particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-float"
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
        
        {/* Geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 border-2 border-gray-200/40 rounded-full animate-spin-slow" />
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-gradient-to-br from-gray-100/20 to-[#9b6bff]/10 rotate-45 animate-pulse" />
        <div className="absolute top-1/3 right-20 w-12 h-12 border-2 border-gray-200/40 animate-bounce-slow" />
        <div className="absolute top-10 right-1/4 w-8 h-8 bg-gray-100/30 rounded-full animate-float-1" />
        <div className="absolute bottom-20 left-1/4 w-6 h-6 border border-gray-200/50 rotate-12 animate-bounce-gentle" />
      </div>
      
      {/* Dashboard Preview Animation */}
      {showDashboardPreview && (
        <>
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden animate-scale-in transform-gpu">
              {/* Animated border glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff6a3d] via-[#9b6bff] to-[#ff6a3d] rounded-3xl opacity-20 animate-pulse-glow"></div>
              <div className="relative bg-white rounded-3xl overflow-hidden">
                {/* Dashboard Header */}
                <div className="bg-white p-8 text-[#223049] relative overflow-hidden border-b border-gray-200">
                  {/* Animated background particles */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-10 w-2 h-2 bg-[#ff6a3d] rounded-full animate-float"></div>
                    <div className="absolute top-8 right-20 w-1 h-1 bg-[#9b6bff] rounded-full animate-float-1" style={{animationDelay: '1s'}}></div>
                    <div className="absolute bottom-6 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-float" style={{animationDelay: '2s'}}></div>
                  </div>
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="animate-slide-up">
                      <h2 className="text-3xl font-bold mb-2 text-[#223049]">Tableau de bord OYA</h2>
                      <p className="text-gray-600 animate-fade-in-up" style={{animationDelay: '0.3s'}}>Gérez vos recrutements avec l'intelligence artificielle</p>
                    </div>
                    <div className="text-right animate-slide-up" style={{animationDelay: '0.2s'}}>
                      <div className="text-4xl font-bold text-[#ff6a3d] animate-pulse-glow">87%</div>
                      <div className="text-sm text-gray-600 animate-fade-in-up" style={{animationDelay: '0.5s'}}>Score moyen IA</div>
                    </div>
                  </div>
                </div>
              
                {/* Dashboard Stats */}
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="group bg-gradient-to-br from-[#ff6a3d]/10 to-[#ff6a3d]/5 p-6 rounded-2xl border border-[#ff6a3d]/20 animate-slide-up hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer" style={{animationDelay: '0.3s'}}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-[#ff6a3d]/20 rounded-xl group-hover:bg-[#ff6a3d]/30 transition-colors">
                          <Users className="text-[#ff6a3d] group-hover:scale-110 transition-transform" size={28} />
                        </div>
                        <span className="text-sm text-green-600 font-bold bg-green-100 px-2 py-1 rounded-full animate-bounce-gentle">+23%</span>
                      </div>
                      <h3 className="text-3xl font-bold text-[#223049] mb-2 group-hover:text-[#ff6a3d] transition-colors">156</h3>
                      <p className="text-gray-600 text-sm font-medium">Candidats actifs</p>
                      <div className="mt-3 h-1 bg-[#ff6a3d]/20 rounded-full overflow-hidden">
                        <div className="h-full bg-[#ff6a3d] rounded-full animate-slide-up" style={{width: '78%', animationDelay: '1s'}}></div>
                      </div>
                    </div>
                    
                    <div className="group bg-gradient-to-br from-[#9b6bff]/10 to-[#9b6bff]/5 p-6 rounded-2xl border border-[#9b6bff]/20 animate-slide-up hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer" style={{animationDelay: '0.5s'}}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-[#9b6bff]/20 rounded-xl group-hover:bg-[#9b6bff]/30 transition-colors">
                          <Calendar className="text-[#9b6bff] group-hover:scale-110 transition-transform" size={28} />
                        </div>
                        <span className="text-sm text-green-600 font-bold bg-green-100 px-2 py-1 rounded-full animate-bounce-gentle" style={{animationDelay: '0.2s'}}>+15%</span>
                      </div>
                      <h3 className="text-3xl font-bold text-[#223049] mb-2 group-hover:text-[#9b6bff] transition-colors">24</h3>
                      <p className="text-gray-600 text-sm font-medium">Entretiens planifiés</p>
                      <div className="mt-3 h-1 bg-[#9b6bff]/20 rounded-full overflow-hidden">
                        <div className="h-full bg-[#9b6bff] rounded-full animate-slide-up" style={{width: '65%', animationDelay: '1.2s'}}></div>
                      </div>
                    </div>
                    
                    <div className="group bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-2xl border border-green-200 animate-slide-up hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer" style={{animationDelay: '0.7s'}}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-200 rounded-xl group-hover:bg-green-300 transition-colors">
                          <CheckCircle className="text-green-600 group-hover:scale-110 transition-transform" size={28} />
                        </div>
                        <span className="text-sm text-green-600 font-bold bg-green-100 px-2 py-1 rounded-full animate-bounce-gentle" style={{animationDelay: '0.4s'}}>+25%</span>
                      </div>
                      <h3 className="text-3xl font-bold text-[#223049] mb-2 group-hover:text-green-600 transition-colors">89</h3>
                      <p className="text-gray-600 text-sm font-medium">Candidats qualifiés</p>
                      <div className="mt-3 h-1 bg-green-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full animate-slide-up" style={{width: '92%', animationDelay: '1.4s'}}></div>
                      </div>
                    </div>
                    
                    <div className="group bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-2xl border border-blue-200 animate-slide-up hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer" style={{animationDelay: '0.9s'}}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-200 rounded-xl group-hover:bg-blue-300 transition-colors">
                          <Target className="text-blue-600 group-hover:scale-110 transition-transform" size={28} />
                        </div>
                        <span className="text-sm text-green-600 font-bold bg-green-100 px-2 py-1 rounded-full animate-bounce-gentle" style={{animationDelay: '0.6s'}}>+8%</span>
                      </div>
                      <h3 className="text-3xl font-bold text-[#223049] mb-2 group-hover:text-blue-600 transition-colors">12</h3>
                      <p className="text-gray-600 text-sm font-medium">Embauches réussies</p>
                      <div className="mt-3 h-1 bg-blue-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full animate-slide-up" style={{width: '45%', animationDelay: '1.6s'}}></div>
                      </div>
                    </div>
                  </div>
                
                  {/* Quick Actions */}
                  <div className="animate-fade-in-up" style={{animationDelay: '1.2s'}}>
                    <h3 className="text-xl font-bold text-[#223049] mb-6 text-center">Actions rapides</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="group flex items-center space-x-4 p-6 border-2 border-dashed border-[#ff6a3d]/30 rounded-2xl bg-[#ff6a3d]/5 hover:bg-[#ff6a3d]/10 hover:border-[#ff6a3d]/50 transition-all duration-300 cursor-pointer animate-slide-up" style={{animationDelay: '1.4s'}}>
                        <div className="p-3 bg-[#ff6a3d]/20 rounded-xl group-hover:bg-[#ff6a3d]/30 group-hover:scale-110 transition-all duration-300">
                          <Users size={24} className="text-[#ff6a3d]" />
                        </div>
                        <div>
                          <p className="font-bold text-[#223049] group-hover:text-[#ff6a3d] transition-colors">Nouveau candidat</p>
                          <p className="text-sm text-gray-500">Ajouter manuellement</p>
                        </div>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight size={20} className="text-[#ff6a3d]" />
                        </div>
                      </div>
                      
                      <div className="group flex items-center space-x-4 p-6 border-2 border-dashed border-[#9b6bff]/30 rounded-2xl bg-[#9b6bff]/5 hover:bg-[#9b6bff]/10 hover:border-[#9b6bff]/50 transition-all duration-300 cursor-pointer animate-slide-up" style={{animationDelay: '1.6s'}}>
                        <div className="p-3 bg-[#9b6bff]/20 rounded-xl group-hover:bg-[#9b6bff]/30 group-hover:scale-110 transition-all duration-300">
                          <Zap size={24} className="text-[#9b6bff] group-hover:animate-pulse" />
                        </div>
                        <div>
                          <p className="font-bold text-[#223049] group-hover:text-[#9b6bff] transition-colors">Sourcing IA</p>
                          <p className="text-sm text-gray-500">Recherche automatique</p>
                        </div>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight size={20} className="text-[#9b6bff]" />
                        </div>
                      </div>
                      
                      <div className="group flex items-center space-x-4 p-6 border-2 border-dashed border-green-300 rounded-2xl bg-green-50 hover:bg-green-100 hover:border-green-400 transition-all duration-300 cursor-pointer animate-slide-up" style={{animationDelay: '1.8s'}}>
                        <div className="p-3 bg-green-200 rounded-xl group-hover:bg-green-300 group-hover:scale-110 transition-all duration-300">
                          <Calendar size={24} className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-bold text-[#223049] group-hover:text-green-600 transition-colors">Planifier entretien</p>
                          <p className="text-sm text-gray-500">Agenda automatique</p>
                        </div>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight size={20} className="text-green-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Close button */}
              <div className="absolute top-6 right-6 z-20">
                <button 
                  onClick={() => setShowDashboardPreview(false)}
                  className="group bg-gray-100 hover:bg-gray-200 text-[#223049] rounded-full p-3 transition-all duration-300 border border-gray-300 hover:border-gray-400 hover:scale-110"
                >
                  <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <div className="text-center px-4 z-10 relative max-w-6xl mx-auto">
        {/* Title with dramatic entrance */}
        <div className={`transform transition-all duration-1000 ${animationStep >= 1 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'}`}>
          <div className="relative inline-block">
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black leading-tight text-[#223049] mb-8 relative z-10">
              <span className="inline-block animate-gradient-shift bg-gradient-to-r from-orange-600 via-[#ff6a3d] via-[#223049] to-[#9b6bff] bg-clip-text text-transparent bg-300% hover:scale-110 transition-transform duration-300">
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
          <p className={`text-xl lg:text-2xl font-semibold bg-gradient-to-r from-orange-600 via-[#ff6a3d] to-[#9b6bff] bg-clip-text text-transparent animate-gradient-shift ${animationStep >= 2 ? 'animate-typewriter' : ''}`}>
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
            <button 
              onClick={showDashboardAnimation}
              className="bg-white text-[#223049] px-8 py-4 rounded-lg font-semibold border-2 border-[#223049] hover:bg-[#223049] hover:text-white transition-all transform hover:scale-105 hover:shadow-lg"
            >
              <span className="flex items-center justify-center space-x-2">
                <Play size={20} />
                <span>Voir en action</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-2000 delay-2000 ${showScrollIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <button 
          onClick={scrollToContent}
          className="flex flex-col items-center space-y-4 text-[#223049] hover:text-[#ff6a3d] transition-all group cursor-pointer transform hover:scale-110"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff6a3d] to-[#9b6bff] rounded-full blur-lg opacity-50 animate-pulse"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-full p-4 border border-orange-200">
              <span className="text-sm font-bold tracking-wider">EXPLORER</span>
            </div>
          </div>
          <div className="animate-bounce-slow">
            <ChevronDown size={32} className="group-hover:scale-125 transition-transform drop-shadow-lg" />
          </div>
        </button>
      </div>

      {/* Custom animations */}
      <style>{`
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
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
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
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-5px) rotate(12deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 106, 61, 0.3); }
          50% { box-shadow: 0 0 30px rgba(255, 106, 61, 0.6); }
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
          0% { width: 0; }
          100% { width: 100%; }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-gradient-shift {
          animation: gradient-shift 4s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-1 {
          animation: float-1 4s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 4s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-typewriter {
          overflow: hidden;
          white-space: nowrap;
          animation: typewriter 2s steps(20) 1s both;
        }
      `}</style>
    </div>
  );
};

export default Hero;