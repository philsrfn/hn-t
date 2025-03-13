# 📱 TeleHacker News

A modern, responsive Hacker News client with a sleek UI and dark mode support! Built with React and styled with custom CSS.

![TeleHacker News as of 13th March 2025](/public/images/Bildschirmfoto%202025-03-13%20um%2014.17.28.png)

## ✨ Features

- 🔄 Real-time stock ticker with mock data
- 🌙 Dark mode toggle (looks awesome at night!)
- 📱 Fully responsive design for all devices
- ♾️ Infinite scrolling for endless news browsing
- 🔍 Search functionality (coming soon)
- 🔝 Browse different categories (Top, New, Best, Ask HN, Show HN, Jobs)

## 🛠️ Tech Stack

- React (Hooks, Context API)
- Custom CSS (no frameworks, I wanted to learn CSS better!)
- FontAwesome for icons
- LocalStorage for theme persistence

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repo
```bash
git clone https://github.com/yourusername/telehacker-news.git
cd telehacker-news
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

4. Open your browser and navigate to `http://localhost:3000`

## 🧠 What I Learned

This project helped me understand:
- How to implement dark mode with CSS variables
- Creating responsive layouts without frameworks
- Working with the Hacker News API
- Implementing infinite scrolling
- Managing component state with React hooks

## 🔮 Future Improvements

- [ ] Add user authentication
- [ ] Implement comment viewing and threading
- [ ] Add more data visualization components
- [ ] Create a PWA for offline reading
- [ ] Add unit and integration tests

## 🤔 Challenges I Faced

The biggest challenge was implementing the infinite scrolling feature without causing performance issues. I learned about React's useCallback and memo to optimize rendering, and how to properly handle API requests to avoid rate limiting.

Another tricky part was getting the dark mode to work smoothly across all components. CSS variables saved the day!

## 📝 License

MIT License - feel free to use this code for your own projects!

---

Made with ❤️ and lots of ☕ by Phil