
import React, { useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { usePageViewTracking } from "@/hooks/useAnalytics";
import { 
  useTrendingBooks, 
  useNewReleases, 
  useFreeBooks 
} from "@/services/bookService";

// Import the test function to check Supabase connection
import { testSupabaseConnection } from "@/utils/testSupabaseConnection";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import CategorySection from "@/components/sections/CategorySection";
import BookCarousel from "@/components/books/BookCarousel";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback image for books without covers
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=450&q=80";

const Index = () => {
  const { t } = useTranslation();
  const { language } = useGlobalContext();
  
  // Track page view
  usePageViewTracking('/', 'Home');
  
  // Test Supabase connection on component mount
  useEffect(() => {
    console.log('🏠 Index page mounted, testing Supabase connection...');
    testSupabaseConnection();
  }, []);
  
  // Fetch book data
  const { 
    books: trendingBooks, 
    loading: loadingTrending,
    error: errorTrending 
  } = useTrendingBooks(language);
  
  const { 
    books: newReleases, 
    loading: loadingNewReleases,
    error: errorNewReleases 
  } = useNewReleases(language);
  
  const { 
    books: freeBooks, 
    loading: loadingFreeBooks,
    error: errorFreeBooks 
  } = useFreeBooks(language);

  // Log data for debugging
  useEffect(() => {
    console.log('📊 Data status:', {
      trending: { books: trendingBooks.length, loading: loadingTrending, error: errorTrending },
      newReleases: { books: newReleases.length, loading: loadingNewReleases, error: errorNewReleases },
      freeBooks: { books: freeBooks.length, loading: loadingFreeBooks, error: errorFreeBooks }
    });
  }, [trendingBooks, newReleases, freeBooks, loadingTrending, loadingNewReleases, loadingFreeBooks]);

  // Ensure all books have valid cover images
  const ensureValidImages = (books: any[]) => {
    return books.map(book => ({
      ...book,
      coverImage: book.coverImage || FALLBACK_IMAGE
    }));
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        <div className="container px-4 py-12">
          {/* Trending Books */}
          <section className="mb-16">
            {loadingTrending ? (
              <div>
                <Skeleton className="h-8 w-64 mb-6" />
                <div className="flex space-x-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-36 md:w-48 lg:w-56">
                      <Skeleton className="aspect-[2/3] w-full mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  ))}
                </div>
              </div>
            ) : errorTrending ? (
              <div className="bg-red-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-red-800 mb-2">Error loading trending books</h3>
                <p className="text-red-600">{errorTrending}</p>
              </div>
            ) : (
              <BookCarousel 
                title={t('section.trending')} 
                books={ensureValidImages(trendingBooks)}
                viewAllLink="/browse?sort=popular" 
              />
            )}
          </section>
          
          {/* Categories */}
          <CategorySection />
          
          {/* New Releases */}
          <section className="my-16">
            {loadingNewReleases ? (
              <div>
                <Skeleton className="h-8 w-64 mb-6" />
                <div className="flex space-x-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-36 md:w-48 lg:w-56">
                      <Skeleton className="aspect-[2/3] w-full mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  ))}
                </div>
              </div>
            ) : errorNewReleases ? (
              <div className="bg-red-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-red-800 mb-2">Error loading new releases</h3>
                <p className="text-red-600">{errorNewReleases}</p>
              </div>
            ) : (
              <BookCarousel 
                title={t('section.newReleases')} 
                books={ensureValidImages(newReleases)}
                viewAllLink="/browse?sort=newest" 
              />
            )}
          </section>
          
          {/* Free Books Section */}
          <section className="my-16">
            <div className="bg-book-50 dark:bg-book-950/20 rounded-lg p-8 mb-6">
              <h2 className="text-2xl font-serif font-bold mb-4">Free Summaries</h2>
              
              <p className="text-muted-foreground mb-6 max-w-2xl">
                Start your learning journey with these free book summaries. No payment required.
              </p>
              
              {loadingFreeBooks ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="aspect-[2/3] w-full mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : errorFreeBooks ? (
                <div className="bg-red-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium text-red-800 mb-2">Error loading free books</h3>
                  <p className="text-red-600">{errorFreeBooks}</p>
                </div>
              ) : freeBooks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No free books available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {ensureValidImages(freeBooks).map((book) => (
                    <div key={book.id}>
                      <img 
                        src={book.coverImage}
                        alt={book.title}
                        className="aspect-[2/3] w-full object-cover rounded-md shadow-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = FALLBACK_IMAGE;
                        }}
                      />
                      <h3 className="font-medium mt-2 line-clamp-1">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
