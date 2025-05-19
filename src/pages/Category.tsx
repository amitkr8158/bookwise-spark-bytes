
import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { usePageViewTracking } from "@/hooks/useAnalytics";
import { useBooks } from "@/services/bookService";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookCard from "@/components/books/BookCard";
import { Skeleton } from "@/components/ui/skeleton";

const Category = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { language } = useGlobalContext();
  
  // Track page view
  usePageViewTracking(`/category/${id}`, `Category: ${id}`);
  
  const { books, loading, error } = useBooks({
    language,
    category: id,
    sortBy: "popular",
    limit: 12
  });

  // Get category name based on ID for display purposes
  const getCategoryName = (categoryId: string) => {
    const categories: Record<string, string> = {
      "business": "Business & Finance",
      "psychology": "Psychology",
      "self-help": "Self Improvement",
      "health": "Health & Wellness",
      "science": "Science & Technology",
      "philosophy": "Philosophy",
    };
    
    return categories[categoryId] || categoryId;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container px-4 py-12">
          <h1 className="text-3xl font-serif font-bold mb-2">
            {getCategoryName(id || '')}
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Browse summaries in the {getCategoryName(id || '')} category
          </p>
          
          {/* Books grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-64 w-full mb-2" />
                  <Skeleton className="h-6 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12">
              <p>No books found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Category;
