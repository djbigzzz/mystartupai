import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  CheckCircle, 
  Brain, 
  FileText, 
  Presentation, 
  BarChart3, 
  Users, 
  Zap, 
  Target,
  Star,
  TrendingUp,
  Rocket,
  Code,
  Layers,
  Lightbulb,
  Bot
} from "lucide-react";
import { Link } from "wouter";
import AnimatedDemo from "@/components/animated-demo-new";

export default function LandingNew() {
  const [isDemoPlaying, setIsDemoPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Start background demo animation
    setIsDemoPlaying(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "Live AI Research Engine",
      description: "Watch AI research multiple data sources, analyze competitors like MyFitnessPal and Nike Training, and generate insights in real-time"
    },
    {
      icon: FileText,
      title: "Comprehensive Business Plans",
      description: "Generate 12-section, 3,000+ word business plans with market analysis, financial projections, and risk assessment"
    },
    {
      icon: Presentation,
      title: "Investor Pitch Decks",
      description: "Create 10-slide presentations with speaker notes, financial charts, and competitive positioning for Series A funding"
    },
    {
      icon: BarChart3,
      title: "Advanced Financial Models",
      description: "Build 5-year projections with unit economics, LTV/CAC ratios, and funding requirements that VCs trust"
    },
    {
      icon: Target,
      title: "Competitive Intelligence",
      description: "Deep-dive SWOT analysis with TAM/SAM/SOM calculations, user personas, and strategic recommendations"
    },
    {
      icon: Users,
      title: "Complete Startup Ecosystem",
      description: "Access networking, events, document management, and investor matching - everything in one platform"
    }
  ];

  const stats = [
    { number: "10", label: "Smart Tools", suffix: "" },
    { number: "4", label: "Simple Steps", suffix: "" },
    { number: "Always", label: "Available", suffix: "" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 via-indigo-800/40 to-purple-800/50"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-semibold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                mystartup.ai
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white font-medium transition-colors">How it Works</a>
              <Link href="/demo" className="text-gray-300 hover:text-white font-medium transition-colors">Demo</Link>
              <Link href="/app">
                <Button variant="outline" className="mr-3 border-white/20 text-white hover:bg-white/10">
                  Log in
                </Button>
              </Link>
              <Link href="/app">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
                  Launch App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                Start your turning your ideas
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-white bg-clip-text text-transparent">
                into reality.
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              An intuitive platform that streamlines business plan creation, preparing you for
              successful investment. Used by founders building their next startup.
            </p>



            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/agentic">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 text-base font-semibold border-0 shadow-lg">
                  <Bot className="w-5 h-5 mr-2" />
                  Try Agentic AI Platform
                </Button>
              </Link>
              <Link href="/app">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-base font-semibold border-0 shadow-lg">
                  Launch App
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-3 text-base font-semibold border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Button>
              </Link>
            </div>

            <div className="flex justify-center">
              <div className="text-sm text-gray-400 flex items-center">
                <div className="flex items-center mr-6">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                  <span className="font-medium text-gray-300">Live & ready to use</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Platform Overview */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Your Complete Startup Toolkit
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to transform your idea into an investor-ready business - all in one platform
            </p>
          </div>

          {/* Value Proposition Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Left Column - Time & Cost Savings */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Save Time & Money</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Business Plan</span>
                  <div className="text-right">
                    <div className="text-gray-400 line-through text-sm">Weeks of work</div>
                    <div className="text-green-400 font-semibold">Same day*</div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Pitch Deck</span>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">✓ Included</div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Financial Model</span>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">✓ Included</div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Market Research</span>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">✓ Included</div>
                  </div>
                </div>
                <div className="pt-4 text-center">
                  <div className="text-2xl font-bold text-green-400">Everything Included</div>
                  <div className="text-gray-300 text-sm">Complete startup toolkit</div>
                </div>
              </div>
            </div>

            {/* Center Column - Platform Preview */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 lg:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Complete Platform Access</h3>
              
              {/* Module Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {[
                  { name: "Smart Idea Validation", icon: Brain, status: "Instant Analysis", color: "from-purple-500 to-pink-500" },
                  { name: "Business Plan Generator", icon: FileText, status: "12 Sections", color: "from-blue-500 to-cyan-500" },
                  { name: "Pitch Deck Builder", icon: Presentation, status: "10 Pro Slides", color: "from-cyan-500 to-blue-500" },
                  { name: "Financial Modeling", icon: BarChart3, status: "5-Year Projections", color: "from-green-500 to-emerald-500" },
                  { name: "Market Research", icon: Target, status: "Competitive Analysis", color: "from-orange-500 to-red-500" },
                  { name: "Founder Network", icon: Users, status: "Connect & Grow", color: "from-purple-500 to-blue-500" }
                ].map((module, index) => (
                  <div key={index} className="group relative">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${module.color} rounded-lg flex items-center justify-center`}>
                          <module.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold text-sm">{module.name}</div>
                          <div className="text-gray-400 text-xs">{module.status}</div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Value Summary */}
              <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl p-4 text-center">
                <div className="text-white font-semibold mb-1">Complete Startup Development Suite</div>
                <div className="text-gray-300 text-sm">From idea validation to investor presentations - everything included</div>
              </div>
            </div>
          </div>

          {/* Live Demo Section */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-2 mb-16">
            {isDemoPlaying && <AnimatedDemo />}
          </div>

          {/* Interactive Journey Timeline */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Your Path to Being Investor-Ready</h3>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { phase: "Phase 1", title: "Validate & Plan", deliverables: ["Idea Analysis", "Business Plan", "Market Research"], color: "from-purple-500 to-pink-500" },
                { phase: "Phase 2", title: "Build & Design", deliverables: ["Pitch Deck", "Financial Model", "MVP Strategy"], color: "from-blue-500 to-cyan-500" },
                { phase: "Phase 3", title: "Refine & Polish", deliverables: ["Document Review", "Presentation Prep", "Investor Research"], color: "from-cyan-500 to-green-500" },
                { phase: "Phase 4", title: "Launch & Connect", deliverables: ["Investor Outreach", "Network Building", "Feedback Integration"], color: "from-green-500 to-yellow-500" }
              ].map((phase, index) => (
                <div key={index} className="relative">
                  {index < 3 && (
                    <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 z-0" />
                  )}
                  
                  <div className="relative z-10 text-center">
                    <div className={`w-12 h-12 bg-gradient-to-r ${phase.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    
                    <h4 className="text-white font-semibold mb-1">{phase.phase}</h4>
                    <h5 className="text-purple-300 font-medium mb-3">{phase.title}</h5>
                    
                    <div className="space-y-1">
                      {phase.deliverables.map((item, i) => (
                        <div key={i} className="text-gray-300 text-sm flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Demo Preview */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-16">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">Watch AI Research in Real-Time</h3>
              <p className="text-gray-300 text-lg">See how our AI analyzes your startup idea by researching competitors, market data, and industry insights</p>
            </div>

            {/* Demo Preview Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: AI Research Preview */}
              <div className="bg-black/30 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center animate-spin">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">AI Research Engine</h4>
                    <p className="text-gray-400 text-sm">Live competitor analysis</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-100/10 rounded-lg border-l-4 border-green-500">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">🌐 Scanning fitness app databases</div>
                      <div className="text-gray-400 text-xs">App Store, Google Play</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-blue-100/10 rounded-lg border-l-4 border-blue-500 animate-pulse">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">📊 Analyzing competitor market data</div>
                      <div className="text-gray-400 text-xs">Leading fitness apps</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50/5 rounded-lg border-l-4 border-gray-300">
                    <div className="w-4 h-4 border border-gray-400 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="text-gray-300 text-sm">🏃 Researching workout platforms</div>
                      <div className="text-gray-500 text-xs">Popular fitness apps</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-white/5 rounded-lg border border-blue-200/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">Live Market Intelligence</span>
                  </div>
                  <div className="text-xs text-gray-300">📈 Market analysis: Large global fitness market with growing app segment</div>
                </div>
              </div>

              {/* Right: Generated Results Preview */}
              <div className="space-y-6">
                <div className="bg-black/30 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6">
                  <h4 className="text-white font-semibold mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-400" />
                    SWOT Analysis Results
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50/10 rounded p-3 border-l-2 border-green-500">
                      <div className="text-green-400 font-medium text-xs mb-1">Strengths</div>
                      <div className="text-gray-300 text-xs">Large market opportunity, AI differentiation</div>
                    </div>
                    <div className="bg-blue-50/10 rounded p-3 border-l-2 border-blue-500">
                      <div className="text-blue-400 font-medium text-xs mb-1">Opportunities</div>
                      <div className="text-gray-300 text-xs">Corporate wellness programs</div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
                  <h4 className="text-white font-semibold mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-400" />
                    Business Plan Generated
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300 text-sm">Word Count</span>
                      <span className="text-white font-medium">3,142 words</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300 text-sm">Sections</span>
                      <span className="text-white font-medium">12 complete</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300 text-sm">Quality Score</span>
                      <span className="text-green-400 font-medium">9.2/10</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6">
                  <h4 className="text-white font-semibold mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-cyan-400" />
                    Financial Projections
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">$100M</div>
                      <div className="text-gray-400 text-xs">Year 5 ARR</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">7.2x</div>
                      <div className="text-gray-400 text-xs">LTV/CAC Ratio</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Demo CTA */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Experience This Live?</h3>
            <p className="text-gray-300 mb-8 text-lg">Watch the AI research process in real-time and see your complete startup package generated quickly*</p>
            <Link href="/demo">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-8 py-4 text-lg font-bold shadow-2xl shadow-purple-500/30 transform hover:scale-105 transition-all duration-300">
                <Play className="mr-2 h-5 w-5" />
                Try Interactive Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Everything You Need to Get Funded
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From validating your idea to pitching investors, we help you build the foundation 
              every successful startup needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                From Napkin Sketch to Funding
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our proven process transforms raw ideas into polished, fundable businesses that investors take seriously.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Share Your Vision", description: "Tell us about your startup idea through our simple guided questions", icon: Lightbulb },
              { step: "02", title: "Get Smart Feedback", description: "Receive detailed analysis that shows what works and what needs fixing", icon: Brain },
              { step: "03", title: "Build Your Pitch", description: "Generate professional business plans and investor presentations instantly", icon: FileText },
              { step: "04", title: "Connect & Grow", description: "Access our network of successful founders, advisors, and potential investors", icon: Rocket }
            ].map((step, index) => (
              <div 
                key={index} 
                className="group text-center relative"
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {/* Connection Line */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 z-0" />
                )}
                
                <div className="relative z-10">
                  <div className="relative mx-auto mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/30 group-hover:shadow-purple-500/50 transform group-hover:scale-110 transition-all duration-500">
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-black border-2 border-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-purple-400 font-bold text-sm">{step.step}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-12">
            Why Founders Choose MyStartup.ai
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl">
              <div className="text-center">
                <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white">Battle-Tested Methods</h3>
                <p className="text-gray-300">Based on frameworks used by the world's most successful startups</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl">
              <div className="text-center">
                <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white">Smart Technology</h3>
                <p className="text-gray-300">Advanced algorithms that understand what investors really want to see</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white">Funding Success</h3>
                <p className="text-gray-300">Documents and presentations that consistently get meetings and deals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                  Turn Your Idea Into Reality
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of founders who have built successful companies using our proven framework and expert guidance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/app">
                  <Button size="lg" className="group bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-8 py-4 text-lg font-bold shadow-2xl shadow-purple-500/30 transform hover:scale-105 transition-all duration-300">
                    <Rocket className="mr-2 h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                    Launch App
                  </Button>
                </Link>
                
                <Link href="/demo">
                  <Button size="lg" variant="outline" className="border-2 border-purple-500/50 text-white hover:bg-purple-500/10 px-8 py-4 text-lg font-bold backdrop-blur-xl transform hover:scale-105 transition-all duration-300">
                    Try Demo Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                MyStartup.ai
              </span>
            </div>
            
            <div className="text-gray-400">
              © 2025 MyStartup.ai. Building the future of startup development.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}