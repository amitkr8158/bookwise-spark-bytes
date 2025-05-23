
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalProvider } from "@/contexts/GlobalContext";

import Index from "./pages/Index";
import Library from "./pages/Library";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Browse from "./pages/Browse";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import BookDetail from "./pages/BookDetail";
import Cart from "./pages/Cart";
import Bundles from "./pages/Bundles";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import SupabaseIntegrationTester from "./components/testing/SupabaseIntegrationTester";

// Import SalesNotification component and services
import SalesNotification from "@/components/notifications/SalesNotification";
import { useSalesNotifications, useNotificationSettings } from "@/services/configService";

const queryClient = new QueryClient();

const AppContent = () => {
  // Sales notification setup
  const { currentNotification } = useSalesNotifications();
  const { settings } = useNotificationSettings();
  
  return (
    <>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/library" element={<Library />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/bundles" element={<Bundles />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/test" element={<SupabaseIntegrationTester />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        
        {/* Sales Notification Component */}
        <SalesNotification 
          data={currentNotification} 
          isEnabled={settings.salesNotificationsEnabled}
          displayDuration={settings.displayDuration * 1000}
        />
      </TooltipProvider>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GlobalProvider>
      <AppContent />
    </GlobalProvider>
  </QueryClientProvider>
);

export default App;
