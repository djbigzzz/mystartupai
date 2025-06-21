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
      number: "AI-Powered",
      label: "Business Planning"
    },
    {
      number: "10-Step",
      label: "Startup Framework"
    },
    {
      number: "GPT-4",
      label: "Technology"
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
      description: "Generate comprehensive business plans using GPT-4 technology and proven frameworks"
    },
    {
      icon: Target,
      title: "Idea Analysis",
      description: "Analyze your startup concept with AI-powered insights and market considerations"
    },
    {
      icon: Presentation,
      title: "Pitch Deck Generation",
      description: "Create professional investor presentations following proven formats"
    },
    {
      icon: FileText,
      title: "Document Templates",
      description: "Access structured templates based on successful startup methodologies"
    },
    {
      icon: DollarSign,
      title: "Financial Planning",
      description: "Generate financial projections and funding requirement estimates"
    },
    {
      icon: Rocket,
      title: "Step-by-Step Guidance",
      description: "Follow a 10-step framework from idea validation to launch preparation"
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
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 lg:py-32 min-h-screen flex items-center">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-400/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          {/* Minimal Floating Elements */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/40 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-32 w-2 h-2 bg-purple-400/40 rounded-full animate-float animation-delay-1000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-blue-300/40 rounded-full animate-float animation-delay-3000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center">
            {/* Refined Badge */}
            <div className="inline-block mb-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full">
                <div className="flex items-center text-white">
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mr-2">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <span className="font-medium">AI-Powered Startup Platform</span>
                </div>
              </div>
            </div>
            
            {/* Elegant Headline */}
            <h1 className="text-6xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="text-white">Turn Your Ideas Into</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Funded Startups
              </span>
            </h1>
            
            {/* Honest Description */}
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Transform your startup ideas into professional business plans, investor-ready pitch decks, 
              and comprehensive financial models using advanced AI technology and proven startup methodologies.
            </p>
            
            {/* Refined Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-10 py-4 text-lg font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Building Now
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-white/10 backdrop-blur-md border-2 border-white/30 hover:border-white/50 hover:bg-white/20 px-10 py-4 text-lg font-semibold text-white rounded-xl transform transition-all duration-200 hover:scale-105"
                onClick={() => setShowGetStarted(!showGetStarted)}
              >
                <Play className="w-5 h-5 mr-2" />
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
          
          {/* Refined Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-lg font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refined Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 right-1/2 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Launch
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI platform combines the best startup methodologies with cutting-edge technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
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

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">MyStartup.ai</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with proven startup methodologies and powered by advanced AI technology to help you create professional startup documentation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">GPT-4 Powered</h3>
              <p className="text-gray-600">Advanced AI technology for content generation</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Proven Frameworks</h3>
              <p className="text-gray-600">Based on successful startup methodologies</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Generation</h3>
              <p className="text-gray-600">Create documents in minutes, not weeks</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Output</h3>
              <p className="text-gray-600">Investor-ready business plans and pitch decks</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">MyStartup.ai</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform guides you through the essential steps of startup development using AI-powered tools and proven frameworks.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-blue-600 mb-2">{step.step}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Refined CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Build Your Startup?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start building your startup with AI-powered business planning tools and proven methodologies used by successful companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105">
                <Rocket className="w-5 h-5 mr-2" />
                Start Building Now
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-blue-600 backdrop-blur-sm transform transition-all duration-200 hover:scale-105"
            >
              Learn More
            </Button>
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