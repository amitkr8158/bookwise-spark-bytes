
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export interface Review {
  id: string;
  userId: string;
  bookId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  content: string;
  createdAt: Date;
  isVisible: boolean;
  isTopReview: boolean;
}

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const { userName, userAvatar, rating, content, createdAt, isTopReview } = review;

  // Generate avatar fallback from username initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const renderStars = (count: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          size={16}
          className={`${
            index < count ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <div className="bg-card border rounded-lg p-4 mb-4 relative">
      {isTopReview && (
        <Badge className="absolute top-2 right-2" variant="secondary">
          Top Review
        </Badge>
      )}
      
      <div className="flex items-center gap-3 mb-3">
        <Avatar>
          <AvatarImage src={userAvatar} />
          <AvatarFallback>{getInitials(userName)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{userName}</h3>
          <div className="flex items-center gap-1 mt-1">
            {renderStars(rating)}
          </div>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-2">{content}</p>
      
      <div className="text-xs text-muted-foreground">
        {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
      </div>
    </div>
  );
};

export default ReviewCard;
