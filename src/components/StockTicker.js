import React, { useState, useEffect, useRef } from 'react';
import '../styles/StockTicker.css';

const StockTicker = () => {
  const [stocks, setStocks] = useState([]);
  // Always use mock data since API has rate limits
  const isUpdatingRef = useRef(false); // Ref to track if an update is in progress

  // Mock data to use when API limit is reached
  const mockStockData = [
    { symbol: 'AAPL', price: 187.32, change: 1.25 },
    { symbol: 'MSFT', price: 425.52, change: -0.87 },
    { symbol: 'AMZN', price: 178.75, change: 2.34 },
    { symbol: 'GOOGL', price: 163.45, change: 0.75 },
    { symbol: 'META', price: 474.99, change: 3.21 },
    { symbol: 'TSLA', price: 177.58, change: -1.43 },
    { symbol: 'DTE.DE', price: 42.15, change: 0.32 },
  ];

  // Function to add small random variations to mock data to simulate market movement
  const updateMockData = () => {
    return mockStockData.map(stock => {
      // Smaller change percentage to reduce jitter
      const changePercent = (Math.random() * 2 - 1) * 0.2; // Random change between -0.2% and +0.2%
      const priceChange = stock.price * (changePercent / 100);
      return {
        ...stock,
        price: parseFloat((stock.price + priceChange).toFixed(2)),
        change: parseFloat(priceChange.toFixed(2))
      };
    });
  };

  useEffect(() => {
    // Clear any existing intervals when dependencies change
    let intervalId = null;
    
    const fetchStockData = async () => {
      // Prevent multiple simultaneous updates
      if (isUpdatingRef.current) return;
      
      isUpdatingRef.current = true;
      
      try {
        // Always use mock data to avoid API rate limits
        setStocks(prevStocks => {
          // If we already have stocks, make smoother transitions
          if (prevStocks.length > 0) {
            return prevStocks.map(prevStock => {
              // Find the base stock data
              const baseStock = mockStockData.find(s => s.symbol === prevStock.symbol) || prevStock;
              
              // Smaller change percentage for smoother transitions
              const changePercent = (Math.random() * 2 - 1) * 0.1; // Even smaller change
              const priceChange = baseStock.price * (changePercent / 100);
              
              // Apply a small change to the current price
              return {
                ...prevStock,
                price: parseFloat((prevStock.price + priceChange).toFixed(2)),
                change: parseFloat(priceChange.toFixed(2))
              };
            });
          } else {
            // Initial load - use the mock data
            return updateMockData();
          }
        });
      } catch (error) {
        console.error('Error updating stock data:', error);
      } finally {
        isUpdatingRef.current = false;
      }
    };

    // Initial fetch
    fetchStockData();
    
    // Update every minute
    const updateInterval = 60000; // 1 minute
    console.log(`Setting up stock ticker update interval: ${updateInterval}ms`);
    
    intervalId = setInterval(fetchStockData, updateInterval);

    // Clean up function
    return () => {
      if (intervalId) {
        console.log('Clearing stock ticker interval');
        clearInterval(intervalId);
      }
    };
  }, []); // We're intentionally not including mockStockData and updateMockData as dependencies
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