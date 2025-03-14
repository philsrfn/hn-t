import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FeaturedStory from '../../components/FeaturedStory';

// Mock window.open
const mockOpen = jest.fn();
window.open = mockOpen;

describe('FeaturedStory Component', () => {
  beforeEach(() => {
    mockOpen.mockClear();
  });

  const mockStory = {
    id: 12345,
    title: 'Featured Test Story',
    by: 'testuser',
    score: 500,
    descendants: 100,
    time: Math.floor(Date.now() / 1000),
    url: 'https://example.com/featured-story'
  };

  it('renders story information correctly', () => {
    render(<FeaturedStory story={mockStory} />);
    
    // Check title
    expect(screen.getByText('Featured Test Story')).toBeInTheDocument();
    
    // Check metadata
    expect(screen.getByText(/500 points/)).toBeInTheDocument();
    expect(screen.getByText(/by testuser/)).toBeInTheDocument();
    expect(screen.getByText(/example.com/)).toBeInTheDocument();
    
    // Check comments link
    expect(screen.getByText('100 comments')).toBeInTheDocument();
  });

  it('formats time correctly', () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const storyWithCurrentTime = { ...mockStory, time: currentTime };
    
    render(<FeaturedStory story={storyWithCurrentTime} />);
    
    // The formatted time should be in the document
    // We can't check the exact string since it depends on the locale and timezone
    // But we can check that some time string is rendered
    const date = new Date(currentTime * 1000);
    const timeString = date.toLocaleString();
    expect(screen.getByText(timeString)).toBeInTheDocument();
  });

  it('opens the story URL when clicked', () => {
    render(<FeaturedStory story={mockStory} />);
    
    // Click on the featured story
    fireEvent.click(screen.getByText('Featured Test Story'));
    
    // Check that window.open was called with the correct URL
    expect(mockOpen).toHaveBeenCalledWith(
      'https://example.com/featured-story',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('opens the HN discussion when story has no URL', () => {
    const storyWithoutUrl = { ...mockStory, url: null };
    render(<FeaturedStory story={storyWithoutUrl} />);
    
    // Click on the featured story
    fireEvent.click(screen.getByText('Featured Test Story'));
    
    // Check that window.open was called with the HN discussion URL
    expect(mockOpen).toHaveBeenCalledWith(
      'https://news.ycombinator.com/item?id=12345',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('has a comments link that opens in a new tab', () => {
    render(<FeaturedStory story={mockStory} />);
    
    // Get the comments link
    const commentsLink = screen.getByText('100 comments');
    
    // Check that it has the correct href
    expect(commentsLink.closest('a')).toHaveAttribute(
      'href',
      'https://news.ycombinator.com/item?id=12345'
    );
    
    // Check that it opens in a new tab
    expect(commentsLink.closest('a')).toHaveAttribute('target', '_blank');
  });

  it('displays story without URL correctly', () => {
    const storyWithoutUrl = { ...mockStory, url: null };
    render(<FeaturedStory story={storyWithoutUrl} />);
    
    // Check that the description doesn't include a hostname
    expect(screen.getByText(/500 points • by testuser/)).toBeInTheDocument();
    expect(screen.queryByText(/example.com/)).not.toBeInTheDocument();
  });
}); 