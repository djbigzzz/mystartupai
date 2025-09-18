import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Lightbulb, 
  Search,
  CheckCircle,
  FileText, 
  Presentation, 
  Users,
  ArrowRight,
  ArrowLeft,
  Target,
  TrendingUp,
  Brain,
  Rocket,
  Eye,
  Clock,
  Star,
  Zap,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: any;
  status: "completed" | "in-progress" | "available" | "locked" | "pending-approval";
  completionPercentage: number;
  estimatedTime: string;
  dependencies: string[];
  requiresApproval?: boolean;
}

interface StartupWorkflowProps {
  currentIdeaId?: number | null;
  ideaData?: any;
}

interface ApprovalState {
  [key: string]: boolean | null; // null = pending, true = approved, false = rejected
}

export default function StartupWorkflow({ currentIdeaId, ideaData }: StartupWorkflowProps) {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [approvalStates, setApprovalStates] = useState<ApprovalState>({});
  const [showApprovalModal, setShowApprovalModal] = useState<string | null>(null);

  // Define the proper workflow sequence as requested
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      id: "submit-idea",
      title: "1. Submit Idea",
      description: "Submit your startup concept and get AI-powered validation with comprehensive analysis",
      route: "/submit-idea",
      icon: Lightbulb,
      status: "available",
      completionPercentage: 0,
      estimatedTime: "10-15 minutes",
      dependencies: []
    },
    {
      id: "market-research",
      title: "2. Market Research & Competitor Analysis",
      description: "AI-powered analysis of market size, competitors, trends, and opportunities - FIRST step after idea submission",
      route: "/market-research",
      icon: Search,
      status: "locked",
      completionPercentage: 0,
      estimatedTime: "15-25 minutes",
      dependencies: ["submit-idea"]
    },
    {
      id: "approval-gate-1",
      title: "3. Review & Approve Market Research",
      description: "Review the market research results and decide if you're happy to proceed",
      route: "#",
      icon: CheckCircle,
      status: "locked",
      completionPercentage: 0,
      estimatedTime: "5-10 minutes",
      dependencies: ["market-research"],
      requiresApproval: true
    },
    {
      id: "business-plan",
      title: "4. Business Plan Generation",
      description: "Create a comprehensive 12-section business plan with AI assistance",
      route: "/business-plan",
      icon: FileText,
      status: "locked",
      completionPercentage: 0,
      estimatedTime: "20-30 minutes",
      dependencies: ["approval-gate-1"]
    },
    {
      id: "pitch-deck",
      title: "5. Pitch Deck Creation",
      description: "Generate professional investor presentations with interactive components",
      route: "/pitch-deck",
      icon: Presentation,
      status: "locked",
      completionPercentage: 0,
      estimatedTime: "15-25 minutes",
      dependencies: ["business-plan"]
    },
    {
      id: "investor-database",
      title: "6. Investor Database & Funding",
      description: "Access investor matching and funding opportunities tailored to your startup",
      route: "/investor-matching",
      icon: Users,
      status: "locked",
      completionPercentage: 0,
      estimatedTime: "10-20 minutes",
      dependencies: ["pitch-deck"]
    }
  ]);

  // Update workflow step statuses based on current data and approvals
  useEffect(() => {
    if (currentIdeaId && ideaData) {
      setWorkflowSteps(prev => prev.map(step => {
        switch (step.id) {
          case "submit-idea":
            return {
              ...step,
              status: "completed" as const,
              completionPercentage: 100
            };
          
          case "market-research":
            // Available if idea is submitted
            return {
              ...step,
              status: ideaData.analysis?.marketAnalysis ? "completed" as const : "available" as const,
              completionPercentage: ideaData.analysis?.marketAnalysis ? 100 : 0
            };
          
          case "approval-gate-1":
            const marketResearchCompleted = ideaData.analysis?.marketAnalysis;
            const approvalStatus = approvalStates["market-research"];
            
            if (!marketResearchCompleted) return { ...step, status: "locked" as const };
            if (approvalStatus === null) return { ...step, status: "pending-approval" as const };
            if (approvalStatus === true) return { ...step, status: "completed" as const, completionPercentage: 100 };
            return { ...step, status: "available" as const }; // If rejected, allow retry
          
          case "business-plan":
            const approved = approvalStates["market-research"] === true;
            return {
              ...step,
              status: ideaData.businessPlan ? "completed" as const : 
                      approved ? "available" as const : "locked" as const,
              completionPercentage: ideaData.businessPlan ? 100 : 0
            };
          
          case "pitch-deck":
            return {
              ...step,
              status: ideaData.pitchDeck ? "completed" as const : 
                      ideaData.businessPlan ? "available" as const : "locked" as const,
              completionPercentage: ideaData.pitchDeck ? 100 : 0
            };
          
          case "investor-database":
            return {
              ...step,
              status: ideaData.pitchDeck ? "available" as const : "locked" as const,
              completionPercentage: 0 // Always allow progression to investor matching
            };
          
          default:
            return step;
        }
      }));
    }
  }, [currentIdeaId, ideaData, approvalStates]);

  // Handle approval decisions
  const handleApproval = (stepId: string, approved: boolean) => {
    const previousStepId = stepId === "approval-gate-1" ? "market-research" : stepId;
    
    setApprovalStates(prev => ({
      ...prev,
      [previousStepId]: approved
    }));

    setShowApprovalModal(null);

    if (approved) {
      toast({
        title: "✅ Approved!",
        description: "Great! You can now proceed to the next step.",
      });
    } else {
      toast({
        title: "🔄 Needs Revision",
        description: "No worries! You can revise the previous step and try again.",
        variant: "destructive"
      });
    }
  };

  // Market research regeneration mutation
  const regenerateMarketResearch = useMutation({
    mutationFn: async () => {
      if (!ideaData) throw new Error("No idea data available");
      
      const response = await apiRequest("/api/market-research", {
        method: "POST",
        body: JSON.stringify({
          ideaTitle: ideaData.ideaTitle,
          description: ideaData.description,
          industry: ideaData.industry || "Technology",
          stage: ideaData.stage || "Idea Stage"
        }),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Market Research Updated!",
        description: "New market analysis has been generated.",
      });
      // Refresh idea data
      queryClient.invalidateQueries({ queryKey: [`/api/ideas/${currentIdeaId}`] });
      // Reset approval state
      setApprovalStates(prev => ({
        ...prev,
        "market-research": null
      }));
    },
    onError: (error: any) => {
      toast({
        title: "Research Failed",
        description: error.message || "Failed to regenerate market research. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400";
      case "in-progress": return "text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400";
      case "available": return "text-purple-600 bg-purple-100 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400";
      case "pending-approval": return "text-orange-600 bg-orange-100 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400";
      case "locked": return "text-gray-400 bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500";
      default: return "text-gray-400 bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "in-progress": return Clock;
      case "available": return Target;
      case "pending-approval": return AlertCircle;
      case "locked": return Clock;
      default: return Clock;
    }
  };

  const calculateOverallProgress = () => {
    const totalSteps = workflowSteps.filter(step => !step.requiresApproval).length; // Don't count approval gates
    const completedSteps = workflowSteps.filter(step => step.status === "completed" && !step.requiresApproval).length;
    return (completedSteps / totalSteps) * 100;
  };

  const getNextStep = () => {
    return workflowSteps.find(step => step.status === "available" || step.status === "pending-approval");
  };

  const completedSteps = workflowSteps.filter(step => step.status === "completed").length;
  const nextStep = getNextStep();

  const renderApprovalGate = (step: WorkflowStep) => {
    const previousStep = workflowSteps.find(s => step.dependencies.includes(s.id));
    const approvalKey = previousStep?.id || "";
    const approvalStatus = approvalStates[approvalKey];
    
    return (
      <Card key={step.id} className="border-2 border-dashed border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/10">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getStatusColor(step.status)}`}>
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                </div>
                <Badge className={getStatusColor(step.status)} variant="secondary">
                  {step.status.replace("-", " ")}
                </Badge>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">{step.description}</p>
              
              {approvalStatus === null && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-700 mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Are you satisfied with the {previousStep?.title.toLowerCase()}?
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Please review the results before proceeding to the next step. You can regenerate if needed.
                  </p>
                  
                  <div className="flex items-center space-x-3">
                    <Button 
                      onClick={() => handleApproval(step.id, true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      data-testid={`button-approve-${step.id}`}
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Yes, Continue
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleApproval(step.id, false)}
                      data-testid={`button-reject-${step.id}`}
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      Need Changes
                    </Button>
                    {previousStep?.id === "market-research" && (
                      <Button 
                        variant="outline"
                        onClick={() => regenerateMarketResearch.mutate()}
                        disabled={regenerateMarketResearch.isPending}
                        data-testid="button-regenerate-market-research"
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${regenerateMarketResearch.isPending ? 'animate-spin' : ''}`} />
                        Regenerate
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {approvalStatus === false && (
                <Alert className="mb-4 border-red-200 bg-red-50 dark:bg-red-900/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This step needs revision. Please update the {previousStep?.title.toLowerCase()} and try again.
                  </AlertDescription>
                </Alert>
              )}

              {approvalStatus === true && (
                <Alert className="mb-4 border-green-200 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    ✅ Approved! You can now proceed to the next step.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6" data-testid="startup-workflow">
      {/* Progress Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              🚀 Startup Development Workflow
            </CardTitle>
            <Badge variant="secondary" className="text-sm">
              {completedSteps}/{workflowSteps.length} Steps Complete
            </Badge>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>Overall Progress</span>
              <span>{Math.round(calculateOverallProgress())}%</span>
            </div>
            <Progress value={calculateOverallProgress()} className="h-3" />
          </div>

          {currentIdeaId && ideaData && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{ideaData.ideaTitle}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{ideaData.industry} • {ideaData.stage}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{ideaData.industry}</Badge>
                  <Link href={`/submit-idea`}>
                    <Button variant="outline" size="sm" data-testid="button-view-idea-details">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Next Step Recommendation */}
      {nextStep && !nextStep.requiresApproval && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white overflow-hidden relative">
          <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full opacity-50"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full opacity-30"></div>
          
          <CardContent className="p-8 relative z-10">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300">
                <nextStep.icon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-2 text-white drop-shadow-sm">
                🎯 Your Next Step
              </h2>
              <p className="text-blue-100 text-lg font-medium">
                Ready to level up your startup?
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{nextStep.title}</h3>
              <p className="text-blue-100 mb-4">{nextStep.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-blue-100">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="font-medium">Time: {nextStep.estimatedTime}</span>
                </div>
                <div className="flex items-center text-blue-100">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span className="font-medium">Progress: +{Math.round(100/workflowSteps.filter(s => !s.requiresApproval).length)}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={nextStep.route}>
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto" data-testid="button-next-step-primary">
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflow Steps */}
      <div className="grid gap-6" data-testid="workflow-steps">
        {workflowSteps.map((step, index) => {
          // Render approval gates differently
          if (step.requiresApproval) {
            return renderApprovalGate(step);
          }

          const IconComponent = step.icon;
          const StatusIcon = getStatusIcon(step.status);
          const isClickable = (step.status === "available" || step.status === "completed") && step.route !== "#";
          
          return (
            <Card key={step.id} className={`transition-all duration-200 ${
              isClickable ? "hover:shadow-md cursor-pointer" : "opacity-60"
            }`} data-testid={`workflow-step-${step.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Step Number/Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getStatusColor(step.status)}`}>
                      {step.status === "completed" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <IconComponent className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                      </div>
                      <Badge className={getStatusColor(step.status)} variant="secondary" data-testid={`status-${step.id}`}>
                        {step.status.replace("-", " ")}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{step.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {step.estimatedTime}
                        </span>
                        {step.dependencies.length > 0 && (
                          <span>
                            Requires: {step.dependencies.map(dep => 
                              workflowSteps.find(s => s.id === dep)?.title.replace(/^\d+\.\s/, '') || dep
                            ).join(", ")}
                          </span>
                        )}
                      </div>
                      
                      {isClickable && (
                        <Link href={step.route}>
                          <Button variant="outline" size="sm" data-testid={`button-start-${step.id}`}>
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

      {/* Workflow Benefits Footer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            🏆 Complete Startup Development Platform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">AI-Powered Analysis</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Advanced GPT-4 technology for market research and content generation</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Logical Sequence</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Market research FIRST, then business plan - the right order for success</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Approval Gates</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Review and approve each step before moving forward</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Rocket className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Investor Ready</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Complete pipeline from idea to investor-ready documentation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}