import { useState, useEffect } from "react";
import { Target } from "lucide-react";

export function ValidatorHeroDemo() {
  const [text, setText] = useState("");
  const fullText = "AI meal planning app";
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        // Reset after 3 seconds
        setTimeout(() => {
          setText("");
          index = 0;
        }, 3000);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, [text === ""]);  // Re-run when text resets to empty
  
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 shadow-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">The Validator</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">60-second AI validation</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Describe your startup idea
        </label>
        <div className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white min-h-[80px]">
          {text}
          <span className="inline-block w-0.5 h-4 bg-blue-500 ml-1 animate-pulse"></span>
        </div>
      </div>
    </div>
  );
}
