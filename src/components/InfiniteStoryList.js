import React, { useState, useEffect, useRef, useCallback } from 'react';
import NewsCard from './NewsCard';
import { fetchStories } from '../services/api';
import '../styles/InfiniteStoryList.css';

const InfiniteStoryList = ({ category }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const loaderRef = useRef(null);
  const storiesPerPage = 10;
  const initialOffset = 1; // Skip the first story (featured story)

  // Load initial stories
  useEffect(() => {
    setStories([]);
    setPage(0);
    setHasMore(true);
    loadMoreStories(0);
  }, [category]);

  // Function to load more stories
  const loadMoreStories = useCallback(async (pageToLoad) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Calculate offset - skip the first story on the first page
      const offset = pageToLoad === 0 
        ? initialOffset 
        : initialOffset + (pageToLoad * storiesPerPage);
      
      const newStories = await fetchStories(category, storiesPerPage, offset);
      
      if (newStories.length === 0) {
        setHasMore(false);
      } else {
        setStories(prevStories => 
          pageToLoad === 0 ? newStories : [...prevStories, ...newStories]
        );
        setPage(pageToLoad);
      }
    } catch (err) {
      console.error('Error loading more stories:', err);
      setError('Failed to load more stories. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [category, loading]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          loadMoreStories(page + 1);
        }
      },
      { threshold: 0.5 }
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [loadMoreStories, hasMore, loading, page]);

  // Handle retry when error occurs
  const handleRetry = () => {
    loadMoreStories(page);
  };

  return (
    <div className="infinite-story-list">
      {stories.length > 0 ? (
        <div className="story-grid">
          {stories.map((story) => (
            <NewsCard key={story.id} story={story} />
          ))}
        </div>
      ) : !loading && !error && (
        <div className="no-stories-message">
          <p>No stories found for this category.</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleRetry} className="retry-button">Retry</button>
        </div>
      )}
      
      {loading && (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Loading more stories...</p>
        </div>
      )}
      
      {!loading && !error && hasMore && stories.length > 0 && (
        <div ref={loaderRef} className="loader-element">
          <p>Scroll down to load more stories</p>
        </div>
      )}
      
      {!hasMore && stories.length > 0 && (
        <div className="end-message">
          <p>You've reached the end of the stories!</p>
        </div>
      )}
    </div>
  );
};

export default InfiniteStoryList; 