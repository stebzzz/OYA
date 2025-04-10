import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Appliquer le mode sombre par défaut
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="grid grid-cols-[auto_1fr] h-screen bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-800 overflow-hidden">
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
      />
      <main className="overflow-y-auto">
        <div className="max-w-7xl w-full mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};