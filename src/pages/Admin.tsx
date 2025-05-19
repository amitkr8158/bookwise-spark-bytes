
import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePageViewTracking } from "@/hooks/useAnalytics";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Package, Plus, Pencil, Trash, Check, X } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define Book interface to fix TypeScript errors
interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  category: string;
  rating: number;
  price: number;
  hasPdf: boolean;
  hasAudio: boolean;
  hasVideo: boolean;
  isFree: boolean;
  summary?: string;
  pdfUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
}

// Dummy books data for admin management
const mockBooks: Book[] = [
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/81wgcld4wxL.jpg",
    category: "self-help",
    rating: 4.8,
    price: 12.99,
    hasPdf: true,
    hasAudio: true,
    hasVideo: false,
    isFree: false
  },
  {
    id: "thinking-fast-and-slow",
    title: "Thinking Fast and Slow",
    author: "Daniel Kahneman",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/61fdrEuPJwL.jpg",
    category: "psychology",
    rating: 4.6,
    price: 14.99,
    hasPdf: true,
    hasAudio: true,
    hasVideo: false,
    isFree: false
  },
  {
    id: "zero-to-one",
    title: "Zero to One",
    author: "Peter Thiel",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/71Xygne8+qL.jpg",
    category: "business",
    rating: 4.5,
    price: 11.99,
    hasPdf: true,
    hasAudio: false,
    hasVideo: false,
    isFree: true
  }
];

// Book form schema
const bookSchema = z.object({
  id: z.string().min(3, { message: "ID must be at least 3 characters" }),
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  author: z.string().min(2, { message: "Author must be at least 2 characters" }),
  coverImage: z.string().url({ message: "Must be a valid URL" }),
  category: z.string().min(1, { message: "Please select a category" }),
  rating: z.coerce.number().min(1).max(5),
  price: z.coerce.number().min(0),
  summary: z.string().optional(),
  pdfUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal("")),
  audioUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal("")),
  videoUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal("")),
  hasPdf: z.boolean().default(false),
  hasAudio: z.boolean().default(false),
  hasVideo: z.boolean().default(false),
  isFree: z.boolean().default(false)
});

// Define the form type using the zod schema
type BookFormValues = z.infer<typeof bookSchema>;

