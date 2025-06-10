
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Users, BookOpen, MessageSquare } from "lucide-react";
import ReviewManager from "@/components/admin/ReviewManager";
import { mockBookReviews, mockProfiles } from "@/data/mockData";
import { Review } from "@/components/reviews/ReviewCard";

const ControllerDashboard: React.FC = () => {
  // Convert mock data to the format expected by ReviewManager
  const reviews: Review[] = mockBookReviews.map(review => {
    const userProfile = mockProfiles.find(p => p.id === review.user_id);
    return {
      id: review.id,
      userId: review.user_id,
      bookId: review.book_id,
      userName: userProfile?.full_name || 'Anonymous User',
      userAvatar: userProfile?.avatar_url,
      rating: review.rating,
      content: review.review_text || '',
      createdAt: review.created_at,
      isVisible: review.is_visible || false,
      isTopReview: review.is_top_review || false
    };
  });

  const handleToggleVisibility = (reviewId: string) => {
    console.log("Toggle visibility for review:", reviewId);
    // TODO: Implement actual visibility toggle
  };

  const handleToggleTopReview = (reviewId: string) => {
    console.log("Toggle top review for:", reviewId);
    // TODO: Implement actual top review toggle
  };

  const stats = [
    {
      title: "Total Reviews",
      value: reviews.length.toString(),
      description: "All user reviews",
      icon: MessageSquare,
    },
    {
      title: "Visible Reviews",
      value: reviews.filter(r => r.isVisible).length.toString(),
      description: "Currently visible to users",
      icon: Eye,
    },
    {
      title: "Top Reviews",
      value: reviews.filter(r => r.isTopReview).length.toString(),
      description: "Featured reviews",
      icon: BookOpen,
    },
    {
      title: "Pending Moderation",
      value: reviews.filter(r => !r.isVisible).length.toString(),
      description: "Reviews awaiting approval",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Controller Dashboard</h1>
        <p className="text-muted-foreground">
          Manage content moderation and user reviews
        </p>
        <Badge variant="secondary" className="mt-2">Controller Access</Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="reviews">Review Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reviews" className="space-y-4">
          <ReviewManager 
            reviews={reviews} 
            onToggleVisibility={handleToggleVisibility}
            onToggleTopReview={handleToggleTopReview}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ControllerDashboard;
