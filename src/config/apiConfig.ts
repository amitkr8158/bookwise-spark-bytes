
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
  BOOKS_SEARCH: `${API_BASE_URL}/books/search`,
  
  // Bundle endpoints
  BUNDLES: `${API_BASE_URL}/bundles`,
  BUNDLES_FEATURED: `${API_BASE_URL}/bundles/featured`,
  
  // Review endpoints
  REVIEWS: `${API_BASE_URL}/reviews`,
  
  // Auth endpoints
  AUTH: `${API_BASE_URL}/auth`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
  
  // User endpoints
  USER: `${API_BASE_URL}/user`,
  USER_PROFILE: `${API_BASE_URL}/user/profile`,
  USER_PURCHASES: `${API_BASE_URL}/user/purchases`,
  USER_LIBRARY: `${API_BASE_URL}/user/library`,
  USER_CART: `${API_BASE_URL}/user/cart`,
  USER_BOOKMARKS: `${API_BASE_URL}/user/bookmarks`,
  USER_PREFERENCES: `${API_BASE_URL}/user/preferences`,
  USER_READING_PROGRESS: `${API_BASE_URL}/user/reading-progress`,
  
  // Category endpoints
  CATEGORIES: `${API_BASE_URL}/categories`,
  
  // Payment endpoints
  PAYMENTS: `${API_BASE_URL}/payments`,
  PAYMENTS_PROCESS: `${API_BASE_URL}/payments/process`,
  PAYMENTS_VERIFY: `${API_BASE_URL}/payments/verify`,
  
  // Content delivery endpoints
  CONTENT: `${API_BASE_URL}/content`,
  CONTENT_PDF: `${API_BASE_URL}/content/pdf`,
  CONTENT_AUDIO: `${API_BASE_URL}/content/audio`,
  CONTENT_VIDEO: `${API_BASE_URL}/content/video`,
  
  // Admin endpoints
  ADMIN: `${API_BASE_URL}/admin`,
  ADMIN_USERS: `${API_BASE_URL}/admin/users`,
  ADMIN_BOOKS: `${API_BASE_URL}/admin/books`,
  ADMIN_CATEGORIES: `${API_BASE_URL}/admin/categories`,
  ADMIN_BUNDLES: `${API_BASE_URL}/admin/bundles`,
  ADMIN_REVIEWS: `${API_BASE_URL}/admin/reviews`,
  ADMIN_ANALYTICS: `${API_BASE_URL}/admin/analytics`,
  
  // Search and recommendations
  SEARCH: `${API_BASE_URL}/search`,
  RECOMMENDATIONS: `${API_BASE_URL}/recommendations`,
  
  // Notifications
  NOTIFICATIONS: `${API_BASE_URL}/notifications`,
  EMAIL_NOTIFICATIONS: `${API_BASE_URL}/notifications/email`,
  SMS_NOTIFICATIONS: `${API_BASE_URL}/notifications/sms`,
};

// HTTP headers for API requests
export const getDefaultHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// API configuration for different environments
export const getApiConfig = (environment: 'development' | 'staging' | 'production' = 'development') => {
  switch (environment) {
    case 'production':
      return {
        baseUrl: 'https://api.yourbookplatform.com/api',
        timeout: 30000,
      };
    case 'staging':
      return {
        baseUrl: 'https://staging-api.yourbookplatform.com/api',
        timeout: 30000,
      };
    default:
      return {
        baseUrl: 'http://localhost:8080/api',
        timeout: 30000,
      };
  }
};
