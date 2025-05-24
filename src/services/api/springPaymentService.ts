
/**
 * Service for payment operations with Spring Boot API
 */

import { API_ENDPOINTS } from '@/config/apiConfig';
import { post, get } from './apiService';
import { supabase } from '@/integrations/supabase/client';

export interface PaymentRequest {
  items: {
    type: 'book' | 'bundle';
    id: string;
    quantity: number;
  }[];
  amount: number;
  currency: string;
  paymentMethod: 'razorpay' | 'stripe' | 'paypal';
  couponCode?: string;
}

export interface PaymentResponse {
  orderId: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  paymentUrl?: string;
  razorpayOrderId?: string;
}

/**
 * Create payment order
 */
export const createSpringPaymentOrder = async (paymentData: PaymentRequest) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { order: null, error: 'Authentication required' };
  }
  
  const response = await post<PaymentResponse>(API_ENDPOINTS.PAYMENTS_PROCESS, paymentData, token);
  
  return { order: response.data, error: response.error };
};

/**
 * Verify payment
 */
export const verifySpringPayment = async (verificationData: {
  orderId: string;
  paymentId: string;
  signature?: string;
}) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { verified: false, error: 'Authentication required' };
  }
  
  const response = await post(API_ENDPOINTS.PAYMENTS_VERIFY, verificationData, token);
  
  return { verified: response.success, purchase: response.data, error: response.error };
};

/**
 * Get payment history
 */
export const getSpringPaymentHistory = async ({
  page = 0,
  size = 20
}: {
  page?: number;
  size?: number;
} = {}) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { payments: [], error: 'Authentication required' };
  }
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });
  
  const response = await get(`${API_ENDPOINTS.PAYMENTS}?${queryParams.toString()}`, token);
  
  return { payments: response.data?.content || [], total: response.data?.totalElements || 0, error: response.error };
};

/**
 * Refund payment (admin only)
 */
export const refundSpringPayment = async (paymentId: string, reason?: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { success: false, error: 'Authentication required' };
  }
  
  const response = await post(`${API_ENDPOINTS.PAYMENTS}/${paymentId}/refund`, { reason }, token);
  
  return { success: response.success, refund: response.data, error: response.error };
};
