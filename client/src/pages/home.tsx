import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Sparkles, 
  Play, 
  ChartLine, 
  Presentation, 
  Calculator,
  Brain,
  Target,
  Zap,
  Users,
  CheckCircle,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  Building,
  Shield,
  ArrowRight,
  Star
} from "lucide-react";
import IdeaForm from "@/components/idea-form";
import AnimatedDemo from "@/components/animated-demo";
import HeroStats from "@/components/hero-stats";
import SuccessShowcase from "@/components/success-showcase";

export default function Home() {
  const [showIdeaForm, setShowIdeaForm] = useState(false);

  const mainFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Business Plans",
      description: "Generate comprehensive business plans in minutes using Y Combinator methodology and proven startup frameworks.",
      gradient: "from-blue-600 to-purple-600"
    },
    {
      icon: Target,
      title: "Investor-Ready Pitch Decks",
      description: "Create compelling pitch presentations that tell your story and secure funding from VCs and angel investors.",
      gradient: "from-emerald-600 to-teal-600"
    },
    {
      icon: Zap,
      title: "Complete Startup Toolkit",
      description: "End-to-end platform with financial modeling, market analysis, MVP building, and investor matching.",
      gradient: "from-orange-600 to-red-600"
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Save 200+ Hours",
      description: "Skip months of research and planning",
      metric: "95% faster"
    },
    {
      icon: DollarSign,
      title: "Increase Funding Success",
      description: "Professional materials that investors expect",
      metric: "3x higher"
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "AI trained on successful startup patterns",
      metric: "Y Combinator"
    },
    {
      icon: Shield,
      title: "Reduce Risk",
      description: "Validate ideas before heavy investment",
      metric: "80% accuracy"
    }
  ];

  const socialProof = [
    { metric: "10,000+", label: "Startups Created" },
    { metric: "$500M+", label: "Funding Raised" },
    { metric: "95%", label: "Success Rate" },
    { metric: "4.9/5", label: "User Rating" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Founder, TechFlow",
      company: "Raised $2M Series A",
      quote: "MyStartup.ai helped us create a professional business plan that impressed every investor we pitched to."
    },
    {
      name: "Marcus Rodriguez",
      role: "CEO, GreenTech Solutions", 
      company: "Y Combinator Alumni",
      quote: "The AI-generated financial models were spot-on and saved us months of work. Highly recommend for any serious founder."
    },
    {
      name: "Emily Watson",
      role: "Co-founder, HealthAI",
      company: "Acquired by Microsoft",
      quote: "From idea to exit, MyStartup.ai was our secret weapon. The strategic insights were game-changing."
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Submit Your Idea",
      description: "Describe your startup concept and target market through our guided form"
    },
    {
      number: 2,
      title: "AI Analysis",
      description: "Our AI evaluates your idea using proven frameworks from top accelerators"
    },
    {
      number: 3,
      title: "Generate Assets",
      description: "Create business plans, pitch decks, financial models, and marketing materials"
    },
    {
      number: 4,
      title: "Connect & Fund",
      description: "Match with investors, apply for grants, and access our founder community"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200">
              <Sparkles className="w-4 h-4 mr-1" />
              AI-Powered Startup Platform
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6">
              Turn Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Startup Idea{" "}
              </span>
              Into Reality
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto">
              The complete AI-powered platform for entrepreneurs. Generate business plans, 
              pitch decks, financial models, and connect with investors in minutes, not months.
            </p>

            {/* Social Proof Numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-2xl mx-auto">
              {socialProof.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-slate-900">{item.metric}</div>
                  <div className="text-sm text-slate-600">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
                onClick={() => setShowIdeaForm(true)}
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Building Your Startup
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 border-2"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Launch Successfully
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI-powered platform combines the best startup methodologies with cutting-edge 
              technology to give you everything successful entrepreneurs need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-shadow">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                  <CardHeader className="relative">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose MyStartup.ai?
            </h2>
            <p className="text-xl text-slate-600">
              Join thousands of successful entrepreneurs who've accelerated their startup journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-2">{benefit.metric}</div>
                    <h3 className="font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                    <p className="text-slate-600 text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              From Idea to Funded Startup in 4 Steps
            </h2>
            <p className="text-xl text-slate-600">
              Our proven process has helped thousands of entrepreneurs turn ideas into successful businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-slate-300 mx-auto mt-4 hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Trusted by Successful Founders
            </h2>
            <p className="text-xl text-slate-600">
              See what entrepreneurs are saying about MyStartup.ai
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {testimonial.company}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Startup Idea?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of entrepreneurs who've already accelerated their journey with AI-powered tools
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6"
              onClick={() => setShowIdeaForm(true)}
            >
              <Rocket className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
            
            <Link href="/complete-platform">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Building className="w-5 h-5 mr-2" />
                Explore Platform
              </Button>
            </Link>
          </div>

          <p className="text-blue-100 text-sm mt-4">
            No credit card required • Get started in under 2 minutes
          </p>
        </div>
      </section>

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

      {/* Additional Components */}
      <HeroStats />
      <SuccessShowcase />
    </div>
  );
}