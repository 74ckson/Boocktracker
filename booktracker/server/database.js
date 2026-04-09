// ============================================================================
// server/database.js - Configuração do Banco de Dados SQLite
// ============================================================================

const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'booktracker.db');

// Criar/abrir banco de dados
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

console.log('✅ Banco de dados conectado:', dbPath);

// Criar tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    plan TEXT DEFAULT 'free',
    reading_goal INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    cover TEXT,
    description TEXT,
    status TEXT DEFAULT 'quero-ler',
    rating INTEGER DEFAULT 0,
    completed_at DATETIME,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
  CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
`);

console.log('📋 Tabelas criadas/verificadas');

// Inserir dados de exemplo se vazio
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();

if (userCount.count === 0) {
  console.log('🌱 Inserindo dados de exemplo...');
  
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password_hash, plan)
    VALUES (?, ?, ?, ?)
  `);

  const insertBook = db.prepare(`
    INSERT INTO books (user_id, title, author, cover, description, status, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const seed = db.transaction(() => {
    const passwordHash = bcrypt.hashSync('123456', 10);
    
    const user = insertUser.run(
      'Usuário Demo',
      'demo@booktracker.com',
      passwordHash,
      'free'
    );

    const userId = user.lastInsertRowid;

    const sampleBooks = [
      {
        title: 'Dom Casmurro',
        author: 'Machado de Assis',
        cover: 'https://placehold.co/300x450/4a5568/ffffff?text=Dom+Casmurro',
        description: 'Clássico da literatura brasileira.',
        status: 'lido',
        rating: 5
      },
      {
        title: '1984',
        author: 'George Orwell',
        cover: 'https://placehold.co/300x450/2d3748/ffffff?text=1984',
        description: 'Distopia sobre regime totalitário.',
        status: 'lendo',
        rating: 0
      },
      {
        title: 'O Pequeno Príncipe',
        author: 'Antoine de Saint-Exupéry',
        cover: 'https://placehold.co/300x450/5a67d8/ffffff?text=Pequeno+Principe',
        description: 'Uma fábula poética sobre amizade.',
        status: 'lido',
        rating: 4
      }
    ];

    sampleBooks.forEach((book, i) => {
      insertBook.run(
        userId,
        book.title,
        book.author,
        book.cover,
        book.description,
        book.status,
        book.rating
      );
      console.log(`📚 Livro criado: ${book.title}`);
    });
  });

  seed();
  console.log('✅ Dados de exemplo inseridos');
  console.log('📧 Email: demo@booktracker.com');
  console.log('🔑 Senha: 123456');
} else {
  console.log(`📊 ${userCount.count} usuário(s) existente(s)`);
}

// Exportar a instância do banco (não a classe!)
module.exports = db;
