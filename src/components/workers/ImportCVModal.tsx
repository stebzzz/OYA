import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Loader2, 
  Check, 
  FileText, 
  Save, 
  AlertCircle,
  FileUp
} from 'lucide-react';
import { createWorker, uploadCV, Worker } from '../../services/workersService';
import { analyzeCVWithAI, CVAnalysisResponse } from '../../services/aiService';

interface ImportCVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkerAdded: (workerId: string) => void;
}

export const ImportCVModal: React.FC<ImportCVModalProps> = ({ 
  isOpen, 
  onClose, 
  onWorkerAdded 
}) => {
  // États pour le CV
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysisResponse | null>(null);
  
  // États pour le formulaire auto-rempli
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>([]);
  const [education, setEducation] = useState<string[]>([]);
  const [summary, setSummary] = useState('');
  
  // États pour la gestion des erreurs et du chargement
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'review' | 'success'>('upload');
  
  // Référence au champ de fichier
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
        setIsUploading(true);
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            // Lancer automatiquement l'analyse
            analyzeCV(file);
          }
        }, 100);
      } else {
        setError('Format de fichier non supporté. Veuillez utiliser PDF ou DOCX.');
        setCvFile(null);
      }
    }
  };
  
  // Fonction pour analyser le CV avec l'IA
  const analyzeCV = async (file: File) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      
      // Normalement, nous lirions le contenu du fichier et l'enverrions à l'API
      // Ici, nous utilisons un service simulé
      const fullName = file.name.replace(/\.(pdf|docx|doc)$/i, '').replace(/[_-]/g, ' ');
      const nameParts = fullName.split(' ');
      const assumedFirstName = nameParts[0] || '';
      const assumedLastName = nameParts.slice(1).join(' ') || '';
      
      // Simuler une attente
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysis = await analyzeCVWithAI({
        workerName: fullName,
        // Dans une implémentation réelle, nous extrairions le contenu du fichier
      });
      
      setCvAnalysis(analysis);
      
      // Auto-remplir les champs du formulaire
      setFirstName(assumedFirstName);
      setLastName(assumedLastName);
      // Générer un email fictif basé sur le nom
      setEmail(`${assumedFirstName.toLowerCase()}.${assumedLastName.toLowerCase().replace(/\s+/g, '')}@exemple.com`);
      // Générer un numéro de téléphone fictif
      setPhone(`0${Math.floor(Math.random() * 9) + 1}${Array(8).fill(0).map(() => Math.floor(Math.random() * 10)).join('')}`);
      
      setSkills(analysis.extractedSkills);
      setExperience(analysis.experience);
      setEducation(analysis.education);
      setSummary(analysis.summary);
      
      // Passer à l'étape de vérification
      setCurrentStep('review');
      
    } catch (err) {
      setError('Erreur lors de l\'analyse du CV. Veuillez réessayer.');
      console.error('Erreur d\'analyse du CV:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Fonction pour créer l'intérimaire
  const createWorkerFromCV = async () => {
    if (!cvFile || !cvAnalysis) {
      setError('Informations insuffisantes. Veuillez réanalyser le CV.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Créer l'intérimaire avec les données extraites
      const workerData: Omit<Worker, 'id' | 'createdAt' | 'updatedAt'> = {
        firstName,
        lastName,
        email,
        phone,
        skills,
        availability: 'Disponible',
        status: 'active',
        avatar: null,
        address: '',
        cvAnalysis: {
          extractedSkills: skills,
          experience,
          education,
          summary,
          recommendedJobs: cvAnalysis.recommendedJobs
        }
      };
      
      // Créer l'intérimaire dans la base de données
      const workerId = await createWorker(workerData);
      
      // Télécharger le CV
      await uploadCV(workerId, cvFile);
      
      setSuccessMessage('Intérimaire ajouté avec succès !');
      setCurrentStep('success');
      onWorkerAdded(workerId);
      
    } catch (err) {
      setError('Erreur lors de la création de l\'intérimaire');
      console.error('Erreur de création:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Réinitialiser le formulaire
  const resetForm = () => {
    setCvFile(null);
    setCvAnalysis(null);
    setUploadProgress(0);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setSkills([]);
    setExperience([]);
    setEducation([]);
    setSummary('');
    setError(null);
    setSuccessMessage(null);
    setCurrentStep('upload');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 w-full max-w-3xl rounded-xl shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
        {/* En-tête */}
        <div className="border-b border-gray-700 p-5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Importer un intérimaire depuis un CV</h2>
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
          
          {/* Étape de téléchargement */}
          {currentStep === 'upload' && (
            <div className="space-y-6 py-4">
              <div className="text-center text-gray-300">
                <p className="mb-6">Téléchargez un CV pour créer automatiquement un profil d'intérimaire.</p>
                <p className="text-sm text-gray-400 mb-8">Notre système analysera le document et extraira les informations pertinentes.</p>
                
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-10 bg-gray-700/30 hover:bg-gray-700/50 transition-colors cursor-pointer"
                     onClick={() => fileInputRef.current?.click()}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  {isUploading ? (
                    <div className="space-y-3">
                      <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary-500" />
                      <p>Téléchargement en cours... {uploadProgress}%</p>
                      <div className="w-full bg-gray-600 rounded-full h-2.5">
                        <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    </div>
                  ) : isAnalyzing ? (
                    <div className="space-y-3">
                      <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary-500" />
                      <p>Analyse du CV en cours...</p>
                    </div>
                  ) : cvFile ? (
                    <div className="space-y-3">
                      <FileText className="h-12 w-12 mx-auto text-gray-300" />
                      <p>{cvFile.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <FileUp className="h-12 w-12 mx-auto text-gray-300" />
                      <p>Cliquez pour sélectionner un fichier</p>
                      <p className="text-xs text-gray-400">PDF ou DOCX uniquement</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Étape de vérification */}
          {currentStep === 'review' && cvAnalysis && (
            <div className="space-y-6">
              <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-primary-400 mb-2">CV analysé avec succès !</h3>
                <p className="text-gray-300">Vérifiez et ajustez les informations avant de créer le profil.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Compétences extraites
                </label>
                <div className="flex flex-wrap gap-2 bg-gray-700 border border-gray-600 rounded-lg p-3">
                  {skills.map((skill, index) => (
                    <span key={index} className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm flex items-center">
                      {skill}
                      <button
                        onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                        className="ml-2 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {skills.length === 0 && (
                    <span className="text-gray-400 text-sm">
                      Aucune compétence détectée.
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Expérience professionnelle
                  </label>
                  <ul className="bg-gray-700 border border-gray-600 rounded-lg p-3 space-y-2">
                    {experience.map((exp, index) => (
                      <li key={index} className="text-gray-300 flex justify-between items-center">
                        <span>{exp}</span>
                        <button
                          onClick={() => setExperience(experience.filter((_, i) => i !== index))}
                          className="text-gray-400 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                    {experience.length === 0 && (
                      <span className="text-gray-400 text-sm">
                        Aucune expérience détectée.
                      </span>
                    )}
                  </ul>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Formation
                  </label>
                  <ul className="bg-gray-700 border border-gray-600 rounded-lg p-3 space-y-2">
                    {education.map((edu, index) => (
                      <li key={index} className="text-gray-300 flex justify-between items-center">
                        <span>{edu}</span>
                        <button
                          onClick={() => setEducation(education.filter((_, i) => i !== index))}
                          className="text-gray-400 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                    {education.length === 0 && (
                      <span className="text-gray-400 text-sm">
                        Aucune formation détectée.
                      </span>
                    )}
                  </ul>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Résumé
                  </label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500 h-24"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Emplois recommandés
                  </label>
                  <div className="bg-gray-700 border border-gray-600 rounded-lg p-3">
                    <div className="flex flex-wrap gap-2">
                      {cvAnalysis.recommendedJobs.map((job, index) => (
                        <span key={index} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                          {job}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Étape de succès */}
          {currentStep === 'success' && (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/20 rounded-full mb-6">
                <Check className="h-10 w-10 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Intérimaire ajouté avec succès !</h3>
              <p className="text-gray-400 mb-8">
                Le profil a été créé et le CV a été associé au compte.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
        
        {/* Pied de page avec boutons d'action */}
        {currentStep !== 'success' && (
          <div className="border-t border-gray-700 p-5 flex justify-between">
            {currentStep === 'upload' ? (
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Annuler
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep('upload')}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Retour
              </button>
            )}
            
            {currentStep === 'review' && (
              <button
                onClick={createWorkerFromCV}
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Création en cours...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Créer l'intérimaire</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 