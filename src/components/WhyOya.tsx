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
      icon: "📢",
      title: "Multi-diffusion en 1 clic",
      problem: "Publier une offre sur plusieurs jobboards est répétitif et chronophage.",
      solution: "Diffusez automatiquement vos annonces sur tous vos canaux en un clic.",
      benefit: "Gagnez des heures chaque semaine et maximisez la visibilité de vos offres."
    },
    {
      icon: "🧠",
      title: "Matching IA intelligent",
      problem: "Chercher dans des centaines de CV prend un temps fou.",
      solution: "Notre IA identifie, note et priorise les meilleurs profils en quelques minutes, selon vos critères techniques et humains.",
      benefit: "Plus de temps pour la relation client, moins pour le tri manuel."
    },
    {
      icon: "📋",
      title: "Pipeline clair & collaboratif",
      problem: "Perdre le fil des candidats et missions ralentit les placements.",
      solution: "Un tableau visuel pour suivre chaque étape, du sourcing au placement, accessible à toute l'équipe.",
      benefit: "Plus de visibilité, plus de coordination, moins d'oublis."
    },
    {
      icon: "📬",
      title: "Automatisation des échanges",
      problem: "Relances, mails de confirmation et organisation d'entretiens sont chronophages.",
      solution: "L'outil envoie automatiquement les bons messages au bon moment.",
      benefit: "Réactivité immédiate, expérience candidat et client fluidifiée."
    },
    {
      icon: "🎥",
      title: "Entretiens augmentés par l'IA",
      problem: "Les notes d'entretien sont souvent incomplètes et subjectives.",
      solution: "Enregistrez, retranscrivez et obtenez un débrief IA avec points forts/faibles et scoring.",
      benefit: "Décisions plus rapides et mieux argumentées."
    },
    {
      icon: "📊",
      title: "Tableau de bord KPI & ROI",
      problem: "Difficile de mesurer précisément la rentabilité de chaque mission.",
      solution: "Suivi en temps réel du ROI, des placements, des délais et de la marge nette.",
      benefit: "Pilotez votre activité avec des chiffres clairs et actionnables."
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 delay-${(index + 1) * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#9b6bff] to-[#9b6bff]/80 flex items-center justify-center mb-6 mx-auto text-2xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{feature.title}</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">Problème :</h4>
                  <p className="text-gray-600">{feature.problem}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-600 mb-2">Solution OYA :</h4>
                  <p className="text-gray-600">{feature.solution}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">Bénéfice :</h4>
                  <p className="text-gray-600">{feature.benefit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`text-center transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <a href="https://calendly.com/contact-oyaintelligence" target="_blank" rel="noopener noreferrer" className="inline-block">
            <button className="group bg-white text-[#ff6a3d] px-8 py-4 rounded-lg font-semibold text-lg border-2 border-[#ff6a3d] hover:bg-[#ff6a3d] hover:text-white transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl">
              <span className="flex items-center space-x-3">
                <span>Demander une démo personnalisée</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </span>
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyOya;