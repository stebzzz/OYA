import React, { useEffect, useState } from 'react';
import { Search, Target, Calendar, FileText, TrendingUp, Shield, Video, Users, BarChart3, Zap, Clock, Globe, ArrowRight, X, Check, ArrowUpRight } from 'lucide-react';

const Features: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleTableRows, setVisibleTableRows] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Animate table rows one by one
    const tableTimer = setTimeout(() => {
      const rowTimers = Array.from({ length: 6 }, (_, i) => 
        setTimeout(() => {
          setVisibleTableRows(prev => [...prev, i]);
        }, 1000 + i * 150)
      );
      
      return () => {
        rowTimers.forEach(clearTimeout);
      };
    }, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(tableTimer);
    };
  }, []);

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

  const beforeAfterData = [
    {
      category: "Création d'annonces",
      before: "2-3 heures de rédaction manuelle",
      after: "2 minutes avec l'IA d'OYA",
      icon: "📝"
    },
    {
      category: "Diffusion",
      before: "Publication manuelle sur 5-6 sites",
      after: "Diffusion automatique sur +20 plateformes",
      icon: "📡"
    },
    {
      category: "Sourcing",
      before: "Recherche manuelle pendant des heures",
      after: "Algorithme IA propose les meilleurs profils",
      icon: "🔍"
    },
    {
      category: "Entretiens",
      before: "Prise de notes, pas d'analyse",
      after: "Transcription + analyse IA en temps réel",
      icon: "🎥"
    },
    {
      category: "Suivi",
      before: "Excel ou CRM externe complexe",
      after: "CRM natif intégré et automatisé",
      icon: "📊"
    },
    {
      category: "Reporting",
      before: "Compilation manuelle des données",
      after: "Rapports automatiques et insights IA",
      icon: "📈"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Why Oya Section */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
            <div className="bg-gradient-to-r from-[#ff6a3d]/10 to-[#ff6a3d]/5 p-6 rounded-xl hover:scale-105 transition-transform duration-300">
              <div className="text-2xl mb-2">💡</div>
              <p className="text-gray-700">Recrutez en quelques heures au lieu de plusieurs jours</p>
            </div>
            <div className="bg-gradient-to-r from-[#9b6bff]/10 to-[#9b6bff]/5 p-6 rounded-xl hover:scale-105 transition-transform duration-300">
              <div className="text-2xl mb-2">💡</div>
              <p className="text-gray-700">Générez des entretiens notés, enregistrés et synthétisés automatiquement</p>
            </div>
            <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 p-6 rounded-xl hover:scale-105 transition-transform duration-300">
              <div className="text-2xl mb-2">💡</div>
              <p className="text-gray-700">Créez, diffusez, suivez, transformez… tout-en-un</p>
            </div>
          </div>
        </div>
        
        {/* Before/After Comparison - New Design */}
        <div className={`mb-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-100 to-slate-50 rounded-full text-slate-700 font-semibold text-sm mb-8 border border-slate-200">
              <span className="mr-2 text-lg">⚡</span>
              Avant / Après OYA
            </div>
            
            <h3 className="text-3xl lg:text-4xl font-bold text-[#223049] mb-6">
              L'<span className="text-[#ff6a3d] font-extrabold">évolution</span> de votre processus de recrutement
            </h3>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Découvrez comment OYA révolutionne chaque étape de votre recrutement
            </p>
          </div>

          {/* Modern Card-Based Comparison */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Before Column */}
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-slate-100 rounded-full text-slate-600 font-semibold text-sm border border-slate-200">
                  <X size={16} className="mr-2 text-slate-500" />
                  Méthodes traditionnelles
                </div>
              </div>
              
              {beforeAfterData.map((item, index) => (
                <div 
                  key={`before-${index}`}
                  className={`group bg-slate-50 border border-slate-200 rounded-xl p-6 transition-all duration-500 hover:shadow-md transform ${
                    visibleTableRows.includes(index) 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 -translate-x-8'
                  }`}
                  style={{
                    transitionDelay: `${index * 150}ms`
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-lg">{item.icon}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">
                        {item.category}
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed group-hover:text-slate-700 transition-colors">
                        {item.before}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <X size={16} className="text-slate-400 group-hover:text-slate-500 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* After Column */}
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#ff6a3d]/10 to-[#ff6a3d]/5 rounded-full text-[#ff6a3d] font-semibold text-sm border border-[#ff6a3d]/20">
                  <Check size={16} className="mr-2 text-[#ff6a3d]" />
                  Avec OYA
                </div>
              </div>
              
              {beforeAfterData.map((item, index) => (
                <div 
                  key={`after-${index}`}
                  className={`group bg-gradient-to-br from-[#ff6a3d]/5 to-white border border-[#ff6a3d]/20 rounded-xl p-6 transition-all duration-500 hover:shadow-lg hover:border-[#ff6a3d]/30 transform ${
                    visibleTableRows.includes(index) 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 translate-x-8'
                  }`}
                  style={{
                    transitionDelay: `${index * 150}ms`
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#ff6a3d] to-[#ff6a3d]/80 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                        <span className="text-lg">{item.icon}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#223049] mb-2 group-hover:text-[#ff6a3d] transition-colors">
                        {item.category}
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed font-medium group-hover:text-[#223049] transition-colors">
                        {item.after}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-[#ff6a3d] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Check size={12} className="text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Subtle arrow indicator */}
                  <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 lg:block hidden">
                    <ArrowUpRight size={16} className="text-[#ff6a3d]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#ff6a3d] to-[#ff6a3d]/90 rounded-full text-white font-semibold text-sm hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg">
              <span className="mr-2">🚀</span>
              Découvrez la différence en action
              <ArrowRight size={16} className="ml-2" />
            </div>
          </div>
        </div>
        
        {/* What Oya Does Header */}
        <div className={`text-center mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="text-3xl lg:text-4xl font-bold text-[#223049] mb-6">
            💡 Ce que fait Oya (et ce que les autres ne font pas)
          </h3>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300`}>
                <feature.icon className="text-white" size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-[#223049] mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ff6a3d]/5 to-[#9b6bff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Results Section */}
        <div className={`text-center mt-20 mb-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#9b6bff]/10 to-[#ff6a3d]/10 rounded-full text-[#9b6bff] font-semibold text-sm mb-8">
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
          
          <div className="bg-gradient-to-r from-[#223049]/5 to-[#9b6bff]/5 rounded-2xl p-6 max-w-4xl mx-auto hover:scale-105 transition-transform duration-300">
            <p className="text-lg text-gray-700 font-medium">
              💡 <strong>En moyenne, nos clients économisent 15h par semaine</strong> et augmentent leur taux de transformation de 40%
            </p>
          </div>
        </div>

        {/* Target Audience Section */}
        <div className={`text-center mt-20 mb-16 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#ff6a3d]/10 to-[#9b6bff]/10 rounded-full text-[#ff6a3d] font-semibold text-sm mb-8">
            <span className="mr-2 text-lg">🚀</span>
            Qui peut révolutionner son recrutement avec Oya ?
          </div>
          
          <h3 className="text-3xl lg:text-4xl font-bold text-[#223049] mb-4">
            La solution <span className="bg-gradient-to-r from-[#ff6a3d] to-[#9b6bff] bg-clip-text text-transparent font-extrabold">nouvelle génération</span> pour tous les recruteurs
          </h3>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            De l'agence boutique au groupe international, Oya transforme radicalement votre façon de recruter
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-12">
            <div className="group relative bg-gradient-to-br from-[#ff6a3d]/5 via-white to-[#ff6a3d]/10 p-8 rounded-2xl border-2 border-[#ff6a3d]/20 hover:border-[#ff6a3d]/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6a3d]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#ff6a3d] to-[#ff6a3d]/80 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <span className="text-2xl text-white">🏢</span>
                </div>
                <h4 className="text-xl font-bold text-[#ff6a3d] mb-3">Agences indépendantes</h4>
                <p className="text-gray-700 font-medium">Boostez votre productivité et votre différenciation</p>
                <div className="mt-6 h-1 bg-gradient-to-r from-[#ff6a3d] to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              </div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-[#9b6bff]/5 via-white to-[#9b6bff]/10 p-8 rounded-2xl border-2 border-[#9b6bff]/20 hover:border-[#9b6bff]/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9b6bff]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#9b6bff] to-[#9b6bff]/80 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <span className="text-2xl text-white">🌐</span>
                </div>
                <h4 className="text-xl font-bold text-[#9b6bff] mb-3">Groupes multi-sites</h4>
                <p className="text-gray-700 font-medium">Standardisez et optimisez à grande échelle</p>
                <div className="mt-6 h-1 bg-gradient-to-r from-[#9b6bff] to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              </div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-emerald-500/5 via-white to-emerald-500/10 p-8 rounded-2xl border-2 border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <span className="text-2xl text-white">🎯</span>
                </div>
                <h4 className="text-xl font-bold text-emerald-600 mb-3">Cabinets spécialisés</h4>
                <p className="text-gray-700 font-medium">Chasse de têtes et recrutement premium</p>
                <div className="mt-6 h-1 bg-gradient-to-r from-emerald-500 to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              </div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-amber-500/5 via-white to-amber-500/10 p-8 rounded-2xl border-2 border-amber-500/20 hover:border-amber-500/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-400 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <span className="text-2xl text-white">⚡</span>
                </div>
                <h4 className="text-xl font-bold text-amber-600 mb-3">Directions RH innovantes</h4>
                <p className="text-gray-700 font-medium">Révolutionnez vos processus internes</p>
                <div className="mt-6 h-1 bg-gradient-to-r from-amber-500 to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="group bg-gradient-to-br from-[#ff6a3d]/5 to-white p-6 rounded-xl border border-[#ff6a3d]/20 hover:border-[#ff6a3d]/40 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl">🚀</span>
                <span className="text-[#ff6a3d] font-semibold">Déploiement ultra-rapide : opérationnel en 48h</span>
              </div>
            </div>
            <div className="group bg-gradient-to-br from-[#9b6bff]/5 to-white p-6 rounded-xl border border-[#9b6bff]/20 hover:border-[#9b6bff]/40 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl">🌍</span>
                <span className="text-[#9b6bff] font-semibold">Disponible en France et à l'international</span>
              </div>
            </div>
            <div className="group bg-gradient-to-br from-emerald-500/5 to-white p-6 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl">🔒</span>
                <span className="text-emerald-600 font-semibold">Sécurité maximale : hébergement France (RGPD)</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-1100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-gradient-to-r from-[#223049] to-[#223049]/90 rounded-2xl p-8 lg:p-12 hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6">
              📆 Demandez votre démonstration privée
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Rejoignez les acteurs du recrutement qui ne veulent plus perdre de temps.<br/>
              Offrez à vos équipes une solution qui fait le travail, mieux que tout le reste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#ff6a3d] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#ff6a3d]/90 transition-all transform hover:scale-105 hover:shadow-lg">
                Réserver une démo
              </button>
              <button className="bg-white text-[#223049] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
                Voir le logiciel en action
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;