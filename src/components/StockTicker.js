import React, { useState, useEffect, useRef } from 'react';
import '../styles/StockTicker.css';
import { fetchMultipleStocks } from '../services/stockApi';

const StockTicker = () => {
  const [stocks, setStocks] = useState([]);
  const isUpdatingRef = useRef(false); // Ref to track if an update is in progress

  // List of stock symbols to fetch
  const stockSymbols = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'TSLA', 'DTE.DE'];

  useEffect(() => {
    // Clear any existing intervals when dependencies change
    let intervalId = null;
    
    const fetchStockData = async () => {
      // Prevent multiple simultaneous updates
      if (isUpdatingRef.current) return;
      
      isUpdatingRef.current = true;
      
      try {
        // Fetch real stock data from Alpha Vantage
        const realStockData = await fetchMultipleStocks(stockSymbols);
        
        // Only update state if we got data back
        if (realStockData && realStockData.length > 0) {
          setStocks(realStockData);
          console.log('Updated stock data from Alpha Vantage API');
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        isUpdatingRef.current = false;
      }
    };

    // Initial fetch
    fetchStockData();
    
    // Update every 5 minutes to respect API rate limits
    const updateInterval = 5 * 60 * 1000; // 5 minutes
    console.log(`Setting up stock ticker update interval: ${updateInterval}ms`);
    
    intervalId = setInterval(fetchStockData, updateInterval);

    // Clean up function
    return () => {
      if (intervalId) {
        console.log('Clearing stock ticker interval');
        clearInterval(intervalId);
      }
    };
  }, []); 
  // eslint-disable-next-line react-hooks/exhaustive-deps

  // Create a duplicate set of ticker items to ensure continuous scrolling
  const renderTickerItems = () => {
    if (stocks.length === 0) return null;
    
    // Helper function to render a single stock item
    const renderStockItem = (stock, key) => (
      <div key={key} className="ticker-item">
        <span className="stock-symbol">{stock.symbol}</span>
        <span className="stock-price">${stock.price.toFixed(2)}</span>
        <span className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
        </span>
      </div>
    );
    
    // Create two sets of the same items to ensure continuous scrolling
    return (
      <>
        {/* First set of items with separators */}
        {stocks.map((stock, index) => (
          <React.Fragment key={`first-fragment-${index}`}>
            {renderStockItem(stock, `first-${index}`)}
            <div className="ticker-separator">•</div>
          </React.Fragment>
        ))}
        
        {/* Second set of items with separators (duplicate) */}
        {stocks.map((stock, index) => (
          <React.Fragment key={`second-fragment-${index}`}>
            {renderStockItem(stock, `second-${index}`)}
            <div className="ticker-separator">•</div>
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div className="stock-ticker">
      <div className="ticker-wrapper">
        <div className="ticker-track">
          {renderTickerItems()}
        </div>
      </div>
    </div>
  );
};

export default StockTicker;