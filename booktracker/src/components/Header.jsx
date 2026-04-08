// ============================================================================
// components/Header.jsx - Componente de Cabeçalho
// ============================================================================
// Este componente exibe o cabeçalho fixo no topo da aplicação com:
// - Logo/nome do app
// - Ícone decorativo
// - Navegação com contadores de livros
//
// O Header é um componente "apresentacional", ou seja, ele apenas recebe
// dados via props e exibe na tela, sem gerenciar estado próprio.
// ============================================================================

import { Container, Navbar, Nav, Badge } from 'react-bootstrap'

/**
 * Componente Header
 * 
 * @param {Object} props - Props do componente
 * @param {Object} props.stats - Objeto com estatísticas dos livros
 * @param {number} props.stats.totalBooks - Total de livros
 * @param {number} props.stats.booksReading - Livros sendo lidos
 * @param {number} props.stats.booksRead - Livros já lidos
 * @param {number} props.stats.booksWantToRead - Livros na lista de desejos
 * 
 * Props são como "parâmetros" que um componente pai passa para um componente filho.
 * É a forma de comunicação entre componentes no React.
 */
function Header({ stats }) {
  return (
    // Navbar do Bootstrap: barra de navegação responsiva
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        {/* Brand: logo/nome do aplicativo */}
        <Navbar.Brand href="#" className="d-flex align-items-center gap-2">
          {/* bi-book é um ícone do Bootstrap Icons */}
          <i className="bi bi-book fs-3"></i>
          <span className="fw-bold">BookTracker</span>
          {/* Badge mostra o total de livros de forma destacada */}
          <Badge bg="primary" pill>
            {stats.totalBooks} {stats.totalBooks === 1 ? 'livro' : 'livros'}
          </Badge>
        </Navbar.Brand>

        {/* Botão hamburger para mobile */}
        <Navbar.Toggle aria-controls="main-navbar" />
        
        {/* Conteúdo colapsável da navbar */}
        <Navbar.Collapse id="main-navbar">
          {/* Nav.Link são links de navegação estilizados pelo Bootstrap */}
          <Nav className="ms-auto">
            {/* ms-auto = margin-start: auto, empurra os itens para a direita */}
            
            <Nav.Link href="#lendo">
              <i className="bi bi-bookmark"></i> Lendo
              {/* Badge amarelo mostra quantos livros estão sendo lidos */}
              <Badge bg="warning" text="dark" pill className="ms-1">
                {stats.booksReading}
              </Badge>
            </Nav.Link>

            <Nav.Link href="#lidos">
              <i className="bi bi-check-circle"></i> Lidos
              <Badge bg="success" pill className="ms-1">
                {stats.booksRead}
              </Badge>
            </Nav.Link>

            <Nav.Link href="#quero-ler">
              <i className="bi bi-heart"></i> Quero Ler
              <Badge bg="info" pill className="ms-1">
                {stats.booksWantToRead}
              </Badge>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

// Exportamos o componente para que outros arquivos possam importá-lo
export default Header
