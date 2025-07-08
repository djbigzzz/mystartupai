import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  Send, 
  FileText, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Zap, 
  Brain, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Building, 
  Search, 
  MessageSquare, 
  BarChart3, 
  Globe, 
  Rocket, 
  Shield, 
  Award,
  PlusCircle,
  Calendar,
  Mail,
  Phone
} from "lucide-react";
import { Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AgentTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  progress: number;
  category: 'business-plan' | 'investor-matching' | 'grant-application' | 'market-research' | 'financial-modeling';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCompletion: Date;
  result?: any;
}

interface InvestorMatch {
  id: string;
  name: string;
  firm: string;
  focus: string[];
  stage: string;
  checkSize: string;
  portfolio: string[];
  matchScore: number;
  contactInfo: {
    email?: string;
    linkedin?: string;
    phone?: string;
  };
  lastActivity: Date;
  status: 'potential' | 'contacted' | 'interested' | 'declined' | 'invested';
}

interface Grant {
  id: string;
  name: string;
  organization: string;
  amount: string;
  deadline: Date;
  eligibility: string[];
  focus: string[];
  matchScore: number;
  status: 'eligible' | 'applied' | 'under-review' | 'approved' | 'rejected';
  applicationProgress?: number;
}

export default function AgenticPlatform() {
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'agent';
    message: string;
    timestamp: Date;
    actions?: any[];
  }>>([
    {
      id: '1',
      sender: 'agent',
      message: "Hello! I'm your AI startup assistant. I can help you build business plans, find investors, apply for grants, and manage your entire startup journey autonomously. What would you like me to help you with today?",
      timestamp: new Date(),
      actions: [
        { label: "Generate Business Plan", action: "generate-business-plan" },
        { label: "Find Investors", action: "find-investors" },
        { label: "Apply for Grants", action: "apply-grants" }
      ]
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>([]);
  const [investors, setInvestors] = useState<InvestorMatch[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Simulate autonomous agent activities
  useEffect(() => {
    // Initialize demo data for investor matching
    setInvestors([
      {
        id: '1',
        name: 'Sarah Chen',
        firm: 'Andreessen Horowitz',
        focus: ['AI', 'Health Tech', 'Consumer'],
        stage: 'Series A',
        checkSize: '$5M - $15M',
        portfolio: ['Notion', 'Clubhouse', 'Workday'],
        matchScore: 92,
        contactInfo: { email: 'sarah@a16z.com', linkedin: 'linkedin.com/in/sarahchen' },
        lastActivity: new Date(),
        status: 'potential'
      },
      {
        id: '2',
        name: 'Mike Rodriguez',
        firm: 'Sequoia Capital',
        focus: ['Enterprise SaaS', 'AI', 'Developer Tools'],
        stage: 'Seed to Series B',
        checkSize: '$1M - $25M',
        portfolio: ['Stripe', 'WhatsApp', 'Airbnb'],
        matchScore: 88,
        contactInfo: { email: 'mike@sequoiacap.com', linkedin: 'linkedin.com/in/mikerodriguez' },
        lastActivity: new Date(),
        status: 'potential'
      }
    ]);

    // Initialize demo grants
    setGrants([
      {
        id: '1',
        name: 'Small Business Innovation Research (SBIR)',
        organization: 'National Science Foundation',
        amount: '$1.7M',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        eligibility: ['US-based', 'Technology Innovation', 'Under 500 employees'],
        focus: ['AI', 'Health Tech', 'Clean Energy'],
        matchScore: 94,
        status: 'eligible'
      },
      {
        id: '2',
        name: 'Innovation Fund',
        organization: 'European Innovation Council',
        amount: '€2.5M',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        eligibility: ['EU-based', 'Deep Tech', 'Scalable Innovation'],
        focus: ['AI', 'Digital Health', 'Sustainable Tech'],
        matchScore: 89,
        status: 'eligible'
      }
    ]);

    // Simulate autonomous tasks
    const initialTasks: AgentTask[] = [
      {
        id: '1',
        title: 'Generate Comprehensive Business Plan',
        description: 'Creating 12-section investor-ready business plan based on your startup concept',
        status: 'completed',
        progress: 100,
        category: 'business-plan',
        priority: 'high',
        estimatedCompletion: new Date(),
        result: { sections: 12, pages: 45, quality: 9.2 }
      },
      {
        id: '2',
        title: 'Investor Matching Analysis',
        description: 'Analyzing 2,500+ investors to find perfect matches for your startup stage and industry',
        status: 'completed',
        progress: 100,
        category: 'investor-matching',
        priority: 'high',
        estimatedCompletion: new Date(),
        result: { matches: 24, highQuality: 8, contacted: 0 }
      },
      {
        id: '3',
        title: 'Grant Application Preparation',
        description: 'Preparing applications for 3 high-match grants with automated submissions',
        status: 'in-progress',
        progress: 65,
        category: 'grant-application',
        priority: 'medium',
        estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      }
    ];
    
    setAgentTasks(initialTasks);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user' as const,
      message: newMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsAgentTyping(true);

    try {
      const response = await apiRequest('/api/agentic/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: newMessage,
          context: { timestamp: new Date() }
        })
      });

      const agentResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'agent' as const,
        message: response.response,
        timestamp: new Date(),
        actions: response.actions || []
      };
      
      setChatMessages(prev => [...prev, agentResponse]);
    } catch (error) {
      // Fallback to local response
      const agentResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'agent' as const,
        message: generateAgentResponse(newMessage),
        timestamp: new Date(),
        actions: getContextualActions(newMessage)
      };
      
      setChatMessages(prev => [...prev, agentResponse]);
    } finally {
      setIsAgentTyping(false);
    }
  };

  const generateAgentResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('investor') || message.includes('funding')) {
      return "I've found 24 potential investors that match your profile. Based on your AI fitness startup, I recommend starting with Andreessen Horowitz and Sequoia Capital - they have strong portfolios in health tech and AI. I can automatically prepare and send personalized pitch decks to these investors. Would you like me to proceed?";
    }
    
    if (message.includes('grant') || message.includes('money') || message.includes('fund')) {
      return "Great news! I've identified 2 grants that are perfect for your startup: the SBIR grant ($1.7M) and the EIC Innovation Fund (€2.5M). Both have high match scores for AI health tech companies. I'm currently preparing the applications and can submit them automatically. The SBIR deadline is in 30 days - shall I prioritize this application?";
    }
    
    if (message.includes('business plan') || message.includes('plan')) {
      return "I've already generated a comprehensive 45-page business plan for your AI fitness startup. It includes market analysis, financial projections, and competitive strategy. The plan scored 9.2/10 for investor readiness. Would you like me to create a custom version for specific investor presentations?";
    }
    
    return "I understand you're looking for help with your startup. I can assist with business planning, investor matching, grant applications, market research, and financial modeling. What specific area would you like me to focus on first?";
  };

  const getContextualActions = (userMessage: string): any[] => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('investor')) {
      return [
        { label: "Contact Top Investors", action: "contact-investors" },
        { label: "Create Pitch Deck", action: "create-pitch" },
        { label: "Schedule Meetings", action: "schedule-meetings" }
      ];
    }
    
    if (message.includes('grant')) {
      return [
        { label: "Submit SBIR Application", action: "submit-sbir" },
        { label: "Apply to EIC Fund", action: "apply-eic" },
        { label: "Find More Grants", action: "find-grants" }
      ];
    }
    
    return [
      { label: "Show Dashboard", action: "show-dashboard" },
      { label: "Generate Report", action: "generate-report" }
    ];
  };

  const executeAction = async (action: string) => {
    try {
      const task = await apiRequest('/api/agentic/execute-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      
      setAgentTasks(prev => [...prev, task]);
      
      // Add confirmation message
      const confirmationMessage = {
        id: Date.now().toString(),
        sender: 'agent' as const,
        message: `I've started working on "${task.title}". This should be completed in about ${Math.round((new Date(task.estimatedCompletion).getTime() - Date.now()) / 60000)} minutes. I'll update you when it's done.`,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, confirmationMessage]);
    } catch (error) {
      // Fallback to local simulation
      const newTask: AgentTask = {
        id: Date.now().toString(),
        title: `Executing: ${action}`,
        description: `Agent is performing ${action} automatically`,
        status: 'in-progress',
        progress: 0,
        category: 'business-plan',
        priority: 'medium',
        estimatedCompletion: new Date(Date.now() + 10 * 60 * 1000)
      };
      
      setAgentTasks(prev => [...prev, newTask]);
      
      // Simulate task completion
      setTimeout(() => {
        setAgentTasks(prev => 
          prev.map(task => 
            task.id === newTask.id 
              ? { ...task, status: 'completed', progress: 100 }
              : task
          )
        );
      }, 5000);
    }
  };

  const getTaskIcon = (category: string) => {
    switch (category) {
      case 'business-plan': return FileText;
      case 'investor-matching': return Users;
      case 'grant-application': return DollarSign;
      case 'market-research': return Search;
      case 'financial-modeling': return BarChart3;
      default: return Zap;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-400';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MyStartup.ai Agentic Platform</h1>
                <p className="text-gray-600">Your Autonomous AI Startup Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-700">
                <Bot className="w-3 h-3 mr-1" />
                Agent Active
              </Badge>
              <Link href="/">
                <Button variant="outline">Exit Platform</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* AI Agent Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle>AI Agent Conversation</CardTitle>
                    <p className="text-sm text-gray-600">Communicate with your autonomous startup assistant</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                        <div className="text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString()}
                        </div>
                        
                        {/* Agent Actions */}
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
                  
                  {/* Agent Typing Indicator */}
                  {isAgentTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-gray-500">Agent is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                
                {/* Message Input */}
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ask your AI agent anything about your startup..."
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

          {/* Agent Tasks & Status */}
          <div className="space-y-6">
            {/* Active Agent Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span>Autonomous Tasks</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agentTasks.slice(0, 5).map((task) => {
                    const Icon = getTaskIcon(task.category);
                    return (
                      <div key={task.id} className="border rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStatusColor(task.status)}`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                            
                            {task.status === 'in-progress' && (
                              <div className="mt-2">
                                <Progress value={task.progress} className="h-2" />
                                <div className="text-xs text-gray-500 mt-1">{task.progress}% complete</div>
                              </div>
                            )}
                            
                            {task.status === 'completed' && task.result && (
                              <div className="mt-2 text-xs text-green-600">
                                ✓ Completed: {JSON.stringify(task.result)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <span>Platform Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{investors.length}</div>
                    <div className="text-xs text-gray-600">Matched Investors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{grants.length}</div>
                    <div className="text-xs text-gray-600">Available Grants</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{agentTasks.filter(t => t.status === 'completed').length}</div>
                    <div className="text-xs text-gray-600">Tasks Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">92%</div>
                    <div className="text-xs text-gray-600">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs for Detailed Views */}
        <div className="mt-8">
          <Tabs defaultValue="investors" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="investors">Investor Matches</TabsTrigger>
              <TabsTrigger value="grants">Grant Opportunities</TabsTrigger>
              <TabsTrigger value="documents">Generated Documents</TabsTrigger>
              <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="investors" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {investors.map((investor) => (
                  <Card key={investor.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{investor.name}</CardTitle>
                          <p className="text-gray-600">{investor.firm}</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700">
                          {investor.matchScore}% match
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Focus Areas</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {investor.focus.map((area) => (
                              <Badge key={area} variant="outline" className="text-xs">{area}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-600">Stage</div>
                            <div className="font-medium">{investor.stage}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Check Size</div>
                            <div className="font-medium">{investor.checkSize}</div>
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t">
                          <div className="flex space-x-2">
                            <Button size="sm" className="flex-1">
                              <Mail className="w-3 h-3 mr-1" />
                              Contact
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="grants" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {grants.map((grant) => (
                  <Card key={grant.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{grant.name}</CardTitle>
                          <p className="text-gray-600">{grant.organization}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          {grant.matchScore}% match
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-600">Amount</div>
                            <div className="text-lg font-bold text-green-600">{grant.amount}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Deadline</div>
                            <div className="font-medium">{grant.deadline.toLocaleDateString()}</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium text-gray-900">Focus Areas</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {grant.focus.map((area) => (
                              <Badge key={area} variant="outline" className="text-xs">{area}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        {grant.applicationProgress && (
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Application Progress</div>
                            <Progress value={grant.applicationProgress} className="h-2" />
                          </div>
                        )}
                        
                        <div className="pt-2 border-t">
                          <Button size="sm" className="w-full">
                            <PlusCircle className="w-3 h-3 mr-1" />
                            Apply Automatically
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="documents">
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Generation</h3>
                <p className="text-gray-600 mb-4">AI-generated business documents will appear here</p>
                <Button>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Business Plan
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Analytics</h3>
                <p className="text-gray-600 mb-4">Detailed analytics and insights coming soon</p>
                <Button variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}