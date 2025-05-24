
/**
 * Service for authentication with Spring Boot API
 */

import { API_ENDPOINTS } from '@/config/apiConfig';
import { post, get, put } from './apiService';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    avatar?: string;
  };
  token: string;
  refreshToken: string;
}

/**
 * Login user
 */
export const loginSpringUser = async (credentials: LoginRequest) => {
  const response = await post<AuthResponse>(API_ENDPOINTS.LOGIN, credentials);
  
  if (response.success && response.data) {
    // Store token in localStorage
    localStorage.setItem('spring_auth_token', response.data.token);
    localStorage.setItem('spring_refresh_token', response.data.refreshToken);
    localStorage.setItem('spring_user', JSON.stringify(response.data.user));
  }
  
  return { user: response.data?.user, token: response.data?.token, error: response.error };
};

/**
 * Register new user
 */
export const registerSpringUser = async (userData: RegisterRequest) => {
  const response = await post<AuthResponse>(API_ENDPOINTS.REGISTER, userData);
  
  if (response.success && response.data) {
    // Store token in localStorage
    localStorage.setItem('spring_auth_token', response.data.token);
    localStorage.setItem('spring_refresh_token', response.data.refreshToken);
    localStorage.setItem('spring_user', JSON.stringify(response.data.user));
  }
  
  return { user: response.data?.user, token: response.data?.token, error: response.error };
};

/**
 * Get current user profile
 */
export const getSpringCurrentUser = async () => {
  const token = localStorage.getItem('spring_auth_token');
  
  if (!token) {
    return { user: null, error: 'No authentication token found' };
  }
  
  const response = await get(`${API_ENDPOINTS.AUTH}/me`, token);
  
  return { user: response.data, error: response.error };
};

/**
 * Update user profile
 */
export const updateSpringUserProfile = async (userData: {
  fullName?: string;
  phone?: string;
  avatar?: string;
  address?: string;
  dateOfBirth?: string;
}) => {
  const token = localStorage.getItem('spring_auth_token');
  
  if (!token) {
    return { user: null, error: 'Authentication required' };
  }
  
  const response = await put(`${API_ENDPOINTS.AUTH}/me`, userData, token);
  
  if (response.success && response.data) {
    // Update stored user data
    localStorage.setItem('spring_user', JSON.stringify(response.data));
  }
  
  return { user: response.data, error: response.error };
};

/**
 * Logout user
 */
export const logoutSpringUser = async () => {
  // Clear stored tokens
  localStorage.removeItem('spring_auth_token');
  localStorage.removeItem('spring_refresh_token');
  localStorage.removeItem('spring_user');
  
  return { success: true };
};

/**
 * Refresh authentication token
 */
export const refreshSpringToken = async () => {
  const refreshToken = localStorage.getItem('spring_refresh_token');
  
  if (!refreshToken) {
    return { token: null, error: 'No refresh token found' };
  }
  
  const response = await post(`${API_ENDPOINTS.AUTH}/refresh`, { refreshToken });
  
  if (response.success && response.data) {
    localStorage.setItem('spring_auth_token', response.data.token);
  }
  
  return { token: response.data?.token, error: response.error };
};

/**
 * Get stored user from localStorage
 */
export const getStoredSpringUser = () => {
  const userStr = localStorage.getItem('spring_user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Check if user is authenticated
 */
export const isSpringAuthenticated = () => {
  const token = localStorage.getItem('spring_auth_token');
  const user = getStoredSpringUser();
  return !!(token && user);
};
