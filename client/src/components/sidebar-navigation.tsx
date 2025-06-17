import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Home,
  User,
  Building2,
  Target,
  TrendingUp,
  Scale,
  FileText,
  Presentation,
  Map,
  FolderOpen,
  DollarSign,
  Lightbulb,
  Users,
  Globe,
  Code,
  Calendar,
  UserPlus,
  Rocket,
  Settings,
  HelpCircle,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface SidebarNavigationProps {
  companyData: any;
  currentStep: string;
  onStepChange: (step: string) => void;
  onModuleSelect?: (moduleId: string) => void;
}

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  count?: number;
  badge?: string;
  type: "main" | "module" | "tool";
  category?: "business" | "development" | "growth" | "operations";
}

export default function SidebarNavigation({ 
  companyData, 
  currentStep, 
  onStepChange, 
  onModuleSelect 
}: SidebarNavigationProps) {
  const [, setLocation] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mainNavItems: NavigationItem[] = [
    { id: "home", name: "Home", icon: Home, type: "main" },
    { id: "profile", name: "Mystartup profile", icon: User, count: 3, type: "main" },
    { id: "modules", name: "Business", icon: Building2, count: 6, type: "main" },
    { id: "marketing", name: "Marketing", icon: Target, count: 8, type: "main" },
    { id: "legal", name: "Legal", icon: Scale, count: 8, type: "main" },
    { id: "roadmap", name: "Roadmap", icon: Map, count: 8, type: "main" },
    { id: "pitch-deck", name: "Pitch deck", icon: Presentation, count: 7, type: "main" },
    { id: "documents", name: "Document", icon: FolderOpen, count: 5, type: "main" },
    { id: "funding", name: "Funding", icon: DollarSign, count: 5, type: "main" },
    { id: "events", name: "Events", icon: Calendar, count: 9, badge: "active", type: "main" },
    { id: "partners", name: "Partners", icon: UserPlus, count: 6, type: "main" },
    { id: "mvp-builder", name: "Build your MVP", icon: Code, count: 3, type: "main" }
  ];

  const businessModules: NavigationItem[] = [
    { id: "business-strategy", name: "Business Strategy", icon: Target, type: "module", category: "business" },
    { id: "financial-modeling", name: "Financial Modeling", icon: TrendingUp, type: "module", category: "business" },
    { id: "product-development", name: "Product Development", icon: Lightbulb, type: "module", category: "development" },
    { id: "market-analysis", name: "Market Analysis", icon: TrendingUp, type: "module", category: "business" },
    { id: "team-building", name: "Team Building", icon: Users, type: "module", category: "operations" },
    { id: "market-expansion", name: "Market Expansion", icon: Globe, type: "module", category: "growth" }
  ];

  const tools: NavigationItem[] = [
    { id: "website", name: "Website Builder", icon: Globe, type: "tool" },
    { id: "investors", name: "Investor Matching", icon: DollarSign, type: "tool" },
    { id: "networking", name: "Networking Hub", icon: Users, type: "tool" },
    { id: "mvp-builder", name: "MVP Builder", icon: Code, type: "tool" }
  ];

  const handleNavClick = (item: NavigationItem) => {
    if (item.type === "main") {
      if (item.id === "home") {
        setLocation("/");
      } else if (item.id === "modules") {
        onStepChange("modules");
      } else if (item.id === "mvp-builder") {
        onStepChange("mvp-builder");
      } else if (item.id === "events") {
        onStepChange("networking");
      } else {
        onStepChange(item.id);
      }
    } else if (item.type === "module" && onModuleSelect) {
      onModuleSelect(item.id);
    } else if (item.type === "tool") {
      onStepChange(item.id);
    }
  };

  const filteredItems = mainNavItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`bg-white border-r border-slate-200 h-screen flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-slate-900">mystartup.ai</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-1">
          {(searchQuery ? filteredItems : mainNavItems).map((item) => {
            const IconComponent = item.icon;
            const isActive = currentStep === item.id || 
              (item.id === "modules" && currentStep === "modules") ||
              (item.id === "events" && currentStep === "networking") ||
              (item.id === "mvp-builder" && currentStep === "mvp-builder");
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </div>
                
                {!isCollapsed && (
                  <div className="flex items-center space-x-2">
                    {item.badge === "active" && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                    {item.count && (
                      <Badge variant="secondary" className="text-xs">
                        {item.count}
                      </Badge>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {!isCollapsed && !searchQuery && (
          <>
            <Separator className="mx-4" />
            
            {/* Business Modules Section */}
            <div className="p-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Business Modules
              </h3>
              <div className="space-y-1">
                {businessModules.map((module) => {
                  const IconComponent = module.icon;
                  const isActive = currentStep === module.id;
                  
                  return (
                    <button
                      key={module.id}
                      onClick={() => handleNavClick(module)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="text-sm">{module.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator className="mx-4" />
            
            {/* Tools Section */}
            <div className="p-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Development Tools
              </h3>
              <div className="space-y-1">
                {tools.map((tool) => {
                  const IconComponent = tool.icon;
                  const isActive = currentStep === tool.id;
                  
                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleNavClick(tool)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="text-sm">{tool.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Section */}
      {!isCollapsed && (
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {companyData?.companyName || "John Doe"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {companyData?.industry || "john@mystartup.com"}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="p-1">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {isCollapsed && (
        <div className="border-t border-slate-200 p-2">
          <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center mx-auto">
            <User className="w-4 h-4 text-slate-600" />
          </div>
        </div>
      )}
    </div>
  );
}