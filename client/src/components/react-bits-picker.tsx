import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sparkles, 
  Type, 
  Wand2, 
  Square, 
  Check,
  Search,
  Palette
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

interface ReactBitsPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (component: ReactBitsComponent) => void;
}

export interface ReactBitsComponent {
  id: string;
  name: string;
  category: "text" | "animation" | "background";
  description: string;
  previewImage?: string;
  defaultProps: Record<string, any>;
  customProps?: Record<string, any>;
  code: string;
}

const availableComponents: ReactBitsComponent[] = [
  {
    id: "split-text",
    name: "Split Text Animation",
    category: "text",
    description: "Animate text character by character with GSAP",
    defaultProps: {
      text: "Your Amazing Text",
      delay: 50,
      duration: 0.8,
      ease: "elastic.out(1, 0.3)",
      splitType: "chars"
    },
    code: `<SplitText
  text="Your Amazing Text"
  tag="h1"
  className="text-4xl font-bold"
  delay={50}
  duration={0.8}
  ease="elastic.out(1, 0.3)"
/>`
  },
  {
    id: "grid-distortion",
    name: "Grid Distortion",
    category: "background",
    description: "Animated distorted grid background",
    defaultProps: {
      gridSize: 50,
      distortionStrength: 20,
      color: "rgba(139, 92, 246, 0.3)",
      speed: 0.001
    },
    code: `<GridDistortion
  gridSize={50}
  distortionStrength={20}
  color="rgba(139, 92, 246, 0.3)"
  speed={0.001}
/>`
  },
  {
    id: "aurora-background",
    name: "Aurora Background",
    category: "background",
    description: "Northern lights effect background",
    defaultProps: {
      colors: ["rgba(139, 92, 246, 0.3)", "rgba(236, 72, 153, 0.3)", "rgba(59, 130, 246, 0.3)"],
      speed: 0.002
    },
    code: `<AuroraBackground
  colors={["rgba(139, 92, 246, 0.3)", "rgba(236, 72, 153, 0.3)", "rgba(59, 130, 246, 0.3)"]}
  speed={0.002}
/>`
  },
  {
    id: "wave-background",
    name: "Wave Background",
    category: "background",
    description: "Flowing wave animations",
    defaultProps: {
      waveColor: "rgba(139, 92, 246, 0.2)",
      amplitude: 50,
      frequency: 0.02,
      speed: 0.02,
      numberOfWaves: 3
    },
    code: `<WaveBackground
  waveColor="rgba(139, 92, 246, 0.2)"
  amplitude={50}
  frequency={0.02}
  speed={0.02}
  numberOfWaves={3}
/>`
  },
  {
    id: "animated-gradient",
    name: "Animated Gradient",
    category: "background",
    description: "Rotating gradient background",
    defaultProps: {
      colors: ["#8b5cf6", "#ec4899", "#3b82f6"],
      speed: 5,
      blur: 100
    },
    code: `<AnimatedGradient
  colors={["#8b5cf6", "#ec4899", "#3b82f6"]}
  speed={5}
  blur={100}
/>`
  }
];

export function ReactBitsPicker({ open, onClose, onSelect }: ReactBitsPickerProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | "text" | "animation" | "background">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComponent, setSelectedComponent] = useState<ReactBitsComponent | null>(null);
  const [customProps, setCustomProps] = useState<Record<string, any>>({});

  const filteredComponents = availableComponents.filter(comp => {
    const matchesCategory = activeCategory === "all" || comp.category === activeCategory;
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelect = (component: ReactBitsComponent) => {
    setSelectedComponent(component);
    setCustomProps(component.defaultProps);
  };

  const handleInsert = () => {
    if (selectedComponent) {
      onSelect({
        ...selectedComponent,
        customProps: customProps
      });
      onClose();
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "text": return <Type className="w-4 h-4" />;
      case "animation": return <Wand2 className="w-4 h-4" />;
      case "background": return <Square className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            React Bits Component Library
          </DialogTitle>
          <DialogDescription>
            Add stunning animated components to your website
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          {/* Search and Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-components"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as any)} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="text">
                <Type className="w-4 h-4 mr-2" />
                Text
              </TabsTrigger>
              <TabsTrigger value="animation">
                <Wand2 className="w-4 h-4 mr-2" />
                Animations
              </TabsTrigger>
              <TabsTrigger value="background">
                <Square className="w-4 h-4 mr-2" />
                Backgrounds
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-4 flex-1 overflow-hidden mt-4">
              {/* Components Grid */}
              <ScrollArea className="flex-1">
                <div className="grid grid-cols-2 gap-4 pr-4">
                  {filteredComponents.map((component) => (
                    <Card
                      key={component.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedComponent?.id === component.id
                          ? "ring-2 ring-purple-500 shadow-lg"
                          : ""
                      }`}
                      onClick={() => handleSelect(component)}
                      data-testid={`card-component-${component.id}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                              {getCategoryIcon(component.category)}
                              {component.name}
                            </CardTitle>
                          </div>
                          {selectedComponent?.id === component.id && (
                            <Check className="w-5 h-5 text-purple-500" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-2">
                          {component.description}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {component.category}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredComponents.length === 0 && (
                    <div className="col-span-2 text-center py-12">
                      <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No components found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Component Preview & Customization */}
              {selectedComponent && (
                <div className="w-80 border-l pl-4">
                  <ScrollArea className="h-full">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Customize
                    </h3>
                    
                    <div className="space-y-4 pr-4">
                      {/* Dynamic prop customization based on component */}
                      {selectedComponent.id === "split-text" && (
                        <>
                          <div>
                            <Label>Text</Label>
                            <Input
                              value={customProps.text || ""}
                              onChange={(e) => setCustomProps({ ...customProps, text: e.target.value })}
                              data-testid="input-text"
                            />
                          </div>
                          <div>
                            <Label>Delay (ms): {customProps.delay || 50}</Label>
                            <Slider
                              value={[customProps.delay || 50]}
                              onValueChange={([v]) => setCustomProps({ ...customProps, delay: v })}
                              min={10}
                              max={200}
                              step={10}
                            />
                          </div>
                          <div>
                            <Label>Duration (s): {customProps.duration || 0.8}</Label>
                            <Slider
                              value={[customProps.duration * 10 || 8]}
                              onValueChange={([v]) => setCustomProps({ ...customProps, duration: v / 10 })}
                              min={1}
                              max={30}
                              step={1}
                            />
                          </div>
                        </>
                      )}

                      {(selectedComponent.id === "grid-distortion" || 
                        selectedComponent.id === "aurora-background" || 
                        selectedComponent.id === "wave-background" ||
                        selectedComponent.id === "animated-gradient") && (
                        <>
                          <div>
                            <Label>Speed: {customProps.speed || customProps.speed === 0 ? customProps.speed : 0.001}</Label>
                            <Slider
                              value={[(customProps.speed || 0.001) * 1000]}
                              onValueChange={([v]) => setCustomProps({ ...customProps, speed: v / 1000 })}
                              min={1}
                              max={20}
                              step={1}
                            />
                          </div>
                        </>
                      )}

                      <div className="pt-4 border-t">
                        <Label className="mb-2 block">Preview Code</Label>
                        <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-auto">
                          <code>{selectedComponent.code}</code>
                        </pre>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button
              onClick={handleInsert}
              disabled={!selectedComponent}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
              data-testid="button-insert"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Insert Component
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
