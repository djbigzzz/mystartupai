import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ArrowRight, Sparkles, Rocket, Target, Zap, Wallet } from "lucide-react";

export default function MarketingHome() {
  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Dot Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features"><span className="text-sm hover:text-white/80 transition-colors cursor-pointer">Features</span></Link>
              <Link href="#pricing"><span className="text-sm hover:text-white/80 transition-colors cursor-pointer">Pricing</span></Link>
              <Link href="#faqs"><span className="text-sm hover:text-white/80 transition-colors cursor-pointer">FAQs</span></Link>
            </nav>
            <Link href="/login">
              <Button 
                variant="outline" 
                className="rounded-full bg-white text-black hover:bg-white/90 border-0"
                data-testid="button-get-started-header"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Split Layout */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="relative z-10">
              <div className="mb-8">
                <Sparkles className="w-12 h-12 text-white mb-6" />
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Where startup ideas<br />become reality
              </h1>
              
              <p className="text-lg text-gray-400 mb-8 max-w-lg">
                Already have an account?{" "}
                <Link href="/login">
                  <span className="text-white underline cursor-pointer hover:text-gray-300">Sign in</span>
                </Link>
              </p>

              {/* Auth Buttons */}
              <div className="space-y-4 max-w-md">
                <Link href="/login">
                  <Button 
                    className="w-full bg-white text-black hover:bg-white/90 rounded-full h-12 text-base"
                    data-testid="button-continue-google"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                </Link>

                <div className="flex gap-4">
                  <Link href="/login" className="flex-1">
                    <Button 
                      variant="outline"
                      className="w-full border-white/20 hover:bg-white/10 rounded-full h-12"
                      data-testid="button-github"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                      </svg>
                    </Button>
                  </Link>
                  <Link href="/login" className="flex-1">
                    <Button 
                      variant="outline"
                      className="w-full border-white/20 hover:bg-white/10 rounded-full h-12"
                      data-testid="button-phantom"
                    >
                      <Wallet className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>

                <div className="text-center text-sm text-gray-500">Or start with email</div>

                <Link href="/login">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full h-12"
                    data-testid="button-signup-email"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Sign up with Email
                  </Button>
                </Link>

                <div className="text-xs text-gray-500 text-center">
                  By continuing, you agree to our{" "}
                  <span className="underline cursor-pointer hover:text-gray-400">Terms of Service</span>
                  {" "}and{" "}
                  <span className="underline cursor-pointer hover:text-gray-400">Privacy Policy</span>.
                </div>
              </div>
            </div>

            {/* Right Preview Image */}
            <div className="relative z-10 hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-8 backdrop-blur-xl border border-white/10">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-4">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-black"></div>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-black"></div>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-red-500 border-2 border-black"></div>
                    </div>
                    <span className="text-sm">Trusted by 10K+ Users</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-8 backdrop-blur-sm border border-white/10">
                  <div className="space-y-4">
                    <div className="h-4 bg-white/20 rounded w-3/4"></div>
                    <div className="h-4 bg-white/20 rounded w-1/2"></div>
                    <div className="h-32 bg-white/10 rounded"></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm text-gray-400">Startups</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm text-gray-400">Plans</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">100+</div>
                  <div className="text-sm text-gray-400">Countries</div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
                  <div className="text-2xl font-bold text-orange-400">Y</div>
                  <span className="text-sm">Backed by Colosseum - DAWN Track</span>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        <div className="text-center mt-16 text-sm text-gray-500 animate-bounce">
          ↓ Scroll down to see magic ↓
        </div>
      </section>

      {/* Meet MyStartup Section */}
      <section id="features" className="relative py-32 px-6 lg:px-8 bg-black">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-12">
            <div className="inline-block p-6 bg-white/5 rounded-2xl border border-white/10 mb-8">
              <Sparkles className="w-16 h-16" />
            </div>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Meet MyStartup.ai
          </h2>
          
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            MyStartup.ai turns concepts into production-ready businesses, saving time and eliminating technical barriers.
          </p>

          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Describe what you want to build..."
              className="w-full px-6 py-4 bg-transparent border border-white/20 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors"
              data-testid="input-describe-idea"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Sparkles className="w-5 h-5 text-gray-500" />
            </div>
          </div>

          <Link href="/login">
            <Button 
              className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12"
              data-testid="button-start-building"
            >
              Start Building
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          {/* Glowing Logo Effect */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 via-blue-500/30 to-purple-500/30 blur-3xl"></div>
            <div className="relative inline-block p-8 bg-black/50 rounded-full border border-white/10">
              <Rocket className="w-20 h-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-center">
            What can MyStartup.ai<br />do for you?
          </h2>
          <p className="text-lg text-gray-400 mb-16 text-center max-w-3xl mx-auto">
            From concept to deployment, MyStartup.ai handles every aspect of startup development so you can focus on what matters most - your vision!
          </p>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Feature List */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI Startup Validation</h3>
                  <p className="text-gray-400">Market research, competitor analysis, and business feasibility powered by AI</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Generate Business Plans</h3>
                  <p className="text-gray-400">YC-style comprehensive plans with strategic frameworks and investor documentation</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Create Pitch Decks & Models</h3>
                  <p className="text-gray-400">Professional presentations and detailed financial projections with industry benchmarks</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Powered by Solana</h3>
                  <p className="text-gray-400">Seamless Web3 integration with Phantom wallet auth and Solana Pay</p>
                </div>
              </div>
            </div>

            {/* Right: Preview Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-1 backdrop-blur-xl">
                <div className="bg-black rounded-xl p-8">
                  <div className="space-y-4">
                    <div className="h-6 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded w-3/4"></div>
                    <div className="h-6 bg-gradient-to-r from-blue-500/30 to-green-500/30 rounded w-1/2"></div>
                    <div className="h-48 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg border border-white/10 flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-gray-600" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 bg-white/5 rounded-lg border border-white/10"></div>
                      <div className="h-24 bg-white/5 rounded-lg border border-white/10"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section with Background */}
      <section className="relative py-32 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl lg:text-6xl font-bold mb-8 text-white">
            Start building on<br />MyStartup.ai today.
          </h2>
          
          <Link href="/login">
            <Button 
              className="bg-white text-black hover:bg-white/90 rounded-full px-12 h-14 text-lg font-semibold"
              data-testid="button-get-started-cta"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-black py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="mb-4 text-black font-bold text-xl">mystartup.ai</div>
              <p className="text-sm text-gray-600">
                Build production-ready startups through conversation. Chat with AI agents that design, code, and deploy your application from start to finish.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#"><span className="hover:text-black cursor-pointer">Features</span></Link></li>
                <li><Link href="#"><span className="hover:text-black cursor-pointer">Pricing</span></Link></li>
                <li><Link href="#"><span className="hover:text-black cursor-pointer">FAQs</span></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><span className="hover:text-black cursor-pointer">About</span></li>
                <li><span className="hover:text-black cursor-pointer">Careers</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><span className="hover:text-black cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-black cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div>COPYRIGHT © MYSTARTUP.AI 2025</div>
            <div className="mt-4 md:mt-0">
              DESIGNED AND BUILT FOR COLOSSEUM HACKATHON
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
