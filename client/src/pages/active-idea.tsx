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
  DollarSign,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  TrendingUp as Progress
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

  // Progress tracking system
  const getProgressStages = (idea: StartupIdea | undefined) => {
    if (!idea) return [];
    
    const stages = [
      {
        id: 'idea',
        title: 'Idea Submitted',
        description: 'Your startup concept is in the system',
        completed: !!idea.ideaTitle,
        icon: Lightbulb,
        color: 'blue'
      },
      {
        id: 'analysis',
        title: 'AI Analysis',
        description: 'Market validation and feasibility analysis',
        completed: idea.analysisStatus === 'completed' && !!idea.analysis,
        inProgress: idea.analysisStatus === 'processing',
        icon: Brain,
        color: 'purple'
      },
      {
        id: 'validation',
        title: 'Validation Score',
        description: 'Comprehensive scoring and insights',
        completed: !!idea.validationScore && idea.validationScore > 0,
        icon: BarChart3,
        color: 'green'
      },
      {
        id: 'business-plan',
        title: 'Business Plan',
        description: 'Detailed business strategy and roadmap',
        completed: !!idea.businessPlan,
        icon: FileText,
        color: 'orange'
      },
      {
        id: 'mvp',
        title: 'MVP Development',
        description: 'Build your minimum viable product',
        completed: false, // This would be tracked separately
        icon: Rocket,
        color: 'red'
      }
    ];
    
    return stages;
  };

  // AI suggestions based on current progress
  const getAISuggestions = (idea: StartupIdea | undefined) => {
    if (!idea) return [];
    
    const suggestions = [];
    
    if (!idea.analysis) {
      suggestions.push({
        title: "Get AI Analysis",
        description: "Complete your startup validation with AI-powered market analysis",
        action: "Update your idea details to trigger analysis",
        priority: "high",
        icon: Brain
      });
    }
    
    if (idea.analysis && !idea.businessPlan) {
      suggestions.push({
        title: "Generate Business Plan",
        description: "Your idea has been analyzed. Create a comprehensive business plan now.",
        action: "Use AI to generate your business plan",
        priority: "high",
        icon: FileText
      });
    }
    
    if (idea.validationScore && idea.validationScore < 70) {
      suggestions.push({
        title: "Improve Validation Score",
        description: "Your score can be improved with more detailed market research",
        action: "Add more details about your target market and competition",
        priority: "medium",
        icon: TrendingUp
      });
    }
    
    if (idea.businessPlan && idea.validationScore && idea.validationScore >= 70) {
      suggestions.push({
        title: "Start MVP Development",
        description: "Your idea is well-validated. Time to build your MVP!",
        action: "Use our AI-powered MVP builder",
        priority: "high",
        icon: Rocket
      });
    }
    
    return suggestions;
  };

  const progressStages = getProgressStages(activeIdea);
  const aiSuggestions = getAISuggestions(activeIdea);
  const completedStages = progressStages.filter(stage => stage.completed).length;
  const progressPercentage = (completedStages / progressStages.length) * 100;

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

            {/* Progress Tracking */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Validation Progress
                </h2>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Progress className="w-4 h-4 mr-2" />
                  {completedStages}/{progressStages.length} stages completed
                </div>
              </div>
              
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Overall Progress
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {progressStages.map((stage, index) => {
                  const IconComponent = stage.icon;
                  const isCompleted = stage.completed;
                  const isInProgress = stage.inProgress;
                  const isNext = !isCompleted && !isInProgress && index === completedStages;
                  
                  return (
                    <Card key={stage.id} className={`relative overflow-hidden ${
                      isCompleted ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700' :
                      isInProgress ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700' :
                      isNext ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700' :
                      'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
                    }`}>
                      <CardContent className="p-4 text-center">
                        <div className="flex justify-center mb-3">
                          {isCompleted ? (
                            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                          ) : isInProgress ? (
                            <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
                          ) : (
                            <IconComponent className={`w-8 h-8 ${
                              isNext ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'
                            }`} />
                          )}
                        </div>
                        <h3 className={`font-semibold text-sm mb-1 ${
                          isCompleted ? 'text-green-800 dark:text-green-300' :
                          isInProgress ? 'text-blue-800 dark:text-blue-300' :
                          isNext ? 'text-yellow-800 dark:text-yellow-300' :
                          'text-gray-600 dark:text-gray-400'
                        }`}>
                          {stage.title}
                        </h3>
                        <p className={`text-xs ${
                          isCompleted ? 'text-green-600 dark:text-green-400' :
                          isInProgress ? 'text-blue-600 dark:text-blue-400' :
                          isNext ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-gray-500 dark:text-gray-500'
                        }`}>
                          {stage.description}
                        </p>
                        {isInProgress && (
                          <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 animate-pulse"></div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                  AI Recommendations
                </h2>
                <div className="space-y-4">
                  {aiSuggestions.map((suggestion, index) => {
                    const IconComponent = suggestion.icon;
                    return (
                      <Card key={index} className={`border-l-4 ${
                        suggestion.priority === 'high' 
                          ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' 
                          : 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <IconComponent className={`w-6 h-6 mt-1 ${
                              suggestion.priority === 'high' ? 'text-red-600' : 'text-yellow-600'
                            }`} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {suggestion.title}
                                </h3>
                                <Badge variant={suggestion.priority === 'high' ? 'destructive' : 'secondary'}>
                                  {suggestion.priority} priority
                                </Badge>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 mb-3">
                                {suggestion.description}
                              </p>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <ArrowRight className="w-4 h-4 mr-1" />
                                {suggestion.action}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

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