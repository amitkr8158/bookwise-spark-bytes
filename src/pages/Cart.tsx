
import React, { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePageViewTracking } from "@/hooks/useAnalytics";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { X, ShoppingCart, Minus, Plus } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Mock cart data - would be stored in a context/state manager in a real app
interface CartItem {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  quantity: number;
}

// Helper function to convert currency to INR (assuming default is USD)
const convertToINR = (amountUSD: number): number => {
  // Using a fixed exchange rate of 1 USD = 83 INR
  const exchangeRate = 83;
  return amountUSD * exchangeRate;
};

// Format currency based on locale
const formatCurrency = (amount: number, locale: 'en' | 'hi'): string => {
  // For India, we use INR
  const currency = 'INR';
  const formatter = new Intl.NumberFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(amount);
};

const Cart = () => {
  const { t } = useTranslation();
  const { language } = useGlobalContext();
  
  // Track page view
  usePageViewTracking('/cart', 'Shopping Cart');
  
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      title: "The Psychology of Money",
      author: "Morgan Housel",
      coverImage: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=450&q=80",
      price: 12.99,
      quantity: 1
    },
    {
      id: "2",
      title: "Atomic Habits",
      author: "James Clear",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=450&q=80",
      price: 14.99,
      quantity: 1
    }
  ]);
  
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  
  // Calculate cart totals in USD
  const subtotalUSD = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountUSD = discount;
  const totalUSD = subtotalUSD - discountUSD;
  
  // Convert to INR
  const subtotalINR = convertToINR(subtotalUSD);
  const discountINR = convertToINR(discountUSD);
  const totalINR = convertToINR(totalUSD);
  
  // Handle quantity changes
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  };
  
  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "discount20") {
      setDiscount(subtotalUSD * 0.2);
      toast({
        title: "Promo code applied!",
        description: "You received 20% off your order.",
      });
    } else {
      setDiscount(0);
      toast({
        title: "Invalid promo code",
        description: "The promo code you entered is not valid.",
        variant: "destructive",
      });
    }
  };
  
  // Checkout function
  const handleCheckout = () => {
    toast({
      title: "Order placed!",
      description: "Your order has been placed successfully.",
    });
    // In a real app, this would redirect to a payment processor
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container px-4 py-12">
        <h1 className="text-3xl font-serif font-bold flex items-center gap-2 mb-6">
          <ShoppingCart className="h-7 w-7" />
          {t('nav.cart')}
        </h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Look like you haven't added any books to your cart yet.
            </p>
            <Link to="/browse">
              <Button size="lg">
                Browse Books
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-background border rounded-lg">
                    {/* Book Cover */}
                    <div className="w-20 h-28">
                      <img 
                        src={item.coverImage} 
                        alt={item.title} 
                        className="w-full h-full object-cover rounded"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "https://via.placeholder.com/150x210?text=Book+Cover";
                        }}
                      />
                    </div>
                    
                    {/* Book Details */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{item.title}</h3>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{item.author}</p>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <div className="h-8 px-4 flex items-center justify-center border-y">
                            {item.quantity}
                          </div>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="font-semibold">
                          {formatCurrency(convertToINR(item.price * item.quantity), language)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-background border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotalINR, language)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(discountINR, language)}</span>
                    </div>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-semibold text-lg mb-6">
                  <span>Total</span>
                  <span>{formatCurrency(totalINR, language)}</span>
                </div>
                
                {/* Promo Code */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-1 block">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 h-10 px-3 rounded-md border bg-background"
                    />
                    <Button 
                      variant="outline" 
                      onClick={applyPromoCode}
                    >
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try "DISCOUNT20" for 20% off
                  </p>
                </div>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                
                <div className="mt-4 text-center">
                  <Link 
                    to="/browse" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
