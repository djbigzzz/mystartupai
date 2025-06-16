import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Code2, 
  Smartphone, 
  Globe, 
  Database, 
  Zap, 
  Rocket, 
  Download, 
  Play, 
  CheckCircle,
  Clock,
  Users,
  DollarSign,
  Target,
  Layers,
  GitBranch,
  Cloud,
  Settings,
  Monitor,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  Shield
} from "lucide-react";

interface MVPTemplate {
  id: string;
  name: string;
  description: string;
  type: "web" | "mobile" | "saas" | "ecommerce" | "marketplace" | "fintech";
  complexity: "simple" | "medium" | "complex";
  timeEstimate: string;
  features: string[];
  techStack: string[];
  icon: React.ComponentType<any>;
  popular: boolean;
  buildTime: string;
  users: number;
  revenue: string;
}

interface CodeGenerator {
  id: string;
  name: string;
  description: string;
  category: "frontend" | "backend" | "fullstack" | "mobile" | "ai";
  framework: string;
  features: string[];
  codePreview: string;
  icon: React.ComponentType<any>;
}

interface MVPBuilderProps {
  companyData: any;
  businessPlan?: any;
}

export default function MVPBuilder({ companyData, businessPlan }: MVPBuilderProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<MVPTemplate | null>(null);
  const [selectedGenerator, setSelectedGenerator] = useState<CodeGenerator | null>(null);
  const [buildProgress, setBuildProgress] = useState(0);
  const [isBuilding, setIsBuilding] = useState(false);
  const [activeTab, setActiveTab] = useState("templates");

  const mvpTemplates: MVPTemplate[] = [
    {
      id: "saas-dashboard",
      name: "SaaS Dashboard",
      description: "Complete SaaS platform with user management, billing, and analytics",
      type: "saas",
      complexity: "complex",
      timeEstimate: "2-3 weeks",
      features: ["User Authentication", "Subscription Management", "Analytics Dashboard", "API Integration", "Admin Panel"],
      techStack: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
      icon: BarChart3,
      popular: true,
      buildTime: "15 minutes",
      users: 50000,
      revenue: "$2M ARR"
    },
    {
      id: "marketplace",
      name: "Marketplace Platform",
      description: "Two-sided marketplace with vendor management and payment processing",
      type: "marketplace",
      complexity: "complex",
      timeEstimate: "3-4 weeks",
      features: ["Vendor Onboarding", "Payment Processing", "Rating System", "Search & Filters", "Order Management"],
      techStack: ["Next.js", "Express", "MongoDB", "Stripe Connect", "Redis"],
      icon: ShoppingCart,
      popular: true,
      buildTime: "20 minutes",
      users: 25000,
      revenue: "$800K GMV"
    },
    {
      id: "mobile-app",
      name: "Mobile App Starter",
      description: "Cross-platform mobile app with native features and cloud backend",
      type: "mobile",
      complexity: "medium",
      timeEstimate: "2-3 weeks",
      features: ["Push Notifications", "Offline Mode", "Camera Integration", "Social Login", "Real-time Updates"],
      techStack: ["React Native", "Firebase", "Node.js", "MongoDB", "OneSignal"],
      icon: Smartphone,
      popular: false,
      buildTime: "12 minutes",
      users: 15000,
      revenue: "$150K ARR"
    },
    {
      id: "ai-chatbot",
      name: "AI Chat Platform",
      description: "Intelligent chatbot platform with custom training and integrations",
      type: "saas",
      complexity: "complex",
      timeEstimate: "2-4 weeks",
      features: ["Custom AI Training", "Multi-channel Deploy", "Analytics", "API Access", "White-label Options"],
      techStack: ["Python", "FastAPI", "OpenAI", "React", "PostgreSQL"],
      icon: MessageSquare,
      popular: true,
      buildTime: "18 minutes",
      users: 12000,
      revenue: "$500K ARR"
    },
    {
      id: "fintech-app",
      name: "FinTech Solution",
      description: "Financial application with secure transactions and compliance features",
      type: "fintech",
      complexity: "complex",
      timeEstimate: "4-6 weeks",
      features: ["KYC/AML Compliance", "Secure Transactions", "Multi-currency", "Banking APIs", "Fraud Detection"],
      techStack: ["React", "Node.js", "PostgreSQL", "Plaid", "AWS KMS"],
      icon: DollarSign,
      popular: false,
      buildTime: "25 minutes",
      users: 8000,
      revenue: "$1.2M ARR"
    },
    {
      id: "landing-page",
      name: "Landing Page Generator",
      description: "High-converting landing pages with A/B testing and analytics",
      type: "web",
      complexity: "simple",
      timeEstimate: "3-5 days",
      features: ["A/B Testing", "Form Builder", "Analytics", "SEO Optimization", "Mobile Responsive"],
      techStack: ["Next.js", "Tailwind", "Vercel", "Google Analytics", "Mailchimp"],
      icon: Globe,
      popular: true,
      buildTime: "5 minutes",
      users: 100000,
      revenue: "$300K ARR"
    }
  ];

  const codeGenerators: CodeGenerator[] = [
    {
      id: "react-component",
      name: "React Component Generator",
      description: "Generate custom React components with TypeScript and styling",
      category: "frontend",
      framework: "React",
      features: ["TypeScript Support", "Tailwind CSS", "Storybook Stories", "Unit Tests", "Props Interface"],
      codePreview: `interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button = ({ variant, children, onClick }: ButtonProps) => {
  return (
    <button 
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};`,
      icon: Code2
    },
    {
      id: "api-endpoints",
      name: "REST API Generator",
      description: "Generate complete REST API with authentication and database integration",
      category: "backend",
      framework: "Express.js",
      features: ["JWT Authentication", "Database Models", "Validation", "Error Handling", "API Documentation"],
      codePreview: `// User routes with authentication
router.post('/api/users', authenticate, async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});`,
      icon: Database
    },
    {
      id: "ai-integration",
      name: "AI Integration Kit",
      description: "Ready-to-use AI integrations with OpenAI, Claude, and custom models",
      category: "ai",
      framework: "Python/Node.js",
      features: ["Multiple AI Providers", "Rate Limiting", "Cost Tracking", "Custom Prompts", "Streaming Support"],
      codePreview: `const aiService = new AIService({
  provider: 'openai',
  model: 'gpt-4',
  maxTokens: 1000
});

const response = await aiService.generateText({
  prompt: 'Generate a product description',
  context: productData
});`,
      icon: Zap
    },
    {
      id: "mobile-screens",
      name: "Mobile Screen Templates",
      description: "Pre-built mobile screens with navigation and state management",
      category: "mobile",
      framework: "React Native",
      features: ["Navigation Setup", "State Management", "Form Handling", "Offline Support", "Push Notifications"],
      codePreview: `const LoginScreen = () => {
  const [credentials, setCredentials] = useState({});
  
  const handleLogin = async () => {
    await auth.signIn(credentials);
    navigation.navigate('Dashboard');
  };
  
  return <LoginForm onSubmit={handleLogin} />;
};`,
      icon: Smartphone
    }
  ];

  const handleBuildMVP = async (template: MVPTemplate) => {
    setIsBuilding(true);
    setBuildProgress(0);
    
    // Simulate MVP building process
    const steps = [
      "Initializing project structure...",
      "Setting up database schema...",
      "Generating authentication system...",
      "Creating core components...",
      "Implementing business logic...",
      "Setting up deployment configuration...",
      "Running tests and optimization...",
      "Finalizing MVP build..."
    ];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setBuildProgress(((i + 1) / steps.length) * 100);
    }
    
    setIsBuilding(false);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "simple": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "complex": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "web": return Globe;
      case "mobile": return Smartphone;
      case "saas": return BarChart3;
      case "ecommerce": return ShoppingCart;
      case "marketplace": return Users;
      case "fintech": return DollarSign;
      default: return Code2;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">MVP Builder & Code Generator</h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Transform your business plan into a working MVP with our intelligent code generation and template system.
          Choose from proven templates or generate custom components.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">MVP Templates</TabsTrigger>
          <TabsTrigger value="generator">Code Generator</TabsTrigger>
          <TabsTrigger value="deployment">Deploy & Launch</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mvpTemplates.map((template) => {
              const IconComponent = template.icon;
              const TypeIcon = getTypeIcon(template.type);
              
              return (
                <Card key={template.id} className="relative hover:shadow-lg transition-shadow">
                  {template.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500">
                      Popular
                    </Badge>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <TypeIcon className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-500 capitalize">{template.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-2">{template.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getComplexityColor(template.complexity)}>
                        {template.complexity}
                      </Badge>
                      <span className="text-sm text-slate-600">{template.timeEstimate}</span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Key Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {template.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {template.features.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Tech Stack:</h4>
                      <div className="flex flex-wrap gap-1">
                        {template.techStack.map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="font-semibold text-sm">{template.buildTime}</div>
                        <div className="text-xs text-slate-500">Build Time</div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{template.users.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">Users</div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{template.revenue}</div>
                        <div className="text-xs text-slate-500">Potential</div>
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => {
                        setSelectedTemplate(template);
                        handleBuildMVP(template);
                      }}
                      disabled={isBuilding}
                    >
                      {isBuilding && selectedTemplate?.id === template.id ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Building MVP...
                        </>
                      ) : (
                        <>
                          <Rocket className="w-4 h-4 mr-2" />
                          Build MVP
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {isBuilding && selectedTemplate && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 animate-spin" />
                  Building {selectedTemplate.name}
                </CardTitle>
                <CardDescription>
                  Your MVP is being generated with all the features and integrations you need.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={buildProgress} className="w-full" />
                  <div className="text-center text-sm text-slate-600">
                    {buildProgress}% Complete
                  </div>
                  {buildProgress === 100 && (
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-green-600 font-medium">MVP Build Complete!</p>
                      <Button className="mt-4">
                        <Download className="w-4 h-4 mr-2" />
                        Download Code
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {codeGenerators.map((generator) => {
              const IconComponent = generator.icon;
              
              return (
                <Card key={generator.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <IconComponent className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{generator.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {generator.framework}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="mt-2">{generator.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {generator.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Code Preview:</h4>
                      <div className="bg-slate-900 rounded-lg p-3 text-xs text-slate-300 font-mono overflow-x-auto">
                        <pre>{generator.codePreview}</pre>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1">
                        <Play className="w-4 h-4 mr-2" />
                        Generate Code
                      </Button>
                      <Button variant="outline">
                        <GitBranch className="w-4 h-4 mr-2" />
                        View Docs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Cloud className="w-8 h-8 text-blue-500" />
                  <div>
                    <CardTitle>Cloud Hosting</CardTitle>
                    <CardDescription>Deploy to AWS, Vercel, or Netlify</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-scaling</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SSL Certificate</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CDN Distribution</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <Button className="w-full mt-4">
                    <Cloud className="w-4 h-4 mr-2" />
                    Deploy to Cloud
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Monitor className="w-8 h-8 text-purple-500" />
                  <div>
                    <CardTitle>Domain Setup</CardTitle>
                    <CardDescription>Custom domain and DNS configuration</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Domain Registration</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">DNS Management</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Setup</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <Button className="w-full mt-4">
                    <Globe className="w-4 h-4 mr-2" />
                    Configure Domain
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-green-500" />
                  <div>
                    <CardTitle>Security & Monitoring</CardTitle>
                    <CardDescription>Security setup and performance monitoring</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Security Scan</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Performance Monitoring</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Error Tracking</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <Button className="w-full mt-4">
                    <Shield className="w-4 h-4 mr-2" />
                    Setup Security
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Launch Checklist</CardTitle>
              <CardDescription>Complete these steps before going live</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Code quality review</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Security vulnerability scan</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Performance optimization</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Database backup setup</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Analytics integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>SEO optimization</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Mobile responsiveness</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Legal pages (Privacy, Terms)</span>
                  </div>
                </div>
              </div>
              <Button size="lg" className="w-full mt-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                <Rocket className="w-5 h-5 mr-2" />
                Launch MVP
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}