/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        keyframes: {
          ripple: {
            '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)' },
            '50%': { transform: 'translate(-50%, -50%) scale(0.9)' },
          },
        },
        animation: {
          ripple: 'ripple 2s ease-in-out infinite',
        },
      },
    },
    plugins: [],
  }
  