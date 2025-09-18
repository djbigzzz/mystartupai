import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  Eye, 
  Edit,
  AlertCircle,
  Clock,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle
} from "lucide-react";

export default function BusinessPlansDemo() {
  const demoPlan = {
    title: "EcoTracker - Sustainability Platform",
    status: "Complete",
    progress: 100,
    lastUpdated: "2 hours ago",
    sections: [
      { name: "Executive Summary", status: "complete", wordCount: 450 },
      { name: "Problem Statement", status: "complete", wordCount: 320 },
      { name: "Solution Overview", status: "complete", wordCount: 380 },
      { name: "Market Analysis", status: "complete", wordCount: 650 },
      { name: "Business Model", status: "complete", wordCount: 420 },
      { name: "Marketing Strategy", status: "complete", wordCount: 540 },
      { name: "Financial Projections", status: "complete", wordCount: 480 },
      { name: "Management Team", status: "complete", wordCount: 350 }
    ]
  };

  const demoPlans = [
    {
      id: 1,
      title: "EcoTracker - Sustainability Platform",
      industry: "FinTech",
      status: "Complete",
      progress: 100,
      lastUpdated: "2 hours ago",
      wordCount: 3590
    },
    {
      id: 2,
      title: "FitAI - Personal Trainer",
      industry: "Health Tech",
      status: "In Progress",
      progress: 75,
      lastUpdated: "1 day ago",
      wordCount: 2680
    },
    {
      id: 3,
      title: "EduTech Platform",
      industry: "Education",
      status: "Draft",
      progress: 45,
      lastUpdated: "3 days ago",
      wordCount: 1240
    },
    {
      id: 4,
      title: "GreenDeliver",
      industry: "Sustainability",
      status: "Complete",
      progress: 100,
      lastUpdated: "1 week ago",
      wordCount: 4120
    }
  ];

  const keyMetrics = [
    {
      title: "Total Plans",
      value: "4",
      icon: FileText,
      description: "Created this month"
    },
    {
      title: "Avg. Score",
      value: "8.6/10",
      icon: Target,
      description: "AI validation rating"
    },
    {
      title: "Market Size",
      value: "$12.8B",
      icon: TrendingUp,
      description: "Combined opportunity"
    },
    {
      title: "Funding Ready",
      value: "2",
      icon: DollarSign,
      description: "Plans ready for investors"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Draft": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FileText className="w-8 h-8 mr-3 text-blue-600" />
                Business Plans
                <Badge className="ml-3 bg-orange-50 text-orange-600 border-orange-200">
                  Demo
                </Badge>
              </h1>
              <p className="text-gray-600 mt-2">AI-generated business plans ready for investors</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <AlertCircle className="w-4 h-4 mr-2" />
                This is a demo
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Generate New Plan
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {keyMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <p className="text-sm text-gray-600">{metric.description}</p>
                    </div>
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Business Plans List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {demoPlans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{plan.title}</CardTitle>
                    <p className="text-sm text-gray-600">{plan.industry}</p>
                  </div>
                  <Badge className={getStatusColor(plan.status)}>
                    {plan.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{plan.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${plan.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Word Count: {plan.wordCount}</span>
                    <span className="text-gray-600">Updated: {plan.lastUpdated}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Plan Detail */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Featured Plan: {demoPlan.title}</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <Badge className="bg-green-100 text-green-800">
                  {demoPlan.status}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {demoPlan.sections.map((section, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{section.name}</h4>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600">{section.wordCount} words</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-800">Demo Mode</h3>
                <p className="text-sm text-orange-700 mt-1">
                  These are sample business plans generated by our AI. In the full version, you can create comprehensive, 
                  investor-ready business plans with real market data, financial projections, and competitive analysis.
                </p>
                <div className="flex space-x-3 mt-3">
                  <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    View Sample Plan
                  </Button>
                  <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    Learn About AI Generation
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}