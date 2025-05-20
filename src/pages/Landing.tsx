import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Briefcase, BarChart3, Search, Shield, Clock, CheckCircle, Star, Brain, Bot, Calendar, FileText } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-light text-dark">
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
            <div className="flex flex-col">
              <h1 className="text-2xl font-heading font-bold text-dark">
                oya
            </h1>
              <span className="text-xs tracking-[1.48px] text-dark">intelligence</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm text-dark hover:text-primary-500 transition-colors">Fonctionnalités</a>
            <a href="#why-oya" className="text-sm text-dark hover:text-primary-500 transition-colors">Pourquoi OYA</a>
            <a href="#testimonials" className="text-sm text-dark hover:text-primary-500 transition-colors">Témoignages</a>
            <Link to="/login" className="text-sm text-dark hover:text-primary-500 transition-colors">Se connecter</Link>
          </div>
          
          <Link 
            to="/signup" 
            className="relative group overflow-hidden rounded-full px-6 py-2.5 bg-primary-500 text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            S'inscrire
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 px-8 md:px-12">
        {/* Background Effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-500/10 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-secondary-500/10 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-primary-500/10 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight text-dark">
                  <span className="text-primary-500">La plateforme IA </span>
                  <span className="text-secondary-500">qui transforme le recrutement</span>
                </h1>
                <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-secondary-500 mt-4 rounded-full"></div>
              </div>
              
              <p className="text-dark text-lg max-w-xl">
                OYA n'est pas un simple outil. C'est une plateforme d'IA RH intelligente, conçue pour automatiser, sécuriser et accélérer tout le processus de recrutement, tout en supprimant les intermédiaires coûteux.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/signup" 
                  className="relative group overflow-hidden rounded-full px-8 py-3.5 bg-primary-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  Révolutionner mon recrutement
                </Link>
                
                <a 
                  href="#features" 
                  className="rounded-full px-8 py-3.5 bg-secondary-500/10 text-dark font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-secondary-500/20 text-center"
                >
                  Découvrir la plateforme
                </a>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-light bg-primary-500/20"></div>
                  ))}
                </div>
                <div className="text-sm text-dark">
                  <span className="text-primary-500 font-semibold">+200</span> entreprises nous font confiance
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-3xl blur-3xl opacity-30"></div>
              <div className="relative bg-white rounded-3xl p-1 border border-dark/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary-500/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-secondary-500/10 rounded-full -translate-x-1/3 translate-y-1/3 blur-2xl"></div>
                
                <div className="bg-white rounded-2xl overflow-hidden p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-400"></div>
                      <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                      <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="text-xs text-dark/60">dashboard.oya.io</div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-primary-500">Vue d'ensemble</h3>
                        <div className="text-xs text-dark/60">Cette semaine</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-light rounded-lg p-4 border border-dark/5">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-dark/60 text-xs">Candidats identifiés</div>
                              <div className="text-2xl font-bold mt-1 text-dark">87</div>
                            </div>
                            <div className="p-2 rounded-lg bg-primary-500/20">
                              <Users className="h-5 w-5 text-primary-500" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-light rounded-lg p-4 border border-dark/5">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-dark/60 text-xs">Entretiens programmés</div>
                              <div className="text-2xl font-bold mt-1 text-dark">12</div>
                            </div>
                            <div className="p-2 rounded-lg bg-secondary-500/20">
                              <Calendar className="h-5 w-5 text-secondary-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg p-4 border border-dark/5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium text-dark">Matching IA</div>
                        <div className="text-xs text-primary-500 flex items-center">
                          +35% <ArrowRight className="ml-1 h-3 w-3" />
                        </div>
                      </div>
                      
                      <div className="h-16 flex items-end space-x-2">
                        {[55, 60, 70, 65, 80, 75, 85, 90, 85, 95, 92].map((height, i) => (
                          <div 
                            key={i} 
                            className="flex-1 bg-gradient-to-t from-primary-500/50 to-secondary-500/50 rounded-t-sm"
                            style={{ height: `${height}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-dark">Derniers candidats matchés</div>
                      
                      <div className="space-y-2">
                        {[
                          { title: 'Développeur Full-Stack', client: 'Score de matching : 95%', status: 'confirmed' },
                          { title: 'Data Scientist', client: 'Score de matching : 87%', status: 'pending' },
                        ].map((mission, i) => (
                          <div key={i} className="flex items-center justify-between bg-light rounded-lg p-3 border border-dark/5">
                            <div className="flex items-center space-x-3">
                              <div className="p-1.5 rounded-lg bg-secondary-500/20">
                                <Brain className="h-4 w-4 text-secondary-500" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-dark">{mission.title}</div>
                                <div className="text-xs text-dark/60">{mission.client}</div>
                              </div>
                            </div>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              mission.status === 'confirmed' 
                                ? 'bg-emerald-500/20 text-emerald-600' 
                                : 'bg-amber-500/20 text-amber-600'
                            }`}>
                              {mission.status === 'confirmed' ? 'Contacté' : 'À contacter'}
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

      {/* Problem Section */}
      <section className="py-16 px-8 md:px-12 bg-light text-dark">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block rounded-full bg-primary-500/10 px-4 py-1.5 mb-2">
            <p className="text-sm font-medium text-primary-500">Problème identifié</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark">
            Un modèle de recrutement obsolète
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mt-4 mb-6 rounded-full"></div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-dark/10 p-6 rounded-xl border border-dark/10">
              <div className="text-4xl font-bold text-primary-500 mb-4">70%</div>
              <p className="text-dark/80">des recrutements passent encore par des intermédiaires (cabinets, plateformes, chasseurs), à des coûts très élevés.</p>
            </div>
            
            <div className="bg-dark/10 p-6 rounded-xl border border-dark/10">
              <div className="flex justify-center mb-4">
                <Clock className="h-10 w-10 text-primary-500" />
              </div>
              <p className="text-dark/80">Les RH perdent du temps sur la recherche, le tri de CV, la prise de contact et la gestion de l'agenda.</p>
            </div>
            
            <div className="bg-dark/10 p-6 rounded-xl border border-dark/10">
              <div className="flex justify-center mb-4">
                <Briefcase className="h-10 w-10 text-primary-500" />
              </div>
              <p className="text-dark/80">Les outils actuels sont fragmentés, souvent non connectés, et lents à opérer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-8 md:px-12 relative bg-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block rounded-full bg-secondary-500/10 px-4 py-1.5 mb-2">
              <p className="text-sm font-medium text-secondary-500">Notre solution</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-4">
              L'IA qui restructure votre chaîne de recrutement
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mt-4 mb-6 rounded-full"></div>
            <p className="text-dark/70">
              OYA centralise tout comme un CRM mais agit comme un moteur intelligent centralisé, capable de transformer vos processus de recrutement.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Recherche automatique de profils",
                description: "Identifiez les candidats idéaux sur toutes les plateformes et LinkedIn automatiquement, selon vos critères précis.",
                color: "from-primary-500 to-primary-600",
                glow: "from-primary-600/10 via-primary-600/5 to-transparent"
              },
              {
                icon: BarChart3,
                title: "Scoring intelligent",
                description: "Évaluez et estimez en temps réel la valeur salariale des candidats avec notre algorithme d'IA avancé.",
                color: "from-secondary-500 to-secondary-600",
                glow: "from-secondary-600/10 via-secondary-600/5 to-transparent"
              },
              {
                icon: Users,
                title: "Centralisation des profils",
                description: "Gérez tous vos candidats dans une interface intuitive avec filtres, notes et matching intelligent.",
                color: "from-primary-500 to-secondary-500",
                glow: "from-primary-600/10 via-secondary-600/5 to-transparent"
              },
              {
                icon: Bot,
                title: "Gestion automatisée des contacts",
                description: "Organisez prises de contact, entretiens, relances et convocations sans effort grâce à notre IA.",
                color: "from-secondary-500 to-secondary-600",
                glow: "from-secondary-600/10 via-secondary-600/5 to-transparent"
              },
              {
                icon: Calendar,
                title: "Mise à jour intelligente des agendas",
                description: "Synchronisez automatiquement les calendriers de tous vos recruteurs et candidats sans conflits.",
                color: "from-primary-500 to-primary-600",
                glow: "from-primary-600/10 via-primary-600/5 to-transparent"
              },
              {
                icon: FileText,
                title: "Préparation des contrats",
                description: "Simplifiez la génération, le suivi et le renouvellement des contrats selon vos directives RH.",
                color: "from-secondary-500 to-primary-500",
                glow: "from-secondary-600/10 via-primary-600/5 to-transparent"
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] border-l-2 group bg-white"
                style={{
                  boxShadow: '0 4px 25px rgba(0, 0, 0, 0.06), inset 0 0 0 1px rgba(255, 255, 255, 0.8)',
                  borderLeftColor: 'rgba(0, 0, 0, 0.05)'
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
                  
                  <h3 className="text-xl font-semibold text-dark mb-3">{feature.title}</h3>
                  <p className="text-dark/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why OYA Section */}
      <section id="why-oya" className="py-24 px-8 md:px-12 relative bg-dark text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-secondary-600/5"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
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
                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                    alt="Équipe OYA" 
                    className="w-full h-full object-cover rounded-3xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              {[
                {
                  title: "Réduction drastique des coûts",
                  description: "Éliminez jusqu'à 70% de vos dépenses liées aux cabinets et autres intermédiaires de recrutement."
                },
                {
                  title: "Accélération du processus",
                  description: "Diminuez de 62% le temps consacré au sourcing, tri et présélection des candidats grâce à notre IA."
                },
                {
                  title: "Plateforme tout-en-un",
                  description: "Centralisez l'ensemble de votre chaîne de recrutement dans une unique solution puissante et intuitive."
                },
                {
                  title: "Intelligence stratégique",
                  description: "Bénéficiez d'insights précieux sur le marché du travail et optimisez votre stratégie de recrutement."
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
                    <p className="mt-2 text-white/70">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-8 md:px-12 relative bg-light">
        <div className="absolute -top-40 left-20 w-72 h-72 bg-primary-600/10 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-40 right-20 w-72 h-72 bg-secondary-600/10 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-4">
              Ce que nos clients disent
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mt-4 mb-6 rounded-full"></div>
            <p className="text-dark/70">
              Découvrez comment OYA a transformé les processus de recrutement de nos clients à travers la France.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sophie Martin",
                role: "Directrice RH, Groupe Tech",
                quote: "OYA a révolutionné notre façon de recruter. Nous avons réduit nos coûts d'acquisition de 65% tout en accélérant considérablement nos délais de recrutement.",
                rating: 5
              },
              {
                name: "Thomas Durand",
                role: "VP People, Scale-up SaaS",
                quote: "L'IA d'OYA nous a permis d'identifier des candidats parfaitement adaptés à notre culture d'entreprise. Le matching est d'une précision impressionnante.",
                rating: 5
              },
              {
                name: "Léa Dubois",
                role: "Talent Acquisition Manager",
                quote: "Fini les outils fragmentés et les process manuels. OYA centralise tout notre recrutement et nous permet d'être bien plus efficaces au quotidien.",
                rating: 4
              }
            ].map((testimonial, i) => (
              <div 
                key={i} 
                className="relative overflow-hidden rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] group bg-white"
                style={{
                  boxShadow: '0 4px 25px rgba(0, 0, 0, 0.06), inset 0 0 0 1px rgba(255, 255, 255, 0.8)',
                }}
              >
                <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-full -translate-x-1/3 -translate-y-1/3 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative p-6 md:p-8">
                  <div className="flex mb-6">
                    {Array(5).fill(0).map((_, j) => (
                      <Star 
                        key={j} 
                        className={`h-5 w-5 ${j < testimonial.rating ? 'text-primary-500' : 'text-dark/20'}`}
                        fill={j < testimonial.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  
                  <blockquote className="text-dark/80 mb-6">"{testimonial.quote}"</blockquote>
                  
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center text-dark font-bold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-dark">{testimonial.name}</div>
                      <div className="text-sm text-dark/60">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 md:px-12 relative bg-dark text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-secondary-600/5"></div>
        
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Prêt à <span className="text-primary-500">simplifier</span>, <span className="text-secondary-500">accélérer</span> et <span className="text-primary-500">transformer</span> vos recrutements ?
            </h2>
            <p className="text-white/70 max-w-3xl mx-auto">
              Rejoignez les entreprises qui ont déjà adopté OYA et révolutionnez votre stratégie d'acquisition de talents.
            </p>
          </div>
          
          <div className="relative p-8 md:p-10 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-secondary-600/20 blur-3xl opacity-30"></div>
            <div className="absolute inset-0 backdrop-blur-sm bg-dark/60 border border-white/10 rounded-3xl"></div>
            
            <div className="relative flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-between">
              <div className="space-y-4 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white">Démarrez votre transformation</h3>
                <p className="text-white/70">Essai gratuit de 14 jours avec toutes les fonctionnalités. Aucune carte bancaire requise.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/signup" 
                  className="relative group overflow-hidden rounded-full px-8 py-3.5 bg-primary-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  Essayer gratuitement
                </Link>
                
                <a 
                  href="#" 
                  className="rounded-full px-8 py-3.5 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/10 text-center"
                >
                  Demander une démo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 md:px-12 border-t border-dark/10 bg-light">
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
                <div className="flex flex-col">
                  <h1 className="text-2xl font-heading font-bold text-dark">
                    oya
                </h1>
                  <span className="text-xs tracking-[1.48px] text-dark">intelligence</span>
                </div>
              </div>
              <p className="text-dark/70 mb-6">
                La plateforme IA qui transforme le recrutement en entreprise.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'linkedin', 'facebook', 'instagram'].map((social) => (
                  <a 
                    key={social} 
                    href="#" 
                    className="h-10 w-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 hover:bg-primary-500/20 transition-colors duration-300"
                  >
                    <span className="sr-only">{social}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-dark mb-4">Produit</h3>
              <ul className="space-y-3">
                {['Fonctionnalités', 'Tarifs', 'Témoignages', 'FAQ'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-dark/70 hover:text-primary-500 transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-dark mb-4">Entreprise</h3>
              <ul className="space-y-3">
                {['À propos', 'Blog', 'Carrières', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-dark/70 hover:text-primary-500 transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-dark mb-4">Légal</h3>
              <ul className="space-y-3">
                {['Confidentialité', 'Conditions', 'Cookies', 'Mentions légales'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-dark/70 hover:text-primary-500 transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-dark/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-dark/70 text-sm">
              © 2024 OYA. Tous droits réservés.
            </p>
            <div className="mt-4 md:mt-0">
              <select className="bg-white border border-dark/10 rounded-md px-3 py-2 text-dark/70 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
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