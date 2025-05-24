
/**
 * Service for secure content delivery with Spring Boot API
 */

import { API_ENDPOINTS } from '@/config/apiConfig';
import { get, post } from './apiService';
import { supabase } from '@/integrations/supabase/client';

export interface ContentAccess {
  bookId: string;
  contentType: 'pdf' | 'audio' | 'video';
  url: string;
  expiresAt: string;
  downloadLimit?: number;
  remainingDownloads?: number;
}

/**
 * Get secure content URL for purchased book
 */
export const getSpringSecureContent = async (bookId: string, contentType: 'pdf' | 'audio' | 'video') => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { contentAccess: null, error: 'Authentication required' };
  }
  
  const response = await get<ContentAccess>(`${API_ENDPOINTS.CONTENT}/${bookId}/${contentType}`, token);
  
  return { contentAccess: response.data, error: response.error };
};

/**
 * Track content consumption
 */
export const trackSpringContentConsumption = async (data: {
  bookId: string;
  contentType: 'pdf' | 'audio' | 'video';
  action: 'view' | 'download' | 'stream_start' | 'stream_end';
  duration?: number;
  position?: number;
}) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { success: false, error: 'Authentication required' };
  }
  
  const response = await post(`${API_ENDPOINTS.CONTENT}/track`, data, token);
  
  return { success: response.success, error: response.error };
};

/**
 * Get content analytics (admin only)
 */
export const getSpringContentAnalytics = async (bookId?: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { analytics: null, error: 'Authentication required' };
  }
  
  const url = bookId 
    ? `${API_ENDPOINTS.ADMIN_ANALYTICS}/content/${bookId}`
    : `${API_ENDPOINTS.ADMIN_ANALYTICS}/content`;
    
  const response = await get(url, token);
  
  return { analytics: response.data, error: response.error };
};

/**
 * Pre-sign upload URL for content (admin only)
 */
export const getSpringUploadUrl = async (data: {
  bookId: string;
  contentType: 'pdf' | 'audio' | 'video';
  fileName: string;
  fileSize: number;
  mimeType: string;
}) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { uploadUrl: null, error: 'Authentication required' };
  }
  
  const response = await post(`${API_ENDPOINTS.ADMIN}/content/upload-url`, data, token);
  
  return { uploadUrl: response.data?.uploadUrl, error: response.error };
};
