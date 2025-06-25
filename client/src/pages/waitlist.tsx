import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Users, Zap, TrendingUp, Star, ArrowRight, Mail, Chrome, Wallet } from "lucide-react";
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
      return apiRequest("/api/waitlist/email", {
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

  // MetaMask wallet connection
  const handleWalletConnect = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to connect your wallet.",
        variant: "destructive",
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      if (accounts.length > 0) {
        const walletAddress = accounts[0];
        await apiRequest("/api/waitlist/wallet", {
          method: "POST",
          body: { walletAddress },
        });
        
        toast({
          title: "Wallet connected!",
          description: "You're now on the waitlist with early Web3 access.",
        });
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Please try connecting your wallet again.",
        variant: "destructive",
      });
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    emailSignupMutation.mutate({ email, name });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-40" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                MyStartup.ai
              </span>
            </div>
            <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
              {waitlistCount?.count || 0} Early Adopters
            </Badge>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
              Building in Public - Join the Journey
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Transform Ideas into
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Investor-Ready Businesses
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              The first AI-powered startup accelerator that generates business plans, pitch decks, 
              and financial models in minutes. Built with GPG-4 and proven Y Combinator frameworks.
            </p>

            {/* Waitlist Signup */}
            <Card className="max-w-md mx-auto bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-white">Join the Waitlist</CardTitle>
                <CardDescription className="text-slate-300">
                  Be first to access the platform when we launch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-white/10">
                    <TabsTrigger value="email" className="text-xs">
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger value="google" className="text-xs">
                      <Chrome className="w-4 h-4 mr-1" />
                      Google
                    </TabsTrigger>
                    <TabsTrigger value="wallet" className="text-xs">
                      <Wallet className="w-4 h-4 mr-1" />
                      Web3
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
                  
                  <TabsContent value="wallet" className="mt-4">
                    <Button 
                      onClick={handleWalletConnect}
                      className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect MetaMask
                    </Button>
                    <p className="text-xs text-slate-400 mt-2 text-center">
                      Early Web3 features and token rewards
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