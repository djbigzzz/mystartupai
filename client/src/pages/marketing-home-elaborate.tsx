import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ValidatorHeroDemo } from "@/components/validator-hero-demo";
import { LayeredBackground } from "@/components/layered-background";
import { ArrowRight, CheckCircle, Target, Users, FileText, TrendingUp } from "lucide-react";

const STAGES = [
  {
    id: 1,
    name: "The Validator",
    icon: Target,
    color: "from-blue-500 to-cyan-500",
    description: "AI validation with real-time market research"
  },
  {
    id: 2,
    name: "The Strategist",
    icon: Users,
    color: "from-green-500 to-emerald-500",
    description: "Customer discovery & interview scripts"
  },
  {
    id: 3,
    name: "The Builder",
    icon: FileText,
    color: "from-purple-500 to-pink-500",
    description: "Business plans, pitch decks & financial models"
  },
  {
    id: 4,
    name: "The Growth Hacker",
    icon: TrendingUp,
    color: "from-orange-500 to-red-500",
    description: "Investor matching & growth strategies"
  }
];

export default function MarketingHome() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-hidden" data-page="landing">
      {/* Layered Animated Background */}
      <LayeredBackground />
      
      {/* Subtle grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0"></div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <Logo size="lg" showText={true} />
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero Section - Split Layout */}
      <section className="relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center py-20">
            {/* Left Side - Copy & CTA */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-sm text-blue-600 dark:text-blue-400">Your Pre-Build AI Co-Founder</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
                Validate before
                <br />
                you build
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
                90% of startups fail building the wrong thing. Get AI-powered validation with real-time market research in 60 seconds.
              </p>

              {/* Sign In Link */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link href="/login">
                  <span className="text-black dark:text-white hover:underline cursor-pointer font-medium">
                    Sign in
                  </span>
                </Link>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col gap-3 max-w-sm">
                <Link href="/app">
                  <Button 
                    size="lg" 
                    className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-semibold h-12 text-base"
                    data-testid="button-validate-cta"
                  >
                    Validate My Idea (Free)
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                
                <div className="text-center text-sm text-gray-500">
                  No credit card required • 60 second validation
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-8 pt-8 border-t border-gray-200 dark:border-white/10">
                <div>
                  <div className="text-2xl font-bold">60s</div>
                  <div className="text-sm text-gray-500">Validation</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-sm text-gray-500">Dimensions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">Live</div>
                  <div className="text-sm text-gray-500">Research</div>
                </div>
              </div>
            </div>

            {/* Right Side - Animated Product Demo */}
            <div className="relative lg:block hidden">
              <ValidatorHeroDemo />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
          <span className="text-xs">Scroll to see more</span>
          <div className="w-6 h-10 border-2 border-gray-300 dark:border-gray-700 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Features Section - 4-Stage Journey */}
      <section className="relative py-32 border-t border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              4-Stage Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              From validation to investor-ready
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STAGES.map((stage, i) => (
              <div key={i} className="group relative">
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-all h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center mb-4`}>
                    <stage.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs text-gray-500 mb-2">Stage {i + 1}</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{stage.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{stage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-32 border-t border-gray-200 dark:border-white/10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Validation in 60 seconds
            </p>
          </div>

          <div className="space-y-6">
            {[
              { num: "1", title: "Enter your idea", desc: "Problem, solution, target market" },
              { num: "2", title: "AI conducts research", desc: "Live market data in 60-90 seconds" },
              { num: "3", title: "Get scored results", desc: "8 dimensions, 0-100 scoring" },
              { num: "4", title: "Receive verdict", desc: "GO / REFINE / PIVOT with insights" }
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-6 p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/20 flex items-center justify-center font-bold flex-shrink-0 text-gray-900 dark:text-white">
                  {step.num}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 border-t border-gray-200 dark:border-white/10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to validate?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
            Stop building fast. Start building right.
          </p>
          
          <Link href="/app">
            <Button 
              size="lg" 
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-semibold h-14 px-12 text-lg"
            >
              Validate My Idea (Free)
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <p className="text-sm text-gray-500 mt-6">
            No credit card required • 60 second validation
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-200 dark:border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-8">
              <Logo size="md" showText={true} />
              <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">About</a>
                <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Blog</a>
                <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
              <div>© 2025 MyStartup.ai</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
