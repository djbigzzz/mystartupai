import { useState, useEffect, useMemo } from "react";
// Note: This component uses mock data for demonstration purposes
// Real market research would integrate with external APIs like Pitchbook, CB Insights, etc.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Eye,
  Share2,
  ExternalLink,
  Filter,
  SortDesc,
  Calendar,
  DollarSign,
  Lightbulb,
  Building,
  Map,
  Network,
  Layers,
  TrendingDown,
  Activity,
  Star,
  Award,
  Briefcase,
  RefreshCw,
  Settings,
  MoreHorizontal,
  ChevronRight,
  PlayCircle,
  FileBarChart,
  PresentationChart
} from "lucide-react";
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend,
  ScatterChart,
  Scatter,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from "recharts";
import { useToast } from "@/hooks/use-toast";

// Enhanced interfaces for comprehensive market analysis
interface TAMSAMSOMData {
  tam: {
    value: number;
    description: string;
    methodology: string;
    sources: string[];
  };
  sam: {
    value: number;
    description: string;
    methodology: string;
    percentage: number;
  };
  som: {
    value: number;
    description: string;
    methodology: string;
    percentage: number;
    timeframe: string;
  };
  marketSizing: {
    topDown: number;
    bottomUp: number;
    comparative: number;
  };
}

interface MarketSegment {
  id: string;
  name: string;
  size: string;
  sizeNumeric: number;
  growth: number;
  description: string;
  opportunity: "high" | "medium" | "low";
  competitorCount: number;
  entryBarriers: string[];
  keyPlayers: string[];
  trends: string[];
  customerProfiles: string[];
}

interface Competitor {
  id: string;
  name: string;
  type: "direct" | "indirect" | "substitute";
  marketShare: number;
  revenue: number;
  valuation?: number;
  employees: number;
  founded: number;
  headquarters: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  pricing: {
    model: string;
    range: string;
    value: number;
  };
  funding: {
    total: string;
    lastRound: string;
    stage: string;
    investors: string[];
  };
  description: string;
  products: string[];
  marketPosition: {
    x: number; // Innovation/Features score
    y: number; // Market execution score
  };
  customerSatisfaction: number;
  growthRate: number;
  riskLevel: "low" | "medium" | "high";
}

interface MarketTrend {
  id: string;
  trend: string;
  impact: "positive" | "negative" | "neutral";
  description: string;
  timeframe: string;
  relevance: number;
  impactScore: number;
  confidence: number;
  category: "technology" | "regulation" | "social" | "economic" | "environmental";
  geographicScope: "global" | "regional" | "local";
  drivers: string[];
  implications: string[];
}

interface CustomerPersona {
  id: string;
  name: string;
  demographics: {
    age: string;
    income: string;
    education: string;
    location: string;
    role: string;
  };
  psychographics: {
    values: string[];
    interests: string[];
    lifestyle: string;
  };
  painPoints: {
    point: string;
    severity: number;
    frequency: string;
  }[];
  motivations: {
    motivation: string;
    importance: number;
  }[];
  channels: {
    channel: string;
    preference: number;
    effectiveness: number;
  }[];
  budget: {
    range: string;
    decisionProcess: string;
    influence: string[];
  };
  journey: {
    stage: string;
    touchpoints: string[];
    emotions: string[];
    actions: string[];
  }[];
  marketSize: number;
  growthPotential: number;
}

interface SWOTAnalysis {
  strengths: {
    factor: string;
    impact: number;
    evidence: string;
  }[];
  weaknesses: {
    factor: string;
    impact: number;
    mitigation: string;
  }[];
  opportunities: {
    factor: string;
    potential: number;
    requirements: string;
  }[];
  threats: {
    factor: string;
    severity: number;
    likelihood: number;
    mitigation: string;
  }[];
}

interface ExportData {
  executiveSummary: string;
  methodology: string;
  keyFindings: string[];
  recommendations: string[];
  marketData: any;
  competitorData: Competitor[];
  trendData: MarketTrend[];
  personaData: CustomerPersona[];
  swotAnalysis: SWOTAnalysis;
}

interface MarketResearchProps {
  ideaData: any;
  businessPlan?: any;
  onDataUpdate?: (data: any) => void;
  onIntegration?: (platform: string, data: any) => void;
}

// Chart colors and styling
const CHART_COLORS = {
  primary: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'],
  tam: '#3B82F6',
  sam: '#10B981', 
  som: '#8B5CF6',
  competitors: {
    direct: '#EF4444',
    indirect: '#F59E0B',
    substitute: '#6B7280'
  },
  opportunities: {
    high: '#10B981',
    medium: '#F59E0B',
    low: '#EF4444'
  },
  trends: {
    positive: '#10B981',
    negative: '#EF4444',
    neutral: '#6B7280'
  }
};

