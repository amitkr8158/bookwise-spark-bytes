
/**
 * Central export file for all services
 */

// Re-export everything from each service file
export * from './storage/localStorage';
export * from './notifications/notificationService';
export * from './quotes/quoteService';
export * from './reviews/reviewService';
export * from './auth/authService';
export * from './books/bookService';

// Import React and needed hooks
import React, { useState, useEffect } from 'react';
import { getAllReviews, updateReviewVisibility, updateTopReview, Review } from './reviews/reviewService';

// Define types for settings
export interface NotificationSettings {
  showSalesNotifications: boolean;
  notifyNewReleases: boolean;
  notifyDiscounts: boolean;
  salesNotificationsEnabled: boolean;
  frequency: number;
  realSales: boolean;
  displayDuration: number;
  position: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  minPurchaseAmount: number;
}

export interface SubscriptionSettings {
  dailyEmailEnabled: boolean;
  weeklyDigestEnabled: boolean;
  monthlyNewsletterEnabled: boolean;
  isEnabled: boolean;
  sendTime: string;
  emailSubject: string;
  emailTemplate: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
}

// Custom hook for reviews management in admin panel
export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const data = await getAllReviews();
        setReviews(data);
        setError(null);
      } catch (err) {
        setError('Failed to load reviews');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const toggleReviewVisibility = async (reviewId: string, isVisible: boolean) => {
    try {
      const { success, error } = await updateReviewVisibility(reviewId, isVisible);
      
      if (success) {
        setReviews(prev => 
          prev.map(review => 
            review.id === reviewId ? { ...review, isVisible, is_visible: isVisible } : review
          )
        );
        return { success: true };
      } else {
        throw new Error(error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update review visibility';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const toggleTopReview = async (reviewId: string, isTopReview: boolean) => {
    try {
      const { success, error } = await updateTopReview(reviewId, isTopReview);
      
      if (success) {
        setReviews(prev => 
          prev.map(review => 
            review.id === reviewId ? { ...review, isTopReview, is_top_review: isTopReview } : review
          )
        );
        return { success: true };
      } else {
        throw new Error(error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update top review status';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    reviews,
    loading,
    error,
    toggleReviewVisibility,
    toggleTopReview,
  };
};

// Add hooks for other services that might be needed
export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    showSalesNotifications: true,
    notifyNewReleases: true,
    notifyDiscounts: true,
    salesNotificationsEnabled: true,
    frequency: 60,
    realSales: true,
    displayDuration: 5,
    position: "bottom-right",
    minPurchaseAmount: 0
  });
  
  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  return {
    settings,
    updateSettings
  };
};

export const useSubscriptionSettings = () => {
  const [settings, setSettings] = useState<SubscriptionSettings>({
    dailyEmailEnabled: true,
    weeklyDigestEnabled: true,
    monthlyNewsletterEnabled: false,
    isEnabled: true,
    sendTime: '08:00',
    emailSubject: 'Your Daily BookBites Update',
    emailTemplate: 'default'
  });
  
  const updateSettings = (newSettings: Partial<SubscriptionSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  return {
    settings,
    updateSettings
  };
};

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([
    { id: '1', text: 'The only limit to our realization of tomorrow will be our doubts of today.', author: 'Franklin D. Roosevelt' },
    { id: '2', text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney' },
  ]);
  
  const addQuote = (quote: Quote) => {
    setQuotes(prev => [...prev, { ...quote, id: Date.now().toString() }]);
  };
  
  const updateQuote = (id: string, quote: Partial<Quote>) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, ...quote } : q));
  };
  
  const deleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
  };
  
  return {
    quotes,
    addQuote,
    updateQuote,
    deleteQuote
  };
};

export const useSalesNotifications = () => {
  const [currentNotification, setCurrentNotification] = useState<any>(null);
  
  const showTestNotification = () => {
    setCurrentNotification({
      title: "Flash Sale!",
      message: "Get 30% off on selected books for the next 24 hours!",
      link: "/browse?sale=true"
    });
    
    // Clear notification after 5 seconds
    setTimeout(() => {
      setCurrentNotification(null);
    }, 5000);
  };
  
  return {
    currentNotification,
    showTestNotification
  };
};
