import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator, 
  ArrowLeft, 
  Download, 
  DollarSign,
  TrendingUp,
  PieChart,
  BarChart3,
  Target
} from "lucide-react";
import { Link } from "wouter";
import FinancialModeling from "@/components/financial-modeling";
import IdeaAnalysisDashboard from "@/components/idea-analysis-dashboard";
import SidebarNavigation from "@/components/dashboard/sidebar-navigation";
import MobileNavigation from "@/components/mobile-navigation";

export default function FinancialModelingPage() {
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

  const { data: userIdeas = [] } = useQuery({
    queryKey: ['/api/ideas'],
  });

  const idea = ideaData as any;

  const benefits = [
    {
      icon: Calculator,
      title: "Financial Projections",
      description: "5-year revenue and expense forecasts with AI analysis"
    },
    {
      icon: DollarSign,
      title: "Investment Calculator", 
      description: "Calculate funding needs and use of funds breakdown"
    },
    {
      icon: PieChart,
      title: "Unit Economics",
      description: "LTV, CAC, churn rate, and payback period analysis"
    },
    {
      icon: TrendingUp,
      title: "Growth Modeling",
      description: "Revenue growth scenarios and break-even analysis"
    }
  ];

  if (isLoadingIdea) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <MobileNavigation />
        <div className="flex">
          <SidebarNavigation className="hidden lg:flex" />
          <div className="flex-1 flex items-center justify-center min-h-screen">
            <div className="text-center px-4">
              <Calculator className="w-12 h-12 text-green-600 animate-pulse mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Loading your startup data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentIdeaId || !ideaData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <MobileNavigation />
        <div className="flex">
          <SidebarNavigation className="hidden lg:flex" />
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 lg:space-x-4">
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" data-testid="button-back-dashboard">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Back to Dashboard</span>
                      <span className="sm:hidden">Back</span>
                    </Button>
                  </Link>
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-page-title">
                      Financial Modeling
                    </h1>
                    <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 hidden sm:block" data-testid="text-page-description">
                      Create comprehensive financial projections and investment analysis
                    </p>
                  </div>
                </div>
              </div>
            </div>
          
            {/* Main Content */}
            <div className="flex-1 p-4 lg:p-6 overflow-auto">
              <div className="max-w-6xl mx-auto">
                <Card className="border-0 shadow-lg" data-testid="card-no-idea-selected">
                  <CardContent className="text-center py-12 lg:py-16">
                    <Calculator className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4" data-testid="text-no-idea-title">
                      No Startup Idea Selected
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto text-sm lg:text-base px-4" data-testid="text-no-idea-description">
                      To create financial projections, you need to submit and validate a startup idea first. 
                      Our AI will use your validated idea to build comprehensive financial models and investment analysis.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <Link href="/submit-idea">
                        <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" data-testid="button-submit-idea">
                          <Target className="w-4 h-4 mr-2" />
                          Submit New Idea
                        </Button>
                      </Link>
                      <Link href="/business-plan">
                        <Button variant="outline" className="w-full sm:w-auto" data-testid="button-business-plan-first">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Business Plan First
                        </Button>
                      </Link>
                    </div>

                    {Array.isArray(userIdeas) && userIdeas.length > 0 && (
                      <div className="mt-12">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6" data-testid="text-previous-ideas">
                          Your Previous Ideas
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {userIdeas.map((idea: any) => (
                            <Card key={idea.id} className="cursor-pointer hover:shadow-md transition-shadow"
                                  onClick={() => {
                                    localStorage.setItem("currentIdeaId", idea.id.toString());
                                    setCurrentIdeaId(idea.id);
                                  }}
                                  data-testid={`card-idea-${idea.id}`}>
                              <CardContent className="p-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2" data-testid={`text-idea-title-${idea.id}`}>{idea.ideaTitle}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2" data-testid={`text-idea-description-${idea.id}`}>{idea.description}</p>
                                <div className="flex items-center justify-between">
                                  <Badge variant="secondary" data-testid={`badge-industry-${idea.id}`}>{idea.industry}</Badge>
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
                <div className="mt-12">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white text-center mb-8" data-testid="text-benefits-title">
                    What You'll Get
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {benefits.map((benefit, index) => {
                      const IconComponent = benefit.icon;
                      return (
                        <Card key={index} className="border-0 shadow-sm" data-testid={`card-benefit-${index}`}>
                          <CardContent className="p-4 lg:p-6 text-center">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                              <IconComponent className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm lg:text-base" data-testid={`text-benefit-title-${index}`}>{benefit.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-xs lg:text-sm" data-testid={`text-benefit-description-${index}`}>{benefit.description}</p>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MobileNavigation />
      <div className="flex">
        <SidebarNavigation className="hidden lg:flex" />
        <div className="flex-1">
          {/* Header */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-2 lg:space-x-4">
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" data-testid="button-back-dashboard">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Back to Dashboard</span>
                      <span className="sm:hidden">Back</span>
                    </Button>
                  </Link>
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-page-title">Financial Modeling</h1>
                    <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300" data-testid="text-current-idea">Creating financial model for: {idea?.ideaTitle}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-wrap">
                  <Badge variant="secondary" data-testid="badge-industry">{idea?.industry}</Badge>
                  <Badge variant="outline" data-testid="badge-stage">{idea?.stage}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <Tabs defaultValue="modeling" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="modeling">Financial Modeling</TabsTrigger>
                <TabsTrigger value="analysis">Idea Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="modeling" className="space-y-6">
                <FinancialModeling 
                  ideaData={idea}
                  businessPlan={idea?.businessPlan}
                />
              </TabsContent>

              <TabsContent value="analysis" className="space-y-6">
                <IdeaAnalysisDashboard 
                  ideaId={currentIdeaId!} 
                  ideaData={idea} 
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}