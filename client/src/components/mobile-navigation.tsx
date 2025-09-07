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
  Settings
} from "lucide-react";

const navigationItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/submit-idea", label: "Submit Idea", icon: Lightbulb },
  { href: "/active-idea", label: "Your Active Idea", icon: Target },
  { href: "/business-plan", label: "Business Plan", icon: FileText },
  { href: "/pitch-deck", label: "Pitch Deck", icon: Presentation },
  { href: "/financial-modeling", label: "Financial Model", icon: Calculator },
  { href: "/market-research", label: "Market Research", icon: Search },
  { href: "/investor-matching", label: "Investor Matching", icon: Users },
  { href: "/mvp-builder", label: "MVP Builder", icon: Building },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/funding", label: "Funding", icon: Briefcase },
  { href: "/investor-demo", label: "Market Opportunity", icon: Rocket },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/dashboard", label: "Dashboard", icon: Settings },
];

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border-border/50"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">MyStartup.AI</h2>
            <p className="text-sm text-muted-foreground">Navigate to any section</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-11 px-3"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Your Agentic AI Co-Founder
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}