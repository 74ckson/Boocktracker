// ============================================================================
// main.jsx - Ponto de Entrada com React Router
// ============================================================================
// Configuração do roteamento para o app SaaS.
// ============================================================================

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './App.css'

import App from './App'
import Login from './pages/Login'
import Register from './pages/Register'
import BookDetailPage from './pages/BookDetailPage'
import ProtectedRoute from './components/ProtectedRoute'
import { getUser, getToken } from './services/storage'

// Componente para redirecionar usuários logados
function PublicRoute({ children }) {
  const user = getUser();
  const token = getToken();
  
  if (user && token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Rotas Protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:id"
          element={
            <ProtectedRoute>
              <BookDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Redirecionar raiz para dashboard ou login */}
        <Route
          path="/"
          element={
            getUser() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Rota fallback - redireciona para página apropriada */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
