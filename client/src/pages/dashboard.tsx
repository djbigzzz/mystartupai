import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard,
  User,
  Settings,
  Plus,
  TrendingUp,
  FileText,
  Users,
  DollarSign,
  Target,
  Calendar,
  Bell,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface DashboardStats {
  totalIdeas: number;
  completedAnalyses: number;
  businessPlansGenerated: number;
  investorConnections: number;
}

interface RecentActivity {
  id: string;
  type: "idea" | "analysis" | "business_plan" | "investor";
  title: string;
  description: string;
  timestamp: string;
  status: "completed" | "in_progress" | "pending";
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock user data - will be replaced with real data
  const user = {
    id: 1,
    name: "John Entrepreneur",
    email: "john@startup.com",
    avatar: null,
    plan: "Pro",
    joinedAt: "2024-01-15"
  };

  // Mock dashboard stats
  const stats: DashboardStats = {
    totalIdeas: 12,
    completedAnalyses: 8,
    businessPlansGenerated: 5,
    investorConnections: 23
  };

  // Mock recent activity
  const recentActivity: RecentActivity[] = [
    {
      id: "1",
      type: "analysis",
      title: "AI Fitness App Analysis Complete",
      description: "Market analysis shows strong potential with 8.5/10 score",
      timestamp: "2 hours ago",
      status: "completed"
    },
    {
      id: "2",
      type: "business_plan",
      title: "FinTech Platform Business Plan",
      description: "12-section business plan generated and ready for review",
      timestamp: "1 day ago",
      status: "completed"
    },
    {
      id: "3",
      type: "investor",
      title: "New Investor Match",
      description: "3 potential investors match your startup profile",
      timestamp: "2 days ago",
      status: "pending"
    }
  ];

  const quickActions = [
    {
      title: "Submit New Idea",
      description: "Start with a new startup concept",
      icon: Plus,
      action: () => console.log("New idea"),
      color: "bg-blue-500"
    },
    {
      title: "View Analytics",
      description: "Check your startup metrics",
      icon: TrendingUp,
      action: () => console.log("Analytics"),
      color: "bg-green-500"
    },
    {
      title: "Find Investors",
      description: "Connect with potential investors",
      icon: Users,
      action: () => console.log("Investors"),
      color: "bg-purple-500"
    },
    {
      title: "Generate Pitch Deck",
      description: "Create investor presentations",
      icon: FileText,
      action: () => console.log("Pitch deck"),
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">MyStartup.ai</span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search ideas, plans, investors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.plan} Plan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">
            Continue building your startup empire. You're making great progress!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalIdeas}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analyses Done</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedAnalyses}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.completedAnalyses / stats.totalIdeas) * 100)}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Business Plans</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.businessPlansGenerated}</div>
              <p className="text-xs text-muted-foreground">
                Ready for investors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Investor Matches</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.investorConnections}</div>
              <p className="text-xs text-muted-foreground">
                Potential connections
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks to accelerate your startup journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <div
                        key={index}
                        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={action.action}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{action.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Progress Overview */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>
                  Track your startup development milestones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Idea Validation</span>
                    <span>80%</span>
                  </div>
                  <Progress value={80} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Business Planning</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Investor Readiness</span>
                    <span>40%</span>
                  </div>
                  <Progress value={40} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Market Launch</span>
                    <span>20%</span>
                  </div>
                  <Progress value={20} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates on your startups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.status === 'completed' ? 'bg-green-100' :
                        activity.status === 'in_progress' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {activity.type === 'idea' && <Target className="w-4 h-4" />}
                        {activity.type === 'analysis' && <TrendingUp className="w-4 h-4" />}
                        {activity.type === 'business_plan' && <FileText className="w-4 h-4" />}
                        {activity.type === 'investor' && <Users className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">{activity.timestamp}</span>
                          <Badge 
                            variant={activity.status === 'completed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {activity.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>
                  Things to focus on next
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 border-l-4 border-blue-500 bg-blue-50">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Review investor feedback</p>
                      <p className="text-xs text-gray-500">Due in 2 days</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 border-l-4 border-orange-500 bg-orange-50">
                    <FileText className="w-4 h-4 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">Complete pitch deck</p>
                      <p className="text-xs text-gray-500">Due in 5 days</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 border-l-4 border-green-500 bg-green-50">
                    <Users className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Schedule investor meeting</p>
                      <p className="text-xs text-gray-500">Due next week</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}