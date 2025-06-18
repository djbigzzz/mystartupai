import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  CheckCircle,
  Sparkles,
  Play,
  RotateCcw
} from "lucide-react";

export default function InteractivePreview() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const demoSteps = [
    {
      title: "Startup Idea Input",
      description: "AI-powered fitness app for busy professionals",
      type: "text" as const,
      content: "FitPro - A personalized fitness app that creates custom workout plans for busy professionals with limited time, using AI to adapt routines based on schedule and fitness level."
    },
    {
      title: "AI Analysis in Progress",
      description: "Analyzing market potential and competition",
      type: "processing" as const,
      content: "Processing startup concept using Y Combinator frameworks..."
    },
    {
      title: "Market Analysis Complete",
      description: "Identified key opportunities and challenges",
      type: "analysis" as const,
      content: "Analysis results ready"
    },
    {
      title: "Business Plan Generated",
      description: "Comprehensive 12-section business plan created",
      type: "text" as const,
      content: "Generated executive summary, market analysis, financial projections, and go-to-market strategy based on proven startup methodologies."
    }
  ];

  const analysisResults = {
    score: 8.5,
    strengths: [
      "Large addressable market ($96B)",
      "Growing remote work trend",
      "AI personalization advantage",
      "Subscription revenue model"
    ],
    weaknesses: [
      "High customer acquisition costs",
      "Competitive fitness app market"
    ],
    marketOpportunity: "The global fitness app market is expected to reach $15.6B by 2026, driven by increased health consciousness and remote work trends.",
    recommendations: [
      "Focus on corporate wellness partnerships",
      "Develop AI-driven habit formation features",
      "Create integration with popular calendar apps"
    ]
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (currentStep < demoSteps.length - 1) {
              setCurrentStep((step) => step + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + 2;
        });
      }, 50);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  const startDemo = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
  };

  const currentStepData = demoSteps[currentStep];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl border">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">See AI in Action</h3>
        <p className="text-gray-600">Watch how our AI analyzes a startup idea and generates professional business assets</p>
      </div>

      {/* Demo Controls */}
      <div className="flex justify-center gap-4 mb-8">
        <Button 
          onClick={startDemo} 
          disabled={isPlaying}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Play className="w-4 h-4 mr-2" />
          {isPlaying ? "Playing..." : "Start Demo"}
        </Button>
        <Button variant="outline" onClick={resetDemo}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {demoSteps.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                index <= currentStep
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Current Step Display */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
              <p className="text-gray-600 mt-1">{currentStepData.description}</p>
            </div>
            {currentStep === 2 && (
              <Badge className="bg-green-100 text-green-800">
                Score: {analysisResults.score}/10
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Step 0: Idea Input */}
          {currentStep === 0 && currentStepData.type === "text" && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-800 italic">"{currentStepData.content}"</p>
            </div>
          )}

          {/* Step 1: Processing */}
          {currentStep === 1 && currentStepData.type === "processing" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
                <span className="text-gray-700">{currentStepData.content}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Market Research", "Competitor Analysis", "Financial Modeling", "Risk Assessment"].map((task, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      {isPlaying && progress > (index + 1) * 20 ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Brain className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{task}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Analysis Results */}
          {currentStep === 2 && currentStepData.type === "analysis" && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Market Score</p>
                  <p className="text-2xl font-bold text-green-600">8.5/10</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Market Size</p>
                  <p className="text-lg font-bold text-blue-600">$96B</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Competition</p>
                  <p className="text-lg font-bold text-purple-600">Medium</p>
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Key Strengths
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {analysisResults.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Business Plan */}
          {currentStep === 3 && currentStepData.type === "text" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Executive Summary",
                  "Market Analysis", 
                  "Financial Projections",
                  "Marketing Strategy",
                  "Operational Plan",
                  "Risk Analysis"
                ].map((section, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-800">{section}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6">
                <Badge className="bg-blue-100 text-blue-800">
                  ✨ Professional 12-section business plan generated in under 60 seconds
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CTA */}
      {currentStep === demoSteps.length - 1 && !isPlaying && (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Ready to analyze your startup idea?</p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Target className="w-5 h-5 mr-2" />
            Try With Your Idea
          </Button>
        </div>
      )}
    </div>
  );
}