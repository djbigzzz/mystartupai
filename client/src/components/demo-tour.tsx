import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ArrowRight, CheckCircle } from "lucide-react";

interface DemoTourProps {
  onComplete: () => void;
}

export default function DemoTour({ onComplete }: DemoTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      title: "Welcome to Your AI Co-Pilot",
      content: "You're looking at EcoFlow, a smart water management startup that went through our complete AI analysis. Notice the detailed viability score of 87/100 and comprehensive market insights.",
      target: "analysis",
      highlight: "AI Analysis tab"
    },
    {
      title: "Investor-Ready Business Plan",
      content: "Click on the Business Plan tab to see a complete 12-section business plan generated in minutes. This includes financial projections, market analysis, and funding requirements.",
      target: "business-plan",
      highlight: "Business Plan tab"
    },
    {
      title: "Professional Pitch Deck",
      content: "The Pitch Deck tab contains a complete 12-slide investor presentation with speaker notes. Each slide tells part of the compelling startup story.",
      target: "pitch-deck",
      highlight: "Pitch Deck tab"
    },
    {
      title: "Ready to Start Your Journey?",
      content: "This is just a preview of what MyStartup.ai can do for your startup idea. Submit your own idea to get personalized analysis, business plans, and pitch decks.",
      target: "submit",
      highlight: "Submit Your Own Idea"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsVisible(false);
      onComplete();
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Demo Tour {currentStep + 1}/{steps.length}
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {steps[currentStep].title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {steps[currentStep].content}
              </p>
            </div>
            
            {steps[currentStep].highlight && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm font-medium">
                  👆 Look for: {steps[currentStep].highlight}
                </p>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-4">
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index <= currentStep ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={handleSkip}>
                  Skip Tour
                </Button>
                <Button size="sm" onClick={handleNext}>
                  {currentStep === steps.length - 1 ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Got It
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}