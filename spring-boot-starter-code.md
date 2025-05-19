# Spring Boot Starter Code Examples

Below are key code examples to get started with the backend implementation:

## Main Application Class

```java
package com.bookplatform.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class BookPlatformApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(BookPlatformApiApplication.class, args);
    }
}
```

## Domain Model Example: Book

```java
package com.bookplatform.api.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Document(collection = "books")
public class Book {
    @Id
    private String id;
    
    private String title;
    private String author;
    private String coverImage;
    private String description;
    private String category;
    private String language;
    private Double rating;
    private Integer reviewCount;
    private boolean hasPdf;
    private boolean hasAudio;
    private boolean hasVideo;
    private boolean isFree;
    private Double price;
    private Date publishedAt;
    private Integer pageCount;
    private Integer readTime;
    
    // Secure content URLs - not exposed directly to API
    private String pdfUrl;
    private String audioUrl;
    private String videoUrl;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    private boolean deleted = false;
}
```

## Repository Example: BookRepository

```java
package com.bookplatform.api.repository;

import com.bookplatform.api.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface BookRepository extends MongoRepository<Book, String> {
    
    // Find books by category and language, excluding deleted
    @Query("{'category': ?0, 'language': ?1, 'deleted': false}")
    Page<Book> findByCategoryAndLanguage(String category, String language, Pageable pageable);
    
    // Find trending books by language, sorted by rating
    @Query(value="{'language': ?0, 'deleted': false}", sort="{'rating': -1}")
    List<Book> findTrendingByLanguage(String language, Pageable pageable);
    
    // Find new releases by language, sorted by publishedAt
    @Query(value="{'language': ?0, 'deleted': false}", sort="{'publishedAt': -1}")
    List<Book> findNewReleasesByLanguage(String language, Pageable pageable);
    
    // Find free books by language
    @Query("{'language': ?0, 'isFree': true, 'deleted': false}")
    List<Book> findFreeBooksByLanguage(String language, Pageable pageable);
    
    // Search by title, author or description
    @Query("{'$or': [{'title': {'$regex': ?0, '$options': 'i'}}, {'author': {'$regex': ?0, '$options': 'i'}}, {'description': {'$regex': ?0, '$options': 'i'}}], 'language': ?1, 'deleted': false}")
    Page<Book> searchBooks(String searchTerm, String language, Pageable pageable);
}
```

## Service Example: BookService

```java
package com.bookplatform.api.service;

import com.bookplatform.api.model.Book;
import com.bookplatform.api.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final S3Service s3Service;
    
    @Autowired
    public BookService(BookRepository bookRepository, S3Service s3Service) {
        this.bookRepository = bookRepository;
        this.s3Service = s3Service;
    }
    
    public Page<Book> getAllBooks(String language, String category, String search, 
                                  String sortBy, int page, int size) {
        Pageable pageable = createPageable(sortBy, page, size);
        
        if (search != null && !search.isEmpty()) {
            return bookRepository.searchBooks(search, language, pageable);
        }
        
        if (category != null && !category.isEmpty()) {
            return bookRepository.findByCategoryAndLanguage(category, language, pageable);
        }
        
        return bookRepository.findAll(pageable);
    }
    
    public Optional<Book> getBookById(String id) {
        return bookRepository.findById(id);
    }
    
    public List<Book> getTrendingBooks(String language, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return bookRepository.findTrendingByLanguage(language, pageable);
    }
    
    public List<Book> getNewReleases(String language, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return bookRepository.findNewReleasesByLanguage(language, pageable);
    }
    
    public List<Book> getFreeBooks(String language, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return bookRepository.findFreeBooksByLanguage(language, pageable);
    }
    
    // Admin methods for CRUD operations
    
    public Book createBook(Book book) {
        return bookRepository.save(book);
    }
    
    public Optional<Book> updateBook(String id, Book bookDetails) {
        return bookRepository.findById(id)
            .map(existingBook -> {
                // Update properties, but keep the id
                bookDetails.setId(id);
                return bookRepository.save(bookDetails);
            });
    }
    
    public void deleteBook(String id) {
        bookRepository.findById(id).ifPresent(book -> {
            // Soft delete
            book.setDeleted(true);
            bookRepository.save(book);
        });
    }
    
    // Generate presigned URL for content access
    public String getSecureContentUrl(String bookId, String contentType) {
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (bookOpt.isPresent()) {
            Book book = bookOpt.get();
            String s3Key = null;
            
            switch(contentType) {
                case "pdf":
                    s3Key = book.getPdfUrl();
                    break;
                case "audio":
                    s3Key = book.getAudioUrl();
                    break;
                case "video":
                    s3Key = book.getVideoUrl();
                    break;
            }
            
            if (s3Key != null) {
                return s3Service.generatePresignedUrl(s3Key, 60); // 60 minutes expiry
            }
        }
        
        return null;
    }
    
    private Pageable createPageable(String sortBy, int page, int size) {
        Sort sort;
        
        switch(sortBy) {
            case "newest":
                sort = Sort.by(Sort.Direction.DESC, "publishedAt");
                break;
            case "popular":
                sort = Sort.by(Sort.Direction.DESC, "rating");
                break;
            case "price_low":
                sort = Sort.by(Sort.Direction.ASC, "price");
                break;
            case "price_high":
                sort = Sort.by(Sort.Direction.DESC, "price");
                break;
            default:
                sort = Sort.by(Sort.Direction.DESC, "publishedAt");
        }
        
        return PageRequest.of(page, size, sort);
    }
}
```

