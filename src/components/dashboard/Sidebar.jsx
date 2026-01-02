import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiBookOpen, 
  FiAward, 
  FiSettings, 
  FiHelpCircle, 
  FiLogOut 
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const navItems = [
    { icon: <FiHome />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FiBookOpen />, label: 'My Courses', path: '/dashboard/courses' },
    { icon: <FiAward />, label: 'Achievements', path: '/dashboard/achievements' },
    { icon: <FiSettings />, label: 'Settings', path: '/dashboard/settings' },
    { icon: <FiHelpCircle />, label: 'Help', path: '/help' },
  ];

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'sidebar-overlay--active' : ''}`} 
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <h2>Menu</h2>
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
                  onClick={onClose}
                >
                  <span className="nav-menu__icon">{item.icon}</span>
                  <span className="nav-menu__label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="sidebar__footer">
          <button className="logout-button">
            <FiLogOut className="logout-button__icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
