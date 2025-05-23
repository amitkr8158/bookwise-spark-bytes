
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  configureBackend, 
  testSpringBootConnection, 
  getCurrentBackend 
} from '@/services/springBootIntegration';

const SpringBootTester: React.FC = () => {
  const [apiUrl, setApiUrl] = useState('http://localhost:8080/api');
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    timestamp?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const currentBackend = getCurrentBackend();

  const handleConnect = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      // Configure backend to use Spring Boot
      configureBackend('spring-boot', apiUrl);
      
      // Test the connection
      const result = await testSpringBootConnection();
      
      setTestResult({
        ...result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSupabase = () => {
    configureBackend('supabase');
    setTestResult({
      success: true,
      message: 'Switched to Supabase backend',
      timestamp: new Date().toISOString()
    });
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Spring Boot API Connection</CardTitle>
        <CardDescription>
          Configure and test your Spring Boot backend connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="api-url" className="text-sm font-medium">
            Spring Boot API URL
          </label>
          <Input
            id="api-url"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="http://localhost:8080/api"
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Enter the base URL of your Spring Boot API
          </p>
        </div>

        {testResult && (
          <div className={`p-4 rounded-md ${
            testResult.success ? 'bg-green-50 text-green-700 border border-green-200' : 
            'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <p className="font-medium">
              {testResult.success ? 'Success! ✅' : 'Connection Failed ❌'}
            </p>
            <p className="text-sm mt-1">{testResult.message}</p>
            {testResult.timestamp && (
              <p className="text-xs mt-2">
                {new Date(testResult.timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>
        )}
        
        <div className="text-sm">
          <p className="font-medium">Current Backend:</p>
          <p>{currentBackend.type === 'spring-boot' ? 
            `Spring Boot (${currentBackend.apiUrl})` : 
            'Supabase'}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleUseSupabase}
          disabled={currentBackend.type === 'supabase'}
        >
          Use Supabase
        </Button>
        <Button 
          onClick={handleConnect} 
          disabled={isLoading || !apiUrl}
        >
          {isLoading ? "Testing..." : "Test Connection"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpringBootTester;
