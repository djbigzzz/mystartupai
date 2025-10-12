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
  Presentation,
  BarChart3,
  Shield,
  Clock,
  Menu,
  X
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "AI Business Plans",
      description: "Generate Y Combinator-quality business plans in minutes using GPT-4 technology"
    },
    {
      icon: Presentation,
      title: "Pitch Deck Creation",
      description: "Create investor-ready pitch decks with professional templates and AI-powered content"
    },
    {
      icon: BarChart3,
      title: "Financial Models",
      description: "Build comprehensive 3-year financial projections with automated calculations"
    },
    {
      icon: Target,
      title: "Market Research",
      description: "Get AI-powered market analysis, competitor insights, and TAM calculations"
    },
    {
      icon: Lightbulb,
      title: "Idea Validation",
      description: "Validate your startup concept with data-driven insights and feasibility analysis"
    },
    {
      icon: Rocket,
      title: "MVP Guidance",
      description: "Step-by-step roadmap from concept to launch with AI recommendations"
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Submit Your Idea",
      description: "Share your startup vision and let our AI analyze its potential",
      icon: Lightbulb
    },
    {
      step: "02", 
      title: "AI Analysis",
      description: "Our multi-agent AI system researches your market, competitors, and opportunities",
      icon: Brain
    },
    {
      step: "03",
      title: "Get Your Plan", 
      description: "Receive a complete business plan, pitch deck, and financial model in 48 hours",
      icon: FileText
    },
    {
      step: "04",
      title: "Launch & Grow",
      description: "Use your investor-ready materials to secure funding and build your startup",
      icon: Rocket
    }
  ];

  const stats = [
    {
      number: "10,000+",
      label: "Startups Launched",
      icon: Rocket
    },
    {
      number: "95%",
      label: "Success Rate",
      icon: TrendingUp
    },
    {
      number: "$500M+",
      label: "Funding Raised",
      icon: DollarSign
    },
    {
      number: "48hrs",
      label: "Average Delivery",
      icon: Clock
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Founder, TechStart AI",
      content: "MyStartup.ai helped me create a professional pitch deck that secured $2M in seed funding.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "CEO, GreenEnergy Solutions",
      content: "The AI-generated business plan was more comprehensive than what I got from expensive consultants.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Entrepreneur",
      content: "From idea to investor-ready in just 2 days. This platform is a game-changer for founders.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/">
              <div className="flex items-center cursor-pointer group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                  MyStartup.ai
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                How it Works
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Testimonials
              </a>
              <Link href="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                  Sign In
                </Button>
              </Link>
              <Link href="/submit-idea">
                <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  Start Free Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="button-mobile-menu">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col space-y-4 mt-8">
                    <a href="#features" className="text-lg text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Features
                    </a>
                    <a href="#how-it-works" className="text-lg text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      How it Works
                    </a>
                    <a href="#testimonials" className="text-lg text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Testimonials
                    </a>
                    <Link href="/login">
                      <Button variant="outline" className="w-full justify-center" onClick={() => setMobileMenuOpen(false)}>
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/submit-idea">
                      <Button className="w-full justify-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700" onClick={() => setMobileMenuOpen(false)}>
                        Start Free Now
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Clean Light Theme */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-white py-20 lg:py-32 overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            {/* Trust Badge */}
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-8" data-testid="badge-trust">
              <Sparkles className="w-4 h-4 mr-2" />
              Trusted by 10,000+ Founders Worldwide
            </div>
            
            {/* Main Headline - Clean, No Outline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your AI Co-Founder for
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                Startup Success
              </span>
            </h1>
            
            {/* Clear Value Proposition */}
            <p className="text-xl lg:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform your idea into an investor-ready business in 48 hours. Get AI-powered business plans, pitch decks, and financial models—no expertise required.
            </p>
            
            {/* Strong CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/submit-idea">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
                  data-testid="button-hero-cta"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Free Now
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold transition-all duration-200"
                data-testid="button-hero-demo"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            
            {/* Trust Indicators - Prominent */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">48-hour delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">Platform Features</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                Launch Successfully
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI platform combines Y Combinator methodologies with cutting-edge technology to give you enterprise-grade startup tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-xl group" data-testid={`card-feature-${index}`}>
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
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
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-100">Simple Process</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              From Idea to{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                Investor-Ready
              </span>{" "}
              in 4 Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process takes you from concept to fundable startup in record time
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="relative" data-testid={`step-${index}`}>
                  {/* Connection Line */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-300 to-purple-300"></div>
                  )}
                  
                  <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-xl relative z-10">
                    <div className="text-5xl font-bold text-blue-600 mb-4 opacity-20">{step.number}</div>
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-xl flex items-center justify-center mb-4">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">Success Stories</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Loved by{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                Founders Worldwide
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how MyStartup.ai has helped thousands of entrepreneurs turn their ideas into funded businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-xl" data-testid={`testimonial-${index}`}>
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Idea?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join 10,000+ founders who've launched successful startups with MyStartup.ai. Start your journey today—no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit-idea">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-6 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-200 transform hover:scale-105"
                data-testid="button-cta-primary"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Free Now
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-6 text-lg font-bold transition-all duration-200 transform hover:scale-105"
                data-testid="button-cta-secondary"
              >
                View Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-white">MyStartup.ai</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Your AI-powered co-founder for startup success. Transform ideas into investor-ready businesses with cutting-edge AI technology.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">Enterprise-grade security & privacy</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-blue-400 transition-colors">How it Works</a></li>
                <li><a href="#testimonials" className="hover:text-blue-400 transition-colors">Testimonials</a></li>
                <li><Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500">© 2024 MyStartup.ai. All rights reserved. Built with AI for founders.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
