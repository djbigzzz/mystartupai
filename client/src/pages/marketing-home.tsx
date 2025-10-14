import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ArrowRight, Sparkles, Rocket, Target, Zap, Wallet, ChevronDown, Check, Star } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";

export default function MarketingHome() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [demoStage, setDemoStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Throttled mouse tracking for smooth performance
  const handleMouseMove = useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    });
  }, []);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setDemoStage((prev) => {
          const nextStage = prev + 1;
          if (nextStage > 4) {
            setIsPlaying(false);
            return 0;
          }
          return nextStage;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handlePlayDemo = () => {
    setDemoStage(0);
    setIsPlaying(true);
  };

  const demoStages = [
    {
      title: "Input Your Idea",
      description: "Share your startup concept",
      icon: <Sparkles className="w-4 h-4" />,
      color: "blue",
      progress: 20
    },
    {
      title: "AI Analysis",
      description: "Market research & validation",
      icon: <Target className="w-4 h-4" />,
      color: "purple",
      progress: 40
    },
    {
      title: "Business Plan",
      description: "YC-standard comprehensive plan",
      icon: <Rocket className="w-4 h-4" />,
      color: "pink",
      progress: 60
    },
    {
      title: "Pitch Deck",
      description: "Professional investor deck",
      icon: <Zap className="w-4 h-4" />,
      color: "cyan",
      progress: 80
    },
    {
      title: "Investor Ready!",
      description: "Complete startup package",
      icon: <Star className="w-4 h-4" />,
      color: "green",
      progress: 100
    }
  ];


  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      
      {/* Animated Gradient Background with Orbs */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-950/30 via-purple-950/20 to-pink-950/30">
        <div className="absolute inset-0 opacity-50">
          {/* Floating gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-float-slower"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-float"></div>
        </div>
      </div>
      
      {/* Animated Dot Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
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
                <span className="relative inline-block">
                  <span className="bg-gradient-to-br from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                    Transform ideas into
                  </span>
                </span>
                <br />
                <span className="relative inline-block">
                  {/* Metallic paint effect */}
                  <span 
                    className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent relative"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 25%, #c084fc 50%, #f472b6 75%, #60a5fa 100%)',
                      backgroundSize: '200% 200%',
                      animation: 'metallic-shine 3s ease-in-out infinite',
                      WebkitTextStroke: '1px rgba(255,255,255,0.1)',
                      filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.4))'
                    }}
                  >
                    investor-ready startups
                  </span>
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

            {/* Mobile Demo Preview */}
            <div className={`relative z-10 lg:hidden mt-12 transition-all duration-1000 delay-300 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-sm text-gray-400">AI Co-Founder Active</span>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: <Sparkles className="w-4 h-4 text-blue-400" />, text: "Analyzing your idea", color: "blue" },
                    { icon: <Rocket className="w-4 h-4 text-purple-400" />, text: "Building business plan", color: "purple" },
                    { icon: <Target className="w-4 h-4 text-pink-400" />, text: "Creating pitch deck", color: "pink" }
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 bg-${item.color}-500/10 rounded-lg border border-${item.color}-500/20`}>
                      {item.icon}
                      <span className="text-sm text-gray-300">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Interactive Demo Section */}
            <div className={`relative z-10 hidden lg:block transition-all duration-1000 delay-300 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              {/* Demo Container */}
              <div className="relative group cursor-pointer" onClick={handlePlayDemo} data-testid="demo-interactive-container">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-3xl group-hover:blur-2xl transition-all duration-500"></div>
                
                {/* Interactive Demo Frame */}
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-2 shadow-2xl overflow-hidden">
                  <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl aspect-video overflow-hidden">
                    {/* Demo Content */}
                    <div className="absolute inset-0 p-6 flex flex-col">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                          <span className="text-xs text-gray-400">{isPlaying ? 'AI Processing' : 'Ready to Demo'}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                        </div>
                      </div>

                      {/* Stage Visualization */}
                      <div className="flex-1 flex flex-col justify-center space-y-4">
                        {demoStages.map((stage, index) => {
                          const isActive = index === demoStage;
                          const isPast = index < demoStage;
                          
                          const colorClasses = {
                            blue: {
                              bg: 'bg-blue-500/10',
                              border: 'border-blue-500/20',
                              iconBg: 'bg-blue-500/20',
                              iconText: 'text-blue-400',
                              text: 'text-blue-300',
                              ring: 'ring-blue-500/30'
                            },
                            purple: {
                              bg: 'bg-purple-500/10',
                              border: 'border-purple-500/20',
                              iconBg: 'bg-purple-500/20',
                              iconText: 'text-purple-400',
                              text: 'text-purple-300',
                              ring: 'ring-purple-500/30'
                            },
                            pink: {
                              bg: 'bg-pink-500/10',
                              border: 'border-pink-500/20',
                              iconBg: 'bg-pink-500/20',
                              iconText: 'text-pink-400',
                              text: 'text-pink-300',
                              ring: 'ring-pink-500/30'
                            },
                            cyan: {
                              bg: 'bg-cyan-500/10',
                              border: 'border-cyan-500/20',
                              iconBg: 'bg-cyan-500/20',
                              iconText: 'text-cyan-400',
                              text: 'text-cyan-300',
                              ring: 'ring-cyan-500/30'
                            },
                            green: {
                              bg: 'bg-green-500/10',
                              border: 'border-green-500/20',
                              iconBg: 'bg-green-500/20',
                              iconText: 'text-green-400',
                              text: 'text-green-300',
                              ring: 'ring-green-500/30'
                            }
                          };
                          
                          const colors = colorClasses[stage.color as keyof typeof colorClasses];
                          
                          return (
                            <div 
                              key={index} 
                              className={`relative transition-all duration-500 transform ${
                                isActive ? 'scale-105' : isPast ? 'opacity-50 scale-95' : 'opacity-30 scale-90'
                              }`}
                              data-testid={`demo-stage-${index}`}
                            >
                              <div className={`${colors.bg} rounded-lg p-3 border ${colors.border} ${
                                isActive ? `animate-pulse ring-2 ${colors.ring}` : ''
                              }`}>
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${colors.iconBg} ${colors.iconText}`}>
                                    {stage.icon}
                                  </div>
                                  <div className="flex-1">
                                    <div className={`text-sm font-medium ${isActive ? colors.text : 'text-gray-400'}`}>
                                      {stage.title}
                                    </div>
                                    <div className="text-xs text-gray-500">{stage.description}</div>
                                  </div>
                                  {isPast && (
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                      <Check className="w-3 h-3 text-green-400" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Progress</span>
                          <span>{demoStages[demoStage]?.progress || 0}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                            style={{ width: `${demoStages[demoStage]?.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Play Button Overlay */}
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 hover:scale-110 transition-transform" data-testid="button-play-demo">
                          <div className="w-0 h-0 border-t-10 border-t-transparent border-l-16 border-l-white border-b-10 border-b-transparent ml-1"></div>
                        </div>
                        <div className="absolute bottom-8 text-sm text-white/80 font-medium">
                          Click to see AI in action
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Interactive Badges */}
                <div className="absolute -bottom-4 -right-4 flex gap-2">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-3 shadow-2xl animate-pulse">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-bold">YC Standards</span>
                    </div>
                  </div>
                </div>
                
                {/* Floating Feature Pills */}
                <div className="absolute -left-8 top-1/4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full px-4 py-2 shadow-xl opacity-90 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span className="text-white text-xs font-medium">GPT-4 Powered</span>
                  </div>
                </div>
                
                <div className="absolute -right-8 top-2/3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-4 py-2 shadow-xl opacity-90 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-white" />
                    <span className="text-white text-xs font-medium">10x Faster</span>
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

      {/* Stats Section */}
      <section className="relative py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { value: "10x", label: "Faster than traditional methods", gradient: "from-blue-400 to-cyan-400" },
              { value: "100%", label: "YC-standard compliance", gradient: "from-purple-400 to-pink-400" },
              { value: "24/7", label: "AI co-founder availability", gradient: "from-orange-400 to-red-400" }
            ].map((stat, i) => (
              <div key={i} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl`}></div>
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className={`text-5xl font-bold mb-3 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="relative py-32 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How does the AI Co-Founder work?",
                answer: "Our AI analyzes your startup idea using GPT-4 and creates comprehensive business plans, pitch decks, and financial models following Y Combinator standards. It's like having an experienced co-founder available 24/7."
              },
              {
                question: "Do I need a credit card to get started?",
                answer: "No credit card required! You can start for free and explore all the features. We offer usage-based pricing with transparent credit allocation."
              },
              {
                question: "What makes this different from other AI tools?",
                answer: "We're the only platform that combines Solana-native payments, Y Combinator-standard outputs, and autonomous AI agents that can execute tasks on your behalf. Plus, we focus exclusively on startup creation."
              },
              {
                question: "Can I use my own wallet?",
                answer: "Yes! We support Solana wallets including Phantom and Solflare. You can authenticate and make payments using your preferred Web3 wallet."
              },
              {
                question: "How accurate are the financial models?",
                answer: "Our AI uses industry benchmarks and real market data to create detailed financial projections. All models are based on proven frameworks used by successful startups."
              }
            ].map((faq, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"></div>
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-lg font-semibold mb-3 text-white">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
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
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-16 pb-16 border-b border-white/5">
            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10">
              <Star className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-gray-300">YC Standards</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10">
              <Wallet className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-300">Solana Native</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-300">AI-Powered</span>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Logo />
              </div>
              <p className="text-sm text-gray-400">
                Your AI Co-Founder for building investor-ready startups
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