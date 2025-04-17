import React, { useState, useEffect, useRef } from 'react';
import '../styles/StockTicker.css';
import { fetchStockQuote } from '../services/stockApi';

const StockTicker = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isUpdatingRef = useRef(false); // Ref to track if an update is in progress

  // Reduced number of stock symbols to 5 to stay within API rate limits
  const stockSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];

  useEffect(() => {
    // Clear any existing intervals when dependencies change
    let intervalId = null;
    
    const fetchStockData = async () => {
      // Prevent multiple simultaneous updates
      if (isUpdatingRef.current) return;
      
      isUpdatingRef.current = true;
      setLoading(true);
      
      try {
        // Fetch real stock data from Alpha Vantage
        console.log('Fetching stock data from Alpha Vantage API...');
        
        // Progressive loading - update UI as each stock is fetched
        let fetched = 0;
        for (const symbol of stockSymbols) {
          try {
            // Fetch individual stock to update UI faster
            const stockData = await fetchStockQuote(symbol);
            
            if (stockData) {
              // Update existing stocks array, adding new stock or replacing if exists
              setStocks(prevStocks => {
                const existingIndex = prevStocks.findIndex(s => s.symbol === stockData.symbol);
                
                if (existingIndex >= 0) {
                  // Replace existing stock
                  const updatedStocks = [...prevStocks];
                  updatedStocks[existingIndex] = stockData;
                  return updatedStocks;
                } else {
                  // Add new stock
                  return [...prevStocks, stockData];
                }
              });
              
              fetched++;
              console.log(`Progressive update: ${fetched}/${stockSymbols.length} stocks loaded`);
            }
          } catch (err) {
            console.error(`Error fetching individual stock ${symbol}:`, err);
          }
        }
        
        if (fetched === 0) {
          setError('No stock data available. Please check your API key configuration.');
          console.error('No data returned from stock API');
        } else {
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setError('Failed to fetch stock data: ' + error.message);
      } finally {
        isUpdatingRef.current = false;
        setLoading(false);
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
  }, []); // Empty dependency array - run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps

  // Create a duplicate set of ticker items to ensure continuous scrolling
  const renderTickerItems = () => {
    // Show loading only when we have no stocks data at all
    if (loading && stocks.length === 0) {
      return (
        <div className="ticker-item">
          <span>Loading stock data...</span>
        </div>
      );
    }
    
    if (error && stocks.length === 0) {
      return (
        <div className="ticker-item error">
          <span>Could not load stock data. Please check API key configuration.</span>
        </div>
      );
    }
    
    if (stocks.length === 0) {
      return (
        <div className="ticker-item">
          <span>No stock data available</span>
        </div>
      );
    }
    
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