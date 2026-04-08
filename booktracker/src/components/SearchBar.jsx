// ============================================================================
// components/SearchBar.jsx - Barra de Busca e Filtros
// ============================================================================
// Este componente permite ao usuário:
// 1. Buscar livros por título ou autor
// 2. Filtrar por status de leitura
//
// Conceitos importantes:
// - Controlled components (input controlado pelo estado)
// - Debounce visual (ícone de busca aparece enquanto digita)
// - Comunicação com componente pai via callback
// ============================================================================

import { Form, InputGroup } from 'react-bootstrap'

/**
 * Componente SearchBar
 * 
 * @param {Object} props - Props do componente
 * @param {string} props.searchTerm - Termo de busca atual
 * @param {Function} props.onSearchChange - Função chamada quando o termo de busca muda
 * @param {string} props.filterStatus - Status selecionado para filtro
 * @param {Function} props.onFilterChange - Função chamada quando o filtro muda
 * 
 * Nota: Os estados vivem no componente pai (App) porque outros componentes
 * também precisam acessar esses valores. Este componente apenas os exibe
 * e notifica mudanças.
 */
function SearchBar({ searchTerm, onSearchChange, filterStatus, onFilterChange }) {
  return (
    // InputGroup do Bootstrap: permite agrupar input com ícone
    <div className="d-flex flex-column flex-md-row gap-3 mb-4">
      
      {/* ================================================================== */}
      {/* CAMPO DE BUSCA                                                     */}
      {/* ================================================================== */}
      <InputGroup className="flex-grow-1">
        {/* Ícone de lupa no início do input */}
        <InputGroup.Text className="bg-white border-end-0">
          <i className="bi bi-search text-muted"></i>
        </InputGroup.Text>
        
        {/* 
          Input de busca controlado pelo React.
          - value: vem do estado do componente pai
          - onChange: notifica o pai quando o usuário digita
          - placeholder: texto de dica que desaparece ao digitar
        */}
        <Form.Control
          type="text"
          placeholder="Buscar por título ou autor..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-start-0"
          // Feedback visual: se há texto, mostra ícone de "limpar"
          // (poderíamos adicionar um botão X para limpar)
        />
      </InputGroup>

      {/* ================================================================== */}
      {/* FILTRO DE STATUS                                                   */}
      {/* ================================================================== */}
      {/* 
        Select para filtrar livros por status.
        Cada option tem um valor que corresponde ao status dos livros.
      */}
      <Form.Select
        value={filterStatus}
        onChange={(e) => onFilterChange(e.target.value)}
        style={{ minWidth: '200px' }}
        aria-label="Filtrar por status"
      >
        {/* "todos" mostra todos os livros, sem filtro */}
        <option value="todos">📚 Todos os Livros</option>
        <option value="lendo">📖 Lendo</option>
        <option value="lido">✅ Lidos</option>
        <option value="quero-ler">💜 Quero Ler</option>
      </Form.Select>
    </div>
  )
}

// Exportamos o componente
export default SearchBar
