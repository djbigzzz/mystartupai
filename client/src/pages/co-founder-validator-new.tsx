import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Target,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BarChart3,
  Award,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Lightbulb,
  Users,
  Swords,
  Globe,
  DollarSign,
  Beaker,
  Zap,
} from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/theme-context";
import MobileNavigation from "@/components/mobile-navigation";
import SidebarNavigation from "@/components/dashboard/sidebar-navigation";
import ThemeBackgroundEffects from "@/components/theme-background-effects";
import { IdeaLibrary } from "@/components/idea-library";
import { AIWorkspace } from "@/components/ai-workspace";

interface ValidationResult {
  idea: string;
  score: number;
  verdict: "GO" | "REFINE" | "PIVOT";
  ideaClarity: {
    score: number;
    problemDefinition: string;
    solutionClarity: string;
    oneSentencePitch: string;
  };
  marketValidation: {
    score: number;
    tam: string;
    sam: string;
    som: string;
    growthRate: string;
    marketTiming: string;
    whyNow: string[];
  };
  competitiveIntelligence: {
    score: number;
    competitionLevel: string;
    directCompetitors: string[];
    competitiveEdge: string;
  };
  customerDiscovery: {
    score: number;
    personaClarity: string;
    painPointSeverity: number;
    willingnessToPay: string;
    earlyAdopterProfile: string;
  };
  problemSolutionFit: {
    score: number;
    problemSeverity: number;
    solutionFeasibility: number;
    tenXTest: string;
    recommendation: string;
  };
  riskAssessment: {
    score: number;
    topRisks: string[];
    topOpportunities: string[];
  };
  validationExperiments: {
    experiments: Array<{
      name: string;
      description: string;
      week: number;
    }>;
  };
  recommendations: string[];
  marketResearch?: {
    hasData: boolean;
    timestamp?: string;
    totalSources?: number;
  };
}

