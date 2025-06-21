import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Presentation
} from "lucide-react";

export default function Home() {
  const [showGetStarted, setShowGetStarted] = useState(false);

  const stats = [
    {
      number: "10,000+",
      label: "Startups Created"
    },
    {
      number: "$500M+",
      label: "Funding Raised"
    },
    {
      number: "95%",
      label: "Success Rate"
    }
  ];

  const processSteps = [
    {
      step: "Step 1",
      title: "Input Your Vision",
      description: "Share your business concept, detailing as much or as little as you prefer. Capture the core of your idea, whether in depth or at a glance.",
      icon: Lightbulb
    },
    {
      step: "Step 2", 
      title: "Generate Strategy",
      description: "Our advanced algorithms analyze market trends, competitor landscapes, and consumer behaviors to generate crucial documents, timelines, and strategies.",
      icon: Brain
    },
    {
      step: "Step 3",
      title: "Create Pitch Deck & Presentation", 
      description: "Instantly create a concise, comprehensive pitch deck and other essential materials to connect with potential investors in our hub.",
      icon: Presentation
    },
    {
      step: "Step 4",
      title: "Pitch To Investors",
      description: "Provides information on how to set up the legal structure for a startup, including the different types of companies that are available in each country, as well as the pros and cons of each structure.",
      icon: Users
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI Business Plans",
      description: "Generate comprehensive business plans in minutes using proven frameworks"
    },
    {
      icon: Target,
      title: "Market Analysis",
      description: "Deep market research and competitor analysis powered by AI"
    },
    {
      icon: Presentation,
      title: "Pitch Decks",
      description: "Professional investor presentations that get funding"
    },
    {
      icon: Users,
      title: "Investor Network",
      description: "Connect with verified investors matched to your industry"
    },
    {
      icon: DollarSign,
      title: "Financial Models",
      description: "Detailed financial projections and funding requirements"
    },
    {
      icon: Rocket,
      title: "MVP Builder",
      description: "Build and launch your minimum viable product faster"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center group">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">MyStartup.ai</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group">
                How it Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group">
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600 transition-colors">Sign In</Button>
              <Link href="/dashboard">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover-glow">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 lg:py-32 min-h-screen flex items-center">
        {/* Luxury Aurora Background */}
        <div className="absolute inset-0 aurora-bg opacity-30"></div>
        
        {/* Premium Animated Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob luxury-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000 luxury-pulse"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000 luxury-pulse"></div>
          
          {/* Holographic Grid */}
          <div className="absolute inset-0 holographic opacity-10"></div>
          
          {/* Luxury Floating Particles */}
          <div className="absolute top-20 left-20 w-4 h-4 luxury-particle diamond-float"></div>
          <div className="absolute top-1/3 right-32 w-6 h-6 luxury-particle diamond-float animation-delay-1000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-3 h-3 luxury-particle diamond-float animation-delay-3000"></div>
          <div className="absolute top-3/4 left-1/4 w-5 h-5 luxury-particle diamond-float animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-4 h-4 luxury-particle diamond-float animation-delay-1500"></div>
          <div className="absolute bottom-1/3 left-1/5 w-3 h-3 luxury-particle diamond-float animation-delay-3500"></div>
          
          {/* Premium Light Rays */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-20 animate-float"></div>
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-300 to-transparent opacity-20 animate-float animation-delay-2000"></div>
          <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-blue-300 to-transparent opacity-20 animate-float animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center">
            {/* Premium Badge */}
            <div className="inline-block mb-8">
              <div className="luxury-border">
                <div className="bg-black/90 backdrop-blur-xl px-6 py-3 rounded-2xl">
                  <div className="flex items-center text-white">
                    <div className="w-6 h-6 premium-glow rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center mr-2">
                      <Sparkles className="w-3 h-3" />
                    </div>
                    <span className="text-luxury font-medium">AI-Powered Startup Platform</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Luxury Headline */}
            <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="text-white drop-shadow-2xl">Turn Your Ideas Into</span>
              <br />
              <span className="text-luxury metallic-gradient bg-clip-text text-transparent relative">
                Funded Startups
                <div className="absolute inset-0 luxury-shimmer"></div>
              </span>
            </h1>
            
            {/* Premium Description */}
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              The complete AI platform for entrepreneurs. Generate business plans, pitch 
              decks, and financial models. Connect with investors and turn your startup dream 
              into reality.
            </p>
            
            {/* Luxury Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="btn-luxury px-12 py-6 text-xl font-bold text-white border-0 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-3xl"
                >
                  <Rocket className="w-6 h-6 mr-3" />
                  Start Building Now
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="glass-luxury px-12 py-6 text-xl font-bold text-white border-2 border-white/30 rounded-2xl hover:border-white/50 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                onClick={() => setShowGetStarted(!showGetStarted)}
              >
                <Play className="w-6 h-6 mr-3" />
                See AI in Action
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-16 flex items-center justify-center space-x-8 text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">Trusted by 10,000+ Startups</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium">4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">95% Success Rate</span>
              </div>
            </div>
          </div>
          
          {/* Luxury Stats */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="luxury-border">
                  <div className="luxury-card rounded-2xl p-10 transform transition-all duration-500 group-hover:scale-110 premium-glow">
                    <div className="text-5xl lg:text-6xl font-black text-luxury mb-4 group-hover:scale-125 transition-transform duration-500">
                      {stat.number}
                    </div>
                    <div className="text-white/80 text-xl font-medium uppercase tracking-wider">
                      {stat.label}
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-3 h-3 luxury-particle diamond-float opacity-60"></div>
                    <div className="absolute bottom-4 left-4 w-2 h-2 luxury-particle diamond-float animation-delay-1000 opacity-40"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Features Section */}
      <section id="features" className="py-32 bg-gradient-to-b from-slate-900 to-black relative overflow-hidden">
        {/* Premium Background Elements */}
        <div className="absolute inset-0 aurora-bg opacity-20"></div>
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/30 to-purple-600/30 rounded-full mix-blend-screen filter blur-3xl animate-blob luxury-pulse"></div>
        <div className="absolute bottom-0 right-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-600/30 to-pink-500/30 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-3000 luxury-pulse"></div>
        
        {/* Floating luxury particles */}
        <div className="absolute top-20 left-20 w-4 h-4 luxury-particle diamond-float"></div>
        <div className="absolute top-40 right-32 w-3 h-3 luxury-particle diamond-float animation-delay-2000"></div>
        <div className="absolute bottom-32 left-1/3 w-5 h-5 luxury-particle diamond-float animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-7xl font-black text-white mb-8">
              Everything You Need to{" "}
              <span className="text-luxury metallic-gradient bg-clip-text text-transparent">
                Launch
              </span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto font-light">
              Our AI platform combines the best startup methodologies with cutting-edge technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group">
                  <div className="luxury-border">
                    <div className="luxury-card rounded-3xl p-10 h-full transform transition-all duration-500 group-hover:scale-105 premium-glow relative overflow-hidden">
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 luxury-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-125 transition-transform duration-500 premium-glow">
                          <IconComponent className="w-8 h-8 text-white drop-shadow-lg" />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-luxury transition-colors duration-500">
                          {feature.title}
                        </h3>
                        
                        <p className="text-gray-300 leading-relaxed text-lg font-light group-hover:text-white transition-colors duration-500">
                          {feature.description}
                        </p>
                      </div>
                      
                      {/* Decorative corner elements */}
                      <div className="absolute top-4 right-4 w-2 h-2 luxury-particle diamond-float opacity-40"></div>
                      <div className="absolute bottom-4 left-4 w-3 h-3 luxury-particle diamond-float animation-delay-1000 opacity-30"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-3000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-6 glass-effect border-blue-200">
                Roadmap
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                How it works?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                4 Steps on how we help you with your idea.
              </p>
              
              <div className="space-y-8">
                {processSteps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 group">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="group-hover:translate-x-2 transition-transform duration-300">
                        <div className="text-sm font-medium text-blue-600 mb-1">{step.step}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{step.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="relative">
              {/* Floating decorative elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-400 rounded-full animate-float opacity-60"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-purple-400 rounded-full animate-float animation-delay-1000 opacity-60"></div>
              <div className="absolute top-1/4 -right-8 w-4 h-4 bg-pink-400 rounded-full animate-float animation-delay-2000 opacity-60"></div>
              
              <div className="aspect-square bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl hover:shadow-3xl transition-shadow duration-500 relative overflow-hidden">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-gradient-shift"></div>
                
                <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 animate-float">
                  <Rocket className="w-16 h-16 text-white drop-shadow-lg" />
                </div>
                
                {/* Sparkle effects */}
                <div className="absolute top-8 left-8 w-2 h-2 bg-white rounded-full animate-sparkle"></div>
                <div className="absolute bottom-12 right-12 w-3 h-3 bg-white rounded-full animate-sparkle animation-delay-1000"></div>
                <div className="absolute top-1/2 right-8 w-2 h-2 bg-white rounded-full animate-sparkle animation-delay-2000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury CTA Section */}
      <section className="py-32 bg-gradient-to-br from-black via-purple-900 to-black relative overflow-hidden">
        {/* Ultra-premium background */}
        <div className="absolute inset-0 aurora-bg opacity-40"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full mix-blend-screen filter blur-3xl animate-blob luxury-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-gradient-to-r from-purple-600/20 to-pink-500/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000 luxury-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000 luxury-pulse"></div>
        </div>
        
        {/* Premium floating elements */}
        <div className="absolute top-32 left-32 w-6 h-6 luxury-particle diamond-float"></div>
        <div className="absolute top-1/3 right-48 w-4 h-4 luxury-particle diamond-float animation-delay-1000"></div>
        <div className="absolute bottom-48 left-1/3 w-8 h-8 luxury-particle diamond-float animation-delay-2000"></div>
        <div className="absolute bottom-32 right-32 w-5 h-5 luxury-particle diamond-float animation-delay-3000"></div>
        <div className="absolute top-1/4 left-3/4 w-3 h-3 luxury-particle diamond-float animation-delay-1500"></div>
        
        {/* Light rays */}
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/30 to-transparent animate-float"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-300/30 to-transparent animate-float animation-delay-2000"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="luxury-border mb-12">
            <div className="bg-black/80 backdrop-blur-xl px-8 py-4 rounded-3xl inline-block">
              <span className="text-luxury text-lg font-bold uppercase tracking-wider">Exclusive Opportunity</span>
            </div>
          </div>
          
          <h2 className="text-6xl lg:text-8xl font-black text-white mb-8 leading-tight">
            Ready to Build Your{" "}
            <span className="text-luxury metallic-gradient bg-clip-text text-transparent relative">
              Empire?
              <div className="absolute inset-0 luxury-shimmer"></div>
            </span>
          </h2>
          
          <p className="text-2xl text-gray-300 mb-16 max-w-4xl mx-auto font-light leading-relaxed">
            Join the elite circle of entrepreneurs who have transformed their visions into 
            billion-dollar enterprises with our exclusive AI-powered platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="btn-luxury px-16 py-8 text-2xl font-black text-white border-0 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-125 hover:shadow-3xl relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center">
                  <Rocket className="w-8 h-8 mr-4" />
                  Start Your Empire
                </div>
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="glass-luxury px-16 py-8 text-2xl font-bold text-white border-2 border-white/40 rounded-3xl hover:border-white/60 transform transition-all duration-500 hover:scale-110 hover:shadow-2xl backdrop-blur-2xl"
            >
              <Play className="w-8 h-8 mr-4" />
              Watch Preview
            </Button>
          </div>
          
          {/* Premium guarantee */}
          <div className="mt-20 inline-block">
            <div className="luxury-border">
              <div className="bg-black/60 backdrop-blur-xl px-8 py-6 rounded-2xl">
                <div className="flex items-center justify-center space-x-6 text-white/80">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-lg font-medium">30-Day Money Back</span>
                  </div>
                  <div className="w-px h-8 bg-white/20"></div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-6 h-6 text-yellow-400" />
                    <span className="text-lg font-medium">Enterprise Grade</span>
                  </div>
                  <div className="w-px h-8 bg-white/20"></div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-6 h-6 text-blue-400" />
                    <span className="text-lg font-medium">Exclusive Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">MyStartup.ai</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The complete AI platform for entrepreneurs. Turn your startup ideas into funded businesses with our comprehensive toolkit.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MyStartup.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Interactive Preview Modal */}
      {showGetStarted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">See AI in Action</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowGetStarted(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">AI-Powered Analysis</h4>
                <p className="text-gray-600 text-sm">
                  Our AI analyzes your idea across 12 dimensions including market size, 
                  competition, feasibility, and funding potential.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Instant Business Plans</h4>
                <p className="text-gray-600 text-sm">
                  Generate comprehensive 12-section business plans following Y Combinator 
                  standards, ready for investor review.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Investor Connections</h4>
                <p className="text-gray-600 text-sm">
                  Connect with our network of verified investors matched to your 
                  industry and funding stage.
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex gap-4">
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full">
                  Get Started Now
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowGetStarted(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}