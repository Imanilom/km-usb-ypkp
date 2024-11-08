// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5173', // Pastikan ini sesuai dengan backend server
        changeOrigin: true, // Bisa membantu mengatasi masalah CORS
        // rewrite: (path) => path.replace(/^\/api/, ''), // Menghapus `/api` dari URL sebelum dikirim ke backend
      },
    },
  },
  plugins: [react()],
});
