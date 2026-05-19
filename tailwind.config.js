/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0c0a0a',
        foreground: '#e8e4dc',
        card: {
          DEFAULT: '#141010',
          foreground: '#e8e4dc',
        },
        primary: '#7f1d1d',
        'primary-foreground': '#fce8e8',
        secondary: '#1c1515',
        'secondary-foreground': '#d4cfc7',
        accent: '#b91c1c',
        'accent-foreground': '#fff5f5',
        border: '#3f2f2f',
        input: '#2a2020',
        muted: '#6b5c5c',
        'muted-foreground': '#a89a9a',
      },
      fontFamily: {
        display: ['"Creepster"', 'cursive'],
        sans: ['"Libre Baskerville"', 'Georgia', 'serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(185, 28, 28, 0.25)',
        'glow-sm': '0 0 12px rgba(185, 28, 28, 0.15)',
      },
      backgroundImage: {
        'horror-gradient':
          'linear-gradient(180deg, rgba(127, 29, 29, 0.22) 0%, #0c0a0a 55%)',
        'blood-fade':
          'linear-gradient(135deg, rgba(185, 28, 28, 0.2) 0%, #141010 70%)',
      },
    },
  },
  plugins: [],
  safelist: ['shadow-glow-sm', 'shadow-glow'],
}
