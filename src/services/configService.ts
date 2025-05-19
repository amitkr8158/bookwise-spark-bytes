
import { useState, useEffect } from "react";
import { NotificationSettings } from "@/components/admin/NotificationManager";
import { SubscriptionSettings } from "@/components/admin/SubscriptionManager";
import { Quote } from "@/components/subscription/DailyQuote";
import { Review } from "@/components/reviews/ReviewCard";
import { SalesNotificationData } from "@/components/notifications/SalesNotification";
import { v4 as uuidv4 } from "uuid";

// Default notification settings
const defaultNotificationSettings: NotificationSettings = {
  salesNotificationsEnabled: true,
  frequency: 60, // seconds
  realSales: false,
  displayDuration: 5, // seconds
  position: "bottom-left",
  minPurchaseAmount: 0,
};

// Default subscription settings
const defaultSubscriptionSettings: SubscriptionSettings = {
  isEnabled: true,
  sendTime: "09:00",
  emailSubject: "Your Daily Inspiration - Quote of the Day",
  emailTemplate: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Your Daily Quote</h2>
      <blockquote style="border-left: 4px solid #8B5CF6; padding-left: 16px; font-style: italic;">
        <p>{{QUOTE}}</p>
      </blockquote>
      <p style="text-align: right; font-weight: 500;">— {{AUTHOR}}{{#SOURCE}}, {{SOURCE}}{{/SOURCE}}</p>
      <p>Stay inspired and keep reading!</p>
      <hr />
      <p style="font-size: 12px; color: #666;">
        You received this email because you're subscribed to our daily quotes.
        <a href="#">Unsubscribe</a>
      </p>
    </div>
  `,
};

// Sample quotes
const sampleQuotes: Quote[] = [
  {
    id: uuidv4(),
    text: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
  },
  {
    id: uuidv4(),
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
  },
  {
    id: uuidv4(),
    text: "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs",
    source: "Stanford Commencement Address"
  },
  {
    id: uuidv4(),
    text: "It is never too late to be what you might have been.",
    author: "George Eliot",
  },
  {
    id: uuidv4(),
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu",
  }
];

// Sample reviews
export const sampleReviews: Review[] = [
  {
    id: uuidv4(),
    userId: "user1",
    bookId: "atomic-habits",
    userName: "Sarah Johnson",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    content: "Absolutely transformative! This book summary gave me all the key insights without having to read the entire book. I've already started implementing the tiny habits technique and seeing results.",
    createdAt: new Date("2023-06-15"),
    isVisible: true,
    isTopReview: true
  },
  {
    id: uuidv4(),
    userId: "user2",
    bookId: "atomic-habits",
    userName: "Michael Chen",
    userAvatar: "https://i.pravatar.cc/150?img=3",
    rating: 4,
    content: "Very practical advice condensed into an easy-to-digest format. The audio version was particularly well-narrated.",
    createdAt: new Date("2023-08-03"),
    isVisible: true,
    isTopReview: false
  },
  {
    id: uuidv4(),
    userId: "user3",
    bookId: "thinking-fast-and-slow",
    userName: "David Wilson",
    userAvatar: "https://i.pravatar.cc/150?img=8",
    rating: 5,
    content: "The concepts of System 1 and System 2 thinking have completely changed how I make decisions. This summary captured the essence of the book beautifully.",
    createdAt: new Date("2023-07-22"),
    isVisible: true,
    isTopReview: true
  },
  {
    id: uuidv4(),
    userId: "user4",
    bookId: "zero-to-one",
    userName: "Lisa Rodriguez",
    userAvatar: "https://i.pravatar.cc/150?img=5",
    rating: 3,
    content: "Some interesting points about startup culture, but I felt like the summary could have been more comprehensive. Still worth the read though.",
    createdAt: new Date("2023-05-14"),
    isVisible: false,
    isTopReview: false
  },
  {
    id: uuidv4(),
    userId: "user5",
    bookId: "zero-to-one",
    userName: "Alex Thompson",
    userAvatar: "https://i.pravatar.cc/150?img=4",
    rating: 5,
    content: "Thiel's contrarian questions are game-changers for entrepreneurs. The video summary was especially helpful in visualizing the concepts.",
    createdAt: new Date("2023-09-01"),
    isVisible: true,
    isTopReview: true
  }
];

// Sample sales data for notifications
export const sampleSalesData: SalesNotificationData[] = [
  {
    id: uuidv4(),
    userName: "John Smith",
    userAvatar: "https://i.pravatar.cc/150?img=68",
    location: "New York",
    bookTitle: "Atomic Habits",
    timestamp: new Date(Date.now() - 1000 * 60 * 2) // 2 minutes ago
  },
  {
    id: uuidv4(),
    userName: "Emma Davis",
    userAvatar: "https://i.pravatar.cc/150?img=47",
    location: "London",
    bookTitle: "Zero to One",
    timestamp: new Date(Date.now() - 1000 * 60 * 7) // 7 minutes ago
  },
  {
    id: uuidv4(),
    userName: "Mohammed Ali",
    userAvatar: "https://i.pravatar.cc/150?img=12",
    location: "Dubai",
    bookTitle: "Thinking Fast and Slow",
    timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
  },
  {
    id: uuidv4(),
    userName: "Sofia Garcia",
    userAvatar: "https://i.pravatar.cc/150?img=23",
    location: "Madrid",
    bookTitle: "Atomic Habits",
    timestamp: new Date(Date.now() - 1000 * 60 * 23) // 23 minutes ago
  }
];

// Local Storage Keys
const NOTIFICATION_SETTINGS_KEY = "book_platform_notification_settings";
const SUBSCRIPTION_SETTINGS_KEY = "book_platform_subscription_settings";
const QUOTES_KEY = "book_platform_quotes";
const REVIEWS_KEY = "book_platform_reviews";

// Save and retrieve data from localStorage
const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
  }
};

const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving from localStorage: ${error}`);
    return defaultValue;
  }
};

