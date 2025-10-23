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
    { number: "60 seconds", label: "Validation Time" },
    { number: "8 Dimensions", label: "Analysis Depth" },
    { number: "Live Research", label: "Market Data" },
    { number: "GO/REFINE/PIVOT", label: "Clear Verdict" }
  ];

  const features = [
    {
      icon: Target,
      title: "The Validator",
      description: "Real-time market research + 8-dimension scoring system. Get GO/REFINE/PIVOT verdict in 60 seconds. Know if your idea is worth building before you waste time.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      title: "The Strategist",
      description: "Customer discovery framework, interview scripts, and persona building. Map out who needs your product and why they'll pay for it.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: FileText,
      title: "The Builder",
      description: "YC-style business plans, AI pitch decks, and financial models. Transform validated ideas into investor-ready materials.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: TrendingUp,
      title: "The Growth Hacker",
      description: "Investor matching, traction strategies, and growth playbooks. Scale your validated startup with AI-powered guidance.",
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
      title: "Real-Time Market Research",
      description: "Live web research via Perplexity AI, not generic analysis",
      icon: Globe
    },
    {
      title: "8-Dimension Validation",
      description: "Comprehensive scoring system with GO/REFINE/PIVOT verdicts",
      icon: Target
    },
    {
      title: "Pre-Build Focus",
      description: "Validate BEFORE building, not after you've wasted time",
      icon: Shield
    },
    {
      title: "Compete on Correctness",
      description: "We help you build RIGHT, not fast. Speed comes later.",
      icon: Brain
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
                Validation Journey
              </a>
              <a href="#how-it-works" className="text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold" data-testid="nav-link-process">
                How It Works
              </a>
              <a href="#who-its-for" className="text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold" data-testid="nav-link-audience">
                Who Needs This
              </a>
              <Link href="/app">
                <Button variant="outline" size="sm" data-testid="button-nav-signin">Sign In</Button>
              </Link>
              <Link href="/app">
                <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" data-testid="button-nav-primary">Validate My Idea</Button>
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
                    Validation Journey
                  </a>
                  <a href="#how-it-works" className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2" data-testid="mobile-nav-link-process">
                    How It Works
                  </a>
                  <a href="#who-its-for" className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2" data-testid="mobile-nav-link-audience">
                    Who Needs This
                  </a>
                  <div className="flex flex-col gap-3 mt-4">
                    <Link href="/app">
                      <Button variant="outline" className="w-full" data-testid="mobile-button-nav-signin">Sign In</Button>
                    </Link>
                    <Link href="/app">
                      <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400 font-bold" data-testid="mobile-button-nav-primary">Validate My Idea</Button>
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
                  Stop Building Fast.
                </span>
                <br />
                <span className="bg-gradient-to-r from-green-300 via-emerald-200 to-green-300 bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(255,255,255,0.4)]">
                  Start Building Right.
                </span>
              </h1>
              
              <p className="text-xl text-white mb-6 leading-relaxed drop-shadow-lg font-medium">
                Every AI platform builds your idea in minutes. But <span className="text-yellow-300 font-bold">90% of startups fail</span> building the WRONG thing. We validate your idea with <span className="text-green-300 font-bold">real-time market research</span> and 8-dimension scoring BEFORE you waste time building.
              </p>
              
              {/* Value Prop */}
              <div className="flex items-center justify-center sm:justify-start mb-6 text-white">
                <div className="flex items-center mr-6">
                  <Target className="w-5 h-5 mr-2 text-green-300" />
                  <span className="text-sm font-medium">Validate in 60 seconds</span>
                </div>
                <div className="flex items-center text-yellow-200">
                  <CheckCircle className="w-4 h-4 fill-current mr-1" />
                  <span className="text-sm font-medium">Know it's worth building</span>
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
                  <span className="font-medium">Get validation instantly</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                  <span className="font-medium">Cancel anytime</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-4 mb-8">
                <Link href="/app">
                  <Button size="lg" variant="ghost" className="!bg-gradient-to-r !from-green-400 !to-emerald-500 !text-white hover:!from-green-300 hover:!to-emerald-400 px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-green-500/50 hover:scale-105 transform transition-all duration-300 relative overflow-hidden group" aria-label="Validate your startup idea for free" data-testid="button-hero-primary">
                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                    <span className="relative z-10">✅ Validate My Idea (Free)</span>
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

      {/* The Gap Section - What's Missing in Current AI Builders */}
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
                The Gap in Current AI Builders
              </span>
            </h2>
            <p className="text-body-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Bolt, v0, Cursor build fast. But they skip the most critical step.
            </p>
          </div>
          
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mt-12">
            {/* Large featured card - spans 4 columns */}
            <Card className="md:col-span-4 bg-gradient-to-br from-red-500 to-red-600 border-0 shadow-2xl overflow-hidden group hover:shadow-red-500/50 transition-all duration-500">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
              <CardContent className="p-8 md:p-12 relative z-10">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <Zap className="w-12 h-12 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">They Build Fast, Not Right</h3>
                    <p className="text-red-50 text-lg leading-relaxed">
                      Bolt, v0, Cursor can build your app in 5 minutes. But they skip validation, market research, and customer discovery. Result: <span className="font-bold text-yellow-300">Fast execution of bad ideas.</span> 90% of startups fail not because of bad code, but because they built the wrong thing.
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                        <span className="text-white font-semibold">Validation missing ❌</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Two stacked cards on the right */}
            <div className="md:col-span-2 space-y-6">
              <Card className="bg-gradient-to-br from-gray-700 to-gray-800 border-0 shadow-xl overflow-hidden group hover:shadow-gray-500/50 transition-all duration-500">
                <CardContent className="p-6 relative z-10">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl w-fit mb-4">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Missing Pre-Build Steps</h3>
                  <p className="text-gray-50 text-sm">
                    No market research. No customer discovery. No validation. Just code generation.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 shadow-xl overflow-hidden group hover:shadow-green-500/50 transition-all duration-500">
                <CardContent className="p-6 relative z-10">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl w-fit mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">We Fill The Gap</h3>
                  <p className="text-green-50 text-sm">
                    Validate FIRST with market research, then use those builders to code it.
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
                  The 4-Stage Validation Journey
                </span>
              </h2>
            </div>
            <p className="text-body-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your pre-build AI co-founder that validates ideas BEFORE you waste time building. Real-time market research + 8-dimension scoring → customer discovery → business plans → investor matching.
            </p>
          </div>
          
          {/* 3D Card Grid with Staggered Heights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const isHighlighted = index === 0 || index === 2;
              
              return (
                <div
                  className={`
                    ${isHighlighted ? 'md:transform md:-translate-y-4' : ''}
                    !border-0 rounded-lg
                    !shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                    hover:!shadow-[0_20px_60px_rgb(0,0,0,0.3)]
                    dark:!shadow-[0_8px_30px_rgb(0,0,0,0.4)]
                    dark:hover:!shadow-[0_20px_60px_rgb(0,0,0,0.6)]
                    transition-all duration-500 h-full group relative overflow-hidden
                  `}
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: 'none'
                  }}
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
                </div>
              );
            })}
          </div>
          
          <div className="text-center">
            <Link href="/app">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-10 py-6 text-lg font-bold transform hover:scale-105 hover:shadow-[0_20px_60px_rgba(16,185,129,0.4)] transition-all duration-300 relative overflow-hidden group" data-testid="button-features-cta">
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                <span className="relative z-10 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Get Validation Score
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - ANIMATED TIMELINE */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Animated stars/dots background */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="heading-2 mb-6 text-white">
              How Validation Works
            </h2>
            <p className="text-body-lg text-blue-200 max-w-3xl mx-auto">
              Four simple steps to validate your idea before building anything
            </p>
          </div>
          
          {/* Interactive Timeline */}
          <div className="relative">
            {/* Vertical connecting line (desktop) */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transform -translate-x-1/2 opacity-30"></div>
            
            <div className="space-y-20">
              {howItWorks.map((step, index) => {
                const IconComponent = step.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <div key={index} className={`relative flex items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Content card */}
                    <div className={`flex-1 ${isEven ? 'lg:pr-16' : 'lg:pl-16'}`}>
                      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-[0_20px_60px_rgba(59,130,246,0.4)] transition-all duration-500 group">
                        <CardContent className="p-8">
                          <div className="flex items-start gap-6">
                            <div className="relative">
                              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                <IconComponent className="w-8 h-8 text-white" />
                              </div>
                              <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center border-2 border-white/20">
                                <span className="text-white font-bold text-sm">{step.step}</span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                              <p className="text-blue-100 leading-relaxed">{step.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Center dot connector (desktop) */}
                    <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-4 border-gray-900 shadow-lg pulse-glow"></div>
                    </div>

                    {/* Spacer for layout */}
                    <div className="hidden lg:block flex-1"></div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="text-center mt-16">
            <Link href="/app">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-400 hover:via-purple-400 hover:to-pink-400 text-white px-10 py-6 text-lg font-bold transform hover:scale-105 hover:shadow-[0_20px_60px_rgba(147,51,234,0.6)] transition-all duration-300 relative overflow-hidden group" data-testid="button-process-cta">
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                <span className="relative z-10 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Validate Your Idea
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Who It's For - ASYMMETRIC GRID */}
      <section id="who-its-for" className="py-24 bg-gradient-to-br from-white via-purple-50/20 to-pink-50/20 dark:from-gray-900 dark:via-purple-950/10 dark:to-pink-950/10 transition-colors duration-300 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="heading-2 mb-6">
              <span className="gradient-text-primary">
                Who Needs Idea Validation?
              </span>
            </h2>
            <p className="text-body-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Anyone who wants to build the RIGHT thing instead of wasting time on the wrong idea
            </p>
          </div>
          
          {/* Asymmetric Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            {targetAudiences.map((audience, index) => {
              const IconComponent = audience.icon;
              const isLarge = index === 1; // Middle card is larger
              
              return (
                <Card 
                  key={index} 
                  className={`
                    ${isLarge ? 'lg:col-span-2 lg:row-span-2' : 'lg:col-span-2'}
                    bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0
                    shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                    hover:shadow-[0_20px_60px_rgb(147,51,234,0.3)]
                    dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]
                    dark:hover:shadow-[0_20px_60px_rgb(147,51,234,0.5)]
                    transition-all duration-500 group relative overflow-hidden
                    ${isLarge ? 'transform lg:-translate-y-8' : ''}
                  `}
                >
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                  
                  <CardContent className={`${isLarge ? 'p-10' : 'p-8'} relative z-10 h-full flex flex-col`}>
                    <div className="mb-6">
                      <div className={`${isLarge ? 'w-24 h-24' : 'w-20 h-20'} rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <IconComponent className={`${isLarge ? 'w-12 h-12' : 'w-10 h-10'} text-white`} />
                      </div>
                    </div>
                    
                    <h3 className={`${isLarge ? 'text-3xl' : 'text-2xl'} font-bold text-gray-900 dark:text-white mb-4`}>
                      {audience.title}
                    </h3>
                    
                    <p className={`${isLarge ? 'text-lg' : 'text-base'} text-gray-600 dark:text-gray-300 mb-6 flex-grow`}>
                      {audience.description}
                    </p>
                    
                    <div className="space-y-3">
                      {audience.examples.map((example, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle className={`${isLarge ? 'w-6 h-6' : 'w-5 h-5'} text-green-500 mt-0.5 flex-shrink-0`} />
                          <span className={`${isLarge ? 'text-base' : 'text-sm'} text-gray-600 dark:text-gray-300`}>
                            {example}
                          </span>
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

      {/* What Makes Us Different - CREATIVE CARDS */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Diagonal lines pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255, 255, 255, 0.1) 10px,
              rgba(255, 255, 255, 0.1) 11px
            )`
          }}></div>
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="heading-2 mb-6 text-white">
              Speed vs. Correctness
            </h2>
            <p className="text-body-lg text-purple-200 max-w-3xl mx-auto">
              Our competitors compete on speed. We compete on correctness. Here's how we're different.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentiators.map((diff, index) => {
              const IconComponent = diff.icon;
              const gradients = [
                'from-blue-500 to-cyan-500',
                'from-purple-500 to-pink-500',
                'from-orange-500 to-red-500',
                'from-green-500 to-emerald-500'
              ];
              
              return (
                <Card 
                  key={index} 
                  className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-[0_20px_60px_rgba(168,85,247,0.4)] transition-all duration-500 group relative overflow-hidden"
                >
                  {/* Animated gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 shimmer-effect"></div>
                  </div>
                  
                  <CardContent className="p-8 text-center relative z-10">
                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative`}>
                      <IconComponent className="w-10 h-10 text-white" />
                      {/* Icon glow effect */}
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${gradients[index]} blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500`}></div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 transition-all duration-300">
                      {diff.title}
                    </h3>
                    
                    <p className="text-purple-200 text-sm leading-relaxed">
                      {diff.description}
                    </p>
                  </CardContent>
                </Card>
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
              Validate Before You Build
            </h2>
          </div>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto mb-8">
            We compete on correctness, not speed. While others build fast, we validate first. Real-time market research, customer discovery, and 8-dimension analysis ensure you build the RIGHT thing — your pre-build AI co-founder that saves you from costly mistakes.
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
                Ready to Validate Before Building?
              </span>
            </h2>
          </div>
          <p className="text-xl text-gray-600 mb-8">
            Get your validation score in 60 seconds. Know if your idea is worth building before you waste time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app">
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400 px-12 py-4 text-xl font-bold shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300" data-testid="button-final-primary">
                ✅ Validate My Idea (Free)
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
            No credit card required • Validate in 60 seconds • Cancel anytime
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
                Your pre-build AI co-founder that validates ideas BEFORE you waste time building. Compete on correctness, not speed.
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