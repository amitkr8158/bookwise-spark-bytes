
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { usePageViewTracking } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { signUp } from "@/services/auth/authService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language, isAuthenticated } = useGlobalContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password validation
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    letter: false,
    number: false,
    symbol: false
  });
  
  // Track page view
  usePageViewTracking('/signup', 'Sign Up');
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);
  
  // Check password requirements as user types
  useEffect(() => {
    setPasswordValid({
      length: password.length >= 8,
      letter: /[a-zA-Z]/.test(password),
      number: /\d/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [password]);
  
  // Check if all password requirements are met
  const allPasswordReqsMet = Object.values(passwordValid).every(Boolean);
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!allPasswordReqsMet) {
      toast({
        title: "Invalid password",
        description: "Your password doesn't meet all requirements",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await signUp({ 
        email, 
        password, 
        name,
        // Including additional data
        metadata: {
          address,
          mobile,
          date_of_birth: dateOfBirth
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Show success toast prominently
      toast({
        title: "Account created successfully!",
        description: "You can now log in with your new account",
        variant: "default",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message || "There was an error creating your account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-serif">
              {t('user.signup')}
            </CardTitle>
            <CardDescription>
              {t('user.signupDescription')}
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('user.fullName')}*</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t('user.email')}*</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">{t('user.address')}*</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, City, Country"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mobile">{t('user.mobile')} (Optional)</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+1 (123) 456-7890"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dob">{t('user.dateOfBirth')}*</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t('user.password')}*</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                
                {/* Password requirements */}
                <div className="text-sm space-y-1 mt-2">
                  <p className="font-medium text-muted-foreground">{t('user.passwordCriteria')}</p>
                  <ul className="space-y-1 text-sm">
                    <li className={`flex items-center ${passwordValid.length ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {passwordValid.length ? <CheckCircle2 className="h-3 w-3 mr-2" /> : <span className="h-3 w-3 mr-2 rounded-full border" />}
                      At least 8 characters
                    </li>
                    <li className={`flex items-center ${passwordValid.letter ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {passwordValid.letter ? <CheckCircle2 className="h-3 w-3 mr-2" /> : <span className="h-3 w-3 mr-2 rounded-full border" />}
                      Contains letters
                    </li>
                    <li className={`flex items-center ${passwordValid.number ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {passwordValid.number ? <CheckCircle2 className="h-3 w-3 mr-2" /> : <span className="h-3 w-3 mr-2 rounded-full border" />}
                      Contains numbers
                    </li>
                    <li className={`flex items-center ${passwordValid.symbol ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {passwordValid.symbol ? <CheckCircle2 className="h-3 w-3 mr-2" /> : <span className="h-3 w-3 mr-2 rounded-full border" />}
                      Contains symbols (e.g. !@#$%)
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">{t('user.confirmPassword')}*</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !allPasswordReqsMet}
              >
                {isLoading ? t('user.creating') : t('user.createAccount')}
              </Button>
              
              <p className="text-sm text-center text-muted-foreground">
                {t('user.haveAccount')}{' '}
                <Link to="/login" className="text-book-700 hover:underline">
                  {t('user.login')}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Signup;
