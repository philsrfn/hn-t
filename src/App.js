// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import './styles/theme.css';
import Header from './components/Header';
import FeaturedStory from './components/FeaturedStory';
import StockTicker from './components/StockTicker';
import InfiniteStoryList from './components/InfiniteStoryList';
import Footer from './components/Footer';
import { fetchStories } from './services/api';
import './styles/NewsSection.css';

function App() {
  const [featuredStory, setFeaturedStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('top');
  const [error, setError] = useState(null);
  
  // Fetch just the featured story
  const getFeaturedStory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch just one story for the featured spot
      const stories = await fetchStories(activeCategory, 1, 0);
      if (stories && stories.length > 0) {
        setFeaturedStory(stories[0]);
      } else {
        setFeaturedStory(null);
      }
    } catch (error) {
      console.error('Error fetching featured story:', error);
      setError('Failed to load featured story. Please try again later.');
      setFeaturedStory(null);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);
  
  useEffect(() => {
    getFeaturedStory();
  }, [getFeaturedStory]);
  
  // Handle category change
  const handleCategoryChange = (category) => {
    if (category !== activeCategory) {
      setActiveCategory(category);
    }
  };
  
  // Get section title based on active category
  const getSectionTitle = () => {
    const titles = {
      top: 'Top Stories',
      new: 'New Stories',
      best: 'Best Stories',
      ask: 'Ask HN',
      show: 'Show HN',
      job: 'Jobs'
    };
    return titles[activeCategory] || 'Stories';
  };
  
  // Retry loading if there was an error
  const handleRetry = () => {
    getFeaturedStory();
  };
  
  return (
    <div className="app-container">
      <Header 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange} 
      />
      
      <StockTicker />
      
      <div className="main-content">
        {!loading && !error && featuredStory && (
          <FeaturedStory story={featuredStory} />
        )}
        
        <section className="news-section">
          <div className="section-header">
            <h2 className="section-title">{getSectionTitle()}</h2>
            {loading && <span className="loading-indicator">Loading...</span>}
          </div>
          
          {error ? (
            <div className="error-container">
              <p>{error}</p>
              <button onClick={handleRetry} className="retry-button">Retry</button>
            </div>
          ) : (
            <InfiniteStoryList category={activeCategory} />
          )}
        </section>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;
