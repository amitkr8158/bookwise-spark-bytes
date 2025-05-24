
/**
 * Service for bundle operations with Spring Boot API
 */

import { API_ENDPOINTS } from '@/config/apiConfig';
import { get, post, put, del } from './apiService';
import { supabase } from '@/integrations/supabase/client';

export interface Bundle {
  id: string;
  title: string;
  description: string;
  price: number;
  coverImage: string;
  books: any[];
  bookCount: number;
  savings: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all bundles
 */
export const getSpringBundles = async ({
  page = 0,
  size = 12,
  language = 'en'
}: {
  page?: number;
  size?: number;
  language?: string;
} = {}) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    language
  });
  
  const url = `${API_ENDPOINTS.BUNDLES}?${queryParams.toString()}`;
  const response = await get<{ content: Bundle[], totalElements: number }>(url, token);
  
  return { bundles: response.data?.content || [], total: response.data?.totalElements || 0, error: response.error };
};

/**
 * Get bundle by ID
 */
export const getSpringBundleById = async (id: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const response = await get<Bundle>(`${API_ENDPOINTS.BUNDLES}/${id}`, token);
  
  return { bundle: response.data, error: response.error };
};

/**
 * Get featured bundles
 */
export const getSpringFeaturedBundles = async (language = 'en', limit = 4) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const url = `${API_ENDPOINTS.BUNDLES}/featured?language=${language}&limit=${limit}`;
  const response = await get<Bundle[]>(url, token);
  
  return { bundles: response.data || [], error: response.error };
};

/**
 * Create bundle (admin only)
 */
export const createSpringBundle = async (bundleData: {
  title: string;
  description: string;
  price: number;
  coverImage?: string;
  bookIds: string[];
}) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { bundle: null, error: 'Authentication required' };
  }
  
  const response = await post<Bundle>(API_ENDPOINTS.BUNDLES, bundleData, token);
  
  return { bundle: response.data, error: response.error };
};

/**
 * Update bundle (admin only)
 */
export const updateSpringBundle = async (id: string, bundleData: Partial<Bundle>) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { bundle: null, error: 'Authentication required' };
  }
  
  const response = await put<Bundle>(`${API_ENDPOINTS.BUNDLES}/${id}`, bundleData, token);
  
  return { bundle: response.data, error: response.error };
};

/**
 * Delete bundle (admin only)
 */
export const deleteSpringBundle = async (id: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { error: 'Authentication required' };
  }
  
  const response = await del(`${API_ENDPOINTS.BUNDLES}/${id}`, token);
  
  return { error: response.error };
};

/**
 * Purchase bundle
 */
export const purchaseSpringBundle = async (bundleId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { error: 'Authentication required', purchase: null };
  }
  
  const response = await post(`${API_ENDPOINTS.USER_PURCHASES}/bundle`, { bundleId }, token);
  
  return { purchase: response.data, error: response.error };
};
