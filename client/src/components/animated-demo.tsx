import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  FileText, 
  Presentation, 
  TrendingUp, 
  Target,
  Users,
  DollarSign,
  Lightbulb,
  Rocket,
  CheckCircle,
  Sparkles
} from "lucide-react";

export default function AnimatedDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const steps = [
    {
      title: "AI Idea Analysis",
      description: "Analyzing EcoFlow using Y Combinator standards",
      icon: Brain,
      color: "bg-blue-500",
      metrics: [
        { label: "Market Size", value: "$2.1B", change: "+15%" },
        { label: "Competition", value: "Low", change: "Favorable" },
        { label: "Feasibility", value: "92%", change: "+8%" }
      ]
    },
    {
      title: "Business Plan Generation",
      description: "Creating comprehensive 12-section business plan",
      icon: FileText,
      color: "bg-emerald-500",
      metrics: [
        { label: "Revenue Model", value: "SaaS", change: "Validated" },
        { label: "TAM", value: "$847M", change: "Addressable" },
        { label: "Funding Need", value: "$2.5M", change: "Series A" }
      ]
    },
    {
      title: "Pitch Deck Creation",
      description: "Building investor-ready presentation",
      icon: Presentation,
      color: "bg-purple-500",
      metrics: [
        { label: "Slides", value: "12", change: "Complete" },
        { label: "Story Arc", value: "Strong", change: "Compelling" },
        { label: "Financial Model", value: "5-Year", change: "Detailed" }
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          setCurrentStep(curr => (curr + 1) % steps.length);
          return 0;
        }
        return newProgress;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsAnalyzing(progress > 20 && progress < 80);
  }, [progress]);

  const currentStepData = steps[currentStep];

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className={`${currentStepData.color} p-6 text-white relative overflow-hidden`}>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <currentStepData.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{currentStepData.title}</h3>
              <p className="text-white/80 text-sm">{currentStepData.description}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/80 text-sm">Processing...</span>
              <span className="text-white font-bold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-white/20" />
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-slate-900">EcoFlow Analysis</h4>
            <Badge className="bg-green-100 text-green-800">
              <TrendingUp className="w-3 h-3 mr-1" />
              87/100 Score
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {currentStepData.metrics.map((metric, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg transition-all duration-500 ${
                  isAnalyzing ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                }`}
              >
                <div className="text-xs font-medium text-slate-600 mb-1">{metric.label}</div>
                <div className="font-bold text-slate-900">{metric.value}</div>
                <div className="text-xs text-emerald-600">{metric.change}</div>
              </div>
            ))}
          </div>

          {/* Live analysis indicators */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {isAnalyzing ? (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              ) : (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              <span className="text-sm text-slate-700">Market opportunity analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              {isAnalyzing && progress > 40 ? (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              ) : progress > 40 ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
              )}
              <span className="text-sm text-slate-700">Competitive landscape review</span>
            </div>
            <div className="flex items-center space-x-2">
              {isAnalyzing && progress > 70 ? (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              ) : progress > 70 ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
              )}
              <span className="text-sm text-slate-700">Financial viability assessment</span>
            </div>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? currentStepData.color.replace('bg-', 'bg-') 
                  : index < currentStep 
                    ? 'bg-green-500' 
                    : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}