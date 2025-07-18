import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb,
  Search,
  Target,
  BarChart3,
  Presentation,
  FileText,
  Activity,
  CheckCircle,
  ArrowRight,
  Eye,
  Users,
  TrendingUp,
  DollarSign,
  Brain,
  Zap
} from "lucide-react";

interface AgentOutput {
  id: string;
  title: string;
  content: string;
  metrics?: { label: string; value: string; color: string }[];
  preview?: string;
}

interface AIAgent {
  id: string;
  name: string;
  role: string;
  icon: any;
  color: string;
  status: 'idle' | 'working' | 'complete';
  progress: number;
  currentTask: string;
  output?: AgentOutput;
  estimatedTime?: string;
}

export default function MultiAgentDemo() {
  const [agents, setAgents] = useState<AIAgent[]>([
    {
      id: 'visionary',
      name: 'Visionary Agent',
      role: 'Idea Clarification & Problem Definition',
      icon: Lightbulb,
      color: 'from-amber-500 to-orange-500',
      status: 'idle',
      progress: 0,
      currentTask: 'Ready to analyze your startup concept...',
      estimatedTime: '45s'
    },
    {
      id: 'researcher',
      name: 'Market Research Agent',
      role: 'Market Analysis & Competitor Intelligence',
      icon: Search,
      color: 'from-blue-500 to-cyan-500',
      status: 'idle',
      progress: 0,
      currentTask: 'Standing by for market research...',
      estimatedTime: '2m'
    },
    {
      id: 'strategist',
      name: 'Business Strategist Agent',
      role: 'Business Model & Go-to-Market Strategy',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      status: 'idle',
      progress: 0,
      currentTask: 'Awaiting strategy development...',
      estimatedTime: '90s'
    },
    {
      id: 'financial',
      name: 'Financial Modeling Agent',
      role: '5-Year Projections & Key Metrics',
      icon: BarChart3,
      color: 'from-green-500 to-emerald-500',
      status: 'idle',
      progress: 0,
      currentTask: 'Ready to model financials...',
      estimatedTime: '2m'
    },
    {
      id: 'designer',
      name: 'Pitch Deck Designer Agent',
      role: 'Investor Presentations & Visual Design',
      icon: Presentation,
      color: 'from-indigo-500 to-blue-500',
      status: 'idle',
      progress: 0,
      currentTask: 'Waiting for content compilation...',
      estimatedTime: '75s'
    },
    {
      id: 'documenter',
      name: 'Document Generator Agent',
      role: 'Business Plans & Documentation',
      icon: FileText,
      color: 'from-teal-500 to-cyan-500',
      status: 'idle',
      progress: 0,
      currentTask: 'Ready to generate documents...',
      estimatedTime: '90s'
    }
  ]);

  const [demoActive, setDemoActive] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [completedOutputs, setCompletedOutputs] = useState<AgentOutput[]>([]);
  const [activeConnections, setActiveConnections] = useState<string[]>([]);

  const agentOutputs: Record<string, AgentOutput> = {
    visionary: {
      id: 'visionary',
      title: 'Problem & Solution Definition',
      content: 'Identified core problem: 73% of people abandon fitness routines due to lack of personalized guidance and motivation. Solution: AI-powered personal trainer providing real-time form correction, adaptive workout plans, and behavioral coaching.',
      metrics: [
        { label: 'Market Pain Point', value: '73% abandonment rate', color: 'text-red-600' },
        { label: 'Solution Fit', value: '92% validation score', color: 'text-green-600' },
        { label: 'Differentiation', value: 'Real-time AI coaching', color: 'text-blue-600' }
      ],
      preview: 'AI Fitness Coach: Personalized training with real-time form correction'
    },
    researcher: {
      id: 'researcher',
      title: 'Market Intelligence Report',
      content: 'Market Analysis: $4.5B fitness app segment growing 14% annually. Key competitors analyzed: MyFitnessPal (200M users, nutrition focus), Nike Training Club (50M users, branded content). Opportunity identified: AI-powered form correction is underserved with 68% user demand.',
      metrics: [
        { label: 'Total Market Size', value: '$4.5B', color: 'text-blue-600' },
        { label: 'Growth Rate', value: '14% annually', color: 'text-green-600' },
        { label: 'User Demand Gap', value: '68% unmet need', color: 'text-purple-600' }
      ],
      preview: 'TAM: $4.5B | Growth: 14% | Competitors: MyFitnessPal, Nike Training'
    },
    strategist: {
      id: 'strategist',
      title: 'Business Strategy Framework',
      content: 'Business Model: Freemium with premium AI coaching ($19.99/month). B2B2C through corporate wellness programs. Go-to-Market: Influencer partnerships, app store optimization, corporate sales team. Target: 100K users Year 1, 1M users Year 3.',
      metrics: [
        { label: 'Pricing Model', value: '$19.99/month premium', color: 'text-green-600' },
        { label: 'Year 1 Target', value: '100K users', color: 'text-blue-600' },
        { label: 'Revenue Streams', value: '3 identified', color: 'text-purple-600' }
      ],
      preview: 'Freemium model | Corporate B2B2C | 100K users Year 1'
    },
    financial: {
      id: 'financial',
      title: 'Financial Projections & Metrics',
      content: 'Year 5 ARR: $45M. LTV/CAC ratio: 4.2x. Funding requirements: $2.5M seed, $8M Series A. Break-even projected: Month 28. Key metrics: 15% monthly churn, $89 ARPU, 25% freemium conversion rate.',
      metrics: [
        { label: 'Year 5 ARR', value: '$45M', color: 'text-green-600' },
        { label: 'LTV/CAC Ratio', value: '4.2x', color: 'text-blue-600' },
        { label: 'Break-even', value: 'Month 28', color: 'text-purple-600' }
      ],
      preview: 'ARR: $45M | LTV/CAC: 4.2x | Funding: $2.5M + $8M'
    },
    designer: {
      id: 'designer',
      title: 'Investor Pitch Deck',
      content: '10-slide investor presentation: Problem/Solution, Market Opportunity ($4.5B), Business Model, Traction Plan, Financial Projections, Team, Competition Analysis, Funding Request ($2.5M), Use of Funds, Next Milestones. Designed with professional charts and compelling narrative.',
      metrics: [
        { label: 'Total Slides', value: '10 professional', color: 'text-blue-600' },
        { label: 'Funding Ask', value: '$2.5M seed', color: 'text-green-600' },
        { label: 'Design Quality', value: '9.2/10 score', color: 'text-purple-600' }
      ],
      preview: '10 slides | $2.5M ask | Professional design + charts'
    },
    documenter: {
      id: 'documenter',
      title: 'Complete Business Documentation',
      content: '47-page comprehensive business plan including Executive Summary, Market Analysis, Product Development Strategy, Marketing Plan, Operations Framework, Financial Projections, Risk Analysis, and Implementation Timeline. All sections professionally formatted and investor-ready.',
      metrics: [
        { label: 'Document Length', value: '47 pages', color: 'text-blue-600' },
        { label: 'Sections Complete', value: '12/12', color: 'text-green-600' },
        { label: 'Quality Score', value: '9.4/10', color: 'text-purple-600' }
      ],
      preview: '47-page business plan | 12 sections | Executive summary ready'
    }
  };

  const updateAgent = (id: string, status: AIAgent['status'], progress: number, task: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === id 
        ? { ...agent, status, progress, currentTask: task } 
        : agent
    ));
  };

  const completeAgent = (id: string) => {
    const output = agentOutputs[id];
    if (output) {
      setCompletedOutputs(prev => [...prev, output]);
    }
    updateAgent(id, 'complete', 100, 'Analysis complete ✓');
  };

  const startDemo = () => {
    setDemoActive(true);
    setOverallProgress(0);
    setCompletedOutputs([]);
    setActiveConnections([]);
    
    // Reset all agents
    setAgents(prev => prev.map(agent => ({ 
      ...agent, 
      status: 'idle' as const,
      progress: 0,
    })));

    // Start the demo sequence
    setTimeout(() => runDemoSequence(), 500);
  };

  const runDemoSequence = () => {
    const sequences = [
      // Visionary Agent
      { delay: 0, action: () => updateAgent('visionary', 'working', 25, 'Analyzing "AI-powered fitness app" concept...') },
      { delay: 1000, action: () => updateAgent('visionary', 'working', 50, 'Identifying core problem: Lack of personalized guidance') },
      { delay: 2000, action: () => updateAgent('visionary', 'working', 75, 'Defining solution: AI coach with real-time feedback') },
      { delay: 3000, action: () => { 
        completeAgent('visionary');
        setActiveConnections(['visionary-researcher']);
      }},
      
      // Research Agent (starts after visionary)
      { delay: 3500, action: () => updateAgent('researcher', 'working', 20, 'Scanning 500+ fitness app databases...') },
      { delay: 4500, action: () => updateAgent('researcher', 'working', 40, 'Analyzing MyFitnessPal (200M users, $125M revenue)...') },
      { delay: 5500, action: () => updateAgent('researcher', 'working', 60, 'Researching Nike Training Club (50M+ users)...') },
      { delay: 6500, action: () => updateAgent('researcher', 'working', 80, 'Calculating TAM: $96B fitness → $4.5B app segment') },
      { delay: 7500, action: () => { 
        completeAgent('researcher');
        setActiveConnections(prev => [...prev, 'researcher-strategist']);
      }},
      
      // Strategist Agent (starts after research)
      { delay: 8000, action: () => updateAgent('strategist', 'working', 30, 'Developing business model canvas...') },
      { delay: 9000, action: () => updateAgent('strategist', 'working', 60, 'Identifying revenue streams: Subscription + Corporate') },
      { delay: 10000, action: () => updateAgent('strategist', 'working', 90, 'Designing go-to-market strategy') },
      { delay: 11000, action: () => { 
        completeAgent('strategist');
        setActiveConnections(prev => [...prev, 'strategist-financial']);
      }},
      
      // Financial Agent (parallel with strategist completion)
      { delay: 11500, action: () => updateAgent('financial', 'working', 25, 'Building 5-year financial projections...') },
      { delay: 12500, action: () => updateAgent('financial', 'working', 50, 'Calculating LTV/CAC ratios...') },
      { delay: 13500, action: () => updateAgent('financial', 'working', 75, 'Modeling unit economics and burn rate') },
      { delay: 14500, action: () => { 
        completeAgent('financial');
        setActiveConnections(prev => [...prev, 'financial-designer']);
      }},
      
      // Designer Agent (starts after financial)
      { delay: 15000, action: () => updateAgent('designer', 'working', 40, 'Creating investor pitch deck structure...') },
      { delay: 16000, action: () => updateAgent('designer', 'working', 70, 'Designing slides with financial charts...') },
      { delay: 17000, action: () => { 
        completeAgent('designer');
        setActiveConnections(prev => [...prev, 'designer-documenter']);
      }},
      
      // Documenter Agent (final compilation)
      { delay: 17500, action: () => updateAgent('documenter', 'working', 50, 'Compiling comprehensive business plan...') },
      { delay: 18500, action: () => updateAgent('documenter', 'working', 80, 'Generating executive summary...') },
      { delay: 19500, action: () => { 
        completeAgent('documenter');
        setOverallProgress(100);
      }}
    ];

    sequences.forEach(({ delay, action }) => {
      setTimeout(action, delay);
    });

    // Update overall progress
    const progressInterval = setInterval(() => {
      setOverallProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(prev + 2, 100);
      });
    }, 200);
  };

  const AgentCard = ({ agent }: { agent: AIAgent }) => {
    const Icon = agent.icon;
    const isConnected = activeConnections.some(conn => conn.includes(agent.id));
    
    return (
      <Card className={`relative overflow-hidden transition-all duration-500 ${
        agent.status === 'working' ? 'ring-2 ring-blue-400 shadow-lg scale-105 bg-blue-50' : 
        agent.status === 'complete' ? 'ring-2 ring-green-400 shadow-lg bg-green-50' : ''
      } ${isConnected ? 'border-purple-300' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${agent.color} flex items-center justify-center flex-shrink-0 ${
              agent.status === 'working' ? 'animate-pulse' : ''
            }`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm text-gray-900 truncate">{agent.name}</h3>
                {agent.estimatedTime && agent.status === 'idle' && (
                  <Badge variant="outline" className="text-xs">{agent.estimatedTime}</Badge>
                )}
              </div>
              <p className="text-xs text-gray-600 mb-2">{agent.role}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-xs font-medium">{agent.progress}%</span>
                </div>
                <Progress value={agent.progress} className="h-1.5" />
                
                <div className="mt-2">
                  <p className="text-xs text-gray-700 leading-relaxed">{agent.currentTask}</p>
                </div>
              </div>
              
              {agent.status === 'complete' && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              )}
              
              {agent.status === 'working' && (
                <div className="absolute top-2 right-2">
                  <Activity className="w-5 h-5 text-blue-500 animate-spin" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const OutputCard = ({ output }: { output: AgentOutput }) => (
    <Card className="mb-4 border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-green-800">{output.title}</h4>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          
          {output.metrics && (
            <div className="grid grid-cols-3 gap-2">
              {output.metrics.map((metric, idx) => (
                <div key={idx} className="text-center">
                  <div className={`text-sm font-bold ${metric.color}`}>{metric.value}</div>
                  <div className="text-xs text-gray-600">{metric.label}</div>
                </div>
              ))}
            </div>
          )}
          
          <p className="text-sm text-green-800 leading-relaxed">{output.content}</p>
          
          {output.preview && (
            <div className="bg-white p-2 rounded border border-green-200">
              <p className="text-xs font-medium text-gray-800">{output.preview}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Multi-Agent AI Collaboration Demo</h3>
              <p className="text-sm text-gray-600">Watch 6 specialized AI agents work together to build your startup</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Simulation</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-600">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>
          
          <div className="flex gap-4">
            <Button 
              onClick={startDemo}
              disabled={demoActive}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {demoActive ? 'Demo Running...' : 'Start AI Agent Demo'}
            </Button>
            
            <Button variant="outline" asChild>
              <a href="#agents">Learn About Agents</a>
            </Button>
          </div>
        </div>
      </Card>

      {/* Agent Dashboard */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Agent Status */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">AI Agent Status</h4>
          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* Right: Live Outputs */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">
            Live Agent Outputs 
            <Badge className="ml-2 bg-green-100 text-green-700">
              {completedOutputs.length}/6 Complete
            </Badge>
          </h4>
          <div className="max-h-96 overflow-y-auto">
            {completedOutputs.length === 0 ? (
              <Card className="p-6 text-center border-dashed border-2">
                <Eye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Agent outputs will appear here as they complete tasks</p>
              </Card>
            ) : (
              completedOutputs.map((output) => (
                <OutputCard key={output.id} output={output} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Final Results Summary */}
      {overallProgress === 100 && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-800">Startup Package Complete!</h3>
              <p className="text-green-700">All 6 AI agents have collaborated to create your comprehensive startup package</p>
            </div>
            <div className="grid md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">47</div>
                <div className="text-sm text-gray-600">Page Business Plan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">10</div>
                <div className="text-sm text-gray-600">Slide Pitch Deck</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">$45M</div>
                <div className="text-sm text-gray-600">Year 5 ARR Projection</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">4.2x</div>
                <div className="text-sm text-gray-600">LTV/CAC Ratio</div>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" asChild>
              <a href="/app">
                Launch Your Own Startup
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}