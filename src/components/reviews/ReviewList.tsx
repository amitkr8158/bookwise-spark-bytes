
import React, { useState } from "react";
import ReviewCard, { Review } from "./ReviewCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ReviewListProps {
  bookId?: string;
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ bookId, reviews }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState("all");
  
  // Filter reviews based on search term and selected tab
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          review.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (tabValue === "all") return matchesSearch && review.isVisible;
    if (tabValue === "top") return matchesSearch && review.isTopReview && review.isVisible;
    
    const ratingValue = parseInt(tabValue);
    return matchesSearch && review.rating === ratingValue && review.isVisible;
  });
  
  // Count reviews by star rating
  const reviewCounts = {
    all: reviews.filter(r => r.isVisible).length,
    top: reviews.filter(r => r.isTopReview && r.isVisible).length,
    5: reviews.filter(r => r.rating === 5 && r.isVisible).length,
    4: reviews.filter(r => r.rating === 4 && r.isVisible).length,
    3: reviews.filter(r => r.rating === 3 && r.isVisible).length,
    2: reviews.filter(r => r.rating === 2 && r.isVisible).length,
    1: reviews.filter(r => r.rating === 1 && r.isVisible).length,
  };

  return (
    <div>
      {/* Search and filter section */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Tabs defaultValue="all" value={tabValue} onValueChange={setTabValue}>
          <TabsList className="w-full grid grid-cols-7">
            <TabsTrigger value="all">All ({reviewCounts.all})</TabsTrigger>
            <TabsTrigger value="top">Top ({reviewCounts.top})</TabsTrigger>
            <TabsTrigger value="5">5★ ({reviewCounts[5]})</TabsTrigger>
            <TabsTrigger value="4">4★ ({reviewCounts[4]})</TabsTrigger>
            <TabsTrigger value="3">3★ ({reviewCounts[3]})</TabsTrigger>
            <TabsTrigger value="2">2★ ({reviewCounts[2]})</TabsTrigger>
            <TabsTrigger value="1">1★ ({reviewCounts[1]})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No reviews found.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="top" className="mt-6">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No top reviews found.
              </div>
            )}
          </TabsContent>
          
          {[5, 4, 3, 2, 1].map((rating) => (
            <TabsContent key={rating} value={rating.toString()} className="mt-6">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No {rating}-star reviews found.
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ReviewList;
