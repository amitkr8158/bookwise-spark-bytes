
import { supabase } from "@/integrations/supabase/client";
import { signIn, signUp, signOut, getUserProfile, updateUserProfile } from "@/services/auth/authService";
import { getBooks, getBookById, createBook } from "@/services/books/bookService";

/**
 * Utility to test Supabase integration functionality
 */
export const testSupabaseIntegration = async () => {
  const testResults: Record<string, { success: boolean; message: string }> = {};
  
  console.log("🧪 Starting Supabase integration tests");
  
  // Test 1: Authentication session
  try {
    const { data } = await supabase.auth.getSession();
    testResults.session = {
      success: true, 
      message: data.session ? "User is authenticated" : "No active session"
    };
    console.log("✅ Session test:", testResults.session.message);
  } catch (error: any) {
    testResults.session = { success: false, message: error.message };
    console.error("❌ Session test failed:", error.message);
  }
  
  // Test 2: Get books
  try {
    const { books, error } = await getBooks({ limit: 5 });
    testResults.getBooks = { 
      success: !error, 
      message: error ? error.toString() : `Retrieved ${books?.length || 0} books`
    };
    console.log("✅ Get books test:", testResults.getBooks.message);
  } catch (error: any) {
    testResults.getBooks = { success: false, message: error.message };
    console.error("❌ Get books test failed:", error.message);
  }
  
  // Log test results summary
  console.log("📊 Supabase integration test summary:", testResults);
  // Use the URL directly from the client configuration to avoid process.env issues
  console.log("🔗 Supabase connection URL:", "https://xqwmpmsxvhdsscvcmgxi.supabase.co");
  
  return testResults;
};

/**
 * Tests the authentication flow
 * @param email User email
 * @param password User password
 */
export const testAuthFlow = async (email: string, password: string) => {
  const testResults: Record<string, { success: boolean; message: string }> = {};
  
  console.log("🧪 Testing authentication flow");
  
  // Test 1: Sign up
  try {
    const { data, error } = await signUp({ 
      email,
      password,
      name: "Test User"
    });
    
    testResults.signup = { 
      success: !error, 
      message: error ? error.message : "Signup successful"
    };
    console.log("✅ Signup test:", testResults.signup.message);
  } catch (error: any) {
    testResults.signup = { success: false, message: error.message };
    console.error("❌ Signup test failed:", error.message);
  }
  
  // Test 2: Sign in
  try {
    const { data, error } = await signIn({ email, password });
    
    testResults.signin = { 
      success: !error, 
      message: error ? error.message : "Login successful"
    };
    console.log("✅ Login test:", testResults.signin.message);
    
    // If login successful, test user profile retrieval
    if (data.user) {
      const { data: profile, error: profileError } = await getUserProfile(data.user.id);
      testResults.profile = { 
        success: !profileError, 
        message: profileError ? profileError.message : "Profile retrieved"
      };
      console.log("✅ Profile test:", testResults.profile.message, profile);
    }
  } catch (error: any) {
    testResults.signin = { success: false, message: error.message };
    console.error("❌ Login test failed:", error.message);
  }
  
  // Log test results summary
  console.log("📊 Authentication flow test summary:", testResults);
  
  return testResults;
};
