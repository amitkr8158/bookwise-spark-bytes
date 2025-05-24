
import { useState, useEffect } from 'react';
import { getBooks, getBookById } from '@/services/books/bookService';

// Re-export the useBooks hook
export { useBooks } from '@/hooks/useBooks';

// Hook to fetch trending books
export const useTrendingBooks = (language: string = 'en') => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        setLoading(true);
        console.log('Fetching trending books...');
        
        // Get books from Supabase
        const { books: fetchedBooks, error: fetchError } = await getBooks({
          language,
          limit: 8,
          sortBy: 'popular'
        });

        if (fetchError) {
          console.error('Error fetching trending books:', fetchError);
          setError(fetchError.message || 'Failed to fetch trending books');
        } else {
          console.log('Fetched trending books:', fetchedBooks);
          
          // Transform books to expected format
          const transformedBooks = (fetchedBooks || []).map(book => ({
            id: book.id,
            title: book.title,
            author: book.author,
            coverImage: book.cover_image || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=450&q=80",
            price: book.price,
            isNew: false,
            category: book.category,
            rating: 4.5, // Default rating
            readTime: book.read_time || 20,
            hasPdf: book.pdf_url ? true : false,
            hasAudio: book.audio_url ? true : false,
            hasVideo: book.video_url ? true : false,
            isFree: book.is_free
          }));

          setBooks(transformedBooks);
        }
      } catch (err) {
        console.error('Error in useTrendingBooks:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingBooks();
  }, [language]);

  return { books, loading, error };
};

// Hook to fetch new releases
export const useNewReleases = (language: string = 'en') => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        setLoading(true);
        console.log('Fetching new releases...');
        
        // Get books from Supabase
        const { books: fetchedBooks, error: fetchError } = await getBooks({
          language,
          limit: 8,
          sortBy: 'newest'
        });

        if (fetchError) {
          console.error('Error fetching new releases:', fetchError);
          setError(fetchError.message || 'Failed to fetch new releases');
        } else {
          console.log('Fetched new releases:', fetchedBooks);
          
          // Transform books to expected format
          const transformedBooks = (fetchedBooks || []).map(book => ({
            id: book.id,
            title: book.title,
            author: book.author,
            coverImage: book.cover_image || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=450&q=80",
            price: book.price,
            isNew: true,
            category: book.category,
            rating: 4.5, // Default rating
            readTime: book.read_time || 20,
            hasPdf: book.pdf_url ? true : false,
            hasAudio: book.audio_url ? true : false,
            hasVideo: book.video_url ? true : false,
            isFree: book.is_free
          }));

          setBooks(transformedBooks);
        }
      } catch (err) {
        console.error('Error in useNewReleases:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchNewReleases();
  }, [language]);

  return { books, loading, error };
};

// Hook to fetch free books
export const useFreeBooks = (language: string = 'en') => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFreeBooks = async () => {
      try {
        setLoading(true);
        console.log('Fetching free books...');
        
        // Get free books from Supabase
        const { books: fetchedBooks, error: fetchError } = await getBooks({
          language,
          limit: 4
        });

        if (fetchError) {
          console.error('Error fetching free books:', fetchError);
          setError(fetchError.message || 'Failed to fetch free books');
        } else {
          console.log('Fetched all books:', fetchedBooks);
          
          // Filter for free books and transform to expected format
          const freeBooks = (fetchedBooks || [])
            .filter(book => book.is_free === true)
            .map(book => ({
              id: book.id,
              title: book.title,
              author: book.author,
              coverImage: book.cover_image || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=450&q=80",
              price: 0,
              isNew: false,
              category: book.category,
              rating: 4.5, // Default rating
              readTime: book.read_time || 20,
              hasPdf: book.pdf_url ? true : false,
              hasAudio: book.audio_url ? true : false,
              hasVideo: book.video_url ? true : false,
              isFree: book.is_free
            }));

          console.log('Filtered free books:', freeBooks);
          setBooks(freeBooks);
        }
      } catch (err) {
        console.error('Error in useFreeBooks:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchFreeBooks();
  }, [language]);

  return { books, loading, error };
};
