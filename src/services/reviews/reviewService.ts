
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
}

// Get reviews for a book
export const getBookReviews = async (bookId: string): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('book_reviews')
      .select(`
        *,
        profiles:user_id (full_name)
      `)
      .eq('book_id', bookId)
      .eq('is_visible', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Add user_name field for compatibility with the existing UI
    return data.map(review => ({
      ...review,
      user_name: review.profiles?.full_name || 'Anonymous',
      // Add these fields for compatibility with ReviewCard component
      userName: review.profiles?.full_name || 'Anonymous',
      content: review.review_text,
      createdAt: review.created_at
    }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

// Add a review
export const addReview = async (
  bookId: string,
  userId: string,
  rating: number,
  reviewText: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.from('book_reviews').insert({
      book_id: bookId,
      user_id: userId,
      rating,
      review_text: reviewText,
    });

    if (error) throw error;

    return { success: true };
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
        profiles:user_id (full_name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(review => ({
      ...review,
      user_name: review.profiles?.full_name || 'Anonymous',
      // Add these fields for compatibility with ReviewCard component
      userName: review.profiles?.full_name || 'Anonymous',
      content: review.review_text,
      createdAt: review.created_at
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
