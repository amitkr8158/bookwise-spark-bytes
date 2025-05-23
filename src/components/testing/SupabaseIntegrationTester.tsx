
import React, { useState } from 'react';
import { testSupabaseIntegration, testAuthFlow } from '@/utils/testSupabaseIntegration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SupabaseIntegrationTester = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [results, setResults] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [testType, setTestType] = useState<'connection' | 'auth'>('connection');

  const runTest = async () => {
    setTesting(true);
    setResults(null);
    
    try {
      const testResults = testType === 'connection' 
        ? await testSupabaseIntegration()
        : await testAuthFlow(email, password);
        
      setResults(testResults);
    } catch (error: any) {
      console.error('Test error:', error);
      setResults({ error: error.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Integration Tester</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Button 
              variant={testType === 'connection' ? 'default' : 'outline'}
              onClick={() => setTestType('connection')}
            >
              Test Connection
            </Button>
            <Button
              variant={testType === 'auth' ? 'default' : 'outline'}
              onClick={() => setTestType('auth')}
            >
              Test Auth Flow
            </Button>
          </div>

          {testType === 'auth' && (
            <div className="space-y-3">
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
          )}

          {results && (
            <div className="space-y-2 mt-4">
              <h3 className="font-medium">Test Results:</h3>
              <pre className="bg-muted p-2 rounded-md overflow-x-auto text-xs">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}

          {results?.error && (
            <Alert variant="destructive">
              <AlertDescription>{results.error}</AlertDescription>
            </Alert>
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
