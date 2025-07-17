import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Search, 
  UserPlus, 
  Filter,
  Home,
  User,
  Building2,
  TrendingUp,
  Package,
  DollarSign,
  Megaphone,
  FileText,
  Presentation,
  Globe,
  Briefcase,
  Calendar,
  Users,
  Settings,
  MoreHorizontal,
  Lock,
  Sparkles
} from "lucide-react";

interface DashboardModule {
  id: string;
  name: string;
  icon: any;
  taskCount: number;
  description: string;
  status: "active" | "locked" | "completed";
  category: "core" | "advanced" | "tools";
}

export default function AppDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const modules: DashboardModule[] = [
    {
      id: "profile",
      name: "MyStartup Profile",
      icon: User,
      taskCount: 3,
      description: "Complete your startup profile",
      status: "active",
      category: "core"
    },
    {
      id: "business",
      name: "Business Strategy",
      icon: Building2,
      taskCount: 8,
      description: "Define your business model",
      status: "locked",
      category: "core"
    },
    {
      id: "marketing",
      name: "Marketing",
      icon: Megaphone,
      taskCount: 6,
      description: "Customer acquisition strategy",
      status: "locked",
      category: "core"
    },
    {
      id: "legal",
      name: "Legal",
      icon: FileText,
      taskCount: 8,
      description: "Legal foundation setup",
      status: "locked",
      category: "core"
    },
    {
      id: "roadmap",
      name: "Roadmap",
      icon: TrendingUp,
      taskCount: 8,
      description: "Product development plan",
      status: "locked",
      category: "core"
    },
    {
      id: "pitch-deck",
      name: "Pitch Deck",
      icon: Presentation,
      taskCount: 7,
      description: "Investor presentation",
      status: "locked",
      category: "core"
    },
    {
      id: "document",
      name: "Document",
      icon: FileText,
      taskCount: 5,
      description: "Document management",
      status: "locked",
      category: "advanced"
    },
    {
      id: "funding",
      name: "Funding",
      icon: DollarSign,
      taskCount: 5,
      description: "Fundraising strategy",
      status: "locked",
      category: "advanced"
    },
    {
      id: "events",
      name: "Events",
      icon: Calendar,
      taskCount: 9,
      description: "Networking and events",
      status: "locked",
      category: "tools"
    },
    {
      id: "partners",
      name: "Partners",
      icon: Users,
      taskCount: 6,
      description: "Partner management",
      status: "locked",
      category: "tools"
    },
    {
      id: "mvp-builder",
      name: "Build your MVP",
      icon: Package,
      taskCount: 3,
      description: "MVP development tools",
      status: "locked",
      category: "tools"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "locked":
        return <Badge variant="outline">Locked</Badge>;
      default:
        return null;
    }
  };

  const getModulesByCategory = (category: string) => {
    return modules.filter(module => module.category === category);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border min-h-screen">
          <div className="p-4">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="ml-3 text-lg font-semibold text-foreground">mystartup.ai</span>
            </div>
            
            <nav className="space-y-2">
              <Button variant="secondary" className="w-full justify-start">
                <Home className="w-4 h-4 mr-3" />
                Home
              </Button>
              
              {getModulesByCategory("core").map((module) => (
                <Button
                  key={module.id}
                  variant="ghost"
                  className="w-full justify-start"
                  disabled={module.status === "locked"}
                >
                  <module.icon className="w-4 h-4 mr-3" />
                  {module.name}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {module.taskCount}
                  </span>
                  {module.status === "locked" && <Lock className="w-3 h-3 ml-1" />}
                </Button>
              ))}
              
              <div className="pt-4">
                <p className="text-xs font-medium text-muted-foreground mb-2 px-3">ADVANCED</p>
                {getModulesByCategory("advanced").map((module) => (
                  <Button
                    key={module.id}
                    variant="ghost"
                    className="w-full justify-start"
                    disabled={module.status === "locked"}
                  >
                    <module.icon className="w-4 h-4 mr-3" />
                    {module.name}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {module.taskCount}
                    </span>
                    {module.status === "locked" && <Lock className="w-3 h-3 ml-1" />}
                  </Button>
                ))}
              </div>
              
              <div className="pt-4">
                <p className="text-xs font-medium text-muted-foreground mb-2 px-3">TOOLS</p>
                {getModulesByCategory("tools").map((module) => (
                  <Button
                    key={module.id}
                    variant="ghost"
                    className="w-full justify-start"
                    disabled={module.status === "locked"}
                  >
                    <module.icon className="w-4 h-4 mr-3" />
                    {module.name}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {module.taskCount}
                    </span>
                    {module.status === "locked" && <Lock className="w-3 h-3 ml-1" />}
                  </Button>
                ))}
              </div>
              
              <div className="pt-6 border-t border-border/50">
                <p className="text-xs font-medium text-muted-foreground mb-2 px-3">ACCOUNT</p>
                <Link href="/profile">
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-3" />
                    Profile & Settings
                  </Button>
                </Link>
              </div>
            </nav>
            
            <div className="absolute bottom-4 left-4 right-4">
              <Link href="/profile">
                <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-foreground">JD</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">John Doe</p>
                    <p className="text-xs text-muted-foreground truncate">john@startup.com</p>
                  </div>
                  <Settings className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
              </div>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add people
              </Button>
            </div>

            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back, John</h1>
              <p className="text-muted-foreground">Your current summary and activity.</p>
            </div>

            {/* Unlock Message */}
            <div className="bg-muted/50 border border-dashed border-muted-foreground/30 rounded-lg p-6 mb-8">
              <p className="text-sm text-muted-foreground text-center">
                Complete mystartup profile to unlock other sections. This will teach the AI about your business idea.
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filter</span>
              </div>
            </div>

            {/* Module Grid */}
            <div className="grid grid-cols-3 gap-6">
              {modules.map((module) => {
                const ModuleCard = ({ children }: { children: React.ReactNode }) => {
                  if (module.id === "profile" && module.status === "active") {
                    return (
                      <Link href="/startup-profile">
                        <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                          {children}
                        </Card>
                      </Link>
                    );
                  }
                  return (
                    <Card className={`cursor-pointer transition-colors ${
                      module.status === "locked" ? "opacity-60" : "hover:bg-muted/50"
                    }`}>
                      {children}
                    </Card>
                  );
                };

                return (
                  <ModuleCard key={module.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            module.status === "active" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}>
                            <module.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-medium">{module.name}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-muted-foreground">{module.taskCount} tasks</span>
                              {getStatusBadge(module.status)}
                            </div>
                          </div>
                        </div>
                        {module.status === "locked" && <Lock className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{module.description}</p>
                    </CardContent>
                  </ModuleCard>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}