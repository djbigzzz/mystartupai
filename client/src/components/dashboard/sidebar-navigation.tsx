import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard,
  User,
  Lightbulb,
  TrendingUp,
  FileText,
  Users,
  DollarSign,
  Building,
  Globe,
  Shield,
  Calendar,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Bell,
  HelpCircle
} from "lucide-react";

interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  count?: number;
}

interface SidebarNavigationProps {
  className?: string;
}

export default function SidebarNavigation({ className }: SidebarNavigationProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location] = useLocation();

  const mainNavigation: NavigationItem[] = [
    {
      id: "dashboard",
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "ideas",
      name: "My Ideas",
      href: "/ideas",
      icon: Lightbulb,
      count: 12,
    },
    {
      id: "analytics",
      name: "Analytics",
      href: "/analytics", 
      icon: TrendingUp,
    },
    {
      id: "business-plans",
      name: "Business Plans",
      href: "/business-plans",
      icon: FileText,
      count: 5,
    },
    {
      id: "investors",
      name: "Investors",
      href: "/investors",
      icon: Users,
      badge: "New",
    },
    {
      id: "funding",
      name: "Funding",
      href: "/funding",
      icon: DollarSign,
    },
  ];

  const businessTools: NavigationItem[] = [
    {
      id: "company-setup",
      name: "Company Setup",
      href: "/company-setup",
      icon: Building,
    },
    {
      id: "website-builder",
      name: "Website Builder",
      href: "/website-builder",
      icon: Globe,
    },
    {
      id: "legal",
      name: "Legal & Compliance",
      href: "/legal",
      icon: Shield,
    },
    {
      id: "calendar",
      name: "Schedule",
      href: "/calendar",
      icon: Calendar,
    },
  ];

  const quickActions: NavigationItem[] = [
    {
      id: "new-idea",
      name: "Submit New Idea",
      href: "/ideas/new",
      icon: Plus,
    },
    {
      id: "profile",
      name: "Profile",
      href: "/profile",
      icon: User,
    },
    {
      id: "notifications",
      name: "Notifications",
      href: "/notifications",
      icon: Bell,
      count: 3,
    },
    {
      id: "help",
      name: "Help & Support",
      href: "/help",
      icon: HelpCircle,
    },
    {
      id: "settings",
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const filteredNavigation = mainNavigation.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBusinessTools = businessTools.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredQuickActions = quickActions.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const NavItem = ({ item }: { item: NavigationItem }) => {
    const isActive = location === item.href;
    const IconComponent = item.icon;

    return (
      <Link href={item.href}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={`w-full justify-start h-10 px-3 ${
            collapsed ? "px-2" : ""
          } ${isActive ? "bg-blue-50 text-blue-700 border-blue-200" : "text-gray-700 hover:bg-gray-100"}`}
        >
          <IconComponent className={`h-4 w-4 ${collapsed ? "" : "mr-3"} flex-shrink-0`} />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.name}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {item.badge}
                </Badge>
              )}
              {item.count && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {item.count}
                </Badge>
              )}
            </>
          )}
        </Button>
      </Link>
    );
  };

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col ${
      collapsed ? "w-16" : "w-64"
    } transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-lg font-bold text-gray-900">MyStartup.ai</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {!collapsed && (
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-6">
          {/* Main Navigation */}
          <div>
            {!collapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Main
              </h3>
            )}
            <div className="space-y-1">
              {filteredNavigation.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Business Tools */}
          <div>
            {!collapsed && (
              <>
                <Separator className="my-4" />
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Business Tools
                </h3>
              </>
            )}
            <div className="space-y-1">
              {filteredBusinessTools.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            {!collapsed && (
              <>
                <Separator className="my-4" />
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Quick Actions
                </h3>
              </>
            )}
            <div className="space-y-1">
              {filteredQuickActions.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!collapsed && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">Pro Plan</span>
              <Badge variant="outline" className="text-xs">Active</Badge>
            </div>
            <p className="text-xs text-blue-700 mb-3">
              Unlimited ideas and premium features
            </p>
            <Button size="sm" className="w-full" variant="outline">
              Upgrade Plan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}