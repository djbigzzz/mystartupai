import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BusinessPlanSection {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  status: "draft" | "generated" | "edited";
  icon: any;
  description: string;
}

interface BusinessPlanGeneratorProps {
  ideaId: number;
  ideaData: any;
}

export default function BusinessPlanGenerator({ ideaId, ideaData }: BusinessPlanGeneratorProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState("");
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const [businessPlan, setBusinessPlan] = useState<BusinessPlanSection[]>([
    {
      id: "executive-summary",
      title: "Executive Summary",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: Lightbulb,
      description: "A compelling overview of your startup's vision, mission, and key success factors"
    },
    {
      id: "problem-statement",
      title: "Problem Statement",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: Target,
      description: "Clear definition of the market problem you're solving"
    },
    {
      id: "solution-overview",
      title: "Solution Overview",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: Zap,
      description: "How your product or service addresses the identified problem"
    },
    {
      id: "market-analysis",
      title: "Market Analysis",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: BarChart3,
      description: "Comprehensive analysis of your target market and opportunity size"
    },
    {
      id: "business-model",
      title: "Business Model",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: DollarSign,
      description: "How you plan to generate revenue and deliver value"
    },
    {
      id: "marketing-strategy",
      title: "Marketing & Sales",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: TrendingUp,
      description: "Customer acquisition and retention strategies"
    },
    {
      id: "operations-plan",
      title: "Operations Plan",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: Users,
      description: "Day-to-day operations, processes, and organizational structure"
    },
    {
      id: "management-team",
      title: "Management Team",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: Users,
      description: "Key team members, advisors, and organizational structure"
    },
    {
      id: "financial-projections",
      title: "Financial Projections",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: BarChart3,
      description: "Revenue forecasts, expense projections, and funding requirements"
    },
    {
      id: "funding-request",
      title: "Funding Request",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: DollarSign,
      description: "Investment requirements and use of funds"
    },
    {
      id: "risk-analysis",
      title: "Risk Analysis",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: Shield,
      description: "Potential risks and mitigation strategies"
    },
    {
      id: "implementation-timeline",
      title: "Implementation Timeline",
      content: "",
      wordCount: 0,
      status: "draft",
      icon: Calendar,
      description: "Key milestones and timeline for execution"
    }
  ]);

  const generateBusinessPlanMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/startup-ideas/${ideaId}/business-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate business plan");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setBusinessPlan(prev => prev.map(section => ({
        ...section,
        content: data[section.id] || `Generated content for ${section.title}...`,
        wordCount: data[section.id] ? data[section.id].split(' ').length : 0,
        status: "generated" as const
      })));
      
      toast({
        title: "Business plan generated successfully!",
        description: "Your comprehensive business plan is ready for review.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate progress for each section
    const sections = businessPlan.map(s => s.title);
    for (let i = 0; i < sections.length; i++) {
      setCurrentSection(sections[i]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerationProgress(((i + 1) / sections.length) * 100);
    }
    
    generateBusinessPlanMutation.mutate();
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
    
    toast({
      title: "Section updated",
      description: "Your changes have been saved.",
    });
  };

  const getTotalWordCount = () => {
    return businessPlan.reduce((total, section) => total + section.wordCount, 0);
  };

  const getCompletionPercentage = () => {
    const completedSections = businessPlan.filter(section => 
      section.status === "generated" || section.status === "edited"
    ).length;
    return (completedSections / businessPlan.length) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "generated": return "bg-green-100 text-green-800";
      case "edited": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isGenerating) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
            Generating Your Business Plan
          </CardTitle>
          <div className="flex items-center justify-center mb-6">
            <Brain className="w-12 h-12 text-blue-600 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Creating: {ideaData?.ideaTitle}
            </h3>
            <p className="text-gray-600 mb-6">
              Our AI is crafting a comprehensive business plan tailored to your startup
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Current Section: {currentSection}</span>
              <span>{Math.round(generationProgress)}%</span>
            </div>
            <Progress value={generationProgress} className="h-3" />
          </div>
          
          <div className="text-center text-sm text-gray-500">
            This may take 2-3 minutes to ensure comprehensive analysis
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Business Plan Generator
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                {Math.round(getCompletionPercentage())}% Complete
              </Badge>
              <Badge variant="outline" className="text-sm">
                {getTotalWordCount().toLocaleString()} words
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {businessPlan.length}
              </div>
              <div className="text-sm text-gray-600">Total Sections</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {businessPlan.filter(s => s.status !== "draft").length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {getTotalWordCount().toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Words</div>
            </div>
          </div>
          
          <Progress value={getCompletionPercentage()} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Generation Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Generate AI Business Plan
              </h3>
              <p className="text-gray-600">
                Create a comprehensive business plan based on your validated startup idea
              </p>
            </div>
            <Button
              onClick={handleGeneratePlan}
              disabled={generateBusinessPlanMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {generateBusinessPlanMutation.isPending ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Business Plan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Business Plan Sections */}
      <Tabs defaultValue="sections" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="full-document">Full Document</TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="space-y-6">
          <div className="grid gap-6">
            {businessPlan.map((section) => {
              const IconComponent = section.icon;
              const isEditing = editingSection === section.id;
              
              return (
                <Card key={section.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                          <p className="text-sm text-gray-600">{section.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(section.status)} variant="secondary">
                          {section.status}
                        </Badge>
                        {section.content && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingSection(isEditing ? null : section.id)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-4">
                        <Textarea
                          value={section.content}
                          onChange={(e) => {
                            const updatedContent = e.target.value;
                            setBusinessPlan(prev => prev.map(s => 
                              s.id === section.id ? { ...s, content: updatedContent } : s
                            ));
                          }}
                          rows={10}
                          className="min-h-[200px]"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {section.content.split(' ').length} words
                          </span>
                          <div className="space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingSection(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSaveSection(section.id, section.content)}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {section.content ? (
                          <div className="prose max-w-none">
                            <div className="whitespace-pre-wrap text-gray-700">
                              {section.content}
                            </div>
                            <div className="mt-4 text-sm text-gray-500">
                              {section.wordCount} words
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p>Generate the business plan to see this section</p>
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
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="prose max-w-none">
                {businessPlan.every(section => section.content) ? (
                  <div className="space-y-8">
                    {businessPlan.map((section) => (
                      <div key={section.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          {section.title}
                        </h2>
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                          {section.content}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <h3 className="text-xl font-semibold mb-2">No content yet</h3>
                    <p>Generate your business plan to see the complete document</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}