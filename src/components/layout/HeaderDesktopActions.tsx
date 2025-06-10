
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { Button } from "@/components/ui/button";
import { Search, Moon, Sun, Globe, ShoppingCart, Settings } from "lucide-react";
import UserDropdownMenu from "./UserDropdownMenu";

const HeaderDesktopActions = () => {
  const { t } = useTranslation();
  const { language, setLanguage, theme, setTheme, isDarkMode, isAuthenticated, user } = useGlobalContext();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleTheme = () => setTheme(isDarkMode ? 'light' : 'dark');
  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en');

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleAdminClick = () => {
    navigate('/admin-login');
  };

  return (
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
              <button
                onClick={toggleSearch}
                className="text-muted-foreground"
              >
                ✕
              </button>
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

      {/* Admin/Controller Login */}
      <button onClick={handleAdminClick} className="p-2 rounded-full hover:bg-muted transition-colors" title="Admin/Controller Login">
        <Settings className="h-5 w-5" />
      </button>

      {/* Auth */}
      {isAuthenticated && user ? (
        <UserDropdownMenu user={user} />
      ) : (
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleLoginClick}>
            {t('user.login')}
          </Button>
          <Button variant="default" size="sm" onClick={handleSignupClick}>
            {t('user.signup')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default HeaderDesktopActions;
