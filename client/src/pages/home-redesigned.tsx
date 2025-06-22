import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Rocket, 
  Target, 
  Zap, 
  TrendingUp, 
  Play, 
  Sparkles, 
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  FileText,
  DollarSign,
  Presentation,
  BarChart3,
  Network,
  Calendar,
  Shield
} from "lucide-react";
import { Link } from "wouter";

export default function HomeRedesigned() {
  const [showDemo, setShowDemo] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "AI Business Planning",
      description: "Generate comprehensive business plans with market analysis, competitive intelligence, and strategic recommendations using GPT-4 technology.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Presentation,
      title: "Investor Pitch Decks",
      description: "Create professional presentations that follow proven formats and highlight your startup's unique value proposition to investors.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: BarChart3,
      title: "Financial Modeling",
      description: "Build detailed financial projections, revenue models, and funding requirements with interactive charts and scenarios.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Target,
      title: "Market Research",
      description: "Analyze your target market, competitors, and industry trends with AI-powered insights and data visualization.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Network,
      title: "Investor Matching",
      description: "Connect with relevant investors based on your industry, stage, and funding requirements through our network.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Rocket,
      title: "MVP Development",
      description: "Get guidance on building your minimum viable product with technical specifications and development roadmaps.",
      color: "from-pink-500 to-rose-500"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Submit Your Idea",
      description: "Share your startup concept through our intelligent form that captures key details about your vision, target market, and business model.",
      icon: Sparkles
    },
    {
      step: "02",
      title: "AI Analysis & Validation",
      description: "Our advanced AI analyzes market potential, competitive landscape, and feasibility to provide actionable insights and recommendations.",
      icon: Brain
    },
    {
      step: "03",
      title: "Generate Documents",
      description: "Create professional business plans, pitch decks, and financial models tailored to your specific industry and business model.",
      icon: FileText
    },
    {
      step: "04",
      title: "Connect & Launch",
      description: "Access our investor network, find co-founders, and get the resources you need to bring your startup to life.",
      icon: Rocket
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Navigation */}
      <nav className="bg-white/95 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MyStartup.ai
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-10">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-semibold text-lg relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-semibold text-lg relative group">
                How it Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-semibold text-lg relative group">
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              
              <div className="flex items-center space-x-4">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600 font-semibold text-lg">
                  Sign In
                </Button>
                <Link href="/submit-idea">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-3 text-lg font-semibold">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Revolutionary Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen flex items-center">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {/* Animated grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center space-y-12">
            {/* Premium Status Badge */}
            <div className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-white/20 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse mr-3"></div>
                <Brain className="w-6 h-6 mr-3 text-blue-300" />
                <span className="text-lg font-bold text-white">
                  Powered by Advanced AI Technology
                </span>
              </div>
            </div>

            {/* Compelling Headline */}
            <div className="space-y-8">
              <h1 className="text-7xl lg:text-9xl font-black tracking-tight leading-none">
                <span className="block text-white mb-4">Build The Next</span>
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  Billion Dollar
                </span>
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  Startup
                </span>
              </h1>
              
              <p className="max-w-5xl mx-auto text-2xl lg:text-3xl text-slate-200 leading-relaxed font-medium">
                Transform your breakthrough idea into a fundable startup with our comprehensive AI platform. 
                Generate investor-grade business plans, create compelling pitch decks, and connect with the right people to make it happen.
              </p>
            </div>

            {/* Powerful Call-to-Action */}
            <div className="space-y-10">
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                <Link href="/submit-idea">
                  <Button size="lg" className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-14 py-8 text-2xl font-black rounded-3xl shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-110">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
                    <div className="relative flex items-center">
                      <Rocket className="w-8 h-8 mr-4 group-hover:animate-bounce" />
                      Start Building Now
                    </div>
                  </Button>
                </Link>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-3 border-white/40 text-white hover:bg-white/10 px-14 py-8 text-2xl font-black rounded-3xl backdrop-blur-xl shadow-2xl transition-all duration-300 transform hover:scale-110"
                  onClick={() => setShowDemo(true)}
                >
                  <Play className="w-8 h-8 mr-4" />
                  See the Magic
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-16">
                <div className="flex items-center justify-center p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20">
                  <Zap className="w-8 h-8 text-yellow-400 mr-4" />
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">GPT-4 Powered</div>
                    <div className="text-slate-300">Advanced AI Analysis</div>
                  </div>
                </div>

                <div className="flex items-center justify-center p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20">
                  <Target className="w-8 h-8 text-blue-400 mr-4" />
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">Proven Framework</div>
                    <div className="text-slate-300">10-Step Methodology</div>
                  </div>
                </div>

                <div className="flex items-center justify-center p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20">
                  <TrendingUp className="w-8 h-8 text-emerald-400 mr-4" />
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">Investor Ready</div>
                    <div className="text-slate-300">Professional Output</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-6 h-6 bg-blue-400/60 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-20 w-4 h-4 bg-purple-400/60 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-pink-400/60 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-cyan-400/60 rounded-full animate-pulse delay-1500"></div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              Everything You Need to
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Build & Scale
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive platform provides all the tools, insights, and connections you need to transform your startup idea into a thriving business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-rotate-1 bg-white">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <CardHeader className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </CardTitle>
                  
                  <CardDescription className="text-gray-600 text-lg leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              From Idea to
              <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Investment Ready
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Follow our proven 4-step process that has helped countless entrepreneurs turn their ideas into fundable startups.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-6 group">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                    <span className="text-white font-black text-xl">{step.step}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 shadow-2xl">
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Intelligence</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Our advanced AI analyzes thousands of successful startups to provide you with personalized insights and recommendations.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-xl shadow-md">
                      <div className="text-2xl font-bold text-blue-600">95%</div>
                      <div className="text-sm text-gray-600">Accuracy Rate</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl shadow-md">
                      <div className="text-2xl font-bold text-purple-600">10x</div>
                      <div className="text-sm text-gray-600">Faster Results</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl shadow-md">
                      <div className="text-2xl font-bold text-emerald-600">24/7</div>
                      <div className="text-sm text-gray-600">Available</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link href="/submit-idea">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Start Your Journey Today
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-2xl font-black">MyStartup.ai</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed mb-6 max-w-md">
                Empowering entrepreneurs to build the next generation of successful startups with AI-powered tools and proven methodologies.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Users className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Calendar className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Shield className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Platform</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Business Planning</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pitch Decks</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Financial Modeling</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Market Research</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 MyStartup.ai. Built with AI technology to empower the next generation of entrepreneurs.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}