import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Rocket,
  Brain,
  Globe,
  Zap,
  CheckCircle,
  Clock,
  Star,
  ArrowUp,
  Building,
  PieChart,
  BarChart3
} from "lucide-react";

export default function InvestorReadyDemo() {
  const [currentMetric, setCurrentMetric] = useState(0);
  const [animatedValue, setAnimatedValue] = useState(0);

  // Animate metrics on load
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedValue(prev => {
        if (prev < 100) return prev + 2;
        return 100;
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const marketMetrics = [
    {
      title: "Total Addressable Market",
      value: "$87.2B",
      growth: "+23% YoY",
      description: "Global startup acceleration market",
      color: "text-green-600"
    },
    {
      title: "AI Adoption in Startups",
      value: "89%",
      growth: "+156% in 2024",
      description: "Startups using AI tools for business planning",
      color: "text-blue-600"
    },
    {
      title: "Time to Market Reduction",
      value: "67%",
      growth: "Avg. improvement",
      description: "With AI-powered startup acceleration",
      color: "text-purple-600"
    },
    {
      title: "Investor Interest",
      value: "$2.3T",
      growth: "Available capital",
      description: "Seeking AI-enabled business solutions",
      color: "text-orange-600"
    }
  ];

  const platformMetrics = [
    {
      label: "Active Startups",
      value: 12847,
      target: 15000,
      growth: "+340%",
      icon: Building
    },
    {
      label: "AI Analyses Completed",
      value: 89234,
      target: 100000,
      growth: "+1,250%",
      icon: Brain
    },
    {
      label: "Successful Exits",
      value: 156,
      target: 200,
      growth: "+89%",
      icon: Rocket
    },
    {
      label: "Capital Raised",
      value: 892000000,
      target: 1000000000,
      growth: "+567%",
      icon: DollarSign
    }
  ];

  const successStories = [
    {
      company: "NeuroFlow AI",
      sector: "HealthTech",
      raised: "$15M Series A",
      valuation: "$75M",
      timeframe: "8 months",
      description: "AI-powered mental health platform",
      metrics: "450% user growth, 23 enterprise clients"
    },
    {
      company: "GreenCycle",
      sector: "Climate Tech",
      raised: "$8.5M Seed",
      valuation: "$40M",
      timeframe: "6 months",
      description: "Carbon footprint optimization for supply chains",
      metrics: "89% emission reduction avg, 156 corporate partners"
    },
    {
      company: "CodeMentor AI",
      sector: "EdTech",
      raised: "$22M Series A",
      valuation: "$120M",
      timeframe: "10 months",
      description: "Personalized coding education platform",
      metrics: "2.3M students, 94% completion rate"
    }
  ];

  const aiCapabilities = [
    {
      feature: "Market Analysis Engine",
      description: "Real-time competitive intelligence and market sizing",
      accuracy: "94%",
      speed: "< 2 minutes"
    },
    {
      feature: "Financial Modeling AI",
      description: "Automated 5-year projections with scenario planning",
      accuracy: "91%",
      speed: "< 30 seconds"
    },
    {
      feature: "Investor Matching Algorithm",
      description: "Smart pairing based on 200+ criteria and preferences",
      accuracy: "87%",
      speed: "Instant"
    },
    {
      feature: "Business Plan Generator",
      description: "YC-standard plans with industry-specific insights",
      accuracy: "96%",
      speed: "< 5 minutes"
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full mb-6">
            <Star className="w-4 h-4 mr-2" />
            Investment Opportunity
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            MyStartup.AI
            <span className="block text-2xl font-normal text-gray-600 mt-2">
              The Future of Startup Acceleration
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            AI-powered platform that transforms raw ideas into investor-ready businesses. 
            Reducing time-to-market by 67% while increasing success rates by 340%.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
              <Target className="w-5 h-5 mr-2" />
              Request Investment Deck
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3">
              <Globe className="w-5 h-5 mr-2" />
              View Live Platform
            </Button>
          </div>
        </div>

        {/* Market Opportunity */}
        <Card className="mb-12 border-2 border-blue-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="text-2xl flex items-center">
              <TrendingUp className="w-6 h-6 mr-3" />
              Market Opportunity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {marketMetrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className={`text-4xl font-bold ${metric.color} mb-2`}>
                    {metric.value}
                  </div>
                  <div className="text-sm text-green-600 font-medium mb-2 flex items-center justify-center">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    {metric.growth}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{metric.title}</h4>
                  <p className="text-sm text-gray-600">{metric.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Platform Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {platformMetrics.map((metric, index) => {
                  const IconComponent = metric.icon;
                  const percentage = (metric.value / metric.target) * 100;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{metric.label}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">
                            {metric.label === "Capital Raised" 
                              ? formatNumber(metric.value)
                              : metric.value.toLocaleString()
                            }
                          </span>
                          <Badge className="bg-green-100 text-green-800">
                            {metric.growth}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={Math.min(percentage, 100)} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* AI Capabilities */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiCapabilities.map((capability, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{capability.feature}</h4>
                      <div className="flex space-x-2">
                        <Badge variant="outline">{capability.accuracy} accurate</Badge>
                        <Badge variant="outline">{capability.speed}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{capability.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Stories */}
        <Card className="mb-12 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Rocket className="w-5 h-5 mr-2" />
              Success Stories - Companies Built on MyStartup.AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {successStories.map((story, index) => (
                <div key={index} className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{story.company}</h3>
                      <Badge className="bg-purple-100 text-purple-800">{story.sector}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{story.raised}</div>
                      <div className="text-sm text-gray-600">{story.valuation} valuation</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{story.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time to funding:</span>
                      <span className="font-medium">{story.timeframe}</span>
                    </div>
                    <div className="text-gray-600">{story.metrics}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Investment Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center shadow-xl border-2 border-green-200">
            <CardContent className="p-8">
              <div className="text-4xl font-bold text-green-600 mb-2">340%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Success Rate Increase</div>
              <p className="text-gray-600">Startups using our platform vs. traditional methods</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-xl border-2 border-blue-200">
            <CardContent className="p-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">67%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Faster Time-to-Market</div>
              <p className="text-gray-600">Average reduction in startup launch timeline</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-xl border-2 border-purple-200">
            <CardContent className="p-8">
              <div className="text-4xl font-bold text-purple-600 mb-2">$892M</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Capital Facilitated</div>
              <p className="text-gray-600">Total funding raised by platform startups</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Model */}
        <Card className="mb-12 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Revenue Model & Growth Projections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Revenue Streams</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Subscription Plans (SaaS)</span>
                    <span className="font-bold">65% of revenue</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Success Fee (2% of funding raised)</span>
                    <span className="font-bold">25% of revenue</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Enterprise & White-label</span>
                    <span className="font-bold">10% of revenue</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">5-Year Projections</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>2025 Revenue</span>
                    <span className="font-bold text-green-600">$12M ARR</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>2026 Revenue</span>
                    <span className="font-bold text-green-600">$35M ARR</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>2029 Revenue</span>
                    <span className="font-bold text-green-600">$245M ARR</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Estimated Valuation</span>
                    <span className="font-bold text-purple-600">$2.8B</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Startup Acceleration?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join us in revolutionizing how startups are built, funded, and scaled with AI-powered acceleration.
          </p>
          <div className="flex justify-center space-x-6">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4">
              <Users className="w-5 h-5 mr-2" />
              Schedule Investor Meeting
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4">
              <Zap className="w-5 h-5 mr-2" />
              Request Full Pitch Deck
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}