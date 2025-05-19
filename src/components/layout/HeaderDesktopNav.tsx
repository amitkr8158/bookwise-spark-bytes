
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

const HeaderDesktopNav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  // Function to check if current path matches
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  return (
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
        to="/bundles" 
        className={cn(
          "text-sm font-medium transition-colors",
          isActive('/bundles') ? "text-book-700 font-semibold" : "hover:text-book-700"
        )}
      >
        {t('nav.bundles')}
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
  );
};

export default HeaderDesktopNav;
