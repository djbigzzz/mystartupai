import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  ArrowLeft, 
  Download, 
  Share2, 
  Printer,
  Brain,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Shield,
  Lightbulb,
  BarChart3,
  Zap
} from "lucide-react";
import { Link } from "wouter";
import BusinessPlanGenerator from "@/components/business-plan-generator";
import IdeaAnalysisDashboard from "@/components/idea-analysis-dashboard";
import SidebarNavigation from "@/components/dashboard/sidebar-navigation";
import MobileNavigation from "@/components/mobile-navigation";

export default function BusinessPlan() {
  const [currentIdeaId, setCurrentIdeaId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const ideaId = localStorage.getItem("currentIdeaId");
    const email = localStorage.getItem("userEmail");
    
    if (ideaId) setCurrentIdeaId(parseInt(ideaId));
    if (email) setUserEmail(email);
  }, []);

  const { data: ideaData, isLoading: isLoadingIdea } = useQuery({
    queryKey: [`/api/ideas/${currentIdeaId}`],
    enabled: !!currentIdeaId,
  });

  const idea = ideaData as any;

  const { data: userIdeas = [] } = useQuery({
    queryKey: ['/api/ideas'],
  });

  const benefits = [
    {
      icon: FileText,
      title: "Comprehensive Documentation",
      description: "12-section business plan covering all investor requirements"
    },
    {
      icon: Brain,
      title: "AI-Generated Content",
      description: "Intelligent content creation based on your validated idea"
    },
    {
      icon: Target,
      title: "Market-Focused Strategy",
      description: "Detailed market analysis and competitive positioning"
    },
    {
      icon: DollarSign,
      title: "Financial Projections",
      description: "Realistic revenue forecasts and funding requirements"
    }
  ];

  if (isLoadingIdea) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <div className="hidden lg:block">
          <SidebarNavigation />
        </div>
        <MobileNavigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Brain className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading your startup data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentIdeaId || !ideaData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <div className="hidden lg:block">
          <SidebarNavigation />
        </div>
        <MobileNavigation />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" data-testid="button-back-dashboard">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-page-title">
                    Business Plan Generator
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300" data-testid="text-page-description">
                    Create comprehensive, investor-ready business plans
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-auto">
            {/* No Idea Selected */}
            <div className="max-w-6xl mx-auto">
              <Card className="border-0 shadow-lg" data-testid="card-no-idea-selected">
                <CardContent className="text-center py-16">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4" data-testid="text-no-idea-title">
                    No Startup Idea Selected
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto" data-testid="text-no-idea-description">
                    To generate a business plan, you need to submit and validate a startup idea first. 
                    Our AI will use your validated idea to create a comprehensive business plan.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/submit-idea">
                      <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-submit-idea">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Submit New Idea
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline" data-testid="button-back-dashboard-main">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                      </Button>
                    </Link>
                  </div>

                  {Array.isArray(userIdeas) && userIdeas.length > 0 && (
                    <div className="mt-12" data-testid="section-previous-ideas">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Your Previous Ideas
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userIdeas.map((idea: any) => (
                          <Card key={idea.id} className="cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => {
                                  localStorage.setItem("currentIdeaId", idea.id.toString());
                                  setCurrentIdeaId(idea.id);
                                }}
                                data-testid={`card-idea-${idea.id}`}>
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{idea.ideaTitle}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{idea.description}</p>
                              <div className="flex items-center justify-between">
                                <Badge variant="secondary">{idea.industry}</Badge>
                                <Button size="sm" variant="outline" data-testid={`button-select-idea-${idea.id}`}>Select</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Benefits Section */}
              <div className="mt-12" data-testid="section-benefits">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                  What You'll Get
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {benefits.map((benefit, index) => {
                    const IconComponent = benefit.icon;
                    return (
                      <Card key={index} className="border-0 shadow-sm" data-testid={`card-benefit-${index}`}>
                        <CardContent className="p-6 text-center">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">{benefit.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="hidden lg:block">
        <SidebarNavigation />
      </div>
      <MobileNavigation />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" data-testid="button-back-dashboard-header">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-business-plan-title">
                  Business Plan Generator
                </h1>
                <p className="text-gray-600 dark:text-gray-300" data-testid="text-idea-title">
                  Creating plan for: {idea?.ideaTitle}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" data-testid="badge-industry">{idea?.industry}</Badge>
              <Badge variant="outline" data-testid="badge-stage">{idea?.stage}</Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <Tabs defaultValue="generator" className="space-y-6" data-testid="tabs-business-plan">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generator" data-testid="tab-generator">Business Plan Generator</TabsTrigger>
              <TabsTrigger value="analysis" data-testid="tab-analysis">Idea Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="space-y-6">
              <BusinessPlanGenerator 
                ideaId={currentIdeaId} 
                ideaData={idea} 
              />
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <IdeaAnalysisDashboard 
                ideaId={currentIdeaId} 
                ideaData={idea} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}