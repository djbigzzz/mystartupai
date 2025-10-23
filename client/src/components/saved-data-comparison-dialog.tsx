import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface IdeaFormData {
  ideaTitle: string;
  problemStatement: string;
  solutionApproach: string;
  targetMarket: string;
  competitiveLandscape: string;
  businessModel: string;
  uniqueValueProp: string;
}

interface SavedDataComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedData: IdeaFormData | null;
  currentData: IdeaFormData;
}

const fieldLabels: Record<keyof IdeaFormData, string> = {
  ideaTitle: "Idea Title",
  problemStatement: "Problem Statement",
  solutionApproach: "Solution Approach",
  targetMarket: "Target Market",
  competitiveLandscape: "Competitive Landscape",
  businessModel: "Business Model",
  uniqueValueProp: "Unique Value Proposition",
};

export function SavedDataComparisonDialog({
  open,
  onOpenChange,
  savedData,
  currentData,
}: SavedDataComparisonDialogProps) {
  const hasChanges = savedData && Object.keys(fieldLabels).some(
    (key) => savedData[key as keyof IdeaFormData] !== currentData[key as keyof IdeaFormData]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Saved Data Comparison</DialogTitle>
          <DialogDescription>
            {!savedData ? (
              "No saved data found in database"
            ) : hasChanges ? (
              <span className="text-yellow-600 dark:text-yellow-500">
                You have unsaved changes
              </span>
            ) : (
              <span className="text-green-600 dark:text-green-500">
                All changes are saved
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          {!savedData ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No saved draft found in the database.</p>
              <p className="text-sm mt-2">Start filling out the form to create a draft.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {(Object.keys(fieldLabels) as Array<keyof IdeaFormData>).map((fieldKey) => {
                const saved = savedData[fieldKey];
                const current = currentData[fieldKey];
                const isDifferent = saved !== current;

                return (
                  <div
                    key={fieldKey}
                    className={`border rounded-lg p-4 ${
                      isDifferent
                        ? "border-yellow-500/50 bg-yellow-500/5"
                        : "border-border/50 bg-card/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-medium text-sm">{fieldLabels[fieldKey]}</h3>
                      {isDifferent && (
                        <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-500">
                          Modified
                        </Badge>
                      )}
                      {!isDifferent && saved && (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-500">
                          Saved
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Saved Version */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          💾 Saved in Database
                        </p>
                        <div className="bg-background/50 border border-border/50 rounded p-3 min-h-[60px]">
                          {saved ? (
                            <p className="text-sm whitespace-pre-wrap">{saved}</p>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">Empty</p>
                          )}
                        </div>
                      </div>

                      {/* Current Version */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          ✏️ Current Form
                        </p>
                        <div className={`border rounded p-3 min-h-[60px] ${
                          isDifferent
                            ? "bg-yellow-500/10 border-yellow-500/50"
                            : "bg-background/50 border-border/50"
                        }`}>
                          {current ? (
                            <p className="text-sm whitespace-pre-wrap">{current}</p>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">Empty</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
