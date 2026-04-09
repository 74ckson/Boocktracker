// ============================================================================
// App.jsx - Componente Principal da Aplicação BookTracker SaaS
// ============================================================================
// Versão SaaS com:
// - Autenticação de usuários
// - Integração completa com backend API
// - Controle de plano (free/premium)
// - Metas de leitura
// - Estatísticas avançadas
// ============================================================================

import { useState, useMemo, useEffect } from 'react'
import { Container, Button, Row, Col, Alert, Modal, Badge, ProgressBar } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import Header from './components/Header'
import BookCard from './components/BookCard'
import BookForm from './components/BookForm'
import StatsCard from './components/StatsCard'
import SearchBar from './components/SearchBar'
import { getUser, removeUser } from './services/storage'
import * as api from './services/api'

// Limites do plano gratuito
const FREE_PLAN_LIMIT = 50;

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [readingGoal, setReadingGoal] = useState(0);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar usuário e livros ao montar o componente
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const loggedUser = getUser();
      if (!loggedUser) {
        navigate('/login');
        return;
      }
      
      setUser(loggedUser);

      // Carregar livros da API
      const booksData = await api.getBooks();
      setBooks(booksData);

      // Carregar meta de leitura do usuário
      if (loggedUser.readingGoal) {
        setReadingGoal(loggedUser.readingGoal);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Verificar limite do plano
  const isAtLimit = user?.plan === 'free' && books.length >= FREE_PLAN_LIMIT;

  // Calcular estatísticas
  const stats = useMemo(() => {
    const booksReading = books.filter(book => book.status === 'lendo').length;
    const booksRead = books.filter(book => book.status === 'lido').length;
    const booksWantToRead = books.filter(book => book.status === 'quero-ler').length;

    const ratedBooks = books.filter(b => b.rating > 0);
    const totalRating = ratedBooks.reduce((sum, b) => sum + b.rating, 0);
    const averageRating = ratedBooks.length > 0 ? totalRating / ratedBooks.length : 0;

    // Livros lidos este ano
    const currentYear = new Date().getFullYear();
    const booksThisYear = books.filter(book => {
      if (!book.completed_at) return false;
      return new Date(book.completed_at).getFullYear() === currentYear;
    }).length;

    // Progresso da meta
    const goalProgress = readingGoal > 0 ? (booksRead / readingGoal) * 100 : 0;

    return {
      totalBooks: books.length,
      booksReading,
      booksRead,
      booksWantToRead,
      averageRating,
      booksThisYear,
      goalProgress: Math.min(goalProgress, 100),
    };
  }, [books, readingGoal]);

  // Filtragem de livros
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesStatus = filterStatus === 'todos' || book.status === filterStatus;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower);
      return matchesStatus && matchesSearch;
    });
  }, [books, searchTerm, filterStatus]);

  // Handlers
  const handleAddBook = async (newBook) => {
    if (isAtLimit) {
      setShowLimitModal(true);
      return;
    }

    try {
      // Verificar se é FormData (com upload de imagem)
      const isFormData = newBook instanceof FormData;
      
      let createdBook;
      if (isFormData) {
        // FormData: enviar diretamente para a API
        createdBook = await api.createBook(newBook);
      } else {
        // Objeto normal: adicionar timestamp
        createdBook = await api.createBook({
          ...newBook,
          addedAt: new Date().toISOString(),
        });
      }
      
      setBooks([createdBook, ...books]);
    } catch (err) {
      console.error('Erro ao adicionar livro:', err);
      alert('Erro ao adicionar livro. Tente novamente.');
    }
  };

  const handleRemoveBook = async (bookId) => {
    try {
      await api.deleteBook(bookId);
      setBooks(books.filter(book => book.id !== bookId));
    } catch (err) {
      console.error('Erro ao remover livro:', err);
      alert('Erro ao remover livro. Tente novamente.');
    }
  };

  const handleRateBook = async (bookId, newRating) => {
    try {
      const updatedBook = await api.updateBook(bookId, { rating: newRating });
      setBooks(books.map(book => 
        book.id === bookId ? updatedBook : book
      ));
    } catch (err) {
      console.error('Erro ao avaliar livro:', err);
      alert('Erro ao avaliar livro. Tente novamente.');
    }
  };

  const handleStatusChange = async (bookId) => {
    const statusCycle = {
      'quero-ler': 'lendo',
      'lendo': 'lido',
      'lido': 'quero-ler',
    };

    try {
      const book = books.find(b => b.id === bookId);
      const newStatus = statusCycle[book.status];
      
      const updates = {
        status: newStatus,
        completedAt: newStatus === 'lido' ? new Date().toISOString() : undefined
      };

      const updatedBook = await api.updateBook(bookId, updates);
      setBooks(books.map(b => 
        b.id === bookId ? updatedBook : b
      ));
    } catch (err) {
      console.error('Erro ao mudar status:', err);
      alert('Erro ao mudar status. Tente novamente.');
    }
  };

  const handleLogout = () => {
    api.logout();
    navigate('/login');
  };

  const handleSetGoal = async (goal) => {
    try {
      await api.updateReadingGoal(goal);
      setReadingGoal(goal);
      
      // Atualizar usuário local
      const updatedUser = { ...user, readingGoal: goal };
      setUser(updatedUser);
      localStorage.setItem('booktracker_user', JSON.stringify(updatedUser));
      
      setShowGoalModal(false);
    } catch (err) {
      console.error('Erro ao definir meta:', err);
      alert('Erro ao definir meta. Tente novamente.');
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="text-muted">Carregando seus livros...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
          <Button variant="outline-danger" size="sm" className="ms-3" onClick={loadUserData}>
            Tentar Novamente
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="app-wrapper">
      <Header stats={stats} user={user} onLogout={handleLogout} />

      <Container className="py-4">
        {/* Banner do Plano */}
        <Alert variant={user.plan === 'free' ? 'info' : 'success'} className="mb-4">
          <Row className="align-items-center">
            <Col>
              <h6 className="mb-1">
                <i className={`bi bi-${user.plan === 'free' ? 'gift' : 'star'} me-2`}></i>
                Plano {user.plan === 'free' ? 'Gratuito' : 'Premium'}
              </h6>
              <p className="mb-0 small">
                {user.plan === 'free'
                  ? `${books.length}/${FREE_PLAN_LIMIT} livros utilizados. ${FREE_PLAN_LIMIT - books.length} disponíveis.`
                  : 'Você tem acesso ilimitado a todos os recursos!'}
              </p>
            </Col>
            <Col xs="auto">
              {user.plan === 'free' && (
                <Button variant="success" size="sm">
                  <i className="bi bi-arrow-up-circle me-1"></i>
                  Upgrade para Premium
                </Button>
              )}
            </Col>
          </Row>
        </Alert>

        {/* Meta de Leitura */}
        {readingGoal > 0 && (
          <Alert variant="primary" className="mb-4">
            <Row className="align-items-center">
              <Col>
                <h6 className="mb-1">
                  <i className="bi bi-target me-2"></i>
                  Meta de {readingGoal} livros em {new Date().getFullYear()}
                </h6>
                <ProgressBar
                  now={stats.goalProgress}
                  label={`${stats.goalProgress.toFixed(0)}%`}
                  className="mt-2"
                  variant="success"
                />
              </Col>
              <Col xs="auto">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowGoalModal(true)}
                >
                  <i className="bi bi-pencil me-1"></i>
                  Editar Meta
                </Button>
              </Col>
            </Row>
          </Alert>
        )}

        <StatsCard stats={stats} />

        {!readingGoal && (
          <div className="mb-4">
            <Button
              variant="outline-primary"
              onClick={() => setShowGoalModal(true)}
            >
              <i className="bi bi-target me-2"></i>
              Definir Meta de Leitura Anual
            </Button>
          </div>
        )}

        <div className="mt-4">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
          />
        </div>

        <div className="mb-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              if (isAtLimit) {
                setShowLimitModal(true);
              } else {
                setShowForm(true);
              }
            }}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Adicionar Livro
          </Button>
        </div>

        {filteredBooks.length === 0 ? (
          <Alert variant="info" className="text-center py-5">
            <i className="bi bi-book display-1 d-block mb-3"></i>
            <Alert.Heading>
              {books.length === 0 ? 'Sua estante está vazia!' : 'Nenhum livro encontrado'}
            </Alert.Heading>
            <p>
              {books.length === 0
                ? 'Comece adicionando seu primeiro livro à estante.'
                : 'Tente mudar os filtros de busca.'}
            </p>
            {books.length === 0 && (
              <Button variant="primary" onClick={() => setShowForm(true)}>
                <i className="bi bi-plus-circle me-2"></i>
                Adicionar Primeiro Livro
              </Button>
            )}
          </Alert>
        ) : (
          <Row xs={1} md={2} lg={3} xl={4} className="g-4">
            {filteredBooks.map(book => (
              <Col key={book.id}>
                <BookCard
                  book={book}
                  onRate={(rating) => handleRateBook(book.id, rating)}
                  onRemove={() => handleRemoveBook(book.id)}
                  onStatusChange={() => handleStatusChange(book.id)}
                />
              </Col>
            ))}
          </Row>
        )}

        <BookForm
          show={showForm}
          onClose={() => setShowForm(false)}
          onAdd={handleAddBook}
        />
      </Container>

      {/* Modal de Limite Atingido */}
      <Modal show={showLimitModal} onHide={() => setShowLimitModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-exclamation-triangle text-warning me-2"></i>
            Limite Atingido
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Você atingiu o limite de <strong>{FREE_PLAN_LIMIT} livros</strong> do plano gratuito.</p>
          <p>Faça upgrade para o plano Premium e tenha:</p>
          <ul>
            <li>✅ Livros ilimitados</li>
            <li>✅ Estatísticas avançadas</li>
            <li>✅ Exportação de dados</li>
            <li>✅ Recomendações personalizadas</li>
            <li>✅ Suporte prioritário</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLimitModal(false)}>
            Fechar
          </Button>
          <Button variant="success">
            <i className="bi bi-star me-2"></i>
            Upgrade para Premium
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Meta de Leitura */}
      <Modal show={showGoalModal} onHide={() => setShowGoalModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-target me-2"></i>
            Meta de Leitura Anual
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Quantos livros você deseja ler em {new Date().getFullYear()}?</p>
          <div className="d-flex gap-2 flex-wrap">
            {[12, 24, 36, 50, 100].map(goal => (
              <Button
                key={goal}
                variant={readingGoal === goal ? 'primary' : 'outline-primary'}
                onClick={() => handleSetGoal(goal)}
              >
                {goal}
              </Button>
            ))}
          </div>
          <hr />
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleSetGoal(0)}
          >
            <i className="bi bi-x-circle me-1"></i>
            Remover Meta
          </Button>
        </Modal.Body>
      </Modal>

      <footer className="text-center py-4 text-muted border-top mt-5">
        <i className="bi bi-book-heart me-2"></i>
        <span>BookTracker SaaS — {user.name} ({user.plan})</span>
      </footer>
    </div>
  );
}

export default App;
