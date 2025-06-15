/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tuner: {
          wood: '#8B4513',
          woodLight: '#CD853F',
          woodDark: '#654321',
          string: '#C0C0C0',
          peg: '#FFD700',
          perfect: '#10B981',
          good: '#F59E0B',
          off: '#EF4444'
        }
      },
      fontFamily: {
        'guitar': ['Georgia', 'serif']
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}