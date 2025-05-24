
import { supabase } from "@/integrations/supabase/client";

export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test 1: Check if client is working
    const { data: { session } } = await supabase.auth.getSession();
    console.log('📱 Auth session:', session ? 'Active' : 'No session');
    
    // Test 2: Try to fetch books
    console.log('📚 Fetching books from Supabase...');
    const { data: books, error: booksError, count } = await supabase
      .from('books')
      .select('*', { count: 'exact' })
      .limit(5);
    
    if (booksError) {
      console.error('❌ Error fetching books:', booksError);
      return { success: false, error: booksError.message };
    }
    
    console.log('✅ Books fetched successfully:', books);
    console.log('📊 Total books count:', count);
    
    // Test 3: Try to fetch categories
    console.log('🏷️ Fetching categories from Supabase...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');
    
    if (categoriesError) {
      console.error('❌ Error fetching categories:', categoriesError);
    } else {
      console.log('✅ Categories fetched successfully:', categories);
    }
    
    // Test 4: Try to fetch profiles
    console.log('👤 Fetching profiles from Supabase...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(3);
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
    } else {
      console.log('✅ Profiles fetched successfully:', profiles);
    }
    
    return { 
      success: true, 
      data: { 
        books: books || [], 
        categories: categories || [], 
        profiles: profiles || [],
        booksCount: count 
      } 
    };
    
  } catch (error) {
    console.error('💥 Supabase connection test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Run the test automatically when this module is imported
testSupabaseConnection();
