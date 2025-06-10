
import React from "react";
import BookManager from "@/pages/admin/BookManager";
import AdminTabs from "@/components/admin/AdminTabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Full administrative control over the platform
        </p>
        <Badge variant="default" className="mt-2">Full Admin Access</Badge>
      </div>

      <Tabs defaultValue="books" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="books">
          <BookManager />
        </TabsContent>
        
        <TabsContent value="reviews">
          <AdminTabs />
        </TabsContent>
        
        <TabsContent value="notifications">
          <div className="space-y-4 mt-4">
            <h2 className="text-xl font-semibold">Notification Management</h2>
            <p>Notification management features coming soon.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="subscriptions">
          <div className="space-y-4 mt-4">
            <h2 className="text-xl font-semibold">Subscription Management</h2>
            <p>Subscription management features coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
