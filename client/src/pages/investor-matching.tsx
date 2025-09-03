import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  ArrowLeft,
  Search,
  Filter,
  Heart,
  MessageSquare,
  Calendar,
  CheckCircle,
  Building,
  DollarSign,
  MapPin,
  Star,
  TrendingUp,
  Target,
  Brain,
  Zap,
  Mail,
  Phone,
  Briefcase,
  Globe
} from "lucide-react";
import { Link } from "wouter";

interface Investor {
  id: string;
  name: string;
  firm: string;
  title: string;
  avatar: string;
  location: string;
  focusStages: string[];
  industries: string[];
  ticketSize: string;
  portfolioSize: number;
  notableInvestments: string[];
  matchScore: number;
  recentActivity: string;
  contactInfo: {
    email?: string;
    linkedin?: string;
    website?: string;
  };
  aboute: string;
  investmentThesis: string;
  dealPreferences: {
    minTicket: string;
    maxTicket: string;
    preferredStage: string[];
    geographicFocus: string[];
  };
}

export default function InvestorMatching() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("all");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [isMatching, setIsMatching] = useState(false);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [favoriteInvestors, setFavoriteInvestors] = useState<string[]>([]);

  const investors: Investor[] = [
    {
      id: "1",
      name: "Sarah Chen",
      firm: "Sequoia Capital",
      title: "Principal",
      avatar: "/api/placeholder/64/64",
      location: "San Francisco, CA",
      focusStages: ["Seed", "Series A"],
      industries: ["SaaS", "Fintech", "AI/ML"],
      ticketSize: "$1M - $5M",
      portfolioSize: 47,
      notableInvestments: ["Stripe", "Airbnb", "DoorDash"],
      matchScore: 94,
      recentActivity: "Invested in 3 startups this quarter",
      contactInfo: {
        email: "sarah.chen@sequoiacap.com",
        linkedin: "linkedin.com/in/sarahchen",
        website: "sequoiacap.com"
      },
      aboute: "Focused on early-stage B2B SaaS and fintech startups with strong unit economics and defensible moats.",
      investmentThesis: "Looking for exceptional founders solving real problems in large markets with technology-first approaches.",
      dealPreferences: {
        minTicket: "$500K",
        maxTicket: "$5M",
        preferredStage: ["Pre-Seed", "Seed", "Series A"],
        geographicFocus: ["North America", "Europe"]
      }
    },
    {
      id: "2", 
      name: "Marcus Rodriguez",
      firm: "Andreessen Horowitz",
      title: "General Partner",
      avatar: "/api/placeholder/64/64",
      location: "Menlo Park, CA",
      focusStages: ["Series A", "Series B"],
      industries: ["Healthcare", "AI/ML", "Developer Tools"],
      ticketSize: "$5M - $15M",
      portfolioSize: 32,
      notableInvestments: ["GitHub", "Coinbase", "Slack"],
      matchScore: 87,
      recentActivity: "Speaking at TechCrunch Disrupt next week",
      contactInfo: {
        email: "marcus@a16z.com",
        linkedin: "linkedin.com/in/marcusrodriguez",
        website: "a16z.com"
      },
      aboute: "15+ years in venture capital with focus on transformative healthcare and AI technologies.",
      investmentThesis: "Investing in founders who are building category-defining companies with network effects.",
      dealPreferences: {
        minTicket: "$2M",
        maxTicket: "$15M", 
        preferredStage: ["Seed", "Series A", "Series B"],
        geographicFocus: ["North America", "Global"]
      }
    },
    {
      id: "3",
      name: "Emma Thompson",
      firm: "Kleiner Perkins",
      title: "Partner",
      avatar: "/api/placeholder/64/64",
      location: "San Francisco, CA",
      focusStages: ["Pre-Seed", "Seed"],
      industries: ["Consumer", "Social", "E-commerce"],
      ticketSize: "$250K - $2M",
      portfolioSize: 28,
      notableInvestments: ["Instagram", "Snapchat", "Pinterest"],
      matchScore: 79,
      recentActivity: "Published thesis on consumer social trends",
      contactInfo: {
        email: "emma@kpcb.com",
        linkedin: "linkedin.com/in/emmathompson",
        website: "kleinerperkins.com"
      },
      aboute: "Consumer internet veteran with deep experience in social platforms and marketplace businesses.",
      investmentThesis: "Backing founders building the next generation of consumer experiences and social platforms.",
      dealPreferences: {
        minTicket: "$100K",
        maxTicket: "$3M",
        preferredStage: ["Pre-Seed", "Seed"],
        geographicFocus: ["North America", "Europe", "Asia"]
      }
    },
    {
      id: "4",
      name: "David Kim",
      firm: "Greylock Partners", 
      title: "Venture Partner",
      avatar: "/api/placeholder/64/64",
      location: "Palo Alto, CA",
      focusStages: ["Series A", "Series B"],
      industries: ["Enterprise", "Security", "Infrastructure"],
      ticketSize: "$3M - $10M",
      portfolioSize: 19,
      notableInvestments: ["LinkedIn", "Workday", "Palo Alto Networks"],
      matchScore: 82,
      recentActivity: "Closed $50M Series B for cybersecurity startup",
      contactInfo: {
        email: "david.kim@greylock.com",
        linkedin: "linkedin.com/in/davidkim",
        website: "greylock.com"
      },
      aboute: "Former enterprise software executive turned investor, specializing in B2B infrastructure and security.",
      investmentThesis: "Investing in enterprise software companies that can scale to $100M+ ARR with strong moats.",
      dealPreferences: {
        minTicket: "$1M",
        maxTicket: "$12M",
        preferredStage: ["Seed", "Series A", "Series B"],
        geographicFocus: ["North America", "Europe"]
      }
    },
    {
      id: "5",
      name: "Lisa Park",
      firm: "First Round Capital",
      title: "Principal",
      avatar: "/api/placeholder/64/64", 
      location: "New York, NY",
      focusStages: ["Pre-Seed", "Seed"],
      industries: ["Fintech", "Healthcare", "Education"],
      ticketSize: "$500K - $3M",
      portfolioSize: 34,
      notableInvestments: ["Uber", "Square", "Warby Parker"],
      matchScore: 91,
      recentActivity: "Mentoring at Techstars Demo Day",
      contactInfo: {
        email: "lisa@firstround.com",
        linkedin: "linkedin.com/in/lisapark",
        website: "firstround.com"
      },
      aboute: "Former founder and operator focused on helping early-stage startups with go-to-market strategy.",
      investmentThesis: "Partnering with exceptional founders in underrepresented markets and demographics.",
      dealPreferences: {
        minTicket: "$250K",
        maxTicket: "$5M",
        preferredStage: ["Pre-Seed", "Seed", "Series A"],
        geographicFocus: ["North America", "Global"]
      }
    }
  ];

  const stages = ["Pre-Seed", "Seed", "Series A", "Series B", "Growth"];
  const industries = ["SaaS", "Fintech", "Healthcare", "AI/ML", "Consumer", "E-commerce", "Enterprise"];

  const handleStartMatching = async () => {
    setIsMatching(true);
    setMatchingProgress(0);
    
    // Simulate AI matching process
    const steps = [
      "Analyzing your startup profile...",
      "Scanning 10,000+ investor profiles...",
      "Matching investment thesis...",
      "Evaluating portfolio fit...",
      "Calculating compatibility scores...",
      "Ranking investment opportunities...",
      "Finalizing personalized matches..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMatchingProgress(((i + 1) / steps.length) * 100);
    }

    setIsMatching(false);
  };

  const toggleFavorite = (investorId: string) => {
    setFavoriteInvestors(prev => 
      prev.includes(investorId) 
        ? prev.filter(id => id !== investorId)
        : [...prev, investorId]
    );
  };

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         investor.firm.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = selectedStage === "all" || investor.focusStages.includes(selectedStage);
    const matchesIndustry = selectedIndustry === "all" || investor.industries.includes(selectedIndustry);
    
    return matchesSearch && matchesStage && matchesIndustry;
  });

  if (isMatching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
              Finding Your Perfect Investor Matches
            </CardTitle>
            <div className="flex items-center justify-center mb-6">
              <Brain className="w-12 h-12 text-purple-600 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                AI-Powered Investor Matching
              </h3>
              <p className="text-gray-600 mb-6">
                Our advanced algorithms are analyzing thousands of investor profiles to find the perfect matches for your startup
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Matching Progress</span>
                <span>{Math.round(matchingProgress)}%</span>
              </div>
              <Progress value={matchingProgress} className="h-3" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-600">10,000+</div>
                <div className="text-blue-500">Investor Profiles</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-semibold text-green-600">AI-Powered</div>
                <div className="text-green-500">Smart Matching</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="font-semibold text-purple-600">95%</div>
                <div className="text-purple-500">Match Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Investor Matching</h1>
                <p className="text-gray-600">Connect with the right investors for your startup</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-purple-100 text-purple-800">
                <Zap className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
              <Button onClick={handleStartMatching} className="bg-purple-600 hover:bg-purple-700">
                <Brain className="w-4 h-4 mr-2" />
                Start Smart Matching
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Your Perfect Investors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search investors or firms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Funding Stage</label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="all">All Stages</option>
                  {stages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="all">All Industries</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="matches" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="matches">Top Matches</TabsTrigger>
            <TabsTrigger value="favorites">Favorites ({favoriteInvestors.length})</TabsTrigger>
            <TabsTrigger value="contacted">Contacted</TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredInvestors.map((investor) => (
                <Card key={investor.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{investor.name}</h3>
                          <p className="text-sm text-gray-600">{investor.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(investor.id)}
                          className="p-1"
                        >
                          <Heart 
                            className={`w-4 h-4 ${favoriteInvestors.includes(investor.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                          />
                        </Button>
                        <Badge className={`text-xs ${
                          investor.matchScore >= 90 ? 'bg-green-100 text-green-800' :
                          investor.matchScore >= 80 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {investor.matchScore}% match
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <div className="font-medium text-gray-900 mb-1">{investor.firm}</div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {investor.location}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Ticket Size:</span>
                        <span className="font-medium">{investor.ticketSize}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Portfolio:</span>
                        <span className="font-medium">{investor.portfolioSize} companies</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Focus Areas</div>
                      <div className="flex flex-wrap gap-1">
                        {investor.industries.map((industry, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Stages</div>
                      <div className="flex flex-wrap gap-1">
                        {investor.focusStages.map((stage, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {stage}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Notable Investments</div>
                      <div className="text-sm text-gray-600">
                        {investor.notableInvestments.slice(0, 3).join(", ")}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Mail className="w-4 h-4 mr-1" />
                        Connect
                      </Button>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Favorites Yet</h3>
              <p className="text-gray-600">
                Click the heart icon on investor cards to save them here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="contacted" className="space-y-6">
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Contacts Yet</h3>
              <p className="text-gray-600">
                Start reaching out to investors to track your outreach here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}