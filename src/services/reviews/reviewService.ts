
import { supabase } from '@/integrations/supabase/client';

// Review type
export interface Review {
  id: string;
  book_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  created_at: string;
  updated_at: string;
  is_visible: boolean;
  user_name?: string;
  // Add these fields for compatibility with ReviewCard component
  userName?: string;
  content?: string;
  createdAt?: string;
  isVisible?: boolean;
  isTopReview?: boolean;
}

// Get reviews for a book
export const getBookReviews = async (bookId: string): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('book_reviews')
      .select(`
        *,
        profiles(full_name)
      `)
      .eq('book_id', bookId)
      .eq('is_visible', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Add user_name field for compatibility with the existing UI
    return (data || []).map(review => ({
      ...review,
      user_name: review.profiles?.full_name || 'Anonymous',
      // Add these fields for compatibility with ReviewCard component
      userName: review.profiles?.full_name || 'Anonymous',
      content: review.review_text,
      createdAt: review.created_at,
      isVisible: review.is_visible,
      isTopReview: false
    }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

// Get reviews by bookId for BookReviews component
export const getReviewsByBookId = async (bookId: string): Promise<{reviews: Review[], error: string | null}> => {
  try {
    const reviews = await getBookReviews(bookId);
    return { reviews, error: null };
  } catch (error) {
    console.error('Error fetching reviews by book ID:', error);
    return { 
      reviews: [], 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Add a review
export const addReview = async (
  bookData: { bookId: string, rating: number, content: string }
): Promise<{ success: boolean; error?: string; review?: Review }> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const { data, error } = await supabase.from('book_reviews').insert({
      book_id: bookData.bookId,
      user_id: user.id,
      rating: bookData.rating,
      review_text: bookData.content,
    }).select().single();

    if (error) throw error;

    const newReview: Review = {
      ...data,
      user_name: 'You', // Default name before profile is fetched
      userName: 'You',
      content: data.review_text,
      createdAt: data.created_at,
      isVisible: data.is_visible || true,
      isTopReview: false
    };

    return { success: true, review: newReview };
  } catch (error: any) {
    console.error('Error adding review:', error);
    return { success: false, error: error.message };
  }
};

// Delete a review
export const deleteReview = async (reviewId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('book_reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return { success: false, error: error.message };
  }
};

// Update a review
export const updateReview = async (
  reviewId: string,
  rating: number,
  reviewText: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('book_reviews')
      .update({
        rating,
        review_text: reviewText,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reviewId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating review:', error);
    return { success: false, error: error.message };
  }
};

// Get reviews by admin
export const getAllReviews = async (): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('book_reviews')
      .select(`
        *,
        books:book_id (title),
        profiles(full_name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(review => ({
      ...review,
      user_name: review.profiles?.full_name || 'Anonymous',
      // Add these fields for compatibility with ReviewCard component
      userName: review.profiles?.full_name || 'Anonymous',
      content: review.review_text,
      createdAt: review.created_at,
      isVisible: review.is_visible || true,
      isTopReview: false
    }));
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    return [];
  }
};

// Update review visibility
export const updateReviewVisibility = async (
  reviewId: string,
  isVisible: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('book_reviews')
      .update({
        is_visible: isVisible,
      })
      .eq('id', reviewId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating review visibility:', error);
    return { success: false, error: error.message };
  }
};

// Update review as top review
export const updateTopReview = async (
  reviewId: string,
  isTopReview: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('book_reviews')
      .update({
        is_top_review: isTopReview,
      })
      .eq('id', reviewId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating top review status:', error);
    return { success: false, error: error.message };
  }
};
