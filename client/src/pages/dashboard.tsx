import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Brain, 
  FileText, 
  Presentation, 
  Loader2,
  Mail,
  Search,
  Plus
} from "lucide-react";
import AnalysisResults from "@/components/analysis-results";
import BusinessPlanViewer from "@/components/business-plan-viewer";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState("");
  const [currentIdeaId, setCurrentIdeaId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const ideaId = localStorage.getItem("currentIdeaId");
    
    if (email) setUserEmail(email);
    if (ideaId) setCurrentIdeaId(parseInt(ideaId));
  }, []);

  // Fetch user's ideas
  const { data: ideas = [], isLoading: ideasLoading } = useQuery({
    queryKey: ["/api/ideas", userEmail],
    enabled: !!userEmail,
    queryFn: () => api.getIdeasByEmail(userEmail),
  });

  // Fetch current idea details
  const { data: currentIdea, isLoading: ideaLoading } = useQuery({
    queryKey: ["/api/ideas", currentIdeaId],
    enabled: !!currentIdeaId,
    queryFn: () => api.getIdea(currentIdeaId!),
  });

  // Generate business plan mutation
  const generateBusinessPlanMutation = useMutation({
    mutationFn: (id: number) => api.generateBusinessPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ideas", currentIdeaId] });
      toast({
        title: "Business plan generated!",
        description: "Your comprehensive business plan is ready to view.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error generating business plan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate pitch deck mutation
  const generatePitchDeckMutation = useMutation({
    mutationFn: (id: number) => api.generatePitchDeck(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ideas", currentIdeaId] });
      toast({
        title: "Pitch deck generated!",
        description: "Your investor-ready pitch deck is ready to view.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error generating pitch deck",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerateBusinessPlan = () => {
    if (currentIdeaId) {
      generateBusinessPlanMutation.mutate(currentIdeaId);
    }
  };

  const handleGeneratePitchDeck = () => {
    if (currentIdeaId) {
      generatePitchDeckMutation.mutate(currentIdeaId);
    }
  };

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>Access Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            <Button 
              className="w-full"
              disabled={!userEmail}
              onClick={() => localStorage.setItem("userEmail", userEmail)}
            >
              <Mail className="w-4 h-4 mr-2" />
              Access Dashboard
            </Button>
            <div className="text-center">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-600">{userEmail}</p>
              </div>
            </div>
            <Link href="/">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Idea
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Ideas List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Your Ideas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ideasLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : ideas.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-slate-600 text-sm">No ideas yet</p>
                    <Link href="/">
                      <Button size="sm" className="mt-2">Submit Your First Idea</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ideas.map((idea) => (
                      <div
                        key={idea.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          currentIdeaId === idea.id 
                            ? "bg-blue-50 border border-blue-200" 
                            : "bg-slate-50 hover:bg-slate-100"
                        }`}
                        onClick={() => {
                          setCurrentIdeaId(idea.id);
                          localStorage.setItem("currentIdeaId", idea.id.toString());
                        }}
                      >
                        <h3 className="font-medium text-sm text-slate-900 truncate">
                          {idea.ideaTitle}
                        </h3>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {idea.industry}
                          </Badge>
                          <div className="flex space-x-1">
                            {idea.analysis && (
                              <div className="w-2 h-2 bg-green-500 rounded-full" title="Analyzed" />
                            )}
                            {idea.businessPlan && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" title="Business Plan" />
                            )}
                            {idea.pitchDeck && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full" title="Pitch Deck" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {!currentIdeaId ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Brain className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Select an idea to get started
                  </h3>
                  <p className="text-slate-600">
                    Choose an idea from the sidebar to view analysis, generate business plans, and create pitch decks.
                  </p>
                </CardContent>
              </Card>
            ) : ideaLoading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-slate-600">Loading your startup idea...</p>
                </CardContent>
              </Card>
            ) : currentIdea ? (
              <div className="space-y-6">
                {/* Idea Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{currentIdea.ideaTitle}</CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge>{currentIdea.industry}</Badge>
                          <Badge variant="outline">{currentIdea.stage}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700">{currentIdea.description}</p>
                  </CardContent>
                </Card>

                <Tabs defaultValue="analysis" className="w-full">
                  <TabsList>
                    <TabsTrigger value="analysis">
                      <Brain className="w-4 h-4 mr-2" />
                      AI Analysis
                    </TabsTrigger>
                    <TabsTrigger value="business-plan" disabled={!currentIdea.analysis}>
                      <FileText className="w-4 h-4 mr-2" />
                      Business Plan
                    </TabsTrigger>
                    <TabsTrigger value="pitch-deck" disabled={!currentIdea.businessPlan}>
                      <Presentation className="w-4 h-4 mr-2" />
                      Pitch Deck
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="analysis" className="mt-6">
                    {currentIdea.analysis ? (
                      <AnalysisResults analysis={currentIdea.analysis as any} />
                    ) : (
                      <Card>
                        <CardContent className="py-8 text-center">
                          <Brain className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                          <p className="text-slate-600 mb-4">AI analysis is being processed...</p>
                          <p className="text-sm text-slate-500">This usually takes a few moments.</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="business-plan" className="mt-6">
                    {currentIdea.businessPlan ? (
                      <BusinessPlanViewer businessPlan={currentIdea.businessPlan as any} />
                    ) : (
                      <Card>
                        <CardContent className="py-8 text-center">
                          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Generate Your Business Plan
                          </h3>
                          <p className="text-slate-600 mb-6">
                            Create a comprehensive business plan based on your AI analysis
                          </p>
                          <Button 
                            onClick={handleGenerateBusinessPlan}
                            disabled={generateBusinessPlanMutation.isPending}
                          >
                            {generateBusinessPlanMutation.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <FileText className="w-4 h-4 mr-2" />
                                Generate Business Plan
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="pitch-deck" className="mt-6">
                    {currentIdea.pitchDeck ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Presentation className="w-5 h-5 mr-2" />
                            Investor Pitch Deck
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {(currentIdea.pitchDeck as any).slides?.map((slide: any, index: number) => (
                              <Card key={index}>
                                <CardHeader>
                                  <CardTitle className="text-lg">
                                    Slide {index + 1}: {slide.title}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2">
                                    {slide.content.split('\n').map((line: string, lineIndex: number) => (
                                      <p key={lineIndex} className="text-slate-700">{line}</p>
                                    ))}
                                  </div>
                                  {slide.notes && (
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                      <h5 className="font-medium text-blue-900 mb-1">Speaker Notes:</h5>
                                      <p className="text-sm text-blue-800">{slide.notes}</p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="py-8 text-center">
                          <Presentation className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Generate Your Pitch Deck
                          </h3>
                          <p className="text-slate-600 mb-6">
                            Create an investor-ready pitch deck from your business plan
                          </p>
                          <Button 
                            onClick={handleGeneratePitchDeck}
                            disabled={generatePitchDeckMutation.isPending}
                          >
                            {generatePitchDeckMutation.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Presentation className="w-4 h-4 mr-2" />
                                Generate Pitch Deck
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-slate-600">Idea not found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
