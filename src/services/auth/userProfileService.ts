
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./types";

// Get the current user profile
export const getUserProfile = async (userId: string): Promise<{ data: UserProfile | null, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role')
      .eq('id', userId)
      .maybeSingle(); // Use maybeSingle instead of single to handle no rows
    
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
      return { data: null, error: new Error(error.message) };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error("Error creating user profile:", error);
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
      .maybeSingle(); // Use maybeSingle instead of single
    
    if (error || !data) {
      return false;
    }
    
    return data.role === 'admin';
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};
