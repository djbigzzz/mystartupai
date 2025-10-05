import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sparkles, Mail, Chrome, ArrowRight, Eye, EyeOff, CheckCircle, XCircle, AlertCircle, Loader2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function AppEntry() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const { toast } = useToast();
  const [location, setLocation] = useLocation();

  // Check for password reset token in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('reset');
    if (token) {
      setResetToken(token);
      setShowResetForm(true);
    }
  }, []);

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    if (password.length < 8 || password.length > 128) return "Password must be 8-128 characters";
    // Use simplified regex matching backend
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      return "Password must contain uppercase, lowercase, and number";
    }
    return "";
  };

  // Password requirements checker - simplified (no special characters required)
  const getPasswordRequirements = (password: string) => {
    return {
      length: password.length >= 8 && password.length <= 128,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password)
    };
  };

  const passwordRequirements = getPasswordRequirements(password);
  const requirementsMet = Object.values(passwordRequirements).filter(Boolean).length;
  const allRequirementsMet = requirementsMet === 4;

  const validateName = (name: string): string => {
    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  // Real-time validation
  useEffect(() => {
    const errors: Record<string, string> = {};
    
    if (formTouched.email) {
      const emailError = validateEmail(email);
      if (emailError) errors.email = emailError;
    }
    
    if (formTouched.password) {
      const passwordError = validatePassword(password);
      if (passwordError) errors.password = passwordError;
    }
    
    if (isSignUp && formTouched.name) {
      const nameError = validateName(name);
      if (nameError) errors.name = nameError;
    }
    
    if (isSignUp && formTouched.confirmPassword) {
      const confirmError = validateConfirmPassword(password, confirmPassword);
      if (confirmError) errors.confirmPassword = confirmError;
    }
    
    setValidationErrors(errors);
  }, [email, password, confirmPassword, name, formTouched, isSignUp]);

  // Handle field touch
  const handleFieldTouch = (field: string) => {
    setFormTouched(prev => ({ ...prev, [field]: true }));
  };

  // Email signup/login mutation
  const authMutation = useMutation({
    mutationFn: async (data: { email: string; password: string; name?: string; rememberMe?: boolean }) => {
      const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";
      console.log('Auth mutation starting:', { endpoint, isSignUp, method: 'POST' });
      try {
        const result = await apiRequest(endpoint, {
          method: "POST",
          body: data
        } as RequestInit & { body?: any });
        console.log('Auth mutation succeeded');
        return result;
      } catch (error) {
        console.error('Auth mutation failed:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate auth queries to refresh user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      
      toast({
        title: isSignUp ? "Account created successfully!" : "Welcome back!",
        description: "Redirecting to your dashboard...",
      });
      
      // Redirect to the correct dashboard route
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    },
    onError: (error: any) => {
      console.error("Authentication error:", error);
      let errorMessage = error.message || "Please try again.";
      let showForgotPasswordLink = false;
      
      // Handle specific validation errors with better messaging
      if (error.message && error.message.includes("Password must")) {
        errorMessage = "Please check your password meets all requirements above.";
      } else if (error.message && error.message.includes("User already exists")) {
        errorMessage = "An account with this email already exists. Try logging in instead.";
        // Switch to login tab
        setIsSignUp(false);
      } else if (error.message && error.message.includes("email or password")) {
        errorMessage = error.message;
        showForgotPasswordLink = true;
      } else if (error.message && error.message.includes("email")) {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message && error.message.includes("Too many")) {
        errorMessage = "Too many login attempts. Please wait a few minutes and try again.";
      }
      
      toast({
        title: isSignUp ? "Sign up failed" : "Login failed",
        description: errorMessage,
        variant: "destructive",
        ...(showForgotPasswordLink && {
          action: (
            <button 
              onClick={() => setShowForgotPassword(true)}
              className="text-sm underline"
            >
              Reset password
            </button>
          )
        })
      });
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest("/api/auth/forgot-password", {
        method: "POST",
        body: { email }
      } as RequestInit & { body?: any });
    },
    onSuccess: (data: any) => {
      // SECURITY: Always show generic message (never reveal if email exists)
      toast({
        title: "Check your email",
        description: data.message || "If an account with that email exists, we've sent password reset instructions.",
      });
      setShowForgotPassword(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email.",
        variant: "destructive",
      });
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { token: string; newPassword: string }) => {
      return apiRequest("/api/auth/reset-password", {
        method: "POST",
        body: data
      } as RequestInit & { body?: any });
    },
    onSuccess: () => {
      toast({
        title: "Password reset successful!",
        description: "You can now sign in with your new password.",
      });
      setShowResetForm(false);
      setResetToken("");
      setNewPassword("");
      // Clear URL parameters
      window.history.replaceState({}, document.title, "/app");
    },
    onError: (error: any) => {
      toast({
        title: "Reset failed",
        description: error.message || "Failed to reset password.",
        variant: "destructive",
      });
    },
  });



  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation
    const fieldsToTouch = ['email', 'password'];
    if (isSignUp) {
      fieldsToTouch.push('name', 'confirmPassword');
    }
    
    const touchedFields = fieldsToTouch.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    setFormTouched(touchedFields);
    
    // Check for validation errors
    const errors: Record<string, string> = {};
    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;
    
    if (isSignUp) {
      const nameError = validateName(name);
      if (nameError) errors.name = nameError;
      
      const confirmError = validateConfirmPassword(password, confirmPassword);
      if (confirmError) errors.confirmPassword = confirmError;
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      });
      return;
    }
    
    authMutation.mutate({
      email,
      password,
      ...(isSignUp && { name }),
      ...(!isSignUp && { rememberMe }),
    });
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (!emailError) {
      forgotPasswordMutation.mutate(email);
    } else {
      toast({
        title: "Invalid email",
        description: emailError,
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const passwordError = validatePassword(newPassword);
    if (!passwordError && resetToken) {
      resetPasswordMutation.mutate({ token: resetToken, newPassword });
    } else if (passwordError) {
      toast({
        title: "Invalid password",
        description: passwordError,
        variant: "destructive",
      });
    }
  };

  // Reset form when switching between sign up and sign in
  const handleTabChange = (value: string) => {
    setIsSignUp(value === "signup");
    setValidationErrors({});
    setFormTouched({});
    setPassword("");
    setConfirmPassword("");
    if (value === "signin") {
      setName("");
    }
  };

  // Helper function to get input class based on validation state
  const getInputClassName = (field: string, baseClass: string = "") => {
    const hasError = validationErrors[field];
    const isTouched = formTouched[field];
    const isValid = isTouched && !hasError;
    
    let className = baseClass;
    if (hasError) {
      className += " border-red-500 focus-visible:ring-red-500";
    } else if (isValid) {
      className += " border-green-500 focus-visible:ring-green-500";
    }
    return className;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">mystartup.ai</h1>
          <p className="text-muted-foreground mt-2">
            {isSignUp ? "Create your account to get started" : "Welcome back! Please sign in"}
          </p>
        </div>

        <Card className="border-2 border-border/50 shadow-xl">
          <CardHeader className="space-y-1">
            <Tabs value={isSignUp ? "signup" : "signin"} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Sign Up
                </TabsTrigger>
                <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Sign In
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Web3 Wallet Authentication */}
            <div className="space-y-3">
              <Button 
                className="w-full h-11 border-2 border-[#AB9FF2] bg-white hover:bg-[#AB9FF2] hover:text-white text-[#AB9FF2] font-medium shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
                disabled={authMutation.isPending}
                data-testid="button-signin-solana"
                onClick={async () => {
                    try {
                      // Check if Solana wallet is available
                      const { solana } = window as any;
                      
                      if (!solana) {
                        toast({
                          title: "No Solana Wallet Found",
                          description: "Please install Phantom, Solflare, or another Solana wallet extension.",
                          variant: "destructive",
                        });
                        return;
                      }

                      // Connect to wallet
                      const response = await solana.connect();
                      const walletAddress = response.publicKey.toString();

                      // Step 1: Get challenge from server
                      const challengeResponse = await fetch("/api/auth/challenge", {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                      });

                      if (!challengeResponse.ok) {
                        throw new Error("Failed to get authentication challenge");
                      }

                      const challenge = await challengeResponse.json();

                      // Step 2: Create message to sign
                      const messageToSign = `MyStartup.ai wants you to sign in with your Solana account:\nAddress: ${walletAddress}\n\nNonce: ${challenge.nonce}\nIssued At: ${new Date().toISOString()}`;
                      const encodedMessage = new TextEncoder().encode(messageToSign);

                      // Step 3: Sign message with wallet
                      const signedMessage = await solana.signMessage(encodedMessage, "utf8");
                      const signature = btoa(String.fromCharCode(...signedMessage.signature));

                      // Step 4: Send signature to backend for verification
                      const authResponse = await fetch("/api/auth/wallet-signin", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          signature: signature,
                          message: messageToSign,
                          nonce: challenge.nonce,
                          walletAddress: walletAddress,
                          authMethod: "phantom"
                        }),
                      });

                      if (!authResponse.ok) {
                        const error = await authResponse.json();
                        throw new Error(error.message || "Authentication failed");
                      }

                      const user = await authResponse.json();
                      
                      // Invalidate auth cache to refresh user data
                      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
                      
                      toast({
                        title: "Wallet Connected!",
                        description: "Redirecting to your dashboard...",
                      });

                      // Redirect to dashboard
                      setTimeout(() => {
                        window.location.href = "/dashboard";
                      }, 1000);

                    } catch (error: any) {
                      console.error('Solana wallet authentication failed:', error);
                      toast({
                        title: "Authentication Failed",
                        description: error.message || "Please try again",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 397.7 311.7" fill="currentColor">
                    <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"/>
                    <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"/>
                    <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"/>
                  </svg>
                  Solana Wallet
                </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>
            </div>
            
            {/* Email Form with Enhanced Validation */}
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center">
                    Name
                    {formTouched.name && !validationErrors.name && (
                      <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
                    )}
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => handleFieldTouch('name')}
                    className={getInputClassName('name', "mt-1 h-11")}
                    required
                  />
                  {validationErrors.name && (
                    <div className="flex items-center text-sm text-red-600">
                      <XCircle className="w-4 h-4 mr-1" />
                      {validationErrors.name}
                    </div>
                  )}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center">
                  Email
                  {formTouched.email && !validationErrors.email && (
                    <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
                  )}
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleFieldTouch('email')}
                  className={getInputClassName('email', "mt-1 h-11")}
                  required
                />
                {validationErrors.email && (
                  <div className="flex items-center text-sm text-red-600">
                    <XCircle className="w-4 h-4 mr-1" />
                    {validationErrors.email}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center">
                  Password
                  {formTouched.password && !validationErrors.password && (
                    <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
                  )}
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleFieldTouch('password')}
                    className={getInputClassName('password', "mt-1 h-11 pr-10")}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {validationErrors.password && (
                  <div className="flex items-center text-sm text-red-600">
                    <XCircle className="w-4 h-4 mr-1" />
                    {validationErrors.password}
                  </div>
                )}
                
                {/* Password Requirements Checklist - Show during signup when user is typing */}
                {isSignUp && password && (
                  <div className="space-y-3 mt-3">
                    {/* Password Strength Bar */}
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 w-full rounded ${
                            i < requirementsMet 
                              ? requirementsMet <= 2 
                                ? "bg-red-500" 
                                : requirementsMet <= 3 
                                ? "bg-orange-500" 
                                : requirementsMet <= 4 
                                ? "bg-yellow-500" 
                                : "bg-green-500"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password strength: {
                        requirementsMet <= 1 ? "Very Weak" :
                        requirementsMet <= 2 ? "Weak" :
                        requirementsMet <= 3 ? "Fair" :
                        requirementsMet <= 4 ? "Good" : "Strong"
                      }
                    </p>
                    
                    {/* Password Requirements Checklist */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Password Requirements:</p>
                      
                      <div className="grid grid-cols-1 gap-1 text-xs">
                        <div className={`flex items-center space-x-2 ${passwordRequirements.length ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          {passwordRequirements.length ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                          <span>8-128 characters long</span>
                        </div>
                        
                        <div className={`flex items-center space-x-2 ${passwordRequirements.lowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          {passwordRequirements.lowercase ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                          <span>One lowercase letter (a-z)</span>
                        </div>
                        
                        <div className={`flex items-center space-x-2 ${passwordRequirements.uppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          {passwordRequirements.uppercase ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                          <span>One uppercase letter (A-Z)</span>
                        </div>
                        
                        <div className={`flex items-center space-x-2 ${passwordRequirements.number ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          {passwordRequirements.number ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                          <span>One number (0-9)</span>
                        </div>
                      </div>
                      
                      {allRequirementsMet && (
                        <div className="flex items-center space-x-2 mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-xs font-medium text-green-700 dark:text-green-300">
                            All requirements met! 🎉
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {isSignUp && formTouched.password && !validationErrors.password && allRequirementsMet && (
                  <div className="text-sm text-green-600 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Strong password!
                  </div>
                )}
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center">
                    Confirm Password
                    {formTouched.confirmPassword && !validationErrors.confirmPassword && (
                      <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
                    )}
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => handleFieldTouch('confirmPassword')}
                      className={getInputClassName('confirmPassword', "mt-1 h-11 pr-10")}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <div className="flex items-center text-sm text-red-600">
                      <XCircle className="w-4 h-4 mr-1" />
                      {validationErrors.confirmPassword}
                    </div>
                  )}
                </div>
              )}

              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember-me" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      data-testid="checkbox-remember-me"
                    />
                    <Label 
                      htmlFor="remember-me" 
                      className="text-sm font-normal cursor-pointer"
                    >
                      Remember me for 30 days
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-primary hover:underline p-0 h-auto"
                    onClick={() => setShowForgotPassword(true)}
                    data-testid="link-forgot-password"
                  >
                    Forgot your password?
                  </Button>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-11 bg-primary hover:bg-primary/90 font-medium transition-all duration-200"
                disabled={authMutation.isPending || Object.keys(validationErrors).length > 0}
              >
                {authMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isSignUp ? "Creating account..." : "Signing in..."}
                  </>
                ) : (
                  <>
                    {isSignUp ? "Create account" : "Sign in"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>Enter your email address and we'll send you a reset link.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForgotPassword(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={forgotPasswordMutation.isPending}
                      className="flex-1"
                    >
                      {forgotPasswordMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reset Password Modal */}
        {showResetForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Set New Password</CardTitle>
                <CardDescription>Enter your new password below.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowResetForm(false);
                        setResetToken("");
                        setNewPassword("");
                        window.history.replaceState({}, document.title, "/app");
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={resetPasswordMutation.isPending}
                      className="flex-1"
                    >
                      {resetPasswordMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>
            By continuing, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}