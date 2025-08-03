import React, { useEffect, useState, useRef } from 'react';
import { Search, Radio, Video, BarChart3, ArrowRight } from 'lucide-react';

const WhyOya: React.FC = () => {
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

  const features = [
    {
      icon: Search,
      title: "🔍 Matching IA intelligent",
      description: "Tri automatique des meilleurs profils selon les critères stratégiques réels de vos clients.",
      color: "from-[#ff6a3d] to-[#ff6a3d]/80",
      delay: "delay-100"
    },
    {
      icon: Radio,
      title: "📡 Multi-diffusion 1 clic",
      description: "Publiez vos annonces sur +20 plateformes en une seule action. Centralisé, rapide, sans friction.",
      color: "from-[#9b6bff] to-[#9b6bff]/80",
      delay: "delay-200"
    },
    {
      icon: Video,
      title: "🎥 Visio scoring intégrée",
      description: "Entretiens enregistrés, analysés par IA, avec transcription automatique et scoring visuel intelligent.",
      color: "from-blue-500 to-blue-400",
      delay: "delay-300"
    },
    {
      icon: BarChart3,
      title: "📊 CRM & KPI intégrés",
      description: "Suivi temps réel des performances par mission, client, consultant. Décidez en connaissance.",
      color: "from-green-500 to-green-400",
      delay: "delay-400"
    }
  ];

  return (
    <section id="why-oya" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-bold text-[#223049] mb-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Pourquoi OYA Intelligence™️ change la donne ?
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`group relative p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} transition-all duration-1000 ${feature.delay}`}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="text-white" size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-[#223049] mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ff6a3d]/5 to-[#9b6bff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`text-center transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button className="group bg-white text-[#ff6a3d] px-8 py-4 rounded-lg font-semibold text-lg border-2 border-[#ff6a3d] hover:bg-[#ff6a3d] hover:text-white transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl">
            <span className="flex items-center space-x-3">
              <span>Demander une démo personnalisée</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyOya;