
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePageViewTracking } from "@/hooks/useAnalytics";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategorySection from "@/components/sections/CategorySection";

const Categories = () => {
  const { t } = useTranslation();
  
  // Track page view
  usePageViewTracking('/categories', 'Categories');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container px-4 py-12">
          <h1 className="text-3xl font-serif font-bold mb-8">Browse by Category</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Reuse the categories from CategorySection */}
            <CategorySection fullPage={true} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Categories;
