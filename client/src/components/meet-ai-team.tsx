import { useState, useRef, MouseEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import validatorAvatar from "@assets/generated_images/The_Validator_3D_avatar_dd365c22.png";
import strategistAvatar from "@assets/generated_images/The_Strategist_3D_avatar_17159bd1.png";
import builderAvatar from "@assets/generated_images/The_Builder_3D_avatar_0b63a5a7.png";
import growthHackerAvatar from "@assets/generated_images/The_Growth_Hacker_3D_avatar_3e4042fe.png";

interface CardTransform {
  rotateX: number;
  rotateY: number;
  scale: number;
}

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
  const [cardTransforms, setCardTransforms] = useState<Record<number, CardTransform>>({});
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>, cardId: number) => {
    const card = cardRefs.current[cardId];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate rotation based on mouse position relative to card center
    const rotateY = ((mouseX - cardCenterX) / (rect.width / 2)) * 15; // Max 15deg
    const rotateX = -((mouseY - cardCenterY) / (rect.height / 2)) * 15; // Max 15deg (negative for natural feel)
    
    setCardTransforms(prev => ({
      ...prev,
      [cardId]: {
        rotateX,
        rotateY,
        scale: 1.05
      }
    }));
  };

  const handleMouseLeave = (cardId: number) => {
    setCardTransforms(prev => ({
      ...prev,
      [cardId]: {
        rotateX: 0,
        rotateY: 0,
        scale: 1
      }
    }));
    setHoveredCard(null);
  };

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
            const transform = cardTransforms[coFounder.id] || { rotateX: 0, rotateY: 0, scale: 1 };

            return (
              <Card
                key={coFounder.id}
                ref={(el) => (cardRefs.current[coFounder.id] = el)}
                className={`
                  relative overflow-hidden border-0
                  ${coFounder.bgColor} cursor-pointer
                  rounded-3xl shadow-2xl h-[600px]
                `}
                style={{
                  transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
                  transition: 'all 0.1s cubic-bezier(0.03, 0.98, 0.52, 0.99)',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform'
                }}
                onMouseMove={(e) => handleMouseMove(e, coFounder.id)}
                onMouseEnter={() => setHoveredCard(coFounder.id)}
                onMouseLeave={() => handleMouseLeave(coFounder.id)}
                data-testid={`team-card-${coFounder.id}`}
              >
                {/* Full-card Avatar Background with Parallax Depth */}
                <div 
                  className="absolute inset-0"
                  style={{
                    transform: `translateZ(${isHovered ? 40 : 20}px) scale(${isHovered ? 1.1 : 1.05})`,
                    transition: 'all 0.3s ease-out',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <img 
                    src={coFounder.avatarImage} 
                    alt={coFounder.name}
                    className="w-full h-full object-cover object-center"
                    style={{
                      transform: `translateX(${transform.rotateY * 0.5}px) translateY(${-transform.rotateX * 0.5}px)`,
                      transition: 'transform 0.1s ease-out'
                    }}
                  />
                </div>

                {/* Dynamic Gradient Overlay - shifts with tilt */}
                <div 
                  className="absolute inset-0 bg-gradient-to-b pointer-events-none"
                  style={{
                    background: `linear-gradient(${135 + transform.rotateY}deg, rgba(51, 65, 85, 0.3), rgba(51, 65, 85, 0.5), rgba(51, 65, 85, 0.95))`,
                    transition: 'background 0.1s ease-out'
                  }}
                ></div>

                {/* Dynamic highlight based on tilt */}
                {isHovered && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at ${50 + transform.rotateY}% ${50 - transform.rotateX}%, rgba(255,255,255,0.1) 0%, transparent 70%)`,
                      transition: 'background 0.1s ease-out'
                    }}
                  ></div>
                )}

                <CardContent 
                  className="relative p-8 h-full flex flex-col items-center text-center justify-end"
                  style={{
                    transform: 'translateZ(60px)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Name & Role */}
                  <div className="mb-4">
                    <h3 className="text-4xl font-bold text-white mb-2 drop-shadow-lg"
                        style={{
                          textShadow: `${-transform.rotateY * 0.2}px ${transform.rotateX * 0.2}px 20px rgba(0,0,0,0.5)`
                        }}>
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

    </section>
  );
}
