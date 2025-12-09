import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/alunos': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/turmas': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/professores': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/responsaveis': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/disciplinas': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/mensalidades': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/dashboard': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
