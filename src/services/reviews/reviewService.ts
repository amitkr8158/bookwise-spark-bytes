
import { supabase } from "@/integrations/supabase/client";

// Type definitions
export interface DatabaseReview {
  id: string;
  book_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  // Fix the profiles type to handle errors
  profiles?: {
    full_name?: string | null;
    avatar_url?: string | null;
  };
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  username: string;
  userAvatar?: string;
  rating: number;
  text: string;
  date: string;
  isVisible: boolean;
  isTopReview?: boolean;
}

// Get reviews for a specific book
export const getReviewsByBookId = async (bookId: string): Promise<{ reviews: Review[], error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('book_reviews')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('book_id', bookId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return { reviews: [], error: error.message };
    }

    // Cast the data and handle potential profile errors
    const dbReviews = data as unknown as (DatabaseReview & { 
      profiles?: { full_name?: string | null, avatar_url?: string | null } | { error: true }
    })[];

    const reviews: Review[] = dbReviews.map(review => ({
      id: review.id,
      bookId: review.book_id,
      userId: review.user_id,
      username: review.profiles && !('error' in review.profiles) && review.profiles.full_name 
        ? review.profiles.full_name 
        : 'Anonymous User',
      userAvatar: review.profiles && !('error' in review.profiles) ? review.profiles.avatar_url || undefined : undefined,
      rating: review.rating,
      text: review.review_text,
      date: new Date(review.created_at).toLocaleDateString(),
      isVisible: review.is_visible,
      isTopReview: false // Default value
    }));

    return { reviews, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching reviews:', error);
    return { reviews: [], error: error.message || 'An unexpected error occurred' };
  }
};

// Submit a new review
export const submitReview = async (
  bookId: string,
  userId: string,
  rating: number,
  text: string
): Promise<{ review: Review | null, error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('book_reviews')
      .insert([
        {
          book_id: bookId,
          user_id: userId,
          rating,
          review_text: text,
          is_visible: true
        }
      ])
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error submitting review:', error);
      return { review: null, error: error.message };
    }

    // Cast the data and handle potential profile errors
    const dbReview = data as unknown as (DatabaseReview & { 
      profiles?: { full_name?: string | null, avatar_url?: string | null } | { error: true }
    });

    const review: Review = {
      id: dbReview.id,
      bookId: dbReview.book_id,
      userId: dbReview.user_id,
      username: dbReview.profiles && !('error' in dbReview.profiles) && dbReview.profiles.full_name 
        ? dbReview.profiles.full_name 
        : 'Anonymous User',
      userAvatar: dbReview.profiles && !('error' in dbReview.profiles) ? dbReview.profiles.avatar_url || undefined : undefined,
      rating: dbReview.rating,
      text: dbReview.review_text,
      date: new Date(dbReview.created_at).toLocaleDateString(),
      isVisible: dbReview.is_visible,
      isTopReview: false
    };

    return { review, error: null };
  } catch (error: any) {
    console.error('Unexpected error submitting review:', error);
    return { review: null, error: error.message || 'An unexpected error occurred' };
  }
};

// Additional admin functions that are used in AdminTabs.tsx
export const getAdminReviews = async (): Promise<{ reviews: Review[], error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('book_reviews')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin reviews:', error);
      return { reviews: [], error: error.message };
    }

    // Cast the data and handle potential profile errors
    const dbReviews = data as unknown as (DatabaseReview & { 
      profiles?: { full_name?: string | null, avatar_url?: string | null } | { error: true }
    })[];

    const reviews: Review[] = dbReviews.map(review => ({
      id: review.id,
      bookId: review.book_id,
      userId: review.user_id,
      username: review.profiles && !('error' in review.profiles) && review.profiles.full_name 
        ? review.profiles.full_name 
        : 'Anonymous User',
      userAvatar: review.profiles && !('error' in review.profiles) ? review.profiles.avatar_url || undefined : undefined,
      rating: review.rating,
      text: review.review_text,
      date: new Date(review.created_at).toLocaleDateString(),
      isVisible: review.is_visible,
      isTopReview: false // Will be updated separately
    }));

    return { reviews, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching admin reviews:', error);
    return { reviews: [], error: error.message || 'An unexpected error occurred' };
  }
};

export const toggleReviewVisibility = async (reviewId: string, isVisible: boolean): Promise<{ success: boolean, error: string | null }> => {
  try {
    const { error } = await supabase
      .from('book_reviews')
      .update({ is_visible: isVisible })
      .eq('id', reviewId);

    if (error) {
      console.error('Error toggling review visibility:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error('Unexpected error toggling visibility:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
};

export const toggleTopReview = async (reviewId: string, isTopReview: boolean): Promise<{ success: boolean, error: string | null }> => {
  try {
    // Since we don't have a top_review column yet, we'll simulate this functionality
    // In a real implementation, you would update a column in the database
    console.log(`Setting review ${reviewId} as top review: ${isTopReview}`);
    
    // This is a mock implementation until we add the top_review column
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Unexpected error setting top review:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
};
