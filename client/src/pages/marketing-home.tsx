import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ArrowRight, Sparkles, Check, Lightbulb, FileText, Briefcase, TrendingUp } from "lucide-react";

export default function MarketingHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      
      {/* Simple Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            
            <nav className="hidden md:flex items-center gap-8 text-white">
              <a href="#tools" className="hover:text-white/80 transition-colors">AI Tools</a>
              <a href="#plans" className="hover:text-white/80 transition-colors">Business Plans</a>
              <a href="#entrepreneurs" className="hover:text-white/80 transition-colors">For Entrepreneurs</a>
            </nav>
            
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  Start Free Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="text-white">
              <div className="flex gap-3 mb-6 flex-wrap">
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
                  ✨ Live & Ready to Use
                </span>
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
                  💎 Web3-Native + Solana Payments
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Your AI Co-Founder
              </h1>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Generate comprehensive business plans, pitch decks, and financial models in minutes. Validate startup ideas with AI-powered market research. <span className="font-semibold">Web3-native platform</span> with Solana payments — no equity required.
              </p>

              <div className="flex flex-wrap gap-6 mb-8 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Start building instantly</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Cancel anytime</span>
                </div>
              </div>

              <Link href="/signup">
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-xl"
                  data-testid="button-start-free"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Free Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                <div className="text-center">
                  <Lightbulb className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">AI-Powered</p>
                  <p className="text-xs text-white/70">Idea Validation</p>
                </div>
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Comprehensive</p>
                  <p className="text-xs text-white/70">Business Plans</p>
                </div>
                <div className="text-center">
                  <Briefcase className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Professional</p>
                  <p className="text-xs text-white/70">Pitch Decks</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Investor-Ready</p>
                  <p className="text-xs text-white/70">Financial Models</p>
                </div>
              </div>
            </div>

            {/* Right Demo Card */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Platform Workflow Demo</h3>
                <span className="text-sm text-gray-500">Step 1 of 1</span>
              </div>
              
              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Idea Entry</div>
                  <div className="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-xs font-medium">Analysis</div>
                  <div className="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-xs font-medium">Business Plan</div>
                  <div className="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-xs font-medium">Investor Ready</div>
                </div>
              </div>

              <div className="text-center py-12">
                <Lightbulb className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Enter Your Startup Idea</h4>
                <p className="text-sm text-gray-600 mb-6">Share your startup concept and let our AI analyze its potential</p>
                
                <div className="mb-6">
                  <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                    What's your startup idea?
                  </label>
                  <textarea 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={4}
                    placeholder="Example: A sustainable food delivery platform that connects eco-conscious consumers with local organic restaurants..."
                    disabled
                  />
                </div>

                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  disabled
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start AI Analysis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="flex justify-center gap-2 mt-6">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                <div className="w-2 h-2 rounded-full bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
