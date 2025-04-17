// Stock API cache to minimize API calls (Alpha Vantage has rate limits)
const stockCache = {
  data: {},
  timestamp: {},
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

// Rate limiting configuration for Alpha Vantage API
// Free tier: 5 requests per minute, 500 per day
const rateLimiter = {
  queue: [],
  processing: false,
  lastRequestTime: 0,
  // 12 seconds between requests to stay within 5 requests per minute limit
  minRequestInterval: 12000, 
  
  // Add a request to the queue
  enqueue(symbol, resolve, reject) {
    this.queue.push({ symbol, resolve, reject });
    
    // Start processing the queue if not already processing
    if (!this.processing) {
      this.processQueue();
    }
  },
  
  // Process the next item in the queue
  async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }
    
    this.processing = true;
    
    // Calculate time to wait before next request
    const now = Date.now();
    const timeToWait = Math.max(0, this.lastRequestTime + this.minRequestInterval - now);
    
    if (timeToWait > 0) {
      console.log(`Rate limiting: waiting ${timeToWait}ms before next request`);
      await new Promise(resolve => setTimeout(resolve, timeToWait));
    }
    
    // Get the next request from the queue
    const { symbol, resolve, reject } = this.queue.shift();
    
    try {
      const result = await fetchStockQuoteDirectly(symbol);
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.lastRequestTime = Date.now();
      
      // Continue processing the queue after a small delay
      setTimeout(() => this.processQueue(), 50);
    }
  }
};

/**
 * Internal function that actually makes the API call
 * Not exported, only used by the rate-limited fetchStockQuote
 */
async function fetchStockQuoteDirectly(symbol) {
  try {
    // Check cache first
    const now = Date.now();
    const cacheKey = `quote_${symbol}`;
    
    if (
      stockCache.data[cacheKey] && 
      stockCache.timestamp[cacheKey] && 
      now - stockCache.timestamp[cacheKey] < stockCache.CACHE_DURATION
    ) {
      console.log(`Using cached stock data for ${symbol}`);
      return stockCache.data[cacheKey];
    }
    
    // Get API key from environment variables
    const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;
    
    if (!API_KEY) {
      console.error('Alpha Vantage API key not found in environment variables!');
      console.error('Please add REACT_APP_ALPHA_VANTAGE_API_KEY to your .env file');
      throw new Error('API key not configured');
    }
    
    console.log(`Fetching real stock data for ${symbol}...`);
    
    // Fetch from API if not in cache or cache expired
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if we got valid data back or if we hit the rate limit
    if (data['Note'] && data['Note'].includes('call frequency')) {
      console.error('Alpha Vantage rate limit reached:', data['Note']);
      throw new Error('Rate limit exceeded');
    }
    
    if (data['Error Message']) {
      console.error(`Alpha Vantage error: ${data['Error Message']}`);
      throw new Error(`API error: ${data['Error Message']}`);
    }
    
    if (!data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
      console.error(`No data available for symbol ${symbol}`, data);
      throw new Error(`No data available for symbol ${symbol}`);
    }
    
    // Format the data to match our existing format
    const quote = data['Global Quote'];
    const price = parseFloat(quote['05. price']);
    const previousClose = parseFloat(quote['08. previous close']);
    const change = parseFloat(quote['09. change']);
    
    console.log(`Received real data for ${symbol}: $${price} (${change >= 0 ? '+' : ''}${change})`);
    
    const stockData = {
      symbol,
      price,
      change,
      changePercent: parseFloat(quote['10. change percent'].replace('%', ''))
    };
    
    // Cache the result
    stockCache.data[cacheKey] = stockData;
    stockCache.timestamp[cacheKey] = now;
    
    return stockData;
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    throw error;
  }
}

/**
 * Rate-limited function to fetch stock quote data
 * This wraps the direct API call with our rate limiter
 */
export const fetchStockQuote = async (symbol) => {
  try {
    // Return a new promise that will be resolved when the rate limiter processes this request
    return new Promise((resolve, reject) => {
      rateLimiter.enqueue(symbol, resolve, reject);
    });
  } catch (error) {
    console.error(`Error in rate-limited stock fetch for ${symbol}:`, error);
    return null;
  }
};

/**
 * Fetches multiple stock quotes while respecting rate limits
 * @param {Array<string>} symbols - Array of stock symbols
 * @returns {Promise<Array<Object>>} - Array of stock data objects
 */
export const fetchMultipleStocks = async (symbols) => {
  console.log(`Attempting to fetch ${symbols.length} stock symbols:`, symbols);
  
  try {
    // Process each symbol one at a time to respect rate limits
    const results = [];
    
    for (const symbol of symbols) {
      try {
        const stockData = await fetchStockQuote(symbol);
        if (stockData) {
          results.push(stockData);
        }
      } catch (error) {
        console.error(`Error fetching stock ${symbol}:`, error);
        // Continue with other symbols even if one fails
      }
    }
    
    console.log(`Successfully fetched ${results.length}/${symbols.length} stocks`);
    return results;
  } catch (error) {
    console.error('Error fetching multiple stocks:', error);
    return [];
  }
}; 