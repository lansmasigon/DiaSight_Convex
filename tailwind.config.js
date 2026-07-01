/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        card: '#0C0C0C',
        'border-light': 'rgba(255,255,255,0.08)',
        primary: '#FFFFFF',
        secondary: '#8A8A8A',
        'accent-blue': '#3D7EFF',
        'accent-cyan': '#5AE8FF',
        'glass-bg': 'rgba(255,255,255,0.02)',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'sans-serif'],
        serif: ['Canela', 'PP Editorial New', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        'xl': '12px',
      },
    },
  },
  plugins: [],
}