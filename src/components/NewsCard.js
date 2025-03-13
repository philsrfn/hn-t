import React from 'react';
import '../styles/NewsCard.css';

const NewsCard = ({ story }) => {
  // Get a random category for each story (for visualization purposes)
  const getRandomCategory = () => {
    const categories = ['Tech', 'AI', 'Programming', 'Startup', 'Data', 'Open Source', 'Web Dev'];
    return categories[Math.floor(Math.random() * categories.length)];
  };
  
  // Handle click to open the article in a new tab
  const handleCardClick = () => {
    // If the story has a URL, open that URL, otherwise open the Hacker News discussion
    const url = story.url || `https://news.ycombinator.com/item?id=${story.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div className="news-card" onClick={handleCardClick}>
      <div className="card-image"></div>
      <div className="card-content">
        <span className="card-category">{getRandomCategory()}</span>
        <h3 className="card-title">{story.title}</h3>
        <div className="card-metadata">
          <span>By {story.by}</span>
          <span>{story.score} points</span>
        </div>
        {story.url && (
          <div className="card-source">
            {new URL(story.url).hostname.replace('www.', '')}
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

export default NewsCard;
