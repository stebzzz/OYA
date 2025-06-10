import React from 'react';
import { Play, ArrowRight, CheckCircle, Users, Calendar } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-[#f4f0ec] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-[#9b6bff]/10 rounded-full text-[#9b6bff] font-medium text-sm mb-6">
              🚀 Plateforme IA stratégique
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-[#223049] leading-tight mb-6">
              OYA transforme votre 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a3d] to-[#9b6bff]"> recrutement</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Supprimez les intermédiaires coûteux. Automatisez 80% de votre processus de recrutement. 
              Gardez le contrôle humain sur les décisions stratégiques.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="bg-[#ff6a3d] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#ff6a3d]/90 transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>Démarrer maintenant</span>
                <ArrowRight size={20} />
              </button>
              
              <a 
                href="#features" 
                className="rounded-full px-8 py-3.5 bg-[#9b6bff]/10 text-[#223049] font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#9b6bff]/20 text-center flex items-center justify-center space-x-2" 
              > 
                <Play size={20} />
                <span>Découvrir la plateforme</span>
              </a>
            </div>
            
            <div className="flex items-center space-x-4 mb-8"> 
              <div className="flex -space-x-2"> 
                {[1, 2, 3, 4].map((i) => ( 
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#ff6a3d]/20"></div> 
                ))} 
              </div> 
              <div className="text-sm text-[#223049]"> 
                <span className="text-[#ff6a3d] font-semibold">+200</span> entreprises nous font confiance 
              </div> 
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">ROI jusqu'à +1133%</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">-50% temps RH</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">Suppression des cabinets</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">IA 24/7</span>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff6a3d]/20 to-[#9b6bff]/20 rounded-3xl blur-3xl opacity-30"></div>
            <div className="relative bg-white rounded-3xl p-1 border border-gray-200 shadow-2xl">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#ff6a3d]/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#9b6bff]/10 rounded-full -translate-x-1/3 translate-y-1/3 blur-2xl"></div>
              
              <div className="bg-white rounded-2xl overflow-hidden p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                    <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="text-xs text-gray-500">dashboard.oya.io</div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-[#ff6a3d]">Vue d'ensemble</h3>
                      <div className="text-xs text-gray-500">Cette semaine</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#f4f0ec] rounded-lg p-4 border border-gray-100">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-gray-600 text-xs">Candidats identifiés</div>
                            <div className="text-2xl font-bold mt-1 text-[#223049]">87</div>
                          </div>
                          <div className="p-2 rounded-lg bg-[#ff6a3d]/20">
                            <Users className="h-5 w-5 text-[#ff6a3d]" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-[#f4f0ec] rounded-lg p-4 border border-gray-100">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-gray-600 text-xs">Entretiens programmés</div>
                            <div className="text-2xl font-bold mt-1 text-[#223049]">12</div>
                          </div>
                          <div className="p-2 rounded-lg bg-[#9b6bff]/20">
                            <Calendar className="h-5 w-5 text-[#9b6bff]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#ff6a3d]/10 to-[#9b6bff]/10 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium text-[#223049]">Matching IA</div>
                      <div className="text-xs text-[#ff6a3d] flex items-center">
                        +35% <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </div>
                    
                    <div className="h-16 flex items-end space-x-2">
                      {[55, 60, 70, 65, 80, 75, 85, 90, 85, 95, 92].map((height, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-gradient-to-t from-[#ff6a3d]/50 to-[#9b6bff]/50 rounded-t-sm" 
                          style={{ height: `${height}%` }} 
                        ></div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-[#223049]">Derniers candidats matchés</div>
                    
                    <div className="space-y-2">
                      {[
                        { title: 'Développeur Full-Stack', client: 'Score de matching : 95%', status: 'confirmed' },
                        { title: 'Data Scientist', client: 'Score de matching : 87%', status: 'pending' },
                      ].map((mission, i) => (
                        <div key={i} className="flex items-center justify-between bg-[#f4f0ec] rounded-lg p-3 border border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-[#ff6a3d]/20 flex items-center justify-center">
                              <Users className="h-4 w-4 text-[#ff6a3d]" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[#223049]">{mission.title}</div>
                              <div className="text-xs text-gray-600">{mission.client}</div>
                            </div>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${
                            mission.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;