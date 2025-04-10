import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import seedDashboardData from '../../seed/seedDashboard.ts';
import { Loader2, CheckCircle, Database, AlertTriangle } from 'lucide-react';

export const SeedData = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateData = async () => {
    if (!user) {
      setError('Vous devez être connecté pour générer des données');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      await seedDashboardData(user.uid);
      
      setSuccess(true);
    } catch (err) {
      console.error('Erreur lors de la génération des données:', err);
      setError('Une erreur est survenue lors de la génération des données');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-white">
      <div className="relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-600/20 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary-600/20 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-transparent bg-gradient-to-r from-primary-400 via-blue-400 to-secondary-400 bg-clip-text">
              Générateur de données
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-secondary-500 mt-2 rounded-full"></div>
            <p className="mt-3 text-gray-400 max-w-2xl">
              Cet outil vous permet de générer des données de test pour le tableau de bord. Utilisez-le uniquement en environnement de développement.
            </p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl backdrop-blur-md group transition-all duration-300">
        {/* Background and effects */}
        <div className="absolute inset-0 bg-gray-950/40"></div>
        <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-gradient-radial from-violet-600/30 via-indigo-600/20 to-transparent opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl"></div>
        
        {/* Glass border effect */}
        <div className="absolute inset-0 rounded-xl border border-white/10"></div>
        
        <div className="relative p-8">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg mr-4">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Générer des données de test</h2>
              <p className="text-sm text-gray-400 mt-1">
                Cette opération créera des intérimaires, missions, documents et activités fictifs liés à votre compte.
              </p>
            </div>
          </div>
          
          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
              <p className="text-emerald-300">
                Les données de test ont été générées avec succès ! Vous pouvez maintenant retourner au tableau de bord.
              </p>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
              <p className="text-red-300">{error}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                <strong className="text-white">Utilisateur actuel :</strong>{' '}
                {user ? user.email : 'Non connecté'}
              </p>
            </div>
            
            <button
              onClick={handleGenerateData}
              disabled={loading || !user}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-medium flex items-center space-x-2 hover:from-primary-600 hover:to-secondary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Génération en cours...</span>
                </>
              ) : (
                <>
                  <Database className="h-5 w-5" />
                  <span>Générer les données</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg mt-6">
        <h3 className="text-red-300 font-semibold mb-2 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Attention
        </h3>
        <p className="text-gray-300 text-sm">
          Cette fonctionnalité est destinée uniquement à des fins de développement et de test.
          Ne générez pas de données fictives dans un environnement de production.
        </p>
      </div>
      
      <div className="p-6 bg-gray-800/30 rounded-lg border border-white/5">
        <h3 className="text-lg font-medium text-white mb-4">Instructions</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>Cliquez sur le bouton "Générer les données" pour créer un ensemble de données de test.</li>
          <li>Retournez au tableau de bord pour voir les données générées.</li>
          <li>Les données incluent des intérimaires, missions, documents et activités.</li>
          <li>Toutes les données sont liées à votre compte utilisateur.</li>
        </ol>
      </div>
    </div>
  );
}; 