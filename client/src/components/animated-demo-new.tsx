import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  FileText, 
  Presentation, 
  DollarSign, 
  Lightbulb,
  Rocket,
  CheckCircle,
  Sparkles,
  TrendingUp
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
          { name: "Business Plan (12 sections)", status: "complete", pages: "24 pages" },
          { name: "Pitch Deck (12 slides)", status: "complete", slides: "12 slides" },
          { name: "Financial Model (5 years)", status: "complete", scenarios: "3 scenarios" },
          { name: "Market Research", status: "complete", sources: "15 sources" },
          { name: "Competitive Analysis", status: "complete", competitors: "8 competitors" }
        ]
      }
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setProgress(0);
    setIsAnalyzing(true);
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 1.5;
      });
    }, 75);

    return () => clearInterval(progressInterval);
  }, [currentStep]);

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.content.type) {
      case "form":
        return (
          <div className="space-y-4">
            {step.content.fields.map((field, index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium">{field.label}</label>
                <div className="p-3 border rounded-lg bg-background">
                  {isAnalyzing && index === 0 ? (
                    <div className="animate-pulse h-4 bg-muted rounded w-3/4"></div>
                  ) : (
                    <span className="text-sm">{field.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      
      case "analysis":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{step.content.score}/100</div>
              <div className="text-sm text-muted-foreground">Overall Viability Score</div>
            </div>
            <div className="space-y-3">
              {step.content.insights.map((insight, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{insight.category}</div>
                    <div className="text-xs text-muted-foreground">{insight.insight}</div>
                  </div>
                  <div className="text-lg font-bold text-primary">{insight.score}%</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case "business-plan":
        return (
          <div className="space-y-3">
            {step.content.sections.map((section, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {section.status === "complete" && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {section.status === "generating" && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>}
                  {section.status === "pending" && <div className="w-4 h-4 border rounded-full border-muted"></div>}
                  <span className="text-sm font-medium">{section.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{section.wordCount > 0 ? `${section.wordCount} words` : ''}</span>
              </div>
            ))}
          </div>
        );
      
      case "pitch-deck":
        return (
          <div className="space-y-3">
            {step.content.slides.map((slide, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{slide.title}</span>
                  {slide.status === "complete" && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {slide.status === "generating" && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>}
                  {slide.status === "pending" && <div className="w-4 h-4 border rounded-full border-muted"></div>}
                </div>
                <div className="text-xs text-muted-foreground">{slide.content}</div>
              </div>
            ))}
          </div>
        );
      
      case "financial":
        return (
          <div className="space-y-3">
            {step.content.projections.map((projection, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium text-sm">{projection.year}</span>
                <div className="text-right text-xs">
                  <div>Revenue: {projection.revenue}</div>
                  <div>Profit: <span className={projection.profit.startsWith('-') ? 'text-red-500' : 'text-green-500'}>{projection.profit}</span></div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case "complete":
        return (
          <div className="space-y-3">
            {step.content.deliverables.map((deliverable, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">{deliverable.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {deliverable.confidence || deliverable.pages || deliverable.slides}
                </span>
              </div>
            ))}
          </div>
        );
      
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              Live Demo
            </Badge>
            <h2 className="text-3xl font-bold mb-2">Watch AI Build EcoFlow's Complete Startup Package</h2>
            <p className="text-muted-foreground">
              See how our AI transforms a simple idea into investor-ready materials in 6 distinct steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Process Visualization */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${steps[currentStep].color} text-white`}>
                  {React.createElement(steps[currentStep].icon, { className: "w-6 h-6" })}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{steps[currentStep].title}</h3>
                  <p className="text-muted-foreground">{steps[currentStep].description}</p>
                </div>
              </div>

              <Progress value={progress} className="w-full" />
              
              <div className="text-center text-sm text-muted-foreground">
                {isAnalyzing ? "Processing..." : "Step completed"}
              </div>
            </div>

            {/* Right: Dynamic Content */}
            <div className="bg-muted/50 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">Live Results</h4>
              {renderStepContent()}
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-muted'
                }`}
                title={step.title}
              />
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Button>
              <Sparkles className="w-4 h-4 mr-2" />
              Try With Your Idea
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}