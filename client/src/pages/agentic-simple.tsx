import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Send, 
  FileText, 
  Users, 
  DollarSign, 
  Zap, 
  CheckCircle, 
  MessageSquare, 
  BarChart3,
  Mail,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  message: string;
  timestamp: Date;
  actions?: Array<{ label: string; action: string; }>;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  category: string;
}

export default function AgenticSimple() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'agent',
      message: "Hello! I'm your AI startup assistant. I can help you find investors, apply for grants, generate business plans, and manage your entire startup journey autonomously. What would you like me to help you with today?",
      timestamp: new Date(),
      actions: [
        { label: "Find Investors", action: "find-investors" },
        { label: "Apply for Grants", action: "apply-grants" },
        { label: "Generate Business Plan", action: "generate-plan" }
      ]
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Investor Matching Complete',
      description: 'Found 24 matching investors for your AI startup',
      status: 'completed',
      progress: 100,
      category: 'investor-matching'
    },
    {
      id: '2',
      title: 'Grant Application in Progress',
      description: 'Preparing SBIR grant application ($1.7M)',
      status: 'in-progress',
      progress: 75,
      category: 'grant-application'
    }
  ]);
  
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const investors = [
    {
      name: 'Sarah Chen',
      firm: 'Andreessen Horowitz',
      focus: ['AI', 'Health Tech'],
      stage: 'Series A',
      checkSize: '$5M - $15M',
      matchScore: 92
    },
    {
      name: 'Mike Rodriguez', 
      firm: 'Sequoia Capital',
      focus: ['Enterprise SaaS', 'AI'],
      stage: 'Seed to Series B',
      checkSize: '$1M - $25M',
      matchScore: 88
    }
  ];

  const grants = [
    {
      name: 'SBIR Research Grant',
      organization: 'National Science Foundation',
      amount: '$1.7M',
      deadline: '30 days',
      matchScore: 94
    },
    {
      name: 'Innovation Fund',
      organization: 'European Innovation Council', 
      amount: '€2.5M',
      deadline: '45 days',
      matchScore: 89
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

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(newMessage);
      setChatMessages(prev => [...prev, response]);
      setIsAgentTyping(false);
    }, 2000);
  };

  const generateResponse = (message: string): ChatMessage => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('investor') || lowerMessage.includes('funding')) {
      return {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        message: "I've found 24 potential investors that match your profile! Based on your AI startup, I recommend starting with Andreessen Horowitz and Sequoia Capital. Both have strong portfolios in AI and your funding stage. I can automatically prepare personalized pitch decks for these investors.",
        timestamp: new Date(),
        actions: [
          { label: "Contact Top Investors", action: "contact-investors" },
          { label: "Generate Pitch Deck", action: "create-pitch" },
          { label: "View All Matches", action: "view-investors" }
        ]
      };
    }
    
    if (lowerMessage.includes('grant') || lowerMessage.includes('money')) {
      return {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        message: "Great news! I've identified 2 grants perfect for your startup: the SBIR grant ($1.7M) and the EIC Innovation Fund (€2.5M). Both have high match scores for AI companies. I'm currently preparing the SBIR application - it has a 30-day deadline. Shall I prioritize this and submit automatically?",
        timestamp: new Date(),
        actions: [
          { label: "Submit SBIR Application", action: "submit-sbir" },
          { label: "Apply to EIC Fund", action: "apply-eic" },
          { label: "View All Grants", action: "view-grants" }
        ]
      };
    }
    
    return {
      id: (Date.now() + 1).toString(),
      sender: 'agent',
      message: "I can help with various aspects of your startup journey. I can find and contact investors, apply for grants, generate business plans, conduct market research, and create financial models. What specific area would you like me to focus on?",
      timestamp: new Date(),
      actions: [
        { label: "Show Dashboard", action: "dashboard" },
        { label: "Generate Report", action: "report" }
      ]
    };
  };

  const executeAction = (action: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: `Executing: ${action}`,
      description: `AI agent is working on ${action} automatically`,
      status: 'in-progress',
      progress: 0,
      category: 'autonomous-task'
    };
    
    setTasks(prev => [...prev, newTask]);
    
    // Simulate progress
    const interval = setInterval(() => {
      setTasks(prev => 
        prev.map(task => {
          if (task.id === newTask.id && task.status === 'in-progress') {
            const newProgress = task.progress + 20;
            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...task, progress: 100, status: 'completed' };
            }
            return { ...task, progress: newProgress };
          }
          return task;
        })
      );
    }, 1000);

    // Add confirmation message
    const confirmMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'agent',
      message: `I've started working on "${action}". This will be completed automatically in about 5 minutes. I'll update you when it's done.`,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, confirmMessage]);
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
                <h1 className="text-2xl font-bold text-gray-900">Agentic AI Platform</h1>
                <p className="text-gray-600">Your Autonomous Startup Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-700">
                <Bot className="w-3 h-3 mr-1" />
                Agent Active
              </Badge>
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* AI Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle>AI Agent Conversation</CardTitle>
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
                  
                  {/* Typing Indicator */}
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span>Active Tasks</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          task.status === 'completed' ? 'bg-green-500' : 
                          task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                        }`}>
                          {task.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <Zap className="w-4 h-4 text-white" />
                          )}
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
                        </div>
                      </div>
                    </div>
                  ))}
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
                    <div className="text-2xl font-bold text-purple-600">{tasks.filter(t => t.status === 'completed').length}</div>
                    <div className="text-xs text-gray-600">Tasks Done</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">92%</div>
                    <div className="text-xs text-gray-600">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Access */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => executeAction("find-investors")}>
                  <Users className="w-4 h-4 mr-2" />
                  Find Investors
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => executeAction("apply-grants")}>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Apply for Grants
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => executeAction("generate-plan")}>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Business Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Results Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Investor Matches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Top Investor Matches</span>
                <Badge>{investors.length} matches</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investors.map((investor, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{investor.name}</h4>
                        <p className="text-sm text-gray-600">{investor.firm}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        {investor.matchScore}% match
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stage:</span>
                        <span>{investor.stage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check Size:</span>
                        <span>{investor.checkSize}</span>
                      </div>
                    </div>
                    
                    <Button size="sm" className="w-full mt-3" onClick={() => executeAction("contact-investor")}>
                      <Mail className="w-3 h-3 mr-1" />
                      Contact Automatically
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Grant Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Grant Opportunities</span>
                <Badge>{grants.length} available</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {grants.map((grant, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{grant.name}</h4>
                        <p className="text-sm text-gray-600">{grant.organization}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        {grant.matchScore}% match
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold text-green-600">{grant.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deadline:</span>
                        <span>{grant.deadline}</span>
                      </div>
                    </div>
                    
                    <Button size="sm" className="w-full mt-3" onClick={() => executeAction("apply-grant")}>
                      <ArrowRight className="w-3 h-3 mr-1" />
                      Apply Automatically
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}