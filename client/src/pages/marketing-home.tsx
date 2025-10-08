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
  Building
} from "lucide-react";

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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="lg" showText={true} />
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium" data-testid="nav-link-features">
                AI Tools
              </a>
              <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium" data-testid="nav-link-process">
                Business Plans
              </a>
              <a href="#who-its-for" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium" data-testid="nav-link-audience">
                For Entrepreneurs
              </a>
              <Link href="/app">
                <Button variant="outline" size="sm" data-testid="button-nav-signin">Sign In</Button>
              </Link>
              <Link href="/app">
                <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" data-testid="button-nav-primary">Start Free Now</Button>
              </Link>
            </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <Badge className="mb-6 glass-effect text-white hover:bg-white/30 backdrop-blur-sm border border-white/30 transform hover:scale-105 transition-all duration-300">
                <Zap className="w-4 h-4 mr-1 animate-pulse" />
                Live & Ready to Use
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight text-3d transform hover:scale-105 transition-transform duration-500">
                <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-white bg-clip-text text-transparent animate-pulse">
                  Your AI Co-Founder
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-6 leading-relaxed drop-shadow-sm">
                Generate comprehensive business plans, pitch decks, and financial models in minutes. Validate startup ideas with AI-powered market research. Our startup accelerator platform provides the tools and guidance you need — no equity required.
              </p>
              
              {/* Social Proof & Urgency */}
              <div className="flex items-center justify-center sm:justify-start mb-6 text-blue-200">
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
              
              <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-4 mb-8">
                <Link href="/app">
                  <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400 px-10 py-4 text-xl font-bold shadow-2xl hover:shadow-yellow-500/25 hover:scale-105 transform transition-all duration-300 relative overflow-hidden group" aria-label="Start creating your business plan for free" data-testid="button-hero-primary">
                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                    <span className="relative z-10">🚀 Start Free Now</span>
                    <ArrowRight className="ml-2 w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center justify-center sm:justify-start text-blue-200 text-sm mb-8">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="mr-6">No credit card required</span>
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="mr-6">Quick setup</span>
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Cancel anytime</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 pt-6 sm:pt-8 border-t border-white/20">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center px-1">
                    <div className="text-sm lg:text-lg font-bold text-white drop-shadow-sm leading-tight break-words">{stat.number}</div>
                    <div className="text-[10px] lg:text-xs text-blue-200 mt-1 break-words">{stat.label}</div>
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

      {/* Problem Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300 relative overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute top-20 left-10 floating-shape opacity-5">
          <div className="w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full morphing-bg"></div>
        </div>
        <div className="absolute bottom-20 right-10 floating-shape opacity-5">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl morphing-bg"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 transform hover:scale-105 transition-transform duration-300">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                Common Startup Challenges (And How AI Can Help You Avoid Them)
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center p-6">
                <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Time & Money Wasted on Poor Planning</h3>
                <p className="text-gray-600 dark:text-gray-300">Without proper business planning and validation, many founders spend significant time building products without market validation</p>
              </div>
              <div className="text-center p-6">
                <DollarSign className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Expensive Access</h3>
                <p className="text-gray-600 dark:text-gray-300">Access to accelerators or consultants requires equity or high fees</p>
              </div>
              <div className="text-center p-6">
                <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Investor Readiness</h3>
                <p className="text-gray-600 dark:text-gray-300">Most founders struggle with market validation and investor materials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Logo size="lg" showText={false} className="mr-4" />
              <h2 className="text-3xl lg:text-4xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                  AI Startup Tools & Business Plan Generator
                </span>
              </h2>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Complete AI-powered startup acceleration platform with business plan generator, pitch deck creator, financial modeling tools, and market research capabilities - designed to help entrepreneurs validate ideas and prepare for funding.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-2xl dark:bg-gray-800 dark:border dark:border-gray-700 transition-all duration-500 h-full card-3d group relative overflow-hidden">
                  {/* Card background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardContent className="p-6 text-center h-full flex flex-col relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 flex-grow group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center">
            <Link href="/app">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-8 py-4 text-lg font-bold transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 transition-all duration-300 relative overflow-hidden group" data-testid="button-features-cta">
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                <span className="relative z-10">🚀 Start Free Now</span>
                <ArrowRight className="ml-2 w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
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