// ============================================================================
// server/middleware/auth.js - Middleware de Autenticação JWT
// ============================================================================
// Verifica se o token JWT é válido antes de permitir acesso às rotas protegidas.
// ============================================================================

const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticação
 * Verifica o token JWT no header Authorization
 */
const authMiddleware = (req, res, next) => {
  try {
    // Extrair o token do header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Formato esperado: "Bearer <token>"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Formato de token inválido' });
    }

    const token = parts[1];

    // Verificar se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'booktracker-secret-key');

    // Adicionar informações do usuário na requisição
    req.userId = decoded.id;
    req.userPlan = decoded.plan;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

module.exports = authMiddleware;
