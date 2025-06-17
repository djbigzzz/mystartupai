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
import SidebarNavigation from "@/components/sidebar-navigation";

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
    setCurrentStep("modules");
    setPlatformProgress(20);
    localStorage.setItem("platformCompanyData", JSON.stringify(data));
  };

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  const handleStepNavigation = (stepId: string) => {
    setCurrentStep(stepId);
    const stepIndex = steps.findIndex(step => step.id === stepId);
    setPlatformProgress(((stepIndex + 1) / steps.length) * 100);
  };

  const tryDemoMode = () => {
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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <SidebarNavigation 
        companyData={companyData}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onModuleSelect={(moduleId) => {
          if (moduleId === "mvp-builder") {
            setCurrentStep("mvp-builder");
          } else {
            console.log("Module selected:", moduleId);
          }
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {currentStep === "modules" ? "Business Modules" :
                 currentStep === "mvp-builder" ? "MVP Builder" :
                 currentStep === "website" ? "Website Builder" :
                 currentStep === "investors" ? "Investor Matching" :
                 currentStep === "networking" ? "Networking Hub" :
                 "MyStartup.ai Platform"}
              </h1>
              <p className="text-sm text-slate-600">{companyData.companyName}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">{Math.round(platformProgress)}%</div>
                <p className="text-xs text-slate-500">Complete</p>
              </div>
              <Button onClick={tryDemoMode} variant="outline">
                <Play className="w-4 h-4 mr-2" />
                Try Demo
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {currentStep === "modules" && (
            <ModuleDashboard 
              companyData={companyData}
              onModuleSelect={(moduleId) => {
                if (moduleId === "mvp-builder") {
                  setCurrentStep("mvp-builder");
                } else {
                  console.log("Module selected:", moduleId);
                }
              }}
            />
          )}

          {currentStep === "mvp-builder" && (
            <MVPBuilder 
              companyData={companyData}
              businessPlan={null}
              onBack={() => setCurrentStep("modules")}
            />
          )}

          {currentStep === "website" && (
            <WebsiteBuilder 
              companyData={companyData}
              businessPlan={null}
            />
          )}

          {currentStep === "investors" && (
            <InvestorMatching companyData={companyData} />
          )}

          {currentStep === "networking" && (
            <NetworkingPlatform companyData={companyData} />
          )}
        </div>
      </div>
    </div>
  );
}