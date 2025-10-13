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

      {/* Hero Section - Minimal Clean Design */}
      <section className="relative bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-8">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Platform live & ready</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Your AI Co-Founder
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-2xl">
                Generate comprehensive business plans, pitch decks, and financial models in minutes. Validate startup ideas with AI-powered market research.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/app">
                  <Button size="lg" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 px-8" aria-label="Start creating your business plan for free" data-testid="button-hero-primary">
                    Start Free Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-gray-200 dark:border-gray-800">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-sm font-semibold text-gray-500 dark:text-gray-500">{stat.number}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <InteractiveDemo />
            </div>
          </div>
        </div>
      </section>

      {/* The Challenge - Clean Minimal Design */}
      <section className="py-32 bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              The reality of building a startup
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Most founders waste 6-12 months and thousands of dollars before discovering their idea won't work
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="space-y-4">
              <div className="text-6xl font-bold text-gray-200 dark:text-gray-800">01</div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Time Wasted</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Building features nobody wants, pivoting too late, missing market opportunities
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="text-6xl font-bold text-gray-200 dark:text-gray-800">02</div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Money Lost</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Expensive consultants ($10k+), accelerators (7-10% equity), wrong hires, bad decisions
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="text-6xl font-bold text-gray-200 dark:text-gray-800">03</div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Dreams Delayed</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Unprepared pitch materials, rejected by investors, running out of runway
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Clean Modern Design */}
      <section id="features" className="py-32 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything you need to validate and launch
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              AI-powered tools that take you from idea to investor-ready in days, not months
            </p>
          </div>
          
          <div className="space-y-24">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const isReversed = index % 2 === 1;
              
              return (
                <div
                  key={index}
                  className={`grid md:grid-cols-2 gap-12 items-center ${isReversed ? 'md:grid-flow-col-dense' : ''}`}
                >
                  <div className={isReversed ? 'md:col-start-2' : ''}>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-900 dark:bg-white mb-6">
                      <IconComponent className="w-6 h-6 text-white dark:text-gray-900" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className={`${isReversed ? 'md:col-start-1 md:row-start-1' : ''} bg-gray-200 dark:bg-gray-800 rounded-2xl h-64`}>
                    {/* Placeholder for feature visualization */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works - Simple Process */}
      <section id="how-it-works" className="py-32 bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              From idea to investor-ready in minutes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Simple, fast, effective
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {howItWorks.map((step, index) => {
              const IconComponent = step.icon;
              
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-6">
                    <IconComponent className="w-8 h-8 text-gray-900 dark:text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who It's For - Clean Grid */}
      <section id="who-its-for" className="py-32 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Built for founders at every stage
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {targetAudiences.map((audience, index) => {
              const IconComponent = audience.icon;
              
              return (
                <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <IconComponent className="w-12 h-12 text-gray-900 dark:text-white mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {audience.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {audience.description}
                  </p>
                  <ul className="space-y-2">
                    {audience.examples.map((example, idx) => (
                      <li key={idx} className="text-sm text-gray-500 dark:text-gray-500">
                        • {example}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why MyStartup.ai */}
      <section className="py-32 bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why choose MyStartup.ai
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16">
            {differentiators.map((diff, index) => {
              const IconComponent = diff.icon;
              
              return (
                <div key={index}>
                  <IconComponent className="w-10 h-10 text-gray-900 dark:text-white mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {diff.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {diff.description}
                  </p>
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