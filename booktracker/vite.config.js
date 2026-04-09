// ============================================================================
// vite.config.js - Configuração do Vite
// ============================================================================

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Configuração do servidor de desenvolvimento
  server: {
    port: 3000,
    open: true,
    // Proxy para API (evita problemas de CORS em desenvolvimento)
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
})
