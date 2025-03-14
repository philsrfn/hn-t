import { formatURL } from '../../utils/helpers';

describe('Helper Functions', () => {
  describe('formatURL', () => {
    it('returns null for null or undefined URLs', () => {
      expect(formatURL(null)).toBeNull();
      expect(formatURL(undefined)).toBeNull();
    });
    
    it('removes www. from the hostname', () => {
      expect(formatURL('https://www.example.com')).toBe('example.com');
      expect(formatURL('http://www.test.org/path')).toBe('test.org');
    });
    
    it('returns just the hostname without path or query parameters', () => {
      expect(formatURL('https://example.com/path/to/page')).toBe('example.com');
      expect(formatURL('https://test.org/path?query=value')).toBe('test.org');
    });
    
    it('handles URLs without www prefix', () => {
      expect(formatURL('https://example.com')).toBe('example.com');
      expect(formatURL('http://test.org')).toBe('test.org');
    });
    
    it('returns the original URL if it is invalid', () => {
      const invalidURL = 'not-a-valid-url';
      expect(formatURL(invalidURL)).toBe(invalidURL);
    });
    
    it('handles subdomains correctly', () => {
      expect(formatURL('https://subdomain.example.com')).toBe('subdomain.example.com');
      expect(formatURL('https://www.subdomain.example.com')).toBe('subdomain.example.com');
    });
  });
}); 