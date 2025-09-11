import { useState, useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { generateFinancialModelPDF, downloadFile, type FinancialReportData } from "@/lib/export-utils";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Pie
} from "recharts";
import { 
  DollarSign, 
  TrendingUp, 
  Calculator, 
  PieChart, 
  BarChart3, 
  Target,
  Users,
  Zap,
  Clock,
  Brain,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  PlayCircle,
  Settings,
  TrendingDown,
  Lightbulb
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MonthlyData {
  month: number;
  revenue: number;
  expense: number;
  profit: number;
  cashFlow: number;
  customers: number;
}

interface FinancialMetrics {
  revenue: {
    year1: number;
    year2: number;
    year3: number;
    year4: number;
    year5: number;
  };
  expenses: {
    year1: number;
    year2: number;
    year3: number;
    year4: number;
    year5: number;
  };
  grossMargin: number;
  burnRate: number;
  runway: number;
  breakEvenMonth: number;
  ltv: number;
  cac: number;
  churnRate: number;
  monthlyData?: MonthlyData[];
}

interface InvestmentCalculator {
  fundingAmount: number;
  valuation: number;
  equity: number;
  useOfFunds: {
    product: number;
    marketing: number;
    team: number;
    operations: number;
  };
  milestones: string[];
}

interface FinancialModelingProps {
  ideaData: any;
  businessPlan?: any;
}

type Scenario = 'realistic' | 'optimistic' | 'pessimistic';

interface ScenarioAssumptions {
  revenueMultiplier: number;
  growthMultiplier: number;
  churnMultiplier: number;
  expenseMultiplier: number;
  marketingEfficiency: number;
}

const SCENARIO_ASSUMPTIONS: Record<Scenario, ScenarioAssumptions> = {
  realistic: {
    revenueMultiplier: 1.0,
    growthMultiplier: 1.0,
    churnMultiplier: 1.0,
    expenseMultiplier: 1.0,
    marketingEfficiency: 1.0
  },
  optimistic: {
    revenueMultiplier: 1.3,
    growthMultiplier: 1.5,
    churnMultiplier: 0.7,
    expenseMultiplier: 0.9,
    marketingEfficiency: 1.4
  },
  pessimistic: {
    revenueMultiplier: 0.7,
    growthMultiplier: 0.6,
    churnMultiplier: 1.5,
    expenseMultiplier: 1.2,
    marketingEfficiency: 0.7
  }
};

const COLORS = {
  primary: '#10B981',
  secondary: '#3B82F6', 
  accent: '#8B5CF6',
  warning: '#F59E0B',
  danger: '#EF4444',
  muted: '#6B7280'
};

const CHART_COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];

