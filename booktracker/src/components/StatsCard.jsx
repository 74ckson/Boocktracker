// ============================================================================
// components/StatsCard.jsx - Componente de Estatísticas
// ============================================================================
// Este componente exibe um card com estatísticas de leitura do usuário:
// - Total de livros
// - Livros sendo lidos agora
// - Livros já concluídos
// - Livros na lista de desejos
// - Média de avaliações
//
// Visualmente, usamos ícones e cores diferentes para cada métrica,
// facilitando a leitura rápida das estatísticas.
// ============================================================================

import { Card, Row, Col } from 'react-bootstrap'

/**
 * Configuração visual de cada estatística
 * 
 * Cada entrada define:
 * - icon: ícone do Bootstrap Icons
 * - color: classe de cor do Bootstrap
 * - bg: classe de cor de fundo do Bootstrap
 * - label: texto descritivo
 * - suffix: texto opcional após o valor (ex: "/5")
 */
const statsConfig = {
  totalBooks: {
    icon: 'bi-collection',
    color: 'text-primary',
    bg: 'bg-primary bg-opacity-10',
    label: 'Total de Livros',
  },
  booksReading: {
    icon: 'bi-book',
    color: 'text-warning',
    bg: 'bg-warning bg-opacity-10',
    label: 'Lendo Agora',
  },
  booksRead: {
    icon: 'bi-check-circle',
    color: 'text-success',
    bg: 'bg-success bg-opacity-10',
    label: 'Livros Lidos',
  },
  booksWantToRead: {
    icon: 'bi-heart',
    color: 'text-info',
    bg: 'bg-info bg-opacity-10',
    label: 'Quero Ler',
  },
  averageRating: {
    icon: 'bi-star',
    color: 'text-warning',
    bg: 'bg-warning bg-opacity-10',
    label: 'Avaliação Média',
    suffix: '/5',
  },
}

/**
 * Componente StatsCard
 * 
 * @param {Object} props - Props do componente
 * @param {Object} props.stats - Objeto com todas as estatísticas
 * @param {number} props.stats.totalBooks - Total de livros na estante
 * @param {number} props.stats.booksReading - Livros com status "lendo"
 * @param {number} props.stats.booksRead - Livros com status "lido"
 * @param {number} props.stats.booksWantToRead - Livros com status "quero-ler"
 * @param {number} props.stats.averageRating - Média das avaliações (0 se nenhuma)
 * 
 * Este componente é "apresentacional": apenas recebe dados e exibe,
 * sem gerenciar estado próprio ou lógica complexa.
 */
function StatsCard({ stats }) {
  return (
    // Card principal com sombra suave
    <Card className="shadow-sm border-0">
      <Card.Body>
        {/* Título da seção */}
        <Card.Title className="mb-4">
          <i className="bi bi-bar-chart-fill me-2 text-primary"></i>
          <strong>Estatísticas de Leitura</strong>
        </Card.Title>

        {/* 
          Grid responsivo do Bootstrap:
          - row-cols-2: 2 colunas por linha em telas pequenas
          - row-cols-md-5: 5 colunas em telas médias e grandes
          Isso garante que o layout se adapte a diferentes tamanhos de tela.
        */}
        <Row className="row-cols-2 row-cols-md-5 g-3">
          {
            // ==================================================================
            // MAPEAMENTO DAS ESTATÍSTICAS
            // ==================================================================
            // Usamos Object.entries() para iterar sobre as configurações.
            // Para cada estatística, criamos um mini-card visual.
            // O operador ?? (nullish coalescing) garante que usamos 0 se o
            // valor for undefined ou null.
            // ==================================================================
            Object.entries(statsConfig).map(([key, config]) => (
              <Col key={key}>
                {/* 
                  Mini-card individual para cada estatística.
                  bg-opacity-10 cria um fundo suave da cor primária.
                */}
                <div className={`rounded-3 p-3 ${config.bg} h-100`}>
                  {/* Ícone grande e colorido */}
                  <div className={`d-flex align-items-center justify-content-between mb-2`}>
                    <i className={`bi ${config.icon} fs-4 ${config.color}`}></i>
                    {/* 
                      Valor da estatística: usamos toFixed(1) para média
                      para mostrar uma casa decimal (ex: 4.5)
                    */}
                    <span className={`fs-4 fw-bold ${config.color}`}>
                      {key === 'averageRating' 
                        ? stats[key]?.toFixed(1) ?? '0.0'
                        : stats[key] ?? 0
                      }
                    </span>
                  </div>
                  
                  {/* Label descritivo */}
                  <small className={`text-muted ${config.color}`}>
                    {config.label}
                    {config.suffix && <span>{config.suffix}</span>}
                  </small>
                </div>
              </Col>
            ))
          }
        </Row>
      </Card.Body>
    </Card>
  )
}

// Exportamos o componente
export default StatsCard
