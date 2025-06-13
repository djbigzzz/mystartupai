import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  Zap,
  Globe,
  Award,
  ArrowRight,
  Sparkles,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";

interface PremiumDashboardProps {
  ideaData: {
    ideaTitle: string;
    industry: string;
    description: string;
    analysis?: any;
  };
}

export default function PremiumDashboard({ ideaData }: PremiumDashboardProps) {
  const [processingStage, setProcessingStage] = useState(0);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    marketScore: 0,
    competitionLevel: 0,
    fundingPotential: 0,
    implementationEase: 0
  });

  const stages = [
    "Analyzing market opportunity",
    "Evaluating competition landscape", 
    "Calculating financial projections",
    "Assessing implementation feasibility",
    "Generating investment thesis"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingStage(prev => (prev + 1) % stages.length);
      
      // Simulate real-time metric updates
      setRealTimeMetrics(prev => ({
        marketScore: Math.min(87, prev.marketScore + Math.random() * 3),
        competitionLevel: Math.min(23, prev.competitionLevel + Math.random() * 2),
        fundingPotential: Math.min(94, prev.fundingPotential + Math.random() * 4),
        implementationEase: Math.min(78, prev.implementationEase + Math.random() * 2.5)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const insights = [
    {
      icon: TrendingUp,
      title: "Market Opportunity",
      value: "$2.1B",
      change: "+15.3%",
      description: "Total addressable market with strong growth trajectory",
      color: "emerald"
    },
    {
      icon: Users,
      title: "Target Audience",
      value: "847K",
      change: "+23.7%",
      description: "Qualified prospects in primary market segments",
      color: "blue"
    },
    {
      icon: DollarSign,
      title: "Revenue Potential",
      value: "$12.4M",
      change: "+340%",
      description: "5-year projected annual recurring revenue",
      color: "purple"
    },
    {
      icon: Target,
      title: "Success Probability",
      value: "87%",
      change: "+12%",
      description: "AI-calculated probability of achieving Series A",
      color: "cyan"
    }
  ];

  const competitiveAnalysis = [
    { company: "AquaGuard", strength: 65, weakness: "Limited IoT integration" },
    { company: "FlowTech", strength: 72, weakness: "Higher pricing model" },
    { company: "HydroSense", strength: 58, weakness: "Outdated technology" }
  ];

  return (
    <div className="space-y-6">
      {/* Real-time Processing Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">AI Analysis Engine</h3>
                <p className="text-slate-600 text-sm">Processing {ideaData.ideaTitle}</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 animate-pulse">
              <Activity className="w-3 h-3 mr-1" />
              Live Processing
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-700 text-sm">{stages[processingStage]}</span>
              <span className="text-slate-500 text-xs">Stage {processingStage + 1}/5</span>
            </div>
            <Progress value={((processingStage + 1) / stages.length) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Live Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${insight.color}-100 rounded-lg flex items-center justify-center`}>
                  <insight.icon className={`w-6 h-6 text-${insight.color}-600`} />
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  {insight.change}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-600">{insight.title}</h4>
                <div className="text-2xl font-bold text-slate-900">{insight.value}</div>
                <p className="text-xs text-slate-500">{insight.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analysis Panels */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Market Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Market Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Market Size Score</span>
                <span className="font-bold text-emerald-600">{Math.round(realTimeMetrics.marketScore)}/100</span>
              </div>
              <Progress value={realTimeMetrics.marketScore} className="h-3" />
              
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Growth Potential</span>
                <span className="font-bold text-blue-600">{Math.round(realTimeMetrics.fundingPotential)}/100</span>
              </div>
              <Progress value={realTimeMetrics.fundingPotential} className="h-3" />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-900 mb-2">Key Insights</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Water management market growing 12.3% annually</li>
                <li>• IoT integration creates competitive advantage</li>
                <li>• Strong demand in municipal and enterprise segments</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Competition Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              Competitive Landscape
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {competitiveAnalysis.map((competitor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-900">{competitor.company}</span>
                    <Badge variant="outline">{competitor.strength}% match</Badge>
                  </div>
                  <Progress value={competitor.strength} className="h-2" />
                  <p className="text-xs text-slate-600">Weakness: {competitor.weakness}</p>
                </div>
              ))}
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-semibold text-purple-900 mb-2">Competitive Advantage</h5>
              <p className="text-sm text-purple-800">
                Real-time AI analytics and predictive maintenance capabilities provide significant differentiation from existing solutions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Projections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-green-600" />
            Financial Projections & Funding Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-900 mb-4">Revenue Model</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-green-700">SaaS Subscriptions</span>
                  <span className="font-bold text-green-900">65%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Implementation</span>
                  <span className="font-bold text-green-900">25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Consulting</span>
                  <span className="font-bold text-green-900">10%</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-4">Funding Requirements</h4>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-900">$2.5M</div>
                  <div className="text-blue-700 text-sm">Series A Target</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Product Development</span>
                    <span className="text-blue-900">40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Sales & Marketing</span>
                    <span className="text-blue-900">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Operations</span>
                    <span className="text-blue-900">25%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-4">Growth Metrics</h4>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-900">18 months</div>
                  <div className="text-purple-700 text-sm">Break-even timeline</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-700">Year 3 ARR</span>
                    <span className="text-purple-900">$12.4M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Customer LTV</span>
                    <span className="text-purple-900">$89K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced AI Insights */}
      <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
            AI Strategic Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900">Market Entry Strategy</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-slate-700">Target municipal water departments first (lower competition)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-slate-700">Leverage sustainability mandates for faster adoption</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-slate-700">Partner with IoT hardware vendors for distribution</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900">Investment Thesis</h4>
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-600 mb-1">$50M+</div>
                <div className="text-sm text-slate-600">Potential market capture by Year 5</div>
                <div className="text-xs text-slate-500 mt-2">Based on 2.3% market penetration</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-lg border border-purple-200">
            <div className="flex items-start space-x-3">
              <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h5 className="font-semibold text-purple-900 mb-1">AI Recommendation</h5>
                <p className="text-sm text-purple-800">
                  Focus on regulatory compliance angle - water conservation mandates in 23 states create immediate market demand. 
                  ROI payback period of 8-14 months makes enterprise sales cycle predictable.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3">
              Generate Complete Business Plan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}