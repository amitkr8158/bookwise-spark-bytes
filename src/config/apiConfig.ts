
/**
 * API configuration for Spring Boot backend integration
 */

// Base URL for the Spring Boot API
export const API_BASE_URL = 'http://localhost:8080/api';

// Timeout for API requests in milliseconds
export const API_TIMEOUT = 30000;

// API endpoints
export const API_ENDPOINTS = {
  // Book endpoints
  BOOKS: `${API_BASE_URL}/books`,
  BOOKS_TRENDING: `${API_BASE_URL}/books/trending`,
  BOOKS_NEW: `${API_BASE_URL}/books/new-releases`,
  BOOKS_FREE: `${API_BASE_URL}/books/free`,
  
  // Review endpoints
  REVIEWS: `${API_BASE_URL}/reviews`,
  
  // Auth endpoints
  AUTH: `${API_BASE_URL}/auth`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  
  // User endpoints
  USER: `${API_BASE_URL}/user`,
  USER_PURCHASES: `${API_BASE_URL}/user/purchases`,
  
  // Category endpoints
  CATEGORIES: `${API_BASE_URL}/categories`,
};

// HTTP headers for API requests
export const getDefaultHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};
