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
          50: '#fff1eb',
          100: '#ffe0d1',
          200: '#ffc8b1',
          300: '#ffaa8a',
          400: '#ff8a62',
          500: '#ff6a3d',
          600: '#eb5021',
          700: '#c43c15',
          800: '#9c2e12',
          900: '#7a2410',
          950: '#461208',
        },
        secondary: {
          50: '#f3f0ff',
          100: '#e9e3ff',
          200: '#d6caff',
          300: '#bba3ff',
          400: '#a889ff',
          500: '#9b6bff',
          600: '#8048ff',
          700: '#712ef2',
          800: '#6026d9',
          900: '#501eb1',
          950: '#301274',
        },
        dark: '#223049',
        light: '#f4f0ec',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        heading: ['Codec Pro', 'Poppins', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        blob: {
          '0%': {
            transform: 'scale(1) translate(0px, 0px)',
          },
          '33%': {
            transform: 'scale(1.1) translate(30px, -30px)',
          },
          '66%': {
            transform: 'scale(0.9) translate(-30px, 30px)',
          },
          '100%': {
            transform: 'scale(1) translate(0px, 0px)',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      transitionDelay: {
        '2000': '2000ms',
      },
      transitionProperty: {
        'width': 'width',
      },
    },
  },
  plugins: [],
}