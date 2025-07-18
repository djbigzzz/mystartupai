import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  CheckCircle, 
  Brain, 
  FileText, 
  Presentation, 
  BarChart3, 
  Users, 
  Zap, 
  Target,
  Star,
  TrendingUp,
  Rocket,
  Search,
  Bot,
  Network,
  Eye,
  MessageSquare,
  Activity,
  Cpu,
  Database,
  PieChart
} from "lucide-react";
import { Link } from "wouter";
import MultiAgentDemo from "@/components/multi-agent-demo";

export default function LandingMultiAgent() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MyStartup.ai
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#agents" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">AI Agents</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">How it Works</a>
              <Link href="/demo" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Demo</Link>
              <Link href="/app">
                <Button variant="outline" className="mr-3">
                  Log in
                </Button>
              </Link>
              <Link href="/app">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Launch App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  <Bot className="w-4 h-4 mr-2" />
                  Multi-Agent AI System
                </Badge>
                
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    Your Startup, Built by
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Intelligent Agents.
                  </span>
                  <br />
                  <span className="text-gray-700">
                    Faster. Smarter. Together.
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Witness the future of startup creation: a collaborative multi-agent AI system 
                  transforming your vision into a fundable business through specialized AI agents 
                  working together in real-time.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/agentic">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Experience the Agentic AI Demo
                  </Button>
                </Link>
                <Link href="/app">
                  <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2">
                    Launch App
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  6 Specialized AI Agents
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Real-time Collaboration
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Investor-Ready Output
                </div>
              </div>
            </div>
            
            {/* Right Column - Enhanced Demo Dashboard */}
            <div className="relative">
              <MultiAgentDemo />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Multi-Agent Collaboration */}
      <section id="how-it-works" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              <Network className="w-4 h-4 mr-2" />
              Multi-Agent Collaboration
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              How Our AI Agents Work Together
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch specialized AI agents collaborate seamlessly, each contributing their expertise 
              to transform your startup idea into a comprehensive, investor-ready business package.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Agent Workflow */}
            {[
              {
                step: "01",
                title: "Idea Clarification",
                agent: "Visionary Agent",
                description: "Takes your initial concept, clarifies the core problem, and defines the solution approach with market validation insights.",
                icon: Lightbulb,
                color: "from-amber-500 to-orange-500"
              },
              {
                step: "02", 
                title: "Market Intelligence",
                agent: "Research Agent",
                description: "Conducts deep market analysis, competitor research, and identifies target audiences using real-time data from 500+ sources.",
                icon: Search,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "03",
                title: "Strategic Planning",
                agent: "Strategist Agent", 
                description: "Develops business models, revenue streams, and go-to-market strategies based on research insights.",
                icon: Target,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "04",
                title: "Financial Modeling",
                agent: "Financial Agent",
                description: "Creates 5-year projections, calculates key metrics (LTV/CAC), and determines funding requirements.",
                icon: BarChart3,
                color: "from-green-500 to-emerald-500"
              },
              {
                step: "05",
                title: "Presentation Design", 
                agent: "Designer Agent",
                description: "Crafts compelling pitch decks with professional slides, charts, and visual storytelling for investors.",
                icon: Presentation,
                color: "from-indigo-500 to-blue-500"
              },
              {
                step: "06",
                title: "Documentation",
                agent: "Document Agent",
                description: "Compiles comprehensive business plans, executive summaries, and all necessary startup documentation.",
                icon: FileText,
                color: "from-teal-500 to-cyan-500"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="relative p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-blue-600 mb-1">Step {item.step}</div>
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          <div className="text-sm text-gray-600">{item.agent}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
              <Network className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Seamless hand-offs between agents ensure comprehensive, cohesive results
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Why Multi-Agent AI Changes Everything
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience unprecedented speed, accuracy, and comprehensiveness through 
              specialized AI agents working 24/7 on your startup.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Accelerate Your Timeline", 
                description: "Agents work 24/7 in parallel, completing weeks of work in hours",
                metric: "50x Faster",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Brain,
                title: "Unparalleled Insights",
                description: "Specialized research agents access 500+ databases for deep market intelligence", 
                metric: "500+ Sources",
                color: "from-blue-500 to-purple-500"
              },
              {
                icon: Target,
                title: "Investor-Grade Quality",
                description: "Each agent optimizes for VC standards and funding success criteria",
                metric: "VC Standard", 
                color: "from-green-500 to-teal-500"
              }
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-0 text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${benefit.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <div className={`text-2xl font-bold bg-gradient-to-r ${benefit.color} bg-clip-text text-transparent`}>
                        {benefit.metric}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{benefit.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Experience Multi-Agent AI?
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Join thousands of founders who have transformed their ideas into 
              investor-ready businesses with our collaborative AI system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/agentic">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  <Play className="w-5 h-5 mr-2" />
                  Try Agentic AI Platform
                </Button>
              </Link>
              <Link href="/app">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                  Launch App
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold">MyStartup.ai</span>
              </div>
              <p className="text-gray-400">
                Multi-agent AI system for startup acceleration and investor readiness.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/agentic" className="hover:text-white transition-colors">Agentic AI</Link></li>
                <li><Link href="/app" className="hover:text-white transition-colors">Launch App</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MyStartup.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Import missing component
import { Lightbulb } from "lucide-react";