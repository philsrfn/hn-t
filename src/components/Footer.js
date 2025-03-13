// src/components/Footer.js
import React, { forwardRef } from 'react';
import './Footer.css';

const Footer = forwardRef((props, ref) => {
  return (
    <footer className="footer" ref={ref}>
      <div className="footer-content">
        <p className="footer-description">
          A modern Hacker News client built with React. Stay updated with the latest tech news and discussions.
        </p>
        <div className="footer-links">
          <a
            href="https://github.com/phneutral26"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub
          </a>
          <a
            href="https://news.ycombinator.com/user?id=phneutral26"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Hacker News
          </a>
        </div>
      </div>
    </footer>
  );
});

export default Footer;