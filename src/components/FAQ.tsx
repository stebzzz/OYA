import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openItems, setOpenItems] = useState<number[]>([]);
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

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqItems = [
    {
      question: "🧩 OYA Intelligence™️ remplace-t-il mon ATS ?",
      answer: "Non. Il peut s'y connecter, mais couvre à lui seul 90 % de vos besoins quotidiens."
    },
    {
      question: "📚 Faut-il être formé ?",
      answer: "L'interface est pensée pour être prise en main rapidement. Et l'onboarding est guidé."
    },
    {
      question: "💰 Combien ça coûte ?",
      answer: "Frais d'intégration sur mesure, abonnement ajusté à votre taille, et commission évolutive au succès."
    },
    {
      question: "🔒 Mes données sont-elles sécurisées ?",
      answer: "100% hébergé en France, conforme RGPD by design. Nos experts cybersécurité veillent à la protection de vos données."
    },
    {
      question: "⚡ Combien de temps pour voir les premiers résultats ?",
      answer: "Dès la première semaine d'utilisation, vous constaterez un gain de temps significatif. Les résultats sur la qualité des recrutements sont visibles dès le premier mois."
    },
    {
      question: "🔗 OYA s'intègre-t-il avec mes outils actuels ?",
      answer: "Oui, OYA Intelligence™️ peut se connecter à la plupart des ATS, CRM et jobboards existants via API. Notre équipe vous accompagne dans l'intégration."
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-[#f4f0ec] to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-bold text-[#223049] mb-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Questions fréquentes
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div 
              key={index}
              className={`bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-lg ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 group"
              >
                <h3 className="text-lg lg:text-xl font-semibold text-[#223049] group-hover:text-[#ff6a3d] transition-colors">
                  {item.question}
                </h3>
                <div className={`transform transition-transform duration-300 ${openItems.includes(index) ? 'rotate-180' : ''}`}>
                  {openItems.includes(index) ? (
                    <ChevronUp className="text-[#ff6a3d]" size={24} />
                  ) : (
                    <ChevronDown className="text-gray-400 group-hover:text-[#ff6a3d] transition-colors" size={24} />
                  )}
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openItems.includes(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-8 pb-6">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className={`mt-12 text-center transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-[#223049]/5 to-[#9b6bff]/5 rounded-2xl p-6">
            <p className="text-lg text-gray-700">
              💡 <strong>Une question spécifique ?</strong> Notre équipe est disponible pour vous accompagner dans votre réflexion.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;