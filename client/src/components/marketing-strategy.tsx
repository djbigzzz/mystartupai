import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Users, 
  Megaphone,
  TrendingUp,
  Brain,
  Zap,
  Eye,
  Search,
  Share2,
  Mail,
  MessageSquare,
  BarChart3,
  Globe,
  Smartphone,
  Video,
  Edit,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  ArrowRight,
  Star,
  Heart,
  ThumbsUp
} from "lucide-react";

interface MarketingStrategyProps {
  companyData: any;
}

export default function MarketingStrategy({ companyData }: MarketingStrategyProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isGenerating, setIsGenerating] = useState(false);
  const [completionScore, setCompletionScore] = useState(55);

  const marketingModules = [
    {
      id: "customer-personas",
      name: "Customer Personas",
      description: "Detailed buyer personas with demographics, pain points, and behaviors",
      icon: Users,
      completion: 80,
      estimatedTime: "30 min",
      aiFeatures: ["Persona Builder", "Interview Questions", "Empathy Mapping", "Journey Mapping"]
    },
    {
      id: "positioning-messaging",
      name: "Positioning & Messaging",
      description: "Brand positioning, value proposition, and core messaging framework",
      icon: Megaphone,
      completion: 70,
      estimatedTime: "25 min",
      aiFeatures: ["Message Testing", "Competitor Analysis", "Voice & Tone", "Tagline Generator"]
    },
    {
      id: "channel-strategy",
      name: "Channel Strategy",
      description: "Marketing channel selection, optimization, and attribution modeling",
      icon: Target,
      completion: 60,
      estimatedTime: "35 min",
      aiFeatures: ["Channel Finder", "Attribution Model", "Budget Optimizer", "Performance Tracker"]
    },
    {
      id: "content-strategy",
      name: "Content Strategy",
      description: "Content calendar, SEO strategy, and content production framework",
      icon: Edit,
      completion: 40,
      estimatedTime: "40 min",
      aiFeatures: ["Content Calendar", "SEO Optimizer", "Topic Clusters", "Content AI"]
    },
    {
      id: "acquisition-funnel",
      name: "Acquisition Funnel",
      description: "Customer acquisition process, conversion optimization, and growth loops",
      icon: TrendingUp,
      completion: 50,
      estimatedTime: "30 min",
      aiFeatures: ["Funnel Designer", "Conversion Optimizer", "A/B Test Planner", "Growth Loops"]
    },
    {
      id: "performance-analytics",
      name: "Performance Analytics",
      description: "Marketing metrics, ROI tracking, and performance optimization",
      icon: BarChart3,
      completion: 30,
      estimatedTime: "25 min",
      aiFeatures: ["Analytics Setup", "ROI Calculator", "Dashboard Builder", "Alert System"]
    }
  ];

  const marketingChannels = [
    {
      name: "Content Marketing",
      description: "Blog, guides, and educational content",
      cost: "Low",
      difficulty: "Medium",
      timeToResults: "3-6 months",
      bestFor: "B2B, Education, SaaS",
      roi: "High",
      status: "recommended"
    },
    {
      name: "Social Media Marketing",
      description: "Organic and paid social media campaigns",
      cost: "Medium",
      difficulty: "Medium",
      timeToResults: "1-3 months",
      bestFor: "B2C, Visual products",
      roi: "Medium",
      status: "recommended"
    },
    {
      name: "Search Engine Marketing",
      description: "Google Ads, SEO, and search optimization",
      cost: "High",
      difficulty: "High",
      timeToResults: "1-2 months",
      bestFor: "High-intent products",
      roi: "High",
      status: "recommended"
    },
    {
      name: "Email Marketing",
      description: "Newsletter, drip campaigns, and automation",
      cost: "Low",
      difficulty: "Low",
      timeToResults: "1 month",
      bestFor: "All businesses",
      roi: "Very High",
      status: "recommended"
    },
    {
      name: "Influencer Marketing",
      description: "Partnerships with industry influencers",
      cost: "Medium",
      difficulty: "Medium",
      timeToResults: "2-4 months",
      bestFor: "B2C, Lifestyle",
      roi: "Medium",
      status: "consider"
    },
    {
      name: "PR & Media",
      description: "Press coverage and media relations",
      cost: "Medium",
      difficulty: "High",
      timeToResults: "3-6 months",
      bestFor: "B2B, Tech",
      roi: "Medium",
      status: "consider"
    }
  ];

  const marketingMetrics = [
    {
      name: "Customer Acquisition Cost",
      value: "$85",
      change: "-12%",
      trend: "down",
      benchmark: "$75",
      status: "good"
    },
    {
      name: "Conversion Rate",
      value: "3.2%",
      change: "+0.8%",
      trend: "up",
      benchmark: "2.5%",
      status: "excellent"
    },
    {
      name: "Marketing Qualified Leads",
      value: "245",
      change: "+23%",
      trend: "up",
      benchmark: "200",
      status: "excellent"
    },
    {
      name: "Return on Ad Spend",
      value: "4.2x",
      change: "+0.5x",
      trend: "up",
      benchmark: "3.0x",
      status: "excellent"
    },
    {
      name: "Organic Traffic",
      value: "12,450",
      change: "+35%",
      trend: "up",
      benchmark: "10,000",
      status: "good"
    },
    {
      name: "Email Open Rate",
      value: "24.5%",
      change: "+2.1%",
      trend: "up",
      benchmark: "22%",
      status: "good"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600";
      case "good": return "text-blue-600";
      case "average": return "text-yellow-600";
      case "poor": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? "↗️" : "↘️";
  };

  const getChannelStatusColor = (status: string) => {
    switch (status) {
      case "recommended": return "bg-green-100 text-green-800";
      case "consider": return "bg-yellow-100 text-yellow-800";
      case "avoid": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Marketing Strategy</h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Build a data-driven marketing strategy with AI-powered customer insights, channel optimization, 
          and performance tracking. Create sustainable growth through targeted acquisition and retention.
        </p>
      </div>

      {/* Marketing Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {marketingMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-slate-600 truncate">{metric.name}</h3>
                <span className="text-xs">{getTrendIcon(metric.trend)}</span>
              </div>
              <div className={`text-lg font-bold ${getStatusColor(metric.status)} mb-1`}>
                {metric.value}
              </div>
              <div className={`text-xs ${metric.trend === "up" ? "text-green-600" : "text-red-600"} mb-1`}>
                {metric.change}
              </div>
              <div className="text-xs text-slate-500">vs {metric.benchmark}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Marketing Overview</TabsTrigger>
          <TabsTrigger value="modules">AI Modules</TabsTrigger>
          <TabsTrigger value="channels">Channel Strategy</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Planner</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Marketing Health Score */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Marketing Performance Score</CardTitle>
                  <CardDescription>AI assessment of your marketing effectiveness</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">7.8/10</div>
                  <p className="text-sm text-slate-500">Strong Performance</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-slate-900 mb-1">Targeting</h3>
                  <p className="text-lg font-bold text-blue-600">8.5/10</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-slate-900 mb-1">Conversion</h3>
                  <p className="text-lg font-bold text-green-600">7.2/10</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-slate-900 mb-1">ROI</h3>
                  <p className="text-lg font-bold text-purple-600">8.1/10</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-medium text-slate-900 mb-1">Analytics</h3>
                  <p className="text-lg font-bold text-orange-600">7.4/10</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Journey Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Customer Journey Overview
              </CardTitle>
              <CardDescription>
                AI-mapped customer touchpoints and conversion funnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { stage: "Awareness", conversion: "12%", channels: ["SEO", "Social"], color: "blue" },
                  { stage: "Interest", conversion: "25%", channels: ["Content", "Email"], color: "green" },
                  { stage: "Consideration", conversion: "40%", channels: ["Demo", "Case Studies"], color: "yellow" },
                  { stage: "Purchase", conversion: "3.2%", channels: ["Sales", "Trial"], color: "purple" },
                  { stage: "Retention", conversion: "85%", channels: ["Support", "Upsell"], color: "pink" }
                ].map((stage, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 bg-${stage.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <span className="text-2xl font-bold text-slate-700">{index + 1}</span>
                    </div>
                    <h3 className="font-medium text-slate-900 mb-1">{stage.stage}</h3>
                    <p className="text-lg font-bold text-slate-700 mb-2">{stage.conversion}</p>
                    <div className="space-y-1">
                      {stage.channels.map((channel, i) => (
                        <Badge key={i} variant="secondary" className="text-xs block">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-600" />
                Top Performing Content
              </CardTitle>
              <CardDescription>
                Your highest converting marketing assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: "Ultimate Guide to SaaS Metrics", type: "Blog Post", views: "12.5K", conversions: "245", rate: "1.96%" },
                  { title: "Product Demo Video", type: "Video", views: "8.2K", conversions: "164", rate: "2.00%" },
                  { title: "Free ROI Calculator", type: "Lead Magnet", views: "6.1K", conversions: "198", rate: "3.25%" },
                  { title: "Customer Success Webinar", type: "Webinar", views: "3.4K", conversions: "89", rate: "2.62%" }
                ].map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{content.title}</h4>
                      <p className="text-sm text-slate-600">{content.type}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <p className="font-medium text-slate-700">{content.views}</p>
                        <p className="text-slate-500">Views</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">{content.conversions}</p>
                        <p className="text-slate-500">Conversions</p>
                      </div>
                      <div>
                        <p className="font-medium text-green-600">{content.rate}</p>
                        <p className="text-slate-500">Rate</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {marketingModules.map((module) => {
              const IconComponent = module.icon;
              
              return (
                <Card key={module.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <IconComponent className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{module.name}</CardTitle>
                          <CardDescription className="mt-1">{module.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-600">{module.completion}%</div>
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
                      onClick={() => setIsGenerating(true)}
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

        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Channel Analysis</CardTitle>
              <CardDescription>
                AI-recommended marketing channels based on your business model and target audience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketingChannels.map((channel, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-slate-900 mb-1">{channel.name}</h3>
                        <p className="text-sm text-slate-600">{channel.description}</p>
                      </div>
                      <Badge className={getChannelStatusColor(channel.status)}>
                        {channel.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-slate-700">Cost</p>
                        <p className="text-slate-600">{channel.cost}</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">Difficulty</p>
                        <p className="text-slate-600">{channel.difficulty}</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">Time to Results</p>
                        <p className="text-slate-600">{channel.timeToResults}</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">Best For</p>
                        <p className="text-slate-600">{channel.bestFor}</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">ROI Potential</p>
                        <p className="text-slate-600">{channel.roi}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Campaign Planner</CardTitle>
              <CardDescription>
                Generate complete marketing campaigns with targeting, content, and optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-lg p-8 text-center">
                <Megaphone className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Campaign Generator</h3>
                <p className="text-slate-600 mb-6">
                  AI will create complete marketing campaigns including audience targeting, content strategy, 
                  budget allocation, and performance tracking for maximum ROI.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium text-slate-900">Audience Targeting</h4>
                    <p className="text-sm text-slate-600">AI-optimized audience segments</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <Edit className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium text-slate-900">Content Creation</h4>
                    <p className="text-sm text-slate-600">Automated content and copy</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-medium text-slate-900">Performance Tracking</h4>
                    <p className="text-sm text-slate-600">Real-time optimization</p>
                  </div>
                </div>
                <Button size="lg" className="bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700">
                  <Brain className="w-5 h-5 mr-2" />
                  Generate Marketing Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}