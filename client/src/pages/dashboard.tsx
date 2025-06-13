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
  Plus,
  Play
} from "lucide-react";
import AnalysisResults from "@/components/analysis-results";
import BusinessPlanViewer from "@/components/business-plan-viewer";
import DemoTour from "@/components/demo-tour";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState("");
  const [currentIdeaId, setCurrentIdeaId] = useState<number | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showDemoTour, setShowDemoTour] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const ideaId = localStorage.getItem("currentIdeaId");
    const demoMode = localStorage.getItem("demoMode");
    
    if (email) setUserEmail(email);
    if (ideaId && ideaId !== "demo") setCurrentIdeaId(parseInt(ideaId));
    if (demoMode === "true") {
      setIsDemoMode(true);
      setCurrentIdeaId(1); // Use demo idea
      // Show demo tour for first-time demo users
      const hasSeenTour = localStorage.getItem("hasSeenDemoTour");
      if (!hasSeenTour) {
        setTimeout(() => setShowDemoTour(true), 1000);
        localStorage.setItem("hasSeenDemoTour", "true");
      }
    }
  }, []);

  // Demo data for interactive experience
  const demoIdeas = [
    {
      id: 1,
      name: "Alex Chen",
      email: "demo@mystartup.ai",
      ideaTitle: "EcoFlow - Smart Water Management",
      description: "AI-powered IoT platform that helps cities and businesses optimize water usage, detect leaks in real-time, and reduce waste by 40% through predictive analytics and automated controls.",
      industry: "CleanTech",
      stage: "MVP Development",
      analysis: {
        score: 87,
        strengths: [
          "Massive addressable market with increasing water scarcity concerns",
          "Strong environmental impact aligns with ESG trends",
          "Proven IoT technology with clear ROI for customers",
          "Government incentives and regulations driving adoption"
        ],
        weaknesses: [
          "High initial infrastructure costs for full deployment",
          "Long sales cycles with municipal governments",
          "Competition from established utility management companies",
          "Technical complexity requiring specialized expertise"
        ],
        marketOpportunity: "The global smart water management market is valued at $14.5B and growing at 15.8% CAGR. Water scarcity affects 2 billion people worldwide, creating urgent demand for efficiency solutions. Municipal and industrial customers are actively seeking technology to meet sustainability goals.",
        competitiveAdvantage: "Proprietary AI algorithms for leak prediction, comprehensive IoT sensor network, and proven 40% water savings. Strong partnerships with sensor manufacturers and early customer testimonials provide significant moats.",
        recommendations: [
          "Secure pilot partnerships with 3-5 forward-thinking municipalities",
          "Develop comprehensive ROI calculator for sales process",
          "Build strategic partnerships with water utility companies",
          "Create modular deployment options to reduce upfront costs",
          "Establish thought leadership through sustainability conferences"
        ],
        feasibilityScore: 84,
        marketSizeEstimate: "Total addressable market of $14.5B growing to $31.8B by 2028. Serviceable addressable market of $3.2B focusing on smart cities and industrial facilities."
      },
      businessPlan: {
        executiveSummary: "EcoFlow is revolutionizing water management through AI-powered IoT solutions that deliver measurable environmental and economic impact. Our platform combines advanced sensors, machine learning algorithms, and automated controls to help cities and businesses reduce water waste by 40% while generating significant cost savings.\n\nWith water scarcity affecting 2 billion people globally and increasing regulatory pressure for sustainability, EcoFlow addresses a critical market need. Our proven technology has demonstrated consistent results across pilot deployments, positioning us to capture significant market share in the rapidly growing $14.5B smart water management sector.",
        problemStatement: "Global water waste costs organizations $14B annually while 2 billion people face water scarcity. Traditional water management systems lack real-time monitoring, predictive capabilities, and automated response mechanisms. Cities lose 20-30% of treated water through undetected leaks, while industrial facilities struggle to optimize usage without comprehensive data insights.",
        solutionDescription: "EcoFlow provides an integrated AI-powered platform featuring: IoT sensor networks for real-time monitoring, machine learning algorithms for leak prediction and usage optimization, automated control systems for immediate response, comprehensive analytics dashboard for strategic planning, and mobile alerts for facility managers. Our solution integrates seamlessly with existing infrastructure while providing immediate ROI through reduced waste and operational efficiency.",
        marketAnalysis: "The smart water management market is experiencing explosive growth driven by water scarcity, sustainability mandates, and IoT technology adoption. Key market segments include municipal water utilities ($8.2B), industrial facilities ($4.1B), and commercial buildings ($2.2B). Early adopters are achieving 25-45% water savings with 18-month payback periods, driving rapid market expansion.",
        businessModel: "SaaS subscription model with tiered pricing: Municipal Enterprise ($50K-200K annually), Industrial Solutions ($25K-100K annually), Commercial Buildings ($5K-25K annually). Additional revenue from hardware sales, installation services, and data analytics consulting. Target 85% gross margins with strong recurring revenue and expansion opportunities within customer accounts.",
        marketingStrategy: "Direct enterprise sales for large accounts, channel partnerships with system integrators, thought leadership through sustainability conferences, case study development with pilot customers, digital marketing targeting facility managers and sustainability officers, and strategic partnerships with IoT hardware vendors and consulting firms.",
        operationalPlan: "Cloud-first architecture leveraging AWS IoT Core and machine learning services. Operations team manages sensor deployment, data analytics, and customer success. Manufacturing partnerships for sensor hardware with local installation networks. 24/7 monitoring and support capabilities with automated alert systems.",
        managementTeam: "CEO Alex Chen: 12 years water industry experience, former VP at Veolia. CTO Sarah Kim: AI/ML expert, former Google Cloud IoT team. VP Sales Mike Rodriguez: Enterprise sales leader with $100M+ revenue track record. VP Operations Lisa Wang: Operations scaling expert from multiple successful startups. Advisory board includes water industry veterans and sustainability experts.",
        financialProjections: "Year 1: $500K ARR with 5 enterprise customers. Year 2: $2.8M ARR with 25 customers. Year 3: $8.5M ARR with 65 customers (break-even). Year 4: $21M ARR with 150 customers. Year 5: $48M ARR with 300+ customers. Key metrics: 15% monthly net revenue retention, $50K average customer value, 5% annual churn rate.",
        fundingRequirements: "Seeking $4M Series A funding: Product development and AI enhancement (40%), Sales and marketing expansion (35%), Operations and customer success (15%), Working capital and strategic reserves (10%). Funding enables rapid scaling to 100+ customers and Series B readiness by month 18.",
        riskAnalysis: "Technical risks: Sensor reliability in harsh environments, data accuracy across diverse installations. Market risks: Economic downturn affecting capex budgets, competitive pressure from established players. Mitigation: Rigorous testing protocols, strategic insurance partnerships, diversified customer base, strong IP protection, and conservative cash management.",
        timeline: "Months 1-6: Complete Series A funding, expand engineering team to 15, launch v2.0 platform with enhanced AI. Months 7-12: Scale to 25 enterprise customers, establish channel partnerships, achieve $2M ARR. Months 13-18: International expansion, reach 65 customers, prepare Series B fundraising. Months 19-24: Scale to 150+ customers, achieve profitability, explore strategic acquisitions."
      },
      pitchDeck: {
        slides: [
          {
            title: "EcoFlow - Smart Water Management",
            content: "Revolutionizing water efficiency through AI-powered IoT solutions\n\nReducing water waste by 40% while generating measurable ROI\n\nSeries A Funding Presentation - 2024",
            notes: "Lead with the environmental impact and ROI - this immediately captures both sustainability and business value propositions."
          },
          {
            title: "The Water Crisis",
            content: "• 2 billion people face water scarcity globally\n• Cities lose 20-30% of treated water through undetected leaks\n• Industrial facilities waste $14B annually on inefficient usage\n• Traditional systems lack real-time monitoring and predictive capabilities\n• Increasing regulations demand 25% efficiency improvements by 2030",
            notes: "Use compelling statistics to establish urgency. Mention regulatory drivers as they create non-negotiable demand."
          },
          {
            title: "EcoFlow Solution",
            content: "AI-Powered Smart Water Management Platform:\n\n• Real-time IoT monitoring across entire water infrastructure\n• Predictive leak detection with 95% accuracy\n• Automated controls for immediate response\n• 40% average water savings across deployments\n• Comprehensive analytics for strategic optimization",
            notes: "Focus on proven results. The 40% savings number is powerful - ensure you have case studies to support this claim."
          },
          {
            title: "Market Opportunity",
            content: "• $14.5B global smart water management market\n• 15.8% annual growth rate reaching $31.8B by 2028\n• $3.2B serviceable addressable market\n• Strong regulatory tailwinds driving adoption\n• Early stage market with limited AI-first competitors",
            notes: "Present market size with credible sources. Emphasize the regulatory drivers as they create predictable demand."
          },
          {
            title: "Product Demonstration",
            content: "Live Dashboard Features:\n\n• Real-time consumption monitoring\n• Predictive leak alerts with location mapping\n• Automated shut-off and flow control\n• ROI tracking and sustainability reporting\n• Mobile management for facility teams",
            notes: "If possible, show live dashboard screenshots demonstrating the platform's capabilities and user interface."
          },
          {
            title: "Business Model",
            content: "SaaS Subscription with Hardware Integration:\n\n• Municipal Enterprise: $50K-200K annually\n• Industrial Solutions: $25K-100K annually\n• Commercial Buildings: $5K-25K annually\n• 85% gross margins with recurring revenue\n• Average customer LTV: $180K, CAC: $15K",
            notes: "Strong unit economics story. Emphasize the high margins and LTV/CAC ratio of 12:1."
          },
          {
            title: "Traction & Validation",
            content: "Proven Results Across Deployments:\n\n• 12 enterprise customers including 3 major cities\n• $800K ARR with 25% month-over-month growth\n• 42% average water savings across all installations\n• 98% customer retention rate\n• $2.1M in contracted pipeline",
            notes: "Strong traction metrics showing both customer adoption and product-market fit. Customer retention rate is particularly compelling."
          },
          {
            title: "Competitive Landscape",
            content: "Market Leadership Through Innovation:\n\n• Legacy players: Hardware-focused, limited AI capabilities\n• New entrants: Point solutions without integration\n• EcoFlow advantage: End-to-end AI platform with proven ROI\n• 3 patents pending on predictive algorithms\n• Strategic partnerships with leading IoT manufacturers",
            notes: "Position against legacy solutions while highlighting AI differentiation and IP protection."
          },
          {
            title: "Go-to-Market Strategy",
            content: "Multi-Channel Enterprise Sales Approach:\n\n• Direct enterprise sales for municipal and large industrial\n• Channel partnerships with system integrators\n• Thought leadership at water and sustainability conferences\n• Strategic alliances with IoT hardware partners\n• Digital marketing targeting facility managers",
            notes: "Show clear path to customer acquisition across different market segments."
          },
          {
            title: "World-Class Team",
            content: "Experienced Leadership in Water & Technology:\n\n• Alex Chen, CEO: 12 years at Veolia, water industry veteran\n• Sarah Kim, CTO: Former Google Cloud IoT, AI/ML expert\n• Mike Rodriguez, VP Sales: $100M+ enterprise sales track record\n• 18 total employees including 8 engineers\n• Advisory board with water industry and sustainability experts",
            notes: "Emphasize domain expertise and track record of scaling technology companies."
          },
          {
            title: "Financial Projections",
            content: "Strong Growth Trajectory to Profitability:\n\n• 2024: $2.8M ARR (25 customers)\n• 2025: $8.5M ARR (65 customers) - Break Even\n• 2026: $21M ARR (150 customers)\n• 2027: $48M ARR (300+ customers)\n\nKey metrics: 15% NRR, 5% churn, $50K ACV",
            notes: "Conservative but ambitious projections showing clear path to profitability by year 3."
          },
          {
            title: "Series A Funding Request",
            content: "Seeking $4M to Scale Market Leadership:\n\n• Product & AI Development (40%): $1.6M\n• Sales & Marketing (35%): $1.4M\n• Operations & Customer Success (15%): $600K\n• Working Capital (10%): $400K\n\n18-month runway to Series B at $50M+ valuation",
            notes: "Clear use of funds tied to growth milestones. Demonstrate capital efficiency and path to next funding round."
          }
        ]
      },
      createdAt: new Date().toISOString()
    }
  ];

  // Fetch user's ideas (use demo data in demo mode)
  const { data: ideas = [], isLoading: ideasLoading } = useQuery({
    queryKey: ["/api/ideas", userEmail],
    enabled: !!userEmail && !isDemoMode,
    queryFn: () => api.getIdeasByEmail(userEmail),
  });

  // Use demo data or fetch current idea details
  const actualIdeas = isDemoMode ? demoIdeas : ideas;
  const currentIdea = isDemoMode ? demoIdeas[0] : null;
  
  const { data: fetchedIdea, isLoading: ideaLoading } = useQuery({
    queryKey: ["/api/ideas", currentIdeaId],
    enabled: !!currentIdeaId && !isDemoMode,
    queryFn: () => api.getIdea(currentIdeaId!),
  });

  const displayIdea = isDemoMode ? currentIdea : fetchedIdea;

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
      {/* Demo Banner */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Play className="w-3 h-3" />
                </div>
                <div>
                  <p className="font-medium">Live Demo Mode</p>
                  <p className="text-sm text-blue-100">Experience the full MyStartup.ai workflow with sample data</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    Submit Your Own Idea
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/10"
                  onClick={() => {
                    localStorage.removeItem("demoMode");
                    localStorage.removeItem("currentIdeaId");
                    window.location.reload();
                  }}
                >
                  Exit Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <h1 className="text-xl font-bold text-slate-900">
                  Dashboard
                  {isDemoMode && <span className="text-blue-600 text-sm ml-2">(Demo)</span>}
                </h1>
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
                    {actualIdeas.map((idea) => (
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
            ) : displayIdea ? (
              <div className="space-y-6">
                {/* Idea Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-3">
                          {displayIdea.ideaTitle}
                          {isDemoMode && (
                            <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                              Live Demo
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge>{displayIdea.industry}</Badge>
                          <Badge variant="outline">{displayIdea.stage}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700">{displayIdea.description}</p>
                  </CardContent>
                </Card>

                <Tabs defaultValue="analysis" className="w-full">
                  <TabsList>
                    <TabsTrigger value="analysis">
                      <Brain className="w-4 h-4 mr-2" />
                      AI Analysis
                    </TabsTrigger>
                    <TabsTrigger value="business-plan" disabled={!displayIdea.analysis}>
                      <FileText className="w-4 h-4 mr-2" />
                      Business Plan
                    </TabsTrigger>
                    <TabsTrigger value="pitch-deck" disabled={!displayIdea.businessPlan}>
                      <Presentation className="w-4 h-4 mr-2" />
                      Pitch Deck
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="analysis" className="mt-6">
                    {displayIdea.analysis ? (
                      <AnalysisResults analysis={displayIdea.analysis as any} />
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
                    {displayIdea.businessPlan ? (
                      <BusinessPlanViewer businessPlan={displayIdea.businessPlan as any} />
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
                            disabled={generateBusinessPlanMutation.isPending || isDemoMode}
                          >
                            {generateBusinessPlanMutation.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <FileText className="w-4 h-4 mr-2" />
                                {isDemoMode ? "Available in Demo" : "Generate Business Plan"}
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="pitch-deck" className="mt-6">
                    {displayIdea.pitchDeck ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Presentation className="w-5 h-5 mr-2" />
                            Investor Pitch Deck
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {(displayIdea.pitchDeck as any).slides?.map((slide: any, index: number) => (
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
                            disabled={generatePitchDeckMutation.isPending || isDemoMode}
                          >
                            {generatePitchDeckMutation.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Presentation className="w-4 h-4 mr-2" />
                                {isDemoMode ? "Available in Demo" : "Generate Pitch Deck"}
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

      {/* Demo Tour */}
      {showDemoTour && (
        <DemoTour onComplete={() => setShowDemoTour(false)} />
      )}
    </div>
  );
}
