
import { supabase } from "@/integrations/supabase/client";
import { Session, User, AuthResponse } from "@supabase/supabase-js";

// Interface for sign-up data
export interface SignUpData {
  email: string;
  password: string;
  name: string;
  metadata?: Record<string, any>;
}

// Interface for login data
export interface LoginData {
  email: string;
  password: string;
}

// Interface for user profile with role
export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string; // Changed from 'user' | 'admin' to string to match Supabase
}

// Sign up a new user
export const signUp = async ({ email, password, name, metadata = {} }: SignUpData): Promise<AuthResponse> => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        ...metadata
      }
    }
  });
};

// Sign in a user
export const signIn = async ({ email, password }: LoginData): Promise<AuthResponse> => {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
};

// Sign out a user
export const signOut = async (): Promise<{ error: Error | null }> => {
  return await supabase.auth.signOut();
};

// Reset password
export const resetPassword = async (email: string): Promise<{ data: any, error: Error | null }> => {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
};

// Update password
export const updatePassword = async (newPassword: string): Promise<{ data: any, error: Error | null }> => {
  return await supabase.auth.updateUser({ password: newPassword });
};

// Get the current session
export const getSession = async (): Promise<{ data: { session: Session | null } }> => {
  return await supabase.auth.getSession();
};

// Get the current user profile
export const getUserProfile = async (userId: string): Promise<{ data: UserProfile | null, error: Error | null }> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, role')
    .eq('id', userId)
    .single();
  
  return { data, error };
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<{ error: Error | null }> => {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  return { error };
};

// Check if user is admin
export const isAdmin = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (error || !data) {
    return false;
  }
  
  return data.role === 'admin';
};

// Listen to auth changes
export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};

// Create user accounts
export const createDefaultUsers = async (): Promise<{success: boolean, message: string}> => {
  try {
    // Create user account
    const { error: userError } = await supabase.auth.admin.createUser({
      email: 'user@example.com',
      password: 'user123',
      email_confirm: true,
      user_metadata: {
        full_name: 'Regular User'
      }
    });
    
    if (userError) throw userError;
    
    // Create admin account
    const { error: adminError } = await supabase.auth.admin.createUser({
      email: 'admin@example.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        full_name: 'Admin User'
      }
    });
    
    if (adminError) throw adminError;
    
    // Set admin role for admin user
    const { data: adminUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'admin@example.com')
      .single();
    
    if (adminUser) {
      await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', adminUser.id);
    }
    
    return { success: true, message: 'Default users created successfully' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
