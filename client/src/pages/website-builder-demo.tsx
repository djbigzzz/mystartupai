import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Globe, 
  Smartphone, 
  Monitor, 
  Palette,
  Type,
  Image,
  Code,
  AlertCircle,
  Eye,
  Edit,
  Download,
  Share,
  Zap,
  Layers,
  Settings
} from "lucide-react";

export default function WebsiteBuilderDemo() {
  const websiteProjects = [
    {
      id: 1,
      name: "EcoTracker Landing Page",
      type: "Landing Page",
      status: "Published",
      progress: 100,
      url: "ecotracker.com",
      lastUpdated: "2 hours ago",
      visitors: "1,247",
      conversion: "8.3%"
    },
    {
      id: 2,
      name: "Product Documentation",
      type: "Documentation",
      status: "In Progress",
      progress: 75,
      url: "docs.ecotracker.com",
      lastUpdated: "1 day ago",
      visitors: "432",
      conversion: "N/A"
    },
    {
      id: 3,
      name: "Company Blog",
      type: "Blog",
      status: "Draft",
      progress: 45,
      url: "blog.ecotracker.com",
      lastUpdated: "3 days ago",
      visitors: "0",
      conversion: "N/A"
    }
  ];

  const templates = [
    {
      name: "SaaS Landing",
      category: "Business",
      preview: "/api/placeholder/300/200",
      features: ["Hero Section", "Features Grid", "Pricing Table", "CTA Forms"]
    },
    {
      name: "Tech Startup",
      category: "Technology",
      preview: "/api/placeholder/300/200",
      features: ["Modern Design", "Team Section", "Product Demo", "Contact Form"]
    },
    {
      name: "E-commerce",
      category: "Retail",
      preview: "/api/placeholder/300/200",
      features: ["Product Catalog", "Shopping Cart", "Payment Integration", "Reviews"]
    },
    {
      name: "Portfolio",
      category: "Creative",
      preview: "/api/placeholder/300/200",
      features: ["Gallery", "About Section", "Contact Info", "Social Links"]
    }
  ];

  const designTools = [
    {
      name: "AI Content Generator",
      description: "Generate website copy with AI",
      icon: Zap,
      status: "Available"
    },
    {
      name: "Smart Layout Engine",
      description: "Automatic responsive layouts",
      icon: Layers,
      status: "Available"
    },
    {
      name: "Brand Color Picker",
      description: "Extract colors from your logo",
      icon: Palette,
      status: "Available"
    },
    {
      name: "SEO Optimizer",
      description: "Optimize for search engines",
      icon: Settings,
      status: "Available"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Draft": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Globe className="w-8 h-8 mr-3 text-blue-600" />
                AI Website Builder
                <Badge className="ml-3 bg-orange-50 text-orange-600 border-orange-200">
                  Demo
                </Badge>
              </h1>
              <p className="text-gray-600 mt-2">Build professional websites with AI-powered tools</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <AlertCircle className="w-4 h-4 mr-2" />
                This is a demo
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Globe className="w-4 h-4 mr-2" />
                Create New Site
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sites</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                  <p className="text-2xl font-bold text-gray-900">1,679</p>
                </div>
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Load Time</p>
                  <p className="text-2xl font-bold text-gray-900">1.2s</p>
                </div>
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mobile Score</p>
                  <p className="text-2xl font-bold text-gray-900">98%</p>
                </div>
                <Smartphone className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Website Projects */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Websites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {websiteProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.type} • {project.url}</p>
                      <p className="text-xs text-gray-500">Updated {project.lastUpdated}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{project.visitors}</p>
                      <p className="text-xs text-gray-600">Visitors</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{project.conversion}</p>
                      <p className="text-xs text-gray-600">Conversion</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Templates and Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Website Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                      <Monitor className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{template.category}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.features.slice(0, 2).map((feature, featureIndex) => (
                          <Badge key={featureIndex} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {template.features.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.features.length - 2} more
                          </Badge>
                        )}
                      </div>
                      <Button size="sm" className="w-full">
                        Use Template
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Tools */}
          <Card>
            <CardHeader>
              <CardTitle>AI Design Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {designTools.map((tool, index) => {
                  const IconComponent = tool.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{tool.name}</h4>
                          <p className="text-sm text-gray-600">{tool.description}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Try Now
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Smartphone className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-medium text-gray-900 mb-2">Mobile-First Design</h3>
              <p className="text-sm text-gray-600">All websites are optimized for mobile devices with responsive design</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Zap className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-medium text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-sm text-gray-600">Optimized for speed with CDN delivery and image compression</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Settings className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-medium text-gray-900 mb-2">SEO Optimized</h3>
              <p className="text-sm text-gray-600">Built-in SEO tools to help your website rank higher in search</p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Notice */}
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-800">Demo Mode</h3>
                <p className="text-sm text-orange-700 mt-1">
                  This website builder shows sample projects and templates. In the full version, you'll get access to 
                  professional templates, AI-powered content generation, custom domain management, analytics integration, 
                  and one-click deployment with SSL certificates.
                </p>
                <div className="flex space-x-3 mt-3">
                  <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    View Live Templates
                  </Button>
                  <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    See AI Features
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}