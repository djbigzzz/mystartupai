import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Lightbulb, 
  Settings, 
  Layers,
  Code,
  Brain,
  Zap,
  Users,
  Target,
  CheckCircle,
  Clock,
  ArrowRight,
  Smartphone,
  Monitor,
  Globe,
  Database,
  Shield,
  Rocket,
  GitBranch,
  TestTube,
  BarChart3
} from "lucide-react";

interface ProductDevelopmentProps {
  companyData: any;
}

export default function ProductDevelopment({ companyData }: ProductDevelopmentProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isGenerating, setIsGenerating] = useState(false);
  const [completionScore, setCompletionScore] = useState(35);

  const developmentModules = [
    {
      id: "mvp-definition",
      name: "MVP Definition",
      description: "Define minimum viable product features and core functionality",
      icon: Target,
      completion: 70,
      estimatedTime: "20 min",
      aiFeatures: ["Feature Prioritization", "User Story Generation", "MVP Scope AI"]
    },
    {
      id: "user-experience",
      name: "User Experience Design",
      description: "Create user-centered design and optimal user journeys",
      icon: Users,
      completion: 50,
      estimatedTime: "30 min",
      aiFeatures: ["User Flow Generator", "Wireframe AI", "Usability Testing"]
    },
    {
      id: "tech-stack",
      name: "Technical Architecture",
      description: "Choose optimal technology stack and system architecture",
      icon: Layers,
      completion: 40,
      estimatedTime: "25 min",
      aiFeatures: ["Stack Recommender", "Architecture Planner", "Scalability Analysis"]
    },
    {
      id: "development-plan",
      name: "Development Roadmap",
      description: "Sprint planning, timeline estimation, and resource allocation",
      icon: GitBranch,
      completion: 30,
      estimatedTime: "35 min",
      aiFeatures: ["Sprint Planner", "Timeline Optimizer", "Resource Calculator"]
    },
    {
      id: "quality-assurance",
      name: "Quality & Testing",
      description: "Testing strategy, quality metrics, and validation framework",
      icon: TestTube,
      completion: 20,
      estimatedTime: "20 min",
      aiFeatures: ["Test Case Generator", "QA Strategy", "Performance Metrics"]
    },
    {
      id: "launch-strategy",
      name: "Product Launch",
      description: "Go-to-market execution, user onboarding, and feedback loops",
      icon: Rocket,
      completion: 10,
      estimatedTime: "30 min",
      aiFeatures: ["Launch Checklist", "Onboarding Flow", "Feedback System"]
    }
  ];

  const mvpFrameworks = [
    {
      name: "Build-Measure-Learn Cycle",
      description: "Lean startup methodology for rapid iteration and validation",
      category: "Methodology",
      difficulty: "Beginner",
      status: "available"
    },
    {
      name: "Feature Prioritization Matrix",
      description: "Impact vs effort analysis for feature selection",
      category: "Planning",
      difficulty: "Beginner", 
      status: "completed"
    },
    {
      name: "User Story Mapping",
      description: "Visualize user journey and identify core features",
      category: "UX Design",
      difficulty: "Intermediate",
      status: "in-progress"
    },
    {
      name: "Concierge MVP",
      description: "Manual service delivery before building automation",
      category: "Validation",
      difficulty: "Beginner",
      status: "available"
    },
    {
      name: "Wizard of Oz MVP",
      description: "Fake the backend to test frontend assumptions",
      category: "Validation",
      difficulty: "Intermediate",
      status: "available"
    },
    {
      name: "Technical Debt Management",
      description: "Balance speed vs quality in early development",
      category: "Engineering",
      difficulty: "Advanced",
      status: "pending"
    }
  ];

  const productMetrics = [
    {
      name: "Time to MVP",
      value: "8 weeks",
      target: "6-12 weeks",
      status: "on-track",
      description: "Estimated development timeline"
    },
    {
      name: "Feature Complexity",
      value: "Medium",
      target: "Simple-Medium", 
      status: "good",
      description: "Complexity assessment of core features"
    },
    {
      name: "Technical Risk",
      value: "Low",
      target: "Low-Medium",
      status: "good", 
      description: "Risk level of chosen technology stack"
    },
    {
      name: "Resource Requirements",
      value: "2-3 devs",
      target: "1-3 devs",
      status: "on-track",
      description: "Estimated team size needed"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-green-600";
      case "on-track": return "text-blue-600";
      case "at-risk": return "text-yellow-600";
      case "delayed": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getModuleStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "available": return "bg-yellow-100 text-yellow-800";
      case "pending": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Product Development</h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Build your MVP with AI-powered development tools. From feature prioritization to technical architecture, 
          get expert guidance to ship your product faster and validate core assumptions.
        </p>
      </div>

      {/* Product Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {productMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-600">{metric.name}</h3>
                <span className={`text-xs font-medium ${getStatusColor(metric.status)}`}>
                  {metric.status}
                </span>
              </div>
              <div className={`text-2xl font-bold ${getStatusColor(metric.status)} mb-1`}>
                {metric.value}
              </div>
              <p className="text-xs text-slate-500 mb-1">Target: {metric.target}</p>
              <p className="text-xs text-slate-500">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Development Overview</TabsTrigger>
          <TabsTrigger value="modules">AI Modules</TabsTrigger>
          <TabsTrigger value="frameworks">MVP Frameworks</TabsTrigger>
          <TabsTrigger value="roadmap">Development Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* MVP Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>MVP Development Progress</CardTitle>
                  <CardDescription>Track progress across all product development areas</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{completionScore}%</div>
                  <Progress value={completionScore} className="w-32 mt-2" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {developmentModules.slice(0, 3).map((module) => {
                  const IconComponent = module.icon;
                  return (
                    <div key={module.id} className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <IconComponent className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="font-medium text-slate-900 mb-1">{module.name}</h3>
                      <div className="text-lg font-bold text-slate-700 mb-1">{module.completion}%</div>
                      <Progress value={module.completion} className="w-full" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Core Development Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                Core Product Questions
              </CardTitle>
              <CardDescription>
                Essential questions to guide your MVP development process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "What's the smallest version that solves the core problem?",
                  "Which features are absolutely essential for launch?",
                  "How will you measure product-market fit?",
                  "What's your technical architecture and why?",
                  "How will users discover and onboard to your product?",
                  "What's your plan for gathering and acting on user feedback?"
                ].map((question, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{question}</p>
                      <Button variant="link" className="p-0 h-auto text-purple-600 text-sm">
                        Get AI Guidance →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Technology Stack Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="w-5 h-5 mr-2 text-green-600" />
                AI-Recommended Tech Stack
              </CardTitle>
              <CardDescription>
                Optimized technology choices based on your business requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <h3 className="font-medium text-slate-900 flex items-center">
                    <Monitor className="w-4 h-4 mr-2" />
                    Frontend
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm font-medium">React + TypeScript</span>
                      <Badge variant="secondary">Recommended</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm">Next.js</span>
                      <Badge variant="outline">Alternative</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-slate-900 flex items-center">
                    <Database className="w-4 h-4 mr-2" />
                    Backend
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm font-medium">Node.js + Express</span>
                      <Badge variant="secondary">Recommended</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm">Python + FastAPI</span>
                      <Badge variant="outline">Alternative</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-slate-900 flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Deployment
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                      <span className="text-sm font-medium">Vercel + Railway</span>
                      <Badge variant="secondary">Recommended</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm">AWS + Docker</span>
                      <Badge variant="outline">Alternative</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {developmentModules.map((module) => {
              const IconComponent = module.icon;
              
              return (
                <Card key={module.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <IconComponent className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{module.name}</CardTitle>
                          <CardDescription className="mt-1">{module.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600">{module.completion}%</div>
                        <Progress value={module.completion} className="w-16 mt-1" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>⏱️ {module.estimatedTime}</span>
                      <Badge variant="secondary">{module.aiFeatures.length} AI Tools</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-slate-700">AI Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {module.aiFeatures.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => setIsGenerating(true)}
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
                          Start Module
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="frameworks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>MVP Development Frameworks</CardTitle>
              <CardDescription>
                Proven methodologies for building successful minimum viable products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mvpFrameworks.map((framework, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-medium text-slate-900">{framework.name}</h3>
                        <Badge className={getModuleStatusColor(framework.status)}>
                          {framework.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {framework.category}
                        </Badge>
                        <span className="text-xs text-slate-500">{framework.difficulty}</span>
                      </div>
                      <p className="text-sm text-slate-600">{framework.description}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Development Roadmap</CardTitle>
              <CardDescription>
                Your AI-generated development timeline and milestone plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Timeline */}
                <div className="relative">
                  {[
                    { phase: "Week 1-2", title: "MVP Planning & Design", status: "completed" },
                    { phase: "Week 3-4", title: "Core Development", status: "in-progress" },
                    { phase: "Week 5-6", title: "Testing & Refinement", status: "upcoming" },
                    { phase: "Week 7-8", title: "Launch Preparation", status: "upcoming" }
                  ].map((milestone, index) => (
                    <div key={index} className="flex items-center space-x-4 pb-6">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        milestone.status === 'completed' ? 'bg-green-500 border-green-500' :
                        milestone.status === 'in-progress' ? 'bg-blue-500 border-blue-500' :
                        'bg-white border-slate-300'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-slate-900">{milestone.title}</h3>
                          <Badge variant="secondary" className="text-xs">{milestone.phase}</Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                          {milestone.status === 'completed' && "✅ Completed successfully"}
                          {milestone.status === 'in-progress' && "🔄 Currently in progress"}
                          {milestone.status === 'upcoming' && "⏳ Scheduled to start soon"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-4">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Brain className="w-5 h-5 mr-2" />
                    Generate Detailed Roadmap
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}