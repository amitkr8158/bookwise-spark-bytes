
import { supabase } from "@/integrations/supabase/client";
import { SignUpData, LoginData, AuthResponse, Session } from "./types";

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

// Listen to auth changes
export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};
