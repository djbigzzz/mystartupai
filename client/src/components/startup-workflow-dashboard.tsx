import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Lightbulb, 
  FileText, 
  Presentation, 
  Calculator, 
  Search,
  CheckCircle,
  Clock,
  ArrowRight,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Brain,
  Rocket,
  Eye,
  Download
} from "lucide-react";
import { Link } from "wouter";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: any;
  status: "completed" | "in-progress" | "available" | "locked";
  completionPercentage: number;
  estimatedTime: string;
  dependencies: string[];
}

interface StartupWorkflowDashboardProps {
  currentIdeaId?: number | null;
  ideaData?: any;
}

export default function StartupWorkflowDashboard({ currentIdeaId, ideaData }: StartupWorkflowDashboardProps) {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      id: "submit-idea",
      title: "Idea Submission & Validation",
      description: "Submit your startup idea and get AI-powered validation with comprehensive analysis",
      route: "/submit-idea",
      icon: Lightbulb,
      status: "available",
      completionPercentage: 0,
      estimatedTime: "10-15 minutes",
      dependencies: []
    },
    {
      id: "business-plan",
      title: "Business Plan Generation",
      description: "Create a comprehensive 12-section business plan with AI assistance",
      route: "/business-plan",
      icon: FileText,
      status: "locked",
      completionPercentage: 0,
      estimatedTime: "20-30 minutes",
      dependencies: ["submit-idea"]
    },
    {
      id: "pitch-deck",
      title: "Pitch Deck Creation",
      description: "Generate professional investor presentations with interactive components",
      route: "/pitch-deck",
      icon: Presentation,
      status: "locked",
      completionPercentage: 0,
      estimatedTime: "15-25 minutes",
      dependencies: ["business-plan"]
    },
    {
      id: "financial-modeling",
      title: "Financial Modeling",
      description: "Build 5-year financial projections and investment calculations",
      route: "/financial-modeling",
      icon: Calculator,
      status: "locked",
      completionPercentage: 0,
      estimatedTime: "25-35 minutes",
      dependencies: ["business-plan"]
    },
    {
      id: "market-research",
      title: "Market Research & Analysis",
      description: "Comprehensive market analysis and competitive intelligence",
      route: "/market-research",
      icon: Search,
      status: "locked",
      completionPercentage: 0,
      estimatedTime: "20-30 minutes",
      dependencies: ["submit-idea"]
    }
  ]);

  useEffect(() => {
    if (currentIdeaId && ideaData) {
      setWorkflowSteps(prev => prev.map(step => {
        // Update step status based on available data
        switch (step.id) {
          case "submit-idea":
            return {
              ...step,
              status: "completed" as const,
              completionPercentage: 100
            };
          case "business-plan":
            return {
              ...step,
              status: ideaData.businessPlan ? "completed" as const : "available" as const,
              completionPercentage: ideaData.businessPlan ? 100 : 0
            };
          case "pitch-deck":
            return {
              ...step,
              status: ideaData.pitchDeck ? "completed" as const : 
                      ideaData.businessPlan ? "available" as const : "locked" as const,
              completionPercentage: ideaData.pitchDeck ? 100 : 0
            };
          case "financial-modeling":
            return {
              ...step,
              status: ideaData.businessPlan ? "available" as const : "locked" as const,
              completionPercentage: 0
            };
          case "market-research":
            return {
              ...step,
              status: "available" as const,
              completionPercentage: 0
            };
          default:
            return step;
        }
      }));
    }
  }, [currentIdeaId, ideaData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-100 border-green-200";
      case "in-progress": return "text-blue-600 bg-blue-100 border-blue-200";
      case "available": return "text-purple-600 bg-purple-100 border-purple-200";
      case "locked": return "text-gray-400 bg-gray-100 border-gray-200";
      default: return "text-gray-400 bg-gray-100 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "in-progress": return Clock;
      case "available": return Target;
      case "locked": return Clock;
      default: return Clock;
    }
  };

  const calculateOverallProgress = () => {
    const totalSteps = workflowSteps.length;
    const completedSteps = workflowSteps.filter(step => step.status === "completed").length;
    return (completedSteps / totalSteps) * 100;
  };

  const getNextStep = () => {
    return workflowSteps.find(step => step.status === "available");
  };

  const completedSteps = workflowSteps.filter(step => step.status === "completed").length;
  const nextStep = getNextStep();

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Startup Development Workflow
            </CardTitle>
            <Badge variant="secondary" className="text-sm">
              {completedSteps}/{workflowSteps.length} Complete
            </Badge>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Overall Progress</span>
              <span>{Math.round(calculateOverallProgress())}%</span>
            </div>
            <Progress value={calculateOverallProgress()} className="h-3" />
          </div>

          {currentIdeaId && ideaData && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{ideaData.ideaTitle}</h3>
                  <p className="text-sm text-gray-600">{ideaData.industry} • {ideaData.stage}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{ideaData.industry}</Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Next Step Recommendation */}
      {nextStep && (
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <nextStep.icon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recommended Next Step</h3>
                  <p className="text-gray-600">{nextStep.title}</p>
                  <p className="text-sm text-gray-500">Estimated time: {nextStep.estimatedTime}</p>
                </div>
              </div>
              <Link href={nextStep.route}>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflow Steps */}
      <div className="grid gap-6">
        {workflowSteps.map((step, index) => {
          const IconComponent = step.icon;
          const StatusIcon = getStatusIcon(step.status);
          const isClickable = step.status === "available" || step.status === "completed";
          
          return (
            <Card key={step.id} className={`transition-all duration-200 ${
              isClickable ? "hover:shadow-md cursor-pointer" : "opacity-60"
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getStatusColor(step.status)}`}>
                      {step.status === "completed" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="font-semibold">{index + 1}</span>
                      )}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                      </div>
                      <Badge className={getStatusColor(step.status)} variant="secondary">
                        {step.status.replace("-", " ")}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {step.estimatedTime}
                        </span>
                        {step.dependencies.length > 0 && (
                          <span>
                            Requires: {step.dependencies.join(", ")}
                          </span>
                        )}
                      </div>
                      
                      {isClickable && (
                        <Link href={step.route}>
                          <Button variant="outline" size="sm">
                            {step.status === "completed" ? "View" : "Start"}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      )}
                    </div>

                    {/* Progress Bar for Completed Steps */}
                    {step.status === "completed" && (
                      <div className="mt-4">
                        <Progress value={step.completionPercentage} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Workflow Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            Complete Startup Development Platform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
              <p className="text-sm text-gray-600">Advanced GPT-4 technology for intelligent content generation</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Proven Framework</h4>
              <p className="text-sm text-gray-600">Based on Y Combinator and successful startup methodologies</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Rocket className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Complete Workflow</h4>
              <p className="text-sm text-gray-600">From idea validation to investor-ready documentation</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Professional Output</h4>
              <p className="text-sm text-gray-600">Investor-ready business plans, pitch decks, and financial models</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export All Documents */}
      {completedSteps >= 2 && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Export Complete Startup Package
                </h3>
                <p className="text-gray-600">
                  Download all your completed documents in a professional investor package
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Investor Package
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}