import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  Edit3, 
  Save, 
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Shield,
  Lightbulb,
  BarChart3,
  CheckCircle,
  Clock,
  Brain,
  Zap,
  Star,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  FileDown,
  Sparkles,
  Eye,
  Settings,
  BookOpen,
  Award,
  TrendingDown,
  ThumbsUp,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Enhanced interfaces for quality assessment and section management
interface SectionQualityAssessment {
  score: number; // 1-100
  strengths: string[];
  improvements: string[];
  completeness: number; // 1-100
  professionalism: number; // 1-100
  investorAppeal: number; // 1-100
  wordCount: number;
  recommendedWordCount: { min: number; max: number };
  overallFeedback: string;
}

interface BusinessPlanSection {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  status: "draft" | "generated" | "edited" | "reviewed";
  icon: any;
  description: string;
  order: number;
  quality?: SectionQualityAssessment;
  lastGenerated?: string;
  template?: string;
  suggestions?: string[];
  isGenerating?: boolean;
  isAssessing?: boolean;
}

interface BusinessPlanGeneratorProps {
  ideaId: number;
  ideaData: any;
}

export default function BusinessPlanGenerator({ ideaId, ideaData }: BusinessPlanGeneratorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState("");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showQualityPanel, setShowQualityPanel] = useState(false);
  const [viewMode, setViewMode] = useState<"sections" | "full-document" | "quality-overview">("sections");

  const [businessPlan, setBusinessPlan] = useState<BusinessPlanSection[]>([
    {
      id: "executive-summary",
      title: "Executive Summary",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: Lightbulb,
      description: "A compelling overview of your startup's vision, mission, and key success factors",
      order: 1,
      template: "Include company mission, problem being solved, solution overview, market size, competitive advantage, financial highlights, and funding requirements.",
      suggestions: ["Start with a compelling hook", "Include key metrics and milestones", "Highlight your competitive advantage"]
    },
    {
      id: "problem-statement",
      title: "Problem Statement",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: Target,
      description: "Clear definition of the market problem you're solving",
      order: 2,
      template: "Define specific pain points, market scope, current inadequate solutions, cost of inaction, and supporting data.",
      suggestions: ["Quantify the problem size", "Use real customer stories", "Include market research data"]
    },
    {
      id: "solution-overview",
      title: "Solution Overview",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: Zap,
      description: "How your product or service addresses the identified problem",
      order: 3,
      template: "Describe core product/service, key features, problem-solving approach, technology advantages, and user experience.",
      suggestions: ["Focus on benefits over features", "Show clear value proposition", "Include proof of concept"]
    },
    {
      id: "market-analysis",
      title: "Market Analysis",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: BarChart3,
      description: "Comprehensive analysis of your target market and opportunity size",
      order: 4,
      template: "Include TAM/SAM/SOM, customer segments, growth trends, market entry strategy, and competitive landscape.",
      suggestions: ["Use credible data sources", "Define your ideal customer profile", "Show market growth trends"]
    },
    {
      id: "business-model",
      title: "Business Model",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: DollarSign,
      description: "How you plan to generate revenue and deliver value",
      order: 5,
      template: "Detail revenue streams, pricing strategy, unit economics, sales channels, scalability factors, and key partnerships.",
      suggestions: ["Show clear path to profitability", "Include unit economics", "Demonstrate scalability"]
    },
    {
      id: "marketing-strategy",
      title: "Marketing & Sales",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: TrendingUp,
      description: "Customer acquisition and retention strategies",
      order: 6,
      template: "Outline customer personas, marketing channels, acquisition strategy, brand positioning, and retention approach.",
      suggestions: ["Define your target personas", "Show cost-effective acquisition channels", "Include retention metrics"]
    },
    {
      id: "operations-plan",
      title: "Operations Plan",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: Users,
      description: "Day-to-day operations, processes, and organizational structure",
      order: 7,
      template: "Describe key processes, technology infrastructure, service delivery, quality control, and scalability considerations.",
      suggestions: ["Show operational efficiency", "Plan for scale", "Include key metrics"]
    },
    {
      id: "management-team",
      title: "Management Team",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: Users,
      description: "Key team members, advisors, and organizational structure",
      order: 8,
      template: "Present founder backgrounds, relevant experience, team roles, advisory board, and hiring plan.",
      suggestions: ["Highlight relevant experience", "Show complementary skills", "Include advisor credentials"]
    },
    {
      id: "financial-projections",
      title: "Financial Projections",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: BarChart3,
      description: "Revenue forecasts, expense projections, and funding requirements",
      order: 9,
      template: "Provide 3-5 year projections, key metrics, break-even analysis, cash flow, and KPIs.",
      suggestions: ["Use realistic assumptions", "Show path to profitability", "Include sensitivity analysis"]
    },
    {
      id: "funding-request",
      title: "Funding Request",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: DollarSign,
      description: "Investment requirements and use of funds",
      order: 10,
      template: "Detail funding amount, use of funds breakdown, milestones, timeline, ROI projections, and exit strategy.",
      suggestions: ["Justify the investment amount", "Show clear milestones", "Include return projections"]
    },
    {
      id: "risk-analysis",
      title: "Risk Analysis",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: Shield,
      description: "Potential risks and mitigation strategies",
      order: 11,
      template: "Identify market, operational, financial, and regulatory risks with corresponding mitigation strategies.",
      suggestions: ["Be honest about risks", "Show preparedness", "Include contingency plans"]
    },
    {
      id: "implementation-timeline",
      title: "Implementation Timeline",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: Calendar,
      description: "Key milestones and timeline for execution",
      order: 12,
      template: "Create roadmap with milestones, product development timeline, market phases, team growth, and funding rounds.",
      suggestions: ["Show achievable milestones", "Include key checkpoints", "Plan for contingencies"]
    }
  ]);

  // Generate individual section with AI
  const generateSectionMutation = useMutation({
    mutationFn: async (sectionId: string) => {
      const existingContent = businessPlan.reduce((acc, section) => {
        if (section.content && section.id !== sectionId) {
          acc[section.id] = section.content;
        }
        return acc;
      }, {} as Record<string, string>);

      const response = await apiRequest(`/api/startup-ideas/${ideaId}/business-plan/section/${sectionId}`, {
        method: "POST",
        body: JSON.stringify({ existingContent })
      });
      return response;
    },
    onSuccess: (data, sectionId) => {
      setBusinessPlan(prev => prev.map(section => 
        section.id === sectionId 
          ? { 
              ...section, 
              content: data.content,
              wordCount: data.content.split(' ').length,
              status: "generated" as const,
              quality: data.quality,
              lastGenerated: new Date().toISOString(),
              isGenerating: false
            }
          : section
      ));
      
      toast({
        title: "Section generated successfully!",
        description: `${businessPlan.find(s => s.id === sectionId)?.title} is ready for review.`,
      });
    },
    onError: (error, sectionId) => {
      setBusinessPlan(prev => prev.map(section => 
        section.id === sectionId ? { ...section, isGenerating: false } : section
      ));
      
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Assess section quality
  const assessQualityMutation = useMutation({
    mutationFn: async ({ sectionId, content }: { sectionId: string; content: string }) => {
      return apiRequest(`/api/business-plan/assess-section/${sectionId}`, {
        method: "POST",
        body: JSON.stringify({ content })
      });
    },
    onSuccess: (quality, { sectionId }) => {
      setBusinessPlan(prev => prev.map(section => 
        section.id === sectionId 
          ? { ...section, quality, isAssessing: false }
          : section
      ));
    },
    onError: (error, { sectionId }) => {
      setBusinessPlan(prev => prev.map(section => 
        section.id === sectionId ? { ...section, isAssessing: false } : section
      ));
      
      toast({
        title: "Assessment failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Export business plan
  const exportMutation = useMutation({
    mutationFn: async (format: 'pdf' | 'docx') => {
      const sections = businessPlan.reduce((acc, section) => {
        if (section.content) {
          acc[section.id] = section.content;
        }
        return acc;
      }, {} as Record<string, string>);

      return apiRequest(`/api/startup-ideas/${ideaId}/business-plan/export`, {
        method: "POST",
        body: JSON.stringify({ format, sections })
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Export ready!",
        description: `Your business plan has been exported as ${data.format.toUpperCase()}.`,
      });
      // In a real implementation, this would trigger a download
      window.open(data.exportUrl, '_blank');
    },
    onError: (error) => {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerateSection = (sectionId: string) => {
    setBusinessPlan(prev => prev.map(section => 
      section.id === sectionId ? { ...section, isGenerating: true } : section
    ));
    generateSectionMutation.mutate(sectionId);
  };

  const handleAssessQuality = (sectionId: string, content: string) => {
    setBusinessPlan(prev => prev.map(section => 
      section.id === sectionId ? { ...section, isAssessing: true } : section
    ));
    assessQualityMutation.mutate({ sectionId, content });
  };

  const handleGenerateAll = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    for (let i = 0; i < businessPlan.length; i++) {
      const section = businessPlan[i];
      setCurrentSection(section.title);
      
      await new Promise((resolve) => {
        generateSectionMutation.mutate(section.id, {
          onSettled: () => {
            setGenerationProgress(((i + 1) / businessPlan.length) * 100);
            setTimeout(resolve, 500); // Small delay between sections
          }
        });
      });
    }
    
    setIsGenerating(false);
  };

  const handleSaveSection = (sectionId: string, content: string) => {
    setBusinessPlan(prev => prev.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            content, 
            wordCount: content.split(' ').length,
            status: "edited" as const 
          }
        : section
    ));
    setEditingSection(null);
    
    // Auto-assess quality after editing
    handleAssessQuality(sectionId, content);
    
    toast({
      title: "Section updated",
      description: "Your changes have been saved and quality is being assessed.",
    });
  };

  const handleReorderSection = (sectionId: string, direction: 'up' | 'down') => {
    setBusinessPlan(prev => {
      const currentIndex = prev.findIndex(s => s.id === sectionId);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newOrder = [...prev];
      [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];
      
      return newOrder.map((section, index) => ({ ...section, order: index + 1 }));
    });
  };

  const getTotalWordCount = () => {
    return businessPlan.reduce((total, section) => total + section.wordCount, 0);
  };

  const getCompletionPercentage = () => {
    const completedSections = businessPlan.filter(section => 
      section.status === "generated" || section.status === "edited" || section.status === "reviewed"
    ).length;
    return (completedSections / businessPlan.length) * 100;
  };

  const getOverallQualityScore = () => {
    const sectionsWithQuality = businessPlan.filter(s => s.quality);
    if (sectionsWithQuality.length === 0) return 0;
    
    const totalScore = sectionsWithQuality.reduce((sum, section) => sum + (section.quality?.score || 0), 0);
    return Math.round(totalScore / sectionsWithQuality.length);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "generated": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "edited": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "reviewed": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const QualityMeter = ({ quality }: { quality?: SectionQualityAssessment }) => {
    if (!quality) return null;

    return (
      <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Quality Score</span>
          <Badge className={`${getQualityColor(quality.score)} bg-transparent border`}>
            {quality.score}/100
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">{quality.completeness}%</div>
            <div className="text-xs text-gray-600">Complete</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{quality.professionalism}%</div>
            <div className="text-xs text-gray-600">Professional</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-purple-600">{quality.investorAppeal}%</div>
            <div className="text-xs text-gray-600">Investor Appeal</div>
          </div>
        </div>

        <Progress value={quality.score} className="h-2" />
        
        <div className="text-sm">
          <div className="font-medium mb-2">{quality.overallFeedback}</div>
          <div className="text-gray-600">
            {quality.wordCount} words (recommended: {quality.recommendedWordCount.min}-{quality.recommendedWordCount.max})
          </div>
        </div>

        {quality.strengths.length > 0 && (
          <div className="text-sm">
            <div className="font-medium text-green-600 mb-1 flex items-center">
              <ThumbsUp className="w-3 h-3 mr-1" />
              Strengths
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {quality.strengths.map((strength, index) => (
                <li key={index} className="text-xs">{strength}</li>
              ))}
            </ul>
          </div>
        )}

        {quality.improvements.length > 0 && (
          <div className="text-sm">
            <div className="font-medium text-orange-600 mb-1 flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Improvements
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {quality.improvements.map((improvement, index) => (
                <li key={index} className="text-xs">{improvement}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  if (isGenerating) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Generating Your Comprehensive Business Plan
          </CardTitle>
          <div className="flex items-center justify-center mb-6">
            <Brain className="w-12 h-12 text-blue-600 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Creating: {ideaData?.ideaTitle}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our AI is crafting an investor-grade business plan with quality assessment
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Current Section: {currentSection}</span>
              <span>{Math.round(generationProgress)}%</span>
            </div>
            <Progress value={generationProgress} className="h-3" />
          </div>
          
          <div className="text-center text-sm text-gray-500">
            This may take 3-5 minutes to ensure comprehensive analysis and quality assessment
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6" data-testid="business-plan-generator">
      {/* Header with Enhanced Stats */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Award className="w-6 h-6 mr-2 text-blue-600" />
              Investor-Grade Business Plan
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm" data-testid="completion-percentage">
                {Math.round(getCompletionPercentage())}% Complete
              </Badge>
              <Badge variant="outline" className="text-sm" data-testid="word-count">
                {getTotalWordCount().toLocaleString()} words
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-sm ${getQualityColor(getOverallQualityScore())}`}
                data-testid="quality-score"
              >
                Quality: {getOverallQualityScore()}/100
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {businessPlan.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Sections</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {businessPlan.filter(s => s.status !== "draft").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {getTotalWordCount().toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Words</div>
            </div>

            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${getQualityColor(getOverallQualityScore())}`}>
                {getOverallQualityScore()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Quality Score</div>
            </div>
          </div>
          
          <Progress value={getCompletionPercentage()} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Enhanced Generation Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                AI Business Plan Generation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Generate comprehensive, investor-ready business plan with quality assessment
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleGenerateAll}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="generate-all-button"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate All Sections
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowQualityPanel(!showQualityPanel)}
                data-testid="toggle-quality-panel"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showQualityPanel ? 'Hide' : 'Show'} Quality
              </Button>
            </div>
          </div>

          {/* Export Options */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Export your professional business plan for investors
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportMutation.mutate('pdf')}
                disabled={getTotalWordCount() === 0}
                data-testid="export-pdf"
              >
                <FileDown className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportMutation.mutate('docx')}
                disabled={getTotalWordCount() === 0}
                data-testid="export-docx"
              >
                <Download className="w-4 h-4 mr-2" />
                DOCX
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={getTotalWordCount() === 0}
                data-testid="print-plan"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Business Plan Sections */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="full-document">Full Document</TabsTrigger>
          <TabsTrigger value="quality-overview">Quality Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="space-y-6">
          <div className="grid gap-6">
            {businessPlan
              .sort((a, b) => a.order - b.order)
              .map((section) => {
                const IconComponent = section.icon;
                const isEditing = editingSection === section.id;
                
                return (
                  <Card 
                    key={section.id} 
                    className="border-0 shadow-sm hover:shadow-md transition-all duration-200"
                    data-testid={`section-${section.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{section.title}</CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{section.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {/* Quality indicator */}
                          {section.quality && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getQualityColor(section.quality.score)}`}
                              data-testid={`quality-badge-${section.id}`}
                            >
                              {section.quality.score}/100
                            </Badge>
                          )}
                          
                          {/* Status badge */}
                          <Badge className={`${getStatusColor(section.status)} text-xs`} variant="secondary">
                            {section.status}
                          </Badge>

                          {/* Section controls */}
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReorderSection(section.id, 'up')}
                              disabled={section.order === 1}
                              data-testid={`move-up-${section.id}`}
                            >
                              <ArrowUp className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReorderSection(section.id, 'down')}
                              disabled={section.order === businessPlan.length}
                              data-testid={`move-down-${section.id}`}
                            >
                              <ArrowDown className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* Generate AI button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateSection(section.id)}
                            disabled={section.isGenerating}
                            data-testid={`generate-ai-${section.id}`}
                          >
                            {section.isGenerating ? (
                              <>
                                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Brain className="w-4 h-4 mr-1" />
                                Generate with AI
                              </>
                            )}
                          </Button>

                          {/* Edit button */}
                          {section.content && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingSection(isEditing ? null : section.id)}
                              data-testid={`edit-${section.id}`}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Template and suggestions */}
                      {!section.content && !isEditing && (
                        <div className="mt-4 space-y-3">
                          <Alert>
                            <BookOpen className="w-4 h-4" />
                            <AlertDescription>
                              <div className="font-medium mb-2">Template Guide:</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{section.template}</div>
                            </AlertDescription>
                          </Alert>
                          
                          {section.suggestions && section.suggestions.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Suggestions:</span>
                              {section.suggestions.map((suggestion, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {suggestion}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardHeader>
                    
                    <CardContent>
                      {isEditing ? (
                        <div className="space-y-4">
                          <Textarea
                            value={section.content}
                            onChange={(e) => {
                              const updatedContent = e.target.value;
                              setBusinessPlan(prev => prev.map(s => 
                                s.id === section.id ? { ...s, content: updatedContent, wordCount: updatedContent.split(' ').length } : s
                              ));
                            }}
                            rows={12}
                            className="min-h-[300px] font-mono text-sm"
                            placeholder={`Enter content for ${section.title}...\n\n${section.template}`}
                            data-testid={`textarea-${section.id}`}
                          />
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {section.content.split(' ').length} words
                              {section.quality && (
                                <span className="ml-2">
                                  (recommended: {section.quality.recommendedWordCount.min}-{section.quality.recommendedWordCount.max})
                                </span>
                              )}
                            </div>
                            <div className="space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingSection(null)}
                                data-testid={`cancel-edit-${section.id}`}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleSaveSection(section.id, section.content)}
                                data-testid={`save-${section.id}`}
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Save & Assess
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {section.content ? (
                            <div className="space-y-4">
                              <div className="prose max-w-none dark:prose-invert">
                                <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {section.content}
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t">
                                <div className="flex items-center space-x-4">
                                  <span>{section.wordCount} words</span>
                                  {section.lastGenerated && (
                                    <span>Generated: {new Date(section.lastGenerated).toLocaleDateString()}</span>
                                  )}
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleAssessQuality(section.id, section.content)}
                                    disabled={section.isAssessing}
                                    data-testid={`assess-quality-${section.id}`}
                                  >
                                    {section.isAssessing ? (
                                      <>
                                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                        Assessing...
                                      </>
                                    ) : (
                                      <>
                                        <Star className="w-3 h-3 mr-1" />
                                        Assess Quality
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>

                              {/* Quality assessment panel */}
                              {showQualityPanel && section.quality && (
                                <QualityMeter quality={section.quality} />
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                              <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                              <h3 className="text-lg font-semibold mb-2">Ready to Generate</h3>
                              <p className="mb-4">Use "Generate with AI" to create this section automatically</p>
                              <Button
                                onClick={() => handleGenerateSection(section.id)}
                                disabled={section.isGenerating}
                                className="bg-blue-600 hover:bg-blue-700"
                                data-testid={`generate-empty-${section.id}`}
                              >
                                {section.isGenerating ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    <Brain className="w-4 h-4 mr-2" />
                                    Generate with AI
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="full-document" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Complete Business Plan</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportMutation.mutate('pdf')}
                    disabled={getTotalWordCount() === 0}
                    data-testid="export-full-pdf"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportMutation.mutate('docx')}
                    disabled={getTotalWordCount() === 0}
                    data-testid="export-full-docx"
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Export DOCX
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={getTotalWordCount() === 0}
                    data-testid="print-full"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
              
              {getTotalWordCount() > 0 && (
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{getTotalWordCount().toLocaleString()} total words</span>
                  <span>•</span>
                  <span>{businessPlan.filter(s => s.content).length} completed sections</span>
                  <span>•</span>
                  <span className={getQualityColor(getOverallQualityScore())}>
                    Overall quality: {getOverallQualityScore()}/100
                  </span>
                </div>
              )}
            </CardHeader>
            
            <CardContent>
              <div className="prose max-w-none dark:prose-invert">
                {businessPlan.every(section => section.content) ? (
                  <div className="space-y-12">
                    {/* Title Page */}
                    <div className="text-center py-12 border-b border-gray-200 dark:border-gray-700">
                      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {ideaData?.ideaTitle || 'Business Plan'}
                      </h1>
                      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                        Comprehensive Business Plan
                      </p>
                      <div className="text-sm text-gray-500 dark:text-gray-500">
                        Generated on {new Date().toLocaleDateString()}
                        <br />
                        {getTotalWordCount().toLocaleString()} words • {businessPlan.length} sections
                      </div>
                    </div>

                    {/* Table of Contents */}
                    <div className="py-8">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Table of Contents</h2>
                      <div className="space-y-2">
                        {businessPlan
                          .sort((a, b) => a.order - b.order)
                          .map((section, index) => (
                            <div key={section.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                              <div className="flex items-center space-x-3">
                                <span className="text-gray-500 dark:text-gray-400">{index + 1}.</span>
                                <span className="font-medium">{section.title}</span>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {section.wordCount} words
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Sections */}
                    {businessPlan
                      .sort((a, b) => a.order - b.order)
                      .map((section, index) => (
                        <div key={section.id} className="py-8 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                          <div className="flex items-center mb-6">
                            <span className="text-gray-400 text-lg font-bold mr-4">{index + 1}.</span>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                              {section.title}
                            </h2>
                          </div>
                          <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                            {section.content}
                          </div>
                          {section.quality && getOverallQualityScore() > 0 && (
                            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
                              Section quality score: {section.quality.score}/100
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                    <FileText className="w-20 h-20 mx-auto mb-6 opacity-30" />
                    <h3 className="text-2xl font-semibold mb-4">Business Plan in Progress</h3>
                    <p className="mb-6 max-w-md mx-auto">
                      Generate sections individually or use "Generate All Sections" to create your complete business plan
                    </p>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <strong>{businessPlan.filter(s => s.content).length}</strong> of <strong>{businessPlan.length}</strong> sections completed
                      </div>
                      <Progress value={getCompletionPercentage()} className="max-w-xs mx-auto" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality-overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Quality Assessment Overview
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive quality analysis for investor readiness
              </p>
            </CardHeader>
            
            <CardContent>
              {/* Overall quality metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className={`text-2xl font-bold ${getQualityColor(getOverallQualityScore())} mb-2`}>
                    {getOverallQualityScore()}/100
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Overall Quality</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {businessPlan.filter(s => s.quality && s.quality.score >= 85).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Excellent Sections</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">
                    {businessPlan.filter(s => s.quality && s.quality.score >= 70 && s.quality.score < 85).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Good Sections</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-2">
                    {businessPlan.filter(s => s.quality && s.quality.score < 70).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Needs Improvement</div>
                </div>
              </div>

              {/* Section-by-section quality analysis */}
              <div className="space-y-4">
                {businessPlan
                  .filter(section => section.quality)
                  .sort((a, b) => (b.quality?.score || 0) - (a.quality?.score || 0))
                  .map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <Card key={section.id} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <IconComponent className="w-5 h-5 text-blue-600" />
                            <div>
                              <h3 className="font-semibold">{section.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{section.wordCount} words</p>
                            </div>
                          </div>
                          <Badge 
                            className={`${getQualityColor(section.quality?.score || 0)} bg-transparent border`}
                          >
                            {section.quality?.score}/100
                          </Badge>
                        </div>
                        
                        <QualityMeter quality={section.quality} />
                      </Card>
                    );
                  })}
              </div>

              {businessPlan.filter(s => s.quality).length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Star className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <h3 className="text-xl font-semibold mb-2">No Quality Assessments Yet</h3>
                  <p className="mb-6">Generate sections or assess existing content to see quality metrics</p>
                  <Button
                    onClick={handleGenerateAll}
                    disabled={isGenerating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate & Assess All Sections
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}