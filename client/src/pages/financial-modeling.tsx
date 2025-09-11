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
    queryKey: [`/api/ideas?email=${userEmail}`],
    enabled: !!userEmail,
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Calculator className="w-12 h-12 text-green-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading your startup data...</p>
        </div>
      </div>
    );
  }

  if (!currentIdeaId || !ideaData) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Financial Modeling</h1>
                  <p className="text-gray-600">Create comprehensive financial projections and investment analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* No Idea Selected */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-16">
              <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No Startup Idea Selected
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                To create financial projections, you need to submit and validate a startup idea first. 
                Our AI will use your validated idea to build comprehensive financial models.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/submit-idea">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Target className="w-4 h-4 mr-2" />
                    Submit New Idea
                  </Button>
                </Link>
                <Link href="/business-plan">
                  <Button variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Business Plan First
                  </Button>
                </Link>
              </div>

              {Array.isArray(userIdeas) && userIdeas.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Your Previous Ideas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userIdeas.map((idea: any) => (
                      <Card key={idea.id} className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => {
                              localStorage.setItem("currentIdeaId", idea.id.toString());
                              setCurrentIdeaId(idea.id);
                            }}>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{idea.ideaTitle}</h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{idea.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{idea.industry}</Badge>
                            <Button size="sm" variant="outline">Select</Button>
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
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              What You'll Get
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <Card key={index} className="border-0 shadow-sm">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <SidebarNavigation />
      
      {/* Main Content */}
      <div className="flex-1">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Financial Modeling</h1>
                <p className="text-gray-600">Creating financial model for: {idea?.ideaTitle}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{idea?.industry}</Badge>
              <Badge variant="outline">{idea?.stage}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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