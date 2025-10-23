import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { AuroraBackground } from "@/components/react-bits/aurora-background";
import { 
  Target,
  Users,
  FileText,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Zap,
  Code,
  X,
  Menu
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function MarketingHome() {
  return (
    <div className="min-h-screen bg-white" data-page="landing">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Logo size="lg" showText={true} />
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#validation" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Validation Journey</a>
              <a href="#how" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">How It Works</a>
              <a href="#who" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Who Needs This</a>
              <Link href="/app">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href="/app">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Validate My Idea</Button>
              </Link>
            </div>

            {/* Mobile Nav */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm"><Menu className="h-6 w-6" /></Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4 mt-8">
                  <a href="#validation" className="text-lg font-medium">Validation Journey</a>
                  <a href="#how" className="text-lg font-medium">How It Works</a>
                  <a href="#who" className="text-lg font-medium">Who Needs This</a>
                  <Link href="/app"><Button variant="outline" className="w-full">Sign In</Button></Link>
                  <Link href="/app"><Button className="w-full">Validate My Idea</Button></Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <AuroraBackground className="absolute inset-0" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="text-gray-900">Stop Building Fast.</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Start Building Right.
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              90% of startups fail building the <strong>wrong thing</strong>. 
              Validate with real-time market research in 60 seconds—BEFORE you waste time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/app">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                  ✅ Validate My Idea (Free)
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { number: "60s", label: "Validation Time" },
                { number: "8", label: "Dimensions" },
                { number: "Live", label: "Market Research" },
                { number: "GO/REFINE/PIVOT", label: "Verdict" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Gap Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                The Gap in Current AI Builders
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Bolt, v0, Cursor build fast. But they skip the most critical step.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Red Card - Large */}
            <Card className="md:col-span-2 bg-gradient-to-br from-red-500 to-red-600 border-0 p-8 text-white">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Zap className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-4">They Build Fast, Not Right</h3>
                  <p className="text-red-50 text-lg mb-4">
                    Bolt, v0, Cursor can build your app in 5 minutes. But they skip validation, 
                    market research, and customer discovery.
                  </p>
                  <p className="text-red-50 text-lg mb-6">
                    Result: <span className="font-bold text-yellow-300">Fast execution of bad ideas.</span> 90% of startups 
                    fail not because of bad code, but because they built the wrong thing.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                    <span className="font-semibold">Validation missing</span>
                    <X className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Dark Card - Top Right */}
            <Card className="bg-gradient-to-br from-gray-700 to-gray-900 border-0 p-6 text-white">
              <div className="p-3 bg-white/10 rounded-xl w-fit mb-4">
                <Code className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Missing Pre-Build Steps</h3>
              <p className="text-gray-300">
                No market research. No customer discovery. No validation. Just code generation.
              </p>
            </Card>

            {/* Green Card - Bottom Right */}
            <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 p-6 text-white md:col-start-3">
              <div className="p-3 bg-white/20 rounded-xl w-fit mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">We Fill The Gap</h3>
              <p className="text-green-50">
                Validate FIRST with market research, then use those builders to code it.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4-Stage Journey */}
      <section id="validation" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              The 4-Stage Validation Journey
            </h2>
            <p className="text-xl text-gray-600">
              Validate → Strategize → Build → Scale
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Target,
                title: "The Validator",
                description: "Real-time market research + 8-dimension scoring. GO/REFINE/PIVOT verdict in 60s.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: Users,
                title: "The Strategist",
                description: "Customer discovery, interview scripts, persona building.",
                color: "from-green-500 to-green-600"
              },
              {
                icon: FileText,
                title: "The Builder",
                description: "YC-style business plans, pitch decks, financial models.",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: TrendingUp,
                title: "The Growth Hacker",
                description: "Investor matching, traction strategies, growth playbooks.",
                color: "from-orange-500 to-orange-600"
              }
            ].map((stage, i) => (
              <Card key={i} className="p-6 hover:shadow-xl transition-shadow border border-gray-200">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center mb-4`}>
                  <stage.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{stage.title}</h3>
                <p className="text-gray-600">{stage.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How Validation Works</h2>
            <p className="text-xl text-gray-600">Four simple steps to validate before building</p>
          </div>

          <div className="space-y-4">
            {[
              { step: "1", title: "Enter Your Idea", desc: "Simple form—title, problem, solution, market" },
              { step: "2", title: "AI Conducts Live Research", desc: "Real-time market data via Perplexity AI (60-90s)" },
              { step: "3", title: "Get 8-Dimension Analysis", desc: "Market size, competition, feasibility—scored 0-100" },
              { step: "4", title: "Receive GO/REFINE/PIVOT Verdict", desc: "Clear direction on whether to build" }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6 bg-white p-6 rounded-xl border border-gray-200">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/app">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Validate Your Idea <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Who Needs This */}
      <section id="who" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Who Needs Validation?</h2>
            <p className="text-xl text-gray-600">Anyone who wants to build the RIGHT thing</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "First-Time Founders", desc: "Turn raw ideas into validated plans" },
              { title: "Indie Hackers", desc: "Validate before investing months of solo dev work" },
              { title: "Accelerators & VCs", desc: "Pre-screen startups with AI analysis" }
            ].map((audience, i) => (
              <Card key={i} className="p-6 text-center hover:shadow-xl transition-shadow">
                <h3 className="text-2xl font-bold mb-3">{audience.title}</h3>
                <p className="text-gray-600">{audience.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Speed vs Correctness */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Speed vs. Correctness</h2>
            <p className="text-xl text-blue-200">We compete on correctness, not speed</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Real-Time Research", desc: "Live web research via Perplexity AI" },
              { title: "8-Dimension Validation", desc: "Comprehensive scoring system" },
              { title: "Pre-Build Focus", desc: "Validate BEFORE building" },
              { title: "Compete on Correctness", desc: "Build RIGHT, not fast" }
            ].map((diff, i) => (
              <Card key={i} className="bg-white/10 backdrop-blur-lg border-white/20 p-6 text-center">
                <h3 className="text-xl font-bold mb-3">{diff.title}</h3>
                <p className="text-blue-100 text-sm">{diff.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Validate Before Building?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get your validation score in 60 seconds. Know if it's worth building.
          </p>
          
          <Link href="/app">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-12 py-6">
              ✅ Validate My Idea (Free)
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <p className="text-sm text-gray-500 mt-6">
            No credit card required • Validate in 60 seconds • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <Logo size="lg" showText={true} />
              <p className="text-gray-400 mt-4">
                Your pre-build AI co-founder that validates ideas BEFORE you waste time building.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#validation" className="hover:text-white">Features</a></li>
                <li><a href="#how" className="hover:text-white">How It Works</a></li>
                <li><a href="/app" className="hover:text-white">Dashboard</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 MyStartup.ai. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
