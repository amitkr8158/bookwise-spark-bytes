
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShoppingCart } from "lucide-react";

export interface SalesNotificationData {
  id: string;
  userName: string;
  userAvatar?: string;
  location?: string;
  bookTitle: string;
  timestamp: Date;
}

interface SalesNotificationProps {
  data?: SalesNotificationData;
  isEnabled: boolean;
  displayDuration?: number; // in milliseconds
}

const SalesNotification: React.FC<SalesNotificationProps> = ({ 
  data, 
  isEnabled, 
  displayDuration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Track whether the notification should be shown
  useEffect(() => {
    if (!isEnabled || !data) return;
    
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, displayDuration);
    
    return () => clearTimeout(timer);
  }, [data, isEnabled, displayDuration]);
  
  if (!isEnabled || !data) return null;
  
  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-4 left-4 z-50 max-w-sm"
        >
          <div className="bg-card rounded-lg shadow-lg border p-4 flex items-start gap-3">
            <Avatar>
              <AvatarImage src={data.userAvatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(data.userName)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingCart className="h-3 w-3 text-green-500" />
                <span className="font-medium text-sm">Recent Purchase</span>
              </div>
              
              <p className="text-sm">
                <span className="font-semibold">{data.userName}</span>
                {data.location && <span> from {data.location}</span>} just purchased{" "}
                <span className="font-semibold">{data.bookTitle}</span>
              </p>
              
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(data.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SalesNotification;
