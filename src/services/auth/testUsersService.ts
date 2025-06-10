
import { supabase } from "@/integrations/supabase/client";

// Test user creation service
export const createTestUsers = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log("Creating test users...");
    
    // Test users data
    const testUsers = [
      {
        email: "customer@example.com",
        password: "TestPass123!",
        fullName: "Test Customer",
        role: "user"
      },
      {
        email: "admin@example.com", 
        password: "TestPass123!",
        fullName: "Test Admin",
        role: "admin"
      },
      {
        email: "controller@example.com",
        password: "TestPass123!", 
        fullName: "Test Controller",
        role: "controller"
      }
    ];

    const results = [];
    
    for (const user of testUsers) {
      try {
        // Try to sign up the user
        const { data, error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: {
              full_name: user.fullName
            }
          }
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            console.log(`User ${user.email} already exists`);
            
            // Try to update the profile role if user exists
            try {
              // First, get the user ID by signing them in temporarily
              const { data: signInData } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: user.password
              });
              
              if (signInData.user) {
                // Update the profile role
                const { error: updateError } = await supabase
                  .from('profiles')
                  .update({ role: user.role, full_name: user.fullName })
                  .eq('id', signInData.user.id);
                
                if (updateError) {
                  console.error(`Error updating profile for ${user.email}:`, updateError);
                }
                
                // Sign out immediately
                await supabase.auth.signOut();
              }
            } catch (updateError) {
              console.error(`Error updating existing user ${user.email}:`, updateError);
            }
            
            results.push({ email: user.email, status: "exists" });
          } else {
            console.error(`Error creating user ${user.email}:`, error);
            results.push({ email: user.email, status: "error", error: error.message });
          }
        } else {
          console.log(`Successfully created user: ${user.email}`);
          results.push({ email: user.email, status: "created" });
          
          // Update the profile with the correct role
          if (data.user) {
            try {
              const { error: profileError } = await supabase
                .from('profiles')
                .update({ role: user.role })
                .eq('id', data.user.id);
              
              if (profileError) {
                console.error(`Error setting role for ${user.email}:`, profileError);
              }
            } catch (profileError) {
              console.error(`Error updating profile for ${user.email}:`, profileError);
            }
          }
        }
      } catch (err) {
        console.error(`Unexpected error for user ${user.email}:`, err);
        results.push({ email: user.email, status: "error", error: String(err) });
      }
    }

    console.log("Test user creation results:", results);
    
    return {
      success: true,
      message: `Test users processed. Created/Updated: ${results.length} users.`
    };

  } catch (error) {
    console.error("Error in createTestUsers:", error);
    return {
      success: false,
      message: `Failed to create test users: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
