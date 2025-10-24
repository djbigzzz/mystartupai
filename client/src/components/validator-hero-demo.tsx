import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Loader2, CheckCircle2, TrendingUp, Users, DollarSign, Sparkles } from "lucide-react";

interface ResearchItem {
  type: "competitor" | "market" | "customer" | "funding";
  title: string;
  subtitle: string;
  icon: typeof TrendingUp;
}

const RESEARCH_DATA: ResearchItem[] = [
  { type: "competitor", title: "HelloFresh", subtitle: "$1.8B revenue", icon: Users },
  { type: "competitor", title: "Blue Apron", subtitle: "200K+ subscribers", icon: Users },
  { type: "market", title: "Market Size", subtitle: "$12.5B by 2027", icon: TrendingUp },
  { type: "market", title: "Growth Rate", subtitle: "14.3% CAGR", icon: TrendingUp },
  { type: "customer", title: "Pain Point", subtitle: "Time-consuming planning", icon: Sparkles },
  { type: "customer", title: "Willingness", subtitle: "68% would pay $10-15/mo", icon: DollarSign },
  { type: "funding", title: "Recent Raise", subtitle: "Instacart: $265M Series G", icon: DollarSign },
  { type: "funding", title: "Market Trend", subtitle: "37 deals in Q1 2024", icon: TrendingUp },
];

interface Dimension {
  label: string;
  score: number;
  insight: string;
}

const DIMENSIONS: Dimension[] = [
  { label: "Market Size", score: 90, insight: "$12.5B TAM, growing 14.3% annually" },
  { label: "Competition", score: 75, insight: "Established players, but niche opportunity" },
  { label: "Feasibility", score: 88, insight: "Proven tech stack, moderate complexity" },
  { label: "Timing", score: 82, insight: "Post-pandemic health trends accelerating" }
];

type Phase = "typing" | "researching" | "analyzing" | "complete";

