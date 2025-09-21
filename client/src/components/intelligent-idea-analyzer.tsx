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
  FileText
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
  const [currentStep, setCurrentStep] = useState<"analyzing" | "questions" | "confirming" | "researching" | "complete">("analyzing");
  const [ideaAnalysis, setIdeaAnalysis] = useState<IdeaAnalysis | null>(null);
  const [marketInsights, setMarketInsights] = useState<MarketInsights | null>(null);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [editedAnalysis, setEditedAnalysis] = useState<Partial<IdeaAnalysis>>({});

  // Step 1: Intelligent Idea Analysis
  const analyzeIdeaMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("/api/intelligent-analysis", {
        method: "POST",
        body: {
          ideaId: ideaData.id,
          ideaTitle: ideaData.ideaTitle,
          description: ideaData.description,
          industry: ideaData.industry,
          stage: ideaData.stage
        },
      } as any);
      return response;
    },
    onSuccess: (response: any) => {
      const data = response.analysis || response;
      setIdeaAnalysis(data);
      if (data.needsClarification) {
        setCurrentStep("questions");
      } else {
        setCurrentStep("confirming");
      }
      toast({
        title: "🧠 Analysis Complete!",
        description: `AI understands your ${data.businessType} idea with ${data.confidence}% confidence.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze your idea. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Step 2: Market Research with Context
  const contextualMarketResearch = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("/api/contextual-market-research", {
        method: "POST",
        body: {
          ideaId: ideaData.id,
          ideaAnalysis,
          questionAnswers,
          editedAnalysis
        },
      } as any);
      return response;
    },
    onSuccess: (response: any) => {
      const data = response.marketData || response;
      setMarketInsights(data);
      setCurrentStep("complete");
      onAnalysisComplete?.(ideaAnalysis!, data);
      toast({
        title: "🎯 Market Research Complete!",
        description: "Realistic market insights generated based on your specific business context.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Research Failed", 
        description: error.message || "Failed to complete market research. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Auto-start analysis
  useEffect(() => {
    if (ideaData && currentStep === "analyzing") {
      analyzeIdeaMutation.mutate();
    }
  }, [ideaData]);

  const handleQuestionAnswer = (questionId: string, answer: string) => {
    setQuestionAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleAnalysisEdit = (field: string, value: any) => {
    setEditedAnalysis(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const proceedToResearch = () => {
    setCurrentStep("researching");
    contextualMarketResearch.mutate();
  };

  // Step 1: Analysis in Progress
  if (currentStep === "analyzing" && analyzeIdeaMutation.isPending) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center mb-6">
            <Brain className="w-16 h-16 text-blue-600 animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI is Analyzing Your Idea
          </CardTitle>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Understanding your "{ideaData?.ideaTitle}" concept and business context
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Analysis Progress</span>
              <span>Thinking...</span>
            </div>
            <Progress value={undefined} className="h-3" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <Target className="w-8 h-8 text-blue-600 mx-auto animate-bounce" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Business Type</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Identifying category</p>
            </div>
            <div className="space-y-2">
              <MapPin className="w-8 h-8 text-green-600 mx-auto animate-bounce delay-100" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Market Scope</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Understanding reach</p>
            </div>
            <div className="space-y-2">
              <Users className="w-8 h-8 text-purple-600 mx-auto animate-bounce delay-200" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Market</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Analyzing audience</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step 2: Clarifying Questions
  if (currentStep === "questions" && ideaAnalysis) {
    const questionsByCategory = ideaAnalysis.clarifyingQuestions.reduce((acc, q) => {
      if (!acc[q.category]) acc[q.category] = [];
      acc[q.category].push(q);
      return acc;
    }, {} as Record<string, ClarifyingQuestion[]>);

    const categoryIcons = {
      location: MapPin,
      target_market: Users,
      business_model: DollarSign,
      competition: BarChart3,
      goals: Target
    };

    const categoryNames = {
      location: "Location & Market",
      target_market: "Target Customers", 
      business_model: "Business Model",
      competition: "Competition",
      goals: "Goals & Timeline"
    };

    return (
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-4">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Help Me Understand Your Vision
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                I need a few details to give you accurate, realistic market insights
              </p>
            </div>
          </div>
          
          {/* Analysis Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">My Initial Understanding:</h4>
            <p className="text-blue-800 dark:text-blue-200 text-sm">{ideaAnalysis.summary}</p>
            <div className="flex items-center mt-3">
              <Brain className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Confidence: {ideaAnalysis.confidence}% - {ideaAnalysis.confidence >= 80 ? "High" : ideaAnalysis.confidence >= 60 ? "Medium" : "Needs clarification"}
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {Object.entries(questionsByCategory).map(([category, questions]) => {
            const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
            const categoryName = categoryNames[category as keyof typeof categoryNames];
            
            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{categoryName}</h3>
                </div>
                
                <div className="space-y-4 pl-9">
                  {questions.map((question) => (
                    <div key={question.id} className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {question.question}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      
                      {question.type === "text" && (
                        <Input
                          placeholder={question.placeholder}
                          value={questionAnswers[question.id] || ""}
                          onChange={(e) => handleQuestionAnswer(question.id, e.target.value)}
                          data-testid={`input-question-${question.id}`}
                        />
                      )}
                      
                      {question.type === "number" && (
                        <Input
                          type="number"
                          placeholder={question.placeholder}
                          value={questionAnswers[question.id] || ""}
                          onChange={(e) => handleQuestionAnswer(question.id, e.target.value)}
                          data-testid={`input-number-${question.id}`}
                        />
                      )}
                      
                      {question.type === "select" && question.options && (
                        <select
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                          value={questionAnswers[question.id] || ""}
                          onChange={(e) => handleQuestionAnswer(question.id, e.target.value)}
                          data-testid={`select-${question.id}`}
                        >
                          <option value="">Select an option...</option>
                          {question.options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )}
                      
                      {question.type === "multiselect" && question.options && (
                        <Textarea
                          placeholder="Select multiple options or add your own (comma-separated)"
                          value={questionAnswers[question.id] || ""}
                          onChange={(e) => handleQuestionAnswer(question.id, e.target.value)}
                          data-testid={`textarea-${question.id}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                
                {category !== Object.keys(questionsByCategory).slice(-1)[0] && (
                  <Separator className="my-6" />
                )}
              </div>
            );
          })}
          
          <div className="flex justify-end pt-6">
            <Button 
              onClick={() => setCurrentStep("confirming")}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              data-testid="button-continue-analysis"
            >
              Continue Analysis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step 3: Confirmation & Editing
  if (currentStep === "confirming" && ideaAnalysis) {
    return (
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Confirm Your Business Details
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Review and edit the analysis before we research your market
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Business Type</Label>
                <Input
                  value={editedAnalysis.businessType || ideaAnalysis.businessType}
                  onChange={(e) => handleAnalysisEdit("businessType", e.target.value)}
                  className="mt-1"
                  data-testid="input-business-type"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Industry</Label>
                <Input
                  value={editedAnalysis.industry || ideaAnalysis.industry}
                  onChange={(e) => handleAnalysisEdit("industry", e.target.value)}
                  className="mt-1"
                  data-testid="input-industry"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Revenue Model</Label>
                <Input
                  value={editedAnalysis.revenueModel || ideaAnalysis.revenueModel}
                  onChange={(e) => handleAnalysisEdit("revenueModel", e.target.value)}
                  className="mt-1"
                  data-testid="input-revenue-model"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Market Scope</Label>
                <select
                  value={editedAnalysis.location?.type || ideaAnalysis.location.type}
                  onChange={(e) => handleAnalysisEdit("location", { ...ideaAnalysis.location, type: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  data-testid="select-market-scope"
                >
                  <option value="local">Local Business</option>
                  <option value="regional">Regional Business</option>
                  <option value="national">National Business</option>
                  <option value="global">Global Business</option>
                </select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Primary Target Market</Label>
                <Input
                  value={editedAnalysis.targetMarket?.primary || ideaAnalysis.targetMarket.primary}
                  onChange={(e) => handleAnalysisEdit("targetMarket", { ...ideaAnalysis.targetMarket, primary: e.target.value })}
                  className="mt-1"
                  data-testid="input-target-market"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Market Position</Label>
                <Input
                  value={editedAnalysis.marketPosition || ideaAnalysis.marketPosition}
                  onChange={(e) => handleAnalysisEdit("marketPosition", e.target.value)}
                  className="mt-1"
                  data-testid="input-market-position"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Updated Summary:</h4>
            <Textarea
              value={editedAnalysis.summary || ideaAnalysis.summary}
              onChange={(e) => handleAnalysisEdit("summary", e.target.value)}
              className="bg-white dark:bg-gray-800"
              rows={3}
              data-testid="textarea-summary"
            />
          </div>
          
          <div className="flex justify-between pt-6">
            <Button 
              variant="outline"
              onClick={() => setCurrentStep("questions")}
              data-testid="button-back-questions"
            >
              Back to Questions
            </Button>
            <Button 
              onClick={proceedToResearch}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
              data-testid="button-start-research"
            >
              Start Market Research
              <TrendingUp className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step 4: Market Research in Progress
  if (currentStep === "researching" && contextualMarketResearch.isPending) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center mb-6">
            <PieChart className="w-16 h-16 text-green-600 animate-spin" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Researching Your Market
          </CardTitle>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Generating realistic insights for your {ideaAnalysis?.businessType} business
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Research Progress</span>
              <span>Analyzing context...</span>
            </div>
            <Progress value={undefined} className="h-3" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <BarChart3 className="w-8 h-8 text-green-600 mx-auto animate-pulse" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Realistic Market Size</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Based on your scope</p>
            </div>
            <div className="space-y-2">
              <Building className="w-8 h-8 text-blue-600 mx-auto animate-pulse delay-100" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Relevant Competitors</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Location & type specific</p>
            </div>
            <div className="space-y-2">
              <Globe className="w-8 h-8 text-purple-600 mx-auto animate-pulse delay-200" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Market Opportunities</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tailored to your business</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step 5: Complete Results
  if (currentStep === "complete" && ideaAnalysis && marketInsights) {
    return (
      <div className="space-y-8">
        {/* Market Size - Realistic */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <BarChart3 className="w-8 h-8 text-green-600 mr-3" />
              Realistic Market Analysis
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300">
              Market size appropriate for your {ideaAnalysis.businessType} in {ideaAnalysis.location.specificLocation || "your area"}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-900 dark:text-green-100">{marketInsights.marketSize.realistic}</h3>
                <p className="text-sm text-green-700 dark:text-green-300">Realistic Market Size</p>
              </div>
              {marketInsights.marketSize.local && (
                <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">{marketInsights.marketSize.local}</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Local Market Size</p>
                </div>
              )}
              {marketInsights.marketSize.regional && (
                <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Globe className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">{marketInsights.marketSize.regional}</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Regional Opportunity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Relevant Competitors */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Building className="w-8 h-8 text-blue-600 mr-3" />
              Relevant Competitors
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300">
              Actual competitors in your market and location
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {marketInsights.competitors.map((competitor, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{competitor.name}</h3>
                        <Badge variant={competitor.type === "direct" ? "destructive" : "secondary"}>
                          {competitor.type} competitor
                        </Badge>
                        {competitor.location && (
                          <Badge variant="outline">
                            <MapPin className="w-3 h-3 mr-1" />
                            {competitor.location}
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{competitor.description}</p>
                    </div>
                    {competitor.marketShare && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{competitor.marketShare}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Market Share</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Opportunities & Trends */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Lightbulb className="w-6 h-6 text-yellow-600 mr-3" />
                Market Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {marketInsights.opportunities.map((opportunity, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{opportunity}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
                Market Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketInsights.marketTrends.map((trend, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                      trend.impact === "positive" ? "bg-green-500" :
                      trend.impact === "negative" ? "bg-red-500" : "bg-gray-400"
                    }`} />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">{trend.trend}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{trend.relevance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Actions */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  🎉 Analysis Complete!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your idea has been thoroughly analyzed. Choose your next step to continue building your startup.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setLocation("/dashboard")}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="button-continue-dashboard"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Continue to Dashboard
                </Button>
                
                <Button 
                  onClick={() => setLocation("/business-plan")}
                  size="lg"
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                  data-testid="button-create-business-plan"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Create Business Plan
                </Button>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep("confirming")}
                  data-testid="button-edit-analysis"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Analysis Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}