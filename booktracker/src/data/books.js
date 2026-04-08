// ============================================================================
// data/books.js - Dados Iniciais dos Livros
// ============================================================================
// Este arquivo contém uma lista de livros de exemplo para popular nosso app
// enquanto o usuário não adiciona seus próprios livros.
//
// Em um projeto real, estes dados viriam de um banco de dados ou API.
// Aqui, usamos dados estáticos para simplificar o desenvolvimento.
// ============================================================================

/**
 * Cada livro é um objeto com as seguintes propriedades:
 * 
 * @property {number} id - Identificador único do livro (usamos Date.now() para gerar)
 * @property {string} title - Título do livro
 * @property {string} author - Nome do autor
 * @property {string} cover - URL da imagem da capa (usamos placeholders)
 * @property {string} status - Status de leitura: 'lendo' | 'lido' | 'quero-ler'
 * @property {number} rating - Avaliação em estrelas (0-5, onde 0 = não avaliado)
 * @property {string} description - Breve descrição do livro
 */
export const initialBooks = [
  {
    id: 1,
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    // Usando placeholder colorido como capa - em produção, seria uma imagem real
    cover: 'https://placehold.co/300x450/4a5568/ffffff?text=Dom+Casmurro',
    status: 'lido',
    rating: 5,
    description: 'Clássico da literatura brasileira que narra a história de Bentinho e Capitu.',
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    cover: 'https://placehold.co/300x450/2d3748/ffffff?text=1984',
    status: 'lendo',
    rating: 0, // Ainda não avaliado
    description: 'Distopia sobre um regime totalitário que controla até os pensamentos dos cidadãos.',
  },
  {
    id: 3,
    title: 'O Pequeno Príncipe',
    author: 'Antoine de Saint-Exupéry',
    cover: 'https://placehold.co/300x450/5a67d8/ffffff?text=Pequeno+Principe',
    status: 'lido',
    rating: 4,
    description: 'Uma fábula poética sobre amizade, amor e o sentido da vida.',
  },
  {
    id: 4,
    title: 'A Revolução dos Bichos',
    author: 'George Orwell',
    cover: 'https://placehold.co/300x450/e53e3e/ffffff?text=Revolucao+Bichos',
    status: 'quero-ler',
    rating: 0,
    description: 'Uma alegoria sobre o poder e a corrupção usando uma fazenda de animais.',
  },
  {
    id: 5,
    title: 'Grande Sertão: Veredas',
    author: 'João Guimarães Rosa',
    cover: 'https://placehold.co/300x450/d69e2e/ffffff?text=Grande+Sertao',
    status: 'lido',
    rating: 5,
    description: 'Uma das maiores obras da literatura brasileira, narrada por Riobaldo.',
  },
  {
    id: 6,
    title: 'O Senhor dos Anéis',
    author: 'J.R.R. Tolkien',
    cover: 'https://placehold.co/300x450/38a169/ffffff?text=Senhor+Aneis',
    status: 'lendo',
    rating: 0,
    description: 'Épico de fantasia sobre a jornada para destruir um anel poderoso.',
  },
]

// ============================================================================
// DADOS DE ESTATÍSTICAS
// ============================================================================
// Estes dados são calculados dinamicamente, mas aqui deixamos a estrutura
// para você entender o que vamos mostrar na seção de estatísticas.

/**
 * Estatísticas que vamos calcular no app:
 * - totalBooks: Total de livros na estante
 * - booksRead: Livros marcados como 'lido'
 * - booksReading: Livros marcados como 'lendo'
 * - booksWantToRead: Livros marcados como 'quero-ler'
 * - averageRating: Média das avaliações (apenas livros avaliados)
 * - totalPages: Total de páginas lidas (se implementarmos isso no futuro)
 */
