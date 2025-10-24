import { useState, useEffect } from "react";
import { Target, Loader2, CheckCircle2 } from "lucide-react";

type Phase = "typing" | "validating" | "complete";

export function ValidatorHeroDemo() {
  const [phase, setPhase] = useState<Phase>("typing");
  const [text, setText] = useState("");
  const [score, setScore] = useState(0);
  
  const fullText = "AI-powered meal planning app for busy professionals";
  const targetScore = 85;
  
  // Main animation loop - FAST version (15s total)
  useEffect(() => {
    let mounted = true;
    
    const runAnimation = async () => {
      if (!mounted) return;
      
      // Phase 1: Typing (4s)
      setPhase("typing");
      setText("");
      for (let i = 0; i <= fullText.length; i++) {
        if (!mounted) return;
        setText(fullText.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 80)); // Faster typing
      }
      
      if (!mounted) return;
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Phase 2: Validating (5s)
      setPhase("validating");
      setScore(0);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Animate score
      for (let i = 0; i <= targetScore; i += 3) {
        if (!mounted) return;
        setScore(Math.min(i, targetScore));
        await new Promise(resolve => setTimeout(resolve, 50)); // Faster score animation
      }
      
      if (!mounted) return;
      
      // Phase 3: Complete (6s)
      setPhase("complete");
      setScore(targetScore);
      await new Promise(resolve => setTimeout(resolve, 6000));
      
      // Loop
      if (mounted) {
        runAnimation();
      }
    };
    
    runAnimation();
    
    return () => {
      mounted = false;
    };
  }, []);
  
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
            {phase === "complete" ? (
              <CheckCircle2 className="w-3 h-3 text-green-500" />
            ) : (
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            )}
            <span className="text-xs text-gray-600 dark:text-gray-400">mystartup.ai/validator</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4 min-h-[400px] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
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
          <div className="space-y-2 animate-in fade-in duration-300">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Describe your startup idea
            </label>
            <div className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white min-h-[80px]">
              {text}
              <span className="inline-block w-0.5 h-4 bg-blue-500 ml-1 animate-pulse"></span>
            </div>
          </div>
        )}

        {/* Validating & Complete Phase */}
        {(phase === "validating" || phase === "complete") && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Validation Results</h3>
              {phase === "validating" && (
                <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center gap-2 animate-in fade-in duration-200">
                  <Loader2 className="w-3 h-3 text-blue-600 dark:text-blue-400 animate-spin" />
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs">Analyzing</span>
                </div>
              )}
              {phase === "complete" && (
                <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full animate-in fade-in duration-200">
                  <span className="text-green-600 dark:text-green-400 font-semibold text-xs">GO ✓</span>
                </div>
              )}
            </div>
            
            {/* Score */}
            <div className="relative">
              <div className="flex items-end gap-1 mb-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  {score}
                </div>
                <div className="text-gray-500 mb-1 text-sm">/100</div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            {/* Insights */}
            {phase === "complete" && (
              <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Market Size</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">$12.5B TAM, growing 14.3% annually</div>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">Timing</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Post-pandemic health trends accelerating</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Glow effect */}
      <div 
        className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-2xl -z-10 transition-opacity duration-500"
        style={{ opacity: phase === "complete" ? 0.3 : phase === "validating" ? 0.25 : 0.2 }}
      />
    </div>
  );
}
