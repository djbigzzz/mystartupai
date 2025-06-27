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
  Lightbulb
} from "lucide-react";
import { Link } from "wouter";

export default function LandingNew() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
      title: "Smart Idea Validation",
      description: "Get instant feedback on your startup concept with detailed analysis that spots opportunities and risks"
    },
    {
      icon: FileText,
      title: "Professional Business Plans",
      description: "Create comprehensive business plans that investors actually want to read - in minutes, not weeks"
    },
    {
      icon: Presentation,
      title: "Pitch Deck Builder",
      description: "Build compelling investor presentations with proven templates that get meetings booked"
    },
    {
      icon: BarChart3,
      title: "Financial Forecasting",
      description: "Generate realistic 5-year projections and funding scenarios that make sense to VCs"
    },
    {
      icon: Target,
      title: "Market Intelligence",
      description: "Understand your competition and market size with research that guides your strategy"
    },
    {
      icon: Users,
      title: "Founder Network",
      description: "Connect with co-founders, advisors, and investors who can help take your startup to the next level"
    }
  ];

  const stats = [
    { number: "10", label: "Smart Tools", suffix: "" },
    { number: "4", label: "Simple Steps", suffix: "" },
    { number: "24", label: "Hour Support", suffix: "/7" }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient Orbs */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            top: '10%',
            left: '20%'
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
            bottom: '20%',
            right: '25%'
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            top: '60%',
            left: '10%'
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Floating 3D Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg shadow-purple-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                MyStartup.ai
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white font-medium transition-colors">How it Works</a>
              <Link href="/demo" className="text-gray-300 hover:text-white font-medium transition-colors">Demo</Link>
              <Link href="/waitlist">
                <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 shadow-lg shadow-purple-500/30 transform hover:scale-105 transition-all duration-300">
                  Join Waitlist
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-left">
              <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30 backdrop-blur-xl">
                🚀 Your Startup Success Platform
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                  Turn Your Idea
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Into Investment
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                The smart platform that creates professional business plans, investor presentations, and financial forecasts 
                using proven strategies that actually get funded.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/waitlist">
                  <Button size="lg" className="group bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-8 py-4 text-lg font-bold shadow-2xl shadow-purple-500/30 transform hover:scale-105 transition-all duration-300">
                    <span className="relative z-10 flex items-center">
                      Join the Waitlist
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity" />
                  </Button>
                </Link>
                
                <Link href="/demo">
                  <Button size="lg" variant="outline" className="border-2 border-purple-500/30 text-white hover:bg-purple-500/10 px-8 py-4 text-lg font-bold backdrop-blur-xl transform hover:scale-105 transition-all duration-300">
                    <Play className="mr-2 h-5 w-5" />
                    Try Demo
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300 font-medium">Smart Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300 font-medium">Proven Methods</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300 font-medium">Investor Ready</span>
                </div>
              </div>
            </div>

            {/* Right 3D Visual */}
            <div className="relative lg:h-96">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Central 3D Cube */}
                <div 
                  className="relative transform-gpu"
                  style={{
                    transform: `perspective(1000px) rotateX(${mousePosition.y * 0.01}deg) rotateY(${mousePosition.x * 0.01}deg)`
                  }}
                >
                  <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl shadow-2xl shadow-purple-500/50 flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-500">
                    <Brain className="w-16 h-16 text-white" />
                  </div>
                </div>

                {/* Orbiting Elements */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-xl flex items-center justify-center">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-1/2 -right-8 transform -translate-y-1/2">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-xl flex items-center justify-center">
                      <Presentation className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl shadow-xl flex items-center justify-center">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-1/2 -left-8 transform -translate-y-1/2">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-xl flex items-center justify-center">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                  </div>
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
                    <div className="text-gray-400 line-through text-sm">6-8 weeks</div>
                    <div className="text-green-400 font-semibold">2 hours</div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Pitch Deck</span>
                  <div className="text-right">
                    <div className="text-gray-400 line-through text-sm">$5,000</div>
                    <div className="text-green-400 font-semibold">Included</div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Financial Model</span>
                  <div className="text-right">
                    <div className="text-gray-400 line-through text-sm">$3,000</div>
                    <div className="text-green-400 font-semibold">Included</div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Market Research</span>
                  <div className="text-right">
                    <div className="text-gray-400 line-through text-sm">$2,500</div>
                    <div className="text-green-400 font-semibold">Included</div>
                  </div>
                </div>
                <div className="pt-4 text-center">
                  <div className="text-2xl font-bold text-green-400">Save $10,500+</div>
                  <div className="text-gray-300 text-sm">Plus 3+ months of work</div>
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

          {/* Interactive Journey Timeline */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Your Journey to Funding</h3>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { week: "Week 1", title: "Validate & Plan", deliverables: ["Idea Analysis", "Business Plan", "Market Research"], color: "from-purple-500 to-pink-500" },
                { week: "Week 2", title: "Build & Design", deliverables: ["Pitch Deck", "Financial Model", "MVP Strategy"], color: "from-blue-500 to-cyan-500" },
                { week: "Week 3", title: "Refine & Polish", deliverables: ["Document Review", "Presentation Prep", "Investor Research"], color: "from-cyan-500 to-green-500" },
                { week: "Week 4", title: "Launch & Connect", deliverables: ["Investor Outreach", "Network Building", "Feedback Integration"], color: "from-green-500 to-yellow-500" }
              ].map((phase, index) => (
                <div key={index} className="relative">
                  {index < 3 && (
                    <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 z-0" />
                  )}
                  
                  <div className="relative z-10 text-center">
                    <div className={`w-12 h-12 bg-gradient-to-r ${phase.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    
                    <h4 className="text-white font-semibold mb-1">{phase.week}</h4>
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

          {/* Demo CTA */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to See It in Action?</h3>
            <p className="text-gray-300 mb-6">Try our interactive demo and see how your idea transforms into an investor-ready business</p>
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
                <Link href="/waitlist">
                  <Button size="lg" className="group bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-8 py-4 text-lg font-bold shadow-2xl shadow-purple-500/30 transform hover:scale-105 transition-all duration-300">
                    <Rocket className="mr-2 h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                    Join the Waitlist
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