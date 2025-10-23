import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Loader2, CheckCircle2 } from "lucide-react";

interface Dimension {
  label: string;
  score: number;
  delay: number;
}

const DIMENSIONS: Dimension[] = [
  { label: "Market Size", score: 90, delay: 0 },
  { label: "Competition", score: 75, delay: 0.3 },
  { label: "Feasibility", score: 88, delay: 0.6 },
  { label: "Timing", score: 82, delay: 0.9 }
];

export function ValidatorHeroDemo() {
  const [phase, setPhase] = useState<"typing" | "analyzing" | "complete">("typing");
  const [displayScore, setDisplayScore] = useState(0);
  const [activeResearch, setActiveResearch] = useState<number[]>([]);
  const [typedText, setTypedText] = useState("");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const ideaText = "AI-powered meal planning app";
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
    }

    const handleChange = () => {
      const newValue = mediaQuery.matches;
      setPrefersReducedMotion(newValue);
      if (newValue) {
        setPhase("complete");
        setDisplayScore(finalScore);
        setActiveResearch([0, 1, 2, 3]);
        setTypedText(ideaText);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Phase 1: Typing animation (5s total)
  useEffect(() => {
    if (phase !== "typing" || prefersReducedMotion) return;

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= ideaText.length) {
        setTypedText(ideaText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => setPhase("analyzing"), 1000);
      }
    }, 150); // Slower typing: 150ms per character

    return () => clearInterval(typingInterval);
  }, [phase, prefersReducedMotion]);

  // Phase 2: Analyzing with research pulses (45s total)
  useEffect(() => {
    if (phase === "analyzing") {
      const pulseTimers: NodeJS.Timeout[] = [];
      
      // Light up research dimensions sequentially over 10s
      DIMENSIONS.forEach((dim, i) => {
        const timer = setTimeout(() => {
          setActiveResearch(prev => [...prev, i]);
        }, (i + 1) * 2500); // Every 2.5 seconds
        pulseTimers.push(timer);
      });

      // Start score counting after 10s, count for 30s
      const startScoreTimer = setTimeout(() => {
        let current = 0;
        const scoreInterval = setInterval(() => {
          current += 1;
          if (current >= finalScore) {
            setDisplayScore(finalScore);
            clearInterval(scoreInterval);
            setTimeout(() => setPhase("complete"), 1000);
          } else {
            setDisplayScore(current);
          }
        }, 350); // 350ms per point = ~30s total to reach 85
        pulseTimers.push(scoreInterval);
      }, 10000);
      pulseTimers.push(startScoreTimer);

      return () => {
        pulseTimers.forEach(timer => {
          clearTimeout(timer);
          clearInterval(timer);
        });
      };
    }
  }, [phase]);

  // Reset animation after complete phase (10s dwell = 60s total)
  useEffect(() => {
    if (phase === "complete") {
      const resetTimer = setTimeout(() => {
        setPhase("typing");
        setDisplayScore(0);
        setActiveResearch([]);
        setTypedText("");
      }, 10000); // 10s dwell in complete state
      return () => clearTimeout(resetTimer);
    }
  }, [phase]);

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
      <div className="p-8 space-y-6 min-h-[500px] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">The Validator</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">AI validation with market research</p>
          </div>
        </div>

        {/* Input Field (Typing Phase) */}
        {phase === "typing" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              What's your startup idea?
            </label>
            <div className="relative">
              <div className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white">
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

        {/* Validation Results */}
        {(phase === "analyzing" || phase === "complete") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Validation Results</h3>
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
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">Analyzing</span>
                  </motion.div>
                )}
                {phase === "complete" && (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full"
                  >
                    <span className="text-green-600 dark:text-green-400 font-semibold text-sm">GO</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Score */}
            <div className="relative">
              <div className="flex items-end gap-1 mb-2">
                <motion.div
                  className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent"
                  key={displayScore}
                >
                  {displayScore}
                </motion.div>
                <div className="text-gray-500 mb-2">/100</div>
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

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-3 pt-4">
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
                  {activeResearch.includes(i) && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  )}
                  <div className="relative z-10">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                      {dim.label}
                      {activeResearch.includes(i) && phase === "analyzing" && (
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full bg-blue-500"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {activeResearch.includes(i) ? dim.score : "—"}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Live Badge */}
        {phase === "complete" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-sm text-blue-600 dark:text-blue-300">Live market research completed</span>
          </motion.div>
        )}
      </div>

      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-2xl -z-10"
        animate={{
          opacity: phase === "complete" ? 0.3 : 0.2
        }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}
