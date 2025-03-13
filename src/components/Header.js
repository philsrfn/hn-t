// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faBell, faQuestionCircle, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.css';

const Header = ({ activeCategory, onCategoryChange }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Check for saved theme preference or use system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.setAttribute('data-theme', 'light');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Use system preference if no saved preference
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Update the data-theme attribute on the document
    document.documentElement.setAttribute('data-theme', newDarkMode ? 'dark' : 'light');
    
    // Save preference to localStorage
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

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
          <button 
            className="dark-mode-toggle" 
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
          <FontAwesomeIcon icon={faUser} className="user-icon" />
          <FontAwesomeIcon icon={faBell} className="notifications-icon" />
          <FontAwesomeIcon icon={faQuestionCircle} className="help-icon" />
        </div>
      </div>
    </header>
  );
};

export default Header;