import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Edit, Trash2, RefreshCw, Lightbulb, Info, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface IdeaManagementCardProps {
  idea: any;
}

export default function IdeaManagementCard({ idea }: IdeaManagementCardProps) {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/ideas/${idea.id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Idea Deleted",
        description: "Your idea has been deleted. You can now submit a new one!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/ideas"] });
      localStorage.removeItem("currentIdeaId");
      setShowDeleteDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete idea",
        variant: "destructive",
      });
    },
  });

  // Regenerate analysis mutation
  const regenerateMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/ideas/${idea.id}/regenerate`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast({
        title: "Analysis Regenerated!",
        description: "Your idea has been re-analyzed with fresh AI insights.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/ideas"] });
      queryClient.invalidateQueries({ queryKey: [`/api/ideas/${idea.id}`] });
      setShowRegenerateDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Regeneration Failed",
        description: error.message || "Failed to regenerate analysis",
        variant: "destructive",
      });
    },
  });

  if (!idea) {
    return (
      <Card data-testid="card-no-idea">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            Your Startup Idea
          </CardTitle>
          <CardDescription>
            You haven't submitted an idea yet. Get started to unlock AI-powered insights!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/submit-idea">
            <Button className="w-full" data-testid="button-submit-first-idea">
              <Lightbulb className="w-4 h-4 mr-2" />
              Submit Your First Idea
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card data-testid="card-idea-management">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{idea.ideaTitle}</CardTitle>
              <CardDescription className="line-clamp-2">
                {idea.description}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="ml-4">
              {idea.industry}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Info */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Stage:</strong> {idea.stage} | 
              <strong className="ml-2">Analysis:</strong> {idea.analysis ? "Complete" : "Pending"}
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/submit-idea">
              <Button variant="outline" className="w-full" data-testid="button-edit-idea">
                <Edit className="w-4 h-4 mr-2" />
                Edit Idea
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={() => setShowRegenerateDialog(true)}
              disabled={regenerateMutation.isPending}
              data-testid="button-regenerate-analysis"
            >
              {regenerateMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Regenerate AI
            </Button>

            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={deleteMutation.isPending}
              data-testid="button-delete-idea"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete & Start Fresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Delete Startup Idea?
            </DialogTitle>
            <DialogDescription>
              This will permanently delete <strong>"{idea.ideaTitle}"</strong> and all its AI analysis, business plan, and pitch deck data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} data-testid="button-cancel-delete">
              Keep My Idea
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Yes, Delete Forever"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Regenerate Confirmation Dialog */}
      <Dialog open={showRegenerateDialog} onOpenChange={setShowRegenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              Regenerate AI Analysis?
            </DialogTitle>
            <DialogDescription>
              This will re-run the AI analysis for <strong>"{idea.ideaTitle}"</strong> using the latest AI models and market research. The existing analysis will be replaced with fresh insights.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowRegenerateDialog(false)} data-testid="button-cancel-regenerate">
              Cancel
            </Button>
            <Button
              onClick={() => regenerateMutation.mutate()}
              disabled={regenerateMutation.isPending}
              data-testid="button-confirm-regenerate"
            >
              {regenerateMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Yes, Regenerate Now
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
