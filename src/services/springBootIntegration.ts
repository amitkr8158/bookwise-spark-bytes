
/**
 * Spring Boot Integration Service
 * 
 * This file exports all Spring Boot service functions and provides 
 * a configuration function to switch between Supabase and Spring Boot backends.
 */

import { API_BASE_URL } from '@/config/apiConfig';
import * as SpringBookService from '@/services/api/springBookService';
import * as SpringReviewService from '@/services/api/springReviewService';
import * as ContentService from '@/services/api/contentService';

// Export all Spring Boot service functions
export * from '@/services/api/springBookService';
export * from '@/services/api/springReviewService';
export * from '@/services/api/contentService';

// Backend type configuration
type BackendType = 'supabase' | 'spring-boot';

interface BackendConfig {
  type: BackendType;
  apiUrl: string;
}

// Default to Supabase
let currentBackend: BackendConfig = {
  type: 'supabase',
  apiUrl: '',
};

/**
 * Configure which backend to use (Supabase or Spring Boot)
 */
export const configureBackend = (backendType: BackendType, apiUrl?: string) => {
  currentBackend = {
    type: backendType,
    apiUrl: apiUrl || (backendType === 'spring-boot' ? API_BASE_URL : ''),
  };
  
  console.log(`Backend configured: ${currentBackend.type}`, 
    currentBackend.type === 'spring-boot' ? `API URL: ${currentBackend.apiUrl}` : '');
  
  return currentBackend;
};

/**
 * Get current backend configuration
 */
export const getCurrentBackend = (): BackendConfig => {
  return { ...currentBackend };
};

/**
 * Check if connected to Spring Boot backend
 */
export const isSpringBootBackend = (): boolean => {
  return currentBackend.type === 'spring-boot';
};

/**
 * Function to test Spring Boot API connection
 */
export const testSpringBootConnection = async (): Promise<{success: boolean, message: string}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      return {
        success: true,
        message: 'Spring Boot API connection successful'
      };
    } else {
      return {
        success: false,
        message: `API responded with status: ${response.status}`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? 
        `Failed to connect to Spring Boot API: ${error.message}` : 
        'Failed to connect to Spring Boot API'
    };
  }
};
