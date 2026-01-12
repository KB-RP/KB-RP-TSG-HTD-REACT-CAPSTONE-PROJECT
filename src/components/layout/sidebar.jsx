import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiBookOpen,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiMenu
} from 'react-icons/fi';
import { useAuth } from '../../contexts';
import { Popconfirm } from 'antd';

const Sidebar = ({ isOpen, onClose, isMobile, collapsed, onToggleCollapse }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { icon: <FiHome />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FiBookOpen />, label: 'My Courses', path: '/dashboard/my-course' },
    ...(user?.role === 'admin'
      ? [{ icon: <FiSettings />, label: 'Settings', path: '/dashboard/admin-settings' }]
      : []
    ),
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
                  className={`nav-menu__link ${location.pathname === item.path ? 'nav-menu__link--active' : ''
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
          <Popconfirm
            title="Are you sure you want to logout?"
            okText="Yes"
            cancelText="No"
            placement="right"
            onConfirm={logout}
          >
            <button
              className="logout-button"
              title={collapsed ? 'Logout' : ''}
            >
              <FiLogOut className="logout-button__icon" />
              {!collapsed && <span>Logout</span>}
            </button>
          </Popconfirm>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;