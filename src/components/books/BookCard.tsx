
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { cn } from "@/lib/utils";
import { 
  Heart, 
  FileText, 
  Play, 
  Volume2, 
  ShoppingCart,
  Library
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useAnalytics } from "@/hooks/useAnalytics";

interface BookCardProps {
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
  className?: string;
}

const BookCard = ({
  id,
  title,
  author,
  coverImage,
  category,
  rating = 0,
  hasPdf = true,
  hasAudio = false,
  hasVideo = false,
  isFree = false,
  price = 0,
  className
}: BookCardProps) => {
  const { t } = useTranslation();
  const { language } = useGlobalContext();
  const { trackEvent } = useAnalytics();
  
  const handleAddToLibrary = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    trackEvent({
      eventCategory: 'Library',
      eventAction: 'Add',
      eventLabel: id
    });
    
    // Add to library implementation
    console.log('Add to library:', id);
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    trackEvent({
      eventCategory: 'Cart',
      eventAction: 'Add',
      eventLabel: id,
      eventValue: price
    });
    
    // Add to cart implementation
    console.log('Add to cart:', id);
  };

  return (
    <div className={cn("book-card group", className)}>
      {/* Book Cover */}
      <Link to={`/book/${id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img 
            src={coverImage} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Overlay with details */}
          <div className="book-card-overlay">
            <div className="flex justify-between items-start">
              <Badge className="bg-book-700">{category}</Badge>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white"
                      onClick={handleAddToLibrary}
                    >
                      <Heart className="h-4 w-4" />
                      <span className="sr-only">Add to Wishlist</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add to Wishlist</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* Available Formats */}
            <div className="flex gap-2 mt-2">
              {hasPdf && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="p-1 bg-white/10 backdrop-blur-sm rounded-full">
                        <FileText className="h-3 w-3 text-white" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>PDF Summary</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {hasAudio && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="p-1 bg-white/10 backdrop-blur-sm rounded-full">
                        <Volume2 className="h-3 w-3 text-white" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Audio Summary</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {hasVideo && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="p-1 bg-white/10 backdrop-blur-sm rounded-full">
                        <Play className="h-3 w-3 text-white" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Video Summary</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            {/* Title and Author */}
            <h3 className="mt-2 text-white font-serif font-bold line-clamp-2">{title}</h3>
            <p className="text-white/80 text-sm">{author}</p>
            
            {/* Rating */}
            {rating > 0 && (
              <div className="flex items-center mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={cn(
                        "w-4 h-4",
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      )}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-1 text-sm text-white/80">{rating.toFixed(1)}</span>
              </div>
            )}
            
            {/* Price and Action */}
            <div className="flex items-center justify-between mt-3">
              <div>
                {isFree ? (
                  <span className="text-white font-semibold">Free</span>
                ) : (
                  <span className="text-white font-semibold">${price.toFixed(2)}</span>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                  onClick={handleAddToLibrary}
                >
                  <Library className="h-3 w-3 mr-1" />
                  {t('book.addToLibrary')}
                </Button>
                
                {!isFree && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="h-8 text-xs"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    {t('book.buy')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Book Info - Shown by Default */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-serif font-bold line-clamp-2">{title}</h3>
          {rating > 0 && (
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{author}</p>
        
        {/* Format Icons */}
        <div className="flex gap-2 mt-2">
          {hasPdf && (
            <span className="p-1 bg-muted rounded-full">
              <FileText className="h-3 w-3" />
            </span>
          )}
          
          {hasAudio && (
            <span className="p-1 bg-muted rounded-full">
              <Volume2 className="h-3 w-3" />
            </span>
          )}
          
          {hasVideo && (
            <span className="p-1 bg-muted rounded-full">
              <Play className="h-3 w-3" />
            </span>
          )}
        </div>
        
        {/* Price */}
        <div className="mt-2">
          {isFree ? (
            <span className="font-semibold text-accent">Free</span>
          ) : (
            <span className="font-semibold">${price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
