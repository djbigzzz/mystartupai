import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Brain, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DemoPersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPersonalize: (sessionData: DemoSessionData) => void;
  isLoading?: boolean;
}

export interface DemoSessionData {
  sessionId: string;
  ideaTitle: string;
  description: string;
  industry: string;
  targetMarket?: string;
  problemStatement?: string;
  solutionApproach?: string;
  revenueModel?: string;
  competitiveAdvantage?: string;
}

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Food & Beverage",
  "Entertainment",
  "Real Estate",
  "Transportation",
  "Energy",
  "Other"
];

export function DemoPersonalizationModal({ 
  isOpen, 
  onClose, 
  onPersonalize, 
  isLoading = false 
}: DemoPersonalizationModalProps) {
  const [formData, setFormData] = useState({
    ideaTitle: "",
    description: "",
    industry: "",
    targetMarket: "",
    problemStatement: "",
    solutionApproach: "",
    revenueModel: "",
    competitiveAdvantage: ""
  });
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ideaTitle.trim() || !formData.description.trim() || !formData.industry) {
      toast({
        title: "Missing Information",
        description: "Please fill in your idea title, description, and industry.",
        variant: "destructive"
      });
      return;
    }

    const sessionData: DemoSessionData = {
      sessionId: crypto.randomUUID(),
      ideaTitle: formData.ideaTitle.trim(),
      description: formData.description.trim(),
      industry: formData.industry,
      targetMarket: formData.targetMarket.trim() || undefined,
      problemStatement: formData.problemStatement.trim() || undefined,
      solutionApproach: formData.solutionApproach.trim() || undefined,
      revenueModel: formData.revenueModel.trim() || undefined,
      competitiveAdvantage: formData.competitiveAdvantage.trim() || undefined
    };

    onPersonalize(sessionData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Personalize Your Demo Experience
          </DialogTitle>
          <DialogDescription className="text-base">
            Tell us about your startup idea to create personalized demos with your actual business concept
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Essential Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Brain className="h-4 w-4" />
              Essential Information
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ideaTitle">Startup Idea Title *</Label>
              <Input
                id="ideaTitle"
                data-testid="input-idea-title"
                placeholder="e.g., EcoTech Solutions, FoodieConnect, SmartHome AI"
                value={formData.ideaTitle}
                onChange={(e) => handleInputChange("ideaTitle", e.target.value)}
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Brief Description *</Label>
              <Textarea
                id="description"
                data-testid="textarea-description"
                placeholder="Describe your startup idea in 2-3 sentences. What does it do and who is it for?"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                className="text-base resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                <SelectTrigger data-testid="select-industry">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Target className="h-4 w-4" />
              Additional Details (Optional)
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetMarket">Target Market</Label>
                <Input
                  id="targetMarket"
                  data-testid="input-target-market"
                  placeholder="e.g., Small businesses, College students"
                  value={formData.targetMarket}
                  onChange={(e) => handleInputChange("targetMarket", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="revenueModel">Revenue Model</Label>
                <Input
                  id="revenueModel"
                  data-testid="input-revenue-model"
                  placeholder="e.g., Subscription, Commission, Advertising"
                  value={formData.revenueModel}
                  onChange={(e) => handleInputChange("revenueModel", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="problemStatement">Problem You're Solving</Label>
              <Textarea
                id="problemStatement"
                data-testid="textarea-problem-statement"
                placeholder="What specific problem does your startup address?"
                value={formData.problemStatement}
                onChange={(e) => handleInputChange("problemStatement", e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solutionApproach">Your Solution Approach</Label>
              <Textarea
                id="solutionApproach"
                data-testid="textarea-solution-approach"
                placeholder="How does your startup solve this problem?"
                value={formData.solutionApproach}
                onChange={(e) => handleInputChange("solutionApproach", e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="competitiveAdvantage">Competitive Advantage</Label>
              <Textarea
                id="competitiveAdvantage"
                data-testid="textarea-competitive-advantage"
                placeholder="What makes your solution unique or better?"
                value={formData.competitiveAdvantage}
                onChange={(e) => handleInputChange("competitiveAdvantage", e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
          </div>
        </form>

        <DialogFooter className="gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            data-testid="button-personalize"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Session...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Personalize My Demos
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}