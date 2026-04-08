// ============================================================================
// components/StarRating.jsx - Componente de Avaliação em Estrelas
// ============================================================================
// Este componente exibe 5 estrelas que o usuário pode clicar para avaliar
// um livro de 1 a 5 estrelas.
//
// Conceitos importantes demonstrados aqui:
// - Estado local com useState
// - Efeito visual de hover nas estrelas
// - Comunicação com componente pai via callback (onRate)
// ============================================================================

import { useState } from 'react'

/**
 * Componente StarRating
 * 
 * @param {Object} props - Props do componente
 * @param {number} props.rating - Avaliação atual (0-5). 0 significa não avaliado.
 * @param {Function} props.onRate - Função chamada quando o usuário seleciona uma nota.
 *                                  Recebe o novo valor de rating como parâmetro.
 * 
 * Exemplo de uso:
 * <StarRating rating={4} onRate={(newRating) => console.log(newRating)} />
 */
function StarRating({ rating, onRate }) {
  
  // ========================================================================
  // useState: Hook de Estado do React
  // ========================================================================
  // useState permite que componentes "lembrem" de informações entre renderizações.
  // 
  // useState(0) cria uma variável de estado chamada `hoverRating` com valor inicial 0.
  // `setHoverRating` é a função para atualizar esse valor.
  //
  // Quando chamamos setHoverRating(novoValor), o React re-renderiza o componente
  // com o novo valor, atualizando a tela automaticamente.
  // ========================================================================
  const [hoverRating, setHoverRating] = useState(0)

  /**
   * Função chamada quando o usuário clica em uma estrela.
   * Ela "notifica" o componente pai sobre a nova avaliação.
   * 
   * @param {number} value - O valor da estrela clicada (1-5)
   */
  const handleStarClick = (value) => {
    // onRate é uma função que veio do componente pai (BookCard).
    // Isso é chamado de "callback" ou "lifting state up" no React.
    // O filho não guarda o estado, ele apenas informa ao pai.
    onRate(value)
  }

  /**
   * Função chamada quando o mouse passa sobre uma estrela.
   * Mostra uma prévia visual de qual nota está sendo selecionada.
   * 
   * @param {number} value - O valor da estrela sob o mouse
   */
  const handleMouseEnter = (value) => {
    setHoverRating(value)
  }

  /**
   * Função chamada quando o mouse sai de uma estrela.
   * Reseta o efeito de hover.
   */
  const handleMouseLeave = () => {
    setHoverRating(0)
  }

  // ========================================================================
  // RENDERIZAÇÃO DAS ESTRELAS
  // ========================================================================
  // Criamos um array de 5 posições [1, 2, 3, 4, 5] para mapear as estrelas.
  // Array.from({ length: 5 }) cria um array com 5 elementos vazios.
  // .map((_, i) => i + 1) transforma em [1, 2, 3, 4, 5].
  // ========================================================================
  return (
    <div 
      className="star-rating" 
      role="group" 
      aria-label="Avaliação do livro"
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => {
        
        // ================================================================
        // Lógica para determinar a cor de cada estrela:
        // ================================================================
        // - hoverRating > 0: usuário está passando o mouse → mostra hover
        // - rating > 0: avaliação já existe → mostra avaliação atual
        // - Caso contrário: estrela vazia (cinza)
        // ================================================================
        const isFilled = star <= (hoverRating || rating)
        
        return (
          <span
            key={star}
            // Cursor pointer indica que é clicável
            style={{ 
              cursor: 'pointer',
              fontSize: '1.3rem',
              // Cor da estrela: amarela se preenchida, cinza se vazia
              color: isFilled ? '#ffc107' : '#e0e0e0',
              // Transição suave de cor (0.15 segundos)
              transition: 'color 0.15s ease-in-out',
            }}
            // Eventos do mouse para interação
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            // Acessibilidade: descreve a estrela para leitores de tela
            aria-label={`${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
            role="button"
            tabIndex={0}
          >
            {/* 
              bi-star = estrela vazia
              bi-star-fill = estrela preenchida
              Trocamos o ícone baseado no estado isFilled.
            */}
            <i className={`bi ${isFilled ? 'bi-star-fill' : 'bi-star'}`}></i>
          </span>
        )
      })}
      
      {/* Texto informativo ao lado das estrelas */}
      <span className="ms-2 text-muted small">
        {rating > 0 ? `${rating}/5` : 'Sem avaliação'}
      </span>
    </div>
  )
}

// Exportamos o componente
export default StarRating
