import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Lightbulb, 
  FileText, 
  Presentation, 
  Calculator, 
  Search,
  CheckCircle,
  Clock,
  ArrowRight,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Brain,
  Rocket,
  Eye,
  Download,
  Zap,
  Star
} from "lucide-react";
import { Link } from "wouter";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: any;
  status: "completed" | "in-progress" | "available" | "locked";
  completionPercentage: number;
  estimatedTime: string;
  dependencies: string[];
}

interface StartupWorkflowDashboardProps {
  currentIdeaId?: number | null;
  ideaData?: any;
}

export default function StartupWorkflowDashboard({ currentIdeaId, ideaData }: StartupWorkflowDashboardProps) {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      id: "submit-idea",
      title: "Idea Submission & Validation",
      description: "Submit your startup idea and get AI-powered validation with comprehensive analysis",
      route: "/submit-idea",
      icon: Lightbulb,
      status: "available",
      completionPercentage: 0,
      estimatedTime: "10-15 minutes",
      dependencies: []
    },
    {
      id: "business-plan",
      title: "Business Plan Generation",
      description: "Create a comprehensive 12-section business plan with AI assistance",
      route: "/business-plan",
      icon: FileText,
      status: "locked",
      completionPercentage: 0,
      estimatedTime: "20-30 minutes",
      dependencies: ["submit-idea"]
    },
    {
      id: "pitch-deck",
      title: "Pitch Deck Creation",
      description: "Generate professional investor presentations with interactive components",
      route: "/pitch-deck",
      icon: Presentation,
      status: "locked",
      completionPercentage: 0,
      estimatedTime: "15-25 minutes",
      dependencies: ["business-plan"]
    },
    {
      id: "financial-modeling",
      title: "Financial Modeling",
      description: "Build 5-year financial projections and investment calculations",
      route: "/financial-modeling",
      icon: Calculator,
      status: "locked",
      completionPercentage: 0,
      estimatedTime: "25-35 minutes",
      dependencies: ["business-plan"]
    },
    {
      id: "market-research",
      title: "Market Research & Analysis",
      description: "Comprehensive market analysis and competitive intelligence",
      route: "/market-research",
      icon: Search,
      status: "locked",
      completionPercentage: 0,
      estimatedTime: "20-30 minutes",
      dependencies: ["submit-idea"]
    }
  ]);

  useEffect(() => {
    if (currentIdeaId && ideaData) {
      setWorkflowSteps(prev => prev.map(step => {
        // Update step status based on available data
        switch (step.id) {
          case "submit-idea":
            return {
              ...step,
              status: "completed" as const,
              completionPercentage: 100
            };
          case "business-plan":
            return {
              ...step,
              status: ideaData.businessPlan ? "completed" as const : "available" as const,
              completionPercentage: ideaData.businessPlan ? 100 : 0
            };
          case "pitch-deck":
            return {
              ...step,
              status: ideaData.pitchDeck ? "completed" as const : 
                      ideaData.businessPlan ? "available" as const : "locked" as const,
              completionPercentage: ideaData.pitchDeck ? 100 : 0
            };
          case "financial-modeling":
            return {
              ...step,
              status: ideaData.businessPlan ? "available" as const : "locked" as const,
              completionPercentage: 0
            };
          case "market-research":
            return {
              ...step,
              status: "available" as const,
              completionPercentage: 0
            };
          default:
            return step;
        }
      }));
    }
  }, [currentIdeaId, ideaData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-100 border-green-200";
      case "in-progress": return "text-blue-600 bg-blue-100 border-blue-200";
      case "available": return "text-purple-600 bg-purple-100 border-purple-200";
      case "locked": return "text-gray-400 bg-gray-100 border-gray-200";
      default: return "text-gray-400 bg-gray-100 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "in-progress": return Clock;
      case "available": return Target;
      case "locked": return Clock;
      default: return Clock;
    }
  };

  const calculateOverallProgress = () => {
    const totalSteps = workflowSteps.length;
    const completedSteps = workflowSteps.filter(step => step.status === "completed").length;
    return (completedSteps / totalSteps) * 100;
  };

  const getNextStep = () => {
    return workflowSteps.find(step => step.status === "available");
  };

  const completedSteps = workflowSteps.filter(step => step.status === "completed").length;
  const nextStep = getNextStep();

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Startup Development Workflow
            </CardTitle>
            <Badge variant="secondary" className="text-sm">
              {completedSteps}/{workflowSteps.length} Complete
            </Badge>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Overall Progress</span>
              <span>{Math.round(calculateOverallProgress())}%</span>
            </div>
            <Progress value={calculateOverallProgress()} className="h-3" />
          </div>

          {currentIdeaId && ideaData && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{ideaData.ideaTitle}</h3>
                  <p className="text-sm text-gray-600">{ideaData.industry} • {ideaData.stage}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{ideaData.industry}</Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Prominent Next Step Recommendation */}
      {nextStep && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white overflow-hidden relative">
          {/* Floating background elements */}
          <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full opacity-50"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full opacity-30"></div>
          
          <CardContent className="p-8 relative z-10">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300">
                <nextStep.icon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-2 text-white drop-shadow-sm">
                🎯 Your Next Move
              </h2>
              <p className="text-blue-100 text-lg font-medium">
                Ready to level up your startup?
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{nextStep.title}</h3>
              <p className="text-blue-100 mb-4">{nextStep.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-blue-100">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="font-medium">Time: {nextStep.estimatedTime}</span>
                </div>
                <div className="flex items-center text-blue-100">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span className="font-medium">Progress: +{Math.round(100/workflowSteps.length)}%</span>
                </div>
              </div>
              
              {/* Benefits section */}
              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <h4 className="text-white font-semibold mb-2 flex items-center">
                  <Rocket className="w-4 h-4 mr-2" />
                  What you'll achieve:
                </h4>
                <ul className="text-blue-100 text-sm space-y-1">
                  {nextStep.id === 'submit-idea' && (
                    <>
                      <li>• Get AI-powered market validation for your idea</li>
                      <li>• Identify key risks and opportunities</li>
                      <li>• Unlock the business plan generator</li>
                    </>
                  )}
                  {nextStep.id === 'business-plan' && (
                    <>
                      <li>• Create a comprehensive 12-section business plan</li>
                      <li>• Generate investor-ready documentation</li>
                      <li>• Unlock pitch deck and financial modeling</li>
                    </>
                  )}
                  {nextStep.id === 'pitch-deck' && (
                    <>
                      <li>• Build a professional investor presentation</li>
                      <li>• Visualize your business story effectively</li>
                      <li>• Increase funding success by 67%</li>
                    </>
                  )}
                  {nextStep.id === 'financial-modeling' && (
                    <>
                      <li>• Create 5-year financial projections</li>
                      <li>• Calculate funding requirements accurately</li>
                      <li>• Prepare for investor due diligence</li>
                    </>
                  )}
                  {nextStep.id === 'market-research' && (
                    <>
                      <li>• Get comprehensive competitive analysis</li>
                      <li>• Identify market size and opportunity</li>
                      <li>• Validate your go-to-market strategy</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={nextStep.route}>
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto" data-testid="button-next-step-primary">
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white/50 text-white hover:bg-white/10 px-6 py-4 text-lg font-semibold backdrop-blur-sm w-full sm:w-auto" 
                data-testid="button-next-step-secondary"
                onClick={() => {
                  const workflowSection = document.querySelector('[data-testid="workflow-steps"]');
                  if (workflowSection) {
                    workflowSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                aria-label="Scroll to view all workflow steps"
              >
                <Eye className="w-5 h-5 mr-2" />
                Preview Steps
              </Button>
            </div>
            
            {/* Motivation footer */}
            <div className="text-center mt-6 pt-6 border-t border-white/20">
              <p className="text-blue-100 text-sm">
                🚀 <strong>5,000+</strong> entrepreneurs completed this step • Average completion time: <strong>2.3 days</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflow Steps */}
      <div className="grid gap-6" data-testid="workflow-steps">
        {workflowSteps.map((step, index) => {
          const IconComponent = step.icon;
          const StatusIcon = getStatusIcon(step.status);
          const isClickable = step.status === "available" || step.status === "completed";
          
          return (
            <Card key={step.id} className={`transition-all duration-200 ${
              isClickable ? "hover:shadow-md cursor-pointer" : "opacity-60"
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getStatusColor(step.status)}`}>
                      {step.status === "completed" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="font-semibold">{index + 1}</span>
                      )}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                      </div>
                      <Badge className={getStatusColor(step.status)} variant="secondary">
                        {step.status.replace("-", " ")}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {step.estimatedTime}
                        </span>
                        {step.dependencies.length > 0 && (
                          <span>
                            Requires: {step.dependencies.join(", ")}
                          </span>
                        )}
                      </div>
                      
                      {isClickable && (
                        <Link href={step.route}>
                          <Button variant="outline" size="sm">
                            {step.status === "completed" ? "View" : "Start"}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      )}
                    </div>

                    {/* Progress Bar for Completed Steps */}
                    {step.status === "completed" && (
                      <div className="mt-4">
                        <Progress value={step.completionPercentage} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Workflow Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            Complete Startup Development Platform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
              <p className="text-sm text-gray-600">Advanced GPT-4 technology for intelligent content generation</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Proven Framework</h4>
              <p className="text-sm text-gray-600">Based on Y Combinator and successful startup methodologies</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Rocket className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Complete Workflow</h4>
              <p className="text-sm text-gray-600">From idea validation to investor-ready documentation</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Professional Output</h4>
              <p className="text-sm text-gray-600">Investor-ready business plans, pitch decks, and financial models</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export All Documents */}
      {completedSteps >= 2 && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Export Complete Startup Package
                </h3>
                <p className="text-gray-600">
                  Download all your completed documents in a professional investor package
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Investor Package
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}