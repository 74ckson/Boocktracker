// ============================================================================
// server/index.js - Servidor Backend BookTracker SaaS
// ============================================================================

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./database'); // Agora exporta instância diretamente

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARES
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ROTAS
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'BookTracker API está rodando!',
    timestamp: new Date().toISOString()
  });
});

// Usar db diretamente (agora é a instância, não a classe)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes(db));

const bookRoutes = require('./routes/books');
app.use('/api/books', bookRoutes(db));

const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes(db));

// TRATAMENTO DE ERROS
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor'
  });
});

// INICIALIZAÇÃO
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   📚 BookTracker API                                     ║
║   Servidor: http://localhost:${PORT}                     ║
║   Ambiente: ${process.env.NODE_ENV || 'desenvolvimento'}                          ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
