import React, { useState, useEffect } from 'react';
import { X, Save, Star, Zap, Brain, TrendingUp } from 'lucide-react';
import { useCandidates, Candidate } from '../../hooks/useCandidates';
import { perplexityService } from '../../services/perplexityService';

interface CandidateFormProps {
  candidate: Candidate | null;
  onClose: () => void;
  onSave: () => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ candidate, onClose, onSave }) => {
  const { addCandidate, updateCandidate } = useCandidates();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    location: '',
    salary: '',
    score: 75,
    status: 'To Contact' as Candidate['status'],
    skills: [] as string[],
    notes: '',
    source: 'Manuel',
    avatar: ''
  });

  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        position: candidate.position || '',
        experience: candidate.experience || '',
        location: candidate.location || '',
        salary: candidate.salary || '',
        score: candidate.score || 75,
        status: candidate.status || 'To Contact',
        skills: candidate.skills || [],
        notes: candidate.notes || '',
        source: candidate.source || 'Manuel',
        avatar: candidate.avatar || ''
      });
    }
  }, [candidate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const candidateToSave = { ...formData };
      
      if (candidate) {
        await updateCandidate(candidate.id, candidateToSave);
      } else {
        await addCandidate(candidateToSave);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillsChange = (value: string) => {
    const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData({ ...formData, skills });
  };

  const handleAIScoring = async () => {
    if (!formData.name || !formData.position) {
      alert('Veuillez remplir au moins le nom et le poste pour utiliser le scoring IA');
      return;
    }

    setAiLoading(true);
    try {
      const analysis = await perplexityService.scoreCandidateProfile({
        name: formData.name,
        position: formData.position,
        experience: formData.experience,
        skills: formData.skills,
        location: formData.location,
        salary: formData.salary
      });

      setAiAnalysis(analysis);
      setFormData({ ...formData, score: analysis.score });
    } catch (error) {
      console.error('Erreur scoring IA:', error);
      alert('Erreur lors du scoring IA. Veuillez réessayer.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#223049]">
              {candidate ? 'Modifier le candidat' : 'Nouveau candidat'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 p-6">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations personnelles */}
              <div className="space-y-4">
                <h3 className="font-medium text-[#223049] flex items-center">
                  <span className="w-2 h-2 bg-[#ff6a3d] rounded-full mr-2"></span>
                  Informations personnelles
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Localisation
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Informations professionnelles */}
              <div className="space-y-4">
                <h3 className="font-medium text-[#223049] flex items-center">
                  <span className="w-2 h-2 bg-[#9b6bff] rounded-full mr-2"></span>
                  Informations professionnelles
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poste recherché *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expérience
                    </label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="ex: 5 ans"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salaire souhaité
                    </label>
                    <input
                      type="text"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      placeholder="ex: 55k€"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Candidate['status'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                    >
                      <option value="To Contact">À contacter</option>
                      <option value="Contacted">Contacté</option>
                      <option value="Interview">Entretien</option>
                      <option value="Qualified">Qualifié</option>
                      <option value="Rejected">Rejeté</option>
                      <option value="Hired">Embauché</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compétences (séparées par des virgules)
                  </label>
                  <input
                    type="text"
                    value={formData.skills.join(', ')}
                    onChange={(e) => handleSkillsChange(e.target.value)}
                    placeholder="React, TypeScript, Node.js"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                  placeholder="Notes sur le candidat..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#ff6a3d] text-white rounded-lg hover:bg-[#ff6a3d]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>{loading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Panel IA */}
          <div className="space-y-6">
            {/* Scoring IA */}
            <div className="bg-gradient-to-br from-[#f4f0ec] to-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-medium text-[#223049] mb-4 flex items-center">
                <Brain className="text-[#9b6bff] mr-2" size={20} />
                Analyse IA OYA
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Score IA:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-[#ff6a3d]">{formData.score}%</span>
                    <Star size={16} className={formData.score >= 90 ? 'text-green-500' : formData.score >= 80 ? 'text-[#ff6a3d]' : 'text-gray-400'} />
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 bg-gradient-to-r from-[#ff6a3d] to-[#9b6bff] rounded-full transition-all duration-500"
                    style={{ width: `${formData.score}%` }}
                  ></div>
                </div>

                <button
                  type="button"
                  onClick={handleAIScoring}
                  disabled={aiLoading}
                  className="w-full bg-[#9b6bff] text-white py-3 px-4 rounded-lg hover:bg-[#9b6bff]/90 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {aiLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Analyse en cours...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      <span>Scorer avec l'IA</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Résultats de l'analyse IA */}
            {aiAnalysis && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-medium text-[#223049] mb-4 flex items-center">
                  <TrendingUp className="text-[#ff6a3d] mr-2" size={16} />
                  Analyse détaillée
                </h4>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Analyse:</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {aiAnalysis.analysis}
                    </p>
                  </div>

                  {aiAnalysis.strengths.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-green-700 mb-2">Points forts:</h5>
                      <ul className="space-y-1">
                        {aiAnalysis.strengths.map((strength: string, index: number) => (
                          <li key={index} className="text-sm text-green-600 flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiAnalysis.recommendations.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-[#ff6a3d] mb-2">Recommandations:</h5>
                      <ul className="space-y-1">
                        {aiAnalysis.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <span className="w-1.5 h-1.5 bg-[#ff6a3d] rounded-full mr-2"></span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Source */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h4 className="font-medium text-[#223049] mb-4">Source du candidat</h4>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
              >
                <option value="Manuel">Ajout manuel</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Indeed">Indeed</option>
                <option value="Welcome to the Jungle">Welcome to the Jungle</option>
                <option value="Apec">Apec</option>
                <option value="Monster">Monster</option>
                <option value="Sourcing IA">Sourcing IA OYA</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateForm;