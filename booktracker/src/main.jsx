// ============================================================================
// main.jsx - Ponto de Entrada da Aplicação React
// ============================================================================
// Este é o primeiro arquivo que o React executa. Ele é responsável por:
// 1. Importar as dependências necessárias
// 2. Conectar o React ao elemento HTML com id="root"
// 3. Renderizar o componente principal (App) na tela
// ============================================================================

// Importações do React:
// - StrictMode: um componente que ajuda a encontrar problemas no código
// - createRoot: a função que monta o React no HTML
import React from 'react'
import ReactDOM from 'react-dom/client'

// Importação do CSS do Bootstrap para estilização
import 'bootstrap/dist/css/bootstrap.min.css'

// Importação dos ícones do Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'

// Importação do nosso CSS personalizado
import './App.css'

// Importação do componente principal da aplicação
import App from './App'

// ============================================================================
// CRIAÇÃO DA RAIZ DO REACT
// ============================================================================
// ReactDOM.createRoot() encontra o elemento <div id="root"> no HTML
// e prepara o React para renderizar componentes dentro dele
const root = ReactDOM.createRoot(document.getElementById('root'))

// ============================================================================
// RENDERIZAÇÃO DO APP
// ============================================================================
// root.render() diz ao React qual componente mostrar na tela.
// <React.StrictMode> é um wrapper que ativa verificações extras de qualidade
// no código durante o desenvolvimento (não afeta a versão final).
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
