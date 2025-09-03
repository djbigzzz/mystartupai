import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  HelpCircle,
  LogOut,
  Download,
  Target,
  Rocket,
  Code,
  Brain
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  count?: number;
}

interface User {
  id: number;
  email: string | null;
  name: string | null;
  username: string | null;
  avatar: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SidebarNavigationProps {
  className?: string;
}

export default function SidebarNavigation({ className }: SidebarNavigationProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location] = useLocation();
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: user, isLoading: userLoading, error: userError, refetch } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: 1,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache the response
  });

  // Debug logging
  console.log('Sidebar - User data:', user);
  console.log('Sidebar - User loading:', userLoading);
  console.log('Sidebar - User error:', userError);
  
  // Attempt to refetch if we get null user but no error
  React.useEffect(() => {
    if (!userLoading && !user && !userError) {
      console.log('Sidebar - No user data, attempting refetch...');
      refetch();
    }
  }, [user, userLoading, userError, refetch]);

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("/api/auth/logout", {
      method: "POST",
    }),
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/app';
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

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
      badge: "Demo",
    },
    {
      id: "business-plans",
      name: "Business Plans",
      href: "/business-plans",
      icon: FileText,
      badge: "Demo",
    },
    {
      id: "investors",
      name: "Investor Matching",
      href: "/investor-matching",
      icon: Users,
      badge: "New",
    },
    {
      id: "funding",
      name: "Funding",
      href: "/funding",
      icon: DollarSign,
      badge: "Demo",
    },
  ];

  const businessTools: NavigationItem[] = [
    {
      id: "mvp-builder",
      name: "MVP Builder",
      href: "/mvp-builder",
      icon: Rocket,
      badge: "New",
    },
    {
      id: "company-setup",
      name: "Company Setup",
      href: "/company-setup",
      icon: Building,
      badge: "Demo",
    },
    {
      id: "website-builder",
      name: "Website Builder",
      href: "/website-builder",
      icon: Globe,
      badge: "Demo",
    },
    {
      id: "legal",
      name: "Legal & Compliance",
      href: "/legal",
      icon: Shield,
      badge: "Demo",
    },
    {
      id: "schedule",
      name: "Schedule",
      href: "/schedule",
      icon: Calendar,
      badge: "Demo",
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
      id: "export",
      name: "Export Center",
      href: "/export",
      icon: Download,
    },
    {
      id: "investor-demo",
      name: "Investor Demo",
      href: "/investor-demo",
      icon: Target,
      badge: "New",
    },
    {
      id: "ai-showcase",
      name: "AI Showcase",
      href: "/ai-showcase",
      icon: Brain,
      badge: "Hot",
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
                <Badge 
                  variant={item.badge === "Demo" ? "outline" : "secondary"} 
                  className={`ml-2 text-xs ${
                    item.badge === "Demo" 
                      ? "bg-orange-50 text-orange-600 border-orange-200" 
                      : ""
                  }`}
                >
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
      <div className="p-4 border-t border-gray-200 space-y-3">
        {/* User Profile Section */}
        {!collapsed && user && (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback className="text-xs">
                {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {user.name || 'User'}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {user.email || 'No email'}
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="h-8 w-8 p-0"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Collapsed User Profile */}
        {collapsed && user && (
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar || undefined} />
                <AvatarFallback className="text-xs">
                  {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                title="Logout"
              >
                <LogOut className="h-2 w-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Pro Plan Section */}
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