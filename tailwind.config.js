/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', 
    content: [
      './index.html',
      './src/**/*.{ts,tsx,js,jsx}',
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          'brand-bg':      '#F6FBF4', // very light green
          'brand-accent':  '#F5DF99', // soft yellow
          'brand-primary': '#5FD068', // mint green
          'brand-dark':    '#4B8673', // forest green
        },
      },
    },
    plugins: [],
  }
  