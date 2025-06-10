
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useToast } from "@/components/ui/use-toast";
import Header from "./Header";
import Footer from "./Footer";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isAuthenticated } = useGlobalContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is admin or controller
  useEffect(() => {
    const checkAuth = () => {
      // First check if authenticated
      if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access this page",
          variant: "destructive",
        });
        navigate('/admin-login');
        return;
      }
      
      // Then check if admin or controller - with a small delay to ensure user data is loaded
      setTimeout(() => {
        if (!user) {
          // Still loading user data, wait a bit more
          return;
        }
        
        setIsCheckingAuth(false);
        
        if (!['admin', 'controller'].includes(user.role || '')) {
          toast({
            title: "Access Denied",
            description: "You must be an admin or controller to access this page",
            variant: "destructive",
          });
          navigate('/');
        }
      }, 100);
    };
    
    checkAuth();
  }, [isAuthenticated, user, navigate, toast]);

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container py-8 px-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // If not authenticated or not admin/controller, don't render children
  if (!isAuthenticated || (user && !['admin', 'controller'].includes(user.role || ''))) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-8 px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
