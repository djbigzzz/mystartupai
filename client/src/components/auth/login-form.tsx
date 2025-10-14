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
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: (user: any) => void;
  onSwitchToSignup?: () => void;
}

export default function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
      
      return response.json();
    },
    onSuccess: (user) => {
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });
      onSuccess?.(user);
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your MyStartup.ai account to continue building your startup
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Web3 Wallet Authentication */}
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
                  
                  // Step 2: Use Solana-specific message and add wallet address
                  const messageToSign = challenge.solanaMessage.replace('ADDRESS_PLACEHOLDER', publicKey);
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
                    description: "Welcome back to MyStartup.ai",
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
            disabled={loginMutation.isPending}
            data-testid="button-signin-phantom"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 128 128" fill="none">
              <path d="M101.667 19.333C101.667 8.6667 93 0 82.333 0H45.667C35 0 26.333 8.6667 26.333 19.333V108.667C26.333 119.333 35 128 45.667 128C56.333 128 65 119.333 65 108.667V84.667H82.333C93 84.667 101.667 76 101.667 65.333V19.333ZM50.5 42.667C47.5 42.667 45 40.167 45 37.167C45 34.167 47.5 31.667 50.5 31.667C53.5 31.667 56 34.167 56 37.167C56 40.167 53.5 42.667 50.5 42.667ZM77.5 42.667C74.5 42.667 72 40.167 72 37.167C72 34.167 74.5 31.667 77.5 31.667C80.5 31.667 83 34.167 83 37.167C83 40.167 80.5 42.667 77.5 42.667Z" fill="#AB9FF2"/>
            </svg>
            Phantom
          </Button>
          <Button 
            variant="outline"
            disabled={true}
            className="opacity-60 cursor-not-allowed"
            data-testid="button-signin-google"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-muted-foreground">Coming Soon</span>
          </Button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        placeholder="Enter your password"
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300" />
                <span>Remember me</span>
              </label>
              <Button variant="link" className="px-0 text-sm">
                Forgot password?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>


        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Button variant="link" className="px-0" onClick={onSwitchToSignup}>
            Sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}