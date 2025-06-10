
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { usePageViewTracking } from "@/hooks/useAnalytics";
import { useBooks } from "@/services/bookService";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookCard from "@/components/books/BookCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const Category = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { language } = useGlobalContext();
  
  // Track page view
  usePageViewTracking(`/category/${id}`, `Category: ${id}`);
  
  // Fetch all books first, then filter by category
  const { books: allBooks, loading, error } = useBooks({
    language,
    limit: 50 // Get more books to filter from
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
      "fiction": "Fiction",
      "non-fiction": "Non-Fiction",
      "mystery": "Mystery",
      "romance": "Romance",
      "history": "History",
    };
    
    return categories[categoryId] || categoryId;
  };

  // Filter books by category
  const books = React.useMemo(() => {
    if (!allBooks || !id) return [];
    
    return allBooks.filter(book => {
      // Handle both category and category_id fields
      const bookCategory = book.category?.toLowerCase() || '';
      const categoryId = id.toLowerCase();
      
      // Match exact category name or partial match
      return bookCategory === categoryId || 
             bookCategory.includes(categoryId) ||
             categoryId.includes(bookCategory);
    });
  }, [allBooks, id]);

  // Handle add to cart
  const handleAddToCart = (bookId: string, bookTitle: string) => {
    toast({
      title: "Added to cart",
      description: `${bookTitle} has been added to your cart.`,
    });
  };

  console.log('Category page - ID:', id);
  console.log('All books:', allBooks);
  console.log('Filtered books for category:', books);

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
          
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
              <p>Debug: Category ID = {id}</p>
              <p>Total books fetched: {allBooks?.length || 0}</p>
              <p>Books matching category: {books.length}</p>
              <p>Loading: {loading.toString()}</p>
              <p>Error: {error || 'none'}</p>
            </div>
          )}
          
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
              {allBooks && allBooks.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Available books:</p>
                  <div className="mt-2">
                    {allBooks.slice(0, 5).map(book => (
                      <p key={book.id} className="text-xs">
                        "{book.title}" - Category: "{book.category || 'No category'}"
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <div key={book.id} className="group flex flex-col h-full">
                  <Link to={`/book/${book.id}`} className="flex-grow">
                    <BookCard 
                      id={book.id} 
                      title={book.title}
                      author={book.author}
                      coverImage={book.coverImage || book.cover_image || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450&q=80"}
                      category={book.category}
                      rating={book.rating || 4.5}
                      hasPdf={book.hasPdf || !!book.pdf_url}
                      hasAudio={book.hasAudio || !!book.audio_url}
                      hasVideo={book.hasVideo || !!book.video_url}
                      isFree={book.isFree || book.is_free}
                      price={book.price || 0}
                    />
                  </Link>
                  <div className="mt-3">
                    <Button 
                      className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleAddToCart(book.id, book.title)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {book.isFree || book.is_free ? "Add to Library" : "Add to Cart"}
                    </Button>
                  </div>
                </div>
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
