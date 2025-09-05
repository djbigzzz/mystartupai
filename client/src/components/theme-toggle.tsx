import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="border-2 hover:scale-105 transition-transform"
    >
      {theme === "light" ? (
        <>
          <Moon className="w-4 h-4 mr-2" />
          Dark
        </>
      ) : (
        <>
          <Sun className="w-4 h-4 mr-2" />
          Light
        </>
      )}
    </Button>
  );
}