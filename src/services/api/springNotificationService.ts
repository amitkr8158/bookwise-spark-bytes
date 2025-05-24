
/**
 * Service for notification management with Spring Boot API
 */

import { API_ENDPOINTS } from '@/config/apiConfig';
import { get, post, put } from './apiService';
import { supabase } from '@/integrations/supabase/client';

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
  newReleaseAlerts: boolean;
  priceDropAlerts: boolean;
}

export interface Notification {
  id: string;
  type: 'email' | 'sms' | 'push';
  title: string;
  message: string;
  recipient: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt?: string;
  templateId?: string;
}

/**
 * Get user notification preferences
 */
export const getSpringNotificationPreferences = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { preferences: null, error: 'Authentication required' };
  }
  
  const response = await get<NotificationPreferences>(`${API_ENDPOINTS.USER}/notification-preferences`, token);
  
  return { preferences: response.data, error: response.error };
};

/**
 * Update notification preferences
 */
export const updateSpringNotificationPreferences = async (preferences: Partial<NotificationPreferences>) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { success: false, error: 'Authentication required' };
  }
  
  const response = await put(`${API_ENDPOINTS.USER}/notification-preferences`, preferences, token);
  
  return { success: response.success, preferences: response.data, error: response.error };
};

/**
 * Send welcome email
 */
export const sendSpringWelcomeEmail = async (userId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { success: false, error: 'Authentication required' };
  }
  
  const response = await post(`${API_ENDPOINTS.EMAIL_NOTIFICATIONS}/welcome`, { userId }, token);
  
  return { success: response.success, error: response.error };
};

/**
 * Send purchase confirmation email
 */
export const sendSpringPurchaseConfirmation = async (data: {
  orderId: string;
  userEmail: string;
  items: any[];
  total: number;
}) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { success: false, error: 'Authentication required' };
  }
  
  const response = await post(`${API_ENDPOINTS.EMAIL_NOTIFICATIONS}/purchase-confirmation`, data, token);
  
  return { success: response.success, error: response.error };
};

/**
 * Send notification to user
 */
export const sendSpringNotification = async (data: {
  userId: string;
  type: 'email' | 'sms';
  templateId: string;
  variables?: Record<string, any>;
}) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { success: false, error: 'Authentication required' };
  }
  
  const response = await post(API_ENDPOINTS.NOTIFICATIONS, data, token);
  
  return { success: response.success, notification: response.data, error: response.error };
};

/**
 * Get notification history (admin)
 */
export const getSpringNotificationHistory = async ({
  page = 0,
  size = 20,
  type,
  status
}: {
  page?: number;
  size?: number;
  type?: 'email' | 'sms' | 'push';
  status?: 'pending' | 'sent' | 'failed';
} = {}) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    return { notifications: [], error: 'Authentication required' };
  }
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });
  
  if (type) queryParams.append('type', type);
  if (status) queryParams.append('status', status);
  
  const response = await get(`${API_ENDPOINTS.ADMIN}/notifications?${queryParams.toString()}`, token);
  
  return { notifications: response.data?.content || [], total: response.data?.totalElements || 0, error: response.error };
};
