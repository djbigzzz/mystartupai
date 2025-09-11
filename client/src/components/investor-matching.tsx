import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  TrendingUp,
  Users,
  Star,
  Filter,
  Search,
  Send,
  Heart,
  ArrowRight,
  Target,
  Zap,
  CheckCircle,
  BarChart3,
  PieChart,
  Calendar,
  Mail,
  MessageCircle,
  Clock,
  Globe,
  Briefcase,
  Eye,
  Settings,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Info,
  RefreshCw,
  Download,
  Share2,
  Edit,
  X,
  Plus
} from "lucide-react";

interface MatchScoreBreakdown {
  industry: { score: number; reason: string; weight: number };
  stage: { score: number; reason: string; weight: number };
  portfolio: { score: number; reason: string; weight: number };
  geography: { score: number; reason: string; weight: number };
  thesis: { score: number; reason: string; weight: number };
  activity: { score: number; reason: string; weight: number };
}

interface InvestmentPattern {
  avgCheckSize: string;
  investmentFrequency: string;
  decisionTimeframe: string;
  preferredStages: string[];
  exitHistory: string[];
  successRate: number;
}

interface InvestorConnection {
  type: "direct" | "mutual" | "warm_intro" | "cold";
  strength: number;
  connector?: string;
  notes?: string;
}

interface Investor {
  id: string;
  name: string;
  firm: string;
  type: "VC" | "Angel" | "Corporate" | "Fund";
  location: string;
  industries: string[];
  stages: string[];
  checkSize: string;
  portfolio: number;
  matchScore: number;
  matchBreakdown: MatchScoreBreakdown;
  recent_investments: string[];
  focus_areas: string[];
  avatar: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  warmIntro?: boolean;
  responseRate: number;
  lastActive: string;
  investmentPattern: InvestmentPattern;
  connection: InvestorConnection;
  bio: string;
  investmentCriteria: string[];
  notableExits: string[];
  firmDescription: string;
  tags: string[];
}

interface InvestorMatchingProps {
  companyData: any;
}

