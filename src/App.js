// src/App.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const footerRef = useRef(null);
  
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

   // Scroll to top function
   const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Scroll to footer function
  const scrollToFooter = () => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Show/hide scroll buttons based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButtons(true);
      } else {
        setShowScrollButtons(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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
      
      {showScrollButtons && (
        <div className="scroll-buttons">
          <button 
            className="scroll-button back-to-top" 
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <i className="fa-solid fa-arrow-up"></i>
          </button>
          <button 
            className="scroll-button view-footer" 
            onClick={scrollToFooter}
            aria-label="View footer"
          >
            <i className="fa-solid fa-arrow-down"></i>
          </button>
        </div>
      )}
      
      <Footer ref={footerRef} />
    </div>
  );
}

export default App;
