import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle2, Search, Target, Rocket, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import type { JourneyProgress } from "@shared/schema";
import { AuroraBackground } from "@/components/react-bits/aurora-background";
import { SplitText } from "@/components/react-bits/split-text";
import { AnimatedGradient } from "@/components/react-bits/animated-gradient";
import { useTheme } from "@/contexts/theme-context";
import ThemeBackgroundEffects from "@/components/theme-background-effects";
import { CypherpunkEffects } from "@/components/cypherpunk-effects";
import SidebarNavigation from "@/components/dashboard/sidebar-navigation";
import MobileNavigation from "@/components/mobile-navigation";

// Co-Founder personas with distinct identities
const coFounders = [
  {
    id: 1,
    name: "The Validator",
    title: "Is this idea worth pursuing?",
    description: "Market analysis, competitive landscape, risk assessment, and validation score",
    icon: Search,
    color: "from-blue-500 to-purple-600",
    locked: false,
    avatar: "👩‍🔬", // Analytical scientist
    unlockCondition: "Always unlocked",
    route: "/co-founder-validator"
  },
  {
    id: 2,
    name: "The Strategist", 
    title: "What should we build first?",
    description: "Customer discovery, feature prioritization, MVP scope, and go-to-market strategy",
    icon: Target,
    color: "from-purple-500 to-pink-600",
    locked: true,
    avatar: "👨‍💼", // Strategic thinker
    unlockCondition: "Complete validation with score > 60",
    route: "/co-founder-strategist"
  },
  {
    id: 3,
    name: "The Builder",
    title: "Let's create the deliverables",
    description: "Business plan, pitch deck, financial model, and investor materials",
    icon: Rocket,
    color: "from-pink-500 to-orange-600", 
    locked: true,
    avatar: "👩‍💻", // Creative builder
    unlockCondition: "Complete strategic planning",
    route: "/co-founder-builder"
  },
  {
    id: 4,
    name: "The Growth Hacker",
    title: "Now let's get traction",
    description: "Investor matching, customer acquisition, MVP iteration, and funding strategy",
    icon: TrendingUp,
    color: "from-orange-500 to-red-600",
    locked: true,
    avatar: "🚀", // Growth expert
    unlockCondition: "Complete investor materials",
    route: "/co-founder-growth"
  }
];

