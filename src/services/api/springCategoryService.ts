
/**
 * Service for category operations with Spring Boot API
 */

import { API_ENDPOINTS } from '@/config/apiConfig';
import { get, post, put, del } from './apiService';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  bookCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all categories
 */
export const getSpringCategories = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const response = await get<Category[]>(API_ENDPOINTS.CATEGORIES, token);
  
  return { categories: response.data || [], error: response.error };
};

/**
 * Get category by ID
 */
export const getSpringCategoryById = async (id: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const response = await get<Category>(`${API_ENDPOINTS.CATEGORIES}/${id}`, token);
  
  return { category: response.data, error: response.error };
};

/**
 * Get books by category
 */
export const getSpringBooksByCategory = async (
  categoryId: string,
  {
    page = 0,
    size = 12,
    sortBy = 'newest',
    language = 'en'
  }: {
    page?: number;
    size?: number;
    sortBy?: string;
    language?: string;
  } = {}
) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    language
  });
  
  const url = `${API_ENDPOINTS.CATEGORIES}/${categoryId}/books?${queryParams.toString()}`;
  const response = await get(url, token);
  
  return { books: response.data?.content || [], total: response.data?.totalElements || 0, error: response.error };
};

/**
 * Create category (admin only)
 */
export const createSpringCategory = async (categoryData: {
  name: string;
  description: string;
  iconUrl?: string;
}) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { category: null, error: 'Authentication required' };
  }
  
  const response = await post<Category>(API_ENDPOINTS.CATEGORIES, categoryData, token);
  
  return { category: response.data, error: response.error };
};

/**
 * Update category (admin only)
 */
export const updateSpringCategory = async (id: string, categoryData: Partial<Category>) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { category: null, error: 'Authentication required' };
  }
  
  const response = await put<Category>(`${API_ENDPOINTS.CATEGORIES}/${id}`, categoryData, token);
  
  return { category: response.data, error: response.error };
};

/**
 * Delete category (admin only)
 */
export const deleteSpringCategory = async (id: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { error: 'Authentication required' };
  }
  
  const response = await del(`${API_ENDPOINTS.CATEGORIES}/${id}`, token);
  
  return { error: response.error };
};
