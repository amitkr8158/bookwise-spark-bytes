
import React from "react";
import BookManager from "./admin/BookManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/layout/AdminLayout";
import { usePageViewTracking } from "@/hooks/useAnalytics";

const Admin = () => {
  // Track page view
  usePageViewTracking('/admin', 'Admin Dashboard');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your platform content and settings
          </p>
        </div>

        <Tabs defaultValue="books" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="subscriptions">Email Subscriptions</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="books">
            <BookManager />
          </TabsContent>
          <TabsContent value="subscriptions">
            <div className="space-y-4 mt-4">
              <h2 className="text-xl font-semibold">Subscription Management</h2>
              <p>Subscription management will be enabled soon.</p>
            </div>
          </TabsContent>
          <TabsContent value="reviews">
            <div className="space-y-4 mt-4">
              <h2 className="text-xl font-semibold">Review Management</h2>
              <p>Review management will be enabled soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Admin;
