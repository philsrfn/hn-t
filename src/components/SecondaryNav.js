import React from 'react';
import '../styles/SecondaryNav.css';

const SecondaryNav = ({ activeCategory, onCategoryChange }) => {
  const categories = [
    { id: 'top', label: 'Top' },
    { id: 'new', label: 'New' },
    { id: 'best', label: 'Best' },
    { id: 'ask', label: 'Ask HN' },
    { id: 'show', label: 'Show HN' },
    { id: 'job', label: 'Jobs' }
  ];

  return (
    <nav className="secondary-nav">
      <div className="container">
        <ul className="category-list">
          {categories.map((category) => (
            <li key={category.id} className="category-item">
              <button 
                className={`category-link ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => onCategoryChange(category.id)}
              >
                {category.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default SecondaryNav;