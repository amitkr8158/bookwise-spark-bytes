
import { PostgrestError, createClient } from '@supabase/supabase-js';
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
    // Get list of public tables
    const { data: tablesList, error: tablesError } = await supabase.rpc('get_tables');
    
    if (tablesError) throw tablesError;
    
    if (!tablesList || tablesList.length === 0) {
      return {
        status: 'success',
        message: 'No tables found in the public schema.',
        data: {},
      };
    }
    
    // Get row counts for each table
    const counts: Record<string, number> = {};
    for (const table of tablesList) {
      const { data: countData, error: countError } = await supabase
        .from(table as string)
        .select('count');
      
      if (countError) {
        counts[table as string] = -1; // Error counting
      } else {
        counts[table as string] = countData ? countData.length : 0;
      }
    }
    
    return {
      status: 'success',
      message: `Found ${tablesList.length} tables in the public schema.`,
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
