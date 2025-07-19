import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Star, ArrowRight, Mail, Chrome, Wallet, Sparkles } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function WaitlistClean() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();

  // Get waitlist count
  const { data: waitlistCount } = useQuery({
    queryKey: ["/api/waitlist/count"],
  });

  // Email signup mutation
  const emailSignupMutation = useMutation({
    mutationFn: async (data: { email: string; name: string }) => {
      return apiRequest("/api/waitlist", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Welcome to the waitlist!",
        description: "You'll be among the first to access MyStartup.ai when we launch.",
      });
      setEmail("");
      setName("");
    },
    onError: (error: any) => {
      toast({
        title: "Signup failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Google OAuth signup
  const handleGoogleSignup = () => {
    window.location.href = "/api/auth/google";
  };



  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    emailSignupMutation.mutate({ email, name });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="ml-3 text-xl font-semibold text-foreground">
                mystartup.ai
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Log in</Button>
              <Button>Create account</Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Signup Form */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Create your account
              </h1>
              <p className="text-muted-foreground mb-6">
                Let's get started with your 30 days free trial.
              </p>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleGoogleSignup}
                  variant="outline"
                  className="w-full justify-center"
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Sign up with Google
                </Button>
                
                <div className="text-center text-muted-foreground text-sm">or</div>
                

                
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Name *</label>
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Email *</label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={emailSignupMutation.isPending}
                  >
                    {emailSignupMutation.isPending ? "Creating account..." : "Get started"}
                  </Button>
                </form>
                
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account? <a href="#" className="text-primary hover:underline">Log in</a>
                </p>
              </div>
            </div>
            
            {/* Right Side - Login Form */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Log in
              </h1>
              <p className="text-muted-foreground mb-6">
                Welcome back! Please enter your details.
              </p>
              
              <div className="space-y-4">
                <Button 
                  variant="outline"
                  className="w-full justify-center"
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Continue with Google
                </Button>
                
                <div className="text-center text-muted-foreground text-sm">or</div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <Input
                      type="password"
                      placeholder="********"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="remember" className="rounded border-border" />
                      <label htmlFor="remember" className="text-sm text-foreground">Remember me</label>
                    </div>
                    <a href="#" className="text-sm text-primary hover:underline">Forgot password</a>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Log in
                  </Button>
                </div>
                
                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account? <a href="#" className="text-primary hover:underline">Create your account</a>
                </p>
              </div>
            </div>
          </div>
          
          {/* Reviews Badge */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center text-sm text-muted-foreground">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="font-medium mr-1">5.0</span>
              <span>reviews</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}