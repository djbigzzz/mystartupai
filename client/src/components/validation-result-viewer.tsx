import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Copy, 
  Download, 
  Edit, 
  Save, 
  X, 
  ExternalLink,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ValidationResultViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  result: string;
  sources?: string[];
  creditsUsed?: number;
  timestamp?: string;
  validationType: string;
  onSave?: (newResult: string) => void;
}

export function ValidationResultViewer({
  open,
  onOpenChange,
  title,
  result,
  sources = [],
  creditsUsed,
  timestamp,
  validationType,
  onSave,
}: ValidationResultViewerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedResult, setEditedResult] = useState(result);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Reset edited result when result changes
  useState(() => {
    setEditedResult(result);
  });

  const saveMutation = useMutation({
    mutationFn: async (newResult: string) => {
      return await apiRequest(`/api/validation/${validationType}`, {
        method: 'PUT',
        body: JSON.stringify({ result: newResult }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Saved",
        description: "Your edits have been saved successfully.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['/api/journey/validation'] });
      if (onSave) {
        onSave(editedResult);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save your edits. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast({
        title: "Copied",
        description: "Result copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded",
      description: "Result saved to your downloads",
    });
  };

  const handleSave = () => {
    saveMutation.mutate(editedResult);
  };

  const handleCancel = () => {
    setEditedResult(result);
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">{title}</DialogTitle>
              <DialogDescription className="flex flex-wrap items-center gap-2">
                {creditsUsed && (
                  <Badge variant="secondary" className="text-xs">
                    {creditsUsed} credits
                  </Badge>
                )}
                {timestamp && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(timestamp).toLocaleString()}
                  </span>
                )}
              </DialogDescription>
            </div>
            
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    data-testid="button-copy-result"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    data-testid="button-download-result"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    data-testid="button-edit-result"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={saveMutation.isPending}
                    data-testid="button-cancel-edit"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={saveMutation.isPending || editedResult === result}
                    data-testid="button-save-result"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saveMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-4 space-y-6">
            {/* Main Content */}
            <div>
              <h3 className="font-semibold mb-3 text-lg">Results</h3>
              {isEditing ? (
                <Textarea
                  value={editedResult}
                  onChange={(e) => setEditedResult(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Edit your results here..."
                  data-testid="textarea-edit-result"
                />
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/50 p-6 rounded-lg border border-border">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            {/* Sources */}
            {sources && sources.length > 0 && !isEditing && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Sources ({sources.length})
                  </h3>
                  <div className="space-y-2">
                    {sources.map((source, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <a
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline break-all flex items-start gap-2"
                          data-testid={`link-source-${idx}`}
                        >
                          <ExternalLink className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          {source}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
