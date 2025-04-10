import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Briefcase, BarChart3, Search, Shield, Clock, CheckCircle, Star } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-800 text-white">
      {/* Navigation */}
      <nav className="relative z-10 py-6 px-8 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative h-10 w-10 mr-3">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 opacity-70 blur-[2px]"></div>
              <div className="relative h-full w-full rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-2xl">
                O
              </div>
            </div>
            <h1 className="text-2xl font-heading font-bold text-transparent bg-gradient-to-r from-primary-400 via-blue-400 to-secondary-400 bg-clip-text">
              OYA
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm text-gray-300 hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#why-oya" className="text-sm text-gray-300 hover:text-white transition-colors">Pourquoi OYA</a>
            <a href="#testimonials" className="text-sm text-gray-300 hover:text-white transition-colors">Témoignages</a>
            <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors">Se connecter</Link>
          </div>
          
          <Link 
            to="/signup" 
            className="relative group overflow-hidden rounded-full px-6 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            S'inscrire
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 px-8 md:px-12">
        {/* Background Effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-600/10 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-secondary-600/10 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-blue-600/10 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
                  <span className="text-transparent bg-gradient-to-r from-primary-400 via-blue-400 to-secondary-400 bg-clip-text">Révolutionnez</span> la 
                  <br />gestion de vos intérimaires
                </h1>
                <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-secondary-500 mt-4 rounded-full"></div>
              </div>
              
              <p className="text-gray-300 text-lg max-w-xl">
                OYA simplifie la gestion des ressources temporaires pour les agences d'intérim et les entreprises, avec une plateforme intuitive et puissante.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/signup" 
                  className="relative group overflow-hidden rounded-full px-8 py-3.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  Démarrer maintenant
                </Link>
                
                <a 
                  href="#features" 
                  className="rounded-full px-8 py-3.5 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/10 text-center"
                >
                  En savoir plus
                </a>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gradient-to-br from-gray-600 to-gray-700"></div>
                  ))}
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-white font-semibold">+200</span> agences nous font confiance
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-3xl blur-3xl opacity-30"></div>
              <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-1 border border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary-500/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-secondary-500/10 rounded-full -translate-x-1/3 translate-y-1/3 blur-2xl"></div>
                
                <div className="bg-gray-950/80 backdrop-blur-xl rounded-2xl overflow-hidden p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-400"></div>
                      <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                      <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="text-xs text-gray-400">dashboard.oya.io</div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-transparent bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text">Vue d'ensemble</h3>
                        <div className="text-xs text-gray-400">Aujourd'hui</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/5">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-gray-400 text-xs">Intérimaires actifs</div>
                              <div className="text-2xl font-bold mt-1">124</div>
                            </div>
                            <div className="p-2 rounded-lg bg-primary-500/20">
                              <Users className="h-5 w-5 text-primary-400" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/5">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-gray-400 text-xs">Missions en cours</div>
                              <div className="text-2xl font-bold mt-1">12</div>
                            </div>
                            <div className="p-2 rounded-lg bg-secondary-500/20">
                              <Briefcase className="h-5 w-5 text-secondary-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg p-4 border border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium">Performance mensuelle</div>
                        <div className="text-xs text-emerald-400 flex items-center">
                          +12.5% <ArrowRight className="ml-1 h-3 w-3" />
                        </div>
                      </div>
                      
                      <div className="h-16 flex items-end space-x-2">
                        {[25, 40, 30, 50, 38, 52, 45, 70, 60, 75, 62].map((height, i) => (
                          <div 
                            key={i} 
                            className="flex-1 bg-gradient-to-t from-primary-500/50 to-secondary-500/50 rounded-t-sm"
                            style={{ height: `${height}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm font-medium">Missions récentes</div>
                      
                      <div className="space-y-2">
                        {[
                          { title: 'Soudeur TIG', client: 'Industrie Métallique SA', status: 'confirmed' },
                          { title: 'Manutentionnaire', client: 'Logistique Express', status: 'pending' },
                        ].map((mission, i) => (
                          <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/5">
                            <div className="flex items-center space-x-3">
                              <div className="p-1.5 rounded-lg bg-blue-500/20">
                                <Briefcase className="h-4 w-4 text-blue-400" />
                              </div>
                              <div>
                                <div className="text-sm font-medium">{mission.title}</div>
                                <div className="text-xs text-gray-400">{mission.client}</div>
                              </div>
                            </div>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              mission.status === 'confirmed' 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {mission.status === 'confirmed' ? 'Confirmée' : 'En attente'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-8 md:px-12 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-transparent bg-gradient-to-r from-primary-400 via-blue-400 to-secondary-400 bg-clip-text mb-4">
              Une solution complète pour votre agence d'intérim
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mt-4 mb-6 rounded-full"></div>
            <p className="text-gray-300">
              Découvrez comment OYA transforme la gestion d'intérim avec des outils puissants et intuitifs pour chaque aspect de votre activité.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Gestion des intérimaires",
                description: "Centralisez toutes les informations de vos intérimaires et suivez leurs disponibilités en temps réel.",
                color: "from-violet-500 to-indigo-600",
                glow: "from-violet-600/10 via-indigo-600/5 to-transparent"
              },
              {
                icon: Briefcase,
                title: "Suivi des missions",
                description: "Gérez facilement l'ensemble du cycle de vie des missions, de la création à la facturation.",
                color: "from-sky-500 to-cyan-600",
                glow: "from-sky-600/10 via-cyan-600/5 to-transparent"
              },
              {
                icon: Clock,
                title: "Gestion des heures",
                description: "Suivez précisément les heures travaillées et automatisez la génération des fiches de paie.",
                color: "from-emerald-500 to-teal-600",
                glow: "from-emerald-600/10 via-teal-600/5 to-transparent"
              },
              {
                icon: Search,
                title: "Matching intelligent",
                description: "Trouvez rapidement les meilleurs profils grâce à notre algorithme de matching avancé.",
                color: "from-amber-500 to-yellow-600",
                glow: "from-amber-600/10 via-yellow-600/5 to-transparent"
              },
              {
                icon: Shield,
                title: "Conformité légale",
                description: "Assurez-vous que tous vos contrats et documents sont conformes à la législation en vigueur.",
                color: "from-rose-500 to-pink-600",
                glow: "from-rose-600/10 via-pink-600/5 to-transparent"
              },
              {
                icon: BarChart3,
                title: "Analyses avancées",
                description: "Obtenez des insights précieux sur vos performances avec nos tableaux de bord interactifs.",
                color: "from-blue-500 to-indigo-600",
                glow: "from-blue-600/10 via-indigo-600/5 to-transparent"
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] border-l-2 group"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.005))',
                  boxShadow: '0 4px 25px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.06)',
                  borderLeftColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className={`absolute bottom-0 right-0 h-32 w-32 rounded-full bg-gradient-radial ${feature.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out blur-2xl`}></div>
                
                <div className="relative p-6 md:p-8">
                  <div className="mb-5">
                    <div className="relative inline-block">
                      <div className={`absolute inset-0 rounded-lg blur-sm opacity-50 bg-gradient-to-br ${feature.color}`}></div>
                      <div className={`relative p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                        <feature.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why OYA Section */}
      <section id="why-oya" className="py-24 px-8 md:px-12 relative bg-gray-950/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-secondary-600/5"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-transparent bg-gradient-to-r from-primary-400 via-blue-400 to-secondary-400 bg-clip-text mb-4">
              Pourquoi choisir OYA ?
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mt-4 mb-6 rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-3xl blur-3xl opacity-30"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" 
                    alt="Équipe OYA" 
                    className="w-full h-full object-cover rounded-3xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              {[
                {
                  title: "Gain de temps exceptionnel",
                  description: "Réduisez de 70% le temps consacré aux tâches administratives grâce à nos processus automatisés."
                },
                {
                  title: "Interface intuitive",
                  description: "Une expérience utilisateur soignée qui garantit une prise en main rapide pour toute votre équipe."
                },
                {
                  title: "Solution tout-en-un",
                  description: "Abandonnez les multiples outils disparates au profit d'une plateforme unique et centralisée."
                },
                {
                  title: "Accompagnement expert",
                  description: "Notre équipe vous guide à chaque étape, de l'implémentation à l'utilisation quotidienne."
                }
              ].map((item, i) => (
                <div key={i} className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-gray-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-8 md:px-12 relative">
        <div className="absolute -top-40 left-20 w-72 h-72 bg-primary-600/10 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-40 right-20 w-72 h-72 bg-secondary-600/10 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-transparent bg-gradient-to-r from-primary-400 via-blue-400 to-secondary-400 bg-clip-text mb-4">
              Ce que nos clients disent
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mt-4 mb-6 rounded-full"></div>
            <p className="text-gray-300">
              Découvrez comment OYA a transformé l'activité de nos clients à travers la France.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sophie Martin",
                role: "Directrice d'agence, Lyon",
                quote: "Depuis que nous utilisons OYA, notre productivité a augmenté de 40%. L'interface est intuitive et nos consultants peuvent se concentrer sur la relation client plutôt que sur l'administratif.",
                rating: 5
              },
              {
                name: "Thomas Durand",
                role: "Responsable RH, Paris",
                quote: "La simplicité d'OYA nous a permis de digitaliser l'ensemble de notre processus de recrutement en temps record. Le support client est exceptionnel!",
                rating: 5
              },
              {
                name: "Léa Dubois",
                role: "Gérante, Nantes",
                quote: "OYA nous a aidés à augmenter notre chiffre d'affaires de 25% en un an. La solution a complètement transformé notre façon de gérer les missions d'intérim.",
                rating: 4
              }
            ].map((testimonial, i) => (
              <div 
                key={i} 
                className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] group"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.005))',
                  boxShadow: '0 4px 25px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.06)'
                }}
              >
                <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-full -translate-x-1/3 -translate-y-1/3 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative p-6 md:p-8">
                  <div className="flex mb-6">
                    {Array(5).fill(0).map((_, j) => (
                      <Star 
                        key={j} 
                        className={`h-5 w-5 ${j < testimonial.rating ? 'text-amber-400' : 'text-gray-600'}`}
                        fill={j < testimonial.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-300 mb-6">"{testimonial.quote}"</blockquote>
                  
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center text-white font-bold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 md:px-12 relative bg-gradient-to-b from-gray-950/50 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-secondary-600/5"></div>
        
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-transparent bg-gradient-to-r from-primary-400 via-blue-400 to-secondary-400 bg-clip-text mb-4">
              Prêt à révolutionner votre gestion d'intérim ?
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Rejoignez les centaines d'agences qui ont déjà adopté OYA et transformez votre façon de travailler.
            </p>
          </div>
          
          <div className="relative p-8 md:p-10 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-secondary-600/20 blur-3xl opacity-30"></div>
            <div className="absolute inset-0 backdrop-blur-sm bg-gray-900/60 border border-white/10 rounded-3xl"></div>
            
            <div className="relative flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-between">
              <div className="space-y-4 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white">Démarrez votre essai gratuit</h3>
                <p className="text-gray-300">30 jours d'accès complet, sans engagement. Aucune carte bancaire requise.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/signup" 
                  className="relative group overflow-hidden rounded-full px-8 py-3.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  Essayer gratuitement
                </Link>
                
                <a 
                  href="#" 
                  className="rounded-full px-8 py-3.5 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/10 text-center"
                >
                  Contacter l'équipe
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 md:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center mb-6">
                <div className="relative h-10 w-10 mr-3">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 opacity-70 blur-[2px]"></div>
                  <div className="relative h-full w-full rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-2xl">
                    O
                  </div>
                </div>
                <h1 className="text-2xl font-heading font-bold text-transparent bg-gradient-to-r from-primary-400 via-blue-400 to-secondary-400 bg-clip-text">
                  OYA
                </h1>
              </div>
              <p className="text-gray-400 mb-6">
                La solution qui simplifie votre gestion d'intérim au quotidien.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'linkedin', 'facebook', 'instagram'].map((social) => (
                  <a 
                    key={social} 
                    href="#" 
                    className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary-500/20 hover:text-primary-400 transition-colors duration-300"
                  >
                    <span className="sr-only">{social}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Produit</h3>
              <ul className="space-y-3">
                {['Fonctionnalités', 'Tarifs', 'Témoignages', 'FAQ'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Entreprise</h3>
              <ul className="space-y-3">
                {['À propos', 'Blog', 'Carrières', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Légal</h3>
              <ul className="space-y-3">
                {['Confidentialité', 'Conditions', 'Cookies', 'Mentions légales'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 OYA. Tous droits réservés.
            </p>
            <div className="mt-4 md:mt-0">
              <select className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-gray-400 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}; 