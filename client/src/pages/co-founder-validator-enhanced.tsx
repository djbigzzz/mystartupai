import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Sparkles, TrendingUp, Target, AlertCircle, Lightbulb, ArrowRight, RotateCcw, Search, Database, Brain, BarChart3, CheckCircle2, Loader2, Save, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import SidebarNavigation from "@/components/dashboard/sidebar-navigation";
import MobileNavigation from "@/components/mobile-navigation";
import { debounce } from "lodash";

interface ValidationResult {
  score: number;
  verdict: string;
  idea: string;
  ideaClarity?: { score: number; problemDefinition: string; solutionClarity: string; oneSentencePitch: string };
  marketValidation?: { score: number; tam: string; sam: string; som: string; growthRate: string; marketTiming: string; whyNow: string[] };
  competitiveIntelligence?: { score: number; competitionLevel: string; directCompetitors: string[]; competitiveEdge: string };
  customerDiscovery?: { score: number; personaClarity: string; painPointSeverity: number; willingnessToPay: string; earlyAdopterProfile: string };
  problemSolutionFit?: { score: number; problemSeverity: number; solutionFeasibility: number; tenXTest: string; recommendation: string };
  riskAssessment?: { score: number; topRisks: string[]; topOpportunities: string[] };
  validationExperiments?: { experiments: Array<{ name: string; description: string; week: number }> };
  recommendations?: string[];
  marketResearch?: { hasData: boolean; timestamp?: string; sources?: { competitors: number; marketTrends: number; customerInsights: number; fundingLandscape: number }; totalSources?: number };
}

interface SavedIdea {
  id: number;
  ideaTitle: string;
  description: string;
  problemStatement?: string;
  solutionApproach?: string;
  targetMarket?: string;
  competitiveLandscape?: string;
  businessModel?: string;
  uniqueValueProp?: string;
  validationScore: number;
  validationVerdict: string;
  validationResult: ValidationResult;
  draftData?: any;
  createdAt: string;
}

interface IdeaFormData {
  ideaTitle: string;
  problemStatement: string;
  solutionApproach: string;
  targetMarket: string;
  competitiveLandscape: string;
  businessModel: string;
  uniqueValueProp: string;
}

