import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb,
  Target,
  DollarSign,
  Users,
  Zap,
  ArrowRight
} from "lucide-react";

interface AIInsightsPanelProps {
  ideaData: any;
}

export default function AIInsightsPanel({ ideaData }: AIInsightsPanelProps) {
  const [activeInsight, setActiveInsight] = useState(0);
  const [processingInsights, setProcessingInsights] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setProcessingInsights(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveInsight(prev => (prev + 1) % insights.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const insights = [
    {
      type: "opportunity",
      icon: TrendingUp,
      title: "Market Timing Analysis",
      content: "Water scarcity concerns driving 23% annual growth in smart water management solutions. Optimal market entry window identified.",
      confidence: 94,
      impact: "High",
      color: "emerald"
    },
    {
      type: "risk",
      icon: AlertTriangle,
      title: "Competition Assessment",
      content: "Three established competitors identified. Differentiation through AI-powered predictive analytics creates defensible moat.",
      confidence: 87,
      impact: "Medium",
      color: "amber"
    },
    {
      type: "validation",
      icon: CheckCircle,
      title: "Technology Feasibility",
      content: "Core technology stack validated. IoT sensor integration and machine learning algorithms proven in similar applications.",
      confidence: 92,
      impact: "High",
      color: "blue"
    },
    {
      type: "innovation",
      icon: Lightbulb,
      title: "Unique Value Proposition",
      content: "Real-time leak detection with 96% accuracy creates immediate ROI for customers. Patent opportunity identified.",
      confidence: 89,
      impact: "Very High",
      color: "purple"
    }
  ];

  const currentInsight = insights[activeInsight];

  const strategicRecommendations = [
    {
      priority: "Critical",
      action: "Secure strategic partnership with major IoT sensor manufacturer",
      timeline: "0-3 months",
      impact: "Market entry acceleration"
    },
    {
      priority: "High",
      action: "File provisional patent for AI leak detection algorithm",
      timeline: "1-2 months", 
      impact: "Competitive protection"
    },
    {
      priority: "Medium",
      action: "Develop pilot program with 3-5 municipal water departments",
      timeline: "3-6 months",
      impact: "Market validation"
    }
  ];

  return (
    <div className="space-y-6">
      {/* AI Processing Status */}
      {processingInsights && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-blue-900">AI Analysis in Progress</p>
                <p className="text-sm text-blue-700">Processing market data, competitive intelligence, and feasibility metrics...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dynamic Insights Display */}
      <Card className="overflow-hidden">
        <CardHeader className={`bg-gradient-to-r from-${currentInsight.color}-500 to-${currentInsight.color}-600 text-white`}>
          <CardTitle className="flex items-center">
            <currentInsight.icon className="w-5 h-5 mr-2" />
            AI Strategic Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 mb-2">{currentInsight.title}</h4>
                <p className="text-slate-700 leading-relaxed">{currentInsight.content}</p>
              </div>
              <div className="ml-4 text-right">
                <Badge className={`bg-${currentInsight.color}-100 text-${currentInsight.color}-800`}>
                  {currentInsight.confidence}% confidence
                </Badge>
                <div className="text-sm text-slate-500 mt-1">{currentInsight.impact} Impact</div>
              </div>
            </div>

            {/* Insight Navigation */}
            <div className="flex items-center justify-center space-x-2 pt-4">
              {insights.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveInsight(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeInsight 
                      ? `bg-${currentInsight.color}-500` 
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-600" />
            Strategic Action Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {strategicRecommendations.map((rec, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge 
                      variant={rec.priority === 'Critical' ? 'destructive' : rec.priority === 'High' ? 'default' : 'secondary'}
                    >
                      {rec.priority}
                    </Badge>
                    <span className="text-sm text-slate-600">{rec.timeline}</span>
                  </div>
                  <h5 className="font-medium text-slate-900 mb-1">{rec.action}</h5>
                  <p className="text-sm text-slate-600">{rec.impact}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Market Intelligence */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Revenue Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Municipal Contracts</span>
                <span className="font-bold text-green-600">$180K ARR avg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Enterprise Licenses</span>
                <span className="font-bold text-green-600">$45K ARR avg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">IoT Hardware Revenue</span>
                <span className="font-bold text-green-600">$12K one-time</span>
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>AI Insight:</strong> Bundling strategy could increase contract values by 34%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Customer Segments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Water Utilities</span>
                <span className="font-bold text-blue-600">847 prospects</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Manufacturing</span>
                <span className="font-bold text-blue-600">1,240 prospects</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Agriculture</span>
                <span className="font-bold text-blue-600">2,100 prospects</span>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>AI Insight:</strong> Agriculture segment shows highest growth potential (+67% YoY)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}