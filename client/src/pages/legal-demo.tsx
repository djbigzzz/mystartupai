import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  FileText, 
  Scale,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Edit,
  AlertCircle,
  Gavel,
  Lock,
  Users
} from "lucide-react";

export default function LegalDemo() {
  const legalDocuments = [
    {
      name: "Terms of Service",
      type: "Customer Agreement",
      status: "Current",
      lastUpdated: "Jan 15, 2025",
      compliance: "GDPR, CCPA",
      template: "SaaS Standard"
    },
    {
      name: "Privacy Policy",
      type: "Data Protection",
      status: "Current",
      lastUpdated: "Jan 15, 2025",
      compliance: "GDPR, CCPA, PIPEDA",
      template: "Tech Startup"
    },
    {
      name: "Operating Agreement",
      type: "Corporate",
      status: "Draft",
      lastUpdated: "Jan 18, 2025",
      compliance: "Delaware LLC",
      template: "Multi-Member LLC"
    },
    {
      name: "Employment Agreement",
      type: "HR Document",
      status: "Template",
      lastUpdated: "Jan 10, 2025",
      compliance: "At-Will Employment",
      template: "Tech Employee"
    },
    {
      name: "NDA Template",
      type: "Confidentiality",
      status: "Current",
      lastUpdated: "Jan 12, 2025",
      compliance: "Mutual NDA",
      template: "Standard Business"
    }
  ];

  const complianceChecklist = [
    {
      category: "Data Protection",
      items: [
        { task: "Privacy Policy Updated", status: "complete" },
        { task: "Cookie Consent Implemented", status: "complete" },
        { task: "Data Processing Agreement", status: "in-progress" },
        { task: "GDPR Compliance Audit", status: "pending" }
      ]
    },
    {
      category: "Employment Law",
      items: [
        { task: "Employee Handbook", status: "complete" },
        { task: "Anti-Discrimination Policy", status: "complete" },
        { task: "Remote Work Policy", status: "in-progress" },
        { task: "Equity Plan Documentation", status: "pending" }
      ]
    },
    {
      category: "Intellectual Property",
      items: [
        { task: "Trademark Applications", status: "in-progress" },
        { task: "Copyright Registrations", status: "pending" },
        { task: "IP Assignment Agreements", status: "complete" },
        { task: "Patent Prior Art Search", status: "pending" }
      ]
    }
  ];

  const legalAlerts = [
    {
      type: "urgent",
      title: "Annual Report Due",
      description: "Delaware annual report filing due in 15 days",
      dueDate: "Feb 1, 2025",
      action: "File Report"
    },
    {
      type: "warning",
      title: "Policy Update Required",
      description: "New CCPA regulations require privacy policy updates",
      dueDate: "Feb 15, 2025",
      action: "Update Policy"
    },
    {
      type: "info",
      title: "Contract Renewal",
      description: "Office lease agreement expires in 60 days",
      dueDate: "Mar 15, 2025",
      action: "Review Terms"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Current": case "complete": return "bg-green-100 text-green-800";
      case "Draft": case "in-progress": return "bg-blue-100 text-blue-800";
      case "Template": case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "urgent": return "bg-red-50 border-red-200 text-red-800";
      case "warning": return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info": return "bg-blue-50 border-blue-200 text-blue-800";
      default: return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "urgent": return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "info": return <AlertCircle className="w-5 h-5 text-blue-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
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
                <Scale className="w-8 h-8 mr-3 text-blue-600" />
                Legal & Compliance
                <Badge className="ml-3 bg-orange-50 text-orange-600 border-orange-200">
                  Demo
                </Badge>
              </h1>
              <p className="text-gray-600 mt-2">Manage legal documents and stay compliant</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <AlertCircle className="w-4 h-4 mr-2" />
                This is a demo
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Generate Document
              </Button>
            </div>
          </div>
        </div>

        {/* Legal Alerts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Legal Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {legalAlerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm mt-1">{alert.description}</p>
                        <p className="text-xs mt-2">Due: {alert.dueDate}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      {alert.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documents and Compliance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Legal Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Legal Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {legalDocuments.map((doc, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{doc.name}</h4>
                        <p className="text-sm text-gray-600">{doc.type}</p>
                        <p className="text-xs text-gray-500 mt-1">Updated: {doc.lastUpdated}</p>
                      </div>
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Template:</span>
                        <span className="text-gray-900">{doc.template}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Compliance:</span>
                        <span className="text-gray-900">{doc.compliance}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {complianceChecklist.map((category, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-gray-900 mb-3">{category.category}</h4>
                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {item.status === "complete" ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : item.status === "in-progress" ? (
                              <Clock className="w-4 h-4 text-blue-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-yellow-600" />
                            )}
                            <span className="text-sm text-gray-900">{item.task}</span>
                          </div>
                          <Badge className={getStatusColor(item.status)} variant="outline">
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legal Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Gavel className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-medium text-gray-900 mb-2">Legal Consultation</h3>
              <p className="text-sm text-gray-600 mb-4">Connect with experienced startup attorneys</p>
              <Button size="sm" variant="outline" className="w-full">
                Book Consultation
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Lock className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-medium text-gray-900 mb-2">IP Protection</h3>
              <p className="text-sm text-gray-600 mb-4">File trademarks and protect your intellectual property</p>
              <Button size="sm" variant="outline" className="w-full">
                Start Filing
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-medium text-gray-900 mb-2">Contract Review</h3>
              <p className="text-sm text-gray-600 mb-4">Professional review of agreements and contracts</p>
              <Button size="sm" variant="outline" className="w-full">
                Upload Contract
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
                  This legal management system shows sample documents and compliance tracking. In the full version, 
                  you'll get AI-powered document generation, automated compliance monitoring, attorney network access, 
                  e-signature integration, and regulatory update notifications.
                </p>
                <div className="flex space-x-3 mt-3">
                  <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    View Document Templates
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