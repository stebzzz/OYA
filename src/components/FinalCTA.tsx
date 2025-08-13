import React, { useEffect, useState, useRef } from 'react';
import { Calendar, ArrowRight, Clock, CheckCircle } from 'lucide-react';

const FinalCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const benefits = [
    "Analyse personnalisée de vos processus actuels",
    "Démonstration adaptée à vos besoins spécifiques",
    "Estimation précise du ROI pour votre agence",
    "Plan d'implémentation sur mesure"
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-[#223049] via-[#223049] to-[#1a1a2e]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Title */}
          <div className={`mb-12 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
              Prêt à moderniser votre agence ?
            </h2>
          </div>

          {/* Description */}
          <div className={`mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              OYA Intelligence n'est pas une démo générique. C'est un échange stratégique sur votre manière de recruter, vos outils actuels, et vos points de friction.
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Prenons 20 minutes pour voir si on peut avoir un vrai impact chez vous.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="group relative p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-[#ff6a3d]/30 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-[#ff6a3d] mt-1 group-hover:scale-110 transition-transform" size={20} />
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {benefit}
                  </p>
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#ff6a3d]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-center mb-6">
                <Calendar className="text-[#ff6a3d] mr-3" size={32} />
                <h3 className="text-2xl font-bold text-white">
                  Réservons votre créneau
                </h3>
              </div>
              
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Clock size={16} />
                  <span className="text-sm">20 minutes</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <CheckCircle size={16} />
                  <span className="text-sm">Sans engagement</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <ArrowRight size={16} />
                  <span className="text-sm">Résultats immédiats</span>
                </div>
              </div>
              
              <a href="https://calendly.com/contact-oyaintelligence" target="_blank" rel="noopener noreferrer" className="inline-block">
                <button className="group bg-gradient-to-r from-[#ff6a3d] to-[#ff6a3d]/90 text-white px-12 py-4 rounded-lg font-bold text-xl hover:from-[#ff6a3d]/90 hover:to-[#ff6a3d] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-[#ff6a3d]/25">
                  <span className="flex items-center space-x-3">
                    <Calendar className="group-hover:rotate-12 transition-transform" size={24} />
                    <span>Réserver un créneau</span>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </span>
                </button>
              </a>
              
              <p className="text-gray-400 text-sm mt-4">
                Disponibilités sous 48h • Échange en français • Équipe basée en France
              </p>
            </div>
          </div>

          {/* Trust indicators */}
          <div className={`mt-12 transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-3 text-gray-400">
                <div className="w-2 h-2 bg-[#ff6a3d] rounded-full animate-pulse"></div>
                <span className="text-sm">Déjà 50+ agences accompagnées</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-400">
                <div className="w-2 h-2 bg-[#9b6bff] rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <span className="text-sm">ROI moyen de +300% dès le 1er mois</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <span className="text-sm">Support français 7j/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;