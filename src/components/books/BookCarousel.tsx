
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import BookCard from "./BookCard";
import { Button } from "@/components/ui/button";

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  category: string;
  rating?: number;
  hasPdf?: boolean;
  hasAudio?: boolean;
  hasVideo?: boolean;
  isFree?: boolean;
  price?: number;
}

interface BookCarouselProps {
  title: string;
  books: Book[];
  viewAllLink?: string;
  className?: string;
}

const BookCarousel: React.FC<BookCarouselProps> = ({
  title,
  books,
  viewAllLink,
  className
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const checkScrollable = () => {
    if (!containerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
  };
  
  useEffect(() => {
    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, [books]);
  
  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const scrollAmount = container.clientWidth * 0.75; // Scroll 75% of container width
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
    
    // Update scroll buttons after animation
    setTimeout(checkScrollable, 500);
  };
  
  return (
    <div className={cn("relative", className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-serif font-bold">{title}</h2>
        
        {/* Move View All link left to make space for navigation buttons */}
        <div className="flex items-center gap-4">
          {viewAllLink && (
            <a 
              href={viewAllLink} 
              className="text-sm font-medium text-book-700 hover:text-book-800 transition-colors mr-8"
            >
              {t('section.viewAll')}
            </a>
          )}
          
          {/* Navigation Buttons */}
          <div className="hidden md:flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full",
                !canScrollLeft && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Scroll left</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full",
                !canScrollRight && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
            >
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Scroll right</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Book Carousel - Fixed height to maintain consistent size */}
      <div 
        ref={containerRef}
        className="flex space-x-4 overflow-x-auto pb-6 custom-scrollbar snap-x"
        onScroll={checkScrollable}
      >
        {books.map((book) => (
          <div 
            key={book.id} 
            className="w-36 md:w-48 lg:w-56 flex-shrink-0 snap-start aspect-[2/3]"
          >
            <BookCard {...book} />
          </div>
        ))}
        
        {books.length === 0 && (
          <div className="flex items-center justify-center w-full py-12">
            <p className="text-muted-foreground">No books found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCarousel;
