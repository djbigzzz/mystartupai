import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Target, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  Lightbulb,
  Users,
  Swords,
  BarChart3,
  Globe,
  DollarSign,
  Beaker,
  RefreshCcw,
  ChevronDown,
  ChevronUp,
  Zap,
  Award
} from "lucide-react";
import { useLocation } from "wouter";
import { AuroraBackground } from "@/components/react-bits/aurora-background";
import { SplitText } from "@/components/react-bits/split-text";
import { AnimatedGradient } from "@/components/react-bits/animated-gradient";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/theme-context";
import MobileNavigation from "@/components/mobile-navigation";
import SidebarNavigation from "@/components/dashboard/sidebar-navigation";
import ThemeBackgroundEffects from "@/components/theme-background-effects";
import { CypherpunkEffects } from "@/components/cypherpunk-effects";
import validatorAvatar from "@assets/generated_images/The_Validator_3D_avatar_dd365c22.png";

interface ValidationResult {
  idea: string;
  score: number;
  verdict: 'GO' | 'REFINE' | 'PIVOT';
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
    sources?: {
      competitors: number;
      marketTrends: number;
      customerInsights: number;
      fundingLandscape: number;
    };
    totalSources?: number;
    message?: string;
  };
}

export default function CoFounderValidator() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { theme } = useTheme();
  
  // Form state
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaDescription, setIdeaDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [stage, setStage] = useState("idea");
  const [problemStatement, setProblemStatement] = useState("");
  const [solutionApproach, setSolutionApproach] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [marketSize, setMarketSize] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [competitiveEdge, setCompetitiveEdge] = useState("");
  
  const [showResults, setShowResults] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Fetch validation result if exists
  const { data: validationResult, isLoading: isLoadingResult } = useQuery<ValidationResult>({
    queryKey: ['/api/journey/validation'],
  });

  // Auto-show results when validation data is loaded
  useEffect(() => {
    if (validationResult) {
      setShowResults(true);
    }
  }, [validationResult]);

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // AI Improve mutation
  const aiImproveMutation = useMutation({
    mutationFn: async ({ text, fieldType }: { text: string; fieldType: string }) => {
      const response = await apiRequest('/api/journey/ai-improve', {
        method: 'POST',
        body: { text, fieldType },
      });
      return response;
    },
    onSuccess: (data, variables) => {
      const improvedText = data.improvedText;
      
      // Update the appropriate field based on fieldType
      switch (variables.fieldType) {
        case 'title':
          setIdeaTitle(improvedText);
          break;
        case 'description':
          setIdeaDescription(improvedText);
          break;
        case 'problem':
          setProblemStatement(improvedText);
          break;
        case 'solution':
          setSolutionApproach(improvedText);
          break;
        case 'target':
          setTargetMarket(improvedText);
          break;
        case 'market-size':
          setMarketSize(improvedText);
          break;
        case 'competitors':
          setCompetitors(improvedText);
          break;
        case 'edge':
          setCompetitiveEdge(improvedText);
          break;
      }
      
      toast({
        title: "✨ Text Enhanced",
        description: "AI has improved your content",
      });
    },
    onError: () => {
      toast({
        title: "Enhancement Failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleAIImprove = (fieldType: string, currentText: string) => {
    if (!currentText || currentText.trim().length === 0) {
      toast({
        title: "No Text to Improve",
        description: "Please enter some text first",
        variant: "destructive",
      });
      return;
    }
    
    aiImproveMutation.mutate({ text: currentText, fieldType });
  };

  // Validate idea mutation
  const validateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/journey/validate', {
        method: 'POST',
        body: { 
          ideaTitle,
          idea: ideaDescription,
          industry,
          stage,
          problemStatement,
          solutionApproach,
          targetMarket,
          marketSize,
          competitors,
          competitiveEdge
        },
      });
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/journey/validation'] });
      queryClient.invalidateQueries({ queryKey: ['/api/journey/progress'] });
      setShowResults(true);
      toast({
        title: "Validation Complete! 🎯",
        description: `Your idea scored ${data.score}/100`,
      });
    },
    onError: () => {
      toast({
        title: "Validation Failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleValidate = () => {
    if (!ideaTitle.trim() || !ideaDescription.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in at least the idea title and description",
        variant: "destructive",
      });
      return;
    }
    validateMutation.mutate();
  };

  const getVerdictConfig = (verdict: string) => {
    switch (verdict) {
      case 'GO':
        return {
          color: 'from-green-500 to-emerald-600',
          icon: CheckCircle2,
          bg: 'bg-green-500/10',
          border: 'border-green-500/50',
          text: 'text-green-600 dark:text-green-400'
        };
      case 'REFINE':
        return {
          color: 'from-yellow-500 to-orange-600',
          icon: AlertTriangle,
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/50',
          text: 'text-yellow-600 dark:text-yellow-400'
        };
      case 'PIVOT':
        return {
          color: 'from-red-500 to-pink-600',
          icon: RefreshCcw,
          bg: 'bg-red-500/10',
          border: 'border-red-500/50',
          text: 'text-red-600 dark:text-red-400'
        };
      default:
        return {
          color: 'from-gray-500 to-gray-600',
          icon: Target,
          bg: 'bg-gray-500/10',
          border: 'border-gray-500/50',
          text: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const dimensionConfigs = [
    { key: 'ideaClarity', title: 'Idea Clarity', icon: Lightbulb, color: 'blue' },
    { key: 'marketValidation', title: 'Market Size', icon: TrendingUp, color: 'purple' },
    { key: 'competitiveIntelligence', title: 'Competition', icon: Swords, color: 'orange' },
    { key: 'customerDiscovery', title: 'Customer Fit', icon: Users, color: 'pink' },
    { key: 'problemSolutionFit', title: 'Problem-Solution Fit', icon: Target, color: 'green' },
    { key: 'riskAssessment', title: 'Risk Analysis', icon: AlertTriangle, color: 'red' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex" data-page="co-founder-validator">
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNavigation />
      </div>
      
      {/* Sidebar Navigation - Desktop Only */}
      <div className="hidden lg:block">
        <SidebarNavigation />
      </div>

      {/* Main Content with Theme Effects */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0 relative overflow-hidden">
        {/* Theme-aware background effects */}
        <ThemeBackgroundEffects />
        <CypherpunkEffects />

        {/* ReactBits effects - only show in dark theme */}
        {theme === "dark" && (
          <>
            <AuroraBackground 
              className="opacity-20"
              colors={[
                "rgba(59, 130, 246, 0.4)",
                "rgba(139, 92, 246, 0.3)",
                "rgba(96, 165, 250, 0.4)",
              ]}
              speed={0.002}
            />
            <AnimatedGradient 
              className="opacity-5"
              colors={["#3b82f6", "#8b5cf6", "#60a5fa"]}
              speed={3}
              blur={100}
            />
          </>
        )}

        {/* Grid pattern - theme-aware */}
        <div className={`absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] ${
          theme === "light" ? "opacity-5" : theme === "cypherpunk" ? "opacity-15" : "opacity-8"
        }`}></div>

        {/* Page Content */}
        <div className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header with Character Avatar */}
            <div className="text-center mb-12">
              <div className="flex flex-col items-center gap-6 mb-6">
                {/* Vale's Avatar */}
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-blue-500/50 shadow-2xl">
                  <img 
                    src={validatorAvatar} 
                    alt="Vale - The Validator"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Name and Title */}
                <div>
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <SplitText
                      text="Vale"
                      tag="h1"
                      className={`text-6xl font-bold ${
                        theme === "cypherpunk" 
                          ? "text-primary" 
                          : "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 text-transparent bg-clip-text"
                      }`}
                      splitType="chars"
                      delay={25}
                      duration={0.5}
                    />
                  </div>
                  <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-3">
                    The Validator
                  </p>
                </div>
              </div>

              {/* Welcome Message from Vale */}
              <Card className="max-w-3xl mx-auto mb-6 border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/5">
                <CardContent className="p-6">
                  <p className="text-lg text-foreground/90 italic">
                    "Hey there! I'm Vale, your analytical co-founder who won't let you skip validation. 
                    I'll analyze 8 critical dimensions with real-time market research so you build the right thing. 
                    Let's make sure your idea is worth pursuing."
                  </p>
                </CardContent>
              </Card>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Badge variant="secondary" className="text-sm">
                  <Target className="w-3 h-3 mr-1" />
                  Evidence-based
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Data-driven
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Thorough
                </Badge>
                {validationResult?.marketResearch?.hasData && (
                  <Badge variant="outline" className="text-sm border-green-500/50 bg-green-500/10">
                    <Globe className="w-3 h-3 mr-1" />
                    Market Research: {validationResult.marketResearch.totalSources} sources
                  </Badge>
                )}
              </div>
            </div>

            {!showResults || !validationResult ? (
              /* ========== VALIDATION FORM ========== */
              <div className="max-w-5xl mx-auto">
                <div className="grid gap-6">
                  {/* Step 1: Idea Overview */}
                  <Card className="border-2 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold">
                          1
                        </div>
                        <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Idea Overview
                      </CardTitle>
                      <CardDescription>What's your startup about?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Idea Title *</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAIImprove('title', ideaTitle)}
                            disabled={aiImproveMutation.isPending || !ideaTitle}
                            className="h-8 text-xs"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Enhance
                          </Button>
                        </div>
                        <Input
                          placeholder="e.g., FarmConnect - Local food marketplace"
                          value={ideaTitle}
                          onChange={(e) => setIdeaTitle(e.target.value)}
                          className="text-lg font-medium"
                          data-testid="input-idea-title"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>One-Sentence Description *</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAIImprove('description', ideaDescription)}
                            disabled={aiImproveMutation.isPending || !ideaDescription}
                            className="h-8 text-xs"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Enhance
                          </Button>
                        </div>
                        <Textarea
                          placeholder="What does your startup do? Be specific about the problem, solution, and target customer."
                          value={ideaDescription}
                          onChange={(e) => setIdeaDescription(e.target.value)}
                          rows={3}
                          className="resize-none"
                          data-testid="input-idea-description"
                        />
                        <p className="text-xs text-muted-foreground">
                          {ideaDescription.length}/500 characters
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Industry</Label>
                          <Select value={industry} onValueChange={setIndustry}>
                            <SelectTrigger data-testid="select-industry">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="agriculture">Agriculture & Food</SelectItem>
                              <SelectItem value="fintech">FinTech</SelectItem>
                              <SelectItem value="healthtech">HealthTech</SelectItem>
                              <SelectItem value="edtech">EdTech</SelectItem>
                              <SelectItem value="ecommerce">E-Commerce</SelectItem>
                              <SelectItem value="saas">SaaS / B2B Software</SelectItem>
                              <SelectItem value="marketplace">Marketplace</SelectItem>
                              <SelectItem value="consumer">Consumer</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Current Stage</Label>
                          <Select value={stage} onValueChange={setStage}>
                            <SelectTrigger data-testid="select-stage">
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="idea">Idea Stage</SelectItem>
                              <SelectItem value="prototype">Prototype</SelectItem>
                              <SelectItem value="mvp">MVP / Beta</SelectItem>
                              <SelectItem value="launched">Launched</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step 2: Problem & Solution */}
                  <Card className="border-2 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold">
                          2
                        </div>
                        <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        Problem & Solution
                      </CardTitle>
                      <CardDescription>Define the problem and your approach</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            Problem Statement
                            <Badge variant="destructive" className="text-xs">Critical</Badge>
                          </Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAIImprove('problem', problemStatement)}
                            disabled={aiImproveMutation.isPending || !problemStatement}
                            className="h-8 text-xs"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Enhance
                          </Button>
                        </div>
                        <Textarea
                          placeholder="What specific problem are you solving? Who faces this problem and why does it matter?"
                          value={problemStatement}
                          onChange={(e) => setProblemStatement(e.target.value)}
                          rows={4}
                          className="resize-none"
                          data-testid="input-problem-statement"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Solution Approach</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAIImprove('solution', solutionApproach)}
                            disabled={aiImproveMutation.isPending || !solutionApproach}
                            className="h-8 text-xs"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Enhance
                          </Button>
                        </div>
                        <Textarea
                          placeholder="How does your solution work? What makes it unique and 10x better?"
                          value={solutionApproach}
                          onChange={(e) => setSolutionApproach(e.target.value)}
                          rows={4}
                          className="resize-none"
                          data-testid="input-solution-approach"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step 3: Market & Customers */}
                  <Card className="border-2 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 font-bold">
                          3
                        </div>
                        <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                        Market & Customers
                      </CardTitle>
                      <CardDescription>Who are you building this for?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Target Customer</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAIImprove('target', targetMarket)}
                            disabled={aiImproveMutation.isPending || !targetMarket}
                            className="h-8 text-xs"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Enhance
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Describe your ideal customer: demographics, behaviors, pain points, and why they'll love your solution."
                          value={targetMarket}
                          onChange={(e) => setTargetMarket(e.target.value)}
                          rows={3}
                          className="resize-none"
                          data-testid="input-target-market"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Market Size (Optional)</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAIImprove('market-size', marketSize)}
                            disabled={aiImproveMutation.isPending || !marketSize}
                            className="h-8 text-xs"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Enhance
                          </Button>
                        </div>
                        <Textarea
                          placeholder="TAM, SAM, SOM estimates if you have them. AI will analyze market size if left blank."
                          value={marketSize}
                          onChange={(e) => setMarketSize(e.target.value)}
                          rows={2}
                          className="resize-none"
                          data-testid="input-market-size"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step 4: Competition */}
                  <Card className="border-2 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold">
                          4
                        </div>
                        <Swords className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        Competition & Edge
                      </CardTitle>
                      <CardDescription>What alternatives exist and why are you different?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Existing Competitors</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAIImprove('competitors', competitors)}
                            disabled={aiImproveMutation.isPending || !competitors}
                            className="h-8 text-xs"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Enhance
                          </Button>
                        </div>
                        <Textarea
                          placeholder="List direct and indirect competitors. AI will conduct live market research to find more."
                          value={competitors}
                          onChange={(e) => setCompetitors(e.target.value)}
                          rows={2}
                          className="resize-none"
                          data-testid="input-competitors"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Your Competitive Advantage</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAIImprove('edge', competitiveEdge)}
                            disabled={aiImproveMutation.isPending || !competitiveEdge}
                            className="h-8 text-xs"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Enhance
                          </Button>
                        </div>
                        <Textarea
                          placeholder="What makes you different? Why will customers choose you over alternatives?"
                          value={competitiveEdge}
                          onChange={(e) => setCompetitiveEdge(e.target.value)}
                          rows={3}
                          className="resize-none"
                          data-testid="input-competitive-edge"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Validate Button */}
                  <Card className={`border-2 backdrop-blur-sm ${
                    theme === "cypherpunk" 
                      ? "border-primary bg-primary/5" 
                      : "bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800"
                  }`}>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Ready for Validation?</h3>
                          <p className="text-sm text-muted-foreground">
                            Our AI will analyze your idea across 8 dimensions with real-time market research via Perplexity AI
                          </p>
                        </div>
                        
                        <Button
                          onClick={handleValidate}
                          disabled={validateMutation.isPending || !ideaTitle || !ideaDescription}
                          size="lg"
                          className={`w-full sm:w-auto px-8 ${
                            theme === "cypherpunk"
                              ? "bg-primary hover:bg-primary/90"
                              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          }`}
                          data-testid="button-validate"
                        >
                          {validateMutation.isPending ? (
                            <>
                              <RefreshCcw className="w-5 h-5 mr-2 animate-spin" />
                              Analyzing with AI...
                            </>
                          ) : (
                            <>
                              <Zap className="w-5 h-5 mr-2" />
                              Validate My Idea
                            </>
                          )}
                        </Button>
                        
                        {validateMutation.isPending && (
                          <p className="text-xs text-muted-foreground animate-pulse">
                            Conducting live market research and analyzing across 8 dimensions...
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              /* ========== VALIDATION RESULTS ========== */
              <div className="max-w-6xl mx-auto space-y-8">
                {/* Score Overview Card */}
                <Card className="border-2 backdrop-blur-sm">
                  <CardContent className="pt-8">
                    <div className="text-center space-y-6">
                      {/* Score */}
                      <div>
                        <div className={`text-8xl font-bold mb-2 ${getScoreColor(validationResult.score)}`}>
                          {validationResult.score}
                          <span className="text-4xl text-muted-foreground">/100</span>
                        </div>
                        <Progress value={validationResult.score} className="h-3 max-w-md mx-auto" />
                      </div>

                      {/* Verdict Badge */}
                      <div className="flex justify-center">
                        {(() => {
                          const config = getVerdictConfig(validationResult.verdict);
                          const VerdictIcon = config.icon;
                          return (
                            <Badge 
                              className={`px-6 py-3 text-lg font-bold ${config.bg} ${config.border} border-2`}
                            >
                              <VerdictIcon className="w-5 h-5 mr-2" />
                              VERDICT: {validationResult.verdict}
                            </Badge>
                          );
                        })()}
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground max-w-2xl mx-auto">
                        {validationResult.score >= 70 && "Your idea shows strong potential! Address minor concerns and move forward."}
                        {validationResult.score >= 60 && validationResult.score < 70 && "Your idea has potential but needs refinement in key areas."}
                        {validationResult.score >= 40 && validationResult.score < 60 && "Your idea needs significant refinement before proceeding."}
                        {validationResult.score < 40 && "Consider pivoting or major changes to your approach."}
                      </p>

                      {/* Unlock Status */}
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-muted rounded-lg">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Required to Unlock:</span>
                          <span className="ml-2 font-bold">60/100</span>
                        </div>
                        {validationResult.score >= 60 ? (
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Unlocked
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Target className="w-3 h-3 mr-1" />
                            {60 - validationResult.score} points needed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 8 Dimensions Breakdown */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6" />
                    Validation Breakdown
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {dimensionConfigs.map((config) => {
                      const dimensionData = validationResult[config.key as keyof ValidationResult] as any;
                      const DimensionIcon = config.icon;
                      const isExpanded = expandedSections[config.key];
                      
                      // Skip if dimension data doesn't exist
                      if (!dimensionData || typeof dimensionData.score === 'undefined') {
                        return null;
                      }
                      
                      return (
                        <Card 
                          key={config.key} 
                          className="border-2 backdrop-blur-sm hover:border-primary/50 transition-all cursor-pointer"
                          onClick={() => toggleSection(config.key)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <DimensionIcon className={`w-5 h-5 text-${config.color}-600 dark:text-${config.color}-400`} />
                                <CardTitle className="text-lg">{config.title}</CardTitle>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getScoreColor(dimensionData.score)}>
                                  {dimensionData.score}/10
                                </Badge>
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </div>
                            </div>
                            <Progress value={dimensionData.score * 10} className="h-2" />
                          </CardHeader>
                          {isExpanded && (
                            <CardContent className="pt-0 space-y-2 text-sm">
                              {Object.entries(dimensionData).map(([key, value]) => {
                                if (key === 'score' || !value) return null;
                                return (
                                  <div key={key} className="border-l-2 border-muted pl-3 py-1">
                                    <p className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                    <p className="text-foreground">{Array.isArray(value) ? value.join(', ') : value.toString()}</p>
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
                  <Card className="border-2 backdrop-blur-sm">
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

                {/* Next Steps */}
                <Card className="border-2 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {validationResult.score >= 60 ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-green-500/10 border-2 border-green-500/50 rounded-lg">
                          <p className="font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            Validation Passed!
                          </p>
                          <p className="text-sm text-muted-foreground">
                            You've unlocked The Strategist, Builder, and Growth Hacker stages.
                          </p>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-3">
                          <Button
                            onClick={() => navigate('/co-founder-strategist')}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            data-testid="button-proceed-strategist"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Continue to Strategist →
                          </Button>
                          
                          <Button
                            onClick={() => navigate('/co-founder-journey')}
                            variant="outline"
                            data-testid="button-back-journey"
                          >
                            ← Back to Journey
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-yellow-500/10 border-2 border-yellow-500/50 rounded-lg">
                          <p className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Refinement Needed
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Score 60+ to unlock next stages. Review the analysis and refine your approach.
                          </p>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-3">
                          <Button
                            onClick={() => {
                              setShowResults(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            data-testid="button-refine-idea"
                          >
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Refine & Re-Validate
                          </Button>
                          
                          <Button
                            onClick={() => navigate('/co-founder-journey')}
                            variant="outline"
                            data-testid="button-back-journey"
                          >
                            ← Back to Journey
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
