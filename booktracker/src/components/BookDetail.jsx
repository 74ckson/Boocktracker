// ============================================================================
// components/BookDetail.jsx - Detalhes Completos de um Livro
// ============================================================================
// Exibe todas as informações de um livro em formato detalhado.
// ============================================================================

import { Card, Badge, Button, Row, Col } from 'react-bootstrap'
import StarRating from './StarRating'

const statusConfig = {
  'lendo': {
    bg: 'warning',
    text: 'dark',
    label: 'Lendo',
    icon: 'bi-bookmark'
  },
  'lido': {
    bg: 'success',
    text: 'white',
    label: 'Lido',
    icon: 'bi-check-circle'
  },
  'quero-ler': {
    bg: 'info',
    text: 'dark',
    label: 'Quero Ler',
    icon: 'bi-heart'
  }
}

function BookDetail({ book, onRate, onStatusChange, onBack, onEdit, onDelete }) {
  if (!book) return null

  const { title, author, cover, status, rating, description, added_at, completed_at, updated_at } = book
  const config = statusConfig[status] || statusConfig['quero-ler']

  const formatDate = (dateString) => {
    if (!dateString) return 'Não disponível'
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="book-detail-container">
      {/* Botão Voltar */}
      <Button
        variant="outline-secondary"
        className="mb-4"
        onClick={onBack}
      >
        <i className="bi bi-arrow-left me-2"></i>
        Voltar para Estante
      </Button>

      <Card className="shadow-lg">
        <Card.Body className="p-4">
          <Row>
            {/* Coluna da Capa */}
            <Col md={4} className="text-center mb-4 mb-md-0">
              <img
                src={cover}
                alt={`Capa do livro: ${title}`}
                className="img-fluid rounded shadow"
                style={{ maxHeight: '450px', objectFit: 'cover' }}
              />
            </Col>

            {/* Coluna de Informações */}
            <Col md={8}>
              {/* Título */}
              <h1 className="mb-2">{title}</h1>

              {/* Autor */}
              <h5 className="text-muted mb-3">
                <i className="bi bi-pencil me-2"></i>
                por {author}
              </h5>

              {/* Status e Avaliação */}
              <div className="mb-4">
                <Badge
                  bg={config.bg}
                  text={config.text}
                  pill
                  className="me-2 mb-2"
                  style={{ fontSize: '1rem', padding: '0.5em 1em' }}
                >
                  <i className={`bi ${config.icon} me-1`}></i>
                  {config.label}
                </Badge>

                <div className="d-inline-block mb-2">
                  <StarRating rating={rating} onRate={onRate} size="lg" />
                </div>
              </div>

              {/* Descrição */}
              <Card className="mb-4 bg-light border-0">
                <Card.Body>
                  <h6 className="fw-bold mb-2">
                    <i className="bi bi-text-paragraph me-2"></i>
                    Descrição
                  </h6>
                  <p className="mb-0">{description}</p>
                </Card.Body>
              </Card>

              {/* Datas */}
              <Card className="mb-4">
                <Card.Body>
                  <Row>
                    <Col sm={6} className="mb-2 mb-sm-0">
                      <small className="text-muted d-block">
                        <i className="bi bi-calendar-plus me-1"></i>
                        Adicionado em
                      </small>
                      <strong>{formatDate(added_at)}</strong>
                    </Col>
                    {completed_at && (
                      <Col sm={6}>
                        <small className="text-muted d-block">
                          <i className="bi bi-calendar-check me-1"></i>
                          Concluído em
                        </small>
                        <strong>{formatDate(completed_at)}</strong>
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>

              {/* Botões de Ação */}
              <div className="d-flex gap-2 flex-wrap">
                <Button
                  variant="outline-primary"
                  onClick={onStatusChange}
                >
                  <i className="bi bi-arrow-repeat me-1"></i>
                  Mudar Status
                </Button>
                {onEdit && (
                  <Button variant="outline-secondary" onClick={onEdit}>
                    <i className="bi bi-pencil me-1"></i>
                    Editar
                  </Button>
                )}
                <Button
                  variant="outline-danger"
                  onClick={onDelete}
                >
                  <i className="bi bi-trash me-1"></i>
                  Remover
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  )
}

export default BookDetail
