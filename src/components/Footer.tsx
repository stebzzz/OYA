import React from 'react';
import { Mail, Phone, MapPin, Linkedin as LinkedIn, Twitter } from 'lucide-react';
import logo from '../assets/LOGO.PNG?url';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-[#223049] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <img src={logo} alt="OYA Intelligence" className="h-24" />
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md">
              La plateforme stratégique de recrutement nouvelle génération, 100% autonome et boostée par l'IA.
            </p>
            
            <div className="text-sm text-gray-400">
              <p className="font-semibold text-[#ff6a3d] mb-2">
                🔐 Plateforme 100% conforme RGPD – Hébergement souverain
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-[#ff6a3d]" />
                <span className="text-gray-300">contact@oyaintelligence.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-[#ff6a3d]" />
                <span className="text-gray-300">📍 Toulouse, France</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div>
            <h4 className="text-lg font-semibold mb-6">📆 Demandez votre démonstration</h4>
            <div className="space-y-4">
              <a href="https://calendly.com/contact-oyaintelligence" target="_blank" rel="noopener noreferrer" className="block">
                <button className="w-full bg-[#ff6a3d] text-white px-6 py-3 rounded-lg hover:bg-[#ff6a3d]/90 transition-colors">
                  Réserver une démo
                </button>
              </a>
              <a href="https://calendly.com/contact-oyaintelligence" target="_blank" rel="noopener noreferrer" className="block">
                <button className="w-full border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#223049] transition-colors">
                  Voir le logiciel en action
                </button>
              </a>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <LinkedIn size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 OYA Intelligence
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Mentions légales</a>
            <span className="text-gray-400 text-sm">|</span>
            <a href="mailto:contact@oyaintelligence.com" className="text-gray-400 hover:text-white text-sm transition-colors">Contact : contact@oyaintelligence.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;