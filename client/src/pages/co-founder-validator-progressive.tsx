import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Sparkles, TrendingUp, Target, Lightbulb, ArrowRight, ArrowLeft, RotateCcw, CheckCircle2, Loader2, Save, Check, AlertTriangle, Edit, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import SidebarNavigation from "@/components/dashboard/sidebar-navigation";
import MobileNavigation from "@/components/mobile-navigation";
import { debounce } from "lodash";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import EnhancedTextarea from "@/components/enhanced-textarea";
import FormStepper from "@/components/form-stepper";
import LiveResearchProgress from "@/components/live-research-progress";
import { SaveStatusBar } from "@/components/save-status-bar";
import { SavedDataComparisonDialog } from "@/components/saved-data-comparison-dialog";

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
  updatedAt?: string;
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

const FORM_STEPS = [
  { number: 1, title: "Foundation", description: "Core idea & problem" },
  { number: 2, title: "Solution", description: "Approach & market" },
  { number: 3, title: "Strategy", description: "Competition & model" },
];

export default function CoFounderValidatorProgressive() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
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
  const [isRefining, setIsRefining] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);
  const [showClearDraftDialog, setShowClearDraftDialog] = useState(false);

  // Fetch existing idea
  const { data: savedIdea, isLoading: ideaLoading } = useQuery<SavedIdea | null>({
    queryKey: ["/api/ideas"],
  });

  // Load idea data when component mounts (for both draft and validated ideas)
  useEffect(() => {
    if (savedIdea) {
      setFormData({
        ideaTitle: savedIdea.ideaTitle || "",
        problemStatement: savedIdea.problemStatement || "",
        solutionApproach: savedIdea.solutionApproach || "",
        targetMarket: savedIdea.targetMarket || "",
        competitiveLandscape: savedIdea.competitiveLandscape || "",
        businessModel: savedIdea.businessModel || "",
        uniqueValueProp: savedIdea.uniqueValueProp || "",
      });
      
      // Initialize lastSavedAt from existing draft's updatedAt timestamp
      if (savedIdea.updatedAt) {
        setLastSavedAt(new Date(savedIdea.updatedAt));
      }
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
      setLastSavedAt(new Date());
      // Invalidate /api/ideas query to sync comparison dialog data
      queryClient.invalidateQueries({ queryKey: ["/api/ideas"] });
      setTimeout(() => setSaveStatus("idle"), 2000);
    },
    onError: () => setSaveStatus("idle"),
  });

  // Manual save mutation
  const manualSaveMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/journey/auto-save", {
        method: "POST",
        body: { draftData: formData },
      });
    },
    onSuccess: () => {
      setLastSavedAt(new Date());
      toast({
        title: "Draft Saved",
        description: "Your idea has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/ideas"] });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Could not save your draft. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete draft mutation
  const deleteDraftMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/journey/delete-draft", {
        method: "DELETE",
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
      setLastSavedAt(null);
      setCurrentStep(1);
      setShowSummary(false);
      queryClient.invalidateQueries({ queryKey: ["/api/ideas"] });
      toast({
        title: "Draft Cleared",
        description: "Your draft has been deleted. Starting fresh!",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Could not delete your draft. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Debounced auto-save
  const debouncedSave = useCallback(
    debounce((data: IdeaFormData) => {
      autoSaveMutation.mutate(data);
    }, 500),
    []
  );

  // Handle field change
  const handleFieldChange = (field: keyof IdeaFormData, value: string) => {
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
      handleFieldChange(fieldName as keyof IdeaFormData, suggestion);
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
      if (savedIdea?.validationScore && isRefining) {
        setPreviousScore(savedIdea.validationScore);
      }
      
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
          isRefinement: isRefining,
        },
      });
      return response;
    },
    onSuccess: (data: ValidationResult) => {
      queryClient.invalidateQueries({ queryKey: ["/api/ideas"] });
      
      if (isRefining && previousScore !== null) {
        const scoreDiff = data.score - previousScore;
        const diffText = scoreDiff > 0 ? `+${scoreDiff}` : `${scoreDiff}`;
        toast({
          title: "Re-Validation Complete!",
          description: `Your idea scored ${data.score}/100 (${diffText}) - ${data.verdict}`,
        });
        setIsRefining(false);
        setShowSummary(false);
      } else {
        toast({
          title: "Validation Complete!",
          description: `Your idea scored ${data.score}/100 - ${data.verdict}`,
        });
        setShowSummary(false);
      }
    },
    onError: () => {
      toast({
        title: "Validation Failed",
        description: "Could not validate your idea. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleValidate = () => {
    if (!formData.ideaTitle.trim() || !formData.problemStatement.trim()) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in at least the Idea Title and Problem Statement.",
        variant: "destructive",
      });
      return;
    }
    validateMutation.mutate();
  };

  const handleRefineIdea = () => {
    setIsRefining(true);
    setCurrentStep(1);
    setShowSummary(false);
  };

  const handleDeleteIdea = async () => {
    try {
      await apiRequest("/api/ideas", { method: "DELETE" });
      queryClient.invalidateQueries({ queryKey: ["/api/ideas"] });
      toast({
        title: "Idea Deleted",
        description: "Your previous idea has been archived. Start fresh!",
      });
      setShowDeleteDialog(false);
      setIsRefining(false);
      setCurrentStep(1);
      setShowSummary(false);
      setFormData({
        ideaTitle: "",
        problemStatement: "",
        solutionApproach: "",
        targetMarket: "",
        competitiveLandscape: "",
        businessModel: "",
        uniqueValueProp: "",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Could not delete your idea. Please try again.",
        variant: "destructive",
      });
    }
  };

  const hasValidatedIdea = savedIdea && savedIdea.validationScore > 0;
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

  const canProceedToNextStep = () => {
    if (currentStep === 1) {
      return formData.ideaTitle.trim() && formData.problemStatement.trim();
    }
    return true; // Steps 2-3 are optional
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
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      {hasValidatedIdea && !isRefining ? "Your Validated Idea" : "Articulate Your Idea"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {hasValidatedIdea && !isRefining ? (
                      <div className="space-y-6">
                        {/* Validated Idea Summary */}
                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{savedIdea!.ideaTitle}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{savedIdea!.problemStatement}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-3xl font-bold ${getScoreColor(savedIdea!.validationScore)}`}>{savedIdea!.validationScore}</div>
                            <Badge className={getVerdictColor(savedIdea!.validationVerdict)}>{savedIdea!.validationVerdict}</Badge>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid gap-3">
                          <Button onClick={handleRefineIdea} className="w-full" size="lg" data-testid="button-refine-idea">
                            <Edit className="w-4 h-4 mr-2" />
                            Refine & Re-Validate
                          </Button>
                          
                          {savedIdea!.validationScore >= 60 && (
                            <Button 
                              onClick={() => setLocation("/co-founder/strategist")} 
                              variant="outline" 
                              className="w-full" 
                              size="lg"
                              data-testid="button-continue-strategist"
                            >
                              <ArrowRight className="w-4 h-4 mr-2" />
                              Continue to The Strategist
                            </Button>
                          )}
                          
                          <Button 
                            onClick={() => setShowDeleteDialog(true)} 
                            variant="destructive" 
                            className="w-full" 
                            size="lg"
                            data-testid="button-start-over"
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Start Over
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Save Status Bar */}
                        <SaveStatusBar
                          lastSavedAt={lastSavedAt}
                          isSaving={saveStatus === "saving" || manualSaveMutation.isPending}
                          onViewSaved={() => setShowComparisonDialog(true)}
                          onSaveNow={() => manualSaveMutation.mutate()}
                          onClearDraft={() => setShowClearDraftDialog(true)}
                        />

                        {/* Multi-Step Form */}
                        {!showSummary && (
                          <FormStepper steps={FORM_STEPS} currentStep={currentStep} />
                        )}

                        <AnimatePresence mode="wait">
                          {showSummary ? (
                            /* Summary View */
                            <motion.div
                              key="summary"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-4"
                            >
                              <div className="text-center mb-6">
                                <h3 className="text-xl font-semibold mb-2">Review Your Idea</h3>
                                <p className="text-sm text-muted-foreground">
                                  Everything looks good? Let's validate it!
                                </p>
                              </div>

                              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                {formData.ideaTitle && (
                                  <div className="p-4 bg-muted/30 rounded-lg">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Idea Title</p>
                                    <p className="font-semibold">{formData.ideaTitle}</p>
                                  </div>
                                )}
                                {formData.problemStatement && (
                                  <div className="p-4 bg-muted/30 rounded-lg">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Problem Statement</p>
                                    <p className="text-sm">{formData.problemStatement}</p>
                                  </div>
                                )}
                                {formData.solutionApproach && (
                                  <div className="p-4 bg-muted/30 rounded-lg">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Solution Approach</p>
                                    <p className="text-sm">{formData.solutionApproach}</p>
                                  </div>
                                )}
                                {formData.targetMarket && (
                                  <div className="p-4 bg-muted/30 rounded-lg">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Target Market</p>
                                    <p className="text-sm">{formData.targetMarket}</p>
                                  </div>
                                )}
                                {formData.competitiveLandscape && (
                                  <div className="p-4 bg-muted/30 rounded-lg">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Competitive Landscape</p>
                                    <p className="text-sm">{formData.competitiveLandscape}</p>
                                  </div>
                                )}
                                {formData.businessModel && (
                                  <div className="p-4 bg-muted/30 rounded-lg">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Business Model</p>
                                    <p className="text-sm">{formData.businessModel}</p>
                                  </div>
                                )}
                                {formData.uniqueValueProp && (
                                  <div className="p-4 bg-muted/30 rounded-lg">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Unique Value Proposition</p>
                                    <p className="text-sm">{formData.uniqueValueProp}</p>
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-3 pt-4">
                                <Button
                                  onClick={() => setShowSummary(false)}
                                  variant="outline"
                                  className="flex-1"
                                  size="lg"
                                >
                                  <ArrowLeft className="w-4 h-4 mr-2" />
                                  Edit
                                </Button>
                                <Button
                                  onClick={handleValidate}
                                  disabled={validateMutation.isPending}
                                  className="flex-1"
                                  size="lg"
                                  data-testid="button-validate-enhanced"
                                >
                                  {validateMutation.isPending ? (
                                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Analyzing...</>
                                  ) : (
                                    <><Sparkles className="w-4 h-4 mr-2" /> Validate My Idea</>
                                  )}
                                </Button>
                              </div>
                            </motion.div>
                          ) : (
                            /* Step-by-Step Form */
                            <motion.div
                              key={`step-${currentStep}`}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-6"
                            >
                              {currentStep === 1 && (
                                <>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label className="flex items-center gap-1">
                                        Idea Title
                                        <span className="text-red-500">*</span>
                                      </Label>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleAiSuggest("ideaTitle")}
                                        disabled={aiSuggesting === "ideaTitle"}
                                        className="h-7 text-xs"
                                      >
                                        {aiSuggesting === "ideaTitle" ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
                                        AI Suggest
                                      </Button>
                                    </div>
                                    <Input
                                      placeholder="e.g., AI-Powered Pitch Deck Generator"
                                      value={formData.ideaTitle}
                                      onChange={(e) => handleFieldChange("ideaTitle", e.target.value)}
                                      data-testid="input-ideaTitle"
                                      className="h-12 text-lg"
                                    />
                                  </div>

                                  <EnhancedTextarea
                                    label="Problem Statement"
                                    placeholder="Who faces this problem? What is the problem? Why does it matter?"
                                    value={formData.problemStatement}
                                    onChange={(value) => handleFieldChange("problemStatement", value)}
                                    onAiSuggest={() => handleAiSuggest("problemStatement")}
                                    isAiSuggesting={aiSuggesting === "problemStatement"}
                                    required
                                    minRows={4}
                                    maxRows={12}
                                    testId="problemStatement"
                                  />
                                </>
                              )}

                              {currentStep === 2 && (
                                <>
                                  <EnhancedTextarea
                                    label="Solution Approach"
                                    placeholder="How does your solution work? What makes it unique?"
                                    value={formData.solutionApproach}
                                    onChange={(value) => handleFieldChange("solutionApproach", value)}
                                    onAiSuggest={() => handleAiSuggest("solutionApproach")}
                                    isAiSuggesting={aiSuggesting === "solutionApproach"}
                                    minRows={4}
                                    maxRows={12}
                                    testId="solutionApproach"
                                  />

                                  <EnhancedTextarea
                                    label="Target Market"
                                    placeholder="Who are your customers? Demographics, behaviors, market size..."
                                    value={formData.targetMarket}
                                    onChange={(value) => handleFieldChange("targetMarket", value)}
                                    onAiSuggest={() => handleAiSuggest("targetMarket")}
                                    isAiSuggesting={aiSuggesting === "targetMarket"}
                                    minRows={3}
                                    maxRows={10}
                                    testId="targetMarket"
                                  />
                                </>
                              )}

                              {currentStep === 3 && (
                                <>
                                  <EnhancedTextarea
                                    label="Competitive Landscape"
                                    placeholder="Who are your competitors? Direct and indirect alternatives..."
                                    value={formData.competitiveLandscape}
                                    onChange={(value) => handleFieldChange("competitiveLandscape", value)}
                                    onAiSuggest={() => handleAiSuggest("competitiveLandscape")}
                                    isAiSuggesting={aiSuggesting === "competitiveLandscape"}
                                    minRows={3}
                                    maxRows={10}
                                    testId="competitiveLandscape"
                                  />

                                  <EnhancedTextarea
                                    label="Business Model"
                                    placeholder="How will you make money? Pricing, revenue streams..."
                                    value={formData.businessModel}
                                    onChange={(value) => handleFieldChange("businessModel", value)}
                                    onAiSuggest={() => handleAiSuggest("businessModel")}
                                    isAiSuggesting={aiSuggesting === "businessModel"}
                                    minRows={3}
                                    maxRows={10}
                                    testId="businessModel"
                                  />

                                  <EnhancedTextarea
                                    label="Unique Value Proposition"
                                    placeholder="What makes you uniquely valuable? Defensible advantages..."
                                    value={formData.uniqueValueProp}
                                    onChange={(value) => handleFieldChange("uniqueValueProp", value)}
                                    onAiSuggest={() => handleAiSuggest("uniqueValueProp")}
                                    isAiSuggesting={aiSuggesting === "uniqueValueProp"}
                                    minRows={3}
                                    maxRows={10}
                                    testId="uniqueValueProp"
                                  />
                                </>
                              )}

                              {/* Navigation Buttons */}
                              <div className="flex gap-3 pt-4">
                                {currentStep > 1 && (
                                  <Button
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                    variant="outline"
                                    size="lg"
                                    className="flex-1"
                                  >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Previous
                                  </Button>
                                )}

                                {currentStep < 3 ? (
                                  <Button
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    disabled={!canProceedToNextStep()}
                                    size="lg"
                                    className="flex-1"
                                  >
                                    Next
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={() => setShowSummary(true)}
                                    disabled={!canProceedToNextStep()}
                                    size="lg"
                                    className="flex-1"
                                  >
                                    Review & Validate
                                    <CheckCircle2 className="w-4 h-4 ml-2" />
                                  </Button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* RIGHT: Results / Progress */}
              <div>
                {validateMutation.isPending ? (
                  <LiveResearchProgress isValidating={true} />
                ) : validationResult && hasValidatedIdea ? (
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
                        </div>
                      )}

                      {validationResult.recommendations && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Key Recommendations</h4>
                          <ul className="space-y-2">
                            {validationResult.recommendations.slice(0, 3).map((rec, idx) => (
                              <li key={idx} className="text-sm flex gap-2">
                                <span className="text-primary">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        What Happens Next?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">1</div>
                          <div>
                            <p className="font-medium text-sm">Fill out your idea</p>
                            <p className="text-xs text-muted-foreground">Answer the guided questions step-by-step</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">2</div>
                          <div>
                            <p className="font-medium text-sm">Live market research</p>
                            <p className="text-xs text-muted-foreground">AI analyzes competitors, market trends, and funding</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">3</div>
                          <div>
                            <p className="font-medium text-sm">Get validation score</p>
                            <p className="text-xs text-muted-foreground">Receive GO/REFINE/PIVOT verdict with actionable insights</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Data Comparison Dialog */}
      <SavedDataComparisonDialog
        open={showComparisonDialog}
        onOpenChange={setShowComparisonDialog}
        savedData={savedIdea ? {
          ideaTitle: savedIdea.ideaTitle || "",
          problemStatement: savedIdea.problemStatement || "",
          solutionApproach: savedIdea.solutionApproach || "",
          targetMarket: savedIdea.targetMarket || "",
          competitiveLandscape: savedIdea.competitiveLandscape || "",
          businessModel: savedIdea.businessModel || "",
          uniqueValueProp: savedIdea.uniqueValueProp || "",
        } : null}
        currentData={formData}
      />

      {/* Clear Draft Confirmation Dialog */}
      <AlertDialog open={showClearDraftDialog} onOpenChange={setShowClearDraftDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Draft?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete your current draft and reset the form. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteDraftMutation.mutate();
                setShowClearDraftDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Clear Draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Your Idea?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your idea and all validation data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteIdea}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
