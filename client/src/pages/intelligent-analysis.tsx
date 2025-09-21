import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import IntelligentIdeaAnalyzer from "@/components/intelligent-idea-analyzer";
import { queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Lightbulb } from "lucide-react";

export default function IntelligentAnalysisPage() {
  const [, setLocation] = useLocation();
  const [currentIdeaId, setCurrentIdeaId] = useState<string>("");

  // Get current idea ID from URL params or local storage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ideaId = urlParams.get("ideaId") || localStorage.getItem("currentIdeaId");
    if (ideaId) {
      setCurrentIdeaId(ideaId);
    }
  }, []);

  // Fetch current idea data
  const { data: ideaData, isLoading, error } = useQuery({
    queryKey: [`/api/ideas/${currentIdeaId}`],
    enabled: !!currentIdeaId,
  });

  const handleAnalysisComplete = (analysis: any, insights: any) => {
    // Invalidate and refresh the idea data
    queryClient.invalidateQueries({ queryKey: [`/api/ideas/${currentIdeaId}`] });
    
    // Don't automatically redirect - let user view results first
    // They can choose to continue from the results screen
  };

  if (!currentIdeaId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-blue-600" />
                No Idea Selected
              </CardTitle>
              <CardDescription>
                No startup idea found to analyze. Please go back to the dashboard and select an idea first.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setLocation("/dashboard")} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your idea...</p>
        </div>
      </div>
    );
  }

  if (error || !ideaData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Error Loading Idea</CardTitle>
              <CardDescription>
                Failed to load your startup idea. Please try again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setLocation("/dashboard")} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => setLocation("/dashboard")} 
            variant="outline" 
            className="mb-4"
            data-testid="button-back-to-dashboard"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🧠 Intelligent Idea Analysis
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              AI will analyze your idea, ask clarifying questions if needed, and provide realistic market insights tailored to your specific business context.
            </p>
          </div>
        </div>

        {/* Analysis Component */}
        <IntelligentIdeaAnalyzer 
          ideaData={ideaData}
          onAnalysisComplete={handleAnalysisComplete}
        />
      </div>
    </div>
  );
}