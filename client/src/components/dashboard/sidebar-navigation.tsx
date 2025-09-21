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
  FileText,
  Users,
  DollarSign,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  Bell,
  HelpCircle,
  LogOut,
  Download,
  Rocket,
  Brain,
  Presentation,
  Calculator,
  BarChart3,
  Plus
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { ThemeToggle } from "@/components/theme-toggle";

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
    staleTime: 0,
    gcTime: 0,
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

  // Simplified main navigation - only core features
  const mainNavigation: NavigationItem[] = [
    {
      id: "dashboard",
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "submit-idea",
      name: "Submit Idea",
      href: "/submit-idea",
      icon: Lightbulb,
    },
    {
      id: "idea-analysis",
      name: "Idea Analysis",
      href: "/intelligent-analysis",
      icon: Brain,
    },
    {
      id: "business-plan",
      name: "Business Plan",
      href: "/business-plan",
      icon: FileText,
    },
    {
      id: "pitch-deck",
      name: "Pitch Deck",
      href: "/pitch-deck",
      icon: Presentation,
    },
    {
      id: "financial-modeling",
      name: "Financial Model",
      href: "/financial-modeling",
      icon: Calculator,
    },
  ];

  // Essential tools only
  const toolsNavigation: NavigationItem[] = [
    {
      id: "investors",
      name: "Find Investors",
      href: "/investor-matching",
      icon: Users,
      badge: "New",
    },
    {
      id: "mvp-builder",
      name: "MVP Builder",
      href: "/mvp-builder",
      icon: Rocket,
      badge: "New",
    },
    {
      id: "ai-showcase",
      name: "AI Tools",
      href: "/ai-showcase",
      icon: Brain,
      badge: "Hot",
    },
    {
      id: "export",
      name: "Export Center",
      href: "/export",
      icon: Download,
    },
  ];

  const filteredNavigation = mainNavigation.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTools = toolsNavigation.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const NavItem = ({ item }: { item: NavigationItem }) => {
    const isActive = location === item.href;
    const IconComponent = item.icon;

    return (
      <Link href={item.href}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={`w-full justify-start h-11 px-4 mb-1 ${
            collapsed ? "px-3" : ""
          } ${isActive ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
          data-testid={`nav-${item.id}`}
        >
          <IconComponent className={`h-5 w-5 ${collapsed ? "" : "mr-3"} flex-shrink-0`} />
          {!collapsed && (
            <div className="flex items-center justify-between w-full">
              <span className="font-medium">{item.name}</span>
              {item.badge && (
                <Badge 
                  variant="secondary"
                  className={`text-xs ${
                    item.badge === "New"
                      ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                      : item.badge === "Hot"
                      ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                      : "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400"
                  }`}
                >
                  {item.badge}
                </Badge>
              )}
              {item.count && (
                <Badge variant="outline" className="text-xs">
                  {item.count}
                </Badge>
              )}
            </div>
          )}
        </Button>
      </Link>
    );
  };

  return (
    <div className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen ${
      collapsed ? "w-20" : "w-72"
    } transition-all duration-300 ${className}`}>
      
      {/* Header */}
      <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${collapsed ? "p-3" : ""}`}>
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold text-gray-900 dark:text-white">MyStartup.ai</span>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-2">
            {!collapsed && <ThemeToggle />}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              data-testid="button-toggle-sidebar"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        {!collapsed && (
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                data-testid="input-search"
              />
            </div>
          </div>
        )}
      </div>

      {/* User Profile Section - Always visible */}
      <div className={`border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 ${collapsed ? "p-3" : "p-4"}`}>
        {!collapsed && user && (
          <div className="flex items-center space-x-3" data-testid="profile-section">
            <Avatar className="h-10 w-10 ring-2 ring-blue-100 dark:ring-blue-900">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold">
                {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 dark:text-white truncate" data-testid="text-user-name">
                {user.name || 'User'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate" data-testid="text-user-email">
                {user.email || 'No email'}
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Logout"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}

        {collapsed && user && (
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-blue-100 dark:ring-blue-900">
                <AvatarImage src={user.avatar || undefined} />
                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold">
                  {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        )}
      </div>

      {/* Navigation - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <nav className={`space-y-6 ${collapsed ? "p-2" : "p-4"}`}>
          
          {/* Main Features */}
          <div>
            {!collapsed && (
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                Core Features
              </h3>
            )}
            <div className="space-y-1">
              {filteredNavigation.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            {!collapsed && (
              <>
                <Separator className="my-4" />
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                  Tools & Extras
                </h3>
              </>
            )}
            <div className="space-y-1">
              {filteredTools.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Footer Actions */}
      <div className={`border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 ${collapsed ? "p-2" : "p-4"}`}>
        {!collapsed && (
          <div className="space-y-2">
            {/* Quick Actions */}
            <div className="flex space-x-2">
              <Link href="/profile" className="flex-1">
                <Button variant="outline" size="sm" className="w-full justify-start h-9" data-testid="button-profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="px-3" title="Notifications" data-testid="button-notifications">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Link href="/settings" className="flex-1">
                <Button variant="outline" size="sm" className="w-full justify-start h-9" data-testid="button-settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="px-3" title="Help" data-testid="button-help">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="space-y-2 flex flex-col items-center">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="w-10 h-10 p-0" data-testid="button-profile-collapsed">
                <User className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="w-10 h-10 p-0" title="Notifications" data-testid="button-notifications-collapsed">
              <Bell className="h-4 w-4" />
            </Button>
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="w-10 h-10 p-0" data-testid="button-settings-collapsed">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}