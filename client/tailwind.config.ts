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
        guild: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          accent: '#38bdf8',
          secondary: '#818cf8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        rms: ['Verdana', 'Arial', 'Helvetica', 'sans-serif'],
      },
      fontSize: {
        'rms-xs': '9px',
        'rms-sm': '10px',
        'rms-base': '11px',
        'rms-lg': '12px',
        'rms-xl': '13px',
      }
    }
  },
  plugins: [],
}