## Controller Example: BookController

```java
package com.bookplatform.api.controller;

import com.bookplatform.api.model.Book;
import com.bookplatform.api.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;
    
    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }
    
    @GetMapping
    public ResponseEntity<Page<Book>> getAllBooks(
            @RequestParam(required = false, defaultValue = "en") String language,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        return ResponseEntity.ok(bookService.getAllBooks(
            language, category, search, sortBy, page, size));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id) {
        return bookService.getBookById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/trending")
    public ResponseEntity<List<Book>> getTrendingBooks(
            @RequestParam(required = false, defaultValue = "en") String language,
            @RequestParam(defaultValue = "8") int limit) {
        
        return ResponseEntity.ok(bookService.getTrendingBooks(language, limit));
    }
    
    @GetMapping("/new-releases")
    public ResponseEntity<List<Book>> getNewReleases(
            @RequestParam(required = false, defaultValue = "en") String language,
            @RequestParam(defaultValue = "8") int limit) {
        
        return ResponseEntity.ok(bookService.getNewReleases(language, limit));
    }
    
    @GetMapping("/free")
    public ResponseEntity<List<Book>> getFreeBooks(
            @RequestParam(required = false, defaultValue = "en") String language,
            @RequestParam(defaultValue = "4") int limit) {
        
        return ResponseEntity.ok(bookService.getFreeBooks(language, limit));
    }
}
```

## Security Configuration Example

```java
package com.bookplatform.api.config;

import com.bookplatform.api.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
                        .requestMatchers("/api/books", "/api/books/**").permitAll()
                        .requestMatchers("/api/categories/**").permitAll()
                        // Swagger UI
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        // Admin endpoints
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                        // Protected endpoints
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

## AWS S3 Service Example

```java
package com.bookplatform.api.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.Date;

@Service
public class S3Service {

    private final AmazonS3 s3Client;
    
    @Value("${aws.s3.bucket}")
    private String bucketName;
    
    @Autowired
    public S3Service(AmazonS3 s3Client) {
        this.s3Client = s3Client;
    }
    
    public String generatePresignedUrl(String objectKey, int expiryMinutes) {
        Date expiration = new Date();
        long expiryTime = expiration.getTime() + 1000 * 60 * expiryMinutes;
        expiration.setTime(expiryTime);
        
        GeneratePresignedUrlRequest generatePresignedUrlRequest = 
                new GeneratePresignedUrlRequest(bucketName, objectKey)
                  .withMethod(HttpMethod.GET)
                  .withExpiration(expiration);
                  
        URL url = s3Client.generatePresignedUrl(generatePresignedUrlRequest);
        return url.toString();
    }
    
    // Additional methods for uploading content, deleting, etc.
}
```

## Application Properties Example

```properties
# Spring Boot Configuration
spring.application.name=book-platform-api
server.port=8080

# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/bookplatform
spring.data.mongodb.auto-index-creation=true

# JWT Configuration
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000

# AWS Configuration
aws.credentials.access-key=your_aws_access_key
aws.credentials.secret-key=your_aws_secret_key
aws.region=us-east-1
aws.s3.bucket=your-book-content-bucket

# Razorpay Configuration
razorpay.key.id=your_razorpay_key_id
razorpay.key.secret=your_razorpay_key_secret

# SendGrid Configuration
sendgrid.api.key=your_sendgrid_api_key
sendgrid.from.email=no-reply@yourplatform.com
sendgrid.from.name=Book Platform

# File Upload Configuration
spring.servlet.multipart.max-file-size=100MB
spring.servlet.multipart.max-request-size=100MB

# Logging
logging.level.com.bookplatform.api=DEBUG
```
