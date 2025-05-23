
import React, { useEffect, useState } from "react";
import { getReviewsByBookId } from "@/services/reviews/reviewService";
import ReviewList from "@/components/reviews/ReviewList";
import { Skeleton } from "@/components/ui/skeleton";
import { Review } from "@/services/reviews/reviewService";

interface BookReviewsProps {
  bookId: string;
}

const BookReviews: React.FC<BookReviewsProps> = ({ bookId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const result = await getReviewsByBookId(bookId);
        
        if (result.error) {
          setError(result.error);
        } else {
          // Cast the reviews to ensure they have the right properties
          const reviewsWithCorrectProps = result.reviews.map(review => ({
            ...review,
            userId: review.user_id,
            bookId: review.book_id,
            userName: review.user_name || 'Anonymous',
            content: review.review_text,
            createdAt: new Date(review.created_at),
            isVisible: review.is_visible,
            isTopReview: review.is_top_review || false
          }));
          setReviews(reviewsWithCorrectProps);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [bookId]);
  
  const visibleReviews = reviews.filter(review => review.isVisible);
  
  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-serif font-bold mb-6">Reader Reviews</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-md p-4">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32" />
                  <div className="flex space-x-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-4" />
                    ))}
                  </div>
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-serif font-bold mb-6">Reader Reviews</h2>
        <div className="bg-red-50 p-4 rounded-md text-red-600">
          Error loading reviews: {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-serif font-bold mb-6">Reader Reviews</h2>
      {visibleReviews.length > 0 ? (
        <ReviewList bookId={bookId} reviews={visibleReviews} />
      ) : (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">
            No reviews yet. Be the first to review this book!
          </p>
        </div>
      )}
    </div>
  );
};

export default BookReviews;
