// ============================================================================
// pages/BookDetailPage.jsx - Página de Detalhes do Livro
// ============================================================================
// Página que exibe os detalhes completos de um livro específico.
// ============================================================================

import { useState, useEffect } from 'react'
import { Container, Spinner, Alert, Button } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import BookDetail from '../components/BookDetail'
import BookEditForm from '../components/BookEditForm'
import * as api from '../services/api'

function BookDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    loadBook()
  }, [id])

  const loadBook = async () => {
    try {
      setLoading(true)
      const bookData = await api.getBook(id)
      setBook(bookData)
    } catch (err) {
      console.error('Erro ao carregar livro:', err)
      setError('Erro ao carregar os dados do livro.')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/dashboard')
  }

  const handleRate = async (newRating) => {
    try {
      const updatedBook = await api.updateBook(id, { rating: newRating })
      setBook(updatedBook)
    } catch (err) {
      console.error('Erro ao avaliar livro:', err)
      alert('Erro ao avaliar livro. Tente novamente.')
    }
  }

  const handleStatusChange = async () => {
    const statusCycle = {
      'quero-ler': 'lendo',
      'lendo': 'lido',
      'lido': 'quero-ler',
    }

    try {
      const newStatus = statusCycle[book.status]
      const updates = {
        status: newStatus,
      }

      if (newStatus === 'lido' && book.status !== 'lido') {
        updates.completed_at = new Date().toISOString()
      }

      const updatedBook = await api.updateBook(id, updates)
      setBook(updatedBook)
    } catch (err) {
      console.error('Erro ao mudar status:', err)
      alert('Erro ao mudar status. Tente novamente.')
    }
  }

  const handleEdit = () => {
    setShowEditModal(true)
  }

  const handleSaveEdit = async (bookId, formData) => {
    try {
      console.log('📝 Salvando edições do livro...')
      const updatedBook = await api.updateBook(bookId, formData)
      setBook(updatedBook)
      setShowEditModal(false)
    } catch (err) {
      console.error('Erro ao editar livro:', err)
      alert('Erro ao editar livro. Tente novamente.')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja remover este livro?')) {
      try {
        await api.deleteBook(id)
        navigate('/dashboard')
      } catch (err) {
        console.error('Erro ao remover livro:', err)
        alert('Erro ao remover livro. Tente novamente.')
      }
    }
  }

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Carregando detalhes do livro...</p>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
          <Button variant="outline-danger" size="sm" className="ms-3" onClick={loadBook}>
            Tentar Novamente
          </Button>
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <BookDetail
        book={book}
        onRate={handleRate}
        onStatusChange={handleStatusChange}
        onBack={handleBack}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal de Edição */}
      <BookEditForm
        show={showEditModal}
        book={book}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
      />
    </Container>
  )
}

export default BookDetailPage
