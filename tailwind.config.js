/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        harvest: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        soil: {
          50: '#faf6f0',
          100: '#f4ede1',
          200: '#e7d8c5',
          300: '#d5bfa4',
          400: '#bca181',
          500: '#9c8163',
          600: '#7a644c',
          700: '#5e4c3a',
          800: '#43362a',
          900: '#2c231c',
        },
        cream: {
          50: '#fefdfb',
          100: '#fbf9f4',
          200: '#f6f2e9',
          300: '#eee8d9',
          400: '#dfd6c0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(31, 38, 135, 0.14)',
        'emerald-glow': '0 0 25px -5px rgba(22, 163, 74, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'farm-gradient': 'linear-gradient(135deg, #166534 0%, #15803d 50%, #22c55e 100%)',
        'harvest-gradient': 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)',
      }
    },
  },
  plugins: [],
}
