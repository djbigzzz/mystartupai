import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface EnhancedTextareaProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) =>void;
  onAiSuggest?: () => void;
  isAiSuggesting?: boolean;
  required?: boolean;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
  testId?: string;
}

export default function EnhancedTextarea({
  label,
  placeholder,
  value,
  onChange,
  onAiSuggest,
  isAiSuggesting = false,
  required = false,
  maxLength = 2000,
  minRows = 3,
  maxRows = 10,
  testId,
}: EnhancedTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = value.length;
  const charPercentage = (charCount / maxLength) * 100;

  const getCharCountColor = () => {
    if (charPercentage >= 90) return "text-red-500";
    if (charPercentage >= 75) return "text-yellow-500";
    return "text-muted-foreground";
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const minHeight = minRows * 24;
      const maxHeight = maxRows * 24;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
    }
  }, [value, minRows, maxRows]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
        {onAiSuggest && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAiSuggest}
            disabled={isAiSuggesting}
            data-testid={`ai-suggest-${testId}`}
            className="h-7 text-xs hover:bg-primary/10 transition-all"
          >
            {isAiSuggesting ? (
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
            ) : (
              <Sparkles className="w-3 h-3 mr-1" />
            )}
            AI Suggest
          </Button>
        )}
      </div>
      
      <div className="relative">
        <Textarea
          ref={textareaRef}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
          data-testid={`input-${testId}`}
          className={`
            resize-none transition-all duration-300 min-h-[72px]
            ${isFocused 
              ? "ring-2 ring-primary/50 border-primary shadow-lg shadow-primary/10 bg-background/80 backdrop-blur-sm" 
              : "bg-background/50 backdrop-blur-sm"
            }
            ${isAiSuggesting ? "animate-pulse" : ""}
          `}
          style={{ overflow: "hidden" }}
        />
        
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg blur-lg -z-10"
          />
        )}
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className={`transition-colors ${getCharCountColor()}`}>
          {charCount} / {maxLength} characters
        </span>
        {charPercentage >= 90 && (
          <span className="text-red-500 animate-pulse">
            Approaching limit!
          </span>
        )}
      </div>
    </motion.div>
  );
}
