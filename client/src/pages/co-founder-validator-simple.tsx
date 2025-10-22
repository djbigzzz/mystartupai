import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Users, Target, AlertCircle, Lightbulb, ArrowRight, RotateCcw, Search, Database, Brain, BarChart3, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import SidebarNavigation from "@/components/dashboard/sidebar-navigation";
import MobileNavigation from "@/components/mobile-navigation";

interface ValidationResult {
  score: number;
  verdict: string;
  idea: string;
  ideaClarity?: {
    score: number;
    problemDefinition: string;
    solutionClarity: string;
    oneSentencePitch: string;
  };
  marketValidation?: {
    score: number;
    tam: string;
    sam: string;
    som: string;
    growthRate: string;
    marketTiming: string;
    whyNow: string[];
  };
  competitiveIntelligence?: {
    score: number;
    competitionLevel: string;
    directCompetitors: string[];
    competitiveEdge: string;
  };
  customerDiscovery?: {
    score: number;
    personaClarity: string;
    painPointSeverity: number;
    willingnessToPay: string;
    earlyAdopterProfile: string;
  };
  problemSolutionFit?: {
    score: number;
    problemSeverity: number;
    solutionFeasibility: number;
    tenXTest: string;
    recommendation: string;
  };
  riskAssessment?: {
    score: number;
    topRisks: string[];
    topOpportunities: string[];
  };
  validationExperiments?: {
    experiments: Array<{
      name: string;
      description: string;
      week: number;
    }>;
  };
  recommendations?: string[];
  marketResearch?: {
    hasData: boolean;
    timestamp?: string;
    sources?: {
      competitors: number;
      marketTrends: number;
      customerInsights: number;
      fundingLandscape: number;
    };
    totalSources?: number;
  };
}

interface SavedIdea {
  id: number;
  ideaTitle: string;
  description: string;
  validationScore: number;
  validationVerdict: string;
  validationResult: ValidationResult;
  createdAt: string;
}

const QUICK_START_TEMPLATES = [
  {
    title: "SaaS Platform",
    description: "An AI-powered SaaS platform that helps businesses automate repetitive tasks and save time."
  },
  {
    title: "Mobile App",
    description: "A mobile app that connects people with similar interests in their local area for events and activities."
  },
  {
    title: "Marketplace",
    description: "A marketplace that connects freelance professionals with businesses needing short-term projects."
  },
  {
    title: "B2B Solution",
    description: "A B2B platform that streamlines supply chain management for small and medium businesses."
  }
];

