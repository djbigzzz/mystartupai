import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bot, 
  Send, 
  Brain, 
  FileText, 
  Presentation, 
  BarChart3, 
  Target, 
  Users,
  CheckCircle,
  Download,
  Play,
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp,
  DollarSign,
  LineChart,
  Zap,
  Shield,
  Award,
  Rocket,
  Star,
  Eye,
  ThumbsUp,
  AlertTriangle,
  Lightbulb,
  Calculator,
  Search,
  Layers,
  X,
  ChevronRight,
  MessageSquare,
  Mail,
  Loader2
} from "lucide-react";
import { Link } from "wouter";

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  message: string;
  timestamp: Date;
  actions?: Array<{ label: string; action: string; }>;
}

interface AgentTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  category: string;
  duration: number;
  result?: any;
}

interface StartupIdea {
  title: string;
  description: string;
  industry: string;
  stage: string;
  enhanced?: boolean;
}

export default function AgenticDemoUnified() {
  const [phase, setPhase] = useState<'chat' | 'demo-execution'>('chat');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'agent',
      message: "Hello! I'm your autonomous AI startup assistant. I can automatically transform your raw startup idea into investor-ready materials with advanced animations and detailed analysis. Would you like me to demonstrate this with a complete startup transformation?",
      timestamp: new Date(),
      actions: [
        { label: "Start Demo Transformation", action: "start-demo" },
        { label: "Enter Custom Idea", action: "custom-idea" }
      ]
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [currentTask, setCurrentTask] = useState<AgentTask | null>(null);
  const [completedTasks, setCompletedTasks] = useState<AgentTask[]>([]);
  const [startupIdea, setStartupIdea] = useState<StartupIdea>({
    title: "FitAI - AI-Powered Personal Trainer",
    description: "Revolutionary fitness app that uses computer vision and AI to provide real-time form correction, personalized workout plans, and adaptive difficulty based on user performance.",
    industry: "Health & Fitness",
    stage: "Idea"
  });
  
  const [demoResults, setDemoResults] = useState<any>({});
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [activeView, setActiveView] = useState<string>('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const demoTasks: Omit<AgentTask, 'id' | 'status' | 'progress'>[] = [
    {
      title: "Idea Enhancement",
      description: "AI analyzing and enhancing your startup concept",
      category: "enhancement",
      duration: 5
    },
    {
      title: "Market Analysis", 
      description: "Deep market validation and competitive analysis",
      category: "analysis",
      duration: 8
    },
    {
      title: "Business Plan Generation",
      description: "Creating comprehensive 12-section business plan",
      category: "business-plan",
      duration: 15  // Reduced from 60 seconds
    },
    {
      title: "Pitch Deck Creation",
      description: "Generating investor-ready presentation",
      category: "pitch-deck", 
      duration: 10
    },
    {
      title: "Financial Modeling",
      description: "Building 5-year financial projections",
      category: "financial",
      duration: 8
    }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: newMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsAgentTyping(true);

    setTimeout(() => {
      const response = generateResponse(newMessage);
      setChatMessages(prev => [...prev, response]);
      setIsAgentTyping(false);
    }, 1500);
  };

  const generateResponse = (message: string): ChatMessage => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('demo') || lowerMessage.includes('show') || lowerMessage.includes('start')) {
      return {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        message: "Perfect! I'll now demonstrate the complete autonomous startup transformation process. Watch as I enhance your idea, conduct market analysis, generate a business plan, create pitch deck, and build financial models - all automatically with beautiful animations and detailed results.",
        timestamp: new Date(),
        actions: [
          { label: "Begin Transformation", action: "start-demo" }
        ]
      };
    }
    
    return {
      id: (Date.now() + 1).toString(),
      sender: 'agent',
      message: "I can autonomously transform any startup idea into investor-ready materials. Would you like to see the complete demonstration with enhanced animations and detailed analysis?",
      timestamp: new Date(),
      actions: [
        { label: "Start Demo", action: "start-demo" }
      ]
    };
  };

  const executeAction = (action: string) => {
    if (action === 'start-demo') {
      setPhase('demo-execution');
      startDemoSequence();
    }
  };

  const startDemoSequence = () => {
    // Clear previous results
    setDemoResults({});
    setCompletedTasks([]);
    setCurrentTask(null);
    
    // Start first task
    executeTaskSequence(0);
  };

  const executeTaskSequence = (taskIndex: number) => {
    if (taskIndex >= demoTasks.length) {
      // All tasks completed
      setCurrentTask(null);
      return;
    }

    const taskTemplate = demoTasks[taskIndex];
    const task: AgentTask = {
      id: `task-${taskIndex}`,
      ...taskTemplate,
      status: 'in-progress',
      progress: 0
    };

    setCurrentTask(task);

    // Animate progress
    const interval = setInterval(() => {
      setCurrentTask(prev => {
        if (!prev) return null;
        const newProgress = prev.progress + (100 / (task.duration * 10)); // 10 updates per second
        
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Generate result based on task category
          const result = generateTaskResult(task.category);
          setDemoResults(prev => ({ ...prev, [task.category]: result }));
          
          // Move to completed
          setCompletedTasks(prev => [...prev, { ...prev, status: 'completed', progress: 100 }]);
          
          // Start next task after brief delay
          setTimeout(() => {
            executeTaskSequence(taskIndex + 1);
          }, 1000);
          
          return { ...prev, status: 'completed', progress: 100 };
        }
        
        return { ...prev, progress: newProgress };
      });
    }, 100);
  };

  const generateTaskResult = (category: string) => {
    switch (category) {
      case 'enhancement':
        return {
          enhanced: true,
          improvements: [
            "Added AI-powered form correction technology",
            "Integrated personalized workout algorithms", 
            "Enhanced with computer vision capabilities",
            "Added adaptive difficulty system"
          ]
        };
        
      case 'analysis':
        return {
          overallScore: 8.7,
          marketSize: "$96B",
          growth: "14.7%",
          competition: "Moderate", 
          feasibility: 9.1,
          strengths: [
            "Strong market demand for fitness tech",
            "AI differentiation creates competitive moat",
            "Scalable SaaS business model",
            "Growing health consciousness trend"
          ],
          weaknesses: [
            "High customer acquisition costs",
            "Technical complexity in AI development", 
            "Competitive fitness app market"
          ]
        };
        
      case 'business-plan':
        return {
          sections: 12,
          pages: 24,
          highlights: [
            "Executive Summary: AI-powered fitness transformation",
            "Market Analysis: $96B global fitness market",
            "Revenue Model: Freemium SaaS with premium features", 
            "Financial Projections: $5M ARR by Year 3"
          ]
        };
        
      case 'pitch-deck':
        return {
          slides: 10,
          sections: [
            "Problem: Ineffective workout routines",
            "Solution: AI personal trainer app",
            "Market: $96B global opportunity",
            "Business Model: Freemium SaaS",
            "Traction: Early user validation",
            "Team: AI and fitness experts",
            "Financials: Path to profitability",
            "Funding: $2M seed round"
          ]
        };
        
      case 'financial':
        return {
          projections: "5-year model",
          revenue: {
            year1: "$250K",
            year3: "$5M", 
            year5: "$25M"
          },
          metrics: {
            cac: "$45",
            ltv: "$180",
            churn: "5%/month",
            grossMargin: "85%"
          }
        };
        
      default:
        return {};
    }
  };

  const ViewResultsModal = ({ category, onClose }: { category: string; onClose: () => void }) => {
    const result = demoResults[category];
    if (!result) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold capitalize">{category.replace('-', ' ')} Results</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            {category === 'analysis' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{result.overallScore}/10</div>
                      <div className="text-sm text-gray-600">Overall Score</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{result.marketSize}</div>
                      <div className="text-sm text-gray-600">Market Size</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{result.growth}</div>
                      <div className="text-sm text-gray-600">Growth Rate</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">{result.feasibility}/10</div>
                      <div className="text-sm text-gray-600">Feasibility</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <ThumbsUp className="w-5 h-5 text-green-500" />
                        <span>Strengths</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.strengths.map((strength: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span className="text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        <span>Areas for Improvement</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.weaknesses.map((weakness: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                            <span className="text-sm">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {category === 'business-plan' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{result.sections} Sections</div>
                  <div className="text-gray-600">Comprehensive business plan generated</div>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Key Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {result.highlights.map((highlight: string, index: number) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {category === 'pitch-deck' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">{result.slides} Slides</div>
                  <div className="text-gray-600">Professional investor presentation</div>
                </div>
                
                <div className="grid gap-3">
                  {result.sections.map((section: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">{index + 1}</span>
                      </div>
                      <span>{section}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {category === 'financial' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{result.revenue.year1}</div>
                      <div className="text-sm text-gray-600">Year 1 Revenue</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{result.revenue.year3}</div>
                      <div className="text-sm text-gray-600">Year 3 Revenue</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{result.revenue.year5}</div>
                      <div className="text-sm text-gray-600">Year 5 Revenue</div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span>Customer Acquisition Cost:</span>
                        <span className="font-bold">{result.metrics.cac}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lifetime Value:</span>
                        <span className="font-bold">{result.metrics.ltv}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Churn:</span>
                        <span className="font-bold">{result.metrics.churn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gross Margin:</span>
                        <span className="font-bold">{result.metrics.grossMargin}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (phase === 'chat') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Autonomous AI Demo</h1>
                  <p className="text-gray-600">Complete startup transformation with animations</p>
                </div>
              </div>
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span>AI Agent Conversation</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      
                      {msg.sender === 'agent' && msg.actions && (
                        <div className="mt-3 space-y-2">
                          {msg.actions.map((action, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant="outline"
                              className="mr-2 mb-1 text-xs"
                              onClick={() => executeAction(action.action)}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isAgentTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-xs text-gray-500">Agent is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask about the autonomous demo..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Demo execution phase
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {fullScreenMode && <ViewResultsModal category={activeView} onClose={() => setFullScreenMode(false)} />}
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Autonomous Transformation in Progress</h1>
                <p className="text-gray-600">AI agent is working on: {startupIdea.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-700">
                <Bot className="w-3 h-3 mr-1" />
                Agent Active
              </Badge>
              <Button variant="outline" onClick={() => setPhase('chat')}>
                Back to Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Progress Tracker</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoTasks.map((task, index) => {
                    const isActive = currentTask?.category === task.category;
                    const isCompleted = completedTasks.some(t => t.category === task.category);
                    const hasResult = demoResults[task.category];
                    
                    return (
                      <div key={index} className={`border rounded-lg p-4 transition-all ${
                        isActive ? 'border-blue-500 bg-blue-50' : 
                        isCompleted ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          {isActive && (
                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                          )}
                          {isCompleted && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                        
                        {isActive && currentTask && (
                          <Progress value={currentTask.progress} className="h-2" />
                        )}
                        
                        {isCompleted && hasResult && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full mt-2"
                            onClick={() => {
                              setActiveView(task.category);
                              setFullScreenMode(true);
                            }}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Results
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Display */}
          <div className="lg:col-span-2">
            <Card className="min-h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>
                    {currentTask ? `${currentTask.title} in Progress` : 'Transformation Complete'}
                  </span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {currentTask ? (
                  <div className="space-y-6">
                    {/* Current Task Display */}
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-10 h-10 text-white animate-pulse" />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-2">{currentTask.title}</h3>
                      <p className="text-gray-600 mb-4">{currentTask.description}</p>
                      
                      <div className="max-w-md mx-auto">
                        <Progress value={currentTask.progress} className="h-3" />
                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                          <span>{Math.round(currentTask.progress)}% complete</span>
                          <span>~{Math.round((100 - currentTask.progress) / (100 / currentTask.duration))}s remaining</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Live preview based on task */}
                    {currentTask.category === 'enhancement' && (
                      <div className="bg-yellow-50 rounded-lg p-6">
                        <h4 className="font-bold mb-3 flex items-center">
                          <Brain className="w-5 h-5 mr-2 text-yellow-600" />
                          AI Enhancement Preview
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">Analyzing market fit and positioning...</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">Optimizing value proposition...</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">Adding competitive differentiators...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {currentTask.category === 'analysis' && (
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h4 className="font-bold mb-3 flex items-center">
                          <Search className="w-5 h-5 mr-2 text-blue-600" />
                          Market Analysis in Progress
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white rounded p-3">
                            <div className="text-xs text-gray-500">Market Size</div>
                            <div className="text-lg font-bold text-blue-600">$96B+</div>
                          </div>
                          <div className="bg-white rounded p-3">
                            <div className="text-xs text-gray-500">Growth Rate</div>
                            <div className="text-lg font-bold text-green-600">14.7%</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {currentTask.category === 'business-plan' && (
                      <div className="bg-green-50 rounded-lg p-6">
                        <h4 className="font-bold mb-3 flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-green-600" />
                          Business Plan Generation
                        </h4>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600 mb-2">12 Sections</div>
                          <div className="text-sm text-gray-600">Comprehensive business plan being created</div>
                          <div className="mt-4 text-xs text-green-600">⚡ Optimized for 15-second generation</div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Transformation Complete!</h3>
                      <p className="text-gray-600">Your startup is now investor-ready with comprehensive materials</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {Object.keys(demoResults).map((category) => (
                        <Button
                          key={category}
                          variant="outline"
                          className="h-16"
                          onClick={() => {
                            setActiveView(category);
                            setFullScreenMode(true);
                          }}
                        >
                          <div className="text-center">
                            <div className="font-medium capitalize">{category.replace('-', ' ')}</div>
                            <div className="text-xs text-gray-500">View Results</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                    
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                      onClick={() => setPhase('chat')}
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Start New Transformation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}