
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { SalesNotificationData } from "@/components/notifications/SalesNotification";
import { NotificationSettings } from "@/components/admin/NotificationManager";
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from "../storage/localStorage";

// Default notification settings
const defaultNotificationSettings: NotificationSettings = {
  salesNotificationsEnabled: true,
  frequency: 60, // seconds
  realSales: false,
  displayDuration: 5, // seconds
  position: "bottom-left",
  minPurchaseAmount: 0,
};

// Sample sales data for notifications
const sampleSalesData: SalesNotificationData[] = [
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

// Hooks for managing notification settings
export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>(() =>
    getFromLocalStorage(STORAGE_KEYS.NOTIFICATION_SETTINGS, defaultNotificationSettings)
  );

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.NOTIFICATION_SETTINGS, settings);
  }, [settings]);

  return {
    settings,
    updateSettings: (newSettings: NotificationSettings) => {
      setSettings(newSettings);
    },
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

export { sampleSalesData };
