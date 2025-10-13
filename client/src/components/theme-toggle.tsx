import { Moon, Sun, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Light Theme */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("light")}
        className={`px-3 py-1.5 transition-all ${
          theme === 'light' 
            ? 'bg-white dark:bg-gray-700 shadow-sm' 
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        data-testid="button-theme-light"
      >
        <Sun className={`w-4 h-4 ${theme === 'light' ? 'text-yellow-500' : 'text-gray-500'}`} />
      </Button>

      {/* Dark Theme */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("dark")}
        className={`px-3 py-1.5 transition-all ${
          theme === 'dark' 
            ? 'bg-white dark:bg-gray-700 shadow-sm' 
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        data-testid="button-theme-dark"
      >
        <Moon className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-500' : 'text-gray-500'}`} />
      </Button>

      {/* Cypherpunk Theme */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("cypherpunk")}
        className={`px-3 py-1.5 transition-all ${
          theme === 'cypherpunk' 
            ? 'bg-black border border-green-500 shadow-[0_0_20px_rgba(0,255,65,0.5)]' 
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        data-testid="button-theme-cypherpunk"
      >
        <Skull className={`w-4 h-4 ${theme === 'cypherpunk' ? 'text-green-500 drop-shadow-[0_0_8px_rgba(0,255,65,1)]' : 'text-gray-500'}`} />
      </Button>
    </div>
  );
}