export default function CoFounderJourney() {
  const [, navigate] = useLocation();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const { theme } = useTheme();

  // Fetch journey progress
  const { data: journeyProgress } = useQuery<JourneyProgress>({
    queryKey: ['/api/journey/progress'],
  });

  const currentStage = journeyProgress?.currentStage || 1;
  const progressPercentage = journeyProgress?.progressPercentage || 0;
  const badges = journeyProgress?.badges || [];

  // Determine which stages are unlocked
  const isStageUnlocked = (stageId: number) => {
    if (stageId === 1) return true; // Validator always unlocked
    if (stageId === 2) return journeyProgress?.stage1Completed || false;
    if (stageId === 3) return journeyProgress?.stage2Completed || false;
    if (stageId === 4) return journeyProgress?.stage3Completed || false;
    return false;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex" data-page="co-founder-journey">
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNavigation />
      </div>
      
      {/* Sidebar Navigation - Desktop Only */}
      <div className="hidden lg:block">
        <SidebarNavigation />
      </div>

      {/* Main Content with Theme Effects */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0 relative overflow-hidden">
        {/* Theme-aware background effects */}
        <ThemeBackgroundEffects />
        <CypherpunkEffects />

        {/* ReactBits effects - only show in dark theme */}
        {theme === "dark" && (
          <>
            <AuroraBackground 
              className="opacity-30"
              colors={[
                "rgba(139, 92, 246, 0.5)",
                "rgba(236, 72, 153, 0.5)",
                "rgba(59, 130, 246, 0.5)",
              ]}
              speed={0.002}
            />
            <AnimatedGradient 
              className="opacity-10"
              colors={["#8b5cf6", "#ec4899", "#3b82f6"]}
              speed={4}
              blur={120}
            />
          </>
        )}

        {/* Grid pattern - theme-aware */}
        <div className={`absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] ${
          theme === "light" ? "opacity-5" : theme === "cypherpunk" ? "opacity-20" : "opacity-10"
        }`}></div>
        
        {/* Floating particles - theme-aware */}
        {theme !== "cypherpunk" && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 rounded-full opacity-30 animate-float ${
                  theme === "light" ? "bg-blue-400" : "bg-purple-400"
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 10}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Page Content */}
        <div className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-auto">
          <div className="max-w-7xl mx-auto">
        {/* Header with SplitText Animation */}
        <div className="text-center mb-12">
          <SplitText
            text="Your AI Co-Founder Journey"
            tag="h1"
            className={`text-5xl font-bold mb-4 ${
              theme === "cypherpunk" 
                ? "text-primary" 
                : "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text"
            }`}
            splitType="chars"
            delay={40}
            duration={0.6}
            from={{ opacity: 0, y: 50, rotationX: -90 }}
            to={{ opacity: 1, y: 0, rotationX: 0 }}
          />
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four expert co-founders who won't let you build the wrong thing
          </p>
        </div>

        {/* Progress Overview */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="backdrop-blur-lg border-2 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overall Progress</p>
                <p className="text-2xl font-bold">Stage {currentStage} of 4 Complete</p>
              </div>
              {badges.length > 0 && (
                <div className="flex gap-2">
                  {badges.map((badge, i) => (
                    <Badge key={i} variant="outline">
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">{progressPercentage}% Complete</p>
          </Card>
        </div>

        {/* Co-Founder Cards Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {coFounders.map((coFounder) => {
            const Icon = coFounder.icon;
            const unlocked = isStageUnlocked(coFounder.id);
            const isHovered = hoveredCard === coFounder.id;

            return (
              <Card
                key={coFounder.id}
                className={`
                  relative overflow-hidden transition-all duration-300 border-2 cofounder-card
                  ${unlocked 
                    ? `cofounder-unlocked bg-gradient-to-br ${coFounder.color} hover:scale-105 hover:shadow-2xl cursor-pointer` 
                    : 'cofounder-locked opacity-60 cursor-not-allowed'
                  }
                  ${isHovered && unlocked ? 'shadow-[0_0_30px_rgba(168,85,247,0.5)]' : ''}
                `}
                data-unlocked={unlocked}
                onMouseEnter={() => setHoveredCard(coFounder.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => unlocked && navigate(coFounder.route)}
                data-testid={`cofounder-card-${coFounder.id}`}
              >
                {/* Glassmorphism overlay - theme-aware */}
                {theme === "dark" && <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>}
                
                <CardContent className="relative p-6">
                  {/* Header with Avatar & Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className={`
                        text-5xl transition-transform duration-300
                        ${isHovered && unlocked ? 'scale-110' : ''}
                        ${!unlocked ? 'grayscale opacity-50' : ''}
                      `}>
                        {coFounder.avatar}
                      </div>
                      
                      {/* Icon Badge */}
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center
                        ${unlocked ? 'bg-primary/20' : 'bg-muted'}
                      `}>
                        <Icon className={`w-6 h-6 ${unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                    </div>

                    {/* Lock/Unlock Status */}
                    {unlocked ? (
                      <CheckCircle2 className="w-8 h-8 text-green-500" data-testid={`status-unlocked-${coFounder.id}`} />
                    ) : (
                      <Lock className="w-8 h-8 text-muted-foreground" data-testid={`status-locked-${coFounder.id}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className={`text-2xl font-bold mb-2 ${unlocked ? '' : 'text-muted-foreground'}`}>
                      {coFounder.name}
                    </h3>
                    <p className={`text-sm mb-3 ${unlocked ? 'text-foreground/90' : 'text-muted-foreground'}`}>
                      {coFounder.title}
                    </p>
                    <p className={`text-sm mb-4 ${unlocked ? 'text-foreground/70' : 'text-muted-foreground/70'}`}>
                      {coFounder.description}
                    </p>

                    {/* Action Button / Unlock Condition */}
                    {unlocked ? (
                      <Button 
                        variant="outline"
                        className="w-full"
                        data-testid={`button-start-${coFounder.id}`}
                      >
                        {journeyProgress?.[`stage${coFounder.id}Completed` as keyof JourneyProgress] ? 'Review' : 'Start'} →
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="w-4 h-4" />
                        <span>{coFounder.unlockCondition}</span>
                      </div>
                    )}
                  </div>

                  {/* Animated glow for active card - theme-aware */}
                  {unlocked && isHovered && theme === "dark" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none"></div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Help Text */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Complete each stage to unlock the next co-founder
          </p>
        </div>
          </div>
        </div>

        {/* Custom animations */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-float {
            animation: float linear infinite;
          }
          .animate-shimmer {
            animation: shimmer 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
