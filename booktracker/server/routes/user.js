// ============================================================================
// server/routes/user.js - Rotas de Usuário
// ============================================================================

const express = require('express');
const authMiddleware = require('../middleware/auth');

module.exports = (db) => {
  const router = express.Router();

  // Todas as rotas de usuário requerem autenticação
  router.use(authMiddleware);

  /**
   * Rota: GET /api/user/profile
   */
  router.get('/profile', (req, res) => {
    try {
      const user = db.prepare('SELECT id, name, email, plan, reading_goal, created_at FROM users WHERE id = ?').get(req.userId);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json(user);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  /**
   * Rota: PUT /api/user/profile
   */
  router.put('/profile', (req, res) => {
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }

    try {
      if (email) {
        const existingEmail = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, req.userId);
        
        if (existingEmail) {
          return res.status(400).json({ error: 'Este email já está em uso' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ error: 'Email inválido' });
        }
      }

      const fields = [];
      const values = [];

      if (name) {
        fields.push('name = ?');
        values.push(name);
      }

      if (email) {
        fields.push('email = ?');
        values.push(email);
      }

      fields.push('updated_at = ?');
      values.push(new Date().toISOString());

      values.push(req.userId);

      db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...values);

      const updatedUser = db.prepare('SELECT id, name, email, plan, reading_goal, created_at FROM users WHERE id = ?').get(req.userId);

      res.json(updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  /**
   * Rota: PUT /api/user/reading-goal
   */
  router.put('/reading-goal', (req, res) => {
    const { goal } = req.body;

    if (typeof goal !== 'number' || goal < 0) {
      return res.status(400).json({ error: 'Meta deve ser um número positivo' });
    }

    try {
      db.prepare('UPDATE users SET reading_goal = ?, updated_at = ? WHERE id = ?').run(
        goal,
        new Date().toISOString(),
        req.userId
      );

      res.json({ 
        message: 'Meta atualizada com sucesso',
        readingGoal: goal
      });
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  /**
   * Rota: POST /api/user/upgrade
   */
  router.post('/upgrade', (req, res) => {
    try {
      db.prepare('UPDATE users SET plan = ?, updated_at = ? WHERE id = ?').run(
        'premium',
        new Date().toISOString(),
        req.userId
      );

      res.json({ 
        message: 'Upgrade realizado com sucesso!',
        plan: 'premium'
      });
    } catch (error) {
      console.error('Erro ao fazer upgrade:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  /**
   * Rota: DELETE /api/user/account
   */
  router.delete('/account', (req, res) => {
    try {
      db.prepare('DELETE FROM users WHERE id = ?').run(req.userId);

      res.json({ message: 'Conta deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  return router;
};
