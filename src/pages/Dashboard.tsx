import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Sidebar from '../components/Dashboard/Sidebar';
import DashboardOverview from '../components/Dashboard/DashboardOverview';
import CandidatesList from '../components/Dashboard/CandidatesList';
import CandidateForm from '../components/Dashboard/CandidateForm';
import SourcingAI from '../components/Dashboard/SourcingAI';
import Pipeline from '../components/Dashboard/Pipeline';
import Analytics from '../components/Dashboard/Analytics';
import Calendar from '../components/Dashboard/Calendar';
import { Candidate } from '../hooks/useCandidates';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showCandidateForm, setShowCandidateForm] = useState(false);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleSelectCandidate = (candidate: Candidate | null) => {
    setSelectedCandidate(candidate);
    setShowCandidateForm(true);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowCandidateForm(true);
  };

  const handleCloseCandidateForm = () => {
    setShowCandidateForm(false);
    setSelectedCandidate(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'candidates':
        return (
          <CandidatesList
            onSelectCandidate={handleSelectCandidate}
            onEditCandidate={handleEditCandidate}
          />
        );
      case 'sourcing':
        return <SourcingAI />;
      case 'pipeline':
        return <Pipeline />;
      case 'analytics':
        return <Analytics />;
      case 'calendar':
        return <Calendar />;
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-[#223049] mb-6">Paramètres</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-[#223049] mb-4">Profil utilisateur</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom d'affichage
                    </label>
                    <input
                      type="text"
                      value={currentUser.displayName || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a3d] focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={currentUser.email || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-[#223049] mb-4">Préférences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Notifications email</span>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Mode sombre</span>
                    <input type="checkbox" className="toggle" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f0ec]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="ml-64 p-8">
        {renderContent()}
      </div>

      {/* Candidate Form Modal */}
      {showCandidateForm && (
        <CandidateForm
          candidate={selectedCandidate}
          onClose={handleCloseCandidateForm}
          onSave={() => {
            // Refresh will be handled by the real-time listener
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;