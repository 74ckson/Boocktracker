// ============================================================================
// server/routes/books.js - Rotas de CRUD de Livros
// ============================================================================

const express = require('express');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

module.exports = (db) => {
  const router = express.Router();

  // Limite do plano gratuito
  const FREE_PLAN_LIMIT = 50;

  // Todas as rotas de livros requerem autenticação
  router.use(authMiddleware);

  /**
   * Rota: GET /api/books
   */
  router.get('/', (req, res) => {
    try {
      const books = db.prepare(`
        SELECT * FROM books 
        WHERE user_id = ? 
        ORDER BY added_at DESC
      `).all(req.userId);

      res.json(books);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  /**
   * Rota: GET /api/books/stats
   */
  router.get('/stats', (req, res) => {
    try {
      const books = db.prepare('SELECT * FROM books WHERE user_id = ?').all(req.userId);

      const stats = {
        totalBooks: books.length,
        booksReading: books.filter(b => b.status === 'lendo').length,
        booksRead: books.filter(b => b.status === 'lido').length,
        booksWantToRead: books.filter(b => b.status === 'quero-ler').length,
        averageRating: 0,
        booksThisYear: 0
      };

      const ratedBooks = books.filter(b => b.rating > 0);
      if (ratedBooks.length > 0) {
        const totalRating = ratedBooks.reduce((sum, b) => sum + b.rating, 0);
        stats.averageRating = totalRating / ratedBooks.length;
      }

      const currentYear = new Date().getFullYear();
      stats.booksThisYear = books.filter(b => {
        if (!b.completed_at) return false;
        return new Date(b.completed_at).getFullYear() === currentYear;
      }).length;

      res.json(stats);
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  /**
   * Rota: POST /api/books
   */
  router.post('/', upload.single('coverImage'), (req, res) => {
    try {
      console.log('📝 Criando livro...');
      console.log('  - UserID:', req.userId);
      console.log('  - Body:', req.body);
      console.log('  - File:', req.file ? req.file.filename : 'nenhum');
      
      // Suportar tanto FormData quanto JSON
      const { title, author, cover, description, status, rating } = req.body;

      if (!title || !author) {
        return res.status(400).json({ error: 'Título e autor são obrigatórios' });
      }

      // Verificar limite do plano gratuito
      const bookCount = db.prepare('SELECT COUNT(*) as count FROM books WHERE user_id = ?').get(req.userId);
      
      if (req.userPlan === 'free' && bookCount.count >= FREE_PLAN_LIMIT) {
        return res.status(403).json({ 
          error: `Você atingiu o limite de ${FREE_PLAN_LIMIT} livros do plano gratuito. Faça upgrade para Premium!`,
          limit: FREE_PLAN_LIMIT
        });
      }

      // Determinar a URL da capa: upload > URL fornecida > placeholder
      let coverUrl = null;
      
      if (req.file) {
        // Upload de arquivo: gerar URL do arquivo salvo
        coverUrl = `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}`;
      } else if (cover && cover.startsWith('http')) {
        // URL de capa fornecida no body
        coverUrl = cover;
      } else {
        // Placeholder com título do livro
        coverUrl = `https://placehold.co/300x450/6366f1/ffffff?text=${encodeURIComponent(title)}`;
      }

      const result = db.prepare(`
        INSERT INTO books (user_id, title, author, cover, description, status, rating)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        req.userId,
        title,
        author,
        coverUrl,
        description || '',
        status || 'quero-ler',
        rating || 0
      );

      const newBook = db.prepare('SELECT * FROM books WHERE id = ?').get(result.lastInsertRowid);

      res.status(201).json(newBook);
    } catch (error) {
      console.error('Erro ao criar livro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  /**
   * Rota: PUT /api/books/:id
   */
  router.put('/:id', upload.single('coverImage'), (req, res) => {
    const bookId = req.params.id;
    const updates = req.body;

    try {
      const book = db.prepare('SELECT * FROM books WHERE id = ? AND user_id = ?').get(bookId, req.userId);

      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }

      const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'user_id');

      // Se houver upload de imagem, adicionar ao updates
      if (req.file) {
        updates.cover = `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}`;
        fields.push('cover');
      }

      if (fields.length === 0) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar' });
      }

      fields.push('updated_at');
      updates.updated_at = new Date().toISOString();

      if (updates.status === 'lido' && book.status !== 'lido') {
        fields.push('completed_at');
        updates.completed_at = new Date().toISOString();
      }

      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => updates[field]);
      values.push(bookId);

      db.prepare(`UPDATE books SET ${setClause} WHERE id = ?`).run(...values);

      const updatedBook = db.prepare('SELECT * FROM books WHERE id = ?').get(bookId);

      res.json(updatedBook);
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  /**
   * Rota: POST /api/books/:id (para atualizar com FormData)
   * Aceita _method=PUT no FormData para simular PUT
   */
  router.post('/:id', upload.single('coverImage'), (req, res) => {
    const bookId = req.params.id;
    const updates = req.body;
    const method = updates._method;

    // Se for PUT via FormData
    if (method === 'PUT') {
      delete updates._method;

      try {
        const book = db.prepare('SELECT * FROM books WHERE id = ? AND user_id = ?').get(bookId, req.userId);

        if (!book) {
          return res.status(404).json({ error: 'Livro não encontrado' });
        }

        const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'user_id');

        // Se houver upload de imagem, adicionar ao updates
        if (req.file) {
          updates.cover = `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}`;
          fields.push('cover');
        }

        if (fields.length === 0) {
          return res.status(400).json({ error: 'Nenhum campo para atualizar' });
        }

        fields.push('updated_at');
        updates.updated_at = new Date().toISOString();

        if (updates.status === 'lido' && book.status !== 'lido') {
          fields.push('completed_at');
          updates.completed_at = new Date().toISOString();
        }

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = fields.map(field => updates[field]);
        values.push(bookId);

        db.prepare(`UPDATE books SET ${setClause} WHERE id = ?`).run(...values);

        const updatedBook = db.prepare('SELECT * FROM books WHERE id = ?').get(bookId);

        res.json(updatedBook);
      } catch (error) {
        console.error('Erro ao atualizar livro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    } else {
      res.status(405).json({ error: 'Método não permitido' });
    }
  });

  /**
   * Rota: DELETE /api/books/:id
   */
  router.delete('/:id', (req, res) => {
    const bookId = req.params.id;

    try {
      const book = db.prepare('SELECT * FROM books WHERE id = ? AND user_id = ?').get(bookId, req.userId);

      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }

      db.prepare('DELETE FROM books WHERE id = ?').run(bookId);

      res.json({ message: 'Livro removido com sucesso' });
    } catch (error) {
      console.error('Erro ao remover livro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  /**
   * Rota: GET /api/books/:id
   */
  router.get('/:id', (req, res) => {
    const bookId = req.params.id;

    try {
      const book = db.prepare('SELECT * FROM books WHERE id = ? AND user_id = ?').get(bookId, req.userId);
      
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }

      res.json(book);
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  return router;
};
