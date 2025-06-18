import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Sparkles, 
  Play, 
  Brain,
  Target,
  Zap,
  ArrowRight,
  Star,
  CheckCircle
} from "lucide-react";
import IdeaForm from "@/components/idea-form";
import InteractivePreview from "@/components/interactive-preview";

export default function Home() {
  const [showIdeaForm, setShowIdeaForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "AI Business Plans",
      description: "Generate comprehensive business plans in minutes using proven frameworks"
    },
    {
      icon: Target,
      title: "Investor Pitch Decks",
      description: "Create compelling presentations that secure funding from VCs and angels"
    },
    {
      icon: Zap,
      title: "Complete Toolkit",
      description: "Everything you need from idea validation to investor matching"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Startups Created" },
    { number: "$500M+", label: "Funding Raised" },
    { number: "95%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">MyStartup.ai</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Features</Button>
              <Button variant="ghost">Pricing</Button>
              <Button variant="outline">Sign In</Button>
              <Button onClick={() => setShowIdeaForm(true)}>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-8 bg-blue-50 text-blue-700 border-blue-200">
              <Sparkles className="w-4 h-4 mr-1" />
              AI-Powered Startup Platform
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Turn Your Ideas Into
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Funded Startups
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The complete AI platform for entrepreneurs. Generate business plans, pitch decks, 
              and financial models. Connect with investors and turn your startup dream into reality.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4"
                onClick={() => setShowIdeaForm(true)}
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Building Now
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 border-2"
                onClick={() => setShowPreview(true)}
              >
                <Play className="w-5 h-5 mr-2" />
                See AI in Action
              </Button>
            </div>

            {/* Social Proof */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Launch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI platform combines the best startup methodologies with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 bg-white">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              From Idea to Funded in 3 Steps
            </h2>
            <p className="text-xl text-gray-600">
              Our proven process has helped thousands of entrepreneurs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { number: "01", title: "Submit Your Idea", description: "Tell us about your startup vision and target market" },
              { number: "02", title: "AI Analysis", description: "Get comprehensive analysis and professional business assets" },
              { number: "03", title: "Connect & Fund", description: "Match with investors and secure funding for your startup" }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-xl font-bold text-white">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your Startup?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of entrepreneurs who've turned their ideas into successful businesses
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4"
              onClick={() => setShowIdeaForm(true)}
            >
              <Rocket className="w-5 h-5 mr-2" />
              Start Free Today
            </Button>
            
            <Link href="/complete-platform">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600"
              >
                Explore Platform
              </Button>
            </Link>
          </div>

          <p className="text-blue-100 text-sm mt-6">
            No credit card required • Get started in under 2 minutes
          </p>
        </div>
      </section>

      {/* Interactive Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-w-5xl w-full max-h-[90vh] overflow-auto">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-gray-600"
              onClick={() => setShowPreview(false)}
            >
              ×
            </Button>
            <InteractivePreview />
          </div>
        </div>
      )}

      {/* Idea Form Modal */}
      {showIdeaForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-auto">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white"
              onClick={() => setShowIdeaForm(false)}
            >
              ×
            </Button>
            <IdeaForm />
          </div>
        </div>
      )}
    </div>
  );
}