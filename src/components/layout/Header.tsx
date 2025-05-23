
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { supabase } from "@/integrations/supabase/client";
import { getUserProfile } from "@/services/auth/authService";
import HeaderLogo from "./HeaderLogo";
import HeaderDesktopNav from "./HeaderDesktopNav";
import HeaderDesktopActions from "./HeaderDesktopActions";
import HeaderMobileMenu from "./HeaderMobileMenu";

const Header = () => {
  const { setIsAuthenticated, setUser } = useGlobalContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Check and set auth state on page load
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        getUserProfile(session.user.id).then(({ data }) => {
          if (data) {
            setUser({
              id: session.user.id,
              name: data.full_name || session.user.email?.split('@')[0] || '',
              email: session.user.email || '',
              role: data.role || 'user',
              avatar: data.avatar_url || undefined,
            });
          }
        });
      }
    });
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const isAuth = !!session;
        setIsAuthenticated(isAuth);
        
        if (session?.user) {
          setTimeout(() => {
            getUserProfile(session.user.id).then(({ data }) => {
              if (data) {
                setUser({
                  id: session.user.id,
                  name: data.full_name || session.user.email?.split('@')[0] || '',
                  email: session.user.email || '',
                  role: data.role || 'user',
                  avatar: data.avatar_url || undefined,
                });
              }
            });
          }, 0); // Use setTimeout to avoid Supabase auth deadlock
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
