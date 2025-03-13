import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/StockTicker.css';

const StockTicker = () => {
  const [stocks, setStocks] = useState([]);
  const symbols = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'TSLA', 'DTE.DE'];
  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const stockData = await Promise.all(
          symbols.map(async (symbol) => {
            const response = await axios.get(`https://www.alphavantage.co/query`, {
              params: {
                function: 'GLOBAL_QUOTE',
                symbol: symbol,
                apikey: API_KEY
              }
            });
            const data = response.data['Global Quote'];
            return {
              symbol: data['01. symbol'],
              price: parseFloat(data['05. price']),
              change: parseFloat(data['09. change'])
            };
          })
        );
        setStocks(stockData);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [symbols, API_KEY]);

  return (
    <div className="stock-ticker">
      <div className="ticker-wrapper">
        <div className="ticker-track">
          {stocks.map((stock, index) => (
            <div key={index} className="ticker-item">
              <span className="stock-symbol">{stock.symbol}</span>
              <span className="stock-price">${stock.price.toFixed(2)}</span>
              <span className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockTicker;