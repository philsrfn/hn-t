import React from 'react';
import '../styles/FeaturedStory.css';

const FeaturedStory = ({ story }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };
  
  // Handle click to open the article in a new tab
  const handleStoryClick = () => {
    // If the story has a URL, open that URL, otherwise open the Hacker News discussion
    const url = story.url || `https://news.ycombinator.com/item?id=${story.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div className="featured-story" onClick={handleStoryClick}>
      <div className="featured-content">
        <h1 className="featured-title">{story.title}</h1>
        <p className="featured-description">
          {story.url ? 
            `From ${new URL(story.url).hostname.replace('www.', '')} • ${story.score} points • by ${story.by}` : 
            `${story.score} points • by ${story.by}`}
        </p>
        <div className="card-metadata">
          <span>{formatTime(story.time)}</span>
          <span className="comments-link">
            <a 
              href={`https://news.ycombinator.com/item?id=${story.id}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {story.descendants || 0} comments
            </a>
          </span>
        </div>
      </div>
      <div className="featured-image"></div>
    </div>
  );
};

export default FeaturedStory;
