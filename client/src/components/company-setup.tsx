import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building2, 
  Users, 
  Target, 
  Globe,
  Lightbulb,
  CheckCircle,
  Clock,
  Brain,
  Zap,
  TrendingUp,
  User,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Rocket,
  AlertCircle,
  Download
} from "lucide-react";

interface CompanySetupProps {
  companyData: any;
  onUpdate: (data: any) => void;
}

export default function CompanySetup({ companyData, onUpdate }: CompanySetupProps) {
  const [activeTab, setActiveTab] = useState("basics");
  const [isGenerating, setIsGenerating] = useState(false);
  const [completionScore, setCompletionScore] = useState(75);

  const setupSections = [
    {
      id: "basics",
      name: "Company Basics",
      icon: Building2,
      completion: 90,
      items: [
        { name: "Company Name", status: "complete" },
        { name: "Mission Statement", status: "complete" },
        { name: "Industry Selection", status: "complete" },
        { name: "Business Model", status: "in-progress" }
      ]
    },
    {
      id: "founders",
      name: "Founder Profile",
      icon: Users,
      completion: 60,
      items: [
        { name: "Founder Backgrounds", status: "complete" },
        { name: "Equity Distribution", status: "in-progress" },
        { name: "Roles & Responsibilities", status: "pending" },
        { name: "Advisory Board", status: "pending" }
      ]
    },
    {
      id: "market",
      name: "Market Position",
      icon: Target,
      completion: 40,
      items: [
        { name: "Target Market", status: "complete" },
        { name: "Competitive Analysis", status: "in-progress" },
        { name: "Value Proposition", status: "pending" },
        { name: "Market Size", status: "pending" }
      ]
    },
    {
      id: "goals",
      name: "Goals & Metrics",
      icon: TrendingUp,
      completion: 30,
      items: [
        { name: "Key Metrics", status: "pending" },
        { name: "Milestones", status: "pending" },
        { name: "Success Criteria", status: "pending" },
        { name: "Timeline", status: "pending" }
      ]
    }
  ];

  const aiTools = [
    {
      name: "Mission Generator",
      description: "AI-crafted mission statements based on your industry and values",
      icon: Lightbulb,
      action: "Generate Mission"
    },
    {
      name: "Founder Persona Builder",
      description: "Create detailed founder profiles highlighting key strengths",
      icon: User,
      action: "Build Profiles"
    },
    {
      name: "Market Opportunity Scanner",
      description: "Identify market gaps and opportunities in your industry",
      icon: Target,
      action: "Scan Market"
    },
    {
      name: "Competitive Intelligence",
      description: "Analyze competitors and find your unique positioning",
      icon: Brain,
      action: "Analyze Competition"
    },
    {
      name: "Business Model Canvas",
      description: "Generate complete business model with revenue streams",
      icon: Briefcase,
      action: "Create Canvas"
    },
    {
      name: "Metrics Dashboard Setup",
      description: "Define KPIs and success metrics for your startup stage",
      icon: TrendingUp,
      action: "Setup Metrics"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress": return <Clock className="w-4 h-4 text-blue-600" />;
      case "pending": return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleAIGeneration = async (toolName: string) => {
    setIsGenerating(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
    
    // Update completion score
    setCompletionScore(prev => Math.min(100, prev + 10));
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Company Setup</h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Build your startup foundation with AI-powered tools inspired by Y Combinator's proven methodology. 
          Complete your company profile, define your mission, and establish clear goals.
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Setup Progress</CardTitle>
              <CardDescription>Complete all sections to unlock advanced features</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{completionScore}%</div>
              <Progress value={completionScore} className="w-32 mt-2" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {setupSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <div key={section.id} className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-slate-900 mb-1">{section.name}</h3>
                  <div className="text-2xl font-bold text-slate-700 mb-1">{section.completion}%</div>
                  <Progress value={section.completion} className="w-full" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basics">Company Basics</TabsTrigger>
          <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
          <TabsTrigger value="checklist">Completion Checklist</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Company Name</label>
                  <Input value={companyData?.companyName || ""} placeholder="Enter company name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Industry</label>
                  <Input value={companyData?.industry || ""} placeholder="e.g., SaaS, E-commerce, FinTech" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Stage</label>
                  <Input value={companyData?.stage || ""} placeholder="e.g., Idea, MVP, Pre-Seed" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Mission Statement</label>
                  <Textarea 
                    placeholder="Describe your company's mission and purpose..."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Founder Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-600" />
                  Founder Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Founder Names</label>
                  <Input placeholder="Founder 1, Founder 2..." />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Team Size</label>
                  <Input value={companyData?.teamSize || ""} placeholder="e.g., 2 founders, 3 employees" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Location</label>
                  <Input value={companyData?.location || ""} placeholder="City, Country" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Founder Background</label>
                  <Textarea 
                    placeholder="Previous experience, expertise, relevant skills..."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Business Model Canvas Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
                Business Model Canvas
              </CardTitle>
              <CardDescription>
                AI-generated business model framework based on your company information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Value Propositions</h4>
                  <p className="text-sm text-blue-700">
                    AI will analyze your mission and generate key value propositions for your target market.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Customer Segments</h4>
                  <p className="text-sm text-green-700">
                    Identify and profile your ideal customer segments based on industry analysis.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Revenue Streams</h4>
                  <p className="text-sm text-purple-700">
                    Generate potential revenue models and pricing strategies for your business.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiTools.map((tool, index) => {
              const IconComponent = tool.icon;
              
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <CardDescription className="mt-1">{tool.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      onClick={() => handleAIGeneration(tool.name)}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Brain className="w-4 h-4 mr-2 animate-pulse" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          {tool.action}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="checklist" className="space-y-6">
          <div className="space-y-6">
            {setupSections.map((section) => {
              const IconComponent = section.icon;
              
              return (
                <Card key={section.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <IconComponent className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{section.name}</CardTitle>
                          <p className="text-sm text-slate-500">{section.completion}% Complete</p>
                        </div>
                      </div>
                      <Progress value={section.completion} className="w-32" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {section.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(item.status)}
                            <span className="text-sm font-medium text-slate-700">{item.name}</span>
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>
                Complete these actions to move to the next workflow stage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Complete Founder Profiles</p>
                    <p className="text-sm text-blue-700">Fill in detailed founder backgrounds and equity distribution</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-900">Define Success Metrics</p>
                    <p className="text-sm text-yellow-700">Set up key performance indicators and milestones</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Rocket className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Ready for Business Strategy</p>
                    <p className="text-sm text-green-700">Move to step 2 once setup reaches 80% completion</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}