
import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePageViewTracking } from "@/hooks/useAnalytics";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useBooks } from "@/services/bookService";
import { Package, PackageCheck, PackagePlus, Check, Pencil, X, ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock book bundle data
interface BookBundle {
  id: string;
  name: string;
  description: string;
  books: string[];
  price: number;
  discount: number;
  isCustom?: boolean;
}

const defaultBundles: BookBundle[] = [
  {
    id: "bundle-1",
    name: "Personal Growth Starter Pack",
    description: "Essential reads for personal development and self-improvement",
    books: ["atomic-habits", "psychology-of-money", "thinking-fast-and-slow", "deep-work", "power-of-now"],
    price: 49.99,
    discount: 20
  },
  {
    id: "bundle-2",
    name: "Business Leadership Bundle",
    description: "Top books for aspiring leaders and executives",
    books: ["good-to-great", "start-with-why", "lean-startup", "radical-candor", "zero-to-one"],
    price: 59.99,
    discount: 25
  },
  {
    id: "bundle-3",
    name: "Mindfulness & Wellness Collection",
    description: "Comprehensive guide to mental health and mindfulness",
    books: ["power-of-now", "subtle-art", "why-we-sleep", "breath", "boundaries"],
    price: 39.99,
    discount: 15
  }
];

const Bundles = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { language } = useGlobalContext();
  
  // Track page view
  usePageViewTracking('/bundles', 'Book Bundles');
  
  const [activeTab, setActiveTab] = useState("featured");
  const [customBundles, setCustomBundles] = useState<BookBundle[]>([]);
  const [newBundleName, setNewBundleName] = useState("");
  const [editingBundle, setEditingBundle] = useState<BookBundle | null>(null);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [bundleDialogOpen, setBundleDialogOpen] = useState(false);
  
  // Get books for selection
  const { books, loading } = useBooks({
    language,
    limit: 30
  });
  
  // Create new custom bundle
  const createCustomBundle = () => {
    if (selectedBooks.length < 3) {
      toast({
        title: "Not enough books",
        description: "Please select at least 3 books for your bundle.",
        variant: "destructive"
      });
      return;
    }
    
    if (!newBundleName) {
      toast({
        title: "Bundle name required",
        description: "Please provide a name for your bundle.",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate price and discount
    const totalPrice = selectedBooks.length * 12.99;
    const discount = Math.min(selectedBooks.length * 2, 30); // 2% per book, max 30%
    const discountedPrice = totalPrice * (1 - discount / 100);
    
    const newBundle: BookBundle = {
      id: `custom-${Date.now()}`,
      name: newBundleName,
      description: `Your custom bundle with ${selectedBooks.length} books`,
      books: selectedBooks,
      price: parseFloat(discountedPrice.toFixed(2)),
      discount,
      isCustom: true
    };
    
    if (editingBundle) {
      // Update existing bundle
      setCustomBundles(customBundles.map(bundle => 
        bundle.id === editingBundle.id ? newBundle : bundle
      ));
      toast({
        title: "Bundle updated",
        description: `Your bundle "${newBundleName}" has been updated.`
      });
    } else {
      // Create new bundle
      setCustomBundles([...customBundles, newBundle]);
      toast({
        title: "Bundle created",
        description: `Your bundle "${newBundleName}" has been created.`
      });
    }
    
    // Reset form
    setNewBundleName("");
    setSelectedBooks([]);
    setEditingBundle(null);
    setBundleDialogOpen(false);
  };
  
  // Edit existing bundle
  const handleEditBundle = (bundle: BookBundle) => {
    setEditingBundle(bundle);
    setNewBundleName(bundle.name);
    setSelectedBooks([...bundle.books]);
    setBundleDialogOpen(true);
  };
  
  // Delete custom bundle
  const handleDeleteBundle = (bundleId: string) => {
    setCustomBundles(customBundles.filter(bundle => bundle.id !== bundleId));
    toast({
      title: "Bundle deleted",
      description: "Your bundle has been deleted."
    });
  };
  
  // Add/remove book from selection
  const toggleBookSelection = (bookId: string) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter(id => id !== bookId));
    } else {
      setSelectedBooks([...selectedBooks, bookId]);
    }
  };
  
  // Add bundle to cart
  const addBundleToCart = (bundle: BookBundle) => {
    toast({
      title: "Bundle added to cart",
      description: `${bundle.name} has been added to your cart.`
    });
  };
  
  // Reset form when dialog closes
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      if (!editingBundle) {
        setNewBundleName("");
        setSelectedBooks([]);
      }
    }
    setBundleDialogOpen(open);
  };
  
  // Get book details by ID
  const getBookById = (bookId: string) => {
    return books.find(book => book.id === bookId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container px-4 py-12">
          <div className="flex items-center gap-3 mb-8">
            <Package className="h-7 w-7 text-book-700" />
            <h1 className="text-3xl font-serif font-bold">Book Bundles</h1>
          </div>
          
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Save money with our curated book bundles. Get access to multiple book summaries at a discounted price.
            You can also create your own custom bundles with the books you're most interested in.
          </p>
          
          <Tabs defaultValue="featured" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="featured">
                <PackageCheck className="h-4 w-4 mr-2" />
                Featured Bundles
              </TabsTrigger>
              <TabsTrigger value="custom">
                <PackagePlus className="h-4 w-4 mr-2" />
                My Custom Bundles
              </TabsTrigger>
            </TabsList>
            
            {/* Featured Bundles Tab */}
            <TabsContent value="featured" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {defaultBundles.map((bundle) => (
                  <Card key={bundle.id} className="overflow-hidden">
                    <CardHeader className="bg-muted">
                      <Badge className="w-fit mb-2">{bundle.discount}% off</Badge>
                      <CardTitle>{bundle.name}</CardTitle>
                      <CardDescription>{bundle.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="font-semibold">Included Books:</div>
                        <ul className="space-y-1">
                          {bundle.books.map((bookId) => {
                            const book = getBookById(bookId);
                            return (
                              <li key={bookId} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                <span>{book ? book.title : bookId}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">${bundle.price}</span>
                        <span className="text-muted-foreground line-through">
                          ${(bundle.price / (1 - bundle.discount / 100)).toFixed(2)}
                        </span>
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={() => addBundleToCart(bundle)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Custom Bundles Tab */}
            <TabsContent value="custom" className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Custom Bundles</h2>
                
                <Dialog open={bundleDialogOpen} onOpenChange={handleDialogChange}>
                  <DialogTrigger asChild>
                    <Button>
                      <PackagePlus className="h-4 w-4 mr-2" />
                      Create New Bundle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingBundle ? "Edit Bundle" : "Create Custom Bundle"}</DialogTitle>
                      <DialogDescription>
                        {editingBundle 
                          ? "Modify your custom book bundle by changing the selected books or name."
                          : "Select at least 3 books to create your custom bundle. The more books you add, the bigger your discount!"}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                      <div className="space-y-2">
                        <label htmlFor="bundleName" className="text-sm font-medium">Bundle Name</label>
                        <Input 
                          id="bundleName"
                          value={newBundleName} 
                          onChange={(e) => setNewBundleName(e.target.value)}
                          placeholder="Enter a name for your bundle"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-sm font-medium">Select Books ({selectedBooks.length} selected)</div>
                          <div className="text-sm text-muted-foreground">
                            Discount: {Math.min(selectedBooks.length * 2, 30)}%
                          </div>
                        </div>
                        
                        {loading ? (
                          <div className="text-center py-12">Loading books...</div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-1">
                            {books.map((book) => (
                              <div 
                                key={book.id}
                                className={`p-3 border rounded-lg flex items-center gap-3 cursor-pointer ${
                                  selectedBooks.includes(book.id) ? "border-primary bg-primary/5" : ""
                                }`}
                                onClick={() => toggleBookSelection(book.id)}
                              >
                                <div className="w-12 h-16 flex-shrink-0">
                                  <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="w-full h-full object-cover rounded"
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium line-clamp-1">{book.title}</div>
                                  <div className="text-xs text-muted-foreground">{book.author}</div>
                                </div>
                                <div className="w-6 h-6 flex items-center justify-center border rounded-full">
                                  {selectedBooks.includes(book.id) && (
                                    <Check className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        variant="outline"
                        onClick={() => setBundleDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={createCustomBundle}
                        disabled={selectedBooks.length < 3 || !newBundleName}
                      >
                        {editingBundle ? "Update Bundle" : "Create Bundle"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {customBundles.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 border rounded-lg">
                  <PackagePlus className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Custom Bundles Yet</h3>
                  <p className="mt-1 text-muted-foreground max-w-md mx-auto">
                    Create your first custom bundle by selecting the books you're interested in.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="mt-4">
                        Create Your First Bundle
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      {/* Bundle creation form same as above */}
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customBundles.map((bundle) => (
                    <Card key={bundle.id} className="overflow-hidden">
                      <CardHeader className="bg-muted pb-4">
                        <div className="flex justify-between items-start">
                          <Badge className="w-fit">{bundle.discount}% off</Badge>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleEditBundle(bundle)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteBundle(bundle.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardTitle>{bundle.name}</CardTitle>
                        <CardDescription>{bundle.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="font-semibold">Included Books ({bundle.books.length}):</div>
                          <ul className="space-y-1 max-h-[180px] overflow-y-auto">
                            {bundle.books.map((bookId) => {
                              const book = getBookById(bookId);
                              return (
                                <li key={bookId} className="flex items-center gap-2">
                                  <Check className="h-4 w-4 flex-shrink-0 text-green-500" />
                                  <span className="line-clamp-1">{book ? book.title : bookId}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">${bundle.price}</span>
                          <span className="text-muted-foreground line-through">
                            ${(bundle.price / (1 - bundle.discount / 100)).toFixed(2)}
                          </span>
                        </div>
                        
                        <Button 
                          className="w-full"
                          onClick={() => addBundleToCart(bundle)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Bundles;
