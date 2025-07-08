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
  DollarSign,
  LineChart,
  Zap,
  Shield,
  Award,
  Rocket,
  Star,
  Eye,
  ThumbsUp,
  AlertTriangle,
  Lightbulb,
  Calculator,
  Search,
  Layers,
  X,
  ChevronRight
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

export default function DemoJourneyNew() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [loadingSteps, setLoadingSteps] = useState<Set<number>>(new Set());
  const [animatingSteps, setAnimatingSteps] = useState<Set<number>>(new Set());
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [stepProgress, setStepProgress] = useState<Record<number, number>>({});

  const demoSteps: DemoStep[] = [
    {
      id: "submission",
      title: "Submit Your Idea",
      description: "Enter raw startup concept",
      icon: Brain,
      duration: 7,
      color: "from-gray-500 to-gray-600",
      content: {
        title: "Fitness App",
        description: "An app for workouts",
        industry: "Health & Fitness"
      }
    },
    {
      id: "enhancement",
      title: "AI Enhancement",
      description: "AI improves your concept",
      icon: Zap,
      duration: 7,
      color: "from-yellow-500 to-orange-500",
      content: {
        enhanced: true,
        title: "FitAI - AI-Powered Personal Trainer",
        description: "Revolutionary fitness app that uses computer vision and AI to provide real-time form correction, personalized workout plans, and adaptive difficulty based on user performance."
      }
    },
    {
      id: "analysis",
      title: "AI Analysis",
      description: "Deep validation begins",
      icon: Search,
      duration: 7,
      color: "from-blue-500 to-indigo-500",
      content: {
        score: 8.5,
        viabilityScore: 9.2,
        marketSize: "$96B",
        growth: "14.7%"
      }
    },
    {
      id: "business-plan",
      title: "Business Plan",
      description: "Comprehensive plan generation",
      icon: FileText,
      duration: 60,
      color: "from-green-500 to-emerald-500",
      content: {
        sections: 12,
        words: 3142,
        pages: 42,
        quality: 9.2
      }
    },
    {
      id: "pitch-deck",
      title: "Pitch Deck",
      description: "Investor presentation slides",
      icon: Presentation,
      duration: 7,
      color: "from-purple-500 to-pink-500",
      content: {
        slides: 12,
        duration: "15 minutes"
      }
    },
    {
      id: "financial",
      title: "Financial Model",
      description: "Revenue & investment projections",
      icon: Calculator,
      duration: 30,
      color: "from-blue-500 to-cyan-500",
      content: {
        year5Revenue: 50000000,
        year5Users: 2000000
      }
    }
  ];

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep || completedSteps.has(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  const startStepAnimation = async (stepIndex: number) => {
    setLoadingSteps(prev => new Set(prev).add(stepIndex));
    setAnimatingSteps(prev => new Set(prev).add(stepIndex));
    
    const step = demoSteps[stepIndex];
    const duration = step.duration * 1000;
    
    // Animate progress
    const startTime = Date.now();
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      
      setStepProgress(prev => ({ ...prev, [stepIndex]: progress }));
      
      if (progress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        // Complete the step
        setLoadingSteps(prev => {
          const newSet = new Set(prev);
          newSet.delete(stepIndex);
          return newSet;
        });
        setCompletedSteps(prev => new Set(prev).add(stepIndex));
        setAnimatingSteps(prev => {
          const newSet = new Set(prev);
          newSet.delete(stepIndex);
          return newSet;
        });
      }
    };
    
    updateProgress();
  };

  const continueToNext = () => {
    if (currentStep < demoSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (!completedSteps.has(nextStep)) {
        startStepAnimation(nextStep);
      }
    }
  };

  // Auto-start first step
  useEffect(() => {
    if (currentStep === 0 && !loadingSteps.has(0) && !completedSteps.has(0)) {
      startStepAnimation(0);
    }
  }, []);

  const isStepActive = (stepIndex: number) => stepIndex === currentStep;
  const isStepCompleted = (stepIndex: number) => completedSteps.has(stepIndex);
  const isStepLoading = (stepIndex: number) => loadingSteps.has(stepIndex);
  const currentStepData = demoSteps[currentStep];

  const getOverallProgress = () => {
    const completedCount = completedSteps.size;
    const currentProgress = stepProgress[currentStep] || 0;
    return ((completedCount * 100) + currentProgress) / demoSteps.length;
  };

  // Full-screen pitch deck mode
  if (fullScreenMode && currentStep === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        {/* Full Screen Pitch Deck Presentation */}
        <div className="relative h-screen">
          {/* Exit Button */}
          <Button
            onClick={() => setFullScreenMode(false)}
            className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white"
            size="sm"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Presentation Content */}
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Presentation className="w-8 h-8" />
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                FitAI Investor Deck
              </h1>
              <p className="text-xl text-slate-300 mb-8">The Future of Personalized Fitness</p>
              <div className="flex items-center justify-center space-x-6 text-sm">
                <span className="bg-blue-500/20 px-4 py-2 rounded-full">Series A</span>
                <span className="bg-purple-500/20 px-4 py-2 rounded-full">$5M Raise</span>
                <span className="bg-green-500/20 px-4 py-2 rounded-full">Health Tech</span>
              </div>
            </div>

            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
              onClick={() => {
                // Start presentation logic here
                alert("Presentation would start here - showing all 12 slides in full-screen mode");
              }}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Presentation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complete Startup Journey Demo</h1>
              <p className="text-gray-600">
                Step {currentStep + 1} of {demoSteps.length} • {Math.round(getOverallProgress())}% Complete
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">Exit Demo</Button>
            </Link>
          </div>
          <Progress value={getOverallProgress()} className="mt-4" />
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Sidebar Navigation */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Demo Steps</h2>
            
            <div className="space-y-3">
              {demoSteps.map((step, index) => {
                const Icon = step.icon;
                const active = isStepActive(index);
                const completed = isStepCompleted(index);
                const loading = isStepLoading(index);
                const progress = stepProgress[index] || 0;
                
                return (
                  <div key={step.id} className="relative">
                    <button
                      onClick={() => handleStepClick(index)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        active
                          ? 'bg-blue-50 border-blue-200'
                          : completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          completed
                            ? 'bg-green-500 text-white'
                            : active
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {completed ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className={`font-medium ${
                            active ? 'text-blue-900' : completed ? 'text-green-900' : 'text-gray-700'
                          }`}>
                            {step.title}
                          </h3>
                          <p className={`text-sm ${
                            active ? 'text-blue-600' : completed ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {step.description}
                          </p>
                          <div className="text-xs text-gray-400 mt-1">
                            Estimated: {step.duration}s
                          </div>
                        </div>
                        
                        {(active || completed) && (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      
                      {/* Progress Bar for Active Step */}
                      {active && loading && (
                        <div className="mt-3">
                          <Progress value={progress} className="h-2" />
                          <div className="text-xs text-blue-600 mt-1">
                            {Math.round(progress)}% complete
                          </div>
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Continue Button */}
            {isStepCompleted(currentStep) && currentStep < demoSteps.length - 1 && (
              <Button 
                onClick={continueToNext}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Continue to Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              {/* Current Step Header */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${currentStepData.color} flex items-center justify-center text-white`}>
                    <currentStepData.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{currentStepData.title}</h2>
                    <p className="text-gray-600">{currentStepData.description}</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Content Based on Current Step */}
              {currentStep === 0 && (
                <StepOneContent 
                  isCompleted={isStepCompleted(0)} 
                  isLoading={isStepLoading(0)} 
                  data={currentStepData.content}
                />
              )}
              
              {currentStep === 1 && (
                <StepTwoContent 
                  isCompleted={isStepCompleted(1)} 
                  isLoading={isStepLoading(1)} 
                  data={currentStepData.content}
                />
              )}
              
              {currentStep === 2 && (
                <StepThreeContent 
                  isCompleted={isStepCompleted(2)} 
                  isLoading={isStepLoading(2)} 
                  data={currentStepData.content}
                />
              )}
              
              {currentStep === 3 && (
                <StepFourContent 
                  isCompleted={isStepCompleted(3)} 
                  isLoading={isStepLoading(3)} 
                  data={currentStepData.content}
                />
              )}
              
              {currentStep === 4 && (
                <StepFiveContent 
                  isCompleted={isStepCompleted(4)} 
                  isLoading={isStepLoading(4)} 
                  data={currentStepData.content}
                  onFullScreen={() => setFullScreenMode(true)}
                />
              )}
              
              {currentStep === 5 && (
                <StepSixContent 
                  isCompleted={isStepCompleted(5)} 
                  isLoading={isStepLoading(5)} 
                  data={currentStepData.content}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
function StepOneContent({ isCompleted, isLoading, data }: any) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Your Idea...</h3>
            <p className="text-gray-600">Analyzing concept and gathering initial insights</p>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-600 font-medium">Idea Successfully Submitted</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Fitness App</h3>
          <p className="text-gray-700 mb-4">An app for workouts</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Industry</div>
              <div className="font-medium">Health & Fitness</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Target Market</div>
              <div className="font-medium">General users</div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="text-yellow-800 font-medium">Needs AI Enhancement</span>
          </div>
          <p className="text-yellow-700 text-sm">Your idea is too basic for analysis. AI enhancement will add specificity and market positioning.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 border border-gray-200">
      <div className="text-center">
        <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit Your Startup Idea</h3>
        <p className="text-gray-600">Click the button in the sidebar to start processing your idea</p>
      </div>
    </div>
  );
}

function StepTwoContent({ isCompleted, isLoading, data }: any) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <Zap className="w-6 h-6 text-yellow-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Enhancement in Progress...</h3>
            <p className="text-gray-600">Analyzing market gaps and improving your concept</p>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-600 font-medium">AI Enhancement Complete</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">FitAI - AI-Powered Personal Trainer</h3>
          <p className="text-gray-700 mb-4">
            Revolutionary fitness app that uses computer vision and AI to provide real-time form correction, 
            personalized workout plans, and adaptive difficulty based on user performance.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Enhanced Problem</div>
              <div className="text-sm font-medium">Generic fitness apps lack personalization</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">AI Solution</div>
              <div className="text-sm font-medium">Computer vision form correction</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Key Improvements:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Defined specific problem statement</li>
              <li>• Added AI differentiation strategy</li>
              <li>• Targeted precise market segment</li>
              <li>• Created compelling value proposition</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 border border-gray-200">
      <div className="text-center">
        <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Enhancement Ready</h3>
        <p className="text-gray-600">Waiting for previous step to complete</p>
      </div>
    </div>
  );
}

function StepThreeContent({ isCompleted, isLoading, data }: any) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <Search className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Deep Analysis in Progress...</h3>
            <p className="text-gray-600">Validating market opportunity and competitive landscape</p>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-600 font-medium">Analysis Complete</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Score */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{data.score}/10</div>
              <div className="text-sm text-green-700">Overall Viability Score</div>
            </div>
          </div>

          {/* Market Context */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3">Market Context</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{data.marketSize}</div>
                <div className="text-xs text-blue-500">Global Market</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{data.growth}</div>
                <div className="text-xs text-blue-500">Annual Growth</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="mt-6 bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Analysis Highlights</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded p-4">
              <div className="text-sm text-green-600 font-medium mb-1">Strengths</div>
              <div className="text-sm text-gray-700">AI differentiation, large market, proven demand</div>
            </div>
            <div className="bg-white rounded p-4">
              <div className="text-sm text-yellow-600 font-medium mb-1">Challenges</div>
              <div className="text-sm text-gray-700">Technical complexity, user acquisition costs</div>
            </div>
            <div className="bg-white rounded p-4">
              <div className="text-sm text-blue-600 font-medium mb-1">Opportunity</div>
              <div className="text-sm text-gray-700">First-mover advantage in AI fitness</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 border border-gray-200">
      <div className="text-center">
        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis Ready</h3>
        <p className="text-gray-600">Waiting for previous step to complete</p>
      </div>
    </div>
  );
}

function StepFourContent({ isCompleted, isLoading, data }: any) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <FileText className="w-6 h-6 text-green-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Business Plan...</h3>
            <p className="text-gray-600">Creating comprehensive 12-section investor-ready document</p>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-600 font-medium">Business Plan Generated</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.sections}</div>
              <div className="text-sm text-green-700">Sections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.words.toLocaleString()}</div>
              <div className="text-sm text-green-700">Words</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.pages}</div>
              <div className="text-sm text-green-700">Pages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.quality}/10</div>
              <div className="text-sm text-green-700">Quality Score</div>
            </div>
          </div>
        </div>

        {/* Business Plan Preview */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Executive Summary Preview</h4>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h5 className="font-medium text-gray-900 mb-3">FitAI: Revolutionizing Personal Fitness</h5>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              FitAI represents the next evolution in fitness technology, combining artificial intelligence with computer vision 
              to deliver personalized workout experiences that adapt in real-time to user performance and form.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded p-4">
                <div className="text-sm font-medium text-gray-900 mb-2">Market Opportunity</div>
                <div className="text-sm text-gray-600">$96B global fitness market growing at 14.7% annually</div>
              </div>
              <div className="bg-white rounded p-4">
                <div className="text-sm font-medium text-gray-900 mb-2">Competitive Advantage</div>
                <div className="text-sm text-gray-600">First-mover in AI-powered form correction</div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              <FileText className="w-4 h-4 mr-2" />
              View Full Plan
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 border border-gray-200">
      <div className="text-center">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Plan Ready</h3>
        <p className="text-gray-600">Waiting for previous step to complete</p>
      </div>
    </div>
  );
}

