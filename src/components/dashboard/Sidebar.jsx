import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiBookOpen, 
  FiAward, 
  FiSettings, 
  FiHelpCircle, 
  FiLogOut,
  FiChevronLeft,
  FiMenu
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose, isMobile, collapsed, onToggleCollapse }) => {
  const location = useLocation();
  
  const navItems = [
    { icon: <FiHome />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FiBookOpen />, label: 'My Courses', path: '/dashboard/courses' },
    { icon: <FiAward />, label: 'Achievements', path: '/dashboard/achievements' },
    { icon: <FiSettings />, label: 'Settings', path: '/dashboard/settings' },
    { icon: <FiHelpCircle />, label: 'Help', path: '/help' },
  ];

  const handleNavClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  return (
    <>
      {isMobile && (
        <div 
          className={`sidebar-overlay ${isOpen ? 'sidebar-overlay--active' : ''}`} 
          onClick={onClose}
        />
      )}
      
      <aside 
        className={`
          sidebar 
          ${isMobile ? (isOpen ? 'sidebar--open' : '') : ''} 
          ${collapsed ? 'sidebar--collapsed' : ''}
        `}
      >
        <div className="sidebar__header">
          {!collapsed && <h2>Menu</h2>}
          <button 
            className="sidebar__toggle" 
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <FiMenu /> : <FiChevronLeft />}
          </button>
        </div>
        
        <nav className="sidebar__nav">
          <ul className="nav-menu">
            {navItems.map((item, index) => (
              <li key={index} className="nav-menu__item">
                <Link
                  to={item.path}
                  className={`nav-menu__link ${
                    location.pathname === item.path ? 'nav-menu__link--active' : ''
                  }`}
                  onClick={handleNavClick}
                  title={collapsed ? item.label : ''}
                >
                  <span className="nav-menu__icon">{item.icon}</span>
                  <span className="nav-menu__label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar__footer">
          <button 
            className="logout-button" 
            onClick={handleNavClick}
            title={collapsed ? 'Logout' : ''}
          >
            <FiLogOut className="logout-button__icon" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;