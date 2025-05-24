
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { supabase } from "@/integrations/supabase/client";
import { getOrCreateUserProfile, signOut } from "@/services/auth/authService";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HeaderLogo from "./HeaderLogo";
import HeaderDesktopNav from "./HeaderDesktopNav";
import HeaderDesktopActions from "./HeaderDesktopActions";
import HeaderMobileMenu from "./HeaderMobileMenu";

const Header = () => {
  const { setIsAuthenticated, setUser, isAuthenticated, user } = useGlobalContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Helper function to safely fetch or create user profile
  const fetchOrCreateUserProfile = (userId: string, userMetadata?: any) => {
    const userData = {
      full_name: userMetadata?.full_name || userMetadata?.name || '',
      email: userMetadata?.email || ''
    };
    
    getOrCreateUserProfile(userId, userData).then(({ data, error }) => {
      if (error) {
        console.error("Error fetching/creating user profile:", error);
        return;
      }
      
      if (data) {
        setUser({
          id: userId,
          name: data.full_name || '',
          email: userData.email || '',
          role: data.role || 'user',
          avatar: data.avatar_url || undefined,
        });
      }
    }).catch(err => {
      console.error("Error in fetchOrCreateUserProfile:", err);
    });
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Check and set auth state on page load
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        // Use setTimeout to avoid Supabase auth deadlock
        setTimeout(() => {
          fetchOrCreateUserProfile(session.user.id, session.user.user_metadata);
        }, 0);
      }
    });
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const isAuth = !!session;
        setIsAuthenticated(isAuth);
        
        if (session?.user) {
          // Use setTimeout to avoid Supabase auth deadlock
          setTimeout(() => {
            fetchOrCreateUserProfile(session.user.id, session.user.user_metadata);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [setIsAuthenticated, setUser]);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        {/* Logo */}
        <HeaderLogo />

        {/* Desktop Navigation */}
        <HeaderDesktopNav />

        {/* Auth Buttons - Top Priority */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Welcome, {user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button size="sm" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* Desktop Actions */}
        <HeaderDesktopActions />

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-full hover:bg-muted transition-colors"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu */}
        <HeaderMobileMenu 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
        />
      </div>
    </header>
  );
};

export default Header;
