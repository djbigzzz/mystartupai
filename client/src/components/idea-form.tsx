import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertStartupIdeaSchema } from "@shared/schema";
import type { InsertStartupIdea } from "@shared/schema";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, User, Mail, Lightbulb, Edit, Building, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function IdeaForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const form = useForm<InsertStartupIdea>({
    resolver: zodResolver(insertStartupIdeaSchema),
    defaultValues: {
      name: isAuthenticated ? user?.name || "" : "",
      email: isAuthenticated ? user?.email || "" : "",
      ideaTitle: "",
      description: "",
      industry: "",
      stage: "",
    },
  });

  const submitIdeaMutation = useMutation({
    mutationFn: api.submitIdea,
    onSuccess: (data) => {
      toast({
        title: "Idea submitted successfully!",
        description: "Your startup idea has been analyzed. Redirecting to dashboard...",
      });
      
      // Store the idea ID and email in localStorage for dashboard access
      localStorage.setItem("currentIdeaId", data.id.toString());
      localStorage.setItem("userEmail", data.email);
      
      // Redirect to dashboard
      setTimeout(() => {
        setLocation("/dashboard");
      }, 1500);
    },
    onError: (error) => {
      toast({
        title: "Error submitting idea",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertStartupIdea) => {
    // For authenticated users, ensure we have the user data
    if (isAuthenticated && user) {
      data.name = user.name || data.name;
      data.email = user.email || data.email;
    }
    submitIdeaMutation.mutate(data);
  };
  
  // Update form values when authentication changes
  useEffect(() => {
    if (isAuthenticated && user) {
      form.setValue('name', user.name || '');
      form.setValue('email', user.email || '');
    }
  }, [isAuthenticated, user, form]);

  return (
    <Card className="bg-slate-50 border border-slate-200">
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Only show name/email fields for non-authenticated users */}
            {!isAuthenticated && (
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-semibold text-slate-700">
                        <User className="w-4 h-4 mr-2" />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          {...field} 
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
                      <FormLabel className="flex items-center text-sm font-semibold text-slate-700">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="your@email.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {/* Show a welcome message for authenticated users */}
            {isAuthenticated && user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <span className="font-medium">Welcome back, {user.name}!</span> We'll use your account details for this submission.
                </p>
              </div>
            )}
            
            <FormField
              control={form.control}
              name="ideaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-semibold text-slate-700">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Startup Idea Title
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., AI-powered personal finance assistant" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-semibold text-slate-700">
                    <Edit className="w-4 h-4 mr-2" />
                    Detailed Description
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={5}
                      placeholder="Describe your startup idea, target market, and how it solves a problem..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-semibold text-slate-700">
                      <Building className="w-4 h-4 mr-2" />
                      Industry
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FinTech">FinTech</SelectItem>
                        <SelectItem value="HealthTech">HealthTech</SelectItem>
                        <SelectItem value="EdTech">EdTech</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="SaaS">SaaS</SelectItem>
                        <SelectItem value="Web3/Crypto">Web3/Crypto</SelectItem>
                        <SelectItem value="AI/ML">AI/ML</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
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
                    <FormLabel className="flex items-center text-sm font-semibold text-slate-700">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Development Stage
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Idea Stage">Idea Stage</SelectItem>
                        <SelectItem value="MVP Development">MVP Development</SelectItem>
                        <SelectItem value="Beta Testing">Beta Testing</SelectItem>
                        <SelectItem value="Early Revenue">Early Revenue</SelectItem>
                        <SelectItem value="Scaling">Scaling</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <label htmlFor="terms" className="text-sm text-slate-600">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </label>
            </div>
            
            <Button 
              type="submit" 
              size="lg"
              className="w-full"
              disabled={submitIdeaMutation.isPending}
            >
              {submitIdeaMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Analyzing Your Idea...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Analyze My Idea with AI
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
