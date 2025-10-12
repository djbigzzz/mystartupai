import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import IntelligentIdeaAnalyzer from "@/components/intelligent-idea-analyzer";
import { queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Lightbulb } from "lucide-react";
import SidebarNavigation from "@/components/dashboard/sidebar-navigation";
import MobileNavigation from "@/components/mobile-navigation";

export default function IntelligentAnalysisPage() {
  const [, setLocation] = useLocation();
  const [currentIdeaId, setCurrentIdeaId] = useState<string>("");

  // Get current idea ID from URL params or local storage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ideaIdFromUrl = urlParams.get("ideaId");
    const ideaIdFromStorage = localStorage.getItem("currentIdeaId");
    
    console.log("🔍 URL Search Params:", window.location.search);
    console.log("🔍 ideaId from URL:", ideaIdFromUrl);
    console.log("🔍 ideaId from localStorage:", ideaIdFromStorage);
    
    const ideaId = ideaIdFromUrl || ideaIdFromStorage;
    console.log("🔍 Final ideaId:", ideaId);
    
    if (ideaId) {
      setCurrentIdeaId(ideaId);
      // Also store it in localStorage for future use
      localStorage.setItem("currentIdeaId", ideaId);
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
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex">
          <SidebarNavigation />
        </div>
        
        {/* Mobile Navigation */}
        <MobileNavigation />
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6">
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
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex">
          <SidebarNavigation />
        </div>
        
        {/* Mobile Navigation */}
        <MobileNavigation />
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700 dark:text-gray-200 text-lg font-medium">Loading your idea...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !ideaData) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex">
          <SidebarNavigation />
        </div>
        
        {/* Mobile Navigation */}
        <MobileNavigation />
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-0 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-500/30 rounded-full flex items-center justify-center mb-4">
                <Lightbulb className="w-10 h-10 text-blue-600 dark:text-blue-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No Idea to Analyze Yet
              </h2>
              <p className="text-gray-700 dark:text-gray-200 mb-6 text-lg">
                Start by submitting your startup idea. Our AI will analyze it, ask clarifying questions, and provide valuable insights to help you build a successful business.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => setLocation("/submit-idea")} 
                className="w-full sm:w-auto"
                data-testid="button-submit-idea"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Submit Your Idea
              </Button>
              <Button 
                onClick={() => setLocation("/dashboard")} 
                variant="outline"
                className="w-full sm:w-auto"
                data-testid="button-back-dashboard"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <SidebarNavigation />
      </div>
      
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0 overflow-auto">
        <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                🧠 Intelligent Idea Analysis
              </h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
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
    </div>
  );
}