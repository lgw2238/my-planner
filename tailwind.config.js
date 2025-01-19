/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'naver-pastel': {
          navy: '#5B6C8C',
          blue: '#A4B7DD',
          green: '#9ED6B7',
          pink: '#FFD8E1',
          yellow: '#FFE9B0',
          gray: '#F5F6F7'
        }
      }
    },
  },
  plugins: [],
} 