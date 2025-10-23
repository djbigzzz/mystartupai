import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
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
  Menu,
  Sparkles
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
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Logo size="lg" showText={true} />
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#validation" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Validation Journey</a>
              <a href="#how" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#who" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Who Needs This</a>
              <Link href="/app">
                <Button variant="ghost" size="sm" className="text-sm">Sign In</Button>
              </Link>
              <Link href="/app">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-sm font-medium">Validate My Idea</Button>
              </Link>
            </div>

            {/* Mobile Nav */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4 mt-8">
                  <a href="#validation" className="text-lg font-medium">Validation Journey</a>
                  <a href="#how" className="text-lg font-medium">How It Works</a>
                  <a href="#who" className="text-lg font-medium">Who Needs This</a>
                  <Link href="/app"><Button variant="outline" className="w-full">Sign In</Button></Link>
                  <Link href="/app"><Button className="w-full bg-blue-600">Validate My Idea</Button></Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Validate Before You Build</span>
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-[1.1] tracking-tight">
              <span className="text-gray-900">Stop Building</span>
              <br />
              <span className="text-gray-900">Fast. Start Building</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                Right.
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto font-medium">
              90% of startups fail building the <span className="text-gray-900 font-semibold">wrong thing</span>. 
              Validate with AI-powered market research in 60 seconds.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/app">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 h-14 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all">
                  Validate My Idea (Free)
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-gray-300 hover:border-gray-400">
                See How It Works
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-8 border-t border-gray-200">
              {[
                { number: "60s", label: "Validation Time", color: "text-blue-600" },
                { number: "8", label: "Analysis Dimensions", color: "text-purple-600" },
                { number: "Live", label: "Market Research", color: "text-green-600" },
                { number: "3", label: "Clear Verdicts", color: "text-orange-600" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Gap Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              The Gap in AI Builders
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Bolt, v0, and Cursor build fast. But they skip validation.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Red Card - Large */}
            <Card className="md:col-span-2 bg-gradient-to-br from-red-500 to-red-600 border-0 p-10 text-white relative overflow-hidden group hover:shadow-2xl transition-shadow">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-start gap-8 mb-6">
                  <div className="p-5 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Zap className="w-10 h-10" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-4xl font-bold mb-4">They Build Fast, Not Right</h3>
                    <p className="text-red-50 text-lg leading-relaxed mb-4">
                      Bolt, v0, and Cursor can build your app in 5 minutes. But they skip validation, 
                      market research, and customer discovery.
                    </p>
                    <p className="text-red-50 text-lg leading-relaxed">
                      Result: <span className="font-bold text-yellow-200">Fast execution of bad ideas.</span> 90% of startups 
                      fail not because of bad code, but because they built the wrong thing.
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-5 py-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <span className="font-semibold text-lg">Validation Missing</span>
                  <X className="w-5 h-5" />
                </div>
              </div>
            </Card>

            {/* Dark Card */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-0 p-8 text-white relative overflow-hidden group hover:shadow-2xl transition-shadow">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="p-4 bg-white/10 rounded-xl w-fit mb-6">
                  <Code className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">What's Missing</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>Market research</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>Customer discovery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>Idea validation</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Green Card */}
            <Card className="md:col-span-3 bg-gradient-to-br from-green-500 to-green-600 border-0 p-10 text-white relative overflow-hidden group hover:shadow-2xl transition-shadow">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex items-center gap-8">
                <div className="p-5 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <div className="flex-1">
                  <h3 className="text-4xl font-bold mb-4">We Fill The Gap</h3>
                  <p className="text-green-50 text-xl leading-relaxed">
                    Validate FIRST with AI-powered market research and 8-dimension analysis. 
                    Then use those builders to code it. Build the right thing, fast.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 4-Stage Journey */}
      <section id="validation" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              4-Stage Validation Journey
            </h2>
            <p className="text-xl text-gray-600">
              From idea to investor-ready in 4 stages
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: "The Validator",
                description: "Real-time market research + 8-dimension scoring. Get GO/REFINE/PIVOT verdict.",
                gradient: "from-blue-500 to-blue-600",
                bgGradient: "from-blue-50 to-blue-100"
              },
              {
                icon: Users,
                title: "The Strategist",
                description: "Customer discovery framework, interview scripts, persona building.",
                gradient: "from-green-500 to-green-600",
                bgGradient: "from-green-50 to-green-100"
              },
              {
                icon: FileText,
                title: "The Builder",
                description: "YC-style business plans, pitch decks, financial models.",
                gradient: "from-purple-500 to-purple-600",
                bgGradient: "from-purple-50 to-purple-100"
              },
              {
                icon: TrendingUp,
                title: "The Growth Hacker",
                description: "Investor matching, traction strategies, growth playbooks.",
                gradient: "from-orange-500 to-orange-600",
                bgGradient: "from-orange-50 to-orange-100"
              }
            ].map((stage, i) => (
              <Card key={i} className={`p-8 border-2 border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all group bg-gradient-to-br ${stage.bgGradient}`}>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stage.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <stage.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm font-semibold text-gray-500 mb-2">Stage {i + 1}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{stage.title}</h3>
                <p className="text-gray-700 leading-relaxed">{stage.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600">Validation in 60 seconds</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { 
                step: "1", 
                title: "Enter Your Idea", 
                desc: "Simple form—problem, solution, target market",
                color: "blue"
              },
              { 
                step: "2", 
                title: "AI Research (60-90s)", 
                desc: "Live market data via Perplexity AI",
                color: "purple"
              },
              { 
                step: "3", 
                title: "8-Dimension Analysis", 
                desc: "Market size, competition, feasibility scoring",
                color: "green"
              },
              { 
                step: "4", 
                title: "Clear Verdict", 
                desc: "GO / REFINE / PIVOT with actionable insights",
                color: "orange"
              }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6 bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 text-white flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow-lg`}>
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/app">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 h-14">
                Start Validation <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Who Needs This */}
      <section id="who" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">Who Needs This</h2>
            <p className="text-xl text-gray-600">Anyone building a startup</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "First-Time Founders", 
                desc: "Validate your idea before quitting your job",
                icon: "🚀"
              },
              { 
                title: "Indie Hackers", 
                desc: "Don't waste months building the wrong thing",
                icon: "💻"
              },
              { 
                title: "Accelerators & VCs", 
                desc: "Pre-screen startups with AI validation",
                icon: "🏢"
              }
            ].map((audience, i) => (
              <Card key={i} className="p-8 text-center border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all bg-gradient-to-br from-white to-gray-50">
                <div className="text-6xl mb-4">{audience.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{audience.title}</h3>
                <p className="text-gray-600 text-lg">{audience.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 text-white animate-gradient">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to Validate?
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-blue-100">
            Get your validation score in 60 seconds. Know if it's worth building.
          </p>
          
          <Link href="/app">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-12 h-16 shadow-2xl hover:shadow-3xl transition-all font-semibold">
              Validate My Idea (Free)
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </Link>

          <p className="text-sm text-blue-100 mt-8">
            No credit card • 60 second validation • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Logo size="lg" showText={true} />
              <p className="text-gray-400 mt-4 text-lg leading-relaxed">
                Your pre-build AI co-founder. Validate ideas before you waste time building.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-lg">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#validation" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="/app" className="hover:text-white transition-colors">Dashboard</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-lg">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 MyStartup.ai. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
