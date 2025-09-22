import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import IntelligentIdeaAnalyzer from "@/components/intelligent-idea-analyzer";
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
      id: "intelligent-analysis",
      title: "2. Intelligent Idea Analysis",
      description: "AI asks clarifying questions and provides realistic, contextual market insights - FIRST step after idea submission",
      route: "/intelligent-analysis",
      icon: Brain,
      status: "locked",
      completionPercentage: 0,
      estimatedTime: "15-25 minutes",
      dependencies: ["submit-idea"]
    },
    {
      id: "business-plan",
      title: "3. Business Plan Generation",
      description: "Create a comprehensive 12-section business plan with AI assistance",
      route: "/business-plan",
      icon: FileText,
      status: "locked",
      completionPercentage: 0,
      estimatedTime: "20-30 minutes",
      dependencies: ["intelligent-analysis"]
    },
    {
      id: "pitch-deck",
      title: "4. Pitch Deck Creation",
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
      title: "5. Investor Database & Funding",
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
          
          case "intelligent-analysis":
            // Available if idea is submitted
            return {
              ...step,
              status: ideaData.analysis?.marketAnalysis ? "completed" as const : "available" as const,
              completionPercentage: ideaData.analysis?.marketAnalysis ? 100 : 0
            };
          
          case "business-plan":
            const analysisCompleted = ideaData.analysis?.marketAnalysis;
            return {
              ...step,
              status: ideaData.businessPlan ? "completed" as const : 
                      analysisCompleted ? "available" as const : "locked" as const,
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
    const previousStepId = stepId === "approval-gate-1" ? "intelligent-analysis" : stepId;
    
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
      
      const response = await apiRequest("/api/contextual-market-research", {
        method: "POST",
        body: {
          ideaId: ideaData.id,
          ideaAnalysis: ideaData.analysis?.businessContext,
          questionAnswers: ideaData.analysis?.clarificationAnswers,
          editedAnalysis: null
        },
      } as any);
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
        "intelligent-analysis": null
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
                    {previousStep?.id === "intelligent-analysis" && (
                      <Button 
                        variant="outline"
                        onClick={() => regenerateMarketResearch.mutate()}
                        disabled={regenerateMarketResearch.isPending}
                        data-testid="button-regenerate-intelligent-analysis"
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

      {/* Workflow Steps - Horizontal Roadmap */}
      <div className="overflow-x-auto" data-testid="workflow-steps">
        <div className="flex space-x-4 pb-4 min-w-max">
          {workflowSteps.map((step, index) => {
            const IconComponent = step.icon;
            const isClickable = (step.status === "available" || step.status === "completed") && step.route !== "#";
            const isLast = index === workflowSteps.length - 1;
            
            return (
              <div key={step.id} className="flex items-center" data-testid={`workflow-step-${step.id}`}>
                {/* Step Card */}
                <Card className={`w-64 transition-all duration-200 border-2 ${
                  step.status === "completed" ? "border-green-500 bg-green-50 dark:bg-green-900/20" :
                  step.status === "available" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" :
                  step.status === "in-progress" ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" :
                  "border-gray-300 bg-gray-50 dark:bg-gray-800/50 opacity-60"
                } ${
                  isClickable ? "hover:shadow-lg cursor-pointer transform hover:-translate-y-1" : ""
                }`}>
                  <CardContent className="p-4">
                    {/* Icon and Status */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        step.status === "completed" ? "bg-green-500 border-green-500" :
                        step.status === "available" ? "bg-blue-500 border-blue-500" :
                        step.status === "in-progress" ? "bg-orange-500 border-orange-500" :
                        "bg-gray-400 border-gray-400"
                      }`}>
                        {step.status === "completed" ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <IconComponent className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          step.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                          step.status === "available" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                          step.status === "in-progress" ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" :
                          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                        data-testid={`status-${step.id}`}
                      >
                        {step.status.replace("-", " ")}
                      </Badge>
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2 leading-tight">
                      {step.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Time and Action */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{step.estimatedTime}</span>
                      </div>
                      
                      {isClickable && (
                        <Link href={step.route + (step.id === "intelligent-analysis" ? `?ideaId=${currentIdeaId}` : "")}>
                          <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-7" data-testid={`button-start-${step.id}`}>
                            {step.status === "completed" ? "View" : "Start"}
                          </Button>
                        </Link>
                      )}
                    </div>
                    
                    {/* Progress Bar */}
                    {step.status === "completed" && (
                      <div className="mt-3">
                        <Progress value={step.completionPercentage} className="h-1" />
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Arrow Connector */}
                {!isLast && (
                  <div className="flex items-center mx-2">
                    <ArrowRight className={`w-5 h-5 ${
                      workflowSteps[index + 1]?.status === "completed" || workflowSteps[index + 1]?.status === "available" 
                        ? "text-blue-500" : "text-gray-400"
                    }`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
      
      {/* Render Intelligent Idea Analyzer if needed */}
      {ideaData && nextStep?.id === "intelligent-analysis" && (
        <div className="mt-8">
          <IntelligentIdeaAnalyzer 
            ideaData={ideaData}
            onAnalysisComplete={(analysis, insights) => {
              // Handle completion - refresh the idea data and update approvals
              queryClient.invalidateQueries({ queryKey: [`/api/ideas/${currentIdeaId}`] });
              setApprovalStates(prev => ({
                ...prev,
                "intelligent-analysis": null // Reset to pending approval
              }));
              toast({
                title: "🎯 Analysis Complete!",
                description: "Review your results and decide if you want to proceed to business planning.",
              });
            }}
          />
        </div>
      )}
    </div>
  );
}