import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Ne pas appliquer le mode sombre par défaut
  useEffect(() => {
    // Assurer que le mode clair est appliqué
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <div className="grid grid-cols-[auto_1fr] h-screen bg-white overflow-hidden">
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
      />
      <main className="overflow-y-auto w-full">
        <div className="w-full p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};