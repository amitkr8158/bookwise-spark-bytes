
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
  useSalesNotifications,
  Quote
} from "@/services/configService";
import { Review as ServiceReview } from "@/services/reviews/reviewService";
import { Review } from "@/components/reviews/ReviewCard";

const AdminTabs: React.FC = () => {
  const { 
    reviews: serviceReviews, 
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

  // Convert service reviews to the format expected by ReviewManager
  const reviews: Review[] = serviceReviews.map(review => ({
    id: review.id,
    userId: review.user_id,
    bookId: review.book_id,
    userName: review.user_name || 'Anonymous',
    userAvatar: undefined,
    rating: review.rating,
    content: review.review_text || '',
    createdAt: new Date(review.created_at),
    isVisible: review.is_visible || false,
    isTopReview: review.is_top_review || false
  }));

  // Create an adapter function to transform the Quote into id and partial quote
  const handleEditQuote = (quote: Quote) => {
    const { id, ...quoteData } = quote;
    updateQuote(id, quoteData);
  };

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
          onEditQuote={handleEditQuote}
          onDeleteQuote={deleteQuote}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
