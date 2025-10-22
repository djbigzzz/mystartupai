import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Send, 
  Lightbulb,
  Rocket,
  Target,
  TrendingUp
} from "lucide-react";

interface AIWorkspaceProps {
  onValidate?: (ideaData: { title: string; description: string }) => void;
  isValidating?: boolean;
}

export function AIWorkspace({ onValidate, isValidating }: AIWorkspaceProps) {
  const [ideaInput, setIdeaInput] = useState("");

  const quickStartTemplates = [
    {
      icon: Rocket,
      title: "SaaS Platform",
      prompt: "An AI-powered SaaS platform that helps...",
    },
    {
      icon: Lightbulb,
      title: "Mobile App",
      prompt: "A mobile app that solves the problem of...",
    },
    {
      icon: TrendingUp,
      title: "Marketplace",
      prompt: "An online marketplace connecting...",
    },
    {
      icon: Target,
      title: "B2B Solution",
      prompt: "A B2B solution that automates...",
    },
  ];

  const handleQuickStart = (prompt: string) => {
    setIdeaInput(prompt);
  };

  const handleValidate = () => {
    if (!ideaInput.trim()) return;

    // Extract a simple title from the input (first few words)
    const title = ideaInput.trim().split(" ").slice(0, 8).join(" ");
    
    onValidate?.({
      title: title.length > 50 ? title.substring(0, 50) + "..." : title,
      description: ideaInput.trim(),
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Start with Your Idea
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Simply describe your startup idea, and I'll help validate it with
          AI-powered analysis and real-time market research.
        </p>
      </div>

      {/* Quick Start Templates */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Quick Start Templates</p>
          <Badge variant="secondary" className="text-xs">
            Try these
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quickStartTemplates.map((template, idx) => {
            const Icon = template.icon;
            return (
              <Button
                key={idx}
                variant="outline"
                className="h-auto py-3 px-3 flex flex-col items-start gap-1"
                onClick={() => handleQuickStart(template.prompt)}
                data-testid={`template-${idx}`}
              >
                <div className="flex items-center gap-2 w-full">
                  <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-xs font-semibold">{template.title}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* AI Conversational Input */}
      <Card className="flex-1 flex flex-col border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Tell Me About Your Idea
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          <Textarea
            placeholder="Example: An AI-powered platform that transforms static pitch decks into compelling video presentations, enabling startups to capture investor attention and communicate their vision more effectively..."
            value={ideaInput}
            onChange={(e) => setIdeaInput(e.target.value)}
            className="flex-1 min-h-[200px] resize-none"
            data-testid="input-idea-workspace"
          />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="font-normal">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Enhance
              </Badge>
              <span>
                I'll analyze your idea across 8 critical dimensions with
                real-time market research
              </span>
            </div>

            <Button
              onClick={handleValidate}
              disabled={!ideaInput.trim() || isValidating}
              className="w-full"
              size="lg"
              data-testid="button-validate-workspace"
            >
              {isValidating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Validating with AI...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Validate My Idea
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <Card className="border">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-primary">8</div>
            <div className="text-xs text-muted-foreground">Dimensions</div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-primary">0-100</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-primary">
              <Sparkles className="w-6 h-6 mx-auto" />
            </div>
            <div className="text-xs text-muted-foreground">Live Data</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
