// ============================================================================
// components/BookForm.jsx - Formulário para Adicionar Novo Livro
// ============================================================================
// Este componente exibe um formulário modal (pop-up) onde o usuário pode
// adicionar um novo livro à estante.
//
// Conceitos importantes:
// - Formulários controlados no React (controlled components)
// - Modal do Bootstrap
// - Validação básica de formulário
// - Gerenciamento de estado múltiplo
// ============================================================================

import { useState } from 'react'
import { Modal, Button, Form, Alert } from 'react-bootstrap'

/**
 * Componente BookForm
 * 
 * @param {Object} props - Props do componente
 * @param {boolean} props.show - Se o modal deve ser exibido ou não
 * @param {Function} props.onClose - Função para fechar o modal
 * @param {Function} props.onAdd - Função para adicionar o livro.
 *                                 Recebe um objeto com os dados do livro.
 * 
 * Controlled Components:
 * No React, quando um campo de input tem seu valor controlado pelo estado,
 * chamamos de "controlled component". Cada tecla digitada atualiza o estado,
 * e o estado controla o que é exibido no input.
 */
function BookForm({ show, onClose, onAdd }) {
  
  // ========================================================================
  // ESTADOS DO FORMULÁRIO
  // ========================================================================
  // Cada campo do formulário tem seu próprio estado com useState.
  // Isso nos permite:
  // 1. Acessar os valores quando o usuário submete
  // 2. Limpar os campos após o submit
  // 3. Validar os dados antes de enviar
  // ========================================================================
  
  // Campo: título do livro
  const [title, setTitle] = useState('')
  
  // Campo: autor do livro
  const [author, setAuthor] = useState('')
  
  // Campo: descrição/sinopse
  const [description, setDescription] = useState('')
  
  // Campo: status inicial (começa com "quero-ler" por padrão)
  const [status, setStatus] = useState('quero-ler')
  
  // Estado para mensagem de erro (quando campos obrigatórios não são preenchidos)
  const [error, setError] = useState('')

  /**
   * Função chamada quando o usuário submete o formulário.
   * 
   * @param {Event} e - Evento de submit do formulário
   */
  const handleSubmit = (e) => {
    // preventDefault() evita que o formulário faça um submit tradicional
    // (que recarregaria a página). No React, lidamos com tudo via JavaScript.
    e.preventDefault()

    // ====================================================================
    // VALIDAÇÃO BÁSICA
    // ====================================================================
    // Verificamos se os campos obrigatórios foram preenchidos.
    // .trim() remove espaços em branco no início e fim da string.
    // Um campo só com espaços é considerado vazio.
    // ====================================================================
    if (!title.trim() || !author.trim()) {
      setError('Por favor, preencha o título e o autor do livro.')
      return // Interrompe a execução se houver erro
    }

    // Se não há erro, criamos o objeto do novo livro
    const newBook = {
      title: title.trim(),
      author: author.trim(),
      description: description.trim() || 'Sem descrição.',
      status,
      // Novos livros começam sem avaliação (0)
      rating: 0,
      // Geramos uma URL de placeholder com o título do livro
      cover: `https://placehold.co/300x450/6366f1/ffffff?text=${encodeURIComponent(title.trim())}`,
    }

    // Chamamos a função onAdd passada pelo componente pai,
    // passando os dados do novo livro
    onAdd(newBook)

    // Limpamos todos os campos do formulário para o próximo uso
    setTitle('')
    setAuthor('')
    setDescription('')
    setStatus('quero-ler')
    setError('')

    // Fechamos o modal após adicionar o livro
    onClose()
  }

  /**
   * Função chamada quando o modal é fechado.
   * Limpa os campos e erros para garantir que o formulário esteja limpo
   * na próxima abertura.
   */
  const handleClose = () => {
    setTitle('')
    setAuthor('')
    setDescription('')
    setStatus('quero-ler')
    setError('')
    onClose()
  }

  return (
    // ====================================================================
    // MODAL DO BOOTSTRAP
    // ====================================================================
    // Modal é um componente que aparece sobreposto ao conteúdo principal.
    // É ideal para formulários que não precisam estar sempre visíveis.
    // ====================================================================
    <Modal show={show} onHide={handleClose} centered>
      {/* Cabeçalho do modal */}
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-plus-circle me-2"></i>
          Adicionar Novo Livro
        </Modal.Title>
      </Modal.Header>

      {/* Corpo do modal: contém o formulário */}
      <Modal.Body>
        {/* 
          Alerta de erro: só é exibido quando há uma mensagem de erro.
          Renderização condicional: se `error` for falsy (string vazia),
          nada é renderizado na tela.
        */}
        {error && (
          <Alert variant="danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        {/* 
          Formulário controlado pelo React.
          onSubmit é o evento disparado quando o usuário pressiona Enter
          ou clica no botão de submit.
        */}
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
              // onChange é chamado toda vez que o usuário digita.
              // e.target.value contém o texto atual do input.
              onChange={(e) => setTitle(e.target.value)}
              // isInvalid mostra borda vermelha se há erro
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
            {/* as="textarea" transforma o input em uma área de texto */}
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Breve descrição do livro..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          {/* Campo: Status Inicial */}
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-tag me-1"></i>
              Status
            </Form.Label>
            {/* Select: dropdown para escolher o status */}
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

      {/* Rodapé do modal: botões de ação */}
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <i className="bi bi-x-lg me-1"></i>
          Cancelar
        </Button>
        {/* 
          Botão de submit: dispara o handleSubmit do formulário.
          type="submit" é importante para que o Enter também funcione.
        */}
        <Button variant="primary" onClick={handleSubmit}>
          <i className="bi bi-check-lg me-1"></i>
          Adicionar Livro
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

// Exportamos o componente
export default BookForm
