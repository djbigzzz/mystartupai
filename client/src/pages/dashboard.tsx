import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  TrendingUp,
  FileText,
  Users,
  Target,
  Brain,
  ArrowRight,
  Presentation,
  CheckCircle,
  Download,
  Clock,
  Bell,
  CreditCard,
  Crown,
  Zap
} from "lucide-react";
import { Link } from "wouter";
import SidebarNavigation from "@/components/dashboard/sidebar-navigation";
import MobileNavigation from "@/components/mobile-navigation";
import ProfileManagement from "@/components/profile/profile-management";
import GuidedOnboarding from "@/components/onboarding/guided-onboarding";
import IdeaManagementCard from "@/components/idea-management-card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ThemeToggle } from "@/components/theme-toggle";

interface User {
  id: number;
  email: string | null;
  name: string | null;
  username: string | null;
  avatar: string | null;
  emailVerified: boolean;
  onboardingCompleted: boolean;
  credits: number;
  currentPlan: string;
  createdAt: string;
  updatedAt: string;
}







export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [currentIdeaId, setCurrentIdeaId] = useState<number | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

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

  // Fetch credit balance
  const { data: creditBalance } = useQuery<{ credits: number; transactions: any[] }>({
    queryKey: ["/api/credits/balance"],
    enabled: !!user,
    refetchInterval: 30000,
  });

  // Fetch user's ideas to determine actual progress
  const { data: userIdeas } = useQuery<any[]>({
    queryKey: ["/api/ideas"],
    enabled: !!user,
  });

  // Calculate the user's actual current step based on their progress
  const getCurrentStep = () => {
    if (!userIdeas || userIdeas.length === 0) {
      return {
        step: 1,
        title: "Submit Your Startup Idea",
        description: "Start by submitting your startup idea to get AI-powered insights",
        link: "/submit-idea",
        progress: 0
      };
    }
    
    const latestIdea = userIdeas[0];
    
    // Safety check for latestIdea
    if (!latestIdea) {
      return {
        step: 1,
        title: "Submit Your Startup Idea",
        description: "Start by submitting your startup idea to get AI-powered insights",
        link: "/submit-idea",
        progress: 0
      };
    }
    
    // Check if analysis is complete
    if (!latestIdea.analysis || latestIdea.analysisStatus === "pending") {
      return {
        step: 2,
        title: "Intelligent Idea Analysis",
        description: "AI asks clarifying questions and provides realistic, contextual market insights",
        link: "/intelligent-analysis",
        progress: 10
      };
    }
    
    // Check if business plan exists
    if (!latestIdea.businessPlan) {
      return {
        step: 3,
        title: "Business Plan Generation",
        description: "Create a comprehensive Y Combinator-standard business plan",
        link: "/business-plan",
        progress: 30
      };
    }
    
    // Check if pitch deck exists
    if (!latestIdea.pitchDeck) {
      return {
        step: 4,
        title: "Pitch Deck Creation",
        description: "Generate a professional investor-ready pitch deck",
        link: "/pitch-deck",
        progress: 50
      };
    }
    
    // All done, ready for investors
    return {
      step: 5,
      title: "Investor Ready",
      description: "Find and connect with the perfect investors for your startup",
      link: "/investor-matching",
      progress: 80
    };
  };

  const currentStep = getCurrentStep();





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


  const getPlanBadge = (plan: string) => {
    const planColors = {
      FREEMIUM: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', icon: Zap },
      BASIC: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', icon: CreditCard },
      PRO: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', icon: Crown }
    };
    const config = planColors[plan as keyof typeof planColors] || planColors.FREEMIUM;
    const IconComponent = config.icon;
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full border ${config.bg} ${config.text} ${config.border}`}>
        <IconComponent className="w-4 h-4 mr-1" />
        <span className="font-semibold text-sm">{plan}</span>
      </div>
    );
  };

  const renderDashboardOverview = () => (
    <div className="space-y-6">
      {/* Welcome Header with Subscription Info */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold" data-testid="text-welcome-user">
              Welcome back, {user?.name || 'Entrepreneur'}!
            </h1>
            <p className="text-blue-100 text-sm" data-testid="text-welcome-subtitle">
              {ideaData ? `Working on: ${(ideaData as any).ideaTitle}` : 'Ready to build your startup?'}
            </p>
          </div>
          <Link href="/purchase-credits">
            <Button variant="outline" className="bg-white text-blue-600 border-white hover:bg-blue-50" size="sm" data-testid="button-upgrade">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
          </Link>
        </div>
      </div>

      {/* Subscription Info Card (if on freemium) */}
      {user?.currentPlan === 'FREEMIUM' && (
        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 rounded-full p-3">
                  <Crown className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Unlock Premium Features</h3>
                  <p className="text-sm text-gray-600">Upgrade to Basic or Pro for more credits and advanced tools</p>
                </div>
              </div>
              <Link href="/purchase-credits">
                <Button className="bg-purple-600 hover:bg-purple-700" data-testid="button-view-plans">
                  View Plans
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Idea Management Card */}
      <IdeaManagementCard idea={userIdeas && userIdeas.length > 0 ? userIdeas[0] : null} />

      {/* Simple Step Indicators Only - No detailed analysis content */}
      <Card data-testid="card-workflow-steps">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">Your Next Step</span>
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Ready to level up your startup?
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{currentStep.step}. {currentStep.title}</h3>
                <p className="text-purple-100 text-sm mb-3">
                  {currentStep.description}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Time: 15-25 minutes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Progress: +{currentStep.step === 1 ? 10 : 20}%</span>
                  </div>
                </div>
              </div>
              <Link href={currentStep.link}>
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30" data-testid="button-start-next-step">
                  {currentStep.step === 1 ? 'Get Started' : 'Start Now'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Step Progression Indicators */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Startup Development Progress</span>
              <span className="text-sm text-gray-500">Step {currentStep.step} of 10</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: `${currentStep.progress}%`}}></div>
            </div>
            
            {/* Simple Step List */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
              {/* Step 1: Submit Idea */}
              <div className={`flex flex-col items-center p-2 rounded-lg border ${
                currentStep.step > 1 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : currentStep.step === 1 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                    : 'bg-gray-50 dark:bg-gray-800/50 border-transparent'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                  currentStep.step > 1 ? 'bg-green-500' : currentStep.step === 1 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  {currentStep.step > 1 ? <CheckCircle className="w-4 h-4 text-white" /> : <FileText className="w-4 h-4 text-white dark:text-gray-400" />}
                </div>
                <span className={`text-xs text-center font-medium ${
                  currentStep.step > 1 ? 'text-green-700 dark:text-green-300' : currentStep.step === 1 ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'
                }`}>Submit Idea</span>
                <span className={`text-xs ${
                  currentStep.step > 1 ? 'text-green-600 dark:text-green-400' : currentStep.step === 1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
                }`}>{currentStep.step > 1 ? 'completed' : currentStep.step === 1 ? 'start here' : 'pending'}</span>
              </div>
              
              {/* Step 2: Intelligent Analysis */}
              <div className={`flex flex-col items-center p-2 rounded-lg border ${
                currentStep.step > 2 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : currentStep.step === 2 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                    : 'bg-gray-50 dark:bg-gray-800/50 border-transparent'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                  currentStep.step > 2 ? 'bg-green-500' : currentStep.step === 2 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  {currentStep.step > 2 ? <CheckCircle className="w-4 h-4 text-white" /> : <Brain className="w-4 h-4 text-white dark:text-gray-400" />}
                </div>
                <span className={`text-xs text-center font-medium ${
                  currentStep.step > 2 ? 'text-green-700 dark:text-green-300' : currentStep.step === 2 ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'
                }`}>Intelligent Analysis</span>
                <span className={`text-xs ${
                  currentStep.step > 2 ? 'text-green-600 dark:text-green-400' : currentStep.step === 2 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
                }`}>{currentStep.step > 2 ? 'completed' : currentStep.step === 2 ? 'available' : 'locked'}</span>
              </div>
              
              {/* Step 3: Business Plan */}
              <div className={`flex flex-col items-center p-2 rounded-lg border ${
                currentStep.step > 3 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : currentStep.step === 3 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                    : 'bg-gray-50 dark:bg-gray-800/50 border-transparent'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                  currentStep.step > 3 ? 'bg-green-500' : currentStep.step === 3 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  {currentStep.step > 3 ? <CheckCircle className="w-4 h-4 text-white" /> : <FileText className="w-4 h-4 text-white dark:text-gray-400" />}
                </div>
                <span className={`text-xs text-center font-medium ${
                  currentStep.step > 3 ? 'text-green-700 dark:text-green-300' : currentStep.step === 3 ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'
                }`}>Business Plan</span>
                <span className={`text-xs ${
                  currentStep.step > 3 ? 'text-green-600 dark:text-green-400' : currentStep.step === 3 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
                }`}>{currentStep.step > 3 ? 'completed' : currentStep.step === 3 ? 'available' : 'locked'}</span>
              </div>
              
              {/* Step 4: Pitch Deck */}
              <div className={`flex flex-col items-center p-2 rounded-lg border ${
                currentStep.step > 4 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : currentStep.step === 4 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                    : 'bg-gray-50 dark:bg-gray-800/50 border-transparent'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                  currentStep.step > 4 ? 'bg-green-500' : currentStep.step === 4 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  {currentStep.step > 4 ? <CheckCircle className="w-4 h-4 text-white" /> : <Presentation className="w-4 h-4 text-white dark:text-gray-400" />}
                </div>
                <span className={`text-xs text-center font-medium ${
                  currentStep.step > 4 ? 'text-green-700 dark:text-green-300' : currentStep.step === 4 ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'
                }`}>Pitch Deck</span>
                <span className={`text-xs ${
                  currentStep.step > 4 ? 'text-green-600 dark:text-green-400' : currentStep.step === 4 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
                }`}>{currentStep.step > 4 ? 'completed' : currentStep.step === 4 ? 'available' : 'locked'}</span>
              </div>
              
              {/* Step 5: Investor Ready */}
              <div className={`flex flex-col items-center p-2 rounded-lg border ${
                currentStep.step > 5 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : currentStep.step === 5 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                    : 'bg-gray-50 dark:bg-gray-800/50 border-transparent'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                  currentStep.step > 5 ? 'bg-green-500' : currentStep.step === 5 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  {currentStep.step > 5 ? <CheckCircle className="w-4 h-4 text-white" /> : <Users className="w-4 h-4 text-white dark:text-gray-400" />}
                </div>
                <span className={`text-xs text-center font-medium ${
                  currentStep.step > 5 ? 'text-green-700 dark:text-green-300' : currentStep.step === 5 ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'
                }`}>Investor Ready</span>
                <span className={`text-xs ${
                  currentStep.step > 5 ? 'text-green-600 dark:text-green-400' : currentStep.step === 5 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
                }`}>{currentStep.step > 5 ? 'completed' : currentStep.step === 5 ? 'available' : 'locked'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex" data-page="dashboard">
      {/* Level Up Modal */}
      
      {/* Guided Onboarding Modal */}
      {showOnboarding && (
        <GuidedOnboarding 
          onComplete={handleOnboardingComplete}
          onSkip={handleSkipOnboarding}
          isFirstTimeUser={!user?.onboardingCompleted}
        />
      )}
      
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNavigation />
      </div>
      
      {/* Sidebar Navigation - Desktop Only */}
      <div className="hidden lg:block">
        <SidebarNavigation />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-shrink-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 ml-16 lg:ml-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate" data-testid="page-title">
                  {activeSection === "profile" ? "Profile Management" : "Dashboard"}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1" data-testid="page-description">
                  {activeSection === "profile" 
                    ? "Manage your personal information and account settings" 
                    : "Monitor your startup journey and key metrics"}
                </p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 ml-4 sm:ml-6">
                <Button
                  variant={activeSection === "overview" ? "default" : "outline"}
                  onClick={() => setActiveSection("overview")}
                  size="sm"
                  className="hidden sm:inline-flex"
                  data-testid="button-dashboard-tab"
                >
                  Dashboard
                </Button>
                <ThemeToggle />
                <Button variant="ghost" size="sm" data-testid="button-notifications-header">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderMainContent()}
          </div>
        </div>
      </div>
    </div>
  );
}