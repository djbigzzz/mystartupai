import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  generateBusinessPlan, 
  generatePitchDeck, 
  generateFinancialModel,
  downloadFile,
  createExportPackage,
  emailExportPackage,
  generateShareLink
} from "@/lib/export-utils";
import { 
  Download, 
  FileText, 
  Image,
  FileSpreadsheet,
  Presentation,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings,
  Share,
  Eye,
  Mail,
  Cloud
} from "lucide-react";

interface ExportItem {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: React.ComponentType<any>;
  formats: string[];
  size: string;
  lastUpdated: string;
  status: "ready" | "generating" | "outdated";
}

interface ExportPackage {
  id: string;
  name: string;
  description: string;
  items: string[];
  recommended: boolean;
}

export default function ExportCenter() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState("pdf");
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const exportItems: ExportItem[] = [
    {
      id: "business-plan",
      name: "Business Plan",
      type: "Document",
      description: "Comprehensive 20-page business plan with market analysis",
      icon: FileText,
      formats: ["PDF", "DOCX", "HTML"],
      size: "2.4 MB",
      lastUpdated: "2 hours ago",
      status: "ready"
    },
    {
      id: "pitch-deck",
      name: "Investor Pitch Deck",
      type: "Presentation",
      description: "12-slide presentation for investor meetings",
      icon: Presentation,
      formats: ["PDF", "PPTX", "PNG"],
      size: "1.8 MB",
      lastUpdated: "1 day ago",
      status: "ready"
    },
    {
      id: "financial-model",
      name: "Financial Model",
      type: "Spreadsheet",
      description: "5-year financial projections and scenarios",
      icon: FileSpreadsheet,
      formats: ["XLSX", "CSV", "PDF"],
      size: "892 KB",
      lastUpdated: "3 hours ago",
      status: "ready"
    },
    {
      id: "market-research",
      name: "Market Research Report",
      type: "Document",
      description: "Industry analysis and competitive landscape",
      icon: FileText,
      formats: ["PDF", "DOCX"],
      size: "1.2 MB",
      lastUpdated: "1 day ago",
      status: "ready"
    },
    {
      id: "product-roadmap",
      name: "Product Roadmap",
      type: "Visual",
      description: "12-month product development timeline",
      icon: Image,
      formats: ["PDF", "PNG", "SVG"],
      size: "654 KB",
      lastUpdated: "4 hours ago",
      status: "ready"
    },
    {
      id: "legal-docs",
      name: "Legal Documentation",
      type: "Package",
      description: "Terms of service, privacy policy, and agreements",
      icon: Package,
      formats: ["PDF", "ZIP"],
      size: "1.5 MB",
      lastUpdated: "2 days ago",
      status: "outdated"
    },
    {
      id: "marketing-plan",
      name: "Marketing Strategy",
      type: "Document",
      description: "Go-to-market strategy and customer acquisition",
      icon: FileText,
      formats: ["PDF", "DOCX"],
      size: "978 KB",
      lastUpdated: "6 hours ago",
      status: "generating"
    }
  ];

  const exportPackages: ExportPackage[] = [
    {
      id: "investor-package",
      name: "Investor Package",
      description: "Complete investor presentation materials",
      items: ["business-plan", "pitch-deck", "financial-model"],
      recommended: true
    },
    {
      id: "legal-package",
      name: "Legal & Compliance Package",
      description: "All legal documents and compliance materials",
      items: ["legal-docs", "business-plan"],
      recommended: false
    },
    {
      id: "complete-package",
      name: "Complete Startup Package",
      description: "All available documentation and reports",
      items: exportItems.map(item => item.id),
      recommended: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready": return "bg-green-100 text-green-800";
      case "generating": return "bg-blue-100 text-blue-800";
      case "outdated": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready": return <CheckCircle className="w-4 h-4" />;
      case "generating": return <Clock className="w-4 h-4" />;
      case "outdated": return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handlePackageSelect = (packageId: string) => {
    const package_ = exportPackages.find(p => p.id === packageId);
    if (package_) {
      setSelectedItems(package_.items);
    }
  };

  const { toast } = useToast();

  const handleExport = async () => {
    if (selectedItems.length === 0) return;
    
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      const startupData = {
        companyName: "EcoTracker Technologies",
        executiveSummary: "Revolutionary sustainability tracking platform for businesses...",
        marketAnalysis: "The global payment processing market is valued at $87.2 billion...",
        financials: "Projecting $2M ARR by year 3 with 40% gross margins...",
        marketing: "Multi-channel acquisition strategy targeting 50,000 merchants..."
      };

      const exportPromises = selectedItems.map(async (itemId, index) => {
        // Update progress
        setExportProgress((index / selectedItems.length) * 90);
        
        switch (itemId) {
          case "business-plan":
            const businessPlan = await generateBusinessPlan(startupData);
            return { name: "Business_Plan.pdf", blob: businessPlan };
          
          case "pitch-deck":
            const pitchDeck = await generatePitchDeck(startupData);
            return { name: "Investor_Pitch_Deck.pptx", blob: pitchDeck };
          
          case "financial-model":
            const financialModel = await generateFinancialModel(startupData);
            return { name: "Financial_Model.xlsx", blob: financialModel };
          
          default:
            // Generate generic document
            const genericContent = `Generated ${itemId} document for ${startupData.companyName}`;
            const blob = new Blob([genericContent], { type: 'text/plain' });
            return { name: `${itemId.replace('-', '_')}.txt`, blob };
        }
      });

      const results = await Promise.all(exportPromises);
      setExportProgress(95);

      if (exportFormat === "zip" || selectedItems.length > 1) {
        // Create ZIP package
        const packageBlob = await createExportPackage(
          results.map(r => ({ 
            id: r.name, 
            name: r.name, 
            type: 'document', 
            content: r.blob,
            lastUpdated: new Date()
          })),
          { format: exportFormat as any, items: selectedItems }
        );
        downloadFile(packageBlob, `EcoTracker_Export_Package.zip`);
      } else {
        // Download individual file
        const result = results[0];
        downloadFile(result.blob, result.name);
      }

      setExportProgress(100);
      
      toast({
        title: "Export Complete",
        description: `Successfully exported ${selectedItems.length} document${selectedItems.length > 1 ? 's' : ''}`,
      });
      
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error generating your export. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);
    }
  };

  const selectedItemsData = exportItems.filter(item => selectedItems.includes(item.id));
  const totalSize = selectedItemsData.reduce((acc, item) => {
    const sizeNum = parseFloat(item.size.split(' ')[0]);
    const unit = item.size.split(' ')[1];
    return acc + (unit === 'MB' ? sizeNum : sizeNum / 1000);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Download className="w-8 h-8 mr-3 text-blue-600" />
                Export Center
              </h1>
              <p className="text-gray-600 mt-2">Export your startup documentation and reports</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Export Settings
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleExport}
                disabled={selectedItems.length === 0 || isExporting}
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : `Export ${selectedItems.length} Items`}
              </Button>
            </div>
          </div>
        </div>

        {/* Export Progress */}
        {isExporting && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-blue-900">Generating Export Package</h3>
                <span className="text-sm text-blue-700">{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="h-2 mb-2" />
              <p className="text-sm text-blue-700">
                Processing {selectedItems.length} documents... This may take a few moments.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick Export Packages */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Export Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exportPackages.map((package_) => (
                <div 
                  key={package_.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handlePackageSelect(package_.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{package_.name}</h4>
                    {package_.recommended && (
                      <Badge className="bg-blue-100 text-blue-800">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{package_.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{package_.items.length} items</span>
                    <Button size="sm" variant="outline">
                      Select Package
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Available Documents */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Available Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exportItems.map((item) => {
                    const IconComponent = item.icon;
                    const isSelected = selectedItems.includes(item.id);
                    
                    return (
                      <div 
                        key={item.id}
                        className={`p-4 border rounded-lg transition-colors ${
                          isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleItemToggle(item.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <IconComponent className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                    <span>Type: {item.type}</span>
                                    <span>Size: {item.size}</span>
                                    <span>Updated: {item.lastUpdated}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(item.status)}>
                                  {getStatusIcon(item.status)}
                                  <span className="ml-1">{item.status}</span>
                                </Badge>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  Preview
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-3">
                              {item.formats.map((format, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {format}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Options */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Export Format
                  </label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Package</SelectItem>
                      <SelectItem value="zip">ZIP Archive</SelectItem>
                      <SelectItem value="individual">Individual Files</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Selected Items</h4>
                  {selectedItems.length === 0 ? (
                    <p className="text-sm text-gray-500">No items selected</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedItemsData.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.name}</span>
                          <span className="text-gray-500">{item.size}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Total Size:</span>
                          <span>{totalSize.toFixed(1)} MB</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sharing Options */}
            <Card>
              <CardHeader>
                <CardTitle>Sharing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={async () => {
                    if (selectedItems.length === 0) {
                      toast({
                        title: "No Items Selected",
                        description: "Please select documents to email.",
                        variant: "destructive",
                      });
                      return;
                    }
                    
                    const mockBlob = new Blob(['Mock package'], { type: 'application/zip' });
                    const success = await emailExportPackage("investor@example.com", mockBlob);
                    
                    if (success) {
                      toast({
                        title: "Email Sent",
                        description: "Export package has been sent to investor@example.com",
                      });
                    }
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Package
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={async () => {
                    if (selectedItems.length === 0) {
                      toast({
                        title: "No Items Selected",
                        description: "Please select documents to share.",
                        variant: "destructive",
                      });
                      return;
                    }
                    
                    const mockBlob = new Blob(['Mock package'], { type: 'application/zip' });
                    const shareUrl = await generateShareLink(mockBlob);
                    
                    navigator.clipboard.writeText(shareUrl);
                    toast({
                      title: "Share Link Generated",
                      description: "Link copied to clipboard. Expires in 7 days.",
                    });
                  }}
                >
                  <Share className="w-4 h-4 mr-2" />
                  Generate Share Link
                </Button>
                <Button variant="outline" className="w-full">
                  <Cloud className="w-4 h-4 mr-2" />
                  Save to Cloud
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Exports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Exports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Investor Package", date: "Jan 18, 2025", size: "4.2 MB", downloads: 3 },
                { name: "Complete Business Plan", date: "Jan 15, 2025", size: "2.4 MB", downloads: 1 },
                { name: "Financial Model", date: "Jan 12, 2025", size: "892 KB", downloads: 2 }
              ].map((export_, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{export_.name}</h4>
                    <p className="text-sm text-gray-600">
                      Exported on {export_.date} • {export_.size} • {export_.downloads} downloads
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    Re-download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}