import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Mail, Chrome, ArrowRight, Eye, EyeOff, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
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
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number";
    return "";
  };

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
      toast({
        title: "Authentication failed",
        description: error.message || "Please try again.",
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
            {/* Temporarily removed Google OAuth for testing */}
            
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
                {isSignUp && formTouched.password && !validationErrors.password && (
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