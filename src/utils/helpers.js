export const formatURL = (url) => {
    if (!url) return null;
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace(/^www\./, '');
    } catch (error) {
      console.error('Invalid URL:', url);
      return url;
    }
  };