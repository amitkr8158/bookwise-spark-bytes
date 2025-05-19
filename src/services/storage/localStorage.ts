
/**
 * Helper functions for working with localStorage
 */

// Save and retrieve data from localStorage
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
  }
};

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving from localStorage: ${error}`);
    return defaultValue;
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  NOTIFICATION_SETTINGS: "book_platform_notification_settings",
  SUBSCRIPTION_SETTINGS: "book_platform_subscription_settings",
  QUOTES: "book_platform_quotes",
  REVIEWS: "book_platform_reviews",
  DAILY_QUOTE: "daily_quote"
};
