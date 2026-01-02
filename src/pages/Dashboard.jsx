import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/dashboard/Navbar';
import Sidebar from '../components/dashboard/Sidebar';
import '../styles/dashboard/main.scss';
import DashboardHome from './dashboard/Home';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard">
      <Navbar onMenuClick={toggleSidebar} />
      <div className="dashboard__container">
        <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
        <main className="dashboard__main">
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
