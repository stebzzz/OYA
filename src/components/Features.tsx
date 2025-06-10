import React from 'react';
import { Search, Target, Calendar, FileText, TrendingUp, Shield } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Search,
      title: "Recherche automatique",
      description: "Sourcing intelligent sur toutes les plateformes et LinkedIn selon vos critères précis",
      color: "from-[#ff6a3d] to-[#ff6a3d]/80"
    },
    {
      icon: Target,
      title: "Scoring IA temps réel",
      description: "Évaluation automatique des candidats avec estimation salariale et matching de compétences",
      color: "from-[#9b6bff] to-[#9b6bff]/80"
    },
    {
      icon: Calendar,
      title: "Organisation automatique",
      description: "Planification des entretiens, relances et mise à jour d'agenda des recruteurs",
      color: "from-green-500 to-green-400"
    },
    {
      icon: FileText,
      title: "Centralisation CRM",
      description: "Interface unique avec filtres avancés, notes et historique complet des interactions",
      color: "from-blue-500 to-blue-400"
    },
    {
      icon: TrendingUp,
      title: "Analytics avancées",
      description: "Tableaux de bord en temps réel avec KPIs de performance et ROI détaillé",
      color: "from-purple-500 to-purple-400"
    },
    {
      icon: Shield,
      title: "Sécurité entreprise",
      description: "Hébergement sécurisé, intégration SIRH, conformité RGPD et SSO",
      color: "from-red-500 to-red-400"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-[#ff6a3d]/10 rounded-full text-[#ff6a3d] font-medium text-sm mb-6">
            🤖 IA qui restructure votre chaîne de recrutement
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-[#223049] mb-6">
            Une plateforme complète pour révolutionner vos RH
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            OYA centralise tout comme un CRM mais agit comme un moteur intelligent 
            centralisé, capable d'automatiser l'intégralité de votre processus de recrutement.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="text-white" size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-[#223049] mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ff6a3d]/5 to-[#9b6bff]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#223049] to-[#223049]/90 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6">
              Prêt à transformer votre recrutement ?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Rejoignez les entreprises qui ont déjà supprimé leurs intermédiaires 
              et automatisé leur processus de recrutement.
            </p>
            <button className="bg-[#ff6a3d] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#ff6a3d]/90 transition-all transform hover:scale-105">
              Demander une démo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;