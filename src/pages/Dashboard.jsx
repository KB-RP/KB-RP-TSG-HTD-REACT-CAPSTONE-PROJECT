import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/dashboard/Navbar';
import Sidebar from '../components/dashboard/Sidebar';
import '../styles/dashboard/main.scss';
import DashboardHome from './dashboard/Home';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [collapsed, setCollapsed] = useState(false);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-close sidebar when resizing to mobile
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCollapse = () => {
    if (!isMobile) {
      setCollapsed(!collapsed);
    }
  };

  useEffect(() => {
  if (collapsed) {
    document.body.classList.add('collapsed-sidebar');
  } else {
    document.body.classList.remove('collapsed-sidebar');
  }
  
  return () => {
    document.body.classList.remove('collapsed-sidebar');
  };
}, [collapsed]);

  return (
    <div className="dashboard">
      <Navbar onMenuClick={toggleSidebar} />
      <div className="dashboard__container">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={toggleSidebar} 
          isMobile={isMobile}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
        />
        <main className={`dashboard__main ${collapsed ? 'collapsed' : ''}`}>
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;