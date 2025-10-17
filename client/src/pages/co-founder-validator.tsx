import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Sparkles,
  Target,
  Users,
  DollarSign,
  RefreshCcw,
  Lightbulb,
  BarChart3,
  Swords,
  UserCheck,
  CheckSquare,
  AlertCircle,
  Beaker,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Download,
  FileText
} from "lucide-react";
import { useLocation } from "wouter";
import { AuroraBackground } from "@/components/react-bits/aurora-background";
import { SplitText } from "@/components/react-bits/split-text";
import { WaveBackground } from "@/components/react-bits/wave-background";
import { AnimatedGradient } from "@/components/react-bits/animated-gradient";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
}

export default function CoFounderValidator() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
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
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Fetch validation result if exists
  const { data: validationResult } = useQuery<ValidationResult>({
    queryKey: ['/api/journey/validation'],
  });

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // AI Improve functions (placeholder for now - will implement later)
  const handleAIImprove = async (field: string) => {
    toast({
      title: "AI Enhancement",
      description: `Improving ${field}...`,
    });
    // TODO: Implement AI enhancement
  };

  // Validate idea mutation
  const validateMutation = useMutation({
    mutationFn: async () => {
      setIsAnalyzing(true);
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
      setIsAnalyzing(false);
      toast({
        title: "Validation Complete! 🎯",
        description: `Your idea scored ${data.score}/100`,
      });
    },
    onError: () => {
      setIsAnalyzing(false);
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

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'GO':
        return 'bg-green-500/20 text-green-400 border-green-400';
      case 'REFINE':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-400';
      case 'PIVOT':
        return 'bg-red-500/20 text-red-400 border-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-blue-900 dark:to-gray-900">
      {/* Aurora Background - only visible in dark mode */}
      <div className="absolute inset-0 opacity-0 dark:opacity-25">
        <AuroraBackground 
          colors={[
            "rgba(59, 130, 246, 0.5)",
            "rgba(139, 92, 246, 0.4)",
            "rgba(96, 165, 250, 0.5)",
          ]}
          speed={0.002}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/co-founder-journey')}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Journey
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-6xl">🎯</span>
            <SplitText
              text="The Validator"
              tag="h1"
              className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text"
              splitType="chars"
              delay={30}
            />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive startup validation across 8 critical dimensions
          </p>
        </div>

        {!validationResult ? (
          /* ========== INPUT FORM ========== */
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Section 1: Idea Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-500" />
                  💡 Idea Overview
                </CardTitle>
                <p className="text-sm text-gray-500">Tell us about your startup idea</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Idea Title</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAIImprove('title')}
                      className="text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Improve
                    </Button>
                  </div>
                  <Input
                    placeholder="e.g., FarmConnect - Urban farmer marketplace"
                    value={ideaTitle}
                    onChange={(e) => setIdeaTitle(e.target.value)}
                    data-testid="input-idea-title"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>One-Sentence Description</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAIImprove('description')}
                      className="text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Improve
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Describe what your startup does in one clear sentence..."
                    value={ideaDescription}
                    onChange={(e) => setIdeaDescription(e.target.value)}
                    rows={3}
                    data-testid="input-idea-description"
                  />
                  <p className="text-xs text-gray-500">Be specific about the problem, solution, and target customer</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="marketplace">Marketplace</SelectItem>
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
                        <SelectItem value="mvp">MVP</SelectItem>
                        <SelectItem value="launched">Launched</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Problem & Solution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-500" />
                  🎯 Problem & Solution
                </CardTitle>
                <p className="text-sm text-gray-500">Define the problem and your unique approach</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Problem Statement
                    </Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAIImprove('problem')}
                      className="text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Improve
                    </Button>
                  </div>
                  <Textarea
                    placeholder="What specific problem are you solving? Who faces this problem?"
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    rows={3}
                    data-testid="input-problem-statement"
                  />
                  <p className="text-xs text-gray-500">Clearly define the pain point your startup addresses</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Solution Approach
                    </Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAIImprove('solution')}
                      className="text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Improve
                    </Button>
                  </div>
                  <Textarea
                    placeholder="How does your solution work? What makes it unique?"
                    value={solutionApproach}
                    onChange={(e) => setSolutionApproach(e.target.value)}
                    rows={3}
                    data-testid="input-solution-approach"
                  />
                  <p className="text-xs text-gray-500">Explain your unique value proposition and approach</p>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Target Market & Customers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  👥 Target Market & Customers
                </CardTitle>
                <p className="text-sm text-gray-500">Who are you building this for?</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Target Customer</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAIImprove('target')}
                      className="text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Improve
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Describe your ideal customer: demographics, behaviors, pain points..."
                    value={targetMarket}
                    onChange={(e) => setTargetMarket(e.target.value)}
                    rows={3}
                    data-testid="input-target-market"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Market Size (Optional)</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAIImprove('market-size')}
                      className="text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Improve
                    </Button>
                  </div>
                  <Textarea
                    placeholder="TAM, SAM, SOM estimates if you have them..."
                    value={marketSize}
                    onChange={(e) => setMarketSize(e.target.value)}
                    rows={2}
                    data-testid="input-market-size"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section 4: Competition & Differentiation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Swords className="w-5 h-5 text-orange-500" />
                  ⚔️ Competition & Differentiation
                </CardTitle>
                <p className="text-sm text-gray-500">What alternatives exist and why are you different?</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Existing Competitors</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAIImprove('competitors')}
                      className="text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Improve
                    </Button>
                  </div>
                  <Textarea
                    placeholder="List direct and indirect competitors..."
                    value={competitors}
                    onChange={(e) => setCompetitors(e.target.value)}
                    rows={2}
                    data-testid="input-competitors"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Your Competitive Edge</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAIImprove('edge')}
                      className="text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Improve
                    </Button>
                  </div>
                  <Textarea
                    placeholder="What makes you different? Why will customers choose you?"
                    value={competitiveEdge}
                    onChange={(e) => setCompetitiveEdge(e.target.value)}
                    rows={3}
                    data-testid="input-competitive-edge"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Validate Button */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-700">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Button
                    onClick={handleValidate}
                    disabled={isAnalyzing}
                    size="lg"
                    className="w-full max-w-md bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg py-6"
                    data-testid="button-validate-idea"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Analyzing with AI (30-45s)...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Validate This Idea
                      </>
                    )}
                  </Button>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>⏱️ Validation takes 30-45 seconds</p>
                    <p>🧠 AI will analyze 8 critical dimensions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* ========== VALIDATION RESULTS ========== */
          <div className="space-y-8">
            {/* Overall Score Card with Animated Gradient */}
            <Card className="relative overflow-hidden border-2">
              <div className="absolute inset-0 opacity-20 dark:opacity-10">
                <AnimatedGradient
                  colors={["#8b5cf6", "#ec4899", "#3b82f6"]}
                  speed={5}
                  blur={100}
                />
              </div>
              <CardContent className="relative z-10 pt-8">
                <div className="text-center">
                  <div className={`text-8xl font-bold mb-4 ${getScoreColor(validationResult.score)}`} data-testid="text-validation-score">
                    {validationResult.score}
                    <span className="text-4xl text-gray-400 dark:text-gray-500">/100</span>
                  </div>
                  <Progress value={validationResult.score} className="h-4 mb-6 max-w-md mx-auto" data-testid="progress-validation-score" />
                  
                  <Badge 
                    className={`text-xl px-8 py-3 ${getVerdictColor(validationResult.verdict)}`}
                    data-testid="badge-verdict"
                  >
                    <span className="font-bold">VERDICT: {validationResult.verdict}</span>
                  </Badge>

                  <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    {validationResult.verdict === 'GO' && "Your idea shows strong potential. Proceed with strategic planning and customer validation."}
                    {validationResult.verdict === 'REFINE' && "Your idea has potential but needs refinement. Address key concerns before proceeding."}
                    {validationResult.verdict === 'PIVOT' && "Significant changes needed. Consider pivoting your approach or addressing fundamental issues."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Idea Clarity */}
              {validationResult.ideaClarity && (
                <Card className="relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <WaveBackground
                      waveColor="rgba(59, 130, 246, 0.3)"
                      amplitude={30}
                      numberOfWaves={2}
                    />
                  </div>
                  <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-blue-500" />
                        Idea Clarity Assessment
                      </CardTitle>
                      <Badge variant="secondary">{validationResult.ideaClarity.score}/100</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10 space-y-3">
                    <div>
                      <p className="text-sm font-semibold mb-1">Problem Definition</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{validationResult.ideaClarity.problemDefinition}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1">📝 Your One-Sentence Pitch</p>
                      <p className="text-sm italic text-gray-700 dark:text-gray-300">{validationResult.ideaClarity.oneSentencePitch}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection('idea-clarity')}
                      className="w-full justify-between mt-2"
                    >
                      View Details
                      {expandedSections['idea-clarity'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* 2. Market Validation */}
              {validationResult.marketValidation && (
                <Card className="relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <WaveBackground
                      waveColor="rgba(139, 92, 246, 0.3)"
                      amplitude={30}
                      numberOfWaves={2}
                    />
                  </div>
                  <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-500" />
                        Market Validation
                      </CardTitle>
                      <Badge variant="secondary">{validationResult.marketValidation.score}/100</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10 space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="font-semibold">TAM</p>
                        <p className="text-gray-600 dark:text-gray-400">{validationResult.marketValidation.tam}</p>
                      </div>
                      <div>
                        <p className="font-semibold">SAM</p>
                        <p className="text-gray-600 dark:text-gray-400">{validationResult.marketValidation.sam}</p>
                      </div>
                      <div>
                        <p className="font-semibold">SOM</p>
                        <p className="text-gray-600 dark:text-gray-400">{validationResult.marketValidation.som}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Growth Rate: {validationResult.marketValidation.growthRate}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Timing: {validationResult.marketValidation.marketTiming}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection('market')}
                      className="w-full justify-between mt-2"
                    >
                      View Details
                      {expandedSections['market'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* 3. Competitive Intelligence */}
              {validationResult.competitiveIntelligence && (
                <Card className="relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <WaveBackground
                      waveColor="rgba(236, 72, 153, 0.3)"
                      amplitude={30}
                      numberOfWaves={2}
                    />
                  </div>
                  <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Swords className="w-5 h-5 text-orange-500" />
                        Competitive Intelligence
                      </CardTitle>
                      <Badge variant="secondary">{validationResult.competitiveIntelligence.score}/100</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10 space-y-3">
                    <div>
                      <p className="text-sm font-semibold">Competition Level: {validationResult.competitiveIntelligence.competitionLevel}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1">Key Competitors:</p>
                      <ul className="text-xs space-y-1">
                        {validationResult.competitiveIntelligence.directCompetitors.map((comp, idx) => (
                          <li key={idx} className="text-gray-600 dark:text-gray-400">• {comp}</li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection('competitive')}
                      className="w-full justify-between mt-2"
                    >
                      View Comparison
                      {expandedSections['competitive'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* 4. Customer Discovery */}
              {validationResult.customerDiscovery && (
                <Card className="relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <WaveBackground
                      waveColor="rgba(34, 197, 94, 0.3)"
                      amplitude={30}
                      numberOfWaves={2}
                    />
                  </div>
                  <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-green-500" />
                        Customer Discovery
                      </CardTitle>
                      <Badge variant="secondary">{validationResult.customerDiscovery.score}/100</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10 space-y-3">
                    <div>
                      <p className="text-sm">
                        <span className="font-semibold">Pain Severity:</span> {validationResult.customerDiscovery.painPointSeverity}/10
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Willingness to Pay:</span> {validationResult.customerDiscovery.willingnessToPay}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Interview Questions
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* 5. Problem-Solution Fit */}
              {validationResult.problemSolutionFit && (
                <Card className="relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <WaveBackground
                      waveColor="rgba(251, 146, 60, 0.3)"
                      amplitude={30}
                      numberOfWaves={2}
                    />
                  </div>
                  <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <CheckSquare className="w-5 h-5 text-orange-500" />
                        Problem-Solution Fit
                      </CardTitle>
                      <Badge variant="secondary">{validationResult.problemSolutionFit.score}/100</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="font-semibold">Problem Severity</p>
                        <p className="text-2xl font-bold text-orange-500">{validationResult.problemSolutionFit.problemSeverity}/10</p>
                      </div>
                      <div>
                        <p className="font-semibold">Solution Feasibility</p>
                        <p className="text-2xl font-bold text-green-500">{validationResult.problemSolutionFit.solutionFeasibility}/10</p>
                      </div>
                    </div>
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                      <p className="text-xs font-semibold">10x Better Test:</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{validationResult.problemSolutionFit.tenXTest}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 6. Risk Assessment */}
              {validationResult.riskAssessment && (
                <Card className="relative overflow-hidden col-span-full">
                  <div className="absolute inset-0 opacity-10">
                    <WaveBackground
                      waveColor="rgba(239, 68, 68, 0.3)"
                      amplitude={30}
                      numberOfWaves={2}
                    />
                  </div>
                  <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        Risk & Opportunity Assessment
                      </CardTitle>
                      <Badge variant="secondary">{validationResult.riskAssessment.score}/100</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-red-500 mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Top 3 Risks
                        </h4>
                        <ul className="space-y-2">
                          {validationResult.riskAssessment.topRisks.map((risk, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className="text-red-500 font-bold">{idx + 1}.</span>
                              <span className="text-gray-700 dark:text-gray-300">{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-500 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Top 3 Opportunities
                        </h4>
                        <ul className="space-y-2">
                          {validationResult.riskAssessment.topOpportunities.map((opp, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className="text-green-500 font-bold">{idx + 1}.</span>
                              <span className="text-gray-700 dark:text-gray-300">{opp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Validation Experiments */}
            {validationResult.validationExperiments && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="w-5 h-5 text-cyan-500" />
                    🧪 Validation Experiments
                  </CardTitle>
                  <p className="text-sm text-gray-500">Run these tests before building anything</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {validationResult.validationExperiments.experiments.map((exp, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{exp.name}</h4>
                          <Badge variant="outline">Week {exp.week}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Next Steps Card */}
            <Card className="border-2 border-blue-200 dark:border-blue-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎯 Your Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {validationResult.score >= 60 ? (
                  <>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                      <p className="text-green-700 dark:text-green-400 font-semibold mb-2">✅ Validation Passed!</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Your idea has strong potential. You've unlocked the next co-founder stages.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() => navigate('/co-founder-strategist')}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        data-testid="button-proceed-strategist"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Continue to The Strategist →
                      </Button>
                      
                      <p className="text-xs text-gray-500 text-center">
                        Next: Customer discovery, go-to-market planning
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                      <p className="text-yellow-700 dark:text-yellow-400 font-semibold mb-2">
                        {validationResult.verdict === 'REFINE' ? '🔄 Refinement Needed' : '⚠️ Pivot Recommended'}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Score 60+ to unlock next stages. Review the analysis above and refine your approach.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <span>Current Score:</span>
                        <span className={`font-bold ${getScoreColor(validationResult.score)}`}>
                          {validationResult.score}/100
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <span>Required to Unlock:</span>
                        <span className="font-bold">60/100</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => window.location.reload()}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      data-testid="button-refine-idea"
                    >
                      <RefreshCcw className="w-4 h-4 mr-2" />
                      Refine Your Idea & Re-Validate
                    </Button>
                  </>
                )}

                <Button
                  onClick={() => navigate('/co-founder-journey')}
                  variant="outline"
                  className="w-full"
                  data-testid="button-back-journey"
                >
                  ← Back to Journey
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
