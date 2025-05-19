
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

interface CategoryProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  className?: string;
}

const categories: CategoryProps[] = [
  {
    id: "business",
    name: "Business & Finance",
    description: "Leadership, strategy, and financial wisdom",
    icon: "📊",
    count: 85
  },
  {
    id: "psychology",
    name: "Psychology",
    description: "Understand the human mind and behavior",
    icon: "🧠",
    count: 64
  },
  {
    id: "self-help",
    name: "Self Improvement",
    description: "Personal growth and productivity",
    icon: "🚀",
    count: 103
  },
  {
    id: "health",
    name: "Health & Wellness",
    description: "Physical and mental wellbeing",
    icon: "💪",
    count: 47
  },
  {
    id: "science",
    name: "Science & Technology",
    description: "Scientific discoveries and innovations",
    icon: "🔬",
    count: 56
  },
  {
    id: "philosophy",
    name: "Philosophy",
    description: "Big ideas and deep thinking",
    icon: "🧐",
    count: 32
  },
];

const CategoryCard: React.FC<CategoryProps> = ({
  id,
  name,
  description,
  icon,
  count,
  className
}) => {
  return (
    <Link 
      to={`/category/${id}`} 
      className={cn(
        "block p-6 rounded-lg transition-all duration-300",
        "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700",
        "border border-gray-100 dark:border-gray-700",
        "shadow-sm hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1">
          <h3 className="font-serif font-bold text-xl">{name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          <p className="text-sm font-medium text-book-700 mt-2">{count} books</p>
        </div>
      </div>
    </Link>
  );
};

const CategorySection = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-12 bg-muted/30">
      <div className="container px-4">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8">
          Browse by Category
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              {...category} 
            />
          ))}
        </div>
        
        <div className="flex justify-center mt-8">
          <Link 
            to="/categories"
            className="text-book-700 font-medium hover:text-book-800 transition-colors"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
