import { useState } from "react";
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
  Sparkles
} from "lucide-react";
import { Link } from "wouter";

interface StartupProfile {
  id?: number;
  userId: number;
  companyName: string;
  description: string;
  industry: string;
  stage: string;
  location: string;
  teamSize: string;
  fundingGoal: string;
  targetMarket: string;
  problemStatement: string;
  solutionApproach: string;
  competitiveAdvantage: string;
  revenueModel: string;
  completionPercentage: number;
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
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<StartupProfile>>({});

  // Fetch startup profile
  const { data: profile, isLoading } = useQuery<StartupProfile>({
    queryKey: ["/api/startup-profile"],
    retry: false,
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
      toast({
        title: "Save failed",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    }
  });

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(profile || {});
  };

  const handleSave = () => {
    saveProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const calculateProgress = (data: Partial<StartupProfile>) => {
    const fields = [
      'companyName', 'description', 'industry', 'stage', 'location', 
      'teamSize', 'targetMarket', 'problemStatement', 'solutionApproach',
      'competitiveAdvantage', 'revenueModel'
    ];
    const completed = fields.filter(field => data[field as keyof StartupProfile]).length;
    return Math.round((completed / fields.length) * 100);
  };

  const currentData = isEditing ? formData : profile;
  const progress = calculateProgress(currentData || {});

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading startup profile...</div>
        </div>
      </div>
    );
  }

  return (
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
              <h1 className="text-2xl font-bold">MyStartup Profile</h1>
              <p className="text-muted-foreground">Complete your startup information to unlock other modules</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              {progress}% Complete
            </Badge>
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Profile Completion</CardTitle>
                <CardDescription>Complete all sections to unlock advanced features</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{progress}%</p>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {progress === 100 ? "🎉 Profile complete! All modules are now unlocked." : 
               `${Math.ceil((100 - progress) / 9)} more fields to complete`}
            </p>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="business">Business Details</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>Basic details about your startup</CardDescription>
                  </div>
                  {!isEditing && (
                    <Button onClick={handleEdit} variant="outline">
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    {isEditing ? (
                      <Input
                        id="companyName"
                        value={formData.companyName || ""}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        placeholder="Enter your company name"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span>{currentData?.companyName || "Not provided"}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    {isEditing ? (
                      <Select value={formData.industry || ""} onValueChange={(value) => setFormData({...formData, industry: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map(industry => (
                            <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <span>{currentData?.industry || "Not provided"}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  {isEditing ? (
                    <Textarea
                      id="description"
                      value={formData.description || ""}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe your startup in a few sentences"
                      rows={3}
                    />
                  ) : (
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-muted-foreground mt-1" />
                      <span>{currentData?.description || "Not provided"}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stage">Stage *</Label>
                    {isEditing ? (
                      <Select value={formData.stage || ""} onValueChange={(value) => setFormData({...formData, stage: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {stages.map(stage => (
                            <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span>{currentData?.stage || "Not provided"}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={formData.location || ""}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="City, Country"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{currentData?.location || "Not provided"}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamSize">Team Size *</Label>
                    {isEditing ? (
                      <Select value={formData.teamSize || ""} onValueChange={(value) => setFormData({...formData, teamSize: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team size" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamSizes.map(size => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{currentData?.teamSize || "Not provided"}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} disabled={saveProfileMutation.isPending}>
                      <Save className="w-4 h-4 mr-2" />
                      {saveProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
                <CardDescription>Market focus and business model information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="targetMarket">Target Market *</Label>
                  {isEditing ? (
                    <Textarea
                      id="targetMarket"
                      value={formData.targetMarket || ""}
                      onChange={(e) => setFormData({...formData, targetMarket: e.target.value})}
                      placeholder="Who are your target customers?"
                      rows={2}
                    />
                  ) : (
                    <p className="text-sm">{currentData?.targetMarket || "Not provided"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problemStatement">Problem Statement *</Label>
                  {isEditing ? (
                    <Textarea
                      id="problemStatement"
                      value={formData.problemStatement || ""}
                      onChange={(e) => setFormData({...formData, problemStatement: e.target.value})}
                      placeholder="What problem are you solving?"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm">{currentData?.problemStatement || "Not provided"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="solutionApproach">Solution Approach *</Label>
                  {isEditing ? (
                    <Textarea
                      id="solutionApproach"
                      value={formData.solutionApproach || ""}
                      onChange={(e) => setFormData({...formData, solutionApproach: e.target.value})}
                      placeholder="How do you solve this problem?"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm">{currentData?.solutionApproach || "Not provided"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revenueModel">Revenue Model *</Label>
                  {isEditing ? (
                    <Select value={formData.revenueModel || ""} onValueChange={(value) => setFormData({...formData, revenueModel: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select revenue model" />
                      </SelectTrigger>
                      <SelectContent>
                        {revenueModels.map(model => (
                          <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>{currentData?.revenueModel || "Not provided"}</span>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} disabled={saveProfileMutation.isPending}>
                      <Save className="w-4 h-4 mr-2" />
                      {saveProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategy">
            <Card>
              <CardHeader>
                <CardTitle>Strategic Information</CardTitle>
                <CardDescription>Competitive advantage and market positioning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="competitiveAdvantage">Competitive Advantage *</Label>
                  {isEditing ? (
                    <Textarea
                      id="competitiveAdvantage"
                      value={formData.competitiveAdvantage || ""}
                      onChange={(e) => setFormData({...formData, competitiveAdvantage: e.target.value})}
                      placeholder="What makes you different from competitors?"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm">{currentData?.competitiveAdvantage || "Not provided"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fundingGoal">Funding Goal</Label>
                  {isEditing ? (
                    <Input
                      id="fundingGoal"
                      value={formData.fundingGoal || ""}
                      onChange={(e) => setFormData({...formData, fundingGoal: e.target.value})}
                      placeholder="e.g., $500K, $2M, etc."
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>{currentData?.fundingGoal || "Not provided"}</span>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} disabled={saveProfileMutation.isPending}>
                      <Save className="w-4 h-4 mr-2" />
                      {saveProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>Complete your profile to unlock these features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                {progress >= 100 ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                <div>
                  <p className="font-medium">Business Strategy Module</p>
                  <p className="text-sm text-muted-foreground">Define your business model and strategy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {progress >= 100 ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                <div>
                  <p className="font-medium">Market Research Tools</p>
                  <p className="text-sm text-muted-foreground">Analyze your market and competition</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {progress >= 100 ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                <div>
                  <p className="font-medium">Financial Planning</p>
                  <p className="text-sm text-muted-foreground">Create financial projections and models</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {progress >= 100 ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                <div>
                  <p className="font-medium">Pitch Deck Builder</p>
                  <p className="text-sm text-muted-foreground">Create investor-ready presentations</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}