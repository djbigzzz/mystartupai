import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Rocket, 
  Code, 
  Smartphone,
  Globe,
  Database,
  ArrowLeft,
  Download,
  Eye,
  Zap,
  CheckCircle,
  Clock,
  Layers,
  Cpu,
  Cloud,
  Shield
} from "lucide-react";
import { Link } from "wouter";

interface MVPTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  features: string[];
  techStack: string[];
  timeToComplete: string;
  complexity: "Beginner" | "Intermediate" | "Advanced";
  category: "SaaS" | "E-commerce" | "Social" | "Fintech" | "Healthcare" | "Education";
  preview?: string;
}

export default function MVPBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedCode, setGeneratedCode] = useState<any>(null);

  const mvpTemplates: MVPTemplate[] = [
    {
      id: "saas-dashboard",
      name: "SaaS Dashboard",
      description: "Complete SaaS application with authentication, billing, and analytics dashboard",
      icon: Globe,
      features: [
        "User authentication & authorization",
        "Subscription billing integration", 
        "Admin dashboard with analytics",
        "API endpoints with rate limiting",
        "Email notifications",
        "Database with migrations"
      ],
      techStack: ["React", "Node.js", "PostgreSQL", "Stripe", "JWT"],
      timeToComplete: "2-3 days",
      complexity: "Advanced",
      category: "SaaS",
      preview: "Modern responsive dashboard with dark/light themes"
    },
    {
      id: "ecommerce-store",
      name: "E-commerce Store",
      description: "Full-featured online store with product management and payment processing",
      icon: Layers,
      features: [
        "Product catalog with categories",
        "Shopping cart & checkout",
        "Payment processing (Stripe/PayPal)",
        "Order management system",
        "Customer accounts",
        "Admin product management"
      ],
      techStack: ["Next.js", "Prisma", "SQLite", "Stripe", "Tailwind"],
      timeToComplete: "3-4 days",
      complexity: "Advanced",
      category: "E-commerce"
    },
    {
      id: "social-platform",
      name: "Social Platform",
      description: "Social networking app with posts, comments, and real-time messaging",
      icon: Smartphone,
      features: [
        "User profiles & authentication",
        "Post creation & feed",
        "Comments & reactions",
        "Real-time messaging",
        "Follow/unfollow system",
        "Image upload & storage"
      ],
      techStack: ["React Native", "Firebase", "Node.js", "Socket.io"],
      timeToComplete: "4-5 days",
      complexity: "Advanced",
      category: "Social"
    },
    {
      id: "fintech-app",
      name: "Fintech App",
      description: "Personal finance management with budgeting and expense tracking",
      icon: Database,
      features: [
        "Expense tracking & categorization",
        "Budget creation & monitoring",
        "Financial goal setting",
        "Transaction import (CSV/API)",
        "Visual analytics & reports",
        "Bank account integration"
      ],
      techStack: ["Vue.js", "Python/FastAPI", "PostgreSQL", "Plaid API"],
      timeToComplete: "3-4 days",
      complexity: "Intermediate",
      category: "Fintech"
    },
    {
      id: "learning-platform",
      name: "Learning Platform",
      description: "Online education platform with courses, quizzes, and progress tracking",
      icon: Code,
      features: [
        "Course creation & management",
        "Video streaming integration",
        "Interactive quizzes",
        "Progress tracking",
        "Certificate generation",
        "Student-instructor messaging"
      ],
      techStack: ["React", "Express", "MongoDB", "AWS S3", "FFmpeg"],
      timeToComplete: "5-6 days",
      complexity: "Advanced",
      category: "Education"
    },
    {
      id: "healthcare-portal",
      name: "Healthcare Portal",
      description: "Patient management system with appointments and medical records",
      icon: Shield,
      features: [
        "Patient registration & profiles",
        "Appointment scheduling",
        "Medical record management",
        "Doctor-patient messaging",
        "Prescription management",
        "HIPAA compliance features"
      ],
      techStack: ["Angular", "C#/.NET", "SQL Server", "Azure", "HL7"],
      timeToComplete: "6-8 days",
      complexity: "Advanced",
      category: "Healthcare"
    }
  ];

  const handleGenerateMVP = async () => {
    if (!selectedTemplate || !projectName) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);
    
    const template = mvpTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    // Simulate MVP generation process
    const steps = [
      "Setting up project structure...",
      "Generating database schema...", 
      "Creating authentication system...",
      "Building core components...",
      "Setting up API endpoints...",
      "Implementing business logic...",
      "Adding styling and UI...",
      "Configuring deployment...",
      "Running tests and validation...",
      "Packaging final code..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setGenerationProgress(((i + 1) / steps.length) * 100);
    }

    // Simulate generated code structure
    setGeneratedCode({
      projectName,
      template: template.name,
      files: [
        { name: "package.json", type: "config", size: "2.1 KB" },
        { name: "src/App.js", type: "component", size: "4.3 KB" },
        { name: "src/components/", type: "directory", size: "12 files" },
        { name: "src/pages/", type: "directory", size: "8 files" },
        { name: "src/utils/", type: "directory", size: "5 files" },
        { name: "server/", type: "directory", size: "15 files" },
        { name: "database/", type: "directory", size: "6 files" },
        { name: "README.md", type: "documentation", size: "3.2 KB" }
      ],
      features: template.features,
      techStack: template.techStack,
      deploymentInstructions: true,
      estimatedValue: "$25,000 - $50,000"
    });

    setIsGenerating(false);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
              Building Your MVP
            </CardTitle>
            <div className="flex items-center justify-center mb-6">
              <Rocket className="w-12 h-12 text-blue-600 animate-bounce" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {projectName}
              </h3>
              <p className="text-gray-600 mb-6">
                Our AI is generating a complete, production-ready codebase for your startup
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Generation Progress</span>
                <span>{Math.round(generationProgress)}%</span>
              </div>
              <Progress value={generationProgress} className="h-3" />
            </div>
            
            <div className="text-center text-sm text-gray-500">
              This may take 3-5 minutes to ensure high-quality code generation
            </div>

            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-600">Ready to Deploy</div>
                <div className="text-blue-500">Production configuration included</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-semibold text-green-600">Full Documentation</div>
                <div className="text-green-500">Setup & deployment guides</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (generatedCode) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">MVP Generated Successfully!</h1>
                  <p className="text-gray-600">{generatedCode.projectName} is ready for deployment</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Complete
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Overview */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedCode.files.map((file: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            {file.type === "directory" ? <Layers className="w-4 h-4 text-blue-600" /> : <Code className="w-4 h-4 text-blue-600" />}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{file.name}</div>
                            <div className="text-sm text-gray-500 capitalize">{file.type}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">{file.size}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Included Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {generatedCode.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions & Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Download Your MVP</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download Complete Project
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Live Demo
                  </Button>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-gray-900 mb-3">Estimated Value</h4>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {generatedCode.estimatedValue}
                    </div>
                    <p className="text-sm text-gray-600">
                      Based on equivalent development costs
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tech Stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {generatedCode.techStack.map((tech: string, index: number) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-blue-600">1</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Setup Development</div>
                      <div className="text-sm text-gray-600">Follow README instructions</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-green-600">2</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Deploy to Production</div>
                      <div className="text-sm text-gray-600">Use included deployment configs</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-purple-600">3</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Customize & Scale</div>
                      <div className="text-sm text-gray-600">Add your unique features</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MVP Builder</h1>
                <p className="text-gray-600">Generate production-ready code for your startup</p>
              </div>
            </div>
            <Badge className="bg-purple-100 text-purple-800">
              <Zap className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="templates">Choose Template</TabsTrigger>
            <TabsTrigger value="configure" disabled={!selectedTemplate}>Configure Project</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mvpTemplates.map((template) => {
                const IconComponent = template.icon;
                const isSelected = selectedTemplate === template.id;
                
                return (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <Badge className={getComplexityColor(template.complexity)}>
                          {template.complexity}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 text-sm">{template.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Time to complete:</span>
                          <span className="font-medium">{template.timeToComplete}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <Badge variant="outline" className="text-xs">{template.category}</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Key Features:</div>
                        <div className="space-y-1">
                          {template.features.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="text-xs text-gray-600 flex items-center">
                              <CheckCircle className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                          {template.features.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{template.features.length - 3} more features
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {selectedTemplate && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-900">
                        {mvpTemplates.find(t => t.id === selectedTemplate)?.name} Selected
                      </h3>
                      <p className="text-blue-700 text-sm">
                        Configure your project details to generate code
                      </p>
                    </div>
                    <Button onClick={() => {
                      const tabs = document.querySelector('[value="configure"]') as HTMLElement;
                      tabs?.click();
                    }}>
                      Continue to Configuration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="configure" className="space-y-6">
            {selectedTemplate && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Name *
                        </label>
                        <Input
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          placeholder="e.g., TaskFlow Pro, EcoShop, FinanceTracker"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Description
                        </label>
                        <Textarea
                          value={projectDescription}
                          onChange={(e) => setProjectDescription(e.target.value)}
                          placeholder="Describe what your MVP should do and any specific requirements..."
                          className="min-h-[100px]"
                        />
                      </div>

                      <Button 
                        onClick={handleGenerateMVP}
                        disabled={!projectName.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        size="lg"
                      >
                        <Rocket className="w-5 h-5 mr-2" />
                        Generate MVP Code
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Template Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {(() => {
                        const template = mvpTemplates.find(t => t.id === selectedTemplate);
                        return template ? (
                          <>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Tech Stack</h4>
                              <div className="flex flex-wrap gap-1">
                                {template.techStack.map((tech, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">All Features</h4>
                              <div className="space-y-1">
                                {template.features.map((feature, index) => (
                                  <div key={index} className="text-sm text-gray-600 flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    {feature}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="pt-4 border-t">
                              <div className="text-sm text-gray-600 space-y-1">
                                <div><strong>Complexity:</strong> {template.complexity}</div>
                                <div><strong>Category:</strong> {template.category}</div>
                                <div><strong>Est. Time:</strong> {template.timeToComplete}</div>
                              </div>
                            </div>
                          </>
                        ) : null;
                      })()}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}