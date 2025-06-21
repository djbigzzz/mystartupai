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
  Presentation
} from "lucide-react";

export default function Home() {
  const [showGetStarted, setShowGetStarted] = useState(false);

  const stats = [
    {
      number: "10,000+",
      label: "Startups Created"
    },
    {
      number: "$500M+",
      label: "Funding Raised"
    },
    {
      number: "95%",
      label: "Success Rate"
    }
  ];

  const processSteps = [
    {
      step: "Step 1",
      title: "Input Your Vision",
      description: "Share your business concept, detailing as much or as little as you prefer. Capture the core of your idea, whether in depth or at a glance.",
      icon: Lightbulb
    },
    {
      step: "Step 2", 
      title: "Generate Strategy",
      description: "Our advanced algorithms analyze market trends, competitor landscapes, and consumer behaviors to generate crucial documents, timelines, and strategies.",
      icon: Brain
    },
    {
      step: "Step 3",
      title: "Create Pitch Deck & Presentation", 
      description: "Instantly create a concise, comprehensive pitch deck and other essential materials to connect with potential investors in our hub.",
      icon: Presentation
    },
    {
      step: "Step 4",
      title: "Pitch To Investors",
      description: "Provides information on how to set up the legal structure for a startup, including the different types of companies that are available in each country, as well as the pros and cons of each structure.",
      icon: Users
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI Business Plans",
      description: "Generate comprehensive business plans in minutes using proven frameworks"
    },
    {
      icon: Target,
      title: "Market Analysis",
      description: "Deep market research and competitor analysis powered by AI"
    },
    {
      icon: Presentation,
      title: "Pitch Decks",
      description: "Professional investor presentations that get funding"
    },
    {
      icon: Users,
      title: "Investor Network",
      description: "Connect with verified investors matched to your industry"
    },
    {
      icon: DollarSign,
      title: "Financial Models",
      description: "Detailed financial projections and funding requirements"
    },
    {
      icon: Rocket,
      title: "MVP Builder",
      description: "Build and launch your minimum viable product faster"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">MyStartup.ai</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <Button variant="ghost" size="sm">Sign In</Button>
              <Link href="/dashboard">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-8 text-blue-600 border-blue-200 bg-blue-50">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Startup Platform
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Turn Your Ideas Into{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Funded Startups
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              The complete AI platform for entrepreneurs. Generate business plans, pitch 
              decks, and financial models. Connect with investors and turn your startup dream 
              into reality.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg">
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Building Now
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg"
                onClick={() => setShowGetStarted(!showGetStarted)}
              >
                <Play className="w-5 h-5 mr-2" />
                See AI in Action
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to Launch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI platform combines the best startup methodologies with cutting-edge technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-6">
                Roadmap
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                How it works?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                4 Steps on how we help you with your idea.
              </p>
              
              <div className="space-y-8">
                {processSteps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-blue-600 mb-1">{step.step}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Rocket className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Build Your Startup?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who have turned their ideas into successful businesses with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-50">
                <Rocket className="w-5 h-5 mr-2" />
                Start Building Now
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">MyStartup.ai</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The complete AI platform for entrepreneurs. Turn your startup ideas into funded businesses with our comprehensive toolkit.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MyStartup.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Interactive Preview Modal */}
      {showGetStarted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">See AI in Action</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowGetStarted(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">AI-Powered Analysis</h4>
                <p className="text-gray-600 text-sm">
                  Our AI analyzes your idea across 12 dimensions including market size, 
                  competition, feasibility, and funding potential.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Instant Business Plans</h4>
                <p className="text-gray-600 text-sm">
                  Generate comprehensive 12-section business plans following Y Combinator 
                  standards, ready for investor review.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Investor Connections</h4>
                <p className="text-gray-600 text-sm">
                  Connect with our network of verified investors matched to your 
                  industry and funding stage.
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex gap-4">
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full">
                  Get Started Now
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowGetStarted(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}