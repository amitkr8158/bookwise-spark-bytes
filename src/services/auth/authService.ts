
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
  role: string;
  email?: string;
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
      },
      emailRedirectTo: `${window.location.origin}/login`
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
  try {
    const result = await supabase.auth.updateUser({ password: newPassword });
    return result;
  } catch (error) {
    console.error("Error updating password:", error);
    return { data: null, error: error as Error };
  }
};

// Get the current session
export const getSession = async (): Promise<{ data: { session: Session | null } }> => {
  return await supabase.auth.getSession();
};

// Get the current user profile
export const getUserProfile = async (userId: string): Promise<{ data: UserProfile | null, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role, email')
      .eq('id', userId)
      .single();
    
    if (error) {
      return { data: null, error };
    }
    
    return { data, error };
  } catch (error) {
    console.error("Error getting user profile:", error);
    return { data: null, error: error as Error };
  }
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
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    return data.role === 'admin';
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Listen to auth changes
export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};

// Create test user accounts with admin role
export const createTestUsers = async (): Promise<{success: boolean, message: string}> => {
  try {
    // Using the test accounts with verified emails
    const { error: userError } = await signIn({ 
      email: 'customer@example.com', 
      password: 'password123' 
    });
    
    if (userError) {
      // If login fails, try to create the account
      const { error: createUserError } = await signUp({
        email: 'customer@example.com',
        password: 'password123',
        name: 'Test Customer',
        metadata: { role: 'user' }
      });
      
      if (createUserError) {
        console.error("Error creating customer account:", createUserError);
      }
    }
    
    await signOut();
    
    const { error: adminError } = await signIn({ 
      email: 'admin@example.com', 
      password: 'password123' 
    });
    
    if (adminError) {
      // If login fails, try to create the account
      const { error: createAdminError } = await signUp({
        email: 'admin@example.com',
        password: 'password123',
        name: 'Test Admin',
        metadata: { role: 'admin' }
      });
      
      if (createAdminError) {
        console.error("Error creating admin account:", createAdminError);
      }
    }
    
    return { success: true, message: 'Test users are ready to use. You may need to go to Supabase and manually set the admin role or confirm emails.' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// Fix the createDefaultUsers function to use the new approach
export const createDefaultUsers = createTestUsers;
