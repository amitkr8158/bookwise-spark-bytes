
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
        const { books: fetchedBooks, error: fetchError, count: totalCount } = await getBooks({
          language,
          category,
          limit,
          offset,
          search,
          sortBy
        });

        if (fetchError) {
          setError(fetchError.message || 'Failed to fetch books');
          setBooks([]);
        } else {
          setBooks(fetchedBooks || []);
          setCount(totalCount || 0);
          setError(null);
        }
      } catch (err) {
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
