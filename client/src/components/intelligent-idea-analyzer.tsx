import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  MessageCircle, 
  CheckCircle, 
  ArrowRight,
  MapPin,
  Users,
  DollarSign,
  Target,
  TrendingUp,
  Building,
  Clock,
  Edit3,
  Lightbulb,
  BarChart3,
  PieChart,
  Globe,
  FileText,
  Sparkles,
  Loader2,
  Play,
  CheckSquare,
  Square,
  Zap,
  BookOpen,
  Shield,
  Star,
  Eye,
  Copy,
  Download,
  RefreshCw,
  Activity,
  AlertTriangle,
  AlertCircle,
  TrendingDown,
  Award,
  MousePointer,
  ExternalLink,
  Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface ClarifyingQuestion {
  id: string;
  question: string;
  type: "text" | "number" | "select" | "multiselect";
  options?: string[];
  placeholder?: string;
  required: boolean;
  category: "location" | "target_market" | "business_model" | "competition" | "goals";
}

interface IdeaAnalysis {
  businessType: string;
  industry: string;
  location: {
    type: "local" | "regional" | "national" | "global";
    specificLocation?: string;
  };
  targetMarket: {
    primary: string;
    demographics: string[];
    size: string;
  };
  revenueModel: string;
  marketPosition: string;
  clarifyingQuestions: ClarifyingQuestion[];
  confidence: number;
  needsClarification: boolean;
  summary: string;
}

interface AnalysisSection {
  id: string;
  title: string;
  description: string;
  icon: any;
  status: "pending" | "generating" | "completed" | "error";
  content?: any;
  estimatedTime: string;
  order: number;
  dependencies?: string[];
}

interface MarketInsights {
  marketSize: {
    local?: string;
    regional?: string;
    realistic: string;
  };
  competitors: {
    name: string;
    type: "direct" | "indirect";
    location?: string;
    description: string;
    marketShare?: string;
  }[];
  opportunities: string[];
  challenges: string[];
  marketTrends: {
    trend: string;
    impact: "positive" | "negative" | "neutral";
    relevance: string;
  }[];
}

interface IntelligentAnalyzerProps {
  ideaData: any;
  onAnalysisComplete?: (analysis: IdeaAnalysis, insights: MarketInsights) => void;
}

