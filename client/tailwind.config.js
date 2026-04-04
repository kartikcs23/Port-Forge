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
        serif: ['"Playfair Display"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        background: '#FAF9F6',   // Off-white paper
        surface: '#FFFFFF',      // Pure white panels
        ink: '#111111',          // Deep black text
        accent: '#0055FF',       // Clean, professional electric blue
        muted: '#8A8A8A',        // Secondary text and borders
        // Theme Specific Tokens
        luxor: {
          gold: '#c5a021',
          gold_dim: '#8c6c00',
          sand: '#f5e6d3',
          paper: '#fff8f3',
          ink: '#221a0f',
        },
        nebula: {
          cyan: '#22d3ee',
          purple: '#8b5cf6',
          void: '#000000',
          starlight: '#ffffff',
        }
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(17,17,17,1)',
        'brutal-hover': '2px 2px 0px 0px rgba(17,17,17,1)',
        'luxor-card': '0 20px 40px -15px rgba(0,0,0,0.1)',
        'nebula-glow': '0 0 15px rgba(34, 211, 238, 0.3)',
      }
    },
  },
  plugins: [],
}
