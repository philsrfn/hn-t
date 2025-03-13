// src/components/NewsGrid.js
import React from 'react';
import NewsCard from './NewsCard';
import '../styles/NewsGrid.css';

const NewsGrid = ({ stories }) => {
  return (
    <div className="news-grid">
      {stories.map((story) => (
        <NewsCard key={story.id} story={story} />
      ))}
    </div>
  );
};

export default NewsGrid;
