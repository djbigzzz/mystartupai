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
                  <span className="text-sm text-gray-300">AI-Powered Startup Platform</span>
                </div>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-[1.1]">
                <span className="bg-gradient-to-br from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Where ideas
                </span>
                <br />
                <span className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  become reality
                </span>
              </h1>
              
              <p className="text-lg text-gray-400 mb-2">
                Don't have an account?{" "}
                <Link href="/signup">
                  <span className="text-blue-400 hover:text-blue-300 underline cursor-pointer transition-colors">Sign up</span>
                </Link>
              </p>

              {/* Premium Auth Section */}
              <div className="mt-10 space-y-4 max-w-md">
                <Button 
                  disabled
                  className="w-full bg-white/10 hover:bg-white/10 text-gray-400 rounded-2xl h-14 text-base font-medium cursor-not-allowed relative"
                  data-testid="button-continue-google"
                >
                  <div className="flex items-center justify-center w-full">
                    <svg className="w-5 h-5 mr-3 opacity-50" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                    <span className="ml-2 text-xs text-gray-500">(Coming soon)</span>
                  </div>
                </Button>

                <p className="text-xs text-center text-gray-500 mt-6">
                  By continuing, you agree to our{" "}
                  <Link href="/terms"><span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Terms of Service</span></Link>
                  {" "}and{" "}
                  <Link href="/privacy"><span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Privacy Policy</span></Link>
                </p>
              </div>
            </div>

            {/* Right Premium Visual */}
            <div className={`relative z-10 hidden lg:block transition-all duration-1000 delay-300 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              {/* Main Glassmorphism Card */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-3xl"></div>
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                  {/* Content Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-sm text-gray-300">AI Agent Active</span>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/5">
                      <div className="space-y-3">
                        <div className="h-3 bg-gradient-to-r from-blue-400/30 to-transparent rounded-full w-3/4"></div>
                        <div className="h-3 bg-gradient-to-r from-purple-400/30 to-transparent rounded-full w-1/2"></div>
                        <div className="h-3 bg-gradient-to-r from-pink-400/30 to-transparent rounded-full w-2/3"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {['Business Plan', 'Pitch Deck', 'Financial Model'].map((item, i) => (
                        <div key={i} className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/5 text-center hover:bg-white/10 transition-all cursor-pointer">
                          <span className="text-xs text-gray-400">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* YC Standards Badge */}
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-white" />
                    <span className="text-white font-bold">YC Standards</span>
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
                  Start building your
                </span>
                <br />
                <span className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  dream startup today
                </span>
              </h2>
              
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                Join thousands of founders using AI to build the next unicorn
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