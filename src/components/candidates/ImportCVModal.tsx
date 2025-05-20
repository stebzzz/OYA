import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Loader2 } from 'lucide-react';
import { createCandidate, analyzeCV, uploadCV } from '../../services/candidatesService';

interface ImportCVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCandidateAdded: (candidateId: string) => void;
}

export const ImportCVModal: React.FC<ImportCVModalProps> = ({ isOpen, onClose, onCandidateAdded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'processing'>('upload');
  const [candidateInfo, setCandidateInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    skills: [] as string[],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gérer les événements de glisser-déposer
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Gérer le dépôt de fichier
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Gérer le changement de fichier via l'input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Traiter le fichier sélectionné
  const handleFile = (selectedFile: File) => {
    const isValidType = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(selectedFile.type);
    
    if (!isValidType) {
      alert('Veuillez importer un fichier PDF ou Word (.doc/.docx)');
      return;
    }
    
    setFile(selectedFile);
    
    // Simuler l'extraction d'informations
    setLoading(true);
    setTimeout(() => {
      const nameParts = selectedFile.name.split('.')[0].split('_');
      
      setCandidateInfo({
        firstName: nameParts[0] || '',
        lastName: nameParts[1] || '',
        email: `${nameParts[0].toLowerCase()}@example.com`,
        phone: '0102030405',
        skills: ['JavaScript', 'React', 'Node.js'],
      });
      
      setLoading(false);
      setStep('preview');
    }, 1500);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async () => {
    if (!file) return;
    
    setLoading(true);
    setStep('processing');
    
    try {
      // 1. Créer le candidat
      const candidateId = await createCandidate({
        firstName: candidateInfo.firstName,
        lastName: candidateInfo.lastName,
        email: candidateInfo.email,
        phone: candidateInfo.phone,
        skills: candidateInfo.skills,
        availability: 'À déterminer',
        status: 'available',
        avatar: null
      });
      
      // 2. Uploader le CV
      await uploadCV(candidateId, file);
      
      // 3. Analyser le CV
      await analyzeCV(URL.createObjectURL(file), `${candidateInfo.firstName} ${candidateInfo.lastName}`);
      
      // 4. Callback et reset
      onCandidateAdded(candidateId);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Erreur lors du traitement du CV:', error);
      alert('Une erreur est survenue lors du traitement du CV.');
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFile(null);
    setStep('upload');
    setCandidateInfo({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      skills: [],
    });
  };

  // Ne rien rendre si le modal n'est pas ouvert
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {step === 'upload' && 'Importer un CV'}
            {step === 'preview' && 'Vérifier les informations'}
            {step === 'processing' && 'Traitement du CV'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {step === 'upload' && (
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center ${dragActive ? 'border-primary-500 bg-primary-500/10' : 'border-gray-600 bg-gray-700/30'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-white mb-2">
              Glissez-déposez votre CV ici
            </h3>
            <p className="text-gray-400 mb-6">
              ou cliquez pour sélectionner un fichier (PDF, DOC, DOCX)
            </p>
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center mx-auto"
            >
              <Upload className="h-5 w-5 mr-2" />
              <span>Sélectionner un fichier</span>
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
            />
          </div>
        )}
        
        {step === 'preview' && (
          <div className="space-y-6">
            <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-600 flex items-center">
              <FileText className="h-10 w-10 text-primary-400 mr-4" />
              <div>
                <p className="text-white font-medium">{file?.name}</p>
                <p className="text-gray-400 text-sm">
                  {(file?.size && (file.size / 1024 / 1024).toFixed(2)) || '0'} MB
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  value={candidateInfo.firstName}
                  onChange={(e) => setCandidateInfo(prev => ({ ...prev, firstName: e.target.value }))}
                  className="block w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={candidateInfo.lastName}
                  onChange={(e) => setCandidateInfo(prev => ({ ...prev, lastName: e.target.value }))}
                  className="block w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={candidateInfo.email}
                  onChange={(e) => setCandidateInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="block w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={candidateInfo.phone}
                  onChange={(e) => setCandidateInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="block w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Compétences détectées
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-900 border border-gray-700 rounded-lg">
                  {candidateInfo.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-2.5 py-1 bg-primary-500/10 text-primary-400 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {step === 'processing' && (
          <div className="text-center py-10">
            <Loader2 className="h-16 w-16 text-primary-500 animate-spin mx-auto mb-6" />
            <h3 className="text-lg font-medium text-white mb-2">
              Traitement du CV en cours...
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Nous analysons votre document pour extraire toutes les informations pertinentes. Veuillez patienter...
            </p>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-700">
          {step === 'upload' && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
            >
              Annuler
            </button>
          )}
          
          {step === 'preview' && (
            <>
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
              >
                Retour
              </button>
              
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center"
              >
                <FileText className="h-5 w-5 mr-2" />
                <span>Traiter le CV</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 