function StepFiveContent({ isCompleted, isLoading, data, onFullScreen }: any) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <Presentation className="w-6 h-6 text-purple-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Creating Pitch Deck...</h3>
            <p className="text-gray-600">Generating investor-ready presentation slides</p>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-600 font-medium">Pitch Deck Generated</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">FitAI Investor Deck</h3>
              <p className="text-purple-600">Series A • Health Tech Revolution</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{data.slides}</div>
              <div className="text-sm text-purple-500">Professional Slides</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded p-3 text-center">
              <div className="text-sm font-medium text-gray-900">Duration</div>
              <div className="text-sm text-gray-600">{data.duration}</div>
            </div>
            <div className="bg-white rounded p-3 text-center">
              <div className="text-sm font-medium text-gray-900">Target</div>
              <div className="text-sm text-gray-600">Series A VCs</div>
            </div>
          </div>
        </div>

        {/* Slide Preview */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Slide Preview</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4 border">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-blue-600 text-white rounded text-xs flex items-center justify-center font-bold">1</div>
                <div className="font-medium text-gray-900">Company Overview</div>
              </div>
              <div className="text-sm text-gray-700">FitAI - The Future of Personalized Fitness</div>
            </div>
            
            <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-lg p-4 border">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-red-600 text-white rounded text-xs flex items-center justify-center font-bold">2</div>
                <div className="font-medium text-gray-900">The Problem</div>
              </div>
              <div className="text-sm text-gray-700">$2.3B retention crisis in fitness apps</div>
            </div>
            
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-green-600 text-white rounded text-xs flex items-center justify-center font-bold">3</div>
                <div className="font-medium text-gray-900">Our Solution</div>
              </div>
              <div className="text-sm text-gray-700">AI-powered personal trainer with form correction</div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-4 border">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-purple-600 text-white rounded text-xs flex items-center justify-center font-bold">4</div>
                <div className="font-medium text-gray-900">Market Opportunity</div>
              </div>
              <div className="text-sm text-gray-700">$96B market growing 14.7% annually</div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 py-4">
            + 8 more slides: Traction, Business Model, Team, Financials, Ask...
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button 
              onClick={onFullScreen}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Full-Screen Presentation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 border border-gray-200">
      <div className="text-center">
        <Presentation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Pitch Deck Ready</h3>
        <p className="text-gray-600">Waiting for previous step to complete</p>
      </div>
    </div>
  );
}

