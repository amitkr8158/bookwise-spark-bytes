
import { supabase } from "@/integrations/supabase/client";
import { signUp } from "./coreAuthService";

// Create test user accounts with stronger passwords
export const createTestUsers = async (): Promise<{success: boolean, message: string}> => {
  try {
    console.log("Creating test users...");
    
    // Use stronger passwords that meet Supabase requirements
    const strongPassword = 'TestPass123!';
    
    // Create customer account
    const { data: customerData, error: createCustomerError } = await signUp({
      email: 'customer@example.com',
      password: strongPassword,
      name: 'Test Customer'
    });
    
    if (createCustomerError && !createCustomerError.message.includes('already registered')) {
      console.error("Error creating customer:", createCustomerError);
    } else {
      console.log("Customer account ready");
      
      // Create profile for customer if user was created
      if (customerData?.user?.id) {
        await supabase
          .from('profiles')
          .upsert({ 
            id: customerData.user.id, 
            full_name: 'Test Customer',
            role: 'user' 
          });
      }
    }
    
    // Create admin account  
    const { data: adminData, error: createAdminError } = await signUp({
      email: 'admin@example.com',
      password: strongPassword,
      name: 'Test Admin'
    });
    
    if (createAdminError && !createAdminError.message.includes('already registered')) {
      console.error("Error creating admin:", createAdminError);
    } else {
      console.log("Admin account ready");
      
      // Create profile for admin if user was created
      if (adminData?.user?.id) {
        await supabase
          .from('profiles')
          .upsert({ 
            id: adminData.user.id, 
            full_name: 'Test Admin',
            role: 'admin' 
          });
      }
    }
    
    return { 
      success: true, 
      message: 'Demo accounts ready! Customer: customer@example.com / TestPass123!, Admin: admin@example.com / TestPass123!' 
    };
  } catch (error: any) {
    console.error("Error in createTestUsers:", error);
    return { success: false, message: error.message };
  }
};

// Fix the createDefaultUsers function to use the new approach
export const createDefaultUsers = createTestUsers;
