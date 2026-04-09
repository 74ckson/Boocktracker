# 📚 BookTracker SaaS

Uma plataforma web completa para acompanhar seus livros e hábitos de leitura, construída com **React**, **Node.js**, **Express** e **SQLite**.

## ✨ Funcionalidades

### 🔐 Autenticação & Autorização
- ✅ Registro e login de usuários com JWT
- ✅ Senhas criptografadas com bcrypt
- ✅ Rotas protegidas por autenticação
- ✅ Sessão persistente com tokens JWT

### 📖 Gerenciamento de Livros
- ✅ Adicionar, editar e remover livros
- ✅ Marcar status: "Quero Ler", "Lendo", "Lido"
- ✅ Avaliações em estrelas (1-5)
- ✅ Busca por título ou autor
- ✅ Filtros por status

### 📊 Estatísticas & Metas
- ✅ Estatísticas em tempo real
- ✅ Metas de leitura anual com barra de progresso
- ✅ Contagem de livros lidos por ano
- ✅ Média de avaliações

### 💎 Planos (Free/Premium)
- ✅ **Plano Gratuito**: Até 50 livros
- ✅ **Plano Premium**: Livros ilimitados + recursos avançados
- ✅ Sistema de upgrade integrado

### 📱 Interface
- ✅ Design responsivo (mobile-first)
- ✅ UI moderna com Bootstrap 5
- ✅ Animações suaves
- ✅ Experiência de usuário otimizada

## 🚀 Tecnologias

