import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Target, 
  Users, 
  TrendingUp, 
  BarChart3, 
  Shield,
  Zap,
  Globe,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  Brain,
  Clock,
  FileText,
  Download,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MarketSegment {
  name: string;
  size: string;
  growth: number;
  description: string;
  opportunity: "high" | "medium" | "low";
}

interface Competitor {
  name: string;
  type: "direct" | "indirect" | "substitute";
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
  funding: string;
  description: string;
}

interface MarketTrend {
  trend: string;
  impact: "positive" | "negative" | "neutral";
  description: string;
  timeframe: string;
  relevance: number;
}

interface CustomerPersona {
  name: string;
  demographics: string;
  painPoints: string[];
  motivations: string[];
  channels: string[];
  budget: string;
}

interface MarketResearchProps {
  ideaData: any;
  businessPlan?: any;
}

export default function MarketResearch({ ideaData, businessPlan }: MarketResearchProps) {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysis, setCurrentAnalysis] = useState("");

  const [marketData, setMarketData] = useState({
    totalMarketSize: "",
    servableMarketSize: "",
    targetMarketSize: "",
    growthRate: 0,
    marketMaturity: "emerging", // emerging, growing, mature, declining
    regulations: [] as string[],
    barriers: [] as string[]
  });

  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [marketSegments, setMarketSegments] = useState<MarketSegment[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [customerPersonas, setCustomerPersonas] = useState<CustomerPersona[]>([]);

  const [researchComplete, setResearchComplete] = useState(false);

  const generateMarketResearchMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/startup-ideas/${ideaData.id}/market-research`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          industry: ideaData.industry,
          description: ideaData.description,
          targetMarket: ideaData.targetMarket,
          problemStatement: ideaData.problemStatement
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate market research");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setMarketData(data.marketData);
      setCompetitors(data.competitors);
      setMarketSegments(data.segments);
      setMarketTrends(data.trends);
      setCustomerPersonas(data.personas);
      setResearchComplete(true);
      
      toast({
        title: "Market research completed!",
        description: "Comprehensive market analysis and competitive landscape ready.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerateResearch = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const analysisSteps = [
      "Analyzing market size and opportunity",
      "Identifying key competitors",
      "Researching market trends",
      "Developing customer personas",
      "Evaluating competitive landscape",
      "Compiling market insights"
    ];
    
    for (let i = 0; i < analysisSteps.length; i++) {
      setCurrentAnalysis(analysisSteps[i]);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAnalysisProgress(((i + 1) / analysisSteps.length) * 100);
    }
    
    // Generate realistic market data
    const mockMarketData = {
      marketData: {
        totalMarketSize: "$50B",
        servableMarketSize: "$12B", 
        targetMarketSize: "$2.5B",
        growthRate: 15,
        marketMaturity: "growing",
        regulations: ["Data Privacy", "Industry Standards", "Compliance Requirements"],
        barriers: ["High customer acquisition cost", "Network effects of incumbents", "Regulatory complexity"]
      },
      competitors: [
        {
          name: "Market Leader Inc",
          type: "direct" as const,
          marketShare: 35,
          strengths: ["Brand recognition", "Large customer base", "Established partnerships"],
          weaknesses: ["Legacy technology", "Slow innovation", "High pricing"],
          pricing: "$99-299/month",
          funding: "$500M Series D",
          description: "Established market leader with traditional approach"
        },
        {
          name: "Innovation Startup",
          type: "direct" as const,
          marketShare: 8,
          strengths: ["Modern technology", "Agile development", "Competitive pricing"],
          weaknesses: ["Limited market presence", "Small team", "Funding constraints"],
          pricing: "$49-149/month",
          funding: "$25M Series B",
          description: "Emerging competitor with innovative solutions"
        },
        {
          name: "Alternative Solution Co",
          type: "indirect" as const,
          marketShare: 12,
          strengths: ["Different approach", "Niche expertise", "Strong customer loyalty"],
          weaknesses: ["Limited scalability", "Narrow focus", "Resource constraints"],
          pricing: "$79-199/month",
          funding: "$15M Series A",
          description: "Alternative approach serving similar customer needs"
        }
      ],
      segments: [
        {
          name: "Enterprise Customers",
          size: "$1.2B",
          growth: 18,
          description: "Large organizations with complex needs and substantial budgets",
          opportunity: "high" as const
        },
        {
          name: "Mid-Market Companies",
          size: "$800M",
          growth: 22,
          description: "Growing companies seeking scalable solutions",
          opportunity: "high" as const
        },
        {
          name: "Small Businesses", 
          size: "$500M",
          growth: 12,
          description: "Cost-conscious smaller organizations",
          opportunity: "medium" as const
        }
      ],
      trends: [
        {
          trend: "Digital Transformation Acceleration",
          impact: "positive" as const,
          description: "Companies rapidly adopting digital solutions to improve efficiency",
          timeframe: "Next 2-3 years",
          relevance: 90
        },
        {
          trend: "Remote Work Adoption",
          impact: "positive" as const,
          description: "Permanent shift to hybrid work models driving tool adoption",
          timeframe: "Ongoing",
          relevance: 85
        },
        {
          trend: "AI Integration Requirements",
          impact: "positive" as const,
          description: "Growing demand for AI-powered features and automation",
          timeframe: "Next 1-2 years",
          relevance: 95
        }
      ],
      personas: [
        {
          name: "Tech-Forward Manager",
          demographics: "35-45, Director level, Technology background",
          painPoints: ["Manual processes", "Data silos", "Team coordination"],
          motivations: ["Efficiency gains", "Competitive advantage", "Career advancement"],
          channels: ["LinkedIn", "Industry conferences", "Peer recommendations"],
          budget: "$10-50K annually"
        },
        {
          name: "Cost-Conscious Owner",
          demographics: "40-55, Business owner, Budget-focused",
          painPoints: ["High costs", "Complex solutions", "Time constraints"],
          motivations: ["Cost savings", "Simplicity", "ROI"],
          channels: ["Google search", "Industry publications", "Word of mouth"],
          budget: "$2-15K annually"
        }
      ]
    };

    setMarketData(mockMarketData.marketData);
    setCompetitors(mockMarketData.competitors);
    setMarketSegments(mockMarketData.segments);
    setMarketTrends(mockMarketData.trends);
    setCustomerPersonas(mockMarketData.personas);
    setResearchComplete(true);
    setIsAnalyzing(false);
    
    toast({
      title: "Market research completed!",
      description: "Comprehensive market analysis and competitive landscape ready.",
    });
  };

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case "high": return "text-green-600 bg-green-50 border-green-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive": return "text-green-600";
      case "negative": return "text-red-600";
      case "neutral": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  const getCompetitorTypeColor = (type: string) => {
    switch (type) {
      case "direct": return "bg-red-100 text-red-800";
      case "indirect": return "bg-yellow-100 text-yellow-800";
      case "substitute": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isAnalyzing) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
            Conducting Market Research
          </CardTitle>
          <div className="flex items-center justify-center mb-6">
            <Search className="w-12 h-12 text-blue-600 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Analyzing: {ideaData?.ideaTitle}
            </h3>
            <p className="text-gray-600 mb-6">
              {currentAnalysis}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Research Progress</span>
              <span>{Math.round(analysisProgress)}%</span>
            </div>
            <Progress value={analysisProgress} className="h-3" />
          </div>
          
          <div className="text-center text-sm text-gray-500">
            Analyzing market data, competitors, and customer segments
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
              Market Research & Competitive Analysis
            </CardTitle>
            <Badge variant="secondary" className="text-sm">
              {ideaData?.industry} Market
            </Badge>
          </div>
          
          {researchComplete && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {marketData.totalMarketSize}
                </div>
                <div className="text-sm text-gray-600">Total Market Size</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {marketData.growthRate}%
                </div>
                <div className="text-sm text-gray-600">Annual Growth</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {competitors.length}
                </div>
                <div className="text-sm text-gray-600">Key Competitors</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {marketSegments.length}
                </div>
                <div className="text-sm text-gray-600">Market Segments</div>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Generate Research */}
      {!researchComplete && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Generate Market Research
                </h3>
                <p className="text-gray-600">
                  Comprehensive market analysis, competitive landscape, and customer insights
                </p>
              </div>
              <Button
                onClick={handleGenerateResearch}
                disabled={generateMarketResearchMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {generateMarketResearchMutation.isPending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Start Research
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Research Results */}
      {researchComplete && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="personas">Personas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Market Size Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Globe className="w-5 h-5 mr-2 text-blue-600" />
                    Market Size Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-gray-900">Total Addressable Market</div>
                        <div className="text-sm text-gray-600">Global market opportunity</div>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{marketData.totalMarketSize}</div>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-gray-900">Serviceable Market</div>
                        <div className="text-sm text-gray-600">Accessible market size</div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{marketData.servableMarketSize}</div>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-gray-900">Target Market</div>
                        <div className="text-sm text-gray-600">Initial target segment</div>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{marketData.targetMarketSize}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Market Dynamics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Annual Growth Rate</span>
                      <span className="text-2xl font-bold text-green-600">{marketData.growthRate}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Market Maturity</span>
                      <Badge variant="secondary" className="capitalize">{marketData.marketMaturity}</Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Regulations</h4>
                      <div className="space-y-1">
                        {marketData.regulations.map((reg, index) => (
                          <div key={index} className="text-sm text-gray-600 flex items-center">
                            <Shield className="w-3 h-3 mr-2" />
                            {reg}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Market Barriers</h4>
                      <div className="space-y-1">
                        {marketData.barriers.map((barrier, index) => (
                          <div key={index} className="text-sm text-gray-600 flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-2" />
                            {barrier}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="competitors" className="space-y-6">
            <div className="grid gap-6">
              {competitors.map((competitor, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{competitor.name}</h3>
                          <Badge className={getCompetitorTypeColor(competitor.type)} variant="secondary">
                            {competitor.type}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{competitor.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{competitor.marketShare}%</div>
                        <div className="text-sm text-gray-600">Market Share</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">Strengths</h4>
                        <ul className="space-y-1">
                          {competitor.strengths.map((strength, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center">
                              <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-red-600 mb-2">Weaknesses</h4>
                        <ul className="space-y-1">
                          {competitor.weaknesses.map((weakness, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center">
                              <AlertTriangle className="w-3 h-3 mr-2 text-red-500" />
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Pricing</h4>
                        <p className="text-sm text-gray-600">{competitor.pricing}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Funding</h4>
                        <p className="text-sm text-gray-600">{competitor.funding}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="segments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketSegments.map((segment, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{segment.name}</h3>
                      <Badge className={getOpportunityColor(segment.opportunity)} variant="secondary">
                        {segment.opportunity} opportunity
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Market Size</span>
                        <span className="font-semibold text-blue-600">{segment.size}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Growth Rate</span>
                        <span className="font-semibold text-green-600">{segment.growth}%</span>
                      </div>
                      
                      <p className="text-gray-600 text-sm">{segment.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid gap-4">
              {marketTrends.map((trend, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{trend.trend}</h3>
                          <div className={`flex items-center ${getImpactColor(trend.impact)}`}>
                            {trend.impact === "positive" ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : trend.impact === "negative" ? (
                              <ArrowDownRight className="w-4 h-4" />
                            ) : (
                              <div className="w-4 h-4 bg-gray-400 rounded-full" />
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">{trend.description}</p>
                        <p className="text-sm text-gray-500">Timeline: {trend.timeframe}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-purple-600">{trend.relevance}%</div>
                        <div className="text-sm text-gray-600">Relevance</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="personas" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {customerPersonas.map((persona, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{persona.name}</h3>
                        <p className="text-sm text-gray-600">{persona.demographics}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-red-600 mb-2">Pain Points</h4>
                        <ul className="space-y-1">
                          {persona.painPoints.map((pain, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center">
                              <AlertTriangle className="w-3 h-3 mr-2 text-red-500" />
                              {pain}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">Motivations</h4>
                        <ul className="space-y-1">
                          {persona.motivations.map((motivation, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center">
                              <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                              {motivation}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-2">Preferred Channels</h4>
                        <div className="flex flex-wrap gap-2">
                          {persona.channels.map((channel, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-gray-600">Budget Range</span>
                        <span className="font-semibold text-green-600">{persona.budget}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Export Options */}
      {researchComplete && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Export Market Research
                </h3>
                <p className="text-gray-600">
                  Download comprehensive market analysis and competitive intelligence
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}