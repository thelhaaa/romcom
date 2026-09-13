import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'gsap', 'canvas-confetti', 'lucide-react'],
  },
  server: {
    port: 3000,
    open: false,
    host: true,
  },
});
