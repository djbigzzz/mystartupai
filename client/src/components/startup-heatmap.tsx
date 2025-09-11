import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Zap, 
  Target, 
  BarChart3,
  Filter,
  Search,
  MapPin,
  Eye,
  Info,
  Layers,
  Activity,
  Award,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Enhanced data structure for startup ideas with market potential metrics
interface StartupIdeaData {
  id: string;
  title: string;
  industry: string;
  description: string;
  marketSize: number; // In billions USD
  growthRate: number; // Annual percentage
  competitionLevel: number; // 1-10 scale
  feasibilityScore: number; // 1-100 scale
  fundingRequired: number; // In millions USD
  timeToMarket: number; // In months
  riskLevel: "low" | "medium" | "high";
  stage: string;
  targetAudience: string;
  keyMetrics: {
    tam: number; // Total Addressable Market
    sam: number; // Serviceable Addressable Market
    som: number; // Serviceable Obtainable Market
    cac: number; // Customer Acquisition Cost
    ltv: number; // Lifetime Value
  };
  coordinates: { x: number; y: number }; // For heatmap positioning
  color: string;
  isUserIdea?: boolean;
}

// Sample startup ideas data for the heatmap
const generateStartupIdeas = (): StartupIdeaData[] => [
  {
    id: "ai-trading",
    title: "AI Trading Platform",
    industry: "FinTech",
    description: "AI-powered cryptocurrency and stock trading platform with predictive analytics",
    marketSize: 12.5,
    growthRate: 25.3,
    competitionLevel: 8,
    feasibilityScore: 75,
    fundingRequired: 5.2,
    timeToMarket: 18,
    riskLevel: "high",
    stage: "MVP Development",
    targetAudience: "Professional Traders",
    keyMetrics: {
      tam: 12500,
      sam: 3200,
      som: 450,
      cac: 180,
      ltv: 2400
    },
    coordinates: { x: 75, y: 80 },
    color: "#3B82F6",
    isUserIdea: true
  },
  {
    id: "health-ai",
    title: "AI Health Diagnostics",
    industry: "HealthTech",
    description: "AI-powered diagnostic tool for early disease detection",
    marketSize: 45.2,
    growthRate: 15.7,
    competitionLevel: 6,
    feasibilityScore: 82,
    fundingRequired: 12.8,
    timeToMarket: 24,
    riskLevel: "medium",
    stage: "Clinical Trials",
    targetAudience: "Healthcare Providers",
    keyMetrics: {
      tam: 45200,
      sam: 12400,
      som: 1850,
      cac: 2500,
      ltv: 18000
    },
    coordinates: { x: 82, y: 65 },
    color: "#EF4444"
  },
  {
    id: "edu-vr",
    title: "VR Education Platform",
    industry: "EdTech",
    description: "Immersive VR learning experiences for K-12 education",
    marketSize: 8.3,
    growthRate: 32.1,
    competitionLevel: 4,
    feasibilityScore: 68,
    fundingRequired: 3.4,
    timeToMarket: 12,
    riskLevel: "medium",
    stage: "Beta Testing",
    targetAudience: "Schools & Students",
    keyMetrics: {
      tam: 8300,
      sam: 2100,
      som: 320,
      cac: 45,
      ltv: 680
    },
    coordinates: { x: 68, y: 55 },
    color: "#10B981"
  },
  {
    id: "climate-tech",
    title: "Carbon Capture SaaS",
    industry: "ClimaTech",
    description: "Software platform for monitoring and optimizing carbon capture systems",
    marketSize: 15.8,
    growthRate: 28.4,
    competitionLevel: 3,
    feasibilityScore: 71,
    fundingRequired: 8.5,
    timeToMarket: 20,
    riskLevel: "medium",
    stage: "Pilot Program",
    targetAudience: "Industrial Companies",
    keyMetrics: {
      tam: 15800,
      sam: 4200,
      som: 580,
      cac: 1200,
      ltv: 24000
    },
    coordinates: { x: 71, y: 72 },
    color: "#059669"
  },
  {
    id: "drone-delivery",
    title: "Autonomous Drone Delivery",
    industry: "Logistics",
    description: "AI-driven drone delivery network for urban last-mile delivery",
    marketSize: 22.4,
    growthRate: 35.6,
    competitionLevel: 9,
    feasibilityScore: 58,
    fundingRequired: 25.3,
    timeToMarket: 36,
    riskLevel: "high",
    stage: "Regulatory Approval",
    targetAudience: "E-commerce Companies",
    keyMetrics: {
      tam: 22400,
      sam: 5600,
      som: 420,
      cac: 85,
      ltv: 950
    },
    coordinates: { x: 58, y: 88 },
    color: "#F59E0B"
  },
  {
    id: "mental-wellness",
    title: "AI Therapy Assistant",
    industry: "HealthTech",
    description: "AI-powered mental health support and therapy assistance platform",
    marketSize: 18.6,
    growthRate: 22.8,
    competitionLevel: 5,
    feasibilityScore: 79,
    fundingRequired: 4.2,
    timeToMarket: 15,
    riskLevel: "low",
    stage: "Market Research",
    targetAudience: "Individuals & Therapists",
    keyMetrics: {
      tam: 18600,
      sam: 4800,
      som: 720,
      cac: 65,
      ltv: 1280
    },
    coordinates: { x: 79, y: 45 },
    color: "#8B5CF6"
  },
  {
    id: "blockchain-supply",
    title: "Blockchain Supply Chain",
    industry: "Supply Chain",
    description: "Blockchain-based supply chain transparency and traceability platform",
    marketSize: 9.7,
    growthRate: 18.3,
    competitionLevel: 7,
    feasibilityScore: 64,
    fundingRequired: 6.8,
    timeToMarket: 22,
    riskLevel: "medium",
    stage: "Proof of Concept",
    targetAudience: "Manufacturing Companies",
    keyMetrics: {
      tam: 9700,
      sam: 2400,
      som: 380,
      cac: 850,
      ltv: 12500
    },
    coordinates: { x: 64, y: 62 },
    color: "#EC4899"
  }
];