const Admin = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  
  // Track page view
  usePageViewTracking('/admin', 'Admin - Book Management');
  
  // Setup form
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      id: "",
      title: "",
      author: "",
      coverImage: "",
      category: "",
      rating: 4,
      price: 9.99,
      summary: "",
      pdfUrl: "",
      audioUrl: "",
      videoUrl: "",
      hasPdf: false,
      hasAudio: false,
      hasVideo: false,
      isFree: false
    },
  });
  
  // Handle form submit
  const onSubmit = (data: BookFormValues) => {
    console.log("Form data:", data);
    
    // If editing existing book
    if (editingBook) {
      setBooks(books.map(book => 
        book.id === editingBook.id ? { ...data } as Book : book
      ));
      
      toast({
        title: "Book Updated",
        description: `${data.title} has been updated.`
      });
    } else {
      // If creating new book
      setBooks([...books, data as Book]);
      
      toast({
        title: "Book Added",
        description: `${data.title} has been added to your catalog.`
      });
    }
    
    // Reset form and close dialog
    resetForm();
  };
  
  // Set up form for editing
  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    
    // Populate form with book data
    form.reset({
      id: book.id,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      category: book.category,
      rating: book.rating,
      price: book.price,
      summary: book.summary || "",
      pdfUrl: book.pdfUrl || "",
      audioUrl: book.audioUrl || "",
      videoUrl: book.videoUrl || "",
      hasPdf: book.hasPdf,
      hasAudio: book.hasAudio,
      hasVideo: book.hasVideo,
      isFree: book.isFree
    });
    
    setIsDialogOpen(true);
  };
  
  // Handle book deletion
  const handleDeleteBook = (bookId: string) => {
    if (confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
      setBooks(books.filter(book => book.id !== bookId));
      
      toast({
        title: "Book Deleted",
        description: "The book has been removed from your catalog."
      });
    }
  };
  
  // Reset form and dialog state
  const resetForm = () => {
    form.reset({
      id: "",
      title: "",
      author: "",
      coverImage: "",
      category: "",
      rating: 4,
      price: 9.99,
      summary: "",
      pdfUrl: "",
      audioUrl: "",
      videoUrl: "",
      hasPdf: false,
      hasAudio: false,
      hasVideo: false,
      isFree: false
    });
    setEditingBook(null);
    setIsDialogOpen(false);
  };
  
  // Categories for select dropdown
  const categories = [
    { value: "business", label: "Business & Finance" },
    { value: "psychology", label: "Psychology" },
    { value: "self-help", label: "Self Improvement" },
    { value: "health", label: "Health & Wellness" },
    { value: "science", label: "Science & Technology" },
    { value: "philosophy", label: "Philosophy" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage your book catalog and summaries
              </p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Book
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingBook ? "Edit Book" : "Add New Book"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingBook 
                      ? "Update the information for this book in your catalog." 
                      : "Fill in the details to add a new book to your catalog."}
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Book ID</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="book-title-slug" 
                                  {...field}
                                  disabled={!!editingBook}
                                />
                              </FormControl>
                              <FormDescription>
                                A unique identifier for the book (URL friendly)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Book Title" 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="author"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Author</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Author Name" 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem 
                                      key={category.value} 
                                      value={category.value}
                                    >
                                      {category.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rating</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="1" 
                                    max="5" 
                                    step="0.1"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="0" 
                                    step="0.01" 
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="coverImage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cover Image URL</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="https://example.com/image.jpg" 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="summary"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Summary</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Book summary text..." 
                                  rows={4}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 gap-4">
                          <FormField
                            control={form.control}
                            name="pdfUrl"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center justify-between mb-2">
                                  <FormLabel>PDF URL</FormLabel>
                                  <FormField
                                    control={form.control}
                                    name="hasPdf"
                                    render={({ field }) => (
                                      <FormItem className="flex items-center space-x-2">
                                        <FormLabel className="text-sm font-normal">Has PDF</FormLabel>
                                        <FormControl>
                                          <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <FormControl>
                                  <Input 
                                    placeholder="https://example.com/book.pdf" 
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="audioUrl"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center justify-between mb-2">
                                  <FormLabel>Audio URL</FormLabel>
                                  <FormField
                                    control={form.control}
                                    name="hasAudio"
                                    render={({ field }) => (
                                      <FormItem className="flex items-center space-x-2">
                                        <FormLabel className="text-sm font-normal">Has Audio</FormLabel>
                                        <FormControl>
                                          <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <FormControl>
                                  <Input 
                                    placeholder="https://example.com/book.mp3" 
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="videoUrl"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center justify-between mb-2">
                                  <FormLabel>Video URL</FormLabel>
                                  <FormField
                                    control={form.control}
                                    name="hasVideo"
                                    render={({ field }) => (
                                      <FormItem className="flex items-center space-x-2">
                                        <FormLabel className="text-sm font-normal">Has Video</FormLabel>
                                        <FormControl>
                                          <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <FormControl>
                                  <Input 
                                    placeholder="https://example.com/video.mp4" 
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="isFree"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div>
                                <FormLabel>Free Book</FormLabel>
                                <FormDescription>
                                  Make this book available for free
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={resetForm}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingBook ? "Update Book" : "Add Book"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Book Management Cards & Table */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Total Books</CardTitle>
                <CardDescription>Books in your catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{books.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Free Books</CardTitle>
                <CardDescription>Books available for free</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {books.filter(book => book.isFree).length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Premium Books</CardTitle>
                <CardDescription>Books requiring purchase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {books.filter(book => !book.isFree).length}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Book Catalog</CardTitle>
              <CardDescription>Manage your books catalog</CardDescription>
            </CardHeader>
            <CardContent>
              {books.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Books Added</h3>
                  <p className="mt-1 text-muted-foreground">
                    Add your first book to get started.
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
                    Add Your First Book
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Cover</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Features</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {books.map((book) => (
                        <TableRow key={book.id}>
                          <TableCell>
                            <div className="h-12 w-9 bg-muted rounded overflow-hidden">
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{book.title}</TableCell>
                          <TableCell>{book.author}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{book.category}</Badge>
                          </TableCell>
                          <TableCell>{book.rating}</TableCell>
                          <TableCell>
                            {book.isFree ? (
                              <Badge variant="secondary">Free</Badge>
                            ) : (
                              `$${book.price.toFixed(2)}`
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {book.hasPdf && (
                                <Badge variant="secondary" className="text-xs">PDF</Badge>
                              )}
                              {book.hasAudio && (
                                <Badge variant="secondary" className="text-xs">Audio</Badge>
                              )}
                              {book.hasVideo && (
                                <Badge variant="secondary" className="text-xs">Video</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditBook(book)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteBook(book.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
