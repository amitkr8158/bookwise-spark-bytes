
import { useState, useEffect } from 'react';
import { getBooks } from '@/services/books/bookService';

export const useBooks = ({
  language,
  category,
  limit,
  offset,
  search,
  sortBy,
}: {
  language?: string;
  category?: string;
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: 'newest' | 'popular' | 'price_low' | 'price_high';
} = {}) => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        console.log('📚 Fetching books with params:', { language, category, limit, offset, search, sortBy });
        
        const { books: fetchedBooks, error: fetchError, count: totalCount } = await getBooks({
          language,
          category,
          limit,
          offset,
          search,
          sortBy
        });

        if (fetchError) {
          console.error('❌ Error fetching books:', fetchError);
          setError(fetchError.message || 'Failed to fetch books');
          setBooks([]);
        } else {
          console.log('✅ Raw books from Supabase:', fetchedBooks);
          
          // Transform and ensure consistent data structure
          const transformedBooks = (fetchedBooks || []).map(book => ({
            ...book,
            // Ensure we have both old and new field names for compatibility
            coverImage: book.cover_image || book.coverImage || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450&q=80",
            isFree: book.is_free ?? book.isFree ?? false,
            hasPdf: book.pdf_url ? true : (book.hasPdf ?? false),
            hasAudio: book.audio_url ? true : (book.hasAudio ?? false),
            hasVideo: book.video_url ? true : (book.hasVideo ?? false),
            rating: book.rating ?? 4.5,
            readTime: book.read_time ?? book.readTime ?? 20
          }));
          
          console.log('✅ Transformed books:', transformedBooks);
          setBooks(transformedBooks);
          setCount(totalCount || transformedBooks.length);
          setError(null);
        }
      } catch (err) {
        console.error('❌ Exception in useBooks:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [language, category, limit, offset, search, sortBy]);

  return { books, loading, error, count };
};