interface StartupHeatmapProps {
  userIdeaData?: any; // Data from the user's submitted idea
}

export default function StartupHeatmap({ userIdeaData }: StartupHeatmapProps) {
  const { toast } = useToast();
  const [selectedIdea, setSelectedIdea] = useState<StartupIdeaData | null>(null);
  const [filterIndustry, setFilterIndustry] = useState<string>("all");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [marketSizeRange, setMarketSizeRange] = useState<number[]>([0, 50]);
  const [growthRateRange, setGrowthRateRange] = useState<number[]>([0, 40]);
  const [viewMode, setViewMode] = useState<"potential" | "competition" | "risk">("potential");

  // Generate startup ideas data with user's idea if available
  const startupIdeas = useMemo(() => {
    let ideas = generateStartupIdeas();
    
    // Add user's idea if available
    if (userIdeaData) {
      const userIdea: StartupIdeaData = {
        id: "user-idea",
        title: userIdeaData.ideaTitle || "Your Startup Idea",
        industry: userIdeaData.industry || "Technology",
        description: userIdeaData.description || "User submitted idea",
        marketSize: Math.random() * 30 + 5, // Simulate market size
        growthRate: Math.random() * 25 + 10,
        competitionLevel: Math.floor(Math.random() * 8) + 3,
        feasibilityScore: userIdeaData.analysis?.feasibilityScore || Math.floor(Math.random() * 40) + 60,
        fundingRequired: Math.random() * 15 + 2,
        timeToMarket: Math.floor(Math.random() * 24) + 6,
        riskLevel: Math.random() > 0.6 ? "high" : Math.random() > 0.3 ? "medium" : "low",
        stage: userIdeaData.stage || "Idea Stage",
        targetAudience: "Target Market",
        keyMetrics: {
          tam: Math.floor(Math.random() * 20000) + 5000,
          sam: Math.floor(Math.random() * 5000) + 1000,
          som: Math.floor(Math.random() * 800) + 200,
          cac: Math.floor(Math.random() * 300) + 50,
          ltv: Math.floor(Math.random() * 2000) + 500
        },
        coordinates: { 
          x: Math.min(95, Math.max(5, (userIdeaData.analysis?.feasibilityScore || 70))), 
          y: Math.min(95, Math.max(5, Math.random() * 60 + 20))
        },
        color: "#FF6B35",
        isUserIdea: true
      };
      ideas = [userIdea, ...ideas];
    }
    
    return ideas;
  }, [userIdeaData]);

  // Filter ideas based on current filters
  const filteredIdeas = useMemo(() => {
    return startupIdeas.filter(idea => {
      if (filterIndustry !== "all" && idea.industry !== filterIndustry) return false;
      if (filterRisk !== "all" && idea.riskLevel !== filterRisk) return false;
      if (idea.marketSize < marketSizeRange[0] || idea.marketSize > marketSizeRange[1]) return false;
      if (idea.growthRate < growthRateRange[0] || idea.growthRate > growthRateRange[1]) return false;
      return true;
    });
  }, [startupIdeas, filterIndustry, filterRisk, marketSizeRange, growthRateRange]);

  // Get unique industries for filter dropdown
  const industries = useMemo(() => {
    const uniqueIndustries = Array.from(new Set(startupIdeas.map(idea => idea.industry)));
    return uniqueIndustries;
  }, [startupIdeas]);

  // Calculate heatmap colors based on view mode
  const getHeatmapColor = (idea: StartupIdeaData) => {
    let intensity = 0;
    switch (viewMode) {
      case "potential":
        intensity = (idea.marketSize * 0.3 + idea.growthRate * 0.4 + (100 - idea.competitionLevel * 10) * 0.3) / 100;
        break;
      case "competition":
        intensity = idea.competitionLevel / 10;
        break;
      case "risk":
        intensity = idea.riskLevel === "high" ? 0.8 : idea.riskLevel === "medium" ? 0.5 : 0.2;
        break;
    }
    
    if (idea.isUserIdea) {
      return idea.color;
    }
    
    const baseColor = viewMode === "potential" ? "34, 197, 94" : 
                     viewMode === "competition" ? "239, 68, 68" : 
                     "251, 146, 60";
    return `rgba(${baseColor}, ${intensity})`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-green-600 bg-green-50 border-green-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "high": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const handleIdeaClick = (idea: StartupIdeaData) => {
    setSelectedIdea(idea);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Startup Idea Heatmap
            </h1>
            <p className="text-lg text-slate-600">
              Interactive visualization of market potential across different startup ideas
            </p>
          </div>
          <div className="text-center">
            <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-2" />
            <p className="text-slate-600 font-medium">Market Intelligence</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge className="bg-blue-100 text-blue-800">
            <Activity className="w-3 h-3 mr-1" />
            Live Data
          </Badge>
          <Badge variant="outline">Interactive Analysis</Badge>
          <Badge variant="outline">{filteredIdeas.length} Ideas</Badge>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2 text-blue-600" />
              Filters & Controls
            </CardTitle>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
              <TabsList>
                <TabsTrigger value="potential" className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Potential</span>
                </TabsTrigger>
                <TabsTrigger value="competition" className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Competition</span>
                </TabsTrigger>
                <TabsTrigger value="risk" className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Risk</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Industry Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Industry</label>
              <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Risk Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Risk Level</label>
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger>
                  <SelectValue placeholder="All Risk Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Market Size Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Market Size: ${marketSizeRange[0]}B - ${marketSizeRange[1]}B
              </label>
              <Slider
                value={marketSizeRange}
                onValueChange={setMarketSizeRange}
                max={50}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Growth Rate Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Growth Rate: {growthRateRange[0]}% - {growthRateRange[1]}%
              </label>
              <Slider
                value={growthRateRange}
                onValueChange={setGrowthRateRange}
                max={40}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Layers className="w-5 h-5 mr-2 text-blue-600" />
              Market Potential Heatmap
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Y-axis: Market Attractiveness | X-axis: Feasibility Score
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 min-h-[600px]">
            {/* Axis Labels */}
            <div className="absolute left-4 top-1/2 transform -rotate-90 -translate-y-1/2">
              <span className="text-sm font-medium text-gray-600">
                Market Attractiveness (Growth × Size ÷ Competition)
              </span>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <span className="text-sm font-medium text-gray-600">
                Feasibility Score (Technical × Funding × Time)
              </span>
            </div>

            {/* Grid Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Quadrant Labels */}
            <div className="absolute top-16 left-16 text-xs font-medium text-gray-500">
              High Potential
              <br />
              Low Feasibility
            </div>
            <div className="absolute top-16 right-16 text-xs font-medium text-gray-500">
              High Potential
              <br />
              High Feasibility
            </div>
            <div className="absolute bottom-16 left-16 text-xs font-medium text-gray-500">
              Low Potential
              <br />
              Low Feasibility
            </div>
            <div className="absolute bottom-16 right-16 text-xs font-medium text-gray-500">
              Low Potential
              <br />
              High Feasibility
            </div>

            {/* Startup Ideas */}
            {filteredIdeas.map(idea => (
              <div
                key={idea.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10"
                style={{
                  left: `${idea.coordinates.x}%`,
                  top: `${100 - idea.coordinates.y}%`,
                  backgroundColor: getHeatmapColor(idea),
                  width: idea.isUserIdea ? '24px' : '20px',
                  height: idea.isUserIdea ? '24px' : '20px',
                  borderRadius: '50%',
                  border: idea.isUserIdea ? '3px solid #FF6B35' : '2px solid rgba(255,255,255,0.8)',
                  boxShadow: idea.isUserIdea ? '0 4px 12px rgba(255,107,53,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
                }}
                onClick={() => handleIdeaClick(idea)}
                title={`${idea.title} - ${idea.industry}`}
              >
                {idea.isUserIdea && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                    Your Idea
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-orange-600"></div>
                <span className="text-sm text-gray-600">Your Idea</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-400"></div>
                <span className="text-sm text-gray-600">Competitor Ideas</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              Click on any idea to view detailed analysis
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Idea Details Dialog */}
      {selectedIdea && (
        <Dialog open={!!selectedIdea} onOpenChange={() => setSelectedIdea(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: selectedIdea.color }}
                />
                <span>{selectedIdea.title}</span>
                {selectedIdea.isUserIdea && (
                  <Badge className="bg-orange-100 text-orange-800">Your Idea</Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                {selectedIdea.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Market Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Market Size:</span>
                      <span className="font-medium">${selectedIdea.marketSize.toFixed(1)}B</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Growth Rate:</span>
                      <span className="font-medium">{selectedIdea.growthRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Competition Level:</span>
                      <span className="font-medium">{selectedIdea.competitionLevel}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Risk Level:</span>
                      <Badge className={getRiskColor(selectedIdea.riskLevel)}>
                        {selectedIdea.riskLevel}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Business Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Feasibility Score:</span>
                      <span className="font-medium">{selectedIdea.feasibilityScore}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Funding Required:</span>
                      <span className="font-medium">${selectedIdea.fundingRequired.toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Time to Market:</span>
                      <span className="font-medium">{selectedIdea.timeToMarket} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current Stage:</span>
                      <span className="font-medium">{selectedIdea.stage}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TAM/SAM/SOM */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Market Analysis</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      ${(selectedIdea.keyMetrics.tam / 1000).toFixed(1)}B
                    </div>
                    <div className="text-sm text-gray-600">TAM</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${(selectedIdea.keyMetrics.sam / 1000).toFixed(1)}B
                    </div>
                    <div className="text-sm text-gray-600">SAM</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      ${selectedIdea.keyMetrics.som}M
                    </div>
                    <div className="text-sm text-gray-600">SOM</div>
                  </div>
                </div>
              </div>

              {/* Unit Economics */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Unit Economics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Customer Acquisition Cost:</span>
                    <span className="font-medium">${selectedIdea.keyMetrics.cac}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lifetime Value:</span>
                    <span className="font-medium">${selectedIdea.keyMetrics.ltv}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">LTV:CAC Ratio:</span>
                    <span className="font-medium">{(selectedIdea.keyMetrics.ltv / selectedIdea.keyMetrics.cac).toFixed(1)}:1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Target Audience:</span>
                    <span className="font-medium">{selectedIdea.targetAudience}</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Summary Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{filteredIdeas.length}</div>
                <div className="text-sm text-gray-600">Ideas Analyzed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ${(filteredIdeas.reduce((sum, idea) => sum + idea.marketSize, 0)).toFixed(0)}B
                </div>
                <div className="text-sm text-gray-600">Total Market Size</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {(filteredIdeas.reduce((sum, idea) => sum + idea.growthRate, 0) / filteredIdeas.length).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Avg Growth Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.max(...filteredIdeas.map(idea => idea.feasibilityScore))}
                </div>
                <div className="text-sm text-gray-600">Highest Feasibility</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}