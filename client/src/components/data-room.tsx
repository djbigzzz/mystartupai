import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  Lock,
  Unlock,
  Shield,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Share2,
  FolderOpen,
  Building,
  DollarSign,
  Scale,
  Target,
  TrendingUp,
  Lightbulb
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: "financial" | "legal" | "business" | "technical" | "marketing";
  category: string;
  size: string;
  lastModified: string;
  status: "complete" | "draft" | "review" | "missing";
  confidentiality: "public" | "confidential" | "restricted";
  uploadedBy: string;
  description: string;
}

interface DataRoomProps {
  companyData: any;
}

export default function DataRoom({ companyData }: DataRoomProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const documents: Document[] = [
    {
      id: "1",
      name: "Business Plan Executive Summary",
      type: "business",
      category: "Business Strategy",
      size: "2.4 MB",
      lastModified: "2 hours ago",
      status: "complete",
      confidentiality: "confidential",
      uploadedBy: "Company Admin",
      description: "Comprehensive executive summary outlining business strategy, market opportunity, and growth projections."
    },
    {
      id: "2",
      name: "Financial Projections 2024-2027",
      type: "financial",
      category: "Financial Documents",
      size: "1.8 MB",
      lastModified: "1 day ago",
      status: "complete",
      confidentiality: "restricted",
      uploadedBy: "CFO",
      description: "Detailed financial forecasts including revenue projections, cost analysis, and cash flow statements."
    },
    {
      id: "3",
      name: "Articles of Incorporation",
      type: "legal",
      category: "Legal Documents",
      size: "892 KB",
      lastModified: "3 days ago",
      status: "complete",
      confidentiality: "public",
      uploadedBy: "Legal Counsel",
      description: "Official incorporation documents and company registration certificates."
    },
    {
      id: "4",
      name: "Market Research Report",
      type: "marketing",
      category: "Market Analysis",
      size: "5.2 MB",
      lastModified: "5 days ago",
      status: "complete",
      confidentiality: "confidential",
      uploadedBy: "Marketing Director",
      description: "Comprehensive market analysis including competitor research, target demographics, and market sizing."
    },
    {
      id: "5",
      name: "Technical Architecture Documentation",
      type: "technical",
      category: "Product Development",
      size: "3.1 MB",
      lastModified: "1 week ago",
      status: "draft",
      confidentiality: "confidential",
      uploadedBy: "CTO",
      description: "Technical specifications, system architecture diagrams, and development roadmap."
    },
    {
      id: "6",
      name: "Intellectual Property Portfolio",
      type: "legal",
      category: "Legal Documents",
      size: "1.4 MB",
      lastModified: "2 weeks ago",
      status: "review",
      confidentiality: "restricted",
      uploadedBy: "Legal Counsel",
      description: "Patents, trademarks, copyrights, and other intellectual property documentation."
    }
  ];

  const categories = [
    { id: "all", name: "All Documents", icon: FolderOpen, count: documents.length },
    { id: "business", name: "Business Strategy", icon: Target, count: documents.filter(d => d.type === "business").length },
    { id: "financial", name: "Financial", icon: DollarSign, count: documents.filter(d => d.type === "financial").length },
    { id: "legal", name: "Legal", icon: Scale, count: documents.filter(d => d.type === "legal").length },
    { id: "technical", name: "Technical", icon: Lightbulb, count: documents.filter(d => d.type === "technical").length },
    { id: "marketing", name: "Marketing", icon: TrendingUp, count: documents.filter(d => d.type === "marketing").length }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "review": return "bg-blue-100 text-blue-800";
      case "missing": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getConfidentialityIcon = (level: string) => {
    switch (level) {
      case "public": return <Unlock className="w-4 h-4 text-green-600" />;
      case "confidential": return <Lock className="w-4 h-4 text-yellow-600" />;
      case "restricted": return <Shield className="w-4 h-4 text-red-600" />;
      default: return <Lock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "business": return <Target className="w-5 h-5 text-blue-600" />;
      case "financial": return <DollarSign className="w-5 h-5 text-green-600" />;
      case "legal": return <Scale className="w-5 h-5 text-purple-600" />;
      case "technical": return <Lightbulb className="w-5 h-5 text-orange-600" />;
      case "marketing": return <TrendingUp className="w-5 h-5 text-pink-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const completionRate = Math.round((documents.filter(d => d.status === "complete").length / documents.length) * 100);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Data Room</h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Secure document repository for all your business-critical files. Organize, share, and manage access to important documents for investors, partners, and team members.
        </p>
      </div>

      {/* Data Room Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Documents</p>
                <p className="text-2xl font-bold text-slate-900">{documents.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completion Rate</p>
                <p className="text-2xl font-bold text-slate-900">{completionRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <Progress value={completionRate} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Access Requests</p>
                <p className="text-2xl font-bold text-slate-900">12</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Last Updated</p>
                <p className="text-2xl font-bold text-slate-900">2h</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Document Overview</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="access">Access Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

          {/* Documents List */}
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        {getTypeIcon(doc.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-slate-900">{doc.name}</h3>
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                          {getConfidentialityIcon(doc.confidentiality)}
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{doc.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span>{doc.category}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>Modified {doc.lastModified}</span>
                          <span>•</span>
                          <span>by {doc.uploadedBy}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              
              return (
                <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <p className="text-sm text-slate-500">{category.count} documents</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {documents
                        .filter(doc => category.id === "all" || doc.type === category.id)
                        .slice(0, 3)
                        .map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                            <span className="text-sm text-slate-700 truncate">{doc.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {doc.status}
                            </Badge>
                          </div>
                        ))}
                      {documents.filter(doc => category.id === "all" || doc.type === category.id).length > 3 && (
                        <p className="text-xs text-slate-500 text-center pt-2">
                          +{documents.filter(doc => category.id === "all" || doc.type === category.id).length - 3} more
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Access Permissions</CardTitle>
              <CardDescription>
                Manage who can view and access documents in your data room
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-medium">Team Members</h3>
                    <p className="text-2xl font-bold text-blue-600">8</p>
                    <p className="text-xs text-slate-500">Full Access</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Building className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-medium">Investors</h3>
                    <p className="text-2xl font-bold text-green-600">3</p>
                    <p className="text-xs text-slate-500">Limited Access</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-medium">Advisors</h3>
                    <p className="text-2xl font-bold text-purple-600">5</p>
                    <p className="text-xs text-slate-500">View Only</p>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Recent Access Requests</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Investor Portal Access</p>
                        <p className="text-xs text-slate-500">Requested by john@investor.com</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Deny</Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Scale className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Legal Document Access</p>
                        <p className="text-xs text-slate-500">Requested by legal@advisor.com</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Deny</Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}