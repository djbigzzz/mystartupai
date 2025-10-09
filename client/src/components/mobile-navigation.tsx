import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/auth-context";
import { 
  Menu, 
  Home, 
  Lightbulb, 
  FileText, 
  Presentation, 
  Calculator, 
  Search, 
  Users, 
  Building, 
  BarChart3,
  Briefcase,
  Target,
  Rocket,
  User,
  Settings,
  Sparkles,
  Lock,
  Crown,
  Loader2
} from "lucide-react";

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  minTier?: "FREEMIUM" | "CORE" | "PRO";
  comingSoon?: boolean;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const navigationSections: NavigationSection[] = [
  {
    title: "Getting Started",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: Settings },
      { href: "/submit-idea", label: "Submit Your Idea", icon: Lightbulb },
    ]
  },
  {
    title: "Core Development", 
    items: [
      { href: "/business-plan", label: "Business Plan", icon: FileText },
      { href: "/pitch-deck", label: "Pitch Deck", icon: Presentation },
      { href: "/financial-modeling", label: "Financial Model", icon: Calculator, minTier: "CORE" },
      { href: "/market-research", label: "Market Research", icon: Search, minTier: "CORE" },
    ]
  },
  {
    title: "Building & Growth",
    items: [
      { href: "/mvp-builder", label: "MVP Builder", icon: Building, minTier: "PRO", comingSoon: true },
      { href: "/investor-matching", label: "Find Investors", icon: Users, minTier: "PRO", comingSoon: true },
      { href: "/analytics", label: "Analytics", icon: BarChart3, minTier: "CORE" },
      { href: "/funding", label: "Funding Tools", icon: Briefcase, minTier: "CORE" },
    ]
  },
  {
    title: "Management",
    items: [
      { href: "/export", label: "Export Center", icon: Target },
      { href: "/profile", label: "Profile", icon: User },
    ]
  }
];

const TIER_HIERARCHY: Record<string, number> = {
  "FREEMIUM": 1,
  "CORE": 2,
  "PRO": 3,
};

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();

  // Use AuthContext for reliable user data
  const { user, isLoading } = useAuth();

  const userTier = user?.currentPlan || "FREEMIUM";
  const userTierLevel = TIER_HIERARCHY[userTier] || 1;

  const isLocked = (item: NavigationItem) => {
    if (!item.minTier) return false;
    const requiredLevel = TIER_HIERARCHY[item.minTier] || 1;
    return userTierLevel < requiredLevel;
  };

  const handleNavClick = (item: NavigationItem, e: React.MouseEvent) => {
    // Block navigation while auth is loading to prevent race condition
    if (isLoading) {
      e.preventDefault();
      return;
    }
    
    if (isLocked(item)) {
      e.preventDefault();
      setLocation("/purchase-credits");
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border-border/50 shadow-lg lg:hidden"
          data-testid="mobile-nav-trigger"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0 sm:w-96">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">MyStartup.AI</h2>
                <p className="text-sm text-muted-foreground">Your AI Co-Founder</p>
              </div>
            </div>
            {user && (
              <div className="mt-3 flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  {userTier}
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <nav className="space-y-6">
                {navigationSections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const locked = isLocked(item);
                        
                        return (
                          <Link key={item.href} href={locked ? "#" : item.href}>
                            <Button
                              variant="ghost"
                              className={`w-full justify-between gap-3 h-12 px-3 text-sm transition-all duration-200 ${
                                locked 
                                  ? "opacity-60 cursor-pointer hover:bg-muted/50" 
                                  : "hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-95"
                              }`}
                              onClick={(e) => handleNavClick(item, e)}
                              data-testid={`mobile-nav-${item.href.replace('/', '')}`}
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="h-5 w-5" />
                                <span>{item.label}</span>
                              </div>
                              {locked && (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              )}
                              {item.comingSoon && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                                  Soon
                                </Badge>
                              )}
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            )}
          </div>
          
          <div className="p-4 border-t border-border bg-gray-50 dark:bg-gray-800/50">
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                Your Agentic AI Co-Founder
              </p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
