import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Target, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Lightbulb,
  FileText,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Clock,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";
import AdvancedIdeaForm from "@/components/advanced-idea-form";
import SidebarNavigation from "@/components/dashboard/sidebar-navigation";
import MobileNavigation from "@/components/mobile-navigation";

export default function SubmitIdea() {
  const [showForm, setShowForm] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentIdeaId, setCurrentIdeaId] = useState<number | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const ideaId = localStorage.getItem("currentIdeaId");
    if (email) setUserEmail(email);
    if (ideaId) setCurrentIdeaId(parseInt(ideaId));
  }, []);

  // Fetch user's submitted ideas
  const { data: userIdeas = [], isLoading: ideasLoading } = useQuery({
    queryKey: ['/api/ideas'],
  });

  // Fetch current idea details
  const { data: currentIdea } = useQuery({
    queryKey: [`/api/ideas/${currentIdeaId}`],
    enabled: !!currentIdeaId,
  });

  const handleSelectIdea = (idea: any) => {
    localStorage.setItem("currentIdeaId", idea.id.toString());
    setCurrentIdeaId(idea.id);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'validated':
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'analyzing':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'draft':
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const benefits = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Get comprehensive startup idea validation using GPT-4 technology and proven frameworks"
    },
    {
      icon: Target,
      title: "Market Assessment",
      description: "Understand your market potential, competition landscape, and customer demand"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Receive detailed analysis results in minutes, not weeks of manual research"
    },
    {
      icon: BarChart3,
      title: "Feasibility Scoring",
      description: "Get technical, financial, and market feasibility scores with actionable insights"
    },
    {
      icon: FileText,
      title: "Strategic Roadmap",
      description: "Receive personalized recommendations and next steps for your startup journey"
    },
    {
      icon: CheckCircle,
      title: "SWOT Analysis",
      description: "Comprehensive strengths, weaknesses, opportunities, and threats evaluation"
    }
  ];

  const analysisSteps = [
    {
      step: 1,
      title: "Idea Submission",
      description: "Share your startup concept with detailed problem and solution information"
    },
    {
      step: 2,
      title: "AI Processing",
      description: "Our AI analyzes market potential, feasibility, and competitive landscape"
    },
    {
      step: 3,
      title: "Comprehensive Report",
      description: "Receive detailed validation scores, insights, and strategic recommendations"
    },
    {
      step: 4,
      title: "Development Plan",
      description: "Get guided next steps to transform your idea into a viable business"
    }
  ];

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <div className="hidden lg:block">
          <SidebarNavigation />
        </div>
        <MobileNavigation />
        <div className="flex-1 flex flex-col">
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowForm(false)}
                  data-testid="button-back-ideas"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Ideas
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Submit New Idea</h1>
                  <p className="text-gray-600 dark:text-gray-300">Get AI-powered validation for your startup concept</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <AdvancedIdeaForm />
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
                <Button variant="outline" size="sm" data-testid="button-back-dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-page-title">
                  Startup Ideas
                </h1>
                <p className="text-gray-600 dark:text-gray-300" data-testid="text-page-description">
                  Manage and validate your startup concepts
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              data-testid="button-submit-new-idea"
            >
              <Plus className="w-4 h-4 mr-2" />
              Submit New Idea
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="my-ideas" className="space-y-6" data-testid="tabs-ideas">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="my-ideas" data-testid="tab-my-ideas">My Ideas ({(userIdeas as any[]).length})</TabsTrigger>
                <TabsTrigger value="validation-process" data-testid="tab-process">Validation Process</TabsTrigger>
              </TabsList>

              <TabsContent value="my-ideas" className="space-y-6">
                {/* Current Active Idea */}
                {currentIdea && (currentIdea as any) && (
                  <Card className="border-l-4 border-l-blue-500" data-testid="card-active-idea">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Target className="w-5 h-5 text-blue-600" />
                          <span>Currently Working On</span>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{(currentIdea as any).ideaTitle}</h3>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">{(currentIdea as any).description}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant="secondary">{(currentIdea as any).industry}</Badge>
                          <Badge variant="outline">{(currentIdea as any).stage}</Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {new Date((currentIdea as any).createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link href="/business-plan">
                            <Button size="sm" data-testid="button-generate-plan">
                              <FileText className="w-4 h-4 mr-1" />
                              Generate Business Plan
                            </Button>
                          </Link>
                          <Link href="/pitch-deck">
                            <Button size="sm" variant="outline" data-testid="button-create-pitch">
                              <BarChart3 className="w-4 h-4 mr-1" />
                              Create Pitch Deck
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Ideas List */}
                {ideasLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1,2,3].map((i) => (
                      <Card key={i} className="animate-pulse" data-testid={`skeleton-${i}`}>
                        <CardContent className="p-6">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                          <div className="flex space-x-2">
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (userIdeas as any[]).length === 0 ? (
                  <Card data-testid="card-no-ideas">
                    <CardContent className="text-center py-16">
                      <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Ideas Yet</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        Start your entrepreneurial journey by submitting your first startup idea for AI validation.
                      </p>
                      <Button 
                        onClick={() => setShowForm(true)}
                        size="lg"
                        data-testid="button-submit-first-idea"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Submit Your First Idea
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(userIdeas as any[]).map((idea: any) => (
                      <Card 
                        key={idea.id} 
                        className={`cursor-pointer hover:shadow-md transition-all ${
                          currentIdeaId === idea.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/10' : ''
                        }`}
                        onClick={() => handleSelectIdea(idea)}
                        data-testid={`card-idea-${idea.id}`}
                      >
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{idea.ideaTitle}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{idea.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">{idea.industry}</Badge>
                              <Badge className={getStatusColor(idea.status)} variant="outline">
                                {idea.status || 'Draft'}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(idea.createdAt).toLocaleDateString()}
                              </div>
                              {currentIdeaId === idea.id && (
                                <Badge variant="default" className="text-xs">Active</Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="validation-process" className="space-y-6">

                {/* Benefits Section */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    AI Validation Benefits
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {benefits.map((benefit, index) => {
                      const IconComponent = benefit.icon;
                      return (
                        <Card key={index} className="border-0 shadow-sm" data-testid={`benefit-${index}`}>
                          <CardContent className="p-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {benefit.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                              {benefit.description}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Process Section */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Validation Process
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {analysisSteps.map((step, index) => (
                      <Card key={index} className="text-center" data-testid={`step-${index}`}>
                        <CardContent className="p-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-lg font-bold text-white">{step.step}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {step.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            {step.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}