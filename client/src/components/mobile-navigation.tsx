import React, { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  Sparkles
} from "lucide-react";

const navigationSections = [
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
      { href: "/financial-modeling", label: "Financial Model", icon: Calculator },
      { href: "/market-research", label: "Market Research", icon: Search },
    ]
  },
  {
    title: "Building & Growth",
    items: [
      { href: "/mvp-builder", label: "MVP Builder", icon: Building },
      { href: "/investor-matching", label: "Find Investors", icon: Users },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/funding", label: "Funding Tools", icon: Briefcase },
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

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

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
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-6">
              {navigationSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.href} href={item.href}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 h-12 px-3 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-95 transition-all duration-200"
                            onClick={() => setIsOpen(false)}
                            data-testid={`mobile-nav-${item.href.replace('/', '')}`}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
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