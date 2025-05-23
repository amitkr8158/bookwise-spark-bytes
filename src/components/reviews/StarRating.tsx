
import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  onRatingChange, 
  size = 24 
}) => {
  const stars = Array(5).fill(0);
  
  const handleClick = (index: number) => {
    if (onRatingChange) {
      // Convert to 1-5 rating
      onRatingChange(index + 1);
    }
  };
  
  return (
    <div className="flex">
      {stars.map((_, index) => {
        const isFilled = index < rating;
        
        return (
          <Star
            key={index}
            size={size}
            className={`cursor-pointer ${
              isFilled 
                ? "text-yellow-500 fill-yellow-500" 
                : "text-gray-300"
            } transition-colors`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => onRatingChange && handleClick(index)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
