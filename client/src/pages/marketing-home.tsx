import { useState } from "react";
import { Link } from "wouter";
import { useDemoSession } from "@/contexts/demo-session-context";
import { DemoPersonalizationModal, DemoSessionData } from "@/components/demo-personalization-modal";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import InteractiveDemo from "@/components/interactive-demo";
import { Logo } from "@/components/logo";
import { 
  Rocket, 
  Sparkles, 
  Play, 
  Brain,
  Target,
  Zap,
  ArrowRight,
  Star,
  CheckCircle,
  Users,
  DollarSign,
  TrendingUp,
  Lightbulb,
  FileText,
  Presentation,
  Code,
  Shield,
  Clock,
  Globe,
  BarChart3,
  PieChart,
  Briefcase,
  Building,
  Menu
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function MarketingHome() {
  const [showVideo, setShowVideo] = useState(false);
  const [showPersonalizationModal, setShowPersonalizationModal] = useState(false);
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  
  const { isPersonalized, sessionData, setSessionData, clearSession } = useDemoSession();
  const { toast } = useToast();

  const stats = [
    { number: "AI-Powered", label: "Idea Validation" },
    { number: "Comprehensive", label: "Business Plans" },
    { number: "Professional", label: "Pitch Decks" },
    { number: "Investor-Ready", label: "Financial Models" }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI Startup Idea Validation",
      description: "Advanced market research, competitor analysis, and business feasibility assessment powered by AI. Validate your startup concept quickly with comprehensive analysis. Results may vary by idea complexity.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Presentation,
      title: "Business Plan Generator",
      description: "AI-powered business plan generator creates comprehensive execution roadmaps, strategic frameworks, and investor-ready documentation tailored to your industry.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: DollarSign,
      title: "Pitch Deck Creator & Financial Models",
      description: "Professional pitch deck creator and financial modeling tools. Generate investor presentations and detailed financial projections with customizable templates and industry benchmarks.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Rocket,
      title: "MVP Builder & Growth Strategy",
      description: "Complete MVP development framework, go-to-market strategy templates, and growth planning tools. Structured guides and actionable frameworks for startup execution.",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Register for Free",
      description: "Create your account quickly and easily",
      icon: Users
    },
    {
      step: "2",
      title: "Submit Your Idea", 
      description: "Simple intake form - just describe your concept",
      icon: Lightbulb
    },
    {
      step: "3",
      title: "AI Agents Collaborate",
      description: "Multiple specialized agents work together on research, planning, and strategy",
      icon: Brain
    },
    {
      step: "4",
      title: "Get Your Materials",
      description: "Download your business plan, pitch deck, and financial models",
      icon: FileText
    }
  ];

  const targetAudiences = [
    {
      title: "Early-Stage Entrepreneurs",
      description: "Turn raw ideas into actionable plans with AI-powered validation and strategy.",
      icon: Lightbulb,
      examples: ["First-time founders", "Side project creators", "Student entrepreneurs"]
    },
    {
      title: "Solopreneurs & Indie Hackers", 
      description: "Move faster without huge teams using AI as your co-founder.",
      icon: Code,
      examples: ["Solo developers", "Freelance consultants", "Digital nomads"]
    },
    {
      title: "Accelerators & VCs",
      description: "Pre-screen and validate startups with comprehensive AI analysis.",
      icon: Building,
      examples: ["Accelerator programs", "Investment firms", "Startup competitions"]
    }
  ];

  const handlePersonalize = async (demoData: DemoSessionData) => {
    setIsPersonalizing(true);
    
    try {
      // Create demo session via API
      const response = await fetch('/api/demo/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create demo session');
      }
      
      const session = await response.json();
      setSessionData(demoData);
      setShowPersonalizationModal(false);
      
      toast({
        title: "🎉 Demos Personalized!",
        description: `All demos are now customized for "${demoData.ideaTitle}". Try the Pitch Deck or Financial Modeling demos!`,
      });
    } catch (error) {
      console.error('Personalization error:', error);
      toast({
        title: "Personalization Failed",
        description: "There was an issue personalizing your demos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPersonalizing(false);
    }
  };

  const handleClearPersonalization = () => {
    clearSession();
    toast({
      title: "Personalization Cleared",
      description: "Demos have been reset to default examples.",
    });
  };

  const differentiators = [
    {
      title: "Agentic AI System",
      description: "Multiple specialized agents, not just one chatbot",
      icon: Brain
    },
    {
      title: "End-to-End Workflow",
      description: "From validation to investor materials, in one place",
      icon: Target
    },
    {
      title: "No Equity Required",
      description: "Unlike accelerators or agencies, keep 100% ownership",
      icon: Shield
    },
    {
      title: "Global Access",
      description: "Founders anywhere can start instantly, anytime",
      icon: Globe
    }
  ];

  return (
    <div className="min-h-screen bg-white" data-page="landing">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="lg" showText={true} />
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold" data-testid="nav-link-features">
                AI Tools
              </a>
              <a href="#how-it-works" className="text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold" data-testid="nav-link-process">
                Business Plans
              </a>
              <a href="#who-its-for" className="text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold" data-testid="nav-link-audience">
                For Entrepreneurs
              </a>
              <Link href="/app">
                <Button variant="outline" size="sm" data-testid="button-nav-signin">Sign In</Button>
              </Link>
              <Link href="/app">
                <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" data-testid="button-nav-primary">Start Free Now</Button>
              </Link>
            </div>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm" data-testid="button-mobile-menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <a href="#features" className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2" data-testid="mobile-nav-link-features">
                    AI Tools
                  </a>
                  <a href="#how-it-works" className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2" data-testid="mobile-nav-link-process">
                    Business Plans
                  </a>
                  <a href="#who-its-for" className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2" data-testid="mobile-nav-link-audience">
                    For Entrepreneurs
                  </a>
                  <div className="flex flex-col gap-3 mt-4">
                    <Link href="/app">
                      <Button variant="outline" className="w-full" data-testid="mobile-button-nav-signin">Sign In</Button>
                    </Link>
                    <Link href="/app">
                      <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400 font-bold" data-testid="mobile-button-nav-primary">Start Free Now</Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 hero-3d">
        {/* Advanced 3D Background */}
        <div className="absolute inset-0 gradient-mesh opacity-30"></div>
        
        {/* Floating 3D Geometric Shapes */}
        <div className="absolute top-10 right-10 floating-shape">
          <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-blue-200/20 rounded-3xl transform rotate-45 morphing-bg"></div>
        </div>
        <div className="absolute top-40 left-10 floating-shape">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-200/20 to-white/20 rounded-full morphing-bg"></div>
        </div>
        <div className="absolute bottom-20 right-1/4 floating-shape">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-2xl transform -rotate-12 morphing-bg"></div>
        </div>
        <div className="absolute top-1/3 left-1/4 floating-shape">
          <div className="w-16 h-16 bg-gradient-to-br from-white/15 to-blue-300/15 rounded-full morphing-bg"></div>
        </div>
        
        {/* Animated Particles */}
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="particle" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 6}s`
            }}
          ></div>
        ))}
        
        {/* Enhanced Background Pattern Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 via-white/20 to-purple-50/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1px, transparent 1px),
                           radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 1px, transparent 1px),
                           radial-gradient(circle at 40% 80%, rgba(255,255,255,0.05) 1px, transparent 1px),
                           radial-gradient(circle at 60% 20%, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: '100px 100px, 80px 80px, 120px 120px, 150px 150px'
        }}></div>
        
        {/* 3D Floating Logo Elements */}
        <div className="absolute top-20 right-20 opacity-20 hidden lg:block transform hover:scale-110 transition-transform duration-500">
          <div className="floating-shape">
            <Logo size="lg" showText={false} />
          </div>
        </div>
        <div className="absolute bottom-20 left-20 opacity-15 hidden lg:block transform hover:scale-110 transition-transform duration-500">
          <div className="floating-shape" style={{animationDelay: '-3s'}}>
            <Logo size="md" showText={false} />
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="relative z-10 lg:col-span-3">
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className="glass-effect text-white hover:bg-white/30 backdrop-blur-sm border border-white/30 transform hover:scale-105 transition-all duration-300">
                  <Zap className="w-4 h-4 mr-1 animate-pulse" />
                  Live & Ready to Use
                </Badge>
                <Badge className="glass-effect bg-purple-500/20 text-yellow-200 hover:bg-purple-500/30 backdrop-blur-sm border border-yellow-200/30 transform hover:scale-105 transition-all duration-300">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Web3-Native • Solana Payments
                </Badge>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-100 via-white to-gray-100 bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(255,255,255,0.4)]">
                  Your AI Co-Founder
                </span>
              </h1>
              
              <p className="text-xl text-white mb-6 leading-relaxed drop-shadow-lg font-medium">
                Generate comprehensive business plans, pitch decks, and financial models in minutes. Validate startup ideas with AI-powered market research. <span className="text-green-300 font-bold">Web3-native platform</span> with Solana payments — no equity required.
              </p>
              
              {/* Social Proof & Urgency */}
              <div className="flex items-center justify-center sm:justify-start mb-6 text-white">
                <div className="flex items-center mr-6">
                  <div className="flex -space-x-2 mr-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">+</div>
                  </div>
                  <span className="text-sm font-medium">Join founders building their next startup</span>
                </div>
                <div className="flex items-center text-yellow-200">
                  <CheckCircle className="w-4 h-4 fill-current mr-1" />
                  <span className="text-sm font-medium">Platform live & ready</span>
                </div>
              </div>
              
              {/* Trust Indicators - Moved above CTA */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-white text-base mb-6 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                  <span className="font-medium">No credit card required</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                  <span className="font-medium">Start building instantly</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                  <span className="font-medium">Cancel anytime</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-4 mb-8">
                <Link href="/app">
                  <Button size="lg" variant="ghost" className="!bg-gradient-to-r !from-green-400 !to-emerald-500 !text-white hover:!from-green-300 hover:!to-emerald-400 px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-green-500/50 hover:scale-105 transform transition-all duration-300 relative overflow-hidden group" aria-label="Start creating your business plan for free" data-testid="button-hero-primary">
                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                    <span className="relative z-10">🚀 Start Free Now</span>
                    <ArrowRight className="ml-2 w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 pt-6 sm:pt-8 border-t border-white/20">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center px-1">
                    <div className="text-sm lg:text-lg font-bold text-white drop-shadow-md leading-tight break-words">{stat.number}</div>
                    <div className="text-[10px] lg:text-xs text-green-200 mt-1 break-words font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative lg:col-span-2 scale-90 lg:scale-100">
              <InteractiveDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section - BENTO GRID LAYOUT */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/20 transition-colors duration-300 relative overflow-hidden">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border-2 border-blue-300/20 rounded-3xl rotate-12 floating-shape"></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 border-2 border-purple-300/20 rounded-2xl -rotate-12 floating-shape" style={{animationDelay: '-2s'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-6">
              <span className="gradient-text-primary">
                Common Startup Challenges
              </span>
            </h2>
            <p className="text-body-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              And How AI Can Help You Avoid Them
            </p>
          </div>
          
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mt-12">
            {/* Large featured card - spans 4 columns */}
            <Card className="md:col-span-4 bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-2xl overflow-hidden group hover:shadow-blue-500/50 transition-all duration-500">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
              <CardContent className="p-8 md:p-12 relative z-10">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <Clock className="w-12 h-12 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Time & Money Wasted</h3>
                    <p className="text-blue-50 text-lg leading-relaxed">
                      Without proper business planning and validation, many founders spend 6-12 months building products nobody wants. Our AI analyzes market fit in hours, not months - saving you time and capital.
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                        <span className="text-white font-semibold">Save 6+ months</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Two stacked cards on the right */}
            <div className="md:col-span-2 space-y-6">
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-xl overflow-hidden group hover:shadow-purple-500/50 transition-all duration-500">
                <CardContent className="p-6 relative z-10">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl w-fit mb-4">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Expensive Access</h3>
                  <p className="text-purple-50 text-sm">
                    Accelerators take 7-10% equity. Consultants charge $10k+. Get enterprise-level guidance at a fraction of the cost.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-500 to-rose-600 border-0 shadow-xl overflow-hidden group hover:shadow-pink-500/50 transition-all duration-500">
                <CardContent className="p-6 relative z-10">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl w-fit mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Investor Readiness</h3>
                  <p className="text-pink-50 text-sm">
                    90% of founders struggle with pitch materials. Our AI creates investor-grade decks and financials automatically.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section - GLASSMORPHISM & 3D CARDS */}
      <section id="features" className="py-24 bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 dark:from-gray-900 dark:via-blue-950/10 dark:to-purple-950/10 transition-colors duration-300 relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgb(59, 130, 246) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(59, 130, 246) 1px, transparent 1px)
            `,
            backgroundSize: '4rem 4rem'
          }}></div>
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center mb-8">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mr-4 shadow-xl">
                <Logo size="lg" showText={false} className="invert brightness-0" />
              </div>
              <h2 className="heading-2">
                <span className="gradient-text-primary">
                  AI Startup Tools & Business Plan Generator
                </span>
              </h2>
            </div>
            <p className="text-body-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Complete AI-powered startup acceleration platform with business plan generator, pitch deck creator, financial modeling tools, and market research capabilities.
            </p>
          </div>
          
          {/* 3D Card Grid with Staggered Heights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const isHighlighted = index === 0 || index === 2;
              
              return (
                <Card 
                  key={index} 
                  className={`
                    ${isHighlighted ? 'md:transform md:-translate-y-4' : ''}
                    border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl 
                    shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                    hover:shadow-[0_20px_60px_rgb(0,0,0,0.3)]
                    dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]
                    dark:hover:shadow-[0_20px_60px_rgb(0,0,0,0.6)]
                    transition-all duration-500 h-full group relative overflow-hidden
                    before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-500/5 before:to-purple-500/5 before:opacity-0 before:group-hover:opacity-100 before:transition-opacity before:duration-500
                  `}
                >
                  {/* Animated gradient border on hover */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                  
                  <CardContent className="p-8 text-center h-full flex flex-col relative z-10">
                    <div className={`
                      w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.color} 
                      flex items-center justify-center mx-auto mb-6 
                      transform group-hover:scale-110 group-hover:rotate-6 
                      transition-all duration-500 
                      shadow-lg group-hover:shadow-2xl
                      relative
                      before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 before:group-hover:opacity-100 before:transition-opacity
                    `}>
                      <IconComponent className="w-10 h-10 text-white relative z-10" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-grow">
                      {feature.description}
                    </p>

                    {/* Hover reveal arrow */}
                    <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <div className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        <span>Learn more</span>
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center">
            <Link href="/app">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-10 py-6 text-lg font-bold transform hover:scale-105 hover:shadow-[0_20px_60px_rgba(16,185,129,0.4)] transition-all duration-300 relative overflow-hidden group" data-testid="button-features-cta">
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                <span className="relative z-10 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Building Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Logo size="md" showText={false} className="mr-3" />
              <h2 className="text-3xl lg:text-4xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                  How to Build Investor-Ready Materials More Efficiently
                </span>
              </h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {howItWorks.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg hover:shadow-blue-500/30">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{step.step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transform hover:scale-105 transition-transform duration-300">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 transform hover:translate-y-1 transition-transform duration-300">{step.description}</p>
                </div>
              );
            })}
          </div>
          
          <div className="text-center">
            <Link href="/app">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-4 text-lg font-bold transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 relative overflow-hidden group" data-testid="button-process-cta">
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                <span className="relative z-10">🚀 Start Free Now</span>
                <ArrowRight className="ml-2 w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section id="who-its-for" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Logo size="md" showText={false} className="mr-3" />
              <h2 className="text-3xl lg:text-4xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                  Best AI Startup Tools for Entrepreneurs & Business Founders
                </span>
              </h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {targetAudiences.map((audience, index) => {
              const IconComponent = audience.icon;
              return (
                <Card key={index} className="border-2 hover:border-blue-200 dark:hover:border-blue-600 dark:bg-gray-800 dark:border-gray-700 transition-all duration-500 card-3d group relative overflow-hidden">
                  {/* Card background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardContent className="p-8 text-center relative z-10">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{audience.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{audience.description}</p>
                    <div className="space-y-2">
                      {audience.examples.map((example, idx) => (
                        <div key={idx} className="flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-gray-600 dark:text-gray-300 text-sm">{example}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                What Makes Us Different
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {differentiators.map((diff, index) => {
              const IconComponent = diff.icon;
              return (
                <div key={index} className="text-center p-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{diff.title}</h3>
                  <p className="text-gray-600">{diff.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        {/* Large Background Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <Logo size="lg" showText={false} className="transform scale-[8] pointer-events-none" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex items-center justify-center mb-6">
            <Logo size="lg" showText={false} className="mr-4" />
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Building the Operating System for Startups
            </h2>
          </div>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto mb-8">
            We believe anyone with an idea should have the tools to become an entrepreneur. MyStartup.ai's mission is to make startup creation borderless, faster, and more accessible — giving every founder an AI co-founder in their pocket.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Logo size="lg" showText={false} className="mr-4" />
            <h2 className="text-3xl lg:text-4xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                Ready to Build Smarter?
              </span>
            </h2>
          </div>
          <p className="text-xl text-gray-600 mb-8">
            Start using AI to accelerate your startup journey with comprehensive business planning tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app">
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400 px-12 py-4 text-xl font-bold shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300" data-testid="button-final-primary">
                🚀 Start Free Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/app">
              <Button size="lg" variant="outline" className="px-12 py-4 text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transform hover:scale-105 transition-all duration-300" data-testid="button-final-secondary">
                👤 Sign In
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            No credit card required • Start building in 30 seconds • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-4">
                <Logo size="lg" showText={true} />
              </div>
              <p className="text-gray-400 max-w-md">
                Your AI co-founder for building investor-ready startups. Transform ideas into businesses faster than ever.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="/app" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/ai-showcase" className="hover:text-white transition-colors">AI Showcase</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 MyStartup.ai. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setShowVideo(false)}>
          <div className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4">
            <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Demo video coming soon</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setShowVideo(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}