import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Building2, 
  Users, 
  MapPin, 
  DollarSign, 
  Target, 
  Lightbulb, 
  TrendingUp,
  CheckCircle,
  Circle,
  ArrowLeft,
  Save,
  Sparkles,
  Bot,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Brain,
  Zap,
  Star,
  Calculator,
  FileText,
  Eye,
  Lock,
  Unlock
} from "lucide-react";
import { Link } from "wouter";

// Phase definitions for progressive disclosure
type ProfilePhase = 'quick-start' | 'guided-completion' | 'advanced-details';

interface StartupProfile {
  id?: number;
  userId: number;
  
  // Phase 1: Quick Start - Minimal Input
  startupVision: string; // Free-form main input
  
  // AI-extracted/suggested fields
  suggestedCompanyName?: string;
  suggestedIndustry?: string;
  suggestedProblem?: string;
  suggestedSolution?: string;
  
  // Phase 2: Guided Completion - Structured Data
  companyName: string;
  industry: string;
  stage: string;
  location: string;
  teamSize: string;
  description: string;
  problemStatement: string;
  solutionApproach: string;
  targetMarket: string;
  competitiveAdvantage: string;
  revenueModel: string;
  fundingGoal: string;
  
  // Phase 3: Advanced Details - Deep Dive
  customerPersonas?: string;
  marketSize?: string;
  competitorAnalysis?: string;
  businessModelDetails?: string;
  financialAssumptions?: string;
  marketingChannels?: string;
  keyMetrics?: string;
  technologyStack?: string;
  intellectualProperty?: string;
  regulatoryConsiderations?: string;
  
  // Progress tracking
  currentPhase: ProfilePhase;
  completionPercentage: number;
  phaseCompletions: {
    quickStart: boolean;
    guidedCompletion: number; // percentage
    advancedDetails: number; // percentage
  };
}

const industries = [
  "Technology", "Healthcare", "Finance", "E-commerce", "Education", "Real Estate",
  "Food & Beverage", "Transportation", "Entertainment", "Energy", "Manufacturing", "Other"
];

const stages = [
  "Idea", "Pre-Seed", "Seed", "Series A", "Series B", "Series C+", "IPO Ready"
];

const teamSizes = [
  "Just me", "2-3 people", "4-10 people", "11-50 people", "51-100 people", "100+ people"
];

const revenueModels = [
  "Subscription", "One-time purchase", "Freemium", "Marketplace", "Advertising", "Affiliate", "Licensing", "Other"
];

