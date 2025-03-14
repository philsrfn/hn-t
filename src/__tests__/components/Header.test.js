import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../../components/Header';

// Mock matchMedia before any tests run
beforeAll(() => {
  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock localStorage
  const localStorageMock = (function() {
    let store = {};
    return {
      getItem: jest.fn(key => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString();
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };
  })();
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
});

// Reset mocks before each test
beforeEach(() => {
  window.localStorage.getItem.mockClear();
  window.localStorage.setItem.mockClear();
});

describe('Header Component', () => {
  const mockOnCategoryChange = jest.fn();

  test('renders header with navigation', () => {
    render(<Header activeCategory="top" onCategoryChange={mockOnCategoryChange} />);
    
    expect(screen.getByText('TeleHacker News')).toBeInTheDocument();
    expect(screen.getByText('Top')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Best')).toBeInTheDocument();
    expect(screen.getByText('Ask HN')).toBeInTheDocument();
    expect(screen.getByText('Show HN')).toBeInTheDocument();
    expect(screen.getByText('Jobs')).toBeInTheDocument();
  });

  test('highlights active category', () => {
    render(<Header activeCategory="new" onCategoryChange={mockOnCategoryChange} />);
    
    const activeButton = screen.getByText('New').closest('button');
    expect(activeButton).toHaveClass('active');
  });

  test('calls onCategoryChange when category is clicked', () => {
    render(<Header activeCategory="top" onCategoryChange={mockOnCategoryChange} />);
    
    fireEvent.click(screen.getByText('New'));
    expect(mockOnCategoryChange).toHaveBeenCalledWith('new');
  });

  test('toggles dark mode when theme button is clicked', () => {
    render(<Header activeCategory="top" onCategoryChange={mockOnCategoryChange} />);
    
    // Initially in light mode
    const themeButton = screen.getByLabelText('Switch to dark mode');
    expect(themeButton).toBeInTheDocument();
    
    // Click to toggle to dark mode
    fireEvent.click(themeButton);
    
    // Should now show option to switch to light mode
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
    expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  test('uses saved theme preference from localStorage', () => {
    // Mock localStorage to return 'dark'
    window.localStorage.getItem.mockReturnValueOnce('dark');
    
    render(<Header activeCategory="top" onCategoryChange={mockOnCategoryChange} />);
    
    // Should show option to switch to light mode since we're in dark mode
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
  });
}); 