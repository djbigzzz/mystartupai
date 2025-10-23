import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, TrendingUp, Users, DollarSign, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ResearchDimension {
  id: string;
  label: string;
  icon: any;
  status: "pending" | "in_progress" | "complete";
  preview?: string;
}

interface LiveResearchProgressProps {
  isValidating: boolean;
}

export default function LiveResearchProgress({ isValidating }: LiveResearchProgressProps) {
  const [dimensions, setDimensions] = useState<ResearchDimension[]>([
    { id: "competitive", label: "Competitive Landscape", icon: Search, status: "pending" },
    { id: "market", label: "Market Trends & Size", icon: TrendingUp, status: "pending" },
    { id: "customer", label: "Customer Insights", icon: Users, status: "pending" },
    { id: "funding", label: "Funding Landscape", icon: DollarSign, status: "pending" },
  ]);

  useEffect(() => {
    if (!isValidating) {
      // Reset all to pending when not validating
      setDimensions(dims => dims.map(d => ({ ...d, status: "pending" as const })));
      return;
    }

    // Simulate research progress
    const intervals = [
      setTimeout(() => updateDimension(0, "in_progress"), 500),
      setTimeout(() => updateDimension(0, "complete"), 8000),
      setTimeout(() => updateDimension(1, "in_progress"), 8500),
      setTimeout(() => updateDimension(1, "complete"), 16000),
      setTimeout(() => updateDimension(2, "in_progress"), 16500),
      setTimeout(() => updateDimension(2, "complete"), 24000),
      setTimeout(() => updateDimension(3, "in_progress"), 24500),
      setTimeout(() => updateDimension(3, "complete"), 32000),
    ];

    return () => intervals.forEach(clearTimeout);
  }, [isValidating]);

  const updateDimension = (index: number, status: "pending" | "in_progress" | "complete") => {
    setDimensions(prev => {
      const newDims = [...prev];
      newDims[index] = { ...newDims[index], status };
      return newDims;
    });
  };

  if (!isValidating) return null;

  const completedCount = dimensions.filter(d => d.status === "complete").length;
  const progressPercentage = (completedCount / dimensions.length) * 100;

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          Live Market Research
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Research Progress</span>
            <span className="font-medium">{completedCount}/{dimensions.length} Complete</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Research Dimensions */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {dimensions.map((dimension, index) => {
              const Icon = dimension.icon;
              const isActive = dimension.status === "in_progress";
              const isComplete = dimension.status === "complete";

              return (
                <motion.div
                  key={dimension.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg transition-all duration-300
                    ${isActive 
                      ? "bg-primary/10 border-2 border-primary/30 shadow-lg shadow-primary/20 scale-[1.02]" 
                      : isComplete 
                      ? "bg-green-50 dark:bg-green-950/20 border-2 border-green-500/30" 
                      : "bg-muted/30 border-2 border-transparent"
                    }
                  `}
                >
                  <div className={`flex-shrink-0 ${isActive ? "animate-pulse" : ""}`}>
                    {isComplete ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </motion.div>
                    ) : isActive ? (
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    ) : (
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`
                      text-sm font-medium transition-colors
                      ${isActive ? "text-primary" : isComplete ? "text-green-700 dark:text-green-400" : "text-muted-foreground"}
                    `}>
                      {dimension.label}
                    </p>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-primary/70 mt-0.5"
                      >
                        Analyzing live web data...
                      </motion.p>
                    )}
                    {isComplete && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-green-600/70 dark:text-green-400/70 mt-0.5"
                      >
                        Data collected ✓
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Estimated Time */}
        <div className="pt-3 border-t border-border/50">
          <p className="text-xs text-center text-muted-foreground">
            Estimated completion: 60-90 seconds
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
