/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          dark: '#0f291e',
          DEFAULT: '#14412f',
          light: '#1b5e3f',
          stripe: '#164834',
          line: 'rgba(255, 255, 255, 0.7)'
        },
        tactic: {
          red: '#ef4444',
          blue: '#3b82f6',
          yellow: '#eab308',
          green: '#22c55e',
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155'
        }
      }
    },
  },
  plugins: [],
}
