
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Review } from "@/components/reviews/ReviewCard";
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from "../storage/localStorage";

// Sample reviews
const sampleReviews: Review[] = [
  {
    id: uuidv4(),
    userId: "user1",
    bookId: "atomic-habits",
    userName: "Sarah Johnson",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    content: "Absolutely transformative! This book summary gave me all the key insights without having to read the entire book. I've already started implementing the tiny habits technique and seeing results.",
    createdAt: new Date("2023-06-15"),
    isVisible: true,
    isTopReview: true
  },
  {
    id: uuidv4(),
    userId: "user2",
    bookId: "atomic-habits",
    userName: "Michael Chen",
    userAvatar: "https://i.pravatar.cc/150?img=3",
    rating: 4,
    content: "Very practical advice condensed into an easy-to-digest format. The audio version was particularly well-narrated.",
    createdAt: new Date("2023-08-03"),
    isVisible: true,
    isTopReview: false
  },
  {
    id: uuidv4(),
    userId: "user3",
    bookId: "thinking-fast-and-slow",
    userName: "David Wilson",
    userAvatar: "https://i.pravatar.cc/150?img=8",
    rating: 5,
    content: "The concepts of System 1 and System 2 thinking have completely changed how I make decisions. This summary captured the essence of the book beautifully.",
    createdAt: new Date("2023-07-22"),
    isVisible: true,
    isTopReview: true
  },
  {
    id: uuidv4(),
    userId: "user4",
    bookId: "zero-to-one",
    userName: "Lisa Rodriguez",
    userAvatar: "https://i.pravatar.cc/150?img=5",
    rating: 3,
    content: "Some interesting points about startup culture, but I felt like the summary could have been more comprehensive. Still worth the read though.",
    createdAt: new Date("2023-05-14"),
    isVisible: false,
    isTopReview: false
  },
  {
    id: uuidv4(),
    userId: "user5",
    bookId: "zero-to-one",
    userName: "Alex Thompson",
    userAvatar: "https://i.pravatar.cc/150?img=4",
    rating: 5,
    content: "Thiel's contrarian questions are game-changers for entrepreneurs. The video summary was especially helpful in visualizing the concepts.",
    createdAt: new Date("2023-09-01"),
    isVisible: true,
    isTopReview: true
  }
];

// Hooks for managing reviews
export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>(() =>
    getFromLocalStorage(STORAGE_KEYS.REVIEWS, sampleReviews)
  );

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.REVIEWS, reviews);
  }, [reviews]);

  const addReview = (review: Omit<Review, "id" | "createdAt" | "isVisible" | "isTopReview">) => {
    const newReview: Review = {
      ...review,
      id: uuidv4(),
      createdAt: new Date(),
      isVisible: true,
      isTopReview: false,
    };
    setReviews([newReview, ...reviews]);
    return newReview;
  };

  const updateReview = (review: Review) => {
    setReviews(reviews.map(r => (r.id === review.id ? review : r)));
  };

  const deleteReview = (reviewId: string) => {
    setReviews(reviews.filter(r => r.id !== reviewId));
  };

  const toggleReviewVisibility = (reviewId: string, isVisible: boolean) => {
    setReviews(
      reviews.map(r => (r.id === reviewId ? { ...r, isVisible } : r))
    );
  };

  const toggleTopReview = (reviewId: string, isTopReview: boolean) => {
    setReviews(
      reviews.map(r => (r.id === reviewId ? { ...r, isTopReview } : r))
    );
  };

  const getReviewsByBookId = (bookId: string) => {
    return reviews.filter(r => r.bookId === bookId);
  };

  const getTopReviews = () => {
    return reviews.filter(r => r.isTopReview && r.isVisible);
  };

  return {
    reviews,
    addReview,
    updateReview,
    deleteReview,
    toggleReviewVisibility,
    toggleTopReview,
    getReviewsByBookId,
    getTopReviews,
  };
};

export { sampleReviews };