function StepSixContent({ isCompleted, isLoading, data }: any) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <Calculator className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Building Financial Model...</h3>
            <p className="text-gray-600">Creating 5-year projections and unit economics</p>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-600 font-medium">Financial Model Complete</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">${(data.year5Revenue / 1000000).toFixed(0)}M</div>
              <div className="text-sm text-blue-700">Year 5 Revenue</div>
              <div className="text-xs text-blue-500 mt-1">Annual Recurring Revenue</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{(data.year5Users / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-green-700">Year 5 Users</div>
              <div className="text-xs text-green-500 mt-1">Projected user base</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Key Financial Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded p-4 text-center">
              <div className="text-lg font-bold text-gray-900">8:1</div>
              <div className="text-sm text-gray-600">LTV/CAC Ratio</div>
            </div>
            <div className="bg-white rounded p-4 text-center">
              <div className="text-lg font-bold text-gray-900">85%</div>
              <div className="text-sm text-gray-600">Gross Margin</div>
            </div>
            <div className="bg-white rounded p-4 text-center">
              <div className="text-lg font-bold text-gray-900">4 months</div>
              <div className="text-sm text-gray-600">Payback Period</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 border border-gray-200">
      <div className="text-center">
        <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Model Ready</h3>
        <p className="text-gray-600">Waiting for previous step to complete</p>
      </div>
    </div>
  );
}