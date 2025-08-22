import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Building, 
  Calendar,
  AlertCircle,
  Target,
  CheckCircle,
  Clock,
  Award,
  Users,
  FileText,
  ExternalLink
} from "lucide-react";

export default function FundingDemo() {
  const fundingOpportunities = [
    {
      id: 1,
      name: "Small Business Innovation Research (SBIR)",
      organization: "National Science Foundation",
      type: "Grant",
      amount: "$1.7M",
      deadline: "March 15, 2025",
      daysLeft: 45,
      matchScore: 94,
      eligibility: ["Health Tech", "AI Research", "Early Stage"],
      status: "Eligible",
      description: "Funding for innovative health technology solutions with AI components"
    },
    {
      id: 2,
      name: "Series A Round",
      organization: "Andreessen Horowitz",
      type: "Investment",
      amount: "$8M - $15M",
      deadline: "Rolling",
      daysLeft: null,
      matchScore: 89,
      eligibility: ["Series A", "FinTech", "Enterprise"],
      status: "Potential Match",
      description: "Early stage venture capital for fintech startups"
    },
    {
      id: 3,
      name: "Health Innovation Fund",
      organization: "Johnson & Johnson",
      type: "Corporate VC",
      amount: "$2M - $10M",
      deadline: "April 30, 2025",
      daysLeft: 90,
      matchScore: 87,
      eligibility: ["Health Tech", "Digital Health", "Validation"],
      status: "Under Review",
      description: "Corporate venture capital for digital health innovations"
    },
    {
      id: 4,
      name: "Climate Tech Accelerator",
      organization: "Breakthrough Energy",
      type: "Accelerator",
      amount: "$250K + Demo Day",
      deadline: "February 28, 2025",
      daysLeft: 30,
      matchScore: 75,
      eligibility: ["Climate Tech", "Sustainability", "Early Stage"],
      status: "Available",
      description: "3-month accelerator program for climate technology startups"
    }
  ];

  const fundingStats = [
    {
      title: "Total Available",
      value: "$127M",
      icon: DollarSign,
      description: "Across 45 opportunities"
    },
    {
      title: "High Matches",
      value: "12",
      icon: Target,
      description: "85%+ compatibility"
    },
    {
      title: "Active Applications",
      value: "3",
      icon: FileText,
      description: "In progress"
    },
    {
      title: "Success Rate",
      value: "28%",
      icon: TrendingUp,
      description: "Industry average"
    }
  ];

  const applicationProgress = [
    {
      name: "SBIR Phase I",
      progress: 85,
      status: "In Review",
      amount: "$275K",
      deadline: "Feb 15, 2025"
    },
    {
      name: "Angel Investment",
      progress: 60,
      status: "Preparing",
      amount: "$500K",
      deadline: "Mar 1, 2025"
    },
    {
      name: "Venture Capital",
      progress: 30,
      status: "Research",
      amount: "$2M",
      deadline: "Apr 15, 2025"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Eligible": return "bg-green-100 text-green-800";
      case "Potential Match": return "bg-blue-100 text-blue-800";
      case "Under Review": return "bg-yellow-100 text-yellow-800";
      case "Available": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Grant": return "bg-green-50 text-green-700 border-green-200";
      case "Investment": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Corporate VC": return "bg-purple-50 text-purple-700 border-purple-200";
      case "Accelerator": return "bg-orange-50 text-orange-700 border-orange-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <DollarSign className="w-8 h-8 mr-3 text-blue-600" />
                Funding Opportunities
                <Badge className="ml-3 bg-orange-50 text-orange-600 border-orange-200">
                  Demo
                </Badge>
              </h1>
              <p className="text-gray-600 mt-2">AI-matched grants, investments, and accelerator programs</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <AlertCircle className="w-4 h-4 mr-2" />
                This is a demo
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Target className="w-4 h-4 mr-2" />
                Find More Opportunities
              </Button>
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {fundingStats.map((stat, index) => {
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

        {/* Active Applications */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Active Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applicationProgress.map((app, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{app.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(app.status)}>
                        {app.status}
                      </Badge>
                      <span className="text-sm font-medium">{app.amount}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress: {app.progress}%</span>
                    <span className="text-sm text-gray-600">Due: {app.deadline}</span>
                  </div>
                  <Progress value={app.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Funding Opportunities */}
        <div className="space-y-6">
          {fundingOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
                  {/* Opportunity Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{opportunity.name}</h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Building className="w-4 h-4 mr-1" />
                          <span className="font-medium">{opportunity.organization}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getTypeColor(opportunity.type)}>
                          {opportunity.type}
                        </Badge>
                        <Badge className={getStatusColor(opportunity.status)}>
                          {opportunity.status}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{opportunity.description}</p>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Funding Amount</p>
                        <p className="text-lg font-semibold text-green-600">{opportunity.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Deadline</p>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-900">{opportunity.deadline}</span>
                        </div>
                        {opportunity.daysLeft && (
                          <p className="text-xs text-red-600">{opportunity.daysLeft} days left</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Match Score</p>
                        <div className="flex items-center">
                          <span className="text-lg font-semibold text-blue-600">{opportunity.matchScore}%</span>
                          <Award className="w-4 h-4 ml-1 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    {/* Eligibility */}
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Eligibility</p>
                      <div className="flex flex-wrap gap-2">
                        {opportunity.eligibility.map((criteria, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {criteria}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 lg:w-48">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <FileText className="w-4 h-4 mr-1" />
                      Apply Now
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Users className="w-4 h-4 mr-1" />
                      Get Help
                    </Button>
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
                  This funding database shows sample opportunities. In the full version, you'll access real-time funding data 
                  from grants.gov, venture capital firms, accelerators, and corporate innovation programs. Our AI matches 
                  opportunities to your startup profile and helps with application preparation.
                </p>
                <div className="flex space-x-3 mt-3">
                  <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    View Matching Criteria
                  </Button>
                  <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    Learn About Application Help
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