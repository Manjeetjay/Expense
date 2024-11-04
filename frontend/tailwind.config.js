/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        trader: {
          green: '#00ff88',
          red: '#ff3366',
          blue: '#00a8ff',
          dark: {
            primary: '#1a1a2e',
            secondary: '#16213e',
            accent: '#0f3460'
          },
          light: {
            primary: '#ffffff',
            secondary: '#f8fafc',
            accent: '#e2e8f0'
          }
        }
      },
      boxShadow: {
        'glow': '0 0 15px rgba(0, 168, 255, 0.3)',
        'glow-green': '0 0 15px rgba(0, 255, 136, 0.3)',
        'glow-red': '0 0 15px rgba(255, 51, 102, 0.3)',
      }
    },
  },
  plugins: [],
}

