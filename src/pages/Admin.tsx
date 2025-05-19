
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePageViewTracking } from "@/hooks/useAnalytics";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdminTabs from "@/components/admin/AdminTabs";

const Admin = () => {
  const { t } = useTranslation();
  
  // Track page view
  usePageViewTracking('/admin', 'Admin - Book Management');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your book catalog, reviews, notifications and subscriptions
            </p>
          </div>
          
          <AdminTabs />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
