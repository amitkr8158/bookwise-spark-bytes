
import { supabase } from "@/integrations/supabase/client";

export interface BookInput {
  title: string;
  author: string;
  description: string;
  category: string;
  language: 'en' | 'hi';
  cover_image?: string;
  pdf_url?: string;
  audio_url?: string;
  video_url?: string;
  is_free: boolean;
  price?: number;
  published_at?: string;
  page_count?: number;
  read_time?: number;
}

export interface Book extends BookInput {
  id: string;
  created_at: string;
  updated_at: string;
  added_by: string;
}

// Get all books with filtering options
export const getBooks = async ({
  language,
  category,
  limit,
  offset,
  search,
  sortBy,
}: {
  language?: 'en' | 'hi';
  category?: string;
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: 'newest' | 'popular' | 'price_low' | 'price_high';
} = {}) => {
  let query = supabase.from('books').select('*', { count: 'exact' });
  
  // Apply filters
  if (language) {
    query = query.eq('language', language);
  }
  
  if (category) {
    query = query.eq('category', category);
  }
  
  if (search) {
    query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%,description.ilike.%${search}%`);
  }
  
  // Apply sorting
  if (sortBy) {
    switch(sortBy) {
      case 'newest':
        query = query.order('published_at', { ascending: false });
        break;
      case 'price_low':
        query = query.order('price', { ascending: true });
        break;
      case 'price_high':
        query = query.order('price', { ascending: false });
        break;
    }
  }
  
  // Apply pagination
  if (limit) {
    query = query.limit(limit);
  }
  
  if (offset) {
    query = query.range(offset, offset + (limit || 10) - 1);
  }
  
  const { data, error, count } = await query;
  
  return { books: data, error, count };
};

// Get a single book by ID
export const getBookById = async (id: string) => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();
  
  return { book: data, error };
};

// Create a new book (admin only)
export const createBook = async (bookData: BookInput, userId: string) => {
  const { data, error } = await supabase
    .from('books')
    .insert([{ ...bookData, added_by: userId }])
    .select();
  
  return { book: data?.[0], error };
};

// Update a book (admin only)
export const updateBook = async (id: string, bookData: Partial<BookInput>) => {
  const { data, error } = await supabase
    .from('books')
    .update(bookData)
    .eq('id', id)
    .select();
  
  return { book: data?.[0], error };
};

// Delete a book (admin only)
export const deleteBook = async (id: string) => {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Get books purchased by a user
export const getUserPurchasedBooks = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_purchases')
    .select(`
      book_id,
      purchase_date,
      books (*)
    `)
    .eq('user_id', userId);
  
  return { 
    purchases: data?.map(item => ({
      ...item.books,
      purchaseDate: item.purchase_date
    })), 
    error 
  };
};

// Purchase a book
export const purchaseBook = async (userId: string, bookId: string) => {
  const { data, error } = await supabase
    .from('user_purchases')
    .insert([{ user_id: userId, book_id: bookId }])
    .select();
  
  return { purchase: data?.[0], error };
};
