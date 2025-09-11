import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  CheckCircle,
  Brain,
  Clock,
  FileText,
  Download,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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
  const [researchComplete, setResearchComplete] = useState(false);

  // Real AI-powered market research mutation
  const marketResearchMutation = useMutation({
    mutationFn: async (data: { ideaTitle: string; description: string; industry?: string; stage?: string }) => {
      const response = await apiRequest("/api/market-research", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: (data) => {
      setMarketData(data);
      setResearchComplete(true);
      toast({
        title: "Market Research Complete!",
        description: "AI-powered analysis with web research completed successfully.",
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

  const [marketData, setMarketData] = useState<any>(null);

  // Real AI-powered market research function
  const handleGenerateResearch = () => {
    if (!ideaData?.ideaTitle || !ideaData?.description) {
      toast({
        title: "Missing Information",
        description: "Please provide idea title and description for market research.",
        variant: "destructive",
      });
      return;
    }

    marketResearchMutation.mutate({
      ideaTitle: ideaData.ideaTitle,
      description: ideaData.description,
      industry: ideaData.industry || "Technology",
      stage: ideaData.stage || "Idea Stage"
    });
  };

  if (marketResearchMutation.isPending) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
            AI-Powered Market Research
          </CardTitle>
          <div className="flex items-center justify-center mb-6">
            <Brain className="w-12 h-12 text-blue-600 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Analyzing: {ideaData?.ideaTitle}
            </h3>
            <p className="text-gray-600 mb-6">
              Our AI is conducting comprehensive market research using web data and industry analysis
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Research Progress</span>
              <span>Analyzing...</span>
            </div>
            <Progress value={65} className="h-3" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto bg-blue-100">
                <Search className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xs text-gray-600">Web Research</div>
            </div>
            
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto bg-green-100">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-xs text-gray-600">Competitor Analysis</div>
            </div>
            
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto bg-purple-100">
                <BarChart3 className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-xs text-gray-600">Market Sizing</div>
            </div>
            
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto bg-orange-100">
                <TrendingUp className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-xs text-gray-600">Trend Analysis</div>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            {marketData?.webResearchEnabled ? "✅ Web research enabled" : "⚡ Using AI analysis"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Market Research for {ideaData?.ideaTitle}
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              Comprehensive market analysis and competitive intelligence
            </p>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-100 text-blue-800">
                <Target className="w-3 h-3 mr-1" />
                AI-Powered Analysis
              </Badge>
              <Badge variant="outline">Real-time Data</Badge>
            </div>
          </div>
          <div className="text-center">
            <Search className="w-16 h-16 text-blue-600 mx-auto mb-2" />
            <p className="text-slate-600 font-medium">Market Intelligence</p>
          </div>
        </div>
      </div>

      {!researchComplete ? (
        <Card>
          <CardContent className="text-center py-16">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Analyze Your Market
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Generate comprehensive market research including TAM/SAM/SOM analysis,
              competitive landscape, and customer insights.
            </p>
            
            <Button 
              onClick={handleGenerateResearch}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Brain className="w-4 h-4 mr-2" />
              Generate Market Research
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {/* Market Size */}
          <Card>
            <CardHeader>
              <CardTitle>Market Size Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {marketData.totalMarketSize}
                  </div>
                  <div className="text-sm text-gray-600">Total Addressable Market</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {marketData.servableMarketSize}
                  </div>
                  <div className="text-sm text-gray-600">Serviceable Addressable Market</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {marketData.targetMarketSize}
                  </div>
                  <div className="text-sm text-gray-600">Serviceable Obtainable Market</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competitors */}
          <Card>
            <CardHeader>
              <CardTitle>Competitive Landscape</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketData?.competitors?.map((competitor: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{competitor.name}</h3>
                        <p className="text-gray-600">{competitor.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{competitor.marketShare}%</div>
                        <div className="text-sm text-gray-600">Market Share</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Segments */}
          <Card>
            <CardHeader>
              <CardTitle>Market Segments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketData?.marketSegments?.map((segment: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{segment.name}</h3>
                      <Badge variant="secondary">{segment.opportunity} opportunity</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Market Size: {segment.size}</span>
                      <span className="text-green-600 font-semibold">Growth: {segment.growth}%</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">{segment.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}