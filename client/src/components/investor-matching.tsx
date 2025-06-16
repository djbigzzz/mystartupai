import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  CheckCircle
} from "lucide-react";

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
  recent_investments: string[];
  focus_areas: string[];
  avatar: string;
  linkedinUrl?: string;
  warmIntro?: boolean;
  responseRate: number;
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
  const [savedInvestors, setSavedInvestors] = useState<Set<string>>(new Set());
  const [appliedInvestors, setAppliedInvestors] = useState<Set<string>>(new Set());

  // Simulated investor database
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
        recent_investments: ["Stripe", "Airbnb", "DoorDash"],
        focus_areas: ["B2B SaaS", "Enterprise AI", "Climate Tech"],
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
        warmIntro: true,
        responseRate: 87
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
        recent_investments: ["Coinbase", "Robinhood", "Plaid"],
        focus_areas: ["Financial Infrastructure", "Crypto", "API Economy"],
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        warmIntro: false,
        responseRate: 92
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
        recent_investments: ["Instacart", "Reddit", "Gitlab"],
        focus_areas: ["Early Stage", "Global Markets", "Deep Tech"],
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        warmIntro: true,
        responseRate: 78
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
        recent_investments: ["Slack", "Ring", "Nest"],
        focus_areas: ["Enterprise Software", "Consumer Tech", "Digital Health"],
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        warmIntro: false,
        responseRate: 83
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
        recent_investments: ["Revolut", "Deliveroo", "Farfetch"],
        focus_areas: ["European Markets", "B2B Software", "Marketplaces"],
        avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
        warmIntro: false,
        responseRate: 79
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
        recent_investments: ["Tesla", "SpaceX", "Boring Company"],
        focus_areas: ["Climate Solutions", "Real Estate Tech", "Transportation"],
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
        warmIntro: true,
        responseRate: 95
      }
    ];

    setInvestors(investorData);
    setFilteredInvestors(investorData);
  }, []);

  useEffect(() => {
    let filtered = investors;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(investor => 
        investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.focus_areas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()))
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

    // Sort by match score
    filtered.sort((a, b) => b.matchScore - a.matchScore);

    setFilteredInvestors(filtered);
  }, [searchTerm, stageFilter, typeFilter, investors]);

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

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <div className="space-y-8">
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search investors, firms, or focus areas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                <SelectItem value="Seed">Seed</SelectItem>
                <SelectItem value="Series A">Series A</SelectItem>
                <SelectItem value="Series B">Series B</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="VC">Venture Capital</SelectItem>
                <SelectItem value="Angel">Angel Investor</SelectItem>
                <SelectItem value="Corporate">Corporate VC</SelectItem>
                <SelectItem value="Fund">Fund</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-green-600">
              {filteredInvestors.filter(i => i.matchScore >= 90).length}
            </div>
            <p className="text-sm text-slate-600">High Match (90%+)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-red-600">{savedInvestors.size}</div>
            <p className="text-sm text-slate-600">Saved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Send className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-blue-600">{appliedInvestors.size}</div>
            <p className="text-sm text-slate-600">Applied</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-purple-600">
              {filteredInvestors.filter(i => i.warmIntro).length}
            </div>
            <p className="text-sm text-slate-600">Warm Intros</p>
          </CardContent>
        </Card>
      </div>

      {/* Investors Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredInvestors.map((investor) => (
          <Card key={investor.id} className="hover:shadow-lg transition-all duration-300">
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
                  <Badge className={`${getMatchScoreColor(investor.matchScore)} font-bold`}>
                    {investor.matchScore}% match
                  </Badge>
                  {investor.warmIntro && (
                    <Badge className="bg-orange-100 text-orange-800 mt-1 block">
                      <Zap className="w-3 h-3 mr-1" />
                      Warm Intro
                    </Badge>
                  )}
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

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSaveInvestor(investor.id)}
                  className={savedInvestors.has(investor.id) ? "bg-red-50 text-red-600 border-red-200" : ""}
                >
                  <Heart className={`w-4 h-4 mr-1 ${savedInvestors.has(investor.id) ? "fill-current" : ""}`} />
                  {savedInvestors.has(investor.id) ? "Saved" : "Save"}
                </Button>
                
                <Button
                  size="sm"
                  onClick={() => handleApplyToInvestor(investor.id)}
                  disabled={appliedInvestors.has(investor.id)}
                  className="flex-1"
                >
                  {appliedInvestors.has(investor.id) ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Applied
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-1" />
                      {investor.warmIntro ? "Request Intro" : "Apply"}
                    </>
                  )}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInvestors.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No investors found</h3>
            <p className="text-slate-600">Try adjusting your search criteria or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}