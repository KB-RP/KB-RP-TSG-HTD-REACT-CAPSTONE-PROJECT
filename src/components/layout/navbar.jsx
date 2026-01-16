import React, { memo } from 'react';
import { FiMenu } from 'react-icons/fi';

const palette = ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

function getColorFromString(name) {
  if (!name) return palette[Math.floor(Math.random() * palette.length)];
  const code = name.charCodeAt(0) || 0;
  return palette[code % palette.length];
}

const Navbar = ({ onMenuClick, userName }) => {
  const initial = userName && userName.length ? userName.trim()[0].toUpperCase() : 'U';
  const bg = getColorFromString(userName);

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
        <div className="navbar__user">
          <div
            className="user-avatar"
            aria-label="user-avatar"
            style={{
              backgroundColor: bg,
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Navbar);
