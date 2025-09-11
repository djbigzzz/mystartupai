import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  DollarSign,
  Lightbulb,
  BarChart3,
  FileText,
  Presentation,
  RefreshCw,
  Clock,
  Star,
  Award,
  MapPin
} from "lucide-react";
import StartupHeatmap from "./startup-heatmap";

interface AnalysisResult {
  validationScore: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  marketPotential: {
    size: string;
    growth: string;
    competition: string;
  };
  feasibility: {
    technical: number;
    financial: number;
    market: number;
  };
  recommendations: string[];
  nextSteps: string[];
  riskLevel: "low" | "medium" | "high";
  confidenceScore: number;
}

interface IdeaAnalysisDashboardProps {
  ideaId: number;
  ideaData: any;
}

export default function IdeaAnalysisDashboard({ ideaId, ideaData }: IdeaAnalysisDashboardProps) {
  const [analysisStage, setAnalysisStage] = useState<"analyzing" | "complete" | "error">("analyzing");
  const [progress, setProgress] = useState(0);

  // Simulate analysis progress
  useEffect(() => {
    if (analysisStage === "analyzing") {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setAnalysisStage("complete");
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [analysisStage]);

  // Mock analysis result based on idea data
  const generateAnalysisResult = (): AnalysisResult => {
    const industryScores = {
      "Technology": 85,
      "Healthcare": 78,
      "Finance": 82,
      "Education": 75,
      "E-commerce": 88,
      "SaaS": 90,
      "AI/ML": 92,
      "Sustainability": 76
    };

    const baseScore = industryScores[ideaData?.industry as keyof typeof industryScores] || 70;
    const hasDetails = ideaData?.problemStatement && ideaData?.solutionApproach;
    const detailBonus = hasDetails ? 10 : 0;
    const finalScore = Math.min(100, baseScore + detailBonus + Math.floor(Math.random() * 10));

    return {
      validationScore: finalScore,
      strengths: [
        "Clear problem identification",
        "Innovative solution approach",
        "Growing market opportunity",
        "Strong value proposition"
      ],
      weaknesses: [
        "Market validation needed",
        "Competition analysis required",
        "Revenue model refinement",
        "Technical feasibility assessment"
      ],
      opportunities: [
        "Digital transformation trend",
        "Remote work adoption",
        "Automation demand",
        "Sustainability focus"
      ],
      threats: [
        "Established competitors",
        "Regulatory changes",
        "Market saturation risk",
        "Technology disruption"
      ],
      marketPotential: {
        size: "$2.5B - $10B",
        growth: "15-25% annually",
        competition: "Moderate to High"
      },
      feasibility: {
        technical: Math.floor(Math.random() * 30) + 70,
        financial: Math.floor(Math.random() * 25) + 65,
        market: Math.floor(Math.random() * 35) + 60
      },
      recommendations: [
        "Conduct detailed market research",
        "Develop MVP prototype",
        "Validate with target customers",
        "Refine business model",
        "Build strategic partnerships"
      ],
      nextSteps: [
        "Create detailed business plan",
        "Develop financial projections",
        "Build investor pitch deck",
        "Plan MVP development",
        "Identify key metrics"
      ],
      riskLevel: finalScore > 80 ? "low" : finalScore > 60 ? "medium" : "high",
      confidenceScore: Math.floor(Math.random() * 20) + 75
    };
  };

  const analysisResult = analysisStage === "complete" ? generateAnalysisResult() : null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (analysisStage === "analyzing") {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
            AI Analysis in Progress
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
              Our AI is processing your startup idea using advanced analysis frameworks
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Analysis Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                progress > 25 ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Target className={`w-4 h-4 ${progress > 25 ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div className="text-xs text-gray-600">Market Analysis</div>
            </div>
            
            <div className="space-y-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                progress > 50 ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <TrendingUp className={`w-4 h-4 ${progress > 50 ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div className="text-xs text-gray-600">Feasibility Check</div>
            </div>
            
            <div className="space-y-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                progress > 75 ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <BarChart3 className={`w-4 h-4 ${progress > 75 ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div className="text-xs text-gray-600">Risk Assessment</div>
            </div>
            
            <div className="space-y-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                progress > 95 ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Award className={`w-4 h-4 ${progress > 95 ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div className="text-xs text-gray-600">Final Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisResult) return null;

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Analysis Complete
            </CardTitle>
            <Badge className={getRiskColor(analysisResult.riskLevel)} variant="secondary">
              {analysisResult.riskLevel.toUpperCase()} RISK
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(analysisResult.validationScore).split(' ')[0]}`}>
                {analysisResult.validationScore}/100
              </div>
              <div className="text-sm text-gray-600">Validation Score</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {analysisResult.confidenceScore}%
              </div>
              <div className="text-sm text-gray-600">Confidence Level</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {analysisResult.marketPotential.size}
              </div>
              <div className="text-sm text-gray-600">Market Size</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Detailed Analysis */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="feasibility">Feasibility</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="heatmap" className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Heatmap</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations">Next Steps</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                  Potential Threats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.threats.map((threat, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{threat}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feasibility" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Technical Feasibility</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {analysisResult.feasibility.technical}%
                </div>
                <Progress value={analysisResult.feasibility.technical} className="mb-4" />
                <p className="text-sm text-gray-600">
                  Assessment of technical complexity and implementation challenges
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Financial Feasibility</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {analysisResult.feasibility.financial}%
                </div>
                <Progress value={analysisResult.feasibility.financial} className="mb-4" />
                <p className="text-sm text-gray-600">
                  Evaluation of funding requirements and revenue potential
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Market Feasibility</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {analysisResult.feasibility.market}%
                </div>
                <Progress value={analysisResult.feasibility.market} className="mb-4" />
                <p className="text-sm text-gray-600">
                  Analysis of market readiness and customer demand
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Target className="w-6 h-6 mr-2 text-blue-600" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {analysisResult.marketPotential.size}
                  </div>
                  <div className="text-sm text-gray-600">Total Addressable Market</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {analysisResult.marketPotential.growth}
                  </div>
                  <div className="text-sm text-gray-600">Expected Growth Rate</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    {analysisResult.marketPotential.competition}
                  </div>
                  <div className="text-sm text-gray-600">Competition Level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                  Strategic Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysisResult.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs font-semibold text-yellow-600">{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Immediate Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysisResult.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Ready to Move Forward?
                </h3>
                <p className="text-gray-600 mb-6">
                  Continue with our guided startup development process to turn your validated idea into a business.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Business Plan
                  </Button>
                  <Button variant="outline">
                    <Presentation className="w-4 h-4 mr-2" />
                    Create Pitch Deck
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-6">
          <StartupHeatmap userIdeaData={ideaData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}