// ============================================================================
// src/services/api.js - Serviço de API para comunicação com o Backend
// ============================================================================
// Configuração do Axios e funções de API para todas as operações.
// ============================================================================

import axios from 'axios';

// URL base da API (mudar em produção)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Criar instância do Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para adicionar o token em cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('booktracker_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Interceptador para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o token expirou ou é inválido, fazer logout
    if (error.response?.status === 401) {
      localStorage.removeItem('booktracker_token');
      localStorage.removeItem('booktracker_user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// ============================================================================
// FUNÇÕES DE AUTENTICAÇÃO
// ============================================================================

/**
 * Registrar novo usuário
 * @param {Object} userData - Dados do usuário { name, email, password }
 * @returns {Promise<Object>} Usuário e token
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  
  if (response.data.token) {
    localStorage.setItem('booktracker_token', response.data.token);
    localStorage.setItem('booktracker_user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

/**
 * Fazer login
 * @param {Object} credentials - Credenciais { email, password }
 * @returns {Promise<Object>} Usuário e token
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  
  if (response.data.token) {
    localStorage.setItem('booktracker_token', response.data.token);
    localStorage.setItem('booktracker_user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

/**
 * Fazer logout
 */
export const logout = () => {
  localStorage.removeItem('booktracker_token');
  localStorage.removeItem('booktracker_user');
};

/**
 * Obter usuário atual
 * @returns {Object|null} Usuário atual
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('booktracker_user');
  return user ? JSON.parse(user) : null;
};

// ============================================================================
// FUNÇÕES DE LIVROS
// ============================================================================

/**
 * Buscar todos os livros
 * @returns {Promise<Array>} Array de livros
 */
export const getBooks = async () => {
  const response = await api.get('/books');
  return response.data;
};

/**
 * Buscar um livro específico
 * @param {number} id - ID do livro
 * @returns {Promise<Object>} Livro
 */
export const getBook = async (id) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

/**
 * Criar novo livro
 * @param {Object|FormData} bookData - Dados do livro (objeto ou FormData para upload)
 * @returns {Promise<Object>} Livro criado
 */
export const createBook = async (bookData) => {
  // Verificar se é FormData (com upload de imagem)
  const isFormData = bookData instanceof FormData;
  
  console.log('📤 Enviando livro para API...');
  console.log('  - Tipo:', isFormData ? 'FormData' : 'JSON');
  if (!isFormData) {
    console.log('  - Dados:', bookData);
  }
  
  const config = isFormData ? {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  } : {};

  try {
    const response = await api.post('/books', bookData, config);
    console.log('✅ Livro criado com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar livro:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Atualizar livro
 * @param {number} id - ID do livro
 * @param {Object|FormData} updates - Atualizações (objeto ou FormData)
 * @returns {Promise<Object>} Livro atualizado
 */
export const updateBook = async (id, updates) => {
  // Verificar se é FormData (com upload de imagem)
  const isFormData = updates instanceof FormData;
  
  if (isFormData) {
    // Para FormData, usar POST com _method=PUT (middleware do Express)
    // Como não temos esse middleware, usamos POST direto e o backend trata
    updates.append('_method', 'PUT');
    
    const response = await api.post(`/books/${id}`, updates, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
  
  // Para JSON normal, usar PUT
  const response = await api.put(`/books/${id}`, updates);
  return response.data;
};

/**
 * Deletar livro
 * @param {number} id - ID do livro
 * @returns {Promise<void>}
 */
export const deleteBook = async (id) => {
  await api.delete(`/books/${id}`);
};

/**
 * Buscar estatísticas dos livros
 * @returns {Promise<Object>} Estatísticas
 */
export const getBookStats = async () => {
  const response = await api.get('/books/stats');
  return response.data;
};

// ============================================================================
// FUNÇÕES DE USUÁRIO
// ============================================================================

/**
 * Buscar perfil do usuário
 * @returns {Promise<Object>} Perfil do usuário
 */
export const getUserProfile = async () => {
  const response = await api.get('/user/profile');
  return response.data;
};

/**
 * Atualizar perfil do usuário
 * @param {Object} updates - Atualizações { name, email }
 * @returns {Promise<Object>} Usuário atualizado
 */
export const updateUserProfile = async (updates) => {
  const response = await api.put('/user/profile', updates);
  return response.data;
};

/**
 * Atualizar meta de leitura
 * @param {number} goal - Meta de livros por ano
 * @returns {Promise<Object>} Resultado
 */
export const updateReadingGoal = async (goal) => {
  const response = await api.put('/user/reading-goal', { goal });
  return response.data;
};

/**
 * Fazer upgrade para plano premium
 * @returns {Promise<Object>} Resultado
 */
export const upgradeToPremium = async () => {
  const response = await api.post('/user/upgrade');
  return response.data;
};

/**
 * Deletar conta do usuário
 * @returns {Promise<void>}
 */
export const deleteAccount = async () => {
  await api.delete('/user/account');
  localStorage.removeItem('booktracker_token');
  localStorage.removeItem('booktracker_user');
};

export default api;
