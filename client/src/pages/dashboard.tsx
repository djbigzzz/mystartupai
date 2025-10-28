import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search,
  Target,
  Rocket,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Crown,
  CreditCard,
  Calendar,
  TrendingDown,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";
import SidebarNavigation from "@/components/dashboard/sidebar-navigation";
import MobileNavigation from "@/components/mobile-navigation";
import { useTheme } from "@/contexts/theme-context";
import ThemeBackgroundEffects from "@/components/theme-background-effects";
import { CypherpunkEffects } from "@/components/cypherpunk-effects";
import type { JourneyProgress, JourneyValidation } from "@shared/schema";
import validatorAvatar from "@assets/generated_images/The_Validator_3D_avatar_dd365c22.png";
import strategistAvatar from "@assets/generated_images/The_Strategist_3D_avatar_17159bd1.png";
import builderAvatar from "@assets/generated_images/The_Builder_3D_avatar_0b63a5a7.png";
import growthHackerAvatar from "@assets/generated_images/The_Growth_Hacker_3D_avatar_3e4042fe.png";

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

const coFounders = [
  {
    id: 1,
    name: "Vale",
    role: "The Validator",
    tagline: "I analyze 8 dimensions so you build the right thing",
    icon: Search,
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    avatarImage: validatorAvatar,
    route: "/co-founder-validator",
    stageCompleted: "stage1Completed"
  },
  {
    id: 2,
    name: "Stratos",
    role: "The Strategist",
    tagline: "Customer discovery before code. Every time.",
    icon: Target,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800",
    avatarImage: strategistAvatar,
    route: "/co-founder-strategist",
    stageCompleted: "stage2Completed",
    unlockCondition: "Complete validation with score > 60"
  },
  {
    id: 3,
    name: "Archie",
    role: "The Builder",
    tagline: "From pitch deck to MVP, I've got the blueprints",
    icon: Rocket,
    color: "from-purple-500 to-violet-600", 
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    avatarImage: builderAvatar,
    route: "/co-founder-builder",
    stageCompleted: "stage3Completed",
    unlockCondition: "Complete strategic planning"
  },
  {
    id: 4,
    name: "Blaze",
    role: "The Growth Hacker",
    tagline: "Let's find your first 1000 customers and investors",
    icon: TrendingUp,
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    avatarImage: growthHackerAvatar,
    route: "/co-founder-growth",
    stageCompleted: "stage4Completed",
    unlockCondition: "Complete investor materials"
  }
];

