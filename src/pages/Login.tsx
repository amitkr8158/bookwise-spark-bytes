
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { usePageViewTracking } from "@/hooks/useAnalytics";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, Lock, AlertCircle } from "lucide-react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Schema for login form validation
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Schema for forgot password form validation
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const Login = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  // Track page view
  usePageViewTracking('/login', 'Login');
  
  // Login form
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Forgot password form
  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  
  // Handle login form submission
  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Login data:", data);
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      
      setIsLoading(false);
    }, 1500);
  };
  
  // Handle forgot password form submission
  const onForgotPasswordSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Forgot password data:", data);
      
      toast({
        title: "Password Reset Email Sent",
        description: `Instructions have been sent to ${data.email}`,
      });
      
      setIsLoading(false);
      setResetSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container max-w-md mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2">{t('user.loginTitle')}</h1>
            <p className="text-muted-foreground">
              {t('user.loginSubtitle')}
            </p>
          </div>
          
          <div className="border rounded-lg p-6 shadow-sm bg-card">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('user.email')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="your.email@example.com" 
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
                      <div className="flex justify-between items-center">
                        <FormLabel>{t('user.password')}</FormLabel>
                        <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
                          <DialogTrigger asChild>
                            <Button variant="link" className="px-0 text-sm h-auto" type="button">
                              {t('user.forgotPassword')}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{t('user.resetPassword')}</DialogTitle>
                              <DialogDescription>
                                Enter your email address and we'll send you a link to reset your password.
                              </DialogDescription>
                            </DialogHeader>
                            
                            {resetSent ? (
                              <div className="py-6">
                                <Alert>
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription>
                                    If an account exists with this email, you will receive password reset instructions.
                                  </AlertDescription>
                                </Alert>
                                <Button
                                  className="w-full mt-4"
                                  onClick={() => {
                                    setForgotPasswordOpen(false);
                                    setResetSent(false);
                                    forgotPasswordForm.reset();
                                  }}
                                >
                                  Close
                                </Button>
                              </div>
                            ) : (
                              <Form {...forgotPasswordForm}>
                                <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
                                  <FormField
                                    control={forgotPasswordForm.control}
                                    name="email"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                          <Input placeholder="your.email@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <DialogFooter>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      onClick={() => setForgotPasswordOpen(false)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button type="submit" disabled={isLoading}>
                                      {isLoading ? "Sending..." : "Send Reset Link"}
                                    </Button>
                                  </DialogFooter>
                                </form>
                              </Form>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-10" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('user.loggingIn') : t('user.login')}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center text-sm">
              <p>
                {t('user.noAccount')}{' '}
                <Link to="/signup" className="font-semibold text-primary hover:underline">
                  {t('user.signup')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
