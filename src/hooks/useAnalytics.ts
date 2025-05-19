
import { useEffect } from 'react';

interface EventProps {
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
}

interface PageViewProps {
  path: string;
  title?: string;
}

export const useAnalytics = () => {
  // Track page views
  const trackPageView = ({ path, title }: PageViewProps) => {
    console.log('📊 Analytics: Page view', { path, title });
    
    // Replace with your analytics service
    // Example for Google Analytics:
    // if (window.gtag) {
    //   window.gtag('config', 'GA-TRACKING-ID', {
    //     page_path: path,
    //     page_title: title
    //   });
    // }
  };
  
  // Track events
  const trackEvent = ({ 
    eventCategory, 
    eventAction, 
    eventLabel, 
    eventValue 
  }: EventProps) => {
    console.log('📊 Analytics: Event', { 
      eventCategory, 
      eventAction, 
      eventLabel, 
      eventValue 
    });
    
    // Replace with your analytics service
    // Example for Google Analytics:
    // if (window.gtag) {
    //   window.gtag('event', eventAction, {
    //     event_category: eventCategory,
    //     event_label: eventLabel,
    //     value: eventValue
    //   });
    // }
  };
  
  // Track user engagement
  const trackEngagement = (durationSeconds: number) => {
    console.log('📊 Analytics: Engagement', { durationSeconds });
    
    // Implementation for tracking time spent on site
  };
  
  // Track conversion/purchase
  const trackPurchase = (purchaseData: any) => {
    console.log('📊 Analytics: Purchase', purchaseData);
    
    // Implementation for ecommerce tracking
    // Example for Google Analytics:
    // if (window.gtag) {
    //   window.gtag('event', 'purchase', {
    //     transaction_id: purchaseData.orderId,
    //     value: purchaseData.total,
    //     currency: 'USD',
    //     items: purchaseData.items
    //   });
    // }
  };
  
  return {
    trackPageView,
    trackEvent,
    trackEngagement,
    trackPurchase
  };
};

// Usage example for automatically tracking page views
export const usePageViewTracking = (path: string, title?: string) => {
  const { trackPageView } = useAnalytics();
  
  useEffect(() => {
    trackPageView({ path, title });
  }, [path, title]);
};
