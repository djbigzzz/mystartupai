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
  Play,
  Rocket
} from "lucide-react";

import ComprehensiveOnboarding from "@/components/comprehensive-onboarding";
import ModuleDashboard from "@/components/module-dashboard";
import InvestorMatching from "@/components/investor-matching";
import WebsiteBuilder from "@/components/website-builder";
import NetworkingPlatform from "@/components/networking-platform";
import MVPBuilder from "@/components/mvp-builder";
import SidebarNavigation from "@/components/sidebar-navigation";
import DataRoom from "@/components/data-room";
import CompanySetup from "@/components/company-setup";
import BusinessStrategy from "@/components/business-strategy";
import ProductDevelopment from "@/components/product-development";
import FinancialPlanning from "@/components/financial-planning";
import MarketingStrategy from "@/components/marketing-strategy";

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
                {currentStep === "modules" ? "Business Strategy" :
                 currentStep === "profile" ? "Company Setup" :
                 currentStep === "product" ? "Product Development" :
                 currentStep === "financial" ? "Financial Planning" :
                 currentStep === "marketing" ? "Marketing Strategy" :
                 currentStep === "legal" ? "Legal Foundation" :
                 currentStep === "mvp-builder" ? "MVP Builder" :
                 currentStep === "website" ? "AI Website Builder" :
                 currentStep === "pitch-deck" ? "Pitch Builder" :
                 currentStep === "investors" ? "Funding & Investment" :
                 currentStep === "funding" ? "Funding & Investment" :
                 currentStep === "networking" ? "Launch & Scale" :
                 currentStep === "launch" ? "Launch & Scale" :
                 currentStep === "data-room" ? "Data Room" :
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
          {currentStep === "profile" && (
            <CompanySetup 
              companyData={companyData}
              onUpdate={(data) => {
                setCompanyData(prev => ({ ...prev, ...data }));
                localStorage.setItem("platformCompanyData", JSON.stringify({ ...companyData, ...data }));
              }}
            />
          )}

          {currentStep === "modules" && (
            <BusinessStrategy companyData={companyData} />
          )}

          {currentStep === "product" && (
            <ProductDevelopment companyData={companyData} />
          )}

          {currentStep === "financial" && (
            <FinancialPlanning companyData={companyData} />
          )}

          {currentStep === "marketing" && (
            <MarketingStrategy companyData={companyData} />
          )}

          {currentStep === "legal" && (
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
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">AI Website Builder</h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                  Generate a complete professional website with a single click. Our AI analyzes your business plan 
                  and creates beautiful, responsive frontend designs tailored to your brand and industry.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">AI Analysis</h3>
                      <p className="text-sm text-slate-600">
                        Analyzes your business plan, industry, and target audience
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Design Generation</h3>
                      <p className="text-sm text-slate-600">
                        Creates responsive designs with modern UI components and layouts
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Rocket className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">One-Click Deploy</h3>
                      <p className="text-sm text-slate-600">
                        Instantly deploys your website with hosting and domain setup
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate My Website with AI
                    </Button>
                    <p className="text-sm text-slate-500 mt-4">
                      Complete website ready in under 60 seconds
                    </p>
                  </div>
                </div>
              </div>
              
              <WebsiteBuilder 
                companyData={companyData}
                businessPlan={null}
              />
            </div>
          )}

          {currentStep === "investors" && (
            <InvestorMatching companyData={companyData} />
          )}

          {(currentStep === "networking" || currentStep === "launch" || currentStep === "events") && (
            <NetworkingPlatform companyData={companyData} />
          )}

          {currentStep === "funding" && (
            <InvestorMatching companyData={companyData} />
          )}

          {currentStep === "data-room" && (
            <DataRoom companyData={companyData} />
          )}

          {currentStep === "pitch-deck" && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Pitch Builder</h2>
              <p className="text-slate-600 mb-8">
                AI-powered pitch deck generator will create compelling investor presentations from your business plan data.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Coming Soon</h3>
                <p className="text-blue-700">
                  Our AI will automatically generate professional pitch decks with compelling narratives, 
                  market analysis, financial projections, and investor-ready slides tailored to your business.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}