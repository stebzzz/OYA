import React from 'react';
import { Play, ArrowRight, CheckCircle } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-[#f4f0ec] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-[#9b6bff]/10 rounded-full text-[#9b6bff] font-medium text-sm mb-6">
              🌐 Plateforme stratégique nouvelle génération
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-[#223049] leading-tight mb-6">
              La plateforme stratégique de 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a3d] to-[#9b6bff]">recrutement nouvelle génération</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-4 leading-relaxed">
              100% autonome et boostée par l'IA
            </p>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              🧠 <strong>De l'annonce à l'embauche, en quelques heures.</strong><br/>
              Le seul outil dont vous avez besoin pour recruter mieux, plus vite, et avec plus de précision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="bg-[#ff6a3d] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#ff6a3d]/90 transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>🟢 Réserver une démo</span>
                <ArrowRight size={20} />
              </button>
              
              <button className="border-2 border-[#223049] text-[#223049] px-8 py-4 rounded-lg font-semibold hover:bg-[#223049] hover:text-white transition-all flex items-center justify-center space-x-2">
                <Play size={20} />
                <span>🟢 Voir le logiciel en action</span>
              </button>
            </div>

            {/* Target Audience */}
            <div className="bg-gradient-to-r from-[#ff6a3d]/10 to-[#9b6bff]/10 p-6 rounded-xl mb-6">
              <p className="text-sm font-semibold text-[#223049] mb-2">📍 Conçu pour :</p>
              <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                <span>• Cabinets, agences et groupes RH exigeants</span>
                <span>• Entreprises à fort volume de recrutement</span>
                <span>• Remplace totalement l'empilement ATS + jobboards + Teams + CRM</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">🕐 Gain de temps 70-90%</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">📈 +60% profils transformés</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">💸 Réduction coût/embauche</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-gray-700">🧩 Solution tout-en-un</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                alt="Équipe RH moderne"
                className="rounded-2xl shadow-2xl"
              />
              
              {/* Floating cards */}
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg border-l-4 border-[#ff6a3d]">
                <div className="text-2xl font-bold text-[#223049]">🎯</div>
                <div className="text-sm text-gray-600">Matching prédictif</div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border-l-4 border-[#9b6bff]">
                <div className="text-2xl font-bold text-[#223049]">⚡</div>
                <div className="text-sm text-gray-600">Quelques heures</div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-[#ff6a3d]/20 to-[#9b6bff]/20 rounded-full blur-3xl"></div>
            
            {/* Video placeholder */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
              <Play className="text-[#ff6a3d]" size={24} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;