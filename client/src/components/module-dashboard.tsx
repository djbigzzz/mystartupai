import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  TrendingUp, 
  Scale, 
  FileText,
  Presentation,
  Map,
  FolderOpen,
  DollarSign,
  Lightbulb,
  Users,
  Globe,
  Building,
  CheckCircle,
  Clock,
  Lock,
  ArrowRight,
  Sparkles,
  Zap
} from "lucide-react";

interface ModuleStatus {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  status: "completed" | "in-progress" | "available" | "locked";
  progress: number;
  estimatedTime: string;
  dependencies?: string[];
  aiFeatures: string[];
}

interface ModuleDashboardProps {
  companyData: any;
  onModuleSelect: (moduleId: string) => void;
}

export default function ModuleDashboard({ companyData, onModuleSelect }: ModuleDashboardProps) {
  const [modules, setModules] = useState<ModuleStatus[]>([
    {
      id: "business-strategy",
      name: "Business Strategy",
      description: "Core business model, value proposition, and competitive positioning",
      icon: Target,
      status: "completed",
      progress: 100,
      estimatedTime: "15 min",
      aiFeatures: ["Market Analysis", "Competitive Intelligence", "SWOT Generation"]
    },
    {
      id: "marketing-intelligence",
      name: "Marketing Intelligence",
      description: "Customer segmentation, marketing channels, and growth strategies",
      icon: TrendingUp,
      status: "in-progress",
      progress: 60,
      estimatedTime: "20 min",
      dependencies: ["business-strategy"],
      aiFeatures: ["Customer Persona AI", "Channel Optimization", "Campaign Planning"]
    },
    {
      id: "legal-foundation",
      name: "Legal Foundation",
      description: "Business structure, compliance requirements, and legal documentation",
      icon: Scale,
      status: "available",
      progress: 0,
      estimatedTime: "25 min",
      dependencies: ["business-strategy"],
      aiFeatures: ["Entity Structure Advisor", "Compliance Checker", "Document Generator"]
    },
    {
      id: "pitch-deck",
      name: "Pitch Deck Generator",
      description: "Investor-ready presentation with compelling storytelling",
      icon: Presentation,
      status: "available",
      progress: 0,
      estimatedTime: "10 min",
      dependencies: ["business-strategy", "marketing-intelligence"],
      aiFeatures: ["Story Arc Generation", "Visual Design AI", "Content Optimization"]
    },
    {
      id: "roadmap-planning",
      name: "Roadmap Planning",
      description: "Milestone tracking, timeline management, and execution planning",
      icon: Map,
      status: "available",
      progress: 0,
      estimatedTime: "18 min",
      dependencies: ["business-strategy"],
      aiFeatures: ["Timeline Optimization", "Risk Assessment", "Resource Planning"]
    },
    {
      id: "document-management",
      name: "Document Management",
      description: "Centralized file organization and version control",
      icon: FolderOpen,
      status: "locked",
      progress: 0,
      estimatedTime: "5 min",
      dependencies: ["legal-foundation"],
      aiFeatures: ["Smart Organization", "Version Tracking", "Access Control"]
    },
    {
      id: "funding-strategy",
      name: "Funding Strategy",
      description: "Investment preparation, valuation guidance, and investor targeting",
      icon: DollarSign,
      status: "locked",
      progress: 0,
      estimatedTime: "30 min",
      dependencies: ["pitch-deck", "legal-foundation"],
      aiFeatures: ["Valuation Models", "Investor Matching", "Due Diligence Prep"]
    },
    {
      id: "financial-modeling",
      name: "Financial Modeling",
      description: "Revenue projections, cost analysis, and financial forecasts",
      icon: TrendingUp,
      status: "available",
      progress: 0,
      estimatedTime: "35 min",
      dependencies: ["business-strategy"],
      aiFeatures: ["Revenue Forecasting", "Cost Optimization", "Scenario Planning"]
    },
    {
      id: "product-development",
      name: "Product Development",
      description: "Technical specifications, development roadmap, and feature prioritization",
      icon: Lightbulb,
      status: "locked",
      progress: 0,
      estimatedTime: "25 min",
      dependencies: ["roadmap-planning"],
      aiFeatures: ["Feature Prioritization", "Technical Architecture", "Sprint Planning"]
    },
    {
      id: "team-building",
      name: "Team Building",
      description: "Hiring strategy, organizational structure, and culture development",
      icon: Users,
      status: "locked",
      progress: 0,
      estimatedTime: "20 min",
      dependencies: ["funding-strategy"],
      aiFeatures: ["Role Definition", "Hiring Plans", "Culture Framework"]
    },
    {
      id: "market-expansion",
      name: "Market Expansion",
      description: "Growth strategies, international markets, and scaling plans",
      icon: Globe,
      status: "locked",
      progress: 0,
      estimatedTime: "28 min",
      dependencies: ["marketing-intelligence", "funding-strategy"],
      aiFeatures: ["Market Sizing", "Entry Strategies", "Localization Plans"]
    },
    {
      id: "operations-scaling",
      name: "Operations Scaling",
      description: "Process optimization, systems integration, and operational efficiency",
      icon: Building,
      status: "locked",
      progress: 0,
      estimatedTime: "22 min",
      dependencies: ["team-building"],
      aiFeatures: ["Process Mapping", "System Integration", "Efficiency Analysis"]
    }
  ]);

  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    const completedModules = modules.filter(m => m.status === "completed").length;
    const totalModules = modules.length;
    setOverallProgress((completedModules / totalModules) * 100);
  }, [modules]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "in-progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "available": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "locked": return "bg-gray-100 text-gray-600 border-gray-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "in-progress": return <Clock className="w-4 h-4" />;
      case "available": return <Zap className="w-4 h-4" />;
      case "locked": return <Lock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleModuleClick = (module: ModuleStatus) => {
    if (module.status === "available" || module.status === "in-progress" || module.status === "completed") {
      onModuleSelect(module.id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {companyData.companyName} Business Modules
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              Complete your comprehensive startup development journey
            </p>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-100 text-blue-800">{companyData.industry}</Badge>
              <Badge variant="outline">{companyData.stage}</Badge>
              <Badge variant="outline">{companyData.location}</Badge>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {Math.round(overallProgress)}%
            </div>
            <p className="text-slate-600 font-medium">Overall Progress</p>
            <Progress value={overallProgress} className="w-32 mt-2" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">
              {modules.filter(m => m.status === "completed").length}
            </div>
            <p className="text-sm text-slate-600">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">
              {modules.filter(m => m.status === "in-progress").length}
            </div>
            <p className="text-sm text-slate-600">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">
              {modules.filter(m => m.status === "available").length}
            </div>
            <p className="text-sm text-slate-600">Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Lock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">
              {modules.filter(m => m.status === "locked").length}
            </div>
            <p className="text-sm text-slate-600">Locked</p>
          </CardContent>
        </Card>
      </div>

      {/* Modules Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card 
            key={module.id}
            className={`transition-all duration-300 hover:shadow-lg ${
              module.status === "locked" 
                ? "opacity-60 cursor-not-allowed" 
                : "cursor-pointer hover:scale-105"
            }`}
            onClick={() => handleModuleClick(module)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  module.status === "completed" ? "bg-green-100" :
                  module.status === "in-progress" ? "bg-blue-100" :
                  module.status === "available" ? "bg-yellow-100" : "bg-gray-100"
                }`}>
                  <module.icon className={`w-6 h-6 ${
                    module.status === "completed" ? "text-green-600" :
                    module.status === "in-progress" ? "text-blue-600" :
                    module.status === "available" ? "text-yellow-600" : "text-gray-400"
                  }`} />
                </div>
                <Badge className={getStatusColor(module.status)}>
                  {getStatusIcon(module.status)}
                  <span className="ml-1 capitalize">{module.status.replace("-", " ")}</span>
                </Badge>
              </div>
              <CardTitle className="text-lg">{module.name}</CardTitle>
              <p className="text-sm text-slate-600">{module.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {module.progress > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-medium">{module.progress}%</span>
                  </div>
                  <Progress value={module.progress} className="h-2" />
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Est. Time:</span>
                <span className="font-medium">{module.estimatedTime}</span>
              </div>

              {module.dependencies && module.dependencies.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Dependencies:</p>
                  <div className="flex flex-wrap gap-1">
                    {module.dependencies.map((dep) => (
                      <Badge key={dep} variant="outline" className="text-xs">
                        {modules.find(m => m.id === dep)?.name || dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs text-slate-500 mb-2">AI Features:</p>
                <div className="flex flex-wrap gap-1">
                  {module.aiFeatures.slice(0, 2).map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {feature}
                    </Badge>
                  ))}
                  {module.aiFeatures.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{module.aiFeatures.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              {module.status !== "locked" && (
                <Button 
                  className="w-full mt-4" 
                  variant={module.status === "completed" ? "outline" : "default"}
                >
                  {module.status === "completed" ? "Review & Edit" : 
                   module.status === "in-progress" ? "Continue" : "Start Module"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Recommended Action */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Recommended Next Step
              </h3>
              <p className="text-blue-700">
                Complete your Marketing Intelligence module to unlock advanced features
              </p>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => onModuleSelect("marketing-intelligence")}
            >
              Continue Marketing Intelligence
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}