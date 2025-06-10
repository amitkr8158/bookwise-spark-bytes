
import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import ControllerDashboard from "@/components/admin/ControllerDashboard";
import { usePageViewTracking } from "@/hooks/useAnalytics";
import { useGlobalContext } from "@/contexts/GlobalContext";

const Admin = () => {
  const { user } = useGlobalContext();
  
  // Track page view
  usePageViewTracking('/admin', 'Admin Dashboard');

  return (
    <AdminLayout>
      {user?.role === 'admin' ? (
        <AdminDashboard />
      ) : user?.role === 'controller' ? (
        <ControllerDashboard />
      ) : (
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      )}
    </AdminLayout>
  );
};

export default Admin;
