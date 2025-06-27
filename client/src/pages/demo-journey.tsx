import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  FileText, 
  Presentation, 
  BarChart3, 
  Target, 
  Users,
  CheckCircle,
  Download,
  Play,
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { Link } from "wouter";

interface DemoStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  duration: number;
  color: string;
  content: any;
}

export default function DemoJourney() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const demoSteps: DemoStep[] = [
    {
      id: "idea",
      title: "Submit Your Idea",
      description: "Tell us about your startup concept",
      icon: Brain,
      duration: 30,
      color: "from-purple-500 to-pink-500",
      content: {
        title: "AI-Powered Fitness Coach",
        description: "A mobile app that uses artificial intelligence to create personalized workout plans and nutrition guidance based on user goals, fitness level, and available equipment.",
        industry: "Health & Fitness",
        targetMarket: "Fitness enthusiasts aged 25-45",
        problemStatement: "Generic fitness apps don't provide personalized guidance, leading to poor results and high abandonment rates.",
        solutionApproach: "AI-driven personalized coaching that adapts to user progress and preferences in real-time."
      }
    },
    {
      id: "analysis",
      title: "AI Analysis",
      description: "Comprehensive startup validation",
      icon: Target,
      duration: 45,
      color: "from-blue-500 to-cyan-500",
      content: {
        score: 8.5,
        strengths: [
          "Large and growing market ($96B global fitness market)",
          "AI personalization addresses real user pain points",
          "Strong potential for recurring revenue model",
          "Low initial technical barriers to entry"
        ],
        opportunities: [
          "Partner with fitness equipment manufacturers",
          "Corporate wellness programs integration",
          "Expansion into nutrition and mental health"
        ],
        risks: [
          "High competition from established fitness apps",
          "User retention challenges in fitness industry",
          "Need for significant user data to train AI effectively"
        ],
        marketSize: "$96B global fitness market, $4.5B fitness app segment",
        feasibilityScore: 8.2
      }
    },
    {
      id: "business-plan",
      title: "Business Plan",
      description: "12-section comprehensive plan",
      icon: FileText,
      duration: 60,
      color: "from-cyan-500 to-blue-500",
      content: {
        sections: [
          { name: "Executive Summary", status: "completed", preview: "AI-Powered Fitness Coach revolutionizes personal fitness through intelligent, adaptive coaching..." },
          { name: "Problem Statement", status: "completed", preview: "78% of fitness app users abandon their apps within 6 months due to lack of personalization..." },
          { name: "Solution Overview", status: "completed", preview: "Our AI-driven platform creates dynamic, personalized workout and nutrition plans..." },
          { name: "Market Analysis", status: "completed", preview: "The global fitness market is valued at $96B and growing at 7.8% CAGR..." },
          { name: "Business Model", status: "completed", preview: "Freemium subscription model with premium AI coaching features..." },
          { name: "Marketing Strategy", status: "completed", preview: "Multi-channel approach targeting fitness communities and health influencers..." }
        ],
        wordCount: 8450,
        pageCount: 28
      }
    },
    {
      id: "pitch-deck",
      title: "Pitch Deck",
      description: "Investor presentation slides",
      icon: Presentation,
      duration: 45,
      color: "from-green-500 to-emerald-500",
      content: {
        slides: [
          { title: "Problem", content: "78% of fitness apps fail to retain users beyond 6 months", notes: "Start with the pain point that resonates with everyone" },
          { title: "Solution", content: "AI-powered personalized fitness coaching that adapts to user progress", notes: "Highlight the unique AI personalization aspect" },
          { title: "Market Opportunity", content: "$96B global fitness market, $4.5B app segment growing 14% annually", notes: "Show the massive market potential" },
          { title: "Business Model", content: "Freemium with premium AI coaching at $19.99/month", notes: "Clear monetization strategy with attractive unit economics" },
          { title: "Traction", content: "Beta testing with 500 users showing 85% retention rate", notes: "Early validation and strong product-market fit indicators" },
          { title: "Funding Ask", content: "$2M Series A for AI development and user acquisition", notes: "Specific ask with clear use of funds" }
        ],
        designTheme: "Modern fitness-focused with data visualizations"
      }
    },
    {
      id: "financial",
      title: "Financial Model",
      description: "5-year projections and metrics",
      icon: BarChart3,
      duration: 40,
      color: "from-orange-500 to-red-500",
      content: {
        revenue: {
          year1: 120000,
          year2: 850000,
          year3: 2400000,
          year5: 8200000
        },
        users: {
          year1: 5000,
          year2: 25000,
          year3: 60000,
          year5: 150000
        },
        metrics: {
          cac: 25,
          ltv: 180,
          churnRate: 15,
          grossMargin: 85
        },
        fundingNeeds: 2000000,
        runway: 18
      }
    },
    {
      id: "complete",
      title: "Investor Package",
      description: "Download complete materials",
      icon: Download,
      duration: 10,
      color: "from-purple-500 to-blue-500",
      content: {
        documents: [
          "Business Plan (28 pages)",
          "Investor Pitch Deck (12 slides)",
          "Financial Model (Excel)",
          "Market Research Report",
          "Executive Summary (2 pages)"
        ],
        totalValue: "$12,500 consultant equivalent"
      }
    }
  ];

  const simulateGeneration = async (stepIndex: number) => {
    setIsGenerating(true);
    setProgress(0);
    
    const step = demoSteps[stepIndex];
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setCompletedSteps(prev => [...prev, step.id]);
          return 100;
        }
        return prev + (100 / (step.duration / 2));
      });
    }, 100);
  };

  const currentStepData = demoSteps[currentStep];
  const isStepCompleted = completedSteps.includes(currentStepData?.id);

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(0);
    }
  };

  const startGeneration = () => {
    if (!isGenerating && !isStepCompleted) {
      simulateGeneration(currentStep);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">
                MyStartup.ai Demo
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-purple-500 text-purple-600">
                <Clock className="w-4 h-4 mr-1" />
                ~5 minutes
              </Badge>
              <Link href="/">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  Exit Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Complete Startup Journey Demo</h1>
            <div className="text-right">
              <div className="text-gray-900 font-semibold">Step {currentStep + 1} of {demoSteps.length}</div>
              <div className="text-gray-600 text-sm">{Math.round((currentStep / (demoSteps.length - 1)) * 100)}% Complete</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / (demoSteps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-8">
          {demoSteps.map((step, index) => (
            <div 
              key={step.id}
              className={`relative p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                index === currentStep 
                  ? 'border-purple-500 bg-purple-50' 
                  : completedSteps.includes(step.id)
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  completedSteps.includes(step.id) 
                    ? 'bg-green-500' 
                    : index === currentStep 
                    ? `bg-gradient-to-r ${step.color}` 
                    : 'bg-gray-200'
                }`}>
                  {completedSteps.includes(step.id) ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <step.icon className={`w-4 h-4 ${index === currentStep ? 'text-white' : 'text-gray-600'}`} />
                  )}
                </div>
                <div className="hidden md:block">
                  <div className={`text-xs font-semibold ${
                    index === currentStep ? 'text-purple-700' : 
                    completedSteps.includes(step.id) ? 'text-green-700' : 'text-gray-700'
                  }`}>{step.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current Step Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Step Info & Controls */}
          <div>
            <Card className="bg-white border border-gray-200 shadow-xl">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${currentStepData.color} rounded-2xl flex items-center justify-center`}>
                    <currentStepData.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-900">{currentStepData.title}</CardTitle>
                    <p className="text-gray-600">{currentStepData.description}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Generation Progress */}
                {isGenerating && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-medium">Generating...</span>
                      <span className="text-purple-600">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!isStepCompleted && !isGenerating && (
                    <Button 
                      onClick={startGeneration}
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Generate {currentStepData.title}
                    </Button>
                  )}
                  
                  {isStepCompleted && currentStep < demoSteps.length - 1 && (
                    <Button 
                      onClick={nextStep}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}

                  {currentStep === demoSteps.length - 1 && isStepCompleted && (
                    <Link href="/waitlist">
                      <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Join Waitlist
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Time Estimate */}
                <div className="flex items-center space-x-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Estimated time: {currentStepData.duration} seconds</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Generated Content Preview */}
          <div>
            <Card className="bg-white border border-gray-200 shadow-xl h-full">
              <CardHeader>
                <CardTitle className="text-gray-900">Live Preview</CardTitle>
              </CardHeader>
              
              <CardContent>
                {/* Content based on current step */}
                {currentStepData.id === "idea" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-gray-900 font-semibold mb-2">Startup Concept</h3>
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <h4 className="text-purple-600 font-medium">{currentStepData.content.title}</h4>
                        <p className="text-gray-700 text-sm mt-2">{currentStepData.content.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge variant="outline" className="border-purple-500 text-purple-600">
                            {currentStepData.content.industry}
                          </Badge>
                          <Badge variant="outline" className="border-blue-500 text-blue-600">
                            {currentStepData.content.targetMarket}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStepData.id === "analysis" && isStepCompleted && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {currentStepData.content.score}/10
                      </div>
                      <div className="text-gray-600">Viability Score</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-gray-900 font-medium mb-2 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                          Key Strengths
                        </h4>
                        <ul className="space-y-1">
                          {currentStepData.content.strengths.slice(0, 2).map((strength: string, i: number) => (
                            <li key={i} className="text-gray-700 text-sm flex items-start">
                              <CheckCircle className="w-3 h-3 text-green-600 mr-2 mt-1 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-gray-900 font-medium mb-2">Market Size</h4>
                        <p className="text-purple-600 text-sm">{currentStepData.content.marketSize}</p>
                      </div>
                    </div>
                  </div>
                )}

                {currentStepData.id === "business-plan" && isStepCompleted && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-gray-900 font-semibold">Business Plan Generated</div>
                        <div className="text-gray-600 text-sm">{currentStepData.content.wordCount} words, {currentStepData.content.pageCount} pages</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {currentStepData.content.sections.map((section: any, i: number) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3 border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-900 text-sm font-medium">{section.name}</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <p className="text-gray-700 text-xs">{section.preview}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStepData.id === "pitch-deck" && isStepCompleted && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="text-gray-900 font-semibold">Investor Pitch Deck</div>
                      <div className="text-gray-600 text-sm">{currentStepData.content.slides.length} professional slides</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {currentStepData.content.slides.slice(0, 4).map((slide: any, i: number) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3 aspect-video flex flex-col justify-center border">
                          <div className="text-gray-900 text-xs font-medium mb-1">{slide.title}</div>
                          <div className="text-gray-700 text-xs">{slide.content}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStepData.id === "financial" && isStepCompleted && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3 text-center border">
                        <div className="text-green-600 font-bold text-lg">
                          ${(currentStepData.content.revenue.year5 / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-gray-600 text-xs">Year 5 Revenue</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center border">
                        <div className="text-blue-600 font-bold text-lg">
                          {(currentStepData.content.users.year5 / 1000).toFixed(0)}K
                        </div>
                        <div className="text-gray-600 text-xs">Users</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 text-sm">LTV/CAC Ratio</span>
                        <span className="text-gray-900 font-medium">{(currentStepData.content.metrics.ltv / currentStepData.content.metrics.cac).toFixed(1)}x</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 text-sm">Gross Margin</span>
                        <span className="text-gray-900 font-medium">{currentStepData.content.metrics.grossMargin}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 text-sm">Funding Need</span>
                        <span className="text-gray-900 font-medium">${(currentStepData.content.fundingNeeds / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentStepData.id === "complete" && isStepCompleted && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="text-gray-900 font-semibold">Investor Package Complete</div>
                      <div className="text-gray-600 text-sm">Professional documents ready for download</div>
                    </div>
                    
                    <div className="space-y-2">
                      {currentStepData.content.documents.map((doc: string, i: number) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-4 h-4 text-purple-600" />
                            <span className="text-gray-900 text-sm">{doc}</span>
                          </div>
                          <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-100 to-cyan-100 rounded-lg p-4 text-center border">
                      <div className="text-gray-900 font-semibold">Total Value Generated</div>
                      <div className="text-green-600 text-lg font-bold">{currentStepData.content.totalValue}</div>
                      <div className="text-gray-700 text-sm">if done with consultants</div>
                    </div>
                  </div>
                )}

                {!isStepCompleted && !isGenerating && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <currentStepData.icon className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-600">Click "Generate" to see the magic happen</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}