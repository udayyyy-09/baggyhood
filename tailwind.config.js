/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Arial Narrow', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        ink: '#0b0d0c',
        paper: '#f1f0eb',
        olive: '#777b59',
      },
      boxShadow: {
        soft: '0 20px 70px rgba(0,0,0,.28)',
      },
    },
  },
  plugins: [],
}