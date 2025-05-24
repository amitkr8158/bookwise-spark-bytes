
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./types";

// Helper function to handle profile failures with logout
const handleProfileFailure = async (error: any) => {
  console.log("Profile operation failed, logging out and cleaning session:", error);
  
  // Attempt to sign out to clean up the session
  try {
    await supabase.auth.signOut();
  } catch (logoutError) {
    console.error("Error during cleanup logout:", logoutError);
  }
  
  return {
    data: null,
    error: new Error(`Profile operation failed (RLS policy violation): ${error.message}. Session cleaned up.`)
  };
};

// Get the current user profile
export const getUserProfile = async (userId: string): Promise<{ data: UserProfile | null, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error("Database error getting user profile:", error);
      
      // Handle RLS policy violations
      if (error.message?.includes('row-level security policy') || error.message?.includes('permission denied')) {
        return await handleProfileFailure(error);
      }
      
      return { data: null, error: new Error(error.message) };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error("Error getting user profile:", error);
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
};

// Create a new user profile
export const createUserProfile = async (userId: string, userData: { full_name?: string, email?: string }): Promise<{ data: UserProfile | null, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        full_name: userData.full_name || '',
        role: 'user'
      })
      .select('id, full_name, avatar_url, role')
      .single();
    
    if (error) {
      console.error("Database error creating user profile:", error);
      
      // Handle RLS policy violations
      if (error.message?.includes('row-level security policy') || error.message?.includes('permission denied')) {
        return await handleProfileFailure(error);
      }
      
      return { data: null, error: new Error(error.message) };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error("Error creating user profile:", error);
    
    // Handle any unexpected errors as potential RLS violations
    if (error instanceof Error && (error.message?.includes('row-level security') || error.message?.includes('permission denied'))) {
      return await handleProfileFailure(error);
    }
    
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
};

// Get or create user profile
export const getOrCreateUserProfile = async (userId: string, userData?: { full_name?: string, email?: string }): Promise<{ data: UserProfile | null, error: Error | null }> => {
  // First try to get existing profile
  const { data: existingProfile, error: getError } = await getUserProfile(userId);
  
  if (getError) {
    return { data: null, error: getError };
  }
  
  // If profile exists, return it
  if (existingProfile) {
    return { data: existingProfile, error: null };
  }
  
  // If no profile exists, create one
  console.log("No profile found, creating new profile for user:", userId);
  return await createUserProfile(userId, userData || {});
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    
    if (error) {
      // Handle RLS policy violations
      if (error.message?.includes('row-level security policy') || error.message?.includes('permission denied')) {
        await handleProfileFailure(error);
        return { error: new Error(`Profile update failed (RLS policy violation): ${error.message}. Session cleaned up.`) };
      }
    }
    
    return { error };
  } catch (error) {
    // Handle any unexpected errors as potential RLS violations
    if (error instanceof Error && (error.message?.includes('row-level security') || error.message?.includes('permission denied'))) {
      await handleProfileFailure(error);
      return { error: new Error(`Profile update failed (RLS policy violation): ${error.message}. Session cleaned up.`) };
    }
    
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }
};

// Check if user is admin
export const isAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      // Handle RLS policy violations
      if (error.message?.includes('row-level security policy') || error.message?.includes('permission denied')) {
        await handleProfileFailure(error);
      }
      return false;
    }
    
    return data?.role === 'admin';
  } catch (error) {
    console.error("Error checking admin status:", error);
    
    // Handle any unexpected errors as potential RLS violations
    if (error instanceof Error && (error.message?.includes('row-level security') || error.message?.includes('permission denied'))) {
      await handleProfileFailure(error);
    }
    
    return false;
  }
};
