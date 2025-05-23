
/**
 * Core API service for making HTTP requests to the Spring Boot backend
 */

import { API_TIMEOUT, getDefaultHeaders } from '@/config/apiConfig';

export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

/**
 * Generic method to make API requests
 */
export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {},
  timeout: number = API_TIMEOUT
): Promise<ApiResponse<T>> {
  try {
    // Set up request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    // Make the fetch request with abort controller
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    // Parse response body as JSON
    const data = await response.json();
    
    // Handle unsuccessful responses
    if (!response.ok) {
      const errorMessage = data?.message || `API request failed with status: ${response.status}`;
      console.error('API Error:', errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
    
    // Return successful response
    return {
      data,
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown API error occurred';
    console.error('API Request Error:', errorMessage);
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * GET request helper
 */
export async function get<T = any>(url: string, token?: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    method: 'GET',
    headers: getDefaultHeaders(token),
  });
}

/**
 * POST request helper
 */
export async function post<T = any>(url: string, data: any, token?: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    method: 'POST',
    headers: getDefaultHeaders(token),
    body: JSON.stringify(data),
  });
}

/**
 * PUT request helper
 */
export async function put<T = any>(url: string, data: any, token?: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    method: 'PUT',
    headers: getDefaultHeaders(token),
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request helper
 */
export async function del<T = any>(url: string, token?: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    method: 'DELETE',
    headers: getDefaultHeaders(token),
  });
}