// Research Progress Component
function ResearchProgress() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const researchSteps = [
    { icon: Search, label: "Searching market trends", color: "text-blue-500" },
    { icon: Database, label: "Analyzing competitors", color: "text-purple-500" },
    { icon: Users, label: "Researching customer insights", color: "text-green-500" },
    { icon: TrendingUp, label: "Evaluating funding landscape", color: "text-orange-500" },
    { icon: Brain, label: "AI validation analysis", color: "text-pink-500" },
    { icon: BarChart3, label: "Generating insights", color: "text-indigo-500" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % researchSteps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 animate-pulse text-primary" />
          AI Agent at Work
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-12 h-12 text-white animate-pulse" />
            </div>
          </div>
          <p className="font-medium text-lg mb-1">Validating Your Idea</p>
          <p className="text-sm text-muted-foreground">
            Running comprehensive analysis (60-90s)
          </p>
        </div>

        <div className="space-y-3">
          {researchSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;
            
            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary/10 border-2 border-primary/30 scale-105' 
                    : isComplete 
                    ? 'bg-green-50 dark:bg-green-950/20'
                    : 'bg-muted/50'
                }`}
              >
                <div className={`flex-shrink-0 ${isActive ? 'animate-pulse' : ''}`}>
                  {isComplete ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isActive ? step.color : 'text-muted-foreground'}`} />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-foreground' : isComplete ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </p>
                </div>
                {isActive && (
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round((currentStep / researchSteps.length) * 100)}%</span>
          </div>
          <Progress value={(currentStep / researchSteps.length) * 100} className="h-2" />
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>
              Our AI is conducting real-time market research using Perplexity AI and analyzing your idea across 8 critical dimensions with Claude.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CoFounderValidatorSimple() {
  const { toast } = useToast();
  const [ideaText, setIdeaText] = useState("");

  // Fetch existing idea
  const { data: savedIdea, isLoading: ideaLoading } = useQuery<SavedIdea | null>({
    queryKey: ["/api/ideas"],
  });

  // Validation mutation
  const validateMutation = useMutation({
    mutationFn: async (description: string) => {
      const response = await apiRequest("/api/journey/validate", {
        method: "POST",
        body: {
          idea: description,
          ideaTitle: description.substring(0, 100),
          industry: "Technology",
          stage: "Idea Stage",
          problemStatement: description,
          solutionApproach: description,
          targetMarket: "General",
          marketSize: "",
          competitors: "",
          competitiveEdge: "",
        },
      });
      return response;
    },
    onSuccess: (data: ValidationResult) => {
      setIdeaText(""); // Clear input after validation
      queryClient.invalidateQueries({ queryKey: ["/api/ideas"] });
      toast({
        title: "Validation Complete!",
        description: `Your idea scored ${data.score}/100 - ${data.verdict}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Validation Failed",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  // Start over mutation - archives current idea
  const startOverMutation = useMutation({
    mutationFn: async () => {
      if (!savedIdea) return;
      await apiRequest(`/api/ideas/${savedIdea.id}`, {
        method: "PATCH",
        body: { status: "archived" },
      });
    },
    onSuccess: () => {
      setIdeaText("");
      queryClient.invalidateQueries({ queryKey: ["/api/ideas"] });
      toast({
        title: "Starting fresh",
        description: "Your previous idea has been archived. Ready for a new validation!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not archive idea. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleValidate = () => {
    if (ideaText.trim().length < 10) {
      toast({
        title: "More details needed",
        description: "Please provide at least 10 characters describing your idea",
        variant: "destructive",
      });
      return;
    }
    validateMutation.mutate(ideaText);
  };

  const handleStartOver = () => {
    startOverMutation.mutate();
  };

  const handleUseTemplate = (description: string) => {
    setIdeaText(description);
  };

  const validationResult = savedIdea?.validationResult;
  const hasValidatedIdea = Boolean(savedIdea);

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "GO": return "bg-green-500";
      case "REFINE": return "bg-yellow-500";
      case "PIVOT": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  if (ideaLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation - Desktop */}
      <div className="hidden lg:block">
        <SidebarNavigation />
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">The Validator</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  AI-powered validation with real-time market research
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT: Validation Workspace */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    {hasValidatedIdea ? "Your Validated Idea" : "Start with Your Idea"}
                  </CardTitle>
                  {hasValidatedIdea && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleStartOver}
                      data-testid="button-start-over"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Start Over
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {hasValidatedIdea ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{savedIdea!.ideaTitle}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{savedIdea!.description}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getScoreColor(savedIdea!.validationScore)}`}>
                          {savedIdea!.validationScore}
                        </div>
                        <Badge className={getVerdictColor(savedIdea!.validationVerdict)}>
                          {savedIdea!.validationVerdict}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Simply describe your startup idea, and I'll help validate it with AI-powered analysis and real-time market research.
                    </p>

                    <Textarea
                      placeholder="Example: An AI-powered platform that transforms static pitch decks into compelling video presentations, enabling startups to create professional pitch videos without video editing skills..."
                      value={ideaText}
                      onChange={(e) => setIdeaText(e.target.value)}
                      rows={8}
                      className="resize-none"
                      data-testid="input-idea-validator"
                    />

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sparkles className="w-4 h-4" />
                      <span>I'll analyze your idea across 8 critical dimensions with real-time market research</span>
                    </div>

                    <Button
                      onClick={handleValidate}
                      disabled={validateMutation.isPending}
                      className="w-full"
                      size="lg"
                      data-testid="button-validate-simple"
                    >
                      {validateMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing... (60-90s)
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Validate My Idea
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {!hasValidatedIdea && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Quick Start Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_START_TEMPLATES.map((template, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleUseTemplate(template.description)}
                        className="justify-start text-left h-auto py-2"
                        data-testid={`template-${index}`}
                      >
                        <div>
                          <div className="font-medium text-xs">{template.title}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT: Validation Results */}
          <div>
            {validationResult && hasValidatedIdea && (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Validation Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Market Research Badge */}
                  {validationResult.marketResearch?.hasData && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Real-time market research
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          {validationResult.marketResearch.totalSources} sources • {validationResult.marketResearch.timestamp}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Idea Clarity */}
                  {validationResult.ideaClarity && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">Idea Clarity</h4>
                        <span className={`text-sm font-bold ${getScoreColor(validationResult.ideaClarity.score)}`}>
                          {validationResult.ideaClarity.score}/100
                        </span>
                      </div>
                      <Progress value={validationResult.ideaClarity.score} className="mb-2" />
                      <p className="text-sm text-muted-foreground italic">
                        "{validationResult.ideaClarity.oneSentencePitch}"
                      </p>
                    </div>
                  )}

                  {/* Market Validation */}
                  {validationResult.marketValidation && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">Market Opportunity</h4>
                        <span className={`text-sm font-bold ${getScoreColor(validationResult.marketValidation.score)}`}>
                          {validationResult.marketValidation.score}/100
                        </span>
                      </div>
                      <Progress value={validationResult.marketValidation.score} className="mb-3" />
                      <div className="space-y-2 text-sm">
                        <div><strong>TAM:</strong> {validationResult.marketValidation.tam}</div>
                        <div><strong>Timing:</strong> {validationResult.marketValidation.marketTiming}</div>
                      </div>
                    </div>
                  )}

                  {/* Competitive Intelligence */}
                  {validationResult.competitiveIntelligence && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">Competition</h4>
                        <span className={`text-sm font-bold ${getScoreColor(validationResult.competitiveIntelligence.score)}`}>
                          {validationResult.competitiveIntelligence.score}/100
                        </span>
                      </div>
                      <Progress value={validationResult.competitiveIntelligence.score} className="mb-2" />
                      <p className="text-sm">
                        <strong>Level:</strong> {validationResult.competitiveIntelligence.competitionLevel}
                      </p>
                    </div>
                  )}

                  {/* Recommendations */}
                  {validationResult.recommendations && validationResult.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Next Steps
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {validationResult.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {!hasValidatedIdea && !validateMutation.isPending && (
              <Card className="h-full flex items-center justify-center p-12">
                <div className="text-center text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Validation results will appear here</p>
                </div>
              </Card>
            )}

            {validateMutation.isPending && <ResearchProgress />}
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
  );
}
