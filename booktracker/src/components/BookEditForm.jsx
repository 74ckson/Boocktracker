// ============================================================================
// components/BookEditForm.jsx - Formulário para Editar Livro
// ============================================================================
// Modal para editar as informações de um livro existente.
// ============================================================================

import { useState, useRef, useEffect } from 'react'
import { Modal, Button, Form, Alert } from 'react-bootstrap'

function BookEditForm({ show, book, onClose, onSave }) {
  // Estados do formulário
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('quero-ler')
  const [coverImage, setCoverImage] = useState(null)
  const [coverPreview, setCoverPreview] = useState('')
  const [error, setError] = useState('')

  // Ref para o input de arquivo
  const fileInputRef = useRef(null)

  // Carregar dados do livro quando o modal abrir
  useEffect(() => {
    if (book && show) {
      setTitle(book.title || '')
      setAuthor(book.author || '')
      setDescription(book.description || '')
      setStatus(book.status || 'quero-ler')
      setCoverPreview(book.cover || '')
      setCoverImage(null)
      setError('')
    }
  }, [book, show])

  /**
   * Função chamada quando o usuário seleciona uma imagem.
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    
    if (file) {
      // Validar tipo de arquivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!validTypes.includes(file.type)) {
        setError('Apenas imagens JPG e PNG são permitidas!')
        setCoverImage(null)
        setCoverPreview(book?.cover || '')
        e.target.value = ''
        return
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB!')
        setCoverImage(null)
        setCoverPreview(book?.cover || '')
        e.target.value = ''
        return
      }

      setCoverImage(file)
      setError('')

      // Criar preview da imagem
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  /**
   * Função para remover a imagem selecionada
   */
  const handleRemoveImage = () => {
    setCoverImage(null)
    setCoverPreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  /**
   * Função chamada quando o usuário submete o formulário.
   */
  const handleSubmit = (e) => {
    e.preventDefault()

    // Validação básica
    if (!title.trim() || !author.trim()) {
      setError('Por favor, preencha o título e o autor do livro.')
      return
    }

    // Criar objeto FormData para enviar dados + arquivo
    const formData = new FormData()
    formData.append('title', title.trim())
    formData.append('author', author.trim())
    formData.append('description', description.trim() || book?.description || '')
    formData.append('status', status)
    formData.append('rating', book?.rating || 0)
    
    // Adicionar imagem se houver
    if (coverImage) {
      formData.append('coverImage', coverImage)
    }

    // Chamar função onSave passada pelo componente pai
    onSave(book.id, formData)

    // Fechar o modal
    onClose()
  }

  /**
   * Função chamada quando o modal é fechado.
   */
  const handleClose = () => {
    setTitle('')
    setAuthor('')
    setDescription('')
    setStatus('quero-ler')
    setCoverImage(null)
    setCoverPreview('')
    setError('')
    onClose()
  }

  if (!book) return null

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-pencil-square me-2"></i>
          Editar Livro
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert variant="danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Campo: Título */}
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-book me-1"></i>
              Título *
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ex: Dom Casmurro"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={!!error && !title.trim()}
            />
          </Form.Group>

          {/* Campo: Autor */}
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-pencil me-1"></i>
              Autor *
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ex: Machado de Assis"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              isInvalid={!!error && !author.trim()}
            />
          </Form.Group>

          {/* Campo: Descrição */}
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-text-paragraph me-1"></i>
              Descrição
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Breve descrição do livro..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          {/* Campo: Upload de Imagem da Capa */}
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-image me-1"></i>
              Capa do Livro (JPG/PNG)
            </Form.Label>
            <Form.Control
              type="file"
              accept=".jpg,.jpeg,.png"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <Form.Text className="text-muted">
              Apenas imagens JPG e PNG. Tamanho máximo: 5MB.
            </Form.Text>

            {/* Preview da imagem */}
            {coverPreview && (
              <div className="mt-3 text-center">
                <img
                  src={coverPreview}
                  alt="Preview da capa"
                  style={{
                    maxHeight: '250px',
                    maxWidth: '100%',
                    borderRadius: '8px',
                    objectFit: 'contain'
                  }}
                />
                <div className="mt-2">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleRemoveImage}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Remover Imagem
                  </Button>
                </div>
              </div>
            )}
          </Form.Group>

          {/* Campo: Status */}
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-tag me-1"></i>
              Status
            </Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="quero-ler">📚 Quero Ler</option>
              <option value="lendo">📖 Lendo</option>
              <option value="lido">✅ Lido</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <i className="bi bi-x-lg me-1"></i>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          <i className="bi bi-check-lg me-1"></i>
          Salvar Alterações
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default BookEditForm
