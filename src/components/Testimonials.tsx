import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Directeur réseau RH",
      position: "Directeur réseau RH",
      company: "Groupe recrutement (confidentiel)",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop&crop=face",
      quote: "En moins d'une semaine, Oya avait remplacé notre process complet, augmenté notre productivité et amélioré la qualité de nos recrutements. On ne reviendra jamais en arrière.",
      rating: 5,
      results: "🧪 Testé. Approuvé. En production",
      badge: "Avis vérifié"
    },
    {
      name: "Marie Dubois",
      position: "DRH",
      company: "TechCorp (250 salariés)",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100&h=100&fit=crop&crop=face",
      quote: "OYA a révolutionné notre processus de recrutement. Nous avons économisé 180k€ la première année en supprimant les cabinets.",
      rating: 5,
      results: "180k€ économisés, -60% temps RH"
    },
    {
      name: "Sophie Laurent",
      position: "Responsable Talent Acquisition",
      company: "FinanceGroup (500 salariés)",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face",
      quote: "Interface intuitive, ROI immédiat. Nos équipes RH se concentrent enfin sur l'humain plutôt que sur la recherche.",
      rating: 5,
      results: "ROI +847%, -50% temps sourcing"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-[#9b6bff]/10 rounded-full text-[#9b6bff] font-medium text-sm mb-6">
            🧪 Testé. Approuvé. En production
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-[#223049] mb-6">
            Pourquoi les directions choisissent OYA
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Parce qu'elles veulent reprendre le contrôle de leur chaîne de recrutement, 
            éliminer les coûts cachés, et automatiser intelligemment sans sacrifier la qualité humaine.
          </p>
        </div>
        
        {/* Professional Standards Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 rounded-full text-blue-600 font-medium text-sm mb-6">
            💼 Oya, le standard pro des grands comptes
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
              <div className="text-2xl mb-3">🎓</div>
              <h4 className="font-semibold text-[#223049] mb-2">Formation rapide</h4>
              <p className="text-gray-600 text-sm">prise en main en moins de 2h</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
              <div className="text-2xl mb-3">📞</div>
              <h4 className="font-semibold text-[#223049] mb-2">Support client réactif</h4>
              <p className="text-gray-600 text-sm">basé à Toulouse</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
              <div className="text-2xl mb-3">🔌</div>
              <h4 className="font-semibold text-[#223049] mb-2">Intégration possible</h4>
              <p className="text-gray-600 text-sm">à vos outils si besoin (SIRH, CRM, ERP)</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
              <div className="text-2xl mb-3">🧩</div>
              <h4 className="font-semibold text-[#223049] mb-2">Roadmap IA continue</h4>
              <p className="text-gray-600 text-sm">nouvelles features mensuelles</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
              <div className="text-2xl mb-3">🔐</div>
              <h4 className="font-semibold text-[#223049] mb-2">Sécurité, conformité</h4>
              <p className="text-gray-600 text-sm">performance</p>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative">
              {/* Badge for first testimonial */}
              {testimonial.badge && (
                <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {testimonial.badge}
                </div>
              )}
              
              {/* Quote Icon */}
              <Quote className="text-[#ff6a3d] mb-4" size={32} />
              
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>
              
              {/* Quote */}
              <blockquote className="text-gray-700 mb-6 italic">
                "{testimonial.quote}"
              </blockquote>
              
              {/* Results */}
              <div className="bg-gradient-to-r from-[#ff6a3d]/10 to-[#9b6bff]/10 p-4 rounded-lg mb-6">
                <div className="text-sm font-semibold text-[#223049] mb-1">Résultats:</div>
                <div className="text-sm text-gray-700">{testimonial.results}</div>
              </div>
              
              {/* Author */}
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-[#223049]">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.position}</div>
                  <div className="text-sm text-[#ff6a3d] font-medium">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-[#223049] to-[#223049]/90 rounded-2xl p-8 lg:p-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">+1133%</div>
              <div className="text-gray-300">ROI moyen</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">-50%</div>
              <div className="text-gray-300">Temps RH économisé</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">94%</div>
              <div className="text-gray-300">Taux de matching</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">15k€</div>
              <div className="text-gray-300">Économie/recrutement</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;