
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewManager from "@/components/admin/ReviewManager";
import NotificationManager from "@/components/admin/NotificationManager";
import SubscriptionManager from "@/components/admin/SubscriptionManager";
import { 
  useReviews, 
  useNotificationSettings, 
  useSubscriptionSettings,
  useQuotes,
  useSalesNotifications
} from "@/services/configService";

const AdminTabs: React.FC = () => {
  const { 
    reviews, 
    toggleReviewVisibility, 
    toggleTopReview 
  } = useReviews();
  
  const { 
    settings: notificationSettings, 
    updateSettings: updateNotificationSettings 
  } = useNotificationSettings();
  
  const { 
    settings: subscriptionSettings, 
    updateSettings: updateSubscriptionSettings 
  } = useSubscriptionSettings();
  
  const { 
    quotes, 
    addQuote, 
    updateQuote, 
    deleteQuote 
  } = useQuotes();
  
  const { showTestNotification } = useSalesNotifications();

  return (
    <Tabs defaultValue="reviews" className="w-full">
      <TabsList className="grid grid-cols-3 w-full mb-8">
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="notifications">Sales Notifications</TabsTrigger>
        <TabsTrigger value="subscriptions">Subscription & Quotes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="reviews" className="space-y-4">
        <ReviewManager 
          reviews={reviews} 
          onToggleVisibility={toggleReviewVisibility}
          onToggleTopReview={toggleTopReview}
        />
      </TabsContent>
      
      <TabsContent value="notifications" className="space-y-4">
        <NotificationManager 
          settings={notificationSettings}
          onSettingsChange={updateNotificationSettings}
          onTestNotification={showTestNotification}
        />
      </TabsContent>
      
      <TabsContent value="subscriptions" className="space-y-4">
        <SubscriptionManager 
          settings={subscriptionSettings}
          quotes={quotes}
          onSettingsChange={updateSubscriptionSettings}
          onAddQuote={addQuote}
          onEditQuote={updateQuote}
          onDeleteQuote={deleteQuote}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
