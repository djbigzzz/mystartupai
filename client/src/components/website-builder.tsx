import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
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
  ExternalLink,
  Wand2,
  RefreshCw,
  Play,
  Settings,
  ImageIcon,
  Type,
  MousePointer,
  Move,
  Copy,
  Trash2,
  RotateCcw,
  Save,
  Link,
  Crown,
  Zap,
  Wand,
  Plus,
  GripVertical
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ReactBitsPicker, type ReactBitsComponent } from "@/components/react-bits-picker";

interface WebsiteBuilderProps {
  companyData: any;
  businessPlan?: any;
}

interface ReactBitsComponentData {
  id: string;
  name: string;
  category: string;
  props: Record<string, any>;
}

interface WebsiteSection {
  id: string;
  name: string;
  content: string;
  enabled: boolean;
  aiGenerated?: boolean;
  customStyles?: string;
  order: number;
  type: 'hero' | 'about' | 'features' | 'testimonials' | 'pricing' | 'contact' | 'custom';
  reactBitsComponent?: ReactBitsComponentData;
}

interface BrandTheme {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  fontFamily: string;
  logoUrl?: string;
}

interface PublishSettings {
  domain: string;
  isPublished: boolean;
  publishUrl?: string;
  seoTitle: string;
  seoDescription: string;
  favicon?: string;
}

