import React, { useState } from 'react';
import { FiMenu, FiSearch, FiBell, FiUser } from 'react-icons/fi';

const Navbar = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Mock suggestions - in a real app, this would come from an API
  const suggestions = [
    'JavaScript Fundamentals',
    'React Advanced Patterns',
    'Node.js for Beginners',
    'CSS Grid and Flexbox',
    'TypeScript Masterclass'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
  };

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
      
      <div className="navbar__search">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-form__container">
            <FiSearch className="search-form__icon" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="search-form__input"
            />
            {showSuggestions && searchQuery && (
              <div className="search-suggestions">
                {suggestions
                  .filter(suggestion =>
                    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((suggestion, index) => (
                    <div 
                      key={index} 
                      className="search-suggestions__item"
                      onMouseDown={() => {
                        setSearchQuery(suggestion);
                        setShowSuggestions(false);
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </form>
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
