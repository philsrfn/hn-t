// src/components/NewsGrid.js
import React, { memo } from 'react';
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

// Use memo to prevent unnecessary re-renders when props haven't changed
export default memo(NewsGrid);
