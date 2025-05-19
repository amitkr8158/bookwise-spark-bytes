
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { usePageViewTracking } from "@/hooks/useAnalytics";
import { createClient } from '@supabase/supabase-js';

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Book, ExternalLink, Library as LibraryIcon } from "lucide-react";

// Import sample PDF
import samplePdf from "../assets/sample-summary.pdf";

const Library = () => {
  const { t } = useTranslation();
  const { language } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize Supabase client (would be replaced with actual integration)
  const supabase = createClient(
    'https://your-project-url.supabase.co',
    'your-public-anon-key'
  );
  
  // Track page view
  usePageViewTracking('/library', 'My Library');
  
  // Sample books with PDF links
  const books = [
    {
      id: '1',
      title: 'Atomic Habits',
      author: 'James Clear',
      coverImage: 'https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF1000,1000_QL80_.jpg',
      description: 'A proven framework for improving every day through small changes in behavior.',
      pdfUrl: samplePdf
    },
    {
      id: '5',
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      coverImage: 'https://m.media-amazon.com/images/I/71TRUbzcvaL._AC_UF1000,1000_QL80_.jpg',
      description: 'Timeless lessons on wealth, greed, and happiness.',
      pdfUrl: samplePdf
    }
  ];

  // Mock authenticated state (false for now)
  const isAuthenticated = false;

  const handleDownloadPdf = (bookId: string, pdfUrl: string) => {
    // In a real app, you might track this event
    console.log(`Downloading PDF for book ID: ${bookId}`);
    
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `book-summary-${bookId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          {!isAuthenticated && (
            <div className="bg-book-50 dark:bg-book-950/20 rounded-lg p-8 mb-10">
              <h2 className="text-xl font-semibold mb-3">Sign in to access your library</h2>
              <p className="text-muted-foreground mb-6">
                Keep track of your purchased book summaries and save your favorites for later.
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/signup">Create Account</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Books section */}
          <section className="my-10">
            <h2 className="text-2xl font-serif font-bold mb-6">Sample Book Summaries</h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((_, i) => (
                  <div key={i} className="flex flex-col">
                    <Skeleton className="h-64 w-full mb-3" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : books.length === 0 ? (
              <div className="p-8 text-center bg-muted/50 rounded-lg">
                <p className="text-muted-foreground mb-4">Your library is empty</p>
                <Button asChild>
                  <Link to="/">Browse Books</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {books.map((book) => (
                  <Card key={book.id} className="overflow-hidden flex flex-col">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-1/3">
                        <img 
                          src={book.coverImage} 
                          alt={book.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex flex-col flex-grow p-6">
                        <CardHeader className="p-0 pb-2">
                          <CardTitle>{book.title}</CardTitle>
                          <CardDescription>{book.author}</CardDescription>
                        </CardHeader>
                        
                        <CardContent className="p-0 py-2">
                          <p className="text-sm text-muted-foreground">
                            {book.description}
                          </p>
                        </CardContent>
                        
                        <CardFooter className="p-0 pt-4 mt-auto">
                          <div className="flex flex-wrap gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => handleDownloadPdf(book.id, book.pdfUrl)}
                            >
                              <Download className="w-4 h-4" /> PDF
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => window.open(`/book/${book.id}`, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" /> Details
                            </Button>
                          </div>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
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
