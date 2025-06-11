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
              
              <button className="border-2 border-[#223049] text-[#223049] px-8 py-4 rounded-lg font-semibold hover:bg-[#223049] hover:text-white transition-all flex items-center justify-center space-x-2">
                <Play size={20} />
                <span>Voir la démo</span>
              </button>
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
                <div className="text-2xl font-bold text-[#223049]">92%</div>
                <div className="text-sm text-gray-600">Taux de matching</div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border-l-4 border-[#9b6bff]">
                <div className="text-2xl font-bold text-[#223049]">15k€</div>
                <div className="text-sm text-gray-600">Économie/recrutement</div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-[#ff6a3d]/20 to-[#9b6bff]/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;