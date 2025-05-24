import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  signUp, 
  signIn, 
  signOut, 
  getOrCreateUserProfile
} from "@/services/auth/authService";
import { getBooks, createBook } from "@/services/books/bookService";

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
}

const ComprehensiveFlowTester = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');

  // Test configuration
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = "TestPass123!";
  const adminEmail = "admin@example.com";
  const customerEmail = "customer@example.com";

  const addResult = (result: TestResult) => {
    setTestResults(prev => [...prev, result]);
  };

  const setCurrentTestStatus = (testName: string) => {
    setCurrentTest(testName);
  };

  // Helper function to handle profile creation failures
  const handleProfileFailure = async (error: any) => {
    console.log("Profile creation failed, logging out and cleaning session:", error);
    
    // Attempt to sign out to clean up the session
    try {
      await signOut();
    } catch (logoutError) {
      console.error("Error during cleanup logout:", logoutError);
    }
    
    return {
      status: 'error' as const,
      message: `Profile creation failed (RLS policy violation): ${error.message}. Session cleaned up.`,
      details: error
    };
  };

  // Test 1: Database Connection
  const testDatabaseConnection = async () => {
    setCurrentTestStatus("Database Connection");
    try {
      const { data, error } = await supabase.from('books').select('count').limit(1);
      if (error) throw error;
      
      addResult({
        name: "Database Connection",
        status: 'success',
        message: "Successfully connected to Supabase database"
      });
    } catch (error: any) {
      addResult({
        name: "Database Connection",
        status: 'error',
        message: `Database connection failed: ${error.message}`
      });
    }
  };

  // Test 2: Auth System Availability
  const testAuthSystem = async () => {
    setCurrentTestStatus("Auth System");
    try {
      const { data } = await supabase.auth.getSession();
      addResult({
        name: "Auth System",
        status: 'success',
        message: "Auth system is available and responsive"
      });
    } catch (error: any) {
      addResult({
        name: "Auth System",
        status: 'error',
        message: `Auth system error: ${error.message}`
      });
    }
  };

  // Test 3: New User Registration
  const testUserRegistration = async () => {
    setCurrentTestStatus("User Registration");
    try {
      const { data, error } = await signUp({
        email: testEmail,
        password: testPassword,
        name: "Test User",
        metadata: {
          address: "123 Test St",
          mobile: "+1234567890"
        }
      });

      if (error) throw error;

      addResult({
        name: "User Registration",
        status: 'success',
        message: `User registered successfully: ${testEmail}`,
        details: data
      });
      
      return data.user;
    } catch (error: any) {
      addResult({
        name: "User Registration",
        status: 'error',
        message: `Registration failed: ${error.message}`
      });
      return null;
    }
  };

  // Test 4: Profile Creation with failure handling
  const testProfileCreation = async (userId: string) => {
    setCurrentTestStatus("Profile Creation");
    try {
      const { data, error } = await getOrCreateUserProfile(userId, {
        full_name: "Test User",
        email: testEmail
      });

      if (error) {
        // Handle RLS policy violations specifically
        if (error.message?.includes('row-level security policy')) {
          const result = await handleProfileFailure(error);
          addResult({
            name: "Profile Creation",
            ...result
          });
          return null;
        }
        throw error;
      }

      addResult({
        name: "Profile Creation",
        status: 'success',
        message: "User profile created/retrieved successfully",
        details: data
      });
      
      return data;
    } catch (error: any) {
      const result = await handleProfileFailure(error);
      addResult({
        name: "Profile Creation",
        ...result
      });
      return null;
    }
  };

  // Test 5: User Login
  const testUserLogin = async () => {
    setCurrentTestStatus("User Login");
    try {
      const { data, error } = await signIn({
        email: testEmail,
        password: testPassword
      });

      if (error) throw error;

      addResult({
        name: "User Login",
        status: 'success',
        message: "User login successful",
        details: { userId: data.user?.id }
      });
      
      return data.user;
    } catch (error: any) {
      addResult({
        name: "User Login",
        status: 'error',
        message: `Login failed: ${error.message}`
      });
      return null;
    }
  };

  // Test 6: Test User Accounts
  const testTestUserAccounts = async () => {
    setCurrentTestStatus("Test User Accounts");
    try {
      // Try to sign in with existing test accounts
      const { data: customerData, error: customerError } = await signIn({
        email: customerEmail,
        password: testPassword
      });

      if (customerError) {
        addResult({
          name: "Customer Account Login",
          status: 'error',
          message: `Customer account login failed: ${customerError.message}`
        });
      } else {
        addResult({
          name: "Customer Account Login",
          status: 'success',
          message: "Customer account login successful"
        });
      }

      // Sign out before testing admin
      await signOut();

      // Test admin account
      const { data: adminData, error: adminError } = await signIn({
        email: adminEmail,
        password: testPassword
      });

      if (adminError) {
        addResult({
          name: "Admin Account Login",
          status: 'error',
          message: `Admin account login failed: ${adminError.message}`
        });
      } else {
        addResult({
          name: "Admin Account Login",
          status: 'success',
          message: "Admin account login successful"
        });
      }
    } catch (error: any) {
      addResult({
        name: "Test User Accounts",
        status: 'error',
        message: `Test accounts failed: ${error.message}`
      });
    }
  };

  // Test 7: Books Table Operations
  const testBooksOperations = async () => {
    setCurrentTestStatus("Books Operations");
    try {
      // Test reading books
      const { books, error: readError } = await getBooks({ limit: 5 });
      if (readError) throw readError;

      addResult({
        name: "Books Read Operation",
        status: 'success',
        message: `Successfully read ${books?.length || 0} books from database`
      });

      // Test creating a book (requires admin permissions)
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        const { book, error: createError } = await createBook({
          title: "Test Book",
          author: "Test Author",
          description: "A test book for validation",
          category: "Technology",
          language: "en",
          is_free: true,
          price: 0
        }, session.session.user.id);

        if (createError) {
          addResult({
            name: "Books Create Operation",
            status: 'error',
            message: `Book creation failed: ${createError.message}`
          });
        } else {
          addResult({
            name: "Books Create Operation",
            status: 'success',
            message: "Successfully created test book",
            details: book
          });
        }
      }
    } catch (error: any) {
      addResult({
        name: "Books Operations",
        status: 'error',
        message: `Books operations failed: ${error.message}`
      });
    }
  };

  // Test 8: User Session Persistence
  const testSessionPersistence = async () => {
    setCurrentTestStatus("Session Persistence");
    try {
      const { data: initialSession } = await supabase.auth.getSession();
      
      if (!initialSession.session) {
        addResult({
          name: "Session Persistence",
          status: 'error',
          message: "No active session to test persistence"
        });
        return;
      }

      // Simulate page refresh by getting session again
      const { data: refreshedSession } = await supabase.auth.getSession();
      
      if (refreshedSession.session?.user.id === initialSession.session.user.id) {
        addResult({
          name: "Session Persistence",
          status: 'success',
          message: "Session persists correctly across requests"
        });
      } else {
        addResult({
          name: "Session Persistence",
          status: 'error',
          message: "Session persistence failed"
        });
      }
    } catch (error: any) {
      addResult({
        name: "Session Persistence",
        status: 'error',
        message: `Session persistence test failed: ${error.message}`
      });
    }
  };

  // Test 9: Logout Functionality
  const testLogout = async () => {
    setCurrentTestStatus("Logout");
    try {
      const { error } = await signOut();
      if (error) throw error;

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        addResult({
          name: "Logout",
          status: 'error',
          message: "Session still exists after logout"
        });
      } else {
        addResult({
          name: "Logout",
          status: 'success',
          message: "Logout successful, session cleared"
        });
      }
    } catch (error: any) {
      addResult({
        name: "Logout",
        status: 'error',
        message: `Logout failed: ${error.message}`
      });
    }
  };

  // Test 10: Error Handling
  const testErrorHandling = async () => {
    setCurrentTestStatus("Error Handling");
    try {
      // Test invalid login
      const { error } = await signIn({
        email: "invalid@email.com",
        password: "wrongpassword"
      });

      if (error) {
        addResult({
          name: "Error Handling",
          status: 'success',
          message: "Error handling works correctly for invalid credentials"
        });
      } else {
        addResult({
          name: "Error Handling",
          status: 'error',
          message: "Expected error for invalid credentials but got success"
        });
      }
    } catch (error: any) {
      addResult({
        name: "Error Handling",
        status: 'success',
        message: "Error handling working properly"
      });
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setCurrentTest('');

    try {
      await testDatabaseConnection();
      await testAuthSystem();
      
      const user = await testUserRegistration();
      if (user) {
        const profile = await testProfileCreation(user.id);
        // Only continue with login if profile creation succeeded
        if (profile) {
          await testUserLogin();
        }
      }
      
      await testTestUserAccounts();
      await testBooksOperations();
      await testSessionPersistence();
      await testLogout();
      await testErrorHandling();

      toast({
        title: "Testing Complete",
        description: "All test flows have been executed",
      });
    } catch (error) {
      toast({
        title: "Testing Error",
        description: "An unexpected error occurred during testing",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Loader2 className="h-4 w-4 animate-spin" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const successCount = testResults.filter(r => r.status === 'success').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Comprehensive Flow Tester</CardTitle>
          <CardDescription>
            Test all authentication flows, database operations, and user scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={runAllTests}
              disabled={isRunning}
              className="w-full"
              size="lg"
            >
              {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isRunning ? `Running: ${currentTest}...` : "Run All Tests"}
            </Button>

            {testResults.length > 0 && (
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{successCount}</div>
                  <div className="text-sm text-green-700">Passed</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                  <div className="text-sm text-red-700">Failed</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.name}</span>
                    </div>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{result.message}</p>
                  {result.details && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground">
                        View Details
                      </summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Test Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2 text-sm">
              <p><strong>Test Email:</strong> {testEmail}</p>
              <p><strong>Test Password:</strong> {testPassword}</p>
              <p><strong>Admin Email:</strong> {adminEmail}</p>
              <p><strong>Customer Email:</strong> {customerEmail}</p>
            </div>
            
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Note:</strong> This test creates real data in your development environment. 
                Profile creation failures (RLS policy violations) will automatically trigger logout and session cleanup.
                Some tests may fail if proper permissions or test accounts are not set up.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveFlowTester;
