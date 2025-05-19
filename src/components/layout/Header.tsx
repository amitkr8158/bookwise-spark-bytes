
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Menu, 
  X, 
  User, 
  Book, 
  Moon, 
  Sun, 
  Globe,
  ShoppingCart
} from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const { t } = useTranslation();
  const { language, setLanguage, theme, setTheme, isDarkMode } = useGlobalContext();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Mock user data - replace with actual auth
  const user = null; // Set to an object when logged in

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleTheme = () => setTheme(isDarkMode ? 'light' : 'dark');
  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en');
  
  // Function to check if current path matches
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Book className="h-6 w-6 text-book-700" />
          <span className="text-xl font-serif font-bold text-book-700">
            {t('app.title')}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={cn(
              "text-sm font-medium transition-colors",
              isActive('/') ? "text-book-700 font-semibold" : "hover:text-book-700"
            )}
          >
            {t('nav.home')}
          </Link>
          <Link 
            to="/browse" 
            className={cn(
              "text-sm font-medium transition-colors",
              isActive('/browse') ? "text-book-700 font-semibold" : "hover:text-book-700"
            )}
          >
            {t('nav.browse')}
          </Link>
          <Link 
            to="/categories" 
            className={cn(
              "text-sm font-medium transition-colors",
              isActive('/categories') || isActive('/category/') ? "text-book-700 font-semibold" : "hover:text-book-700"
            )}
          >
            {t('nav.categories')}
          </Link>
          <Link 
            to="/library" 
            className={cn(
              "text-sm font-medium transition-colors",
              isActive('/library') ? "text-book-700 font-semibold" : "hover:text-book-700"
            )}
          >
            {t('nav.library')}
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search 
              className="h-5 w-5 cursor-pointer hover:text-book-700 transition-colors" 
              onClick={toggleSearch}
            />
            {isSearchOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-background border rounded-md shadow-lg p-2 animate-fade-in">
                <div className="flex items-center">
                  <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t('nav.search')}
                    className="flex-1 bg-transparent border-none focus:outline-none"
                    autoFocus
                  />
                  <X 
                    className="h-4 w-4 text-muted-foreground cursor-pointer" 
                    onClick={toggleSearch}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-muted transition-colors">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Language Toggle */}
          <button onClick={toggleLanguage} className="p-2 rounded-full hover:bg-muted transition-colors">
            <Globe className="h-5 w-5" />
            <span className="sr-only">
              {language === 'en' ? 'Switch to Hindi' : 'अंग्रेज़ी में बदलें'}
            </span>
          </button>

          {/* Cart */}
          <Link to="/cart" className="p-2 rounded-full hover:bg-muted transition-colors">
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {/* Auth */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile">{t('user.profile')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/library">{t('nav.library')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/logout">{t('user.logout')}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  {t('user.login')}
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="default" size="sm">
                  {t('user.signup')}
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-full hover:bg-muted transition-colors"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
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
                {user ? (
                  <div className="flex flex-col gap-2 border-t pt-4">
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>{t('user.profile')}</span>
                    </Link>
                    <button className="flex items-center gap-2 p-2 hover:bg-muted rounded-md text-left">
                      <span>{t('user.logout')}</span>
                    </button>
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
        )}
      </div>
    </header>
  );
};

export default Header;
