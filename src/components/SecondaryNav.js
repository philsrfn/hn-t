import React from 'react';
import '../styles/SecondaryNav.css';

const SecondaryNav = () => {
  const categories = [
    'Technology', 
    'Business', 
    'Science', 
    'Politics', 
    'Health', 
    'Entertainment', 
    'Sports'
  ];

  return (
    <nav className="secondary-nav">
      <div className="container">
        <ul className="category-list">
          {categories.map((category, index) => (
            <li key={index} className="category-item">
              <a href={`#${category.toLowerCase()}`} className="category-link">
                {category}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default SecondaryNav;