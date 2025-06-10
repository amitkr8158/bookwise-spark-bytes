
// Central export file for all mock data
export { testAccounts, mockProfiles, mockUserPreferences } from './mockUsers';
export { mockCategories } from './mockCategories';
export { mockBooks } from './mockBooks';
export { mockBookReviews } from './mockReviews';
export { mockUserPurchases } from './mockPurchases';
export { mockBundles, mockBundleBooks, mockBundlePurchases } from './mockBundles';
export { mockReadingProgress, mockBookmarks } from './mockProgress';
export { mockCarts, mockCartItems } from './mockCarts';

// Utility functions to work with mock data
export const getMockDataForUser = (userId: string) => {
  return {
    profile: mockProfiles.find(p => p.id === userId),
    purchases: mockUserPurchases.filter(p => p.user_id === userId),
    progress: mockReadingProgress.filter(p => p.user_id === userId),
    bookmarks: mockBookmarks.filter(b => b.user_id === userId),
    cart: mockCarts.find(c => c.user_id === userId),
    cartItems: mockCartItems.filter(ci => 
      mockCarts.find(c => c.user_id === userId)?.id === ci.cart_id
    ),
    reviews: mockBookReviews.filter(r => r.user_id === userId)
  };
};

export const getMockDataForBook = (bookId: string) => {
  return {
    book: mockBooks.find(b => b.id === bookId),
    reviews: mockBookReviews.filter(r => r.book_id === bookId),
    purchases: mockUserPurchases.filter(p => p.book_id === bookId),
    progress: mockReadingProgress.filter(p => p.book_id === bookId),
    bookmarks: mockBookmarks.filter(b => b.book_id === bookId)
  };
};

export const getMockDataForBundle = (bundleId: string) => {
  return {
    bundle: mockBundles.find(b => b.id === bundleId),
    books: mockBundleBooks
      .filter(bb => bb.bundle_id === bundleId)
      .map(bb => mockBooks.find(b => b.id === bb.book_id))
      .filter(Boolean),
    purchases: mockBundlePurchases.filter(bp => bp.bundle_id === bundleId)
  };
};

// Re-export individual collections
import { mockProfiles, mockUserPreferences } from './mockUsers';
import { mockCategories } from './mockCategories';
import { mockBooks } from './mockBooks';
import { mockBookReviews } from './mockReviews';
import { mockUserPurchases } from './mockPurchases';
import { mockBundles, mockBundleBooks, mockBundlePurchases } from './mockBundles';
import { mockReadingProgress, mockBookmarks } from './mockProgress';
import { mockCarts, mockCartItems } from './mockCarts';
