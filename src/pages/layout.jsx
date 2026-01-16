import { useState, useEffect } from 'react';
import {Outlet } from 'react-router-dom';
import Navbar from '../components/layout/navbar';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../contexts';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();


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
      <Navbar onMenuClick={toggleSidebar} userName={user?.firstName}/>
      <div className="dashboard__container">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={toggleSidebar}
          isMobile={isMobile}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
        />
        <main className={`dashboard__main ${collapsed ? 'collapsed' : ''}`}>
          <Outlet />  {/* This is where the nested routes will render */}
        </main>
      </div>
    </div>
  );
};

export default Layout;