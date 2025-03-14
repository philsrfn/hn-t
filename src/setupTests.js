// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock the window.scrollTo function
window.scrollTo = jest.fn();

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Suppress console warnings and errors during tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
console.error = (...args) => {
  if (args[0] && args[0].includes && 
      (args[0].includes('Warning: An update to') || 
       args[0].includes('not wrapped in act'))) {
    return;
  }
  originalConsoleError(...args);
};
console.warn = (...args) => {
  if (args[0] && args[0].includes && args[0].includes('Warning:')) {
    return;
  }
  originalConsoleWarn(...args);
};

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = MockIntersectionObserver; 