// Hooks for managing notification settings
export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>(() =>
    getFromLocalStorage(NOTIFICATION_SETTINGS_KEY, defaultNotificationSettings)
  );

  useEffect(() => {
    saveToLocalStorage(NOTIFICATION_SETTINGS_KEY, settings);
  }, [settings]);

  return {
    settings,
    updateSettings: (newSettings: NotificationSettings) => {
      setSettings(newSettings);
    },
  };
};

// Hooks for managing subscription settings
export const useSubscriptionSettings = () => {
  const [settings, setSettings] = useState<SubscriptionSettings>(() =>
    getFromLocalStorage(SUBSCRIPTION_SETTINGS_KEY, defaultSubscriptionSettings)
  );

  useEffect(() => {
    saveToLocalStorage(SUBSCRIPTION_SETTINGS_KEY, settings);
  }, [settings]);

  return {
    settings,
    updateSettings: (newSettings: SubscriptionSettings) => {
      setSettings(newSettings);
    },
  };
};

// Hooks for managing quotes
export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>(() =>
    getFromLocalStorage(QUOTES_KEY, sampleQuotes)
  );

  useEffect(() => {
    saveToLocalStorage(QUOTES_KEY, quotes);
  }, [quotes]);

  const addQuote = (quote: Omit<Quote, "id">) => {
    const newQuote = { ...quote, id: uuidv4() };
    setQuotes([newQuote, ...quotes]);
    return newQuote;
  };

  const updateQuote = (quote: Quote) => {
    setQuotes(quotes.map(q => (q.id === quote.id ? quote : q)));
  };

  const deleteQuote = (quoteId: string) => {
    setQuotes(quotes.filter(q => q.id !== quoteId));
  };

  const getRandomQuote = (): Quote => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  return {
    quotes,
    addQuote,
    updateQuote,
    deleteQuote,
    getRandomQuote,
  };
};

// Hooks for managing reviews
export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>(() =>
    getFromLocalStorage("book_platform_reviews", sampleReviews)
  );

  useEffect(() => {
    saveToLocalStorage("book_platform_reviews", reviews);
  }, [reviews]);

  const addReview = (review: Omit<Review, "id" | "createdAt" | "isVisible" | "isTopReview">) => {
    const newReview: Review = {
      ...review,
      id: uuidv4(),
      createdAt: new Date(),
      isVisible: true,
      isTopReview: false,
    };
    setReviews([newReview, ...reviews]);
    return newReview;
  };

  const updateReview = (review: Review) => {
    setReviews(reviews.map(r => (r.id === review.id ? review : r)));
  };

  const deleteReview = (reviewId: string) => {
    setReviews(reviews.filter(r => r.id !== reviewId));
  };

  const toggleReviewVisibility = (reviewId: string, isVisible: boolean) => {
    setReviews(
      reviews.map(r => (r.id === reviewId ? { ...r, isVisible } : r))
    );
  };

  const toggleTopReview = (reviewId: string, isTopReview: boolean) => {
    setReviews(
      reviews.map(r => (r.id === reviewId ? { ...r, isTopReview } : r))
    );
  };

  const getReviewsByBookId = (bookId: string) => {
    return reviews.filter(r => r.bookId === bookId);
  };

  const getTopReviews = () => {
    return reviews.filter(r => r.isTopReview && r.isVisible);
  };

  return {
    reviews,
    addReview,
    updateReview,
    deleteReview,
    toggleReviewVisibility,
    toggleTopReview,
    getReviewsByBookId,
    getTopReviews,
  };
};

// Hook for managing sales notifications
export const useSalesNotifications = () => {
  const { settings } = useNotificationSettings();
  const [currentNotification, setCurrentNotification] = useState<SalesNotificationData | undefined>(undefined);

  const generateRandomSale = (): SalesNotificationData => {
    const randomSale = sampleSalesData[Math.floor(Math.random() * sampleSalesData.length)];
    return {
      ...randomSale,
      id: uuidv4(),
      timestamp: new Date(),
    };
  };

  const showTestNotification = () => {
    setCurrentNotification(generateRandomSale());
  };

  useEffect(() => {
    if (!settings.salesNotificationsEnabled) return;

    const timer = setInterval(() => {
      // Only show notifications randomly
      if (Math.random() > 0.3) return; // 30% chance of showing notification
      setCurrentNotification(generateRandomSale());
    }, settings.frequency * 1000);

    return () => clearInterval(timer);
  }, [settings.salesNotificationsEnabled, settings.frequency]);

  return {
    currentNotification,
    showTestNotification,
  };
};

// Daily quote hook
export const useDailyQuote = () => {
  const { quotes, getRandomQuote } = useQuotes();
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);

  useEffect(() => {
    // Get or set daily quote
    const storedQuoteData = localStorage.getItem('daily_quote');
    const today = new Date().toDateString();
    
    if (storedQuoteData) {
      const { quote, date } = JSON.parse(storedQuoteData);
      if (date === today) {
        setDailyQuote(quote);
        return;
      }
    }
    
    // Set new daily quote
    if (quotes.length > 0) {
      const newQuote = getRandomQuote();
      setDailyQuote(newQuote);
      localStorage.setItem('daily_quote', JSON.stringify({
        quote: newQuote,
        date: today
      }));
    }
  }, [quotes]);

  return { dailyQuote };
};