### Frontend
- [React 19](https://react.dev/) - Biblioteca UI
- [React Router v6](https://reactrouter.com/) - Roteamento
- [React Bootstrap](https://react-bootstrap.github.io/) - Componentes
- [Axios](https://axios-http.com/) - Cliente HTTP
- [Vite](https://vitejs.dev/) - Build tool

### Backend
- [Node.js](https://nodejs.org/) - Runtime
- [Express.js](https://expressjs.com/) - Framework web
- [SQLite](https://www.sqlite.org/) - Banco de dados
- [JWT](https://jwt.io/) - Autenticação
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Hash de senhas

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### 1. Clonar o repositório
```bash
git clone <url-do-repositorio>
cd booktracker
```

### 2. Instalar dependências do frontend
```bash
npm install
```

### 3. Instalar dependências do backend
```bash
cd server
npm install
cd ..
```

### 4. Configurar variáveis de ambiente
```bash
cd server
copy .env.example .env  # Windows
# ou
cp .env.example .env    # Linux/Mac
```

Edite o arquivo `.env` se necessário:
```env
PORT=5000
JWT_SECRET=seu-segredo-aqui
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🎮 Como Usar

### Iniciar o backend (Terminal 1)
```bash
cd server
npm run dev
```

O servidor backend iniciará em: `http://localhost:5000`

### Iniciar o frontend (Terminal 2)
```bash
npm run dev
```

O frontend iniciará em: `http://localhost:3000`

### Conta Demo
O sistema cria automaticamente uma conta demo:
- **Email**: demo@booktracker.com
- **Senha**: 123456

## 📁 Estrutura do Projeto

```
booktracker/
├── src/                      # Frontend React
│   ├── components/           # Componentes React reutilizáveis
│   │   ├── BookCard.jsx      # Card de livro
│   │   ├── BookForm.jsx      # Formulário modal
│   │   ├── Header.jsx        # Cabeçalho com menu
│   │   ├── ProtectedRoute.jsx # Rota protegida
│   │   ├── SearchBar.jsx     # Barra de busca
│   │   ├── StarRating.jsx    # Avaliação em estrelas
│   │   └── StatsCard.jsx     # Card de estatísticas
│   ├── pages/                # Páginas da aplicação
│   │   ├── Login.jsx         # Página de login
│   │   └── Register.jsx      # Página de registro
│   ├── services/             # Serviços e APIs
│   │   ├── api.js            # Cliente API (Axios)
│   │   └── storage.js        # Persistência local
│   ├── data/                 # Dados estáticos
│   │   └── books.js          # Livros iniciais
│   ├── App.jsx               # Componente principal
│   ├── App.css               # Estilos globais
│   └── main.jsx              # Ponto de entrada + Rotas
├── server/                   # Backend Node.js
│   ├── middleware/           # Middlewares Express
│   │   └── auth.js           # Middleware JWT
│   ├── routes/               # Rotas da API
│   │   ├── auth.js           # Autenticação
│   │   ├── books.js          # CRUD de livros
│   │   └── user.js           # Perfil do usuário
│   ├── database.js           # Configuração SQLite
│   ├── index.js              # Servidor Express
│   └── .env                  # Variáveis de ambiente
├── package.json              # Dependências frontend
├── vite.config.js            # Configuração Vite
└── README.md                 # Este arquivo
```

## 🔌 Endpoints da API

### Autenticação
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Registrar usuário | ❌ |
| POST | `/api/auth/login` | Login | ❌ |

### Livros
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/books` | Listar todos os livros | ✅ |
| GET | `/api/books/stats` | Estatísticas | ✅ |
| GET | `/api/books/:id` | Buscar livro | ✅ |
| POST | `/api/books` | Criar livro | ✅ |
| PUT | `/api/books/:id` | Atualizar livro | ✅ |
| DELETE | `/api/books/:id` | Remover livro | ✅ |

### Usuário
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/user/profile` | Perfil | ✅ |
| PUT | `/api/user/profile` | Atualizar perfil | ✅ |
| PUT | `/api/user/reading-goal` | Meta de leitura | ✅ |
| POST | `/api/user/upgrade` | Upgrade Premium | ✅ |
| DELETE | `/api/user/account` | Deletar conta | ✅ |

## 🎯 Modelos de Dados

### User
```javascript
{
  id: INTEGER PRIMARY KEY,
  name: TEXT,
  email: TEXT UNIQUE,
  password_hash: TEXT,
  plan: TEXT DEFAULT 'free',    // 'free' ou 'premium'
  reading_goal: INTEGER,        // Meta anual de livros
  created_at: DATETIME,
  updated_at: DATETIME
}
```

### Book
```javascript
{
  id: INTEGER PRIMARY KEY,
  user_id: INTEGER,             // Foreign key
  title: TEXT,
  author: TEXT,
  cover: TEXT,                  // URL da capa
  description: TEXT,
  status: TEXT,                 // 'quero-ler', 'lendo', 'lido'
  rating: INTEGER,              // 0-5 estrelas
  completed_at: DATETIME,       // Quando marcou como lido
  added_at: DATETIME,
  updated_at: DATETIME
}
```

## 🚀 Deploy em Produção

### Frontend (Vercel)
```bash
npm run build
# Deploy na Vercel
npx vercel
```

### Backend (Railway/Render)
1. Criar projeto no Railway/Render
2. Conectar repositório GitHub
3. Configurar variáveis de ambiente
4. Deploy automático

### Banco de Dados (Produção)
Para produção, migre SQLite para PostgreSQL:
- [Supabase](https://supabase.com/) (PostgreSQL gratuito)
- [Neon](https://neon.tech/) (PostgreSQL serverless)

## 📊 Plano de Desenvolvimento Futuro

### Fase 1: Recursos Sociais
- [ ] Compartilhamento de estantes
- [ ] Comentários e reviews
- [ ] Amigos e seguidores
- [ ] Feed de atividades

### Fase 2: Integrações
- [ ] Google Books API
- [ ] OpenLibrary API
- [ ] Importação de Goodreads
- [ ] Scan de ISBN com câmera

### Fase 3: Recursos Avançados
- [ ] Recomendações com IA
- [ ] Desafios de leitura
- [ ] Badges e conquistas
- [ ] Relatórios PDF/CSV
- [ ] Notificações por email

### Fase 4: Monetização
- [ ] Integração Stripe/MercadoPago
- [ ] Plano Família
- [ ] Trial premium
- [ ] Programa de afiliados

## 🧪 Testes

### Testar fluxos principais:
1. ✅ Registrar novo usuário
2. ✅ Fazer login
3. ✅ Adicionar livro
4. ✅ Editar status/avaliação
5. ✅ Buscar e filtrar livros
6. ✅ Definir meta de leitura
7. ✅ Fazer logout
8. ✅ Verificar persistência de dados

## 📄 Licença

ISC

## 👥 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
1. Fork o projeto
2. Criar branch para feature (`git checkout -b feature/AmazingFeature`)
3. Commit mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📞 Suporte

- 📧 Email: suporte@booktracker.com
- 💬 Issues: [GitHub Issues](https://github.com/seu-usuario/booktracker/issues)
- 📖 Documentação: [Wiki](https://github.com/seu-usuario/booktracker/wiki)

---

**Feito com ❤️ usando React, Node.js e Bootstrap**

🌐 [Website](https://booktracker.com) | 📧 [Contato](mailto:contato@booktracker.com) | 🐦 [Twitter](https://twitter.com/booktracker)
