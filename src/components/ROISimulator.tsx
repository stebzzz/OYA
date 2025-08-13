import React, { useState, useEffect, useRef } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';

const ROISimulator: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [recruitersCount, setRecruitersCount] = useState(3);
  const [placementsPerMonth, setPlacementsPerMonth] = useState(10);
  const [averageFee, setAverageFee] = useState(15000);
  const [animatedValues, setAnimatedValues] = useState({
    timeSaved: 0,
    additionalPlacements: 0,
    additionalRevenue: 0,
    roiPercentage: 0
  });
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

  // Calculate ROI based on inputs
  useEffect(() => {
    const timeSavedPerRecruiter = 15; // 15h per week saved
    const totalTimeSaved = recruitersCount * timeSavedPerRecruiter;
    
    // Assuming 30% more placements with time saved
    const additionalPlacements = Math.round(placementsPerMonth * 0.3);
    const additionalRevenue = additionalPlacements * averageFee;
    
    // OYA cost estimation (simplified)
    const oyaCost = recruitersCount * 500; // 500€ per recruiter per month
    const roiPercentage = Math.round(((additionalRevenue - oyaCost) / oyaCost) * 100);

    // Animate values
    const animateValue = (start: number, end: number, setter: (value: number) => void) => {
      const duration = 1000;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.round(start + (end - start) * progress);
        setter(current);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    };

    if (isVisible) {
      setTimeout(() => {
        animateValue(0, totalTimeSaved, (value) => 
          setAnimatedValues(prev => ({ ...prev, timeSaved: value }))
        );
        animateValue(0, additionalPlacements, (value) => 
          setAnimatedValues(prev => ({ ...prev, additionalPlacements: value }))
        );
        animateValue(0, additionalRevenue, (value) => 
          setAnimatedValues(prev => ({ ...prev, additionalRevenue: value }))
        );
        animateValue(0, roiPercentage, (value) => 
          setAnimatedValues(prev => ({ ...prev, roiPercentage: value }))
        );
      }, 500);
    }
  }, [recruitersCount, placementsPerMonth, averageFee, isVisible]);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-[#f4f0ec] to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-bold text-[#223049] mb-6 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Estimez votre ROI en 15sec
          </h2>
          <p className={`text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Un outil simple pour comprendre l'impact concret d'OYA Intelligence™️ sur vos performances.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Input Section */}
          <div className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center mb-6">
              <Calculator className="text-[#ff6a3d] mr-3" size={32} />
              <h3 className="text-2xl font-bold text-[#223049]">Vos paramètres</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de recruteurs
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={recruitersCount}
                  onChange={(e) => setRecruitersCount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1</span>
                  <span className="font-bold text-[#ff6a3d]">{recruitersCount}</span>
                  <span>20+</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Placements par mois
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={placementsPerMonth}
                  onChange={(e) => setPlacementsPerMonth(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1</span>
                  <span className="font-bold text-[#ff6a3d]">{placementsPerMonth}</span>
                  <span>50+</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Honoraires moyens (€)
                </label>
                <input
                  type="range"
                  min="5000"
                  max="50000"
                  step="1000"
                  value={averageFee}
                  onChange={(e) => setAverageFee(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>5k€</span>
                  <span className="font-bold text-[#ff6a3d]">{averageFee.toLocaleString()}€</span>
                  <span>50k€+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center mb-6">
              <TrendingUp className="text-[#9b6bff] mr-3" size={32} />
              <h3 className="text-2xl font-bold text-[#223049]">Votre ROI avec OYA</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-[#ff6a3d]/10 to-[#ff6a3d]/5 p-6 rounded-xl border border-[#ff6a3d]/20">
                <div className="text-3xl font-bold text-[#ff6a3d] mb-2">
                  {animatedValues.timeSaved}h
                </div>
                <p className="text-sm text-gray-700 font-medium">Temps économisé par semaine</p>
              </div>

              <div className="bg-gradient-to-br from-[#9b6bff]/10 to-[#9b6bff]/5 p-6 rounded-xl border border-[#9b6bff]/20">
                <div className="text-3xl font-bold text-[#9b6bff] mb-2">
                  +{animatedValues.additionalPlacements}
                </div>
                <p className="text-sm text-gray-700 font-medium">Placements supplémentaires/mois</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 p-6 rounded-xl border border-green-500/20">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {animatedValues.additionalRevenue.toLocaleString()}€
                </div>
                <p className="text-sm text-gray-700 font-medium">Revenus supplémentaires/mois</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-6 rounded-xl border border-blue-500/20">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {animatedValues.roiPercentage}%
                </div>
                <p className="text-sm text-gray-700 font-medium">ROI mensuel</p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-[#223049]/5 to-[#9b6bff]/5 rounded-xl">
              <p className="text-lg text-gray-700 font-medium text-center">
                💡 <strong>Avec OYA Intelligence™️, vous pourriez générer {animatedValues.additionalRevenue.toLocaleString()}€ de revenus supplémentaires par mois</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ff6a3d;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(255, 106, 61, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ff6a3d;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(255, 106, 61, 0.3);
        }
      `}</style>
    </section>
  );
};

export default ROISimulator;