export default function StartupProfile() {
  const { toast } = useToast();
  
  // Progressive disclosure state management
  const [currentPhase, setCurrentPhase] = useState<ProfilePhase>('quick-start');
  const [formData, setFormData] = useState<Partial<StartupProfile>>({
    currentPhase: 'quick-start',
    phaseCompletions: {
      quickStart: false,
      guidedCompletion: 0,
      advancedDetails: 0
    }
  });
  
  // AI assistance state
  const [aiSuggestions, setAiSuggestions] = useState<any>({});
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [showAdvancedSections, setShowAdvancedSections] = useState(false);
  
  // Section expansion state
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  
  // Progress calculation
  const [overallProgress, setOverallProgress] = useState(0);

  // Stable input handlers to prevent focus loss
  const handleStartupVisionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, startupVision: e.target.value }));
  }, []);

  const handleFormFieldChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // AI-powered vision parsing
  const generateProfileFromVision = async (vision: string) => {
    setIsGeneratingProfile(true);
    try {
      // Call actual AI analysis API
      const response = await fetch('/api/ai/analyze-startup-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vision }),
      });

      if (!response.ok) {
        throw new Error('AI analysis failed');
      }

      const aiAnalysis = await response.json();
      
      setAiSuggestions(aiAnalysis);
      setFormData(prev => ({
        ...prev,
        suggestedCompanyName: aiAnalysis.companyName,
        suggestedIndustry: aiAnalysis.industry,
        suggestedProblem: aiAnalysis.problem,
        suggestedSolution: aiAnalysis.solution
      }));
      
      toast({
        title: "AI Analysis Complete!",
        description: "I've analyzed your startup idea with AI. Review the intelligent suggestions below."
      });
      
    } catch (error) {
      toast({
        title: "AI Analysis Failed",
        description: "Please try again or continue manually.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingProfile(false);
    }
  };



  // Progress calculation
  useEffect(() => {
    const calculateProgress = () => {
      let progress = 0;
      
      // Phase 1: Quick Start (20% of total)
      if (formData.startupVision && formData.startupVision.length > 20) {
        progress += 20;
      }
      
      // Phase 2: Guided Completion (60% of total)
      const guidedFields = ['companyName', 'industry', 'stage', 'problemStatement', 'solutionApproach', 'targetMarket'];
      const completedFields = guidedFields.filter(field => formData[field as keyof StartupProfile]);
      progress += (completedFields.length / guidedFields.length) * 60;
      
      // Phase 3: Advanced Details (20% of total) 
      const advancedFields = ['customerPersonas', 'marketSize', 'competitorAnalysis', 'financialAssumptions'];
      const completedAdvanced = advancedFields.filter(field => formData[field as keyof StartupProfile]);
      progress += (completedAdvanced.length / advancedFields.length) * 20;
      
      setOverallProgress(Math.round(progress));
    };
    
    calculateProgress();
  }, [formData]);

  // Section toggle helper
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Fetch startup profile
  const { data: profile, isLoading, error } = useQuery<StartupProfile>({
    queryKey: ["/api/startup-profile"],
    retry: false,
    staleTime: 0,
    queryFn: async () => {
      try {
        const response = await fetch("/api/startup-profile", {
          credentials: "include"
        });
        
        if (response.status === 404) {
          return null; // No profile exists yet
        }
        
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`${response.status}: ${errorData}`);
        }
        
        return response.json();
      } catch (error) {
        console.error("Profile fetch error:", error);
        throw error;
      }
    }
  });

  // Save profile mutation
  const saveProfileMutation = useMutation({
    mutationFn: async (data: Partial<StartupProfile>) => {
      const endpoint = profile?.id ? `/api/startup-profile/${profile.id}` : "/api/startup-profile";
      const method = profile?.id ? "PATCH" : "POST";
      return apiRequest(endpoint, { method, body: data });
    },
    onSuccess: () => {
      toast({
        title: "Profile saved",
        description: "Your startup profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/startup-profile"] });
      setIsEditing(false);
    },
    onError: (error: any) => {
      console.error("Save error:", error);
      toast({
        title: "Save failed",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    }
  });

  // Initialize form data from existing profile if available
  useEffect(() => {
    if (profile && !formData.startupVision) {
      setFormData(prev => ({
        ...prev,
        ...profile,
        currentPhase: profile.currentPhase || 'quick-start',
        phaseCompletions: profile.phaseCompletions || {
          quickStart: false,
          guidedCompletion: 0,
          advancedDetails: 0
        }
      }));
      setCurrentPhase(profile.currentPhase || 'quick-start');
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading startup profile...</div>
        </div>
      </div>
    );
  }

  // Handle authentication errors
  if (error?.message?.includes("401")) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-4">Please log in to access your startup profile.</p>
          <Link href="/app">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Phase navigation
  const nextPhase = () => {
    if (currentPhase === 'quick-start') setCurrentPhase('guided-completion');
    else if (currentPhase === 'guided-completion') setCurrentPhase('advanced-details');
  };

  const previousPhase = () => {
    if (currentPhase === 'guided-completion') setCurrentPhase('quick-start');
    else if (currentPhase === 'advanced-details') setCurrentPhase('guided-completion');
  };

  // Phase 1: Quick Start Component
  const QuickStartPhase = () => (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
          <Lightbulb className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Share Your Vision
        </CardTitle>
        <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tell us about your startup idea in your own words. Our AI will intelligently extract key details and guide you through building a comprehensive profile.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="startup-vision" className="text-lg font-semibold text-gray-800">
            What's your startup idea? <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="startup-vision"
            placeholder="Example: I want to create an AI-powered fitness app that provides real-time form correction during workouts. Many people struggle with maintaining proper exercise form at home, leading to injuries and ineffective workouts. My app would use computer vision to analyze user movements and provide instant feedback..."
            className="min-h-32 text-base border-2 border-gray-200 focus:border-blue-500 resize-none"
            value={formData.startupVision || ''}
            onChange={handleStartupVisionChange}
          />
          <p className="text-sm text-gray-500 flex items-center">
            <Bot className="w-4 h-4 mr-2" />
            Our AI will use this to kickstart your profile and suggest initial details
          </p>
        </div>

        {/* Optional Quick Fields - Initially Hidden */}
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => toggleSection('quick-optional')}
            className="w-full justify-between"
          >
            <span>Quick Details (Optional)</span>
            {expandedSections.includes('quick-optional') ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
            }
          </Button>
          
          {expandedSections.includes('quick-optional') && (
            <div className="grid md:grid-cols-2 gap-4 p-4 bg-white rounded-lg border border-gray-200">
              <div>
                <Label htmlFor="quick-company">Company Name (Optional)</Label>
                <Input
                  id="quick-company"
                  placeholder="Leave blank for AI suggestion"
                  value={formData.companyName || ''}
                  onChange={(e) => handleFormFieldChange('companyName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="quick-industry">Industry (Optional)</Label>
                <Select 
                  value={formData.industry || ''} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select or leave for AI suggestion" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* AI Suggestions Display */}
        {aiSuggestions.companyName && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <Sparkles className="w-5 h-5 text-green-600 mr-2" />
                <CardTitle className="text-lg text-green-800">AI Extracted Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded border border-green-200">
                  <Label className="text-sm font-medium text-green-700">Suggested Company Name</Label>
                  <p className="text-green-800 font-semibold">{aiSuggestions.companyName}</p>
                </div>
                <div className="p-3 bg-white rounded border border-green-200">
                  <Label className="text-sm font-medium text-green-700">Suggested Industry</Label>
                  <p className="text-green-800 font-semibold">{aiSuggestions.industry}</p>
                </div>
              </div>
              <div className="p-3 bg-white rounded border border-green-200">
                <Label className="text-sm font-medium text-green-700">Problem Identified</Label>
                <p className="text-green-800">{aiSuggestions.problem}</p>
              </div>
              <div className="p-3 bg-white rounded border border-green-200">
                <Label className="text-sm font-medium text-green-700">Solution Approach</Label>
                <p className="text-green-800">{aiSuggestions.solution}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            onClick={() => {
              if (formData.startupVision && formData.startupVision.length > 20) {
                generateProfileFromVision(formData.startupVision);
              } else {
                toast({
                  title: "More details needed",
                  description: "Please describe your startup idea in more detail before generating your profile.",
                  variant: "destructive"
                });
              }
            }}
            disabled={isGeneratingProfile || !formData.startupVision || formData.startupVision.length < 20}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            {isGeneratingProfile ? (
              <>
                <Bot className="w-5 h-5 mr-2 animate-spin" />
                AI Analyzing Your Vision...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Initial Profile
              </>
            )}
          </Button>
          
          <Button
            onClick={nextPhase}
            variant="outline"
            size="lg"
            disabled={!formData.startupVision || formData.startupVision.length < 20}
          >
            Continue to Guided Setup
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                  Build Your Startup Profile
                </h1>
                <p className="text-gray-600 text-lg">
                  Share your vision, and our AI will intelligently guide you to build a comprehensive foundation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-4 py-2 text-sm font-semibold">
                {overallProgress}% Complete
              </Badge>
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {/* Phase Navigation & Progress */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Profile Development Progress</h3>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{overallProgress}%</p>
                  <p className="text-sm text-gray-500">Complete</p>
                </div>
              </div>
              
              <Progress value={overallProgress} className="h-3 mb-4" />
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className={`p-3 rounded-lg border-2 transition-all ${
                  currentPhase === 'quick-start' 
                    ? 'border-blue-500 bg-blue-50' 
                    : formData.startupVision 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    currentPhase === 'quick-start' 
                      ? 'bg-blue-500 text-white' 
                      : formData.startupVision 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                  }`}>
                    {formData.startupVision ? <CheckCircle className="w-5 h-5" /> : '1'}
                  </div>
                  <div className="text-sm font-medium">Quick Start</div>
                  <div className="text-xs text-gray-500">Minimal Input</div>
                </div>
                
                <div className={`p-3 rounded-lg border-2 transition-all ${
                  currentPhase === 'guided-completion' 
                    ? 'border-blue-500 bg-blue-50' 
                    : overallProgress > 20 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    currentPhase === 'guided-completion' 
                      ? 'bg-blue-500 text-white' 
                      : overallProgress > 20 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                  }`}>
                    {overallProgress > 80 ? <CheckCircle className="w-5 h-5" /> : '2'}
                  </div>
                  <div className="text-sm font-medium">Guided Completion</div>
                  <div className="text-xs text-gray-500">Structured Data</div>
                </div>
                
                <div className={`p-3 rounded-lg border-2 transition-all ${
                  currentPhase === 'advanced-details' 
                    ? 'border-blue-500 bg-blue-50' 
                    : overallProgress > 80 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    currentPhase === 'advanced-details' 
                      ? 'bg-blue-500 text-white' 
                      : overallProgress === 100 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                  }`}>
                    {overallProgress === 100 ? <CheckCircle className="w-5 h-5" /> : '3'}
                  </div>
                  <div className="text-sm font-medium">Advanced Details</div>
                  <div className="text-xs text-gray-500">Deep Dive</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phase Content */}
          {currentPhase === 'quick-start' && <QuickStartPhase />}
          {currentPhase === 'guided-completion' && <GuidedCompletionPhase />}
          {currentPhase === 'advanced-details' && <AdvancedDetailsPhase />}
        </div>
      </div>
    </div>
  );

  // Phase 2: Guided Completion Component  
  const GuidedCompletionPhase = () => (
    <div className="space-y-6">
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Building the Foundation
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Let's systematically collect essential details to create your comprehensive startup profile
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Basic Information Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <CardTitle className="text-xl">Basic Information</CardTitle>
                <CardDescription>Core details about your startup</CardDescription>
              </div>
            </div>
            <Badge variant={formData.companyName && formData.industry ? "default" : "secondary"}>
              {formData.companyName && formData.industry ? "Complete" : "Required"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name" className="flex items-center">
                Company Name <span className="text-red-500 ml-1">*</span>
                <HelpCircle className="w-4 h-4 ml-2 text-gray-400" title="The official name of your startup company" />
              </Label>
              <Input
                id="company-name"
                placeholder={aiSuggestions.companyName || "e.g., FitAI Technologies"}
                value={formData.companyName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="border-2 border-gray-200 focus:border-blue-500"
              />
              {aiSuggestions.companyName && !formData.companyName && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, companyName: aiSuggestions.companyName }))}
                  className="text-green-600 border-green-200"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Use AI Suggestion: {aiSuggestions.companyName}
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="industry" className="flex items-center">
                Industry <span className="text-red-500 ml-1">*</span>
                <HelpCircle className="w-4 h-4 ml-2 text-gray-400" title="The primary industry your startup operates in" />
              </Label>
              <Select 
                value={formData.industry || ''} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
              >
                <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                  <SelectValue placeholder={aiSuggestions.industry ? `Suggested: ${aiSuggestions.industry}` : "Select industry"} />
                </SelectTrigger>
                <SelectContent>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stage">
                Current Stage <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.stage || ''} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, stage: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map(stage => (
                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, CA"
                value={formData.location || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="team-size">Team Size</Label>
              <Select 
                value={formData.teamSize || ''} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, teamSize: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent>
                  {teamSizes.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problem & Solution Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Lightbulb className="w-6 h-6 text-orange-600 mr-3" />
              <div>
                <CardTitle className="text-xl">Problem & Solution</CardTitle>
                <CardDescription>Define the core problem you're solving</CardDescription>
              </div>
            </div>
            <Badge variant={formData.problemStatement && formData.solutionApproach ? "default" : "secondary"}>
              {formData.problemStatement && formData.solutionApproach ? "Complete" : "Required"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="problem" className="flex items-center">
              Problem Statement <span className="text-red-500 ml-1">*</span>
              <HelpCircle className="w-4 h-4 ml-2 text-gray-400" title="What specific problem does your startup solve?" />
            </Label>
            <Textarea
              id="problem"
              placeholder="Example: Small businesses struggle with inefficient inventory management, leading to significant waste and lost revenue..."
              className="min-h-24 border-2 border-gray-200 focus:border-blue-500"
              value={formData.problemStatement || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, problemStatement: e.target.value }))}
            />
            {aiSuggestions.problem && !formData.problemStatement && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({ ...prev, problemStatement: aiSuggestions.problem }))}
                className="text-green-600 border-green-200"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Use AI Identified Problem
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="solution" className="flex items-center">
              Solution Approach <span className="text-red-500 ml-1">*</span>
              <HelpCircle className="w-4 h-4 ml-2 text-gray-400" title="How does your product/service solve this problem?" />
            </Label>
            <Textarea
              id="solution"
              placeholder="Example: Our AI-powered inventory management platform uses predictive analytics to optimize stock levels and reduce waste..."
              className="min-h-24 border-2 border-gray-200 focus:border-blue-500"
              value={formData.solutionApproach || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, solutionApproach: e.target.value }))}
            />
            {aiSuggestions.solution && !formData.solutionApproach && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({ ...prev, solutionApproach: aiSuggestions.solution }))}
                className="text-green-600 border-green-200"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Use AI Suggested Solution
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Market & Strategy Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <CardTitle className="text-xl">Market & Strategy</CardTitle>
                <CardDescription>Target market and competitive advantage</CardDescription>
              </div>
            </div>
            <Badge variant="secondary">Optional</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-market">Target Market</Label>
              <Textarea
                id="target-market"
                placeholder="Example: Small to medium businesses with 10-500 employees in retail and manufacturing sectors..."
                className="min-h-20"
                value={formData.targetMarket || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, targetMarket: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="competitive-advantage">Competitive Advantage</Label>
              <Textarea
                id="competitive-advantage"
                placeholder="Example: First-to-market AI technology, exclusive partnerships, proprietary data..."
                className="min-h-20"
                value={formData.competitiveAdvantage || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, competitiveAdvantage: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="revenue-model">Revenue Model</Label>
              <Select 
                value={formData.revenueModel || ''} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, revenueModel: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select revenue model" />
                </SelectTrigger>
                <SelectContent>
                  {revenueModels.map(model => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="funding-goal">Initial Funding Goal</Label>
              <Input
                id="funding-goal"
                placeholder="e.g., $500K seed round"
                value={formData.fundingGoal || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, fundingGoal: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button onClick={previousPhase} variant="outline" size="lg">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Quick Start
        </Button>
        
        <div className="flex gap-4">
          <Button 
            onClick={() => {
              // Save current progress
              toast({
                title: "Progress Saved",
                description: "Your profile has been saved. You can continue later."
              });
            }}
            variant="outline" 
            size="lg"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Progress
          </Button>
          
          <Button 
            onClick={nextPhase}
            size="lg"
            disabled={!formData.companyName || !formData.industry || !formData.problemStatement || !formData.solutionApproach}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Continue to Advanced Details
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Phase 3: Advanced Details Component
  const AdvancedDetailsPhase = () => (
    <div className="space-y-6">
      <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Advanced Deep Dive
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Optional granular details for enhanced AI analysis and superior outputs
          </CardDescription>
          <div className="flex items-center justify-center mt-4 p-3 bg-blue-100 rounded-lg">
            <Star className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium">
              Unlock the most precise and tailored AI-generated business plans, pitch decks, and financial models
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* Market Intelligence Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-6 h-6 text-purple-600 mr-3" />
              <div>
                <CardTitle>Market Intelligence</CardTitle>
                <CardDescription>Deep market insights for strategic advantage</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-purple-200 text-purple-700">
              <Unlock className="w-3 h-3 mr-1" />
              Enhanced AI Analysis
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer-personas" className="flex items-center">
              Customer Personas & Demographics
              <HelpCircle className="w-4 h-4 ml-2 text-gray-400" title="Detailed descriptions of your ideal customers" />
            </Label>
            <Textarea
              id="customer-personas"
              placeholder="Example: Primary: Tech-savvy small business owners, 35-50 years old, annual revenue $1-10M, struggles with manual processes..."
              className="min-h-24"
              value={formData.customerPersonas || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, customerPersonas: e.target.value }))}
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="market-size">Market Size Analysis</Label>
              <Textarea
                id="market-size"
                placeholder="TAM: $50B, SAM: $5B, SOM: $500M..."
                className="min-h-20"
                value={formData.marketSize || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, marketSize: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="competitor-analysis">Competitive Landscape</Label>
              <Textarea
                id="competitor-analysis"
                placeholder="Direct competitors: Company A, B, C. Indirect: traditional methods..."
                className="min-h-20"
                value={formData.competitorAnalysis || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, competitorAnalysis: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Deep Dive Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <CardTitle>Financial Assumptions</CardTitle>
                <CardDescription>Unit economics and financial modeling details</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-blue-600">
              <Calculator className="w-3 h-3 mr-1" />
              AI Calculator
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="financial-assumptions">Key Financial Assumptions</Label>
            <Textarea
              id="financial-assumptions"
              placeholder="Customer Acquisition Cost (CAC): $50, Lifetime Value (LTV): $500, Monthly churn: 5%, Average deal size: $1000/month..."
              className="min-h-24"
              value={formData.financialAssumptions || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, financialAssumptions: e.target.value }))}
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="marketing-channels">Marketing Channels</Label>
              <Textarea
                id="marketing-channels"
                placeholder="Primary: Content marketing, SEO. Secondary: Paid ads, partnerships..."
                className="min-h-20"
                value={formData.marketingChannels || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, marketingChannels: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="key-metrics">Key Metrics to Track</Label>
              <Textarea
                id="key-metrics"
                placeholder="MRR, CAC payback period, Net Promoter Score, User engagement..."
                className="min-h-20"
                value={formData.keyMetrics || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, keyMetrics: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical & Legal Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <FileText className="w-6 h-6 text-indigo-600 mr-3" />
            <div>
              <CardTitle>Technical & Legal Considerations</CardTitle>
              <CardDescription>Implementation and compliance details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="technology-stack">Technology Stack</Label>
              <Textarea
                id="technology-stack"
                placeholder="Frontend: React, Backend: Node.js, Database: PostgreSQL, AI: OpenAI..."
                className="min-h-20"
                value={formData.technologyStack || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, technologyStack: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="intellectual-property">Intellectual Property</Label>
              <Textarea
                id="intellectual-property"
                placeholder="Patents pending, proprietary algorithms, trade secrets..."
                className="min-h-20"
                value={formData.intellectualProperty || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, intellectualProperty: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="regulatory-considerations">Regulatory & Compliance</Label>
            <Textarea
              id="regulatory-considerations"
              placeholder="GDPR compliance, industry regulations, certifications required..."
              className="min-h-20"
              value={formData.regulatoryConsiderations || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, regulatoryConsiderations: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button onClick={previousPhase} variant="outline" size="lg">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Guided Setup
        </Button>
        
        <div className="flex gap-4">
          <Button 
            onClick={() => {
              toast({
                title: "Profile Complete!",
                description: "Your comprehensive startup profile is ready for AI analysis."
              });
            }}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Complete Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
