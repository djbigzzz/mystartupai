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
      title: "Step 1: Submit Your Idea",
      description: "Smart form captures your startup concept details",
      icon: Lightbulb,
      color: "bg-purple-500",
      content: {
        type: "form",
        fields: [
          { label: "Startup Name", value: "EcoFlow", placeholder: "Enter your startup name..." },
          { label: "Problem Statement", value: "Water waste costs businesses millions annually", placeholder: "What problem does your startup solve?" },
          { label: "Solution", value: "AI-powered water management system", placeholder: "How does your startup solve this problem?" },
          { label: "Target Market", value: "Commercial buildings, hotels, factories", placeholder: "Who are your target customers?" }
        ]
      }
    },
    {
      title: "Step 2: AI Analysis",
      description: "Advanced AI evaluates your idea across multiple dimensions",
      icon: Brain,
      color: "bg-blue-500",
      content: {
        type: "analysis",
        score: 87,
        insights: [
          { category: "Market Opportunity", score: 92, insight: "Large addressable market with growing demand" },
          { category: "Competition", score: 78, insight: "Moderate competition with differentiation potential" },
          { category: "Feasibility", score: 89, insight: "Strong technical and business feasibility" },
          { category: "Revenue Potential", score: 91, insight: "Multiple revenue streams identified" }
        ]
      }
    },
    {
      title: "Step 3: Business Plan Generation",
      description: "Complete 12-section business plan created automatically",
      icon: FileText,
      color: "bg-emerald-500",
      content: {
        type: "business-plan",
        sections: [
          { name: "Executive Summary", status: "complete", wordCount: 287 },
          { name: "Market Analysis", status: "complete", wordCount: 456 },
          { name: "Financial Projections", status: "complete", wordCount: 321 },
          { name: "Marketing Strategy", status: "complete", wordCount: 298 },
          { name: "Operations Plan", status: "generating", wordCount: 0 },
          { name: "Risk Analysis", status: "pending", wordCount: 0 }
        ]
      }
    },
    {
      title: "Step 4: Pitch Deck Creation",
      description: "Professional investor presentation with 12 slides",
      icon: Presentation,
      color: "bg-orange-500",
      content: {
        type: "pitch-deck",
        slides: [
          { title: "Problem", content: "Water waste costs $2.1B annually", status: "complete" },
          { title: "Solution", content: "AI-powered monitoring system", status: "complete" },
          { title: "Market Size", content: "$847M addressable market", status: "complete" },
          { title: "Business Model", content: "SaaS with usage-based pricing", status: "generating" },
          { title: "Traction", content: "Early pilots show 35% water savings", status: "pending" },
          { title: "Funding Ask", content: "$2.5M Series A", status: "pending" }
        ]
      }
    },
    {
      title: "Step 5: Financial Modeling",
      description: "Detailed financial projections and investment calculator",
      icon: DollarSign,
      color: "bg-green-500",
      content: {
        type: "financial",
        projections: [
          { year: "Year 1", revenue: "$125K", expenses: "$380K", profit: "-$255K" },
          { year: "Year 2", revenue: "$580K", expenses: "$620K", profit: "-$40K" },
          { year: "Year 3", revenue: "$1.2M", expenses: "$890K", profit: "$310K" },
          { year: "Year 4", revenue: "$2.8M", expenses: "$1.8M", profit: "$1.0M" },
          { year: "Year 5", revenue: "$5.2M", expenses: "$3.1M", profit: "$2.1M" }
        ]
      }
    },
    {
      title: "Step 6: Complete Package",
      description: "All deliverables ready for investors and execution",
      icon: Rocket,
      color: "bg-indigo-500",
      content: {
        type: "complete",
        deliverables: [
          { name: "AI Analysis Report", status: "complete", confidence: "87%" },
          { name: "Business Plan (12 sections)", status: "complete", pages: 24 },
          { name: "Pitch Deck (12 slides)", status: "complete", slides: 12 },
          { name: "Financial Model (5 years)", status: "complete", scenarios: 3 },
          { name: "Market Research", status: "complete", sources: 15 },
          { name: "Competitive Analysis", status: "complete", competitors: 8 }
        ]
      }
    }
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