export function ValidatorHeroDemo() {
  const [phase, setPhase] = useState<Phase>("typing");
  const [displayScore, setDisplayScore] = useState(0);
  const [activeResearch, setActiveResearch] = useState<number[]>([]);
  const [typedText, setTypedText] = useState("");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [currentResearchIndex, setCurrentResearchIndex] = useState(0);
  const [visibleResearch, setVisibleResearch] = useState<ResearchItem[]>([]);
  
  const ideaText = "AI-powered meal planning app that creates personalized weekly meal plans based on dietary preferences, budget, and available time";
  const finalScore = 85;

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedMotion = mediaQuery.matches;
    setPrefersReducedMotion(reducedMotion);

    // If reduced motion, skip directly to complete state
    if (reducedMotion) {
      setPhase("complete");
      setDisplayScore(finalScore);
      setActiveResearch([0, 1, 2, 3]);
      setTypedText(ideaText);
      setVisibleResearch(RESEARCH_DATA);
    }

    const handleChange = () => {
      const newValue = mediaQuery.matches;
      setPrefersReducedMotion(newValue);
      if (newValue) {
        setPhase("complete");
        setDisplayScore(finalScore);
        setActiveResearch([0, 1, 2, 3]);
        setTypedText(ideaText);
        setVisibleResearch(RESEARCH_DATA);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Phase 1: Typing animation (8s total)
  useEffect(() => {
    if (phase !== "typing" || prefersReducedMotion) return;

    let currentIndex = 0;
    let typingInterval: NodeJS.Timeout;
    
    // Small delay before starting to ensure component is mounted
    const startDelay = setTimeout(() => {
      typingInterval = setInterval(() => {
        if (currentIndex <= ideaText.length) {
          setTypedText(ideaText.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => setPhase("researching"), 1000);
        }
      }, 60); // 60ms per character for ~8s total
    }, 100);

    return () => {
      clearTimeout(startDelay);
      if (typingInterval) clearInterval(typingInterval);
    };
  }, [phase, prefersReducedMotion, ideaText]);

  // Phase 2: Live research animation (20s total)
  useEffect(() => {
    if (phase === "researching") {
      const timers: NodeJS.Timeout[] = [];
      
      // Show research items progressively (every 2.5s)
      RESEARCH_DATA.forEach((item, i) => {
        const timer = setTimeout(() => {
          setVisibleResearch(prev => [...prev, item]);
          setCurrentResearchIndex(i);
        }, i * 2500);
        timers.push(timer);
      });

      // Transition to analyzing after all research shown
      const transitionTimer = setTimeout(() => {
        setPhase("analyzing");
      }, RESEARCH_DATA.length * 2500 + 1000);
      timers.push(transitionTimer);

      return () => timers.forEach(clearTimeout);
    }
  }, [phase]);

  // Phase 3: Analyzing with dimensions (22s total)
  useEffect(() => {
    if (phase === "analyzing") {
      const pulseTimers: NodeJS.Timeout[] = [];
      
      // Light up research dimensions sequentially
      DIMENSIONS.forEach((dim, i) => {
        const timer = setTimeout(() => {
          setActiveResearch(prev => [...prev, i]);
        }, i * 3000); // Every 3 seconds
        pulseTimers.push(timer);
      });

      // Start score counting after dimensions lit up
      const startScoreTimer = setTimeout(() => {
        let current = 0;
        const scoreInterval = setInterval(() => {
          current += 2;
          if (current >= finalScore) {
            setDisplayScore(finalScore);
            clearInterval(scoreInterval);
            setTimeout(() => setPhase("complete"), 500);
          } else {
            setDisplayScore(current);
          }
        }, 200); // Count faster for smoother animation
        pulseTimers.push(scoreInterval);
      }, 12000);
      pulseTimers.push(startScoreTimer);

      return () => {
        pulseTimers.forEach(timer => {
          clearTimeout(timer);
          clearInterval(timer);
        });
      };
    }
  }, [phase]);

  // Phase 4: Complete (10s dwell = 60s total)
  useEffect(() => {
    if (phase === "complete") {
      const resetTimer = setTimeout(() => {
        setPhase("typing");
        setDisplayScore(0);
        setActiveResearch([]);
        setTypedText("");
        setVisibleResearch([]);
        setCurrentResearchIndex(0);
      }, 10000);
      return () => clearTimeout(resetTimer);
    }
  }, [phase]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "competitor": return "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "market": return "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "customer": return "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20";
      case "funding": return "text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20";
      default: return "text-gray-600 dark:text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 shadow-2xl">
      {/* Browser Chrome */}
      <div className="bg-gray-100 dark:bg-gray-800/50 border-b border-gray-200 dark:border-white/10 px-4 py-3 flex items-center gap-2">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="flex-1 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-white/10">
            <motion.div 
              className="w-3 h-3"
              animate={{ 
                color: phase === "complete" ? "rgb(74 222 128)" : "rgb(59 130 246)" 
              }}
            >
              {phase === "complete" ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              )}
            </motion.div>
            <span className="text-xs text-gray-600 dark:text-gray-400">mystartup.ai/validator</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4 min-h-[520px] max-h-[520px] overflow-y-auto bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">The Validator</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">60-second AI validation</p>
          </div>
        </div>

        {/* Typing Phase */}
        {phase === "typing" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Describe your startup idea
            </label>
            <div className="relative min-h-[80px]">
              <div className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white leading-relaxed">
                {typedText}
                <motion.span
                  className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Research Phase */}
        {phase === "researching" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Conducting live market research...
              </span>
            </div>
            
            <div className="space-y-2 max-h-[380px] overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {visibleResearch.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-3 rounded-lg border flex items-start gap-3 ${getTypeColor(item.type)}`}
                    >
                      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate">{item.title}</div>
                        <div className="text-xs opacity-80 truncate">{item.subtitle}</div>
                      </div>
                      {i === currentResearchIndex && (
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full bg-current"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Analyzing & Complete Phase */}
        {(phase === "analyzing" || phase === "complete") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Validation Results</h3>
              <AnimatePresence mode="wait">
                {phase === "analyzing" && (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center gap-2"
                  >
                    <Loader2 className="w-3 h-3 text-blue-600 dark:text-blue-400 animate-spin" />
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs">Analyzing</span>
                  </motion.div>
                )}
                {phase === "complete" && (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full"
                  >
                    <span className="text-green-600 dark:text-green-400 font-semibold text-xs">GO ✓</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Score */}
            <div className="relative">
              <div className="flex items-end gap-1 mb-2">
                <motion.div
                  className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent"
                  key={displayScore}
                >
                  {displayScore}
                </motion.div>
                <div className="text-gray-500 mb-1 text-sm">/100</div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${displayScore}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Dimensions with Insights */}
            <div className="space-y-2">
              {DIMENSIONS.map((dim, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.3 }}
                  animate={{
                    opacity: activeResearch.includes(i) ? 1 : 0.3,
                    scale: activeResearch.includes(i) ? 1 : 0.98,
                  }}
                  transition={{ duration: 0.3 }}
                  className="p-3 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 relative overflow-hidden"
                >
                  {activeResearch.includes(i) && phase === "analyzing" && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                  )}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1.5">
                        {dim.label}
                        {activeResearch.includes(i) && phase === "analyzing" && (
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-blue-500"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </div>
                      {activeResearch.includes(i) && phase === "complete" && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {dim.insight}
                        </div>
                      )}
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white ml-3">
                      {activeResearch.includes(i) ? dim.score : "—"}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Completion Badge */}
        {phase === "complete" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-xs text-blue-600 dark:text-blue-300 font-medium">
              8 live insights • {RESEARCH_DATA.length} data points analyzed
            </span>
          </motion.div>
        )}
      </div>

      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-2xl -z-10"
        animate={{
          opacity: phase === "complete" ? 0.3 : phase === "researching" ? 0.25 : 0.2
        }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}
