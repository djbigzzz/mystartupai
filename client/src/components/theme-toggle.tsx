import { Moon, Sun, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const getThemeIcon = () => {
    if (theme === "light") {
      return (
        <>
          <Sun className="w-5 h-5 mr-2" />
          <span className="font-semibold">Light</span>
        </>
      );
    } else if (theme === "dark") {
      return (
        <>
          <Moon className="w-5 h-5 mr-2" />
          <span className="font-semibold">Dark</span>
        </>
      );
    } else {
      return (
        <>
          <Terminal className="w-5 h-5 mr-2 text-green-500" />
          <span className="font-semibold font-mono text-green-500">CYPHERPUNK</span>
        </>
      );
    }
  };

  return (
    <Button
      variant="outline"
      size="default"
      onClick={toggleTheme}
      className={`border-2 hover:scale-105 transition-transform ${
        theme === 'cypherpunk' ? 'bg-black border-green-500 hover:bg-gray-900' : ''
      }`}
      data-testid="button-theme-toggle"
    >
      {getThemeIcon()}
    </Button>
  );
}