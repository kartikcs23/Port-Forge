/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'sans-serif'],
      },
      colors: {
        background: '#FAF9F6',   // Off-white paper
        surface: '#FFFFFF',      // Pure white panels
        ink: '#111111',          // Deep black text
        accent: '#0055FF',       // Clean, professional electric blue
        muted: '#8A8A8A',        // Secondary text and borders
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(17,17,17,1)',
        'brutal-hover': '2px 2px 0px 0px rgba(17,17,17,1)',
      }
    },
  },
  plugins: [],
}
