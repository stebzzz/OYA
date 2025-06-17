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
        {/* Why Oya Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-[#ff6a3d]/10 rounded-full text-[#ff6a3d] font-medium text-sm mb-6">
            🚀 Pourquoi Oya change la donne ?
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-[#223049] mb-6">
            Les outils de recrutement n'ont pas évolué depuis des années
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Ils sont fragmentés, chronophages, peu intégrés, et vous ralentissent.<br/>
            <strong>Oya est une rupture.</strong><br/>
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
        
        {/* What Oya Does Header */}
        <div className="text-center mb-16">
          <h3 className="text-3xl lg:text-4xl font-bold text-[#223049] mb-6">
            💡 Ce que fait Oya (et ce que les autres ne font pas)
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
          <div className="inline-flex items-center px-4 py-2 bg-[#9b6bff]/10 rounded-full text-[#9b6bff] font-medium text-sm mb-6">
            📊 Résultat immédiat
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all">
              <div className="text-3xl mb-2">🕐</div>
              <div className="text-2xl font-bold text-[#223049] mb-2">70-90%</div>
              <p className="text-gray-600 text-sm">Gain de temps</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-2xl font-bold text-[#223049] mb-2">+60%</div>
              <p className="text-gray-600 text-sm">Profils transformés grâce au matching prédictif</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all">
              <div className="text-3xl mb-2">💸</div>
              <div className="text-2xl font-bold text-[#223049] mb-2">-50%</div>
              <p className="text-gray-600 text-sm">Réduction du coût par embauche</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all">
              <div className="text-3xl mb-2">🧩</div>
              <div className="text-2xl font-bold text-[#223049] mb-2">1</div>
              <p className="text-gray-600 text-sm">Plus besoin d'ATS, jobboards externes, outils visio ou CRM RH séparés</p>
            </div>
          </div>
        </div>

        {/* Target Audience Section */}
        <div className="text-center mt-20 mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-500/10 rounded-full text-green-600 font-medium text-sm mb-6">
            🎯 Pour qui est conçu Oya ?
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
              <div className="text-2xl mb-3">✅</div>
              <h4 className="font-semibold text-[#223049] mb-2">Agences de recrutement</h4>
              <p className="text-gray-600 text-sm">indépendantes</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
              <div className="text-2xl mb-3">✅</div>
              <h4 className="font-semibold text-[#223049] mb-2">Groupes RH multi-sites</h4>
              <p className="text-gray-600 text-sm">et réseaux d'agences</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
              <div className="text-2xl mb-3">✅</div>
              <h4 className="font-semibold text-[#223049] mb-2">Cabinets de chasse</h4>
              <p className="text-gray-600 text-sm">ou d'intérim haut volume</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
              <div className="text-2xl mb-3">✅</div>
              <h4 className="font-semibold text-[#223049] mb-2">Directions RH exigeantes</h4>
              <p className="text-gray-600 text-sm">qui veulent industrialiser sans complexifier</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <span>👥</span>
              <span>Monosite ou multisite, Oya s'adapte à votre organisation</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>🌍</span>
              <span>Disponible partout en France & à l'international</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>🔒</span>
              <span>100% hébergé en France (RGPD by design)</span>
            </div>
          </div>
        </div>

        {/* What Makes You Addicted Section */}
        <div className="text-center mt-20 mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-red-500/10 rounded-full text-red-600 font-medium text-sm mb-6">
            🔥 Ce qui vous rendra accro à Oya
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
            <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-xl border border-red-100">
              <div className="text-2xl mb-3">✨</div>
              <h4 className="font-semibold text-[#223049] mb-2">Une expérience fluide</h4>
              <p className="text-gray-600 text-sm">pour les recruteurs</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-xl border border-red-100">
              <div className="text-2xl mb-3">🎨</div>
              <h4 className="font-semibold text-[#223049] mb-2">Une interface moderne</h4>
              <p className="text-gray-600 text-sm">et professionnelle</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-xl border border-red-100">
              <div className="text-2xl mb-3">⭐</div>
              <h4 className="font-semibold text-[#223049] mb-2">Une image valorisée</h4>
              <p className="text-gray-600 text-sm">auprès des candidats (entretien via Oya = gage de qualité)</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-xl border border-red-100">
              <div className="text-2xl mb-3">📈</div>
              <h4 className="font-semibold text-[#223049] mb-2">Un retour sur investissement</h4>
              <p className="text-gray-600 text-sm">visible en quelques jours</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto text-gray-700">
            <div className="flex items-center justify-center space-x-2">
              <span>🎤</span>
              <span>Plus besoin de Teams pour vos entretiens</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>🎯</span>
              <span>Plus besoin d'acheter 3 logiciels différents</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>🔁</span>
              <span>Plus besoin de processus manuels ou de copier-coller</span>
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
              <button className="bg-[#ff6a3d] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#ff6a3d]/90 transition-all transform hover:scale-105">
                🟢 Réserver une démo
              </button>
              <button className="bg-white text-[#223049] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all">
                🟢 Voir le logiciel en action
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;