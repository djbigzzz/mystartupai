import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Brain,
  Lightbulb,
  FileText,
  Users,
  Code,
  TrendingUp,
  CheckCircle,
  Sparkles,
  Target,
  ArrowRight,
  Star,
  DollarSign,
  Rocket,
  BarChart3,
  MessageSquare,
  Calendar
} from "lucide-react";

interface DemoSlide {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  duration: number;
}

export default function InteractiveDemo() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const slides: DemoSlide[] = [
    {
      id: "dashboard",
      title: "AI-Powered Dashboard",
      description: "Your personalized command center with real-time insights and progress tracking",
      duration: 4000,
      component: (
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome back, Alex!</h2>
              <p className="text-gray-600">Ready to accelerate your startup journey?</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">85%</div>
              <div className="text-sm text-gray-500">Profile Complete</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Lightbulb className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Ideas Analyzed</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">5</div>
              <div className="text-sm text-gray-600">Business Plans</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">23</div>
              <div className="text-sm text-gray-600">Investor Matches</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <Code className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-gray-600">MVPs Built</div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Idea Validation</span>
                <span>80%</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Business Planning</span>
                <span>60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Investor Readiness</span>
                <span>40%</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "ai-analysis",
      title: "AI Startup Analysis",
      description: "Watch our AI agents analyze your startup idea in real-time with market insights",
      duration: 5000,
      component: (
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl">
          <div className="flex items-center mb-6">
            <Brain className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">AI Analysis in Progress</h3>
              <p className="text-gray-600">EcoFood - Sustainable Food Delivery Platform</p>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r">
              <div className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-semibold text-green-800">Market Opportunity</span>
              </div>
              <p className="text-green-700 text-sm">
                $150B global food delivery market growing 20% annually. Strong demand for sustainable options.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r">
              <div className="flex items-center mb-2">
                <Target className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-semibold text-blue-800">Competitive Analysis</span>
              </div>
              <p className="text-blue-700 text-sm">
                3 direct competitors identified. Key differentiation: carbon-neutral delivery & local sourcing.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600 mr-2" />
                <span className="font-semibold text-orange-800">Revenue Potential</span>
              </div>
              <p className="text-orange-700 text-sm">
                Projected $2.5M ARR by year 2 with 15% commission model. Break-even in 18 months.
              </p>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">94% Viability Score</div>
                <p className="text-gray-600 text-sm">Based on market size, competition, and execution feasibility</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "business-plan",
      title: "Business Plan Generation",
      description: "AI creates comprehensive business plans with financial projections and strategy",
      duration: 4500,
      component: (
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl">
          <div className="flex items-center mb-6">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">Business Plan Generator</h3>
              <p className="text-gray-600">AI-powered comprehensive planning</p>
            </div>
          </div>

          {/* Business Plan Sections */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-green-50 rounded">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-sm font-medium">Executive Summary</span>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-sm font-medium">Market Analysis</span>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-sm font-medium">Business Model</span>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded">
                <div className="w-5 h-5 border-2 border-blue-600 rounded mr-3 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                </div>
                <span className="text-sm font-medium">Marketing Strategy</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 rounded">
                <div className="w-5 h-5 border-2 border-gray-300 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-500">Financial Projections</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded">
                <div className="w-5 h-5 border-2 border-gray-300 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-500">Operations Plan</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded">
                <div className="w-5 h-5 border-2 border-gray-300 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-500">Risk Analysis</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded">
                <div className="w-5 h-5 border-2 border-gray-300 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-500">Team & Management</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Generation Progress</span>
              <span className="text-sm font-medium text-blue-600">45%</span>
            </div>
            <Progress value={45} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">AI is analyzing market data and crafting your marketing strategy...</p>
          </div>
        </div>
      )
    },
    {
      id: "mvp-builder",
      title: "MVP Code Generation",
      description: "Generate production-ready code for different types of startups in minutes",
      duration: 4000,
      component: (
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl">
          <div className="flex items-center mb-6">
            <Code className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">MVP Builder</h3>
              <p className="text-gray-600">EcoFood Delivery Platform</p>
            </div>
          </div>

          {/* Template Selection */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 border-2 border-blue-500 bg-blue-50 rounded-lg text-center">
              <Rocket className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-800">SaaS Platform</h4>
              <p className="text-xs text-blue-600 mt-1">Selected</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg text-center">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h4 className="font-medium text-gray-600">Marketplace</h4>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg text-center">
              <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h4 className="font-medium text-gray-600">E-commerce</h4>
            </div>
          </div>

          {/* Code Generation Progress */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">🎯 Project Structure</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">🔧 Authentication System</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">📊 Dashboard Components</span>
              <div className="w-5 h-5 border-2 border-blue-600 rounded flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-400">🚀 Deployment Config</span>
              <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Generated Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-100 text-blue-800">React</Badge>
              <Badge className="bg-green-100 text-green-800">Node.js</Badge>
              <Badge className="bg-purple-100 text-purple-800">PostgreSQL</Badge>
              <Badge className="bg-orange-100 text-orange-800">Stripe</Badge>
              <Badge className="bg-gray-100 text-gray-800">Docker</Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "investor-matching",
      title: "AI Investor Matching",
      description: "Connect with the right investors based on your startup profile and industry",
      duration: 4500,
      component: (
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl">
          <div className="flex items-center mb-6">
            <Users className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">Investor Matching</h3>
              <p className="text-gray-600">AI-powered investor recommendations</p>
            </div>
          </div>

          {/* Top Matches */}
          <div className="space-y-4 mb-6">
            <div className="border border-green-200 bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sarah Chen</h4>
                    <p className="text-sm text-gray-600">Sequoia Capital - Principal</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-100 text-green-800 mb-1">94% Match</Badge>
                  <div className="flex items-center text-xs text-gray-500">
                    <Star className="w-3 h-3 mr-1 text-yellow-500" />
                    Led 12 similar deals
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Focus:</span> SaaS, Sustainability, Series A
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Connect
                </Button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Marcus Rodriguez</h4>
                    <p className="text-sm text-gray-600">Andreessen Horowitz - GP</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-blue-100 text-blue-800 mb-1">87% Match</Badge>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    Available this month
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Focus:</span> B2B, Food Tech, Series A/B
                </div>
                <Button size="sm" variant="outline">
                  View Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Matching Stats */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">23 Investors Found</div>
              <p className="text-sm text-gray-600">Based on your industry, stage, and funding needs</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Move to next slide
            setCurrentSlide((current) => (current + 1) % slides.length);
            return 0;
          }
          return prev + (100 / (slides[currentSlide].duration / 100));
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentSlide, slides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl p-8">
      {/* Demo Content */}
      <div className="flex flex-col items-center">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {slides[currentSlide].title}
          </h3>
          <p className="text-gray-600 max-w-2xl">
            {slides[currentSlide].description}
          </p>
        </div>

        {/* Slide Content */}
        <div className="mb-8 flex justify-center w-full">
          {slides[currentSlide].component}
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-4xl mb-6">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6">
          <Button variant="outline" size="sm" onClick={prevSlide}>
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button 
            size="sm" 
            onClick={togglePlayPause}
            className={isPlaying ? "bg-orange-600 hover:bg-orange-700" : "bg-blue-600 hover:bg-blue-700"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          
          <Button variant="outline" size="sm" onClick={nextSlide}>
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Slide Indicators */}
        <div className="flex items-center space-x-2 mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide
                  ? 'bg-blue-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Slide Titles */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                index === currentSlide
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {slide.title}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
        <Sparkles className="w-5 h-5 text-blue-600" />
      </div>
      <div className="absolute bottom-4 left-4 bg-white rounded-full p-2 shadow-lg">
        <Brain className="w-5 h-5 text-purple-600" />
      </div>
    </div>
  );
}