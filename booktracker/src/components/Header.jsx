// ============================================================================
// components/Header.jsx - Componente de Cabeçalho Atualizado para SaaS
// ============================================================================
// Agora exibe informações do usuário e botão de logout.
// ============================================================================

import { Container, Navbar, Nav, Badge, Dropdown } from 'react-bootstrap'

function Header({ stats, user, onLogout }) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="#dashboard" className="d-flex align-items-center gap-2">
          <i className="bi bi-book-heart fs-3"></i>
          <span className="fw-bold">BookTracker</span>
          <Badge bg="primary" pill>
            {stats.totalBooks} {stats.totalBooks === 1 ? 'livro' : 'livros'}
          </Badge>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            <Nav.Link href="#lendo">
              <i className="bi bi-bookmark"></i> Lendo
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

            {/* Dropdown do Usuário */}
            {user && (
              <Dropdown align="end">
                <Dropdown.Toggle variant="link" id="dropdown-user" className="nav-link text-light">
                  <i className="bi bi-person-circle me-1"></i>
                  {user.name}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.ItemText>
                    <small className="text-muted">{user.email}</small>
                    <br />
                    <Badge bg={user.plan === 'free' ? 'secondary' : 'success'}>
                      {user.plan === 'free' ? 'Gratuito' : 'Premium'}
                    </Badge>
                  </Dropdown.ItemText>
                  
                  <Dropdown.Divider />
                  
                  <Dropdown.Item href="#perfil">
                    <i className="bi bi-person me-2"></i>
                    Meu Perfil
                  </Dropdown.Item>
                  
                  <Dropdown.Item href="#configuracoes">
                    <i className="bi bi-gear me-2"></i>
                    Configurações
                  </Dropdown.Item>
                  
                  {user.plan === 'free' && (
                    <Dropdown.Item href="#upgrade">
                      <i className="bi bi-star text-warning me-2"></i>
                      <strong>Upgrade para Premium</strong>
                    </Dropdown.Item>
                  )}
                  
                  <Dropdown.Divider />
                  
                  <Dropdown.Item onClick={onLogout} className="text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Sair
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
