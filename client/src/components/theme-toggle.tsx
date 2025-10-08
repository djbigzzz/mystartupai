import { Moon, Sun, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const getThemeIcon = () => {
    if (theme === "light") {
      return (
        <>
          <Sun className="w-4 h-4 mr-2" />
          Light
        </>
      );
    } else if (theme === "dark") {
      return (
        <>
          <Moon className="w-4 h-4 mr-2" />
          Dark
        </>
      );
    } else {
      return (
        <>
          <Sparkles className="w-4 h-4 mr-2" />
          Web3
        </>
      );
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="border-2 hover:scale-105 transition-transform"
      data-testid="button-theme-toggle"
    >
      {getThemeIcon()}
    </Button>
  );
}