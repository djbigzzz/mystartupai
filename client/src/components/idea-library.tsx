import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Trash2, 
  Archive, 
  ArchiveRestore,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  BarChart3
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface IdeaCardProps {
  idea: any;
  onSelect?: (idea: any) => void;
  selected?: boolean;
}

function IdeaCard({ idea, onSelect, selected }: IdeaCardProps) {
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/ideas/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ideas"] });
      toast({
        title: "Idea deleted",
        description: "The idea has been removed from your library.",
      });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Could not delete the idea. Please try again.",
        variant: "destructive",
      });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest(`/api/ideas/${id}`, { method: "PATCH", body: { status } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ideas"] });
      toast({
        title: "Status updated",
        description: "The idea status has been changed.",
      });
    },
  });

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "GO":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/50";
      case "REFINE":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/50";
      case "PIVOT":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/50";
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "GO":
        return CheckCircle2;
      case "REFINE":
        return AlertCircle;
      case "PIVOT":
        return XCircle;
      default:
        return Target;
    }
  };

  const VerdictIcon = idea.validationVerdict
    ? getVerdictIcon(idea.validationVerdict)
    : Target;

  return (
    <Card
      className={cn(
        "border-2 cursor-pointer hover:border-primary/50 transition-all",
        selected && "border-primary ring-2 ring-primary/20"
      )}
      onClick={() => onSelect?.(idea)}
      data-testid={`idea-card-${idea.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base line-clamp-2">
              {idea.ideaTitle}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {idea.industry} • {idea.stage}
            </p>
          </div>
          {idea.validationScore !== null && idea.validationScore !== undefined && (
            <div className="flex flex-col items-end gap-1">
              <div className="text-2xl font-bold gradient-text-primary">
                {idea.validationScore}
              </div>
              <div className="text-xs text-muted-foreground">/100</div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {idea.description}
        </p>

        {/* Verdict Badge */}
        {idea.validationVerdict && (
          <Badge
            variant="outline"
            className={cn("font-semibold", getVerdictColor(idea.validationVerdict))}
          >
            <VerdictIcon className="w-3 h-3 mr-1" />
            VERDICT: {idea.validationVerdict}
          </Badge>
        )}

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(idea.createdAt).toLocaleDateString()}
          </div>
          {idea.validationResult && (
            <div className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              8-Dimension Analysis
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-8"
            onClick={(e) => {
              e.stopPropagation();
              archiveMutation.mutate({
                id: idea.id,
                status: idea.status === "archived" ? "active" : "archived",
              });
            }}
            data-testid={`button-archive-${idea.id}`}
          >
            {idea.status === "archived" ? (
              <>
                <ArchiveRestore className="w-3 h-3 mr-1" />
                Restore
              </>
            ) : (
              <>
                <Archive className="w-3 h-3 mr-1" />
                Archive
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              if (
                confirm(
                  "Are you sure you want to delete this idea? This action cannot be undone."
                )
              ) {
                deleteMutation.mutate(idea.id);
              }
            }}
            data-testid={`button-delete-${idea.id}`}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface IdeaLibraryProps {
  onSelectIdea?: (idea: any) => void;
  selectedIdeaId?: number | null;
}

export function IdeaLibrary({ onSelectIdea, selectedIdeaId }: IdeaLibraryProps) {
  const [filter, setFilter] = useState<"all" | "active" | "archived">("active");
  const [verdictFilter, setVerdictFilter] = useState<string | null>(null);

  const { data: ideas = [], isLoading } = useQuery({
    queryKey: ["/api/ideas", filter !== "all" ? filter : undefined],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter !== "all") {
        params.append("status", filter);
      }
      const response = await fetch(`/api/ideas?${params}`);
      if (!response.ok) throw new Error("Failed to fetch ideas");
      return response.json();
    },
  });

  const filteredIdeas = verdictFilter
    ? ideas.filter((idea: any) => idea.validationVerdict === verdictFilter)
    : ideas;

  const stats = {
    total: ideas.length,
    validated: ideas.filter((i: any) => i.validationScore !== null).length,
    go: ideas.filter((i: any) => i.validationVerdict === "GO").length,
    refine: ideas.filter((i: any) => i.validationVerdict === "REFINE").length,
    pivot: ideas.filter((i: any) => i.validationVerdict === "PIVOT").length,
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Target className="w-5 h-5" />
          Your Ideas
        </h2>
        <p className="text-sm text-muted-foreground">
          {stats.validated} of {stats.total} validated
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-4">
        {/* Status Filter */}
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="flex-1"
            data-testid="filter-all"
          >
            All
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("active")}
            className="flex-1"
            data-testid="filter-active"
          >
            Active
          </Button>
          <Button
            variant={filter === "archived" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("archived")}
            className="flex-1"
            data-testid="filter-archived"
          >
            Archived
          </Button>
        </div>

        {/* Verdict Filter */}
        {stats.validated > 0 && (
          <div className="flex gap-2">
            <Button
              variant={verdictFilter === "GO" ? "default" : "outline"}
              size="sm"
              onClick={() => setVerdictFilter(verdictFilter === "GO" ? null : "GO")}
              className="flex-1"
              data-testid="filter-go"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              GO ({stats.go})
            </Button>
            <Button
              variant={verdictFilter === "REFINE" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setVerdictFilter(verdictFilter === "REFINE" ? null : "REFINE")
              }
              className="flex-1"
              data-testid="filter-refine"
            >
              <AlertCircle className="w-3 h-3 mr-1" />
              REFINE ({stats.refine})
            </Button>
            <Button
              variant={verdictFilter === "PIVOT" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setVerdictFilter(verdictFilter === "PIVOT" ? null : "PIVOT")
              }
              className="flex-1"
              data-testid="filter-pivot"
            >
              <XCircle className="w-3 h-3 mr-1" />
              PIVOT ({stats.pivot})
            </Button>
          </div>
        )}
      </div>

      {/* Ideas Grid */}
      <div className="flex-1 overflow-y-auto space-y-3" data-testid="ideas-list">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading your ideas...
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              {ideas.length === 0
                ? "No ideas yet. Start by validating your first idea!"
                : "No ideas match your filters."}
            </p>
          </div>
        ) : (
          filteredIdeas.map((idea: any) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onSelect={onSelectIdea}
              selected={selectedIdeaId === idea.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
