
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { usePageViewTracking } from "@/hooks/useAnalytics";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useToast } from "@/components/ui/use-toast";
import { useBooks } from "@/services/bookService";
import { Book, BookOpen, FileText, Headphones, Video, Star, ShoppingCart } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { language } = useGlobalContext();
  
  // Track page view
  usePageViewTracking(`/book/${id}`, `Book: ${id}`);
  
  // Fetch book details - in a real app, this would be a separate API call
  const { books, loading } = useBooks({ language });
  const book = books.find(b => b.id === id);
  
  // Mock summary content
  const summaryContent = {
    keyPoints: [
      "First key insight from the book with detailed explanation that provides context and elaboration on the main point",
      "Second important concept that readers should understand, with evidence and examples to support the idea",
      "Critical thinking framework introduced by the author that changes how we approach problem solving",
      "Practical application of the book's methodology to real-world scenarios and situations",
      "Transformative perspective that challenges conventional wisdom in this domain"
    ],
    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dignissim, justo a aliquam feugiat, velit nisi tempus dui, non dignissim nunc augue at nisi. Praesent non odio nec ligula ullamcorper blandit. Sed euismod ipsum vel ligula fermentum, id lacinia nulla vehicula. Curabitur non venenatis nisi. Donec in efficitur nisl, id commodo enim. Proin auctor magna vel dolor porta, non convallis dui pharetra. Nullam mattis tempus nisl, a tincidunt mi ornare nec. \n\nSuspendisse potenti. Mauris mattis, nulla ac auctor pulvinar, neque orci tincidunt tortor, at pulvinar orci ligula non arcu. Vivamus quis velit at quam porta feugiat. Fusce malesuada dui eu nunc gravida, nec elementum arcu luctus. Curabitur commodo felis vitae odio consequat, a tempor massa mattis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse feugiat luctus ligula."
  };

  const handleAddToCart = () => {
    toast({
      title: `Added to cart`,
      description: book ? `${book.title} has been added to your cart` : "Book added to cart",
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="container px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <Skeleton className="h-96 w-full" />
              </div>
              <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-40" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!book) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="container px-4 py-12 text-center">
            <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
            <p className="mb-8">The book you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/browse')}>Browse Books</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <div className="sticky top-24">
                <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg mb-6">
                  <img 
                    src={book.coverImage} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {book.hasAudio && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Headphones className="h-3 w-3" />
                      Audio
                    </Badge>
                  )}
                  {book.hasPdf && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      PDF
                    </Badge>
                  )}
                  {book.hasVideo && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Video className="h-3 w-3" />
                      Video
                    </Badge>
                  )}
                  {book.isFree && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Free
                    </Badge>
                  )}
                </div>
                
                <Button 
                  className="w-full mb-3"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {book.isFree ? "Add to Library" : `Add to Cart - $${book.price?.toFixed(2)}`}
                </Button>
              </div>
            </div>
            
            {/* Book Details */}
            <div className="md:col-span-2">
              <div className="mb-6">
                <h1 className="text-3xl font-serif font-bold">{book.title}</h1>
                <div className="text-lg text-muted-foreground mt-1">
                  by {book.author}
                </div>
                
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(book.rating || 0) 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <div className="ml-2 text-sm">
                    {book.rating?.toFixed(1)} rating
                  </div>
                </div>
                
                <Badge className="mt-4" variant="outline">
                  {book.category}
                </Badge>
              </div>
              
              <Tabs defaultValue="summary" className="mt-8">
                <TabsList>
                  <TabsTrigger value="summary">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="key-points">
                    <Book className="h-4 w-4 mr-2" />
                    Key Points
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary" className="mt-6">
                  <div className="prose max-w-none dark:prose-invert">
                    <h2 className="text-2xl font-semibold mb-4">Book Summary</h2>
                    {summaryContent.summary.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="key-points" className="mt-6">
                  <div className="prose max-w-none dark:prose-invert">
                    <h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
                    <ul className="space-y-4">
                      {summaryContent.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            {idx + 1}
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookDetail;
