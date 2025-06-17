import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Users, 
  TrendingUp, 
  Brain,
  Zap,
  Eye,
  Shield,
  Award,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Search,
  BarChart3,
  DollarSign,
  Globe,
  Download,
  Share2,
  Layers
} from "lucide-react";

interface BusinessStrategyProps {
  companyData: any;
}

export default function BusinessStrategy({ companyData }: BusinessStrategyProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isGenerating, setIsGenerating] = useState(false);
  const [completionScore, setCompletionScore] = useState(45);

  const strategyModules = [
    {
      id: "value-prop",
      name: "Value Proposition Canvas",
      description: "Define what makes you unique and why customers will choose you",
      icon: Target,
      completion: 80,
      estimatedTime: "15 min",
      aiFeatures: ["Customer Job Analysis", "Pain Point Mapping", "Gain Creator AI"]
    },
    {
      id: "customer-discovery",
      name: "Customer Discovery",
      description: "Identify and validate your ideal customer personas",
      icon: Users,
      completion: 60,
      estimatedTime: "20 min",
      aiFeatures: ["Persona Builder", "Interview Questions", "Validation Framework"]
    },
    {
      id: "market-analysis",
      name: "Market Analysis",
      description: "Comprehensive market sizing and competitive landscape analysis",
      icon: BarChart3,
      completion: 70,
      estimatedTime: "25 min",
      aiFeatures: ["TAM/SAM/SOM Calculator", "Competitor Intelligence", "Market Trends"]
    },
    {
      id: "business-model",
      name: "Business Model Design",
      description: "Revenue streams, cost structure, and scalability planning",
      icon: DollarSign,
      completion: 40,
      estimatedTime: "30 min",
      aiFeatures: ["Revenue Model Generator", "Unit Economics", "Pricing Strategy"]
    },
    {
      id: "competitive-strategy",
      name: "Competitive Strategy",
      description: "Positioning, differentiation, and competitive advantages",
      icon: Shield,
      completion: 30,
      estimatedTime: "20 min",
      aiFeatures: ["SWOT Analysis", "Porter's 5 Forces", "Blue Ocean Strategy"]
    },
    {
      id: "go-to-market",
      name: "Go-to-Market Strategy",
      description: "Launch strategy, channels, and customer acquisition plan",
      icon: Zap,
      completion: 20,
      estimatedTime: "35 min",
      aiFeatures: ["Channel Strategy", "Launch Timeline", "Acquisition Funnel"]
    }
  ];

  const aiInsights = [
    {
      title: "Market Opportunity Score",
      value: "8.7/10",
      trend: "+15%",
      description: "Strong market demand with growing trends",
      color: "text-green-600"
    },
    {
      title: "Competitive Intensity",
      value: "Medium",
      trend: "Stable",
      description: "Manageable competition with differentiation opportunities",
      color: "text-yellow-600"
    },
    {
      title: "Revenue Potential",
      value: "$2.4M",
      trend: "+23%",
      description: "Projected ARR based on market analysis",
      color: "text-blue-600"
    },
    {
      title: "Strategic Fit",
      value: "Strong",
      trend: "+5%",
      description: "Business model aligns well with market needs",
      color: "text-purple-600"
    }
  ];

  const ycFrameworks = [
    {
      name: "Jobs-to-be-Done Framework",
      description: "Understand what job customers are hiring your product to do",
      status: "available",
      difficulty: "beginner"
    },
    {
      name: "Problem-Solution Fit",
      description: "Validate that you're solving a real, painful problem",
      status: "in-progress",
      difficulty: "beginner"
    },
    {
      name: "Product-Market Fit Canvas",
      description: "Measure and optimize for product-market fit signals",
      status: "available",
      difficulty: "intermediate"
    },
    {
      name: "Lean Canvas",
      description: "One-page business model focusing on key assumptions",
      status: "completed",
      difficulty: "beginner"
    },
    {
      name: "Traction Roadmap",
      description: "Build systematic approach to gaining early traction",
      status: "available",
      difficulty: "intermediate"
    },
    {
      name: "Founder-Market Fit",
      description: "Assess founder-market fit and identify potential gaps",
      status: "pending",
      difficulty: "advanced"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "available": return "bg-yellow-100 text-yellow-800";
      case "pending": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-green-600";
      case "intermediate": return "text-yellow-600";
      case "advanced": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const handleAIGeneration = async (moduleId: string) => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 4000));
    setIsGenerating(false);
    setCompletionScore(prev => Math.min(100, prev + 15));
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Business Strategy</h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Build a winning strategy using Y Combinator's proven frameworks. Define your value proposition, 
          understand your market, and create a sustainable competitive advantage.
        </p>
      </div>

      {/* AI Insights Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {aiInsights.map((insight, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-600">{insight.title}</h3>
                <span className={`text-xs ${insight.color}`}>{insight.trend}</span>
              </div>
              <div className={`text-2xl font-bold ${insight.color} mb-1`}>
                {insight.value}
              </div>
              <p className="text-xs text-slate-500">{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Strategy Overview</TabsTrigger>
          <TabsTrigger value="modules">AI Modules</TabsTrigger>
          <TabsTrigger value="frameworks">YC Frameworks</TabsTrigger>
          <TabsTrigger value="canvas">Strategy Canvas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Strategy Development Progress</CardTitle>
                  <CardDescription>Complete all modules to finalize your business strategy</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{completionScore}%</div>
                  <Progress value={completionScore} className="w-32 mt-2" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {strategyModules.slice(0, 3).map((module) => {
                  const IconComponent = module.icon;
                  return (
                    <div key={module.id} className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-medium text-slate-900 mb-1">{module.name}</h3>
                      <div className="text-lg font-bold text-slate-700 mb-1">{module.completion}%</div>
                      <Progress value={module.completion} className="w-full" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Key Strategic Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                Key Strategic Questions
              </CardTitle>
              <CardDescription>
                Y Combinator's essential questions every startup must answer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "What problem are you solving and how painful is it?",
                  "Who is your ideal customer and how do you reach them?",
                  "What makes you 10x better than existing solutions?",
                  "How will you make money and achieve profitability?",
                  "What's your unfair advantage or moat?",
                  "How big is the market opportunity?"
                ].map((question, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{question}</p>
                      <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">
                        Answer with AI →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strategyModules.map((module) => {
              const IconComponent = module.icon;
              
              return (
                <Card key={module.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{module.name}</CardTitle>
                          <CardDescription className="mt-1">{module.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{module.completion}%</div>
                        <Progress value={module.completion} className="w-16 mt-1" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>⏱️ {module.estimatedTime}</span>
                      <Badge variant="secondary">{module.aiFeatures.length} AI Tools</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-slate-700">AI Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {module.aiFeatures.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => handleAIGeneration(module.id)}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Brain className="w-4 h-4 mr-2 animate-pulse" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Start Module
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="frameworks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Y Combinator Strategic Frameworks</CardTitle>
              <CardDescription>
                Proven methodologies used by successful YC startups to build winning strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ycFrameworks.map((framework, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-medium text-slate-900">{framework.name}</h3>
                        <Badge className={getStatusColor(framework.status)}>
                          {framework.status}
                        </Badge>
                        <span className={`text-xs font-medium ${getDifficultyColor(framework.difficulty)}`}>
                          {framework.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{framework.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="canvas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Canvas</CardTitle>
              <CardDescription>
                Visualize your complete business strategy on a single canvas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Value Proposition */}
                <div className="md:col-span-1">
                  <div className="bg-blue-50 p-6 rounded-lg h-full">
                    <h3 className="font-bold text-blue-900 mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Value Proposition
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium text-blue-800">Customer Jobs</p>
                        <p className="text-blue-700">What jobs are customers trying to get done?</p>
                      </div>
                      <div>
                        <p className="font-medium text-blue-800">Pain Points</p>
                        <p className="text-blue-700">What frustrates them about current solutions?</p>
                      </div>
                      <div>
                        <p className="font-medium text-blue-800">Gain Creators</p>
                        <p className="text-blue-700">How do you create value and benefits?</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Segments */}
                <div className="md:col-span-1">
                  <div className="bg-green-50 p-6 rounded-lg h-full">
                    <h3 className="font-bold text-green-900 mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Customer Segments
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium text-green-800">Primary Segment</p>
                        <p className="text-green-700">Your most important customer group</p>
                      </div>
                      <div>
                        <p className="font-medium text-green-800">Early Adopters</p>
                        <p className="text-green-700">Who will try your product first?</p>
                      </div>
                      <div>
                        <p className="font-medium text-green-800">Personas</p>
                        <p className="text-green-700">Detailed customer profiles</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Model */}
                <div className="md:col-span-1">
                  <div className="bg-purple-50 p-6 rounded-lg h-full">
                    <h3 className="font-bold text-purple-900 mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Business Model
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium text-purple-800">Revenue Streams</p>
                        <p className="text-purple-700">How will you make money?</p>
                      </div>
                      <div>
                        <p className="font-medium text-purple-800">Cost Structure</p>
                        <p className="text-purple-700">What are your main costs?</p>
                      </div>
                      <div>
                        <p className="font-medium text-purple-800">Unit Economics</p>
                        <p className="text-purple-700">Cost per customer vs. revenue</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Brain className="w-5 h-5 mr-2" />
                  Generate Complete Strategy Canvas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}