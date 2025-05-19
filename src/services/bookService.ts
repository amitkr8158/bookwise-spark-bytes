
// This is a mock service that would be replaced with actual API calls to your Spring Boot backend

import { useState, useEffect } from 'react';

// Book types
export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  category: string;
  language: 'en' | 'hi';
  rating: number;
  reviewCount: number;
  hasPdf: boolean;
  hasAudio: boolean;
  hasVideo: boolean;
  isFree: boolean;
  price: number;
  publishedAt: string;
  pageCount: number;
  readTime: number;
}

// Mock books data - this would come from your API
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverImage: 'https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF1000,1000_QL80_.jpg',
    description: 'A proven framework for improving every day through small changes in behavior.',
    category: 'Self Help',
    language: 'en',
    rating: 4.8,
    reviewCount: 128,
    hasPdf: true,
    hasAudio: true,
    hasVideo: true,
    isFree: false,
    price: 9.99,
    publishedAt: '2018-10-16',
    pageCount: 320,
    readTime: 15
  },
  {
    id: '2',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    coverImage: 'https://m.media-amazon.com/images/I/61fdrEuPJwL._AC_UF1000,1000_QL80_.jpg',
    description: 'A groundbreaking exploration of the two systems that drive the way we think and make choices.',
    category: 'Psychology',
    language: 'en',
    rating: 4.6,
    reviewCount: 98,
    hasPdf: true,
    hasAudio: true,
    hasVideo: false,
    isFree: false,
    price: 12.99,
    publishedAt: '2011-10-25',
    pageCount: 499,
    readTime: 20
  },
  {
    id: '3',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    coverImage: 'https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg',
    description: 'A brief history of humankind, exploring the ways in which biology and history have defined us.',
    category: 'History',
    language: 'en',
    rating: 4.7,
    reviewCount: 152,
    hasPdf: true,
    hasAudio: true,
    hasVideo: true,
    isFree: false,
    price: 14.99,
    publishedAt: '2014-02-10',
    pageCount: 443,
    readTime: 18
  },
  {
    id: '4',
    title: 'Deep Work',
    author: 'Cal Newport',
    coverImage: 'https://m.media-amazon.com/images/I/71FOPJIS7KL._AC_UF1000,1000_QL80_.jpg',
    description: 'Rules for focused success in a distracted world.',
    category: 'Productivity',
    language: 'en',
    rating: 4.5,
    reviewCount: 89,
    hasPdf: true,
    hasAudio: true,
    hasVideo: false,
    isFree: true,
    price: 0,
    publishedAt: '2016-01-05',
    pageCount: 296,
    readTime: 12
  },
  {
    id: '5',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    coverImage: 'https://m.media-amazon.com/images/I/71TRUbzcvaL._AC_UF1000,1000_QL80_.jpg',
    description: 'Timeless lessons on wealth, greed, and happiness.',
    category: 'Finance',
    language: 'en',
    rating: 4.7,
    reviewCount: 105,
    hasPdf: true,
    hasAudio: true,
    hasVideo: true,
    isFree: false,
    price: 8.99,
    publishedAt: '2020-09-08',
    pageCount: 256,
    readTime: 10
  },
  {
    id: '6',
    title: 'The Innovators',
    author: 'Walter Isaacson',
    coverImage: 'https://m.media-amazon.com/images/I/51Cwml-U03L._AC_UF1000,1000_QL80_.jpg',
    description: 'How a group of hackers, geniuses, and geeks created the digital revolution.',
    category: 'Technology',
    language: 'en',
    rating: 4.6,
    reviewCount: 78,
    hasPdf: true,
    hasAudio: false,
    hasVideo: false,
    isFree: false,
    price: 11.99,
    publishedAt: '2014-10-07',
    pageCount: 542,
    readTime: 22
  },
  {
    id: '7',
    title: 'Man\'s Search for Meaning',
    author: 'Viktor E. Frankl',
    coverImage: 'https://m.media-amazon.com/images/I/61nTspM+BYL._AC_UF1000,1000_QL80_.jpg',
    description: 'A memoir based on his experiences in Nazi concentration camps.',
    category: 'Philosophy',
    language: 'en',
    rating: 4.9,
    reviewCount: 187,
    hasPdf: true,
    hasAudio: true,
    hasVideo: false,
    isFree: false,
    price: 7.99,
    publishedAt: '1946-01-01',
    pageCount: 165,
    readTime: 8
  },
  {
    id: '8',
    title: 'Zero to One',
    author: 'Peter Thiel',
    coverImage: 'https://m.media-amazon.com/images/I/71Xygne8+qL._AC_UF1000,1000_QL80_.jpg',
    description: 'Notes on startups, or how to build the future.',
    category: 'Business',
    language: 'en',
    rating: 4.7,
    reviewCount: 112,
    hasPdf: true,
    hasAudio: true,
    hasVideo: true,
    isFree: false,
    price: 13.99,
    publishedAt: '2014-09-16',
    pageCount: 224,
    readTime: 9
  }
];

