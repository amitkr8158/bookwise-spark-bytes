import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePageViewTracking } from "@/hooks/useAnalytics";
import { useToast } from "@/components/ui/use-toast";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { format } from "date-fns";
import { signOut, getOrCreateUserProfile } from "@/services/auth/authService";
import { getUserPurchasedBooks } from "@/services/books/bookService";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { User, Book, Package, FileText, Download, ExternalLink } from "lucide-react";

// Sample PDF import
import samplePdf from "../assets/sample-summary.pdf";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    isAuthenticated, 
    user, 
    setUser, 
    setIsAuthenticated
  } = useGlobalContext();
  
  const [isLoading, setIsLoading] = useState(true);
  const [purchasedBooks, setPurchasedBooks] = useState<any[]>([]);
  
  // Track page view
  usePageViewTracking('/profile', 'User Profile');
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Ensure user profile exists and fetch purchased books
  useEffect(() => {
    const initializeProfile = async () => {
      if (!isAuthenticated) return;
      
      // Get current auth user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;
      
      try {
        // Ensure profile exists
        const { data: profile, error: profileError } = await getOrCreateUserProfile(
          authUser.id, 
          {
            full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
            email: authUser.email || ''
          }
        );
        
        if (profileError) {
          console.error("Error ensuring profile exists:", profileError);
        } else if (profile && !user) {
          // Update global user state if not already set
          setUser({
            id: authUser.id,
            name: profile.full_name || '',
            email: authUser.email || '',
            role: profile.role || 'user',
            avatar: profile.avatar_url || undefined,
          });
        }
        
        // Fetch purchased books
        const { purchases, error: booksError } = await getUserPurchasedBooks(authUser.id);
        
        if (booksError) {
          console.error("Error fetching purchased items:", booksError);
        } else if (purchases) {
          setPurchasedBooks(purchases);
        }
      } catch (error) {
        console.error("Error in profile initialization:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeProfile();
  }, [isAuthenticated, user, setUser]);
  
  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Separate books and bundles
  const purchasedBundles: any[] = []; // To be implemented with bundles table
  
  // Formats date string
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  if (!isAuthenticated || !user) {
    return null; // Redirecting in useEffect
  }
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  // Handle download PDF
  const handleDownloadPdf = (bookId: string) => {
    console.log(`Downloading PDF for book ID: ${bookId}`);
    
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = samplePdf;
    link.download = `book-summary-${bookId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar / User Info */}
            <div className="w-full md:w-1/3">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-16 w-16">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <CardTitle>{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                    {user.role === 'admin' && (
                      <span className="inline-flex h-5 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground mt-1">
                        Admin
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Account Summary</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Purchased Books</div>
                      <div>{purchasedBooks.length}</div>
                      <div>Purchased Bundles</div>
                      <div>{purchasedBundles.length}</div>
                    </div>
                  </div>
                  
                  {user.role === 'admin' && (
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-2">Admin Actions</h4>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/admin">Manage Books</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    Log Out
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="w-full md:w-2/3">
              <Tabs defaultValue="books">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="books">
                    <Book className="h-4 w-4 mr-2" /> Books
                  </TabsTrigger>
                  <TabsTrigger value="bundles">
                    <Package className="h-4 w-4 mr-2" /> Bundles
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="books" className="py-4">
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : purchasedBooks.length === 0 ? (
                    <div className="text-center py-12 bg-muted/50 rounded-lg">
                      <Book className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                      <h3 className="text-xl font-medium mb-2">No books purchased yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Explore our collection and find your first book!
                      </p>
                      <Button asChild>
                        <Link to="/browse">Browse Books</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-card border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[300px]">Book</TableHead>
                            <TableHead>Purchase Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {purchasedBooks.map(book => (
                            <TableRow key={book.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={book.cover_image || "https://via.placeholder.com/90x120?text=Cover"}
                                    alt={book.title}
                                    className="h-12 w-9 object-cover rounded"
                                  />
                                  <span>{book.title}</span>
                                </div>
                              </TableCell>
                              <TableCell>{formatDate(book.purchaseDate)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="flex items-center gap-1"
                                    onClick={() => handleDownloadPdf(book.id)}
                                  >
                                    <Download className="w-4 h-4" /> PDF
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="flex items-center gap-1"
                                    asChild
                                  >
                                    <Link to={`/book/${book.id}`}>
                                      <ExternalLink className="w-4 h-4" /> View
                                    </Link>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="bundles" className="py-4">
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-muted/50 rounded-lg">
                      <Package className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                      <h3 className="text-xl font-medium mb-2">No bundles purchased yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Get more value with our curated book bundles!
                      </p>
                      <Button asChild>
                        <Link to="/bundles">Browse Bundles</Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