export default function InvestorMatching({ companyData }: InvestorMatchingProps) {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [filteredInvestors, setFilteredInvestors] = useState<Investor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [checkSizeFilter, setCheckSizeFilter] = useState("all");
  const [warmIntroFilter, setWarmIntroFilter] = useState("all");
  const [savedInvestors, setSavedInvestors] = useState<Set<string>>(new Set());
  const [appliedInvestors, setAppliedInvestors] = useState<Set<string>>(new Set());
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [activeView, setActiveView] = useState<"grid" | "table" | "analytics">("grid");
  const [sortBy, setSortBy] = useState<"matchScore" | "responseRate" | "lastActive">("matchScore");

  // Enhanced investor database with detailed match scoring
  useEffect(() => {
    const investorData: Investor[] = [
      {
        id: "1",
        name: "Sarah Chen",
        firm: "Sequoia Capital",
        type: "VC",
        location: "Menlo Park, CA",
        industries: ["Technology", "SaaS", "AI/ML", "CleanTech"],
        stages: ["Seed", "Series A"],
        checkSize: "$1M-$5M",
        portfolio: 47,
        matchScore: 94,
        matchBreakdown: {
          industry: { score: 95, reason: "Perfect alignment with AI/ML and SaaS focus", weight: 25 },
          stage: { score: 98, reason: "Actively investing in Seed to Series A startups", weight: 20 },
          portfolio: { score: 92, reason: "Strong portfolio in similar tech companies", weight: 20 },
          geography: { score: 85, reason: "Bay Area preference but open to remote", weight: 15 },
          thesis: { score: 96, reason: "Investment thesis matches your product vision", weight: 15 },
          activity: { score: 90, reason: "Recently active with 3 investments this quarter", weight: 5 }
        },
        recent_investments: ["Stripe", "Airbnb", "DoorDash"],
        focus_areas: ["B2B SaaS", "Enterprise AI", "Climate Tech"],
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
        linkedinUrl: "https://linkedin.com/in/sarahchen",
        twitterUrl: "https://twitter.com/sarahchen",
        warmIntro: true,
        responseRate: 87,
        lastActive: "2 days ago",
        investmentPattern: {
          avgCheckSize: "$2.5M",
          investmentFrequency: "2-3 per quarter",
          decisionTimeframe: "6-8 weeks",
          preferredStages: ["Seed", "Series A"],
          exitHistory: ["GitHub (Microsoft)", "Instagram (Facebook)"],
          successRate: 78
        },
        connection: {
          type: "warm_intro",
          strength: 85,
          connector: "Alex Thompson (YC Partner)",
          notes: "Strong advocate for AI startups, prefers warm introductions"
        },
        bio: "Partner at Sequoia Capital focusing on early-stage enterprise software and AI companies. Former VP Engineering at Google.",
        investmentCriteria: ["Strong technical team", "Large addressable market", "Defensible technology", "Product-market fit signals"],
        notableExits: ["GitHub", "Instagram", "WhatsApp"],
        firmDescription: "Leading venture capital firm with $85B+ AUM, backing category-defining companies from idea to IPO",
        tags: ["AI Expert", "Enterprise Focus", "Technical Background", "Quick Decision"]
      },
      {
        id: "2", 
        name: "Michael Rodriguez",
        firm: "Andreessen Horowitz",
        type: "VC",
        location: "San Francisco, CA",
        industries: ["FinTech", "Technology", "Blockchain/Web3"],
        stages: ["Pre-Seed", "Seed"],
        checkSize: "$500K-$2M",
        portfolio: 32,
        matchScore: 89,
        matchBreakdown: {
          industry: { score: 88, reason: "Strong FinTech focus aligns with market trends", weight: 25 },
          stage: { score: 95, reason: "Perfect stage match for early-stage investments", weight: 20 },
          portfolio: { score: 87, reason: "Proven track record in similar companies", weight: 20 },
          geography: { score: 90, reason: "SF-based with strong network reach", weight: 15 },
          thesis: { score: 85, reason: "Investment philosophy matches innovation focus", weight: 15 },
          activity: { score: 92, reason: "Very active with recent high-profile deals", weight: 5 }
        },
        recent_investments: ["Coinbase", "Robinhood", "Plaid"],
        focus_areas: ["Financial Infrastructure", "Crypto", "API Economy"],
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        linkedinUrl: "https://linkedin.com/in/michaelrodriguez",
        twitterUrl: "https://twitter.com/mrodriguez",
        warmIntro: false,
        responseRate: 92,
        lastActive: "1 week ago",
        investmentPattern: {
          avgCheckSize: "$1.2M",
          investmentFrequency: "3-4 per quarter",
          decisionTimeframe: "4-6 weeks",
          preferredStages: ["Pre-Seed", "Seed"],
          exitHistory: ["Coinbase (IPO)", "Robinhood (Valuation)"],
          successRate: 82
        },
        connection: {
          type: "cold",
          strength: 35,
          notes: "Active on Twitter, responsive to thoughtful outreach"
        },
        bio: "General Partner at a16z focusing on fintech and crypto infrastructure. Former Goldman Sachs executive with 15+ years in financial services.",
        investmentCriteria: ["Experienced founding team", "Regulatory clarity", "Scalable technology", "Clear monetization"],
        notableExits: ["Coinbase", "Robinhood", "Plaid"],
        firmDescription: "Tier-1 VC firm with $35B+ AUM, leading investments in crypto, fintech, and enterprise software",
        tags: ["Crypto Expert", "FinTech Focus", "Fast Response", "Large Network"]
      },
      {
        id: "3",
        name: "Emily Watson",
        firm: "Y Combinator",
        type: "Fund",
        location: "Mountain View, CA", 
        industries: ["Technology", "Healthcare", "EdTech", "CleanTech"],
        stages: ["Pre-Seed", "Seed"],
        checkSize: "$250K-$1M",
        portfolio: 156,
        matchScore: 91,
        matchBreakdown: {
          industry: { score: 90, reason: "Broad technology focus includes your sector", weight: 25 },
          stage: { score: 98, reason: "YC specializes in exactly your stage", weight: 20 },
          portfolio: { score: 89, reason: "Extensive portfolio of successful tech companies", weight: 20 },
          geography: { score: 88, reason: "Silicon Valley network with global reach", weight: 15 },
          thesis: { score: 93, reason: "YC thesis perfectly aligned with startup growth", weight: 15 },
          activity: { score: 85, reason: "Consistent investment pace through batches", weight: 5 }
        },
        recent_investments: ["Instacart", "Reddit", "Gitlab"],
        focus_areas: ["Early Stage", "Global Markets", "Deep Tech"],
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        linkedinUrl: "https://linkedin.com/in/emilywatson",
        twitterUrl: "https://twitter.com/ewatson",
        warmIntro: true,
        responseRate: 78,
        lastActive: "3 days ago",
        investmentPattern: {
          avgCheckSize: "$500K",
          investmentFrequency: "50+ per batch",
          decisionTimeframe: "2-4 weeks",
          preferredStages: ["Pre-Seed", "Seed"],
          exitHistory: ["Airbnb (IPO)", "Stripe (Valuation)", "DoorDash (IPO)"],
          successRate: 85
        },
        connection: {
          type: "warm_intro",
          strength: 75,
          connector: "Mark Johnson (YC Alum)",
          notes: "Active mentor, prefers introductions through YC network"
        },
        bio: "Partner at Y Combinator focusing on early-stage technology companies. Former startup founder with successful exit experience.",
        investmentCriteria: ["Strong product-market fit", "Scalable business model", "Exceptional founders", "Large market opportunity"],
        notableExits: ["Airbnb", "Stripe", "DoorDash", "Coinbase"],
        firmDescription: "World's most successful startup accelerator with 4,000+ companies funded and $600B+ combined valuation",
        tags: ["Accelerator", "Founder Friendly", "Network Access", "Mentorship"]
      },
      {
        id: "4",
        name: "David Kim",
        firm: "Kleiner Perkins",
        type: "VC", 
        location: "Menlo Park, CA",
        industries: ["Technology", "Healthcare", "AI/ML"],
        stages: ["Series A", "Series B"],
        checkSize: "$5M-$15M",
        portfolio: 89,
        matchScore: 86,
        matchBreakdown: {
          industry: { score: 92, reason: "Strong AI/ML expertise matches your technology", weight: 25 },
          stage: { score: 75, reason: "Typically invests later stage than current need", weight: 20 },
          portfolio: { score: 88, reason: "Portfolio companies could provide partnerships", weight: 20 },
          geography: { score: 90, reason: "Strong Bay Area presence and network", weight: 15 },
          thesis: { score: 87, reason: "Investment approach aligns with growth strategy", weight: 15 },
          activity: { score: 80, reason: "Selective but consistent investment activity", weight: 5 }
        },
        recent_investments: ["Slack", "Ring", "Nest"],
        focus_areas: ["Enterprise Software", "Consumer Tech", "Digital Health"],
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        linkedinUrl: "https://linkedin.com/in/davidkim",
        twitterUrl: "https://twitter.com/dkim",
        warmIntro: false,
        responseRate: 83,
        lastActive: "1 week ago",
        investmentPattern: {
          avgCheckSize: "$8M",
          investmentFrequency: "1-2 per quarter",
          decisionTimeframe: "8-12 weeks",
          preferredStages: ["Series A", "Series B"],
          exitHistory: ["Nest (Google)", "Ring (Amazon)"],
          successRate: 72
        },
        connection: {
          type: "mutual",
          strength: 50,
          connector: "Lisa Park (Common Connection)",
          notes: "Thorough due diligence process, values technical depth"
        },
        bio: "General Partner at Kleiner Perkins with focus on enterprise AI and digital health. Former CTO at major healthcare technology company.",
        investmentCriteria: ["Technical differentiation", "Proven execution", "Market leadership potential", "Strong unit economics"],
        notableExits: ["Nest", "Ring", "Slack"],
        firmDescription: "Historic VC firm with 50+ year track record, $2B+ current fund focusing on enterprise and healthcare innovation",
        tags: ["Enterprise Focus", "Technical Due Diligence", "Later Stage", "Healthcare Expertise"]
      },
      {
        id: "5",
        name: "Anna Schmidt",
        firm: "Index Ventures",
        type: "VC",
        location: "London, UK",
        industries: ["Technology", "SaaS", "E-commerce"],
        stages: ["Seed", "Series A"],
        checkSize: "$2M-$8M",
        portfolio: 67,
        matchScore: 82,
        matchBreakdown: {
          industry: { score: 85, reason: "SaaS expertise relevant to your business model", weight: 25 },
          stage: { score: 90, reason: "Perfect stage alignment for Series A funding", weight: 20 },
          portfolio: { score: 80, reason: "Portfolio includes successful SaaS companies", weight: 20 },
          geography: { score: 70, reason: "European focus but expanding to US market", weight: 15 },
          thesis: { score: 84, reason: "Investment thesis supports global expansion", weight: 15 },
          activity: { score: 85, reason: "Active in current market conditions", weight: 5 }
        },
        recent_investments: ["Revolut", "Deliveroo", "Farfetch"],
        focus_areas: ["European Markets", "B2B Software", "Marketplaces"],
        avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
        linkedinUrl: "https://linkedin.com/in/annaschmidt",
        twitterUrl: "https://twitter.com/aschmidt",
        warmIntro: false,
        responseRate: 79,
        lastActive: "5 days ago",
        investmentPattern: {
          avgCheckSize: "$4M",
          investmentFrequency: "2-3 per quarter",
          decisionTimeframe: "6-10 weeks",
          preferredStages: ["Seed", "Series A"],
          exitHistory: ["Skype (Microsoft)", "MySQL (Oracle)"],
          successRate: 68
        },
        connection: {
          type: "cold",
          strength: 25,
          notes: "European investor expanding globally, open to innovative business models"
        },
        bio: "Principal at Index Ventures focusing on European SaaS and marketplace companies with global expansion potential.",
        investmentCriteria: ["European market leadership", "Global scalability", "Strong metrics", "Experienced team"],
        notableExits: ["Revolut", "Deliveroo", "Farfetch"],
        firmDescription: "European VC firm with $5B+ AUM, partnering with entrepreneurs to build market-leading technology companies",
        tags: ["European Market", "SaaS Expert", "Global Expansion", "Marketplace Focus"]
      },
      {
        id: "6",
        name: "James Thompson",
        firm: "Angel Investor",
        type: "Angel",
        location: "Austin, TX",
        industries: ["Technology", "CleanTech", "PropTech"],
        stages: ["Pre-Seed", "Seed"],
        checkSize: "$25K-$100K",
        portfolio: 23,
        matchScore: 88,
        matchBreakdown: {
          industry: { score: 85, reason: "Technology focus aligns with innovation trends", weight: 25 },
          stage: { score: 95, reason: "Perfect match for early-stage angel investment", weight: 20 },
          portfolio: { score: 88, reason: "Track record with high-growth tech companies", weight: 20 },
          geography: { score: 80, reason: "Austin tech scene connection, open to remote", weight: 15 },
          thesis: { score: 90, reason: "Investment philosophy supports disruptive innovation", weight: 15 },
          activity: { score: 92, reason: "Very active angel with quick decision making", weight: 5 }
        },
        recent_investments: ["Tesla", "SpaceX", "Boring Company"],
        focus_areas: ["Climate Solutions", "Real Estate Tech", "Transportation"],
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
        linkedinUrl: "https://linkedin.com/in/jamesthompson",
        twitterUrl: "https://twitter.com/jthompson",
        warmIntro: true,
        responseRate: 95,
        lastActive: "1 day ago",
        investmentPattern: {
          avgCheckSize: "$50K",
          investmentFrequency: "6-8 per year",
          decisionTimeframe: "2-3 weeks",
          preferredStages: ["Pre-Seed", "Seed"],
          exitHistory: ["Tesla (IPO)", "SpaceX (Private)"],
          successRate: 91
        },
        connection: {
          type: "warm_intro",
          strength: 90,
          connector: "Sarah Miller (Mutual Friend)",
          notes: "Highly responsive angel, prefers personal introductions and quick meetings"
        },
        bio: "Serial entrepreneur and angel investor with 3 successful exits. Focuses on deep tech and climate solutions with exceptional founder support.",
        investmentCriteria: ["Experienced founders", "Disruptive technology", "Clear market need", "Strong execution plan"],
        notableExits: ["Tesla", "SpaceX", "SolarCity"],
        firmDescription: "Independent angel investor with extensive network in Austin tech ecosystem and Silicon Valley connections",
        tags: ["Serial Entrepreneur", "Fast Decision", "Founder Friendly", "Tech Visionary"]
      }
    ];

    // Simulate more realistic data based on company profile
    const enhancedInvestors = investorData.map(investor => {
      // Adjust match scores based on company data alignment
      let adjustedScore = investor.matchScore;
      
      if (companyData.industry && investor.industries.includes(companyData.industry)) {
        adjustedScore += 5;
      }
      
      if (companyData.stage && investor.stages.includes(companyData.stage)) {
        adjustedScore += 3;
      }
      
      return {
        ...investor,
        matchScore: Math.min(adjustedScore, 100)
      };
    });

    setInvestors(enhancedInvestors);
    setFilteredInvestors(enhancedInvestors);
  }, [companyData]);

  useEffect(() => {
    let filtered = investors;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(investor => 
        investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.focus_areas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase())) ||
        investor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by stage
    if (stageFilter !== "all") {
      filtered = filtered.filter(investor => 
        investor.stages.includes(stageFilter)
      );
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(investor => 
        investor.type === typeFilter
      );
    }

    // Filter by location
    if (locationFilter !== "all") {
      filtered = filtered.filter(investor => 
        investor.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Filter by check size
    if (checkSizeFilter !== "all") {
      const sizeRanges = {
        "small": (checkSize: string) => checkSize.includes("K") || checkSize.includes("$25") || checkSize.includes("$50") || checkSize.includes("$100"),
        "medium": (checkSize: string) => checkSize.includes("$250K") || checkSize.includes("$500K") || checkSize.includes("$1M") || checkSize.includes("$2M"),
        "large": (checkSize: string) => checkSize.includes("$5M") || checkSize.includes("$8M") || checkSize.includes("$15M")
      };
      
      filtered = filtered.filter(investor => 
        sizeRanges[checkSizeFilter as keyof typeof sizeRanges]?.(investor.checkSize)
      );
    }

    // Filter by warm intro availability
    if (warmIntroFilter !== "all") {
      filtered = filtered.filter(investor => 
        warmIntroFilter === "warm" ? investor.warmIntro || investor.connection.type === "warm_intro" : 
        !investor.warmIntro && investor.connection.type !== "warm_intro"
      );
    }

    // Sort by selected criteria
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "responseRate":
          return b.responseRate - a.responseRate;
        case "lastActive":
          const aDate = new Date(a.lastActive.replace(" ago", ""));
          const bDate = new Date(b.lastActive.replace(" ago", ""));
          return bDate.getTime() - aDate.getTime();
        default:
          return b.matchScore - a.matchScore;
      }
    });

    setFilteredInvestors(filtered);
  }, [searchTerm, stageFilter, typeFilter, locationFilter, checkSizeFilter, warmIntroFilter, sortBy, investors]);

  const handleSaveInvestor = (investorId: string) => {
    setSavedInvestors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(investorId)) {
        newSet.delete(investorId);
      } else {
        newSet.add(investorId);
      }
      return newSet;
    });
  };

  const handleApplyToInvestor = (investorId: string) => {
    setAppliedInvestors(prev => new Set(prev).add(investorId));
  };

  const generateEmailTemplate = (investor: Investor) => {
    const templates = {
      cold: `Subject: ${companyData.companyName} - ${companyData.industry} Startup Seeking Partnership\n\nHi ${investor.name},\n\nI hope this email finds you well. I'm reaching out because of your impressive work at ${investor.firm} and your focus on ${investor.focus_areas[0]}.\n\nWe're building ${companyData.companyName}, a ${companyData.industry} company that ${companyData.description}. Given your investment in ${investor.recent_investments[0]} and expertise in ${investor.focus_areas[0]}, I believe there could be strong alignment.\n\nI'd love to share more about our traction and vision. Would you be open to a brief call next week?\n\nBest regards,\n[Your name]`,
      
      warm: `Subject: Introduction to ${companyData.companyName} - ${investor.connection.connector} Introduction\n\nHi ${investor.name},\n\n${investor.connection.connector} suggested I reach out regarding ${companyData.companyName}. We're building a ${companyData.industry} solution that aligns well with your portfolio, particularly given your success with ${investor.recent_investments[0]}.\n\n${companyData.description}\n\nI'd appreciate the opportunity to share our progress and get your insights. Are you available for a 20-minute call this week?\n\nThank you for your time.\n\nBest regards,\n[Your name]`,
      
      follow_up: `Subject: Following up on ${companyData.companyName}\n\nHi ${investor.name},\n\nI wanted to follow up on my previous email about ${companyData.companyName}. Since we last connected, we've made significant progress:\n\n• [Key milestone 1]\n• [Key milestone 2]\n• [Key milestone 3]\n\nGiven your expertise in ${investor.focus_areas[0]} and successful investments in companies like ${investor.recent_investments[0]}, I believe our progress would be of interest.\n\nWould you have 15 minutes for a brief update call?\n\nBest regards,\n[Your name]`
    };
    
    return templates;
  };

  const openEmailModal = (investor: Investor, templateType: 'cold' | 'warm' | 'follow_up' = 'cold') => {
    setSelectedInvestor(investor);
    const templates = generateEmailTemplate(investor);
    setEmailTemplate(templates[templateType]);
    setEmailSubject(templates[templateType].split('\n')[0].replace('Subject: ', ''));
    setIsEmailModalOpen(true);
  };

  const MatchScoreBreakdown = ({ breakdown }: { breakdown: MatchScoreBreakdown }) => {
    const categories = Object.entries(breakdown);
    const totalWeightedScore = categories.reduce((sum, [, data]) => sum + (data.score * data.weight / 100), 0);
    
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-green-600 mb-1">{totalWeightedScore.toFixed(0)}%</div>
          <p className="text-sm text-slate-600">Overall Match Score</p>
        </div>
        
        {categories.map(([category, data]) => (
          <div key={category} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium capitalize">{category.replace('_', ' ')}</span>
              <span className="text-sm text-slate-600">{data.score}%</span>
            </div>
            <Progress value={data.score} className="h-2" />
            <p className="text-xs text-slate-500">{data.reason}</p>
          </div>
        ))}
      </div>
    );
  };

  const InvestorProfileModal = ({ investor }: { investor: Investor }) => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-4">
          <img src={investor.avatar} alt={investor.name} className="w-16 h-16 rounded-full" />
          <div>
            <h2 className="text-2xl font-bold">{investor.name}</h2>
            <p className="text-lg text-slate-600">{investor.firm}</p>
          </div>
        </DialogTitle>
      </DialogHeader>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="match">Match Analysis</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Investor Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700">{investor.bio}</p>
                <div className="space-y-2">
                  <h4 className="font-medium">Investment Criteria</h4>
                  <ul className="list-disc list-inside text-sm text-slate-600">
                    {investor.investmentCriteria.map((criteria, i) => (
                      <li key={i}>{criteria}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2">
                  {investor.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Investment Pattern</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Avg Check Size:</span>
                    <p className="font-medium">{investor.investmentPattern.avgCheckSize}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Investment Frequency:</span>
                    <p className="font-medium">{investor.investmentPattern.investmentFrequency}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Decision Time:</span>
                    <p className="font-medium">{investor.investmentPattern.decisionTimeframe}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Success Rate:</span>
                    <p className="font-medium">{investor.investmentPattern.successRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="match" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Match Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <MatchScoreBreakdown breakdown={investor.matchBreakdown} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="portfolio" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Investments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {investor.recent_investments.map((investment, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="font-medium">{investment}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notable Exits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {investor.notableExits.map((exit, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="font-medium">{exit}</span>
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Connection Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Connection Type:</span>
                  <Badge className={investor.connection.type === 'warm_intro' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {investor.connection.type.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Connection Strength:</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={investor.connection.strength} className="w-20 h-2" />
                    <span className="text-sm">{investor.connection.strength}%</span>
                  </div>
                </div>
                {investor.connection.connector && (
                  <div>
                    <span className="text-slate-600">Connector:</span>
                    <p className="font-medium">{investor.connection.connector}</p>
                  </div>
                )}
                {investor.connection.notes && (
                  <div>
                    <span className="text-slate-600">Notes:</span>
                    <p className="text-sm">{investor.connection.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => openEmailModal(investor, 'cold')} className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Generate Cold Email
                </Button>
                {investor.connection.type === 'warm_intro' && (
                  <Button onClick={() => openEmailModal(investor, 'warm')} className="w-full" variant="outline">
                    <Zap className="w-4 h-4 mr-2" />
                    Request Warm Intro
                  </Button>
                )}
                <Button onClick={() => handleSaveInvestor(investor.id)} className="w-full" variant="outline">
                  <Heart className="w-4 h-4 mr-2" />
                  {savedInvestors.has(investor.id) ? 'Saved' : 'Save for Later'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  const EmailComposerModal = () => (
    <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Compose Email to {selectedInvestor?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Subject Line</label>
            <Input 
              value={emailSubject} 
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Email subject..."
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email Content</label>
            <Textarea 
              value={emailTemplate}
              onChange={(e) => setEmailTemplate(e.target.value)}
              rows={12}
              placeholder="Compose your email..."
            />
          </div>
          <div className="flex justify-between">
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => selectedInvestor && openEmailModal(selectedInvestor, 'cold')}>
                Cold Outreach
              </Button>
              <Button variant="outline" size="sm" onClick={() => selectedInvestor && openEmailModal(selectedInvestor, 'warm')}>
                Warm Intro
              </Button>
              <Button variant="outline" size="sm" onClick={() => selectedInvestor && openEmailModal(selectedInvestor, 'follow_up')}>
                Follow Up
              </Button>
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>Cancel</Button>
              <Button onClick={() => {
                // In a real app, this would send the email
                console.log('Sending email:', { subject: emailSubject, content: emailTemplate });
                setIsEmailModalOpen(false);
                if (selectedInvestor) {
                  handleApplyToInvestor(selectedInvestor.id);
                }
              }}>
                Send Email
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-8">
      {selectedInvestor && (
        <Dialog open={!!selectedInvestor} onOpenChange={() => setSelectedInvestor(null)}>
          <InvestorProfileModal investor={selectedInvestor} />
        </Dialog>
      )}
      
      <EmailComposerModal />
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Investor Matching for {companyData.companyName}
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              AI-powered investor recommendations based on your profile
            </p>
            <div className="flex items-center space-x-4">
              <Badge className="bg-purple-100 text-purple-800">
                <Target className="w-3 h-3 mr-1" />
                {filteredInvestors.length} matches found
              </Badge>
              <Badge variant="outline">{companyData.stage}</Badge>
              <Badge variant="outline">{companyData.industry}</Badge>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">1,247</div>
            <p className="text-slate-600 font-medium">Total Investors</p>
            <p className="text-sm text-slate-500">in our database</p>
          </div>
        </div>
      </div>

      {/* Enhanced Filters & Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Advanced Filtering & Search
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={activeView} onValueChange={(value: "grid" | "table" | "analytics") => setActiveView(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Grid View
                    </div>
                  </SelectItem>
                  <SelectItem value="table">
                    <div className="flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Table View
                    </div>
                  </SelectItem>
                  <SelectItem value="analytics">
                    <div className="flex items-center">
                      <PieChart className="w-4 h-4 mr-2" />
                      Analytics
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(value: "matchScore" | "responseRate" | "lastActive") => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matchScore">Match Score</SelectItem>
                  <SelectItem value="responseRate">Response Rate</SelectItem>
                  <SelectItem value="lastActive">Last Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Primary Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search investors, firms, focus areas, or use AI search (e.g., 'fintech investors in SF with warm intros')..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base"
                data-testid="input-investor-search"
              />
            </div>
            
            {/* Advanced Filters Grid */}
            <div className="grid md:grid-cols-6 gap-3">
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger data-testid="select-stage-filter">
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                  <SelectItem value="Seed">Seed</SelectItem>
                  <SelectItem value="Series A">Series A</SelectItem>
                  <SelectItem value="Series B">Series B</SelectItem>
                  <SelectItem value="Series C+">Series C+</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger data-testid="select-type-filter">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="VC">Venture Capital</SelectItem>
                  <SelectItem value="Angel">Angel Investor</SelectItem>
                  <SelectItem value="Corporate">Corporate VC</SelectItem>
                  <SelectItem value="Fund">Fund/Accelerator</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger data-testid="select-location-filter">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="san francisco">San Francisco</SelectItem>
                  <SelectItem value="new york">New York</SelectItem>
                  <SelectItem value="london">London</SelectItem>
                  <SelectItem value="austin">Austin</SelectItem>
                  <SelectItem value="boston">Boston</SelectItem>
                  <SelectItem value="berlin">Berlin</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={checkSizeFilter} onValueChange={setCheckSizeFilter}>
                <SelectTrigger data-testid="select-checksize-filter">
                  <SelectValue placeholder="Check Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="small">$25K - $100K</SelectItem>
                  <SelectItem value="medium">$250K - $2M</SelectItem>
                  <SelectItem value="large">$5M - $15M+</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={warmIntroFilter} onValueChange={setWarmIntroFilter}>
                <SelectTrigger data-testid="select-warmintro-filter">
                  <SelectValue placeholder="Connection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Connections</SelectItem>
                  <SelectItem value="warm">Warm Intros</SelectItem>
                  <SelectItem value="cold">Cold Outreach</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setStageFilter("all");
                setTypeFilter("all");
                setLocationFilter("all");
                setCheckSizeFilter("all");
                setWarmIntroFilter("all");
              }} data-testid="button-clear-filters">
                <RefreshCw className="w-4 h-4" />
                Clear
              </Button>
            </div>
            
            {/* Quick Filter Tags */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setWarmIntroFilter("warm")} data-testid="button-warm-intros">
                <Zap className="w-3 h-3 mr-1" />
                Warm Intros Only
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSortBy("responseRate")} data-testid="button-high-response">
                <TrendingUp className="w-3 h-3 mr-1" />
                High Response Rate
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                setStageFilter(companyData.stage || "Seed");
              }} data-testid="button-stage-match">
                <Target className="w-3 h-3 mr-1" />
                Perfect Stage Match
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSortBy("lastActive")} data-testid="button-recently-active">
                <Clock className="w-3 h-3 mr-1" />
                Recently Active
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Analytics Dashboard */}
      {activeView === "analytics" ? (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid md:grid-cols-6 gap-4">
            <Card data-testid="card-total-matches">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{filteredInvestors.length}</div>
                <p className="text-xs text-slate-600">Total Matches</p>
              </CardContent>
            </Card>
            
            <Card data-testid="card-high-match">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {filteredInvestors.filter(i => i.matchScore >= 90).length}
                </div>
                <p className="text-xs text-slate-600">High Match (90%+)</p>
              </CardContent>
            </Card>
            
            <Card data-testid="card-warm-intros">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {filteredInvestors.filter(i => i.warmIntro || i.connection.type === 'warm_intro').length}
                </div>
                <p className="text-xs text-slate-600">Warm Intros</p>
              </CardContent>
            </Card>
            
            <Card data-testid="card-saved">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-red-600">{savedInvestors.size}</div>
                <p className="text-xs text-slate-600">Saved</p>
              </CardContent>
            </Card>
            
            <Card data-testid="card-applied">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{appliedInvestors.size}</div>
                <p className="text-xs text-slate-600">Contacted</p>
              </CardContent>
            </Card>
            
            <Card data-testid="card-avg-response">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(filteredInvestors.reduce((sum, i) => sum + i.responseRate, 0) / filteredInvestors.length)}
                </div>
                <p className="text-xs text-slate-600">Avg Response %</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Analytics Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Match Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { range: '90-100%', count: filteredInvestors.filter(i => i.matchScore >= 90).length, color: 'bg-green-500' },
                    { range: '80-89%', count: filteredInvestors.filter(i => i.matchScore >= 80 && i.matchScore < 90).length, color: 'bg-blue-500' },
                    { range: '70-79%', count: filteredInvestors.filter(i => i.matchScore >= 70 && i.matchScore < 80).length, color: 'bg-yellow-500' },
                    { range: '60-69%', count: filteredInvestors.filter(i => i.matchScore >= 60 && i.matchScore < 70).length, color: 'bg-orange-500' },
                    { range: 'Below 60%', count: filteredInvestors.filter(i => i.matchScore < 60).length, color: 'bg-red-500' }
                  ].map((item) => (
                    <div key={item.range} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded ${item.color}`}></div>
                        <span className="text-sm">{item.range}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${(item.count / filteredInvestors.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Investor Type Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'VC', count: filteredInvestors.filter(i => i.type === 'VC').length, color: 'bg-blue-500' },
                    { type: 'Angel', count: filteredInvestors.filter(i => i.type === 'Angel').length, color: 'bg-green-500' },
                    { type: 'Fund', count: filteredInvestors.filter(i => i.type === 'Fund').length, color: 'bg-purple-500' },
                    { type: 'Corporate', count: filteredInvestors.filter(i => i.type === 'Corporate').length, color: 'bg-yellow-500' }
                  ].map((item) => (
                    <div key={item.type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded ${item.color}`}></div>
                        <span className="text-sm">{item.type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${(item.count / filteredInvestors.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Pipeline Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Investment Pipeline Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-700 mb-2">{filteredInvestors.length}</div>
                  <p className="text-sm text-slate-600 mb-1">Total Prospects</p>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{savedInvestors.size}</div>
                  <p className="text-sm text-slate-600 mb-1">Qualified</p>
                  <Progress value={(savedInvestors.size / filteredInvestors.length) * 100} className="h-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{appliedInvestors.size}</div>
                  <p className="text-sm text-slate-600 mb-1">Contacted</p>
                  <Progress value={(appliedInvestors.size / filteredInvestors.length) * 100} className="h-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                  <p className="text-sm text-slate-600 mb-1">Meetings Scheduled</p>
                  <Progress value={0} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Standard Quick Stats for Grid/Table View */
        <div className="grid md:grid-cols-4 gap-4">
          <Card data-testid="card-high-match-simple">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-green-600">
                {filteredInvestors.filter(i => i.matchScore >= 90).length}
              </div>
              <p className="text-sm text-slate-600">High Match (90%+)</p>
            </CardContent>
          </Card>
          <Card data-testid="card-saved-simple">
            <CardContent className="p-4 text-center">
              <Heart className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-red-600">{savedInvestors.size}</div>
              <p className="text-sm text-slate-600">Saved</p>
            </CardContent>
          </Card>
          <Card data-testid="card-applied-simple">
            <CardContent className="p-4 text-center">
              <Send className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-blue-600">{appliedInvestors.size}</div>
              <p className="text-sm text-slate-600">Applied</p>
            </CardContent>
          </Card>
          <Card data-testid="card-warm-simple">
            <CardContent className="p-4 text-center">
              <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-purple-600">
                {filteredInvestors.filter(i => i.warmIntro || i.connection.type === 'warm_intro').length}
              </div>
              <p className="text-sm text-slate-600">Warm Intros</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Area - Grid/Table Views */}
      {activeView === "analytics" ? null : (
        activeView === "table" ? (
          /* Table View */
          <Card>
            <CardHeader>
              <CardTitle>Investor Table View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Investor</th>
                      <th className="text-left p-2">Firm</th>
                      <th className="text-center p-2">Match %</th>
                      <th className="text-center p-2">Stage</th>
                      <th className="text-center p-2">Check Size</th>
                      <th className="text-center p-2">Response Rate</th>
                      <th className="text-center p-2">Connection</th>
                      <th className="text-center p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvestors.map((investor) => (
                      <tr key={investor.id} className="border-b hover:bg-slate-50">
                        <td className="p-2">
                          <div className="flex items-center space-x-2">
                            <img src={investor.avatar} alt={investor.name} className="w-8 h-8 rounded-full" />
                            <div>
                              <div className="font-medium">{investor.name}</div>
                              <div className="text-xs text-slate-500">{investor.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="font-medium">{investor.firm}</div>
                          <Badge variant="outline" className="text-xs">{investor.type}</Badge>
                        </td>
                        <td className="p-2 text-center">
                          <Badge className={`${getMatchScoreColor(investor.matchScore)} font-bold`}>
                            {investor.matchScore}%
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {investor.stages.slice(0, 2).map((stage) => (
                              <Badge key={stage} variant="secondary" className="text-xs">{stage}</Badge>
                            ))}
                          </div>
                        </td>
                        <td className="p-2 text-center font-medium">{investor.checkSize}</td>
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center">
                            <span className="font-medium">{investor.responseRate}%</span>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          {investor.connection.type === 'warm_intro' ? (
                            <Badge className="bg-orange-100 text-orange-800">
                              <Zap className="w-3 h-3 mr-1" />
                              Warm
                            </Badge>
                          ) : (
                            <Badge variant="outline">Cold</Badge>
                          )}
                        </td>
                        <td className="p-2">
                          <div className="flex space-x-1 justify-center">
                            <Button size="sm" variant="outline" onClick={() => setSelectedInvestor(investor)} data-testid={`button-view-${investor.id}`}>
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => openEmailModal(investor)} data-testid={`button-email-${investor.id}`}>
                              <Mail className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleSaveInvestor(investor.id)}
                              className={savedInvestors.has(investor.id) ? "bg-red-50 text-red-600" : ""}
                              data-testid={`button-save-${investor.id}`}
                            >
                              <Heart className={`w-3 h-3 ${savedInvestors.has(investor.id) ? "fill-current" : ""}`} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Grid View */
          <div className="grid md:grid-cols-2 gap-6">
            {filteredInvestors.map((investor) => (
              <Card key={investor.id} className="hover:shadow-lg transition-all duration-300" data-testid={`card-investor-${investor.id}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src={investor.avatar} 
                    alt={investor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{investor.name}</h3>
                    <p className="text-slate-600 font-medium">{investor.firm}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">{investor.type}</Badge>
                      <div className="flex items-center text-slate-500 text-sm">
                        <MapPin className="w-3 h-3 mr-1" />
                        {investor.location}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge className={`${getMatchScoreColor(investor.matchScore)} font-bold cursor-pointer`} onClick={() => setSelectedInvestor(investor)}>
                    {investor.matchScore}% match
                  </Badge>
                  {(investor.warmIntro || investor.connection.type === 'warm_intro') && (
                    <Badge className="bg-orange-100 text-orange-800 mt-1 block">
                      <Zap className="w-3 h-3 mr-1" />
                      Warm Intro
                    </Badge>
                  )}
                  <div className="text-xs text-slate-500 mt-1">Last active: {investor.lastActive}</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-slate-600">Check Size:</span>
                </div>
                <span className="font-medium">{investor.checkSize}</span>
                
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-slate-600">Portfolio:</span>
                </div>
                <span className="font-medium">{investor.portfolio} companies</span>
                
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-slate-600">Response Rate:</span>
                </div>
                <span className="font-medium">{investor.responseRate}%</span>
              </div>

              <div>
                <h5 className="font-medium text-slate-900 mb-2">Investment Stages</h5>
                <div className="flex flex-wrap gap-1">
                  {investor.stages.map((stage) => (
                    <Badge key={stage} variant="secondary" className="text-xs">
                      {stage}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-slate-900 mb-2">Focus Areas</h5>
                <div className="flex flex-wrap gap-1">
                  {investor.focus_areas.slice(0, 3).map((area) => (
                    <Badge key={area} className="bg-blue-100 text-blue-800 text-xs">
                      {area}
                    </Badge>
                  ))}
                  {investor.focus_areas.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{investor.focus_areas.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-slate-900 mb-2">Recent Investments</h5>
                <p className="text-sm text-slate-600">
                  {investor.recent_investments.slice(0, 3).join(", ")}
                  {investor.recent_investments.length > 3 && "..."}
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {/* Enhanced Match Score Visualization */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Match Breakdown</span>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedInvestor(investor)} className="h-auto p-0 text-xs text-blue-600">
                      View Details
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <div className="text-center">
                      <div className="text-green-600 font-bold">{investor.matchBreakdown.industry.score}%</div>
                      <div className="text-slate-500">Industry</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-600 font-bold">{investor.matchBreakdown.stage.score}%</div>
                      <div className="text-slate-500">Stage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-600 font-bold">{investor.matchBreakdown.thesis.score}%</div>
                      <div className="text-slate-500">Thesis</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveInvestor(investor.id)}
                    className={savedInvestors.has(investor.id) ? "bg-red-50 text-red-600 border-red-200" : ""}
                    data-testid={`button-save-investor-${investor.id}`}
                  >
                    <Heart className={`w-3 h-3 ${savedInvestors.has(investor.id) ? "fill-current" : ""}`} />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEmailModal(investor)}
                    data-testid={`button-email-investor-${investor.id}`}
                  >
                    <Mail className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => {
                      if (!appliedInvestors.has(investor.id)) {
                        openEmailModal(investor, investor.connection.type === 'warm_intro' ? 'warm' : 'cold');
                      }
                    }}
                    disabled={appliedInvestors.has(investor.id)}
                    data-testid={`button-apply-investor-${investor.id}`}
                  >
                    {appliedInvestors.has(investor.id) ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Send className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedInvestor(investor)}
                  className="w-full text-xs"
                  data-testid={`button-view-profile-${investor.id}`}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View Full Profile
                </Button>
              </div>
            </CardContent>
              </Card>
            ))}
          </div>
        )
      )}

      {/* No Results State */}
      {filteredInvestors.length === 0 && activeView !== "analytics" && (
        <Card data-testid="card-no-results">
          <CardContent className="py-12 text-center">
            <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No investors found</h3>
            <p className="text-slate-600 mb-4">Try adjusting your search criteria or filters</p>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setStageFilter("all");
                setTypeFilter("all");
                setLocationFilter("all");
                setCheckSizeFilter("all");
                setWarmIntroFilter("all");
              }} data-testid="button-clear-all-filters">
                Clear All Filters
              </Button>
              <Button variant="outline" onClick={() => setActiveView("analytics")} data-testid="button-view-analytics">
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}