import React, { memo, useMemo } from 'react';
import '../styles/NewsCard.css';

const NewsCard = ({ story }) => {
  // Get a random but consistent category for each story based on story ID
  const category = useMemo(() => {
    const categories = ['Tech', 'AI', 'Programming', 'Startup', 'Data', 'Open Source', 'Web Dev'];
    // Use the story ID to get a consistent category for the same story
    const index = story.id % categories.length;
    return categories[index];
  }, [story.id]);
  
  // Format the hostname from URL
  const hostname = useMemo(() => {
    if (!story.url) return null;
    try {
      return new URL(story.url).hostname.replace('www.', '');
    } catch (e) {
      return null;
    }
  }, [story.url]);
  
  // Handle click to open the article in a new tab
  const handleCardClick = () => {
    // If the story has a URL, open that URL, otherwise open the Hacker News discussion
    const url = story.url || `https://news.ycombinator.com/item?id=${story.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div className="news-card" onClick={handleCardClick}>
      <div className="card-content">
        <span className="card-category">{category}</span>
        <h3 className="card-title">{story.title}</h3>
        <div className="card-metadata">
          <span>By {story.by}</span>
          <span>{story.score} points</span>
        </div>
        {hostname && (
          <div className="card-source">
            {hostname}
          </div>
        )}
        <div className="card-comments">
          <a 
            href={`https://news.ycombinator.com/item?id=${story.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {story.descendants || 0} comments
          </a>
        </div>
      </div>
    </div>
  );
};

// Use memo to prevent unnecessary re-renders when props haven't changed
export default memo(NewsCard);
