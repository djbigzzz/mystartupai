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
  const [investorFilter, setInvestorFilter] = useState<'all' | 'vc' | 'angel' | 'grant' | 'hackathon'>('all');
  
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
      await new Promise(r => setTimeout(r, 2500));
      slides.push("🎯 Problem: 1.7B unbanked people in emerging markets lack access to credit");
      setPitchDeck([...slides]);
      
      setPitchProgress(40);
      await new Promise(r => setTimeout(r, 2500));
      slides.push("💡 Solution: Solana-powered DeFi lending with $0.00025 transaction fees");
      setPitchDeck([...slides]);
      
      setPitchProgress(60);
      await new Promise(r => setTimeout(r, 2500));
      slides.push("📈 Market: $127B TAM, 23% CAGR in Africa digital lending");
      setPitchDeck([...slides]);
      
      setPitchProgress(80);
      await new Promise(r => setTimeout(r, 2500));
      slides.push("💰 Traction: Y1 $2.4M → Y3 $24.5M revenue projection");
      setPitchDeck([...slides]);
      
      setPitchProgress(100);
      await new Promise(r => setTimeout(r, 2500));
      slides.push("🚀 Ask: $2M seed to scale across Nigeria, Kenya, Ghana");
      setPitchDeck([...slides]);
      
      return slides;
    }
  });

  const findInvestorsMutation = useMutation({
    mutationFn: async () => {
      setShowInvestors(true);
      const matches: any[] = [];
      
      // 10 VCs
      const vcs = [
        { name: 'a16z Crypto', focus: 'Web3 Infrastructure', match: 95, description: 'Leading crypto VC, invested in Uniswap, Compound, OpenSea', ticket: '$5-50M Series A/B' },
        { name: 'Paradigm', focus: 'DeFi Protocols', match: 92, description: 'Deep DeFi expertise, backed MakerDAO, dYdX, Coinbase', ticket: '$10-100M' },
        { name: 'Multicoin Capital', focus: 'Web3 & DeFi', match: 90, description: 'Thesis-driven crypto fund, portfolio: Solana, Helium, Arweave', ticket: '$2-20M' },
        { name: 'Pantera Capital', focus: 'Blockchain Infrastructure', match: 88, description: 'First US crypto fund, 100+ investments including Polkadot, 1inch', ticket: '$5-30M' },
        { name: 'Jump Crypto', focus: 'DeFi & Payments', match: 87, description: 'Crypto arm of Jump Trading, deep liquidity expertise', ticket: '$10-50M' },
        { name: 'Electric Capital', focus: 'Crypto Infrastructure', match: 85, description: 'Developer-focused, backed Aave, Dune, Worldcoin', ticket: '$1-15M' },
        { name: 'Dragonfly Capital', focus: 'Global Crypto', match: 84, description: 'Cross-border crypto fund, Asia-US bridge, backed Compound, dYdX', ticket: '$3-25M' },
        { name: 'Coinbase Ventures', focus: 'Crypto Ecosystem', match: 82, description: '400+ portfolio companies, strategic value beyond capital', ticket: '$500K-10M' },
        { name: 'Framework Ventures', focus: 'DeFi Innovation', match: 80, description: 'Active in DeFi governance, backed Chainlink, Synthetix, NEAR', ticket: '$1-20M' },
        { name: 'Polychain Capital', focus: 'Protocol Investments', match: 78, description: 'Focus on crypto protocols, early Coinbase, Filecoin investor', ticket: '$5-40M' }
      ];
      
      // 10 Angels
      const angels = [
        { name: 'Balaji Srinivasan', focus: 'Crypto/Emerging Markets', match: 88, description: 'Ex-Coinbase CTO, prolific angel investor, Network State author', ticket: '$100K-1M' },
        { name: 'Naval Ravikant', focus: 'Crypto & Startups', match: 86, description: 'AngelList founder, early Bitcoin advocate, 200+ angel investments', ticket: '$50K-500K' },
        { name: 'Sandeep Nailwal', focus: 'Web3 Infrastructure', match: 84, description: 'Polygon co-founder, active DeFi angel investor', ticket: '$100K-750K' },
        { name: 'Stani Kulechov', focus: 'DeFi Protocols', match: 82, description: 'Aave founder, DeFi innovation expert', ticket: '$50K-500K' },
        { name: 'Do Kwon', focus: 'Algorithmic Finance', match: 80, description: 'Terra ecosystem builder, emerging markets focus', ticket: '$100K-1M' },
        { name: 'Kain Warwick', focus: 'Synthetic Assets', match: 78, description: 'Synthetix founder, derivatives expert', ticket: '$50K-400K' },
        { name: 'Rune Christensen', focus: 'Stablecoins', match: 76, description: 'MakerDAO founder, decentralized finance pioneer', ticket: '$100K-750K' },
        { name: 'Ryan Sean Adams', focus: 'Crypto Investing', match: 74, description: 'Bankless co-founder, DeFi educator & investor', ticket: '$25K-250K' },
        { name: 'Haseeb Qureshi', focus: 'DeFi & L1s', match: 72, description: 'Dragonfly partner, former 21.co, deep crypto thesis', ticket: '$50K-500K' },
        { name: 'Linda Xie', focus: 'Early-Stage Crypto', match: 70, description: 'Scalar Capital co-founder, ex-Coinbase, NFT expert', ticket: '$25K-200K' }
      ];
      
      // 6 Hackathons
      const hackathons = [
        { name: 'Colosseum Accelerator', focus: 'Solana Startups', match: 94, description: '$250K prize + $500K investment for winners', ticket: '$750K total' },
        { name: 'ETHGlobal', focus: 'Ethereum Ecosystem', match: 90, description: 'Leading Ethereum hackathon series, $500K+ in prizes', ticket: '$100-250K' },
        { name: 'HackMoney (DeFi)', focus: 'DeFi Innovation', match: 88, description: 'MetaCartel-backed DeFi hackathon, VC intros', ticket: '$50-150K' },
        { name: 'Solana Hyperdrive', focus: 'Solana DeFi', match: 86, description: 'Focused on payments & lending, $300K prize pool', ticket: '$100-200K' },
        { name: 'Encode Club', focus: 'Web3 Education', match: 84, description: '8-week bootcamp + hackathon, hiring partners', ticket: '$50-100K' },
        { name: 'Chainlink Spring', focus: 'Oracle Applications', match: 82, description: 'Build with Chainlink oracles, $150K prizes', ticket: '$25-75K' }
      ];
      
      // 20 Grants
      const grants = [
        { name: 'Solana Foundation', focus: 'DeFi on Solana', match: 90, description: 'Up to $500K non-dilutive grants for Solana builders', ticket: '$50-500K' },
        { name: 'Ethereum Foundation', focus: 'Ethereum Infrastructure', match: 88, description: 'EF grants for public goods & core development', ticket: '$100-1M' },
        { name: 'Uniswap Grants', focus: 'DeFi Tooling', match: 86, description: 'Support Uniswap ecosystem development', ticket: '$25-250K' },
        { name: 'Aave Grants DAO', focus: 'Aave Ecosystem', match: 84, description: 'Community-governed grants for Aave integrations', ticket: '$10-150K' },
        { name: 'Compound Grants', focus: 'Money Markets', match: 82, description: 'Build on Compound protocol', ticket: '$25-200K' },
        { name: 'The Graph Foundation', focus: 'Data Infrastructure', match: 80, description: 'Subgraph development & Web3 data tools', ticket: '$5-100K' },
        { name: 'Polygon Village', focus: 'Polygon Ecosystem', match: 78, description: 'Grants + incubation for Polygon builders', ticket: '$10-250K' },
        { name: 'Filecoin Foundation', focus: 'Decentralized Storage', match: 76, description: 'Storage infrastructure & applications', ticket: '$50-500K' },
        { name: 'Protocol Labs', focus: 'Web3 Infrastructure', match: 74, description: 'IPFS, libp2p, & decentralized tech', ticket: '$25-300K' },
        { name: 'Optimism RetroPGF', focus: 'Public Goods', match: 72, description: 'Retroactive funding for Optimism impact', ticket: '$10-500K' },
        { name: 'Arbitrum DAO', focus: 'L2 Applications', match: 70, description: 'Build on Arbitrum rollup', ticket: '$20-200K' },
        { name: 'Avalanche Rush', focus: 'Avalanche DeFi', match: 68, description: 'Liquidity mining & DeFi incentives', ticket: '$100K-2M' },
        { name: 'NEAR Foundation', focus: 'NEAR Ecosystem', match: 66, description: 'Grants for NEAR protocol builders', ticket: '$10-150K' },
        { name: 'Cosmos Hub', focus: 'Inter-Blockchain', match: 64, description: 'IBC & cross-chain applications', ticket: '$25-250K' },
        { name: 'Tezos Foundation', focus: 'Tezos Development', match: 62, description: 'Smart contracts & dApps on Tezos', ticket: '$10-200K' },
        { name: 'Gitcoin Grants', focus: 'Public Goods', match: 60, description: 'Quadratic funding for open source', ticket: '$5-100K' },
        { name: 'MakerDAO', focus: 'DAI Ecosystem', match: 58, description: 'MakerDAO protocol integrations', ticket: '$10-150K' },
        { name: 'Gnosis Chain', focus: 'Payments & DAOs', match: 56, description: 'Build on Gnosis Chain', ticket: '$10-100K' },
        { name: 'Web3 Foundation', focus: 'Polkadot Ecosystem', match: 54, description: 'Substrate & parachain development', ticket: '$30-500K' },
        { name: 'Zcash Foundation', focus: 'Privacy Tech', match: 52, description: 'Zero-knowledge & privacy applications', ticket: '$25-200K' }
      ];
      
      // Simulate progressive loading
      for (const vc of vcs) {
        await new Promise(r => setTimeout(r, 400));
        matches.push({ type: 'vc', ...vc });
        setInvestorMatches([...matches]);
      }
      
      for (const angel of angels) {
        await new Promise(r => setTimeout(r, 400));
        matches.push({ type: 'angel', ...angel });
        setInvestorMatches([...matches]);
      }
      
      for (const hackathon of hackathons) {
        await new Promise(r => setTimeout(r, 400));
        matches.push({ type: 'hackathon', ...hackathon });
        setInvestorMatches([...matches]);
      }
      
      for (const grant of grants) {
        await new Promise(r => setTimeout(r, 400));
        matches.push({ type: 'grant', ...grant });
        setInvestorMatches([...matches]);
      }
      
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-4 overflow-hidden relative">
      {/* Multi-layer animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent animate-pulse pointer-events-none" />
      
      {/* Animated mesh gradient overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      
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
                <div className={`min-h-[500px] bg-gradient-to-br ${getSlideGradient(currentSlide)} p-16 flex flex-col justify-center relative overflow-hidden`}>
                  {/* Decorative background elements */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                  
                  {/* Slide Number */}
                  <div className="absolute top-8 right-8 flex items-center gap-3">
                    <div className="text-white/40 text-sm font-mono tracking-wider">
                      {currentSlide + 1} / {pitchDeck.length}
                    </div>
                  </div>
                  
                  {/* Logo placeholder (top left) */}
                  <div className="absolute top-8 left-8">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg" />
                      <span className="text-white/80 font-semibold text-sm">MyStartup.ai</span>
                    </div>
                  </div>
                  
                  <div className="relative z-10 max-w-5xl mx-auto w-full">
                    {/* Slide Icon with modern design */}
                    <div className="flex items-center gap-4 mb-8">
                      {(() => {
                        const SlideIcon = getSlideIcon(currentSlide);
                        return (
                          <div className="relative">
                            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl" />
                            <div className="relative bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                              <SlideIcon className="h-12 w-12 text-white" />
                            </div>
                          </div>
                        );
                      })()}
                      <div className="h-px flex-1 bg-gradient-to-r from-white/40 to-transparent" />
                    </div>
                    
                    {/* Slide Title with superior typography */}
                    <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tight">
                      {getSlideTitle(currentSlide)}
                    </h2>
                    
                    {/* Slide Content with better hierarchy */}
                    <div className="space-y-6">
                      <p className="text-2xl md:text-3xl text-white/95 leading-relaxed font-light max-w-4xl">
                        {pitchDeck[currentSlide].replace(/^[🎯💡📈💰🚀]\s*/, '')}
                      </p>
                      
                      {/* Visual accent line */}
                      <div className="flex gap-2 pt-4">
                        <div className="h-1 w-20 bg-white/60 rounded-full" />
                        <div className="h-1 w-12 bg-white/40 rounded-full" />
                        <div className="h-1 w-8 bg-white/20 rounded-full" />
                      </div>
                    </div>
                  </div>
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
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-green-400" />
                    Top Investor Matches
                  </CardTitle>
                  <CardDescription className="text-green-200">
                    {investorMatches.filter(inv => investorFilter === 'all' || inv.type === investorFilter).length} AI-matched opportunities
                  </CardDescription>
                </div>
                
                {/* Filter Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={investorFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setInvestorFilter('all')}
                    className={investorFilter === 'all' ? 'bg-green-600 hover:bg-green-700' : 'border-green-500/30 text-white hover:bg-green-500/20'}
                  >
                    All ({investorMatches.length})
                  </Button>
                  <Button
                    size="sm"
                    variant={investorFilter === 'vc' ? 'default' : 'outline'}
                    onClick={() => setInvestorFilter('vc')}
                    className={investorFilter === 'vc' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-500/30 text-white hover:bg-blue-500/20'}
                  >
                    VCs ({investorMatches.filter(i => i.type === 'vc').length})
                  </Button>
                  <Button
                    size="sm"
                    variant={investorFilter === 'angel' ? 'default' : 'outline'}
                    onClick={() => setInvestorFilter('angel')}
                    className={investorFilter === 'angel' ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-500/30 text-white hover:bg-purple-500/20'}
                  >
                    Angels ({investorMatches.filter(i => i.type === 'angel').length})
                  </Button>
                  <Button
                    size="sm"
                    variant={investorFilter === 'grant' ? 'default' : 'outline'}
                    onClick={() => setInvestorFilter('grant')}
                    className={investorFilter === 'grant' ? 'bg-green-600 hover:bg-green-700' : 'border-green-500/30 text-white hover:bg-green-500/20'}
                  >
                    Grants ({investorMatches.filter(i => i.type === 'grant').length})
                  </Button>
                  <Button
                    size="sm"
                    variant={investorFilter === 'hackathon' ? 'default' : 'outline'}
                    onClick={() => setInvestorFilter('hackathon')}
                    className={investorFilter === 'hackathon' ? 'bg-yellow-600 hover:bg-yellow-700' : 'border-yellow-500/30 text-white hover:bg-yellow-500/20'}
                  >
                    Hackathons ({investorMatches.filter(i => i.type === 'hackathon').length})
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
              {investorMatches
                .filter(investor => investorFilter === 'all' || investor.type === investorFilter)
                .map((investor, idx) => {
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
                    className={`relative group bg-gradient-to-br ${getTypeColor()} border border-white/10 rounded-xl p-5 animate-in fade-in slide-in-from-left duration-500 hover:border-white/30 transition-all overflow-hidden`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                    data-testid={`investor-${idx}`}
                  >
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1">
                          {/* Icon with glow effect */}
                          <div className="relative">
                            <div className="absolute inset-0 bg-white/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                              <TypeIcon className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-white mb-1 truncate">{investor.name}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="border-white/30 text-white/80 text-xs capitalize">
                                {investor.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        {/* Match score */}
                        <div className="flex flex-col items-end">
                          <div className="relative">
                            <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl" />
                            <div className="relative text-3xl font-black text-green-400">{investor.match}%</div>
                          </div>
                          <p className="text-xs text-white/50 font-medium mt-1">Match Score</p>
                        </div>
                      </div>
                      
                      {/* Focus area with icon */}
                      <div className="flex items-center gap-2 mb-3 p-3 bg-white/5 rounded-lg border border-white/10">
                        <Target className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                        <p className="text-sm text-white/90">
                          <span className="font-semibold text-white">Focus:</span> {investor.focus}
                        </p>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-white/75 leading-relaxed mb-4">{investor.description}</p>
                      
                      {/* Ticket size */}
                      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                        <DollarSign className="h-5 w-5 text-green-400" />
                        <p className="text-base font-bold text-white">{investor.ticket}</p>
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
