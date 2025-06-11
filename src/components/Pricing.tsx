import React from 'react';
import { Check, Star, ArrowRight } from 'lucide-react';

const Pricing: React.FC = () => {
  const plans = [
    {
      name: "START",
      target: "PME",
      subtitle: "20-50 salariés",
      price: "990",
      period: "/mois",
      popular: false,
      features: [
        "3 utilisateurs",
        "Sourcing + scoring IA",
        "50 profils/mois",
        "Support standard",
        "Onboarding inclus"
      ],
      cta: "Commencer",
      color: "border-gray-200"
    },
    {
      name: "PRO",
      target: "ETI",
      subtitle: "50-200 salariés",
      price: "2,490",
      period: "/mois",
      popular: true,
      features: [
        "10 utilisateurs",
        "Toutes fonctionnalités IA",
        "Agenda automatique",
        "Estimation salariale",
        "Support prioritaire",
        "Analytics avancées"
      ],
      cta: "Démo gratuite",
      color: "border-[#ff6a3d]"
    },
    {
      name: "SCALE",
      target: "Grand Groupe",
      subtitle: ">200 salariés",
      price: "Sur mesure",
      period: "",
      popular: false,
      features: [
        "Utilisateurs illimités",
        "Intégration SIRH/API",
        "Hébergement sécurisé",
        "Support 24/7 dédié",
        "Personnalisation IA",
        "SLA garantie"
      ],
      cta: "Nous contacter",
      color: "border-[#9b6bff]"
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-[#f4f0ec] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-[#ff6a3d]/10 rounded-full text-[#ff6a3d] font-medium text-sm mb-6">
            💼 Tarification stratégique
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-[#223049] mb-6">
            Choisissez votre avantage concurrentiel
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            OYA ne vend pas un abonnement. OYA vend un avantage concurrentiel RH, 
            calibré à votre organisation et au volume de vos recrutements.
          </p>

          {/* Early Adopter Banner */}
          <div className="bg-gradient-to-r from-[#9b6bff] to-[#9b6bff]/80 text-white p-6 rounded-xl max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="text-yellow-300" size={20} />
              <span className="font-semibold">Offre Early Adopter</span>
              <Star className="text-yellow-300" size={20} />
            </div>
            <p className="text-sm opacity-90">
              -50% la première année pour les 10 premiers clients + accompagnement personnalisé
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${plan.color} ${plan.popular ? 'scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#ff6a3d] text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Plus populaire
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-[#223049] mb-2">{plan.name}</h3>
                <p className="text-[#ff6a3d] font-semibold mb-1">{plan.target}</p>
                <p className="text-gray-600 text-sm mb-6">{plan.subtitle}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#223049]">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="text-green-600 flex-shrink-0" size={20} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2 ${
                plan.popular 
                  ? 'bg-[#ff6a3d] text-white hover:bg-[#ff6a3d]/90' 
                  : 'border-2 border-[#223049] text-[#223049] hover:bg-[#223049] hover:text-white'
              }`}>
                <span>{plan.cta}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* ROI Comparison */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-[#223049] mb-6 text-center">
            Comparaison ROI par profil d'entreprise
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-4 font-semibold text-[#223049]">Profil</th>
                  <th className="text-left p-4 font-semibold text-[#223049]">Recrutements/an</th>
                  <th className="text-left p-4 font-semibold text-[#223049]">Coût OYA</th>
                  <th className="text-left p-4 font-semibold text-[#223049]">Économies</th>
                  <th className="text-left p-4 font-semibold text-[#223049]">ROI</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-[#223049]">PME Tech</td>
                  <td className="p-4 text-gray-700">25</td>
                  <td className="p-4 text-gray-700">34,880€</td>
                  <td className="p-4 text-green-600 font-semibold">196,370€</td>
                  <td className="p-4 text-green-600 font-bold">+563%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-[#223049]">ETI</td>
                  <td className="p-4 text-gray-700">100</td>
                  <td className="p-4 text-gray-700">62,800€</td>
                  <td className="p-4 text-green-600 font-semibold">712,200€</td>
                  <td className="p-4 text-green-600 font-bold">+1,133%</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[#223049]">Grand Groupe</td>
                  <td className="p-4 text-gray-700">1,000</td>
                  <td className="p-4 text-gray-700">570,000€</td>
                  <td className="p-4 text-green-600 font-semibold">4,180,000€</td>
                  <td className="p-4 text-green-600 font-bold">+733%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;