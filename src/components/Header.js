// src/components/Header.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faBell, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.css';

const Header = ({ activeCategory, onCategoryChange }) => {
  const categories = [
    { id: 'top', label: 'Top' },
    { id: 'new', label: 'New' },
    { id: 'best', label: 'Best' },
    { id: 'ask', label: 'Ask HN' },
    { id: 'show', label: 'Show HN' },
    { id: 'job', label: 'Jobs' }
  ];

  return (
    <header className="header">
      <div className="header-main">
        <div className="logo">
          <span className="logo-icon">T</span>
          TeleHacker News
        </div>
        
        <nav className="nav-links">
          {categories.map((category) => (
            <button 
              key={category.id}
              className={`nav-link ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.label}
            </button>
          ))}
        </nav>
        
        <div className="header-right">
          <div className="search-box">
            <input type="text" className="search-input" placeholder="Search" />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </div>
          <FontAwesomeIcon icon={faUser} className="user-icon" />
          <FontAwesomeIcon icon={faBell} className="notifications-icon" />
          <FontAwesomeIcon icon={faQuestionCircle} className="help-icon" />
        </div>
      </div>
    </header>
  );
};

export default Header;