export default function IntelligentIdeaAnalyzer({ ideaData, onAnalysisComplete }: IntelligentAnalyzerProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<"quickstart" | "analyzing" | "results">("quickstart");
  const [ideaAnalysis, setIdeaAnalysis] = useState<IdeaAnalysis | null>(null);
  const [marketInsights, setMarketInsights] = useState<MarketInsights | null>(null);
  const quickAnalysisPreset = ["business-model", "target-market", "competitive-analysis", "market-opportunity"];
  const [selectedSections, setSelectedSections] = useState<string[]>(quickAnalysisPreset);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentlyAnalyzing, setCurrentlyAnalyzing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const analysisSections: AnalysisSection[] = [
    {
      id: "business-model",
      title: "Business Model",
      description: "Core business structure and value proposition",
      icon: Building,
      status: "pending",
      estimatedTime: "2-3 min",
      order: 1
    },
    {
      id: "target-market",
      title: "Target Market",
      description: "Customer demographics and market segments",
      icon: Users,
      status: "pending",
      estimatedTime: "3-4 min",
      order: 2
    },
    {
      id: "competitive-analysis",
      title: "Competitive Landscape",
      description: "Competition analysis and positioning",
      icon: Target,
      status: "pending",
      estimatedTime: "4-5 min",
      order: 3
    },
    {
      id: "market-opportunity",
      title: "Market Opportunity",
      description: "Market size and growth potential",
      icon: TrendingUp,
      status: "pending",
      estimatedTime: "3-4 min",
      order: 4
    },
    {
      id: "location-analysis",
      title: "Location Strategy",
      description: "Geographic scope and regional factors",
      icon: MapPin,
      status: "pending",
      estimatedTime: "2-3 min",
      order: 5
    },
    {
      id: "revenue-model",
      title: "Revenue Model",
      description: "Monetization and pricing strategy",
      icon: DollarSign,
      status: "pending",
      estimatedTime: "3-4 min",
      order: 6
    }
  ];

  // Check for existing analysis
  useEffect(() => {
    if (ideaData?.analysis?.intelligentAnalysis && ideaData?.analysis?.marketInsights) {
      setIdeaAnalysis(ideaData.analysis.intelligentAnalysis);
      setMarketInsights(ideaData.analysis.marketInsights);
      setCurrentStep("results");
    }
  }, [ideaData]);

  // Analysis mutation
  const runAnalysisMutation = useMutation({
    mutationFn: async () => {
      // Ensure we have sections selected - default to quick analysis if none
      const sectionsToAnalyze = selectedSections.length > 0 ? selectedSections : quickAnalysisPreset;
      
      const response = await apiRequest("/api/intelligent-analysis", {
        method: "POST",
        body: {
          ideaId: ideaData.id,
          ideaTitle: ideaData.ideaTitle,
          description: ideaData.description,
          industry: ideaData.industry,
          stage: ideaData.stage,
          sections: sectionsToAnalyze
        },
      } as any);
      return response;
    },
    onSuccess: (response: any) => {
      const data = response.analysis || response;
      setIdeaAnalysis(data);
      setMarketInsights(response.insights);
      setCurrentStep("results");
      setAnalysisProgress(100);
      
      toast({
        title: "✨ Analysis Complete!",
        description: `Your idea has been thoroughly analyzed across ${selectedSections.length} key areas.`,
      });
      
      if (onAnalysisComplete) {
        onAnalysisComplete(data, response.insights);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setCurrentStep("quickstart");
      setAnalysisProgress(0);
    },
  });

  const startQuickAnalysis = () => {
    setSelectedSections(quickAnalysisPreset);
    setCurrentStep("analyzing");
    setAnalysisProgress(0);
    
    // Simulate progress during analysis
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90; // Stop at 90%, will complete when API returns
        }
        return prev + Math.random() * 15;
      });
    }, 2000);

    runAnalysisMutation.mutate();
  };

  const startCustomAnalysis = () => {
    if (selectedSections.length === 0) {
      toast({
        title: "No modules selected",
        description: "Please select at least one analysis module.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep("analyzing");
    setAnalysisProgress(0);
    runAnalysisMutation.mutate();
  };

  // Quick Start Screen
  if (currentStep === "quickstart") {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Let's Analyze Your Idea
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get AI-powered insights about "<span className="font-semibold text-blue-600">{ideaData?.ideaTitle}</span>" 
            with realistic market analysis tailored to your business.
          </p>
        </div>

        {/* Quick Start Option */}
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-xl">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  Quick Analysis (Recommended)
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complete analysis in 8-12 minutes
                </p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                Popular
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickAnalysisPreset.map(sectionId => {
                const section = analysisSections.find(s => s.id === sectionId);
                const IconComponent = section?.icon;
                return (
                  <div key={sectionId} className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-800 mx-auto flex items-center justify-center shadow-sm">
                      {IconComponent && <IconComponent className="w-6 h-6 text-blue-600" />}
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {section?.title}
                    </p>
                  </div>
                );
              })}
            </div>
            <Button 
              onClick={startQuickAnalysis}
              size="lg" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 text-lg shadow-lg"
              data-testid="button-quick-analysis"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Quick Analysis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Custom Analysis Option */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <MousePointer className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  Custom Analysis
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose specific modules to analyze
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysisSections.map(section => {
                const IconComponent = section.icon;
                const isSelected = selectedSections.includes(section.id);
                
                return (
                  <div
                    key={section.id}
                    onClick={() => {
                      setSelectedSections(prev => 
                        prev.includes(section.id) 
                          ? prev.filter(id => id !== section.id)
                          : [...prev, section.id]
                      );
                    }}
                    className={`cursor-pointer transition-all duration-200 border-2 rounded-lg p-4 ${
                      isSelected 
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md" 
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    data-testid={`section-${section.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-blue-500" : "bg-gray-100 dark:bg-gray-800"
                      }`}>
                        <IconComponent className={`w-4 h-4 ${
                          isSelected ? "text-white" : "text-gray-600"
                        }`} />
                      </div>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        isSelected 
                          ? "bg-blue-500 border-blue-500" 
                          : "border-gray-300"
                      }`}>
                        {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                      {section.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {section.description}
                    </p>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {section.estimatedTime}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedSections.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedSections.length} modules selected
                  </span>
                  <span className="text-xs text-gray-500">
                    Est. {selectedSections.length * 3}-{selectedSections.length * 5} min
                  </span>
                </div>
                <Button 
                  onClick={startCustomAnalysis}
                  className="w-full mt-2"
                  data-testid="button-custom-analysis"
                >
                  Start Custom Analysis
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Analysis Progress Screen  
  if (currentStep === "analyzing") {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-8">
          {/* Left Timeline */}
          <div className="w-64 space-y-4">
            <Card className="sticky top-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Analysis Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{Math.round(analysisProgress)}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  {selectedSections.map((sectionId, index) => {
                    const section = analysisSections.find(s => s.id === sectionId);
                    const IconComponent = section?.icon;
                    const isCompleted = analysisProgress > (index + 1) * (100 / selectedSections.length);
                    const isCurrent = analysisProgress <= (index + 1) * (100 / selectedSections.length) && analysisProgress > index * (100 / selectedSections.length);
                    
                    return (
                      <div key={sectionId} className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          isCompleted 
                            ? "bg-green-500 border-green-500" 
                            : isCurrent 
                            ? "bg-blue-500 border-blue-500 animate-pulse"
                            : "border-gray-300"
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : isCurrent ? (
                            <Loader2 className="w-4 h-4 text-white animate-spin" />
                          ) : (
                            IconComponent && <IconComponent className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            isCompleted ? "text-green-600" : isCurrent ? "text-blue-600" : "text-gray-500"
                          }`}>
                            {section?.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {isCompleted ? "Complete" : isCurrent ? "Analyzing..." : "Pending"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Card className="shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardHeader className="text-center pb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <Brain className="w-16 h-16 text-blue-600 animate-pulse" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  AI is Analyzing Your Idea
                </CardTitle>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Deep-diving into "<span className="font-semibold text-blue-600">{ideaData?.ideaTitle}</span>" 
                  across {selectedSections.length} key dimensions
                </p>
              </CardHeader>
              
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mx-auto flex items-center justify-center">
                      <Target className="w-8 h-8 text-blue-600 animate-bounce" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Business Context</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Understanding your business model</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto flex items-center justify-center">
                      <Users className="w-8 h-8 text-green-600 animate-bounce delay-75" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Market Analysis</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Researching target customers</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mx-auto flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-purple-600 animate-bounce delay-150" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Opportunities</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Identifying growth potential</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900 dark:text-white">AI Analysis in Progress</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      "Analyzing business model and industry context...",
                      "Researching target market and customer segments...",
                      "Evaluating competitive landscape and positioning...",
                      "Calculating market size and opportunity...",
                      "Generating actionable insights and recommendations..."
                    ].map((step, index) => (
                      <div key={index} className={`flex items-center space-x-3 ${
                        analysisProgress > (index + 1) * 20 ? "text-green-600" : 
                        analysisProgress > index * 20 ? "text-blue-600" : "text-gray-400"
                      }`}>
                        {analysisProgress > (index + 1) * 20 ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : analysisProgress > index * 20 ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                        )}
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (currentStep === "results" && ideaAnalysis && marketInsights) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Sticky Sidebar Summary */}
          <div className="w-80 space-y-4">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span>Analysis Complete</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Business Type</Label>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {ideaAnalysis?.businessType || "Analyzing..."}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Market Scope</Label>
                    <Badge variant="secondary" className="capitalize">
                      {ideaAnalysis?.location?.type || "global"}
                    </Badge>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Confidence Score</Label>
                    <div className="flex items-center space-x-2">
                      <Progress value={ideaAnalysis?.confidence || 0} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{ideaAnalysis?.confidence || 0}%</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    size="sm" 
                    onClick={() => window.open('/business-plan', '_blank')}
                    data-testid="button-create-business-plan"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Create Business Plan
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="sm" 
                    onClick={() => {
                      if (ideaAnalysis && marketInsights) {
                        // Create comprehensive analysis export
                        const analysisData = {
                          idea: ideaData,
                          analysis: ideaAnalysis,
                          insights: marketInsights,
                          exportDate: new Date().toISOString()
                        };
                        
                        const blob = new Blob([JSON.stringify(analysisData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${ideaData?.ideaTitle || 'idea'}-analysis.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }
                    }}
                    data-testid="button-export-analysis"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Analysis
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="sm" 
                    onClick={() => {
                      setCurrentStep('analyzing');
                      setAnalysisProgress(0);
                      startCustomAnalysis();
                    }}
                    data-testid="button-refine-analysis"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refine Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Results Content */}
          <div className="flex-1 space-y-6">
            {/* Enhanced Key Insights Overview */}
            <Card className="shadow-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-6 h-6 text-yellow-500" />
                    <span>AI Analysis Results</span>
                  </div>
                  <Badge 
                    variant={ideaAnalysis?.confidence >= 80 ? "default" : ideaAnalysis?.confidence >= 60 ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {ideaAnalysis?.confidence || 0}% Confidence
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-blue-100 mx-auto flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Market Size</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {marketInsights?.marketSize?.realistic || marketInsights?.marketSize?.local || marketInsights?.marketSize?.regional || "Analyzing..."}
                    </p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-green-100 mx-auto flex items-center justify-center">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Target Market</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {ideaAnalysis?.targetMarket?.primary || "Analyzing..."}
                    </p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-purple-100 mx-auto flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Revenue Model</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {ideaAnalysis?.revenueModel || "Analyzing..."}
                    </p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-orange-100 mx-auto flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Risk Level</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {(marketInsights?.challenges?.length || 0) > 3 ? "High" : (marketInsights?.challenges?.length || 0) > 1 ? "Medium" : "Low"}
                    </p>
                  </div>
                </div>

                {/* Executive Summary with better formatting */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 border-blue-500">
                  <div className="flex items-center mb-3">
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Executive Summary</h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {ideaAnalysis?.summary || "Generating comprehensive analysis summary with market positioning, competitive landscape, and growth potential assessment..."}
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">{(marketInsights?.competitors || []).length}</p>
                      <p className="text-xs text-gray-500">Competitors</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{(marketInsights?.opportunities || []).length}</p>
                      <p className="text-xs text-gray-500">Opportunities</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-orange-600">{(marketInsights?.challenges || []).length}</p>
                      <p className="text-xs text-gray-500">Challenges</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-purple-600">{(marketInsights?.marketTrends || []).length}</p>
                      <p className="text-xs text-gray-500">Market Trends</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Detailed Analysis */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Deep Dive Analysis</span>
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Comprehensive market intelligence and strategic insights for your startup idea
                </p>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview" data-testid="tab-overview" className="flex items-center space-x-1">
                      <Building className="w-4 h-4" />
                      <span>Business Model</span>
                    </TabsTrigger>
                    <TabsTrigger value="competition" data-testid="tab-competition" className="flex items-center space-x-1">
                      <Zap className="w-4 h-4" />
                      <span>Competition</span>
                    </TabsTrigger>
                    <TabsTrigger value="opportunities" data-testid="tab-opportunities" className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>Market Outlook</span>
                    </TabsTrigger>
                    <TabsTrigger value="trends" data-testid="tab-trends" className="flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Risk Assessment</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6 mt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <Building className="w-5 h-5 mr-2 text-blue-600" />
                            Business Model
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label className="text-xs text-gray-500 uppercase">Industry</Label>
                            <p className="font-medium">{ideaAnalysis?.industry || "Analyzing industry..."}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500 uppercase">Business Type</Label>
                            <p className="font-medium">{ideaAnalysis?.businessType || "Analyzing business type..."}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500 uppercase">Market Position</Label>
                            <p className="font-medium">{ideaAnalysis?.marketPosition || "Analyzing market position..."}</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <Users className="w-5 h-5 mr-2 text-green-600" />
                            Target Market
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label className="text-xs text-gray-500 uppercase">Primary Customers</Label>
                            <p className="font-medium">{ideaAnalysis?.targetMarket?.primary || "Analyzing target market..."}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500 uppercase">Market Size</Label>
                            <p className="font-medium">{ideaAnalysis?.targetMarket?.size || "Analyzing market size..."}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500 uppercase">Demographics</Label>
                            <div className="flex flex-wrap gap-1">
                              {(ideaAnalysis?.targetMarket?.demographics || []).map(demo => (
                                <Badge key={demo} variant="outline" className="text-xs">{demo}</Badge>
                              ))}
                              {(!ideaAnalysis?.targetMarket?.demographics || ideaAnalysis?.targetMarket?.demographics?.length === 0) && (
                                <span className="text-sm text-gray-500">Analyzing demographics...</span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="competition" className="space-y-4 mt-6">
                    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Competitive Landscape Analysis</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Identified {(marketInsights?.competitors || []).length} key competitors. Study their strategies to differentiate your offering.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      {(marketInsights?.competitors || []).length === 0 ? (
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto flex items-center justify-center mb-4">
                              <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">Analyzing competitive landscape...</p>
                          </CardContent>
                        </Card>
                      ) : (
                        (marketInsights?.competitors || []).map((competitor, index) => (
                          <Card key={index} className="border-l-4 border-l-orange-500">
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{competitor.name}</h4>
                                    <Badge variant={competitor.type === "direct" ? "destructive" : "secondary"} className="text-xs">
                                      {competitor.type}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{competitor.description}</p>
                                  {competitor.location && (
                                    <div className="flex items-center text-xs text-gray-500">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {competitor.location}
                                    </div>
                                  )}
                                </div>
                                {competitor.marketShare && (
                                  <div className="text-right ml-4">
                                    <p className="text-xs text-gray-500">Market Share</p>
                                    <p className="font-semibold text-lg text-orange-600">{competitor.marketShare}</p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="opportunities" className="space-y-4 mt-6">
                    <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Market Opportunity Assessment</h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Capitalize on {(marketInsights?.opportunities || []).length} identified opportunities while addressing {(marketInsights?.challenges || []).length} key challenges.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="border-l-4 border-l-green-500">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center text-green-600">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Growth Opportunities
                          </CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Strategic advantages to leverage</p>
                        </CardHeader>
                        <CardContent>
                          {(marketInsights?.opportunities || []).length === 0 ? (
                            <div className="text-center py-8">
                              <div className="w-12 h-12 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-3">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                              </div>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">Analyzing market opportunities...</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {(marketInsights?.opportunities || []).map((opportunity, index) => (
                                <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Award className="w-3 h-3 text-white" />
                                  </div>
                                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{opportunity}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-orange-500">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center text-orange-600">
                            <AlertTriangle className="w-5 h-5 mr-2" />
                            Strategic Challenges
                          </CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Critical risks to mitigate</p>
                        </CardHeader>
                        <CardContent>
                          {(marketInsights?.challenges || []).length === 0 ? (
                            <div className="text-center py-8">
                              <div className="w-12 h-12 rounded-full bg-orange-100 mx-auto flex items-center justify-center mb-3">
                                <AlertTriangle className="w-6 h-6 text-orange-600" />
                              </div>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">Analyzing potential challenges...</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {(marketInsights?.challenges || []).map((challenge, index) => (
                                <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Shield className="w-3 h-3 text-white" />
                                  </div>
                                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{challenge}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="trends" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      {(marketInsights?.marketTrends || []).map((trend, index) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{trend.trend}</h4>
                                <p className="text-gray-600 dark:text-gray-400">{trend.relevance}</p>
                              </div>
                              <Badge 
                                variant={
                                  trend.impact === "positive" ? "default" : 
                                  trend.impact === "negative" ? "destructive" : "secondary"
                                }
                                className="ml-4"
                              >
                                {trend.impact === "positive" && <TrendingUp className="w-3 h-3 mr-1" />}
                                {trend.impact === "negative" && <TrendingDown className="w-3 h-3 mr-1" />}
                                {trend.impact}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
}