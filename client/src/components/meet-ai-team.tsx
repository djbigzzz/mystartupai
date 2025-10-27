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
    bgColor: "bg-slate-700",
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
    bgColor: "bg-slate-700",
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
    bgColor: "bg-slate-700",
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
    bgColor: "bg-slate-700",
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
                  ${coFounder.bgColor} cursor-pointer
                  rounded-3xl shadow-2xl h-[600px] animate-float
                `}
                style={{
                  transform: isHovered ? 'translateY(-8px) rotateY(5deg)' : 'translateY(0) rotateY(0)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  transformStyle: 'preserve-3d',
                  perspective: '1000px',
                  animationDelay: `${coFounder.id * 0.2}s`
                }}
                onMouseEnter={() => setHoveredCard(coFounder.id)}
                onMouseLeave={() => setHoveredCard(null)}
                data-testid={`team-card-${coFounder.id}`}
              >
                {/* Full-card Avatar Background with 3D Animation */}
                <div 
                  className="absolute inset-0 transition-all duration-700 animate-subtle-rotate"
                  style={{
                    transform: isHovered ? 'scale(1.15) translateZ(30px)' : 'scale(1.05) translateZ(0)',
                    transformStyle: 'preserve-3d',
                    animationDelay: `${coFounder.id * 0.15}s`
                  }}
                >
                  <img 
                    src={coFounder.avatarImage} 
                    alt={coFounder.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Gradient Overlay for text readability - neutral gray */}
                <div 
                  className="absolute inset-0 bg-gradient-to-b"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(51, 65, 85, 0.3), rgba(51, 65, 85, 0.5), rgba(51, 65, 85, 0.95))'
                  }}
                ></div>

                <CardContent className="relative z-10 p-8 h-full flex flex-col items-center text-center justify-end">
                  {/* Name & Role */}
                  <div className="mb-4">
                    <h3 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                      {coFounder.name}
                    </h3>
                    <p className="text-lg font-medium text-white drop-shadow-md">
                      {coFounder.role}
                    </p>
                  </div>

                  {/* Tagline */}
                  <p className="text-sm text-white/95 italic mb-6 drop-shadow-md">
                    "{coFounder.tagline}"
                  </p>

                  {/* Capabilities List */}
                  <div className="w-full">
                    <div className="bg-black/40 rounded-2xl p-4 backdrop-blur-md border border-white/30">
                      <ul className="space-y-2 text-left">
                        {coFounder.capabilities.map((capability, idx) => (
                          <li 
                            key={idx} 
                            className="text-xs text-white flex items-start gap-2"
                          >
                            <span className="text-white/80 mt-0.5">•</span>
                            <span className="font-medium">{capability}</span>
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

      {/* 3D Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) rotateX(0deg);
          }
          50% { 
            transform: translateY(-10px) rotateX(2deg);
          }
        }
        
        @keyframes subtle-rotate {
          0%, 100% { 
            transform: rotateY(-2deg) rotateX(1deg) scale(1.05);
          }
          50% { 
            transform: rotateY(2deg) rotateX(-1deg) scale(1.05);
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-subtle-rotate {
          animation: subtle-rotate 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