const MARKET_RESEARCH_TABS = [
  { id: 'overview', label: 'Market Overview', icon: Globe },
  { id: 'tam-sam-som', label: 'TAM/SAM/SOM', icon: PieChart },
  { id: 'competitors', label: 'Competitive Map', icon: Network },
  { id: 'segments', label: 'Segmentation', icon: Layers },
  { id: 'trends', label: 'Market Trends', icon: TrendingUp },
  { id: 'personas', label: 'Customer Personas', icon: Users },
  { id: 'analysis', label: 'SWOT Analysis', icon: BarChart3 },
  { id: 'integration', label: 'Integrations', icon: Share2 }
];

// Helper functions for market research data generation
const getIndustryBaseTAM = (industry: string): number => {
  const industryTAMs: Record<string, number> = {
    'fintech': 310000000000,
    'healthcare': 665000000000,
    'saas': 145000000000,
    'ecommerce': 563000000000,
    'education': 89000000000,
    'real estate': 228000000000,
    'technology': 200000000000,
    'ai': 190000000000,
    'cybersecurity': 173000000000,
    'climate': 255000000000
  };
  return industryTAMs[industry] || 150000000000;
};

const getIndustryGrowthRate = (industry: string): number => {
  const growthRates: Record<string, number> = {
    'fintech': 23.58,
    'healthcare': 5.4,
    'saas': 18.7,
    'ecommerce': 14.7,
    'education': 16.3,
    'real estate': 7.1,
    'technology': 15.5,
    'ai': 37.3,
    'cybersecurity': 12.8,
    'climate': 22.1
  };
  return growthRates[industry] || 15.0;
};

const getIndustryMaturity = (industry: string): 'emerging' | 'growing' | 'mature' | 'declining' => {
  const maturityMap: Record<string, 'emerging' | 'growing' | 'mature' | 'declining'> = {
    'fintech': 'growing',
    'healthcare': 'mature',
    'saas': 'growing',
    'ecommerce': 'mature',
    'education': 'growing',
    'real estate': 'mature',
    'technology': 'mature',
    'ai': 'emerging',
    'cybersecurity': 'growing',
    'climate': 'emerging'
  };
  return maturityMap[industry] || 'growing';
};

const getIndustryRegulations = (industry: string): string[] => {
  const regulationsMap: Record<string, string[]> = {
    'fintech': ['PCI DSS', 'SOX', 'GDPR', 'Bank Secrecy Act', 'CCPA'],
    'healthcare': ['HIPAA', 'FDA', 'HITECH', 'State Regulations'],
    'saas': ['GDPR', 'SOC 2', 'CCPA', 'ISO 27001'],
    'ecommerce': ['GDPR', 'CCPA', 'PCI DSS', 'Consumer Protection'],
    'education': ['FERPA', 'COPPA', 'GDPR', 'State Education Laws'],
    'real estate': ['Fair Housing Act', 'RESPA', 'State Licensing'],
    'technology': ['GDPR', 'CCPA', 'Export Control', 'IP Laws'],
    'ai': ['GDPR', 'AI Ethics Guidelines', 'Algorithmic Accountability'],
    'cybersecurity': ['SOC 2', 'ISO 27001', 'NIST Framework'],
    'climate': ['EPA Regulations', 'Carbon Markets', 'ESG Compliance']
  };
  return regulationsMap[industry] || ['General Business', 'Consumer Protection', 'Data Privacy'];
};

const getIndustryBarriers = (industry: string): string[] => {
  const barriersMap: Record<string, string[]> = {
    'fintech': ['Regulatory approval', 'High capital requirements', 'Banking partnerships'],
    'healthcare': ['FDA approval', 'Clinical trials', 'Insurance reimbursement'],
    'saas': ['Customer acquisition cost', 'Product-market fit', 'Competitive pricing'],
    'ecommerce': ['Market saturation', 'Customer acquisition', 'Logistics complexity'],
    'education': ['Slow adoption cycles', 'Budget constraints', 'Regulatory approval'],
    'real estate': ['Capital requirements', 'Market cycles', 'Local regulations'],
    'technology': ['Technical complexity', 'Talent acquisition', 'IP protection'],
    'ai': ['Data requirements', 'Technical talent', 'Ethical concerns'],
    'cybersecurity': ['Proof of efficacy', 'Enterprise sales cycles', 'Compliance requirements'],
    'climate': ['Long development cycles', 'Policy uncertainty', 'Capital intensity']
  };
  return barriersMap[industry] || ['Market education', 'Competition', 'Resource constraints'];
};

