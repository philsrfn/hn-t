import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import * as apiService from '../services/api';

// Mock the API service
jest.mock('../services/api');

describe('App Component', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock the fetchStories function
    apiService.fetchStories.mockResolvedValue([
      {
        id: 1,
        title: 'Test Story 1',
        url: 'https://example.com/1',
        by: 'user1',
        time: Date.now() / 1000,
        score: 100,
        descendants: 10
      }
    ]);
  });

  it('renders without crashing', async () => {
    render(<App />);
    
    // Check for section title
    expect(screen.getByText('Top Stories')).toBeInTheDocument();
    
    // Wait for the featured story to load
    await waitFor(() => {
      expect(apiService.fetchStories).toHaveBeenCalled();
    });
  });

  it('displays the correct section title based on active category', async () => {
    render(<App />);
    
    // Default category should be 'top'
    expect(screen.getByText('Top Stories')).toBeInTheDocument();
    
    // Change category to 'new'
    const newStoriesLink = screen.getByText('New');
    userEvent.click(newStoriesLink);
    
    // Section title should update
    await waitFor(() => {
      expect(screen.getByText('New Stories')).toBeInTheDocument();
    });
    
    // API should be called with the new category
    expect(apiService.fetchStories).toHaveBeenCalledWith('new', 1, 0);
  });

  it('shows loading state while fetching stories', async () => {
    // Delay the API response
    apiService.fetchStories.mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([{
            id: 1,
            title: 'Test Story 1',
            url: 'https://example.com/1',
            by: 'user1',
            time: Date.now() / 1000,
            score: 100,
            descendants: 10
          }]);
        }, 100);
      });
    });
    
    render(<App />);
    
    // Loading indicator should be visible
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for the loading to complete
    await waitFor(() => {
      expect(apiService.fetchStories).toHaveBeenCalled();
    });
  });

  it('shows error state when API fails', async () => {
    // Mock API failure
    apiService.fetchStories.mockRejectedValue(new Error('API Error'));
    
    render(<App />);
    
    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Failed to load featured story/i)).toBeInTheDocument();
    });
    
    // Retry button should be visible
    const retryButton = screen.getByText('Retry');
    expect(retryButton).toBeInTheDocument();
    
    // Click retry
    userEvent.click(retryButton);
    
    // API should be called again
    expect(apiService.fetchStories).toHaveBeenCalledTimes(2);
  });
}); 