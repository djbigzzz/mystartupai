import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import InteractiveDemo from "@/components/interactive-demo";
import Logo from "@/components/logo";
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

  const stats = [
    { number: "10,000+", label: "Ideas Analyzed" },
    { number: "500+", label: "Business Plans Generated" },
    { number: "95%", label: "Success Rate" },
    { number: "48hrs", label: "Average Time to MVP" }
  ];

  const features = [
    {
      icon: Brain,
      title: "Validate Your Idea",
      description: "AI-driven market research, competitor analysis, and feasibility assessment in minutes.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Presentation,
      title: "Plan Your Startup",
      description: "Automated execution roadmaps, business plans, and strategic frameworks tailored to your industry.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: DollarSign,
      title: "Get Investor-Ready",
      description: "Generate pitch decks, financial models, and investor materials that get results.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Rocket,
      title: "Grow Faster",
      description: "Go-to-market strategies, MVP development tools, and growth tactics for early traction.",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Register for Free",
      description: "Create your account in under 30 seconds",
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
      title: "Launch & Fundraise",
      description: "Use your investor-ready outputs to get funding and grow",
      icon: TrendingUp
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
      description: "Founders anywhere can start instantly, 24/7",
      icon: Globe
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="md" showText={true} />
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                How it Works
              </a>
              <a href="#who-its-for" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Who It's For
              </a>
              <Link href="/app">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href="/app">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Get Started Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700">
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 via-white/20 to-purple-50/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1px, transparent 1px),
                           radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 1px, transparent 1px),
                           radial-gradient(circle at 40% 80%, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '100px 100px, 80px 80px, 120px 120px'
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30">
                <Zap className="w-4 h-4 mr-1" />
                Live & Ready to Use
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                Your Agentic AI{" "}
                <span className="bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                  Co-Founder
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed drop-shadow-sm">
                MyStartup.ai helps entrepreneurs validate ideas, build execution roadmaps, and launch investor-ready startups — faster, smarter, and without giving up equity.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/app">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => setShowVideo(true)}
                  className="px-8 py-4 text-lg font-semibold border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  <Play className="mr-2 w-5 h-5" />
                  See How It Works
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-white/20">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-white drop-shadow-sm">{stat.number}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              90% of startups fail. Here's why.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center p-6">
                <Clock className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Time & Money Wasted</h3>
                <p className="text-gray-600">Founders waste months and money figuring out what to do next</p>
              </div>
              <div className="text-center p-6">
                <DollarSign className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Expensive Access</h3>
                <p className="text-gray-600">Access to accelerators or consultants requires equity or high fees</p>
              </div>
              <div className="text-center p-6">
                <Target className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Investor Readiness</h3>
                <p className="text-gray-600">Most founders struggle with market validation and investor materials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Meet Your AI Co-Founder
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              MyStartup.ai uses a multi-agent AI system where specialized agents collaborate in real time to build your startup alongside you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  <CardContent className="p-6 text-center h-full flex flex-col">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 flex-grow">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center">
            <Link href="/app">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg font-semibold">
                Start Now — It's Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              From Idea to Investor-Ready in Hours
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {howItWorks.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{step.step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>
          
          <div className="text-center">
            <Link href="/app">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg font-semibold">
                Create Your Startup Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section id="who-its-for" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Built for Founders Everywhere
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {targetAudiences.map((audience, index) => {
              const IconComponent = audience.icon;
              return (
                <Card key={index} className="border-2 hover:border-blue-200 transition-colors duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">{audience.title}</h3>
                    <p className="text-gray-600 mb-6">{audience.description}</p>
                    <div className="space-y-2">
                      {audience.examples.map((example, idx) => (
                        <div key={idx} className="flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-gray-600 text-sm">{example}</span>
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              What Makes Us Different
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Building the Operating System for Startups
          </h2>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto mb-8">
            We believe anyone with an idea should have the tools to become an entrepreneur. MyStartup.ai's mission is to make startup creation borderless, faster, and more accessible — giving every founder an AI co-founder in their pocket.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Ready to Build Smarter?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of founders who are already using AI to accelerate their startup journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-12 py-4 text-lg font-semibold">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/app">
              <Button size="lg" variant="outline" className="px-12 py-4 text-lg font-semibold border-2">
                Sign In
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            No credit card required • Start building in 30 seconds • Join 10,000+ founders
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-4">
                <Logo size="md" showText={true} />
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