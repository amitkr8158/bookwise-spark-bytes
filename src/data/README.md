
# Mock Data Documentation

This directory contains comprehensive mock data for all database tables in the BookWise application.

## Test Accounts

### User Account
- **Email**: customer@example.com
- **Password**: TestPass123!
- **Role**: user
- **Description**: Regular customer with book purchases and reading progress

### Admin Account  
- **Email**: admin@example.com
- **Password**: TestPass123!
- **Role**: admin
- **Description**: Full administrative access to all features

### Controller Account
- **Email**: controller@example.com  
- **Password**: TestPass123!
- **Role**: controller
- **Description**: Limited admin access focused on content moderation

## Mock Data Files

### mockUsers.ts
- User profiles (5 users including test accounts)
- User preferences (theme, language, notifications)
- Test account credentials and details

### mockCategories.ts
- 8 book categories (Fiction, Non-Fiction, Science Fiction, Mystery, Romance, Business, Self-Help, History)

### mockBooks.ts
- 8 books across different categories
- Mix of free and paid books
- Complete book metadata (title, author, description, pricing, etc.)

### mockReviews.ts
- 10 book reviews from different users
- Mix of visible/hidden and top/regular reviews
- Ratings from 2-5 stars with detailed review text

### mockPurchases.ts
- 9 user purchases across different users and books
- Purchase history for testing library and access features

### mockBundles.ts
- 4 book bundles (3 active, 1 inactive)
- Bundle-book relationships
- Bundle purchase history

### mockProgress.ts
- Reading progress tracking for users
- Bookmarks with notes and page numbers
- Reading percentages and completion status

### mockCarts.ts
- Shopping carts for users
- Cart items (books and bundles)
- Quantity and timestamp tracking

### mockData.ts
- Central export file for all mock data
- Utility functions for filtering data by user, book, or bundle
- Easy imports for components

## Usage Examples

```typescript
import { testAccounts, mockBooks, getMockDataForUser } from '@/data/mockData';

// Get test account credentials
const adminLogin = testAccounts.admin;

// Get all data for a specific user
const userData = getMockDataForUser('user-1');

// Access specific collections
import { mockBookReviews } from '@/data/mockReviews';
const visibleReviews = mockBookReviews.filter(r => r.is_visible);
```

## Data Relationships

The mock data maintains proper relationships between tables:
- Users have profiles, preferences, purchases, progress, bookmarks, and carts
- Books belong to categories and have reviews, purchases, and reading progress
- Bundles contain multiple books and can be purchased
- Reviews link users to books with ratings and visibility flags
- Carts contain items that reference either books or bundles

This structure allows for comprehensive testing of all application features without requiring a live database connection.
