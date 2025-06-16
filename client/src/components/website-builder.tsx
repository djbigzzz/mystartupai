import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Globe, 
  Layout, 
  Palette, 
  Eye,
  Code,
  Download,
  Share,
  Smartphone,
  Monitor,
  Tablet,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ExternalLink
} from "lucide-react";

interface WebsiteBuilderProps {
  companyData: any;
  businessPlan?: any;
}

interface WebsiteSection {
  id: string;
  name: string;
  content: string;
  enabled: boolean;
}

export default function WebsiteBuilder({ companyData, businessPlan }: WebsiteBuilderProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [domain, setDomain] = useState("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sections, setSections] = useState<WebsiteSection[]>([
    {
      id: "hero",
      name: "Hero Section",
      content: `Transform your ${companyData.industry.toLowerCase()} business with ${companyData.companyName}`,
      enabled: true
    },
    {
      id: "about",
      name: "About Us",
      content: companyData.description || "Revolutionary solutions for modern businesses",
      enabled: true
    },
    {
      id: "features",
      name: "Features",
      content: "Cutting-edge technology • Industry expertise • Proven results",
      enabled: true
    },
    {
      id: "testimonials",
      name: "Testimonials", 
      content: "See what our customers are saying about their transformation",
      enabled: false
    },
    {
      id: "contact",
      name: "Contact",
      content: `Get started with ${companyData.companyName} today`,
      enabled: true
    }
  ]);

  const templates = [
    {
      id: "modern",
      name: "Modern Tech",
      description: "Clean, minimalist design perfect for SaaS and tech companies",
      preview: "bg-gradient-to-br from-blue-50 to-indigo-100",
      industries: ["Technology", "SaaS", "AI/ML"]
    },
    {
      id: "corporate",
      name: "Professional",
      description: "Traditional corporate layout ideal for enterprise solutions",
      preview: "bg-gradient-to-br from-slate-100 to-gray-200",
      industries: ["Enterprise Software", "Consulting", "Finance"]
    },
    {
      id: "startup",
      name: "Startup Vibes",
      description: "Dynamic and energetic design for growing startups",
      preview: "bg-gradient-to-br from-purple-50 to-pink-100",
      industries: ["E-commerce", "Consumer Apps", "Marketplace"]
    },
    {
      id: "healthcare",
      name: "Healthcare Focus", 
      description: "Trust-building design for healthcare and medical companies",
      preview: "bg-gradient-to-br from-green-50 to-emerald-100",
      industries: ["Healthcare", "BioTech", "Medical Devices"]
    },
    {
      id: "fintech",
      name: "FinTech Secure",
      description: "Security-focused design for financial technology",
      preview: "bg-gradient-to-br from-emerald-50 to-teal-100",
      industries: ["FinTech", "Banking", "Insurance"]
    },
    {
      id: "creative",
      name: "Creative Agency",
      description: "Bold and artistic design for creative industries",
      preview: "bg-gradient-to-br from-orange-50 to-red-100",
      industries: ["Design", "Marketing", "Entertainment"]
    }
  ];

  useEffect(() => {
    const suggestedDomain = companyData.companyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20);
    setDomain(`${suggestedDomain}.com`);
  }, [companyData.companyName]);

  useEffect(() => {
    // Auto-populate content from business plan if available
    if (businessPlan) {
      setSections(prev => prev.map(section => {
        switch (section.id) {
          case "about":
            return { ...section, content: businessPlan.executiveSummary?.substring(0, 200) + "..." || section.content };
          case "features":
            return { ...section, content: businessPlan.solutionDescription || section.content };
          default:
            return section;
        }
      }));
    }
  }, [businessPlan]);

  const handleGenerateWebsite = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const toggleSection = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, enabled: !section.enabled }
        : section
    ));
  };

  const updateSectionContent = (sectionId: string, content: string) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, content }
        : section
    ));
  };

  const getPreviewDimensions = () => {
    switch (previewMode) {
      case "mobile": return "w-80 h-96";
      case "tablet": return "w-96 h-72";
      default: return "w-full h-96";
    }
  };

  const recommendedTemplate = templates.find(t => 
    t.industries.includes(companyData.industry)
  ) || templates[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Website Builder for {companyData.companyName}
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              1-click website generation powered by your business plan data
            </p>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800">
                <Sparkles className="w-3 h-3 mr-1" />
                Auto-populated content
              </Badge>
              <Badge variant="outline">Mobile responsive</Badge>
              <Badge variant="outline">SEO optimized</Badge>
            </div>
          </div>
          <div className="text-center">
            <Globe className="w-16 h-16 text-green-600 mx-auto mb-2" />
            <p className="text-slate-600 font-medium">Ready in minutes</p>
          </div>
        </div>
      </div>

      {/* Domain Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Domain & Hosting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="domain">Domain Name</Label>
              <Input
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="yourcompany.com"
                className="mt-2"
              />
              <p className="text-sm text-slate-500 mt-1">
                Free .mystartup.ai subdomain included
              </p>
            </div>
            <div>
              <Label>Hosting Plan</Label>
              <Select defaultValue="startup">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free Plan - mystartup.ai subdomain</SelectItem>
                  <SelectItem value="startup">Startup Plan - Custom domain + SSL</SelectItem>
                  <SelectItem value="business">Business Plan - Advanced features</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Layout className="w-5 h-5 mr-2" />
            Template Selection
          </CardTitle>
          <p className="text-slate-600">
            AI recommends: <strong>{recommendedTemplate.name}</strong> for {companyData.industry} companies
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-full h-24 ${template.preview} rounded-lg mb-3 flex items-center justify-center`}>
                  {template.id === recommendedTemplate.id && (
                    <Badge className="bg-green-100 text-green-800">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Recommended
                    </Badge>
                  )}
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">{template.name}</h4>
                <p className="text-sm text-slate-600 mb-2">{template.description}</p>
                <div className="flex flex-wrap gap-1">
                  {template.industries.slice(0, 2).map((industry) => (
                    <Badge key={industry} variant="outline" className="text-xs">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Sections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Website Sections
          </CardTitle>
          <p className="text-slate-600">Content auto-populated from your business plan</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    onChange={() => toggleSection(section.id)}
                    className="rounded"
                  />
                  <h4 className="font-medium text-slate-900">{section.name}</h4>
                </div>
                {section.enabled && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Enabled
                  </Badge>
                )}
              </div>
              
              {section.enabled && (
                <Textarea
                  value={section.content}
                  onChange={(e) => updateSectionContent(section.id, e.target.value)}
                  placeholder={`Enter content for ${section.name.toLowerCase()}`}
                  className="mt-2"
                  rows={3}
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Live Preview
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={previewMode === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewMode("desktop")}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === "tablet" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewMode("tablet")}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === "mobile" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewMode("mobile")}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className={`${getPreviewDimensions()} border border-slate-300 rounded-lg overflow-hidden bg-white shadow-lg`}>
              {/* Mock website preview */}
              <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg mx-auto mb-3"></div>
                  <h1 className="text-lg font-bold text-slate-900 mb-2">
                    {companyData.companyName}
                  </h1>
                  <p className="text-sm text-slate-600 mb-4">
                    {sections.find(s => s.id === "hero")?.content.substring(0, 60)}...
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-8 bg-blue-200 rounded"></div>
                    <div className="h-8 bg-blue-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Actions */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Ready to Launch Your Website?
              </h3>
              <p className="text-lg text-slate-600">
                Generate your complete website in under 60 seconds
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Content Ready</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Template Selected</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Domain Configured</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleGenerateWebsite}
                disabled={isGenerating}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Generating Website...
                  </>
                ) : (
                  <>
                    <Globe className="w-5 h-5 mr-2" />
                    Generate Website
                  </>
                )}
              </Button>
              
              <Button variant="outline" size="lg">
                <Eye className="w-5 h-5 mr-2" />
                Preview First
              </Button>
            </div>

            {isGenerating && (
              <div className="bg-white p-4 rounded-lg border border-blue-200 max-w-md mx-auto">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-slate-700">Generating optimized HTML, CSS, and assets...</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Code className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h4 className="font-semibold text-slate-900 mb-2">Export Code</h4>
            <p className="text-sm text-slate-600 mb-4">
              Download clean HTML/CSS code for hosting anywhere
            </p>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Share className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-slate-900 mb-2">Share Preview</h4>
            <p className="text-sm text-slate-600 mb-4">
              Get feedback from team and stakeholders
            </p>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Share Link
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h4 className="font-semibold text-slate-900 mb-2">AI Optimization</h4>
            <p className="text-sm text-slate-600 mb-4">
              Continuous SEO and performance improvements
            </p>
            <Button variant="outline" size="sm">
              <ArrowRight className="w-4 h-4 mr-2" />
              Learn More
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}