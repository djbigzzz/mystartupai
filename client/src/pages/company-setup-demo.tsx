import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Building, 
  CheckCircle, 
  Clock, 
  FileText,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield
} from "lucide-react";

export default function CompanySetupDemo() {
  const setupSteps = [
    {
      title: "Business Registration",
      description: "Choose structure and register with state",
      status: "complete",
      progress: 100,
      items: ["LLC Formation", "EIN Application", "State Registration"]
    },
    {
      title: "Legal Documentation",
      description: "Essential legal documents and agreements",
      status: "in-progress",
      progress: 75,
      items: ["Operating Agreement", "Terms of Service", "Privacy Policy"]
    },
    {
      title: "Banking & Finance",
      description: "Business accounts and financial setup",
      status: "in-progress",
      progress: 50,
      items: ["Business Bank Account", "Accounting System", "Payment Processing"]
    },
    {
      title: "Compliance & Taxes",
      description: "Tax registrations and compliance setup",
      status: "pending",
      progress: 25,
      items: ["Tax ID Registration", "Sales Tax Setup", "Business Licenses"]
    },
    {
      title: "Insurance & Protection",
      description: "Business insurance and liability protection",
      status: "pending",
      progress: 0,
      items: ["General Liability", "Professional Liability", "Cyber Insurance"]
    }
  ];

  const companyProfile = {
    name: "CryptoCafe Technologies LLC",
    structure: "Limited Liability Company (LLC)",
    ein: "88-1234567",
    founded: "January 15, 2025",
    state: "Delaware",
    address: "123 Innovation Drive, Wilmington, DE 19801",
    phone: "(555) 123-4567",
    email: "hello@cryptocafe.com",
    website: "www.cryptocafe.com",
    industry: "Financial Technology"
  };

  const filingStatus = [
    { document: "Articles of Organization", status: "Filed", date: "Jan 15, 2025", cost: "$89" },
    { document: "EIN Application", status: "Approved", date: "Jan 16, 2025", cost: "Free" },
    { document: "Operating Agreement", status: "In Review", date: "Jan 18, 2025", cost: "$299" },
    { document: "Business License", status: "Pending", date: "Jan 20, 2025", cost: "$150" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "Filed": case "Approved": return "bg-green-100 text-green-800";
      case "In Review": return "bg-blue-100 text-blue-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete": case "Filed": case "Approved": return <CheckCircle className="w-4 h-4" />;
      case "in-progress": case "In Review": return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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
                <Building className="w-8 h-8 mr-3 text-blue-600" />
                Company Setup
                <Badge className="ml-3 bg-orange-50 text-orange-600 border-orange-200">
                  Demo
                </Badge>
              </h1>
              <p className="text-gray-600 mt-2">Complete your business formation and legal compliance</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <AlertCircle className="w-4 h-4 mr-2" />
                This is a demo
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Start Setup
              </Button>
            </div>
          </div>
        </div>

        {/* Company Profile Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Company Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-600">Company Name</Label>
                <p className="text-lg font-semibold text-gray-900">{companyProfile.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Business Structure</Label>
                <p className="text-gray-900">{companyProfile.structure}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">EIN</Label>
                <p className="text-gray-900">{companyProfile.ein}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Founded</Label>
                <p className="text-gray-900">{companyProfile.founded}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">State of Incorporation</Label>
                <p className="text-gray-900">{companyProfile.state}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Industry</Label>
                <p className="text-gray-900">{companyProfile.industry}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-gray-900">{companyProfile.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-gray-900">{companyProfile.phone}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-gray-900">{companyProfile.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-gray-900">{companyProfile.website}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Setup Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Progress Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Setup Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {setupSteps.map((step, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getStatusColor(step.status)}`}>
                          {getStatusIcon(step.status)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{step.title}</h4>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(step.status)}>
                        {step.status}
                      </Badge>
                    </div>
                    
                    <Progress value={step.progress} className="h-2" />
                    
                    <div className="grid grid-cols-1 gap-2 ml-11">
                      {step.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filing Status */}
          <Card>
            <CardHeader>
              <CardTitle>Filing Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filingStatus.map((filing, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{filing.document}</h4>
                      <p className="text-sm text-gray-600">Filed: {filing.date}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(filing.status)}>
                        {filing.status}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">{filing.cost}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Shield className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-medium text-gray-900 mb-2">Business Insurance</h3>
              <p className="text-sm text-gray-600 mb-4">Get quotes for liability and professional insurance</p>
              <Button size="sm" variant="outline" className="w-full">
                Get Quotes
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <FileText className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-medium text-gray-900 mb-2">Legal Templates</h3>
              <p className="text-sm text-gray-600 mb-4">Download essential legal document templates</p>
              <Button size="sm" variant="outline" className="w-full">
                Download
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Building className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-medium text-gray-900 mb-2">Registered Agent</h3>
              <p className="text-sm text-gray-600 mb-4">Set up registered agent service</p>
              <Button size="sm" variant="outline" className="w-full">
                Setup Service
              </Button>
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
                  This company setup wizard shows a sample business formation process. In the full version, you'll get 
                  step-by-step guidance for actual business registration, legal document generation, compliance tracking, 
                  and connections to professional services like attorneys and accountants.
                </p>
                <div className="flex space-x-3 mt-3">
                  <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    View Formation Guide
                  </Button>
                  <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    Connect with Attorney
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