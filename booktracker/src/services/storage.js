// ============================================================================
// services/storage.js - Serviço de Persistência Local (Atualizado para SaaS)
// ============================================================================
// Agora integrado com a API, mas mantém fallback local se backend não estiver disponível.
// ============================================================================

const BOOKS_KEY = 'booktracker_books';
const USER_KEY = 'booktracker_user';
const TOKEN_KEY = 'booktracker_token';

/**
 * Salva os livros no localStorage
 */
export const saveBooks = (books) => {
  try {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  } catch (error) {
    console.error('Erro ao salvar livros:', error);
  }
};

/**
 * Recupera os livros do localStorage
 */
export const getBooks = () => {
  try {
    const books = localStorage.getItem(BOOKS_KEY);
    return books ? JSON.parse(books) : [];
  } catch (error) {
    console.error('Erro ao recuperar livros:', error);
    return [];
  }
};

/**
 * Salva os dados do usuário no localStorage
 */
export const saveUser = (user) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
  }
};

/**
 * Recupera os dados do usuário do localStorage
 */
export const getUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Erro ao recuperar usuário:', error);
    return null;
  }
};

/**
 * Salva o token JWT
 */
export const saveToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Erro ao salvar token:', error);
  }
};

/**
 * Recupera o token JWT
 */
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || null;
  } catch (error) {
    console.error('Erro ao recuperar token:', error);
    return null;
  }
};

/**
 * Remove os dados do usuário (logout)
 */
export const removeUser = () => {
  try {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Erro ao remover usuário:', error);
  }
};

/**
 * Verifica se o usuário está autenticado
 */
export const isAuthenticated = () => {
  return !!getToken() && !!getUser();
};

/**
 * Limpa todos os dados do localStorage
 */
export const clearStorage = () => {
  try {
    localStorage.removeItem(BOOKS_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Erro ao limpar storage:', error);
  }
};
