import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  MoreVertical, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  Clock
} from 'lucide-react';
import { Document } from '../../types';

export const DocumentsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Données fictives pour les documents
  const documents: Document[] = [
    {
      id: '1',
      workerId: 'w1',
      type: 'contract',
      title: 'Contrat de mission - Soudeur',
      url: '/documents/contract-1.pdf',
      expiryDate: new Date('2024-06-15'),
      status: 'valid',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
    },
    {
      id: '2',
      workerId: 'w1',
      type: 'certification',
      title: 'Certification soudure TIG',
      url: '/documents/cert-1.pdf',
      expiryDate: new Date('2024-12-31'),
      status: 'valid',
      createdAt: new Date('2023-12-05'),
      updatedAt: new Date('2023-12-05'),
    },
    {
      id: '3',
      workerId: 'w2',
      type: 'id',
      title: "Pièce d'identité - Martin Dubois",
      url: '/documents/id-2.pdf',
      status: 'valid',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
    },
    {
      id: '4',
      workerId: 'w3',
      type: 'contract',
      title: 'Contrat de mission - Électricien',
      url: '/documents/contract-3.pdf',
      expiryDate: new Date('2024-02-28'),
      status: 'expired',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '5',
      workerId: 'w4',
      type: 'other',
      title: 'Attestation de formation sécurité',
      url: '/documents/training-4.pdf',
      status: 'pending',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01'),
    },
    {
      id: '6',
      workerId: 'w2',
      type: 'certification',
      title: 'Habilitation électrique',
      url: '/documents/electrical-cert.pdf',
      expiryDate: new Date('2025-01-10'),
      status: 'valid',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
    },
  ];

  // Filtrer les documents en fonction des critères de recherche et des filtres
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Formatage de la date au format français
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Valide
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Expiré
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </span>
        );
      default:
        return null;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'id':
        return "Pièce d'identité";
      case 'contract':
        return "Contrat";
      case 'certification':
        return "Certification";
      case 'other':
        return "Autre";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Documents</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau document
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-700 bg-gray-800/50 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-200 placeholder-gray-400"
            placeholder="Rechercher un document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <select
              className="block w-full pl-3 pr-10 py-2 border border-gray-700 bg-gray-800/50 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-200"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="valid">Valide</option>
              <option value="expired">Expiré</option>
              <option value="pending">En attente</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="relative">
            <select
              className="block w-full pl-3 pr-10 py-2 border border-gray-700 bg-gray-800/50 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-200"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Tous les types</option>
              <option value="id">Pièce d'identité</option>
              <option value="contract">Contrat</option>
              <option value="certification">Certification</option>
              <option value="other">Autre</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des documents */}
      <div className="overflow-hidden rounded-lg shadow">
        <div className="relative overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-200">
            <thead className="bg-gray-700/50 text-xs uppercase text-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">Titre</th>
                <th scope="col" className="px-6 py-3">Type</th>
                <th scope="col" className="px-6 py-3">Date de création</th>
                <th scope="col" className="px-6 py-3">Date d'expiration</th>
                <th scope="col" className="px-6 py-3">Statut</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="border-b border-gray-700 bg-gray-800/30 hover:bg-gray-700/30">
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 mr-3 text-indigo-400" />
                        {doc.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getDocumentTypeLabel(doc.type)}</td>
                    <td className="px-6 py-4">{formatDate(doc.createdAt)}</td>
                    <td className="px-6 py-4">
                      {doc.expiryDate ? formatDate(doc.expiryDate) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(doc.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-gray-700 bg-gray-800/30">
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    Aucun document trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 