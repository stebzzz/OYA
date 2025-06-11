import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Clock } from 'lucide-react';

const ROICalculator: React.FC = () => {
  const [recruitmentsPerYear, setRecruitmentsPerYear] = useState(25);
  const [cabinetPercentage, setCabinetPercentage] = useState(60);
  const [avgSalary, setAvgSalary] = useState(50000);
  
  const cabinetCostPerRecruit = avgSalary * 0.15; // 15% du salaire
  const hrTimePerRecruit = 8; // heures
  const hrCostPerHour = 50; // euros
  
  // Coûts actuels
  const cabinetRecruits = Math.round(recruitmentsPerYear * (cabinetPercentage / 100));
  const currentCabinetCosts = cabinetRecruits * cabinetCostPerRecruit;
  const currentHrCosts = recruitmentsPerYear * hrTimePerRecruit * hrCostPerHour;
  const totalCurrentCosts = currentCabinetCosts + currentHrCosts;
  
  // Coûts avec OYA
  const oyaCosts = recruitmentsPerYear <= 25 ? 34880 : 
                  recruitmentsPerYear <= 100 ? 62800 : 570000;
  const newHrCosts = recruitmentsPerYear * 3 * hrCostPerHour; // 3h au lieu de 8h
  const totalWithOya = oyaCosts + newHrCosts;
  
  const savings = totalCurrentCosts - totalWithOya;
  const roi = ((savings - oyaCosts) / oyaCosts) * 100;

  const getCompanyType = () => {
    if (recruitmentsPerYear <= 25) return 'PME';
    if (recruitmentsPerYear <= 100) return 'ETI';
    return 'Grand Groupe';
  };

  return (
    <section id="roi" className="py-20 bg-gradient-to-br from-[#f4f0ec] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-700 font-medium text-sm mb-6">
            💰 Calculez votre ROI
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-[#223049] mb-6">
            Découvrez vos économies avec OYA
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simulation claire du retour sur investissement pour votre entreprise.
            Résultats basés sur nos clients actuels.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Calculator */}
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="flex items-center space-x-3 mb-8">
              <Calculator className="text-[#ff6a3d]" size={32} />
              <h3 className="text-2xl font-bold text-[#223049]">Calculateur ROI</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de recrutements par an
                </label>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  value={recruitmentsPerYear}
                  onChange={(e) => setRecruitmentsPerYear(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>10</span>
                  <span className="font-semibold text-[#ff6a3d]">{recruitmentsPerYear}</span>
                  <span>1000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  % de recrutements via cabinets actuellement
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cabinetPercentage}
                  onChange={(e) => setCabinetPercentage(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0%</span>
                  <span className="font-semibold text-[#ff6a3d]">{cabinetPercentage}%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salaire moyen des postes recrutés
                </label>
                <input
                  type="range"
                  min="25000"
                  max="150000"
                  step="5000"
                  value={avgSalary}
                  onChange={(e) => setAvgSalary(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>25k€</span>
                  <span className="font-semibold text-[#ff6a3d]">{avgSalary.toLocaleString()}€</span>
                  <span>150k€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Company Type */}
            <div className="bg-gradient-to-r from-[#9b6bff] to-[#9b6bff]/80 p-6 rounded-xl text-white">
              <h4 className="text-lg font-semibold mb-2">Profil de votre entreprise</h4>
              <p className="text-2xl font-bold">{getCompanyType()}</p>
              <p className="opacity-90">{recruitmentsPerYear} recrutements/an</p>
            </div>

            {/* Current Costs */}
            <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                <DollarSign size={20} className="mr-2" />
                Coûts actuels
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-red-700">Cabinets ({cabinetRecruits} recrutements)</span>
                  <span className="font-semibold text-red-800">{currentCabinetCosts.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Temps RH interne</span>
                  <span className="font-semibold text-red-800">{currentHrCosts.toLocaleString()}€</span>
                </div>
                <div className="border-t border-red-200 pt-3 flex justify-between">
                  <span className="font-semibold text-red-800">Total annuel</span>
                  <span className="font-bold text-red-800 text-xl">{totalCurrentCosts.toLocaleString()}€</span>
                </div>
              </div>
            </div>

            {/* With OYA */}
            <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <TrendingUp size={20} className="mr-2" />
                Avec OYA
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-green-700">Licence OYA</span>
                  <span className="font-semibold text-green-800">{oyaCosts.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Temps RH optimisé</span>
                  <span className="font-semibold text-green-800">{newHrCosts.toLocaleString()}€</span>
                </div>
                <div className="border-t border-green-200 pt-3 flex justify-between">
                  <span className="font-semibold text-green-800">Total annuel</span>
                  <span className="font-bold text-green-800 text-xl">{totalWithOya.toLocaleString()}€</span>
                </div>
              </div>
            </div>

            {/* ROI */}
            <div className="bg-gradient-to-r from-[#ff6a3d] to-[#ff6a3d]/80 p-6 rounded-xl text-white">
              <h4 className="text-lg font-semibold mb-4">Résultats</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Économies annuelles</span>
                  <span className="font-bold text-2xl">{savings.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between">
                  <span>ROI</span>
                  <span className="font-bold text-2xl">+{Math.round(roi)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ROICalculator;