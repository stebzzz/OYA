import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Loader2, 
  Check, 
  FileText, 
  Save, 
  AlertCircle 
} from 'lucide-react';
import { createWorker, uploadCV, Worker } from '../../services/workersService';
import { analyzeCVWithAI } from '../../services/aiService';

interface AddWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkerAdded: (workerId: string) => void;
}

export const AddWorkerModal: React.FC<AddWorkerModalProps> = ({ 
  isOpen, 
  onClose, 
  onWorkerAdded 
}) => {
  // États pour le formulaire
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [status, setStatus] = useState<Worker['status']>('active');
  const [address, setAddress] = useState('');
  
  // États pour la gestion du CV
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cvAnalysis, setCvAnalysis] = useState<Worker['cvAnalysis'] | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // États pour la gestion des erreurs et du chargement
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Référence au champ de fichier
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Fonction pour ajouter une compétence
  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };
  
  // Fonction pour supprimer une compétence
  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };
  
  // Fonction pour sélectionner un fichier CV
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Vérifier le type de fichier (PDF, DOCX, etc.)
      if (file.type === 'application/pdf' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.type === 'application/msword') {
        setCvFile(file);
        setError(null);
        // Simuler un progrès d'upload
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 100);
      } else {
        setError('Format de fichier non supporté. Veuillez utiliser PDF ou DOCX.');
        setCvFile(null);
      }
    }
  };
  
  // Fonction pour analyser le CV avec l'IA
  const handleAnalyzeCV = async () => {
    if (!cvFile) {
      setError('Veuillez d\'abord télécharger un CV');
      return;
    }
    
    try {
      setIsAnalyzing(true);
      setError(null);
      
      // Simulation de l'analyse (dans un cas réel, nous enverrions le fichier à une API)
      const analysis = await analyzeCVWithAI({
        workerName: `${firstName} ${lastName}`,
        // Nous n'avons pas encore d'URL puisque le fichier n'est pas encore téléchargé
      });
      
      setCvAnalysis(analysis);
      
      // Ajouter automatiquement les compétences extraites
      if (analysis.extractedSkills) {
        const newSkills = [...skills];
        for (const skill of analysis.extractedSkills) {
          if (!newSkills.includes(skill)) {
            newSkills.push(skill);
          }
        }
        setSkills(newSkills);
      }
      
      setSuccessMessage('Analyse du CV réussie !');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Erreur lors de l\'analyse du CV. Veuillez réessayer.');
      console.error('Erreur d\'analyse du CV:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Fonction pour enregistrer l'intérimaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !phone) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Créer l'intérimaire
      const workerData: Omit<Worker, 'id' | 'createdAt' | 'updatedAt'> = {
        firstName,
        lastName,
        email,
        phone,
        skills,
        availability: status === 'active' ? 'Disponible' : status === 'busy' ? 'En mission' : 'Indisponible',
        status,
        avatar: null,
        address,
        cvAnalysis
      };
      
      const workerId = await createWorker(workerData);
      
      // Si un CV a été téléchargé, l'envoyer à Firebase Storage
      if (cvFile) {
        await uploadCV(workerId, cvFile);
      }
      
      setSuccessMessage('Intérimaire ajouté avec succès !');
      onWorkerAdded(workerId);
      
      // Réinitialiser le formulaire après un court délai
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1500);
    } catch (err) {
      setError('Erreur lors de l\'ajout de l\'intérimaire');
      console.error('Erreur de soumission:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Réinitialiser le formulaire
  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setSkills([]);
    setNewSkill('');
    setStatus('active');
    setCvFile(null);
    setCvAnalysis(null);
    setUploadProgress(0);
    setError(null);
    setSuccessMessage(null);
    setAddress('');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 w-full max-w-3xl rounded-xl shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
        {/* En-tête */}
        <div className="border-b border-gray-700 p-5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Ajouter un intérimaire</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Contenu avec défilement */}
        <div className="overflow-y-auto p-5 flex-grow">
          {/* Messages de succès ou d'erreur */}
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg flex items-center">
              <Check className="h-5 w-5 mr-2" />
              {successMessage}
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Informations personnelles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Informations personnelles
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+33 6 12 34 56 78"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Adresse
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Statut
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Worker['status'])}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="active">Disponible</option>
                    <option value="busy">En mission</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
              </div>
              
              {/* Compétences et CV */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Compétences et CV
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Compétences
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ajouter une compétence"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                    >
                      Ajouter
                    </button>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="px-3 py-1.5 bg-primary-500/20 text-primary-300 rounded-full flex items-center space-x-1"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-white"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    CV
                  </label>
                  
                  <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-400 transition-colors"
                       onClick={() => fileInputRef.current?.click()}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                    />
                    
                    {cvFile ? (
                      <div className="space-y-2">
                        <div className="flex justify-center">
                          <FileText className="h-12 w-12 text-primary-400" />
                        </div>
                        <p className="text-white font-medium">{cvFile.name}</p>
                        <p className="text-gray-400 text-sm">{(cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        
                        {uploadProgress < 100 ? (
                          <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                            <div 
                              className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        ) : (
                          <div className="flex justify-center text-emerald-400">
                            <Check className="h-5 w-5 mr-1" /> Fichier prêt
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-center">
                          <Upload className="h-12 w-12 text-gray-400" />
                        </div>
                        <p className="text-white font-medium">Cliquez pour ajouter un CV</p>
                        <p className="text-gray-400 text-sm">PDF, DOC ou DOCX (max. 5MB)</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={handleAnalyzeCV}
                      disabled={!cvFile || isAnalyzing || uploadProgress < 100}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                        !cvFile || isAnalyzing || uploadProgress < 100 
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                          : 'bg-violet-600 hover:bg-violet-700 text-white'
                      }`}
                    >
                      {isAnalyzing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                      <span>Analyser avec l'IA</span>
                    </button>
                  </div>
                </div>
                
                {cvAnalysis && (
                  <div className="mt-4 bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <h4 className="text-md font-semibold text-white border-b border-gray-600 pb-2 mb-3">
                      Analyse du CV
                    </h4>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-300 font-medium">Compétences détectées:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {cvAnalysis.extractedSkills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-gray-300 font-medium">Expérience:</p>
                        <ul className="list-disc pl-5 text-gray-400 mt-1">
                          {cvAnalysis.experience.map((exp, idx) => (
                            <li key={idx}>{exp}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <p className="text-gray-300 font-medium">Formation:</p>
                        <ul className="list-disc pl-5 text-gray-400 mt-1">
                          {cvAnalysis.education.map((edu, idx) => (
                            <li key={idx}>{edu}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <p className="text-gray-300 font-medium">Résumé:</p>
                        <p className="text-gray-400 mt-1">{cvAnalysis.summary}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-300 font-medium">Postes recommandés:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {cvAnalysis.recommendedJobs.map((job, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs">
                              {job}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
        
        {/* Actions */}
        <div className="border-t border-gray-700 p-5 flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                <span>Enregistrer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}; 