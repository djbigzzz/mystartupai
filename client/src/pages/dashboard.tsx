import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Rocket,
  Download,
  Flame,
  Star,
  Trophy,
  Zap,
  Gift,
  Sparkles,
  Crown,
  Award,
  Gem,
  Shield,
  Clock,
  BarChart3
} from "lucide-react";
import { Link } from "wouter";
import SidebarNavigation from "@/components/dashboard/sidebar-navigation";
import ProfileManagement from "@/components/profile/profile-management";
import StartupWorkflowDashboard from "@/components/startup-workflow-dashboard";
import { ThemeToggle } from "@/components/theme-toggle";
import GuidedOnboarding from "@/components/onboarding/guided-onboarding";
import DailyCheckin from "@/components/daily-checkin";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface User {
  id: number;
  email: string | null;
  name: string | null;
  username: string | null;
  avatar: string | null;
  emailVerified: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserProgress {
  id: number;
  userId: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  lastActiveAt: string;
  points: number;
}

interface Badge {
  id: number;
  name: string;
  icon: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  criteria: string;
  earned?: boolean;
  earnedAt?: string | null;
}

interface Quest {
  id: number;
  title: string;
  description: string;
  period: "daily" | "weekly" | "monthly";
  target: number;
  metric: string;
  rewardXp: number;
  rewardPoints: number;
  progress?: number;
  completed?: boolean;
  claimed?: boolean;
  canClaim?: boolean;
}

interface GamificationData {
  progress: UserProgress;
  badges: Badge[];
  quests: Quest[];
}

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
  const [currentIdeaId, setCurrentIdeaId] = useState<number | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [questTab, setQuestTab] = useState("daily");

  useEffect(() => {
    const ideaId = localStorage.getItem("currentIdeaId");
    if (ideaId) setCurrentIdeaId(parseInt(ideaId));
  }, []);

  const { data: ideaData } = useQuery({
    queryKey: [`/api/ideas/${currentIdeaId}`],
    enabled: !!currentIdeaId,
  });

  // Fetch authenticated user data
  const { data: user, isLoading: userLoading, error: userError, refetch } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: 1,
    staleTime: 0,
    gcTime: 0,
  });

  // Fetch gamification data
  const { data: gamificationData, isLoading: gamificationLoading, refetch: refetchGamification } = useQuery<GamificationData>({
    queryKey: ["/api/gamification/me"],
    enabled: !!user,
    staleTime: 30000, // Cache for 30 seconds
  });

  // Mutation for gamification events
  const gamificationEventMutation = useMutation({
    mutationFn: async (action: string) => {
      return apiRequest("/api/gamification/events", {
        method: "POST",
        body: JSON.stringify({ action })
      } as RequestInit & { body?: any });
    },
    onSuccess: (data) => {
      refetchGamification();
      if (data.levelUp) {
        setShowLevelUpModal(true);
      }
    }
  });

  // Mutation for claiming quest rewards
  const claimQuestMutation = useMutation({
    mutationFn: async (questId: number) => {
      return apiRequest(`/api/gamification/quests/${questId}/claim`, {
        method: "POST"
      } as RequestInit & { body?: any });
    },
    onSuccess: () => {
      refetchGamification();
    }
  });

  // Helper function to get badge icon component
  const getBadgeIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      lightbulb: Lightbulb,
      star: Star,
      fileText: FileText,
      presentation: FileText,
      flame: Flame,
      trophy: Trophy,
      crown: Crown,
      award: Award,
      gem: Gem,
      shield: Shield
    };
    return iconMap[iconName] || Star;
  };

  // Helper function to get rarity color
  const getRarityColor = (rarity: string) => {
    const colorMap = {
      common: "bg-gray-500 dark:bg-gray-600",
      rare: "bg-blue-500 dark:bg-blue-600", 
      epic: "bg-purple-500 dark:bg-purple-600",
      legendary: "bg-orange-500 dark:bg-orange-600"
    };
    return colorMap[rarity as keyof typeof colorMap] || colorMap.common;
  };

  // Check if user needs onboarding
  useEffect(() => {
    if (user && !user.onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, [user]);

  // Debug logging
  console.log('Dashboard - User data:', user);
  console.log('Dashboard - User loading:', userLoading);
  console.log('Dashboard - User error:', userError);
  
  // Force cache invalidation and refetch for debugging
  React.useEffect(() => {
    if (user) {
      console.log('Dashboard - User received:', {
        id: user.id,
        name: user.name,
        email: user.email
      });
    } else if (!userLoading && !userError) {
      console.log('Dashboard - No user data, attempting refetch...');
      refetch();
    }
  }, [user, userLoading, userError, refetch]);

  // Mutation to mark onboarding as completed
  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/auth/complete-onboarding", {
        method: "POST"
      } as RequestInit & { body?: any });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setShowOnboarding(false);
    },
    onError: (error) => {
      console.error("Failed to complete onboarding:", error);
    }
  });

  const handleOnboardingComplete = () => {
    completeOnboardingMutation.mutate();
  };

  const handleSkipOnboarding = () => {
    setShowOnboarding(false);
    // Optionally mark as completed or set a "skipped" status
    completeOnboardingMutation.mutate();
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (userError && (userError as any).status === 401) {
      window.location.href = '/app';
    }
  }, [userError]);

  // Show loading state while checking authentication
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show login redirect if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access your dashboard.</p>
          <button 
            onClick={() => window.location.href = '/app'}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Current startup stats - focused on single idea journey  
  const stats: DashboardStats = {
    totalIdeas: 0, // Hidden - single idea focus
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
    <div className="space-y-6">
      {/* Startup Progress Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" data-testid="text-welcome-user">
              Welcome back, {user?.name || 'Entrepreneur'}!
            </h1>
            <p className="text-blue-100 text-sm" data-testid="text-welcome-subtitle">
              {ideaData ? `Working on: ${(ideaData as any).ideaTitle}` : 'Ready to build your startup?'}
            </p>
          </div>
          <Link href="/export">
            <Button variant="outline" className="text-blue-600 border-white hover:bg-white/10" size="sm" data-testid="button-export">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </Link>
        </div>
      </div>

      {/* Startup Progress Overview */}
      {ideaData && ideaData as any && (
        <Card data-testid="card-startup-progress">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Rocket className="w-5 h-5 text-blue-600" />
              <span>Your Startup Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Brain className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900 dark:text-white">Idea Analyzed</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">AI validation complete</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900 dark:text-white">Business Plan</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Ready to generate</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900 dark:text-white">Investor Ready</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Next milestone</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Startup Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="card-metric-ideas">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ideas Analyzed</CardTitle>
            <Brain className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600" data-testid="text-total-ideas">
              {stats.completedAnalyses}
            </div>
            <p className="text-xs text-muted-foreground">AI validations done</p>
          </CardContent>
        </Card>

        <Card data-testid="card-metric-plans">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Plans</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-business-plans">
              {stats.businessPlansGenerated}
            </div>
            <p className="text-xs text-muted-foreground">Generated & ready</p>
          </CardContent>
        </Card>

        <Card data-testid="card-metric-investors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investor Matches</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600" data-testid="text-investor-matches">
              {stats.investorConnections}
            </div>
            <p className="text-xs text-muted-foreground">Potential connections</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card data-testid="card-quick-actions">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Zap className="w-5 h-5 text-orange-500" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>Essential tools for your startup journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/submit-idea">
              <Button variant="outline" size="sm" className="w-full h-auto flex-col py-3" data-testid="button-submit-idea">
                <Plus className="w-5 h-5 mb-1" />
                <span className="text-xs">Submit Idea</span>
              </Button>
            </Link>
            <Link href="/business-plan">
              <Button variant="outline" size="sm" className="w-full h-auto flex-col py-3" data-testid="button-business-plan">
                <FileText className="w-5 h-5 mb-1" />
                <span className="text-xs">Business Plan</span>
              </Button>
            </Link>
            <Link href="/pitch-deck">
              <Button variant="outline" size="sm" className="w-full h-auto flex-col py-3" data-testid="button-pitch-deck">
                <BarChart3 className="w-5 h-5 mb-1" />
                <span className="text-xs">Pitch Deck</span>
              </Button>
            </Link>
            <Link href="/find-investors">
              <Button variant="outline" size="sm" className="w-full h-auto flex-col py-3" data-testid="button-find-investors">
                <Users className="w-5 h-5 mb-1" />
                <span className="text-xs">Find Investors</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Simplified Goals */}
      {gamificationData?.quests && gamificationData.quests.length > 0 && (
        <Card data-testid="card-goals" className="">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Target className="w-5 h-5 text-green-500" />
              <span>Today's Goals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gamificationData.quests
                .filter(quest => quest.period === 'daily')
                .slice(0, 3)
                .map((quest) => (
                  <div key={quest.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded" data-testid={`goal-${quest.id}`}>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{quest.title}</div>
                      <div className="text-xs text-muted-foreground">{quest.progress || 0}/{quest.target}</div>
                    </div>
                    <div className="w-16 ml-3">
                      <Progress 
                        value={Math.min(100, ((quest.progress || 0) / quest.target) * 100)} 
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card data-testid="card-recent-activity">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Clock className="w-5 h-5 text-gray-500" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity) => {
              const getActivityIcon = (type: string) => {
                switch(type) {
                  case 'analysis': return Brain;
                  case 'business_plan': return FileText;
                  case 'investor': return Users;
                  default: return Lightbulb;
                }
              };
              const IconComponent = getActivityIcon(activity.type);
              
              return (
                <div key={activity.id} className="flex items-center space-x-3 p-2" data-testid={`activity-${activity.id}`}>
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</div>
                    <div className="text-xs text-gray-500">{activity.timestamp}</div>
                  </div>
                  <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                    {activity.status === 'completed' ? 'Done' : 'Active'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Compact Daily Check-in */}
      <DailyCheckin 
        onLevelUp={() => {}}
        onCheckinComplete={(result) => {
          // Trigger gamification event for additional rewards
          gamificationEventMutation.mutate('daily_checkin');
        }}
      />

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

  // Level Up Modal Component
  const LevelUpModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="modal-level-up">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-8 max-w-md mx-4 text-center animate-in zoom-in duration-300">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="text-level-up-title">
            Level Up!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4" data-testid="text-level-up-message">
            Congratulations! You've reached Level {gamificationData?.progress?.level || 1}
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-yellow-600 dark:text-yellow-400" data-testid="text-xp-gained">+50 XP</div>
                <div className="text-gray-500">Experience</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600 dark:text-green-400" data-testid="text-points-gained">+100 Pts</div>
                <div className="text-gray-500">Points</div>
              </div>
            </div>
          </div>
        </div>
        <Button 
          onClick={() => setShowLevelUpModal(false)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          data-testid="button-close-level-up"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Awesome!
        </Button>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeSection) {
      case "profile":
        return user ? <ProfileManagement user={user as any} /> : <div>Loading...</div>;
      default:
        return renderDashboardOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Level Up Modal */}
      {showLevelUpModal && <LevelUpModal />}
      
      {/* Guided Onboarding Modal */}
      {showOnboarding && (
        <GuidedOnboarding 
          onComplete={handleOnboardingComplete}
          onSkip={handleSkipOnboarding}
          isFirstTimeUser={!user?.onboardingCompleted}
        />
      )}
      
      {/* Sidebar Navigation */}
      <SidebarNavigation />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-8 py-6 flex-shrink-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white truncate" data-testid="page-title">
                  {activeSection === "profile" ? "Profile Management" : "Dashboard"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1" data-testid="page-description">
                  {activeSection === "profile" 
                    ? "Manage your personal information and account settings" 
                    : "Monitor your startup journey and key metrics"}
                </p>
              </div>
              <div className="flex items-center space-x-3 ml-6">
                <Button
                  variant={activeSection === "overview" ? "default" : "outline"}
                  onClick={() => setActiveSection("overview")}
                  size="sm"
                  className="hidden sm:inline-flex"
                  data-testid="button-dashboard-tab"
                >
                  Dashboard
                </Button>
                <Button
                  variant={activeSection === "profile" ? "default" : "outline"}
                  onClick={() => setActiveSection("profile")}
                  size="sm"
                  className="hidden sm:inline-flex"
                  data-testid="button-profile-tab"
                >
                  Profile
                </Button>
                <Button variant="ghost" size="sm" data-testid="button-notifications-header">
                  <Bell className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-3 pl-3 border-l border-gray-200 dark:border-gray-700">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatar || undefined} />
                    <AvatarFallback className="text-sm font-semibold">
                      {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm min-w-0 hidden lg:block">
                    <p className="font-semibold text-gray-900 dark:text-white truncate" data-testid="text-header-user-name">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs" data-testid="text-header-plan">
                      Pro Plan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-8 py-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderMainContent()}
          </div>
        </div>
      </div>
    </div>
  );
}