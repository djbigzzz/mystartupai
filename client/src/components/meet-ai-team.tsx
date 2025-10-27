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
    bgColor: "bg-blue-500",
    avatarImage: validatorAvatar,
    capabilities: [
      "Real-time market research",
      "8-dimension validation scoring",
      "Competitor analysis",
      "Market size assessment",
      "GO/REFINE/PIVOT verdicts"
    ]
  },
  {
    id: 2,
    name: "Stratos",
    role: "The Strategist",
    tagline: "Customer discovery before code. Every time.",
    bgColor: "bg-green-500",
    avatarImage: strategistAvatar,
    capabilities: [
      "Customer interview scripts",
      "Target audience mapping",
      "Feature prioritization",
      "Product-market fit guidance",
      "Go-to-market strategy"
    ]
  },
  {
    id: 3,
    name: "Archie",
    role: "The Builder",
    tagline: "From pitch deck to MVP, I've got the blueprints",
    bgColor: "bg-purple-500",
    avatarImage: builderAvatar,
    capabilities: [
      "Professional pitch decks",
      "Detailed business plans",
      "Financial models & projections",
      "MVP blueprints",
      "Investor-ready documents"
    ]
  },
  {
    id: 4,
    name: "Blaze",
    role: "The Growth Hacker",
    tagline: "Let's find your first 1000 customers and investors",
    bgColor: "bg-orange-500",
    avatarImage: growthHackerAvatar,
    capabilities: [
      "Investor matching",
      "Customer acquisition strategies",
      "Growth channel recommendations",
      "Fundraising preparation",
      "Launch campaign planning"
    ]
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
                  relative overflow-hidden transition-all duration-500 border-0
                  ${coFounder.bgColor} hover:scale-105 cursor-pointer
                  rounded-3xl shadow-2xl
                `}
                style={{
                  transform: isHovered ? 'translateY(-8px) rotateX(2deg)' : 'translateY(0) rotateX(0)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={() => setHoveredCard(coFounder.id)}
                onMouseLeave={() => setHoveredCard(null)}
                data-testid={`team-card-${coFounder.id}`}
              >
                <CardContent className="relative p-8 h-full flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="mb-6">
                    <div className={`
                      relative w-40 h-40 rounded-3xl overflow-hidden transition-all duration-500 
                      border-4 border-black/20 shadow-xl bg-black/10
                      ${isHovered ? 'scale-110 rotate-3' : 'scale-100 rotate-0'}
                    `}
                    style={{
                      transformStyle: 'preserve-3d',
                      perspective: '1000px'
                    }}>
                      <img 
                        src={coFounder.avatarImage} 
                        alt={coFounder.name}
                        className="w-full h-full object-cover"
                        style={{
                          transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div className="mb-4">
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {coFounder.name}
                    </h3>
                    <p className="text-base font-medium text-white/90">
                      {coFounder.role}
                    </p>
                  </div>

                  {/* Tagline */}
                  <p className="text-sm text-white/95 italic mb-6 min-h-[2.5rem]">
                    "{coFounder.tagline}"
                  </p>

                  {/* Capabilities List */}
                  <div className="w-full mt-auto">
                    <div className="bg-black/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
                      <ul className="space-y-2 text-left">
                        {coFounder.capabilities.map((capability, idx) => (
                          <li 
                            key={idx} 
                            className="text-xs text-white/90 flex items-start gap-2"
                          >
                            <span className="text-white/60 mt-0.5">•</span>
                            <span>{capability}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
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
