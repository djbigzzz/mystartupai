import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
    mutationFn: async (data: { email: string; password: string; name?: string }) => {
      const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";
      return apiRequest(endpoint, {
        method: "POST",
        body: data
      } as RequestInit & { body?: any });
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
      
      // Handle specific validation errors
      if (error.message && error.message.includes("Password must")) {
        errorMessage = "Please check your password meets all requirements above.";
      } else if (error.message && error.message.includes("User already exists")) {
        errorMessage = "An account with this email already exists. Try logging in instead.";
      } else if (error.message && error.message.includes("email")) {
        errorMessage = "Please enter a valid email address.";
      }
      
      toast({
        title: "Authentication failed",
        description: errorMessage,
        variant: "destructive",
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
      if (data.emailSent) {
        toast({
          title: "Reset link sent!",
          description: "Check your email for password reset instructions.",
        });
      } else if (data.resetLink) {
        // Show reset link directly if email couldn't be sent
        toast({
          title: "Email service unavailable",
          description: "Use this direct link to reset your password",
          action: (
            <button 
              onClick={() => window.open(data.resetLink, '_blank')}
              className="bg-white text-primary px-3 py-1 rounded text-sm"
            >
              Open Reset Link
            </button>
          ),
          duration: 10000, // Show longer for manual action
        });
      }
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
                className="w-full h-11 border-2 border-[#3B99FC] bg-white hover:bg-[#3B99FC] hover:text-white text-[#3B99FC] font-medium shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
                disabled={authMutation.isPending}
                data-testid="button-signin-walletconnect"
                onClick={async () => {
                    try {
                      // Initialize WalletConnect
                      const { createWeb3Modal, defaultWagmiConfig } = await import('@web3modal/wagmi');
                      const { mainnet, arbitrum, polygon } = await import('viem/chains');
                      const { getAccount, signMessage } = await import('wagmi/actions');
                      const { http } = await import('viem');
                      
                      // Configure chains and project
                      const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'e02e251e99c152caa4e0e12e29bbaf2b'; // Public demo project ID
                      const chains = [mainnet, arbitrum, polygon] as const;
                      
                      const config = defaultWagmiConfig({
                        chains,
                        projectId,
                        metadata: {
                          name: 'MyStartup.ai',
                          description: 'AI-Powered Startup Accelerator',
                          url: 'https://mystartup.ai',
                          icons: ['https://mystartup.ai/favicon.ico']
                        }
                      });
                      
                      // Create modal
                      const modal = createWeb3Modal({
                        wagmiConfig: config,
                        projectId,
                        enableAnalytics: false
                      });
                      
                      // Open WalletConnect modal
                      await modal.open();
                      
                      // Wait for connection
                      let connected = false;
                      let attempts = 0;
                      
                      while (!connected && attempts < 30) {
                        const account = getAccount(config);
                        if (account.isConnected && account.address) {
                          connected = true;
                          
                          // Step 1: Request challenge from server
                          const challengeResponse = await fetch("/api/auth/challenge", {
                            method: "GET",
                            headers: { "Content-Type": "application/json" },
                          });
                          
                          if (!challengeResponse.ok) {
                            throw new Error("Failed to get authentication challenge");
                          }
                          
                          const challenge = await challengeResponse.json();
                          
                          // Step 2: Use SIWE message and replace address placeholder
                          const messageToSign = challenge.siweMessage.replace('ADDRESS_PLACEHOLDER', account.address);
                          
                          // Step 3: Sign the message
                          const signature = await signMessage(config, {
                            message: messageToSign,
                          });
                          
                          // Step 4: Send signature to backend for verification
                          const authResponse = await fetch(isSignUp ? "/api/auth/wallet-signup" : "/api/auth/wallet-signin", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              signature: signature,
                              message: messageToSign,
                              nonce: challenge.nonce,
                              authMethod: "walletconnect"
                            }),
                          });
                          
                          if (!authResponse.ok) {
                            const error = await authResponse.json();
                            throw new Error(error.message || "Authentication failed");
                          }
                          
                          const user = await authResponse.json();
                          toast({
                            title: "Wallet Connected!",
                            description: "Redirecting to your dashboard...",
                          });
                          
                          // Redirect to dashboard
                          setTimeout(() => {
                            window.location.href = "/dashboard";
                          }, 1000);
                          
                          modal.close();
                          break;
                        }
                        
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        attempts++;
                      }
                      
                      if (!connected) {
                        throw new Error("Connection timeout - please try again");
                      }
                      
                    } catch (error: any) {
                      console.error('WalletConnect authentication failed:', error);
                      toast({
                        title: "Authentication Failed",
                        description: error.message || "Please try again",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M6.5 11.5c4.5-4.4 11.8-4.4 16.3 0l.5.5c.2.2.2.6 0 .8l-1.8 1.8c-.1.1-.3.1-.4 0l-.7-.7c-3.1-3.1-8.2-3.1-11.4 0l-.7.7c-.1.1-.3.1-.4 0L6.1 12.8c-.2-.2-.2-.6 0-.8l.4-.5zm20.1 3.7l1.6 1.6c.2.2.2.6 0 .8l-7.3 7.3c-.2.2-.6.2-.8 0l-5.2-5.2c0-.1-.1-.1-.2 0l-5.2 5.2c-.2.2-.6.2-.8 0l-7.3-7.3c-.2-.2-.2-.6 0-.8l1.6-1.6c.2-.2.6-.2.8 0l5.2 5.2c0 .1.1.1.2 0l5.2-5.2c.2-.2.6-.2.8 0l5.2 5.2c0 .1.1.1.2 0l5.2-5.2c.2-.2.6-.2.8 0z"/>
                  </svg>
                  WalletConnect
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
                <div className="text-right">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-primary hover:underline p-0 h-auto"
                    onClick={() => setShowForgotPassword(true)}
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