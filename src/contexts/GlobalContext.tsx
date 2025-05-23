
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi';
type Theme = 'light' | 'dark' | 'system';

// User roles - changed to string to match Supabase
export type UserRole = string;

// User profile interface - Now properly exported
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Purchase item interface
interface PurchasedItem {
  id: string;
  title: string;
  type: 'book' | 'bundle';
  coverImage: string;
  purchaseDate: string;
  price: number;
}

interface GlobalContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  // User authentication state
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  // Purchased items
  purchasedItems: PurchasedItem[];
  setPurchasedItems: (items: PurchasedItem[]) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  // Initialize language state
  const [language, setLanguage] = useState<Language>('en');
  
  // Initialize theme state
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'system';
  });
  
  // Track actual dark/light mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // User authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Purchased items
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([]);
  
  // Load user data from localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedPurchasedItems = localStorage.getItem('purchasedItems');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    
    if (savedPurchasedItems) {
      setPurchasedItems(JSON.parse(savedPurchasedItems));
    }
  }, []);
  
  // Save user data to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);
  
  // Save purchased items to localStorage when they change
  useEffect(() => {
    localStorage.setItem('purchasedItems', JSON.stringify(purchasedItems));
  }, [purchasedItems]);
  
  // Set the theme in localStorage and update document class
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  // Effect to handle system theme preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const systemPrefersDark = mediaQuery.matches;
      setIsDarkMode(theme === 'dark' || (theme === 'system' && systemPrefersDark));
    };
    
    handleChange(); // Initial check
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  // Save language preference
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);
  
  const value = {
    language,
    setLanguage,
    theme,
    setTheme,
    isDarkMode,
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    purchasedItems,
    setPurchasedItems
  };
  
  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
