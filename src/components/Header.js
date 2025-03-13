// src/components/Header.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faBell, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-icon">T</span>
        TeleHacker News
      </div>
      <div className="nav-links">
        <a href="/" className="nav-link">Top</a>
        <a href="/" className="nav-link">New</a>
        <a href="/" className="nav-link">Ask</a>
        <a href="/" className="nav-link">Show</a>
        <a href="/" className="nav-link">Jobs</a>
      </div>
      <div className="header-right">
        <div className="search-box">
          <input type="text" className="search-input" placeholder="Search" />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
        <FontAwesomeIcon icon={faUser} className="user-icon" />
        <FontAwesomeIcon icon={faBell} className="notifications-icon" />
        <FontAwesomeIcon icon={faQuestionCircle} className="help-icon" />
      </div>
    </header>
  );
};

export default Header;