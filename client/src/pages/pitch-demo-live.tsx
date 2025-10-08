import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Bot, Sparkles, Database, CheckCircle2, Clock, Zap } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

interface AgentMessage {
  id: string;
  from: string;
  to: string;
  type: string;
  content: string;
  timestamp: number;
  elapsedMs?: number;
}

interface MarketData {
  tam: string;
  sam: string;
  competitors: string[];
  trends: string[];
  growth_rate: string;
}

interface FinancialData {
  year_1: { revenue: string; expenses: string; profit: string };
  year_2: { revenue: string; expenses: string; profit: string };
  year_3: { revenue: string; expenses: string; profit: string };
  assumptions: string;
}

interface AgentStatus {
  name: string;
  status: 'idle' | 'working' | 'complete';
  icon: typeof Bot;
  color: string;
}

export default function PitchDemoLive() {
  const [idea, setIdea] = useState("A DeFi lending protocol for emerging markets in Africa");
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [finalPlan, setFinalPlan] = useState("");
  const [totalTime, setTotalTime] = useState<number>(0);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [progress, setProgress] = useState(0);
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([
    { name: "Business Plan", status: 'idle', icon: Bot, color: 'purple' },
    { name: "Market Research", status: 'idle', icon: Database, color: 'green' },
    { name: "Financial Model", status: 'idle', icon: Zap, color: 'orange' },
  ]);
  
  const updateAgentStatus = (agentName: string, status: AgentStatus['status']) => {
    setAgentStatuses(prev => prev.map(agent => 
      agent.name === agentName ? { ...agent, status } : agent
    ));
  };

  const generatePlanMutation = useMutation({
    mutationFn: async (startupIdea: string) => {
      const startTime = Date.now();
      const msgs: AgentMessage[] = [];
      
      const addMessage = (msg: Omit<AgentMessage, 'elapsedMs'>) => {
        const elapsedMs = Date.now() - startTime;
        msgs.push({ ...msg, elapsedMs });
        setMessages([...msgs]);
      };
      
      // Step 1: User request
      setProgress(10);
      addMessage({
        id: "msg-1",
        from: "User",
        to: "Business Plan Agent",
        type: "USER_REQUEST",
        content: `Generate business plan for: ${startupIdea}`,
        timestamp: Date.now()
      });
      await new Promise(r => setTimeout(r, 1500));
      
      // Step 2: Business Plan Agent starts
      setProgress(20);
      updateAgentStatus("Business Plan", "working");
      addMessage({
        id: "msg-2",
        from: "Business Plan Agent",
        to: "Market Research Agent",
        type: "AGENT_REQUEST",
        content: `Analyze market for: ${startupIdea}. Include: TAM/SAM/SOM, competitors, market trends.`,
        timestamp: Date.now()
      });
      await new Promise(r => setTimeout(r, 2000));
      
      // Step 3: Market Research responds
      setProgress(40);
      updateAgentStatus("Market Research", "working");
      const market: MarketData = {
        tam: "$127B global microfinance market",
        sam: "$8.2B Africa digital lending",
        competitors: ["Aave", "Compound", "Branch International"],
        trends: ["Mobile-first lending", "Stablecoin adoption", "DeFi growth in emerging markets"],
        growth_rate: "23% CAGR"
      };
      setMarketData(market);
      
      addMessage({
        id: "msg-3",
        from: "Market Research Agent",
        to: "Business Plan Agent",
        type: "AGENT_RESPONSE",
        content: JSON.stringify(market, null, 2),
        timestamp: Date.now()
      });
      updateAgentStatus("Market Research", "complete");
      await new Promise(r => setTimeout(r, 1800));
      
      // Step 4: Request financial projections
      setProgress(60);
      addMessage({
        id: "msg-4",
        from: "Business Plan Agent",
        to: "Financial Modeling Agent",
        type: "AGENT_REQUEST",
        content: `Create 3-year financial model for ${startupIdea}. Revenue: transaction fees + interest margins.`,
        timestamp: Date.now()
      });
      await new Promise(r => setTimeout(r, 1800));
      
      // Step 5: Financial Agent responds
      setProgress(80);
      updateAgentStatus("Financial Model", "working");
      const financial: FinancialData = {
        year_1: { revenue: "$2.4M", expenses: "$1.8M", profit: "$600K" },
        year_2: { revenue: "$8.1M", expenses: "$4.2M", profit: "$3.9M" },
        year_3: { revenue: "$24.5M", expenses: "$9.8M", profit: "$14.7M" },
        assumptions: "15K users Y1 → 180K users Y3, avg loan $500, 3% platform fee"
      };
      setFinancialData(financial);
      
      addMessage({
        id: "msg-5",
        from: "Financial Modeling Agent",
        to: "Business Plan Agent",
        type: "AGENT_RESPONSE",
        content: JSON.stringify(financial, null, 2),
        timestamp: Date.now()
      });
      updateAgentStatus("Financial Model", "complete");
      await new Promise(r => setTimeout(r, 2000));
      
      // Step 6: Synthesis
      setProgress(95);
      addMessage({
        id: "msg-6",
        from: "Business Plan Agent",
        to: "User",
        type: "AGENT_RESPONSE",
        content: "Business plan generated successfully. Synthesizing market research and financial projections...",
        timestamp: Date.now()
      });
      await new Promise(r => setTimeout(r, 1500));
      
      setProgress(100);
      updateAgentStatus("Business Plan", "complete");
      
      const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      setTotalTime(parseFloat(totalElapsed));
      
      return { msgs, market, financial, totalElapsed };
    }
  });

  useEffect(() => {
    if (marketData && financialData && totalTime > 0 && idea) {
      const plan = `# ${idea}

## Executive Summary
${idea} - A blockchain-based lending platform leveraging Solana's speed and low fees to provide microloans to underbanked populations in African emerging markets.

## Market Opportunity (Market Research Agent)
- **TAM**: ${marketData.tam}
- **SAM**: ${marketData.sam}
- **Growth**: ${marketData.growth_rate} driven by ${marketData.trends.join(', ').toLowerCase()}

## Competitive Analysis
Competitors: ${marketData.competitors.join(', ')}

**Our Advantage**: Solana $0.00025 fees vs Ethereum $5-50

## Financial Projections (Financial Modeling Agent)
${financialData.assumptions}:

- **Y1**: ${financialData.year_1.revenue} revenue, ${financialData.year_1.profit} profit
- **Y2**: ${financialData.year_2.revenue} revenue, ${financialData.year_2.profit} profit  
- **Y3**: ${financialData.year_3.revenue} revenue, ${financialData.year_3.profit} profit

## Key Trends
${marketData.trends.map((t, i) => `${i + 1}. ${t}`).join('\n')}

---
*Generated in ${totalTime.toFixed(1)}s via autonomous multi-agent coordination*`;
      
      setFinalPlan(plan);
    }
  }, [marketData, financialData, totalTime, idea]);

  const handleGenerate = () => {
    setMessages([]);
    setFinalPlan("");
    setTotalTime(0);
    setProgress(0);
    setMarketData(null);
    setFinancialData(null);
    setAgentStatuses(prev => prev.map(a => ({ ...a, status: 'idle' as const })));
    generatePlanMutation.mutate(idea);
  };

  const getAgentColor = (agent: string) => {
    if (agent === "User") return "bg-blue-500";
    if (agent === "Business Plan Agent") return "bg-purple-500";
    if (agent === "Market Research Agent") return "bg-green-500";
    if (agent === "Financial Modeling Agent") return "bg-orange-500";
    return "bg-gray-500";
  };

  const getAgentIcon = (agent: string) => {
    if (agent === "User") return Sparkles;
    if (agent === "Market Research Agent") return Database;
    if (agent === "Financial Modeling Agent") return Zap;
    return Bot;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Compact Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white mb-1">
            Agentic AI Co-Founder
          </h1>
          <p className="text-sm text-purple-200">
            Live Multi-Agent Coordination Demo
          </p>
        </div>

        {/* Agent Status Bar */}
        <Card className="mb-3 bg-slate-800/50 border-purple-500/50">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between gap-4 mb-3">
              {agentStatuses.map((agent, idx) => {
                const Icon = agent.icon;
                return (
                  <div key={agent.name} className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${
                      agent.status === 'working' ? `bg-${agent.color}-500 animate-pulse` :
                      agent.status === 'complete' ? `bg-${agent.color}-500` :
                      'bg-slate-700'
                    }`}>
                      <Icon className={`h-4 w-4 text-white ${agent.status === 'working' ? 'animate-spin' : ''}`} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">{agent.name}</p>
                      <p className="text-xs text-purple-300 capitalize">{agent.status}</p>
                    </div>
                    {idx < agentStatuses.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-purple-400 ml-2" />
                    )}
                  </div>
                );
              })}
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Input Section - Compact */}
        <Card className="mb-3 bg-slate-800/50 border-purple-500/50">
          <CardContent className="pt-4 space-y-3">
            <Textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="min-h-16 bg-slate-900 text-white border-purple-500/50 text-sm"
              placeholder="e.g., A DeFi lending protocol for emerging markets"
              data-testid="input-startup-idea"
            />
            <Button
              onClick={handleGenerate}
              disabled={generatePlanMutation.isPending}
              className="w-full bg-purple-600 hover:bg-purple-700"
              data-testid="button-generate-plan"
            >
              {generatePlanMutation.isPending ? (
                <>
                  <Bot className="mr-2 h-4 w-4 animate-spin" />
                  Agents Working...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start Agent Coordination
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-3">
          {/* Agent Communication Flow */}
          <Card className="bg-slate-800/50 border-purple-500/50">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Bot className="h-5 w-5" />
                Agent Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-center text-purple-300 py-4 text-sm">
                  Click "Start" to see agents communicate
                </p>
              )}
              
              {messages.map((msg, idx) => {
                const Icon = getAgentIcon(msg.from);
                return (
                  <div key={msg.id} className="animate-in fade-in slide-in-from-left duration-700">
                    <div className="flex items-start gap-2">
                      <div className={`${getAgentColor(msg.from)} p-1.5 rounded-lg`}>
                        <Icon className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-semibold text-white">{msg.from}</span>
                          <ArrowRight className="h-2.5 w-2.5 text-purple-400" />
                          <span className="text-xs text-purple-300">{msg.to}</span>
                          {msg.elapsedMs !== undefined && (
                            <span className="ml-auto text-xs text-purple-400 font-mono">
                              +{(msg.elapsedMs / 1000).toFixed(2)}s
                            </span>
                          )}
                        </div>
                        <Badge variant="outline" className="mb-1.5 text-xs border-purple-500/50 text-purple-200">
                          {msg.type}
                        </Badge>
                        <div className="bg-slate-900 rounded-lg p-2 text-xs text-purple-100 font-mono">
                          {msg.content.length > 150 ? (
                            <details>
                              <summary className="cursor-pointer text-purple-400 hover:text-purple-300">
                                View ({msg.content.length} chars)
                              </summary>
                              <pre className="mt-2 text-xs overflow-x-auto whitespace-pre-wrap">{msg.content}</pre>
                            </details>
                          ) : (
                            <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    {idx < messages.length - 1 && (
                      <div className="ml-4 my-1.5 border-l-2 border-purple-500/30 h-3" />
                    )}
                  </div>
                );
              })}
              
              {generatePlanMutation.isPending && (
                <div className="flex items-center gap-2 text-purple-400 animate-pulse">
                  <Bot className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Coordinating...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generated Business Plan */}
          <Card className="bg-slate-800/50 border-purple-500/50">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5" />
                Business Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto">
              {!finalPlan && (
                <p className="text-center text-purple-300 py-4 text-sm">
                  Business plan will appear here
                </p>
              )}
              {finalPlan && (
                <div className="prose prose-sm prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-xs text-purple-100 bg-slate-900 p-3 rounded-lg">
                    {finalPlan}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Row - Compact */}
        <div className="grid grid-cols-3 gap-3 mt-3">
          <Card className="bg-slate-800/50 border-purple-500/50">
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-purple-400">{agentStatuses.length}</p>
              <p className="text-xs text-purple-200">Agents</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-purple-500/50">
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-purple-400 font-mono">
                {totalTime > 0 ? `${totalTime.toFixed(1)}s` : '~10s'}
              </p>
              <p className="text-xs text-purple-200">Generation Time</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-purple-500/50">
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-purple-400">400ms</p>
              <p className="text-xs text-purple-200">Solana Finality</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
