
# Backend Architecture Plan for Book Platform

## Domain Models

### User
```java
public class User {
    private String id;
    private String name;
    private String email;
    private String passwordHash;  // Never store plain passwords
    private UserRole role;        // ADMIN or USER
    private String avatar;        // URL to avatar image
    private Date createdAt;
    private Date updatedAt;
}
```

### Book
```java
public class Book {
    private String id;
    private String title;
    private String author;
    private String coverImage;    // URL to cover image
    private String description;
    private String category;
    private String language;      // "en" or "hi"
    private Double rating;
    private Integer reviewCount;
    private boolean hasPdf;
    private boolean hasAudio;
    private boolean hasVideo;
    private boolean isFree;
    private Double price;
    private Date publishedAt;
    private Integer pageCount;
    private Integer readTime;     // in minutes
    
    // Content URLs (secured)
    private String pdfUrl;
    private String audioUrl;
    private String videoUrl;
}
```

### Purchase
```java
public class Purchase {
    private String id;
    private String userId;
    private String itemId;        // Book or Bundle ID
    private String itemType;      // "book" or "bundle"
    private Double price;
    private Date purchaseDate;
    private String transactionId; // Payment provider reference
}
```

### Cart
```java
public class Cart {
    private String id;
    private String userId;
    private List<CartItem> items;
    private Double total;
}

public class CartItem {
    private String id;
    private String bookId;
    private String title;
    private Double price;
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login existing user, return JWT
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile

### Books
- `GET /api/books` - List books with pagination, filtering, and sorting
- `GET /api/books/{id}` - Get book details
- `GET /api/books/trending` - Get trending books
- `GET /api/books/new-releases` - Get new releases
- `GET /api/books/free` - Get free books
- `GET /api/books/related/{id}` - Get books related to a specific book

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}/books` - Get books for a specific category

### User Library
- `GET /api/library` - Get user's purchased books
- `GET /api/library/{bookId}/content` - Get secure URL for book content (PDF/audio/video)

### Cart & Purchases
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `DELETE /api/cart/items/{itemId}` - Remove item from cart
- `POST /api/purchases` - Process purchase (integrate with payment gateway)
- `GET /api/purchases` - Get purchase history

### Admin Endpoints
- `POST /api/admin/books` - Create book
- `PUT /api/admin/books/{id}` - Update book
- `DELETE /api/admin/books/{id}` - Delete book
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/{id}` - Update user (e.g., change role)

## Security Configuration

- JWT-based authentication
- Role-based access control
- Secure content URLs with expiring signatures (for S3)
- CORS configuration for frontend access

## Storage Integration

- AWS S3 for storing book content (PDFs, audio files, videos)
- CloudFront CDN for efficient content delivery

## Payment Integration

- Razorpay integration for processing payments

## Email/SMS Integration

- SendGrid for email notifications
- Twilio for SMS/WhatsApp notifications

## Technologies to Use

1. Spring Boot 3.x for API development
2. Spring Security with JWT for authentication
3. Spring Data MongoDB for database access
4. AWS SDK for S3 integration
5. Razorpay SDK for payment processing
6. SendGrid/Twilio SDKs for notifications
7. Docker for containerization
8. GitHub Actions for CI/CD

## Development Plan

1. Set up Spring Boot project with required dependencies
2. Implement domain models and MongoDB repositories
3. Develop authentication and security layers
4. Implement book management APIs
5. Set up AWS S3 integration for content storage
6. Implement cart and purchase functionality
7. Integrate payment gateway
8. Develop admin endpoints
9. Configure CI/CD pipeline
10. Deploy to AWS Elastic Beanstalk or Kubernetes

