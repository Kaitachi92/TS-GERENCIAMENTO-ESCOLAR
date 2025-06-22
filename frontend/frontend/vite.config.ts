import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/alunos': 'http://localhost:3000',
      '/turmas': 'http://localhost:3000',
      '/professores': 'http://localhost:3000',
      '/responsaveis': 'http://localhost:3000',
      '/disciplinas': 'http://localhost:3000',
      '/mensalidades': 'http://localhost:3000'
    }
  }
});
