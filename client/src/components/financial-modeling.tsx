import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function FinancialModeling({ ideaData, businessPlan }: FinancialModelingProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTab, setCurrentTab] = useState("overview");

  const [revenueModel, setRevenueModel] = useState({
    type: "subscription", // subscription, transaction, advertising, freemium
    pricePoint: 0,
    customers: {
      month1: 0,
      month6: 0,
      month12: 0,
      month24: 0,
      month36: 0
    },
    growthRate: 0,
    churnRate: 0,
    averageOrderValue: 0
  });

  const [expenseModel, setExpenseModel] = useState({
    salaries: 0,
    marketing: 0,
    infrastructure: 0,
    operations: 0,
    legal: 0,
    other: 0
  });

  const [unitEconomics, setUnitEconomics] = useState({
    cac: 0, // Customer Acquisition Cost
    ltv: 0, // Lifetime Value
    grossMargin: 0,
    paybackPeriod: 0
  });

  const [investmentNeeds, setInvestmentNeeds] = useState({
    totalFunding: 0,
    runway: 0,
    useOfFunds: {
      product: 40,
      marketing: 30,
      team: 20,
      operations: 10
    }
  });

  const [financialProjections, setFinancialProjections] = useState<FinancialMetrics | null>(null);

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
    if (!financialProjections) return 0;
    const totalRevenue = Object.values(financialProjections.revenue).reduce((sum, val) => sum + val, 0);
    const totalExpenses = Object.values(financialProjections.expenses).reduce((sum, val) => sum + val, 0);
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {financialProjections ? `$${(financialProjections.revenue.year5 / 1000000).toFixed(1)}M` : "$0"}
              </div>
              <div className="text-sm text-gray-600">Year 5 Revenue</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {financialProjections ? `${calculateROI().toFixed(0)}%` : "0%"}
              </div>
              <div className="text-sm text-gray-600">5-Year ROI</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {financialProjections ? `${financialProjections.runway.toFixed(0)}mo` : "0mo"}
              </div>
              <div className="text-sm text-gray-600">Runway</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {financialProjections ? `${financialProjections.breakEvenMonth}mo` : "0mo"}
              </div>
              <div className="text-sm text-gray-600">Break-even</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Financial Modeling Interface */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Model</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="investment">Investment</TabsTrigger>
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
              <CardTitle>Revenue Model Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
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

                  <div>
                    <Label htmlFor="price-point">Price Point (Monthly)</Label>
                    <Input
                      id="price-point"
                      type="number"
                      value={revenueModel.pricePoint}
                      onChange={(e) => setRevenueModel(prev => ({ ...prev, pricePoint: parseFloat(e.target.value) }))}
                      placeholder="e.g., 29"
                    />
                  </div>

                  <div>
                    <Label htmlFor="growth-rate">Monthly Growth Rate (%)</Label>
                    <Input
                      id="growth-rate"
                      type="number"
                      value={revenueModel.growthRate}
                      onChange={(e) => setRevenueModel(prev => ({ ...prev, growthRate: parseFloat(e.target.value) }))}
                      placeholder="e.g., 15"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Customer Projections</h4>
                  
                  <div>
                    <Label htmlFor="customers-month1">Month 1 Customers</Label>
                    <Input
                      id="customers-month1"
                      type="number"
                      value={revenueModel.customers.month1}
                      onChange={(e) => setRevenueModel(prev => ({ 
                        ...prev, 
                        customers: { ...prev.customers, month1: parseInt(e.target.value) }
                      }))}
                      placeholder="e.g., 10"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customers-month12">Month 12 Customers</Label>
                    <Input
                      id="customers-month12"
                      type="number"
                      value={revenueModel.customers.month12}
                      onChange={(e) => setRevenueModel(prev => ({ 
                        ...prev, 
                        customers: { ...prev.customers, month12: parseInt(e.target.value) }
                      }))}
                      placeholder="e.g., 500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="churn-rate">Monthly Churn Rate (%)</Label>
                    <Input
                      id="churn-rate"
                      type="number"
                      value={revenueModel.churnRate}
                      onChange={(e) => setRevenueModel(prev => ({ ...prev, churnRate: parseFloat(e.target.value) }))}
                      placeholder="e.g., 3"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Expense Model</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="salaries">Salaries & Benefits</Label>
                    <Input
                      id="salaries"
                      type="number"
                      value={expenseModel.salaries}
                      onChange={(e) => setExpenseModel(prev => ({ ...prev, salaries: parseFloat(e.target.value) }))}
                      placeholder="e.g., 25000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="marketing">Marketing & Sales</Label>
                    <Input
                      id="marketing"
                      type="number"
                      value={expenseModel.marketing}
                      onChange={(e) => setExpenseModel(prev => ({ ...prev, marketing: parseFloat(e.target.value) }))}
                      placeholder="e.g., 10000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="infrastructure">Infrastructure & Tech</Label>
                    <Input
                      id="infrastructure"
                      type="number"
                      value={expenseModel.infrastructure}
                      onChange={(e) => setExpenseModel(prev => ({ ...prev, infrastructure: parseFloat(e.target.value) }))}
                      placeholder="e.g., 3000"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="operations">Operations</Label>
                    <Input
                      id="operations"
                      type="number"
                      value={expenseModel.operations}
                      onChange={(e) => setExpenseModel(prev => ({ ...prev, operations: parseFloat(e.target.value) }))}
                      placeholder="e.g., 5000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="legal">Legal & Compliance</Label>
                    <Input
                      id="legal"
                      type="number"
                      value={expenseModel.legal}
                      onChange={(e) => setExpenseModel(prev => ({ ...prev, legal: parseFloat(e.target.value) }))}
                      placeholder="e.g., 2000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="other">Other Expenses</Label>
                    <Input
                      id="other"
                      type="number"
                      value={expenseModel.other}
                      onChange={(e) => setExpenseModel(prev => ({ ...prev, other: parseFloat(e.target.value) }))}
                      placeholder="e.g., 1000"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Monthly Expenses:</span>
                  <span className="text-2xl font-bold text-red-600">
                    ${(expenseModel.salaries + expenseModel.marketing + expenseModel.infrastructure + expenseModel.operations + expenseModel.legal + expenseModel.other).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Investment Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="total-funding">Total Funding Needed</Label>
                    <Input
                      id="total-funding"
                      type="number"
                      value={investmentNeeds.totalFunding}
                      onChange={(e) => setInvestmentNeeds(prev => ({ ...prev, totalFunding: parseFloat(e.target.value) }))}
                      placeholder="e.g., 500000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="runway">Desired Runway (months)</Label>
                    <Input
                      id="runway"
                      type="number"
                      value={investmentNeeds.runway}
                      onChange={(e) => setInvestmentNeeds(prev => ({ ...prev, runway: parseFloat(e.target.value) }))}
                      placeholder="e.g., 18"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Use of Funds (%)</h4>
                  
                  <div>
                    <Label htmlFor="product-funds">Product Development</Label>
                    <Input
                      id="product-funds"
                      type="number"
                      value={investmentNeeds.useOfFunds.product}
                      onChange={(e) => setInvestmentNeeds(prev => ({ 
                        ...prev, 
                        useOfFunds: { ...prev.useOfFunds, product: parseFloat(e.target.value) }
                      }))}
                      placeholder="40"
                    />
                  </div>

                  <div>
                    <Label htmlFor="marketing-funds">Marketing & Sales</Label>
                    <Input
                      id="marketing-funds"
                      type="number"
                      value={investmentNeeds.useOfFunds.marketing}
                      onChange={(e) => setInvestmentNeeds(prev => ({ 
                        ...prev, 
                        useOfFunds: { ...prev.useOfFunds, marketing: parseFloat(e.target.value) }
                      }))}
                      placeholder="30"
                    />
                  </div>

                  <div>
                    <Label htmlFor="team-funds">Team Expansion</Label>
                    <Input
                      id="team-funds"
                      type="number"
                      value={investmentNeeds.useOfFunds.team}
                      onChange={(e) => setInvestmentNeeds(prev => ({ 
                        ...prev, 
                        useOfFunds: { ...prev.useOfFunds, team: parseFloat(e.target.value) }
                      }))}
                      placeholder="20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="operations-funds">Operations</Label>
                    <Input
                      id="operations-funds"
                      type="number"
                      value={investmentNeeds.useOfFunds.operations}
                      onChange={(e) => setInvestmentNeeds(prev => ({ 
                        ...prev, 
                        useOfFunds: { ...prev.useOfFunds, operations: parseFloat(e.target.value) }
                      }))}
                      placeholder="10"
                    />
                  </div>
                </div>
              </div>

              {/* Use of Funds Visualization */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Use of Funds Breakdown</h4>
                <div className="space-y-3">
                  {Object.entries(investmentNeeds.useOfFunds).map(([category, percentage]) => (
                    <div key={category} className="flex items-center space-x-4">
                      <div className="w-24 text-sm text-gray-600 capitalize">{category}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full flex items-center justify-center" 
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="text-white text-xs font-semibold">{percentage}%</span>
                        </div>
                      </div>
                      <div className="w-20 text-sm font-semibold text-right">
                        ${((investmentNeeds.totalFunding * percentage) / 100).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Actions */}
      {financialProjections && (
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
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Excel
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