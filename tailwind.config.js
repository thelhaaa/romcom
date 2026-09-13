/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#080508',
        bordeauxDark: '#120710',
        bordeaux: '#1B0814',
        bordeauxLight: '#2A0E21',
        crimsonDeep: '#7a1631',
        dustyRose: '#d4708f',
        softBlush: '#f5c2d3',
        velvetRose: '#d6336c',
        neonPink: '#ff2a85',
        roseGlow: '#ff7da7',
        balletPink: '#fbcfe8',
        silkWhite: '#fcf8f9',
        champagne: '#f7eedb',
        paperCream: '#faf6f0',
      },
      fontFamily: {
        apple: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"Montserrat"', '"Helvetica Neue"', 'sans-serif'],
        button: ['"Montserrat"', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Helvetica Neue"', 'sans-serif'],
        helvetica: ['"Helvetica Neue"', 'Helvetica', '"Montserrat"', 'Arial', 'sans-serif'],
        curvy: ['"Fraunces"', '"Bodoni Moda"', 'serif'],
        poster: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Montserrat"', '"Syne"', 'sans-serif'],
        editorial: ['"Bodoni Moda"', '"Playfair Display"', 'serif'],
        doodle: ['"Gaegu"', '"Caveat"', 'cursive'],
        monoTag: ['"Space Mono"', 'monospace'],
        serif: ['"Fraunces"', '"Bodoni Moda"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Montserrat"', 'sans-serif'],
        sans: ['"Montserrat"', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"Plus Jakarta Sans"', 'sans-serif'],
        script: ['"Gaegu"', '"Caveat"', 'cursive'],
      },
      boxShadow: {
        'glow-pink': '0 0 25px rgba(255, 42, 133, 0.45), 0 0 50px rgba(255, 125, 167, 0.2)',
        'glow-soft': '0 0 15px rgba(251, 207, 232, 0.4), 0 0 30px rgba(255, 42, 133, 0.15)',
        'glow-intense': '0 0 35px rgba(255, 42, 133, 0.7), 0 0 70px rgba(255, 0, 128, 0.4)',
        'hologram': '0 8px 32px rgba(255, 42, 133, 0.35), inset 0 0 16px rgba(255, 255, 255, 0.6)',
        'paper-lift': '0 8px 24px -4px rgba(0, 0, 0, 0.65), 0 2px 6px -1px rgba(0, 0, 0, 0.4)',
        'luxury-glass': '0 20px 50px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.4)',
      },
      animation: {
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'wiggle-intense': 'wiggleIntense 0.15s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.4s ease-in-out infinite',
        'hologram-sweep': 'hologramSweep 4s linear infinite',
        'shimmer-sweep': 'shimmerSweep 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'unfold-paper': 'unfoldPaper 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(0.5deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        wiggleIntense: {
          '0%, 100%': { transform: 'rotate(-4deg) scale(1)' },
          '50%': { transform: 'rotate(4deg) scale(1.04)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.09)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.06)' },
          '70%': { transform: 'scale(1)' },
        },
        hologramSweep: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        shimmerSweep: {
          '0%': { transform: 'translateX(-150%)' },
          '100%': { transform: 'translateX(250%)' },
        },
        unfoldPaper: {
          '0%': { transform: 'perspective(1000px) rotateX(-25deg) translateY(20px)', opacity: '0' },
          '100%': { transform: 'perspective(1000px) rotateX(0deg) translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
