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
        primary: {
          red: '#E30613',
          'red-hover': '#C00511',
          dark: '#33333B',
          gray: '#F6F6F8',
          border: '#E5E5E5',
          text: '#47474F',
          muted: '#707078',
        },
        brand: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#E30613',
          600: '#E30613',
          700: '#C00511',
          900: '#7f1d1d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'tool': '0 2px 10px rgba(0,0,0,0.08)',
        'tool-hover': '0 8px 30px rgba(0,0,0,0.12)',
        'soft': '0 2px 15px -3px rgba(0,0,0,0.07)',
        'medium': '0 4px 25px -5px rgba(0,0,0,0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
