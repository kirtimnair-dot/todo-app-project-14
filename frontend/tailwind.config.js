/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { brand: { 50: '#fff4e9', 100: '#ffe5cc', 400: '#ff8a32', 500: '#ff6b00', 600: '#e85d04' }, ink: '#211d1a', cream: '#fffaf5' }, boxShadow: { soft: '0 12px 36px rgba(63, 42, 23, .08)' } } },
  plugins: []
};
