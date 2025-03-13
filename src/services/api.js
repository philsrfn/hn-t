// src/services/api.js

// Cache for storing fetched stories and IDs
const storyCache = {
  data: {},
  timestamp: {},
  storyIds: {}, // Store all story IDs by type
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes in milliseconds
};

// Map story type to the corresponding API endpoint
const endpoints = {
  top: 'topstories',
  new: 'newstories',
  best: 'beststories',
  ask: 'askstories',
  show: 'showstories',
  job: 'jobstories'
};

// Fetch all story IDs for a given type
export const fetchStoryIds = async (storyType = 'top') => {
  try {
    // Check if we have cached IDs that are still valid
    const now = Date.now();
    
    if (
      storyCache.storyIds[storyType] && 
      storyCache.timestamp[`${storyType}_ids`] && 
      now - storyCache.timestamp[`${storyType}_ids`] < storyCache.CACHE_DURATION
    ) {
      console.log(`Using cached ${storyType} story IDs`);
      return storyCache.storyIds[storyType];
    }
    
    const endpoint = endpoints[storyType] || 'topstories';
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/${endpoint}.json`);
    const storyIds = await response.json();
    
    // Cache the IDs
    storyCache.storyIds[storyType] = storyIds;
    storyCache.timestamp[`${storyType}_ids`] = now;
    
    return storyIds;
  } catch (error) {
    console.error(`Error fetching ${storyType} story IDs:`, error);
    return [];
  }
};

// Fetch story details by ID
export const fetchStoryById = async (id) => {
  try {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching story ${id}:`, error);
    return null;
  }
};

// Fetch a batch of stories by their IDs
export const fetchStoriesByIds = async (ids) => {
  try {
    const storyPromises = ids.map(id => fetchStoryById(id));
    const stories = await Promise.all(storyPromises);
    return stories.filter(story => story !== null); // Filter out any failed fetches
  } catch (error) {
    console.error('Error fetching stories by IDs:', error);
    return [];
  }
};

// Fetch stories with pagination support
export const fetchStories = async (storyType = 'top', limit = 20, offset = 0) => {
  try {
    // Check if we have cached data that's still valid
    const now = Date.now();
    const cacheKey = `${storyType}_${offset}_${limit}`;
    
    if (
      storyCache.data[cacheKey] && 
      storyCache.timestamp[cacheKey] && 
      now - storyCache.timestamp[cacheKey] < storyCache.CACHE_DURATION
    ) {
      console.log(`Using cached ${storyType} stories (offset: ${offset}, limit: ${limit})`);
      return storyCache.data[cacheKey];
    }
    
    // Get all story IDs for this type
    const allStoryIds = await fetchStoryIds(storyType);
    
    // Select the slice we need based on offset and limit
    const selectedIds = allStoryIds.slice(offset, offset + limit);
    
    // Fetch details for each story
    const stories = await fetchStoriesByIds(selectedIds);
    
    // Cache the results
    storyCache.data[cacheKey] = stories;
    storyCache.timestamp[cacheKey] = now;
    
    return stories;
  } catch (error) {
    console.error(`Error fetching ${storyType} stories:`, error);
    return [];
  }
};

// For backward compatibility
export const fetchTopStories = async (limit = 20) => {
  return fetchStories('top', limit);
};
  