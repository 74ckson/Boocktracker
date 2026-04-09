// ============================================================================
// server/routes/auth.js - Rotas de Autenticação
// ============================================================================
// Registro e Login de usuários com JWT
// ============================================================================

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (db) => {
  const router = express.Router();

  // Limite do plano gratuito
  const FREE_PLAN_LIMIT = 50;

  /**
   * Rota: POST /api/auth/register
   * Registra um novo usuário
   */
  router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    // Validações
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    try {
      // Verificar se email já está em uso
      const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      
      if (existingUser) {
        return res.status(400).json({ error: 'Este email já está cadastrado' });
      }

      // Hash da senha
      const passwordHash = bcrypt.hashSync(password, 10);

      // Inserir novo usuário
      const result = db.prepare(`
        INSERT INTO users (name, email, password_hash, plan)
        VALUES (?, ?, ?, 'free')
      `).run(name, email, passwordHash);

      const userId = result.lastInsertRowid;

      // Gerar token JWT
      const token = jwt.sign(
        { id: userId, plan: 'free' },
        process.env.JWT_SECRET || 'booktracker-secret-key',
        { expiresIn: '7d' }
      );

      // Retornar dados do usuário
      res.status(201).json({
        user: {
          id: userId,
          name,
          email,
          plan: 'free',
          readingGoal: 0
        },
        token
      });

    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  /**
   * Rota: POST /api/auth/login
   * Autentica um usuário
   */
  router.post('/login', (req, res) => {
    console.log('\n🔐 Tentativa de login...');
    console.log('📧 Email recebido:', req.body.email);
    console.log('📦 Body completo:', JSON.stringify(req.body, null, 2));
    
    const { email, password } = req.body;

    // Validações
    if (!email || !password) {
      console.log('❌ Campos faltando');
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
      // Buscar usuário por email
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      
      console.log('👤 Usuário encontrado:', user ? user.email : 'NÃO');
      
      if (!user) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      // Verificar senha
      const passwordMatch = bcrypt.compareSync(password, user.password_hash);
      console.log('🔐 Senha bateu?', passwordMatch);
      
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { id: user.id, plan: user.plan },
        process.env.JWT_SECRET || 'booktracker-secret-key',
        { expiresIn: '7d' }
      );

      console.log('✅ Login bem-sucedido!');

      // Retornar dados do usuário (sem a senha)
      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          readingGoal: user.reading_goal
        },
        token
      });

    } catch (error) {
      console.error('❌ Erro ao fazer login:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        detail: error.message,
        stack: error.stack
      });
    }
  });

  return router;
};