export default function CoFounderValidatorNew() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { theme } = useTheme();

  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Validation mutation
  const validateMutation = useMutation({
    mutationFn: async (data: { title: string; description: string }) => {
      const response = await apiRequest("/api/journey/validate", {
        method: "POST",
        body: {
          ideaTitle: data.title,
          idea: data.description, // Backend expects 'idea' field
          industry: "Technology", // Default, AI will determine
          stage: "Idea Stage",
          problemStatement: data.description,
          solutionApproach: data.description,
          targetMarket: "General",
          marketSize: "",
          competitors: "",
          competitiveAdvantage: "",
        },
      });
      return response;
    },
    onSuccess: (data: ValidationResult) => {
      setValidationResult(data);
      queryClient.invalidateQueries({ queryKey: ["/api/ideas"] });
      toast({
        title: "Validation Complete",
        description: `Your idea scored ${data.score}/100`,
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

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400 bg-green-500/10";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10";
    return "text-red-600 dark:text-red-400 bg-red-500/10";
  };

  const dimensionConfigs = [
    {
      key: "ideaClarity",
      title: "Idea Clarity",
      icon: Lightbulb,
      color: "blue",
    },
    {
      key: "marketValidation",
      title: "Market Validation",
      icon: TrendingUp,
      color: "green",
    },
    {
      key: "competitiveIntelligence",
      title: "Competitive Intelligence",
      icon: Swords,
      color: "orange",
    },
    {
      key: "customerDiscovery",
      title: "Customer Discovery",
      icon: Users,
      color: "purple",
    },
    {
      key: "problemSolutionFit",
      title: "Problem-Solution Fit",
      icon: Target,
      color: "red",
    },
    {
      key: "riskAssessment",
      title: "Risk Assessment",
      icon: AlertTriangle,
      color: "yellow",
    },
    {
      key: "marketValidation",
      title: "Go-To-Market",
      icon: Globe,
      color: "indigo",
    },
    {
      key: "validationExperiments",
      title: "Validation Path",
      icon: Beaker,
      color: "teal",
    },
  ];

  return (
    <div className="min-h-screen flex relative">
      {/* Theme background effects */}
      <ThemeBackgroundEffects />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarNavigation />
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNavigation />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Page Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  The Validator
                </h1>
                <p className="text-sm text-muted-foreground">
                  AI-powered validation with real-time market research
                </p>
              </div>
              {validationResult && (
                <Button
                  variant="outline"
                  onClick={() => setValidationResult(null)}
                  data-testid="button-back"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 container mx-auto px-4 py-6">
          {!validationResult ? (
            /* Three-Pane Dashboard */
            <div className="grid lg:grid-cols-[320px_1fr] gap-6 h-[calc(100vh-180px)]">
              {/* Left: Idea Library */}
              <div className="hidden lg:block overflow-hidden">
                <IdeaLibrary
                  onSelectIdea={(idea) => {
                    setSelectedIdea(idea);
                    if (idea.validationResult) {
                      setValidationResult(idea.validationResult);
                    }
                  }}
                  selectedIdeaId={selectedIdea?.id}
                />
              </div>

              {/* Center: AI Workspace */}
              <div className="overflow-hidden">
                <AIWorkspace
                  onValidate={(data) => validateMutation.mutate(data)}
                  isValidating={validateMutation.isPending}
                />
              </div>
            </div>
          ) : (
            /* Validation Results */
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Overall Score Card */}
              <Card className="border-2 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div>
                      <div className="text-6xl font-bold gradient-text-primary">
                        {validationResult.score}
                        <span className="text-3xl text-muted-foreground">/100</span>
                      </div>
                      <Progress value={validationResult.score} className="h-3 mt-4" />
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      {validationResult.verdict === "GO" && (
                        <Badge
                          variant="outline"
                          className="text-lg px-4 py-2 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/50"
                        >
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          VERDICT: GO
                        </Badge>
                      )}
                      {validationResult.verdict === "REFINE" && (
                        <Badge
                          variant="outline"
                          className="text-lg px-4 py-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/50"
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                          VERDICT: REFINE
                        </Badge>
                      )}
                      {validationResult.verdict === "PIVOT" && (
                        <Badge
                          variant="outline"
                          className="text-lg px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/50"
                        >
                          <XCircle className="w-5 h-5 mr-2" />
                          VERDICT: PIVOT
                        </Badge>
                      )}
                    </div>

                    {validationResult.marketResearch?.hasData && (
                      <Badge variant="secondary">
                        <BarChart3 className="w-3 h-3 mr-1" />
                        {validationResult.marketResearch.totalSources} live sources analyzed
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 8 Dimensions Breakdown */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Validation Breakdown</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {dimensionConfigs.map((config) => {
                    const dimensionData = validationResult[config.key as keyof ValidationResult] as any;
                    if (!dimensionData || typeof dimensionData.score === "undefined") {
                      return null;
                    }
                    const DimensionIcon = config.icon;
                    const isExpanded = expandedSections[config.key];

                    return (
                      <Card
                        key={config.key}
                        className="border-2 cursor-pointer hover:border-primary/50 transition-all"
                        onClick={() => toggleSection(config.key)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <DimensionIcon className="w-5 h-5" />
                              <CardTitle className="text-lg">{config.title}</CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getScoreColor(dimensionData.score)}>
                                {dimensionData.score}/10
                              </Badge>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </div>
                          </div>
                          <Progress value={dimensionData.score * 10} className="h-2" />
                        </CardHeader>
                        {isExpanded && (
                          <CardContent className="pt-0 space-y-2 text-sm">
                            {Object.entries(dimensionData).map(([key, value]) => {
                              if (key === "score" || !value) return null;
                              return (
                                <div key={key} className="border-l-2 border-muted pl-3 py-1">
                                  <p className="text-xs text-muted-foreground capitalize">
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </p>
                                  <p className="text-foreground">
                                    {Array.isArray(value) ? value.join(", ") : value.toString()}
                                  </p>
                                </div>
                              );
                            })}
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations */}
              {validationResult.recommendations && validationResult.recommendations.length > 0 && (
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Key Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {validationResult.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </span>
                          <p className="text-sm flex-1">{rec}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
