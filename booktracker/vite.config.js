// ============================================================================
// vite.config.js - Configuração do Vite
// ============================================================================
// O Vite é uma ferramenta de build moderna para projetos JavaScript/TypeScript.
// Ele é muito mais rápido que o Webpack e oferece Hot Module Replacement (HMR),
// que atualiza o código no navegador sem recarregar a página.
// ============================================================================

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// defineConfig() é uma função helper que fornece autocompletar de IntelliSense
// para a configuração do Vite
export default defineConfig({
  // O plugin React permite a transpilação do JSX (sintaxe do React)
  plugins: [react()],
  
  // Configuração do servidor de desenvolvimento
  server: {
    port: 3000,        // Porta onde o app vai rodar
    open: true,        // Abre o navegador automaticamente
  },
})
