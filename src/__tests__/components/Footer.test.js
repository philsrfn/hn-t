import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer';

describe('Footer Component', () => {
  it('renders the footer with description', () => {
    render(<Footer />);
    
    // Check for description
    expect(screen.getByText(/A modern Hacker News client built with React/)).toBeInTheDocument();
  });
  
  it('renders the footer with GitHub link', () => {
    render(<Footer />);
    
    // Check for GitHub link
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });
  
  it('renders the footer with Hacker News link', () => {
    render(<Footer />);
    
    // Check for Hacker News link
    expect(screen.getByText('Hacker News')).toBeInTheDocument();
  });
}); 