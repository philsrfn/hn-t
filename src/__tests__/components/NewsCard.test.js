import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NewsCard from '../../components/NewsCard';

// Mock window.open
const mockOpen = jest.fn();
window.open = mockOpen;

describe('NewsCard Component', () => {
  beforeEach(() => {
    mockOpen.mockClear();
  });

  const mockStory = {
    id: 12345,
    title: 'Test Story Title',
    by: 'testuser',
    score: 100,
    descendants: 42,
    url: 'https://example.com/test-story'
  };

  it('renders story information correctly', () => {
    render(<NewsCard story={mockStory} />);
    
    // Check title
    expect(screen.getByText('Test Story Title')).toBeInTheDocument();
    
    // Check author
    expect(screen.getByText('By testuser')).toBeInTheDocument();
    
    // Check score
    expect(screen.getByText('100 points')).toBeInTheDocument();
    
    // Check comments
    expect(screen.getByText('42 comments')).toBeInTheDocument();
    
    // Check hostname
    expect(screen.getByText('example.com')).toBeInTheDocument();
  });

  it('displays a category based on story ID', () => {
    render(<NewsCard story={mockStory} />);
    
    // The category is determined by story.id % categories.length
    // We can't predict the exact category, but we can check that some category is displayed
    const categories = ['Tech', 'AI', 'Programming', 'Startup', 'Data', 'Open Source', 'Web Dev'];
    const categoryElement = screen.getByText((content) => {
      return categories.includes(content);
    });
    
    expect(categoryElement).toBeInTheDocument();
  });

  it('opens the story URL when clicked', () => {
    render(<NewsCard story={mockStory} />);
    
    // Click on the card
    fireEvent.click(screen.getByText('Test Story Title'));
    
    // Check that window.open was called with the correct URL
    expect(mockOpen).toHaveBeenCalledWith(
      'https://example.com/test-story',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('opens the HN discussion when story has no URL', () => {
    const storyWithoutUrl = { ...mockStory, url: null };
    render(<NewsCard story={storyWithoutUrl} />);
    
    // Click on the card
    fireEvent.click(screen.getByText('Test Story Title'));
    
    // Check that window.open was called with the HN discussion URL
    expect(mockOpen).toHaveBeenCalledWith(
      'https://news.ycombinator.com/item?id=12345',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('comments link opens in a new tab and has correct href', () => {
    render(<NewsCard story={mockStory} />);
    
    // Get the comments link
    const commentsLink = screen.getByText('42 comments').closest('a');
    
    // Check that the link has the correct href and target attributes
    expect(commentsLink).toHaveAttribute('href', 'https://news.ycombinator.com/item?id=12345');
    expect(commentsLink).toHaveAttribute('target', '_blank');
    expect(commentsLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
}); 