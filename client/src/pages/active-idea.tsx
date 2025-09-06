import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Lightbulb, 
  Plus, 
  Eye, 
  FileText, 
  TrendingUp,
  Calendar,
  Brain,
  Target,
  BarChart3,
  Archive,
  Edit,
  Rocket,
  Users,
  DollarSign
} from "lucide-react";
import { Link } from "wouter";

interface StartupIdea {
  id: number;
  ideaTitle: string;
  description: string;
  industry: string;
  stage: string;
  analysisStatus: string;
  validationScore: number | null;
  createdAt: string;
  analysis?: any;
  businessPlan?: any;
}

export default function ActiveIdea() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) setUserEmail(email);
  }, []);

  const { data: ideas, isLoading, error } = useQuery<StartupIdea[]>({
    queryKey: ["/api/ideas"],
    retry: 1,
    enabled: !!userEmail,
  });

  // Get the most recent idea as the "active" one
  const activeIdea = ideas?.[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700";
      case "processing": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700";
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700";
    }
  };

  const getValidationScoreColor = (score: number | null) => {
    if (!score) return "text-gray-500 dark:text-gray-400";
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const quickActions = [
    {
      icon: FileText,
      title: "Generate Business Plan",
      description: "Create a comprehensive business plan",
      href: "/business-plan",
      color: "blue",
      enabled: !!activeIdea?.analysis
    },
    {
      icon: TrendingUp,
      title: "View Analytics",
      description: "See detailed market analysis",
      href: "/analytics",
      color: "green",
      enabled: !!activeIdea?.analysis
    },
    {
      icon: Users,
      title: "Find Investors",
      description: "Match with relevant investors",
      href: "/investor-matching",
      color: "purple",
      enabled: !!activeIdea?.analysis
    },
    {
      icon: Rocket,
      title: "Build MVP",
      description: "Create your minimum viable product",
      href: "/mvp-builder",
      color: "orange",
      enabled: !!activeIdea
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">
                Unable to Load Your Idea
              </h2>
              <p className="text-red-600 dark:text-red-400 mb-4">
                Please make sure you're logged in and try again.
              </p>
              <Link href="/app">
                <Button>Go to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Active Idea
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Focus on validating and building your startup concept
              </p>
            </div>
            {activeIdea ? (
              <div className="flex space-x-3">
                <Link href="/submit-idea">
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Update Idea
                  </Button>
                </Link>
                <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive & Start New
                </Button>
              </div>
            ) : (
              <Link href="/submit-idea">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Your Idea
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* No Active Idea */}
        {!activeIdea ? (
          <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
            <CardContent className="p-12 text-center">
              <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No Active Idea Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Submit your startup idea to get AI-powered analysis, business plan generation, and investor matching
              </p>
              <Link href="/submit-idea">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Your First Idea
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Active Idea Card */}
            <Card className="mb-8 border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-3 text-gray-900 dark:text-white">
                      {activeIdea.ideaTitle}
                    </CardTitle>
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge variant="outline" className="text-sm">
                        {activeIdea.industry}
                      </Badge>
                      <Badge variant="outline" className="text-sm">
                        {activeIdea.stage}
                      </Badge>
                      <Badge className={`text-sm ${getStatusColor(activeIdea.analysisStatus)}`}>
                        {activeIdea.analysisStatus}
                      </Badge>
                    </div>
                  </div>
                  {activeIdea.validationScore && (
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getValidationScoreColor(activeIdea.validationScore)}`}>
                        {activeIdea.validationScore}/100
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Validation Score</div>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {activeIdea.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    Created {new Date(activeIdea.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      View Analysis
                    </Button>
                    {activeIdea.businessPlan && (
                      <Button size="sm" variant="outline">
                        <FileText className="w-3 h-3 mr-1" />
                        Business Plan
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Next Steps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Card key={index} className={`hover:shadow-lg transition-all duration-200 ${
                      action.enabled 
                        ? "hover:scale-105 cursor-pointer" 
                        : "opacity-60 cursor-not-allowed"
                    }`}>
                      <CardContent className="p-6 text-center">
                        <IconComponent className={`w-8 h-8 mx-auto mb-3 ${
                          action.color === 'blue' ? 'text-blue-600' :
                          action.color === 'green' ? 'text-green-600' :
                          action.color === 'purple' ? 'text-purple-600' :
                          action.color === 'orange' ? 'text-orange-600' :
                          'text-gray-600'
                        }`} />
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {action.description}
                        </p>
                        {action.enabled ? (
                          <Link href={action.href}>
                            <Button size="sm" className="w-full">
                              Get Started
                            </Button>
                          </Link>
                        ) : (
                          <Button size="sm" className="w-full" disabled>
                            {activeIdea.analysisStatus === 'pending' ? 'Analysis Pending' : 'Submit Idea First'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Progress Insights */}
            {activeIdea.analysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-blue-600" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {activeIdea.analysis?.marketPotential || 'High'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Market Potential</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {activeIdea.analysis?.technicalFeasibility || 'Medium'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Technical Feasibility</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {activeIdea.analysis?.competitiveAdvantage || 'Strong'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Competitive Advantage</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}