import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  Lightbulb,
  Building, 
  TrendingUp, 
  Target,
  AlertCircle,
  CheckCircle,
  Zap,
  DollarSign,
  Sparkles,
  Loader2,
  Save,
  ArrowLeft,
  Edit
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { insertStartupIdeaSchema } from "@shared/schema";
import type { InsertStartupIdea } from "@shared/schema";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import SidebarNavigation from "@/components/dashboard/sidebar-navigation";
import MobileNavigation from "@/components/mobile-navigation";

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "E-commerce",
  "SaaS",
  "Mobile Apps",
  "AI/ML",
  "Blockchain",
  "Sustainability",
  "Food & Beverage",
  "Real Estate",
  "Transportation",
  "Entertainment",
  "Other"
];

const stages = [
  "Idea Stage",
  "Concept Development", 
  "Market Research",
  "MVP Development",
  "Beta Testing",
  "Pre-Launch",
  "Launched"
];

const targetMarkets = [
  "B2B (Business to Business)",
  "B2C (Business to Consumer)",
  "B2B2C (Business to Business to Consumer)",
  "C2C (Consumer to Consumer)",
  "Marketplace",
  "Enterprise",
  "SMB (Small-Medium Business)",
  "Individual Consumers"
];

export default function SubmitIdea() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [aiSuggestionLoading, setAiSuggestionLoading] = useState<string | null>(null);

  // Fetch user's current idea
  const { data: ideasData = [], isLoading: ideasLoading } = useQuery({
    queryKey: ['/api/ideas'],
  });

  const currentIdea = ideasData.length > 0 ? ideasData[0] : null;

  const form = useForm<InsertStartupIdea & {
    targetMarket: string;
    problemStatement: string;
    solutionApproach: string;
    competitiveAdvantage: string;
    revenueModel: string;
  }>({
    resolver: zodResolver(insertStartupIdeaSchema.extend({
      targetMarket: insertStartupIdeaSchema.shape.industry,
      problemStatement: insertStartupIdeaSchema.shape.description,
      solutionApproach: insertStartupIdeaSchema.shape.description,
      competitiveAdvantage: insertStartupIdeaSchema.shape.description.optional(),
      revenueModel: insertStartupIdeaSchema.shape.description.optional(),
    })),
    defaultValues: {
      name: isAuthenticated ? user?.name || "" : "",
      email: isAuthenticated ? user?.email || "" : "",
      ideaTitle: "",
      description: "",
      industry: "",
      stage: "",
      targetMarket: "",
      problemStatement: "",
      solutionApproach: "",
      competitiveAdvantage: "",
      revenueModel: "",
    },
    mode: "onChange",
  });

  // Load existing idea data into form when available
  useEffect(() => {
    if (currentIdea) {
      form.reset({
        name: currentIdea.name || (isAuthenticated ? user?.name || "" : ""),
        email: currentIdea.email || (isAuthenticated ? user?.email || "" : ""),
        ideaTitle: currentIdea.ideaTitle || "",
        description: currentIdea.description || "",
        industry: currentIdea.industry || "",
        stage: currentIdea.stage || "",
        targetMarket: currentIdea.targetMarket || "",
        problemStatement: currentIdea.problemStatement || "",
        solutionApproach: currentIdea.solutionApproach || "",
        competitiveAdvantage: currentIdea.competitiveAdvantage || "",
        revenueModel: currentIdea.revenueModel || "",
      });
    } else if (isAuthenticated && user) {
      // Auto-populate user data for new ideas
      form.setValue('name', user.name || '');
      form.setValue('email', user.email || '');
    }
  }, [currentIdea, isAuthenticated, user]);

  const watchedFields = form.watch();

  // Handle AI suggestion generation
  const handleAISuggestion = async (fieldName: string, question: string) => {
    if (!watchedFields.ideaTitle || !watchedFields.description) {
      toast({
        title: "Missing Information",
        description: "Please complete the idea title and description first",
        variant: "destructive"
      });
      return;
    }

    setAiSuggestionLoading(fieldName);

    try {
      const response = await fetch("/api/ai-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          questionId: fieldName,
          question,
          ideaTitle: watchedFields.ideaTitle,
          description: watchedFields.description,
          industry: watchedFields.industry,
          businessType: watchedFields.targetMarket,
          ideaContext: {
            existingAnswers: {
              problemStatement: watchedFields.problemStatement,
              solutionApproach: watchedFields.solutionApproach,
              competitiveAdvantage: watchedFields.competitiveAdvantage,
              revenueModel: watchedFields.revenueModel,
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate suggestion");
      }

      const data = await response.json();
      
      // Set the AI suggestion to the form field
      form.setValue(fieldName as any, data.suggestion, { 
        shouldDirty: true, 
        shouldValidate: true 
      });

      toast({
        title: "AI Suggestion Applied",
        description: "You can edit the suggestion or generate a new one",
      });
    } catch (error) {
      toast({
        title: "Error generating suggestion",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setAiSuggestionLoading(null);
    }
  };

  const submitIdeaMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/ideas", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      toast({
        title: currentIdea ? "Idea updated successfully!" : "Idea created successfully!",
        description: "Your startup idea has been saved. Running AI analysis...",
      });
      
      localStorage.setItem("currentIdeaId", data.id.toString());
      localStorage.setItem("userEmail", data.email);
      
      // Invalidate queries and redirect
      queryClient.invalidateQueries({ queryKey: ['/api/ideas'] });
      setLocation(`/intelligent-analysis?ideaId=${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error saving idea",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    // Normalize optional fields - convert empty strings to undefined
    const normalizedData = {
      ...data,
      competitiveAdvantage: data.competitiveAdvantage?.trim() || undefined,
      revenueModel: data.revenueModel?.trim() || undefined,
      targetMarket: data.targetMarket?.trim() || undefined,
      problemStatement: data.problemStatement?.trim() || undefined,
      solutionApproach: data.solutionApproach?.trim() || undefined,
    };
    
    submitIdeaMutation.mutate(normalizedData);
  };

  if (ideasLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <div className="hidden lg:block">
          <SidebarNavigation />
        </div>
        <MobileNavigation />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="hidden lg:block">
        <SidebarNavigation />
      </div>
      <MobileNavigation />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" data-testid="button-back-dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-page-title">
                  {currentIdea ? "Edit Your Startup Idea" : "Create Your Startup Idea"}
                </h1>
                <p className="text-gray-600 dark:text-gray-300" data-testid="text-page-description">
                  {currentIdea ? "Update your startup details and get AI-powered improvements" : "Share your startup concept for AI validation"}
                </p>
              </div>
            </div>
            {currentIdea && (
              <Badge variant="secondary" className="text-sm">
                <Edit className="w-3 h-3 mr-1" />
                Editing Mode
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Idea Concept Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                      Idea Concept
                    </CardTitle>
                    <CardDescription>
                      Core information about your startup idea
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="ideaTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Startup Idea Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., AI-powered personal finance assistant" 
                              {...field} 
                              data-testid="input-idea-title"
                            />
                          </FormControl>
                          <FormDescription>
                            A concise, descriptive title for your startup concept
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detailed Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={6}
                              placeholder="Describe your startup idea in detail. Include what it does, who it's for, and how it works..." 
                              {...field} 
                              data-testid="textarea-description"
                            />
                          </FormControl>
                          <FormDescription>
                            Aim for 100-500 words. Include key features, benefits, and your vision
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Market Details Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="w-5 h-5 mr-2 text-purple-600" />
                      Market Details
                    </CardTitle>
                    <CardDescription>
                      Industry, target market, and business context
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-industry">
                                  <SelectValue placeholder="Select your industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {industries.map((industry) => (
                                  <SelectItem key={industry} value={industry}>
                                    {industry}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="stage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Stage</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-stage">
                                  <SelectValue placeholder="Select your current stage" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {stages.map((stage) => (
                                  <SelectItem key={stage} value={stage}>
                                    {stage}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="targetMarket"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Market</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-target-market">
                                <SelectValue placeholder="Select your target market type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {targetMarkets.map((market) => (
                                <SelectItem key={market} value={market}>
                                  {market}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            This helps us understand your business model and customer acquisition strategy
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Problem & Solution Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-blue-600" />
                      Problem & Solution
                    </CardTitle>
                    <CardDescription>
                      Define the problem you're solving and your unique approach
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="problemStatement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center justify-between">
                            <div className="flex items-center">
                              <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
                              Problem Statement
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleAISuggestion('problemStatement', 'What specific problem does this startup solve?')}
                              disabled={!watchedFields.ideaTitle || !watchedFields.description || aiSuggestionLoading === 'problemStatement'}
                              data-testid="ai-suggest-problem"
                            >
                              {aiSuggestionLoading === 'problemStatement' ? (
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              ) : (
                                <Sparkles className="w-3 h-3 mr-1" />
                              )}
                              {aiSuggestionLoading === 'problemStatement' ? 'Generating...' : 'AI Improve'}
                            </Button>
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={4}
                              placeholder="What specific problem does your startup solve? Who experiences this problem?" 
                              {...field}
                              value={field.value || ""}
                              data-testid="textarea-problem"
                            />
                          </FormControl>
                          <FormDescription>
                            Clearly define the pain point your startup addresses
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="solutionApproach"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center justify-between">
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                              Solution Approach
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleAISuggestion('solutionApproach', 'How does this startup solve the problem? What makes the approach unique?')}
                              disabled={!watchedFields.ideaTitle || !watchedFields.description || aiSuggestionLoading === 'solutionApproach'}
                              data-testid="ai-suggest-solution"
                            >
                              {aiSuggestionLoading === 'solutionApproach' ? (
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              ) : (
                                <Sparkles className="w-3 h-3 mr-1" />
                              )}
                              {aiSuggestionLoading === 'solutionApproach' ? 'Generating...' : 'AI Improve'}
                            </Button>
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={4}
                              placeholder="How does your startup solve this problem? What makes your approach unique?" 
                              {...field}
                              value={field.value || ""}
                              data-testid="textarea-solution"
                            />
                          </FormControl>
                          <FormDescription>
                            Explain your unique value proposition and approach
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Competitive & Business Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                      Competitive Advantage & Business Model
                    </CardTitle>
                    <CardDescription>
                      Optional: What makes you unique and how will you make money
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="competitiveAdvantage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Zap className="w-4 h-4 mr-2 text-yellow-600" />
                              Competitive Advantage
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleAISuggestion('competitiveAdvantage', 'What gives this startup an edge over competitors?')}
                              disabled={!watchedFields.ideaTitle || !watchedFields.description || aiSuggestionLoading === 'competitiveAdvantage'}
                              data-testid="ai-suggest-advantage"
                            >
                              {aiSuggestionLoading === 'competitiveAdvantage' ? (
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              ) : (
                                <Sparkles className="w-3 h-3 mr-1" />
                              )}
                              {aiSuggestionLoading === 'competitiveAdvantage' ? 'Generating...' : 'AI Improve'}
                            </Button>
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={3}
                              placeholder="What gives you an edge over competitors?" 
                              {...field}
                              value={field.value || ""}
                              data-testid="textarea-advantage"
                            />
                          </FormControl>
                          <FormDescription>Optional but recommended</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="revenueModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center justify-between">
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                              Revenue Model
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleAISuggestion('revenueModel', 'How will this startup make money?')}
                              disabled={!watchedFields.ideaTitle || !watchedFields.description || aiSuggestionLoading === 'revenueModel'}
                              data-testid="ai-suggest-revenue"
                            >
                              {aiSuggestionLoading === 'revenueModel' ? (
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              ) : (
                                <Sparkles className="w-3 h-3 mr-1" />
                              )}
                              {aiSuggestionLoading === 'revenueModel' ? 'Generating...' : 'AI Improve'}
                            </Button>
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={3}
                              placeholder="How will you make money?" 
                              {...field}
                              value={field.value || ""}
                              data-testid="textarea-revenue"
                            />
                          </FormControl>
                          <FormDescription>Optional but recommended</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="submit"
                    disabled={submitIdeaMutation.isPending || !form.formState.isValid}
                    size="lg"
                    data-testid="button-submit-idea"
                  >
                    {submitIdeaMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {currentIdea ? "Updating & Analyzing..." : "Creating & Analyzing..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {currentIdea ? "Update & Re-analyze" : "Create & Analyze"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
