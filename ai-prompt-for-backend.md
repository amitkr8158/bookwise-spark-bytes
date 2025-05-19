
# AI Prompt for Generating Book Platform Backend

## Context:
I'm building a digital book platform where users can browse, purchase, and consume book summaries in different formats (PDF, audio, video). The platform needs user authentication, content management, payment processing, and admin capabilities.

## Tech Stack:
- Backend API: Java Spring Boot (REST)
- Database: MongoDB
- Authentication: Spring Security + JWT
- Storage: AWS S3 + CloudFront CDN
- Payment Processing: Razorpay
- Notifications: SendGrid (email) / Twilio (SMS/WhatsApp)
- DevOps: Docker + AWS Elastic Beanstalk
- CI/CD: GitHub Actions

## Domain Features:

### User System:
- Registration, login, profile management
- Role-based access (regular users vs admins)
- Secure password handling and JWT token authentication
- Profile picture upload and management

### Book Management:
- Book metadata (title, author, description, cover image)
- Categories and tags
- Support for multiple languages (English, Hindi)
- Content in multiple formats (PDF, audio, video)
- Free and premium content options

### Purchase System:
- Shopping cart functionality
- Secure payment processing
- Purchase history and receipts
- Access control to purchased content

### Content Delivery:
- Secure URLs for accessing premium content
- CDN integration for fast content delivery
- Analytics for tracking user engagement

### Admin Features:
- Book CRUD operations
- User management
- Sales and analytics dashboards

## Request:
Please generate a Spring Boot application with the following components:

1. Project structure following best practices
2. Domain models for User, Book, Cart, Purchase entities
3. Repository interfaces for MongoDB integration
4. REST controllers for all required endpoints
5. Security configuration with JWT authentication
6. Service layer for business logic
7. Integration with AWS S3 for content storage
8. Razorpay integration for payment processing
9. SendGrid integration for email notifications
10. Docker configuration for containerization

Focus on creating a maintainable, scalable codebase with proper error handling, logging, and documentation.

## Additional Instructions:
- Include Swagger for API documentation
- Implement proper validation for all inputs
- Consider rate limiting for public endpoints
- Implement soft delete for data integrity
- Structure the code to be easily testable
- Include example unit and integration tests
- Provide configuration for development and production environments

