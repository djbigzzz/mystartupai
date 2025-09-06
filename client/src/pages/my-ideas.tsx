import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Lightbulb, 
  Plus, 
  Search, 
  Eye, 
  FileText, 
  TrendingUp,
  Calendar,
  Brain,
  Target,
  BarChart3
} from "lucide-react";
import { Link } from "wouter";

interface StartupIdea {
  id: number;
  ideaTitle: string;
  description: string;
  industry: string;
  stage: string;
  analysisStatus: string;
  validationScore: number | null;
  createdAt: string;
  analysis?: any;
}

export default function MyIdeas() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: ideas, isLoading, error } = useQuery<StartupIdea[]>({
    queryKey: ["/api/ideas"],
    retry: 1,
  });

  const filteredIdeas = ideas?.filter(idea =>
    idea.ideaTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.industry.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getValidationScoreColor = (score: number | null) => {
    if (!score) return "text-gray-500";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">
                Unable to Load Ideas
              </h2>
              <p className="text-red-600 dark:text-red-400 mb-4">
                Please make sure you're logged in and try again.
              </p>
              <Link href="/app">
                <Button>Go to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Startup Ideas
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage and track all your startup concepts in one place
              </p>
            </div>
            <Link href="/submit-idea">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Idea
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Lightbulb className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Ideas</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{ideas?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Brain className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Analyzed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {ideas?.filter(idea => idea.analysisStatus === "completed").length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">High Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {ideas?.filter(idea => idea.validationScore && idea.validationScore >= 80).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {ideas?.filter(idea => idea.validationScore).reduce((acc, idea) => acc + (idea.validationScore || 0), 0) / (ideas?.filter(idea => idea.validationScore).length || 1) || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ideas Grid */}
        {filteredIdeas.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
            <CardContent className="p-12 text-center">
              <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {searchQuery ? "No ideas found" : "No ideas yet"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchQuery 
                  ? "Try adjusting your search terms" 
                  : "Submit your first startup idea to get AI-powered analysis and insights"
                }
              </p>
              {!searchQuery && (
                <Link href="/submit-idea">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Your First Idea
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 line-clamp-2">{idea.ideaTitle}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {idea.industry}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {idea.stage}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {idea.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Status:</span>
                        <Badge className={`ml-1 text-xs ${getStatusColor(idea.analysisStatus)}`}>
                          {idea.analysisStatus}
                        </Badge>
                      </div>
                      {idea.validationScore && (
                        <div className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Score:</span>
                          <span className={`ml-1 font-semibold ${getValidationScoreColor(idea.validationScore)}`}>
                            {idea.validationScore}/100
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      {idea.analysisStatus === "completed" && (
                        <Button size="sm" variant="outline">
                          <FileText className="w-3 h-3 mr-1" />
                          Report
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}