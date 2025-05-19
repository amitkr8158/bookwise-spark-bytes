
import React from "react";
import { useReviews } from "@/services/configService";
import ReviewList from "@/components/reviews/ReviewList";

interface BookReviewsProps {
  bookId: string;
}

const BookReviews: React.FC<BookReviewsProps> = ({ bookId }) => {
  const { getReviewsByBookId } = useReviews();
  const bookReviews = getReviewsByBookId(bookId);
  const visibleReviews = bookReviews.filter(review => review.isVisible);
  
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