export default function Dashboard() {
  const { theme } = useTheme();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: 1,
    staleTime: 0,
    gcTime: 0,
  });

  const { data: creditBalance } = useQuery<{ credits: number; transactions: any[] }>({
    queryKey: ["/api/credits/balance"],
    enabled: !!user,
    refetchInterval: 30000,
  });

  const { data: journeyProgress } = useQuery<JourneyProgress>({
    queryKey: ['/api/journey/progress'],
    enabled: !!user,
  });

  const { data: validation } = useQuery<JourneyValidation>({
    queryKey: ['/api/journey/validation'],
    enabled: !!user,
  });

  const currentStage = journeyProgress?.currentStage || 1;
  const progressPercentage = journeyProgress?.progressPercentage || 0;
  const completedStages = [
    journeyProgress?.stage1Completed,
    journeyProgress?.stage2Completed,
    journeyProgress?.stage3Completed,
    journeyProgress?.stage4Completed
  ].filter(Boolean).length;

  const isStageUnlocked = (stageId: number) => {
    if (stageId === 1) return true;
    if (stageId === 2) return journeyProgress?.stage1Completed || false;
    if (stageId === 3) return journeyProgress?.stage2Completed || false;
    if (stageId === 4) return journeyProgress?.stage3Completed || false;
    return false;
  };

  const getNextAction = () => {
    if (!validation) {
      return {
        title: "Start Your Journey with Vale",
        description: "Begin with validation to ensure you're building the right thing",
        route: "/co-founder-validator",
        icon: Search
      };
    }
    if (!journeyProgress?.stage1Completed && validation.score && validation.score >= 60) {
      return {
        title: "Continue to The Strategist",
        description: "Your idea scored " + validation.score + "/100. Move to strategic planning!",
        route: "/co-founder-strategist",
        icon: Target
      };
    }
    if (!journeyProgress?.stage2Completed && journeyProgress?.stage1Completed) {
      return {
        title: "Work with Stratos",
        description: "Plan your customer discovery and feature prioritization",
        route: "/co-founder-strategist",
        icon: Target
      };
    }
    if (!journeyProgress?.stage3Completed && journeyProgress?.stage2Completed) {
      return {
        title: "Build with Archie",
        description: "Create your business plan, pitch deck, and financial model",
        route: "/co-founder-builder",
        icon: Rocket
      };
    }
    if (!journeyProgress?.stage4Completed && journeyProgress?.stage3Completed) {
      return {
        title: "Grow with Blaze",
        description: "Find investors and acquire your first customers",
        route: "/co-founder-growth",
        icon: TrendingUp
      };
    }
    return {
      title: "Journey Complete!",
      description: "All stages completed. Keep iterating and growing!",
      route: "/co-founder-journey",
      icon: CheckCircle2
    };
  };

  const nextAction = getNextAction();

  return (
    <div className="min-h-screen bg-background text-foreground flex" data-page="dashboard">
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNavigation />
      </div>
      
      {/* Sidebar Navigation - Desktop Only */}
      <div className="hidden lg:block">
        <SidebarNavigation />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0 relative overflow-hidden">
        {/* Theme-aware background effects */}
        <ThemeBackgroundEffects />
        <CypherpunkEffects />

        {/* Main Content Area */}
        <main className="flex-1 relative z-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2" data-testid="heading-dashboard-title">
                Welcome back, {user?.name || 'Founder'}!
              </h1>
              <p className="text-muted-foreground text-lg">
                Continue your journey to building a successful startup
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Journey Progress */}
              <Card className="border-2" data-testid="card-journey-progress">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Journey Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold">{completedStages}/4</span>
                    <Badge variant="secondary">{Math.round(progressPercentage)}%</Badge>
                  </div>
                  <Progress value={progressPercentage} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">Stages completed</p>
                </CardContent>
              </Card>

              {/* Credits */}
              <Card className="border-2" data-testid="card-credits">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Available Credits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold">{creditBalance?.credits || 0}</span>
                    <Zap className="h-8 w-8 text-yellow-500" />
                  </div>
                  <Link href="/purchase-credits">
                    <Button variant="link" className="p-0 h-auto text-xs hover:underline">
                      Purchase more credits →
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Plan */}
              <Card className="border-2" data-testid="card-plan">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold">{user?.currentPlan || 'FREEMIUM'}</span>
                    {user?.currentPlan === 'PRO' ? (
                      <Crown className="h-8 w-8 text-purple-500" />
                    ) : user?.currentPlan === 'CORE' ? (
                      <CreditCard className="h-8 w-8 text-blue-500" />
                    ) : (
                      <Zap className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <Link href="/purchase-credits">
                    <Button variant="link" className="p-0 h-auto text-xs hover:underline">
                      Upgrade plan →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Co-Founder Journey Stages */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Your AI Co-Founder Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {coFounders.map((coFounder) => {
                  const isUnlocked = isStageUnlocked(coFounder.id);
                  const isCompleted = journeyProgress?.[coFounder.stageCompleted as keyof JourneyProgress] as boolean;
                  const IconComponent = coFounder.icon;

                  return (
                    <Card
                      key={coFounder.id}
                      className={`relative overflow-hidden border-2 transition-all duration-300 ${
                        isUnlocked 
                          ? `${coFounder.borderColor} cursor-pointer hover:shadow-lg hover:-translate-y-1` 
                          : 'border-gray-200 dark:border-gray-800 opacity-60'
                      }`}
                      onMouseEnter={() => isUnlocked && setHoveredCard(coFounder.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      data-testid={`card-cofounder-${coFounder.id}`}
                    >
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        {isCompleted ? (
                          <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        ) : !isUnlocked ? (
                          <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800">
                            <Lock className="h-3 w-3 mr-1" />
                            Locked
                          </Badge>
                        ) : currentStage === coFounder.id ? (
                          <Badge className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                            <Zap className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : null}
                      </div>

                      {/* Avatar Background */}
                      <div className={`h-48 ${coFounder.bgColor} flex items-center justify-center overflow-hidden`}>
                        <img 
                          src={coFounder.avatarImage} 
                          alt={coFounder.name}
                          className={`h-full w-full object-cover transition-transform duration-300 ${
                            hoveredCard === coFounder.id && isUnlocked ? 'scale-110' : 'scale-100'
                          }`}
                        />
                      </div>

                      <CardContent className="p-6">
                        {/* Name & Role */}
                        <div className="mb-3">
                          <h3 className="text-xl font-bold mb-1">{coFounder.name}</h3>
                          <p className={`text-sm font-medium bg-gradient-to-r ${coFounder.color} bg-clip-text text-transparent`}>
                            {coFounder.role}
                          </p>
                        </div>

                        {/* Tagline */}
                        <p className="text-sm text-muted-foreground italic mb-4 min-h-[40px]">
                          "{coFounder.tagline}"
                        </p>

                        {/* Action Button */}
                        {isUnlocked ? (
                          <Link href={coFounder.route}>
                            <Button 
                              className="w-full gap-2" 
                              variant={isCompleted ? "outline" : "default"}
                              data-testid={`button-cofounder-${coFounder.id}`}
                            >
                              {isCompleted ? 'Review' : 'Continue'}
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        ) : (
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground mb-2 flex items-center justify-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {coFounder.unlockCondition}
                            </p>
                            <Button disabled className="w-full" data-testid={`button-cofounder-${coFounder.id}-locked`}>
                              <Lock className="h-4 w-4 mr-2" />
                              Locked
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Next Action */}
            <Card className="mb-8 border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20" data-testid="card-next-action">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <nextAction.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      Next Step: {nextAction.title}
                    </CardTitle>
                    <CardDescription className="mt-1">{nextAction.description}</CardDescription>
                  </div>
                  <Link href={nextAction.route}>
                    <Button className="gap-2" data-testid="button-next-action">
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
            </Card>

            {/* Validation Score (if validated) */}
            {validation && validation.score !== undefined && (
              <Card className="mb-8 border-2" data-testid="card-validation-score">
                <CardHeader>
                  <CardTitle>Your Validation Score</CardTitle>
                  <CardDescription>Based on 8-dimension analysis by Vale</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold ${
                        validation.score >= 80 
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                          : validation.score >= 60 
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                      }`}>
                        {validation.score}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={
                          validation.verdict === 'GO' 
                            ? 'default' 
                            : validation.verdict === 'REFINE' 
                            ? 'secondary' 
                            : 'destructive'
                        } className="text-sm">
                          {validation.verdict}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {validation.score >= 80 
                            ? 'Excellent potential!' 
                            : validation.score >= 60 
                            ? 'Good foundation, keep going!'
                            : 'Needs refinement'}
                        </span>
                      </div>
                      <Link href="/co-founder-validator">
                        <Button variant="outline" size="sm" className="gap-2">
                          View Full Analysis
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                  <CardDescription>Tools and guides to help you succeed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/ai-showcase">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Zap className="h-4 w-4" />
                      AI Tools Showcase
                    </Button>
                  </Link>
                  <Link href="/export">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <TrendingDown className="h-4 w-4" />
                      Export Documents
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>Manage your profile and settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/profile">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user?.avatar || undefined} />
                        <AvatarFallback>
                          {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      Profile & Settings
                    </Button>
                  </Link>
                  <Link href="/purchase-credits">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <CreditCard className="h-4 w-4" />
                      Manage Subscription
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
