import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  MapPin, 
  Palette, 
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Target,
  Users,
  Globe
} from "lucide-react";

interface OnboardingData {
  companyName: string;
  description: string;
  industry: string;
  stage: string;
  location: string;
  teamSize: string;
  logo?: File;
  theme: string;
}

interface ComprehensiveOnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export default function ComprehensiveOnboarding({ onComplete }: ComprehensiveOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    companyName: "",
    description: "",
    industry: "",
    stage: "",
    location: "",
    teamSize: "",
    theme: "modern"
  });

  const steps = [
    {
      title: "Company Foundation",
      description: "Tell us about your startup",
      icon: Building2,
      fields: ["companyName", "description"]
    },
    {
      title: "Industry & Market",
      description: "Define your market position",
      icon: Target,
      fields: ["industry", "stage"]
    },
    {
      title: "Team & Location",
      description: "Your startup's structure",
      icon: Users,
      fields: ["teamSize", "location"]
    },
    {
      title: "Branding & Theme",
      description: "Customize your presence",
      icon: Palette,
      fields: ["logo", "theme"]
    }
  ];

  const industries = [
    "Technology", "Healthcare", "FinTech", "E-commerce", "SaaS",
    "CleanTech", "EdTech", "FoodTech", "PropTech", "Gaming",
    "AI/ML", "Blockchain/Web3", "IoT", "Cybersecurity", "BioTech",
    "AgTech", "Mobility", "Enterprise Software", "Consumer Apps", "Hardware"
  ];

  const stages = [
    "Idea Stage", "MVP Development", "Pre-Seed", "Seed", "Series A",
    "Growth Stage", "Expansion", "Scaling"
  ];

  const teamSizes = [
    "Solo Founder", "2-3 Co-founders", "4-10 Team Members", 
    "11-25 Employees", "26-50 Employees", "50+ Employees"
  ];

  const themes = [
    { id: "modern", name: "Modern", color: "bg-gradient-to-r from-blue-500 to-purple-600" },
    { id: "corporate", name: "Corporate", color: "bg-gradient-to-r from-slate-600 to-slate-800" },
    { id: "vibrant", name: "Vibrant", color: "bg-gradient-to-r from-pink-500 to-orange-500" },
    { id: "minimal", name: "Minimal", color: "bg-gradient-to-r from-gray-400 to-gray-600" },
    { id: "tech", name: "Tech", color: "bg-gradient-to-r from-cyan-500 to-blue-600" },
    { id: "green", name: "Eco", color: "bg-gradient-to-r from-green-500 to-emerald-600" }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: keyof OnboardingData, value: string | File) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    const currentFields = steps[currentStep].fields;
    return currentFields.every(field => {
      if (field === "logo") return true; // Logo is optional
      return formData[field as keyof OnboardingData];
    });
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to MyStartup AI</h1>
          <p className="text-lg text-slate-600">Let's build your comprehensive startup profile</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-slate-500">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-200 text-slate-500'
              }`}>
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-2 ${
                  index < currentStep ? 'bg-blue-600' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <currentStepData.icon className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-slate-900">{currentStepData.title}</CardTitle>
            <p className="text-slate-600">{currentStepData.description}</p>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Step 1: Company Foundation */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="companyName" className="text-base font-medium">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter your startup name"
                    value={formData.companyName}
                    onChange={(e) => updateFormData("companyName", e.target.value)}
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-base font-medium">Company Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what your startup does in 2-3 sentences"
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    className="mt-2 min-h-[120px]"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Industry & Market */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Industry *</Label>
                  <Select value={formData.industry} onValueChange={(value) => updateFormData("industry", value)}>
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-base font-medium">Current Stage *</Label>
                  <Select value={formData.stage} onValueChange={(value) => updateFormData("stage", value)}>
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Select your current stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Team & Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Team Size *</Label>
                  <Select value={formData.teamSize} onValueChange={(value) => updateFormData("teamSize", value)}>
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Select your team size" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamSizes.map((size) => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location" className="text-base font-medium">Location *</Label>
                  <Input
                    id="location"
                    placeholder="City, Country (e.g., San Francisco, USA)"
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                    className="mt-2 h-12"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Branding & Theme */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div>
                  <Label className="text-base font-medium">Company Logo (Optional)</Label>
                  <div className="mt-2 border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 mb-2">Upload your logo</p>
                    <p className="text-sm text-slate-500">PNG, JPG up to 5MB</p>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateFormData("logo", file);
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-base font-medium">Brand Theme *</Label>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => updateFormData("theme", theme.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.theme === theme.id 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-full h-12 ${theme.color} rounded-lg mb-3`}></div>
                        <p className="font-medium text-slate-900">{theme.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex items-center space-x-2">
                {currentStep < steps.length - 1 ? (
                  <Badge variant="outline" className="text-slate-600">
                    {steps.length - currentStep - 1} steps remaining
                  </Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800">
                    Ready to launch!
                  </Badge>
                )}
              </div>
              
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {currentStep === steps.length - 1 ? "Complete Setup" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}