const formatCurrency = (value: number): string => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
};

const generateMockCompetitors = (industry: string): Competitor[] => {
  const competitorTemplates = [
    {
      name: 'Market Leader Corp',
      type: 'direct' as const,
      baseMarketShare: 35,
      baseRevenue: 500000000,
      description: 'Established market leader with traditional approach'
    },
    {
      name: 'Innovation Labs',
      type: 'direct' as const,
      baseMarketShare: 12,
      baseRevenue: 80000000,
      description: 'Fast-growing innovative competitor'
    },
    {
      name: 'Enterprise Solutions',
      type: 'indirect' as const,
      baseMarketShare: 18,
      baseRevenue: 250000000,
      description: 'Established enterprise solution provider'
    },
    {
      name: 'Disruptor Inc',
      type: 'direct' as const,
      baseMarketShare: 8,
      baseRevenue: 45000000,
      description: 'New market entrant with disruptive approach'
    },
    {
      name: 'Legacy Systems',
      type: 'substitute' as const,
      baseMarketShare: 22,
      baseRevenue: 180000000,
      description: 'Traditional solution being replaced'
    }
  ];

  return competitorTemplates.map((template, index) => ({
    id: `comp-${index}`,
    name: template.name,
    type: template.type,
    marketShare: template.baseMarketShare + Math.random() * 10 - 5,
    revenue: template.baseRevenue * (0.8 + Math.random() * 0.4),
    valuation: template.baseRevenue * (5 + Math.random() * 10),
    employees: Math.floor(template.baseRevenue / 200000),
    founded: 2010 + Math.floor(Math.random() * 14),
    headquarters: ['San Francisco', 'New York', 'Boston', 'Austin', 'Seattle'][Math.floor(Math.random() * 5)],
    strengths: getCompetitorStrengths(template.type, template.baseMarketShare),
    weaknesses: getCompetitorWeaknesses(template.type, template.baseMarketShare),
    opportunities: ['International expansion', 'Product diversification', 'Strategic partnerships'],
    threats: ['New market entrants', 'Regulatory changes', 'Technology disruption'],
    pricing: {
      model: getPricingModel(industry),
      range: getPricingRange(template.baseRevenue),
      value: Math.floor(template.baseRevenue / template.baseMarketShare * 100)
    },
    funding: {
      total: formatCurrency(template.baseRevenue * 0.3),
      lastRound: getFundingStage(template.baseRevenue),
      stage: getFundingStage(template.baseRevenue),
      investors: ['Andreessen Horowitz', 'Sequoia Capital', 'GV', 'Bessemer Ventures']
    },
    description: template.description,
    products: getProductList(industry),
    marketPosition: {
      x: 40 + Math.random() * 40, // Innovation score
      y: 30 + Math.random() * 50  // Market execution score
    },
    customerSatisfaction: 3.5 + Math.random() * 1.5,
    growthRate: getIndustryGrowthRate(industry) * (0.5 + Math.random()),
    riskLevel: getRiskLevel(template.baseMarketShare)
  }));
};

const getCompetitorStrengths = (type: string, marketShare: number): string[] => {
  const strengthsPool = {
    high: ['Market leadership', 'Brand recognition', 'Large customer base', 'Financial resources'],
    medium: ['Product innovation', 'Agile development', 'Growing market presence', 'Strong team'],
    low: ['Niche expertise', 'Competitive pricing', 'Focused approach', 'Customer loyalty']
  };
  const category = marketShare > 25 ? 'high' : marketShare > 15 ? 'medium' : 'low';
  return strengthsPool[category].slice(0, 3);
};

const getCompetitorWeaknesses = (type: string, marketShare: number): string[] => {
  const weaknessesPool = {
    high: ['Legacy technology', 'Slow innovation', 'High pricing', 'Bureaucracy'],
    medium: ['Limited resources', 'Market positioning', 'Scalability challenges', 'Competition'],
    low: ['Limited market presence', 'Resource constraints', 'Brand awareness', 'Scale limitations']
  };
  const category = marketShare > 25 ? 'high' : marketShare > 15 ? 'medium' : 'low';
  return weaknessesPool[category].slice(0, 3);
};

const getPricingModel = (industry: string): string => {
  const models: Record<string, string> = {
    'saas': 'Subscription',
    'fintech': 'Transaction-based',
    'ecommerce': 'Commission',
    'healthcare': 'Per-patient',
    'education': 'Per-seat'
  };
  return models[industry] || 'Subscription';
};

const getPricingRange = (revenue: number): string => {
  const base = Math.floor(revenue / 10000000);
  return `$${base * 10}-${base * 30}/month`;
};

