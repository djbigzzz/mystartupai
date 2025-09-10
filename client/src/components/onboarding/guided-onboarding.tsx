import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Lightbulb, 
  FileText, 
  Users, 
  ArrowRight, 
  CheckCircle,
  Target,
  Brain,
  Rocket,
  Gift,
  Timer,
  Award
} from "lucide-react";
import { Link } from "wouter";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  route?: string;
  action?: () => void;
  timeEstimate: string;
  completed?: boolean;
}

interface GuidedOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
  isFirstTimeUser?: boolean;
}

export default function GuidedOnboarding({ onComplete, onSkip, isFirstTimeUser = true }: GuidedOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const onboardingSteps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to MyStartup.ai!",
      description: "Your AI-powered co-founder that will help transform your idea into an investor-ready business",
      icon: Sparkles,
      timeEstimate: "2 min",
    },
    {
      id: "submit-idea",
      title: "Submit Your First Idea",
      description: "Start by telling us about your startup concept. Our AI will analyze market opportunity, competition, and feasibility",
      icon: Lightbulb,
      route: "/submit-idea",
      timeEstimate: "10-15 min",
    },
    {
      id: "ai-analysis",
      title: "Get AI-Powered Analysis",
      description: "Receive comprehensive validation with market insights, competitive analysis, and viability scoring",
      icon: Brain,
      timeEstimate: "5 min",
    },
    {
      id: "business-plan",
      title: "Generate Business Plan",
      description: "Create a professional 12-section business plan that meets investor standards",
      icon: FileText,
      route: "/business-plan",
      timeEstimate: "20-30 min",
    },
    {
      id: "explore-platform",
      title: "Explore Advanced Features",
      description: "Discover pitch deck creation, financial modeling, investor matching, and MVP building tools",
      icon: Rocket,
      timeEstimate: "5 min",
    }
  ];

  const calculateProgress = () => {
    return (currentStep / (onboardingSteps.length - 1)) * 100;
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const markStepCompleted = (stepId: string) => {
    setCompletedSteps(prev => new Set(Array.from(prev).concat(stepId)));
  };

  const currentStepData = onboardingSteps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="text-sm">
              Step {currentStep + 1} of {onboardingSteps.length}
            </Badge>
            <div className="flex items-center space-x-2">
              <Timer className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">{currentStepData.timeEstimate}</span>
            </div>
          </div>
          
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <IconComponent className="w-10 h-10 text-white" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            {currentStepData.title}
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            {currentStepData.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Onboarding Progress</span>
              <span>{Math.round(calculateProgress())}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>

          {/* Step-specific content */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-purple-600" />
                  What You'll Get Today
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    AI idea validation score
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Market opportunity analysis
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Professional business plan
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Investor-ready documentation
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">Y Combinator Standards</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  All outputs meet the same standards used by top accelerators and VCs
                </p>
              </div>
            </div>
          )}

          {(currentStep === 1 || currentStep === 3) && currentStepData.route && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Ready to get started?</h4>
              <p className="text-sm text-blue-800 mb-3">
                Click the button below to {currentStep === 1 ? "submit your idea" : "generate your business plan"} and see the magic happen.
              </p>
              <Link href={currentStepData.route}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Target className="w-4 h-4 mr-2" />
                  {currentStep === 1 ? "Submit My Idea" : "Generate Business Plan"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">AI Analysis Includes:</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-purple-800">
                    <Brain className="w-4 h-4 mr-2" />
                    Market size and growth potential
                  </div>
                  <div className="flex items-center text-sm text-purple-800">
                    <Target className="w-4 h-4 mr-2" />
                    Competitive landscape analysis
                  </div>
                  <div className="flex items-center text-sm text-purple-800">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Business model feasibility
                  </div>
                  <div className="flex items-center text-sm text-purple-800">
                    <Users className="w-4 h-4 mr-2" />
                    Target customer insights
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">Pitch Decks</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">Financial Models</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">Investor Matching</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Rocket className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">MVP Builder</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
              <Button variant="ghost" onClick={onSkip} className="text-gray-500 hover:text-gray-700">
                Skip Tour
              </Button>
            </div>
            
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
              {currentStep === onboardingSteps.length - 1 ? "Start Building" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}