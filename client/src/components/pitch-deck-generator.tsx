import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Presentation, 
  Download, 
  Printer, 
  Share2, 
  Edit3, 
  Save, 
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Lightbulb,
  BarChart3,
  CheckCircle,
  Clock,
  Brain,
  Zap,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BrandTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  fontFamily: string;
  backgroundColor: string;
}

interface PitchSlide {
  id: string;
  title: string;
  content: string;
  speakerNotes: string;
  slideNumber: number;
  template: "title" | "content" | "problem" | "solution" | "market" | "business-model" | "traction" | "team" | "financial" | "funding" | "closing";
  backgroundImage?: string;
  layout: "title-content" | "full-content" | "split" | "chart" | "image-text" | "showcase";
  animation?: "slide" | "fade" | "zoom" | "none";
  duration?: number;
}

interface PitchDeckGeneratorProps {
  ideaId: number;
  ideaData: any;
  businessPlan?: any;
}

const slideTemplates = [
  { id: "title", name: "Title Slide", description: "Company introduction and tagline" },
  { id: "problem", name: "Problem", description: "Market problem and pain points" },
  { id: "solution", name: "Solution", description: "Your solution and value proposition" },
  { id: "market", name: "Market Opportunity", description: "Market size and opportunity" },
  { id: "product", name: "Product Demo", description: "Product features and demo" },
  { id: "business-model", name: "Business Model", description: "Revenue streams and pricing" },
  { id: "traction", name: "Traction", description: "Growth metrics and achievements" },
  { id: "competition", name: "Competition", description: "Competitive landscape" },
  { id: "team", name: "Team", description: "Founding team and advisors" },
  { id: "financial", name: "Financials", description: "Revenue projections and metrics" },
  { id: "funding", name: "Funding", description: "Investment ask and use of funds" },
  { id: "closing", name: "Closing", description: "Call to action and contact" }
];

