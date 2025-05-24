
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./types";

// Get the current user profile
export const getUserProfile = async (userId: string): Promise<{ data: UserProfile | null, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role, email')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Database error getting user profile:", error);
      return { data: null, error: new Error(error.message) };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error("Error getting user profile:", error);
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
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
