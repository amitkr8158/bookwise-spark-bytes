
import React, { useState } from 'react';
import { testSupabaseIntegration, testAuthFlow } from '@/utils/testSupabaseIntegration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Database, Key, Server } from 'lucide-react';

const SupabaseIntegrationTester = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [results, setResults] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [testType, setTestType] = useState<'connection' | 'auth' | 'tables'>('connection');

  const runTest = async () => {
    setTesting(true);
    setResults(null);
    
    try {
      let testResults;
      
      if (testType === 'connection') {
        testResults = await testSupabaseIntegration();
      } else if (testType === 'auth') {
        testResults = await testAuthFlow(email, password);
      } else {
        // This would be the tables test, which we could implement later
        const { data, error } = await fetch('/api/tables').then(res => res.json());
        testResults = { tables: { success: !error, message: error || 'Retrieved tables' } };
      }
      
      setResults(testResults);
    } catch (error: any) {
      console.error('Test error:', error);
      setResults({ error: error.message });
    } finally {
      setTesting(false);
    }
  };
  
  const getOverallStatus = () => {
    if (!results || results.error) return false;
    
    return Object.values(results).every((result: any) => result.success);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Supabase Integration Tester</CardTitle>
          {results && (
            <Badge variant={getOverallStatus() ? "success" : "destructive"}>
              {getOverallStatus() ? 'All Tests Passed' : 'Tests Failed'}
            </Badge>
          )}
        </div>
        <CardDescription>
          Test your Supabase connection and authentication flow
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Tabs value={testType} onValueChange={(v: any) => setTestType(v)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="connection" className="flex items-center">
                <Server className="mr-2 h-4 w-4" />
                Connection
              </TabsTrigger>
              <TabsTrigger value="auth" className="flex items-center">
                <Key className="mr-2 h-4 w-4" />
                Auth Flow
              </TabsTrigger>
              <TabsTrigger value="tables" className="flex items-center">
                <Database className="mr-2 h-4 w-4" />
                Tables
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="connection" className="mt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Tests basic connection to Supabase and retrieves session information.
              </p>
            </TabsContent>
            
            <TabsContent value="auth" className="mt-4">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-2">
                  Tests user signup, login, and profile retrieval.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tables" className="mt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Checks available tables in the Supabase database.
              </p>
            </TabsContent>
          </Tabs>

          {results && (
            <div className="space-y-4 mt-6">
              <h3 className="font-medium">Test Results:</h3>
              
              {results.error ? (
                <Alert variant="destructive">
                  <AlertDescription>{results.error}</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {Object.entries(results).map(([key, value]: [string, any]) => (
                    <div 
                      key={key}
                      className="p-2 rounded-md border flex justify-between items-center"
                    >
                      <div>
                        <span className="font-medium capitalize">{key}</span>
                        <p className="text-sm text-muted-foreground">{value.message}</p>
                      </div>
                      {value.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={runTest} disabled={testing} className="w-full">
          {testing ? 'Testing...' : 'Run Test'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupabaseIntegrationTester;
