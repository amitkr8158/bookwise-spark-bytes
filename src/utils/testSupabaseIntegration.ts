
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Function to test Supabase connection
export const testSupabaseConnection = async (): Promise<{
  status: 'success' | 'error';
  message: string;
}> => {
  try {
    const { data, error } = await supabase.from('books').select('count').single();
    
    if (error) throw error;
    
    return {
      status: 'success',
      message: 'Successfully connected to Supabase!',
    };
  } catch (error) {
    console.error('Supabase connection error:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Function to get information about public tables
export const getTablesInfo = async (): Promise<{
  status: 'success' | 'error';
  message: string;
  data?: Record<string, number>;
}> => {
  try {
    // Get list of public tables using hardcoded table names
    const tables = ['book_reviews', 'books', 'bookmarks', 'categories', 'bundle_books', 'bundles', 'bundle_purchases', 'cart_items', 'carts', 'profiles', 'reading_progress', 'user_preferences', 'user_purchases'];
    
    if (!tables || tables.length === 0) {
      return {
        status: 'success',
        message: 'No tables found in the public schema.',
        data: {},
      };
    }
    
    // Get row counts for each table
    const counts: Record<string, number> = {};
    for (const table of tables) {
      const { data: countData, error: countError } = await supabase
        .from(table)
        .select('count');
      
      if (countError) {
        counts[table] = -1; // Error counting
      } else {
        counts[table] = countData ? countData.length : 0;
      }
    }
    
    return {
      status: 'success',
      message: `Found ${tables.length} tables in the public schema.`,
      data: counts,
    };
  } catch (error) {
    console.error('Error retrieving table information:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Function to get storage buckets
export const getStorageBuckets = async (): Promise<{
  status: 'success' | 'error';
  message: string;
  buckets?: string[];
}> => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) throw error;
    
    return {
      status: 'success',
      message: `Found ${buckets.length} storage buckets.`,
      buckets: buckets.map(bucket => bucket.name),
    };
  } catch (error) {
    console.error('Error retrieving storage buckets:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Function to test auth functionality
export const testAuth = async (): Promise<{
  status: 'success' | 'error';
  message: string;
}> => {
  try {
    const { data } = await supabase.auth.getSession();
    
    if (data.session) {
      return {
        status: 'success',
        message: `User is authenticated. User ID: ${data.session.user.id}`,
      };
    } else {
      return {
        status: 'success',
        message: 'No active session. User is not authenticated.',
      };
    }
  } catch (error) {
    console.error('Auth test error:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Function for testing full auth flow
export const testAuthFlow = async (email: string, password: string): Promise<Record<string, { success: boolean; message: string }>> => {
  const results: Record<string, { success: boolean; message: string }> = {};
  
  // Test signup
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      results.signup = { success: false, message: error.message };
    } else {
      results.signup = { success: true, message: 'Signup successful or user already exists (check email for confirmation)' };
    }
  } catch (error) {
    results.signup = { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown signup error'
    };
  }
  
  // Test signin
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      results.signin = { success: false, message: error.message };
    } else {
      results.signin = { success: true, message: 'Sign in successful' };
    }
  } catch (error) {
    results.signin = { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown signin error'
    };
  }
  
  // Test profile fetch
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      results.profile = { success: false, message: error?.message || 'No user found' };
    } else {
      results.profile = { success: true, message: `User profile retrieved: ${data.user.email}` };
    }
  } catch (error) {
    results.profile = { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown profile error'
    };
  }
  
  return results;
};

// Add test functions for each table
export const testBooksTable = async (): Promise<{
  status: 'success' | 'error';
  message: string;
  count?: number;
}> => {
  try {
    const { data, error } = await supabase.from('books').select('id');
    
    if (error) throw error;
    
    return {
      status: 'success',
      message: `Books table exists with ${data?.length || 0} records.`,
      count: data?.length || 0,
    };
  } catch (error) {
    console.error('Books table test error:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
