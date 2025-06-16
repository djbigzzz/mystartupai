import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Building2,
  Users,
  Globe,
  DollarSign,
  Target,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Play
} from "lucide-react";

import ComprehensiveOnboarding from "@/components/comprehensive-onboarding";
import ModuleDashboard from "@/components/module-dashboard";
import InvestorMatching from "@/components/investor-matching";
import WebsiteBuilder from "@/components/website-builder";
import NetworkingPlatform from "@/components/networking-platform";
import MVPBuilder from "@/components/mvp-builder";

interface CompanyData {
  companyName: string;
  description: string;
  industry: string;
  stage: string;
  location: string;
  teamSize: string;
  theme: string;
}

export default function CompletePlatform() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState("onboarding");
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [platformProgress, setPlatformProgress] = useState(0);

  const steps = [
    { id: "onboarding", name: "Company Setup", icon: Building2, completed: false },
    { id: "modules", name: "Business Modules", icon: Target, completed: false },
    { id: "website", name: "Website Builder", icon: Globe, completed: false },
    { id: "investors", name: "Investor Matching", icon: DollarSign, completed: false },
    { id: "networking", name: "Networking Hub", icon: Users, completed: false }
  ];

  useEffect(() => {
    // Check if user has already completed onboarding
    const savedData = localStorage.getItem("platformCompanyData");
    if (savedData) {
      const data = JSON.parse(savedData);
      setCompanyData(data);
      setCurrentStep("modules");
      setPlatformProgress(20);
    }
  }, []);

  const handleOnboardingComplete = (data: CompanyData) => {
    setCompanyData(data);
    localStorage.setItem("platformCompanyData", JSON.stringify(data));
    setCurrentStep("modules");
    setPlatformProgress(20);
  };

  const handleStepNavigation = (stepId: string) => {
    setCurrentStep(stepId);
    const stepIndex = steps.findIndex(s => s.id === stepId);
    setPlatformProgress((stepIndex + 1) * 20);
  };

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);

  const tryDemoMode = () => {
    localStorage.setItem("demoMode", "true");
    localStorage.setItem("userEmail", "demo@mystartup.ai");
    localStorage.setItem("currentIdeaId", "demo");
    setLocation("/dashboard");
  };

  if (!companyData && currentStep === "onboarding") {
    return <ComprehensiveOnboarding onComplete={handleOnboardingComplete} />;
  }

  if (!companyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Loading Platform</h2>
            <p className="text-slate-600">Setting up your comprehensive startup workspace...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setLocation("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  MyStartup.ai Platform
                </h1>
                <p className="text-sm text-slate-600">{companyData.companyName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">{platformProgress}%</div>
                <p className="text-xs text-slate-500">Complete</p>
              </div>
              <Button onClick={tryDemoMode} variant="outline">
                <Play className="w-4 h-4 mr-2" />
                Try Demo
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => handleStepNavigation(step.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentStep === step.id
                      ? 'bg-blue-100 text-blue-700'
                      : index <= getCurrentStepIndex()
                        ? 'text-slate-700 hover:bg-slate-100'
                        : 'text-slate-400 cursor-not-allowed'
                  }`}
                  disabled={index > getCurrentStepIndex() + 1}
                >
                  <step.icon className="w-4 h-4" />
                  <span className="font-medium">{step.name}</span>
                  {index < getCurrentStepIndex() && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </button>
              ))}
            </div>
            
            <Progress value={platformProgress} className="w-32" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === "modules" && (
          <ModuleDashboard 
            companyData={companyData}
            onModuleSelect={(moduleId) => {
              if (moduleId === "mvp-builder") {
                setCurrentStep("mvp-builder");
              } else {
                console.log("Module selected:", moduleId);
                // Handle other modules
              }
            }}
          />
        )}

        {currentStep === "mvp-builder" && (
          <MVPBuilder 
            companyData={companyData}
            businessPlan={null} // Would be populated from completed modules
            onBack={() => setCurrentStep("modules")}
          />
        )}

        {currentStep === "website" && (
          <WebsiteBuilder 
            companyData={companyData}
            businessPlan={null} // Would be populated from completed modules
          />
        )}

        {currentStep === "investors" && (
          <InvestorMatching companyData={companyData} />
        )}

        {currentStep === "networking" && (
          <NetworkingPlatform companyData={companyData} />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-slate-200 sticky bottom-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => {
                const currentIndex = getCurrentStepIndex();
                if (currentIndex > 0) {
                  handleStepNavigation(steps[currentIndex - 1].id);
                }
              }}
              disabled={getCurrentStepIndex() === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-100 text-blue-800">
                Step {getCurrentStepIndex() + 1} of {steps.length}
              </Badge>
              <span className="text-sm text-slate-600">
                {steps[getCurrentStepIndex()]?.name}
              </span>
            </div>

            <Button
              onClick={() => {
                const currentIndex = getCurrentStepIndex();
                if (currentIndex < steps.length - 1) {
                  handleStepNavigation(steps[currentIndex + 1].id);
                }
              }}
              disabled={getCurrentStepIndex() === steps.length - 1}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}