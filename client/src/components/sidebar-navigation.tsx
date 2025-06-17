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
    { id: "profile", name: "Company Profile", icon: User, type: "main" },
    { id: "modules", name: "Business Strategy", icon: Target, type: "main" },
    { id: "product", name: "Product Development", icon: Lightbulb, type: "main" },
    { id: "financial", name: "Financial Planning", icon: TrendingUp, type: "main" },
    { id: "marketing", name: "Marketing Strategy", icon: Target, type: "main" },
    { id: "legal", name: "Legal Foundation", icon: Scale, type: "main" },
    { id: "funding", name: "Funding & Investment", icon: DollarSign, type: "main" },
    { id: "mvp-builder", name: "Build MVP", icon: Code, type: "main" },
    { id: "launch", name: "Launch & Scale", icon: Rocket, type: "main" }
  ];

  const quickActions: NavigationItem[] = [
    { id: "documents", name: "Documents", icon: FolderOpen, type: "tool" },
    { id: "events", name: "Events & Networking", icon: Calendar, type: "tool" },
    { id: "partners", name: "Partners & Team", icon: UserPlus, type: "tool" },
    { id: "settings", name: "Settings", icon: Settings, type: "tool" }
  ];

  const handleNavClick = (item: NavigationItem) => {
    if (item.type === "main") {
      if (item.id === "home") {
        setLocation("/");
      } else if (item.id === "modules") {
        onStepChange("modules");
      } else if (item.id === "mvp-builder") {
        onStepChange("mvp-builder");
      } else if (item.id === "funding") {
        onStepChange("investors");
      } else if (item.id === "launch") {
        onStepChange("networking");
      } else {
        onStepChange(item.id);
      }
    } else if (item.type === "tool") {
      if (item.id === "events") {
        onStepChange("networking");
      } else {
        onStepChange(item.id);
      }
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
              (item.id === "funding" && currentStep === "investors") ||
              (item.id === "launch" && currentStep === "networking") ||
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
            
            {/* Quick Actions Section */}
            <div className="p-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-1">
                {quickActions.map((action) => {
                  const IconComponent = action.icon;
                  const isActive = currentStep === action.id;
                  
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleNavClick(action)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="text-sm">{action.name}</span>
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