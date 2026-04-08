// ============================================================================
// App.jsx - Componente Principal da Aplicação
// ============================================================================
// Este é o componente raiz da aplicação React. Ele é responsável por:
// 1. Gerenciar o estado global dos livros (lista completa)
// 2. Calcular estatísticas de leitura
// 3. Coordenar a comunicação entre todos os componentes filhos
// 4. Exibir a estrutura principal da página
//
// No React, é comum que o componente pai gerencie o estado e passe
// funções para os filhos manipularem esse estado. Isso se chama
// "lifting state up" (elevar o estado).
// ============================================================================

import { useState, useMemo } from 'react'
import { Container, Button, Row, Col, Alert } from 'react-bootstrap'

// ============================================================================
// IMPORTAÇÃO DE COMPONENTES FILHOS
// ============================================================================
// Importamos todos os componentes que vamos usar neste arquivo.
// Cada um cuida de uma parte específica da interface.
// ============================================================================
import Header from './components/Header'
import BookCard from './components/BookCard'
import BookForm from './components/BookForm'
import StatsCard from './components/StatsCard'
import SearchBar from './components/SearchBar'

// Importamos os dados iniciais de exemplo
import { initialBooks } from './data/books'

/**
 * Componente Principal: App
 * 
 * Este componente gerencia toda a lógica do aplicativo de livros.
 * Em um projeto maior, essa lógica seria dividida em mais arquivos.
 */
