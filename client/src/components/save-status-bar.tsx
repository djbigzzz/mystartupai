import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Save, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SaveStatusBarProps {
  lastSavedAt: Date | null;
  isSaving: boolean;
  onViewSaved: () => void;
  onSaveNow: () => void;
  onClearDraft: () => void;
}

export function SaveStatusBar({
  lastSavedAt,
  isSaving,
  onViewSaved,
  onSaveNow,
  onClearDraft,
}: SaveStatusBarProps) {
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    if (!lastSavedAt) {
      setTimeAgo("Never");
      return;
    }

    // Update time ago immediately
    const updateTimeAgo = () => {
      setTimeAgo(formatDistanceToNow(lastSavedAt, { addSuffix: true }));
    };

    updateTimeAgo();

    // Update every 10 seconds
    const interval = setInterval(updateTimeAgo, 10000);

    return () => clearInterval(interval);
  }, [lastSavedAt]);

  return (
    <div className="w-full bg-card/40 backdrop-blur-md border border-border/50 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Save Status */}
        <div className="flex items-center gap-2">
          <Save className={`h-4 w-4 ${isSaving ? 'animate-pulse text-blue-500' : 'text-muted-foreground'}`} />
          <span className="text-sm text-muted-foreground">
            {isSaving ? (
              <span className="text-blue-500 font-medium">Saving...</span>
            ) : lastSavedAt ? (
              <span>Last saved <span className="font-medium text-foreground">{timeAgo}</span></span>
            ) : (
              <span className="text-yellow-500 font-medium">Not saved yet</span>
            )}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewSaved}
            className="gap-2"
            data-testid="button-view-saved"
          >
            <Eye className="h-4 w-4" />
            View Saved
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onSaveNow}
            disabled={isSaving}
            className="gap-2"
            data-testid="button-save-now"
          >
            <Save className="h-4 w-4" />
            Save Now
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onClearDraft}
            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            data-testid="button-clear-draft"
          >
            <Trash2 className="h-4 w-4" />
            Clear Draft
          </Button>
        </div>
      </div>
    </div>
  );
}
