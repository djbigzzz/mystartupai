import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Building, 
  Mail, 
  Phone, 
  MapPin,
  AlertCircle,
  Search,
  Filter,
  Star,
  TrendingUp,
  Target,
  ExternalLink,
  DollarSign
} from "lucide-react";

export default function InvestorsDemo() {
  const demoInvestors = [
    {
      id: 1,
      name: "Sarah Chen",
      firm: "Andreessen Horowitz",
      role: "Partner",
      focus: ["AI", "Health Tech", "Enterprise SaaS"],
      stage: "Series A",
      checkSize: "$5M - $15M",
      portfolio: ["Notion", "Clubhouse", "Workday"],
      matchScore: 95,
      location: "Menlo Park, CA",
      email: "sarah@a16z.com",
      linkedin: "linkedin.com/in/sarahchen",
      recentDeals: 12
    },
    {
      id: 2,
      name: "Mike Rodriguez", 
      firm: "Sequoia Capital",
      role: "Principal",
      focus: ["FinTech", "AI", "Developer Tools"],
      stage: "Seed to Series B",
      checkSize: "$1M - $25M",
      portfolio: ["Stripe", "WhatsApp", "Airbnb"],
      matchScore: 92,
      location: "Palo Alto, CA",
      email: "mike@sequoiacap.com",
      linkedin: "linkedin.com/in/mikerodriguez",
      recentDeals: 8
    },
    {
      id: 3,
      name: "Emily Watson",
      firm: "First Round Capital",
      role: "Partner",
      focus: ["Health Tech", "Consumer", "Mobile"],
      stage: "Pre-Seed to Series A",
      checkSize: "$500K - $10M",
      portfolio: ["Uber", "Square", "Warby Parker"],
      matchScore: 89,
      location: "New York, NY",
      email: "emily@firstround.com",
      linkedin: "linkedin.com/in/emilywatson",
      recentDeals: 15
    },
    {
      id: 4,
      name: "David Park",
      firm: "Accel Partners",
      role: "Associate",
      focus: ["B2B SaaS", "AI", "Infrastructure"],
      stage: "Series A to B",
      checkSize: "$2M - $50M",
      portfolio: ["Slack", "Dropbox", "Facebook"],
      matchScore: 87,
      location: "San Francisco, CA",
      email: "david@accel.com",
      linkedin: "linkedin.com/in/davidpark",
      recentDeals: 6
    },
    {
      id: 5,
      name: "Lisa Zhang",
      firm: "Kleiner Perkins",
      role: "Partner",
      focus: ["Consumer", "Health", "Sustainability"],
      stage: "Seed to Series A",
      checkSize: "$1M - $15M",
      portfolio: ["Twitter", "Google", "Amazon"],
      matchScore: 84,
      location: "Menlo Park, CA",
      email: "lisa@kpcb.com",
      linkedin: "linkedin.com/in/lisazhang",
      recentDeals: 10
    }
  ];

  const keyStats = [
    {
      title: "Total Investors",
      value: "2,847",
      icon: Users,
      description: "In our database"
    },
    {
      title: "High Matches",
      value: "24",
      icon: Target,
      description: "85%+ compatibility"
    },
    {
      title: "Avg. Check Size",
      value: "$8.2M",
      icon: DollarSign,
      description: "For your stage"
    },
    {
      title: "Response Rate",
      value: "23%",
      icon: TrendingUp,
      description: "Industry average"
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 80) return "bg-blue-100 text-blue-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getScoreStars = (score: number) => {
    const stars = Math.floor(score / 20);
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Users className="w-8 h-8 mr-3 text-blue-600" />
                Investor Matching
                <Badge className="ml-3 bg-orange-50 text-orange-600 border-orange-200">
                  Demo
                </Badge>
              </h1>
              <p className="text-gray-600 mt-2">AI-powered investor matching based on your startup profile</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <AlertCircle className="w-4 h-4 mr-2" />
                This is a demo
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Search className="w-4 h-4 mr-2" />
                Find More Investors
              </Button>
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {keyStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.description}</p>
                    </div>
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <Input 
                  placeholder="Search investors by name, firm, or focus..."
                  className="w-full"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter by Stage
              </Button>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter by Industry
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Investor List */}
        <div className="space-y-6">
          {demoInvestors.map((investor) => (
            <Card key={investor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  {/* Investor Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{investor.name}</h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Building className="w-4 h-4 mr-1" />
                          <span className="font-medium">{investor.firm}</span>
                          <span className="mx-2">•</span>
                          <span>{investor.role}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge className={getScoreColor(investor.matchScore)}>
                          {investor.matchScore}% Match
                        </Badge>
                        <div className="flex mt-1">
                          {getScoreStars(investor.matchScore)}
                        </div>
                      </div>
                    </div>

                    {/* Investment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Focus Areas</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {investor.focus.map((area, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Investment Stage</p>
                        <p className="text-sm text-gray-900">{investor.stage}</p>
                        <p className="text-sm text-gray-600">{investor.checkSize}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                        <p className="text-sm text-gray-900">{investor.recentDeals} deals this year</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          {investor.location}
                        </div>
                      </div>
                    </div>

                    {/* Portfolio Companies */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">Notable Portfolio</p>
                      <div className="flex flex-wrap gap-2">
                        {investor.portfolio.slice(0, 3).map((company, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {company}
                          </Badge>
                        ))}
                        {investor.portfolio.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{investor.portfolio.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Actions */}
                  <div className="flex flex-col space-y-2 lg:w-48">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Mail className="w-4 h-4 mr-1" />
                      Send Pitch
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Profile
                    </Button>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Notice */}
        <Card className="mt-8 bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-800">Demo Mode</h3>
                <p className="text-sm text-orange-700 mt-1">
                  This investor database shows sample profiles. In the full version, you'll access our comprehensive database 
                  of 10,000+ investors with real contact information, AI-powered matching based on your startup profile, 
                  and automated outreach capabilities.
                </p>
                <div className="flex space-x-3 mt-3">
                  <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    View Matching Algorithm
                  </Button>
                  <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    Learn About Pitch Templates
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}