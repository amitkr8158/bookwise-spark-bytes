
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { usePageViewTracking } from "@/hooks/useAnalytics";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, Lock, AlertCircle, Eye, EyeOff, Shield } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signIn, getUserProfile, createTestUsers } from "@/services/auth/authService";

// Schema for admin login form validation
const adminLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const AdminLogin = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser, isAuthenticated, user } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Track page view
  usePageViewTracking('/admin-login', 'Admin Login');
  
  // Redirect if already authenticated and is admin/controller
  useEffect(() => {
    if (isAuthenticated && user?.role && ['admin', 'controller'].includes(user.role)) {
      navigate('/admin');
    } else if (isAuthenticated && user?.role === 'user') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAuthenticated, user, navigate, toast]);
  
  // Login form
  const form = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Handle login form submission
  const onSubmit = async (data: z.infer<typeof adminLoginSchema>) => {
    setIsLoading(true);
    
    try {
      const { data: authData, error } = await signIn({ 
        email: data.email, 
        password: data.password 
      });
      
      if (error) {
        if (error.message?.includes("Email not confirmed")) {
          throw new Error("Your email has not been verified. Please check your inbox for a verification email.");
        }
        throw error;
      }
      
      if (authData.user) {
        // Get user profile data to check role
        const { data: profileData, error: profileError } = await getUserProfile(authData.user.id);
        
        if (profileError) {
          console.error("Profile error:", profileError);
          throw new Error("Failed to load user profile");
        }
        
        // Check if user has admin or controller role
        if (!profileData || !['admin', 'controller'].includes(profileData.role || 'user')) {
          // Sign out the user since they don't have the right permissions
          await signIn({ email: '', password: '' }); // This will effectively sign them out
          throw new Error("Access denied. Admin or Controller privileges required.");
        }
        
        setIsAuthenticated(true);
        setUser({
          id: authData.user.id,
          name: profileData?.full_name || authData.user.email?.split('@')[0] || '',
          email: authData.user.email || '',
          role: profileData?.role || 'user',
          avatar: profileData?.avatar_url || undefined,
        });
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${profileData?.full_name || 'Admin'}!`,
        });
        
        navigate('/admin');
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      
      // Special handling for test accounts
      if ((data.email === "admin@example.com" || data.email === "controller@example.com") && 
          data.password === "TestPass123!") {
        toast({
          title: "Creating test accounts",
          description: "Setting up the admin/controller test accounts for you...",
        });
        
        const { success, message } = await createTestUsers();
        
        if (success) {
          toast({
            title: "Test Accounts Ready",
            description: "Please try logging in again.",
          });
        } else {
          toast({
            title: "Login Failed",
            description: message || "Could not create test accounts. Please check Supabase settings.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Login Failed",
          description: error.message || "Invalid credentials or insufficient permissions.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container max-w-md mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-serif font-bold mb-2">Admin & Controller Access</h1>
            <p className="text-muted-foreground">
              Restricted access for authorized personnel only
            </p>
          </div>
          
          <div className="border rounded-lg p-6 shadow-sm bg-card">
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This login is exclusively for Admin and Controller accounts. Regular users should use the main login page.
              </AlertDescription>
            </Alert>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="admin@example.com" 
                            className="pl-10" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••" 
                            className="pl-10 pr-10" 
                            {...field} 
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Authenticating..." : "Login to Admin Panel"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center text-sm">
              <p>
                Regular user?{' '}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Use regular login
                </Link>
              </p>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-center text-muted-foreground mb-3">Test Accounts:</p>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" onClick={() => {
                  form.setValue('email', 'admin@example.com');
                  form.setValue('password', 'TestPass123!');
                }}>
                  Use Admin Account
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  form.setValue('email', 'controller@example.com');
                  form.setValue('password', 'TestPass123!');
                }}>
                  Use Controller Account
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Password: TestPass123!
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminLogin;
