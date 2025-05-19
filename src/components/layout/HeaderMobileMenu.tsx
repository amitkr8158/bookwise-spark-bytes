
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { Search, Moon, Sun, Globe, User, Settings, Book } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderMobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const HeaderMobileMenu = ({ isMenuOpen, setIsMenuOpen }: HeaderMobileMenuProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { language, setLanguage, theme, setTheme, isDarkMode, isAuthenticated, user } = useGlobalContext();
  
  const toggleTheme = () => setTheme(isDarkMode ? 'light' : 'dark');
  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en');
  
  // Function to check if current path matches
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  // Get initials for avatar
  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  if (!isMenuOpen) return null;
  
  return (
    <div className="fixed inset-0 top-16 z-50 bg-background md:hidden animate-fade-in">
      <div className="container p-6 flex flex-col gap-6">
        <nav className="flex flex-col gap-4">
          <Link 
            to="/" 
            className={cn(
              "text-lg font-medium",
              isActive('/') ? "text-book-700 font-semibold" : ""
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            {t('nav.home')}
          </Link>
          <Link 
            to="/browse" 
            className={cn(
              "text-lg font-medium",
              isActive('/browse') ? "text-book-700 font-semibold" : ""
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            {t('nav.browse')}
          </Link>
          <Link 
            to="/categories" 
            className={cn(
              "text-lg font-medium",
              isActive('/categories') || isActive('/category/') ? "text-book-700 font-semibold" : ""
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            {t('nav.categories')}
          </Link>
          <Link 
            to="/bundles" 
            className={cn(
              "text-lg font-medium",
              isActive('/bundles') ? "text-book-700 font-semibold" : ""
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            {t('nav.bundles')}
          </Link>
          <Link 
            to="/library" 
            className={cn(
              "text-lg font-medium",
              isActive('/library') ? "text-book-700 font-semibold" : ""
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            {t('nav.library')}
          </Link>
        </nav>
        
        <div className="flex flex-col gap-4">
          {/* Mobile Search */}
          <div className="relative">
            <div className="flex items-center border rounded-md px-3 py-2">
              <Search className="h-4 w-4 mr-2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('nav.search')}
                className="flex-1 bg-transparent border-none focus:outline-none"
              />
            </div>
          </div>
          
          {/* Mobile Actions */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex gap-4">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full hover:bg-muted transition-colors flex items-center gap-2"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              
              {/* Language Toggle */}
              <button 
                onClick={toggleLanguage} 
                className="p-2 rounded-full hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Globe className="h-5 w-5" />
                <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
              </button>
            </div>
          </div>
          
          {/* Mobile Auth */}
          {isAuthenticated && user ? (
            <div className="flex flex-col gap-2 border-t pt-4">
              <div className="flex items-center gap-3 p-2">
                <Avatar className="h-10 w-10">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Link 
                to="/profile" 
                className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>{t('user.profile')}</span>
              </Link>
              <Link 
                to="/library" 
                className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <Book className="h-5 w-5" />
                <span>{t('nav.library')}</span>
              </Link>
              {user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span>{t('nav.admin')}</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2 border-t pt-4">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full" variant="outline">
                  {t('user.login')}
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">
                  {t('user.signup')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderMobileMenu;
