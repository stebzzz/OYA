import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { analyzeMissionFile, createMission, CreateMissionData } from '../../services/missionsService';
import { Upload, X, FileText, AlertCircle, Check } from 'lucide-react';

interface ImportMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMissionAdded: () => void;
  isNew?: boolean;
}

export const ImportMissionModal: React.FC<ImportMissionModalProps> = ({
  isOpen,
  onClose,
  onMissionAdded,
  isNew = false,
}) => {
  const { user } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedData, setExtractedData] = useState<Partial<CreateMissionData> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CreateMissionData>>({
    title: '',
    company: '',
    location: '',
    description: '',
    skills: [],
    dailyRate: 0,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours par défaut
    contactPerson: '',
    contactEmail: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (isNew) {
        setFormData({
          title: '',
          company: '',
          location: '',
          description: '',
          skills: [],
          dailyRate: 0,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          contactPerson: '',
          contactEmail: '',
        });
        setExtractedData({});
        setFile(null);
      } else {
        setFile(null);
        setExtractedData(null);
        setError(null);
        setFormData({
          title: '',
          company: '',
          location: '',
          description: '',
          skills: [],
          dailyRate: 0,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          contactPerson: '',
          contactEmail: '',
        });
      }
    }
  }, [isOpen, isNew]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsAnalyzing(true);
    setError(null);

    try {
      const extracted = await analyzeMissionFile(selectedFile);
      setExtractedData(extracted);
      setFormData({ ...formData, ...extracted });
    } catch (err) {
      setError("Erreur lors de l'analyse du fichier. Veuillez réessayer.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;
    
    setFile(droppedFile);
    setIsAnalyzing(true);
    setError(null);

    try {
      const extracted = await analyzeMissionFile(droppedFile);
      setExtractedData(extracted);
      setFormData({ ...formData, ...extracted });
    } catch (err) {
      setError("Erreur lors de l'analyse du fichier. Veuillez réessayer.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: new Date(value) });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData({ ...formData, skills });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.uid) {
      setError("Utilisateur non authentifié");
      return;
    }

    // Validation basique
    if (!formData.title || !formData.company || !formData.startDate || !formData.endDate) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      await createMission(formData as CreateMissionData, user.uid);
      onMissionAdded();
      onClose();
    } catch (err) {
      setError("Erreur lors de la création de la mission");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-800 w-full max-w-3xl rounded-lg shadow-xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {isNew ? 'Nouvelle mission' : 'Importer une mission'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded flex items-center gap-2 text-red-300">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {!file && !isNew ? (
            <div 
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 mb-6 text-center cursor-pointer hover:bg-gray-700/20 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload size={40} className="mx-auto mb-2 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-300">Déposez votre fichier ici</h3>
              <p className="text-sm text-gray-400 mb-4">ou cliquez pour sélectionner un fichier</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
              <div className="text-xs text-gray-500">
                Formats supportés: PDF, DOC, DOCX, TXT
              </div>
            </div>
          ) : file && !isNew ? (
            <div className="mb-6 p-4 bg-gray-700/30 border border-gray-600 rounded flex items-center gap-3">
              <FileText size={24} className="text-blue-400" />
              <div className="flex-1">
                <p className="text-gray-200 font-medium">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => {
                  setFile(null);
                  setExtractedData(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              >
                <X size={18} />
              </button>
            </div>
          ) : null}

          {isAnalyzing ? (
            <div className="text-center py-6">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
              <p className="mt-2 text-gray-300">Analyse du document en cours...</p>
            </div>
          ) : (extractedData || isNew) && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Titre*
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Localisation
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                  ></textarea>
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
                  className={`px-4 py-2 ${isNew ? 'bg-primary-600 hover:bg-primary-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isUploading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                      <span>Création...</span>
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      <span>{isNew ? 'Créer la mission' : 'Importer la mission'}</span>
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