// Research Progress Component
function ResearchProgress() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const researchSteps = [
    { icon: Search, label: "Searching market trends", color: "text-blue-500" },
    { icon: Database, label: "Analyzing competitors", color: "text-purple-500" },
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
                  isActive ? 'bg-primary/10 border-2 border-primary/30 scale-105' : isComplete ? 'bg-green-50 dark:bg-green-950/20' : 'bg-muted/50'
                }`}
              >
                <div className={`flex-shrink-0 ${isActive ? 'animate-pulse' : ''}`}>
                  {isComplete ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Icon className={`w-5 h-5 ${isActive ? step.color : 'text-muted-foreground'}`} />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isActive ? 'text-foreground' : isComplete ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}`}>
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
            <p>Our AI is conducting real-time market research and analyzing your idea across 8 critical dimensions.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CoFounderValidatorEnhanced() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<IdeaFormData>({
    ideaTitle: "",
    problemStatement: "",
    solutionApproach: "",
    targetMarket: "",
    competitiveLandscape: "",
    businessModel: "",
    uniqueValueProp: "",
  });
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [aiSuggesting, setAiSuggesting] = useState<string | null>(null);

  // Fetch existing idea
  const { data: savedIdea, isLoading: ideaLoading } = useQuery<SavedIdea | null>({
    queryKey: ["/api/ideas"],
  });

  // Load draft data when component mounts
  useEffect(() => {
    if (savedIdea?.draftData) {
      setFormData(savedIdea.draftData);
    } else if (savedIdea && !savedIdea.validationScore) {
      setFormData({
        ideaTitle: savedIdea.ideaTitle || "",
        problemStatement: savedIdea.problemStatement || "",
        solutionApproach: savedIdea.solutionApproach || "",
        targetMarket: savedIdea.targetMarket || "",
        competitiveLandscape: savedIdea.competitiveLandscape || "",
        businessModel: savedIdea.businessModel || "",
        uniqueValueProp: savedIdea.uniqueValueProp || "",
      });
    }
  }, [savedIdea]);

  // Auto-save mutation
  const autoSaveMutation = useMutation({
    mutationFn: async (data: IdeaFormData) => {
      await apiRequest("/api/journey/auto-save", {
        method: "POST",
        body: { draftData: data },
      });
    },
    onMutate: () => setSaveStatus("saving"),
    onSuccess: () => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    },
    onError: () => setSaveStatus("idle"),
  });

  // Debounced auto-save
  const debouncedSave = useCallback(
    debounce((data: IdeaFormData) => {
      autoSaveMutation.mutate(data);
    }, 500),
    []
  );

  // Handle field change
  const handleFieldChange = (field: keyof FormData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    debouncedSave(newData);
  };

  // AI Suggestion mutation
  const aiSuggestionMutation = useMutation({
    mutationFn: async (fieldName: string) => {
      const response = await apiRequest("/api/journey/suggest-field", {
        method: "POST",
        body: { fieldName, formData },
      });
      return response.suggestion;
    },
    onSuccess: (suggestion, fieldName) => {
      handleFieldChange(fieldName as keyof FormData, suggestion);
      setAiSuggesting(null);
      toast({
        title: "AI Suggestion Applied",
        description: "The field has been populated with an AI-generated suggestion.",
      });
    },
    onError: () => {
      setAiSuggesting(null);
      toast({
        title: "Suggestion Failed",
        description: "Could not generate suggestion. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAiSuggest = (fieldName: string) => {
    setAiSuggesting(fieldName);
    aiSuggestionMutation.mutate(fieldName);
  };

  // Validation mutation
  const validateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("/api/journey/validate", {
        method: "POST",
        body: {
          idea: formData.problemStatement,
          ideaTitle: formData.ideaTitle,
          industry: "Technology",
          stage: "Idea Stage",
          problemStatement: formData.problemStatement,
          solutionApproach: formData.solutionApproach,
          targetMarket: formData.targetMarket || "General",
          marketSize: "",
          competitors: formData.competitiveLandscape || "",
          competitiveEdge: formData.uniqueValueProp || "",
        },
      });
      return response;
    },
    onSuccess: (data: ValidationResult) => {
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

  // Start over mutation
  const startOverMutation = useMutation({
    mutationFn: async () => {
      if (!savedIdea) return;
      await apiRequest(`/api/ideas/${savedIdea.id}`, {
        method: "PATCH",
        body: { status: "archived" },
      });
    },
    onSuccess: () => {
      setFormData({
        ideaTitle: "",
        problemStatement: "",
        solutionApproach: "",
        targetMarket: "",
        competitiveLandscape: "",
        businessModel: "",
        uniqueValueProp: "",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/ideas"] });
      toast({
        title: "Starting fresh",
        description: "Your previous idea has been archived.",
      });
    },
  });

  const handleValidate = () => {
    if (!formData.ideaTitle || !formData.problemStatement) {
      toast({
        title: "Required fields missing",
        description: "Please fill in at least the idea title and problem statement",
        variant: "destructive",
      });
      return;
    }
    validateMutation.mutate();
  };

  const hasValidatedIdea = Boolean(savedIdea?.validationScore);
  const validationResult = savedIdea?.validationResult;

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
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:block"><SidebarNavigation /></div>
      <MobileNavigation />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">The Validator</h1>
                  <p className="text-sm text-muted-foreground mt-1">AI-powered validation with real-time market research</p>
                </div>
              </div>
              {saveStatus !== "idle" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {saveStatus === "saving" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Check className="w-4 h-4 text-green-600" /> Saved</>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* LEFT: Form */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        {hasValidatedIdea ? "Your Validated Idea" : "Articulate Your Idea"}
                      </CardTitle>
                      {hasValidatedIdea && (
                        <Button variant="outline" size="sm" onClick={() => startOverMutation.mutate()} data-testid="button-start-over">
                          <RotateCcw className="w-4 h-4 mr-2" /> Start Over
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {hasValidatedIdea ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{savedIdea!.ideaTitle}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{savedIdea!.description}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-3xl font-bold ${getScoreColor(savedIdea!.validationScore)}`}>{savedIdea!.validationScore}</div>
                            <Badge className={getVerdictColor(savedIdea!.validationVerdict)}>{savedIdea!.validationVerdict}</Badge>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Idea Title */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Idea Title *</Label>
                            <Button variant="ghost" size="sm" onClick={() => handleAiSuggest("ideaTitle")} disabled={aiSuggesting === "ideaTitle"} data-testid="ai-suggest-ideaTitle">
                              {aiSuggesting === "ideaTitle" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                              <span className="ml-1 text-xs">AI Suggest</span>
                            </Button>
                          </div>
                          <Input placeholder="e.g., AI-Powered Pitch Deck Generator" value={formData.ideaTitle} onChange={(e) => handleFieldChange("ideaTitle", e.target.value)} data-testid="input-ideaTitle" />
                        </div>

                        {/* Problem Statement */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Problem Statement *</Label>
                            <Button variant="ghost" size="sm" onClick={() => handleAiSuggest("problemStatement")} disabled={aiSuggesting === "problemStatement"} data-testid="ai-suggest-problemStatement">
                              {aiSuggesting === "problemStatement" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                              <span className="ml-1 text-xs">AI Suggest</span>
                            </Button>
                          </div>
                          <Textarea placeholder="Who faces this problem? What is the problem? Why does it matter?" rows={4} value={formData.problemStatement} onChange={(e) => handleFieldChange("problemStatement", e.target.value)} data-testid="input-problemStatement" />
                        </div>

                        {/* Solution Approach */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Solution Approach</Label>
                            <Button variant="ghost" size="sm" onClick={() => handleAiSuggest("solutionApproach")} disabled={aiSuggesting === "solutionApproach"} data-testid="ai-suggest-solutionApproach">
                              {aiSuggesting === "solutionApproach" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                              <span className="ml-1 text-xs">AI Suggest</span>
                            </Button>
                          </div>
                          <Textarea placeholder="How does your solution work? What makes it unique?" rows={4} value={formData.solutionApproach} onChange={(e) => handleFieldChange("solutionApproach", e.target.value)} data-testid="input-solutionApproach" />
                        </div>

                        {/* Target Market */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Target Market</Label>
                            <Button variant="ghost" size="sm" onClick={() => handleAiSuggest("targetMarket")} disabled={aiSuggesting === "targetMarket"} data-testid="ai-suggest-targetMarket">
                              {aiSuggesting === "targetMarket" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                              <span className="ml-1 text-xs">AI Suggest</span>
                            </Button>
                          </div>
                          <Textarea placeholder="Who are your customers? Demographics, behaviors, market size..." rows={3} value={formData.targetMarket} onChange={(e) => handleFieldChange("targetMarket", e.target.value)} data-testid="input-targetMarket" />
                        </div>

                        {/* Competitive Landscape */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Competitive Landscape</Label>
                            <Button variant="ghost" size="sm" onClick={() => handleAiSuggest("competitiveLandscape")} disabled={aiSuggesting === "competitiveLandscape"} data-testid="ai-suggest-competitiveLandscape">
                              {aiSuggesting === "competitiveLandscape" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                              <span className="ml-1 text-xs">AI Suggest</span>
                            </Button>
                          </div>
                          <Textarea placeholder="Who are your competitors? Direct and indirect alternatives..." rows={3} value={formData.competitiveLandscape} onChange={(e) => handleFieldChange("competitiveLandscape", e.target.value)} data-testid="input-competitiveLandscape" />
                        </div>

                        {/* Business Model */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Business Model</Label>
                            <Button variant="ghost" size="sm" onClick={() => handleAiSuggest("businessModel")} disabled={aiSuggesting === "businessModel"} data-testid="ai-suggest-businessModel">
                              {aiSuggesting === "businessModel" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                              <span className="ml-1 text-xs">AI Suggest</span>
                            </Button>
                          </div>
                          <Textarea placeholder="How will you make money? Pricing, revenue streams..." rows={3} value={formData.businessModel} onChange={(e) => handleFieldChange("businessModel", e.target.value)} data-testid="input-businessModel" />
                        </div>

                        {/* Unique Value Prop */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Unique Value Proposition</Label>
                            <Button variant="ghost" size="sm" onClick={() => handleAiSuggest("uniqueValueProp")} disabled={aiSuggesting === "uniqueValueProp"} data-testid="ai-suggest-uniqueValueProp">
                              {aiSuggesting === "uniqueValueProp" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                              <span className="ml-1 text-xs">AI Suggest</span>
                            </Button>
                          </div>
                          <Textarea placeholder="What makes you uniquely valuable? Defensible advantages..." rows={3} value={formData.uniqueValueProp} onChange={(e) => handleFieldChange("uniqueValueProp", e.target.value)} data-testid="input-uniqueValueProp" />
                        </div>

                        <Button onClick={handleValidate} disabled={validateMutation.isPending} className="w-full" size="lg" data-testid="button-validate-enhanced">
                          {validateMutation.isPending ? (
                            <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Analyzing... (60-90s)</>
                          ) : (
                            <><ArrowRight className="w-4 h-4 mr-2" /> Validate My Idea</>
                          )}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* RIGHT: Results */}
              <div>
                {validationResult && hasValidatedIdea && (
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle>Validation Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {validationResult.marketResearch?.hasData && (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Real-time market research</p>
                            <p className="text-xs text-blue-700 dark:text-blue-300">{validationResult.marketResearch.totalSources} sources • {validationResult.marketResearch.timestamp}</p>
                          </div>
                        </div>
                      )}

                      {validationResult.ideaClarity && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm">Idea Clarity</h4>
                            <span className={`text-sm font-bold ${getScoreColor(validationResult.ideaClarity.score)}`}>{validationResult.ideaClarity.score}/100</span>
                          </div>
                          <Progress value={validationResult.ideaClarity.score} className="mb-2" />
                          <p className="text-sm text-muted-foreground italic">"{validationResult.ideaClarity.oneSentencePitch}"</p>
                        </div>
                      )}

                      {validationResult.marketValidation && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm">Market Opportunity</h4>
                            <span className={`text-sm font-bold ${getScoreColor(validationResult.marketValidation.score)}`}>{validationResult.marketValidation.score}/100</span>
                          </div>
                          <Progress value={validationResult.marketValidation.score} className="mb-3" />
                          <div className="space-y-2 text-sm">
                            <div><strong>TAM:</strong> {validationResult.marketValidation.tam}</div>
                            <div><strong>Timing:</strong> {validationResult.marketValidation.marketTiming}</div>
                          </div>
                        </div>
                      )}

                      {validationResult.recommendations && validationResult.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" /> Next Steps
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
