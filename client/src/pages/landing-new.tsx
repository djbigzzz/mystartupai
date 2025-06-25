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
              <Link href="/submit-idea" className="text-gray-300 hover:text-white font-medium transition-colors">Demo</Link>
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
                
                <Link href="/submit-idea">
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

      {/* Demo Video Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-8">
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Watch How It Works
            </span>
          </h2>
          
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl group hover:border-purple-500/50 transition-all duration-500">
            <div className="aspect-video flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {!isPlaying ? (
                <Button 
                  size="lg" 
                  className="relative z-10 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 rounded-full w-24 h-24 shadow-2xl shadow-purple-500/30 transform hover:scale-110 transition-all duration-300"
                  onClick={() => setIsPlaying(true)}
                >
                  <Play className="w-10 h-10 ml-1 text-white" />
                </Button>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px] animate-pulse" />
                  <p className="text-white text-xl font-medium">Demo video playing...</p>
                </div>
              )}
            </div>
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
                
                <Link href="/submit-idea">
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