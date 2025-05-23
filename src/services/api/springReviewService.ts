
/**
 * Service for accessing review features from the Spring Boot API
 */

import { API_ENDPOINTS } from '@/config/apiConfig';
import { get, post, put, del } from './apiService';
import { Review } from '@/services/reviews/reviewService';
import { supabase } from '@/integrations/supabase/client';

/**
 * Get reviews for a book
 */
export const getSpringBookReviews = async (bookId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const url = `${API_ENDPOINTS.BOOKS}/${bookId}/reviews`;
  const response = await get<Review[]>(url, token);
  
  return { reviews: response.data || [], error: response.error };
};

/**
 * Add a review
 */
export const addSpringReview = async (bookData: { bookId: string, rating: number, content: string }) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { error: 'Authentication required', success: false };
  }
  
  const url = `${API_ENDPOINTS.BOOKS}/${bookData.bookId}/reviews`;
  const response = await post<Review>(url, {
    rating: bookData.rating,
    reviewText: bookData.content
  }, token);
  
  return { 
    success: response.success, 
    review: response.data, 
    error: response.error 
  };
};

/**
 * Delete a review
 */
export const deleteSpringReview = async (reviewId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { error: 'Authentication required', success: false };
  }
  
  const url = `${API_ENDPOINTS.REVIEWS}/${reviewId}`;
  const response = await del(url, token);
  
  return { success: response.success, error: response.error };
};

/**
 * Update a review
 */
export const updateSpringReview = async (reviewId: string, rating: number, reviewText: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { error: 'Authentication required', success: false };
  }
  
  const url = `${API_ENDPOINTS.REVIEWS}/${reviewId}`;
  const response = await put(url, { rating, reviewText }, token);
  
  return { success: response.success, error: response.error };
};

/**
 * Get all reviews (admin only)
 */
export const getAllSpringReviews = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { reviews: [], error: 'Authentication required' };
  }
  
  const response = await get<Review[]>(`${API_ENDPOINTS.REVIEWS}/admin/all`, token);
  
  return { reviews: response.data || [], error: response.error };
};

/**
 * Update review visibility (admin only)
 */
export const updateSpringReviewVisibility = async (reviewId: string, isVisible: boolean) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { success: false, error: 'Authentication required' };
  }
  
  const url = `${API_ENDPOINTS.REVIEWS}/${reviewId}/visibility`;
  const response = await put(url, { isVisible }, token);
  
  return { success: response.success, error: response.error };
};

/**
 * Update top review status (admin only)
 */
export const updateSpringTopReview = async (reviewId: string, isTopReview: boolean) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { success: false, error: 'Authentication required' };
  }
  
  const url = `${API_ENDPOINTS.REVIEWS}/${reviewId}/top-review`;
  const response = await put(url, { isTopReview }, token);
  
  return { success: response.success, error: response.error };
};
