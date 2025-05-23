
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { testSupabaseConnection, testAuthFlow } from "@/utils/testSupabaseIntegration";
import { toast } from "@/components/ui/use-toast";

const SupabaseIntegrationTester = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, { status: 'success' | 'error'; message: string }> | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authResults, setAuthResults] = useState<Record<string, { success: boolean; message: string }> | null>(null);

  const runTests = async () => {
    setIsLoading(true);
    try {
      // Run individual tests and compile results
      const results: Record<string, { status: 'success' | 'error'; message: string }> = {};
      
      // Test connection
      results.connection = await testSupabaseConnection();
      
      const allSuccessful = Object.values(results).every(result => result.status === 'success');
      setTestResults(results);
      
      toast({
        title: allSuccessful ? "All tests passed" : "Some tests failed",
        description: allSuccessful 
          ? "Supabase integration is working correctly" 
          : "Please check the test results for details",
        variant: allSuccessful ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Test error:", error);
      toast({
        title: "Test Error",
        description: "There was an error running the tests. See console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runAuthTests = async () => {
    if (!email || !password) {
      toast({
        title: "Missing credentials",
        description: "Please provide both email and password",
        variant: "destructive",
      });
      return;
    }

    setAuthLoading(true);
    try {
      const results = await testAuthFlow(email, password);
      setAuthResults(results);
      
      // Type guard to check if results has success property
      const isValidResult = (result: any): result is { success: boolean } => 
        result && typeof result.success === 'boolean';
      
      const allSuccessful = Object.values(results).every(result => 
        isValidResult(result) && result.success
      );
      
      toast({
        title: allSuccessful ? "Auth tests passed" : "Some auth tests failed",
        description: allSuccessful 
          ? "Authentication flow is working correctly" 
          : "Please check the auth test results for details",
        variant: allSuccessful ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Auth test error:", error);
      toast({
        title: "Auth Test Error",
        description: "There was an error running the auth tests. See console for details.",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Supabase Integration Tester</CardTitle>
          <CardDescription>
            Test the integration between your app and Supabase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runTests}
            disabled={isLoading}
            className="w-full mb-4"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Running Tests..." : "Test Supabase Connection"}
          </Button>

          {testResults && (
            <div className="space-y-3 mt-4">
              <h3 className="text-lg font-medium">Test Results</h3>
              {Object.entries(testResults).map(([key, result]) => (
                <Alert key={key} variant={result.status === 'success' ? "default" : "destructive"}>
                  <div className="flex items-center">
                    {result.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    <AlertTitle className="capitalize">{key} Test</AlertTitle>
                  </div>
                  <AlertDescription className="ml-6">
                    {result.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Authentication Flow Test</CardTitle>
          <CardDescription>
            Test sign up and login with Supabase Auth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="test@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button 
              onClick={runAuthTests}
              disabled={authLoading || !email || !password}
              className="w-full"
            >
              {authLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {authLoading ? "Testing Auth..." : "Test Authentication Flow"}
            </Button>
          </div>

          {authResults && (
            <div className="space-y-3 mt-4">
              <h3 className="text-lg font-medium">Auth Test Results</h3>
              {Object.entries(authResults).map(([key, result]) => (
                <Alert key={key} variant={result.success ? "default" : "destructive"}>
                  <div className="flex items-center">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    <AlertTitle className="capitalize">{key}</AlertTitle>
                  </div>
                  <AlertDescription className="ml-6">
                    {result.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col items-start space-y-2">
          <div className="bg-muted p-2 rounded text-sm w-full">
            <strong>Note:</strong> When testing, use a real email. The test will attempt to:
            <ol className="list-decimal ml-5 mt-1">
              <li>Create a new user with the provided email/password</li>
              <li>Sign in with those credentials</li>
              <li>Fetch the user profile if successful</li>
            </ol>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SupabaseIntegrationTester;
