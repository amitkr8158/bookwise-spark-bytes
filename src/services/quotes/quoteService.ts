
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Quote } from "@/components/subscription/DailyQuote";
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from "../storage/localStorage";
import { SubscriptionSettings } from "@/components/admin/SubscriptionManager";

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

// Hooks for managing subscription settings
export const useSubscriptionSettings = () => {
  const [settings, setSettings] = useState<SubscriptionSettings>(() =>
    getFromLocalStorage(STORAGE_KEYS.SUBSCRIPTION_SETTINGS, defaultSubscriptionSettings)
  );

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.SUBSCRIPTION_SETTINGS, settings);
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
    getFromLocalStorage(STORAGE_KEYS.QUOTES, sampleQuotes)
  );

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.QUOTES, quotes);
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

// Daily quote hook
export const useDailyQuote = () => {
  const { quotes, getRandomQuote } = useQuotes();
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);

  useEffect(() => {
    // Get or set daily quote
    const storedQuoteData = localStorage.getItem(STORAGE_KEYS.DAILY_QUOTE);
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
      localStorage.setItem(STORAGE_KEYS.DAILY_QUOTE, JSON.stringify({
        quote: newQuote,
        date: today
      }));
    }
  }, [quotes]);

  return { dailyQuote };
};

export { sampleQuotes };
