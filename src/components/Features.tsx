import React from 'react';
import { Search, Target, Calendar, FileText, TrendingUp, Shield, Video, Users, BarChart3, Zap, Clock, Globe } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Clock,
      title: "✔ Création d'annonces en 2 minutes",
      description: "Intelligente, assistée par IA, optimisée selon les plateformes et le poste",
      color: "from-[#ff6a3d] to-[#ff6a3d]/80"
    },
    {
      icon: Globe,
      title: "✔ Diffusion multi-canal automatique",
      description: "+20 jobboards, sites et apps de recrutement connectés nativement, sans surcoût",
      color: "from-[#9b6bff] to-[#9b6bff]/80"
    },
    {
      icon: Search,
      title: "✔ Sourcing boosté par IA",
      description: "L'algorithme vous propose les meilleurs profils disponibles, sans chasse manuelle",
      color: "from-green-500 to-green-400"
    },
    {
      icon: Video,
      title: "✔ Entretiens en visio intégrée avec IA",
      description: "Analyse faciale, transcription en temps réel, notation automatique, compte rendu intelligent",
      color: "from-blue-500 to-blue-400"
    },
    {
      icon: BarChart3,
      title: "✔ Scoring et compte rendu final en un clic",
      description: "Avec axes d'amélioration, synthèse RH, export PDF ou CRM",
      color: "from-purple-500 to-purple-400"
    },
    {
      icon: Users,
      title: "✔ CRM natif pour pilotage et suivi",
      description: "Pipeline clair, reporting automatique, partage interne, multi-utilisateurs",
      color: "from-red-500 to-red-400"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Why OYA Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-[#ff6a3d]/10 rounded-full text-[#ff6a3d] font-medium text-sm mb-6">
            🚀 Pourquoi OYA change la donne ?
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-[#223049] mb-6">
            Les outils de recrutement n'ont pas évolué depuis des années
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Ils sont fragmentés, chronophages, peu intégrés, et vous ralentissent.<br/>
            <strong>OYA est une rupture.</strong><br/>
            Un logiciel autonome, intelligent et complet qui vous permet de recruter de façon radicalement plus rapide et plus qualitative, sans dépendre de 5 outils différents.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-[#ff6a3d]/10 to-[#ff6a3d]/5 p-6 rounded-xl">
              <div className="text-2xl mb-2">💡</div>
              <p className="text-gray-700">Recrutez en quelques heures au lieu de plusieurs jours</p>
            </div>
            <div className="bg-gradient-to-r from-[#9b6bff]/10 to-[#9b6bff]/5 p-6 rounded-xl">
              <div className="text-2xl mb-2">💡</div>
              <p className="text-gray-700">Générez des entretiens notés, enregistrés et synthétisés automatiquement</p>
            </div>
            <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 p-6 rounded-xl">
              <div className="text-2xl mb-2">💡</div>
              <p className="text-gray-700">Créez, diffusez, suivez, transformez… tout-en-un</p>
            </div>
          </div>
        </div>
        
        {/* What OYA Does Header */}
        <div className="text-center mb-16">
          <h3 className="text-3xl lg:text-4xl font-bold text-[#223049] mb-6">
            💡 Ce que fait OYA (et ce que les autres ne font pas)
          </h3>
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

        {/* Results Section */}
        <div className="text-center mt-20 mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#9b6bff]/10 to-[#ff6a3d]/10 rounded-full text-[#9b6bff] font-semibold text-sm mb-8 animate-pulse">
            <span className="mr-2 text-lg">📊</span>
            Résultat immédiat
          </div>
          
          <h3 className="text-3xl lg:text-4xl font-bold text-[#223049] mb-12">
            Des résultats <span className="bg-gradient-to-r from-[#ff6a3d] to-[#9b6bff] bg-clip-text text-transparent">mesurables dès le premier mois</span>
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-12">
            <div className="group relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-[#ff6a3d]/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6a3d]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🕐</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-[#ff6a3d] to-[#ff6a3d]/80 bg-clip-text text-transparent mb-3">70-90%</div>
                <p className="text-gray-700 font-medium">Gain de temps</p>
                <div className="mt-4 h-1 bg-gradient-to-r from-[#ff6a3d] to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-[#9b6bff]/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9b6bff]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📈</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-[#9b6bff] to-[#9b6bff]/80 bg-clip-text text-transparent mb-3">+60%</div>
                <p className="text-gray-700 font-medium">Profils transformés grâce au matching prédictif</p>
                <div className="mt-4 h-1 bg-gradient-to-r from-[#9b6bff] to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-green-500/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">💸</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-green-400 bg-clip-text text-transparent mb-3">-50%</div>
                <p className="text-gray-700 font-medium">Réduction du coût par embauche</p>
                <div className="mt-4 h-1 bg-gradient-to-r from-green-500 to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-blue-500/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🧩</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent mb-3">1</div>
                <p className="text-gray-700 font-medium">Plus besoin d'ATS, jobboards externes, outils visio ou CRM RH séparés</p>
                <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-[#223049]/5 to-[#9b6bff]/5 rounded-2xl p-6 max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 font-medium">
              💡 <strong>En moyenne, nos clients économisent 15h par semaine</strong> et augmentent leur taux de transformation de 40%
            </p>
          </div>
        </div>

        {/* Target Audience Section */}
        <div className="text-center mt-20 mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full text-green-600 font-semibold text-sm mb-8 animate-bounce">
            <span className="mr-2 text-lg">🎯</span>
            Pour qui est conçu OYA ?
          </div>
          
          <h3 className="text-3xl lg:text-4xl font-bold text-[#223049] mb-4">
            Conçu pour les <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">professionnels du recrutement</span>
          </h3>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Que vous soyez une agence indépendante ou un groupe international, OYA s'adapte à votre organisation
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-12">
            <div className="group relative bg-gradient-to-br from-green-50 via-white to-green-50/30 p-8 rounded-2xl border-2 border-green-100 hover:border-green-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-400 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <span className="text-2xl text-white">✅</span>
                </div>
                <h4 className="text-xl font-bold text-[#223049] mb-3">Agences de recrutement</h4>
                <p className="text-gray-600 font-medium">indépendantes</p>
                <div className="mt-6 h-1 bg-gradient-to-r from-green-500 to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              </div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-blue-50 via-white to-blue-50/30 p-8 rounded-2xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:-rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-400 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <span className="text-2xl text-white">✅</span>
                </div>
                <h4 className="text-xl font-bold text-[#223049] mb-3">Groupes RH multi-sites</h4>
                <p className="text-gray-600 font-medium">et réseaux d'agences</p>
                <div className="mt-6 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              </div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-purple-50 via-white to-purple-50/30 p-8 rounded-2xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-400 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <span className="text-2xl text-white">✅</span>
                </div>
                <h4 className="text-xl font-bold text-[#223049] mb-3">Cabinets de chasse</h4>
                <p className="text-gray-600 font-medium">ou d'intérim haut volume</p>
                <div className="mt-6 h-1 bg-gradient-to-r from-purple-500 to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              </div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-orange-50 via-white to-orange-50/30 p-8 rounded-2xl border-2 border-orange-100 hover:border-orange-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:-rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <span className="text-2xl text-white">✅</span>
                </div>
                <h4 className="text-xl font-bold text-[#223049] mb-3">Directions RH exigeantes</h4>
                <p className="text-gray-600 font-medium">qui veulent industrialiser sans complexifier</p>
                <div className="mt-6 h-1 bg-gradient-to-r from-orange-500 to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="group bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl group-hover:animate-spin">👥</span>
                <span className="text-gray-700 font-medium">Monosite ou multisite, OYA s'adapte à votre organisation</span>
              </div>
            </div>
            <div className="group bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl group-hover:animate-bounce">🌍</span>
                <span className="text-gray-700 font-medium">Disponible partout en France & à l'international</span>
              </div>
            </div>
            <div className="group bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl group-hover:animate-pulse">🔒</span>
                <span className="text-gray-700 font-medium">100% hébergé en France (RGPD by design)</span>
              </div>
            </div>
          </div>
        </div>



        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#223049] to-[#223049]/90 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6">
              📆 Demandez votre démonstration privée
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Rejoignez les acteurs du recrutement qui ne veulent plus perdre de temps.<br/>
              Offrez à vos équipes une solution qui fait le travail, mieux que tout le reste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://calendly.com/contact-oyaintelligence" target="_blank" rel="noopener noreferrer" className="bg-[#ff6a3d] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#ff6a3d]/90 transition-all transform hover:scale-105 text-center">
                Réserver une démo
              </a>
              <a href="https://calendly.com/contact-oyaintelligence" target="_blank" rel="noopener noreferrer" className="bg-white text-[#223049] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all text-center">
                Voir le logiciel en action
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;