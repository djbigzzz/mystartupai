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
                  
                  // Step 2: Use SIWE message and replace address placeholder
                  const messageToSign = challenge.siweMessage.replace('ADDRESS_PLACEHOLDER', address);
                  
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
                    description: "Welcome back to MyStartup.ai",
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
            disabled={loginMutation.isPending}
            data-testid="button-signin-metamask"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.5 12c0 5.799-4.701 10.5-10.5 10.5S1.5 17.799 1.5 12 6.201 1.5 12 1.5s10.5 4.701 10.5 10.5z"/>
              <path d="M12 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25z" fill="white"/>
            </svg>
            MetaMask
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