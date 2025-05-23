
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
            review.id === reviewId ? { ...review, isTopReview } : review
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
  const [settings, setSettings] = useState({
    showSalesNotifications: true,
    notifyNewReleases: true,
    notifyDiscounts: true
  });
  
  const updateSettings = (newSettings: any) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  return {
    settings,
    updateSettings
  };
};

export const useSubscriptionSettings = () => {
  const [settings, setSettings] = useState({
    dailyEmailEnabled: true,
    weeklyDigestEnabled: true,
    monthlyNewsletterEnabled: false
  });
  
  const updateSettings = (newSettings: any) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  return {
    settings,
    updateSettings
  };
};

export const useQuotes = () => {
  const [quotes, setQuotes] = useState([
    { id: '1', text: 'The only limit to our realization of tomorrow will be our doubts of today.', author: 'Franklin D. Roosevelt' },
    { id: '2', text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney' },
  ]);
  
  const addQuote = (quote: any) => {
    setQuotes(prev => [...prev, { ...quote, id: Date.now().toString() }]);
  };
  
  const updateQuote = (id: string, quote: any) => {
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
  const showTestNotification = () => {
    console.log('Test notification shown');
  };
  
  return {
    showTestNotification
  };
};
