import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Users, Zap, TrendingUp, Star, ArrowRight, Mail, Chrome } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [activeTab, setActiveTab] = useState("email");
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
    window.location.href = "/api/auth/google/waitlist";
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
                <Zap className="w-5 h-5 text-primary-foreground" />
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
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-white">Join the Waitlist</CardTitle>
                <CardDescription className="text-slate-300">
                  Be first to access the platform when we launch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/10">
                    <TabsTrigger value="email" className="text-xs">
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger value="google" className="text-xs">
                      <Chrome className="w-4 h-4 mr-1" />
                      Google
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="email" className="space-y-4 mt-4">
                    <form onSubmit={handleEmailSubmit} className="space-y-3">
                      <Input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                        required
                      />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                        required
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        disabled={emailSignupMutation.isPending}
                      >
                        {emailSignupMutation.isPending ? "Joining..." : "Join Waitlist"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="google" className="mt-4">
                    <Button 
                      onClick={handleGoogleSignup}
                      className="w-full bg-white text-slate-900 hover:bg-slate-100"
                    >
                      <Chrome className="w-4 h-4 mr-2" />
                      Continue with Google
                    </Button>
                    <p className="text-xs text-slate-400 mt-2 text-center">
                      Quick signup with your Google account
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Preview */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What We're Building</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Follow our journey as we ship features one by one, building the most comprehensive 
              AI-powered startup platform in public.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: "AI Idea Validation",
                description: "Get instant feedback on your startup idea with comprehensive SWOT analysis",
                status: "shipped",
                week: "Week 1"
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Business Plan Generator", 
                description: "AI-powered 12-section business plans following VC standards",
                status: "shipped",
                week: "Week 2"
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: "Pitch Deck Builder",
                description: "Create investor-ready presentations with professional templates",
                status: "shipped", 
                week: "Week 3"
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Financial Modeling",
                description: "Build 5-year projections and unit economics calculations",
                status: "in-progress",
                week: "Week 4"
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Market Research",
                description: "Competitive analysis and market sizing with AI insights",
                status: "planned",
                week: "Week 5"
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Networking Hub",
                description: "Connect with co-founders, investors, and mentors",
                status: "planned",
                week: "Week 6"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${
                      feature.status === 'shipped' ? 'bg-green-600/20 text-green-400' :
                      feature.status === 'in-progress' ? 'bg-yellow-600/20 text-yellow-400' :
                      'bg-slate-600/20 text-slate-400'
                    }`}>
                      {feature.icon}
                    </div>
                    <Badge variant={
                      feature.status === 'shipped' ? 'default' :
                      feature.status === 'in-progress' ? 'secondary' : 'outline'
                    } className="text-xs">
                      {feature.status === 'shipped' ? '✅ Live' :
                       feature.status === 'in-progress' ? '🚧 Building' : '📅 Planned'}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-300">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-purple-300 font-medium">{feature.week}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Social Proof & Building in Public */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Building in Public</h2>
            <p className="text-slate-300 mb-8">
              Follow our daily progress, get early access to features, and help shape the future of AI-powered startups.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {waitlistCount?.count || 0}+
                  </div>
                  <p className="text-slate-300">Early Adopters</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">6</div>
                  <p className="text-slate-300">Features Shipping</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
                  <p className="text-slate-300">Open Development</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Follow on Twitter
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Join Discord
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Read Updates
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 border-t border-white/10">
          <div className="text-center text-slate-400">
            <p>&copy; 2025 MyStartup.ai. Building the future of startup development.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}