// Hindi versions of the same books
const mockHindiBooks: Book[] = mockBooks.map(book => ({
  ...book,
  language: 'hi' as 'hi',
  title: book.title + ' (हिंदी)',
  description: 'हिंदी में ' + book.description,
}));

const allBooks = [...mockBooks, ...mockHindiBooks];

// Get all books with pagination and filtering
export const useBooks = (
  options: {
    language?: 'en' | 'hi';
    category?: string;
    limit?: number;
    offset?: number;
    search?: string;
    sortBy?: 'newest' | 'popular' | 'price_low' | 'price_high';
  } = {}
) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Filter by language
        let filteredBooks = allBooks;
        if (options.language) {
          filteredBooks = filteredBooks.filter(book => book.language === options.language);
        }
        
        // Filter by category
        if (options.category) {
          filteredBooks = filteredBooks.filter(
            book => book.category.toLowerCase() === options.category?.toLowerCase()
          );
        }
        
        // Filter by search term
        if (options.search) {
          const searchLower = options.search.toLowerCase();
          filteredBooks = filteredBooks.filter(
            book => 
              book.title.toLowerCase().includes(searchLower) || 
              book.author.toLowerCase().includes(searchLower) ||
              book.description.toLowerCase().includes(searchLower)
          );
        }
        
        // Sort books
        if (options.sortBy) {
          switch(options.sortBy) {
            case 'newest':
              filteredBooks.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
              break;
            case 'popular':
              filteredBooks.sort((a, b) => b.rating - a.rating);
              break;
            case 'price_low':
              filteredBooks.sort((a, b) => a.price - b.price);
              break;
            case 'price_high':
              filteredBooks.sort((a, b) => b.price - a.price);
              break;
          }
        }
        
        setTotal(filteredBooks.length);
        
        // Apply pagination
        if (options.offset !== undefined && options.limit !== undefined) {
          filteredBooks = filteredBooks.slice(
            options.offset, 
            options.offset + options.limit
          );
        } else if (options.limit !== undefined) {
          filteredBooks = filteredBooks.slice(0, options.limit);
        }
        
        setBooks(filteredBooks);
        setError(null);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to load books. Please try again.");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [
    options.language,
    options.category,
    options.limit,
    options.offset,
    options.search,
    options.sortBy
  ]);
  
  return {
    books,
    loading,
    error,
    total
  };
};

// Get a single book by ID
export const useBook = (id: string, language: 'en' | 'hi' = 'en') => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  
  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const foundBook = allBooks.find(
          b => b.id === id && b.language === language
        );
        
        if (foundBook) {
          setBook(foundBook);
          setError(null);
        } else {
          setError("Book not found");
          setBook(null);
        }
      } catch (err) {
        console.error("Error fetching book:", err);
        setError("Failed to load book details. Please try again.");
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBook();
  }, [id, language]);
  
  return {
    book,
    loading,
    error
  };
};

// Get related books
export const useRelatedBooks = (
  bookId: string, 
  category: string, 
  language: 'en' | 'hi' = 'en',
  limit: number = 5
) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  
  useEffect(() => {
    const fetchRelatedBooks = async () => {
      setLoading(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find books in the same category but exclude the current book
        let relatedBooks = allBooks.filter(
          book => book.category === category && 
                 book.id !== bookId &&
                 book.language === language
        );
        
        // Limit the number of books
        relatedBooks = relatedBooks.slice(0, limit);
        
        setBooks(relatedBooks);
        setError(null);
      } catch (err) {
        console.error("Error fetching related books:", err);
        setError("Failed to load related books.");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (bookId && category) {
      fetchRelatedBooks();
    }
  }, [bookId, category, language, limit]);
  
  return {
    books,
    loading,
    error
  };
};

// Example function to get trending books
export const useTrendingBooks = (language: 'en' | 'hi' = 'en', limit: number = 8) => {
  return useBooks({
    language,
    sortBy: 'popular',
    limit
  });
};

// Example function to get new releases
export const useNewReleases = (language: 'en' | 'hi' = 'en', limit: number = 8) => {
  return useBooks({
    language,
    sortBy: 'newest',
    limit
  });
};

// Example function to get free books
export const useFreeBooks = (language: 'en' | 'hi' = 'en', limit: number = 4) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  
  useEffect(() => {
    const fetchFreeBooks = async () => {
      setLoading(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        let freeBooks = allBooks.filter(
          book => book.isFree && book.language === language
        );
        
        // Randomize and limit
        freeBooks = freeBooks
          .sort(() => 0.5 - Math.random())
          .slice(0, limit);
        
        setBooks(freeBooks);
        setError(null);
      } catch (err) {
        console.error("Error fetching free books:", err);
        setError("Failed to load free books.");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFreeBooks();
  }, [language, limit]);
  
  return {
    books,
    loading,
    error
  };
};
