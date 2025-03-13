// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import SecondaryNav from './components/SecondaryNav';
import FeaturedStory from './components/FeaturedStory';
import StockTicker from './components/StockTicker';
import NewsGrid from './components/NewsGrid';
import Pagination from './components/Pagination';
import Footer from './components/Footer';
import { fetchTopStories } from './services/api';

function App() {
  const [topStories, setTopStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 9;
  
  useEffect(() => {
    const getStories = async () => {
      try {
        const stories = await fetchTopStories(30);
        setTopStories(stories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    getStories();
  }, []);
  
  // Get current stories for pagination
  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = topStories.slice(indexOfFirstStory, indexOfLastStory);
  const featuredStory = topStories.length > 0 ? topStories[0] : null;
  
  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);
  
  return (
    <div className="app-container">
      <Header />
      <SecondaryNav />
      
      {!loading && featuredStory && (
        <FeaturedStory story={featuredStory} />
      )}
      
      <StockTicker />
      
      <section className="news-section">
        <h2 className="section-title">Top Stories</h2>
        
        {loading ? (
          <div>Loading Hacker News stories...</div>
        ) : (
          <NewsGrid stories={currentStories} />
        )}
        
        <Pagination 
          storiesPerPage={storiesPerPage}
          totalStories={topStories.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </section>
      
      <Footer />
    </div>
  );
}

export default App;