export default function PitchDeckGenerator({ ideaId, ideaData, businessPlan }: PitchDeckGeneratorProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [presentationMode, setPresentationMode] = useState(false);
  const [editingSlide, setEditingSlide] = useState<string | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [showBrandingEditor, setShowBrandingEditor] = useState(false);
  
  // Brand theming state
  const [brandTheme, setBrandTheme] = useState<BrandTheme>({
    primaryColor: '#7C3AED', // Purple
    secondaryColor: '#3B82F6', // Blue  
    accentColor: '#10B981', // Green
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#F8FAFC'
  });

  // Auto-generate brand theme from startup data
  useEffect(() => {
    if (ideaData) {
      const industry = ideaData.industry?.toLowerCase() || '';
      const theme = generateBrandTheme(industry, ideaData.ideaTitle);
      setBrandTheme(theme);
    }
  }, [ideaData]);

  const [pitchDeck, setPitchDeck] = useState<PitchSlide[]>([
    {
      id: "title",
      title: "Company Name",
      content: "",
      speakerNotes: "",
      slideNumber: 1,
      template: "title",
      layout: "title-content"
    },
    {
      id: "problem",
      title: "Problem",
      content: "",
      speakerNotes: "",
      slideNumber: 2,
      template: "problem",
      layout: "full-content"
    },
    {
      id: "solution",
      title: "Solution",
      content: "",
      speakerNotes: "",
      slideNumber: 3,
      template: "solution",
      layout: "full-content"
    },
    {
      id: "market",
      title: "Market Opportunity",
      content: "",
      speakerNotes: "",
      slideNumber: 4,
      template: "market",
      layout: "chart"
    },
    {
      id: "business-model",
      title: "Business Model",
      content: "",
      speakerNotes: "",
      slideNumber: 5,
      template: "business-model",
      layout: "split"
    },
    {
      id: "traction",
      title: "Traction",
      content: "",
      speakerNotes: "",
      slideNumber: 6,
      template: "traction",
      layout: "chart"
    },
    {
      id: "team",
      title: "Team",
      content: "",
      speakerNotes: "",
      slideNumber: 7,
      template: "team",
      layout: "image-text"
    },
    {
      id: "financial",
      title: "Financial Projections",
      content: "",
      speakerNotes: "",
      slideNumber: 8,
      template: "financial",
      layout: "chart"
    },
    {
      id: "funding",
      title: "Funding Request",
      content: "",
      speakerNotes: "",
      slideNumber: 9,
      template: "funding",
      layout: "split"
    },
    {
      id: "closing",
      title: "Thank You",
      content: "",
      speakerNotes: "",
      slideNumber: 10,
      template: "closing",
      layout: "title-content"
    }
  ]);

  const generatePitchDeckMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/startup-ideas/${ideaId}/pitch-deck`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate pitch deck");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setPitchDeck(prev => prev.map(slide => ({
        ...slide,
        content: data[slide.id]?.content || `Generated content for ${slide.title}...`,
        speakerNotes: data[slide.id]?.notes || `Speaker notes for ${slide.title}...`
      })));
      
      toast({
        title: "Pitch deck generated successfully!",
        description: "Your investor presentation is ready for review.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerateDeck = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate progress for each slide
    for (let i = 0; i < pitchDeck.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setGenerationProgress(((i + 1) / pitchDeck.length) * 100);
    }
    
    generatePitchDeckMutation.mutate();
    setIsGenerating(false);
  };

  const handleSaveSlide = (slideId: string, content: string, speakerNotes: string) => {
    setPitchDeck(prev => prev.map(slide => 
      slide.id === slideId 
        ? { ...slide, content, speakerNotes }
        : slide
    ));
    setEditingSlide(null);
    
    toast({
      title: "Slide updated",
      description: "Your changes have been saved.",
    });
  };

  // Auto-generate brand theme based on industry
  const generateBrandTheme = (industry: string, companyName: string): BrandTheme => {
    const industryThemes: Record<string, BrandTheme> = {
      'fintech': {
        primaryColor: '#1E40AF',
        secondaryColor: '#3B82F6', 
        accentColor: '#10B981',
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#F1F5F9'
      },
      'healthcare': {
        primaryColor: '#059669',
        secondaryColor: '#10B981',
        accentColor: '#3B82F6', 
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#F0FDF4'
      },
      'saas': {
        primaryColor: '#7C3AED',
        secondaryColor: '#A855F7',
        accentColor: '#EC4899',
        fontFamily: 'Inter, sans-serif', 
        backgroundColor: '#FAF5FF'
      },
      'ecommerce': {
        primaryColor: '#DC2626',
        secondaryColor: '#EF4444',
        accentColor: '#F59E0B',
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#FEF2F2'
      }
    };
    
    return industryThemes[industry] || {
      primaryColor: '#6366F1',
      secondaryColor: '#8B5CF6', 
      accentColor: '#06B6D4',
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#F8FAFC'
    };
  };

  const nextSlide = () => {
    setCurrentSlideIndex(prev => Math.min(prev + 1, pitchDeck.length - 1));
  };

  const prevSlide = () => {
    setCurrentSlideIndex(prev => Math.max(prev - 1, 0));
  };

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && presentationMode) {
      const timer = setTimeout(() => {
        if (currentSlideIndex < pitchDeck.length - 1) {
          nextSlide();
        } else {
          setAutoPlay(false);
        }
      }, pitchDeck[currentSlideIndex]?.duration || 10000);
      
      return () => clearTimeout(timer);
    }
  }, [autoPlay, presentationMode, currentSlideIndex, pitchDeck]);

  // Text-to-speech narration
  const startNarration = () => {
    if (!window.speechSynthesis) {
      toast({
        title: "Narration not supported",
        description: "Your browser doesn't support speech synthesis.",
        variant: "destructive"
      });
      return;
    }

    const text = `${currentSlide.title}. ${currentSlide.content}. ${currentSlide.speakerNotes}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsNarrating(true);
    utterance.onend = () => setIsNarrating(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stopNarration = () => {
    window.speechSynthesis.cancel();
    setIsNarrating(false);
  };

  // PDF Export functionality
  const exportToPDF = async () => {
    try {
      toast({
        title: "Generating PDF...",
        description: "Your pitch deck is being prepared for download."
      });

      // Create a new window with the slides for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const slidesHTML = pitchDeck.map((slide, index) => `
        <div style="
          page-break-after: always;
          padding: 40px;
          background: ${brandTheme.backgroundColor};
          color: #1F2937;
          font-family: ${brandTheme.fontFamily};
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        ">
          <h1 style="
            color: ${brandTheme.primaryColor};
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 2rem;
            border-bottom: 3px solid ${brandTheme.accentColor};
            padding-bottom: 1rem;
          ">${slide.title}</h1>
          <div style="
            flex: 1;
            font-size: 1.2rem;
            line-height: 1.6;
            white-space: pre-wrap;
          ">${slide.content}</div>
          <div style="
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #E5E7EB;
            font-size: 0.9rem;
            color: #6B7280;
          ">
            <strong>Speaker Notes:</strong> ${slide.speakerNotes}
          </div>
          <div style="
            text-align: center;
            margin-top: 1rem;
            color: #9CA3AF;
            font-size: 0.8rem;
          ">
            Slide ${index + 1} of ${pitchDeck.length} • ${ideaData?.ideaTitle || 'Startup Pitch'}
          </div>
        </div>
      `).join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>${ideaData?.ideaTitle || 'Pitch Deck'}</title>
            <style>
              @media print {
                @page { margin: 0; }
                body { margin: 0; }
              }
            </style>
          </head>
          <body>${slidesHTML}</body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const currentSlide = pitchDeck[currentSlideIndex];

  const getSlideIcon = (template: string) => {
    switch (template) {
      case "title": return Presentation;
      case "problem": return Target;
      case "solution": return Lightbulb;
      case "market": return BarChart3;
      case "business-model": return DollarSign;
      case "traction": return TrendingUp;
      case "team": return Users;
      case "financial": return BarChart3;
      case "funding": return DollarSign;
      case "closing": return CheckCircle;
      default: return FileText;
    }
  };

  // Keyboard navigation for presentation mode - MOVED BEFORE CONDITIONAL RETURNS
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!presentationMode) return;
      
      switch (event.key) {
        case 'ArrowRight':
        case ' ': // Space bar
          event.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          prevSlide();
          break;
        case 'Escape':
          setPresentationMode(false);
          break;
        case 'p':
        case 'P':
          setAutoPlay(!autoPlay);
          break;
        case 'n':
        case 'N':
          if (isNarrating) {
            stopNarration();
          } else {
            startNarration();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [presentationMode, autoPlay, isNarrating, currentSlideIndex]);

  if (isGenerating) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
            Generating Your Pitch Deck
          </CardTitle>
          <div className="flex items-center justify-center mb-6">
            <Presentation className="w-12 h-12 text-blue-600 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Creating: {ideaData?.ideaTitle}
            </h3>
            <p className="text-gray-600 mb-6">
              Our AI is crafting a professional investor presentation
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(generationProgress)}%</span>
            </div>
            <Progress value={generationProgress} className="h-3" />
          </div>
          
          <div className="text-center text-sm text-gray-500">
            Creating professional slides with speaker notes
          </div>
        </CardContent>
      </Card>
    );
  }

  if (presentationMode) {
    return (
      <div className="fixed inset-0 z-50" style={{ backgroundColor: brandTheme.backgroundColor }}>
        {/* Enhanced Presentation Header */}
        <div className="absolute top-0 left-0 right-0 bg-black/90 text-white p-4 flex items-center justify-between z-10 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPresentationMode(false)}
              className="text-white hover:bg-white/20"
              data-testid="button-exit-presentation"
            >
              <Eye className="w-4 h-4 mr-2" />
              Exit Presentation
            </Button>
            <span className="text-sm opacity-80">
              Slide {currentSlideIndex + 1} of {pitchDeck.length}
            </span>
          </div>
          
          {/* Enhanced Presentation Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoPlay(!autoPlay)}
              className={`text-white hover:bg-white/20 ${autoPlay ? 'bg-white/20' : ''}`}
              data-testid="button-autoplay"
            >
              {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={isNarrating ? stopNarration : startNarration}
              className={`text-white hover:bg-white/20 ${isNarrating ? 'bg-white/20' : ''}`}
              data-testid="button-narration"
            >
              {isNarrating ? <Pause className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
            </Button>
            <div className="w-px h-4 bg-white/30 mx-2"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="text-white hover:bg-white/20 disabled:opacity-50"
              data-testid="button-prev-slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextSlide}
              disabled={currentSlideIndex === pitchDeck.length - 1}
              className="text-white hover:bg-white/20 disabled:opacity-50"
              data-testid="button-next-slide"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Enhanced Slide Content with Brand Theming */}
        <div className="flex items-center justify-center h-full p-8 md:p-16">
          <div 
            className="w-full max-w-6xl aspect-video rounded-lg shadow-2xl p-8 md:p-12 flex flex-col"
            style={{ 
              backgroundColor: brandTheme.backgroundColor,
              fontFamily: brandTheme.fontFamily,
              border: `3px solid ${brandTheme.accentColor}`
            }}
          >
            <h1 
              className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 md:mb-8"
              style={{ color: brandTheme.primaryColor }}
            >
              {currentSlide.title}
            </h1>
            <div 
              className="flex-1 text-lg md:text-xl lg:text-2xl leading-relaxed whitespace-pre-wrap"
              style={{ color: brandTheme.primaryColor === '#FFFFFF' ? '#1F2937' : '#374151' }}
            >
              {currentSlide.content || 'Content will appear here after generation...'}
            </div>
            {/* Auto-play progress indicator */}
            {autoPlay && (
              <div className="mt-4">
                <div 
                  className="h-1 rounded-full transition-all duration-100"
                  style={{ 
                    backgroundColor: `${brandTheme.accentColor}40`,
                    width: '100%'
                  }}
                >
                  <div 
                    className="h-1 rounded-full transition-all duration-100"
                    style={{ 
                      backgroundColor: brandTheme.accentColor,
                      width: `${((Date.now() % 10000) / 10000) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Speaker Notes */}
        {currentSlide.speakerNotes && (
          <div 
            className="absolute bottom-0 left-0 right-0 text-white p-4 backdrop-blur-sm"
            style={{ backgroundColor: `${brandTheme.primaryColor}CC` }}
          >
            <div className="max-w-6xl mx-auto">
              <p className="text-sm opacity-90">
                <strong>Speaker Notes:</strong> {currentSlide.speakerNotes}
              </p>
            </div>
          </div>
        )}
        
        {/* Keyboard shortcuts help */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs p-2 rounded backdrop-blur-sm opacity-70 hover:opacity-100 transition-opacity">
          <div>→ Next • ← Previous • Space Next • P Auto-play • N Narration • Esc Exit</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Pitch Deck Generator
            </CardTitle>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="text-sm">
                {pitchDeck.filter(s => s.content).length}/{pitchDeck.length} slides
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBrandingEditor(!showBrandingEditor)}
                data-testid="button-brand-theme"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Brand Theme
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToPDF}
                disabled={!pitchDeck.some(s => s.content)}
                data-testid="button-export-pdf"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button
                onClick={() => setPresentationMode(true)}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!pitchDeck.some(s => s.content)}
                data-testid="button-present"
              >
                <Play className="w-4 h-4 mr-2" />
                Present
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {pitchDeck.length}
              </div>
              <div className="text-sm text-gray-600">Total Slides</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {pitchDeck.filter(s => s.content).length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                10min
              </div>
              <div className="text-sm text-gray-600">Est. Duration</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Brand Theming Editor */}
      {showBrandingEditor && (
        <Card className="border-2" style={{ borderColor: brandTheme.accentColor }}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span style={{ color: brandTheme.primaryColor }}>Brand Theme Customization</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBrandingEditor(false)}
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={brandTheme.primaryColor}
                    onChange={(e) => setBrandTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-16 h-10"
                  />
                  <Input
                    value={brandTheme.primaryColor}
                    onChange={(e) => setBrandTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={brandTheme.secondaryColor}
                    onChange={(e) => setBrandTheme(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-16 h-10"
                  />
                  <Input
                    value={brandTheme.secondaryColor}
                    onChange={(e) => setBrandTheme(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="accentColor"
                    type="color"
                    value={brandTheme.accentColor}
                    onChange={(e) => setBrandTheme(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="w-16 h-10"
                  />
                  <Input
                    value={brandTheme.accentColor}
                    onChange={(e) => setBrandTheme(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 rounded-lg" style={{ backgroundColor: brandTheme.backgroundColor }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: brandTheme.primaryColor }}>
                Brand Preview
              </h3>
              <p className="text-gray-600">
                This is how your slides will look with the current brand theme.
              </p>
              <div className="mt-4 flex space-x-2">
                <div 
                  className="px-3 py-1 rounded text-white text-sm font-medium"
                  style={{ backgroundColor: brandTheme.primaryColor }}
                >
                  Primary Button
                </div>
                <div 
                  className="px-3 py-1 rounded text-white text-sm font-medium"
                  style={{ backgroundColor: brandTheme.secondaryColor }}
                >
                  Secondary
                </div>
                <div 
                  className="px-3 py-1 rounded text-white text-sm font-medium"
                  style={{ backgroundColor: brandTheme.accentColor }}
                >
                  Accent
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Generation Controls */}
      <Card className="border-l-4" style={{ borderLeftColor: brandTheme.primaryColor }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 
                className="text-lg font-semibold mb-2"
                style={{ color: brandTheme.primaryColor }}
              >
                🚀 AI-Powered Pitch Deck Generator
              </h3>
              <p className="text-gray-600">
                Generate a professional investor presentation with real market research
              </p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Brain className="w-4 h-4 mr-1 text-purple-500" />
                  AI-Generated Content
                </span>
                <span className="flex items-center">
                  <Target className="w-4 h-4 mr-1 text-blue-500" />
                  Market Research
                </span>
                <span className="flex items-center">
                  <Zap className="w-4 h-4 mr-1 text-green-500" />
                  Interactive Slides
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Button
                onClick={handleGenerateDeck}
                disabled={generatePitchDeckMutation.isPending}
                style={{ 
                  backgroundColor: brandTheme.primaryColor,
                  color: 'white'
                }}
                className="hover:opacity-90 transition-opacity w-full"
              >
                {generatePitchDeckMutation.isPending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Presentation className="w-4 h-4 mr-2" />
                    Generate Smart Pitch Deck
                  </>
                )}
              </Button>
              <div className="text-xs text-gray-500 text-center">
                ~2 minutes with web research
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pitch Deck Editor */}
      <Tabs defaultValue="editor" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Slide Editor</TabsTrigger>
          <TabsTrigger value="overview">Deck Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          {/* Slide Navigation */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Slide Navigation</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevSlide}
                    disabled={currentSlideIndex === 0}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-600">
                    {currentSlideIndex + 1} / {pitchDeck.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextSlide}
                    disabled={currentSlideIndex === pitchDeck.length - 1}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {pitchDeck.map((slide, index) => {
                  const IconComponent = getSlideIcon(slide.template);
                  return (
                    <button
                      key={slide.id}
                      onClick={() => setCurrentSlideIndex(index)}
                      className={`p-2 rounded-lg border text-xs transition-colors ${
                        index === currentSlideIndex
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : slide.content
                            ? 'border-green-200 bg-green-50 text-green-700'
                            : 'border-gray-200 bg-gray-50 text-gray-500'
                      }`}
                    >
                      <IconComponent className="w-4 h-4 mx-auto mb-1" />
                      <div className="truncate">{slide.title}</div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Current Slide Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Slide Content */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Slide {currentSlide.slideNumber}: {currentSlide.title}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingSlide(editingSlide === currentSlide.id ? null : currentSlide.id)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {editingSlide === currentSlide.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Slide Content
                      </label>
                      <Textarea
                        value={currentSlide.content}
                        onChange={(e) => {
                          const updatedContent = e.target.value;
                          setPitchDeck(prev => prev.map(s => 
                            s.id === currentSlide.id ? { ...s, content: updatedContent } : s
                          ));
                        }}
                        rows={8}
                        className="min-h-[200px]"
                      />
                    </div>
                    
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSlide(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveSlide(currentSlide.id, currentSlide.content, currentSlide.speakerNotes)}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {currentSlide.content ? (
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                          {currentSlide.content}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Presentation className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>Generate the pitch deck to see this slide</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Speaker Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Speaker Notes</CardTitle>
              </CardHeader>
              
              <CardContent>
                {editingSlide === currentSlide.id ? (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Speaker Notes
                    </label>
                    <Textarea
                      value={currentSlide.speakerNotes}
                      onChange={(e) => {
                        const updatedNotes = e.target.value;
                        setPitchDeck(prev => prev.map(s => 
                          s.id === currentSlide.id ? { ...s, speakerNotes: updatedNotes } : s
                        ));
                      }}
                      rows={8}
                      className="min-h-[200px]"
                      placeholder="Add speaker notes for this slide..."
                    />
                  </div>
                ) : (
                  <div>
                    {currentSlide.speakerNotes ? (
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap text-gray-600 text-sm leading-relaxed">
                          {currentSlide.speakerNotes}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>No speaker notes yet</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Complete Pitch Deck</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={exportToPDF}
                    disabled={!pitchDeck.some(s => s.content)}
                    data-testid="button-download-pdf-overview"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast({ title: "Link copied!", description: "Share link copied to clipboard" });
                    }}
                    data-testid="button-share-overview"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid gap-6">
                {pitchDeck.map((slide, index) => {
                  const IconComponent = getSlideIcon(slide.template);
                  return (
                    <Card 
                      key={slide.id} 
                      className={`border-l-4 transition-all hover:shadow-md cursor-pointer ${
                        index === currentSlideIndex ? 'ring-2 ring-offset-2' : ''
                      }`}
                      style={{ 
                        borderLeftColor: brandTheme.primaryColor,
                        '--tw-ring-color': index === currentSlideIndex ? `${brandTheme.primaryColor}40` : undefined
                      }}
                      onClick={() => setCurrentSlideIndex(index)}
                      data-testid={`card-slide-${slide.id}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${brandTheme.primaryColor}20` }}
                          >
                            <IconComponent className="w-6 h-6" style={{ color: brandTheme.primaryColor }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {slide.slideNumber}. {slide.title}
                              </h3>
                              <div className="flex items-center space-x-2">
                                {slide.content && (
                                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                    ✓ Complete
                                  </Badge>
                                )}
                                {slide.speakerNotes && (
                                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                    📝 Notes
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {slide.content ? (
                              <div className="text-gray-700 text-sm mb-4 line-clamp-3">
                                {slide.content}
                              </div>
                            ) : (
                              <div className="text-gray-500 text-sm mb-4 italic">
                                No content generated yet
                              </div>
                            )}
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Target className="w-3 h-3 mr-1" />
                                  {slide.template}
                                </span>
                                <span className="flex items-center">
                                  <BarChart3 className="w-3 h-3 mr-1" />
                                  {slide.layout}
                                </span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentSlideIndex(index);
                                  setEditingSlide(slide.id);
                                }}
                                data-testid={`button-edit-slide-${slide.id}`}
                              >
                                <Edit3 className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}