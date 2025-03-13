// src/services/api.js
export const fetchTopStories = async (limit = 20) => {
    try {
      const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      const storyIds = await response.json();
      const topIds = storyIds.slice(0, limit);
      
      // Fetch details for each story
      const storyPromises = topIds.map(id => 
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          .then(response => response.json())
      );
      
      return await Promise.all(storyPromises);
    } catch (error) {
      console.error('Error fetching stories:', error);
      return [];
    }
  };
  