import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle2, Search, Target, Rocket, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import type { JourneyProgress } from "@shared/schema";

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
    route: "/co-founder/validator"
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
    route: "/co-founder/strategist"
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
    route: "/co-founder/builder"
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
    route: "/co-founder/growth"
  }
];

export default function CoFounderJourney() {
  const [, navigate] = useLocation();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Your AI Co-Founder Journey
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Four expert co-founders who won't let you build the wrong thing
          </p>
        </div>

        {/* Progress Overview */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Overall Progress</p>
                <p className="text-2xl font-bold text-white">Stage {currentStage} of 4 Complete</p>
              </div>
              {badges.length > 0 && (
                <div className="flex gap-2">
                  {badges.map((badge, i) => (
                    <Badge key={i} variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <Progress value={progressPercentage} className="h-3 bg-white/10" />
            <p className="text-sm text-gray-400 mt-2">{progressPercentage}% Complete</p>
          </div>
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
                  relative overflow-hidden transition-all duration-300 border-2
                  ${unlocked 
                    ? `bg-gradient-to-br ${coFounder.color} border-white/30 hover:scale-105 hover:shadow-2xl cursor-pointer` 
                    : 'bg-gray-800/50 border-gray-700/50 opacity-60 cursor-not-allowed'
                  }
                  ${isHovered && unlocked ? 'shadow-[0_0_30px_rgba(168,85,247,0.5)]' : ''}
                `}
                onMouseEnter={() => setHoveredCard(coFounder.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => unlocked && navigate(coFounder.route)}
                data-testid={`cofounder-card-${coFounder.id}`}
              >
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                
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
                        ${unlocked ? 'bg-white/20' : 'bg-gray-700/50'}
                      `}>
                        <Icon className={`w-6 h-6 ${unlocked ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                    </div>

                    {/* Lock/Unlock Status */}
                    {unlocked ? (
                      <CheckCircle2 className="w-8 h-8 text-green-400" data-testid={`status-unlocked-${coFounder.id}`} />
                    ) : (
                      <Lock className="w-8 h-8 text-gray-500" data-testid={`status-locked-${coFounder.id}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className={`text-2xl font-bold mb-2 ${unlocked ? 'text-white' : 'text-gray-400'}`}>
                      {coFounder.name}
                    </h3>
                    <p className={`text-sm mb-3 ${unlocked ? 'text-white/90' : 'text-gray-500'}`}>
                      {coFounder.title}
                    </p>
                    <p className={`text-sm mb-4 ${unlocked ? 'text-white/70' : 'text-gray-600'}`}>
                      {coFounder.description}
                    </p>

                    {/* Action Button / Unlock Condition */}
                    {unlocked ? (
                      <Button 
                        className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
                        data-testid={`button-start-${coFounder.id}`}
                      >
                        {journeyProgress?.[`stage${coFounder.id}Completed` as keyof JourneyProgress] ? 'Review' : 'Start'} →
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Lock className="w-4 h-4" />
                        <span>{coFounder.unlockCondition}</span>
                      </div>
                    )}
                  </div>

                  {/* Animated glow for active card */}
                  {unlocked && isHovered && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none"></div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Help Text */}
        <div className="text-center mt-12">
          <p className="text-gray-400">
            Complete each stage to unlock the next co-founder
          </p>
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
  );
}
