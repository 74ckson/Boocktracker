// ============================================================================
// components/BookCard.jsx - Componente de Cartão de Livro
// ============================================================================
// Este componente exibe um único livro em formato de cartão visual, contendo:
// - Imagem da capa
// - Título e autor
// - Status de leitura (badge colorido)
// - Avaliação em estrelas (clicável)
// - Descrição
// - Botão para remover
//
// Este é um dos componentes mais importantes do app, pois é onde o usuário
// interage diretamente com seus livros.
// ============================================================================

import { Card, Badge, Button } from 'react-bootstrap'
import StarRating from './StarRating'

/**
 * Mapeamento de status para configurações visuais
 * 
 * Usamos um objeto para mapear cada status a suas cores e textos.
 * Isso evita múltiplos if/else e torna o código mais limpo e fácil de manter.
 * 
 * Se precisarmos adicionar um novo status no futuro, basta adicionar
 * uma nova entrada neste objeto.
 */
const statusConfig = {
  'lendo': { 
    bg: 'warning',      // Fundo amarelo (atenção: está lendo)
    text: 'dark',       // Texto escuro para contraste
    label: 'Lendo',
    icon: 'bi-bookmark' // Ícone de marcador
  },
  'lido': { 
    bg: 'success',      // Fundo verde (sucesso: concluído!)
    text: 'white',      // Texto branco para contraste
    label: 'Lido',
    icon: 'bi-check-circle' // Ícone de concluído
  },
  'quero-ler': { 
    bg: 'info',         // Fundo azul claro (informação: planeja ler)
    text: 'dark',
    label: 'Quero Ler',
    icon: 'bi-heart'    // Ícone de coração (desejo)
  }
}

/**
 * Componente BookCard
 * 
 * @param {Object} props - Props do componente
 * @param {Object} props.book - Objeto com os dados do livro
 * @param {Function} props.onRate - Função chamada quando o usuário avalia o livro
 * @param {Function} props.onRemove - Função chamada quando o usuário remove o livro
 * @param {Function} props.onStatusChange - Função chamada quando o status muda
 */
function BookCard({ book, onRate, onRemove, onStatusChange }) {
  
  // Desestruturação: extraindo propriedades do objeto book
  // Isso é mais limpo do que ficar usando book.title, book.author, etc.
  const { title, author, cover, status, rating, description } = book

  // Buscamos a configuração visual do status atual
  const config = statusConfig[status] || statusConfig['quero-ler']

  return (
    // Card do Bootstrap: container estilizado com bordas e sombra
    <Card className="h-100 shadow-sm hover-shadow transition">
      {/* 
        A capa do livro usa um aspect ratio fixo para manter consistência visual.
        object-fit: "cover" faz a imagem preencher o espaço sem distorcer.
      */}
      <div style={{ height: '280px', overflow: 'hidden' }}>
        <Card.Img 
          variant="top" 
          src={cover} 
          alt={`Capa do livro: ${title}`}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }}
        />
      </div>

      <Card.Body className="d-flex flex-column">
        {/* Título do livro */}
        <Card.Title className="fs-5 fw-bold mb-1">{title}</Card.Title>
        
        {/* Nome do autor com ícone de lápis */}
        <Card.Subtitle className="text-muted mb-2">
          <i className="bi bi-pencil"></i> {author}
        </Card.Subtitle>

        {/* 
          Badge de status: mostra visualmente em que estágio o livro está.
          O spread operator (...config) aplica todas as propriedades do config.
        */}
        <Badge 
          bg={config.bg} 
          text={config.text} 
          pill 
          className="mb-2 w-fit-content"
        >
          <i className={`bi ${config.icon} me-1`}></i>
          {config.label}
        </Badge>

        {/* 
          Componente de avaliação em estrelas.
          rating: nota atual do livro (0-5)
          onRate: função chamada quando uma estrela é clicada
        */}
        <div className="mb-2">
          <StarRating rating={rating} onRate={onRate} />
        </div>

        {/* 
          Descrição do livro - usamos text-truncate para limitar
          a textos longos e manter os cards com altura similar.
        */}
        <Card.Text className="text-muted small flex-grow-1">
          {description}
        </Card.Text>

        {/* 
          Botões de ação na parte inferior do card.
          mt-auto = margin-top: auto, empurra os botões para o fundo.
        */}
        <div className="d-flex gap-2 mt-auto">
          {/* 
            Botão para alterar o status do livro.
            Ciclo: quero-ler → lendo → lido → quero-ler
          */}
          <Button 
            variant="outline-primary" 
            size="sm"
            className="flex-grow-1"
            onClick={onStatusChange}
          >
            <i className="bi bi-arrow-repeat me-1"></i>
            Mudar Status
          </Button>

          {/* 
            Botão para remover o livro da estante.
            Usamos variant="outline-danger" para vermelho (ação destrutiva).
          */}
          <Button 
            variant="outline-danger" 
            size="sm"
            onClick={onRemove}
            title="Remover livro da estante"
          >
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

// Exportamos o componente para uso em outros arquivos
export default BookCard
