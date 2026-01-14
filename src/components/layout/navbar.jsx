import React, { useState } from 'react';
import { FiMenu, FiSearch, FiBell, FiUser } from 'react-icons/fi';

const Navbar = ({ onMenuClick }) => {
  
  return (
    <header className="navbar">
      <div className="navbar__left">
        <button 
          className="navbar__menu-button" 
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <FiMenu size={24} />
        </button>
        <h1 className="navbar__logo">LMS</h1>
      </div>
      
      <div className="navbar__right">
        <button className="navbar__notification" aria-label="Notifications">
          <FiBell size={20} />
          <span className="navbar__notification-badge">3</span>
        </button>
        <div className="navbar__user">
          <div className="user-avatar">
            <FiUser size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