const getFundingStage = (revenue: number): string => {
  if (revenue > 100000000) return 'Series D+';
  if (revenue > 50000000) return 'Series C';
  if (revenue > 20000000) return 'Series B';
  if (revenue > 5000000) return 'Series A';
  return 'Seed';
};

const getProductList = (industry: string): string[] => {
  const productMap: Record<string, string[]> = {
    'fintech': ['Payment Processing', 'Digital Banking', 'Investment Platform'],
    'saas': ['Core Platform', 'Analytics Dashboard', 'Mobile App'],
    'healthcare': ['Patient Management', 'Clinical Tools', 'Analytics'],
    'ecommerce': ['Marketplace', 'Payment Gateway', 'Logistics Platform']
  };
  return productMap[industry] || ['Core Product', 'Analytics', 'Mobile App'];
};

const getRiskLevel = (marketShare: number): 'low' | 'medium' | 'high' => {
  if (marketShare > 25) return 'low';
  if (marketShare > 15) return 'medium';
  return 'high';
};

export default function MarketResearch({ ideaData, businessPlan, onDataUpdate, onIntegration }: MarketResearchProps) {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysis, setCurrentAnalysis] = useState("");
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([]);
  const [competitorView, setCompetitorView] = useState<'grid' | 'map' | 'matrix'>('grid');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'powerpoint'>('pdf');

  // Export and Integration Handlers
  const handleExport = async (format: 'pdf' | 'excel' | 'powerpoint') => {
    const industry = ideaData?.industry || 'technology';
    const region = ideaData?.targetMarket || 'global';
    const targetMarket = ideaData?.targetMarket || 'general market';
    
    const exportData = {
      marketResearch: {
        industry,
        region,
        targetMarket,
        results: {
          overview: { tamSamSom: tamSamSomData, marketSize: marketData },
          competitors,
          segments: marketSegments,
          trends: marketTrends,
          personas: customerPersonas,
          swot: swotAnalysis
        },
        generatedAt: new Date().toISOString()
      }
    };

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Currently only supports JSON export - implementing actual PDF/Excel/PowerPoint would require additional libraries
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `market-research-report-${industry}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setShowExportDialog(false);
      toast({
        title: "Export Complete",
        description: `Market research report exported as JSON (${format.toUpperCase()} format will be available in future updates)`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDataExport = (type: 'json' | 'csv' | 'api') => {
    const industry = ideaData?.industry || 'technology';
    
    const exportData = {
      tamSamSom: tamSamSomData,
      competitors,
      marketSegments,
      marketTrends,
      customerPersonas,
      swotAnalysis,
      exportedAt: new Date().toISOString()
    };

    if (type === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `market-data-${industry}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "JSON Export Complete",
        description: "Market research data exported successfully",
      });
    } else if (type === 'csv') {
      // Convert data to CSV format - flatten nested objects
      const csvData = competitors.map(comp => ({
        name: comp.name,
        marketShare: comp.marketShare,
        fundingTotal: comp.funding.total,
        fundingStage: comp.funding.stage,
        employees: comp.employees,
        founded: comp.founded,
        headquarters: comp.headquarters,
        type: comp.type,
        revenue: comp.revenue,
        customerSatisfaction: comp.customerSatisfaction?.toFixed(1) || 'N/A'
      }));
      
      const csvContent = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).map(val => 
          typeof val === 'string' && val.includes(',') ? `"${val}"` : val
        ).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `competitors-data-${industry}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "CSV Export Complete",
        description: "Competitor data exported successfully",
      });
    } else if (type === 'api') {
      // Copy API payload to clipboard
      navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      toast({
        title: "API Data Copied",
        description: "Market research data copied to clipboard for API integration",
      });
    }
  };

  const handleIntegration = (platform: string) => {
    const integrationData = {
      platform,
      data: {
        tamSamSom: tamSamSomData,
        competitors: competitors.slice(0, 5), // Top 5 competitors
        marketTrends: marketTrends.slice(0, 3), // Top 3 trends
        personas: customerPersonas.slice(0, 2), // Top 2 personas
        swot: swotAnalysis
      },
      timestamp: new Date().toISOString()
    };

    // Store integration data in localStorage for other components to access
    localStorage.setItem(`marketResearch_${platform.toLowerCase().replace(/\s+/g, '_')}`, JSON.stringify(integrationData));
    
    toast({
      title: `Integration with ${platform}`,
      description: `Market research data has been shared with ${platform}. You can now access it from that component.`,
    });
  };
  const [filterSettings, setFilterSettings] = useState({
    segmentSize: 'all',
    competitorType: 'all',
    trendImpact: 'all',
    personaSize: 'all'
  });

  // Enhanced market data with TAM/SAM/SOM
  const [tamSamSomData, setTamSamSomData] = useState<TAMSAMSOMData>({
    tam: {
      value: 0,
      description: "",
      methodology: "",
      sources: []
    },
    sam: {
      value: 0,
      description: "",
      methodology: "",
      percentage: 0
    },
    som: {
      value: 0,
      description: "",
      methodology: "",
      percentage: 0,
      timeframe: ""
    },
    marketSizing: {
      topDown: 0,
      bottomUp: 0,
      comparative: 0
    }
  });

  const [marketData, setMarketData] = useState({
    totalMarketSize: "",
    servableMarketSize: "",
    targetMarketSize: "",
    growthRate: 0,
    marketMaturity: "emerging" as const,
    regulations: [] as string[],
    barriers: [] as string[],
    keyMetrics: {
      cagr: 0,
      penetrationRate: 0,
      competitorCount: 0,
      avgDealSize: 0
    }
  });

  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [marketSegments, setMarketSegments] = useState<MarketSegment[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [customerPersonas, setCustomerPersonas] = useState<CustomerPersona[]>([]);
  const [swotAnalysis, setSWOTAnalysis] = useState<SWOTAnalysis>({
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: []
  });

  const [researchComplete, setResearchComplete] = useState(false);

  // Computed values for TAM/SAM/SOM visualization
  const tamSamSomChartData = useMemo(() => [
    {
      name: 'TAM',
      value: tamSamSomData.tam.value,
      percentage: 100,
      color: CHART_COLORS.tam,
      description: 'Total Addressable Market'
    },
    {
      name: 'SAM', 
      value: tamSamSomData.sam.value,
      percentage: tamSamSomData.sam.percentage,
      color: CHART_COLORS.sam,
      description: 'Serviceable Addressable Market'
    },
    {
      name: 'SOM',
      value: tamSamSomData.som.value, 
      percentage: tamSamSomData.som.percentage,
      color: CHART_COLORS.som,
      description: 'Serviceable Obtainable Market'
    }
  ], [tamSamSomData]);

  // Competitor positioning data for scatter plots
  const competitorMapData = useMemo(() => 
    competitors.map(comp => ({
      name: comp.name,
      x: comp.marketPosition.x,
      y: comp.marketPosition.y,
      size: comp.revenue / 1000000, // Size based on revenue
      marketShare: comp.marketShare,
      type: comp.type,
      color: CHART_COLORS.competitors[comp.type] || CHART_COLORS.competitors.direct
    }))
  , [competitors]);

  // Market trends visualization data
  const trendsChartData = useMemo(() => 
    marketTrends.map(trend => ({
      name: trend.trend.substring(0, 20) + '...',
      impact: trend.impactScore,
      relevance: trend.relevance,
      confidence: trend.confidence,
      color: CHART_COLORS.trends[trend.impact]
    }))
  , [marketTrends]);

  // Customer segments size data
  const segmentSizeData = useMemo(() => 
    marketSegments.map(segment => ({
      name: segment.name,
      value: segment.sizeNumeric,
      growth: segment.growth,
      opportunity: segment.opportunity,
      color: CHART_COLORS.opportunities[segment.opportunity]
    }))
  , [marketSegments]);

  // Market research uses mock data generation for demonstration
  // In a production app, this would call external APIs for real market data

  const handleGenerateResearch = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const analysisSteps = [
      "Calculating TAM/SAM/SOM market sizing",
      "Analyzing competitive landscape", 
      "Mapping market trends and drivers",
      "Segmenting customer base",
      "Developing customer personas",
      "Conducting SWOT analysis",
      "Generating strategic insights",
      "Creating visualization data"
    ];
    
    for (let i = 0; i < analysisSteps.length; i++) {
      setCurrentAnalysis(analysisSteps[i]);
      await new Promise(resolve => setTimeout(resolve, 1200));
      setAnalysisProgress(((i + 1) / analysisSteps.length) * 100);
    }
    
    // Generate comprehensive mock data based on industry
    const industry = ideaData.industry?.toLowerCase() || 'technology';
    const baseTAM = getIndustryBaseTAM(industry);
    
    const mockTamSamSom: TAMSAMSOMData = {
      tam: {
        value: baseTAM,
        description: `Total addressable market for ${ideaData.industry} solutions globally`,
        methodology: "Top-down analysis based on industry reports and market research",
        sources: ["Gartner", "McKinsey", "Industry Analysis", "Government Data"]
      },
      sam: {
        value: baseTAM * 0.25,
        description: "Serviceable addressable market within target geography and segments",
        methodology: "Geographic and demographic filtering of TAM",
        percentage: 25
      },
      som: {
        value: baseTAM * 0.05,
        description: "Realistic market capture potential in first 5 years",
        methodology: "Bottom-up analysis based on go-to-market strategy",
        percentage: 5,
        timeframe: "5 years"
      },
      marketSizing: {
        topDown: baseTAM,
        bottomUp: baseTAM * 0.8,
        comparative: baseTAM * 1.1
      }
    };

    const mockMarketData = {
      tamSamSom: mockTamSamSom,
      marketData: {
        totalMarketSize: formatCurrency(baseTAM),
        servableMarketSize: formatCurrency(baseTAM * 0.25), 
        targetMarketSize: formatCurrency(baseTAM * 0.05),
        growthRate: getIndustryGrowthRate(industry),
        marketMaturity: getIndustryMaturity(industry),
        regulations: getIndustryRegulations(industry),
        barriers: getIndustryBarriers(industry),
        keyMetrics: {
          cagr: getIndustryGrowthRate(industry),
          penetrationRate: 15,
          competitorCount: Math.floor(Math.random() * 50) + 20,
          avgDealSize: Math.floor(Math.random() * 50000) + 10000
        }
      },
      competitors: generateMockCompetitors(industry),
      segments: generateMockSegments(industry, baseTAM),
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
                disabled={isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isAnalyzing ? (
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
          <TabsList className="grid w-full grid-cols-8 p-1">
            <TabsTrigger value="overview" className="flex items-center space-x-1" data-testid="tab-overview">
              <Globe className="w-4 h-4" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="tam-sam-som" className="flex items-center space-x-1" data-testid="tab-tam-sam-som">
              <PieChart className="w-4 h-4" />
              <span className="hidden md:inline">TAM/SAM/SOM</span>
            </TabsTrigger>
            <TabsTrigger value="competitors" className="flex items-center space-x-1" data-testid="tab-competitors">
              <Network className="w-4 h-4" />
              <span className="hidden md:inline">Competitors</span>
            </TabsTrigger>
            <TabsTrigger value="segments" className="flex items-center space-x-1" data-testid="tab-segments">
              <Layers className="w-4 h-4" />
              <span className="hidden md:inline">Segments</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center space-x-1" data-testid="tab-trends">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden md:inline">Trends</span>
            </TabsTrigger>
            <TabsTrigger value="personas" className="flex items-center space-x-1" data-testid="tab-personas">
              <Users className="w-4 h-4" />
              <span className="hidden md:inline">Personas</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center space-x-1" data-testid="tab-analysis">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">SWOT</span>
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center space-x-1" data-testid="tab-integration">
              <Share2 className="w-4 h-4" />
              <span className="hidden md:inline">Integrate</span>
            </TabsTrigger>
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
          
          <TabsContent value="tam-sam-som" className="space-y-6">
            {/* TAM/SAM/SOM Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                    Market Sizing Funnel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={tamSamSomChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {tamSamSomChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value: number) => [formatCurrency(value), 'Market Size']}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                    Market Size Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tamSamSomChartData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg" 
                           style={{ backgroundColor: `${item.color}10` }}>
                        <div>
                          <div className="font-semibold text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.description}</div>
                          <div className="text-xs text-gray-500">{item.percentage}% of TAM</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{ color: item.color }}>
                            {formatCurrency(item.value)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Market Sizing Methodology */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileBarChart className="w-5 h-5 mr-2 text-blue-600" />
                  Market Sizing Methodology & Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-blue-600">TAM Analysis</h4>
                    <p className="text-sm text-gray-600">{tamSamSomData.tam.description}</p>
                    <div className="text-xs text-gray-500">
                      <strong>Methodology:</strong> {tamSamSomData.tam.methodology}
                    </div>
                    <div className="text-xs text-gray-500">
                      <strong>Sources:</strong> {tamSamSomData.tam.sources.join(', ')}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-600">SAM Analysis</h4>
                    <p className="text-sm text-gray-600">{tamSamSomData.sam.description}</p>
                    <div className="text-xs text-gray-500">
                      <strong>Methodology:</strong> {tamSamSomData.sam.methodology}
                    </div>
                    <div className="p-3 bg-green-50 rounded">
                      <div className="text-lg font-bold text-green-600">{tamSamSomData.sam.percentage}%</div>
                      <div className="text-xs text-gray-600">of TAM</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-purple-600">SOM Analysis</h4>
                    <p className="text-sm text-gray-600">{tamSamSomData.som.description}</p>
                    <div className="text-xs text-gray-500">
                      <strong>Methodology:</strong> {tamSamSomData.som.methodology}
                    </div>
                    <div className="p-3 bg-purple-50 rounded">
                      <div className="text-lg font-bold text-purple-600">{tamSamSomData.som.percentage}%</div>
                      <div className="text-xs text-gray-600">of TAM ({tamSamSomData.som.timeframe})</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitors" className="space-y-6">
            {/* Competitor View Toggle */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <Network className="w-5 h-5 mr-2 text-blue-600" />
                    Competitive Landscape Analysis
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant={competitorView === 'grid' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setCompetitorView('grid')}
                      data-testid="button-view-grid"
                    >
                      <Grid3X3 className="w-4 h-4 mr-1" />
                      Grid
                    </Button>
                    <Button 
                      variant={competitorView === 'map' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setCompetitorView('map')}
                      data-testid="button-view-map"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Positioning
                    </Button>
                    <Button 
                      variant={competitorView === 'matrix' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setCompetitorView('matrix')}
                      data-testid="button-view-matrix"
                    >
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Matrix
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
            
            {/* Interactive Competitive Positioning Charts */}
            {competitorView === 'map' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Market Share vs. Innovation Score</CardTitle>
                    <p className="text-sm text-gray-600">Bubble size represents funding amount</p>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <ScatterChart data={competitors.map(comp => ({
                        name: comp.name,
                        marketShare: comp.marketShare,
                        innovation: Math.random() * 100 + 20, // Simulated innovation score
                        funding: Math.random() * 200 + 50, // Simulated funding
                        type: comp.type
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="marketShare" name="Market Share %" />
                        <YAxis dataKey="innovation" name="Innovation Score" />
                        <RechartsTooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-3 border rounded shadow-lg">
                                  <p className="font-semibold">{data.name}</p>
                                  <p className="text-sm">Market Share: {data.marketShare}%</p>
                                  <p className="text-sm">Innovation: {data.innovation.toFixed(1)}</p>
                                  <p className="text-sm">Type: {data.type}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Scatter dataKey="innovation" fill="#8B5CF6" r={6} />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Competitive Positioning Matrix</CardTitle>
                    <p className="text-sm text-gray-600">Market position vs growth potential</p>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <ScatterChart data={competitors.map((comp, index) => ({
                        name: comp.name,
                        position: comp.marketShare * 2 + Math.random() * 30,
                        growth: Math.random() * 80 + 20,
                        marketShare: comp.marketShare,
                        type: comp.type
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="position" name="Market Position Score" />
                        <YAxis dataKey="growth" name="Growth Potential %" />
                        <RechartsTooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-3 border rounded shadow-lg">
                                  <p className="font-semibold">{data.name}</p>
                                  <p className="text-sm">Position: {data.position.toFixed(1)}</p>
                                  <p className="text-sm">Growth: {data.growth.toFixed(1)}%</p>
                                  <p className="text-sm">Market Share: {data.marketShare}%</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Scatter dataKey="growth" fill="#10B981" r={8} />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Competitive Matrix View */}
            {competitorView === 'matrix' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Competitive Analysis Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={competitors.map(comp => ({
                      name: comp.name.length > 12 ? comp.name.substring(0, 12) + '...' : comp.name,
                      marketShare: comp.marketShare,
                      strengthsScore: comp.strengths.length * 20,
                      weaknessScore: comp.weaknesses.length * 15,
                      overallScore: comp.marketShare + (comp.strengths.length * 5) - (comp.weaknesses.length * 3)
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="marketShare" fill="#8B5CF6" name="Market Share %" />
                      <Bar dataKey="strengthsScore" fill="#10B981" name="Strengths Score" />
                      <Bar dataKey="overallScore" fill="#F59E0B" name="Overall Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
            
            {/* Enhanced Grid View */}
            {competitorView === 'grid' && (
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
          
          <TabsContent value="analysis" className="space-y-6">
            {/* SWOT Analysis Matrix */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  SWOT Analysis Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-green-700 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {swotAnalysis.strengths.map((strength, index) => (
                        <div key={index} className="p-3 bg-white rounded border border-green-200">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-900">{strength.factor}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {strength.impact}% impact
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{strength.evidence}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  {/* Weaknesses */}
                  <Card className="bg-red-50 border-red-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-red-700 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Weaknesses
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {swotAnalysis.weaknesses.map((weakness, index) => (
                        <div key={index} className="p-3 bg-white rounded border border-red-200">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-900">{weakness.factor}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {weakness.impact}% impact
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{weakness.mitigation}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  {/* Opportunities */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-blue-700 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Opportunities
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {swotAnalysis.opportunities.map((opportunity, index) => (
                        <div key={index} className="p-3 bg-white rounded border border-blue-200">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-900">{opportunity.factor}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {opportunity.potential}% potential
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{opportunity.requirements}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  {/* Threats */}
                  <Card className="bg-orange-50 border-orange-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-orange-700 flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        Threats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {swotAnalysis.threats.map((threat, index) => (
                        <div key={index} className="p-3 bg-white rounded border border-orange-200">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-900">{threat.factor}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="text-xs">
                                {threat.severity}% severity
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {threat.likelihood}% likely
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{threat.mitigation}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            {/* SWOT Impact Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Activity className="w-5 h-5 mr-2 text-purple-600" />
                  SWOT Impact Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Strengths', impact: swotAnalysis.strengths.reduce((acc, s) => acc + s.impact, 0) / swotAnalysis.strengths.length, color: '#10B981' },
                    { name: 'Weaknesses', impact: swotAnalysis.weaknesses.reduce((acc, w) => acc + w.impact, 0) / swotAnalysis.weaknesses.length, color: '#EF4444' },
                    { name: 'Opportunities', impact: swotAnalysis.opportunities.reduce((acc, o) => acc + o.potential, 0) / swotAnalysis.opportunities.length, color: '#3B82F6' },
                    { name: 'Threats', impact: swotAnalysis.threats.reduce((acc, t) => acc + t.severity, 0) / swotAnalysis.threats.length, color: '#F59E0B' }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <RechartsTooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Impact Score']} />
                    <Bar dataKey="impact" radius={[4, 4, 0, 0]}>
                      {[{ name: 'Strengths' }, { name: 'Weaknesses' }, { name: 'Opportunities' }, { name: 'Threats' }].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={[
                          '#10B981', '#EF4444', '#3B82F6', '#F59E0B'
                        ][index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integration" className="space-y-6">
            {/* Cross-Platform Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Share2 className="w-5 h-5 mr-2 text-blue-600" />
                  Platform Integrations
                </CardTitle>
                <p className="text-gray-600">Share market research data with other business planning tools</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pitch Deck Integration */}
                  <Card className="border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Pitch Deck Generator</h3>
                          <p className="text-sm text-gray-600">Populate market slides with research data</p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Market size slides</div>
                        <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Competitive landscape</div>
                        <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Market trends</div>
                        <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Customer personas</div>
                      </div>
                      <Button 
                        onClick={() => handleIntegration('Pitch Deck Generator')}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        data-testid="button-integrate-pitch-deck"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Send to Pitch Deck
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Financial Modeling Integration */}
                  <Card className="border-2 border-green-200 bg-green-50 hover:bg-green-100 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Financial Modeling</h3>
                          <p className="text-sm text-gray-600">Use market size for revenue projections</p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> TAM/SAM/SOM data</div>
                        <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Growth rates</div>
                        <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Market penetration</div>
                        <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Pricing insights</div>
                      </div>
                      <Button 
                        onClick={() => handleIntegration('Financial Modeling')}
                        className="w-full bg-green-600 hover:bg-green-700"
                        data-testid="button-integrate-financial"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Send to Financial Model
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Business Plan Integration */}
                  <Card className="border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Business Plan Generator</h3>
                          <p className="text-sm text-gray-600">Incorporate market insights</p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Market analysis section</div>
                        <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Competitive analysis</div>
                        <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Customer segments</div>
                        <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> SWOT analysis</div>
                      </div>
                      <Button 
                        onClick={() => handleIntegration('Business Plan Generator')}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        data-testid="button-integrate-business-plan"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Send to Business Plan
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Website Builder Integration */}
                  <Card className="border-2 border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Website Builder</h3>
                          <p className="text-sm text-gray-600">Use insights for positioning</p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Competitive positioning</div>
                        <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Target audience data</div>
                        <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Value propositions</div>
                        <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Market messaging</div>
                      </div>
                      <Button 
                        onClick={() => handleIntegration('Website Builder')}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        data-testid="button-integrate-website"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Send to Website Builder
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            {/* API Export */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Settings className="w-5 h-5 mr-2 text-gray-600" />
                  API Export & Data Sharing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center space-x-2"
                    onClick={() => handleDataExport('json')}
                    data-testid="button-export-json"
                  >
                    <Download className="w-4 h-4" />
                    <span>JSON Export</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center space-x-2"
                    onClick={() => handleDataExport('csv')}
                    data-testid="button-export-csv"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>CSV Export</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center space-x-2"
                    onClick={() => handleDataExport('api')}
                    data-testid="button-export-api"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>API Webhook</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
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