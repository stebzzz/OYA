import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Check, FileText, Percent } from 'lucide-react';
import { Mission, CreateMissionData, createMission } from '../../services/missionsService';
import { analyzeDocument, DocumentType, DocumentAnalysisResult } from '../../services/documentAnalysisService';
import { useAuthStore } from '../../store/authStore';

interface ApproveMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMissionApproved: (missionId?: string) => void;
}

export const ApproveMissionModal: React.FC<ApproveMissionModalProps> = ({
  isOpen,
  onClose,
  onMissionApproved
}) => {
  const { user } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<Partial<CreateMissionData> | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const [formData, setFormData] = useState<CreateMissionData>({
    title: '',
    company: '',
    location: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    skills: [],
    dailyRate: 0,
    contactPerson: '',
    contactEmail: ''
  });

  // Réinitialiser l'état lorsque le modal s'ouvre/se ferme
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setExtractedData(null);
      setError(null);
      setFormData({
        title: '',
        company: '',
        location: '',
        description: '',
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        skills: [],
        dailyRate: 0,
        contactPerson: '',
        contactEmail: ''
      });
    }
  }, [isOpen]);

  // Mettre à jour formData lorsque les données sont extraites
  useEffect(() => {
    if (analysisResult && analysisResult.documentType === DocumentType.MISSION) {
      setExtractedData(analysisResult.extractedData);
      setFormData(prevData => ({
        ...prevData,
        ...analysisResult.extractedData,
      }));
    }
  }, [analysisResult]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsUploading(true);
    setError(null);
    
    try {
      // Analyser le fichier avec notre service d'analyse de documents
      const result = await analyzeDocument(file);
      setAnalysisResult(result);
      
      // Vérifier si le document est du type attendu
      if (result.documentType !== DocumentType.MISSION) {
        setError(`Le document semble être un ${result.documentType} et non une mission. Veuillez vérifier.`);
      }
    } catch (err) {
      setError("Erreur lors de l'analyse du fichier. Veuillez réessayer.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const date = new Date(value);
    setFormData({ ...formData, [name]: date });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    setFormData({ ...formData, skills });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);
    
    try {
      if (!user?.uid) {
        throw new Error('Utilisateur non authentifié');
      }
      
      // Appeler le service pour créer la mission
      const missionId = await createMission(formData, user.uid);
      onMissionApproved(missionId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la création de la mission";
      setError(errorMessage);
      console.error(err);
      setIsUploading(false);
    }
  };

  // Si le modal n'est pas ouvert, ne rien afficher
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-800 rounded-xl overflow-hidden w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Approbation Rapide de Mission</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-5 flex-grow">
          {error && (
            <div className="mb-4 p-3 bg-red-950/30 border border-red-700 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          {!selectedFile ? (
            <div 
              className={`border-2 border-dashed ${isDragging ? 'border-primary-500' : 'border-gray-600'} rounded-lg p-10 text-center transition-colors`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="mb-6">
                <div className="h-16 w-16 mx-auto mb-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-200 mb-1">Glissez-déposez un document</h3>
                <p className="text-gray-400 mb-4">ou cliquez pour sélectionner</p>
                <p className="text-xs text-gray-500">
                  Formats supportés: PDF, DOCX, TXT
                </p>
              </div>
              
              <label className="cursor-pointer">
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.docx,.txt" 
                  onChange={handleFileChange}
                />
                <span className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-colors">
                  Choisir un fichier
                </span>
              </label>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <div className="flex-grow">
                  <p className="text-green-400 font-medium">Fichier analysé avec succès</p>
                  <p className="text-green-500/80 text-sm">{selectedFile.name}</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setSelectedFile(null)} 
                  className="text-gray-400 hover:text-white ml-3"
                >
                  <X size={18} />
                </button>
              </div>
              
              {analysisResult && (
                <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                    <h4 className="text-blue-400 font-medium">Résultat de l'analyse</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Type de document:</p>
                      <p className="text-white">{analysisResult.documentType}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Confiance:</p>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mr-2">
                          <div 
                            className={`h-2.5 rounded-full ${
                              analysisResult.confidence > 0.8 ? 'bg-green-500' : 
                              analysisResult.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${analysisResult.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-white whitespace-nowrap">
                          {Math.round(analysisResult.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4 bg-gray-800/70 border border-gray-700 rounded-lg p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Titre de la mission*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Entreprise*
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Localisation*
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description*
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded resize-none text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Date de début*
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
                      onChange={handleDateChange}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Date de fin*
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ''}
                      onChange={handleDateChange}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Compétences (séparées par des virgules)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills?.join(', ')}
                    onChange={handleSkillsChange}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Taux journalier (€)
                    </label>
                    <input
                      type="number"
                      name="dailyRate"
                      value={formData.dailyRate || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Nombre de travailleurs requis
                    </label>
                    <input
                      type="number"
                      name="requiredWorkers"
                      defaultValue={1}
                      min={1}
                      max={100}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Personne de contact
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email de contact
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                      <span>Approbation...</span>
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      <span>Approuver la mission</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}; 