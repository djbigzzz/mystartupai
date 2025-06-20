import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  TrendingUp,
  FileText,
  Users,
  DollarSign,
  Plus,
  Calendar,
  Bell,
  Target,
  Lightbulb,
  Brain,
  Rocket
} from "lucide-react";
import SidebarNavigation from "@/components/dashboard/sidebar-navigation";
import ProfileManagement from "@/components/profile/profile-management";

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
  const [activeSection, setActiveSection] = useState("overview");

  // Mock user data for testing - will be replaced with real authentication
  const user = {
    id: 1,
    name: "John Entrepreneur",
    email: "john@startup.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    company: "TechStartup Inc.",
    website: "https://techstartup.com",
    bio: "Serial entrepreneur with 10+ years experience in SaaS and fintech. Passionate about building solutions that solve real problems.",
    avatar: undefined,
    plan: "Pro",
    joinedAt: "2024-01-15",
    linkedin: "https://linkedin.com/in/johnentrepreneur",
    twitter: "https://twitter.com/johnentrepreneur",
    github: "https://github.com/johnentrepreneur",
    emailVerified: true,
    profileComplete: 85
  };

  // Mock stats data
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
      title: "AI SaaS Platform Analysis Complete",
      description: "Comprehensive market analysis and feasibility study finished",
      timestamp: "2 hours ago",
      status: "completed"
    },
    {
      id: "2",
      type: "business_plan",
      title: "Business Plan Generated",
      description: "12-section business plan ready for investor review",
      timestamp: "1 day ago",
      status: "completed"
    },
    {
      id: "3",
      type: "investor",
      title: "New Investor Match",
      description: "3 new potential investors matched your profile",
      timestamp: "2 days ago",
      status: "in_progress"
    }
  ];

  const quickActions = [
    {
      title: "Submit New Idea",
      description: "Get AI analysis of your startup concept",
      icon: Plus,
      color: "bg-blue-500",
      action: () => console.log("Submit new idea")
    },
    {
      title: "Generate Business Plan",
      description: "Create investor-ready business plan",
      icon: FileText,
      color: "bg-green-500",
      action: () => console.log("Generate business plan")
    },
    {
      title: "Find Investors",
      description: "Connect with relevant investors",
      icon: Users,
      color: "bg-purple-500",
      action: () => console.log("Find investors")
    },
    {
      title: "Build MVP",
      description: "Start building your minimum viable product",
      icon: Rocket,
      color: "bg-orange-500",
      action: () => console.log("Build MVP")
    }
  ];

  const renderDashboardOverview = () => (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
            <p className="text-blue-100">Ready to accelerate your startup journey?</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{user.profileComplete}%</div>
            <div className="text-blue-100 text-sm">Profile Complete</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">AI Analyses</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
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
                  <span>MVP Development</span>
                  <span>25%</span>
                </div>
                <Progress value={25} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Tasks */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest achievements and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.status === "completed" ? "bg-green-100" :
                      activity.status === "in_progress" ? "bg-blue-100" : "bg-gray-100"
                    }`}>
                      {activity.type === "analysis" && <Brain className="w-4 h-4 text-blue-600" />}
                      {activity.type === "business_plan" && <FileText className="w-4 h-4 text-green-600" />}
                      {activity.type === "investor" && <Users className="w-4 h-4 text-purple-600" />}
                      {activity.type === "idea" && <Lightbulb className="w-4 h-4 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <Badge variant={activity.status === "completed" ? "default" : "secondary"} className="text-xs">
                          {activity.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
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
                <div className="flex items-center space-x-3 p-2 border-l-4 border-blue-500 bg-blue-50 rounded-r">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Review investor feedback</p>
                    <p className="text-xs text-gray-500">Due in 2 days</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 border-l-4 border-orange-500 bg-orange-50 rounded-r">
                  <FileText className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">Complete pitch deck</p>
                    <p className="text-xs text-gray-500">Due in 5 days</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 border-l-4 border-green-500 bg-green-50 rounded-r">
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
  );

  const renderMainContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileManagement user={user} />;
      default:
        return renderDashboardOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <SidebarNavigation />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeSection === "profile" ? "Profile Management" : "Dashboard"}
              </h1>
              <p className="text-gray-600">
                {activeSection === "profile" 
                  ? "Manage your personal information and account settings" 
                  : "Monitor your startup journey and key metrics"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant={activeSection === "overview" ? "default" : "outline"}
                onClick={() => setActiveSection("overview")}
                size="sm"
              >
                Dashboard
              </Button>
              <Button
                variant={activeSection === "profile" ? "default" : "outline"}
                onClick={() => setActiveSection("profile")}
                size="sm"
              >
                Profile
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-gray-500">{user.plan} Plan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}