import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Calculator,
  PieChart,
  Brain,
  Zap,
  Target,
  BarChart3,
  CreditCard,
  Wallet,
  Receipt,
  Building,
  Users,
  Clock,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  AlertTriangle,
  Download,
  Share2
} from "lucide-react";

interface FinancialPlanningProps {
  companyData: any;
}

export default function FinancialPlanning({ companyData }: FinancialPlanningProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isGenerating, setIsGenerating] = useState(false);
  const [completionScore, setCompletionScore] = useState(40);

  const financialModules = [
    {
      id: "unit-economics",
      name: "Unit Economics",
      description: "Customer acquisition cost, lifetime value, and profitability per unit",
      icon: Calculator,
      completion: 70,
      estimatedTime: "25 min",
      aiFeatures: ["CAC Calculator", "LTV Modeling", "Payback Period", "Cohort Analysis"]
    },
    {
      id: "revenue-model",
      name: "Revenue Model",
      description: "Revenue streams, pricing strategy, and monetization framework",
      icon: DollarSign,
      completion: 60,
      estimatedTime: "30 min",
      aiFeatures: ["Pricing Optimizer", "Revenue Streams", "Monetization AI", "Value-Based Pricing"]
    },
    {
      id: "financial-projections",
      name: "Financial Projections",
      description: "3-year P&L, cash flow, and scenario planning with sensitivity analysis",
      icon: TrendingUp,
      completion: 50,
      estimatedTime: "40 min",
      aiFeatures: ["P&L Generator", "Cash Flow Model", "Scenario Planner", "Sensitivity Analysis"]
    },
    {
      id: "fundraising-model",
      name: "Fundraising Strategy",
      description: "Funding requirements, investor targets, and valuation modeling",
      icon: Building,
      completion: 30,
      estimatedTime: "35 min",
      aiFeatures: ["Funding Calculator", "Valuation Model", "Investor Matching", "Term Sheet AI"]
    },
    {
      id: "burn-rate",
      name: "Burn Rate & Runway",
      description: "Monthly burn analysis, runway calculation, and milestone planning",
      icon: Clock,
      completion: 40,
      estimatedTime: "20 min",
      aiFeatures: ["Burn Calculator", "Runway Planner", "Milestone Budgets", "Cost Optimization"]
    },
    {
      id: "kpi-dashboard",
      name: "Financial KPIs",
      description: "Key metrics tracking, financial health indicators, and reporting",
      icon: BarChart3,
      completion: 20,
      estimatedTime: "25 min",
      aiFeatures: ["KPI Tracker", "Health Score", "Benchmark Analysis", "Alert System"]
    }
  ];

  const keyMetrics = [
    {
      name: "Monthly Recurring Revenue",
      value: "$12,500",
      change: "+23%",
      trend: "up",
      target: "$15,000"
    },
    {
      name: "Customer Acquisition Cost",
      value: "$85",
      change: "-12%",
      trend: "down",
      target: "$75"
    },
    {
      name: "Lifetime Value",
      value: "$450",
      change: "+8%",
      trend: "up",
      target: "$500"
    },
    {
      name: "Burn Rate",
      value: "$8,200",
      change: "-5%",
      trend: "down",
      target: "$7,500"
    },
    {
      name: "Runway",
      value: "14 months",
      change: "+2 months",
      trend: "up",
      target: "18 months"
    },
    {
      name: "Gross Margin",
      value: "78%",
      change: "+3%",
      trend: "up",
      target: "80%"
    }
  ];

  const financialFrameworks = [
    {
      name: "SaaS Metrics Framework",
      description: "Essential metrics for subscription-based businesses",
      category: "SaaS",
      difficulty: "Intermediate",
      tools: ["MRR Tracking", "Churn Analysis", "ARPU Calculator", "LTV:CAC Ratio"]
    },
    {
      name: "Venture Capital Modeling",
      description: "Financial models that VCs expect to see",
      category: "Fundraising",
      difficulty: "Advanced", 
      tools: ["3-Statement Model", "DCF Analysis", "Comparable Analysis", "Cap Table"]
    },
    {
      name: "Unit Economics Deep Dive",
      description: "Detailed profitability analysis per customer segment",
      category: "Analytics",
      difficulty: "Intermediate",
      tools: ["Contribution Margin", "Payback Period", "Cohort LTV", "Channel Economics"]
    },
    {
      name: "Cash Flow Management",
      description: "Working capital optimization and cash forecasting",
      category: "Operations",
      difficulty: "Beginner",
      tools: ["13-Week Cash Flow", "Accounts Receivable", "Payment Terms", "Seasonal Planning"]
    },
    {
      name: "Pricing Strategy Framework",
      description: "Value-based pricing and elasticity analysis",
      category: "Strategy",
      difficulty: "Intermediate",
      tools: ["Price Testing", "Willingness to Pay", "Competitor Analysis", "Bundle Pricing"]
    }
  ];

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? <ArrowUp className="w-4 h-4 text-green-600" /> : <ArrowDown className="w-4 h-4 text-red-600" />;
  };

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Financial Planning</h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Build comprehensive financial models with AI-powered tools. From unit economics to fundraising strategy, 
          create investor-grade financials that demonstrate your startup's potential and sustainability.
        </p>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-slate-600 truncate">{metric.name}</h3>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="text-lg font-bold text-slate-900 mb-1">
                {metric.value}
              </div>
              <div className={`text-xs ${getTrendColor(metric.trend)} mb-1`}>
                {metric.change}
              </div>
              <div className="text-xs text-slate-500">Target: {metric.target}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Financial Overview</TabsTrigger>
          <TabsTrigger value="modules">AI Modules</TabsTrigger>
          <TabsTrigger value="frameworks">Financial Models</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Financial Health Score */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Financial Health Score</CardTitle>
                  <CardDescription>AI assessment of your startup's financial position</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">8.2/10</div>
                  <p className="text-sm text-slate-500">Strong Position</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-medium text-slate-900 mb-1">Growth Rate</h3>
                  <p className="text-2xl font-bold text-green-600">23%</p>
                  <p className="text-sm text-slate-500">MoM Revenue Growth</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calculator className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-slate-900 mb-1">Unit Economics</h3>
                  <p className="text-2xl font-bold text-blue-600">5.3x</p>
                  <p className="text-sm text-slate-500">LTV:CAC Ratio</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-slate-900 mb-1">Runway</h3>
                  <p className="text-2xl font-bold text-purple-600">14mo</p>
                  <p className="text-sm text-slate-500">Current Burn Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Financial Milestones
              </CardTitle>
              <CardDescription>
                Key financial targets and achievement timeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { milestone: "Break-even", target: "$25K MRR", timeline: "Q3 2024", status: "on-track" },
                  { milestone: "Product-Market Fit", target: "5:1 LTV:CAC", timeline: "Q2 2024", status: "achieved" },
                  { milestone: "Series A Ready", target: "$100K MRR", timeline: "Q1 2025", status: "planned" },
                  { milestone: "Profitability", target: "20% Net Margin", timeline: "Q4 2024", status: "on-track" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {item.status === "achieved" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : item.status === "on-track" ? (
                        <Clock className="w-5 h-5 text-blue-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{item.milestone}</p>
                        <p className="text-sm text-slate-600">{item.target}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-700">{item.timeline}</p>
                      <Badge className={
                        item.status === "achieved" ? "bg-green-100 text-green-800" :
                        item.status === "on-track" ? "bg-blue-100 text-blue-800" :
                        "bg-yellow-100 text-yellow-800"
                      }>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Update P&L", icon: Receipt, color: "blue" },
              { name: "Cash Flow", icon: Wallet, color: "green" },
              { name: "Burn Analysis", icon: Clock, color: "red" },
              { name: "Investor Report", icon: Share2, color: "purple" }
            ].map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 bg-${action.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <IconComponent className={`w-6 h-6 text-${action.color}-600`} />
                    </div>
                    <h3 className="font-medium text-slate-900">{action.name}</h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {financialModules.map((module) => {
              const IconComponent = module.icon;
              
              return (
                <Card key={module.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <IconComponent className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{module.name}</CardTitle>
                          <CardDescription className="mt-1">{module.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{module.completion}%</div>
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

        <TabsContent value="frameworks" className="space-y-6">
          <div className="space-y-4">
            {financialFrameworks.map((framework, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{framework.name}</CardTitle>
                      <CardDescription className="mt-1">{framework.description}</CardDescription>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary">{framework.category}</Badge>
                        <Badge variant="outline">{framework.difficulty}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-700">Included Tools:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {framework.tools.map((tool, toolIndex) => (
                        <div key={toolIndex} className="flex items-center space-x-2 p-2 bg-slate-50 rounded">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-slate-700">{tool}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4">
                      <Brain className="w-4 h-4 mr-2" />
                      Generate Framework
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="projections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Projections</CardTitle>
              <CardDescription>
                AI-generated 3-year financial forecasts with scenario analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Revenue Projection Chart Placeholder */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 text-center">
                  <TrendingUp className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Revenue Projection</h3>
                  <p className="text-slate-600 mb-4">
                    AI will generate comprehensive financial projections based on your business model
                  </p>
                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">$450K</p>
                      <p className="text-sm text-slate-600">Year 1</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">$1.2M</p>
                      <p className="text-sm text-slate-600">Year 2</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">$2.8M</p>
                      <p className="text-sm text-slate-600">Year 3</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    <Brain className="w-5 h-5 mr-2" />
                    Generate Complete Financial Model
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}