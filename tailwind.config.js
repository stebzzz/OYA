/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        'oya-navy': '#223049',
        'oya-orange': '#ff6a3d',
        'oya-purple': '#9b6bff',
        'oya-ivory': '#f4f0ec',
      },
    },
  },
  plugins: [],
};