
/**
 * Service for accessing secure content from the Spring Boot API
 */

import { API_ENDPOINTS } from '@/config/apiConfig';
import { get } from './apiService';
import { supabase } from '@/integrations/supabase/client';

export enum ContentType {
  PDF = 'pdf',
  AUDIO = 'audio',
  VIDEO = 'video'
}

/**
 * Get secure URL for book content
 */
export const getSecureContentUrl = async (bookId: string, contentType: ContentType) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { url: null, error: 'Authentication required' };
  }
  
  const url = `${API_ENDPOINTS.BOOKS}/${bookId}/content/${contentType}`;
  const response = await get<{ url: string }>(url, token);
  
  return { 
    url: response.data?.url || null, 
    error: response.error 
  };
};
