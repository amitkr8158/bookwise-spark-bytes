
import { supabase } from "@/integrations/supabase/client";

/**
 * Helper service for development testing with test accounts
 * This is only meant for development and testing purposes
 */

export const testUsers = {
  customer: {
    email: 'customer@example.com',
    password: 'password123',
    role: 'user'
  },
  admin: {
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  }
};

/**
 * Sign in with a test account without needing to type credentials each time
 * @param userType - Either 'customer' or 'admin'
 */
export const signInAsTestUser = async (userType: 'customer' | 'admin') => {
  const user = testUsers[userType];
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password
    });
    
    if (error) {
      console.error(`Failed to sign in as test ${userType}:`, error.message);
      return { success: false, error: error.message };
    }
    
    console.log(`Successfully signed in as test ${userType}`);
    return { success: true, data, user: user };
  } catch (err) {
    console.error(`Error signing in as test ${userType}:`, err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

/**
 * Quick function to sign out the current user
 */
export const signOutTestUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Failed to sign out test user:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('Successfully signed out test user');
    return { success: true };
  } catch (err) {
    console.error('Error signing out test user:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};
