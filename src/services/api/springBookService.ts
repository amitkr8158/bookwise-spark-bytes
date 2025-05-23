
/**
 * Service for interacting with the Spring Boot Book API
 */

import { API_ENDPOINTS } from '@/config/apiConfig';
import { get, post, put, del } from './apiService';
import { Book } from '@/services/books/bookService';
import { supabase } from '@/integrations/supabase/client';

/**
 * Get list of books with filters
 */
export const getSpringBooks = async ({
  language = 'en',
  category = '',
  page = 0,
  size = 12,
  search = '',
  sortBy = 'newest'
}: {
  language?: string;
  category?: string;
  page?: number;
  size?: number;
  search?: string;
  sortBy?: string;
} = {}) => {
  // Get the current user's JWT token
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  // Build query parameters
  const queryParams = new URLSearchParams({
    language,
    page: page.toString(),
    size: size.toString(),
    sortBy,
  });
  
  if (category) queryParams.append('category', category);
  if (search) queryParams.append('search', search);
  
  const url = `${API_ENDPOINTS.BOOKS}?${queryParams.toString()}`;
  return get<{ content: Book[], totalElements: number }>(url, token);
};

/**
 * Get a book by ID
 */
export const getSpringBookById = async (id: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const url = `${API_ENDPOINTS.BOOKS}/${id}`;
  const response = await get<Book>(url, token);
  
  return { book: response.data, error: response.error };
};

/**
 * Get trending books
 */
export const getSpringTrendingBooks = async (language = 'en', limit = 8) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const url = `${API_ENDPOINTS.BOOKS_TRENDING}?language=${language}&limit=${limit}`;
  const response = await get<Book[]>(url, token);
  
  return { books: response.data || [], error: response.error };
};

/**
 * Get new releases
 */
export const getSpringNewReleases = async (language = 'en', limit = 8) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const url = `${API_ENDPOINTS.BOOKS_NEW}?language=${language}&limit=${limit}`;
  const response = await get<Book[]>(url, token);
  
  return { books: response.data || [], error: response.error };
};

/**
 * Get free books
 */
export const getSpringFreeBooks = async (language = 'en', limit = 4) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const url = `${API_ENDPOINTS.BOOKS_FREE}?language=${language}&limit=${limit}`;
  const response = await get<Book[]>(url, token);
  
  return { books: response.data || [], error: response.error };
};

/**
 * Create a new book (admin only)
 */
export const createSpringBook = async (bookData: Partial<Book>) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { error: 'Authentication required', book: null };
  }
  
  const response = await post<Book>(API_ENDPOINTS.BOOKS, bookData, token);
  return { book: response.data, error: response.error };
};

/**
 * Update a book (admin only)
 */
export const updateSpringBook = async (id: string, bookData: Partial<Book>) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { error: 'Authentication required', book: null };
  }
  
  const url = `${API_ENDPOINTS.BOOKS}/${id}`;
  const response = await put<Book>(url, bookData, token);
  
  return { book: response.data, error: response.error };
};

/**
 * Delete a book (admin only)
 */
export const deleteSpringBook = async (id: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { error: 'Authentication required' };
  }
  
  const url = `${API_ENDPOINTS.BOOKS}/${id}`;
  const response = await del(url, token);
  
  return { error: response.error };
};

/**
 * Get related books by category
 */
export const getSpringRelatedBooks = async (bookId: string, category: string, language = 'en', limit = 5) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const url = `${API_ENDPOINTS.BOOKS}/related/${bookId}?category=${category}&language=${language}&limit=${limit}`;
  const response = await get<Book[]>(url, token);
  
  return { books: response.data || [], error: response.error };
};

/**
 * Get user's purchased books
 */
export const getSpringUserPurchasedBooks = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { error: 'Authentication required', purchases: null };
  }
  
  const response = await get(API_ENDPOINTS.USER_PURCHASES, token);
  return { purchases: response.data, error: response.error };
};

/**
 * Purchase a book
 */
export const purchaseSpringBook = async (bookId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { error: 'Authentication required', purchase: null };
  }
  
  const response = await post(API_ENDPOINTS.USER_PURCHASES, { bookId }, token);
  return { purchase: response.data, error: response.error };
};