export default function WebsiteBuilder({ companyData, businessPlan }: WebsiteBuilderProps) {
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [domain, setDomain] = useState("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingStage, setPublishingStage] = useState<string>('');
  const [publishProgress, setPublishProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("design");
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);
  const [showReactBitsPicker, setShowReactBitsPicker] = useState(false);
  const [selectedSectionForComponent, setSelectedSectionForComponent] = useState<string | null>(null);
  
  // Enhanced state for AI features
  const [brandTheme, setBrandTheme] = useState<BrandTheme>({
    primary: "#3b82f6",
    secondary: "#1e40af",
    accent: "#10b981",
    text: "#1f2937",
    background: "#ffffff",
    fontFamily: "Inter, sans-serif"
  });
  
  const [publishSettings, setPublishSettings] = useState<PublishSettings>({
    domain: "",
    isPublished: false,
    seoTitle: `${companyData.companyName} - Professional Website`,
    seoDescription: companyData.description?.substring(0, 160) || "Transform your business with our innovative solutions"
  });

  const [sections, setSections] = useState<WebsiteSection[]>([
    {
      id: "hero",
      name: "Hero Section",
      content: `Transform your ${companyData.industry?.toLowerCase() || 'business'} with ${companyData.companyName}`,
      enabled: true,
      order: 1,
      type: 'hero'
    },
    {
      id: "about",
      name: "About Us",
      content: companyData.description || "Revolutionary solutions for modern businesses",
      enabled: true,
      order: 2,
      type: 'about'
    },
    {
      id: "features",
      name: "Features",
      content: "Cutting-edge technology • Industry expertise • Proven results",
      enabled: true,
      order: 3,
      type: 'features'
    },
    {
      id: "testimonials",
      name: "Testimonials", 
      content: "See what our customers are saying about their transformation",
      enabled: false,
      order: 4,
      type: 'testimonials'
    },
    {
      id: "pricing",
      name: "Pricing",
      content: "Choose the perfect plan for your needs",
      enabled: false,
      order: 5,
      type: 'pricing'
    },
    {
      id: "contact",
      name: "Contact",
      content: `Get started with ${companyData.companyName} today`,
      enabled: true,
      order: 6,
      type: 'contact'
    }
  ]);

  const templates = [
    {
      id: "modern",
      name: "Modern Tech",
      description: "Clean, minimalist design perfect for SaaS and tech companies",
      preview: "bg-gradient-to-br from-blue-50 to-indigo-100",
      industries: ["Technology", "SaaS", "AI/ML"],
      theme: {
        primary: "#3b82f6",
        secondary: "#1e40af",
        accent: "#10b981",
        text: "#1f2937",
        background: "#ffffff",
        fontFamily: "Inter, sans-serif"
      }
    },
    {
      id: "corporate",
      name: "Professional",
      description: "Traditional corporate layout ideal for enterprise solutions",
      preview: "bg-gradient-to-br from-slate-100 to-gray-200",
      industries: ["Enterprise Software", "Consulting", "Finance"],
      theme: {
        primary: "#1e293b",
        secondary: "#475569",
        accent: "#0ea5e9",
        text: "#0f172a",
        background: "#f8fafc",
        fontFamily: "Source Sans Pro, sans-serif"
      }
    },
    {
      id: "startup",
      name: "Startup Vibes",
      description: "Dynamic and energetic design for growing startups",
      preview: "bg-gradient-to-br from-purple-50 to-pink-100",
      industries: ["E-commerce", "Consumer Apps", "Marketplace"],
      theme: {
        primary: "#8b5cf6",
        secondary: "#7c3aed",
        accent: "#ec4899",
        text: "#1f2937",
        background: "#ffffff",
        fontFamily: "Poppins, sans-serif"
      }
    },
    {
      id: "healthcare",
      name: "Healthcare Focus", 
      description: "Trust-building design for healthcare and medical companies",
      preview: "bg-gradient-to-br from-green-50 to-emerald-100",
      industries: ["Healthcare", "BioTech", "Medical Devices"],
      theme: {
        primary: "#059669",
        secondary: "#047857",
        accent: "#3b82f6",
        text: "#1f2937",
        background: "#f9fafb",
        fontFamily: "Open Sans, sans-serif"
      }
    },
    {
      id: "fintech",
      name: "FinTech Secure",
      description: "Security-focused design for financial technology",
      preview: "bg-gradient-to-br from-emerald-50 to-teal-100",
      industries: ["FinTech", "Banking", "Insurance"],
      theme: {
        primary: "#0d9488",
        secondary: "#0f766e",
        accent: "#f59e0b",
        text: "#1f2937",
        background: "#ffffff",
        fontFamily: "Roboto, sans-serif"
      }
    },
    {
      id: "creative",
      name: "Creative Agency",
      description: "Bold and artistic design for creative industries",
      preview: "bg-gradient-to-br from-orange-50 to-red-100",
      industries: ["Design", "Marketing", "Entertainment"],
      theme: {
        primary: "#ea580c",
        secondary: "#dc2626",
        accent: "#8b5cf6",
        text: "#1f2937",
        background: "#fffbeb",
        fontFamily: "Montserrat, sans-serif"
      }
    }
  ];

  // Auto-extract theme based on industry and company data
  useEffect(() => {
    const industry = companyData.industry || 'Technology';
    const matchedTemplate = templates.find(t => 
      t.industries.some(ind => ind.toLowerCase().includes(industry.toLowerCase()))
    ) || templates[0];
    
    setSelectedTemplate(matchedTemplate.id);
    setBrandTheme(matchedTemplate.theme);
  }, [companyData.industry]);

  useEffect(() => {
    const suggestedDomain = companyData.companyName
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20) || 'mycompany';
    const fullDomain = `${suggestedDomain}.mystartup.ai`;
    setDomain(fullDomain);
    setPublishSettings(prev => ({ ...prev, domain: fullDomain }));
  }, [companyData.companyName]);

  // Enhanced content population from business plan
  useEffect(() => {
    if (businessPlan) {
      setSections(prev => prev.map(section => {
        switch (section.id) {
          case "hero":
            return { 
              ...section, 
              content: businessPlan.executiveSummary 
                ? `${businessPlan.executiveSummary.split('.')[0]}. Transform your business with ${companyData.companyName}.`
                : section.content
            };
          case "about":
            return { 
              ...section, 
              content: businessPlan.executiveSummary?.substring(0, 300) + "..." || section.content,
              aiGenerated: !!businessPlan.executiveSummary
            };
          case "features":
            return { 
              ...section, 
              content: businessPlan.solutionDescription || section.content,
              aiGenerated: !!businessPlan.solutionDescription
            };
          case "pricing":
            return {
              ...section,
              content: businessPlan.businessModel || "Flexible pricing plans designed for your growth",
              enabled: !!businessPlan.businessModel
            };
          default:
            return section;
        }
      }));
    }
  }, [businessPlan, companyData.companyName]);

  // Live preview update effect
  useEffect(() => {
    updateLivePreview();
  }, [sections, brandTheme, selectedTemplate, previewMode]);

  // Real AI Copy Generation using backend API
  const generateAIContent = async (sectionId: string) => {
    setIsGenerating(true);
    try {
      const response = await apiRequest('/api/website/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: companyData.companyName || 'Your Company',
          description: companyData.description || 'Innovative business solutions',
          industry: companyData.industry || 'Technology',
          sections: [sectionId],
          businessPlan: businessPlan || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || 'Failed to generate content');
      }

      const websiteContent = await response.json();
      
      // Update the specific section with generated content
      const generatedSection = websiteContent.sections[sectionId];
      if (generatedSection) {
        setSections(prev => prev.map(section => 
          section.id === sectionId 
            ? { ...section, content: generatedSection.content, aiGenerated: true }
            : section
        ));
        
        toast({
          title: "AI Content Generated",
          description: "New content has been generated for this section."
        });
      } else {
        throw new Error('No content generated for this section');
      }
    } catch (error) {
      console.error('AI content generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
      
      toast({
        title: "Generation Failed",
        description: errorMessage.includes('rate limit') ? 'AI service is busy. Please try again in a moment.' : errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateWebsite = async () => {
    setIsGenerating(true);
    try {
      const enabledSectionIds = sections.filter(s => s.enabled).map(s => s.id);
      
      const response = await apiRequest('/api/website/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: companyData.companyName || 'Your Company',
          description: companyData.description || 'Innovative business solutions', 
          industry: companyData.industry || 'Technology',
          sections: enabledSectionIds,
          businessPlan: businessPlan || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || 'Failed to generate website content');
      }

      const websiteContent = await response.json();
      
      // Update all sections with generated content
      setSections(prev => prev.map(section => {
        const generatedSection = websiteContent.sections[section.id];
        if (generatedSection && section.enabled) {
          return { ...section, content: generatedSection.content, aiGenerated: true };
        }
        return section;
      }));
      
      toast({
        title: "Website Generated!",
        description: "Your professional website has been generated with AI-powered content."
      });
    } catch (error) {
      console.error('Website generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate website';
      
      toast({
        title: "Generation Failed",
        description: errorMessage.includes('rate limit') ? 'AI service is busy. Please try again in a moment.' : errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Domain validation utility
  const validateDomain = (domain: string): { valid: boolean; error?: string } => {
    if (!domain.trim()) {
      return { valid: false, error: 'Domain is required' };
    }
    
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.mystartup\.ai$/;
    if (!domainRegex.test(domain)) {
      return { valid: false, error: 'Domain must be in format: yourname.mystartup.ai' };
    }
    
    if (domain.length < 8 || domain.length > 50) {
      return { valid: false, error: 'Domain must be between 8-50 characters' };
    }
    
    const subdomain = domain.split('.')[0];
    if (subdomain.length < 3) {
      return { valid: false, error: 'Subdomain must be at least 3 characters' };
    }
    
    // Check for reserved words
    const reserved = ['admin', 'api', 'www', 'mail', 'blog', 'shop', 'dev', 'staging', 'test'];
    if (reserved.includes(subdomain.toLowerCase())) {
      return { valid: false, error: 'This subdomain is reserved. Please choose another.' };
    }
    
    return { valid: true };
  };

  const simulatePublishingStages = async () => {
    const stages = [
      { name: 'Validating domain...', duration: 800 },
      { name: 'Checking domain availability...', duration: 1200 },
      { name: 'Generating optimized assets...', duration: 1500 },
      { name: 'Uploading website files...', duration: 2000 },
      { name: 'Configuring SSL certificate...', duration: 1000 },
      { name: 'Setting up CDN...', duration: 800 },
      { name: 'Running final checks...', duration: 600 },
      { name: 'Going live...', duration: 400 }
    ];
    
    let totalProgress = 0;
    const progressStep = 100 / stages.length;
    
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      setPublishingStage(stage.name);
      setPublishProgress(totalProgress);
      
      await new Promise(resolve => setTimeout(resolve, stage.duration));
      totalProgress += progressStep;
      
      // Simulate random failures for realism (5% chance)
      if (Math.random() < 0.05 && i > 2) {
        throw new Error(`Failed during ${stage.name.toLowerCase().replace('...', '')}`);
      }
    }
    
    setPublishProgress(100);
    setPublishingStage('Published successfully!');
  };

  const handlePublishWebsite = async () => {
    // Validate domain first
    const domainValidation = validateDomain(publishSettings.domain);
    if (!domainValidation.valid) {
      toast({
        title: "Publishing Failed",
        description: domainValidation.error,
        variant: "destructive"
      });
      return;
    }
    
    // Validate that we have content to publish
    const enabledSections = sections.filter(s => s.enabled);
    if (enabledSections.length === 0) {
      toast({
        title: "Publishing Failed", 
        description: "Please enable at least one section before publishing.",
        variant: "destructive"
      });
      return;
    }
    
    setIsPublishing(true);
    setPublishProgress(0);
    setPublishingStage('');
    
    try {
      await simulatePublishingStages();
      
      // Simulate domain availability check (10% chance of taken domain)
      if (Math.random() < 0.1) {
        throw new Error('Domain is already taken. Please choose a different subdomain.');
      }
      
      const publishUrl = `https://${publishSettings.domain}`;
      setPublishSettings(prev => ({ 
        ...prev, 
        isPublished: true, 
        publishUrl 
      }));
      
      toast({
        title: "Website Published Successfully!",
        description: `Your website is now live at ${publishUrl}. It may take a few minutes to propagate globally.`
      });
    } catch (error) {
      console.error('Publishing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown publishing error';
      
      setPublishingStage('Publishing failed');
      setPublishProgress(0);
      
      toast({
        title: "Publishing Failed",
        description: errorMessage.includes('Domain') ? errorMessage : 'Failed to publish website. Please try again in a few moments.',
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setIsPublishing(false);
        setPublishingStage('');
        setPublishProgress(0);
      }, 2000);
    }
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
        ? { ...section, content, aiGenerated: false }
        : section
    ));
  };

  const duplicateSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      const newSection = {
        ...section,
        id: `${section.id}-copy-${Date.now()}`,
        name: `${section.name} (Copy)`,
        order: section.order + 0.5
      };
      setSections(prev => [...prev, newSection].sort((a, b) => a.order - b.order));
    }
  };

  const deleteSection = (sectionId: string) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(s => s.id === sectionId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < sections.length) {
      const newSections = [...sections];
      [newSections[currentIndex], newSections[newIndex]] = [newSections[newIndex], newSections[currentIndex]];
      
      // Update order numbers to maintain consistency
      newSections.forEach((section, index) => {
        section.order = index + 1;
      });
      
      setSections(newSections);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, sectionId: string) => {
    e.dataTransfer.setData('text/plain', sectionId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add visual feedback
    const target = e.currentTarget;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // Reset visual feedback
    e.currentTarget.style.opacity = '1';
    setDragOverSection(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, targetSectionId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSection(targetSectionId);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverSection(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetSectionId: string) => {
    e.preventDefault();
    const draggedSectionId = e.dataTransfer.getData('text/plain');
    
    if (draggedSectionId === targetSectionId) {
      setDragOverSection(null);
      return;
    }

    // Reorder sections
    const newSections = [...sections];
    const draggedIndex = newSections.findIndex(s => s.id === draggedSectionId);
    const targetIndex = newSections.findIndex(s => s.id === targetSectionId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Remove dragged section and insert at target position
      const [draggedSection] = newSections.splice(draggedIndex, 1);
      newSections.splice(targetIndex, 0, draggedSection);
      
      // Update order numbers
      newSections.forEach((section, index) => {
        section.order = index + 1;
      });
      
      setSections(newSections);
      
      toast({
        title: "Section Reordered",
        description: `${draggedSection.name} moved successfully.`
      });
    }
    
    setDragOverSection(null);
  };

  const updateBrandTheme = (updates: Partial<BrandTheme>) => {
    setBrandTheme(prev => ({ ...prev, ...updates }));
  };

  const addNewSection = () => {
    const newSection: WebsiteSection = {
      id: `custom-${Date.now()}`,
      name: "Custom Section",
      content: "Add your custom content here",
      enabled: true,
      order: Math.max(...sections.map(s => s.order)) + 1,
      type: 'custom'
    };
    setSections(prev => [...prev, newSection]);
  };

  const handleComponentSelect = (component: ReactBitsComponent) => {
    if (selectedSectionForComponent) {
      setSections(prev => prev.map(section => 
        section.id === selectedSectionForComponent
          ? { 
              ...section, 
              reactBitsComponent: {
                id: component.id,
                name: component.name,
                category: component.category,
                props: component.customProps || component.defaultProps
              }
            }
          : section
      ));
      toast({
        title: "Animation Added!",
        description: `${component.name} will be included in your website.`
      });
      setSelectedSectionForComponent(null);
    }
  };

  const openReactBitsPicker = (sectionId: string) => {
    setSelectedSectionForComponent(sectionId);
    setShowReactBitsPicker(true);
  };

  // Security utility function to escape HTML content
  const escapeHtml = (unsafe: string): string => {
    if (!unsafe || typeof unsafe !== 'string') return '';
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const generateHTML = () => {
    const enabledSections = sections.filter(s => s.enabled).sort((a, b) => a.order - b.order);
    
    // Sanitize all user inputs to prevent XSS
    const safeCompanyName = escapeHtml(companyData.companyName || '');
    const safeSeoTitle = escapeHtml(publishSettings.seoTitle || '');
    const safeSeoDescription = escapeHtml(publishSettings.seoDescription || '');
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeSeoTitle}</title>
  <meta name="description" content="${safeSeoDescription}">
  <meta property="og:title" content="${safeSeoTitle}">
  <meta property="og:description" content="${safeSeoDescription}">
  <meta property="og:type" content="website">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: ${brandTheme.fontFamily}; 
      color: ${brandTheme.text}; 
      background: ${brandTheme.background};
      line-height: 1.6;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .section { padding: 80px 0; }
    .hero { 
      background: linear-gradient(135deg, ${brandTheme.primary}, ${brandTheme.secondary}); 
      color: white; 
      text-align: center; 
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
    }
    .hero h1 { font-size: 3.5rem; margin-bottom: 1rem; font-weight: 700; }
    .hero p { font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9; }
    .btn { 
      background: ${brandTheme.accent}; 
      color: white; 
      padding: 15px 40px; 
      border: none; 
      border-radius: 8px; 
      font-weight: 600; 
      cursor: pointer; 
      font-size: 1.1rem;
      transition: all 0.3s ease;
    }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
    .about { background: #f8fafc; }
    .features { padding: 100px 0; }
    .features ul { list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
    .features li { 
      padding: 2rem; 
      background: white; 
      border-radius: 12px; 
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    .features li:hover { transform: translateY(-5px); }
    .contact { background: ${brandTheme.primary}; color: white; text-align: center; }
    h2 { font-size: 2.75rem; margin-bottom: 1.5rem; color: ${brandTheme.primary}; font-weight: 700; }
    .contact h2 { color: white; }
    .testimonials { background: ${brandTheme.background}; }
    .testimonial { 
      background: white; 
      padding: 2rem; 
      border-radius: 12px; 
      box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
      margin: 1rem 0;
    }
    .pricing { background: #f9fafb; }
    .pricing-card { 
      background: white; 
      padding: 3rem 2rem; 
      border-radius: 16px; 
      box-shadow: 0 4px 30px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 400px;
      margin: 0 auto;
    }
    @media (max-width: 768px) {
      .hero h1 { font-size: 2.5rem; }
      .container { padding: 0 15px; }
      .section { padding: 60px 0; }
    }
  </style>
</head>
<body>
  ${enabledSections.map(section => {
    // Sanitize section content to prevent XSS
    const safeSectionName = escapeHtml(section.name || '');
    const safeSectionContent = escapeHtml(section.content || '');
    
    switch (section.type) {
      case 'hero':
        return `
  <section class="hero">
    <div class="container">
      <div>
        <h1>${safeCompanyName}</h1>
        <p>${safeSectionContent}</p>
        <button class="btn">Get Started Today</button>
      </div>
    </div>
  </section>`;
      case 'about':
        return `
  <section class="about section">
    <div class="container">
      <h2>About ${safeCompanyName}</h2>
      <p style="font-size: 1.1rem; max-width: 800px; margin: 0 auto;">${safeSectionContent}</p>
    </div>
  </section>`;
      case 'features':
        return `
  <section class="features section">
    <div class="container">
      <h2 style="text-align: center; margin-bottom: 3rem;">Why Choose Us</h2>
      <ul>
        ${section.content.split('\n').filter(f => f.trim()).map(feature => {
          const cleanFeature = escapeHtml(feature.replace(/[🚀✨📈🔒⚡🎯•]/g, '').trim());
          return `<li><strong>${cleanFeature}</strong></li>`;
        }).join('')}
      </ul>
    </div>
  </section>`;
      case 'testimonials':
        return `
  <section class="testimonials section">
    <div class="container">
      <h2 style="text-align: center; margin-bottom: 3rem;">What Our Clients Say</h2>
      ${section.content.split('\n\n').map(testimonial => {
        const safeTestimonial = escapeHtml(testimonial.trim());
        return `<div class="testimonial">${safeTestimonial}</div>`;
      }).join('')}
    </div>
  </section>`;
      case 'pricing':
        return `
  <section class="pricing section">
    <div class="container">
      <h2 style="text-align: center; margin-bottom: 3rem;">Pricing Plans</h2>
      <div class="pricing-card">
        <h3 style="margin-bottom: 1rem;">Professional Plan</h3>
        <p>${safeSectionContent}</p>
        <button class="btn" style="margin-top: 2rem;">Choose Plan</button>
      </div>
    </div>
  </section>`;
      case 'contact':
        return `
  <section class="contact section">
    <div class="container">
      <h2>Ready to Get Started?</h2>
      <p style="font-size: 1.2rem; margin-bottom: 2rem;">${safeSectionContent}</p>
      <button class="btn">Contact Us Now</button>
    </div>
  </section>`;
      default:
        return `
  <section class="section">
    <div class="container">
      <h2>${safeSectionName}</h2>
      <p>${safeSectionContent}</p>
    </div>
  </section>`;
    }
  }).join('')}
</body>
</html>`;
  };

  const updateLivePreview = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(generateHTML());
        doc.close();
      }
    }
  };

  const getPreviewDimensions = () => {
    switch (previewMode) {
      case "mobile": return { width: "375px", height: "667px", scale: "0.7" };
      case "tablet": return { width: "768px", height: "1024px", scale: "0.5" };
      default: return { width: "100%", height: "600px", scale: "1" };
    }
  };

  const getPreviewClasses = () => {
    const dims = getPreviewDimensions();
    return {
      width: dims.width,
      height: dims.height,
      transform: `scale(${dims.scale})`,
      transformOrigin: 'top left'
    };
  };

  const recommendedTemplate = templates.find(t => 
    t.industries.some(industry => 
      industry.toLowerCase().includes(companyData.industry?.toLowerCase() || '')
    )
  ) || templates[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Crown className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">AI Website Builder</h1>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              {publishSettings.isPublished && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Published
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button 
                onClick={handlePublishWebsite}
                disabled={isPublishing}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="button-publish"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    Publish
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-120px)]">
          
          {/* Left Sidebar - Design Controls */}
          <div className="lg:col-span-1">
            <ScrollArea className="h-full">
              <div className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="design">Design</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="design" className="space-y-6 mt-6">
                    {/* Brand Theme */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-sm">
                          <Palette className="w-4 h-4 mr-2" />
                          Brand Theme
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-5 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Primary</Label>
                            <Input
                              type="color"
                              value={brandTheme.primary}
                              onChange={(e) => updateBrandTheme({ primary: e.target.value })}
                              className="h-8 p-1"
                              data-testid="input-color-primary"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Secondary</Label>
                            <Input
                              type="color"
                              value={brandTheme.secondary}
                              onChange={(e) => updateBrandTheme({ secondary: e.target.value })}
                              className="h-8 p-1"
                              data-testid="input-color-secondary"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Accent</Label>
                            <Input
                              type="color"
                              value={brandTheme.accent}
                              onChange={(e) => updateBrandTheme({ accent: e.target.value })}
                              className="h-8 p-1"
                              data-testid="input-color-accent"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Text</Label>
                            <Input
                              type="color"
                              value={brandTheme.text}
                              onChange={(e) => updateBrandTheme({ text: e.target.value })}
                              className="h-8 p-1"
                              data-testid="input-color-text"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Background</Label>
                            <Input
                              type="color"
                              value={brandTheme.background}
                              onChange={(e) => updateBrandTheme({ background: e.target.value })}
                              className="h-8 p-1"
                              data-testid="input-color-background"
                            />
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            const template = templates.find(t => t.id === selectedTemplate);
                            if (template) setBrandTheme(template.theme);
                          }}
                          data-testid="button-auto-extract-theme"
                        >
                          <Wand2 className="w-4 h-4 mr-2" />
                          Auto-extract from Industry
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Template Selection */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-sm">
                          <Layout className="w-4 h-4 mr-2" />
                          Templates
                        </CardTitle>
                        <p className="text-xs text-slate-600">
                          Recommended: <strong>{recommendedTemplate.name}</strong>
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                          {templates.map((template) => (
                            <button
                              key={template.id}
                              onClick={() => {
                                setSelectedTemplate(template.id);
                                setBrandTheme(template.theme);
                              }}
                              className={`p-3 rounded-lg border text-left transition-all ${
                                selectedTemplate === template.id
                                  ? 'border-blue-500 ring-1 ring-blue-200'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              data-testid={`button-template-${template.id}`}
                            >
                              <div className={`w-full h-12 ${template.preview} rounded mb-2 flex items-center justify-center`}>
                                {template.id === recommendedTemplate.id && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    <Crown className="w-2 h-2 mr-1" />
                                    AI Pick
                                  </Badge>
                                )}
                              </div>
                              <h4 className="font-medium text-slate-900 text-xs mb-1">{template.name}</h4>
                              <p className="text-xs text-slate-600">{template.description.substring(0, 40)}...</p>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="content" className="space-y-6 mt-6">
                    {/* Content Sections */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Type className="w-4 h-4 mr-2" />
                            Website Sections
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={addNewSection}
                            className="h-7 px-3"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        </CardTitle>
                        <p className="text-xs text-slate-600">AI-powered content generation</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {sections.sort((a, b) => a.order - b.order).map((section, index) => (
                          <div 
                            key={section.id} 
                            className={`border border-gray-200 rounded-lg p-3 transition-all duration-200 ${
                              dragOverSection === section.id ? 'border-blue-400 bg-blue-50' : ''
                            }`}
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, section.id)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e, section.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, section.id)}
                            data-testid={`section-card-${section.id}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <GripVertical className="w-3 h-3 text-gray-400 cursor-move" />
                                <Switch
                                  checked={section.enabled}
                                  onCheckedChange={() => toggleSection(section.id)}
                                  data-testid={`switch-section-${section.id}`}
                                />
                                <h4 className="font-medium text-slate-900 text-sm">{section.name}</h4>
                                {section.aiGenerated && (
                                  <Badge variant="outline" className="text-xs">
                                    <Sparkles className="w-2 h-2 mr-1" />
                                    AI
                                  </Badge>
                                )}
                                {section.reactBitsComponent && (
                                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                    <Zap className="w-2 h-2 mr-1" />
                                    {section.reactBitsComponent.name}
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openReactBitsPicker(section.id)}
                                  className="h-6 w-6 p-0 text-purple-500 hover:text-purple-700"
                                  data-testid={`button-add-component-${section.id}`}
                                  title="Add React Bits Component"
                                >
                                  <Sparkles className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => generateAIContent(section.id)}
                                  disabled={isGenerating}
                                  className="h-6 w-6 p-0"
                                  data-testid={`button-generate-ai-${section.id}`}
                                >
                                  <Wand2 className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => duplicateSection(section.id)}
                                  className="h-6 w-6 p-0"
                                  data-testid={`button-duplicate-${section.id}`}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteSection(section.id)}
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  data-testid={`button-delete-${section.id}`}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            
                            {section.enabled && (
                              <div className="space-y-2">
                                <Textarea
                                  value={section.content}
                                  onChange={(e) => updateSectionContent(section.id, e.target.value)}
                                  placeholder={`Enter content for ${section.name.toLowerCase()}`}
                                  className="text-xs"
                                  rows={2}
                                  data-testid={`textarea-content-${section.id}`}
                                />
                                <div className="flex justify-between items-center">
                                  <div className="flex space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => moveSection(section.id, 'up')}
                                      disabled={index === 0}
                                      className="h-6 px-2 text-xs"
                                    >
                                      ↑
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => moveSection(section.id, 'down')}
                                      disabled={index === sections.length - 1}
                                      className="h-6 px-2 text-xs"
                                    >
                                      ↓
                                    </Button>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {section.content.length} chars
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={handleGenerateWebsite}
                          disabled={isGenerating}
                          data-testid="button-generate-all"
                        >
                          {isGenerating ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Wand className="w-4 h-4 mr-2" />
                              Generate All with AI
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-6 mt-6">
                    {/* Domain & Publishing */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-sm">
                          <Globe className="w-4 h-4 mr-2" />
                          Publishing
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-xs">Domain</Label>
                          <Input
                            value={publishSettings.domain}
                            onChange={(e) => setPublishSettings(prev => ({ ...prev, domain: e.target.value }))}
                            placeholder="yourcompany.mystartup.ai"
                            className="mt-1 text-xs"
                            data-testid="input-domain"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-xs">SEO Title</Label>
                          <Input
                            value={publishSettings.seoTitle}
                            onChange={(e) => setPublishSettings(prev => ({ ...prev, seoTitle: e.target.value }))}
                            className="mt-1 text-xs"
                            data-testid="input-seo-title"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-xs">SEO Description</Label>
                          <Textarea
                            value={publishSettings.seoDescription}
                            onChange={(e) => setPublishSettings(prev => ({ ...prev, seoDescription: e.target.value }))}
                            className="mt-1 text-xs"
                            rows={2}
                            data-testid="textarea-seo-description"
                          />
                        </div>
                        
                        {/* Publishing Progress */}
                        {isPublishing && (
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                              <span className="text-xs font-medium text-blue-800">Publishing Website</span>
                            </div>
                            <div className="space-y-2">
                              <Progress value={publishProgress} className="w-full h-2" />
                              {publishingStage && (
                                <div className="text-xs text-blue-700 flex items-center space-x-1">
                                  <span>{publishingStage}</span>
                                  <span className="text-blue-500">({Math.round(publishProgress)}%)</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {publishSettings.isPublished && !isPublishing && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-xs font-medium text-green-800">Live Website</span>
                            </div>
                            <a 
                              href={publishSettings.publishUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-green-600 hover:text-green-800 flex items-center mt-1"
                              data-testid="link-published-url"
                            >
                              {publishSettings.publishUrl}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          </div>
          
          {/* Center - Live Preview */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span className="font-medium text-sm">Live Preview</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Real-time
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={previewMode === "desktop" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewMode("desktop")}
                      data-testid="button-preview-desktop"
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={previewMode === "tablet" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewMode("tablet")}
                      data-testid="button-preview-tablet"
                    >
                      <Tablet className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={previewMode === "mobile" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewMode("mobile")}
                      data-testid="button-preview-mobile"
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                    
                    <Separator orientation="vertical" className="h-6" />
                    
                    <Button variant="outline" size="sm" onClick={updateLivePreview}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Code className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="h-[calc(100%-80px)] p-4">
                <div className="w-full h-full flex justify-center items-start bg-gray-100 rounded-lg overflow-hidden">
                  <div className="bg-white shadow-xl rounded-lg overflow-hidden" style={getPreviewClasses()}>
                    <iframe
                      ref={iframeRef}
                      className="w-full h-full border-0"
                      style={{ 
                        width: getPreviewDimensions().width,
                        height: getPreviewDimensions().height
                      }}
                      title="Website Preview"
                      data-testid="iframe-preview"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Bottom Status Bar */}
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Template: {templates.find(t => t.id === selectedTemplate)?.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">{sections.filter(s => s.enabled).length} Sections Active</span>
              </div>
              <div className="flex items-center space-x-2">
                {publishSettings.isPublished ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Published</span>
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-orange-500" />
                    <span className="text-sm font-medium text-orange-600">Draft</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" data-testid="button-export-html">
                <Download className="w-4 h-4 mr-2" />
                Export HTML
              </Button>
              <Button variant="outline" size="sm" data-testid="button-share-preview">
                <Share className="w-4 h-4 mr-2" />
                Share Preview
              </Button>
              <Button
                onClick={handlePublishWebsite}
                disabled={isPublishing}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                size="sm"
                data-testid="button-publish"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : publishSettings.isPublished ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Republish
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    Publish Live
                  </>
                )}
              </Button>
              {publishSettings.isPublished && (
                <Button variant="outline" size="sm" asChild>
                  <a href={publishSettings.publishUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* React Bits Component Picker */}
      <ReactBitsPicker
        open={showReactBitsPicker}
        onClose={() => {
          setShowReactBitsPicker(false);
          setSelectedSectionForComponent(null);
        }}
        onSelect={handleComponentSelect}
      />
    </div>
  );
}