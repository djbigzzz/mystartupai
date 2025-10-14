import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ArrowRight, Sparkles, Rocket, Target, Zap, Wallet, ChevronDown, Check, Star } from "lucide-react";
import { useState, useEffect } from "react";

export default function MarketingHome() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/10 to-pink-950/20 animate-gradient-shift"></div>
      
      {/* Animated Dot Pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Premium Header with Glassmorphism */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-black/30 backdrop-blur-xl ${
        scrollY > 50 ? 'bg-black/50 border-b border-white/10' : 'border-b border-white/5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-lg opacity-50"></div>
                <Logo />
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-10">
              <Link href="#features">
                <span className="text-sm text-gray-300 hover:text-white transition-all duration-300 cursor-pointer relative group">
                  Features
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
              <Link href="#faqs">
                <span className="text-sm text-gray-300 hover:text-white transition-all duration-300 cursor-pointer relative group">
                  FAQs
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </nav>
            
            <Link href="/login">
              <Button 
                className="relative bg-white text-black hover:bg-white/90 rounded-full px-6 h-11 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                data-testid="button-get-started-header"
              >
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Premium Design */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content with Animations */}
            <div className={`relative z-10 transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-white/10 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Your AI Co-Founder</span>
                </div>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-[1.1]">
                <span className="bg-gradient-to-br from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Transform ideas into
                </span>
                <br />
                <span className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  investor-ready startups
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-8 max-w-xl">
                Build your business plan, pitch deck, and financial model in minutes—not months. Powered by AI that follows Y Combinator standards.
              </p>

              {/* Prominent CTA Buttons */}
              <div className="flex flex-wrap gap-4 mt-10">
                <Link href="/signup">
                  <Button 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full px-10 h-14 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
                    data-testid="button-start-now"
                  >
                    Start Now - It's Free
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link href="/login">
                  <Button 
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-full px-10 h-14 text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105"
                    data-testid="button-sign-in"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-6 mt-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>YC-standard output</span>
                </div>
              </div>
            </div>

            {/* Right Demo Video Section - Emergent Style */}
            <div className={`relative z-10 hidden lg:block transition-all duration-1000 delay-300 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              {/* Demo Video Container */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-3xl group-hover:blur-2xl transition-all duration-500"></div>
                
                {/* Video Frame */}
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-2 shadow-2xl overflow-hidden">
                  <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl aspect-video overflow-hidden">
                    {/* Demo Animation */}
                    <div className="absolute inset-0 p-6 flex flex-col">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                          <span className="text-xs text-gray-400">AI Co-Founder Active</span>
                        </div>
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                        </div>
                      </div>

                      {/* Animated Content */}
                      <div className="flex-1 space-y-3">
                        <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20 animate-pulse">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-3 h-3 text-blue-400" />
                            <span className="text-xs text-blue-300">Analyzing your idea...</span>
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 bg-blue-400/20 rounded-full w-full"></div>
                            <div className="h-2 bg-blue-400/20 rounded-full w-4/5"></div>
                          </div>
                        </div>

                        <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20 animate-pulse delay-150">
                          <div className="flex items-center gap-2 mb-2">
                            <Rocket className="w-3 h-3 text-purple-400" />
                            <span className="text-xs text-purple-300">Building business plan...</span>
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 bg-purple-400/20 rounded-full w-full"></div>
                            <div className="h-2 bg-purple-400/20 rounded-full w-3/4"></div>
                          </div>
                        </div>

                        <div className="bg-pink-500/10 rounded-lg p-3 border border-pink-500/20 animate-pulse delay-300">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-3 h-3 text-pink-400" />
                            <span className="text-xs text-pink-300">Creating pitch deck...</span>
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 bg-pink-400/20 rounded-full w-full"></div>
                            <div className="h-2 bg-pink-400/20 rounded-full w-2/3"></div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-[progress_3s_ease-in-out_infinite]"></div>
                        </div>
                      </div>
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* YC Standards Badge */}
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-3 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-bold">YC Standards</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-500" />
        </div>
      </section>

      {/* Features Section with Cards */}
      <section id="features" className="relative py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Everything you need
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Build your startup with AI-powered tools that follow Y Combinator standards
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-6 h-6" />,
                title: "AI Validation",
                description: "Market research and competitor analysis powered by GPT-4",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Rocket className="w-6 h-6" />,
                title: "Business Plans",
                description: "YC-style comprehensive plans with strategic frameworks",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Pitch Decks",
                description: "Professional presentations that win investors",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "Financial Models",
                description: "Detailed projections with industry benchmarks",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: <Wallet className="w-6 h-6" />,
                title: "Solana Native",
                description: "Web3 integration with Phantom wallet and Solana Pay",
                gradient: "from-purple-500 to-blue-500"
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: "MVP Builder",
                description: "AI-powered code generation for your first product",
                gradient: "from-pink-500 to-rose-500"
              }
            ].map((feature, i) => (
              <div key={i} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl`}></div>
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-16">
              <h2 className="text-5xl lg:text-6xl font-bold mb-8">
                <span className="bg-gradient-to-br from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Ready to build
                </span>
                <br />
                <span className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  your startup?
                </span>
              </h2>
              
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                Get started with your AI co-founder and create professional startup documents in minutes
              </p>
              
              <Link href="/login">
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full px-12 h-16 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
                  data-testid="button-get-started-cta"
                >
                  Get Started Free
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <div className="mt-8 flex items-center justify-center gap-8">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-400">No credit card required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto py-20 px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Logo />
              </div>
              <p className="text-sm text-gray-400">
                Building the future of startup creation with AI
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-6">Product</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="#features"><span className="hover:text-white cursor-pointer transition-colors">Features</span></Link></li>
                <li><Link href="#faqs"><span className="hover:text-white cursor-pointer transition-colors">FAQs</span></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><span className="hover:text-white cursor-pointer transition-colors">About</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Blog</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Careers</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><span className="hover:text-white cursor-pointer transition-colors">Privacy</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Terms</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 text-center text-sm text-gray-500">
            <div>© 2025 MyStartup.ai. All rights reserved.</div>
          </div>
        </div>
      </footer>

    </div>
  );
}