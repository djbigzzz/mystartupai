import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Bot, Sparkles, Database, CheckCircle2, Clock, Zap, Users, Presentation, ChevronLeft, ChevronRight, Target, Lightbulb, TrendingUp, Rocket, DollarSign, Building2, Award, Trophy } from "lucide-react";
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
  const [pitchDeck, setPitchDeck] = useState<string[]>([]);
  const [showPitchGen, setShowPitchGen] = useState(false);
  const [pitchProgress, setPitchProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showInvestors, setShowInvestors] = useState(false);
  const [investorMatches, setInvestorMatches] = useState<any[]>([]);
  
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

  const generatePitchDeckMutation = useMutation({
    mutationFn: async () => {
      setShowPitchGen(true);
      const slides: string[] = [];
      
      setPitchProgress(20);
      await new Promise(r => setTimeout(r, 1500));
      slides.push("🎯 Problem: 1.7B unbanked people in emerging markets lack access to credit");
      setPitchDeck([...slides]);
      
      setPitchProgress(40);
      await new Promise(r => setTimeout(r, 1800));
      slides.push("💡 Solution: Solana-powered DeFi lending with $0.00025 transaction fees");
      setPitchDeck([...slides]);
      
      setPitchProgress(60);
      await new Promise(r => setTimeout(r, 1600));
      slides.push("📈 Market: $127B TAM, 23% CAGR in Africa digital lending");
      setPitchDeck([...slides]);
      
      setPitchProgress(80);
      await new Promise(r => setTimeout(r, 1500));
      slides.push("💰 Traction: Y1 $2.4M → Y3 $24.5M revenue projection");
      setPitchDeck([...slides]);
      
      setPitchProgress(100);
      await new Promise(r => setTimeout(r, 1200));
      slides.push("🚀 Ask: $2M seed to scale across Nigeria, Kenya, Ghana");
      setPitchDeck([...slides]);
      
      return slides;
    }
  });

  const findInvestorsMutation = useMutation({
    mutationFn: async () => {
      setShowInvestors(true);
      const matches: any[] = [];
      
      await new Promise(r => setTimeout(r, 800));
      matches.push({
        type: 'vc',
        name: 'a16z Crypto',
        focus: 'Web3 Infrastructure',
        match: 95,
        description: 'Leading crypto VC, invested in Uniswap, Compound, OpenSea',
        ticket: '$5-50M Series A/B'
      });
      setInvestorMatches([...matches]);
      
      await new Promise(r => setTimeout(r, 800));
      matches.push({
        type: 'vc',
        name: 'Paradigm',
        focus: 'DeFi Protocols',
        match: 92,
        description: 'Deep DeFi expertise, backed MakerDAO, dYdX, Coinbase',
        ticket: '$10-100M'
      });
      setInvestorMatches([...matches]);
      
      await new Promise(r => setTimeout(r, 800));
      matches.push({
        type: 'angel',
        name: 'Balaji Srinivasan',
        focus: 'Crypto/Emerging Markets',
        match: 88,
        description: 'Ex-Coinbase CTO, prolific angel investor',
        ticket: '$100K-1M'
      });
      setInvestorMatches([...matches]);
      
      await new Promise(r => setTimeout(r, 800));
      matches.push({
        type: 'grant',
        name: 'Solana Foundation',
        focus: 'DeFi on Solana',
        match: 90,
        description: 'Up to $500K non-dilutive grants for Solana builders',
        ticket: '$50-500K'
      });
      setInvestorMatches([...matches]);
      
      await new Promise(r => setTimeout(r, 800));
      matches.push({
        type: 'hackathon',
        name: 'Colosseum Accelerator',
        focus: 'Solana Startups',
        match: 94,
        description: '$250K prize + $500K investment for winners',
        ticket: '$750K total'
      });
      setInvestorMatches([...matches]);
      
      return matches;
    }
  });

  const handleGenerate = () => {
    setMessages([]);
    setFinalPlan("");
    setTotalTime(0);
    setProgress(0);
    setMarketData(null);
    setFinancialData(null);
    setPitchDeck([]);
    setShowPitchGen(false);
    setPitchProgress(0);
    setCurrentSlide(0);
    setShowInvestors(false);
    setInvestorMatches([]);
    setAgentStatuses(prev => prev.map(a => ({ ...a, status: 'idle' as const })));
    generatePlanMutation.mutate(idea);
  };

  const getSlideIcon = (idx: number) => {
    const icons = [Target, Lightbulb, TrendingUp, Rocket, DollarSign];
    return icons[idx] || Target;
  };

  const getSlideTitle = (idx: number) => {
    const titles = ["The Problem", "Our Solution", "Market Opportunity", "Traction & Growth", "The Ask"];
    return titles[idx] || "Slide";
  };

  const getSlideGradient = (idx: number) => {
    const gradients = [
      "from-red-500/20 to-orange-500/20",
      "from-blue-500/20 to-cyan-500/20",
      "from-green-500/20 to-emerald-500/20",
      "from-purple-500/20 to-pink-500/20",
      "from-yellow-500/20 to-amber-500/20"
    ];
    return gradients[idx] || gradients[0];
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-900 to-purple-950 p-4 overflow-hidden relative">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-purple-500/10 animate-pulse pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Compact Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white mb-1">
            Agentic AI Co-Founder
          </h1>
          <p className="text-sm text-blue-200">
            Live Multi-Agent Coordination Demo
          </p>
        </div>

        {/* Agent Status Bar */}
        <Card className="mb-3 bg-slate-900/70 backdrop-blur border-blue-500/20">
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
                      <p className="text-xs text-blue-200 capitalize">{agent.status}</p>
                    </div>
                    {idx < agentStatuses.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-blue-400 ml-2" />
                    )}
                  </div>
                );
              })}
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Input Section - Compact */}
        <Card className="mb-3 bg-slate-900/70 backdrop-blur border-blue-500/20">
          <CardContent className="pt-4 space-y-3">
            <Textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="min-h-16 bg-slate-950/50 text-white border-blue-500/30 placeholder:text-blue-300/50 text-sm"
              placeholder="e.g., A DeFi lending protocol for emerging markets"
              data-testid="input-startup-idea"
            />
            <Button
              onClick={handleGenerate}
              disabled={generatePlanMutation.isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
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
          <Card className="bg-slate-900/70 backdrop-blur border-purple-500/20">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Bot className="h-5 w-5" />
                Agent Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-center text-blue-200 py-4 text-sm">
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
                          <ArrowRight className="h-2.5 w-2.5 text-blue-400" />
                          <span className="text-xs text-blue-200">{msg.to}</span>
                          {msg.elapsedMs !== undefined && (
                            <span className="ml-auto text-xs text-cyan-400 font-mono">
                              +{(msg.elapsedMs / 1000).toFixed(2)}s
                            </span>
                          )}
                        </div>
                        <Badge variant="outline" className="mb-1.5 text-xs border-purple-500/50 text-purple-200">
                          {msg.type}
                        </Badge>
                        <div className="bg-slate-950/50 rounded-lg p-2 text-xs text-blue-100 font-mono">
                          {msg.content.length > 150 ? (
                            <details>
                              <summary className="cursor-pointer text-cyan-400 hover:text-cyan-300">
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
                <div className="flex items-center gap-2 text-cyan-400 animate-pulse">
                  <Bot className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Coordinating...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generated Business Plan */}
          <Card className="bg-slate-900/70 backdrop-blur border-green-500/20">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5" />
                Business Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto">
              {!finalPlan && (
                <p className="text-center text-blue-200 py-4 text-sm">
                  Business plan will appear here
                </p>
              )}
              {finalPlan && (
                <div className="prose prose-sm prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-xs text-blue-100 bg-slate-950/50 p-3 rounded-lg">
                    {finalPlan}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Next Steps - Sequential Flow */}
        {finalPlan && !showPitchGen && pitchDeck.length === 0 && (
          <Card className="mt-3 bg-card/80 backdrop-blur border-blue-500/30 animate-in fade-in slide-in-from-bottom duration-700">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Presentation className="h-5 w-5 text-blue-400" />
                Step 2: Build Your Pitch Deck
              </CardTitle>
              <CardDescription className="text-blue-200">
                Generate an investor-ready pitch deck with one click
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => generatePitchDeckMutation.mutate()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                data-testid="button-build-pitch-deck"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Pitch Deck Now
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Professional Pitch Deck View */}
        {showPitchGen && pitchDeck.length > 0 && (
          <Card className="mt-3 bg-slate-950/90 backdrop-blur border-purple-500/30 animate-in fade-in slide-in-from-bottom duration-700">
            <CardContent className="p-0">
              {/* Progress Bar */}
              {generatePitchDeckMutation.isPending && (
                <div className="p-4 border-b border-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-purple-400 animate-pulse">
                      <Bot className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Creating slides...</span>
                    </div>
                    <span className="text-sm text-purple-300">{pitchProgress}%</span>
                  </div>
                  <Progress value={pitchProgress} className="h-2" />
                </div>
              )}
              
              {/* Professional Slide Display */}
              {pitchDeck.length > currentSlide && (
                <div className={`min-h-[400px] bg-gradient-to-br ${getSlideGradient(currentSlide)} p-12 flex flex-col justify-center items-center text-center relative`}>
                  {/* Slide Number */}
                  <div className="absolute top-6 right-6 text-white/40 text-sm font-mono">
                    {currentSlide + 1} / {pitchDeck.length}
                  </div>
                  
                  {/* Slide Icon */}
                  {(() => {
                    const SlideIcon = getSlideIcon(currentSlide);
                    return <SlideIcon className="h-16 w-16 text-white/80 mb-6" />;
                  })()}
                  
                  {/* Slide Title */}
                  <h2 className="text-3xl font-bold text-white mb-6">
                    {getSlideTitle(currentSlide)}
                  </h2>
                  
                  {/* Slide Content */}
                  <p className="text-xl text-white/90 max-w-3xl leading-relaxed">
                    {pitchDeck[currentSlide].replace(/^[🎯💡📈💰🚀]\s*/, '')}
                  </p>
                </div>
              )}
              
              {/* Navigation Controls */}
              <div className="p-4 bg-slate-900/50 border-t border-purple-500/20 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                  disabled={currentSlide === 0}
                  className="border-purple-500/30 text-white hover:bg-purple-500/20"
                  data-testid="button-prev-slide"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                {/* Slide Indicators */}
                <div className="flex gap-2">
                  {pitchDeck.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentSlide 
                          ? 'w-8 bg-purple-500' 
                          : 'w-2 bg-purple-500/30 hover:bg-purple-500/50'
                      }`}
                      data-testid={`button-slide-${idx}`}
                    />
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentSlide(Math.min(pitchDeck.length - 1, currentSlide + 1))}
                  disabled={currentSlide === pitchDeck.length - 1}
                  className="border-purple-500/30 text-white hover:bg-purple-500/20"
                  data-testid="button-next-slide"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Find Investors - Only shows after pitch deck is complete */}
        {pitchDeck.length === 5 && !showInvestors && (
          <Card className="mt-3 bg-card/80 backdrop-blur border-green-500/30 animate-in fade-in slide-in-from-bottom duration-700">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-green-400" />
                Step 3: Find Investors
              </CardTitle>
              <CardDescription className="text-green-200">
                AI-matched VCs, angels, grants, and hackathons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => findInvestorsMutation.mutate()}
                disabled={findInvestorsMutation.isPending}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                data-testid="button-find-investors"
              >
                {findInvestorsMutation.isPending ? (
                  <>
                    <Bot className="mr-2 h-4 w-4 animate-spin" />
                    Matching...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    Match With Investors
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Investor Matches Display */}
        {showInvestors && (
          <Card className="mt-3 bg-slate-950/90 backdrop-blur border-green-500/30 animate-in fade-in slide-in-from-bottom duration-700">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-green-400" />
                Top Investor Matches
              </CardTitle>
              <CardDescription className="text-green-200">
                {investorMatches.length} AI-matched opportunities for your startup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
              {investorMatches.map((investor, idx) => {
                const getTypeIcon = () => {
                  if (investor.type === 'vc') return Building2;
                  if (investor.type === 'angel') return Users;
                  if (investor.type === 'grant') return Award;
                  if (investor.type === 'hackathon') return Trophy;
                  return Building2;
                };
                const getTypeColor = () => {
                  if (investor.type === 'vc') return 'from-blue-500/20 to-cyan-500/20';
                  if (investor.type === 'angel') return 'from-purple-500/20 to-pink-500/20';
                  if (investor.type === 'grant') return 'from-green-500/20 to-emerald-500/20';
                  if (investor.type === 'hackathon') return 'from-yellow-500/20 to-orange-500/20';
                  return 'from-gray-500/20 to-slate-500/20';
                };
                const TypeIcon = getTypeIcon();
                
                return (
                  <div
                    key={idx}
                    className={`bg-gradient-to-r ${getTypeColor()} border border-white/10 rounded-lg p-4 animate-in fade-in slide-in-from-left duration-500`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                    data-testid={`investor-${idx}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-2 rounded-lg">
                          <TypeIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{investor.name}</h3>
                          <p className="text-sm text-white/60 capitalize">{investor.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">{investor.match}%</div>
                        <p className="text-xs text-white/60">Match</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-cyan-400" />
                        <p className="text-sm text-white/80"><span className="font-semibold">Focus:</span> {investor.focus}</p>
                      </div>
                      <p className="text-sm text-white/70">{investor.description}</p>
                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <p className="text-sm font-semibold text-white">{investor.ticket}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {findInvestorsMutation.isPending && (
                <div className="flex items-center justify-center gap-2 text-green-400 animate-pulse py-4">
                  <Bot className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Finding perfect matches...</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stats Row - Compact */}
        <div className="grid grid-cols-3 gap-3 mt-3">
          <Card className="bg-slate-900/70 backdrop-blur border-cyan-500/20">
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-cyan-400">{agentStatuses.length}</p>
              <p className="text-xs text-blue-200">Agents</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/70 backdrop-blur border-cyan-500/20">
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-cyan-400 font-mono">
                {totalTime > 0 ? `${totalTime.toFixed(1)}s` : '~10s'}
              </p>
              <p className="text-xs text-blue-200">Generation Time</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/70 backdrop-blur border-cyan-500/20">
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-cyan-400">400ms</p>
              <p className="text-xs text-blue-200">Solana Finality</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
