import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Target, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Lightbulb,
  FileText,
  BarChart3
} from "lucide-react";
import AdvancedIdeaForm from "@/components/advanced-idea-form";

export default function SubmitIdea() {
  const [showForm, setShowForm] = useState(false);

  const benefits = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Get comprehensive startup idea validation using GPT-4 technology and proven frameworks"
    },
    {
      icon: Target,
      title: "Market Assessment",
      description: "Understand your market potential, competition landscape, and customer demand"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Receive detailed analysis results in minutes, not weeks of manual research"
    },
    {
      icon: BarChart3,
      title: "Feasibility Scoring",
      description: "Get technical, financial, and market feasibility scores with actionable insights"
    },
    {
      icon: FileText,
      title: "Strategic Roadmap",
      description: "Receive personalized recommendations and next steps for your startup journey"
    },
    {
      icon: CheckCircle,
      title: "SWOT Analysis",
      description: "Comprehensive strengths, weaknesses, opportunities, and threats evaluation"
    }
  ];

  const analysisSteps = [
    {
      step: 1,
      title: "Idea Submission",
      description: "Share your startup concept with detailed problem and solution information"
    },
    {
      step: 2,
      title: "AI Processing",
      description: "Our AI analyzes market potential, feasibility, and competitive landscape"
    },
    {
      step: 3,
      title: "Comprehensive Report",
      description: "Receive detailed validation scores, insights, and strategic recommendations"
    },
    {
      step: 4,
      title: "Development Plan",
      description: "Get guided next steps to transform your idea into a viable business"
    }
  ];

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdvancedIdeaForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-white/20 text-white border-white/30 mb-6" variant="outline">
            AI-Powered Startup Validation
          </Badge>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Your Startup Idea Hub
          </h1>
          
          <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
            Focus on one idea at a time. Get AI-powered analysis, market insights, and strategic recommendations 
            to turn your concept into a successful business
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowForm(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transform transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              Update Your Idea
            </button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">AI-Powered</div>
              <div className="text-blue-100">Advanced Analysis</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">4-Step</div>
              <div className="text-blue-100">Validation Process</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">Instant</div>
              <div className="text-blue-100">Results & Insights</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Why Use Our AI Validation Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Make informed decisions about your startup with comprehensive AI analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process gets you from idea to insights in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {analysisSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  {index < analysisSteps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-6 -right-12 w-8 h-8 text-gray-300" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Validate Your Startup Idea?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join entrepreneurs who have successfully validated and launched their startups with our AI platform
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transform transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Start Your Analysis Now
          </button>
        </div>
      </section>
    </div>
  );
}