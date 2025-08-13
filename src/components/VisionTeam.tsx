import React, { useEffect, useState, useRef } from 'react';
import { Target, Users, Shield, Heart } from 'lucide-react';

const VisionTeam: React.FC = () => {
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

  const teamMembers = [
    {
      role: "CEO & stratégie",
      description: "Je m'occupe de la vision, du produit, du marketing et de l'accompagnement client.",
      mission: "Son obsession : créer des outils qui libèrent du temps pour ce qui compte vraiment - les relations humaines et la croissance de votre entreprise.",
      icon: Target,
      color: "from-[#ff6a3d] to-[#ff6a3d]/80"
    },
    {
      role: "Développement produit",
      description: "Expert full stack, il construit toute l'architecture de la plateforme.",
      mission: "Il pense \"efficacité\", \"rapidité\" et \"simplicité\" à chaque fonctionnalité.",
      icon: Users,
      color: "from-[#9b6bff] to-[#9b6bff]/80"
    },
    {
      role: "Cybersécurité & conformité",
      description: "Consultant cybersécurité, il veille à la fiabilité, la sécurité des données et la conformité RGPD.",
      mission: "Son objectif : que la performance technique ne se fasse jamais au détriment de la confiance.",
      icon: Shield,
      color: "from-blue-500 to-blue-400"
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Section */}
        <div className="text-center mb-20">
          <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#223049] mb-8 animate-pulse">
              Une mission simple :
            </h2>
            <p className="text-2xl lg:text-3xl text-[#ff6a3d] font-bold mb-8 transform hover:scale-105 transition-transform duration-300">
              Redonner du temps, du contrôle et de la qualité aux agences de recrutement.
            </p>
          </div>

          <div className={`max-w-5xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Nous ne venons pas du monde des logiciels "qui font tout mais rien à fond".
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Nous venons du terrain, des métiers où chaque minute compte, où chaque recrutement mal cadré coûte du chiffre d'affaires… et de la confiance.
            </p>
            
            <div className="bg-gradient-to-r from-[#f4f0ec] to-white p-8 rounded-2xl border border-gray-100">
              <p className="text-xl text-[#223049] font-semibold mb-6">
                OYA Intelligence™️ a été conçu pour reconnecter la tech à la réalité des agences :
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#ff6a3d] rounded-full"></div>
                  <span className="text-gray-700">des outils centralisés, pas éparpillés</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#9b6bff] rounded-full"></div>
                  <span className="text-gray-700">des modules puissants mais simples à prendre en main</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">une IA utile, qui fait gagner du temps sans déshumaniser</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h3 className={`text-3xl lg:text-4xl font-bold text-[#223049] text-center mb-16 transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            👥 L'équipe fondatrice
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className={`group relative p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} transition-all duration-1000`}
                style={{ transitionDelay: `${600 + index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${member.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <member.icon className="text-white" size={32} />
                </div>
                
                <h4 className="text-xl font-bold text-[#223049] mb-4">
                  {member.role}
                </h4>
                
                <p className="text-gray-600 leading-relaxed mb-4">
                  {member.description}
                </p>
                
                <p className="text-sm text-[#ff6a3d] font-medium italic">
                  {member.mission}
                </p>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ff6a3d]/5 to-[#9b6bff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Human Approach Section */}
        <div className={`text-center transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-[#223049] to-[#223049]/90 rounded-2xl p-8 lg:p-12">
            <div className="flex items-center justify-center mb-6">
              <Heart className="text-[#ff6a3d] mr-3" size={40} />
              <h3 className="text-2xl lg:text-3xl font-bold text-white">
                Une approche humaine, une solution durable
              </h3>
            </div>
            
            <p className="text-xl text-gray-300 mb-6 max-w-4xl mx-auto leading-relaxed">
              OYA Intelligence™️ n'est pas un outil "en plus" : c'est un levier stratégique conçu par et pour des recruteurs.
            </p>
            
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              On construit, on ajuste, on écoute. Et on avance avec vous.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionTeam;