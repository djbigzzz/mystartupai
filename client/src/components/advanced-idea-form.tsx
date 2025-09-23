import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertStartupIdeaSchema } from "@shared/schema";
import type { InsertStartupIdea } from "@shared/schema";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  User, 
  Mail, 
  Lightbulb, 
  Edit, 
  Building, 
  TrendingUp, 
  Target, 
  DollarSign,
  Users,
  Zap,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface ValidationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: any;
}

export default function AdvancedIdeaForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  // Start from step 0 for both authenticated and non-authenticated users
  const [currentStep, setCurrentStep] = useState(0);
  // Create validation steps based on authentication status
  const createValidationSteps = () => {
    const baseSteps = [
      {
        id: "idea-concept",
        title: "Idea Concept",
        description: "Core startup idea and description",
        completed: false,
        icon: Lightbulb
      },
      {
        id: "market-details",
        title: "Market Details",
        description: "Industry, target market, and stage",
        completed: false,
        icon: Target
      },
      {
        id: "problem-solution",
        title: "Problem & Solution",
        description: "Problem statement and solution approach",
        completed: false,
        icon: Brain
      }
    ];
    
    // Only add basic info step for non-authenticated users
    if (!isAuthenticated) {
      return [
        {
          id: "basic-info",
          title: "Basic Information",
          description: "Personal and contact details",
          completed: false,
          icon: User
        },
        ...baseSteps
      ];
    }
    
    return baseSteps;
  };
  
  const [validationSteps, setValidationSteps] = useState<ValidationStep[]>(createValidationSteps());

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

  const watchedFields = form.watch();
  
  // Update form values and validation steps when authentication changes
  useEffect(() => {
    if (isAuthenticated && user) {
      // Auto-populate user data for authenticated users
      form.setValue('name', user.name || '');
      form.setValue('email', user.email || '');
      
      // Update validation steps to remove basic info step
      setValidationSteps(createValidationSteps());
      
      // Keep currentStep at 0 since authenticated users start from the first valid step
    } else {
      // Update validation steps to include basic info step for non-authenticated
      setValidationSteps(createValidationSteps());
    }
  }, [isAuthenticated, user, form, currentStep]);

  // Calculate completion progress based on authentication status
  const calculateProgress = () => {
    const requiredFields = isAuthenticated 
      ? ['ideaTitle', 'description', 'industry', 'stage'] // Skip name/email for authenticated users
      : ['name', 'email', 'ideaTitle', 'description', 'industry', 'stage'];
    const completedFields = requiredFields.filter(field => watchedFields[field as keyof typeof watchedFields]?.toString()?.trim());
    return (completedFields.length / requiredFields.length) * 100;
  };

  const submitIdeaMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit idea");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Idea updated successfully!",
        description: "Your startup idea has been updated. Redirecting to analysis...",
      });
      
      localStorage.setItem("currentIdeaId", data.id.toString());
      localStorage.setItem("userEmail", data.email);
      
      // Redirect immediately after toast
      setLocation(`/intelligent-analysis?ideaId=${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error submitting idea",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    submitIdeaMutation.mutate(data);
  };

  const maxSteps = validationSteps.length - 1; // Derive from validation steps length
  
  const nextStep = () => {
    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number) => {
    if (step < 0 || step >= validationSteps.length) return false;
    
    const stepId = validationSteps[step].id;
    switch (stepId) {
      case "basic-info":
        return watchedFields.name && watchedFields.email;
      case "idea-concept":
        return watchedFields.ideaTitle && watchedFields.description;
      case "market-details":
        return watchedFields.industry && watchedFields.stage && watchedFields.targetMarket;
      case "problem-solution":
        // Only require core fields, competitive advantage and revenue model are optional
        return watchedFields.problemStatement && watchedFields.solutionApproach;
      default:
        return false;
    }
  };

  // Check if all required fields are valid for final submission
  const isFormCompleteForSubmission = () => {
    const requiredFields = isAuthenticated 
      ? ['ideaTitle', 'description', 'industry', 'stage', 'targetMarket', 'problemStatement', 'solutionApproach']
      : ['name', 'email', 'ideaTitle', 'description', 'industry', 'stage', 'targetMarket', 'problemStatement', 'solutionApproach'];
    
    return requiredFields.every(field => {
      const value = watchedFields[field as keyof typeof watchedFields];
      return value && value.toString().trim().length > 0;
    });
  };

  const renderStepContent = () => {
    if (currentStep < 0 || currentStep >= validationSteps.length) return null;
    
    const stepId = validationSteps[currentStep].id;
    switch (stepId) {
      case "basic-info":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Let's start with your details</h3>
              <p className="text-gray-600">We'll use this information to personalize your startup journey</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <User className="w-4 h-4 mr-2 text-blue-600" />
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your full name" 
                        {...field} 
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <Mail className="w-4 h-4 mr-2 text-blue-600" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="your@email.com" 
                        {...field} 
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormDescription>
                      We'll send your analysis results and updates to this email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case "idea-concept":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tell us about your startup idea</h3>
              <p className="text-gray-600">The more detail you provide, the better our AI analysis will be</p>
            </div>
            
            <FormField
              control={form.control}
              name="ideaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                    <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
                    Startup Idea Title
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., AI-powered personal finance assistant" 
                      {...field} 
                      className="border-gray-300 focus:border-blue-500"
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
                  <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                    <Edit className="w-4 h-4 mr-2 text-green-600" />
                    Detailed Description
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={6}
                      placeholder="Describe your startup idea in detail. Include what it does, who it's for, and how it works..." 
                      {...field} 
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormDescription>
                    Aim for 100-500 words. Include key features, benefits, and your vision
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case "market-details":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Market and business details</h3>
              <p className="text-gray-600">Help us understand your target market and business context</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <Building className="w-4 h-4 mr-2 text-purple-600" />
                      Industry
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-blue-500">
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
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <TrendingUp className="w-4 h-4 mr-2 text-orange-600" />
                      Current Stage
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-blue-500">
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
                  <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                    <Target className="w-4 h-4 mr-2 text-red-600" />
                    Target Market
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500">
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
          </div>
        );

      case "problem-solution":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Problem and solution analysis</h3>
              <p className="text-gray-600">Define the problem you're solving and your unique approach</p>
            </div>
            
            <FormField
              control={form.control}
              name="problemStatement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                    <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
                    Problem Statement
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={4}
                      placeholder="What specific problem does your startup solve? Who experiences this problem?" 
                      {...field} 
                      className="border-gray-300 focus:border-blue-500"
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
                  <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Solution Approach
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={4}
                      placeholder="How does your startup solve this problem? What makes your approach unique?" 
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      className="border-gray-300 focus:border-blue-500"
                      data-testid="solution-approach-textarea"
                    />
                  </FormControl>
                  <FormDescription>
                    Explain your unique value proposition and approach
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="competitiveAdvantage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <Zap className="w-4 h-4 mr-2 text-yellow-600" />
                      Competitive Advantage
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={3}
                        placeholder="What gives you an edge over competitors?" 
                        {...field} 
                        className="border-gray-300 focus:border-blue-500"
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
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                      Revenue Model
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={3}
                        placeholder="How will you make money?" 
                        {...field} 
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormDescription>Optional but recommended</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Progress Header */}
      <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Submit Your Startup Idea
            </CardTitle>
            <Badge variant="secondary" className="text-sm self-start sm:self-auto">
              Step {currentStep + 1} of {validationSteps.length}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(calculateProgress())}% complete</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
          
          {/* Step indicators */}
          <div className="flex items-center justify-between mt-6 overflow-x-auto pb-2">
            {validationSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = index === currentStep;
              const isCompleted = isStepValid(index);
              
              return (
                <div key={step.id} className="flex flex-col items-center text-center min-w-0 flex-shrink-0 px-1">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {isCompleted && !isActive ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 max-w-16 sm:max-w-20 leading-tight">
                    {step.title}
                  </div>
                </div>
              );
            })}
          </div>
        </CardHeader>
      </Card>

      {/* Form Content */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700 space-y-4 sm:space-y-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="w-full sm:w-auto px-6 order-2 sm:order-1"
                  data-testid="button-previous-step"
                >
                  Previous
                </Button>
                
                <div className="flex items-center space-x-2 sm:space-x-4 order-1 sm:order-2">
                  {currentStep < maxSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid(currentStep)}
                      className="flex-1 sm:flex-none px-6 bg-blue-600 hover:bg-blue-700 touch-manipulation"
                      data-testid="button-next-step"
                    >
                      <span className="sm:hidden">Next</span>
                      <span className="hidden sm:inline">Next Step</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={submitIdeaMutation.isPending || !isFormCompleteForSubmission()}
                      className="flex-1 sm:flex-none px-6 sm:px-8 bg-green-600 hover:bg-green-700 touch-manipulation"
                      data-testid="button-submit-idea"
                    >
                      {submitIdeaMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <span className="sm:hidden">Processing...</span>
                          <span className="hidden sm:inline">AI Analysis in Progress...</span>
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          <span className="sm:hidden">Analyze</span>
                          <span className="hidden sm:inline">Update & Re-analyze</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}