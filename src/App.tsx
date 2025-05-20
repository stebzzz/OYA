import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { Dashboard } from './pages/Dashboard';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { AIChat } from './components/ai/AIChat';
import { CandidatesList } from './components/candidates/CandidatesList';
import { Reports } from './pages/dashboard/Reports';
import { Settings } from './pages/dashboard/Settings';
import { Landing } from './pages/Landing';
import { Documents } from './pages/dashboard/Documents';
import { SeedData } from './pages/dashboard/SeedData';
import { CandidateDetail } from './pages/dashboard/CandidateDetail';
import Matching from './pages/dashboard/Matching';
import Missions from './pages/dashboard/Missions';
import { CandidateValue } from './pages/dashboard/CandidateValue';
import { CandidateInterview } from './pages/dashboard/CandidateInterview';
import { AICandidateSearch } from './components/ai/AICandidateSearch';

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/landing"} />} />
        <Route path="/landing" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginForm />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupForm />} />
        <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" /> : <ForgotPasswordForm />} />
        <Route 
          path="/dashboard" 
          element={!user ? <Navigate to="/login" /> : <DashboardLayout />}
        >
          <Route index element={<Dashboard />} />
          <Route path="candidates" element={<CandidatesList />} />
          <Route path="candidates/:id" element={<CandidateDetail />} />
          <Route path="candidates/:id/value" element={<CandidateValue />} />
          <Route path="candidates/:id/interview" element={<CandidateInterview />} />
          <Route path="search" element={<AICandidateSearch onCandidatesFound={() => {}} />} />
          <Route path="missions" element={<Missions />} />
          <Route path="documents" element={<Documents />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="ai-chat" element={<AIChat />} />
          <Route path="matching" element={<Matching />} />
          <Route path="seed-data" element={<SeedData />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;