import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, CheckCircle, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, "Password must contain uppercase, lowercase, and number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: (user: any) => void;
  onSwitchToLogin?: () => void;
}

export default function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: Omit<SignupFormData, 'confirmPassword'>) => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        
        // Handle specific backend validation errors
        if (error.errors && Array.isArray(error.errors)) {
          const passwordErrors = error.errors
            .filter((err: any) => err.param === 'password')
            .map((err: any) => err.msg);
          
          if (passwordErrors.length > 0) {
            throw new Error(`Password validation failed: ${passwordErrors.join(', ')}`);
          }
          
          // Handle other validation errors
          const errorMessages = error.errors.map((err: any) => err.msg).join(', ');
          throw new Error(errorMessages);
        }
        
        throw new Error(error.message || "Signup failed");
      }
      
      return response.json();
    },
    onSuccess: (user) => {
      toast({
        title: "Account created!",
        description: "Welcome to MyStartup.ai. Let's build your startup together.",
      });
      onSuccess?.(user);
    },
    onError: (error) => {
      console.error("Signup error:", error);
      let errorMessage = error.message;
      
      // Handle specific validation errors
      if (error.message.includes("validation") || error.message.includes("Password must")) {
        errorMessage = "Please check your password meets all requirements above.";
      } else if (error.message.includes("User already exists")) {
        errorMessage = "An account with this email already exists. Try logging in instead.";
      } else if (error.message.includes("email")) {
        errorMessage = "Please enter a valid email address.";
      }
      
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SignupFormData) => {
    const { confirmPassword, ...signupData } = data;
    signupMutation.mutate(signupData);
  };

  const passwordValue = form.watch("password");
  
  const getPasswordRequirements = (password: string) => {
    // Simplified validation logic - no special characters required
    const backendRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const isValidByBackend = backendRegex.test(password) && password.length >= 8 && password.length <= 128;
    
    return {
      length: password.length >= 8 && password.length <= 128,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password)
    };
  };

  const passwordRequirements = getPasswordRequirements(passwordValue || "");
  const requirementsMet = Object.values(passwordRequirements).filter(Boolean).length;
  const allRequirementsMet = requirementsMet === 4;

  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
        <CardDescription>
          Join thousands of entrepreneurs building successful startups with AI
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  {passwordValue && (
                    <div className="space-y-3 mt-3">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 w-full rounded ${
                              i < requirementsMet ? strengthColors[Math.min(requirementsMet - 1, 4)] : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Password strength: {strengthLabels[Math.min(requirementsMet - 1, 4)] || "Very Weak"}
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-start space-x-2">
              <input type="checkbox" required className="mt-1 rounded border-gray-300" />
              <label className="text-xs text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            onClick={async () => {
              try {
                // Connect to Phantom wallet
                if (window.solana && window.solana.isPhantom) {
                  const response = await window.solana.connect();
                  const publicKey = response.publicKey.toString();
                  
                  // Step 1: Request challenge from server
                  const challengeResponse = await fetch("/api/auth/challenge", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                  });
                  
                  if (!challengeResponse.ok) {
                    throw new Error("Failed to get authentication challenge");
                  }
                  
                  const challenge = await challengeResponse.json();
                  
                  // Step 2: Enhance message with wallet address
                  const messageToSign = `${challenge.message}\n\nAddress: ${publicKey}`;
                  const encodedMessage = new TextEncoder().encode(messageToSign);
                  
                  // Step 3: Sign the message
                  const signedMessage = await window.solana.signMessage(encodedMessage);
                  
                  // Step 4: Send signature to backend for verification
                  const authResponse = await fetch("/api/auth/wallet-signin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      signature: Array.from(signedMessage.signature),
                      message: messageToSign,
                      nonce: challenge.nonce,
                      authMethod: "phantom"
                    }),
                  });
                  
                  if (!authResponse.ok) {
                    const error = await authResponse.json();
                    throw new Error(error.message || "Authentication failed");
                  }
                  
                  const user = await authResponse.json();
                  toast({
                    title: "Phantom Connected!",
                    description: "Welcome to MyStartup.ai",
                  });
                  onSuccess?.(user);
                } else {
                  window.open('https://phantom.app/', '_blank');
                }
              } catch (error: any) {
                console.error('Phantom authentication failed:', error);
                toast({
                  title: "Authentication Failed",
                  description: error.message || "Please try again",
                  variant: "destructive",
                });
              }
            }}
            data-testid="button-connect-phantom"
          >
            <div className="w-4 h-4 mr-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">P</span>
            </div>
            Phantom
          </Button>
          <Button 
            variant="outline"
            onClick={async () => {
              try {
                // Connect to MetaMask wallet
                if (window.ethereum) {
                  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                  const address = accounts[0];
                  
                  // Step 1: Request challenge from server
                  const challengeResponse = await fetch("/api/auth/challenge", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                  });
                  
                  if (!challengeResponse.ok) {
                    throw new Error("Failed to get authentication challenge");
                  }
                  
                  const challenge = await challengeResponse.json();
                  
                  // Step 2: Enhance message with wallet address  
                  const messageToSign = `${challenge.message}\n\nAddress: ${address}`;
                  
                  // Step 3: Sign the message
                  const signature = await window.ethereum.request({
                    method: 'personal_sign',
                    params: [messageToSign, address],
                  });
                  
                  // Step 4: Send signature to backend for verification
                  const authResponse = await fetch("/api/auth/wallet-signin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      signature: signature,
                      message: messageToSign,
                      nonce: challenge.nonce,
                      authMethod: "metamask"
                    }),
                  });
                  
                  if (!authResponse.ok) {
                    const error = await authResponse.json();
                    throw new Error(error.message || "Authentication failed");
                  }
                  
                  const user = await authResponse.json();
                  toast({
                    title: "MetaMask Connected!",
                    description: "Welcome to MyStartup.ai",
                  });
                  onSuccess?.(user);
                } else {
                  window.open('https://metamask.io/', '_blank');
                }
              } catch (error: any) {
                console.error('MetaMask authentication failed:', error);
                toast({
                  title: "Authentication Failed",
                  description: error.message || "Please try again",
                  variant: "destructive",
                });
              }
            }}
            data-testid="button-connect-metamask"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.5 12c0 5.799-4.701 10.5-10.5 10.5S1.5 17.799 1.5 12 6.201 1.5 12 1.5s10.5 4.701 10.5 10.5z"/>
              <path d="M12 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25z" fill="white"/>
            </svg>
            MetaMask
          </Button>
        </div>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Button variant="link" className="px-0" onClick={onSwitchToLogin}>
            Sign in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}