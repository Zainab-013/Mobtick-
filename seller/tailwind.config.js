// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // ✅ Add this line
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 1.5s ease-out',
        'spin-slow': 'spin 6s linear infinite',
        'spin-slower': 'spin 12s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
