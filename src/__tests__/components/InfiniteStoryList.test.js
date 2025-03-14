import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import InfiniteStoryList from '../../components/InfiniteStoryList';
import * as apiService from '../../services/api';

// Mock the API service
jest.mock('../../services/api');

describe('InfiniteStoryList Component', () => {
  const mockStories = [
    {
      id: 1,
      title: 'Test Story 1',
      by: 'user1',
      score: 100,
      descendants: 10,
      url: 'https://example.com/1'
    },
    {
      id: 2,
      title: 'Test Story 2',
      by: 'user2',
      score: 200,
      descendants: 20,
      url: 'https://example.com/2'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the IntersectionObserver
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    });
    window.IntersectionObserver = mockIntersectionObserver;
    
    // Mock the fetchStories function
    apiService.fetchStories.mockResolvedValue(mockStories);
  });

  it('renders loading state initially', () => {
    render(<InfiniteStoryList category="top" />);
    
    // Check for loading indicator
    expect(screen.getByText('Loading more stories...')).toBeInTheDocument();
  });

  it('renders stories after loading', async () => {
    render(<InfiniteStoryList category="top" />);
    
    // Wait for stories to load
    await waitFor(() => {
      expect(apiService.fetchStories).toHaveBeenCalled();
    });
    
    // Check that stories are rendered
    await waitFor(() => {
      expect(screen.getByText('Test Story 1')).toBeInTheDocument();
      expect(screen.getByText('Test Story 2')).toBeInTheDocument();
    });
  });

  it('shows error state when API fails', async () => {
    // Mock API failure
    apiService.fetchStories.mockRejectedValue(new Error('API Error'));
    
    render(<InfiniteStoryList category="top" />);
    
    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to load more stories. Please try again.')).toBeInTheDocument();
    });
    
    // Retry button should be visible
    const retryButton = screen.getByText('Retry');
    expect(retryButton).toBeInTheDocument();
  });

  it('retries loading stories when retry button is clicked', async () => {
    // Mock API failure then success
    apiService.fetchStories.mockRejectedValueOnce(new Error('API Error'));
    apiService.fetchStories.mockResolvedValueOnce(mockStories);
    
    render(<InfiniteStoryList category="top" />);
    
    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to load more stories. Please try again.')).toBeInTheDocument();
    });
    
    // Click retry button
    const retryButton = screen.getByText('Retry');
    
    // Use act for the button click
    await act(async () => {
      fireEvent.click(retryButton);
    });
    
    // API should be called again
    expect(apiService.fetchStories).toHaveBeenCalledTimes(2);
    
    // Wait for stories to load
    await waitFor(() => {
      expect(screen.getByText('Test Story 1')).toBeInTheDocument();
    });
  });

  it('shows scroll message when auto-load is enabled', async () => {
    render(<InfiniteStoryList category="top" />);
    
    // Wait for stories to load
    await waitFor(() => {
      expect(apiService.fetchStories).toHaveBeenCalled();
    });
    
    // Check for scroll message
    await waitFor(() => {
      expect(screen.getByText('Scroll down to load more stories')).toBeInTheDocument();
    });
  });
}); 