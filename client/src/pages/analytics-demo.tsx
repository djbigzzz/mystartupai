import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  BarChart3,
  PieChart,
  AlertCircle,
  Clock
} from "lucide-react";

export default function AnalyticsDemo() {
  const demoMetrics = [
    {
      title: "Total Ideas",
      value: "12",
      change: "+3 this month",
      trend: "up",
      icon: Target
    },
    {
      title: "Validation Score",
      value: "85%",
      change: "+12% from last idea",
      trend: "up", 
      icon: TrendingUp
    },
    {
      title: "Market Size",
      value: "$2.5B",
      change: "Growing 15% annually",
      trend: "up",
      icon: DollarSign
    },
    {
      title: "Competitors",
      value: "24",
      change: "Tracked actively",
      trend: "neutral",
      icon: Users
    }
  ];

  const industryBreakdown = [
    { name: "AI/Tech", count: 5, percentage: 42 },
    { name: "Health", count: 3, percentage: 25 },
    { name: "Finance", count: 2, percentage: 17 },
    { name: "E-commerce", count: 2, percentage: 16 }
  ];

  const recentActivity = [
    { action: "New idea analyzed", time: "2 hours ago", idea: "CryptoCafe" },
    { action: "Business plan generated", time: "1 day ago", idea: "FitAI" },
    { action: "Investor match found", time: "3 days ago", idea: "EduTech" },
    { action: "Market research completed", time: "1 week ago", idea: "GreenDeliver" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
                Analytics Dashboard
                <Badge className="ml-3 bg-orange-50 text-orange-600 border-orange-200">
                  Demo
                </Badge>
              </h1>
              <p className="text-gray-600 mt-2">Track your startup journey with comprehensive analytics</p>
            </div>
            <Button variant="outline" className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              This is a demo
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {demoMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <p className={`text-sm ${
                        metric.trend === 'up' ? 'text-green-600' : 
                        metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.change}
                      </p>
                    </div>
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Industry Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Ideas by Industry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {industryBreakdown.map((industry, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-600 mr-3"></div>
                      <span className="text-sm font-medium">{industry.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{industry.count} ideas</span>
                      <span className="text-sm font-medium">{industry.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.idea}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Notice */}
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-800">Demo Mode</h3>
                <p className="text-sm text-orange-700 mt-1">
                  This analytics dashboard shows sample data. In the full version, you'll see real metrics from your startup ideas, 
                  business plans, and investor interactions. Track progress, identify trends, and make data-driven decisions.
                </p>
                <Button variant="outline" size="sm" className="mt-3 border-orange-300 text-orange-700 hover:bg-orange-100">
                  Learn about Analytics Features
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}