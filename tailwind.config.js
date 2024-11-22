/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'pulse-red': 'pulseRed 3s ease-in-out infinite',
        'pulse-yellow': 'pulseYellow 3s ease-in-out infinite',
        'pulse-green': 'pulseGreen 3s ease-in-out infinite',
      },
      keyframes: {
        pulseRed: {
          '0%, 100%': { backgroundColor: '#f87171' }, // Red-500
          '50%': { backgroundColor: '#ef4444' }, // Red-600
        },
        pulseYellow: {
          '0%, 100%': { backgroundColor: '#fbbf24' }, // Yellow-500
          '50%': { backgroundColor: '#f59e0b' }, // Yellow-600
        },
        pulseGreen: {
          '0%, 100%': { backgroundColor: '#34d399' }, // Green-500
          '50%': { backgroundColor: '#10b981' }, // Green-600
        },
      },
    },
  },
  plugins: [],
};
