
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Edit, Trash2, Search, BookOpenCheck } from "lucide-react";
import { useGlobalContext } from "@/contexts/GlobalContext";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getBooks, createBook, updateBook, deleteBook, BookInput, Book } from "@/services/books/bookService";

const BookManager = () => {
  const { toast } = useToast();
  const { user } = useGlobalContext();
  const navigate = useNavigate();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState<BookInput>({
    title: "",
    author: "",
    description: "",
    category: "",
    language: "en",
    is_free: false,
    price: 0,
    page_count: 0,
    read_time: 0
  });
  
  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You must be an admin to access this page",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [user, navigate, toast]);
  
  // Load books
  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      try {
        const { books, error } = await getBooks();
        
        if (error) {
          throw error;
        }
        
        if (books) {
          setBooks(books as Book[]);
        }
      } catch (error) {
        console.error("Error loading books:", error);
        toast({
          title: "Error",
          description: "Failed to load books",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBooks();
  }, [toast]);
  
  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      is_free: checked,
      price: checked ? 0 : formData.price
    });
  };
  
  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Open dialog to add new book
  const handleAddBook = () => {
    setCurrentBook(null);
    setFormData({
      title: "",
      author: "",
      description: "",
      category: "",
      language: "en",
      is_free: false,
      price: 0,
      page_count: 0,
      read_time: 0
    });
    setIsDialogOpen(true);
  };
  
  // Open dialog to edit book
  const handleEditBook = (book: Book) => {
    setCurrentBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description || "",
      category: book.category || "",
      language: book.language || "en",
      is_free: book.is_free,
      price: book.price || 0,
      pdf_url: book.pdf_url,
      audio_url: book.audio_url,
      video_url: book.video_url,
      page_count: book.page_count || 0,
      read_time: book.read_time || 0,
      cover_image: book.cover_image,
      published_at: book.published_at
    });
    setIsDialogOpen(true);
  };
  
  // Confirm delete book
  const confirmDelete = (book: Book) => {
    setCurrentBook(book);
    setIsDeleteDialogOpen(true);
  };
  
  // Submit form to create or update book
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (currentBook) {
        // Update existing book
        const { error } = await updateBook(currentBook.id, formData);
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Book Updated",
          description: `${formData.title} has been updated successfully`
        });
        
        // Update books list
        setBooks(books.map(book => 
          book.id === currentBook.id ? { ...book, ...formData } as Book : book
        ));
      } else {
        // Create new book
        if (!user?.id) {
          throw new Error("User not authenticated");
        }
        
        const { book, error } = await createBook(formData, user.id);
        
        if (error) {
          throw error;
        }
        
        if (book) {
          toast({
            title: "Book Created",
            description: `${formData.title} has been added successfully`
          });
          
          // Add new book to list
          setBooks([...books, book]);
        }
      }
      
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving book:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save book",
        variant: "destructive"
      });
    }
  };
  
  // Delete book
  const handleDeleteBook = async () => {
    if (!currentBook) return;
    
    try {
      const { error } = await deleteBook(currentBook.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Book Deleted",
        description: `${currentBook.title} has been deleted successfully`
      });
      
      // Remove book from list
      setBooks(books.filter(book => book.id !== currentBook.id));
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      console.error("Error deleting book:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete book",
        variant: "destructive"
      });
    }
  };
  
  // Filter books by search term
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase()) ||
    (book.description && book.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Manage Books</CardTitle>
              <CardDescription>Add, edit, and remove books from your platform</CardDescription>
            </div>
            <Button onClick={handleAddBook}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Book
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {search ? "No books match your search" : "No books added yet"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="bg-muted w-10 h-14 rounded flex items-center justify-center">
                              {book.cover_image ? (
                                <img 
                                  src={book.cover_image} 
                                  alt={book.title} 
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <BookOpenCheck className="text-muted-foreground" />
                              )}
                            </div>
                            <span>{book.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.category || "-"}</TableCell>
                        <TableCell>{book.is_free ? "Free" : `$${book.price?.toFixed(2)}`}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditBook(book)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => confirmDelete(book)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Book Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentBook ? "Edit Book" : "Add New Book"}</DialogTitle>
            <DialogDescription>
              {currentBook 
                ? "Update the book details below" 
                : "Fill out the form below to add a new book to your platform"
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input 
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input 
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea 
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full h-24 px-3 py-2 border rounded-md"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category"
                  name="category"
                  value={formData.category || ""}
                  onChange={handleChange}
                  placeholder="e.g. Psychology, Business, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={formData.language} 
                  onValueChange={(value) => handleSelectChange("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="is_free"
                    checked={formData.is_free}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="is_free">Free Book</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input 
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.is_free ? 0 : formData.price}
                  onChange={handleChange}
                  disabled={formData.is_free}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cover_image">Cover Image URL</Label>
                <Input 
                  id="cover_image"
                  name="cover_image"
                  value={formData.cover_image || ""}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="page_count">Page Count</Label>
                <Input 
                  id="page_count"
                  name="page_count"
                  type="number"
                  min="0"
                  value={formData.page_count || ""}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="read_time">Read Time (minutes)</Label>
                <Input 
                  id="read_time"
                  name="read_time"
                  type="number"
                  min="0"
                  value={formData.read_time || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pdf_url">PDF URL</Label>
                <Input 
                  id="pdf_url"
                  name="pdf_url"
                  value={formData.pdf_url || ""}
                  onChange={handleChange}
                  placeholder="https://example.com/book.pdf"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="audio_url">Audio URL</Label>
                <Input 
                  id="audio_url"
                  name="audio_url"
                  value={formData.audio_url || ""}
                  onChange={handleChange}
                  placeholder="https://example.com/audio.mp3"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="video_url">Video URL</Label>
                <Input 
                  id="video_url"
                  name="video_url"
                  value={formData.video_url || ""}
                  onChange={handleChange}
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {currentBook ? "Update Book" : "Add Book"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentBook?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBook}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookManager;
