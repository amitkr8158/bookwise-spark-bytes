import { supabase } from "@/integrations/supabase/client";
import { Review } from "@/components/reviews/ReviewCard";
import { format } from "date-fns";

// Interface for review input data
interface ReviewInput {
  bookId: string;
  rating: number;
  content: string;
}

// Interface for review data from Supabase
interface DatabaseReview {
  id: string;
  book_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

// Function to get reviews by book ID
export const getReviewsByBookId = async (bookId: string) => {
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

  // Transform the data to match the Review interface
  const reviews: Review[] = (data as DatabaseReview[]).map(review => ({
    id: review.id,
    userId: review.user_id,
    bookId: review.book_id,
    userName: review.profiles?.full_name || 'Anonymous User',
    userAvatar: review.profiles?.avatar_url,
    rating: review.rating,
    content: review.review_text || '',
    createdAt: new Date(review.created_at),
    isVisible: review.is_visible,
    isTopReview: false // This could be determined by some logic later
  }));

  return { reviews, error: null };
};

// Function to add a new review
export const addReview = async (reviewInput: ReviewInput) => {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    return { review: null, error: "You must be logged in to leave a review" };
  }
  
  const { data, error } = await supabase
    .from('book_reviews')
    .insert({
      book_id: reviewInput.bookId,
      user_id: userData.user.id,
      rating: reviewInput.rating,
      review_text: reviewInput.content,
      is_visible: true
    })
    .select(`
      *,
      profiles:user_id (
        full_name,
        avatar_url
      )
    `)
    .single();
    
  if (error) {
    console.error('Error adding review:', error);
    return { review: null, error: error.message };
  }
  
  const dbReview = data as DatabaseReview;
  
  const review: Review = {
    id: dbReview.id,
    userId: dbReview.user_id,
    bookId: dbReview.book_id,
    userName: dbReview.profiles?.full_name || 'Anonymous User',
    userAvatar: dbReview.profiles?.avatar_url,
    rating: dbReview.rating,
    content: dbReview.review_text || '',
    createdAt: new Date(dbReview.created_at),
    isVisible: dbReview.is_visible,
    isTopReview: false
  };
  
  return { review, error: null };
};

// Function to update a review
export const updateReview = async (reviewId: string, updates: Partial<ReviewInput>) => {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    return { success: false, error: "You must be logged in to update a review" };
  }
  
  // First check if the review belongs to the current user
  const { data: reviewData } = await supabase
    .from('book_reviews')
    .select('user_id')
    .eq('id', reviewId)
    .single();
    
  if (!reviewData || reviewData.user_id !== userData.user.id) {
    return { success: false, error: "You can only update your own reviews" };
  }
  
  const updateObject: any = {};
  if (updates.rating) updateObject.rating = updates.rating;
  if (updates.content) updateObject.review_text = updates.content;
  
  const { error } = await supabase
    .from('book_reviews')
    .update(updateObject)
    .eq('id', reviewId);
    
  if (error) {
    console.error('Error updating review:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, error: null };
};

// Function to delete a review
export const deleteReview = async (reviewId: string) => {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    return { success: false, error: "You must be logged in to delete a review" };
  }
  
  const { error } = await supabase
    .from('book_reviews')
    .delete()
    .eq('id', reviewId);
    
  if (error) {
    console.error('Error deleting review:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, error: null };
};

// Hook for review data
export const useReviews = () => {
  // Mock data for backward compatibility
  const mockReviews: Review[] = [
    {
      id: "1",
      userId: "user1",
      bookId: "1",
      userName: "Jane Smith",
      userAvatar: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      content: "This book changed my life! The insights are practical and immediately applicable.",
      createdAt: new Date(2023, 5, 15),
      isVisible: true,
      isTopReview: true
    },
    {
      id: "2",
      userId: "user2",
      bookId: "1",
      userName: "John Doe",
      userAvatar: "https://i.pravatar.cc/150?img=2",
      rating: 4,
      content: "A great read with actionable advice. Highly recommended for anyone looking to improve their productivity.",
      createdAt: new Date(2023, 6, 1),
      isVisible: true,
      isTopReview: false
    },
    {
      id: "3",
      userId: "user3",
      bookId: "1",
      userName: "Alice Johnson",
      userAvatar: "https://i.pravatar.cc/150?img=3",
      rating: 3,
      content: "It's an okay book. Some parts were helpful, but overall it didn't meet my expectations.",
      createdAt: new Date(2023, 6, 10),
      isVisible: true,
      isTopReview: false
    },
    {
      id: "4",
      userId: "user4",
      bookId: "2",
      userName: "Bob Williams",
      userAvatar: "https://i.pravatar.cc/150?img=4",
      rating: 5,
      content: "Absolutely brilliant! A must-read for anyone interested in understanding how our minds work.",
      createdAt: new Date(2023, 7, 1),
      isVisible: true,
      isTopReview: true
    },
    {
      id: "5",
      userId: "user5",
      bookId: "2",
      userName: "Emily Brown",
      userAvatar: "https://i.pravatar.cc/150?img=5",
      rating: 4,
      content: "A bit dense, but full of valuable insights. I'll definitely be rereading this one.",
      createdAt: new Date(2023, 7, 5),
      isVisible: true,
      isTopReview: false
    }
  ];
  
  return {
    getReviewsByBookId: (bookId: string) => {
      return mockReviews.filter(review => review.bookId === bookId);
    }
  };
};