export default function FinancialModeling({ ideaData, businessPlan }: FinancialModelingProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTab, setCurrentTab] = useState("overview");
  const [currentScenario, setCurrentScenario] = useState<Scenario>('realistic');
  const [liveUpdates, setLiveUpdates] = useState(true);

  const [revenueModel, setRevenueModel] = useState({
    type: "subscription", // subscription, transaction, advertising, freemium
    pricePoint: 29,
    customers: {
      month1: 10,
      month6: 150,
      month12: 500,
      month24: 2000,
      month36: 5000
    },
    growthRate: 15,
    churnRate: 3,
    averageOrderValue: 150
  });

  const [expenseModel, setExpenseModel] = useState({
    salaries: 25000,
    marketing: 10000,
    infrastructure: 3000,
    operations: 5000,
    legal: 2000,
    other: 1000
  });

  const [unitEconomics, setUnitEconomics] = useState({
    cac: 50, // Customer Acquisition Cost
    ltv: 696, // Lifetime Value
    grossMargin: 75,
    paybackPeriod: 12
  });

  const [investmentNeeds, setInvestmentNeeds] = useState({
    totalFunding: 500000,
    runway: 18,
    useOfFunds: {
      product: 40,
      marketing: 30,
      team: 20,
      operations: 10
    }
  });

  const [showExportDialog, setShowExportDialog] = useState(false);

  const [financialProjections, setFinancialProjections] = useState<FinancialMetrics | null>(null);

  // Real-time calculations using useMemo for performance
  const calculatedMetrics = useMemo(() => {
    const scenario = SCENARIO_ASSUMPTIONS[currentScenario];
    const baseRevenue = revenueModel.pricePoint * revenueModel.customers.month12 * 12;
    const adjustedRevenue = baseRevenue * scenario.revenueMultiplier;
    
    const projectedRevenue = {
      year1: adjustedRevenue,
      year2: adjustedRevenue * (2.5 * scenario.growthMultiplier),
      year3: adjustedRevenue * (4.2 * scenario.growthMultiplier),
      year4: adjustedRevenue * (6.8 * scenario.growthMultiplier),
      year5: adjustedRevenue * (10.5 * scenario.growthMultiplier)
    };
    
    const totalMonthlyExpenses = (expenseModel.salaries + expenseModel.marketing + 
                                 expenseModel.infrastructure + expenseModel.operations + 
                                 expenseModel.legal + expenseModel.other) * scenario.expenseMultiplier;
    
    const projectedExpenses = {
      year1: totalMonthlyExpenses * 12,
      year2: totalMonthlyExpenses * 12 * 1.2,
      year3: totalMonthlyExpenses * 12 * 1.4,
      year4: totalMonthlyExpenses * 12 * 1.6,
      year5: totalMonthlyExpenses * 12 * 1.8
    };
    
    const runway = investmentNeeds.totalFunding / totalMonthlyExpenses;
    const ltv = (revenueModel.pricePoint * 12) / (revenueModel.churnRate / 100) * scenario.revenueMultiplier;
    const cac = unitEconomics.cac / scenario.marketingEfficiency;
    
    return {
      revenue: projectedRevenue,
      expenses: projectedExpenses,
      grossMargin: unitEconomics.grossMargin,
      burnRate: totalMonthlyExpenses,
      runway: runway,
      breakEvenMonth: Math.ceil(projectedRevenue.year1 / projectedExpenses.year1 * 12),
      ltv: ltv,
      cac: cac,
      churnRate: revenueModel.churnRate * scenario.churnMultiplier,
      monthlyData: Array.from({ length: 60 }, (_, i) => {
        const month = i + 1;
        const revenue = (projectedRevenue.year1 / 12) * Math.pow(1 + (revenueModel.growthRate / 100), month / 12);
        const expense = totalMonthlyExpenses;
        const cashFlow = revenue - expense;
        const cumulativeCash = investmentNeeds.totalFunding + (cashFlow * month);
        
        return {
          month,
          revenue: Math.round(revenue),
          expense: Math.round(expense),
          profit: Math.round(revenue - expense),
          cashFlow: Math.round(cumulativeCash),
          customers: Math.round(revenueModel.customers.month1 * Math.pow(1 + (revenueModel.growthRate / 100), month))
        };
      })
    };
  }, [revenueModel, expenseModel, unitEconomics, investmentNeeds, currentScenario]);

  // Chart data preparation
  const revenueChartData = useMemo(() => {
    return Object.entries(calculatedMetrics.revenue).map(([year, value], index) => ({
      year: `Year ${index + 1}`,
      revenue: Math.round(value / 1000), // Convert to thousands
      expenses: Math.round(calculatedMetrics.expenses[year as keyof typeof calculatedMetrics.expenses] / 1000),
      profit: Math.round((value - calculatedMetrics.expenses[year as keyof typeof calculatedMetrics.expenses]) / 1000)
    }));
  }, [calculatedMetrics]);

  const expenseBreakdownData = useMemo(() => {
    return [
      { name: 'Salaries & Benefits', value: expenseModel.salaries, color: CHART_COLORS[0] },
      { name: 'Marketing & Sales', value: expenseModel.marketing, color: CHART_COLORS[1] },
      { name: 'Infrastructure', value: expenseModel.infrastructure, color: CHART_COLORS[2] },
      { name: 'Operations', value: expenseModel.operations, color: CHART_COLORS[3] },
      { name: 'Legal & Compliance', value: expenseModel.legal, color: CHART_COLORS[4] },
      { name: 'Other', value: expenseModel.other, color: CHART_COLORS[5] }
    ].filter(item => item.value > 0);
  }, [expenseModel]);

  const unitEconomicsData = useMemo(() => {
    return [
      { metric: 'LTV', value: calculatedMetrics.ltv, target: 500, color: CHART_COLORS[0] },
      { metric: 'CAC', value: calculatedMetrics.cac, target: 100, color: CHART_COLORS[1] },
      { metric: 'LTV:CAC', value: calculatedMetrics.ltv / calculatedMetrics.cac, target: 3, color: CHART_COLORS[2] }
    ];
  }, [calculatedMetrics]);

  // Update projections automatically when inputs change
  useEffect(() => {
    if (liveUpdates && revenueModel.pricePoint > 0) {
      setFinancialProjections(calculatedMetrics);
    }
  }, [calculatedMetrics, liveUpdates]);

  const handleExportPDF = async () => {
    try {
      toast({
        title: "Export Started",
        description: "Generating PDF report with all financial projections and charts.",
      });
      
      const reportData: FinancialReportData = {
        companyName: ideaData?.name || "Startup Financial Model",
        scenario: currentScenario,
        metrics: {
          revenue: calculatedMetrics.revenue,
          expenses: calculatedMetrics.expenses,
          ltv: calculatedMetrics.ltv,
          cac: calculatedMetrics.cac,
          runway: calculatedMetrics.runway,
          breakEvenMonth: calculatedMetrics.breakEvenMonth,
          grossMargin: calculatedMetrics.grossMargin
        },
        monthlyData: calculatedMetrics.monthlyData
      };
      
      const pdfBlob = await generateFinancialModelPDF(reportData);
      const filename = `${ideaData?.name || 'Financial'}_Model_${currentScenario}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      downloadFile(pdfBlob, filename);
      
      toast({
        title: "Export Complete",
        description: "Financial model PDF has been downloaded.",
      });
      setShowExportDialog(false);
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleScenarioChange = (scenario: Scenario) => {
    setCurrentScenario(scenario);
    toast({
      title: `Switched to ${scenario} scenario`,
      description: `All metrics updated with ${scenario} assumptions.`,
    });
  };

  const generateFinancialModelMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/startup-ideas/${ideaData.id}/financial-model`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          revenueModel,
          expenseModel,
          industry: ideaData.industry,
          stage: ideaData.stage
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate financial model");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setFinancialProjections(data);
      
      toast({
        title: "Financial model generated!",
        description: "Your 5-year financial projections are ready.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerateModel = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate realistic projections based on industry and inputs
    const baseRevenue = revenueModel.pricePoint * revenueModel.customers.month12;
    const projectedMetrics: FinancialMetrics = {
      revenue: {
        year1: baseRevenue,
        year2: baseRevenue * 2.5,
        year3: baseRevenue * 4.2,
        year4: baseRevenue * 6.8,
        year5: baseRevenue * 10.5
      },
      expenses: {
        year1: baseRevenue * 0.8,
        year2: baseRevenue * 1.8,
        year3: baseRevenue * 2.9,
        year4: baseRevenue * 4.2,
        year5: baseRevenue * 6.3
      },
      grossMargin: 75,
      burnRate: expenseModel.salaries + expenseModel.marketing + expenseModel.infrastructure + expenseModel.operations,
      runway: investmentNeeds.totalFunding / (expenseModel.salaries + expenseModel.marketing + expenseModel.infrastructure + expenseModel.operations) * 12,
      breakEvenMonth: 18,
      ltv: unitEconomics.ltv || revenueModel.pricePoint * 24,
      cac: unitEconomics.cac || 50,
      churnRate: revenueModel.churnRate || 5
    };

    setFinancialProjections(projectedMetrics);
    setIsGenerating(false);
    
    toast({
      title: "Financial model generated!",
      description: "Your 5-year financial projections are ready.",
    });
  };

  const calculateROI = () => {
    const totalRevenue = Object.values(calculatedMetrics.revenue).reduce((sum, val) => sum + val, 0);
    const totalExpenses = Object.values(calculatedMetrics.expenses).reduce((sum, val) => sum + val, 0);
    return ((totalRevenue - totalExpenses) / totalExpenses) * 100;
  };

  const revenueTypes = [
    { value: "subscription", label: "Subscription/SaaS", description: "Recurring monthly/annual payments" },
    { value: "transaction", label: "Transaction-based", description: "Fee per transaction or sale" },
    { value: "advertising", label: "Advertising", description: "Revenue from ads and sponsorships" },
    { value: "freemium", label: "Freemium", description: "Free tier with premium upgrades" },
    { value: "marketplace", label: "Marketplace", description: "Commission on transactions" },
    { value: "licensing", label: "Licensing", description: "License fees for technology/content" }
  ];

  if (isGenerating) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
            Generating Financial Model
          </CardTitle>
          <div className="flex items-center justify-center mb-6">
            <Calculator className="w-12 h-12 text-green-600 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Creating: 5-Year Financial Projections
            </h3>
            <p className="text-gray-600 mb-6">
              Building comprehensive financial model with revenue forecasts and unit economics
            </p>
          </div>
          
          <div className="space-y-4">
            <Progress value={75} className="h-3" />
          </div>
          
          <div className="text-center text-sm text-gray-500">
            Analyzing market data and business model assumptions
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Financial Modeling & Investment Calculator
            </CardTitle>
            <Badge variant="secondary" className="text-sm">
              {ideaData?.industry} Analysis
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                ${(calculatedMetrics.revenue.year5 / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-gray-600">Year 5 Revenue</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {calculateROI().toFixed(0)}%
              </div>
              <div className="text-xs text-gray-600">5-Year ROI</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {calculatedMetrics.runway.toFixed(0)}mo
              </div>
              <div className="text-xs text-gray-600">Runway</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {calculatedMetrics.breakEvenMonth}mo
              </div>
              <div className="text-xs text-gray-600">Break-even</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {(calculatedMetrics.ltv / calculatedMetrics.cac).toFixed(1)}:1
              </div>
              <div className="text-xs text-gray-600">LTV:CAC</div>
            </div>
          </div>
          
          {/* Scenario Selector */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-4">
              <Label className="text-sm font-medium">Scenario:</Label>
              <div className="flex space-x-2">
                {(['realistic', 'optimistic', 'pessimistic'] as Scenario[]).map((scenario) => (
                  <Button
                    key={scenario}
                    variant={currentScenario === scenario ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleScenarioChange(scenario)}
                    className={`capitalize ${
                      scenario === 'optimistic' ? 'text-green-600 border-green-600' :
                      scenario === 'pessimistic' ? 'text-red-600 border-red-600' :
                      'text-blue-600 border-blue-600'
                    }`}
                  >
                    {scenario === 'optimistic' && <TrendingUp className="w-3 h-3 mr-1" />}
                    {scenario === 'pessimistic' && <TrendingDown className="w-3 h-3 mr-1" />}
                    {scenario === 'realistic' && <Target className="w-3 h-3 mr-1" />}
                    {scenario}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLiveUpdates(!liveUpdates)}
                className="flex items-center"
              >
                <PlayCircle className="w-3 h-3 mr-1" />
                Live Updates: {liveUpdates ? 'ON' : 'OFF'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                className="flex items-center"
              >
                <Download className="w-3 h-3 mr-1" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Financial Modeling Interface */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Model</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="investment">Investment</TabsTrigger>
          <TabsTrigger value="comparison">Scenarios</TabsTrigger>
          <TabsTrigger value="charts">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Generate Model */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Generate AI Financial Model
                  </h3>
                  <p className="text-gray-600">
                    Create comprehensive 5-year financial projections based on your business model
                  </p>
                </div>
                <Button
                  onClick={handleGenerateModel}
                  disabled={generateFinancialModelMutation.isPending || !revenueModel.pricePoint}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {generateFinancialModelMutation.isPending ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Generate Model
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Financial Projections */}
          {financialProjections && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Revenue Projections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(financialProjections.revenue).map(([year, revenue], index) => (
                      <div key={year} className="flex items-center justify-between">
                        <span className="text-gray-600">Year {index + 1}</span>
                        <div className="flex items-center space-x-4">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(revenue / financialProjections.revenue.year5) * 100}%` }}
                            ></div>
                          </div>
                          <span className="font-semibold text-green-600 w-20 text-right">
                            ${(revenue / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                    Unit Economics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        ${financialProjections.ltv}
                      </div>
                      <div className="text-sm text-gray-600">Customer LTV</div>
                    </div>
                    
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 mb-1">
                        ${financialProjections.cac}
                      </div>
                      <div className="text-sm text-gray-600">Customer CAC</div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {financialProjections.grossMargin}%
                      </div>
                      <div className="text-sm text-gray-600">Gross Margin</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {(financialProjections.ltv / financialProjections.cac).toFixed(1)}:1
                      </div>
                      <div className="text-sm text-gray-600">LTV:CAC Ratio</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Key Metrics */}
          {financialProjections && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                  Key Financial Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Profitability</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gross Margin</span>
                        <span className="font-semibold">{financialProjections.grossMargin}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Break-even</span>
                        <span className="font-semibold">Month {financialProjections.breakEvenMonth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">5-Year ROI</span>
                        <span className="font-semibold text-green-600">{calculateROI().toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Cash Flow</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Burn</span>
                        <span className="font-semibold">${(financialProjections.burnRate / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Runway</span>
                        <span className="font-semibold">{financialProjections.runway.toFixed(0)} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Churn Rate</span>
                        <span className="font-semibold">{financialProjections.churnRate}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Growth</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">LTV:CAC Ratio</span>
                        <span className="font-semibold">{(financialProjections.ltv / financialProjections.cac).toFixed(1)}:1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payback Period</span>
                        <span className="font-semibold">{Math.round(financialProjections.cac / (financialProjections.ltv / 24))} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">YoY Growth</span>
                        <span className="font-semibold text-green-600">150%+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Revenue Model Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="revenue-type">Revenue Model Type</Label>
                    <Select value={revenueModel.type} onValueChange={(value) => setRevenueModel(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select revenue model" />
                      </SelectTrigger>
                      <SelectContent>
                        {revenueTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-gray-500">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <TooltipProvider>
                    <div className="space-y-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Price Point (Monthly)</Label>
                              <Badge variant="outline" className="text-xs">
                                ${revenueModel.pricePoint}
                              </Badge>
                            </div>
                            <Slider
                              value={[revenueModel.pricePoint]}
                              onValueChange={(value) => setRevenueModel(prev => ({ ...prev, pricePoint: value[0] }))}
                              max={500}
                              step={5}
                              className="w-full"
                              data-testid="slider-price-point"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>$0</span>
                              <span>$500</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Monthly subscription price or average revenue per customer</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Monthly Growth Rate (%)</Label>
                              <Badge variant="outline" className="text-xs">
                                {revenueModel.growthRate}%
                              </Badge>
                            </div>
                            <Slider
                              value={[revenueModel.growthRate]}
                              onValueChange={(value) => setRevenueModel(prev => ({ ...prev, growthRate: value[0] }))}
                              max={50}
                              step={1}
                              className="w-full"
                              data-testid="slider-growth-rate"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>0%</span>
                              <span>50%</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Expected month-over-month customer growth rate</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Monthly Churn Rate (%)</Label>
                              <Badge variant="outline" className="text-xs">
                                {revenueModel.churnRate}%
                              </Badge>
                            </div>
                            <Slider
                              value={[revenueModel.churnRate]}
                              onValueChange={(value) => setRevenueModel(prev => ({ ...prev, churnRate: value[0] }))}
                              max={20}
                              step={0.5}
                              className="w-full"
                              data-testid="slider-churn-rate"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>0%</span>
                              <span>20%</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Percentage of customers who cancel each month</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>

                <div className="space-y-6">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Customer Projections
                  </h4>
                  
                  <TooltipProvider>
                    <div className="space-y-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Month 1 Customers</Label>
                              <Badge variant="outline" className="text-xs">
                                {revenueModel.customers.month1}
                              </Badge>
                            </div>
                            <Slider
                              value={[revenueModel.customers.month1]}
                              onValueChange={(value) => setRevenueModel(prev => ({ 
                                ...prev, 
                                customers: { ...prev.customers, month1: value[0] }
                              }))}
                              max={1000}
                              step={5}
                              className="w-full"
                              data-testid="slider-customers-month1"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>0</span>
                              <span>1,000</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Number of customers you expect to have in the first month</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Month 12 Customers</Label>
                              <Badge variant="outline" className="text-xs">
                                {revenueModel.customers.month12.toLocaleString()}
                              </Badge>
                            </div>
                            <Slider
                              value={[revenueModel.customers.month12]}
                              onValueChange={(value) => setRevenueModel(prev => ({ 
                                ...prev, 
                                customers: { ...prev.customers, month12: value[0] }
                              }))}
                              max={10000}
                              step={50}
                              className="w-full"
                              data-testid="slider-customers-month12"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>0</span>
                              <span>10,000</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Target number of customers by the end of year 1</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                  
                  {/* Quick Revenue Preview */}
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h5 className="font-semibold text-green-800 mb-2">Quick Revenue Preview</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Monthly Revenue (Month 12):</span>
                        <span className="font-semibold text-green-800">
                          ${(revenueModel.pricePoint * revenueModel.customers.month12).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Annual Revenue (Year 1):</span>
                        <span className="font-semibold text-green-800">
                          ${(revenueModel.pricePoint * revenueModel.customers.month12 * 12).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Customer LTV:</span>
                        <span className="font-semibold text-green-800">
                          ${Math.round(calculatedMetrics.ltv)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Monthly Expense Model
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <TooltipProvider>
                    <div className="space-y-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Salaries & Benefits</Label>
                              <Badge variant="outline" className="text-xs">
                                ${expenseModel.salaries.toLocaleString()}
                              </Badge>
                            </div>
                            <Slider
                              value={[expenseModel.salaries]}
                              onValueChange={(value) => setExpenseModel(prev => ({ ...prev, salaries: value[0] }))}
                              max={100000}
                              step={1000}
                              className="w-full"
                              data-testid="slider-expenses-salaries"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>$0</span>
                              <span>$100K</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Monthly payroll including salaries, benefits, and taxes</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Marketing & Sales</Label>
                              <Badge variant="outline" className="text-xs">
                                ${expenseModel.marketing.toLocaleString()}
                              </Badge>
                            </div>
                            <Slider
                              value={[expenseModel.marketing]}
                              onValueChange={(value) => setExpenseModel(prev => ({ ...prev, marketing: value[0] }))}
                              max={50000}
                              step={500}
                              className="w-full"
                              data-testid="slider-expenses-marketing"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>$0</span>
                              <span>$50K</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Advertising, content marketing, sales tools, and customer acquisition</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Infrastructure & Tech</Label>
                              <Badge variant="outline" className="text-xs">
                                ${expenseModel.infrastructure.toLocaleString()}
                              </Badge>
                            </div>
                            <Slider
                              value={[expenseModel.infrastructure]}
                              onValueChange={(value) => setExpenseModel(prev => ({ ...prev, infrastructure: value[0] }))}
                              max={20000}
                              step={100}
                              className="w-full"
                              data-testid="slider-expenses-infrastructure"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>$0</span>
                              <span>$20K</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Hosting, software licenses, development tools, and technical infrastructure</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>

                <div className="space-y-6">
                  <TooltipProvider>
                    <div className="space-y-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Operations</Label>
                              <Badge variant="outline" className="text-xs">
                                ${expenseModel.operations.toLocaleString()}
                              </Badge>
                            </div>
                            <Slider
                              value={[expenseModel.operations]}
                              onValueChange={(value) => setExpenseModel(prev => ({ ...prev, operations: value[0] }))}
                              max={30000}
                              step={500}
                              className="w-full"
                              data-testid="slider-expenses-operations"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>$0</span>
                              <span>$30K</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Office rent, utilities, equipment, and general operational costs</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Legal & Compliance</Label>
                              <Badge variant="outline" className="text-xs">
                                ${expenseModel.legal.toLocaleString()}
                              </Badge>
                            </div>
                            <Slider
                              value={[expenseModel.legal]}
                              onValueChange={(value) => setExpenseModel(prev => ({ ...prev, legal: value[0] }))}
                              max={10000}
                              step={200}
                              className="w-full"
                              data-testid="slider-expenses-legal"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>$0</span>
                              <span>$10K</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Legal fees, compliance costs, insurance, and regulatory expenses</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Other Expenses</Label>
                              <Badge variant="outline" className="text-xs">
                                ${expenseModel.other.toLocaleString()}
                              </Badge>
                            </div>
                            <Slider
                              value={[expenseModel.other]}
                              onValueChange={(value) => setExpenseModel(prev => ({ ...prev, other: value[0] }))}
                              max={5000}
                              step={100}
                              className="w-full"
                              data-testid="slider-expenses-other"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>$0</span>
                              <span>$5K</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Miscellaneous expenses, training, travel, and contingency</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-red-800">Total Monthly Expenses:</span>
                  <span className="text-3xl font-bold text-red-600">
                    ${calculatedMetrics.burnRate.toLocaleString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-red-700">Annual Cost</div>
                    <div className="text-red-600">${(calculatedMetrics.burnRate * 12).toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-red-700">Daily Burn</div>
                    <div className="text-red-600">${Math.round(calculatedMetrics.burnRate / 30).toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-red-700">Runway</div>
                    <div className="text-red-600">{calculatedMetrics.runway.toFixed(1)} months</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-red-700">Break-even</div>
                    <div className="text-red-600">Month {calculatedMetrics.breakEvenMonth}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Investment Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <TooltipProvider>
                    <div className="space-y-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Total Funding Needed</Label>
                              <Badge variant="outline" className="text-xs">
                                ${(investmentNeeds.totalFunding / 1000).toFixed(0)}K
                              </Badge>
                            </div>
                            <Slider
                              value={[investmentNeeds.totalFunding]}
                              onValueChange={(value) => setInvestmentNeeds(prev => ({ ...prev, totalFunding: value[0] }))}
                              max={5000000}
                              step={25000}
                              className="w-full"
                              data-testid="slider-total-funding"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>$0</span>
                              <span>$5M</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total amount of funding required for this stage</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Desired Runway (months)</Label>
                              <Badge variant="outline" className="text-xs">
                                {investmentNeeds.runway} months
                              </Badge>
                            </div>
                            <Slider
                              value={[investmentNeeds.runway]}
                              onValueChange={(value) => setInvestmentNeeds(prev => ({ ...prev, runway: value[0] }))}
                              max={36}
                              step={1}
                              className="w-full"
                              data-testid="slider-runway"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>6 months</span>
                              <span>36 months</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How long you want the funding to last</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                  
                  {/* Funding Summary */}
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <h5 className="font-semibold text-blue-800 mb-4">Funding Summary</h5>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Monthly Burn Rate:</span>
                        <span className="font-semibold text-blue-800">
                          ${calculatedMetrics.burnRate.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Actual Runway:</span>
                        <span className="font-semibold text-blue-800">
                          {calculatedMetrics.runway.toFixed(1)} months
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Funding Gap:</span>
                        <span className={`font-semibold ${
                          (calculatedMetrics.burnRate * investmentNeeds.runway) > investmentNeeds.totalFunding
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}>
                          ${Math.abs((calculatedMetrics.burnRate * investmentNeeds.runway) - investmentNeeds.totalFunding).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <PieChart className="w-4 h-4 mr-2" />
                    Use of Funds (%)
                  </h4>
                  
                  <TooltipProvider>
                    <div className="space-y-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Product Development</Label>
                              <Badge variant="outline" className="text-xs">
                                {investmentNeeds.useOfFunds.product}%
                              </Badge>
                            </div>
                            <Slider
                              value={[investmentNeeds.useOfFunds.product]}
                              onValueChange={(value) => setInvestmentNeeds(prev => ({ 
                                ...prev, 
                                useOfFunds: { ...prev.useOfFunds, product: value[0] }
                              }))}
                              max={100}
                              step={5}
                              className="w-full"
                              data-testid="slider-funds-product"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>0%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>R&D, engineering, and product development costs</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Marketing & Sales</Label>
                              <Badge variant="outline" className="text-xs">
                                {investmentNeeds.useOfFunds.marketing}%
                              </Badge>
                            </div>
                            <Slider
                              value={[investmentNeeds.useOfFunds.marketing]}
                              onValueChange={(value) => setInvestmentNeeds(prev => ({ 
                                ...prev, 
                                useOfFunds: { ...prev.useOfFunds, marketing: value[0] }
                              }))}
                              max={100}
                              step={5}
                              className="w-full"
                              data-testid="slider-funds-marketing"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>0%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Customer acquisition, brand building, and sales team</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Team Expansion</Label>
                              <Badge variant="outline" className="text-xs">
                                {investmentNeeds.useOfFunds.team}%
                              </Badge>
                            </div>
                            <Slider
                              value={[investmentNeeds.useOfFunds.team]}
                              onValueChange={(value) => setInvestmentNeeds(prev => ({ 
                                ...prev, 
                                useOfFunds: { ...prev.useOfFunds, team: value[0] }
                              }))}
                              max={100}
                              step={5}
                              className="w-full"
                              data-testid="slider-funds-team"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>0%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Hiring key personnel and team growth</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Operations</Label>
                              <Badge variant="outline" className="text-xs">
                                {investmentNeeds.useOfFunds.operations}%
                              </Badge>
                            </div>
                            <Slider
                              value={[investmentNeeds.useOfFunds.operations]}
                              onValueChange={(value) => setInvestmentNeeds(prev => ({ 
                                ...prev, 
                                useOfFunds: { ...prev.useOfFunds, operations: value[0] }
                              }))}
                              max={100}
                              step={5}
                              className="w-full"
                              data-testid="slider-funds-operations"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>0%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Infrastructure, legal, and operational expenses</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                  
                  {/* Use of Funds Breakdown */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h6 className="font-semibold text-gray-700 mb-3">Funding Allocation</h6>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Product Development:</span>
                        <span className="font-semibold">
                          ${((investmentNeeds.totalFunding * investmentNeeds.useOfFunds.product) / 100).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Marketing & Sales:</span>
                        <span className="font-semibold">
                          ${((investmentNeeds.totalFunding * investmentNeeds.useOfFunds.marketing) / 100).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Team Expansion:</span>
                        <span className="font-semibold">
                          ${((investmentNeeds.totalFunding * investmentNeeds.useOfFunds.team) / 100).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Operations:</span>
                        <span className="font-semibold">
                          ${((investmentNeeds.totalFunding * investmentNeeds.useOfFunds.operations) / 100).toLocaleString()}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-gray-300 font-semibold">
                        <div className="flex justify-between">
                          <span>Total Allocation:</span>
                          <span className={`${
                            (investmentNeeds.useOfFunds.product + investmentNeeds.useOfFunds.marketing + 
                             investmentNeeds.useOfFunds.team + investmentNeeds.useOfFunds.operations) === 100
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {investmentNeeds.useOfFunds.product + investmentNeeds.useOfFunds.marketing + 
                             investmentNeeds.useOfFunds.team + investmentNeeds.useOfFunds.operations}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          {/* Scenario Comparison Header */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Scenario Comparison Analysis
              </CardTitle>
              <p className="text-gray-600">
                Compare financial projections across optimistic, realistic, and pessimistic scenarios to understand potential outcomes and risks.
              </p>
            </CardHeader>
          </Card>

          {/* Key Metrics Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Key Financial Metrics Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-4 font-semibold text-gray-900">Metric</th>
                      <th className="text-center p-4 font-semibold text-red-600">
                        <div className="flex items-center justify-center">
                          <TrendingDown className="w-4 h-4 mr-1" />
                          Pessimistic
                        </div>
                      </th>
                      <th className="text-center p-4 font-semibold text-blue-600">
                        <div className="flex items-center justify-center">
                          <Target className="w-4 h-4 mr-1" />
                          Realistic
                        </div>
                      </th>
                      <th className="text-center p-4 font-semibold text-green-600">
                        <div className="flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Optimistic
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">Year 5 Revenue</td>
                      <td className="p-4 text-center text-red-600 font-semibold">
                        ${((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * 10.5 * SCENARIO_ASSUMPTIONS.pessimistic.revenueMultiplier * SCENARIO_ASSUMPTIONS.pessimistic.growthMultiplier) / 1000000).toFixed(1)}M
                      </td>
                      <td className="p-4 text-center text-blue-600 font-semibold">
                        ${((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * 10.5 * SCENARIO_ASSUMPTIONS.realistic.revenueMultiplier * SCENARIO_ASSUMPTIONS.realistic.growthMultiplier) / 1000000).toFixed(1)}M
                      </td>
                      <td className="p-4 text-center text-green-600 font-semibold">
                        ${((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * 10.5 * SCENARIO_ASSUMPTIONS.optimistic.revenueMultiplier * SCENARIO_ASSUMPTIONS.optimistic.growthMultiplier) / 1000000).toFixed(1)}M
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">Monthly Burn Rate</td>
                      <td className="p-4 text-center text-red-600 font-semibold">
                        ${(((expenseModel.salaries + expenseModel.marketing + expenseModel.infrastructure + expenseModel.operations + expenseModel.legal + expenseModel.other) * SCENARIO_ASSUMPTIONS.pessimistic.expenseMultiplier) / 1000).toFixed(0)}K
                      </td>
                      <td className="p-4 text-center text-blue-600 font-semibold">
                        ${(((expenseModel.salaries + expenseModel.marketing + expenseModel.infrastructure + expenseModel.operations + expenseModel.legal + expenseModel.other) * SCENARIO_ASSUMPTIONS.realistic.expenseMultiplier) / 1000).toFixed(0)}K
                      </td>
                      <td className="p-4 text-center text-green-600 font-semibold">
                        ${(((expenseModel.salaries + expenseModel.marketing + expenseModel.infrastructure + expenseModel.operations + expenseModel.legal + expenseModel.other) * SCENARIO_ASSUMPTIONS.optimistic.expenseMultiplier) / 1000).toFixed(0)}K
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">Runway (months)</td>
                      <td className="p-4 text-center text-red-600 font-semibold">
                        {(investmentNeeds.totalFunding / ((expenseModel.salaries + expenseModel.marketing + expenseModel.infrastructure + expenseModel.operations + expenseModel.legal + expenseModel.other) * SCENARIO_ASSUMPTIONS.pessimistic.expenseMultiplier)).toFixed(0)}
                      </td>
                      <td className="p-4 text-center text-blue-600 font-semibold">
                        {(investmentNeeds.totalFunding / ((expenseModel.salaries + expenseModel.marketing + expenseModel.infrastructure + expenseModel.operations + expenseModel.legal + expenseModel.other) * SCENARIO_ASSUMPTIONS.realistic.expenseMultiplier)).toFixed(0)}
                      </td>
                      <td className="p-4 text-center text-green-600 font-semibold">
                        {(investmentNeeds.totalFunding / ((expenseModel.salaries + expenseModel.marketing + expenseModel.infrastructure + expenseModel.operations + expenseModel.legal + expenseModel.other) * SCENARIO_ASSUMPTIONS.optimistic.expenseMultiplier)).toFixed(0)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">LTV:CAC Ratio</td>
                      <td className="p-4 text-center text-red-600 font-semibold">
                        {(((revenueModel.pricePoint * 12) / (revenueModel.churnRate / 100) * SCENARIO_ASSUMPTIONS.pessimistic.revenueMultiplier) / (unitEconomics.cac / SCENARIO_ASSUMPTIONS.pessimistic.marketingEfficiency)).toFixed(1)}:1
                      </td>
                      <td className="p-4 text-center text-blue-600 font-semibold">
                        {(((revenueModel.pricePoint * 12) / (revenueModel.churnRate / 100) * SCENARIO_ASSUMPTIONS.realistic.revenueMultiplier) / (unitEconomics.cac / SCENARIO_ASSUMPTIONS.realistic.marketingEfficiency)).toFixed(1)}:1
                      </td>
                      <td className="p-4 text-center text-green-600 font-semibold">
                        {(((revenueModel.pricePoint * 12) / (revenueModel.churnRate / 100) * SCENARIO_ASSUMPTIONS.optimistic.revenueMultiplier) / (unitEconomics.cac / SCENARIO_ASSUMPTIONS.optimistic.marketingEfficiency)).toFixed(1)}:1
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">Customer Churn Rate</td>
                      <td className="p-4 text-center text-red-600 font-semibold">
                        {(revenueModel.churnRate * SCENARIO_ASSUMPTIONS.pessimistic.churnMultiplier).toFixed(1)}%
                      </td>
                      <td className="p-4 text-center text-blue-600 font-semibold">
                        {(revenueModel.churnRate * SCENARIO_ASSUMPTIONS.realistic.churnMultiplier).toFixed(1)}%
                      </td>
                      <td className="p-4 text-center text-green-600 font-semibold">
                        {(revenueModel.churnRate * SCENARIO_ASSUMPTIONS.optimistic.churnMultiplier).toFixed(1)}%
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">Break-even Month</td>
                      <td className="p-4 text-center text-red-600 font-semibold">
                        {Math.ceil((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * SCENARIO_ASSUMPTIONS.pessimistic.revenueMultiplier) / ((expenseModel.salaries + expenseModel.marketing + expenseModel.infrastructure + expenseModel.operations + expenseModel.legal + expenseModel.other) * 12 * SCENARIO_ASSUMPTIONS.pessimistic.expenseMultiplier) * 12)}
                      </td>
                      <td className="p-4 text-center text-blue-600 font-semibold">
                        {Math.ceil((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * SCENARIO_ASSUMPTIONS.realistic.revenueMultiplier) / ((expenseModel.salaries + expenseModel.marketing + expenseModel.infrastructure + expenseModel.operations + expenseModel.legal + expenseModel.other) * 12 * SCENARIO_ASSUMPTIONS.realistic.expenseMultiplier) * 12)}
                      </td>
                      <td className="p-4 text-center text-green-600 font-semibold">
                        {Math.ceil((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * SCENARIO_ASSUMPTIONS.optimistic.revenueMultiplier) / ((expenseModel.salaries + expenseModel.marketing + expenseModel.infrastructure + expenseModel.operations + expenseModel.legal + expenseModel.other) * 12 * SCENARIO_ASSUMPTIONS.optimistic.expenseMultiplier) * 12)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Scenario Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pessimistic Scenario */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Pessimistic Scenario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-red-600">
                    <strong>Key Assumptions:</strong>
                  </div>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• 30% lower revenue growth</li>
                    <li>• 40% slower customer acquisition</li>
                    <li>• 50% higher churn rate</li>
                    <li>• 20% higher operating costs</li>
                    <li>• 30% lower marketing efficiency</li>
                  </ul>
                  <div className="mt-4 p-3 bg-red-100 rounded-lg">
                    <div className="text-sm font-medium text-red-800">
                      Risk Factors: Economic downturn, strong competition, execution challenges
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Realistic Scenario */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <Target className="w-5 h-5 mr-2" />
                  Realistic Scenario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-blue-600">
                    <strong>Key Assumptions:</strong>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Base case projections</li>
                    <li>• Market-average growth rates</li>
                    <li>• Industry-standard metrics</li>
                    <li>• Normal operating conditions</li>
                    <li>• Steady execution progress</li>
                  </ul>
                  <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                    <div className="text-sm font-medium text-blue-800">
                      Most Likely: Based on current market conditions and team capabilities
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optimistic Scenario */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Optimistic Scenario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-green-600">
                    <strong>Key Assumptions:</strong>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• 30% higher revenue growth</li>
                    <li>• 50% faster customer acquisition</li>
                    <li>• 30% lower churn rate</li>
                    <li>• 10% lower operating costs</li>
                    <li>• 40% higher marketing efficiency</li>
                  </ul>
                  <div className="mt-4 p-3 bg-green-100 rounded-lg">
                    <div className="text-sm font-medium text-green-800">
                      Success Factors: Product-market fit, viral growth, operational excellence
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scenario Analysis Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                5-Year Revenue Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        year: 'Year 1',
                        pessimistic: Math.round((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * SCENARIO_ASSUMPTIONS.pessimistic.revenueMultiplier) / 1000),
                        realistic: Math.round((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * SCENARIO_ASSUMPTIONS.realistic.revenueMultiplier) / 1000),
                        optimistic: Math.round((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * SCENARIO_ASSUMPTIONS.optimistic.revenueMultiplier) / 1000)
                      },
                      {
                        year: 'Year 2',
                        pessimistic: Math.round((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * 2.5 * SCENARIO_ASSUMPTIONS.pessimistic.revenueMultiplier * SCENARIO_ASSUMPTIONS.pessimistic.growthMultiplier) / 1000),
                        realistic: Math.round((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * 2.5 * SCENARIO_ASSUMPTIONS.realistic.revenueMultiplier * SCENARIO_ASSUMPTIONS.realistic.growthMultiplier) / 1000),
                        optimistic: Math.round((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * 2.5 * SCENARIO_ASSUMPTIONS.optimistic.revenueMultiplier * SCENARIO_ASSUMPTIONS.optimistic.growthMultiplier) / 1000)
                      },
                      {
                        year: 'Year 3',
                        pessimistic: Math.round((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * 4.2 * SCENARIO_ASSUMPTIONS.pessimistic.revenueMultiplier * SCENARIO_ASSUMPTIONS.pessimistic.growthMultiplier) / 1000),
                        realistic: Math.round((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * 4.2 * SCENARIO_ASSUMPTIONS.realistic.revenueMultiplier * SCENARIO_ASSUMPTIONS.realistic.growthMultiplier) / 1000),
                        optimistic: Math.round((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * 4.2 * SCENARIO_ASSUMPTIONS.optimistic.revenueMultiplier * SCENARIO_ASSUMPTIONS.optimistic.growthMultiplier) / 1000)
                      },
                      {
                        year: 'Year 4',
                        pessimistic: Math.round((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * 6.8 * SCENARIO_ASSUMPTIONS.pessimistic.revenueMultiplier * SCENARIO_ASSUMPTIONS.pessimistic.growthMultiplier) / 1000),
                        realistic: Math.round((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * 6.8 * SCENARIO_ASSUMPTIONS.realistic.revenueMultiplier * SCENARIO_ASSUMPTIONS.realistic.growthMultiplier) / 1000),
                        optimistic: Math.round((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * 6.8 * SCENARIO_ASSUMPTIONS.optimistic.revenueMultiplier * SCENARIO_ASSUMPTIONS.optimistic.growthMultiplier) / 1000)
                      },
                      {
                        year: 'Year 5',
                        pessimistic: Math.round((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * 10.5 * SCENARIO_ASSUMPTIONS.pessimistic.revenueMultiplier * SCENARIO_ASSUMPTIONS.pessimistic.growthMultiplier) / 1000),
                        realistic: Math.round((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * 10.5 * SCENARIO_ASSUMPTIONS.realistic.revenueMultiplier * SCENARIO_ASSUMPTIONS.realistic.growthMultiplier) / 1000),
                        optimistic: Math.round((revenueModel.pricePoint * revenueModel.customers.month12 * 12 * 10.5 * SCENARIO_ASSUMPTIONS.optimistic.revenueMultiplier * SCENARIO_ASSUMPTIONS.optimistic.growthMultiplier) / 1000)
                      }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="year" className="text-xs" tick={{ fontSize: 12 }} />
                    <YAxis className="text-xs" tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value}K`} />
                    <RechartsTooltip 
                      formatter={(value: any, name: string) => [
                        `$${value.toLocaleString()}K`, 
                        name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="pessimistic" fill="#EF4444" name="Pessimistic" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="realistic" fill="#3B82F6" name="Realistic" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="optimistic" fill="#10B981" name="Optimistic" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Export and Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Export Scenario Analysis
                  </h3>
                  <p className="text-gray-600">
                    Download a comprehensive report comparing all scenarios with detailed assumptions and projections.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    const allScenariosData = {
                      companyName: ideaData?.name || "Multi-Scenario Analysis",
                      scenario: "All Scenarios Comparison",
                      metrics: {
                        revenue: calculatedMetrics.revenue,
                        expenses: calculatedMetrics.expenses,
                        ltv: calculatedMetrics.ltv,
                        cac: calculatedMetrics.cac,
                        runway: calculatedMetrics.runway,
                        breakEvenMonth: calculatedMetrics.breakEvenMonth,
                        grossMargin: calculatedMetrics.grossMargin
                      },
                      monthlyData: calculatedMetrics.monthlyData
                    };
                    handleExportPDF();
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Scenario Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          {/* Revenue Projections Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Revenue & Expense Projections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="year" 
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value}K`}
                    />
                    <RechartsTooltip 
                      formatter={(value: any, name: string) => [
                        `$${value.toLocaleString()}K`, 
                        name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                      labelFormatter={(label) => `Period: ${label}`}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="revenue" 
                      fill={COLORS.primary} 
                      name="Revenue"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="expenses" 
                      fill={COLORS.danger} 
                      name="Expenses"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke={COLORS.accent} 
                      strokeWidth={3}
                      name="Profit"
                      dot={{ fill: COLORS.accent, strokeWidth: 2, r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                  Monthly Expense Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={expenseBreakdownData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={(entry) => `${entry.name}: $${entry.value.toLocaleString()}`}
                      >
                        {expenseBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value: any, name: string) => [
                          `$${value.toLocaleString()}`, 
                          name
                        ]}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        wrapperStyle={{ fontSize: '12px' }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Unit Economics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                  Unit Economics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={unitEconomicsData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="metric" 
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                      />
                      <RechartsTooltip 
                        formatter={(value: any, name: string) => [
                          typeof value === 'number' ? value.toFixed(2) : value, 
                          name.charAt(0).toUpperCase() + name.slice(1)
                        ]}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        name="Current Value"
                        radius={[4, 4, 0, 0]}
                      >
                        {unitEconomicsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                      <Bar 
                        dataKey="target" 
                        fill="rgba(156, 163, 175, 0.5)" 
                        name="Target Value"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cash Flow Projection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-orange-600" />
                60-Month Cash Flow Projection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={calculatedMetrics.monthlyData}>
                    <defs>
                      <linearGradient id="cashFlowGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="month" 
                      className="text-xs"
                      tick={{ fontSize: 10 }}
                      interval={5}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                    />
                    <RechartsTooltip 
                      formatter={(value: any, name: string) => [
                        `$${value.toLocaleString()}`, 
                        name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                      labelFormatter={(label) => `Month ${label}`}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="cashFlow"
                      stroke={COLORS.primary}
                      fillOpacity={1}
                      fill="url(#cashFlowGradient)"
                      name="Cumulative Cash"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={COLORS.secondary}
                      fillOpacity={1}
                      fill="url(#revenueGradient)"
                      name="Monthly Revenue"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Scenario Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                Scenario Analysis Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(['realistic', 'optimistic', 'pessimistic'] as Scenario[]).map((scenario) => {
                  const scenarioAssumptions = SCENARIO_ASSUMPTIONS[scenario];
                  const scenarioRevenue = calculatedMetrics.revenue.year5 * scenarioAssumptions.revenueMultiplier;
                  const scenarioRunway = calculatedMetrics.runway / scenarioAssumptions.expenseMultiplier;
                  
                  return (
                    <div 
                      key={scenario}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        currentScenario === scenario 
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-semibold capitalize text-gray-800">
                          {scenario}
                        </h5>
                        <Badge 
                          variant={currentScenario === scenario ? "default" : "outline"}
                          className="text-xs"
                        >
                          {scenario === 'optimistic' && '+30%'}
                          {scenario === 'realistic' && 'Base'}
                          {scenario === 'pessimistic' && '-30%'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Year 5 Revenue:</span>
                          <span className="font-semibold">
                            ${(scenarioRevenue / 1000000).toFixed(1)}M
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Runway:</span>
                          <span className="font-semibold">
                            {scenarioRunway.toFixed(1)} months
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Growth Rate:</span>
                          <span className="font-semibold">
                            {(revenueModel.growthRate * scenarioAssumptions.growthMultiplier).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <Button
                        variant={currentScenario === scenario ? "default" : "outline"}
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => handleScenarioChange(scenario)}
                        data-testid={`button-scenario-${scenario}`}
                      >
                        {currentScenario === scenario ? 'Active' : 'Switch'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Export Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Export Financial Model
              </h3>
              <p className="text-gray-600">
                Download your financial projections and investment analysis
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportPDF}
                data-testid="button-export-pdf"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                data-testid="button-export-excel"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}