import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface PitchSlide {
  id: string;
  title: string;
  content: string;
  speakerNotes: string;
  slideNumber: number;
  template: "title" | "content" | "problem" | "solution" | "market" | "business-model" | "traction" | "team" | "financial" | "funding" | "closing";
  backgroundImage?: string;
  layout: "title-content" | "full-content" | "split" | "chart" | "image-text";
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

  const nextSlide = () => {
    setCurrentSlideIndex(prev => Math.min(prev + 1, pitchDeck.length - 1));
  };

  const prevSlide = () => {
    setCurrentSlideIndex(prev => Math.max(prev - 1, 0));
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
      <div className="fixed inset-0 bg-black z-50">
        {/* Presentation Header */}
        <div className="absolute top-0 left-0 right-0 bg-black/80 text-white p-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPresentationMode(false)}
              className="text-white hover:bg-white/20"
            >
              <Eye className="w-4 h-4 mr-2" />
              Exit Presentation
            </Button>
            <span className="text-sm">
              Slide {currentSlideIndex + 1} of {pitchDeck.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextSlide}
              disabled={currentSlideIndex === pitchDeck.length - 1}
              className="text-white hover:bg-white/20"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Slide Content */}
        <div className="flex items-center justify-center h-full p-16">
          <div className="bg-white w-full max-w-6xl aspect-video rounded-lg shadow-2xl p-12 flex flex-col">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8">
              {currentSlide.title}
            </h1>
            <div className="flex-1 text-xl lg:text-2xl text-gray-700 leading-relaxed whitespace-pre-wrap">
              {currentSlide.content}
            </div>
          </div>
        </div>

        {/* Speaker Notes */}
        {currentSlide.speakerNotes && (
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900 text-white p-4">
            <p className="text-sm opacity-80">
              <strong>Speaker Notes:</strong> {currentSlide.speakerNotes}
            </p>
          </div>
        )}
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
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                {pitchDeck.filter(s => s.content).length}/{pitchDeck.length} slides
              </Badge>
              <Button
                onClick={() => setPresentationMode(true)}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!pitchDeck.some(s => s.content)}
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

      {/* Generation Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Generate AI Pitch Deck
              </h3>
              <p className="text-gray-600">
                Create a professional investor presentation based on your business plan
              </p>
            </div>
            <Button
              onClick={handleGenerateDeck}
              disabled={generatePitchDeckMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {generatePitchDeckMutation.isPending ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Presentation className="w-4 h-4 mr-2" />
                  Generate Pitch Deck
                </>
              )}
            </Button>
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
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" size="sm">
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
                    <Card key={slide.id} className="border-l-4 border-l-purple-500">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {slide.slideNumber}. {slide.title}
                            </h3>
                            {slide.content ? (
                              <div className="text-gray-700 text-sm mb-4 line-clamp-3">
                                {slide.content}
                              </div>
                            ) : (
                              <div className="text-gray-500 text-sm mb-4 italic">
                                No content generated yet
                              </div>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentSlideIndex(index)}
                            >
                              Edit Slide
                            </Button>
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