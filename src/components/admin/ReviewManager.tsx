
import React, { useState } from "react";
import { Review } from "@/components/reviews/ReviewCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { 
  Eye, 
  EyeOff, 
  Star, 
  Search,
  Plus,
  Minus,
  Pencil
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ReviewManagerProps {
  reviews: Review[];
  onToggleVisibility: (reviewId: string, isVisible: boolean) => void;
  onToggleTopReview: (reviewId: string, isTopReview: boolean) => void;
}

const ReviewManager: React.FC<ReviewManagerProps> = ({ reviews, onToggleVisibility, onToggleTopReview }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVisible, setFilterVisible] = useState<boolean | null>(null);
  const [filterTopReview, setFilterTopReview] = useState<boolean | null>(null);
  
  // Filter reviews based on search term and filters
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesVisibility = 
      filterVisible === null || review.isVisible === filterVisible;
      
    const matchesTopReview = 
      filterTopReview === null || review.isTopReview === filterTopReview;
      
    return matchesSearch && matchesVisibility && matchesTopReview;
  });
  
  // Generate initials from username
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Render stars for rating
  const renderStars = (count: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          size={14}
          className={`${
            index < count ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Review Management</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setFilterVisible(null)}>
            All
          </Button>
          <Button 
            variant={filterVisible === true ? "default" : "outline"} 
            onClick={() => setFilterVisible(true)}
          >
            Visible
          </Button>
          <Button 
            variant={filterVisible === false ? "default" : "outline"} 
            onClick={() => setFilterVisible(false)}
          >
            Hidden
          </Button>
          <Button 
            variant={filterTopReview === true ? "default" : "outline"} 
            onClick={() => setFilterTopReview(prev => prev === true ? null : true)}
          >
            Top Reviews
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search reviews by user or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="w-[40%]">Review</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Top Review</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No reviews found.
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={review.userAvatar} />
                        <AvatarFallback>{getInitials(review.userName)}</AvatarFallback>
                      </Avatar>
                      <span>{review.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {review.content.length > 100
                      ? `${review.content.substring(0, 100)}...`
                      : review.content}
                  </TableCell>
                  <TableCell>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={review.isVisible}
                      onCheckedChange={(checked) => onToggleVisibility(review.id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={review.isTopReview}
                      onCheckedChange={(checked) => onToggleTopReview(review.id, checked)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {review.isVisible ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive"
                          onClick={() => onToggleVisibility(review.id, false)}
                        >
                          <EyeOff className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => onToggleVisibility(review.id, true)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReviewManager;
