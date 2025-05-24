
/**
 * Service for cart operations with Spring Boot API
 */

import { API_ENDPOINTS } from '@/config/apiConfig';
import { get, post, put, del } from './apiService';
import { supabase } from '@/integrations/supabase/client';

export interface CartItem {
  id: string;
  bookId: string;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

/**
 * Get user's cart
 */
export const getSpringCart = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { cart: null, error: 'Authentication required' };
  }
  
  const response = await get<Cart>(`${API_ENDPOINTS.USER}/cart`, token);
  
  return { cart: response.data, error: response.error };
};

/**
 * Add item to cart
 */
export const addSpringCartItem = async (bookId: string, quantity: number = 1) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { success: false, error: 'Authentication required' };
  }
  
  const response = await post(`${API_ENDPOINTS.USER}/cart/items`, {
    bookId,
    quantity
  }, token);
  
  return { success: response.success, cartItem: response.data, error: response.error };
};

/**
 * Update cart item quantity
 */
export const updateSpringCartItem = async (itemId: string, quantity: number) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { success: false, error: 'Authentication required' };
  }
  
  const response = await put(`${API_ENDPOINTS.USER}/cart/items/${itemId}`, {
    quantity
  }, token);
  
  return { success: response.success, error: response.error };
};

/**
 * Remove item from cart
 */
export const removeSpringCartItem = async (itemId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { success: false, error: 'Authentication required' };
  }
  
  const response = await del(`${API_ENDPOINTS.USER}/cart/items/${itemId}`, token);
  
  return { success: response.success, error: response.error };
};

/**
 * Clear entire cart
 */
export const clearSpringCart = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { success: false, error: 'Authentication required' };
  }
  
  const response = await del(`${API_ENDPOINTS.USER}/cart`, token);
  
  return { success: response.success, error: response.error };
};

/**
 * Apply coupon to cart
 */
export const applySpringCoupon = async (couponCode: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { success: false, error: 'Authentication required' };
  }
  
  const response = await post(`${API_ENDPOINTS.USER}/cart/coupon`, {
    couponCode
  }, token);
  
  return { success: response.success, discount: response.data, error: response.error };
};