function App() {
  
  // ========================================================================
  // ESTADOS GLOBAIS DO APP
  // ========================================================================
  // useState é um "hook" do React que permite gerenciar estado.
  // Quando chamamos a função de atualização (ex: setBooks), o React
  // re-renderiza o componente automaticamente com os novos valores.
  // ========================================================================

  /**
   * books: Array com todos os livros da estante.
   * Usamos initialBooks como valor inicial (dados de exemplo).
   * 
   * Em um app real, poderíamos carregar do localStorage ou de uma API.
   */
  const [books, setBooks] = useState(initialBooks)

  /**
   * showForm: Controla se o formulário modal está visível.
   * true = modal aberto, false = modal fechado
   */
  const [showForm, setShowForm] = useState(false)

  /**
   * searchTerm: Texto digitado na barra de busca.
   * Usado para filtrar livros por título ou autor.
   * String vazia = sem filtro de busca.
   */
  const [searchTerm, setSearchTerm] = useState('')

  /**
   * filterStatus: Status selecionado no filtro.
   * 'todos' = sem filtro, 'lendo'/'lido'/'quero-ler' = filtra por status
   */
  const [filterStatus, setFilterStatus] = useState('todos')

  // ========================================================================
  // CÁLCULO DE ESTATÍSTICAS
  // ========================================================================
  // useMemo é um hook que "memoriza" um valor calculado, evitando
  // recálculos desnecessários. Só recalcula quando `books` muda.
  //
  // Isso é importante para performance quando os cálculos são caros.
  // ========================================================================
  const stats = useMemo(() => {
    // Filtramos livros por status usando .filter()
    // .filter() cria um novo array apenas com os itens que passam na condição
    const booksReading = books.filter(book => book.status === 'lendo').length
    const booksRead = books.filter(book => book.status === 'lido').length
    const booksWantToRead = books.filter(book => book.status === 'quero-ler').length

    // Calculamos a média de avaliações
    // .filter(r => r > 0) exclui livros sem avaliação (rating = 0)
    const ratedBooks = books.filter(b => b.rating > 0)
    const totalRating = ratedBooks.reduce((sum, b) => sum + b.rating, 0)
    const averageRating = ratedBooks.length > 0 
      ? totalRating / ratedBooks.length 
      : 0

    // Retornamos um objeto com todas as estatísticas
    return {
      totalBooks: books.length,
      booksReading,
      booksRead,
      booksWantToRead,
      averageRating,
    }
  }, [books]) // <-- [books] é a "dependência": recalcula quando `books` muda

  // ========================================================================
  // FILTRAGEM DE LIVROS
  // ========================================================================
  // Aqui aplicamos dois filtros simultaneamente:
  // 1. Filtro por status (lendo, lido, quero-ler)
  // 2. Filtro por texto (busca por título ou autor)
  //
  // Os filtros são combinados: um livro precisa passar por ambos para aparecer.
  // ========================================================================
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      // ==================================================================
      // FILTRO POR STATUS
      // ==================================================================
      // Se filterStatus for 'todos', qualquer status passa (retorna true).
      // Caso contrário, apenas livros com o status selecionado passam.
      // ==================================================================
      const matchesStatus = filterStatus === 'todos' || book.status === filterStatus

      // ==================================================================
      // FILTRO POR TEXTO (BUSCA)
      // ==================================================================
      // .toLowerCase() torna a busca case-insensitive (ignora maiúsculas).
      // .includes() verifica se o texto está contido na string.
      // Buscamos tanto no título quanto no autor.
      // ==================================================================
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = 
        !searchTerm || // Se searchTerm é vazio, qualquer livro passa
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower)

      // O livro precisa passar em AMBOS os filtros para ser exibido
      return matchesStatus && matchesSearch
    })
  }, [books, searchTerm, filterStatus]) // Recalcula quando qualquer dependência muda

  // ========================================================================
  // FUNÇÕES DE MANIPULAÇÃO (HANDLERS)
  // ========================================================================
  // Estas funções modificam o estado `books`. Quando o estado muda,
  // o React re-renderiza automaticamente todos os componentes afetados.
  //
  // IMPORTANTE: Nunca mutamos o estado diretamente (ex: books.push()).
  // Sempre criamos um novo array/objeto e usamos setBooks(novoValor).
  // Isso permite que o React detecte mudanças corretamente.
  // ========================================================================

  /**
   * Adiciona um novo livro à estante.
   * 
   * @param {Object} newBook - Objeto com os dados do novo livro
   * 
   * Usamos spread operator (...) para criar um novo array contendo
   * todos os livros existentes + o novo livro.
   * 
   * Geramos um ID único usando Date.now() (timestamp em milissegundos).
   * Em produção, usaríamos UUID ou ID do banco de dados.
   */
  const handleAddBook = (newBook) => {
    const bookWithId = {
      ...newBook,            // Copia todas as propriedades do newBook
      id: Date.now(),        // Adiciona um ID único
    }
    // Criamos um novo array com todos os livros + o novo
    setBooks([...books, bookWithId])
  }

  /**
   * Remove um livro da estante pelo seu ID.
   * 
   * @param {number} bookId - ID do livro a ser removido
   * 
   * .filter() cria um novo array EXCLUINDO o livro com o ID fornecido.
   * A condição book.id !== bookId retorna true para todos os livros
   * que NÃO são o que queremos remover.
   */
  const handleRemoveBook = (bookId) => {
    setBooks(books.filter(book => book.id !== bookId))
  }

  /**
   * Atualiza a avaliação (rating) de um livro.
   * 
   * @param {number} bookId - ID do livro a ser avaliado
   * @param {number} newRating - Nova avaliação (1-5)
   * 
   * .map() itera sobre todos os livros e retorna um novo array:
   * - Se o livro tem o ID correspondente, retornamos uma cópia com novo rating
   * - Caso contrário, retornamos o livro original (inalterado)
   */
  const handleRateBook = (bookId, newRating) => {
    setBooks(books.map(book => 
      book.id === bookId 
        ? { ...book, rating: newRating }  // Cria cópia com novo rating
        : book                             // Mantém o livro original
    ))
  }

  /**
   * Alterna o status de um livro em ciclo:
   * quero-ler → lendo → lido → quero-ler
   * 
   * @param {number} bookId - ID do livro cujo status será alterado
   * 
   * Este é um padrão comum para atualizar um item específico em um array.
   */
  const handleStatusChange = (bookId) => {
    // Mapa de transição de status
    const statusCycle = {
      'quero-ler': 'lendo',
      'lendo': 'lido',
      'lido': 'quero-ler',
    }

    setBooks(books.map(book =>
      book.id === bookId
        ? { ...book, status: statusCycle[book.status] }
        : book
    ))
  }

  // ========================================================================
  // RENDERIZAÇÃO DA INTERFACE
  // ========================================================================
  // O return do componente define o que será exibido na tela.
  // Usamos JSX (JavaScript XML), que permite escrever HTML dentro do JS.
  // ========================================================================
  return (
    // Container principal: envolve todo o conteúdo da página
    <div className="app-wrapper">
      
      {/* ================================================================== */}
      {/* CABEÇALHO                                                           */}
      {/* ================================================================== */}
      {/* Passamos as estatísticas calculadas como prop para o Header.       */}
      {/* O Header exibe os contadores de livros por status.                 */}
      {/* ================================================================== */}
      <Header stats={stats} />

      {/* ================================================================== */}
      {/* CONTEÚDO PRINCIPAL                                                 */}
      {/* ================================================================== */}
      <Container className="py-4">
        
        {/* ================================================================== */}
        {/* SEÇÃO DE ESTATÍSTICAS                                              */}
        {/* ================================================================== */}
        {/* StatsCard recebe as estatísticas e exibe cards visuais.            */}
        {/* ================================================================== */}
        <StatsCard stats={stats} />

        {/* ================================================================== */}
        {/* BARRA DE BUSCA E FILTROS                                           */}
        {/* ================================================================== */}
        {/* searchTerm e filterStatus vêm do estado do App.                    */}
        {/* Quando mudam, os livros exibidos são filtrados automaticamente.    */}
        {/* ================================================================== */}
        <div className="mt-4">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
          />
        </div>

        {/* ================================================================== */}
        {/* BOTÃO PARA ADICIONAR NOVO LIVRO                                    */}
        {/* ================================================================== */}
        {/* onClick={...} define o que acontece quando o botão é clicado.      */}
        {/* setShowForm(true) abre o modal do formulário.                      */}
        {/* ================================================================== */}
        <div className="mb-4">
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => setShowForm(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Adicionar Livro
          </Button>
        </div>

        {/* ================================================================== */}
        {/* GRADE DE LIVROS                                                    */}
        {/* ================================================================== */}
        {/* Se não há livros após filtragem, mostramos um alerta informativo.  */}
        {/* Caso contrário, mapeamos cada livro em um componente BookCard.     */}
        {/* ================================================================== */}
        {filteredBooks.length === 0 ? (
          // Renderização condicional: exibido quando não há livros
          <Alert variant="info" className="text-center py-5">
            <i className="bi bi-book display-1 d-block mb-3"></i>
            <Alert.Heading>
              {books.length === 0 
                ? 'Sua estante está vazia!' 
                : 'Nenhum livro encontrado'}
            </Alert.Heading>
            <p>
              {books.length === 0
                ? 'Comece adicionando seu primeiro livro à estante.'
                : 'Tente mudar os filtros de busca.'}
            </p>
            {books.length === 0 && (
              <Button 
                variant="primary" 
                onClick={() => setShowForm(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Adicionar Primeiro Livro
              </Button>
            )}
          </Alert>
        ) : (
          // Grid responsivo de livros:
          // - 1 coluna em telas pequenas (sm)
          // - 2 colunas em telas médias (md)
          // - 3 colunas em telas grandes (lg)
          // - 4 colunas em telas extra grandes (xl)
          <Row xs={1} md={2} lg={3} xl={4} className="g-4">
            {
              // .map() cria um componente BookCard para cada livro filtrado.
              // A prop `key` é obrigatória e deve ser única (usamos book.id).
              // Cada BookCard recebe funções para interagir com o livro.
              filteredBooks.map(book => (
                <Col key={book.id}>
                  <BookCard
                    book={book}
                    // onRate: quando o usuário avalia o livro
                    onRate={(rating) => handleRateBook(book.id, rating)}
                    // onRemove: quando o usuário remove o livro
                    onRemove={() => handleRemoveBook(book.id)}
                    // onStatusChange: quando o usuário muda o status
                    onStatusChange={() => handleStatusChange(book.id)}
                  />
                </Col>
              ))
            }
          </Row>
        )}

        {/* ================================================================== */}
        {/* MODAL DO FORMULÁRIO DE ADICIONAR LIVRO                             */}
        {/* ================================================================== */}
        {/* O modal fica aqui, mas só é exibido quando showForm é true.        */}
        {/* ================================================================== */}
        <BookForm
          show={showForm}
          onClose={() => setShowForm(false)}
          onAdd={handleAddBook}
        />
      </Container>

      {/* ================================================================== */}
      {/* RODAPÉ                                                               */}
      {/* ================================================================== */}
      <footer className="text-center py-4 text-muted border-top mt-5">
        <i className="bi bi-book-heart me-2"></i>
        <span>BookTracker — Feito com React e Bootstrap</span>
      </footer>
    </div>
  )
}

// Exportamos o componente principal para que o main.jsx possa importá-lo
export default App
