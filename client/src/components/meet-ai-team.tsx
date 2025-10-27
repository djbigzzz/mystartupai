import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import validatorAvatar from "@assets/generated_images/The_Validator_3D_avatar_dd365c22.png";
import strategistAvatar from "@assets/generated_images/The_Strategist_3D_avatar_17159bd1.png";
import builderAvatar from "@assets/generated_images/The_Builder_3D_avatar_0b63a5a7.png";
import growthHackerAvatar from "@assets/generated_images/The_Growth_Hacker_3D_avatar_3e4042fe.png";

const aiTeam = [
  {
    id: 1,
    name: "Vale",
    role: "The Validator",
    tagline: "I analyze 8 dimensions so you build the right thing",
    personality: "Analytical data detective who won't let you skip validation",
    traits: ["Evidence-based", "Thorough", "Data-driven", "Protective"],
    color: "from-blue-500 to-cyan-600",
    glowColor: "rgba(59, 130, 246, 0.3)",
    avatarImage: validatorAvatar,
  },
  {
    id: 2,
    name: "Stratos",
    role: "The Strategist",
    tagline: "Customer discovery before code. Every time.",
    personality: "Wise strategic mastermind who plans your path to market",
    traits: ["Strategic", "Methodical", "Customer-focused", "Wise"],
    color: "from-green-500 to-emerald-600",
    glowColor: "rgba(34, 197, 94, 0.3)",
    avatarImage: strategistAvatar,
  },
  {
    id: 3,
    name: "Archie",
    role: "The Builder",
    tagline: "From pitch deck to MVP, I've got the blueprints",
    personality: "Innovative architect who transforms ideas into reality",
    traits: ["Creative", "Execution-focused", "Innovative", "Builder mindset"],
    color: "from-purple-500 to-violet-600",
    glowColor: "rgba(168, 85, 247, 0.3)",
    avatarImage: builderAvatar,
  },
  {
    id: 4,
    name: "Blaze",
    role: "The Growth Hacker",
    tagline: "Let's find your first 1000 customers and investors",
    personality: "Dynamic growth catalyst who scales your success",
    traits: ["Ambitious", "Growth-obsessed", "Resourceful", "Charismatic"],
    color: "from-orange-500 to-amber-600",
    glowColor: "rgba(249, 115, 22, 0.3)",
    avatarImage: growthHackerAvatar,
  }
];

export function MeetAITeam() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="relative py-32 border-t border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Meet Your AI Co-Founder Team
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Four specialized AI experts with distinct personalities, each focused on a critical stage of your startup journey
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiTeam.map((coFounder) => {
            const isHovered = hoveredCard === coFounder.id;

            return (
              <Card
                key={coFounder.id}
                className={`
                  relative overflow-hidden transition-all duration-300 border-2
                  bg-gradient-to-br ${coFounder.color} hover:scale-105 cursor-pointer
                  group
                `}
                style={isHovered ? {
                  boxShadow: `0 0 40px ${coFounder.glowColor}, 0 20px 40px rgba(0,0,0,0.2)`
                } : {
                  boxShadow: `0 10px 30px rgba(0,0,0,0.1)`
                }}
                onMouseEnter={() => setHoveredCard(coFounder.id)}
                onMouseLeave={() => setHoveredCard(null)}
                data-testid={`team-card-${coFounder.id}`}
              >
                {/* Glass morphism overlay */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

                <CardContent className="relative p-6 h-full flex flex-col">
                  {/* Avatar */}
                  <div className="mb-6 flex justify-center">
                    <div className={`
                      relative w-32 h-32 rounded-2xl overflow-hidden transition-all duration-300 border-2 border-white/50
                      ${isHovered ? 'scale-110 shadow-2xl' : ''}
                    `}>
                      <img 
                        src={coFounder.avatarImage} 
                        alt={coFounder.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {coFounder.name}
                    </h3>
                    <p className="text-sm font-medium text-white/80">
                      {coFounder.role}
                    </p>
                  </div>

                  {/* Tagline */}
                  <p className="text-sm text-white/90 italic text-center mb-4 min-h-[3rem] flex items-center justify-center">
                    "{coFounder.tagline}"
                  </p>

                  {/* Personality Traits */}
                  <div className={`
                    transition-all duration-300 mt-auto
                    ${isHovered ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'}
                  `}>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {coFounder.traits.map((trait, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary" 
                          className="text-xs bg-white/20 text-white border-white/30"
                        >
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Animated glow */}
                  {isHovered && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none"></div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom text */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400">
            Each co-founder unlocks as you progress through your startup journey
          </p>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
