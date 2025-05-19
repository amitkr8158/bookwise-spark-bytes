
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { usePageViewTracking } from "@/hooks/useAnalytics";
import { useBooks } from "@/services/bookService";
import { Client as SupabaseClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-react';

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Library as LibraryIcon } from "lucide-react";

const Library = () => {
  const { t } = useTranslation();
  const { language } = useGlobalContext();
  const supabase = createClientComponentClient<SupabaseClient>();
  
  // Track page view
  usePageViewTracking('/library', 'My Library');
  
  // For now, we'll just display some books as if they were in the user's library
  // In a real implementation, we would fetch the user's library from Supabase
  const { 
    books, 
    loading, 
    error 
  } = useBooks({
    language,
    limit: 8,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container px-4 py-12">
          <div className="flex items-center gap-3 mb-6">
            <LibraryIcon className="h-6 w-6 text-book-600" />
            <h1 className="text-3xl font-serif font-bold">{t('page.library.title')}</h1>
          </div>
          
          {/* User not logged in state */}
          <div className="bg-book-50 dark:bg-book-950/20 rounded-lg p-8 mb-10">
            <h2 className="text-xl font-semibold mb-3">Sign in to access your library</h2>
            <p className="text-muted-foreground mb-6">
              Keep track of your purchased book summaries and save your favorites for later.
            </p>
            <div className="flex gap-4">
              <Button>Sign In</Button>
              <Button variant="outline">Create Account</Button>
            </div>
          </div>

          {/* Books section (this would normally only show if logged in) */}
          <section className="my-10">
            <h2 className="text-2xl font-serif font-bold mb-6">Your Book Summaries</h2>
            
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex flex-col">
                    <Skeleton className="aspect-[2/3] w-full mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-destructive">Error loading your library</p>
                <Button variant="outline" className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : books.length === 0 ? (
              <div className="p-8 text-center bg-muted/50 rounded-lg">
                <p className="text-muted-foreground mb-4">Your library is empty</p>
                <Button asChild>
                  <a href="/browse">Browse Books</a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {books.map((book) => (
                  <div key={book.id} className="flex flex-col">
                    <a href={`/book/${book.id}`}>
                      <img 
                        src={book.coverImage} 
                        alt={book.title}
                        className="aspect-[2/3] w-full object-cover rounded-md shadow-md mb-3 hover:shadow-lg transition-shadow"
                      />
                    </a>
                    <h3 className="font-medium line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Library;
